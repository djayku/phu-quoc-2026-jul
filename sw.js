const CACHE_NAME = 'phuquoc-2026-v1';
const ASSETS = [
  '/phu-quoc-trip/',
  '/phu-quoc-trip/index.html',
  '/phu-quoc-trip/manifest.json',
  '/phu-quoc-trip/images/phuquoc_aerial_v2.png',
  '/phu-quoc-trip/images/sun_tropical_new.png',
  '/phu-quoc-trip/images/movenpick_villa_new.png',
  '/phu-quoc-trip/images/cable_car.png',
  '/phu-quoc-trip/images/starfish_beach.png',
  '/phu-quoc-trip/images/night_market_new.png',
  '/phu-quoc-trip/images/grandworld.png'
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
