import json from '../json/dictionary.json' assert {type: 'json'};

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

class Notebook {
    notebook;

    constructor(notebook) {
        this.notebook = {
            0 : {
                word : null,
                attemptNumber : [],
                true : true
            }   
        };
    }

    addWord(searchWord) {
        console.log(searchWord);
    }
}

// set clock to current time of player : https://stackoverflow.com/questions/28415178/how-do-you-show-the-current-time-on-a-web-page
(function () {
    var clockElement = document.getElementById( "clock" );
    function updateClock ( clock ) {
        clock.innerHTML = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    }
    setInterval(function () {
        updateClock( clockElement );
    }, 1000);
}());

// changeMediaBtn();
// toNotebook();

function changeMedia(searchWord) {
// TO THINK : IF MULTIPLE KEYWORDS, WHAT MEDIA TO PRESENT ? chooseMedia()
// TO THINK : WHEN NEW PUT "*new". addNewToMedia()
// GESTION ERREUR : WHAT IF ALREADY SEEN ? chooseMedia().if (searchWord > 3 keywords (howManyOccurrences() > 3)) {if "json.data.seen, put last"}

}

function countOccurrences(searchWord) {
    // count occurrences of searchWord in Json
    let n = 0;
    for (let i = 0; i < json.data.length; i++) {
        for (let j = 0; j < json.data[i].keywords.length; j++) {
            if (searchWord === json.data[i].keywords[j]) { // GESTION ERREUR : what if jon au lieu de john ?
                n++;
            }
        }
    }
    return (n);
}

function isFound(searchWord) {
    // if strictly more than 0 occurrences of searchWord in json, then true
    if (countOccurrences(searchWord) > 0) {
        return (true);
    }
    return (false);
}

// main
function main(searchWord) {
    if (isFound(searchWord)) {
        // NOTEBOOK : KEEP INPUT. notebook.trueWord(searchWord);
        changeMedia(searchWord);
        mediaBtn1.innerHTML = searchWord + "New";
    } else {
        // NOTEBOOK : KEEP INPUT. notebook.falseWord(searchWord);
        searchInput.value = "";
        searchInput.placeholder = "Wrong try again";
    }
}

// Search bar functionality
searchInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") { // when clicking enter in the input
        main(searchInput.value.trim());
    }
});

///////////////////////////////////////////////////////////////

// clicking on the search icon
// searchIcon.addEventListener("click", () => {
//   // Perform search or display "Wrong" pop-up
//   // CHANGE IMG HERE
// });

// // Media button functionality
// mediaButtons.forEach((button) => {
//   button.addEventListener("click", () => {
//     // Display pop-up window with image and audio
//     // CHANGE IMG HERE
//     // CHANGE AUDIO HERE
//   });
// });

// Apps button functionality
// mainMsgButton.addEventListener("click", () => {
//   mainInterface.style.display = "none";
//   msgInterface.style.display = "block";
// });

// mainNbButton.addEventListener("click", () => {
//   mainInterface.style.display = "none";
//   notebookInterface.style.display = "block";
// });

// mainOptButton.addEventListener("click", () => {
//   mainInterface.style.display = "none";
//   optionsInterface.style.display = "block";
// });

// returnButton.addEventListener("click", () => {
//   mainInterface.style.display = "flex";
//   msgInterface.style.display = "none";
//   notebookInterface.style.display = "none";
//   optionsInterface.style.display = "none";
// });
