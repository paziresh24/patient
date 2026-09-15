/* Doctor-home shell cache — client-only, registered per device when doctor-home-device is set. */
const CACHE_NAME = 'p24-doctor-shell-v1';

const normalizePath = pathname => {
  const trimmed = pathname.replace(/\/$/, '');
  return trimmed === '' ? '/' : trimmed;
};

const isShellDocument = pathname => {
  const path = normalizePath(pathname);
  return path === '/' || path === '/apphome' || path === '/_';
};

const isShellAsset = url => {
  if (url.origin !== self.location.origin) return false;
  if (url.pathname.startsWith('/_next/static/')) return true;
  return isShellDocument(url.pathname);
};

self.addEventListener('install', event => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches
      .keys()
      .then(keys =>
        Promise.all(keys.filter(key => key.startsWith('p24-doctor-shell-') && key !== CACHE_NAME).map(key => caches.delete(key))),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);
  if (!isShellAsset(url)) return;

  event.respondWith(
    caches.open(CACHE_NAME).then(async cache => {
      const cached = await cache.match(event.request);

      const networkFetch = fetch(event.request)
        .then(response => {
          if (response.ok) {
            void cache.put(event.request, response.clone());
          }
          return response;
        })
        .catch(error => {
          if (cached) return cached;
          throw error;
        });

      if (cached) {
        void networkFetch.catch(() => undefined);
        return cached;
      }

      return networkFetch;
    }),
  );
});
