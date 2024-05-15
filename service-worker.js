const CACHE_NAME = 'hellpad-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/styles.css',
  '/scripts.js',
  '/manifest.json',
  '/sounds/activation.mp3',
  '/sounds/error.mp3',
  '/sounds/button-up.mp3',
  '/sounds/button-down.mp3',
  '/sounds/button-left.mp3',
  '/sounds/button-right.mp3'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request).then(
          newResponse => {
            if (newResponse && newResponse.status === 200 && newResponse.type === 'basic') {
              let responseToCache = newResponse.clone();
              caches.open(CACHE_NAME).then(cache => {
                cache.put(event.request, responseToCache);
              });
            }
            return newResponse;
          }
        );
      })
  );
});
