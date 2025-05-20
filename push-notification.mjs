import express from 'express';
import webPush from 'web-push';
import bodyParser from 'body-parser';
import cors from 'cors';  // Middleware untuk CORS
import jwt from 'jsonwebtoken';  // Import jsonwebtoken untuk verifikasi token

const app = express();
const port = 3001;  // Bisa ganti port sesuai kebutuhan

const vapidPublicKey = 'BFkKmM0gwQevEYHp6IJyGynJVnKdvMJZByjNges0FNpW-1SlHl9vPyltmPf9VjnuGKydXAEH68xDHrqteJ1RpPo';  // Ganti dengan public key yang baru
const vapidPrivateKey = '6yXGHwRUz4sexxIAP1gqUk2UUTUeIU70qWGtwFdSwoo';  // Ganti dengan private key yang baru

// Set VAPID details
webPush.setVapidDetails(
  'mailto:your-email@example.com',  // Ganti dengan email Anda
  vapidPublicKey,
  vapidPrivateKey
);

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Route GET untuk root "/"
app.get('/', (req, res) => {
  res.send('Backend server is running!');
});

// Endpoint untuk menerima subscription
app.post('/notifications/subscribe', (req, res) => {
  const subscription = req.body;

  // Validasi subscription
  if (subscription.expirationTime) {
    delete subscription.expirationTime;
  }

  console.log('New subscription:', subscription);

  // Kirim respons
  res.status(201).json({
    message: 'Successfully subscribed to push notification!'
  });
});

// Endpoint untuk mengirim push notification
app.post('/send-notification', (req, res) => {
  const subscription = req.body;

  // Validasi data yang diterima
  const { endpoint, p256dh, auth, title, body } = subscription;

  if (!endpoint || !p256dh || !auth) {
    return res.status(400).json({ message: 'Missing required fields (endpoint, p256dh, auth)' });
  }

  // Mengonversi p256dh dan auth ke format Uint8Array yang dibutuhkan oleh web-push
  const pushSubscription = {
    endpoint,
    keys: {
      p256dh,
      auth,
    }
  };

  const payload = JSON.stringify({
    title: title || 'Story Baru!',
    body: body || 'Ada cerita baru yang bisa kamu baca!',
  });

  // Kirim push notification
  webPush.sendNotification(pushSubscription, payload)
    .then(response => {
      console.log('Push notification sent successfully:', response);
      res.status(200).json({ message: 'Notification sent successfully' });
    })
    .catch(error => {
      console.error('Error sending push notification:', error);
      res.status(500).json({
        message: 'Failed to send notification',
        error: error.message
      });
    });
});

// Endpoint untuk memverifikasi token
app.get('/verify-token', (req, res) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Token di header 'Authorization' dengan format 'Bearer token'
  if (!token) {
    return res.status(400).json({ message: 'Token tidak ditemukan' });
  }

  try {
    const decoded = jwt.verify(token, vapidPrivateKey);
    res.status(200).json({ message: 'Token valid', user: decoded });
  } catch (err) {
    console.error('Token verification error:', err);
    res.status(401).json({ message: 'Token invalid atau kedaluwarsa' });
  }
});

// Jalankan server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
