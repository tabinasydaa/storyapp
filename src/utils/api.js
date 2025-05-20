const BASE_URL = 'https://story-api.dicoding.dev/v1';

// Fungsi untuk mengambil daftar cerita
export const getStories = async (token, page = 1, size = 10, location = 0) => {
  try {
    const response = await fetch(`${BASE_URL}/stories?page=${page}&size=${size}&location=${location}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) throw new Error(`Gagal mengambil cerita: ${response.statusText}`);
    return await response.json();
  } catch (error) {
    console.error('getStories error:', error.message);
    alert('Terjadi kesalahan saat mengambil daftar cerita: ' + error.message);
    throw error;
  }
};

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
      console.error('addStory error:', errorData);
      throw new Error(`Gagal menambahkan cerita: ${errorData.message}`);
    }
    return await response.json();
  } catch (error) {
    console.error('addStory error:', error.message);
    alert('Gagal menambahkan cerita: ' + error.message);
    throw error;
  }
};

// Fungsi login
export const login = async (email, password) => {
  try {
    const response = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) throw new Error(`Login gagal: ${response.statusText}`);

    const data = await response.json();
    localStorage.setItem('token', data.token); // Menyimpan token
    console.log('Login berhasil:', data);
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
      console.error('register error:', errorData);
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
  try {
    const response = await fetch('https://story-api.dicoding.dev/v1/notifications/subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
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