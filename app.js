'use strict';

/* ══════════════════════════════════════
   DATA
══════════════════════════════════════ */
const BEACHES = [
  { id:'eilat',    name:'אילת',   region:'ים סוף',     lat:29.5581, lon:34.9482, mark:'ELT', offDir:270,
    photo:'https://upload.wikimedia.org/wikipedia/commons/c/ce/North_Beach_Eilat.jpg',
    desc:'מפרץ ים סוף עם מים כחולים-ירוקים שקופים לגמרי. שוניות אלמוגים, דגים טרופיים וצבאים ים — אחד מאתרי הצלילה הטובים בעולם. רוח צפונית עקבית בשעות הצהריים הופכת את אילת לגן עדן לגולשי רוח.',
    tags:['🤿 צלילה','🪁 ווינד','☀️ שמש כל השנה'] },
  { id:'caesarea', name:'קיסריה', region:'חוף הכרמל',  lat:32.5000, lon:34.8917, mark:'CSR', offDir:90,
    photo:'https://upload.wikimedia.org/wikipedia/commons/5/5e/The_high_level_aqueduct_of_Caesarea_built_by_Herod_%2837BC_to_4BC%29%2C_Caesarea_Maritima%2C_Israel_%2815588710799%29.jpg',
    desc:'חוף ים-תיכוני רגוע הסמוך לעיר הרומית העתיקה ולאמפיתאטרון ההיסטורי. מים תכולים ונקיים, גלים בינוניים ושפת ים חולית רחבה. מתאים לכל הגילאים ולסאפ-בורד.',
    tags:['🏛️ היסטורי','🏄 סאפ','🌊 גלים נוחים'] },
  { id:'netanya',  name:'נתניה',  region:'השרון',       lat:32.3215, lon:34.8532, mark:'NTY', offDir:90,
    photo:'https://upload.wikimedia.org/wikipedia/commons/2/2b/PikiWiki_Israel_17539_Netanya_sironit_beach.JPG',
    desc:'חוף עירוני ארוך ומגוון עם טיילת מפורסמת ומעלית לים. גלים ים-תיכוניים טובים למתחילים, מתקני ספורט ים מסודרים ופרומנד עמוס בקיץ.',
    tags:['🌊 גלים','🏄 למתחילים','🛗 מעלית לחוף'] },
  { id:'haifa',    name:'חיפה',   region:'מפרץ חיפה',   lat:32.8056, lon:34.9658, mark:'HFA', offDir:90,
    photo:'https://upload.wikimedia.org/wikipedia/commons/1/1d/South_Dado_Beach_-_Hof_HaCarmel_-_Haifa_%281506044661%29.jpg',
    desc:'חוף דדו הידוע — שוקק חיים עם שירותים מלאים, נוף להר הכרמל ולמפרץ. גלים טובים ורוח ים-תיכונית אמינה בשעות אחה"צ, אידיאלי לווינד-סרף ולגלישה.',
    tags:['🪁 ווינד','🏔️ נוף לכרמל','🎯 תשתיות'] },
  { id:'ashdod',   name:'אשדוד',  region:'חוף השפלה',  lat:31.8044, lon:34.6553, mark:'ASH', offDir:90,
    photo:'https://upload.wikimedia.org/wikipedia/commons/1/14/Ashdod_Beach.jpg',
    desc:'חוף נרחב ופתוח עם מים נוחים לרחצה. ידוע ברוח ים טובה וגלים קטנים-בינוניים המתאימים לסאפ-בורד, גלשן גדול ולמשפחות עם ילדים.',
    tags:['🏄 סאפ','👨‍👩‍👧 משפחות','💨 רוח טובה'] },
  { id:'ashkelon', name:'אשקלון', region:'חוף השפלה',  lat:31.6688, lon:34.5571, mark:'AKL', offDir:90,
    photo:'https://upload.wikimedia.org/wikipedia/commons/f/f5/PikiWiki_Israel_53637_the_beach_promenade_in_ashkelon.jpg',
    desc:'חוף פראי ויפהפה הגובל בפארק הלאומי. גלים ים-תיכוניים עקביים ומים נקיים, תחושה של חוף ירוק ורחב ידיים. מקום מושלם לבריחה מהעיר.',
    tags:['🌿 פארק','🌊 גלים עקביים','🏖️ חוף פראי'] },
  { id:'nahariya', name:'נהריה',  region:'חוף הצפון',  lat:33.0067, lon:35.0975, mark:'NHR', offDir:90,
    photo:'https://upload.wikimedia.org/wikipedia/commons/b/ba/Beach_-_Nahariya_Israel_%281370405741%29.jpg',
    desc:'החוף הצפוני ביותר בישראל, עם אווירה שקטה ורגועה. מים קרים יותר ורעננים, גלים מוכתבים על ידי הים התיכון הפתוח. מתאים לגולשי ים מנוסים ולאוהבי טבע.',
    tags:['🌊 גלים חופשיים','❄️ מים רעננים','🤫 שקט'] },
  { id:'tlv-gordon', name:'גורדון',  region:'תל אביב',   lat:32.0832, lon:34.7669, mark:'TLV', offDir:90,
    photo:'https://upload.wikimedia.org/wikipedia/commons/5/5f/Israel-04591_-_Gordon_Beach_%2832820446774%29.jpg',
    desc:'חוף גורדון הוא הסמל של חוף תל אביב — שוקק חיים, צבעוני ומלא אנרגיה. ליד מתחם הנמל ופרומנד ארוך. מים ים-תיכוניים נעימים, גלים קטנים-בינוניים, מתאים לכולם.',
    tags:['🌆 עירוני','🏄 לכולם','☀️ טיילת ארוכה'] },
  { id:'tlv-hilton', name:'הילטון',  region:'תל אביב',   lat:32.0899, lon:34.7685, mark:'HLT', offDir:90,
    photo:'https://upload.wikimedia.org/wikipedia/commons/d/df/Hilton_Beach_-_Tel_Aviv_%288%29_%285365346388%29.jpg',
    desc:'חוף הילטון — החוף הצפוני של תל אביב, ידוע בגלים הטובים ביותר בעיר. חוף גלשנים מסורתי, מגנט לגולשים ולכלבים. פחות עמוס ממרכז העיר, עם גלים עקביים מהצפון.',
    tags:['🏄 גלשנים','🐕 חוף כלבים','🌊 גלים טובים'] },
];
const VALID_IDS = BEACHES.map(b => b.id);
const DAYS = ['יום א','יום ב','יום ג','יום ד','יום ה','יום ו','שבת'];

