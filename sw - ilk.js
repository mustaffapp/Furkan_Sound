const CACHE_NAME = 'furkan-sound-v1';
const ASSETS = [
  'index.html',
  'manifest.json',
  'speaker_icon.png',
  'light_icon.png',
  'system_icon.png',
  'settings_icon.png',
  'con_icon.png',
  'note_bg.jpg',
  'myFont.otf'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  if (e.request.url.includes('/status') || e.request.url.includes('/komut')) {
    return;
  }
  e.respondWith(
    caches.match(e.request).then((cachedResponse) => {
      return cachedResponse || fetch(e.request);
    })
  );
});