// src/models/addStoryModel.js
const BASE_URL = 'https://story-api.dicoding.dev/v1';

export default class AddStoryModel {
  async addStory(token, description, photo) {
    try {
      const formData = new FormData();
      formData.append('description', description);
      formData.append('photo', photo);

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

      return await response.json();  // Return the server response as JSON
    } catch (error) {
      console.error('addStory error:', error.message);
      throw error;
    }
  }
}
