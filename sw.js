/* TuniGuide Service Worker - offline caching */
const CACHE_NAME = 'tuniguide-v1-2025-11-30';
const CORE_ASSETS = [
  '/',
  '/index.html',
  '/onboarding.html',
  '/map.html',
  '/place-details.html',
  '/groups.html',
  '/guides.html',
  '/dashboard.html',
  '/offline.html',
  '/manifest.webmanifest',
  '/js/main.js',
  '/js/data.js',
  '/js/map.js',
  '/js/onboarding.js',
  '/js/place-details.js',
  '/js/groups.js',
  '/js/guides.js',
  '/js/dashboard.js',
  '/assets/images/logo.jpg',
  '/assets/images/loading.jpg',
  '/assets/images/hero.jpg',
  '/assets/images/map.jpg',
  '/assets/images/map.svg'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(CORE_ASSETS.map((u) => new Request(u, { cache: 'reload' })));
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)));
      await self.clients.claim();
    })()
  );
});

function isSameOrigin(url) {
  try { return new URL(url).origin === self.location.origin; } catch { return false; }
}

self.addEventListener('fetch', (event) => {
  const req = event.request;

  // Handle navigation requests (SPA + multi-page)
  if (req.mode === 'navigate') {
    event.respondWith(
      (async () => {
        try {
          const fresh = await fetch(req);
          const cache = await caches.open(CACHE_NAME);
          cache.put(req, fresh.clone());
          return fresh;
        } catch (e) {
          const cacheMatch = await caches.match(req);
          return cacheMatch || caches.match('/offline.html');
        }
      })()
    );
    return;
  }

  // Same-origin static assets: cache-first
  if (isSameOrigin(req.url)) {
    event.respondWith(
      (async () => {
        const cacheMatch = await caches.match(req);
        if (cacheMatch) return cacheMatch;
        try {
          const fresh = await fetch(req);
          const cache = await caches.open(CACHE_NAME);
          cache.put(req, fresh.clone());
          return fresh;
        } catch (e) {
          // last resort for images: return logo if available
          if (req.destination === 'image') return caches.match('/assets/images/logo.jpg');
          throw e;
        }
      })()
    );
    return;
  }

  // Cross-origin (Mapbox, OpenWeather) - network only, no offline fallback
  // Let them fail silently when offline
});
