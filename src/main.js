import '../styles/style.css';
import Navbar from './components/navbar.js';
import renderPage from './router/router.js';
import { subscribeUserToPush } from './utils/push.js';

function renderNavbar() {
  const navContainer = document.getElementById('navbar');
  navContainer.innerHTML = '';
  navContainer.appendChild(Navbar());
}

window.addEventListener('load', async () => {
  renderNavbar();
  renderPage(location.hash);

  if ('serviceWorker' in navigator && 'PushManager' in window) {
    try {
      const registration = await navigator.serviceWorker.register('/service-worker.js');
      console.log('Service Worker berhasil didaftarkan');

      // Cek permission saat service worker sudah terdaftar
      if (Notification.permission === 'granted') {
        await subscribeUserToPush();
      }
    } catch (error) {
      console.error('Service Worker gagal didaftarkan:', error);
    }
  }

  // Minta izin Notification jika default
  if ('Notification' in window && Notification.permission === 'default') {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      console.log('Izin push notification diberikan');
      await subscribeUserToPush(); // baru subscribe jika izin diberikan
    } else {
      console.log('Izin push notification ditolak');
    }
  }

  // Pasang event listener di tombol subscribe, jika ada
  const btnSubscribe = document.getElementById('btnSubscribe');
  if (btnSubscribe) {
    btnSubscribe.addEventListener('click', async () => {
      if (!('serviceWorker' in navigator)) {
        alert('Service Worker tidak didukung di browser ini.');
        return;
      }
      if (!('PushManager' in window)) {
        alert('Push API tidak didukung di browser ini.');
        return;
      }
      if (Notification.permission !== 'granted') {
        alert('Izin notifikasi belum diberikan.');
        return;
      }
      try {
        await subscribeUserToPush();
        alert('Berhasil berlangganan push notification!');
      } catch (error) {
        console.error('Push subscription failed:', error);
        alert('Gagal berlangganan push notification: ' + error.message);
      }
    });
  }

  // Skip link accessibility
  document.querySelector('.skip-link')?.addEventListener('click', (e) => {
    e.preventDefault();
    const mainContent = document.getElementById('app');
    if (mainContent) {
      mainContent.focus({ preventScroll: false });
    }
  });
});
