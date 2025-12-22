/* =========================================================
   Service Worker – UdL VCard PWA
   Estratègia: Offline First (Cache + Network Fallback)
========================================================= */

const CACHE_VERSION = "udl-vcard-v1.0.0";
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const RUNTIME_CACHE = `${CACHE_VERSION}-runtime`;

/* =========================================================
   Fitxers essencials (app shell)
========================================================= */

const STATIC_ASSETS = [
  "./",
  "./index.html",
  "./style.css",
  "./app.js",
  "./manifest.json",

  // Llibreria QR local
  "./assets/js/qr-code-styling.js",

  // Icones / imatges
  "./assets/logo-192.png",
  "./assets/logo-512.png",

  //Fonts
  "./assets/fonts/material-icons.ttf"
];

/* =========================================================
   INSTALL
========================================================= */

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then(cache => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

/* =========================================================
   ACTIVATE
========================================================= */

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(k => !k.startsWith(CACHE_VERSION))
          .map(k => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

/* =========================================================
   FETCH
========================================================= */

self.addEventListener("fetch", event => {
  const req = event.request;

  // Només GET
  if (req.method !== "GET") return;

  // Ignorem chrome-extension, etc.
  if (!req.url.startsWith(self.location.origin)) return;

  event.respondWith(
    caches.match(req).then(cached => {
      if (cached) {
        return cached;
      }

      return fetch(req)
        .then(res => {
          // Només cachegem respostes bones
          if (res.status === 200) {
            const resClone = res.clone();
            caches.open(RUNTIME_CACHE).then(cache => {
              cache.put(req, resClone);
            });
          }
          return res;
        })
        .catch(() => {
          // Fallback final: index.html (SPA/PWA)
          if (req.destination === "document") {
            return caches.match("./index.html");
          }
        });
    })
  );
});
