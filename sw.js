const CACHE = 'ww-v12';
const ASSETS = ['./', './index.html', './styles.css?v=12', './app.js?v=12', './manifest.json'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener('fetch', e => {
  if (e.request.url.includes('open-meteo') || e.request.url.includes('fonts') || e.request.url.includes('cdn.jsdelivr') || e.request.url.includes('unpkg')) return;
  // HTML: always network-first to get fresh content
  if (e.request.mode === 'navigate') {
    e.respondWith(fetch(e.request).catch(() => caches.match('./index.html')));
    return;
  }
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request).then(res => {
    const c = res.clone();
    caches.open(CACHE).then(cache => cache.put(e.request, c));
    return res;
  })));
});
self.addEventListener('message', e => {
  if (e.data?.type === 'notify') self.registration.showNotification(e.data.title, { body: e.data.body, icon: './icon.png' });
});
