export const BASE_URL = 'https://story-api.dicoding.dev/v1';  
console.log('BASE_URL in api.js:', BASE_URL);

// Fungsi untuk mengambil daftar cerita
export const getStories = async (token, page = 1, size = 10, location = 0) => {
  try {
    if (!token) {
      throw new Error('Token tidak ditemukan. Pastikan Anda sudah login terlebih dahulu.');
    }

    const response = await fetch(`${BASE_URL}/stories?page=${page}&size=${size}&location=${location}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Gagal mengambil cerita: ${errorData.message || response.statusText}`);
    }

    const data = await response.json();

    data.listStory.forEach(story => {
      if (!story.photoUrl || story.photoUrl.includes('undefined') || !story.photoUrl.startsWith('https://')) {
        story.photoUrl = '/images/default-image.png'; // Menetapkan fallback image jika tidak ada photoUrl yang valid
      }
    });

    return data;
  } catch (error) {
    console.error('getStories error:', error.message);
    alert('Terjadi kesalahan saat mengambil daftar cerita: ' + error.message);
    throw error;
  }
}

// Fungsi untuk menambah cerita
export const addStory = async (token, formData) => {
  try {
    const response = await fetch(`${BASE_URL}/stories`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Gagal menambahkan cerita: ${errorData.message}`);
    }

    return await response.json();
  } catch (error) {
    console.error('addStory error:', error.message);
    alert('Gagal menambahkan cerita: ' + error.message);
    throw error;
  }
};

// Fungsi untuk login
export const login = async (email, password) => {
  try {
    const response = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Login gagal: ${errorData.message || response.statusText}`);
    }

    const data = await response.json();
    if (data.loginResult && data.loginResult.token) {
      localStorage.setItem('token', data.loginResult.token);
      console.log('Login berhasil:', data);
    }

    return data;
  } catch (error) {
    console.error('login error:', error.message);
    alert('Login gagal: ' + error.message);
    throw error;
  }
};

// Fungsi register
export const register = async (name, email, password) => {
  try {
    const response = await fetch(`${BASE_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Register gagal: ${errorData.message || response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('register error:', error.message);
    alert('Pendaftaran gagal: ' + error.message);
    throw error;
  }
};

// Fungsi untuk subscribe push notification ke backend Dicoding
export async function subscribePushNotification(subscriptionData, token) {
  if (!token) {
    console.error('Token tidak ditemukan');
    alert('Anda harus login terlebih dahulu untuk menerima notifikasi');
    return;
  }

  try {
    // Hapus expirationTime yang tidak diinginkan
    delete subscriptionData.expirationTime;

    const response = await fetch(`${BASE_URL}/notifications/subscribe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, // Pastikan token dikirim dalam header
      },
      body: JSON.stringify(subscriptionData),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error('subscribePushNotification error: ', result);
      throw new Error(`Failed to subscribe push notification: ${result.message}`);
    }

    return result;
  } catch (error) {
    console.error('subscribePushNotification error:', error.message);
    throw error;
  }
}