import dictionary from '../json/dictionary.json' assert {type: 'json'};
import exercises from '../json/exercises.json' assert {type: 'json'};

// #############
// ## CLASSES ##
// #############

class Dictionary {
    dic;

    constructor(dic, ex) {
        const exo = ex;
        // this is hideous sorry
        for (let i = 0; i < exo.ex.length; i++) {
            for (let j = 0; j < dic.length; j++) {
                for (let k = 0; k < dic[j].keywords.length; k++) {
                    if (exo.ex[i].keyword === dic[j].keywords[k]) {
                        dic[j].virus = true;
                    }
                }
            }
        }
        this.dic = dic;
    }

    // length
    length() {
        return (this.dic.length);
    }

    // count seen
    getSeen() {
        const dicData = this.dic;
        let n = 0;

        for (let i = 0; i < dicData.length; i++) {
            if (dicData[i].seen === true) {
                n++;
            }
        }
        return (n);
    }

    getKeyWordListRaw() {
        const dicData = this.dic;
        let list = [];

        for (let i = 0; i < dicData.length; i++) {
            for (let j = 0; j < dicData[i].keywords.length; j++) {
                list.push(dicData[i].keywords[j]);
            }
        }
        return (list);
    }

    getKeyWordListNoDup() { // https://stackoverflow.com/questions/1960473/get-all-unique-values-in-a-javascript-array-remove-duplicates
        return(this.getKeyWordListRaw().filter((v,i,a)=>a.indexOf(v)==i));
    }

    // count occurrences of searchWord in dic
    getOccurrences(searchWord) {
        const dicData = this.dic;
        let n = 0;

        for (let i = 0; i < dicData.length; i++) {
            for (let j = 0; j < dicData[i].keywords.length; j++) {
                if (searchWord === dicData[i].keywords[j] && dicData[i].keywords[0]) { // ERROR HANDLING : what if jon au lieu de john ?
                    n++;
                }
            }
        }
        return (n);
    }

    // get media type from the expected occurrence (occ)
    getMediaType(searchWord, occ) {
        const dicData = this.dic;
        let loop = -1;

        for (let i = 0; i < dicData.length; i++) {
            for (let j = 0; j < dicData[i].keywords.length; j++) {
                if (searchWord === dicData[i].keywords[j]) {
                    loop++;
                    if (loop === occ) {
                        return (dicData[i].type);
                    }
                }
            }
        }
        return (null);
    }

    // get media code from the expected occurrence (n)
    getMediaBtnSuffix(searchWord, n, prefix) {
        const dicData = this.dic;
        let loop = -1;

        for (let i = 0; i < dicData.length; i++) {
            for (let j = 0; j < dicData[i].keywords.length; j++) {
                if (searchWord === dicData[i].keywords[j]) {
                    loop++;
                    if (loop === n) {
                        return (prefix  + dicData[i].code);
                    }
                }
            }
        }
        return (prefix + searchWord);
    }

    // mark as 'true' the media that has been seen and hide dot
    isSeen(mediaCode) {
        const dicData = this.dic;

        for (let i = 0; i < dicData.length; i++) {
            for (let j = 0; j < dicData[i].keywords.length; j++) {
                if (mediaCode === dicData[i].code) {
                    dicData[i].seen = true;
                    return (1);
                }
            }
        }
        return (0);
    }

    // get virus
    getVirus(searchWord, n) {
        const dicData = this.dic;
        let loop = -1;

        for (let i = 0; i < dicData.length; i++) {
            for (let j = 0; j < dicData[i].keywords.length; j++) {
                if (searchWord === dicData[i].keywords[j]) {
                    loop++;
                    if (loop === n) {
                        return (dicData[i].virus);
                    }
                }
            }
        }
        return (0);
    }
}

// #################### //
// #################### //
// #################### //

class Notebook {
    history;
        // word : searchWord,
        // attemptArray : [this.maxAttempt],
        // true : isIndic
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

    addEntryToHistory(searchWord, isIndic) {
        if (!this.isInNotebook(searchWord)) { // if new entry
            this.#addNewEntryToHistory(searchWord, isIndic);
        } else { // else if already in entry
            this.#addNotNewEntryToHistory(searchWord);
        }
        // change words progression
        this.#updateWordProgress();
        
    }

    countTrueWords() {
        const historyData = this.history;
        let rez = {};

        historyData.forEach(function(item){
          rez[item.true] ? rez[item.true]++ :  rez[item.true] = 1;
        });
        return(rez.true);
    }

