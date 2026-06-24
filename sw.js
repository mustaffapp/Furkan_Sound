const CACHE_NAME = 'furkan-sound-v2';

const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './speaker_icon.png',
  './light_icon.png',
  './system_icon.png',
  './settings_icon.png',
  './con_icon.png',
  './Fsound_font.woff2',
  './Fsound_logo.png',
  './app_logo.png'
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
  const url = e.request.url;
  if (!url.startsWith('http') || url.includes('192.168.4.1') || url.includes('/status') || url.includes('/komut')) {
    return;
  }
  e.respondWith(
    caches.match(e.request).then((cachedResponse) => {
      return cachedResponse || fetch(e.request);
    })
  );
});
