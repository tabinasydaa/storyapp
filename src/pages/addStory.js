// src/pages/addStory.js
import AddStoryPresenter from '../presenters/addStoryPresenter.js';  // Import Presenter
import AddStoryModel from '../models/addStoryModel.js';  // Import Model

export default async function AddStoryPage() {
  const container = document.createElement('div');
  container.innerHTML = `
    <h2>Tambah Cerita</h2>
    <form id="storyForm">
      <label for="description">Deskripsi</label><br/>
      <textarea id="description" required rows="4" cols="50"></textarea><br/>

      <label for="photo">Ambil Foto / Upload</label><br/>
      <video id="video" width="100%" height="auto" style="border: 1px solid black;"></video><br/>
      <button type="button" id="take-photo">Ambil Foto</button>
      <canvas id="canvas" style="display: none;"></canvas>
      <div id="photoPreview" style="margin-top: 1rem;"></div>

      <label>Pilih Lokasi di Peta:</label>
      <div id="map" style="height: 300px; margin-bottom: 1rem;"></div>
      <input type="hidden" id="lat" name="lat" />
      <input type="hidden" id="lon" name="lon" />

      <button type="submit">Kirim Cerita</button>
    </form>
  `;

  const model = new AddStoryModel();  // Create an instance of the Model
  const presenter = new AddStoryPresenter(model, {
    showLoading: showLoading,
    renderFailedMessage: renderFailedMessage,
    renderStorySuccess: renderStorySuccess,
  });  // Create an instance of the Presenter, passing the View methods

  // Initialize map
  const map = L.map(container.querySelector('#map')).setView([-6.2, 106.8], 5);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

  let selectedMarker;
  map.on('click', function (e) {
    const { lat, lng } = e.latlng;
    container.querySelector('#lat').value = lat;
    container.querySelector('#lon').value = lng;

    if (selectedMarker) {
      selectedMarker.setLatLng([lat, lng]);
    } else {
      selectedMarker = L.marker([lat, lng]).addTo(map);
    }
  });

  // Camera capture logic
  const videoElement = container.querySelector('#video');
  const canvasElement = container.querySelector('#canvas');
  const photoPreview = container.querySelector('#photoPreview');
  const takePhotoButton = container.querySelector('#take-photo');

  // Initialize stream and display video
  let stream;
  try {
    // Access device camera
    stream = await navigator.mediaDevices.getUserMedia({ video: true });

    // Ensure the stream is set to the video element
    videoElement.srcObject = stream;

    // Wait until video is ready
    videoElement.onloadedmetadata = () => {
      videoElement.play();  // Start playing after metadata is loaded
    };
  } catch (error) {
    console.error("Camera not available:", error);
    alert("Unable to access device camera.");
  }

  // Capture photo from video stream
  takePhotoButton.addEventListener('click', () => {
    const context = canvasElement.getContext('2d');
    canvasElement.width = videoElement.videoWidth;
    canvasElement.height = videoElement.videoHeight;
    context.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height);

    // Convert to image and preview
    const dataUrl = canvasElement.toDataURL('image/png');
    photoPreview.innerHTML = `<img src="${dataUrl}" alt="Preview" style="max-width: 100%; max-height: 200px;" />`;

    // Stop the camera stream after capturing the photo
    stopCamera();
  });

  // Stop the camera stream
  function stopCamera() {
    if (stream) {
      const tracks = stream.getTracks();
      tracks.forEach(track => track.stop());  // Stop all media tracks
    }
  }

  // Form submission logic
  const form = container.querySelector('#storyForm');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const description = container.querySelector('#description').value;
    const photoDataUrl = canvasElement.toDataURL('image/png');
    const lat = container.querySelector('#lat').value;
    const lon = container.querySelector('#lon').value;

    if (!photoDataUrl) {
      alert('Foto wajib diambil!');
      return;
    }

    const photoBlob = dataURLtoBlob(photoDataUrl);  // Convert data URL to Blob for uploading
    const token = localStorage.getItem('token');  // Get the token from localStorage

    // Call the Presenter to add the story
    await presenter.addStory(token, description, photoBlob, lat, lon);  // Call Presenter to add story

    // Reset form after successful submission
    form.reset();
    photoPreview.innerHTML = '';  // Clear photo preview
  });

  // Convert data URL to Blob
  function dataURLtoBlob(dataUrl) {
    const byteString = atob(dataUrl.split(',')[1]);
    const mimeString = dataUrl.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  }

  // View methods to handle loading and rendering messages
  function showLoading() {
    container.innerHTML = 'Loading...';
  }

  function renderFailedMessage() {
    container.innerHTML = 'Gagal menambahkan cerita. Silakan coba lagi.';
  }

  function renderStorySuccess() {
    container.innerHTML = 'Cerita berhasil ditambahkan!';
  }

  return container;
}
