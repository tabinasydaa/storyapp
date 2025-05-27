import { subscribePushNotification } from './api';  // Pastikan fungsi ini diimpor dengan benar

const VAPID_PUBLIC_KEY = 'BFkKmM0gwQevEYHp6IJyGynJVnKdvMJZByjNges0FNpW-1SlHl9vPyltmPf9VjnuGKydXAEH68xDHrqteJ1RpPo';

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = atob(base64);
  return new Uint8Array([...rawData].map((char) => char.charCodeAt(0)));
}

// Fungsi untuk subscribe user ke push notification
export async function subscribeUserToPush() {
  try {
    const registration = await navigator.serviceWorker.ready;

    const existingSubscription = await registration.pushManager.getSubscription();
    if (existingSubscription) {
      console.log('[Push] Subscription lama ditemukan, akan dihapus...');
      await existingSubscription.unsubscribe();
    }

    // Ambil token dari localStorage dan pastikan token ada
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Token tidak ditemukan. Pastikan Anda sudah login terlebih dahulu.');
    }

    // Langsung subscribe ke PushManager
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
    });

    let subscriptionData = subscription.toJSON();

    // Hapus expirationTime dan properti lainnya yang tidak diperlukan
    delete subscriptionData.expirationTime;
    delete subscriptionData.timestamp;

    // Kirim subscription ke server dengan Authorization header yang mengandung token
    const result = await subscribePushNotification(subscriptionData, token);
    console.log('[Push] Subscription sent to server:', result);
  } catch (error) {
    console.error('[Push] Subscription failed:', error.message);
    alert('Gagal berlangganan push notification: ' + error.message);
    throw error;
  }
}
