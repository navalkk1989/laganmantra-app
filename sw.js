// LaganMantra service worker (v5): the saved copy of the website opens at once; a fresh copy is downloaded in the background
const C = "laganmantra-v5";
self.addEventListener("install", e => { self.skipWaiting(); e.waitUntil(caches.open(C).then(c => c.addAll(["./"])).catch(() => {})); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(k => Promise.all(k.filter(x => x !== C).map(x => caches.delete(x)))).then(() => self.clients.claim())); });
const ver = t => ((t || "").match(/WEBV="([\d.]+)"/) || [])[1] || "";
self.addEventListener("fetch", e => {
  const r = e.request, u = new URL(r.url);
  if (r.method !== "GET" || u.origin !== location.origin) return;            // Google Sheet / payments go straight to the internet
  if (/LaganMantraApp/.test(self.navigator.userAgent || "")) return;          // the Android app has its own copy
  const scope = new URL(self.registration.scope).pathname;
  if (r.mode === "navigate" && (u.pathname === scope || u.pathname === scope + "index.html")) {
    if (/[?&]fresh=/.test(u.search)) {                                         // "tap to refresh": take the newest copy from the internet
      e.respondWith(fetch(r, { cache: "no-store" }).then(async res => { if (res.ok) { const t = await res.clone().text(); if (/WEBV=/.test(t)) (await caches.open(C)).put("./", new Response(t, { headers: { "Content-Type": "text/html; charset=utf-8" } })); } return res; }).catch(() => caches.match("./")));
      return;
    }
    e.respondWith((async () => {
      const c = await caches.open(C), saved = await c.match("./");
      const fresh = fetch(r, { cache: "no-store" }).then(async res => {
        if (res.ok) {
          const t = await res.clone().text();
          if (t.length > 1000 && /WEBV=/.test(t)) {
            const old = saved ? ver(await saved.clone().text()) : "";
            await c.put("./", new Response(t, { headers: { "Content-Type": "text/html; charset=utf-8" } }));
            if (saved && old && old !== ver(t)) (await self.clients.matchAll()).forEach(x => x.postMessage({ t: "lm-new", v: ver(t) }));
          }
        }
        return res;
      });
      if (saved) { e.waitUntil(fresh.catch(() => {})); return saved; }       // instant open from the saved copy
      return fresh.catch(() => caches.match("./").then(m => m || Response.error()));
    })());
    return;
  }
  if (/\.(webp|png|webmanifest)$/.test(u.pathname)) {                         // pictures: from the saved copy first (fast)
    e.respondWith(caches.match(r, { ignoreSearch: true }).then(m => m || fetch(r).then(res => { if (res.ok) { const cp = res.clone(); caches.open(C).then(c => c.put(r, cp)).catch(() => {}); } return res; })));
  }
});
