import { subscribePushNotification } from './api';

const VAPID_PUBLIC_KEY = 'BFkKmM0gwQevEYHp6IJyGynJVnKdvMJZByjNges0FNpW-1SlHl9vPyltmPf9VjnuGKydXAEH68xDHrqteJ1RpPo';

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = atob(base64);
  return new Uint8Array([...rawData].map((char) => char.charCodeAt(0)));
}

export async function subscribeUserToPush() {
  try {
    console.log('[Push] Menunggu service worker siap...');
    const registration = await navigator.serviceWorker.ready;

    const existingSubscription = await registration.pushManager.getSubscription();
    if (existingSubscription) {
      console.log('[Push] Subscription lama ditemukan, akan dihapus...');
      await existingSubscription.unsubscribe();
    }

    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
    });

    const subscriptionData = subscription.toJSON();

    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Token tidak ditemukan. Pastikan sudah login dulu.');
    }

    console.log('[Push] Token yang digunakan:', token);

    const result = await subscribePushNotification(subscriptionData, token);
    console.log('[Push] Subscription sent to server:', result);
  } catch (error) {
    console.error('[Push] Subscription failed:', error.message);
    throw error;
  }
}