    #addNewEntryToHistory(searchWord, isIndic, notebook) {
        const historyData = this.history;

        this.#maxAttempt++;
        let newHistory = {
            word : searchWord,
            attemptArray : [this.#maxAttempt],
            true : isIndic
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
        let cWord = document.getElementById('circle-word');
        let cWordDiv = document.getElementById('circle-word-div');
        const countTrueWords = this.countTrueWords();
        const getKeyWordListNoDupLen = dic.getKeyWordListNoDup().length;
        const percentage = Math.round(countTrueWords / getKeyWordListNoDupLen * 100)
        const displayTrueWords = countTrueWords === undefined ? 0 : countTrueWords

        cWord.style.backgroundImage = "conic-gradient(#b5838d " + percentage + "%, #ffcdb2 0)";
        cWordDiv.innerHTML = "Word<br>" + displayTrueWords + '/' + getKeyWordListNoDupLen;
    }
}

// #################### //
// #################### //
// #################### //

class Exercises {
    ex;

    constructor(ex) {
        this.ex = ex;
    }

    getExText(kw) {
        const exData = this.ex;
        for (let i = 0; i < exData.length; i++) {
            if (exData[i].keyword === kw) {
                return (exData[i].exText);
            }
        }
        return ("undefined, please contact the support team");
    }

    getAnswer(kw) {
        const exData = this.ex;
        for (let i = 0; i < exData.length; i++) {
            if (exData[i].keyword === kw) {
                return (exData[i].answer);
            }
        }
        return ("undefined, please contact the support team");
    }

    getAnswerText(kw, i) {
        return (this.getAnswer(kw)[i].text);
    }

    getHelp(kw) {}

    getTrueAnswer(kw) {
        const exData = this.ex;
        for (let i = 0; i < exData.length; i++) {
            if (exData[i].keyword === kw) {
                return (exData[i].trueAnswer);
            }
        }
        return ("undefined, please contact the support team");
    }
    
    getTrueFeedback(kw) {}

    getFalseFeedback(kw) {}

