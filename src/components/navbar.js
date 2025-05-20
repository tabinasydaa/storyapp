import { isLoggedIn, logout } from '../utils/auth.js'; 

export default function Navbar() {
  const nav = document.createElement('nav');
  nav.innerHTML = `
    <ul class="nav-links">
      <li><a href="#/">Home</a></li>
      ${isLoggedIn() ? `
        <li><a href="#/add">Add Story</a></li>
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
      window.location.hash = '/login';
    });
  }

  return nav;
}
