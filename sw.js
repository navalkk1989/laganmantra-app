// LaganMantra service worker: lets the app install and open even with weak internet
const C = "laganmantra-v3";
const FILES = ["./", "./index.html", "./manifest.webmanifest", "./icon-192.png", "./icon-512.png"];
self.addEventListener("install", e => { e.waitUntil(caches.open(C).then(c => c.addAll(FILES)).then(() => self.skipWaiting())); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(k => Promise.all(k.filter(x => x !== C).map(x => caches.delete(x)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", e => {
  const r = e.request;
  if (r.method !== "GET" || new URL(r.url).origin !== location.origin) return; // Google Sheet calls go straight to the internet
  e.respondWith(fetch(r).then(res => { if (res.status === 200) { const cp = res.clone(); caches.open(C).then(c => c.put(r, cp)).catch(() => {}); } return res; })
    .catch(() => caches.match(r).then(m => m || caches.match("./index.html"))));
});
