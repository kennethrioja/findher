import localJson from '../json/dictionary.json' assert {type: 'json'};

// DOM
var mediaBtnArray = [document.getElementById('media-btn-1'), 
                        document.getElementById('media-btn-2'),
                        document.getElementById('media-btn-3')];

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
        const jsonData = this.json;
        let n = 0;
        for (let i = 0; i < jsonData.length; i++) {
            if (jsonData[i].seen === true) {
                n++;
            }
        }
        return (n);
    }

    getKeyWordListRaw() {
        const jsonData = this.json;
        let list = [];
        for (let i = 0; i < jsonData.length; i++) {
            for (let j = 0; j < jsonData[i].keywords.length; j++) {
                list.push(jsonData[i].keywords[j]);
            }
        }
        return (list);
    }

    getKeyWordListNoDup() { // https://stackoverflow.com/questions/1960473/get-all-unique-values-in-a-javascript-array-remove-duplicates
        return(this.getKeyWordListRaw().filter((v,i,a)=>a.indexOf(v)==i));
    }

    // count occurrences of searchWord in json
    getOccurrences(searchWord) {
        const jsonData = this.json;
        let n = 0;
        for (let i = 0; i < jsonData.length; i++) {
            for (let j = 0; j < jsonData[i].keywords.length; j++) {
                if (searchWord === jsonData[i].keywords[j] && jsonData[i].keywords[0]) { // GESTION ERREUR : what if jon au lieu de john ?
                    n++;
                }
            }
        }
        return (n);
    }

    // get media type from the expected occurrence (occ)
    getMediaType(searchWord, occ) {
        const jsonData = this.json;
        let loop = -1;
        for (let i = 0; i < jsonData.length; i++) {
            for (let j = 0; j < jsonData[i].keywords.length; j++) {
                if (searchWord === jsonData[i].keywords[j]) {
                    loop++;
                    if (loop === occ) {
                        return (jsonData[i].type);
                    }
                }
            }
        }
        return (null);
    }

    // get media code from the expected occurrence (n)
    getMediaCode(searchWord, n, prefix) {
        const jsonData = this.json;
        let loop = -1;
        for (let i = 0; i < jsonData.length; i++) {
            for (let j = 0; j < jsonData[i].keywords.length; j++) {
                if (searchWord === jsonData[i].keywords[j]) {
                    loop++;
                    if (loop === n) {
                        return (prefix  + jsonData[i].code);
                    }
                }
            }
        }
        return (null);
    }

    // show red dot / notification badge when never seen, else hide it
    handleRedDot(searchWord, n) {
        const jsonData = this.json;
        let loop = -1;
        for (let i = 0; i < jsonData.length; i++) {
            for (let j = 0; j < jsonData[i].keywords.length; j++) {
                if (searchWord === jsonData[i].keywords[j]) {
                    loop++;
                    if (loop === n && jsonData[i].seen === false) {
                        var redDot = document.getElementById('dot' + (n + 1));
                        animFadeIn(redDot, '#fa3e3e');
                        return ;
                    }
                }
            }
        }
        document.getElementById('dot' + (n + 1)).style.backgroundColor = 'transparent';
    }

    // mark as 'true' the media that has been seen and hide dot
    isSeen(mediaCode, mediaNum) {
        const jsonData = this.json;
        for (let i = 0; i < jsonData.length; i++) {
            for (let j = 0; j < jsonData[i].keywords.length; j++) {
                if (mediaCode === jsonData[i].code) {
                    jsonData[i].seen = true;
                    document.getElementById('dot' + mediaNum).style.backgroundColor = 'transparent';
                    return;
                }
            }
        }
        return (0);
    }

    // if 'autoplay' === true, then autoplay, ha.
    isAutoplay(mediaCode, audioPlayer) {
        const jsonData = this.json;
        for (let i = 0; i < jsonData.length; i++) {
            for (let j = 0; j < jsonData[i].keywords.length; j++) {
                if (mediaCode === jsonData[i].code
                    && jsonData[i].autoplay === true) {
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
        const historyData = this.history;
        for (let i = 0; i < historyData.length; i++) {
            if (searchWord === historyData[i].word) {
                return (true);
            }
        }
        return (false);
    }

    addEntryToHistory(searchWord, isInJson) {
        if (!this.isInNotebook(searchWord)) { // if new entry
            this.#addNewEntryToHistory(searchWord, isInJson);
        } else { // else if already in entry
            this.#addNotNewEntryToHistory(searchWord);
        }
        // change words progression
        this.#updateWordProgress();
        
    }

    countTrueWords() {
        const historyData = this.history;
        var rez = {};
        historyData.forEach(function(item){
          rez[item.true] ? rez[item.true]++ :  rez[item.true] = 1;
        });
        return(rez.true);
    }

    #addNewEntryToHistory(searchWord, isInJson, notebook) {
        const historyData = this.history;
        this.#maxAttempt++;
        let newHistory = {
            word : searchWord,
            attemptArray : [this.#maxAttempt],
            true : isInJson
        };
        historyData[historyData.length] = newHistory;
    }

    #addNotNewEntryToHistory(searchWord) {
        const historyData = this.history;
        for (let i = 0; i < historyData.length; i++) {
            if (searchWord === historyData[i].word) {
                this.#maxAttempt++;
                historyData[i].attemptArray.push(this.#maxAttempt);
            }
        }
    }

    #updateWordProgress() {
        var cWord = document.getElementById('circle-word');
        var cWordDiv = document.getElementById('circle-word-div');
        const countTrueWords = this.countTrueWords();
        const getKeyWordListNoDupLen = json.getKeyWordListNoDup().length;
        var percentage = Math.round(countTrueWords / getKeyWordListNoDupLen * 100)
        cWord.style.backgroundImage = "conic-gradient(#b5838d " + percentage + "%, #ffcdb2 0)";
        var displayTrueWords = countTrueWords === undefined ? 0 : countTrueWords
        cWordDiv.innerHTML = "Word<br>" + displayTrueWords + '/' + getKeyWordListNoDupLen;
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

// fade in animation : https://stackoverflow.com/questions/6121203/how-to-do-fade-in-and-fade-out-with-javascript-and-css
function animFadeIn(e, col) {
    var op = 0.1;  // initial opacity
    e.style.backgroundColor = col;
    var timer = setInterval(function () {
        if (op >= 1){
            clearInterval(timer);
        }
        e.style.opacity = op;
        e.style.filter = 'alpha(opacity=' + op * 100 + ")";
        op += op * 0.1;
    }, 10);
}

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
    var countSeen = json.getSeen();
    var percentage = Math.round(countSeen / json.length() * 100);
    cMedia.style.backgroundImage = "conic-gradient(#b5838d " + percentage + "%, #ffcdb2 0)";
    cMediaDiv.innerHTML = "Media<br>" + countSeen + '/' + json.length();
}

// close popup functionality
function closePopup(element) {
    element.addEventListener('click', () => {
        document.getElementById('popup').style.display = 'none';
        document.getElementById('audio-player').pause();
        document.getElementById('video-player').pause();
        // update media progression
        updateMediaProgress();  
    });
}
closePopup(document.getElementById('close-button'));
closePopup(document.getElementById('popup'));

// ###############
// ## FUNCTIONS ##
// ###############

function handleVideo(mediaCode, mediaNum) {
    const videoSource = document.getElementById('video-source');
    const videoPath = './assets/media/video/' + mediaCode + '.mp4' // write complete src, there are only mp4
    videoSource.src = videoPath;
    videoSource.type = "video/mp4";
    json.isSeen(mediaCode, mediaNum); // change red dot
    document.getElementById('video-player').load();
    document.getElementById('video-player').style.height = "85vh";
    document.getElementById('video-player').play();
}

// listener function : display video container only
function displayVideoButtonOnClick(event) {
    document.getElementById('popup').style.display = 'block'; // show popup
    document.getElementById('video-container').style.display = 'block'; // show video container
    const mediaCode = event.currentTarget.id.split(" ")[event.currentTarget.id.split(" ").length - 1];
    const mediaNum = event.currentTarget.id.split(" ")[0][event.currentTarget.id.split(" ")[0].length - 1];
    handleVideo(mediaCode, mediaNum);
    document.getElementById('image-container').style.display = 'none'; // hide image container
    document.getElementById('nb-container').style.display = 'none'; // hide nb container
}

function handleAudio(mediaCode, mediaNum) {
    const audioSource = document.getElementById('audio-source');
    const audioPath = './assets/media/audio/' + mediaCode + '.mp3' // write complete src, there are only mp3
    audioSource.src = audioPath;
    audioSource.type = "audio/mp3";
    document.getElementById('audio-player').load();
    json.isAutoplay(mediaCode, document.getElementById('audio-player'));
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
    img.style.height = '85vh';
    img.style.width = 'auto';
    // TODO : add alt
}

// listener function : display image container only
function displayImageButtonOnClick(event) {
    document.getElementById('popup').style.display = 'block'; // show popup
    document.getElementById('image-container').style.display = 'block'; // show image container
    const mediaCode = event.currentTarget.id.split(" ")[event.currentTarget.id.split(" ").length - 1];
    const mediaNum = event.currentTarget.id.split(" ")[0][event.currentTarget.id.split(" ")[0].length - 1];
    handleImage(mediaCode, mediaNum);
    handleAudio(mediaCode, mediaNum);
    document.getElementById('video-container').style.display = 'none'; // hide video container
    document.getElementById('nb-container').style.display = 'none'; // hide nb container
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
            mediaBtnArray[i].animate({ // https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API/Keyframe_Formats
                  opacity: [0.3, 1], // [ from, to ]
                  color: ["#fff", "#000"], // [ from, to ]
                },750);
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
    const searchInput = document.getElementById('search-input');
    if (isFound(searchWord)) { // can be shortened
        // NOTEBOOK : KEEP INPUT. notebook.trueWord(searchWord);
        // for first interaction
        if (searchWord === 'begin') {
            searchInput.placeholder = 'Search';
            searchInput.value = '';
        }
        notebook.addEntryToHistory(searchWord, true);
        mediaBtnBehavior(searchWord);
    } else {
        // NOTEBOOK : KEEP INPUT. notebook.falseWord(searchWord);
        notebook.addEntryToHistory(searchWord, false);
        if (searchWord != "42") {
            searchInput.placeholder = "No media found on word '" + searchWord + "', try again.";
        } else {
            searchInput.placeholder = "Wanna seek the truth right ? Aren't we all looking for it ?"; // easter egg
        }
        searchInput.value = '';            
    }
}

// Search bar functionality
document.getElementById('search-input').addEventListener('keydown', (event) => {
    if (event.key === 'Enter') { // when clicking enter in the input
        mainInterfaceFct(document.getElementById('search-input').value.trim().toLowerCase());
    }
});

// Search icon functionality
document.querySelector('.search-icon').addEventListener('click', (event) => { // when clicking on the search-icon
    mainInterfaceFct(document.getElementById('search-input').value.trim());
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
    document.querySelector('.nb-true-list').innerHTML = correctWords;
    document.querySelector('.nb-false-list').innerHTML = wrongWords;
    return (false);
}

// listener function : display image container only
function displayNbMainButtonOnClick(event) {
    document.getElementById('popup').style.display = 'block'; // show popup
    document.getElementById('image-container').style.display = 'none'; // hide image container
    document.getElementById('video-container').style.display = 'none'; // hide video container
    document.getElementById('nb-container').style.display = 'block'; // show nb container
    updateNotebook();
}

// Main notebook button functionality
document.getElementById('main-nb').addEventListener('click', displayNbMainButtonOnClick, { passive : false});