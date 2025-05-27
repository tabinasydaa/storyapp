import HomePage from '../pages/home.js';
import LoginPage from '../pages/login.js';
import RegisterPage from '../pages/register.js';
import AddStoryPage from '../pages/addStory.js';
import SaveStoryPage from '../pages/saveStory.js';  // Pastikan halaman Simpan Cerita ditambahkan

const routes = {
  '/': HomePage,
  '/login': LoginPage,
  '/register': RegisterPage,
  '/add': AddStoryPage,
  '/save': SaveStoryPage,  // Rute untuk Simpan Cerita
};

async function renderPage(hash) {
  const path = hash.replace('#', '') || '/';
  const pageFunc = routes[path];

  if (!pageFunc) {
    document.body.innerHTML = '<h2>404 - Halaman tidak ditemukan</h2>';
    return;
  }

  const page = await pageFunc();

  const content = document.getElementById('app');
  if (document.startViewTransition) {
    document.startViewTransition(() => {
      content.innerHTML = '';
      content.appendChild(page);
    });
  } else {
    content.innerHTML = '';
    content.appendChild(page);
  }
}

window.addEventListener('hashchange', () => renderPage(location.hash));
window.addEventListener('load', () => renderPage(location.hash));

export default renderPage;
