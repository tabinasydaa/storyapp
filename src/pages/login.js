import { login, subscribePushNotification } from '../utils/api.js';

export default async function LoginPage() {
  const container = document.createElement('div');
  container.innerHTML = `
    <h2>Login</h2>
    <form id="loginForm">
      <label for="email">Email</label>
      <input id="email" type="email" required />
      <label for="password">Password</label>
      <input id="password" type="password" required />
      <button type="submit">Login</button>
    </form>
  `;

  container.querySelector('#loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = container.querySelector('#email').value;
    const password = container.querySelector('#password').value;

    try {
      const result = await login(email, password);

      if (!result.error) {
        const token = result.loginResult.token;
        localStorage.setItem('token', token);

        if ('serviceWorker' in navigator && 'PushManager' in window) {
          const registration = await navigator.serviceWorker.ready;

          const subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: 'BFkKmM0gwQevEYHp6IJyGynJVnKdvMJZByjNges0FNpW-1SlHl9vPyltmPf9VjnuGKydXAEH68xDHrqteJ1RpPo',
          });

          await subscribePushNotification(subscription.toJSON(), token);
          console.log('Push notification berhasil disubscribe!');
        } else {
          console.warn('Browser tidak mendukung push notification');
        }

        window.location.hash = '/';
      } else {
        alert(result.message);
      }
    } catch (err) {
      alert('Login gagal: ' + err.message);
    }
  });

  return container;
}
