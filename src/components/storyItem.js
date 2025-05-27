export default function StoryItem(story) {
  const item = document.createElement('li');
  item.classList.add('story-card');

  // Membuat elemen gambar dan menetapkan fallback jika gagal
  const image = document.createElement('img');

  // Verifikasi URL gambar apakah valid atau tidak
  if (story.photoUrl && story.photoUrl.startsWith('https://story-api.dicoding.dev/')) {
    if (story.photoUrl.endsWith('.blob')) {
      // Jika format gambar adalah blob, buat URL object URL untuk gambar
      fetch(story.photoUrl)
        .then(response => response.blob())
        .then(blob => {
          const blobUrl = URL.createObjectURL(blob);
          image.src = blobUrl;
        })
        .catch(() => {
          image.src = '/images/default-image.png'; // Gunakan gambar default jika gagal
          console.log(`Gambar blob gagal dimuat: ${story.photoUrl}`);
        });
    } else {
      // Jika bukan gambar blob, langsung set URL gambar
      image.src = story.photoUrl;
    }
  } else {
    image.src = '/images/default-image.png';  // Gambar default jika URL tidak valid
  }

  image.alt = story.name;

  // Menangani gambar yang gagal dimuat
  image.onerror = () => {
    image.src = '/images/default-image.png'; // Gunakan gambar fallback jika gagal dimuat
    console.log(`Gambar gagal dimuat: ${story.photoUrl}`);
  };

  const content = document.createElement('div');
  content.classList.add('story-card-content');
  content.innerHTML = `
    <h3>${story.name}</h3>
    <p>${story.description}</p>
  `;

  item.appendChild(image);
  item.appendChild(content);

  return item;
}
