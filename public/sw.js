// CineVantaara Cinema Ecosystem Service Worker (v2.5)
const CACHE_NAME = 'cinevantaara-v2.5';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json?v=2.5',
  '/icon-192.png',
  '/icon-512.png',
  '/favicon.png',
  '/apple-touch-icon.png',
  '/brand/logo-master.png',
  '/brand/logo-imax-gold.png',
  '/brand/logo-cyber-neon.png',
  '/brand/logo-vintage-noir.png',
  '/brand/logo-royal-velvet.png',
  '/brand/logo-emerald-studio.png',
  '/brand/logo-anamorphic-blue.png'
];

self.addEventListener('install', (event) => {
  // Force new service worker to take control immediately
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE).catch(() => {});
    })
  );
});

self.addEventListener('activate', (event) => {
  // Purge ALL old caches immediately
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[SW] Purging old cache:', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // Direct pass-through for API, Websockets, and APK downloads
  if (
    url.pathname.startsWith('/api') ||
    url.pathname.startsWith('/ai-api') ||
    url.pathname.startsWith('/ws') ||
    url.pathname.endsWith('.apk') ||
    url.protocol === 'ws:' ||
    url.protocol === 'wss:'
  ) {
    return;
  }

  // Network-first strategy for HTML and brand logos so updates appear immediately
  if (
    event.request.headers.get('accept')?.includes('text/html') ||
    url.pathname.startsWith('/brand/') ||
    url.pathname.includes('icon-') ||
    url.pathname.includes('manifest.json')
  ) {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseClone));
          }
          return networkResponse;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // Cache-first fallback for static hashed assets
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseClone));
        }
        return networkResponse;
      });
    })
  );
});
