'use strict';

/* ══════════════════════════════════════
   DATA
══════════════════════════════════════ */
const BEACHES = [
  { id:'eilat',    name:'אילת',   region:'ים סוף',     lat:29.5581, lon:34.9482, mark:'ELT', offDir:270, photo:'https://upload.wikimedia.org/wikipedia/commons/c/ce/North_Beach_Eilat.jpg' },
  { id:'caesarea', name:'קיסריה', region:'חוף הכרמל',  lat:32.5000, lon:34.8917, mark:'CSR', offDir:90,  photo:'https://upload.wikimedia.org/wikipedia/commons/5/5e/The_high_level_aqueduct_of_Caesarea_built_by_Herod_%2837BC_to_4BC%29%2C_Caesarea_Maritima%2C_Israel_%2815588710799%29.jpg' },
  { id:'netanya',  name:'נתניה',  region:'השרון',       lat:32.3215, lon:34.8532, mark:'NTY', offDir:90,  photo:'https://upload.wikimedia.org/wikipedia/commons/2/2b/PikiWiki_Israel_17539_Netanya_sironit_beach.JPG' },
  { id:'haifa',    name:'חיפה',   region:'מפרץ חיפה',   lat:32.8056, lon:34.9658, mark:'HFA', offDir:90,  photo:'https://upload.wikimedia.org/wikipedia/commons/1/1d/South_Dado_Beach_-_Hof_HaCarmel_-_Haifa_%281506044661%29.jpg' },
  { id:'ashdod',   name:'אשדוד',  region:'חוף השפלה',  lat:31.8044, lon:34.6553, mark:'ASH', offDir:90,  photo:'https://upload.wikimedia.org/wikipedia/commons/1/14/Ashdod_Beach.jpg' },
  { id:'ashkelon', name:'אשקלון', region:'חוף השפלה',  lat:31.6688, lon:34.5571, mark:'AKL', offDir:90,  photo:'https://upload.wikimedia.org/wikipedia/commons/f/f5/PikiWiki_Israel_53637_the_beach_promenade_in_ashkelon.jpg' },
  { id:'nahariya', name:'נהריה',  region:'חוף הצפון',  lat:33.0067, lon:35.0975, mark:'NHR', offDir:90,  photo:'https://upload.wikimedia.org/wikipedia/commons/b/ba/Beach_-_Nahariya_Israel_%281370405741%29.jpg' },
];
const VALID_IDS = BEACHES.map(b => b.id);
const DAYS = ['יום א','יום ב','יום ג','יום ד','יום ה','יום ו','שבת'];

/* ══════════════════════════════════════
   STATE
══════════════════════════════════════ */
const DEFAULTS = { spotId:'netanya', savedIds:['netanya'], metric:true, alertsOn:false, alertH:0.8, alertStart:'06:00', alertEnd:'20:00', alertSpot:'netanya', lastAlertKey:'' };

function loadSettings() {
  try {
    const raw = JSON.parse(localStorage.getItem('ww4') || '{}');
    if (raw.spotId && !VALID_IDS.includes(raw.spotId)) return { ...DEFAULTS };
    if (raw.savedIds) raw.savedIds = raw.savedIds.filter(id => VALID_IDS.includes(id));
    if (raw.alertSpot && !VALID_IDS.includes(raw.alertSpot)) raw.alertSpot = DEFAULTS.alertSpot;
    return { ...DEFAULTS, ...raw };
  } catch { return { ...DEFAULTS }; }
}

const S = { cfg: loadSettings(), cache: {}, chartInst: null, currentTab: 'home' };

function save() { localStorage.setItem('ww4', JSON.stringify(S.cfg)); }
function cfg(k, v) { S.cfg[k] = v; save(); }
function beach(id) { return BEACHES.find(b => b.id === id) || BEACHES[0]; }

/* ══════════════════════════════════════
   UTILS
══════════════════════════════════════ */
const clamp = (v,a,b) => Math.max(a, Math.min(b, v));
const fmtH = m => S.cfg.metric ? `${m.toFixed(1)}מ׳` : `${(m*3.281).toFixed(1)}ft`;
const fmtHN = m => S.cfg.metric ? m.toFixed(1) : (m*3.281).toFixed(1);
const fmtU = () => S.cfg.metric ? 'מ׳' : 'ft';

function d2c(deg) {
  return ['צ','צ-מ','מ','ד-מ','ד','ד-מ','מ','צ-מ'][Math.round(((deg%360)+360)%360/45)%8];
}
function wClass(deg, offDir) {
  const d = ((deg%360)+360)%360, o = ((offDir%360)+360)%360;
  const diff = Math.min(Math.abs(d-o), 360-Math.abs(d-o));
  return diff <= 45 ? 'offshore' : diff >= 135 ? 'onshore' : 'cross';
}
const WL = { offshore:{t:'אופשור ✓',c:'#06d6a0'}, onshore:{t:'אונשור',c:'#ef476f'}, cross:{t:'רוח צד',c:'#ffb703'} };

function score(wh, wp, ws, wd, offDir) {
  let s = wh<0.2?0.5:wh<0.4?1.6:wh<0.8?3.2:wh<1.5?4:wh<2.5?3:1.5;
  s += wp<5?0.5:wp<7?1.6:wp<9?2.5:3;
  const c = wClass(wd, offDir);
  s += c==='offshore' ? (ws<15?3:ws<25?2:1) : c==='cross' ? (ws<15?2:1) : (ws<10?1.5:ws<20?0.8:0.2);
  return Math.round(clamp(s,0,10)*10)/10;
}
function scoreColor(s) { return s>=7.5?'#06d6a0':s>=5.5?'#00b4d8':s>=3.5?'#ffd166':'#ef476f'; }
function scoreLbl(s) { return s>=7.5?'מצוין':s>=5.5?'טוב':s>=3.5?'בינוני':'שטוח'; }

