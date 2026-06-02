/**
 * KanuApp – Service Worker
 * Cacht App Shell + OSM Kartenkacheln für Offline-Betrieb
 */

const CACHE_NAME = 'kanuapp-v7';
const TILE_CACHE = 'kanuapp-tiles-v7';
const MAX_TILES = 600; // ~30-60 MB

// App Shell – immer cachen
const SHELL_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './css/app.css?v=5',
  './css/app.css',
  './js/app.js?v=8',
  './js/app.js',
  './js/map.js?v=4',
  './js/map.js',
  './js/route.js?v=4',
  './js/route.js',
  './js/logbook.js?v=3',
  './js/logbook.js',
  './js/gps.js?v=2',
  './js/gps.js',
  './js/db.js',
  './js/data/rivers.js?v=4',
  './js/data/spots.js?v=4',
  './js/data/rivers.js',
  './js/data/spots.js',
  './icons/icon-192.png',
  './icons/icon-512.png',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
];

// ── Install ──────────────────────────────────────
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(SHELL_ASSETS))
      .then(() => self.skipWaiting())
  );
});

// ── Activate ──────────────────────────────────────
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(k => k !== CACHE_NAME && k !== TILE_CACHE)
          .map(k => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

// ── Fetch ─────────────────────────────────────────
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);

  // OSM Kacheln: Cache-First (Offline-Karten)
  if (
    url.hostname.endsWith('tile.openstreetmap.org') ||
    url.hostname.endsWith('unpkg.com')
  ) {
    e.respondWith(handleTile(e.request));
    return;
  }

  // App Shell: Cache-First, dann Network
  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request).then(resp => {
        if (resp && resp.status === 200) {
          const clone = resp.clone();
          caches.open(CACHE_NAME).then(c => c.put(e.request, clone));
        }
        return resp;
      }).catch(() => {
        // Offline Fallback
        if (e.request.destination === 'document') {
          return caches.match('./index.html');
        }
      });
    })
  );
});

// ── Tile Cache Handler ────────────────────────────
async function handleTile(request) {
  const cache = await caches.open(TILE_CACHE);
  const cached = await cache.match(request);
  if (cached) return cached;

  try {
    const resp = await fetch(request);
    if (resp && resp.status === 200) {
      // LRU: alte Kacheln löschen wenn Cache voll
      const keys = await cache.keys();
      if (keys.length >= MAX_TILES) {
        await cache.delete(keys[0]);
      }
      cache.put(request, resp.clone());
    }
    return resp;
  } catch {
    return new Response('', { status: 503 });
  }
}
