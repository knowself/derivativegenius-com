/**
 * Derivative Genius Service Worker - PWA App Shell Cacher
 * 
 * PHASING & CACHING POLICY:
 * - CACHE: App Shell JS/CSS, fonts, public static assets, app icons.
 * - NETWORK-ONLY (STRICT): All API routes (/api/*), prospect data, suppression records,
 *   enrichment results, call notes, auth endpoints. (Prevents stale opt-out or PII leaks).
 */

const CACHE_NAME = 'dg-app-shell-v1';
const STATIC_ASSETS = [
  '/',
  '/manifest.webmanifest',
  '/favicon.ico',
  '/icon.png',
  '/apple-icon.png',
  '/offline',
];

// Install Event: Pre-cache App Shell & Static Assets Only
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate Event: Cleanup Old Cache Versions
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch Event: Network-First for API/Data, Stale-While-Revalidate for App Shell
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // 1. STRICT NETWORK-ONLY FOR API / PRIVATE PROSPECT DATA
  if (url.pathname.startsWith('/api/') || url.pathname.includes('/auth') || event.request.method !== 'GET') {
    event.respondWith(fetch(event.request));
    return;
  }

  // 2. STALE-WHILE-REVALIDATE FOR APP SHELL & STATIC ASSETS
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          // If offline and requesting page navigation, serve cached offline shell
          if (event.request.mode === 'navigate') {
            return caches.match('/offline') || caches.match('/');
          }
        });

      return cachedResponse || fetchPromise;
    })
  );
});
