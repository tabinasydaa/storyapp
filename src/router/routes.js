import HomePage from '../pages/home.js';
import LoginPage from '../pages/login.js';
import RegisterPage from '../pages/register.js';
import AddStoryPage from '../pages/addStory.js';

const routes = {
  '/': HomePage,
  '/login': LoginPage,
  '/register': RegisterPage,
  '/add': AddStoryPage,
  '/404': async () => {
    const el = document.createElement('div');
    el.innerText = 'Page not found';
    return el;
  }
};

export default routes;