function ring(sc, sz, sw, col) {
  sz=sz||54; sw=sw||5; col=col||scoreColor(sc);
  const r=(sz-sw)/2, c=2*Math.PI*r, p=clamp(sc/10,0,1);
  return `<svg viewBox="0 0 ${sz} ${sz}">
    <circle cx="${sz/2}" cy="${sz/2}" r="${r}" fill="none" stroke="rgba(255,255,255,.2)" stroke-width="${sw}"/>
    <circle cx="${sz/2}" cy="${sz/2}" r="${r}" fill="none" stroke="${col}" stroke-width="${sw}"
      stroke-dasharray="${c}" stroke-dashoffset="${c*(1-p)}" stroke-linecap="round"
      transform="rotate(-90 ${sz/2} ${sz/2})"/>
  </svg>`;
}

function tide(seed) {
  const ph = ((Date.now()/3600000+seed) % 12.42) / 12.42 * Math.PI*2;
  const rising = Math.cos(ph)>0;
  const mins = Math.abs(Math.round((((rising?Math.PI/2-ph:3*Math.PI/2-ph)+Math.PI*2)%(Math.PI*2))/(Math.PI*2)*12.42*60));
  return { rising, h:Math.floor(mins/60), m:mins%60 };
}

function dayLabel(isoDate) {
  const dt = new Date(isoDate+'T12:00:00');
  const t = new Date(), m = new Date(); m.setDate(t.getDate()+1);
  if (dt.toDateString()===t.toDateString()) return 'היום';
  if (dt.toDateString()===m.toDateString()) return 'מחר';
  return DAYS[dt.getDay()];
}

function heightLabel(mh) {
  // Open-Meteo = offshore significant wave height, ~1.5-2x actual beach face.
  // Thresholds calibrated to Israeli beach conditions.
  const cm = mh * 100;
  if (cm < 12)  return 'ים שקט';
  if (cm < 50)  return 'קרסול';   // ankle: up to 50cm
  if (cm < 105) return 'ברך';     // knee:  50-105cm  (100cm → ברך ✓)
  if (cm < 155) return 'מותניים'; // waist: 105-155cm
  if (cm < 205) return 'חזה';     // chest: 155-205cm
  if (cm < 260) return 'כתף';     // shoulder: 205-260cm
  if (cm < 330) return 'ראש';     // head: 260-330cm
  return 'מעל הראש';
}

function windBgCol(ws) {
  return ws < 10 ? '#1a9e5c' : ws < 20 ? '#e67e22' : ws < 30 ? '#d35400' : '#c0392b';
}

function windArrowSvg(deg, col) {
  const rot = (deg + 180) % 360;
  return `<svg class="w-arrow" viewBox="0 0 20 20" style="transform:rotate(${rot}deg)"><polygon points="10,1 14.5,15 10,12.5 5.5,15" fill="${col||'currentColor'}"/></svg>`;
}

function surfLabel(mh) {
  const cm = mh * 100;
  if (cm < 80)  return { lvl:0, emoji:'🚫', title:'לא מתאים לגלישה',    desc:'הגלים נמוכים מדי לגלישה. יום טוב לרחצה ולינק בחוף.',                       color:'#6b7c93' };
  if (cm < 120) return { lvl:1, emoji:'🏄', title:'מתאים לסאפ ומתחילים', desc:'גלים קטנים וידידותיים. מושלם לסאפ, גלשן גדול ולמי שמתחיל ללמוד לגלוש.', color:'#ffd166' };
  if (cm < 200) return { lvl:2, emoji:'🏄‍♂️', title:'שווה לכולם',       desc:'תנאים טובים לכל הרמות. גלים מאורגנים ונאים — הגיע הזמן לכנס למים!',     color:'#00b4d8' };
  return               { lvl:3, emoji:'🔥', title:'מנוסים בלבד',         desc:'גלים גבוהים ועוצמתיים. מומלץ לגולשים מנוסים בלבד. יש לנקוט זהירות.',    color:'#06d6a0' };
}

function cmRange(minh, mh) {
  if (!S.cfg.metric) {
    const lo = Math.round(minh * 3.281 * 10) / 10;
    const hi = Math.round(mh * 3.281 * 10) / 10;
    return lo === hi || lo < 0.1 ? `${hi} ft` : `${lo}–${hi} ft`;
  }
  const r5 = v => Math.max(0, Math.round(v * 100 / 5) * 5);
  const lo = r5(minh), hi = r5(mh);
  return lo === hi || lo === 0 ? `${hi} ס"מ` : `${lo}–${hi} ס"מ`;
}

