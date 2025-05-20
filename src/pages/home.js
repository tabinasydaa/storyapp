import { saveStories, getStoriesFromDb, clearStories } from '../utils/db.js';
import StoryItem from '../components/storyItem.js';

export default async function HomePage() {
  const container = document.createElement('div');
  const token = localStorage.getItem('token');

  if (!token) {
    container.innerHTML = `<h2>Hai Selamat Datang!</h2><p>Silakan login terlebih dahulu untuk melihat cerita.</p>`;
    return container;
  }

  container.innerHTML = `
    <h2>List Cerita</h2>
    <div id="map" style="height: 300px; border-radius: 8px; margin-bottom: 1rem;"></div>
    <ul id="storyList"></ul>
  `;

  const storyList = container.querySelector('#storyList');
  const mapElement = container.querySelector('#map');
  const map = L.map(mapElement).setView([-6.2, 106.8], 5);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

  // Fungsi untuk mengambil cerita dari API menggunakan Proxy
  const getStoriesApi = async (token) => {
    const response = await fetch('/v1/stories?page=1&size=10&location=0', {
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    });

    if (!response.ok) {
      throw new Error('Gagal mengambil cerita');
    }

    return response.json(); // Menyaring data JSON
  };

  // Menampilkan data dari IndexedDB dulu
  const cachedStories = await getStoriesFromDb();
  if (cachedStories.length) {
    console.log('Menampilkan cerita dari cache...');
    cachedStories.forEach(story => {
      const item = StoryItem(story);
      storyList.appendChild(item);
      if (story.lat && story.lon) {
        const marker = L.marker([story.lat, story.lon]).addTo(map);
        marker.bindPopup(`<strong>${story.name}</strong><br/>${story.description}`);
      }
    });
  }

  // Jika online, fetch dari API lalu update IndexedDB dan UI
  if (navigator.onLine) {
    console.log('Mencoba mengambil cerita dari server...');
    try {
      const { listStory } = await getStoriesApi(token);
      // Bersihkan UI dan DB, lalu update
      storyList.innerHTML = '';
      await clearStories();
      await saveStories(listStory);

      listStory.forEach(story => {
        const item = StoryItem(story);
        storyList.appendChild(item);
        if (story.lat && story.lon) {
          const marker = L.marker([story.lat, story.lon]).addTo(map);
          marker.bindPopup(`<strong>${story.name}</strong><br/>${story.description}`);
        }
      });
    } catch (error) {
      container.innerHTML += `<p>Gagal mengambil cerita dari server, tampilkan data offline.</p>`;
    }
  } else {
    container.innerHTML += `<p>Anda sedang offline, menampilkan data terakhir yang tersimpan.</p>`;
  }

  return container;
}
