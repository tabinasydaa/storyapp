import { isLoggedIn, logout } from '../utils/auth.js';

export default function Navbar() {
  const nav = document.createElement('nav');
  nav.innerHTML = `
    <ul class="nav-links">
      <li><a href="#/">Home</a></li>
      ${isLoggedIn() ? `
        <li><a href="#/add">Add Story</a></li>
        <li><a href="#/save">Simpan Cerita</a></li> <!-- Menu untuk Simpan Cerita -->
        <li><a href="#" id="logout">Logout</a></li>
      ` : `
        <li><a href="#/login">Login</a></li>
        <li><a href="#/register">Register</a></li>
      `}
    </ul>
  `;

  if (isLoggedIn()) {
    nav.querySelector('#logout').addEventListener('click', () => {
      logout();
      window.localStorage.removeItem('token');  // Clear token after logout
      window.location.hash = '/login';  // Redirect to login page
      window.location.reload();  // Force page reload to update navbar
    });
  }

  return nav;
}