/* ══════════════════════════════════════
   STATE
══════════════════════════════════════ */
const DEFAULTS = { spotId:'netanya', savedIds:['netanya'], metric:true, surfType:'waves', windUnit:'kmh', alertsOn:false, alertH:0.8, alertStart:'06:00', alertEnd:'20:00', alertSpot:'netanya', windAlertOn:false, windAlertSpeed:15, lastAlertKey:'', lastWindAlertKey:'' };

const SURF_TYPES = {
  waves: { label:'גלים', emoji:'🏄‍♂️', heroTitle:'גולש גלים', color:'#0077b6', grad:'linear-gradient(135deg,#0077b6,#00b4d8)', img:'fox-surf.png' },
  wind:  { label:'רוח',  emoji:'🪁',   heroTitle:'גולש רוח',  color:'#0096c7', grad:'linear-gradient(135deg,#0077b6,#0096c7)',  img:'fox-wind.png' },
};

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
  return ['צ','צ-מז','מז','ד-מז','ד','ד-מע','מע','צ-מע'][Math.round(((deg%360)+360)%360/45)%8];
}
function d2cFull(deg) {
  const dirs = ['צפונית','צפון מזרחית','מזרחית','דרום מזרחית','דרומית','דרום מערבית','מערבית','צפון מערבית'];
  return dirs[Math.round(((deg%360)+360)%360/45)%8];
}
function wClass(deg, offDir) {
  const d = ((deg%360)+360)%360, o = ((offDir%360)+360)%360;
  const diff = Math.min(Math.abs(d-o), 360-Math.abs(d-o));
  return diff <= 45 ? 'offshore' : diff >= 135 ? 'onshore' : 'cross';
}
const WL = { offshore:{t:'אופשור ✓',c:'#06d6a0'}, onshore:{t:'אונשור',c:'#ef476f'}, cross:{t:'רוח צד',c:'#ffb703'} };

function score(wh, wp, ws, wd, offDir, swh=0, swp=0, wwh=0) {
  const surfType = S.cfg?.surfType || 'waves';

  if (surfType === 'wind') {
    // ווינד-סרפינג: רוח קובעת
    const kn = ws / 1.852;
    let s = kn < 10 ? 0.5 : kn < 15 ? 2.0 : kn < 17 ? 4.0 : kn < 20 ? 6.0 : kn < 25 ? 8.0 : 9.5;
    const c = wClass(wd, offDir);
    s += c === 'cross' ? 0.8 : c === 'onshore' ? 0.3 : 0; // offshore = רע לווינד
    return Math.round(clamp(s, 0, 10) * 10) / 10;
  }

  // 'waves' or 'both' — wave height dominant
  const dh = Math.max(0, wh - 0.2) * 100;
  let s = dh <= 20 ? 0.1 : dh < 60 ? 0.5 : dh < 80 ? 1.0 : dh < 100 ? 1.8 : dh < 120 ? 2.8 : dh < 149 ? 4.5 : dh < 200 ? 6.2 : 7.5;

  s += wp < 5 ? 0 : wp < 7 ? 0.4 : wp < 9 ? 0.8 : 1.2;

  if (wh > 0) {
    s += (swh / wh) * 0.6 + (swp >= 10 ? 0.4 : swp >= 7 ? 0.2 : 0);
  }

  const c = wClass(wd, offDir);
  s += c === 'offshore' ? (ws < 15 ? 0.8 : ws < 25 ? 0.5 : 0.2) : c === 'cross' ? (ws < 15 ? 0.4 : 0.1) : (ws < 10 ? 0.2 : 0);

  if (surfType === 'both') {
    const kn = ws / 1.852;
    s += kn >= 15 ? 0.6 : kn >= 10 ? 0.2 : 0;
  }

  return Math.round(clamp(s, 0, 10) * 10) / 10;
}
function scoreColor(s) { return s>=7.5?'#06d6a0':s>=5.5?'#00b4d8':s>=4.0?'#ffd166':s>=2.8?'#f4a261':s>=1.5?'#adb5bd':'#ef476f'; }
function scoreLbl(s) {
  if (S.cfg?.surfType === 'wind') {
    return s>=7.5?'מצוין':s>=5.5?'טוב מאוד':s>=4.0?'טוב לרוח':s>=2.8?'ישים':s>=1.5?'מועט':'חסר רוח';
  }
  return s>=7.5?'מצוין':s>=5.5?'טוב מאוד':s>=4.0?'טוב':s>=2.8?'סבבה':s>=1.5?'גלי':'שטוח';
}

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

