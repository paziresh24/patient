/* eslint-env serviceworker */
// killer
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => {
  e.waitUntil(
    (async () => {
      const names = await caches.keys();
      await Promise.all(names.map(n => caches.delete(n)));
      await self.clients.claim();
      const cs = await self.clients.matchAll({ type: 'window' });
      await self.registration.unregister();
    })(),
  );
});