/* ══════════════════════════════════════
   API
══════════════════════════════════════ */
async function fetchBeach(b) {
  const key = `${b.lat},${b.lon}`;
  if (S.cache[key] && Date.now()-S.cache[key].t < 600000) return S.cache[key].d;

  const [mr, fr] = await Promise.all([
    fetch(`https://marine-api.open-meteo.com/v1/marine?latitude=${b.lat}&longitude=${b.lon}&hourly=wave_height,wave_period,wave_direction&timezone=auto&forecast_days=7`),
    fetch(`https://api.open-meteo.com/v1/forecast?latitude=${b.lat}&longitude=${b.lon}&hourly=wind_speed_10m,wind_direction_10m,temperature_2m&current=temperature_2m,wind_speed_10m,wind_direction_10m&timezone=auto&forecast_days=7`)
  ]);
  const [m, f] = await Promise.all([mr.json(), fr.json()]);

  const times = m.hourly.time;
  const now = new Date();
  let ni = 0;
  for (let i=0; i<times.length; i++) { if (new Date(times[i])<=now) ni=i; }

  const h24 = [];
  for (let i=ni; i<Math.min(ni+24,times.length); i++) {
    h24.push({ time:times[i], wh:m.hourly.wave_height[i]??0, wp:m.hourly.wave_period[i]??0, wd:m.hourly.wave_direction[i]??0, ws:f.hourly.wind_speed_10m[i]??0, wd2:f.hourly.wind_direction_10m[i]??0 });
  }

  // group by day
  const dm = new Map();
  for (let i=0; i<times.length; i++) {
    const dk = times[i].slice(0,10);
    if (!dm.has(dk)) dm.set(dk,[]);
    dm.get(dk).push(i);
  }
  const d7 = [...dm.entries()].slice(0,7).map(([dk,ix]) => {
    let mh=0, minh=Infinity, mp=0, mw=0, mwd=0, avgWd=0, wdCount=0;
    ix.forEach(i => {
      const wh=m.hourly.wave_height[i]??0, ws=f.hourly.wind_speed_10m[i]??0;
      if(wh>0 && wh<minh) minh=wh;
      if(wh>mh){mh=wh;mp=m.hourly.wave_period[i]??0;}
      if(ws>mw){mw=ws;mwd=f.hourly.wind_direction_10m[i]??0;}
    });
    if(minh===Infinity) minh=0;
    return { date:dk, mh, minh, mp, mw, mwd, sc:score(mh,mp,mw,mwd,b.offDir) };
  });

  const cur = {
    wh:m.hourly.wave_height[ni]??0, wp:m.hourly.wave_period[ni]??0, wd:m.hourly.wave_direction[ni]??0,
    ws:f.current?.wind_speed_10m??f.hourly.wind_speed_10m[ni]??0,
    wd2:f.current?.wind_direction_10m??f.hourly.wind_direction_10m[ni]??0,
    temp:f.current?.temperature_2m??f.hourly.temperature_2m[ni]??0,
  };
  cur.sc = score(cur.wh, cur.wp, cur.ws, cur.wd2, b.offDir);

  const d = { h24, d7, cur };
  S.cache[key] = { t:Date.now(), d };
  return d;
}

/* ══════════════════════════════════════
   HOME TAB
══════════════════════════════════════ */
async function renderHome() {
  const b = beach(S.cfg.spotId);

  // Hero placeholder
  el('hero-img').src = b.photo;
  el('hero-img').onerror = () => { el('hero-img').style.background='linear-gradient(135deg,#0077b6,#00b4d8)'; el('hero-img').src=''; };
  el('hero-name').textContent = `${b.name} · ${b.region}`;
  el('hero-desc').textContent = 'טוען תחזית...';
  el('hero-ring').innerHTML = ring(0,78,7,'rgba(255,255,255,.3)') + `<div class="ring-num large">—</div>`;
  el('now-h').textContent = '—';
  el('now-w').textContent = '—';
  el('now-c').textContent = '—';
  el('now-t').textContent = '—';
  el('fc-name').textContent = b.name;

  // Beach mini-list (shows immediately with skeletons then fills in)
  renderHomeBeachList();

  try {
    const data = await fetchBeach(b);
    updateHomeHero(b, data);
    updateNow(b, data.cur);
    renderFcTable(b, data.d7);
  } catch(e) {
    console.error(e);
    el('hero-desc').textContent = 'שגיאה בטעינת תחזית — בדוק חיבור לאינטרנט';
  }
}

function updateHomeHero(b, data) {
  const cur = data.cur, sc = cur.sc, col = scoreColor(sc);
  el('hero-desc').textContent = `${scoreLbl(sc)} לגלישה · ${fmtH(cur.wh)} · ${Math.round(cur.ws)} קמ"ש · ${cur.temp.toFixed(0)}°C`;
  el('hero-ring').innerHTML = ring(sc,78,7,col) + `<div class="ring-num large" style="color:${col};">${sc.toFixed(1)}</div>`;
  const heroBtn = el('hero-open-btn');
  if (heroBtn) heroBtn.dataset.id = b.id;
}

function updateNow(b, cur) {
  const cls = wClass(cur.wd2, b.offDir), wl = WL[cls];
  let nowVal, nowUnit;
  if (S.cfg.metric) {
    nowVal = Math.max(0, Math.round(cur.wh * 100 / 5) * 5);
    nowUnit = 'ס"מ';
  } else {
    nowVal = (cur.wh * 3.281).toFixed(1);
    nowUnit = 'ft';
  }
  el('now-h').innerHTML = `<span class="now-cm">${nowVal}</span><span class="now-unit">${nowUnit}</span>`;
  el('now-w').innerHTML = windArrowSvg(cur.wd2) + `<span>${Math.round(cur.ws)} קמ"ש</span>`;
  el('now-c').innerHTML = `<span class="now-cond-badge" style="background:${wl.c}20;color:${wl.c};">${heightLabel(cur.wh)}</span>`;
  el('now-t').textContent = new Intl.DateTimeFormat('he-IL',{hour:'2-digit',minute:'2-digit'}).format(new Date());
}

