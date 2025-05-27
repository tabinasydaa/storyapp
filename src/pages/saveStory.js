import { getStoriesFromDb, deleteStoryFromDb } from '../utils/db.js';

export default function SaveStoryPage() {
  const container = document.createElement('div');
  container.innerHTML = `
    <h2>Cerita yang Disimpan</h2>
    <ul id="savedStoryList" style="list-style: none; padding: 0;"></ul>
  `;

  const savedStoryList = container.querySelector('#savedStoryList');

  // Fungsi untuk menampilkan cerita yang disimpan
  async function renderSavedStories() {
    const stories = await getStoriesFromDb();  
    savedStoryList.innerHTML = '';

    if (stories.length === 0) {
      savedStoryList.innerHTML = '<li>Belum ada cerita yang disimpan.</li>';
    } else {
      stories.forEach(story => {
        const storyItem = document.createElement('li');
        storyItem.innerHTML = `
          <div style="border: 1px solid #ddd; padding: 10px; border-radius: 8px; margin-bottom: 10px;">
            <h4>${story.name}</h4>
            <p>${story.description}</p>
            <img src="${story.photoUrl}" alt="Foto Cerita" style="max-width: 100px; max-height: 100px; margin-bottom: 10px;">
            <button class="delete-button" style="background-color: #f44336; color: white; padding: 5px 10px; border: none; cursor: pointer;">Hapus</button>
          </div>
        `;

        // Event listener untuk tombol hapus
        storyItem.querySelector('.delete-button').addEventListener('click', () => {
          deleteStoryFromDb(story.id);  
          storyItem.remove();  
          alert('Cerita berhasil dihapus!');
        });

        savedStoryList.appendChild(storyItem);
      });
    }
  }

  renderSavedStories();  

  return container;
}
