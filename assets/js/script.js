import localJson from '../json/dictionary.json' assert {type: 'json'};

// DOM
var searchInput = document.getElementById('search-input');
var mediaBtnArray = [document.getElementById('media-btn-1'), 
                        document.getElementById('media-btn-2'),
                        document.getElementById('media-btn-3')];

var mainInterface = document.querySelector('.main-interface');
var searchIcon = document.querySelector('.search-icon');

const popup = document.getElementById('popup');
const closeBtn = document.getElementById('close-button');
const imageContainer = document.getElementById('image-container');
const audioPlayer = document.getElementById('audio-player'); // check which to keep in function scope only !
const videoContainer = document.getElementById('video-container');

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
    getMediaCode(searchWord, n, prefix) {
        let loop = -1;
        for (let i = 0; i < this.json.data.length; i++) {
            for (let j = 0; j < this.json.data[i].keywords.length; j++) {
                if (searchWord === this.json.data[i].keywords[j]) {
                    loop++;
                    if (loop === n) {
                        return (prefix  + this.json.data[i].code);
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

    // mark as 'true' the media that has been seen and hide dot
    isSeen(mediaCode, mediaNum) {
        for (let i = 0; i < this.json.data.length; i++) {
            for (let j = 0; j < this.json.data[i].keywords.length; j++) {
                if (mediaCode === this.json.data[i].code) {
                    this.json.data[i].seen = true;
                    document.getElementById('dot' + mediaNum).style.backgroundColor = 'transparent';
                }
            }
        }
        return (0);
    }

    // if 'autoplay' === true, then autoplay, ha.
    isAutoplay(mediaCode, mediaNum, audioPlayer) {
        for (let i = 0; i < this.json.data.length; i++) {
            for (let j = 0; j < this.json.data[i].keywords.length; j++) {
                if (mediaCode === this.json.data[i].code
                    && this.json.data[i].autoplay === true) {
                    audioPlayer.play();
                }
            }
        }
        return (0);
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
        audioPlayer.pause();
        videoPlayer.pause();
    });
}
closePopup(closeBtn);
closePopup(popup);

// ###############
// ## FUNCTIONS ##
// ###############

// toNotebook();

// listener function : display video container only
function displayVideoButtonOnClick(event) {
    popup.style.display = 'block'; // show popup
    videoContainer.style.display = 'block'; // show video container
    const mediaNum = event.currentTarget.id.split(" ")[0][event.currentTarget.id.split(" ")[0].length - 1];
    const mediaCode = event.currentTarget.id.split(" ")[event.currentTarget.id.split(" ").length - 1];
    // change vid path to code
    const videoSource = document.getElementById('video-source');
    const videoPlayer = document.getElementById('video-player');
    const videoPath = './assets/media/video/' + mediaCode + '.mp4' // write complete src, there are only mp4
    console.log(mediaCode);
    videoSource.src = videoPath;
    videoSource.type = "video/mp4";
    json.isSeen(mediaCode, mediaNum); // change red dot
    videoPlayer.load();
    videoPlayer.play();
    // json.isAutoplay(mediaCode, mediaNum, videoPlayer);
    imageContainer.style.display = 'none'; // hide image container
}

function getImgSrcSuffix(img, name) { // https://stackoverflow.com/questions/32772218/how-to-set-an-img-src-without-knowing-the-file-extension-in-javascript
    img.src = name + '.png';
    img.onerror = function() {
        img.src = name + '.jpg';
        img.onerror = function() {
            img.src = name + '.gif';
        };
    };
} // this gives a lot of errors, try to make it softer, can add to json "extension" to be able add it directly

// listener function : display image container only
function displayImageButtonOnClick(event) {
    popup.style.display = 'block'; // show popup
    imageContainer.style.display = 'block'; // show image container
    const mediaNum = event.currentTarget.id.split(" ")[0][event.currentTarget.id.split(" ")[0].length - 1];
    const mediaCode = event.currentTarget.id.split(" ")[event.currentTarget.id.split(" ").length - 1];
    // change img path to code
    const img = document.getElementById('image') // get image DOM
    const prefixImgSrc = './assets/media/img/' + mediaCode // write src without file extension
    getImgSrcSuffix(img, prefixImgSrc); // change src to correct one
    console.log('ignore errors with either .png or .jpg, img has been found : ' + img.src); // can add to json "extension" to be able add it directly
    json.isSeen(mediaCode, mediaNum); // change red dot
    img.style.height = '400px';
    img.style.width = 'auto';
    // TODO : add alt
    // autoplay audio or not
    const audioSource = document.getElementById('audio-source');
    const audioPath = './assets/media/audio/' + mediaCode + '.mp3' // write complete src, there are only mp3
    audioSource.src = audioPath;
    audioSource.type = "audio/mp3";
    audioPlayer.load();
    json.isAutoplay(mediaCode, mediaNum, audioPlayer);
    videoContainer.style.display = 'none'; // hide video container
}

function mediaBtnHandleListener(flag, searchWord, i) {
    const type = json.getMediaType(searchWord, i);
    if (flag === 'add') {
        if (type === 'image') { // begin listener onclick for image
            mediaBtnArray[i].addEventListener('click', displayImageButtonOnClick, { passive : false});
            mediaBtnArray[i].id
        } else if (type === 'video') { // begin listener onclick for video
            mediaBtnArray[i].addEventListener('click', displayVideoButtonOnClick, { passive : false});
        }
    } else if (flag === 'remove') { // remove all listeners
        mediaBtnArray[i].removeEventListener('click', displayImageButtonOnClick);
        mediaBtnArray[i].removeEventListener('click', displayVideoButtonOnClick);
    }
}

function mediaBtnBehavior(searchWord) {
    // changes media accordingly
     let i = -1;
    while (++i < mediaBtnArray.length) { // for each media btn
        if (i < json.getOccurrences(searchWord)) { // for the media matching the searchword and by order
            mediaBtnHandleListener('add', searchWord, i); // add listeners when clicking media-btn-(i+1)
            mediaBtnArray[i].id += json.getMediaCode(searchWord, i, ' '); // add code number after button id, to be able to display the corresponding media in ButtonOnClick()
            mediaBtnArray[i].innerHTML = searchWord + (i + 1) + 'New'; // add 'new' icon
            json.handleRedDot(searchWord, i); // display red dot if never seen media
        } else {
            mediaBtnHandleListener('remove', searchWord, i)
            mediaBtnArray[i].id = 'media-btn-' + (i + 1); // get back to normal id
            mediaBtnArray[i].innerHTML = 'EmptyMedia' + (i + 1); // change this to an empty like container (css)
            json.handleRedDot(searchWord, i); // no red dot on empty media
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

// show first video !!!!

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