function renderFcTable(b, d7) {
  el('fc-list').innerHTML = d7.map((d) => {
    const sc=d.sc, col=scoreColor(sc), surf=surfLabel(d.mh);
    const rowBg = sc>=7?'#e8f9f2':sc>=5.5?'#fffbf0':sc<3?'#fdf2f2':'';
    const rowBdr = sc>=7?'#06d6a0':sc>=5.5?'#ffd166':sc<3?'#ef476f':'#dee8ef';
    return `<div class="fc-row" style="background:${rowBg};border-right:4px solid ${rowBdr};cursor:pointer;"
      data-action="forecastPopup" data-beach="${b.id}" data-date="${d.date}" data-mh="${d.mh}" data-minh="${d.minh}" data-sc="${sc}">
      <div class="fc-day">
        <span class="fc-day-name">${dayLabel(d.date)}</span>
        <span class="fc-period">${d.mp.toFixed(0)}שנ׳</span>
      </div>
      <div class="fc-height">
        <span class="fc-cm">${cmRange(d.minh, d.mh)}</span>
        <span class="fc-lbl">${heightLabel(d.mh)}</span>
      </div>
      <div class="fc-wind" style="background:${windBgCol(d.mw)};">
        ${windArrowSvg(d.mwd)}
        <span>${Math.round(d.mw)}</span>
        <small>קמ"ש</small>
      </div>
      <div class="fc-score-col">
        <span class="score-chip" style="background:${col}22;color:${col};font-size:14px;padding:4px 10px;">${sc.toFixed(1)}</span>
        <span class="fc-surf-emoji" title="${surf.title}">${surf.emoji}</span>
      </div>
    </div>`;
  }).join('');
}

function renderHomeBeachList() {
  const list = el('home-beach-list');
  list.innerHTML = BEACHES.map(b => `
    <div class="bl-item" data-action="open" data-id="${b.id}">
      <div class="bl-thumb"><img src="${b.photo}" alt="${b.name}" loading="lazy" onerror="this.style.display='none'"></div>
      <div class="bl-info">
        <div class="bl-name">${b.name}</div>
        <div class="bl-region">${b.region}</div>
        <div id="bl-stat-${b.id}" class="bl-stats">טוען...</div>
      </div>
      <div class="bl-right">
        <div id="bl-ring-${b.id}" class="ring-wrap" style="width:40px;height:40px;"></div>
        <div id="bl-cond-${b.id}" class="bl-cond"></div>
      </div>
    </div>`).join('');

  // load each beach async
  BEACHES.forEach(async b => {
    try {
      const data = await fetchBeach(b);
      const cur = data.cur, sc = cur.sc, col = scoreColor(sc);
      const sr = el(`bl-stat-${b.id}`), rg = el(`bl-ring-${b.id}`), cd = el(`bl-cond-${b.id}`);
      if (sr) sr.textContent = `🌊 ${fmtHN(cur.wh)}${fmtU()} · 💨 ${Math.round(cur.ws)}קמ"ש`;
      if (rg) rg.innerHTML = ring(sc,40,4,col) + `<div class="ring-num" style="font-size:12px;color:${col};">${sc.toFixed(1)}</div>`;
      if (cd) { cd.textContent = scoreLbl(sc); cd.style.color = col; cd.style.fontWeight = '800'; cd.style.fontSize = '11px'; }
    } catch {}
  });
}

/* ══════════════════════════════════════
   BEACHES TAB
══════════════════════════════════════ */
async function renderBeaches(query='') {
  const grid = el('beach-grid');
  const norm = query.trim();
  const list = BEACHES.filter(b => !norm || b.name.includes(norm) || b.region.includes(norm));
  if (!list.length) { grid.innerHTML = `<div class="empty-state" style="grid-column:1/-1"><p>לא נמצא חוף.</p></div>`; return; }

  grid.innerHTML = list.map(b => {
    const saved = S.cfg.savedIds.includes(b.id);
    return `<div class="bc" data-action="open" data-id="${b.id}">
      <img class="bc-img" src="${b.photo}" alt="${b.name}" loading="lazy" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
      <div class="bc-ph" style="display:none;">🏖️</div>
      <div class="bc-ov"></div>
      <div class="bc-body">
        <div class="bc-top">
          <button class="bc-save-btn" data-action="toggleSave" data-id="${b.id}" title="${saved?'הסר':'שמור'}">${saved?'⭐':'☆'}</button>
        </div>
        <div class="bc-bottom">
          <div>
            <div class="bc-name">${b.name}</div>
            <div class="bc-region">${b.region}</div>
            <div id="bc-mini-${b.id}" class="bc-mini">טוען...</div>
          </div>
          <div id="bc-ring-${b.id}" class="ring-wrap" style="width:40px;height:40px;"></div>
        </div>
      </div>
    </div>`;
  }).join('');

  list.forEach(async b => {
    try {
      const data = await fetchBeach(b);
      const sc = data.cur.sc, col = scoreColor(sc);
      const mn = el(`bc-mini-${b.id}`), rg = el(`bc-ring-${b.id}`);
      if (mn) mn.textContent = `🌊 ${fmtHN(data.cur.wh)}${fmtU()} · 💨 ${Math.round(data.cur.ws)}קמ"ש`;
      if (rg) rg.innerHTML = ring(sc,40,4,col) + `<div class="ring-num" style="font-size:12px;color:${col};">${sc.toFixed(1)}</div>`;
    } catch {}
  });
}