function windLbl(ws_kmh) {
  const kn = ws_kmh / 1.852;
  if (kn >= 25) return { lbl:'פצצה',     col:'#9b2226' };
  if (kn >= 20) return { lbl:'חזק מאוד', col:'#ae2012' };
  if (kn >= 17) return { lbl:'חזק',      col:'#e85d04' };
  if (kn >= 15) return { lbl:'נחמד',     col:'#f4a261' };
  return               { lbl:'קל',       col:'#52b788' };
}
function windBgCol(ws_kmh) {
  const kn = ws_kmh / 1.852;
  return kn >= 25 ? '#9b2226' : kn >= 20 ? '#ae2012' : kn >= 17 ? '#e85d04' : kn >= 15 ? '#f4a261' : '#1a9e5c';
}
function fmtWind(ws_kmh) {
  return S.cfg.windUnit === 'knots' ? `${Math.round(ws_kmh / 1.852)} קשר` : `${Math.round(ws_kmh)} קמ"ש`;
}
function fmtWindN(ws_kmh) {
  return S.cfg.windUnit === 'knots' ? Math.round(ws_kmh / 1.852).toString() : Math.round(ws_kmh).toString();
}
function fmtWindU() { return S.cfg.windUnit === 'knots' ? 'קשר' : 'קמ"ש'; }

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

function adjH(m) { return Math.max(0, m); }
function fmtHD(m)  { return m<=0.2 ? 'עד 20ס"מ' : fmtH(m); }
function fmtHND(m) { return m<=0.2 ? (S.cfg.metric?'≤20':'≤0.7') : fmtHN(m); }
function dispHFull(m) { return m<=0.2 ? (S.cfg.metric?'עד 20ס"מ':'עד 0.7ft') : `${fmtHN(m)}${fmtU()}`; }
function cmRangeD(minh,mh) {
  if(mh<=0.2) return 'עד 20ס"מ';
  return cmRange(minh, mh);
}
function heightLabelD(mh) { return heightLabel(mh); }

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

  const marineUrl = `https://marine-api.open-meteo.com/v1/marine?latitude=${b.lat}&longitude=${b.lon}&hourly=wave_height,wave_period,wave_direction,swell_wave_height,swell_wave_period,wind_wave_height&timezone=auto&forecast_days=7`;
  const [mr, mre, fr] = await Promise.all([
    fetch(marineUrl),
    fetch(marineUrl + '&models=ewam').catch(() => null),
    fetch(`https://api.open-meteo.com/v1/forecast?latitude=${b.lat}&longitude=${b.lon}&hourly=wind_speed_10m,wind_direction_10m,temperature_2m&current=temperature_2m,wind_speed_10m,wind_direction_10m&timezone=auto&forecast_days=7`)
  ]);
  const [m, me, f] = await Promise.all([mr.json(), mre ? mre.json().catch(()=>null) : Promise.resolve(null), fr.json()]);

  // DWD EWAM: accurate European/Mediterranean model (3-day). Merge over GFS for days 1-3.
  const ewWH  = me?.hourly?.wave_height   || [];
  const ewWP  = me?.hourly?.wave_period   || [];
  const ewSWH = me?.hourly?.swell_wave_height || [];
  const mWH  = i => ewWH[i]  ?? m.hourly.wave_height[i]  ?? 0;
  const mWP  = i => ewWP[i]  ?? m.hourly.wave_period[i]  ?? 0;
  const mSWH = i => ewSWH[i] ?? m.hourly.swell_wave_height?.[i] ?? 0;

  const times = m.hourly.time;
  const now = new Date();
  let ni = 0;
  for (let i=0; i<times.length; i++) { if (new Date(times[i])<=now) ni=i; }

  const h24 = [];
  for (let i=ni; i<Math.min(ni+24,times.length); i++) {
    h24.push({ time:times[i], wh:mWH(i), wp:mWP(i), wd:m.hourly.wave_direction[i]??0, ws:f.hourly.wind_speed_10m[i]??0, wd2:f.hourly.wind_direction_10m[i]??0, swh:mSWH(i), swp:m.hourly.swell_wave_period?.[i]??0, wwh:m.hourly.wind_wave_height?.[i]??0 });
  }

  // group by day
  const dm = new Map();
  for (let i=0; i<times.length; i++) {
    const dk = times[i].slice(0,10);
    if (!dm.has(dk)) dm.set(dk,[]);
    dm.get(dk).push(i);
  }
  const d7 = [...dm.entries()].slice(0,7).map(([dk,ix]) => {
    let mh=0, minh=Infinity, mp=0, mw=0, mwd=0, swh=0, swp=0, wwh=0;
    ix.forEach(i => {
      const wh=mWH(i), ws=f.hourly.wind_speed_10m[i]??0;
      if(wh>0 && wh<minh) minh=wh;
      if(wh>mh){mh=wh;mp=mWP(i);swh=mSWH(i);swp=m.hourly.swell_wave_period?.[i]??0;wwh=m.hourly.wind_wave_height?.[i]??0;}
      if(ws>mw){mw=ws;mwd=f.hourly.wind_direction_10m[i]??0;}
    });
    if(minh===Infinity) minh=0;
    return { date:dk, mh, minh, mp, mw, mwd, swh, swp, wwh, sc:score(mh,mp,mw,mwd,b.offDir,swh,swp,wwh) };
  });

  const cur = {
    wh:mWH(ni), wp:mWP(ni), wd:m.hourly.wave_direction[ni]??0, swh:mSWH(ni), swp:m.hourly.swell_wave_period?.[ni]??0, wwh:m.hourly.wind_wave_height?.[ni]??0,
    ws:f.current?.wind_speed_10m??f.hourly.wind_speed_10m[ni]??0,
    wd2:f.current?.wind_direction_10m??f.hourly.wind_direction_10m[ni]??0,
    temp:f.current?.temperature_2m??f.hourly.temperature_2m[ni]??0,
  };
  cur.sc = score(cur.wh, cur.wp, cur.ws, cur.wd2, b.offDir, cur.swh, cur.swp, cur.wwh);

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
  const isWind = S.cfg.surfType === 'wind';
  if (isWind) {
    const wl = windLbl(cur.ws);
    el('hero-desc').textContent = `${scoreLbl(sc)} · ${fmtWind(cur.ws)} · ${d2cFull(cur.wd2)} · ${cur.temp.toFixed(0)}°C`;
  } else {
    el('hero-desc').textContent = `${scoreLbl(sc)} לגלישה · ${fmtHD(cur.wh)} · ${fmtWind(cur.ws)} · ${cur.temp.toFixed(0)}°C`;
  }
  el('hero-ring').innerHTML = ring(sc,78,7,col) + `<div class="ring-num large" style="color:${col};">${sc.toFixed(1)}</div>`;
  const heroBtn = el('hero-open-btn');
  if (heroBtn) heroBtn.dataset.id = b.id;
}

