import json from '../json/dictionary.json' assert {type: 'json'};

// DOM
var searchInput = document.getElementById('search-input');
var mediaBtn1 = document.getElementById('media-btn-1');
var mediaBtn2 = document.getElementById('media-btn-2');
var mediaBtn3 = document.getElementById('media-btn-3');
var mediaBtnArray = [document.getElementById('media-btn-1'), 
                        document.getElementById('media-btn-2'),
                        document.getElementById('media-btn-3')];


var mainInterface = document.querySelector('.main-interface');
var searchIcon = document.querySelector('.search-icon');

const popup = document.getElementById('popup');
const closeBtn = document.getElementById('close-button');
const imageContainer = document.getElementById('image-container');
const imagePlayer = document.getElementById('image-player');
const videoContainer = document.getElementById('video-container');
const videoPlayer = document.getElementById('video-player');

var mediaButtons = document.querySelectorAll('.main-btn');
var mainMsgButton = document.getElementById('main-msg');
var mainNbButton = document.getElementById('main-nb');
var mainOptButton = document.getElementById('main-opt');

var returnButton = document.querySelector('.return-btn');

var msgInterface = document.querySelector('.msg-interface');
var msgBtn2 = document.getElementById('msg-btn-2');
var msgBtn3 = document.getElementById('msg-btn-3');
var msgBtn1 = document.getElementById('msg-btn-1');

var nbInterface = document.querySelector('.nb-interface');
var nbTrue = document.querySelector('.nb-true');
var nbTrueList = document.querySelector('.nb-true-list');
var nbfalse = document.querySelector('.nb-false');
var nbFalseList = document.querySelector('.nb-false-list');

var optInterface = document.querySelector('.opt-interface');
var optHomeButton = document.getElementById('opt-btn-home');
var optCreditsButton = document.getElementById('opt-btn-credits');

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

// ###########
// ## UTILS ##
// ###########

// set clock to current time of player : https://stackoverflow.com/questions/28415178/how-do-you-show-the-current-time-on-a-web-page
(function () {
    var clockElement = document.getElementById('clock');
    function updateClock ( clock ) {
        clock.innerHTML = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    }
    setInterval(function () {
        updateClock( clockElement );
    }, 1000);
}());

// count occurrences of searchWord in Json
function countOccurrences(searchWord) {
    let n = 0;
    for (let i = 0; i < json.data.length; i++) {
        for (let j = 0; j < json.data[i].keywords.length; j++) {
            if (searchWord === json.data[i].keywords[j] && json.data[i].keywords[0]) { // GESTION ERREUR : what if jon au lieu de john ?
                n++;
            }
        }
    }
    return (n);
}

// close popup functionality
function closePopup(element) {
    element.addEventListener('click', () => {
        popup.style.display = 'none';
        imagePlayer.pause();
        videoPlayer.pause();
    });
}
closePopup(closeBtn);
closePopup(popup);

// ###############
// ## FUNCTIONS ##
// ###############

// when media finished, say 'seen'
// toNotebook();

// listener function : display video container only
function displayVideoButtonOnClick() {
    popup.style.display = 'block';
    // change vid path to code
    // autoplay or not
    videoContainer.style.display = 'block';
    imageContainer.style.display = 'none';
}

// listener function : display image container only
function displayImageButtonOnClick() {
    popup.style.display = 'block';
    // change vid path to code
    // autoplay or not
    imageContainer.style.display = 'block';
    videoContainer.style.display = 'none';
}

function getMediaType(searchWord, n) {
    let loop = 0;
    for (let i = 0; i < json.data.length; i++) {
        for (let j = 0; j < json.data[i].keywords.length; j++) {
            if (searchWord === json.data[i].keywords[j]) {
                loop++;
                if (loop === n + 1) {
                    return (json.data[i].type)
                }
            }
        }
    }
    return (null);
}

function mediaBtnHandleListener(flag, searchWord, i) {
    const type = getMediaType(searchWord, i);
    if (flag === 'add') {
        if (type === 'image' || type === 'gif') {
            // begin listener onclick for image
            mediaBtnArray[i].addEventListener('click', displayImageButtonOnClick, { passive : false});
        } else if (type === 'video') {
            // begin listener onclick for video
            mediaBtnArray[i].addEventListener('click', displayVideoButtonOnClick, { passive : false});
        }
    } else if (flag === 'remove') {
        // remove all listeners
        mediaBtnArray[i].removeEventListener('click', displayImageButtonOnClick);
        mediaBtnArray[i].removeEventListener('click', displayVideoButtonOnClick);
    }
}

function handleRedDot(searchWord, i, flag) {
    const code = null;
    if (flag === 'none')
    return (' ' + code);
}

function getMediaCode(searchWord, i) {
    const code = null;
    return (' ' + code);
}

function mediaBtnBehavior(searchWord) {
    // changes media accordingly
// TO DO : WHEN NEW PUT '*new'. addNewToMedia()
    let i = -1;
    while (++i < mediaBtnArray.length) { // for each media btn
        if (i < countOccurrences(searchWord)) { // for the media matching the searchword and by order
            mediaBtnHandleListener('add', searchWord, i); // add listeners when clicking media-btn-(i+1)
            // mediaBtnArray[i].id += getMediaCode(searchWord, i); // add code number after button id, to be able to display the corresponding media in ButtonOnClick()
            // handleRedDot(); // display red dot if media never seen
            mediaBtnArray[i].innerHTML = searchWord + (i + 1) + 'New'; // add 'new' icon
        } else {
            mediaBtnArray[i].innerHTML = 'EmptyMedia' + (i + 1); // change this to an empty like container (css)
            mediaBtnArray[i].id = 'media-btn-' + (i + 1); // get back to normal id
            mediaBtnHandleListener('remove', searchWord, i)
        }
    }
    return (i);
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
    // CHANGE ALL ID media-btn-1 to normal !cf . change media
    if (isFound(searchWord)) {
        // NOTEBOOK : KEEP INPUT. notebook.trueWord(searchWord);
        mediaBtnBehavior(searchWord);
    } else {
        // NOTEBOOK : KEEP INPUT. notebook.falseWord(searchWord);
        searchInput.value = '';
        searchInput.placeholder = "No media found on word '" + searchWord + "', try again.";
    }
}

// Search bar functionality
searchInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') { // when clicking enter in the input
        main(searchInput.value.trim());
    }
});

///////////////////////////////////////////////////////////////

// clicking on the search icon
// searchIcon.addEventListener('click', () => {
//   // Perform search or display 'Wrong' pop-up
//   // CHANGE IMG HERE
// });

// Apps button functionality
// mainMsgButton.addEventListener('click', () => {
//   mainInterface.style.display = 'none';
//   msgInterface.style.display = 'block';
// });

// mainNbButton.addEventListener('click', () => {
//   mainInterface.style.display = 'none';
//   notebookInterface.style.display = 'block';
// });

// mainOptButton.addEventListener('click', () => {
//   mainInterface.style.display = 'none';
//   optionsInterface.style.display = 'block';
// });

// returnButton.addEventListener('click', () => {
//   mainInterface.style.display = 'flex';
//   msgInterface.style.display = 'none';
//   notebookInterface.style.display = 'none';
//   optionsInterface.style.display = 'none';
// });