/* ══════════════════════════════════════
   SAVED TAB
══════════════════════════════════════ */
async function renderSaved() {
  const list = el('saved-list');
  const saved = BEACHES.filter(b => S.cfg.savedIds.includes(b.id));
  if (!saved.length) {
    list.innerHTML = `<div class="empty-state"><div class="es-icon">⭐</div><p>עוד לא שמרת חופים.<br>לחץ על ☆ בכרטיס חוף כדי לשמור.</p></div>`;
    return;
  }
  list.innerHTML = saved.map(b => `
    <div class="saved-item" data-action="open" data-id="${b.id}">
      <div class="saved-thumb"><img src="${b.photo}" alt="${b.name}" loading="lazy" onerror="this.style.display='none'"></div>
      <div class="saved-info">
        <div class="saved-name">${b.name}</div>
        <div class="saved-region">${b.region}</div>
        <div id="sv-stat-${b.id}" class="saved-stats">טוען...</div>
      </div>
      <button class="saved-remove" data-action="toggleSave" data-id="${b.id}" title="הסר">✕</button>
    </div>`).join('');

  saved.forEach(async b => {
    try {
      const data = await fetchBeach(b);
      const sc = data.cur.sc, col = scoreColor(sc);
      const st = el(`sv-stat-${b.id}`);
      if (st) st.innerHTML = `<span style="color:${col};font-weight:800;">${scoreLbl(sc)}</span> · 🌊 ${fmtHN(data.cur.wh)}${fmtU()} · 💨 ${Math.round(data.cur.ws)}קמ"ש`;
    } catch {}
  });
}

/* ══════════════════════════════════════
   PROFILE TAB
══════════════════════════════════════ */
function renderProfile() {
  renderAccountCard();
  // Spot chips
  el('spot-list').innerHTML = BEACHES.map(b =>
    `<button class="spot-chip ${b.id===S.cfg.spotId?'active':''}" data-action="selectSpot" data-id="${b.id}">${b.name}</button>`
  ).join('');

  // Alert spot select
  el('alert-spot').innerHTML = BEACHES.map(b =>
    `<option value="${b.id}" ${b.id===S.cfg.alertSpot?'selected':''}>${b.name}</option>`
  ).join('');

  el('unit-chk').checked = !S.cfg.metric;
  el('alert-toggle').checked = S.cfg.alertsOn;
  el('alert-height').value = S.cfg.alertH;
  el('alert-start').value = S.cfg.alertStart;
  el('alert-end').value = S.cfg.alertEnd;
}

/* ══════════════════════════════════════
   DETAIL OVERLAY
══════════════════════════════════════ */
async function openBeach(id) {
  const b = beach(id);
  S.activeId = id;
  S.chartMode = 'waves';

  const det = el('detail');
  el('detail-inner').innerHTML = `<div class="loading"><div class="spinner"></div><p>טוען תחזית...</p></div>`;
  det.classList.remove('hidden');
  det.classList.add('open');
  det.setAttribute('aria-hidden','false');
  document.body.style.overflow = 'hidden';

  try {
    const data = await fetchBeach(b);
    renderDetail(b, data);
  } catch(e) {
    console.error(e);
    el('detail-inner').innerHTML = `<div class="loading"><p>שגיאה בטעינת נתונים 😕</p><button class="primary-btn" data-action="closeDetail" style="max-width:200px;margin-top:12px;">חזרה</button></div>`;
  }
}

function closeDetail() {
  const det = el('detail');
  det.classList.remove('open');
  det.classList.add('hidden');
  det.setAttribute('aria-hidden','true');
  document.body.style.overflow = '';
  if (S.chartInst) { S.chartInst.destroy(); S.chartInst = null; }
}

function renderDetail(b, data) {
  const cur = data.cur, sc = cur.sc, col = scoreColor(sc);
  const cls = wClass(cur.wd2, b.offDir), wl = WL[cls];
  const td = tide(b.id.length + b.lat);
  const saved = S.cfg.savedIds.includes(b.id);

  el('detail-inner').innerHTML = `
    <div class="d-hero">
      <img src="${b.photo}" alt="${b.name}" onerror="this.style.background='linear-gradient(135deg,#0077b6,#00b4d8)'">
      <div class="d-hero-ov"></div>
      <div class="d-hero-top">
        <button class="d-fab" data-action="closeDetail">←</button>
        <button class="d-fab" id="d-save" data-action="toggleSave" data-id="${b.id}">${saved?'⭐':'☆'}</button>
      </div>
      <div class="d-hero-btm">
        <div>
          <div class="d-title">${b.name}</div>
          <div class="d-sub">${b.region} · ${cur.temp.toFixed(0)}°C · ${d2c(cur.wd)}</div>
        </div>
        <div class="ring-wrap large">${ring(sc,78,7,col)}<div class="ring-num large" style="color:${col};">${sc.toFixed(1)}</div></div>
      </div>
    </div>

    <div class="d-body">
      <div style="margin-bottom:14px;">
        <span style="background:${col}22;color:${col};padding:5px 14px;border-radius:20px;font-size:14px;font-weight:800;">${scoreLbl(sc)} לגלישה</span>
      </div>

      <div class="stat-grid">
        <div class="stat-card">
          <span class="stat-label">🌊 גובה גלים</span>
          <span class="stat-val">${fmtH(cur.wh)}</span>
          <span class="stat-sub">תקופה ${cur.wp.toFixed(1)} שנ׳</span>
        </div>
        <div class="stat-card">
          <span class="stat-label">💨 רוח</span>
          <span class="stat-val">${Math.round(cur.ws)} קמ"ש</span>
          <span class="stat-sub" style="color:${wl.c};font-weight:700;">${wl.t}</span>
        </div>
        <div class="stat-card">
          <span class="stat-label">🧭 כיוון גל</span>
          <span class="stat-val">${d2c(cur.wd)}</span>
          <span class="stat-sub">${Math.round(cur.wd)}°</span>
        </div>
        <div class="stat-card">
          <span class="stat-label">🌙 גאות/שפל</span>
          <span class="stat-val">${td.rising?'עולה ↑':'יורד ↓'}</span>
          <span class="stat-sub">שיא עוד ${td.h}ש ${td.m}ד</span>
        </div>
      </div>

      <div class="chart-box">
        <div class="chart-hd">
          <strong>תחזית 24 שעות</strong>
          <div class="pill-group">
            <button class="pill-btn ${S.chartMode==='waves'?'on':'off'}" data-action="switchChart" data-id="waves">גלים</button>
            <button class="pill-btn ${S.chartMode==='wind'?'on':'off'}" data-action="switchChart" data-id="wind">רוח</button>
          </div>
        </div>
        <canvas id="d-chart" height="140"></canvas>
      </div>

      <div style="font-size:15px;font-weight:800;margin-bottom:10px;">תחזית 7 ימים</div>
      <div class="outlook-box">
        ${data.d7.map(d => {
          const c=scoreColor(d.sc);
          return `<div class="ol-row">
            <span class="ol-day">${dayLabel(d.date)}</span>
            <span class="ol-dot" style="background:${c};"></span>
            <div class="ol-bar"><i style="width:${clamp(d.sc/10,0,1)*100}%;background:${c};"></i></div>
            <span class="ol-ht">${fmtHN(d.mh)}${fmtU()}</span>
            <span class="score-chip" style="background:${c}22;color:${c};">${d.sc.toFixed(1)}</span>
          </div>`;
        }).join('')}
      </div>
    </div>`;

  renderDetailChart(data);
}

