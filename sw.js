const CACHE_NAME = 'mgs-cro-v1';
const ASSETS = [
  '/cro-observation-app/',
  '/cro-observation-app/index.html',
  '/cro-observation-app/manifest.json',
  '/cro-observation-app/icon-192.png',
  '/cro-observation-app/icon-512.png'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  // Network first for API calls
  if (e.request.url.includes('script.google.com')) {
    e.respondWith(fetch(e.request).catch(() => new Response('{"status":"error","message":"Offline"}')));
    return;
  }
  // Cache first for app assets
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});
