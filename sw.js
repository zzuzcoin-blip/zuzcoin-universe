const CACHE_NAME = "zuzcoin-wallet-v3";
const urlsToCache = [
  "/",
  "/zuzcoin-wallet",
  "/manifest.json",
  "https://i.ibb.co/XrtMMvSn/Zuz.png",
];

self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.addAll(urlsToCache);
    }),
  );
});

self.addEventListener("fetch", function (event) {
  event.respondWith(
    caches.match(event.request).then(function (response) {
      if (response) {
        return response;
      }
      return fetch(event.request);
    }),
  );
});
