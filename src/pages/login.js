import { login } from '../utils/api.js';  // Pastikan 'login' diimpor dengan benar

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
      const result = await login(email, password);  // Memanggil fungsi login yang telah diimpor

      if (!result.error) {
        const token = result.loginResult.token;
        localStorage.setItem('token', token); // Menyimpan token ke localStorage
        console.log('Token disimpan:', token); 

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