function renderDetailChart(data) {
  const ctx = el('d-chart');
  if (!ctx) return;
  if (S.chartInst) S.chartInst.destroy();
  const mode = S.chartMode || 'waves';
  const labels = data.h24.map(h => new Date(h.time).getHours()+':00');
  const vals = data.h24.map(h => mode==='waves' ? h.wh : h.ws);
  const maxV = Math.max(...vals, 0.1);
  const colors = vals.map((v,i) => i===0?'#0a2540':v>=maxV*.8?'#00b4d8':i<6?'#90e0ef':'#caf0f8');
  S.chartInst = new Chart(ctx, {
    type:'bar',
    data:{ labels, datasets:[{data:vals, backgroundColor:colors, borderRadius:5, maxBarThickness:16}] },
    options:{
      responsive:true,
      plugins:{ legend:{display:false}, tooltip:{ callbacks:{ label: c => mode==='waves'?`${c.raw.toFixed(1)}מ׳`:`${c.raw.toFixed(0)}קמ"ש` } } },
      scales:{ x:{ticks:{maxTicksLimit:8,font:{size:10}},grid:{display:false}}, y:{ticks:{font:{size:10}},grid:{color:'#eef3f8'}} }
    }
  });
}

function switchChart(mode) {
  S.chartMode = mode;
  // update pill buttons
  document.querySelectorAll('[data-action="switchChart"]').forEach(btn => {
    btn.classList.toggle('on', btn.dataset.id === mode);
    btn.classList.toggle('off', btn.dataset.id !== mode);
  });
  const b = beach(S.activeId);
  const data = S.cache[`${b.lat},${b.lon}`]?.d;
  if (data) renderDetailChart(data);
}

/* ══════════════════════════════════════
   TABS
══════════════════════════════════════ */
function reRenderActiveTab() {
  const t = S.currentTab;
  if (t==='home') renderHome();
  else if (t==='beaches') renderBeaches();
  else if (t==='saved') renderSaved();
}

function setTab(id) {
  S.currentTab = id;
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.tnb,.bnb').forEach(b => b.classList.remove('active'));
  el(`tab-${id}`)?.classList.add('active');
  document.querySelectorAll(`[data-action="tab"][data-id="${id}"]`).forEach(b => b.classList.add('active'));
  if (id==='beaches') renderBeaches();
  if (id==='saved') renderSaved();
  if (id==='profile') renderProfile();
}

function reRenderActiveTab() {
  const t = S.currentTab;
  if (t==='home') renderHome();
  else if (t==='beaches') renderBeaches();
  else if (t==='saved') renderSaved();
}

/* ══════════════════════════════════════
   SAVE / SELECT
══════════════════════════════════════ */
function toggleSave(id) {
  const ids = new Set(S.cfg.savedIds);
  ids.has(id) ? ids.delete(id) : ids.add(id);
  cfg('savedIds', [...ids]);

  // update all save buttons for this id
  document.querySelectorAll(`[data-action="toggleSave"][data-id="${id}"]`).forEach(btn => {
    btn.textContent = ids.has(id) ? '⭐' : '☆';
  });

  // re-render saved tab if open
  if (S.currentTab === 'saved') renderSaved();
  // re-render profile spot chips
  if (S.currentTab === 'profile') renderProfile();
}

function selectSpot(id) {
  cfg('spotId', id);
  setTab('home');
  renderHome();
}

/* ══════════════════════════════════════
   ALERTS
══════════════════════════════════════ */
async function enableAlerts(on) {
  if (!on) { cfg('alertsOn', false); el('alert-log').textContent='התראות כבויות.'; return false; }
  if (!('Notification' in window)) { el('alert-log').textContent='הדפדפן לא תומך בהתראות.'; return false; }
  const perm = Notification.permission==='granted' ? 'granted' : await Notification.requestPermission();
  if (perm !== 'granted') { el('alert-log').textContent='לא ניתן לשלוח התראות — יש לאשר בדפדפן.'; return false; }
  cfg('alertsOn', true); el('alert-log').textContent='התראות פעילות!';
  return true;
}

