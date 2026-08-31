const CACHE='phone-ledger-ipad-v6';
const FILES=['./','./index.html','./app.js?v=6','./style.css?v=6','./manifest.webmanifest','./icon-v4-180.png','./icon-v4-512.png'];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(FILES))));
self.addEventListener('activate',event=>event.waitUntil(self.clients.claim()));
self.addEventListener('fetch',event=>event.respondWith(caches.match(event.request).then(hit=>hit||fetch(event.request))));