function updateNow(b, cur) {
  const cls = wClass(cur.wd2, b.offDir), wl = WL[cls];
  let nowVal, nowUnit;
  const _a = adjH(cur.wh);
  if (S.cfg.metric) {
    nowVal = _a<=0.2 ? 'עד 20' : Math.round(_a * 100 / 5) * 5;
    nowUnit = 'ס"מ';
  } else {
    nowVal = _a<=0.2 ? '≤0.7' : (_a * 3.281).toFixed(1);
    nowUnit = 'ft';
  }
  const wlNow = windLbl(cur.ws);
  const kn = Math.round(cur.ws / 1.852);
  el('now-h').innerHTML = `<span class="now-cm">${nowVal}</span><span class="now-unit">${nowUnit}</span><span style="font-size:10px;color:${wlNow.col};font-weight:700;display:block;margin-top:2px;">${kn} קשר</span>`;
  el('now-w').innerHTML = windArrowSvg(cur.wd2) + `<span>${fmtWind(cur.ws)}</span>`;
  if (S.cfg.surfType === 'wind') {
    el('now-c').innerHTML = `<span class="now-cond-badge" style="background:${wlNow.col}22;color:${wlNow.col};">${wlNow.lbl} · ${d2cFull(cur.wd2)}</span>`;
  } else {
    el('now-c').innerHTML = `<span class="now-cond-badge" style="background:${wl.c}20;color:${wl.c};">${heightLabelD(cur.wh)}</span>`;
  }
  el('now-t').textContent = new Intl.DateTimeFormat('he-IL',{hour:'2-digit',minute:'2-digit'}).format(new Date());
}

function renderFcTable(b, d7) {
  const isWind = S.cfg.surfType === 'wind';

  // Update table header label
  const hl = el('fc-head-label');
  if (hl) hl.textContent = isWind ? 'כיוון ואיכות רוח' : 'גובה ומצב';

  el('fc-list').innerHTML = d7.map((d) => {
    const sc=d.sc, col=scoreColor(sc);
    const rowBg = sc>=5.5?'#e8f9f2':sc>=4.0?'#fffbf0':sc>=2.8?'#fff8f0':'';
    const rowBdr = sc>=5.5?'#06d6a0':sc>=4.0?'#ffd166':sc>=2.8?'#f4a261':'#dee8ef';
    const wl2 = windLbl(d.mw);
    const windCls = wClass(d.mwd, b.offDir);
    const wlDir = WL[windCls];

    const sl = surfLabel(d.mh);
    const midCol = isWind
      ? `<div class="fc-height fc-wind-dir">
           <span class="fc-cm" style="font-size:13px;">${d2cFull(d.mwd)}</span>
           <span class="fc-lbl" style="color:${wlDir.c};font-weight:700;">${wlDir.t}</span>
         </div>`
      : `<div class="fc-height">
           <span class="fc-cm" style="color:${sl.color};font-size:16px;">${cmRangeD(d.minh, d.mh)}</span>
           <span class="fc-lbl" style="color:${sl.color};opacity:.8;">${heightLabelD(d.mh)}</span>
         </div>`;

    return `<div class="fc-row" style="background:${rowBg};border-right:4px solid ${rowBdr};" data-action="open" data-id="${b.id}">
      <div class="fc-day">
        <span class="fc-day-name">${dayLabel(d.date)}</span>
        <span class="fc-period">${d.mp.toFixed(0)}שנ׳</span>
      </div>
      ${midCol}
      <div class="fc-wind" style="background:${windBgCol(d.mw)};">
        <div class="fw-a">${windArrowSvg(d.mwd, 'rgba(255,255,255,.95)')}</div>
        <div class="fw-n">${fmtWindN(d.mw)}<span class="fw-u"> ${fmtWindU()}</span></div>
        <div class="fw-l">${wl2.lbl}</div>
      </div>
      <div class="fc-score-col">
        <span class="score-chip" style="background:${col}22;color:${col};font-size:14px;padding:4px 10px;">${sc.toFixed(1)}</span>
        <span style="font-size:10px;color:#888;margin-top:2px;display:block;">${scoreLbl(sc)}</span>
      </div>
    </div>`;
  }).join('');
}