function checkAlert() {
  if (!S.cfg.alertsOn || Notification.permission!=='granted') return;
  const b = beach(S.cfg.alertSpot);
  const cached = S.cache[`${b.lat},${b.lon}`]?.d;
  if (!cached) return;
  const now = new Date();
  const good = cached.h24.find(p => new Date(p.time)>=now && p.wh>=S.cfg.alertH);
  if (!good) return;
  const key = `${b.id}-${good.time}-${S.cfg.alertH}`;
  if (key === S.cfg.lastAlertKey) return;
  cfg('lastAlertKey', key);
  new Notification(`🦊 גלים ב${b.name}`, { body:`${fmtH(good.wh)} · ${WL[wClass(good.wd2||0, b.offDir)].t}` });
}


/* ══════════════════════════════════════
   AUTH (Sign in with Apple + cloud sync)
══════════════════════════════════════ */
const API = '';  // same origin on Vercel
const AUTH = {
  token: localStorage.getItem('surfy-token') || null,
  user: JSON.parse(localStorage.getItem('surfy-user') || 'null'),
};

function isLoggedIn() { return !!AUTH.token; }

function saveAuth(token, user) {
  AUTH.token = token; AUTH.user = user;
  localStorage.setItem('surfy-token', token);
  localStorage.setItem('surfy-user', JSON.stringify(user));
}

function clearAuth() {
  AUTH.token = null; AUTH.user = null;
  localStorage.removeItem('surfy-token');
  localStorage.removeItem('surfy-user');
}

