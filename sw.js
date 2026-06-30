const CACHE = 'ww-v1';
const ASSETS = ['./', './index.html', './styles.css', './app.js'];

self.addEventListener('install', e => e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS))));
self.addEventListener('activate', e => e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))));
self.addEventListener('fetch', e => {
  if (e.request.url.includes('open-meteo') || e.request.url.includes('unsplash')) return;
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)));
});
self.addEventListener('message', e => {
  if (e.data?.type === 'notify') self.registration.showNotification(e.data.title, { body: e.data.body, icon: './icon.png' });
});
