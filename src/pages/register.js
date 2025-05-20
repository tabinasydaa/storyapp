import { register } from '../utils/api.js';

export default async function RegisterPage() {
  const container = document.createElement('div');
  container.innerHTML = `
    <h2>Register</h2>
    <form id="registerForm">
      <label for="name">Nama</label>
      <input id="name" type="text" required />
      <label for="email">Email</label>
      <input id="email" type="email" required />
      <label for="password">Password</label>
      <input id="password" type="password" required />
      <button type="submit">Daftar</button>
    </form>
  `;

  container.querySelector('#registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = container.querySelector('#name').value;
    const email = container.querySelector('#email').value;
    const password = container.querySelector('#password').value;

    const result = await register(name, email, password);

    if (!result.error) {
      alert('Registrasi berhasil! Silakan login.');
      window.location.hash = '/login';
    } else {
      alert(result.message);
    }
  });

  return container;
}
