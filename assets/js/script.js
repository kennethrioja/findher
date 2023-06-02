const mainInterface = document.querySelector(".main-interface");
const searchInput = document.getElementById("search-input");
const searchIcon = document.querySelector(".search-icon");
const mediaBtn1 = document.getElementById("media-btn-1");
const mediaBtn2 = document.getElementById("media-btn-2");
const mediaBtn3 = document.getElementById("media-btn-3");
const mediaButtons = document.querySelectorAll(".media-btns");
const mainMsgButton = document.getElementById("main-msg");
const mainNbButton = document.getElementById("main-nb");
const mainOptButton = document.getElementById("main-opt");

const returnButton = document.querySelector(".return-btn");

const msgInterface = document.querySelector(".msg-interface");
const msgBtn2 = document.getElementById("msg-btn-2");
const msgBtn3 = document.getElementById("msg-btn-3");
const msgBtn1 = document.getElementById("msg-btn-1");

const nbInterface = document.querySelector(".nb-interface");
const nbTrue = document.querySelector(".nb-true");
const nbTrueList = document.querySelector(".nb-true-list");
const nbfalse = document.querySelector(".nb-false");
const nbFalseList = document.querySelector(".nb-false-list");

const optInterface = document.querySelector(".opt-interface");
const optHomeButton = document.getElementById("opt-btn-home");
const optCreditsButton = document.getElementById("opt-btn-credits");

// Search bar functionality
// clicking enter in the input
searchInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    const searchText = searchInput.value.trim(); // change to keyword
    console.log(searchText);

    if (searchText === "1") { // create findSearchText()
      mediaBtn1.innerHTML = "New";
    } else {
      searchInput.value = "";
      searchInput.placeholder = "Wrong try again";
    }
  }
});

// main();
// parseKeyword();
// keywordIsTrue();
// changeMediaBtn();
// toNotebook();

// clicking on the search icon
searchIcon.addEventListener("click", () => {
  // Perform search or display "Wrong" pop-up
  // CHANGE IMG HERE
});

// Media button functionality
mediaButtons.forEach((button) => {
  button.addEventListener("click", () => {
    // Display pop-up window with image and audio
    // CHANGE IMG HERE
    // CHANGE AUDIO HERE
  });
});

// Apps button functionality

appsMsgButton.addEventListener("click", () => {
  mainInterface.style.display = "none";
  msgInterface.style.display = "block";
});

appsNotebookButton.addEventListener("click", () => {
  mainInterface.style.display = "none";
  notebookInterface.style.display = "block";
});

appsOptionsButton.addEventListener("click", () => {
  mainInterface.style.display = "none";
  optionsInterface.style.display = "block";
});

returnButton.addEventListener("click", () => {
  mainInterface.style.display = "flex";
  msgInterface.style.display = "none";
  notebookInterface.style.display = "none";
  optionsInterface.style.display = "none";
});