    getDone(kw) {}
}

// instantiate exercises, dic and notebook
var ex = new Exercises(exercises);
var dic = new Dictionary(dictionary, ex); // dictionary relies on exercises to set codes affected by virus (if ex.word, then set to true all dic.words === ex.word)
var notebook = new Notebook();

// #########
// ## DOM ##
// #########

var mediaBtnArray = [document.getElementById('media-btn-1'), 
                        document.getElementById('media-btn-2'),
                        document.getElementById('media-btn-3')];

var exBtnArray = [document.getElementById('ex-btn-1'), 
                    document.getElementById('ex-btn-2'),
                    document.getElementById('ex-btn-3'),
                    document.getElementById('ex-btn-4')];


// ###########
// ## UTILS ##
// ###########

// fade in animation : https://stackoverflow.com/questions/6121203/how-to-do-fade-in-and-fade-out-with-javascript-and-css
function animFadeIn(e, col) {
    let op = 0.1;  // initial opacity

    e.style.backgroundColor = col;
    let timer = setInterval(function () {
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
    let clockElement = document.getElementById('clock');

    function updateClock ( clock ) {
        clock.innerHTML = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    }
    setInterval(function () {
        updateClock( clockElement );
    }, 1000);
}());

// update media's circular progress bar
function updateMediaProgress() {
    let cMedia = document.getElementById('circle-media');
    let cMediaDiv = document.getElementById('circle-media-div');
    const countSeen = dic.getSeen();
    const percentage = Math.round(countSeen / dic.length() * 100);

    cMedia.style.backgroundImage = "conic-gradient(#b5838d " + percentage + "%, #ffcdb2 0)";
    cMediaDiv.innerHTML = "Media<br>" + countSeen + '/' + dic.length();
}

// close popup functionality
function closePopupp() {
    document.getElementById('popup').style.display = 'none';
    document.getElementById('audio-player').pause();
    document.getElementById('video-player').pause();
    // update media progression
    updateMediaProgress();  
}

function closePopup(element) {
    element.addEventListener('click', closePopupp);
    window.onkeydown = function(event) {
        if ( event.keyCode == 27  && document.getElementById('popup').style.display === 'block') {
            closePopupp();
        }
    };    
}

closePopup(document.getElementById('close-button'));

// ###############
// ## FUNCTIONS ##
// ###############

///////////
// VIDEO //
///////////

// handle video : change source, type
function handleVideo(mediaCode) {
    const videoSource = document.getElementById('video-source');
    const videoPlayer = document.getElementById('video-player');
    const videoPath = './assets/media/video/' + mediaCode + '.mp4' // write complete src, there are only mp4

    videoSource.src = videoPath;
    videoSource.type = "video/mp4";
    videoPlayer.style.height = "85vh";
    videoPlayer.load();
    videoPlayer.play();
}

// video listener onclick
function displayVideoButtonOnClick(event) {
    const mediaCode = event.currentTarget.id.split(" ")[event.currentTarget.id.split(" ").length - 1];
    const btnNum = event.currentTarget.id.split(" ")[0][event.currentTarget.id.split(" ")[0].length - 1];

    // display video only
    document.getElementById('popup').style.display = 'block'; // show popup
    document.getElementById('video-container').style.display = 'block'; // show video container
    // call right video with few style modifications
    handleVideo(mediaCode, btnNum);
    // as media is seen, hide red dot
    if (dic.isSeen(mediaCode)) {
        document.getElementById('dot' + btnNum).style.backgroundColor = 'transparent';
    }
    // hide video, nb and exercise container
    document.getElementById('image-container').style.display = 'none'; // hide image container
    document.getElementById('nb-container').style.display = 'none'; // hide nb container
    document.getElementById('ex-container').style.display = 'none'; // hide nb container
}

///////////////////
// IMAGE + AUDIO //
///////////////////

// handle audio : change source & type, load and play audio
function handleAudio(mediaCode) {
    const audioSource = document.getElementById('audio-source');
    const audioPlayer = document.getElementById('audio-player');
    const audioPath = './assets/media/audio/' + mediaCode + '.mp3' // write complete src, there are only mp3

    audioSource.src = audioPath;
    audioSource.type = "audio/mp3";
    audioPlayer.load();
    audioPlayer.play();
}

// handle image : change source & style
function handleImage(mediaCode) {
    const img = document.getElementById('image') // get image DOM
    const prefixImgSrc = './assets/media/img/' + mediaCode // write src without file extension

    img.src = prefixImgSrc + '.png';
    img.onerror = function() {
        img.src = prefixImgSrc + '.jpg';
        img.onerror = function() {
            img.src = prefixImgSrc + '.gif';
        };
    }; // this gives a lot of errors, try to make it softer, can add to dic "extension" to be able add it directly
    console.log('ignore errors with either .png or .jpg, img has been found : ' + img.src); // can add to dic "extension" to be able add it directly
    img.style.height = '85vh';
    img.style.width = 'auto';
    // TODO : add alt
}

// image listener onclick
function displayImageButtonOnClick(event) {
    const mediaCode = event.currentTarget.id.split(" ")[event.currentTarget.id.split(" ").length - 1];
    const btnNum = event.currentTarget.id.split(" ")[0][event.currentTarget.id.split(" ")[0].length - 1];

    // display image only
    document.getElementById('popup').style.display = 'block'; // show popup
    document.getElementById('image-container').style.display = 'block'; // show image container
    // call right image with few style modifications
    handleImage(mediaCode, btnNum);
    // call right audio with few style modifications
    handleAudio(mediaCode, btnNum);
    // as media is seen, hide red dot
    if (dic.isSeen(mediaCode)) {
        document.getElementById('dot' + btnNum).style.backgroundColor = 'transparent';
    }
    // hide video, nb and exercise container
    document.getElementById('video-container').style.display = 'none';
    document.getElementById('nb-container').style.display = 'none';
    document.getElementById('ex-container').style.display = 'none';
}

//////////////
// EXERCISE //
//////////////

// handle feedback
function displayExFeedbackOnClick(event){
    const kw = event.currentTarget.id.split(" ")[event.currentTarget.id.split(" ").length - 1];
    const btnNum = event.currentTarget.id.split(" ")[0][event.currentTarget.id.split(" ")[0].length - 1];

    console.log(btnNum + " " + kw);
    // if click on right button
    if (btnNum === ex.getTrueAnswer(kw)) {
        // display true feedback
        // enable the btn1 and btn2 media
        // change btn-media virus to DONE
    }
}

// handle exercise : change source & style
function handleExercise(exKeyword) {
    const exText = document.getElementById('ex-text');
    const exHelpBtn = document.getElementById('ex-help-btn');
    const exHelpText = document.getElementById('ex-help-text');
    const exFeedback = document.getElementById('ex-feedback');

    console.log();
    // change exercise text
    exText.innerHTML = ex.getExText(exKeyword);
    // change buttons text
    for (let i = 0; i < exBtnArray.length; i++) {
        if (i < ex.getAnswer(exKeyword).length) {
            exBtnArray[i].innerHTML = ex.getAnswerText(exKeyword, i);
            exBtnArray[i].id = "ex-btn-" + (i+1);
            exBtnArray[i].id += " " + exKeyword; // add keyword after ex button id, to be able to search for trueAnswer
            exBtnArray[i].style.display = 'block';
            // listener to right answer
            exBtnArray[i].addEventListener('click', displayExFeedbackOnClick, { passive : false});
        } else {
            exBtnArray[i].style.display = 'none';
        }
    }

    // help
}

// exercise listener onclick
function displayExerciseButtonOnClick(event) {
    const exKeyword = event.currentTarget.id.split(" ")[event.currentTarget.id.split(" ").length - 1];

    // display exercise only
    document.getElementById('popup').style.display = 'block'; // show popup
    document.getElementById('ex-container').style.display = 'block'; // show exercise container
    // call right exercise
    handleExercise(exKeyword);
    // hide image, video and nb container
    document.getElementById('image-container').style.display = 'none';
    document.getElementById('video-container').style.display = 'none';
    document.getElementById('nb-container').style.display = 'none';
}

///////////////////////
// BTN CHOOSE HANDLE //
///////////////////////

// when clicking on ONE button, chooses whether to show nothing, image, video or exercise
function mediaBtnHandleListener(flag, searchWord, i) {
    const type = dic.getMediaType(searchWord, i);

    console.log(mediaBtnArray[i].id);
    if (flag === 'media' && dic.getOccurrences(searchWord) === 3) {
        // remove exercise listener
        mediaBtnArray[i].removeEventListener('click', displayExerciseButtonOnClick);
        // if media is part of virus exercise, cannot interact with button
        if (dic.getVirus(searchWord, i)) {
            mediaBtnArray[i].removeEventListener('click', displayVideoButtonOnClick);
            mediaBtnArray[i].removeEventListener('click', displayImageButtonOnClick);
        // if media is image, begin image listener onclick
        } else if (type === 'image') {
            mediaBtnArray[i].removeEventListener('click', displayVideoButtonOnClick);
            mediaBtnArray[i].addEventListener('click', displayImageButtonOnClick, { passive : false});
        // if media is video, begin video listener onclick
        } else if (type === 'video') {
            mediaBtnArray[i].removeEventListener('click', displayImageButtonOnClick);
            mediaBtnArray[i].addEventListener('click', displayVideoButtonOnClick, { passive : false});
        }
    // if btn is exercise
    } else if (flag === 'exercise') { 
        // // remove image and video listeners of each btn
        // for (let i = 0; i < 3; i++) {
        //     mediaBtnArray[i].removeEventListener('click', displayImageButtonOnClick);
        //     mediaBtnArray[i].removeEventListener('click', displayVideoButtonOnClick);    
        // }
        // begin image listener onclick
        mediaBtnArray[i].addEventListener('click', displayExerciseButtonOnClick, { passive : false});
    }
}

////////////////
// BUTTONS UI //
////////////////

// show red dot / notification badge when never seen, else hide it
function handleRedDot(searchWord, n) {
    const dicData = dic.dic;
    let loop = -1;

    for (let i = 0; i < dicData.length; i++) {
        for (let j = 0; j < dicData[i].keywords.length; j++) {
            if (searchWord === dicData[i].keywords[j]) {
                loop++;
                if (loop === n && dicData[i].seen === false) {
                    animFadeIn(document.getElementById('dot' + (n + 1)), '#fa3e3e');
                    return ;
                }
            }
        }
    }
    document.getElementById('dot' + (n + 1)).style.backgroundColor = 'transparent';
}

// change only CSS of media-btn, if it is part of a virus exercise show it as 'virus-like', else show it as 'normal clickable button'
function changeMediaBtnCSS(searchWord, i, flag) {
    if (flag === 'media') {
        // UI : notification of a new media to be clicked
        mediaBtnArray[i].id = "media-btn-" + (i + 1);
        mediaBtnArray[i].id += dic.getMediaBtnSuffix(searchWord, i, ' '); // add code number after button id, to be able to display the corresponding media in ButtonOnClick()
        mediaBtnArray[i].innerHTML = "Search Result " + (i + 1); // change label of button        
        // if the media is blocked by virus
        if (dic.getVirus(searchWord, i)) {
            mediaBtnArray[i].style.backgroundColor = '#8e4c98';
            mediaBtnArray[i].animate({ // https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API/Keyframe_Formats
                opacity: [0.1, 1], // [ from, to ]
                color: ["#8e4c98", "#000"], // [ from, to ]
                },750);  // timing
        } else {
            mediaBtnArray[i].style.cursor = 'pointer';
            mediaBtnArray[i].style.backgroundColor = '#f1fff1';
            mediaBtnArray[i].animate({ // https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API/Keyframe_Formats
                opacity: [0.3, 1], // [ from, to ]
                color: ["#fff", "#000"], // [ from, to ]
                },750);    
        }
    } else if (flag === 'exercise') {
        // UI : notification of an exercise to be done
        mediaBtnArray[i].id += dic.getMediaBtnSuffix(searchWord, i, ' '); // add keyword to be able to display exercise
        mediaBtnArray[i].innerHTML = "VIRUS Exercise"; // change label of button
        mediaBtnArray[i].style.cursor = 'pointer';
        mediaBtnArray[i].style.backgroundColor = '#ee82ee';
        mediaBtnArray[i].animate({ // https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API/Keyframe_Formats
                opacity: [0.1, 1], // [ from, to ]
                color: ["#ee82ee", "#000"], // [ from, to ]
            },750);
    }
}

// changes each media btn visually 
function mediaBtnBehavior(searchWord) {
    // for each media btn
    for (let i = 0; i < mediaBtnArray.length; i++) {
        // if the slot has a media
        if (i < dic.getOccurrences(searchWord)) {
            // change media btn css for MEDIA
            changeMediaBtnCSS(searchWord, i, 'media');
            // initiate MEDIA btn listener
            mediaBtnHandleListener('media', searchWord, i);
        // else it is an exercise    
        } else { 
            // change media btn css for EXERCISE
            changeMediaBtnCSS(searchWord, i, 'exercise');
            // initiate EXERCISE btn listener
            mediaBtnHandleListener('exercise', searchWord, i)
        }
        // in any case : display red dot if never seen media
        handleRedDot(searchWord, i); 
    }
}

/////////////////////////////
// MAIN INTERFACE FUNCTION //
/////////////////////////////

// handles search bar UI
function mainInterfaceFct(searchWord) {
    const searchInput = document.getElementById('search-input');

    // if the word is found at least once
    if (dic.getOccurrences(searchWord) > 0) {
        if (searchWord === 'begin') {
            searchInput.placeholder = 'Search';
            searchInput.value = '';
        }
        // keep this TRUE word in notebook
        notebook.addEntryToHistory(searchWord, true);
        // UI : media buttons are changed
        mediaBtnBehavior(searchWord);
    } else {
        // keep this FALSE word in notebook
        notebook.addEntryToHistory(searchWord, false);
        // UI : ask for retry through search bar
        if (searchWord != "42") {
            searchInput.placeholder = "No media found on word '" + searchWord + "', try again.";
        } else {
            searchInput.placeholder = "Wanna seek the truth right ? Aren't we all looking for it ?"; // easter egg
        }
        searchInput.value = '';            
    }
}

// Search bar functionality
document.getElementById('search-input').addEventListener(
    // when clicking enter in the input
    'keydown', (event) => { 
        if (event.key === 'Enter') {
            // do the main interface function
            mainInterfaceFct(document.getElementById('search-input').value.trim().toLowerCase());
    }
});

// Search icon functionality
document.querySelector('.search-icon').addEventListener(
    // when clicking on the search-icon
    'click', (event) => {
        // do the main interface function
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
    updateNotebook();
    document.getElementById('popup').style.display = 'block'; // show popup
    document.getElementById('image-container').style.display = 'none'; // hide image container
    document.getElementById('video-container').style.display = 'none'; // hide video container
    document.getElementById('nb-container').style.display = 'block'; // show nb container
}

// Main notebook button functionality
document.getElementById('main-nb').addEventListener(
    // when clicking on 'Notebook' button
    'click', displayNbMainButtonOnClick, { passive : false});
