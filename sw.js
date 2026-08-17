const CACHE_NAME = "favor‑tool‑v2";
// 需要离线缓存的资源
const CACHE_FILES = [
    "index.html",
    "manifest.json",
    "icon‑192.png",
    "icon‑512.png"
];

// 安装阶段：缓存资源
self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => cache.addAll(CACHE_FILES))
            .then(() => self.skipWaiting())
    );
});

// 请求拦截：缓存优先，离线可用
self.addEventListener("fetch", (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((cachedRes) => {
                // 命中缓存返回缓存，否则走网络请求
                return cachedRes || fetch(event.request);
            })
    );
});

// 激活阶段：清理旧版本缓存
self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames
                    .filter((name) => name !== CACHE_NAME)
                    .map((oldCache) => caches.delete(oldCache))
            );
        }).then(() => self.clients.claim())
    );
});
