import '../styles/style.css';
import Navbar from './components/navbar.js';
import renderPage from './router/router.js';
import { subscribeUserToPush } from './utils/push.js'; // Impor fungsi subscribeUserToPush

function renderNavbar() {
  const navContainer = document.getElementById('navbar');
  navContainer.innerHTML = '';  // Clear previous navbar
  navContainer.appendChild(Navbar());  // Render new navbar
}

// Call renderNavbar whenever there's a change in localStorage
window.addEventListener('storage', (event) => {
  if (event.key === 'token') {  // Detect changes to the token in localStorage
    renderNavbar();  // Update the navbar
  }
});

window.addEventListener('load', async () => {
  renderNavbar();  // Render navbar on initial load

  renderPage(location.hash);  // Render page based on current URL hash

  // Register service worker and handle push notifications
  if ('serviceWorker' in navigator && 'PushManager' in window) {
    try {
      const registration = await navigator.serviceWorker.register('/service-worker.js');
      console.log('Service Worker registered successfully.');

      if (Notification.permission === 'granted') {
        await subscribeUserToPush();  // Subscribe to push notifications
      }
    } catch (error) {
      console.error('Service Worker registration failed:', error);
    }
  }

  // Request push notification permission
  if ('Notification' in window && Notification.permission === 'default') {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      console.log('Push notification permission granted');
      await subscribeUserToPush();  // Subscribe after permission is granted
    } else {
      console.log('Push notification permission denied');
    }
  }

  // Event listener for the subscribe button for push notifications
  const btnSubscribe = document.getElementById('btnSubscribe');
  if (btnSubscribe) {
    btnSubscribe.addEventListener('click', async () => {
      if (!('serviceWorker' in navigator)) {
        alert('Service Worker is not supported by this browser.');
        return;
      }
      if (!('PushManager' in window)) {
        alert('Push API is not supported by this browser.');
        return;
      }
      if (Notification.permission !== 'granted') {
        alert('Notification permission not granted.');
        return;
      }
      try {
        await subscribeUserToPush();  // Subscribe the user to push notifications
        alert('Successfully subscribed to push notifications!');
      } catch (error) {
        console.error('Push subscription failed:', error);
        alert('Failed to subscribe to push notifications: ' + error.message);
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
