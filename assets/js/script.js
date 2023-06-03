var mainInterface = document.querySelector(".main-interface");
var searchInput = document.getElementById("search-input");
var searchIcon = document.querySelector(".search-icon");
var mediaBtn1 = document.getElementById("media-btn-1");
var mediaBtn2 = document.getElementById("media-btn-2");
var mediaBtn3 = document.getElementById("media-btn-3");
var mediaButtons = document.querySelectorAll(".media-btns");
var mainMsgButton = document.getElementById("main-msg");
var mainNbButton = document.getElementById("main-nb");
var mainOptButton = document.getElementById("main-opt");

var returnButton = document.querySelector(".return-btn");

var msgInterface = document.querySelector(".msg-interface");
var msgBtn2 = document.getElementById("msg-btn-2");
var msgBtn3 = document.getElementById("msg-btn-3");
var msgBtn1 = document.getElementById("msg-btn-1");

var nbInterface = document.querySelector(".nb-interface");
var nbTrue = document.querySelector(".nb-true");
var nbTrueList = document.querySelector(".nb-true-list");
var nbfalse = document.querySelector(".nb-false");
var nbFalseList = document.querySelector(".nb-false-list");

var optInterface = document.querySelector(".opt-interface");
var optHomeButton = document.getElementById("opt-btn-home");
var optCreditsButton = document.getElementById("opt-btn-credits");

// Search bar functionality
// clicking enter in the input
searchInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    const searchWord = searchInput.value.trim(); // get word from input
    console.log(searchWord);

    // if (searchWord === "1") { // create findSearchWord()
    if (isFound(searchWord)) {
      // create findSearchWord()
      mediaBtn1.innerHTML = "New";
    } else {
      searchInput.value = "";
      searchInput.placeholder = "Wrong try again";
    }
  }
});

function isFound(word) {
  
}
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
