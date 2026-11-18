/* Service Worker：主站应用壳离线缓存；研究模式数据按访问运行时缓存。 */
const VERSION = 'europa-2026-11-18-5';
const CACHE = 'atlas-' + VERSION;

const CORE = [
  './',
  './index.html',
  './wars.html',
  './research.html',
  './install.html',
  './manifest.webmanifest',
  './css/style.css',
  './css/wars.css',
  './css/research.css',
  './css/install.css',
  './js/app.js',
  './js/wars.js',
  './js/research.js',
  './js/pwa.js',
  './data/events.js',
  './data/events-meta.js',
  './data/events-extra.js',
  './data/event-significance.js',
  './data/wars.js',
  './data/war-details.js',
  './data/borders.js',
  './vendor/d3.min.js',
  './vendor/topojson-client.min.js',
  './assets/icons/icon-32.png',
  './assets/icons/icon-180.png',
  './assets/icons/icon-192.png',
  './assets/icons/icon-512.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE)
      .then((cache) => cache.addAll(CORE))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE).then((cache) => cache.put(request, copy));
          return response;
        })
        .catch(() => caches.match(request, { ignoreSearch: true })
          .then((cached) => cached || caches.match('./index.html'))),
    );
    return;
  }

  event.respondWith(
    caches.match(request).then((cached) => {
      const network = fetch(request)
        .then((response) => {
          if (response && response.ok) {
            const copy = response.clone();
            caches.open(CACHE).then((cache) => cache.put(request, copy));
          }
          return response;
        })
        .catch(() => cached);
      return cached || network;
    }),
  );
});