function renderHomeBeachList() {
  const list = el('home-beach-list');
  list.innerHTML = BEACHES.map(b => `
    <div class="bcard" data-action="open" data-id="${b.id}">
      <div class="bcard-img-wrap">
        <img src="${b.photo}" alt="${b.name}" loading="lazy" onerror="this.style.background='linear-gradient(135deg,#0077b6,#00b4d8)';this.style.display='block'">
        <div class="bcard-ov"></div>
        <div id="bcard-ring-${b.id}" class="bcard-ring"></div>
      </div>
      <div class="bcard-body">
        <div class="bcard-name">${b.name}</div>
        <div class="bcard-region">${b.region}</div>
        <div id="bcard-stat-${b.id}" class="bcard-stat">
          <span class="bcard-skel"></span>
        </div>
      </div>
    </div>`).join('');

  BEACHES.forEach(async b => {
    try {
      const data = await fetchBeach(b);
      const cur = data.cur, sc = cur.sc, col = scoreColor(sc);
      const rg = el(`bcard-ring-${b.id}`), st = el(`bcard-stat-${b.id}`);
      if (rg) rg.innerHTML = ring(sc,44,4,col) + `<div class="ring-num" style="font-size:13px;color:${col};">${sc.toFixed(1)}</div>`;
      if (st) st.innerHTML = `<span style="color:${col};font-weight:800;font-size:12px;">${scoreLbl(sc)}</span><span class="bcard-sep">·</span><span style="font-size:11px;color:rgba(255,255,255,.8);">${dispHFull(cur.wh)}</span>`;
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
      if (mn) mn.textContent = `🌊 ${dispHFull(data.cur.wh)} · 💨 ${fmtWind(data.cur.ws)}`;
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
      const _isW = S.cfg.surfType === 'wind';
      if (st) st.innerHTML = `<span style="color:${col};font-weight:800;">${scoreLbl(sc)}</span> · ${_isW ? `💨 ${fmtWind(data.cur.ws)} · ${windLbl(data.cur.ws).lbl}` : `🌊 ${dispHFull(data.cur.wh)} · 💨 ${fmtWind(data.cur.ws)}`}`;
    } catch {}
  });
}

/* ══════════════════════════════════════
   PROFILE TAB
══════════════════════════════════════ */
function renderProfile() {
  renderAccountCard();

  const st = S.cfg.surfType || 'waves';
  const stData = SURF_TYPES[st];

  // Avatar circle — show image only, hide emoji when image loads
  const avatarEmoji = el('prof-avatar-emoji');
  const avatarImg = el('prof-avatar-img');
  if (avatarImg) {
    avatarImg.style.display = '';
    avatarImg.src = stData.img;
    if (avatarEmoji) avatarEmoji.style.display = 'none';
    avatarImg.onload  = () => { if (avatarEmoji) avatarEmoji.style.display = 'none'; };
    avatarImg.onerror = () => { avatarImg.style.display = 'none'; if (avatarEmoji) { avatarEmoji.style.display = ''; avatarEmoji.textContent = stData.emoji; } };
  } else if (avatarEmoji) {
    avatarEmoji.textContent = stData.emoji;
  }

  // Name + subtitle
  const subtitleMap = { waves:'גלים · גלשן · סאפ', wind:'ווינד · קייט' };
  const dname = el('prof-dname');
  const dsub  = el('prof-dsub');
  if (isLoggedIn() && AUTH.user) {
    if (dname) dname.textContent = AUTH.user.name || stData.heroTitle;
    if (dsub)  dsub.textContent  = subtitleMap[st];
  } else {
    if (dname) dname.textContent = stData.heroTitle;
    if (dsub)  dsub.textContent  = subtitleMap[st];
  }

  // Surf type buttons
  document.querySelectorAll('[data-action="setSurfType"]').forEach(btn => {
    btn.classList.toggle('on',  btn.dataset.id === st);
    btn.classList.toggle('off', btn.dataset.id !== st);
  });

  // Topbar badge
  updateSurfBadge();

  // Spot chips
  const spotList = el('spot-list');
  if (spotList) spotList.innerHTML = BEACHES.map(b =>
    `<button class="spot-chip ${b.id===S.cfg.spotId?'active':''}" data-action="selectSpot" data-id="${b.id}">${b.name}</button>`
  ).join('');

  // Alert spot select
  if (el('alert-spot')) el('alert-spot').innerHTML = BEACHES.map(b =>
    `<option value="${b.id}" ${b.id===S.cfg.alertSpot?'selected':''}>${b.name}</option>`
  ).join('');

  if (el('unit-chk'))        el('unit-chk').checked        = !S.cfg.metric;
  if (el('wind-unit-chk'))   el('wind-unit-chk').checked   = S.cfg.windUnit === 'knots';
  if (el('alert-toggle'))    el('alert-toggle').checked    = S.cfg.alertsOn;
  if (el('alert-height'))    el('alert-height').value      = S.cfg.alertH;
  if (el('alert-start'))     el('alert-start').value       = S.cfg.alertStart;
  if (el('alert-end'))       el('alert-end').value         = S.cfg.alertEnd;
  if (el('wind-alert-toggle')) el('wind-alert-toggle').checked = S.cfg.windAlertOn;
  if (el('wind-alert-speed'))  el('wind-alert-speed').value    = S.cfg.windAlertSpeed;
}

