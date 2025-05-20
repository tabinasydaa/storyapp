const CACHE_NAME = 'story-app-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/styles/style.css',
  '/vite.svg',
  '/src/main.js',
  'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600&display=swap',
  'https://unpkg.com/leaflet/dist/leaflet.css'
];

// Cache saat install
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

// Intersepsi fetch
self.addEventListener('fetch', (event) => {
  // Jangan ganggu request ke backend lokal
  if (event.request.url.includes('localhost:3001')) return;

  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        // Kalau ketemu di cache, pakai
        if (cachedResponse) {
          console.log('Serving from cache:', event.request.url);
          return cachedResponse;
        }

        // Kalau tidak ada, ambil dari network dan simpan
        return fetch(event.request)
          .then((networkResponse) => {
            // Cegah caching blob, atau respons error
            if (!networkResponse || networkResponse.status !== 200 || networkResponse.type === 'opaque') {
              return networkResponse;
            }

            // Simpan ke cache hanya jika bukan dari server eksternal (untuk menghindari error CORS)
            const requestURL = new URL(event.request.url);
            const isExternalImage = requestURL.hostname !== self.location.hostname;

            if (!isExternalImage) {
              return caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, networkResponse.clone());
                return networkResponse;
              });
            }

            // Jika external, jangan cache (untuk amankan CORS)
            return networkResponse;
          })
          .catch((error) => {
            console.error('Failed to fetch:', event.request.url);
            return new Response('', { status: 503, statusText: 'Service Unavailable' });
          });
      })
  );
});

// Notifikasi push
self.addEventListener('push', function(event) {
  event.waitUntil((async () => {
    let notificationData;
    try {
      notificationData = event.data.json();
    } catch (e) {
      const fallbackText = await event.data.text();
      notificationData = {
        title: 'Notifikasi',
        body: fallbackText || 'Pesan tidak tersedia',
      };
    }

    const title = notificationData.title || 'Notifikasi';
    const options = {
      body: notificationData.body || 'Ada notifikasi baru!',
      icon: '/icons/icon-192x192.png',
      badge: '/icons/badge-72x72.png',
    };

    self.registration.showNotification(title, options);
  })());
});
