const CACHE_NAME = 'phuquoc-family-v1';
const ASSETS = [
  '/phu-quoc-trip/family-app/',
  '/phu-quoc-trip/family-app/index.html',
  '/phu-quoc-trip/family-app/manifest.json',
  '/phu-quoc-trip/family-app/hero.jpg',
  '/phu-quoc-trip/family-app/baikem.jpg',
  '/phu-quoc-trip/family-app/cablecar.jpg',
  '/phu-quoc-trip/family-app/kayak.jpg',
  '/phu-quoc-trip/family-app/snorkel.jpg',
  '/phu-quoc-trip/family-app/safari.jpg',
  '/phu-quoc-trip/family-app/sunset.jpg',
  '/phu-quoc-trip/family-app/villapool.jpg',
  '/phu-quoc-trip/family-app/beach.jpg',
  '/phu-quoc-trip/family-app/seafood.jpg'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then(cached => {
      const networkFetch = fetch(event.request).then(response => {
        if (response && response.status === 200) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return response;
      }).catch(() => cached);
      return cached || networkFetch;
    })
  );
});