function updateSurfBadge() {
  const st = S.cfg.surfType || 'waves';
  const stData = SURF_TYPES[st];
  // badge background stays white (set via CSS)
  const img = el('smb-img');
  const emoji = el('smb-emoji');
  if (img) {
    img.src = stData.img;
    img.style.display = '';
    if (emoji) emoji.style.display = 'none';
    img.onload  = () => { if (emoji) emoji.style.display = 'none'; };
    img.onerror = () => { img.style.display = 'none'; if (emoji) { emoji.style.display = ''; emoji.textContent = stData.emoji; } };
  } else if (emoji) {
    emoji.textContent = stData.emoji;
  }
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
  const isWind = S.cfg.surfType === 'wind';
  const sl = surfLabel(cur.wh);
  const tags = (b.tags||[]).map(t=>`<span class="d-tag">${t}</span>`).join('');

  el('detail-inner').innerHTML = `
    <div class="d-hero">
      <img src="${b.photo}" alt="${b.name}" onerror="this.style.background='linear-gradient(135deg,#0077b6,#00b4d8)'">
      <div class="d-hero-ov"></div>
      <div class="d-hero-top">
        <button class="d-fab" data-action="closeDetail">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        </button>
        <button class="d-fab" id="d-save" data-action="toggleSave" data-id="${b.id}">${saved?'⭐':'☆'}</button>
      </div>
      <div class="d-hero-btm">
        <div>
          <div class="d-region-badge">${b.region}</div>
          <div class="d-title">${b.name}</div>
          <div class="d-tags-row">${tags}</div>
        </div>
        <div class="d-ring-wrap">
          <div class="ring-wrap large">${ring(sc,82,7,col)}<div class="ring-num large" style="color:${col};">${sc.toFixed(1)}</div></div>
          <div class="d-ring-lbl" style="color:${col};">${scoreLbl(sc)}</div>
        </div>
      </div>
    </div>

    <div class="d-cond-banner" style="border-right:4px solid ${col};background:${col}12;">
      <div class="d-cond-left">
        <span class="d-cond-pill" style="background:${col};color:#fff;">${isWind ? windLbl(cur.ws).lbl : sl.title}</span>
        <span class="d-cond-desc">${isWind ? `${fmtWind(cur.ws)} · ${wl.t}` : sl.desc}</span>
      </div>
      <div class="d-cond-meta">${cur.temp.toFixed(0)}°C · ${d2c(cur.wd2)}</div>
    </div>

    <div class="d-body">
      <div class="stat-grid">
        <div class="stat-card stat-card-accent" style="--ac:${col}">
          <span class="stat-label">🌊 גלים עכשיו</span>
          <span class="stat-val" style="color:${col}">${fmtHD(cur.wh)}</span>
          <span class="stat-sub">תקופה ${cur.wp.toFixed(1)} שנ׳</span>
        </div>
        <div class="stat-card">
          <span class="stat-label">💨 רוח</span>
          <span class="stat-val">${fmtWind(cur.ws)}</span>
          <span class="stat-sub" style="color:${windLbl(cur.ws).col};font-weight:700;">${windLbl(cur.ws).lbl} · ${wl.t}</span>
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

      <div class="d-week-hd"><span class="micro">Forecast</span><div class="d-week-title">תחזית 7 ימים</div></div>
      <div class="outlook-box">
        ${data.d7.map((d,i) => {
          const c=scoreColor(d.sc);
          const isToday = i===0;
          return `<div class="ol-row ${isToday?'ol-today':''}">
            <div class="ol-day-col">
              <span class="ol-day">${dayLabel(d.date)}</span>
              ${isToday?`<span class="ol-today-badge">היום</span>`:''}
            </div>
            <div class="ol-center">
              <div class="ol-bar-wrap">
                <div class="ol-bar"><i style="width:${clamp(d.sc/10,0,1)*100}%;background:${c};"></i></div>
              </div>
              <span class="ol-ht">${cmRangeD(d.minh,d.mh)}</span>
            </div>
            <span class="score-chip" style="background:${c}22;color:${c};min-width:34px;text-align:center;">${d.sc.toFixed(1)}</span>
          </div>`;
        }).join('')}
      </div>

      ${b.desc ? `
      <div class="d-about">
        <div class="d-about-hd">
          <span class="micro">על החוף</span>
          <div class="d-about-title">${b.name}</div>
        </div>
        <p class="d-about-text">${b.desc}</p>
      </div>` : ''}
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
      plugins:{ legend:{display:false}, tooltip:{ callbacks:{ label: c => mode==='waves'?`${c.raw.toFixed(1)}מ׳`:fmtWind(c.raw) } } },
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
  if (id==='home') renderHome();
  if (id==='beaches') renderBeaches();
  if (id==='saved') renderSaved();
  if (id==='profile') renderProfile();
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

const isNativeApp = window.__isNativeApp === true;
const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
const isStandalone = window.navigator.standalone === true || window.matchMedia('(display-mode: standalone)').matches;

// Send notification — native app uses iOS UNUserNotificationCenter bridge,
// PWA uses SW showNotification (works on iOS 16.4+ installed), web falls back to new Notification
async function swNotify(title, body) {
  if (isNativeApp) {
    window.webkit?.messageHandlers?.notify?.postMessage({ title, body });
    return;
  }
  try {
    if ('serviceWorker' in navigator) {
      const reg = await navigator.serviceWorker.ready;
      await reg.showNotification(title, { body, icon:'./icon-192.png', badge:'./favicon-32.png', dir:'rtl', lang:'he' });
    } else {
      new Notification(title, { body });
    }
  } catch(e) {
    try { new Notification(title, { body }); } catch {}
  }
}

async function enableAlerts(on) {
  if (!on) { cfg('alertsOn', false); el('alert-log').textContent='התראות כבויות.'; return false; }

  // Native iOS app — permission via UNUserNotificationCenter bridge
  if (isNativeApp) {
    return new Promise(resolve => {
      window.__onNotifyPermission = (granted) => {
        if (granted) {
          cfg('alertsOn', true);
          el('alert-log').textContent = '✅ התראות פעילות!';
          resolve(true);
        } else {
          if (el('alert-toggle')) el('alert-toggle').checked = false;
          el('alert-log').textContent = '⚠️ לא אושרו התראות. הגדרות ← Wavio ← התראות.';
          resolve(false);
        }
      };
      window.webkit?.messageHandlers?.notifyPermission?.postMessage({});
    });
  }

  // Web / PWA
  if (!('Notification' in window)) {
    el('alert-log').textContent = 'הדפדפן לא תומך בהתראות.';
    return false;
  }
  if (isIOS && !isStandalone) {
    el('alert-log').innerHTML = '⚠️ ב-iPhone: לחץ <b>שתף ← הוסף למסך הבית</b> ופתח משם.';
    if (el('alert-toggle')) el('alert-toggle').checked = false;
    return false;
  }
  const perm = Notification.permission==='granted' ? 'granted' : await Notification.requestPermission();
  if (perm !== 'granted') {
    el('alert-log').textContent = '⚠️ לא אושרו התראות. אפשר בהגדרות הדפדפן.';
    return false;
  }
  cfg('alertsOn', true); el('alert-log').textContent = '✅ התראות פעילות!';
  return true;
}

function checkAlert() {
  if (Notification.permission !== 'granted') return;
  const b = beach(S.cfg.alertSpot);
  const cached = S.cache[`${b.lat},${b.lon}`]?.d;
  if (!cached) return;
  const now = new Date();

  if (S.cfg.alertsOn) {
    const good = cached.h24.find(p => new Date(p.time)>=now && p.wh>=S.cfg.alertH);
    if (good) {
      const key = `w-${b.id}-${good.time}-${S.cfg.alertH}`;
      if (key !== S.cfg.lastAlertKey) {
        cfg('lastAlertKey', key);
        swNotify(`🌊 גלים ב${b.name}`, `${fmtHD(good.wh)} · ${WL[wClass(good.wd2||0, b.offDir)].t}`);
      }
    }
  }

  if (S.cfg.windAlertOn) {
    const minKmh = S.cfg.windAlertSpeed * 1.852;
    const good = cached.h24.find(p => new Date(p.time)>=now && p.ws>=minKmh);
    if (good) {
      const key = `wind-${b.id}-${good.time}-${S.cfg.windAlertSpeed}`;
      if (key !== (S.cfg.lastWindAlertKey||'')) {
        cfg('lastWindAlertKey', key);
        swNotify(`💨 רוח ב${b.name}`, `${fmtWind(good.ws)} · ${windLbl(good.ws).lbl}`);
      }
    }
  }
}


/* ══════════════════════════════════════
   AUTH (Sign in with Apple + cloud sync)
══════════════════════════════════════ */
const API = '';  // same origin on Vercel
const AUTH = {
  token: localStorage.getItem('surfy-token') || null,
  user: (() => { try { return JSON.parse(localStorage.getItem('surfy-user') || 'null'); } catch { return null; } })(),
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
  // Support both new HTML (np-*) and old HTML (account-*) during SW transition
  const out = el('np-auth-out') || el('account-signed-out');
  const inp = el('np-auth-in')  || el('account-signed-in');
  if (!out || !inp) return;
  if (isLoggedIn() && AUTH.user) {
    out.style.display = 'none';
    inp.style.display = '';
    const em = el('np-acc-email') || el('account-email');
    const nm = el('account-name');
    if (em) em.textContent = AUTH.user.email || AUTH.user.name || '';
    if (nm) nm.textContent = AUTH.user.name || 'Wavio User';
    const adminSec = el('admin-section');
    if (adminSec) {
      const isAdmin = AUTH.user.email === 'bd12123@gmail.com';
      adminSec.style.display = isAdmin ? '' : 'none';
      if (isAdmin) loadAdminStats();
    }
    const delSec = el('np-delete-section');
    if (delSec) delSec.style.display = '';
  } else {
    out.style.display = '';
    inp.style.display = 'none';
    const adminSec = el('admin-section');
    if (adminSec) adminSec.style.display = 'none';
    const delSec = el('np-delete-section');
    if (delSec) delSec.style.display = 'none';
  }
}

async function loadAdminStats(force) {
  const content = el('admin-content');
  if (!content || (!force && content.dataset.loaded === '1')) return;
  content.dataset.loaded = '1';
  content.innerHTML = '<div style="color:#888;font-size:13px;padding:4px 0">טוען...</div>';
  try {
    const data = await apiReq('GET', '/api/admin/stats');
    content.innerHTML = `
      <div style="text-align:center;margin-bottom:16px">
        <div class="admin-stat-num">${data.total}</div>
        <div style="font-size:12px;color:#888">משתמשים רשומים</div>
      </div>
      <div class="admin-user-list">
        ${(data.users||[]).map(u => `
          <div class="admin-user-row">
            <div>
              <div style="font-weight:700;font-size:12px">${u.email||'—'}</div>
              <div style="color:#aaa;font-size:11px">${[u.name,u.spotId].filter(Boolean).join(' · ')}</div>
            </div>
            <div style="color:#bbb;font-size:11px;white-space:nowrap">
              ${u.createdAt ? new Date(u.createdAt).toLocaleDateString('he-IL') : ''}
            </div>
          </div>`).join('')}
      </div>`;
  } catch(e) {
    content.textContent = 'שגיאה בטעינת נתונים';
    content.dataset.loaded = '';
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
      if (Notification.permission==='granted') swNotify('🌊 Wavio', 'ככה תיראה התראה כשיש גלים טובים!');
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
    case 'syncCloud':         syncCloud();    break;
    case 'reloadAdminStats':  loadAdminStats(true); break;
    case 'signOut':      clearAuth(); renderProfile(); break;
    case 'deleteAccount': deleteAccount(); break;
    case 'setSurfType':
      cfg('surfType', id);
      S.cache = {};
      updateSurfBadge();
      renderProfile();
      renderHome();
      break;
    case 'surfLegend':
      el('surf-popup').classList.remove('hidden');
      break;
    case 'closePopup':
      el('surf-popup').classList.add('hidden');
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

// Profile form inputs (change events) — null-safe to survive cached old HTML
function on(id, ev, fn) { const e = document.getElementById(id); if (e) e.addEventListener(ev, fn); }
on('unit-chk', 'change', e => {
  cfg('metric', !e.target.checked);
  const ub = document.querySelector('.unit-btn'); if (ub) ub.textContent = S.cfg.metric ? 'מטרים' : 'פיט';
  reRenderActiveTab();
});
on('alert-toggle', 'change', async e => {
  await enableAlerts(e.target.checked);
  e.target.checked = S.cfg.alertsOn;
});
on('alert-height', 'input', e => cfg('alertH', +e.target.value));
on('alert-start',  'input', e => cfg('alertStart', e.target.value));
on('alert-end',    'input', e => cfg('alertEnd', e.target.value));
on('alert-spot', 'change', e => cfg('alertSpot', e.target.value));
on('wind-unit-chk', 'change', e => {
  cfg('windUnit', e.target.checked ? 'knots' : 'kmh');
  reRenderActiveTab();
});
on('wind-alert-toggle', 'change', async e => {
  if (e.target.checked) {
    const perm = Notification.permission==='granted' ? 'granted' : await Notification.requestPermission();
    cfg('windAlertOn', perm === 'granted');
  } else { cfg('windAlertOn', false); }
  e.target.checked = S.cfg.windAlertOn;
});
on('wind-alert-speed', 'input', e => cfg('windAlertSpeed', +e.target.value));
on('beach-search', 'input', e => renderBeaches(e.target.value));

/* ══════════════════════════════════════
   HELPER
══════════════════════════════════════ */
function el(id) { return document.getElementById(id); }

/* ══════════════════════════════════════
   BOOT
══════════════════════════════════════ */
// Set unit button text
document.querySelector('.unit-btn').textContent = S.cfg.metric ? 'מטרים' : 'פיט';

// Init surf badge
updateSurfBadge();

// Start
renderHome();
setInterval(checkAlert, 30 * 60 * 1000);
const isWKWebView = !!(window.webkit?.messageHandlers);
if (!isWKWebView && 'serviceWorker' in navigator) navigator.serviceWorker.register('./sw.js').catch(() => {});