async function apiReq(method, path, body) {
  const res = await fetch(API + path, {
    method,
    headers: { 'Content-Type': 'application/json', ...(AUTH.token ? { Authorization: 'Bearer ' + AUTH.token } : {}) },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

// Called by iOS Swift after SIWA completes
window.onSIWASuccess = async function(identityToken, userInfo) {
  try {
    const { token, user } = await apiReq('POST', '/api/auth/apple', { identityToken, userInfo });
    saveAuth(token, user);
    // Merge cloud settings into local
    cfg('savedIds', user.savedIds);
    cfg('spotId', user.spotId);
    cfg('metric', user.metric);
    renderProfile();
    renderHome();
    showSyncStatus('✅ מחובר בהצלחה');
  } catch(e) {
    console.error('SIWA error', e);
    alert('התחברות נכשלה — נסה שוב.');
  }
};

async function syncCloud() {
  if (!isLoggedIn()) return;
  try {
    showSyncStatus('מסנכרן...');
    await apiReq('PUT', '/api/user/sync', {
      savedIds: S.cfg.savedIds,
      spotId: S.cfg.spotId,
      metric: S.cfg.metric,
      alertsOn: S.cfg.alertsOn,
      alertH: S.cfg.alertH,
      alertStart: S.cfg.alertStart,
      alertEnd: S.cfg.alertEnd,
      alertSpot: S.cfg.alertSpot,
    });
    showSyncStatus('✅ סונכרן ' + new Date().toLocaleTimeString('he-IL', {hour:'2-digit',minute:'2-digit'}));
  } catch { showSyncStatus('❌ שגיאת סנכרון'); }
}

function showSyncStatus(msg) {
  const el2 = el('sync-status');
  if (el2) el2.textContent = msg;
}

async function deleteAccount() {
  if (!confirm('מחיקת חשבון תמחק את כל הנתונים שלך לצמיתות. להמשיך?')) return;
  try {
    await apiReq('DELETE', '/api/user/delete');
    clearAuth();
    renderProfile();
    alert('החשבון נמחק בהצלחה.');
  } catch { alert('שגיאה במחיקת חשבון — נסה שוב.'); }
}

function renderAccountCard() {
  const out = el('account-signed-out');
  const inp = el('account-signed-in');
  if (!out || !inp) return;
  if (isLoggedIn() && AUTH.user) {
    out.style.display = 'none';
    inp.style.display = 'block';
    const nm = el('account-name');
    const em = el('account-email');
    if (nm) nm.textContent = AUTH.user.name || 'Surfy User';
    if (em) em.textContent = AUTH.user.email || '';
  } else {
    out.style.display = 'block';
    inp.style.display = 'none';
  }
}

// Email auth state
let emailAuthMode = 'login'; // 'login' | 'register'

function setAuthTab(tab) {
  ['apple', 'email'].forEach(t => {
    const btn = document.querySelector(`.auth-tab[data-tab="${t}"]`);
    const pane = el(`auth-pane-${t}`);
    if (btn) btn.classList.toggle('active', t === tab);
    if (pane) pane.style.display = t === tab ? '' : 'none';
  });
}

function setAuthMode(mode) {
  emailAuthMode = mode;
  document.querySelectorAll('.auth-mode-btn').forEach(b => b.classList.toggle('active', b.dataset.mode === mode));
  const nameRow = el('auth-name-row');
  const submitBtn = document.querySelector('.auth-submit-btn');
  const pwInput = el('auth-password');
  if (nameRow) nameRow.style.display = mode === 'register' ? '' : 'none';
  if (submitBtn) submitBtn.textContent = mode === 'register' ? 'הרשמה' : 'כניסה';
  if (pwInput) pwInput.autocomplete = mode === 'register' ? 'new-password' : 'current-password';
  const errEl = el('auth-error');
  if (errEl) errEl.textContent = '';
}

async function submitEmailAuth() {
  const email = (el('auth-email')?.value || '').trim();
  const password = el('auth-password')?.value || '';
  const name = (el('auth-name')?.value || '').trim();
  const errEl = el('auth-error');

  if (!email || !password) { if (errEl) errEl.textContent = 'נא למלא אימייל וסיסמה'; return; }
  if (password.length < 8) { if (errEl) errEl.textContent = 'הסיסמה חייבת להכיל לפחות 8 תווים'; return; }

  const submitBtn = document.querySelector('.auth-submit-btn');
  if (submitBtn) submitBtn.disabled = true;
  if (errEl) errEl.textContent = '';

  try {
    const { token, user } = await apiReq('POST', '/api/auth/email', {
      action: emailAuthMode, email, password, name: name || undefined,
    });
    saveAuth(token, user);
    cfg('savedIds', user.savedIds);
    cfg('spotId', user.spotId);
    cfg('metric', user.metric);
    renderProfile();
    renderHome();
    showSyncStatus('✅ מחובר בהצלחה');
  } catch(e) {
    let msg = 'שגיאה — נסה שוב';
    try { msg = JSON.parse(e.message).error || msg; } catch {}
    if (errEl) errEl.textContent = msg;
  } finally {
    if (submitBtn) submitBtn.disabled = false;
  }
}

/* ══════════════════════════════════════
   EVENT DELEGATION (single listener)
══════════════════════════════════════ */
document.addEventListener('click', function(e) {
  const el2 = e.target.closest('[data-action]');
  if (!el2) return;
  e.stopPropagation();
  const action = el2.dataset.action;
  const id = el2.dataset.id;

  switch(action) {
    case 'tab':        setTab(id);        break;
    case 'open':       openBeach(id);     break;
    case 'closeDetail': closeDetail();    break;
    case 'toggleSave': toggleSave(id);    break;
    case 'switchChart': switchChart(id);  break;
    case 'selectSpot': selectSpot(id);    break;
    case 'toggleUnit': {
      cfg('metric', !S.cfg.metric);
      el2.textContent = S.cfg.metric ? 'מטרים' : 'פיט';
      el('unit-chk').checked = !S.cfg.metric;
      reRenderActiveTab();
      break;
    }
    case 'testAlert': {
      if (Notification.permission==='granted') new Notification('🦊 Surfy',{body:'ככה תיראה התראה כשיש גלים טובים!'});
      else el('alert-log').textContent='הפעל קודם את ההתראות למעלה.';
      break;
    }
    case 'signInWithApple': {
      if (window.webkit?.messageHandlers?.siwa) {
        window.webkit.messageHandlers.siwa.postMessage({});
      } else {
        alert('Sign in with Apple זמין רק באפליקציה הנייטיב.');
      }
      break;
    }
    case 'authTab':    setAuthTab(el2.dataset.tab);    break;
    case 'authMode':   setAuthMode(el2.dataset.mode);  break;
    case 'submitEmailAuth': submitEmailAuth(); break;
    case 'syncCloud':    syncCloud();    break;
    case 'signOut':      clearAuth(); renderProfile(); break;
    case 'deleteAccount': deleteAccount(); break;
    case 'forecastPopup': {
      const { beach: bId, date, mh: mhStr, minh: minhStr } = el2.dataset;
      const mh = parseFloat(mhStr), minh = parseFloat(minhStr);
      const b2 = beach(bId), surf = surfLabel(mh);
      const dayName = dayLabel(date);
      el('popup-emoji').textContent = surf.emoji;
      el('popup-title').textContent = surf.title;
      el('popup-title').style.color = surf.color;
      el('popup-meta').textContent = `${dayName} · ${cmRange(minh, mh)} · ${heightLabel(mh)} · ${b2.name}`;
      el('popup-desc').textContent = surf.desc;
      el('popup-open-btn').dataset.id = bId;
      // highlight active level
      el('surf-popup').querySelectorAll('.popup-lvl').forEach((lvl, i) => {
        lvl.classList.toggle('active', i === surf.lvl);
      });
      el('surf-popup').classList.remove('hidden');
      break;
    }
    case 'closePopup':
      el('surf-popup').classList.add('hidden');
      break;
    case 'openFromPopup':
      el('surf-popup').classList.add('hidden');
      openBeach(el2.dataset.id);
      break;
  }
});

// Keyboard shortcuts
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') el('surf-popup')?.classList.add('hidden');
  if (e.key === 'Enter' && (e.target.id === 'auth-email' || e.target.id === 'auth-password' || e.target.id === 'auth-name')) {
    submitEmailAuth();
  }
});

// Profile form inputs (change events)
document.getElementById('unit-chk').addEventListener('change', e => {
  cfg('metric', !e.target.checked);
  document.querySelector('.unit-btn').textContent = S.cfg.metric ? 'מטרים' : 'פיט';
  reRenderActiveTab();
});
document.getElementById('alert-toggle').addEventListener('change', async e => {
  const ok = await enableAlerts(e.target.checked);
  e.target.checked = S.cfg.alertsOn;
});
document.getElementById('alert-height').addEventListener('input', e => cfg('alertH', +e.target.value));
document.getElementById('alert-start').addEventListener('input', e => cfg('alertStart', e.target.value));
document.getElementById('alert-end').addEventListener('input', e => cfg('alertEnd', e.target.value));
document.getElementById('alert-spot').addEventListener('change', e => cfg('alertSpot', e.target.value));
document.getElementById('beach-search').addEventListener('input', e => renderBeaches(e.target.value));

/* ══════════════════════════════════════
   HELPER
══════════════════════════════════════ */
function el(id) { return document.getElementById(id); }

/* ══════════════════════════════════════
   BOOT
══════════════════════════════════════ */
// Set unit button text
document.querySelector('.unit-btn').textContent = S.cfg.metric ? 'מטרים' : 'פיט';

// Start
renderHome();
setInterval(checkAlert, 30 * 60 * 1000);
const isWKWebView = !!(window.webkit?.messageHandlers);
if (!isWKWebView && 'serviceWorker' in navigator) navigator.serviceWorker.register('./sw.js').catch(() => {});
