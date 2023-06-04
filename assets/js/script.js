import localJson from '../json/dictionary.json' assert {type: 'json'};

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

// #############
// ## CLASSES ##
// #############

class Json {
    json;

    constructor(json) {
        this.json = json;
    }

    // count occurrences of searchWord in json
    getOccurrences(searchWord) {
        let n = 0;
        for (let i = 0; i < this.json.data.length; i++) {
            for (let j = 0; j < this.json.data[i].keywords.length; j++) {
                if (searchWord === this.json.data[i].keywords[j] && this.json.data[i].keywords[0]) { // GESTION ERREUR : what if jon au lieu de john ?
                    n++;
                }
            }
        }
        return (n);
    }

    // get media type from the expected occurrence (occ)
    getMediaType(searchWord, occ) {
        let loop = -1;
        for (let i = 0; i < this.json.data.length; i++) {
            for (let j = 0; j < this.json.data[i].keywords.length; j++) {
                if (searchWord === this.json.data[i].keywords[j]) {
                    loop++;
                    if (loop === occ) {
                        return (this.json.data[i].type);
                    }
                }
            }
        }
        return (null);
    }

    // get media code from the expected occurrence (n)
    getMediaCode(searchWord, n) {
        let loop = -1;
        for (let i = 0; i < this.json.data.length; i++) {
            for (let j = 0; j < this.json.data[i].keywords.length; j++) {
                if (searchWord === this.json.data[i].keywords[j]) {
                    loop++;
                    if (loop === n) {
                        return (' '  + this.json.data[i].code);
                    }
                }
            }
        }
        return (null);
    }

    // show red dot / notification badge when never seen, else hide it
    handleRedDot(searchWord, n) {
        let loop = -1;
        for (let i = 0; i < this.json.data.length; i++) {
            for (let j = 0; j < this.json.data[i].keywords.length; j++) {
                if (searchWord === this.json.data[i].keywords[j]) {
                    loop++;
                    if (loop === n && this.json.data[i].seen === false) {
                        document.getElementById('dot' + (n + 1)).style.backgroundColor = '#fa3e3e';
                        return ;
                    }
                }
            }
        }
        document.getElementById('dot' + (n + 1)).style.backgroundColor = 'transparent';
    }
}
// instanciate json
var json = new Json(localJson);

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

// browser detection : https://stackoverflow.com/questions/2400935/browser-detection-in-javascript
navigator.saysWho = (() => { 
    const { userAgent } = navigator
    let match = userAgent.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || []
    let temp
  
    if (/trident/i.test(match[1])) {
      temp = /\brv[ :]+(\d+)/g.exec(userAgent) || []
  
      return `IE ${temp[1] || ''}`
    }
  
    if (match[1] === 'Chrome') {
      temp = userAgent.match(/\b(OPR|Edge)\/(\d+)/)
  
      if (temp !== null) {
        return temp.slice(1).join(' ').replace('OPR', 'Opera')
      }
  
      temp = userAgent.match(/\b(Edg)\/(\d+)/)
  
      if (temp !== null) {
        return temp.slice(1).join(' ').replace('Edg', 'Edge (Chromium)')
      }
    }
  
    match = match[2] ? [ match[1], match[2] ] : [ navigator.appName, navigator.appVersion, '-?' ]
    temp = userAgent.match(/version\/(\d+)/i)
  
    if (temp !== null) {
      match.splice(1, 1, temp[1])
    }
  
    return match.join(' ')
})()
console.log(navigator.saysWho);


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

function mediaBtnHandleListener(flag, searchWord, i) {
    const type = json.getMediaType(searchWord, i);
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

function mediaBtnBehavior(searchWord) {
    // changes media accordingly
// TO DO : WHEN NEW PUT '*new'. addNewToMedia()
    let i = -1;
    while (++i < mediaBtnArray.length) { // for each media btn
        if (i < json.getOccurrences(searchWord)) { // for the media matching the searchword and by order
            mediaBtnHandleListener('add', searchWord, i); // add listeners when clicking media-btn-(i+1)
            mediaBtnArray[i].id += json.getMediaCode(searchWord, i); // add code number after button id, to be able to display the corresponding media in ButtonOnClick()
            json.handleRedDot(searchWord, i); // display red dot if never seen media
            mediaBtnArray[i].innerHTML = searchWord + (i + 1) + 'New'; // add 'new' icon
        } else {
            mediaBtnArray[i].innerHTML = 'EmptyMedia' + (i + 1); // change this to an empty like container (css)
            mediaBtnArray[i].id = 'media-btn-' + (i + 1); // get back to normal id
            json.handleRedDot(searchWord, i); // no red dot on empty media
            mediaBtnHandleListener('remove', searchWord, i)
        }
    }
    return (i);
}

function isFound(searchWord) {
    // if strictly more than 0 occurrences of searchWord in json, then true
    if (json.getOccurrences(searchWord) > 0) {
        return (true);
    }
    return (false);
}

// main
function main(searchWord) {
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
