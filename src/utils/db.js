import { openDB } from 'idb';

const DB_NAME = 'story-db';
const STORE_NAME = 'stories';

export async function getDb() {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    }
  });
}

export async function saveStories(stories) {
  const db = await getDb();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  stories.forEach(story => tx.store.put(story));
  await tx.done;
}

export async function getStoriesFromDb() {
  const db = await getDb();
  return db.getAll(STORE_NAME);
}

export async function clearStories() {
  const db = await getDb();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  await tx.store.clear();
  await tx.done;
}
