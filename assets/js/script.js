// Search bar functionality
const searchInput = document.getElementById('search-input');
const searchIcon = document.querySelector('.search-icon');

searchInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    // Perform search or display "Wrong" pop-up
    // CHANGE IMG HERE
  }
});

searchIcon.addEventListener('click', () => {
  // Perform search or display "Wrong" pop-up
  // CHANGE IMG HERE
});

// Media button functionality
const mediaButtons = document.querySelectorAll('.media-btn');

mediaButtons.forEach((button) => {
  button.addEventListener('click', () => {
    // Display pop-up window with image and audio
    // CHANGE IMG HERE
    // CHANGE AUDIO HERE
  });
});

// Apps button functionality
const appsMsgButton = document.getElementById('apps-msg');
const appsNotebookButton = document.getElementById('apps-notebook');
const appsOptionsButton = document.getElementById('apps-options');
const mainInterface = document.querySelector('.interface');
const msgInterface = document.querySelector('.msg');
const notebookInterface = document.querySelector('.notebook');
const optionsInterface = document.querySelector('.options');
const returnButton = document.querySelector('.return-btn');

appsMsgButton.addEventListener('click', () => {
  mainInterface.style.display = 'none';
  msgInterface.style.display = 'block';
});

appsNotebookButton.addEventListener('click', () => {
  mainInterface.style.display = 'none';
  notebookInterface.style.display = 'block';
});

appsOptionsButton.addEventListener('click', () => {
  mainInterface.style.display = 'none';
  optionsInterface.style.display = 'block';
});

returnButton.addEventListener('click', () => {
  mainInterface.style.display = 'flex';
  msgInterface.style.display = 'none';
  notebookInterface.style.display = 'none';
  optionsInterface.style.display = 'none';
});
