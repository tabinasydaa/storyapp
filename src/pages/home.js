import { BASE_URL } from '../utils/api.js';
import { getStoriesFromDb, saveStories, clearStories } from '../utils/db.js';

console.log('BASE_URL in home.js:', BASE_URL);

// Fungsi untuk memuat gambar dengan fallback jika gagal
const loadImageWithFallback = (src, fallbackSrc) => {
  const img = new Image();
  img.src = src;
  img.onerror = () => {
    img.src = fallbackSrc;
  };
  return img;
};

// Fungsi untuk membuat item cerita
const StoryItem = (story) => {
  const item = document.createElement('li');
  item.classList.add('story-card');
  item.innerHTML = `
    <div style="border: 1px solid #ddd; padding: 10px; border-radius: 8px; margin-bottom: 10px;">
      <h3>${story.name}</h3>
      <p>${story.description}</p>
      <button class="save-button" style="background-color: #4CAF50; color: white; padding: 5px 10px; border: none; cursor: pointer;">Simpan Cerita</button>
    </div>
  `;

  // Event listener untuk tombol simpan cerita
  item.querySelector('.save-button').addEventListener('click', () => {
    saveStoryToDb(story);
    alert('Cerita berhasil disimpan!');
  });

  return item;
};

// Fungsi untuk menyimpan cerita ke IndexedDB
async function saveStoryToDb(story) {
  const db = await getDb();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  await tx.store.put(story);  // Menyimpan cerita ke IndexedDB
  await tx.done;
  console.log(`Cerita dengan ID ${story.id} berhasil disimpan.`);
}

export default async function HomePage() {
  const container = document.createElement('div');
  const token = localStorage.getItem('token');  // Ambil token dari localStorage

  // Jika token tidak ada, arahkan user untuk login
  if (!token) {
    container.innerHTML = `
      <h2>Hai Selamat Datang!</h2>
      <p>Silakan login terlebih dahulu untuk melihat cerita.</p>
    `;
    return container;
  }

  container.innerHTML = `
    <h2>List Cerita</h2>
    <div id="map" style="height: 300px; border-radius: 8px; margin-bottom: 1rem;"></div>
    <ul id="storyList"></ul>
  `;

  const storyList = container.querySelector('#storyList');
  const mapElement = container.querySelector('#map');
  const map = L.map(mapElement).setView([-6.2, 106.8], 5);  // Set default map view
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

  // Fungsi untuk mengambil cerita dari API
  const getStoriesApi = async (token) => {
    console.log('Mengambil cerita dari API...');
    try {
      const response = await fetch(`${BASE_URL}/stories?page=1&size=10&location=0`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error Data:', errorData);
        throw new Error('Gagal mengambil cerita dari server');
      }

      const data = await response.json();
      console.log('Data Cerita:', data);  // Verifikasi data yang diterima
      return data;
    } catch (error) {
      console.error('Error mengambil cerita:', error.message);
      alert('Terjadi kesalahan saat mengambil cerita: ' + error.message);
      throw error;
    }
  };

  // Mengambil cerita dari cache (IndexedDB)
  const cachedStories = await getStoriesFromDb();  // Pastikan data dari IndexedDB diambil dengan benar
  console.log("Cerita dari IndexedDB:", cachedStories);  // Debug log untuk memastikan data ada

  if (cachedStories.length) {
    console.log('Menampilkan cerita dari cache...');
    cachedStories.forEach(story => {
      const item = StoryItem(story);
      storyList.appendChild(item);
      if (story.lat && story.lon) {
        const marker = L.marker([story.lat, story.lon]).addTo(map);
        marker.bindPopup(`<strong>${story.name}</strong><br/>${story.description}`);
      }

      const imageElement = loadImageWithFallback(story.photoUrl, '/images/default-image.png');
      item.appendChild(imageElement);
    });
  } else {
    console.log('Tidak ada data dari IndexedDB.');
  }

  // Cek jika ada koneksi internet
  if (navigator.onLine) {
    console.log('Mencoba mengambil cerita dari server...');
    try {
      const { listStory } = await getStoriesApi(token);
      console.log('Cerita yang diambil dari server:', listStory);  // Verifikasi data yang diterima dari API

      // Jika data berhasil diambil, kosongkan daftar cerita lama
      storyList.innerHTML = '';  // Kosongkan daftar cerita yang lama
      await clearStories();  // Hapus data lama di IndexedDB
      await saveStories(listStory);  // Simpan cerita baru ke IndexedDB

      // Tampilkan cerita yang baru
      listStory.forEach(story => {
        const item = StoryItem(story);
        storyList.appendChild(item);
        if (story.lat && story.lon) {
          const marker = L.marker([story.lat, story.lon]).addTo(map);
          marker.bindPopup(`<strong>${story.name}</strong><br/>${story.description}`);
        }

        const imageElement = loadImageWithFallback(story.photoUrl, '/images/default-image.png');
        item.appendChild(imageElement);
      });
    } catch (error) {
      container.innerHTML += `<p>Gagal mengambil cerita dari server, tampilkan data offline.</p>`;
      console.error('Error mengambil cerita:', error.message);
    }
  } else {
    container.innerHTML += `<p>Anda sedang offline, menampilkan data terakhir yang tersimpan.</p>`;
  }

  document.body.appendChild(container);
  return container;
}
