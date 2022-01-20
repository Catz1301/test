// import { CacheableResponsePlugin } from "workbox-cacheable-response/CacheableResponsePlugin";
// import { CacheFirst } from "workbox-strategies/CacheFirst";
// import { createHandlerForURL } from "workbox-precaching/createHandlerForURL";
// import { ExpirationPlugin } from "workbox-expiration/ExpirationPlugin";
// import { NavigationRoute } from "workbox-routing/NavigationRoute";
import { precacheAndRoute } from "workbox-precaching/precacheAndRoute";
// import { registerRoute } from "workbox-routing/registerRoute";

precacheAndRoute(self.__WB_MANIFEST);

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});
// self.addEventListener();