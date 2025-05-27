import { openDB } from 'idb';

const DB_NAME = 'story-db';
const STORE_NAME = 'stories';

// Membuka database
async function getDb() {
  const db = await openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    }
  });
  return db;
}

// Mengambil cerita dari IndexedDB
async function getStoriesFromDb() {
  const db = await getDb();
  return await db.getAll(STORE_NAME);  // Mengambil semua cerita
}

// Menyimpan cerita ke IndexedDB
async function saveStories(stories) {
  const db = await getDb();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  stories.forEach(story => tx.store.put(story));  // Menyimpan cerita ke IndexedDB
  await tx.done;
  console.log("Cerita berhasil disimpan di IndexedDB:", stories);  // Debug log
}

// Menghapus cerita dari IndexedDB
async function deleteStoryFromDb(storyId) {
  const db = await getDb();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  await tx.store.delete(storyId);  // Menghapus cerita berdasarkan ID
  await tx.done;
  console.log(`Cerita dengan ID ${storyId} telah dihapus dari IndexedDB.`);
}

// Menghapus semua cerita dari IndexedDB
async function clearStories() {
  const db = await getDb();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  await tx.store.clear();
  await tx.done;
  console.log("All stories cleared from IndexedDB");
}

export { saveStories, getStoriesFromDb, deleteStoryFromDb, clearStories };
