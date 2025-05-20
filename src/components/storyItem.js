export default function StoryItem(story) {
  const item = document.createElement('li');
  item.classList.add('story-card');

  const image = document.createElement('img');
  image.src = story.photoUrl;
  image.alt = story.name;

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
