import webPush from 'web-push';  // Menggunakan import untuk ES module

// Menghasilkan VAPID keys
const { publicKey, privateKey } = webPush.generateVAPIDKeys();

console.log('Public Key:', publicKey);
console.log('Private Key:', privateKey);
