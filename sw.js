// LaganMantra service worker (v4): keeps ONE offline copy of the website, never piles up copies
const C = "laganmantra-v4";
self.addEventListener("install", e => { self.skipWaiting(); e.waitUntil(caches.open(C).then(c => c.addAll(["./", "./manifest.webmanifest"])).catch(() => {})); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(k => Promise.all(k.filter(x => x !== C).map(x => caches.delete(x)))).then(() => self.clients.claim())); });
function withTimeout(p, ms) { return new Promise((ok, no) => { const t = setTimeout(() => no(new Error("timeout")), ms); p.then(r => { clearTimeout(t); ok(r); }, e => { clearTimeout(t); no(e); }); }); }
self.addEventListener("fetch", e => {
  const r = e.request, u = new URL(r.url);
  if (r.method !== "GET" || u.origin !== location.origin) return;            // Google Sheet / payments go straight to the internet
  if (/LaganMantraApp/.test(self.navigator.userAgent || "")) return;          // the Android app has its own copy
  if (r.mode === "navigate") {                                                // the page: fresh from the internet, saved as ONE copy
    e.respondWith(withTimeout(fetch(r), 8000).then(res => { if (res.ok) { const cp = res.clone(); caches.open(C).then(c => c.put("./", cp)).catch(() => {}); } return res; })
      .catch(() => caches.match("./").then(m => m || fetch(r))));
    return;
  }
  if (/\.(webp|png|webmanifest)$/.test(u.pathname)) {                         // pictures: from the saved copy first (fast)
    e.respondWith(caches.match(r, { ignoreSearch: true }).then(m => m || fetch(r).then(res => { if (res.ok) { const cp = res.clone(); caches.open(C).then(c => c.put(r, cp)).catch(() => {}); } return res; })));
  }
});
