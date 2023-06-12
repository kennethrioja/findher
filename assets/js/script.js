import localJson from '../json/dictionary.json' assert {type: 'json'};

// DOM
var searchInput = document.getElementById('search-input');
var mediaBtnArray = [document.getElementById('media-btn-1'), 
                        document.getElementById('media-btn-2'),
                        document.getElementById('media-btn-3')];

var mainInterface = document.querySelector('.interface');
var searchIcon = document.querySelector('.search-icon');

const popup = document.getElementById('popup');
const closeBtn = document.getElementById('close-button');
const imageContainer = document.getElementById('image-container');
const audioPlayer = document.getElementById('audio-player'); // check which to keep in function scope only !
const videoContainer = document.getElementById('video-container');
const videoPlayer = document.getElementById('video-player');

var mediaButtons = document.querySelectorAll('.main-btn');
var mainMsgButton = document.getElementById('main-msg');
var mainNbButton = document.getElementById('main-nb');
var mainOptButton = document.getElementById('main-opt');

var returnButton = document.getElementById('return-btn');

var msgInterface = document.querySelector('.msg-interface');
var msgBtn2 = document.getElementById('msg-btn-2');
var msgBtn3 = document.getElementById('msg-btn-3');
var msgBtn1 = document.getElementById('msg-btn-1');

var nbInterface = document.querySelector('.nb-interface');
var nbContainer = document.getElementById('nb-container');
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

    // length
    length() {
        return (this.json.length);
    }

    // count seen
    getSeen() {
        let n = 0;
        for (let i = 0; i < this.json.length; i++) {
            for (let j = 0; j < this.json[i].keywords.length; j++) {
                if (this.json[i].seen === true) {
                    n++;
                }
            }
        }
        return (n);
    }

    getKeyWordListRaw() {
        let list = [];
        for (let i = 0; i < this.json.length; i++) {
            for (let j = 0; j < this.json[i].keywords.length; j++) {
                list.push(this.json[i].keywords[j]);
            }
        }
        return (list);
    }

    getKeyWordListNoDup() { // https://stackoverflow.com/questions/1960473/get-all-unique-values-in-a-javascript-array-remove-duplicates
        return(this.getKeyWordListRaw().filter((v,i,a)=>a.indexOf(v)==i));
    }

    // count occurrences of searchWord in json
    getOccurrences(searchWord) {
        let n = 0;
        for (let i = 0; i < this.json.length; i++) {
            for (let j = 0; j < this.json[i].keywords.length; j++) {
                if (searchWord === this.json[i].keywords[j] && this.json[i].keywords[0]) { // GESTION ERREUR : what if jon au lieu de john ?
                    n++;
                }
            }
        }
        return (n);
    }

    // get media type from the expected occurrence (occ)
    getMediaType(searchWord, occ) {
        let loop = -1;
        for (let i = 0; i < this.json.length; i++) {
            for (let j = 0; j < this.json[i].keywords.length; j++) {
                if (searchWord === this.json[i].keywords[j]) {
                    loop++;
                    if (loop === occ) {
                        return (this.json[i].type);
                    }
                }
            }
        }
        return (null);
    }

    // get media code from the expected occurrence (n)
    getMediaCode(searchWord, n, prefix) {
        let loop = -1;
        for (let i = 0; i < this.json.length; i++) {
            for (let j = 0; j < this.json[i].keywords.length; j++) {
                if (searchWord === this.json[i].keywords[j]) {
                    loop++;
                    if (loop === n) {
                        return (prefix  + this.json[i].code);
                    }
                }
            }
        }
        return (null);
    }

    // show red dot / notification badge when never seen, else hide it
    handleRedDot(searchWord, n) {
        let loop = -1;
        for (let i = 0; i < this.json.length; i++) {
            for (let j = 0; j < this.json[i].keywords.length; j++) {
                if (searchWord === this.json[i].keywords[j]) {
                    loop++;
                    if (loop === n && this.json[i].seen === false) {
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
        for (let i = 0; i < this.json.length; i++) {
            for (let j = 0; j < this.json[i].keywords.length; j++) {
                if (mediaCode === this.json[i].code) {
                    this.json[i].seen = true;
                    document.getElementById('dot' + mediaNum).style.backgroundColor = 'transparent';
                }
            }
        }
        return (0);
    }

    // if 'autoplay' === true, then autoplay, ha.
    isAutoplay(mediaCode, mediaNum, audioPlayer) {
        for (let i = 0; i < this.json.length; i++) {
            for (let j = 0; j < this.json[i].keywords.length; j++) {
                if (mediaCode === this.json[i].code
                    && this.json[i].autoplay === true) {
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
    history;
        // word : searchWord,
        // attemptArray : [this.maxAttempt],
        // true : isInJson
    #maxAttempt;

    constructor() {
        this.history = [];
        this.#maxAttempt = 0;
    }

    isInNotebook(searchWord) { // update #maxAttempt and update attemptNumber
        for (let i = 0; i < this.history.length; i++) {
            if (searchWord === this.history[i].word) {
                return (true);
            }
        }
        return (false);
    }

    addEntryToHistory(searchWord, isInJson) {
        searchWord === 'caca' ? searchWord = '💩' : null;
        if (!this.isInNotebook(searchWord)) { // if new entry
            this.#addNewEntryToHistory(searchWord, isInJson);
        } else { // else if already in entry
            this.#addNotNewEntryToHistory(searchWord);
        }
        // change words progression
        this.#updateWordProgress();
    }

    countTrueWords() {
        var rez = {};
        this.history.forEach(function(item){
          rez[item.true] ? rez[item.true]++ :  rez[item.true] = 1;
        });
        return(rez.true);
    }

    #addNewEntryToHistory(searchWord, isInJson, notebook) {
        this.#maxAttempt++;
        let newHistory = {
            word : searchWord,
            attemptArray : [this.#maxAttempt],
            true : isInJson
        };
        this.history[this.history.length] = newHistory;
    }

    #addNotNewEntryToHistory(searchWord) {
        for (let i = 0; i < this.history.length; i++) {
            if (searchWord === this.history[i].word) {
                this.#maxAttempt++;
                this.history[i].attemptArray.push(this.#maxAttempt);
            }
        }
    }

    #updateWordProgress() {
        var cWord = document.getElementById('circle-word');
        var cWordDiv = document.getElementById('circle-word-div');
        var percentage = Math.round(this.countTrueWords() / json.getKeyWordListNoDup().length * 100)
        console.log(this.countTrueWords() + "true words / " + json.getKeyWordListNoDup().length);
        cWord.style.backgroundImage = "conic-gradient(#b5838d " + percentage + "%, #ffcdb2 0)";
        cWordDiv.innerHTML = "Word<br>" + this.countTrueWords() + '/' + json.getKeyWordListNoDup().length;
    }

    #isAllSeen(searchWord) { // where is the best to put this ?
        return (null);
    }
}
// instanciate notebook
var notebook = new Notebook();

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

function updateMediaProgress() {
    var cMedia = document.getElementById('circle-media');
    var cMediaDiv = document.getElementById('circle-media-div');
    var percentage = Math.round(json.getSeen() / json.length() * 100)
    cMedia.style.backgroundImage = "conic-gradient(#b5838d " + percentage + "%, #ffcdb2 0)";
    cMediaDiv.innerHTML = "Media<br>" + json.getSeen() + '/' + json.length();
}

// close popup functionality
function closePopup(element) {
    element.addEventListener('click', () => {
        popup.style.display = 'none';
        audioPlayer.pause();
        videoPlayer.pause();
        // update media progression
        updateMediaProgress();  
    });
}
closePopup(closeBtn);
closePopup(popup);

// ###############
// ## FUNCTIONS ##
// ###############

function handleVideo(mediaCode, mediaNum) {
    const videoSource = document.getElementById('video-source');
    const videoPath = './assets/media/video/' + mediaCode + '.mp4' // write complete src, there are only mp4
    videoSource.src = videoPath;
    videoSource.type = "video/mp4";
    json.isSeen(mediaCode, mediaNum); // change red dot
    videoPlayer.load();
    videoPlayer.play();
}

// listener function : display video container only
function displayVideoButtonOnClick(event) {
    popup.style.display = 'block'; // show popup
    videoContainer.style.display = 'block'; // show video container
    const mediaCode = event.currentTarget.id.split(" ")[event.currentTarget.id.split(" ").length - 1];
    const mediaNum = event.currentTarget.id.split(" ")[0][event.currentTarget.id.split(" ")[0].length - 1];
    handleVideo(mediaCode, mediaNum);
    imageContainer.style.display = 'none'; // hide image container
    nbContainer.style.display = 'none'; // hide nb container
}

function handleAudio(mediaCode, mediaNum) {
    const audioSource = document.getElementById('audio-source');
    const audioPath = './assets/media/audio/' + mediaCode + '.mp3' // write complete src, there are only mp3
    audioSource.src = audioPath;
    audioSource.type = "audio/mp3";
    audioPlayer.load();
    json.isAutoplay(mediaCode, mediaNum, audioPlayer);
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

function handleImage(mediaCode, mediaNum) {
    const img = document.getElementById('image') // get image DOM
    const prefixImgSrc = './assets/media/img/' + mediaCode // write src without file extension
    getImgSrcSuffix(img, prefixImgSrc); // change src to correct one
    console.log('ignore errors with either .png or .jpg, img has been found : ' + img.src); // can add to json "extension" to be able add it directly
    json.isSeen(mediaCode, mediaNum); // change red dot
    img.style.height = '400px';
    img.style.width = 'auto';
    // TODO : add alt
}

// listener function : display image container only
function displayImageButtonOnClick(event) {
    popup.style.display = 'block'; // show popup
    imageContainer.style.display = 'block'; // show image container
    const mediaCode = event.currentTarget.id.split(" ")[event.currentTarget.id.split(" ").length - 1];
    const mediaNum = event.currentTarget.id.split(" ")[0][event.currentTarget.id.split(" ")[0].length - 1];
    handleImage(mediaCode, mediaNum);
    handleAudio(mediaCode, mediaNum);
    videoContainer.style.display = 'none'; // hide video container
    nbContainer.style.display = 'none'; // hide nb container
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

// for each media btn, adds image, video or virus 
function mediaBtnBehavior(searchWord) {
    let i = -1;
    while (++i < mediaBtnArray.length) { // for each media btn
        if (i < json.getOccurrences(searchWord)) { // for the media matching the searchword and by order
            mediaBtnHandleListener('add', searchWord, i); // add listeners when clicking media-btn-(i+1)
            mediaBtnArray[i].id += json.getMediaCode(searchWord, i, ' '); // add code number after button id, to be able to display the corresponding media in ButtonOnClick()
            mediaBtnArray[i].innerHTML = "Search Result " + (i + 1); // change label of button
            mediaBtnArray[i].style.cursor = 'pointer';
            json.handleRedDot(searchWord, i); // display red dot if never seen media
        } else { // virus here
            mediaBtnHandleListener('remove', searchWord, i)
            mediaBtnArray[i].id = 'media-btn-' + (i + 1); // get back to normal id
            // mediaBtnArray[i].innerHTML = 'EmptyMedia' + (i + 1); // change this to an empty like container (css)
            mediaBtnArray[i].innerHTML = ''; // change this to an empty like container (css)
            mediaBtnArray[i].style.cursor = '';
            json.handleRedDot(searchWord, i); // no red dot on empty media
        }
    }
    return (i);
}

function isFound(searchWord) {
    if (json.getOccurrences(searchWord) > 0) { // if strictly more than 0 occurrences of searchWord in json, then true
        return (true);
    }
    return (false);
}


//////////
// MAIN //
//////////

function mainInterfaceFct(searchWord) {
    if (isFound(searchWord)) { // can be shortened
        // NOTEBOOK : KEEP INPUT. notebook.trueWord(searchWord);
        // for first interaction
        if (searchWord === 'begin') {
            searchInput.placeholder = 'Search';
            searchInput.value = '';
        }
        notebook.addEntryToHistory(searchWord, true);
        console.log(notebook.history);
        mediaBtnBehavior(searchWord);
    } else {
        // NOTEBOOK : KEEP INPUT. notebook.falseWord(searchWord);
        notebook.addEntryToHistory(searchWord, false);
        console.log(notebook.history);
        searchInput.value = '';
        if (searchWord != "caca") {
            searchInput.placeholder = "No media found on word '" + searchWord + "', try again.";
        } else {
            searchInput.placeholder = "CONGRATS ! You won the 'caca' badge ! English people do not understand what this means... However, it appears to be a bit smelly. Try again."; // easter egg
        }
            
    }
}

// Search bar functionality
searchInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') { // when clicking enter in the input
        mainInterfaceFct(searchInput.value.trim());
    }
});

// Search icon functionality
searchIcon.addEventListener('click', (event) => { // when clicking on the search-icon
    mainInterfaceFct(searchInput.value.trim());
});

//////////////
// NOTEBOOK //
//////////////

function updateNotebook() {
    let correctWords = [];
    let wrongWords = [];
    for (let i = 0; i < notebook.history.length; i++) {
        if (notebook.history[i].true) {
            correctWords.push(notebook.history[i].word + '(tries : ' + notebook.history[i].attemptArray.length + ') ');
        } else {
            wrongWords.push(notebook.history[i].word + '(tries : ' + notebook.history[i].attemptArray.length + ') ');
        }
    }
    console.log("heyy");
    nbTrueList.innerHTML = correctWords;
    nbFalseList.innerHTML = wrongWords;
    return (false);
}

// listener function : display image container only
function displayNbMainButtonOnClick(event) {
    console.log("yo");
    popup.style.display = 'block'; // show popup
    imageContainer.style.display = 'none'; // hide image container
    videoContainer.style.display = 'none'; // hide video container
    nbContainer.style.display = 'block'; // show nb container
    updateNotebook();
}

// Main notebook button functionality
mainNbButton.addEventListener('click', displayNbMainButtonOnClick, { passive : false});