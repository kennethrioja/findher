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

    getHelp(kw) {
        const exData = this.ex;
        for (let i = 0; i < exData.length; i++) {
            if (exData[i].keyword === kw) {
                return (exData[i].help);
            }
        }
        return ("undefined, please contact the support team");
    }

    getTrueAnswer(kw) {
        const exData = this.ex;
        for (let i = 0; i < exData.length; i++) {
            if (exData[i].keyword === kw) {
                return (exData[i].trueAnswer);
            }
        }
        return ("undefined, please contact the support team");
    }
    
    getFeedback(kw, flag) {
        const exData = this.ex;
        for (let i = 0; i < exData.length; i++) {
            if (exData[i].keyword === kw) {
                if (flag === 'true') { return (exData[i].trueFeedback); }
                else if (flag === 'false') { return (exData[i].falseFeedback); }
            }
        }
        return ("undefined, please contact the support team");
    }

    getCompleted(kw) {
        const exData = this.ex;
        for (let i = 0; i < exData.length; i++) {
            if (exData[i].keyword === kw) {
                return (exData[i].completed);
            }
        }
        return ("undefined, please contact the support team");
    }

    setCompletedToTrue(kw) {
        const exData = this.ex;
        for (let i = 0; i < exData.length; i++) {
            if (exData[i].keyword === kw) {
                exData[i].completed = true;
            }
        }
        return ("undefined, please contact the support team");
    }

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
    document.getElementById('audio-player').pause();
    document.getElementById('video-player').pause();
    document.getElementById('popup').style.display = 'none';
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

///////////
// VIDEO //
///////////

// handle video : change source, type
function handleVideo(mediaCode) {
    const videoSource = document.getElementById('video-source');
    const videoPlayer = document.getElementById('video-player');
    const videoPath = mediaCode == 'main-first' ?
                        './assets/media/video/00.mp4'
                        : './assets/media/video/' + mediaCode + '.mp4' // write complete src, there are only mp4

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
    const exFeedback = document.getElementById('ex-feedback');
    const kw = event.currentTarget.id.split(" ")[event.currentTarget.id.split(" ").length - 1];
    const btnNum = event.currentTarget.id.split(" ")[0][event.currentTarget.id.split(" ")[0].length - 1];

    // if click on right button
    if (+btnNum === ex.getTrueAnswer(kw)) {
        // display true feedback
        exFeedback.innerHTML = ex.getFeedback(kw, 'true');
        exFeedback.style.color = "green";
        event.currentTarget.style.backgroundColor = "green";
        // change css of the two first media-btn
        changeMediaBtnCSS(kw, 0, 'media');
        changeMediaBtnCSS(kw, 1, 'media');
        // enable the two first media-btn1 and media-btn2
        mediaBtnHandleListener('media', kw, 0);
        mediaBtnHandleListener('media', kw, 1);
        // change media-btn-3 virus to SUCCEED
        mediaBtnArray[2].id = "media-btn-3";
        mediaBtnArray[2].id += dic.getMediaBtnSuffix(kw, 2, ' '); // add code number after button id, to be able to display the corresponding media in ButtonOnClick()
        mediaBtnArray[2].innerHTML = "EXERCISE SUCCEED"; // change label of button
        mediaBtnArray[2].style.backgroundColor = "green"; // change label of button
        // set exercise to true
        ex.setCompletedToTrue(kw);
    } else {
        // display a false animation
        exFeedback.innerHTML = ex.getFeedback(kw, 'false');
        exFeedback.animate({ // https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API/Keyframe_Formats
            opacity: [0.3, 1], // [ from, to ]
            color: ["red", "black"], // [ from, to ]
            },500);
        event.currentTarget.animate({ // https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API/Keyframe_Formats
            opacity: [0.3, 1], // [ from, to ]
            backgroundColor: ["red", "#f1fff1"], // [ from, to ]
            },500);
    }
}

// when click on help btn, display help text/image
function displayExHelpTextOnClick(event) {
    document.getElementById('ex-help-text').style.display = 'block';
}

// when click on btn, handle exercise : change source & style
function handleExercise(exKeyword) {
    const exText = document.getElementById('ex-text');
    const exHelpBtn = document.getElementById('ex-help-btn');
    const exHelpText = document.getElementById('ex-help-text');

    // text : change exercise text
    exText.innerHTML = ex.getExText(exKeyword);
    // buttons : show the right number of choices
    for (let i = 0; i < exBtnArray.length; i++) {
        if (i < ex.getAnswer(exKeyword).length) {
            // change buttons text
            exBtnArray[i].innerHTML = ex.getAnswerText(exKeyword, i);
            exBtnArray[i].id = "ex-btn-" + (i + 1);
            exBtnArray[i].id += " " + exKeyword; // add keyword after ex button id, to be able to search for trueAnswer
            exBtnArray[i].style.backgroundColor = "#f1fff1";
            exBtnArray[i].style.display = 'block';
            // listener to click on exercise button
            exBtnArray[i].addEventListener('click', displayExFeedbackOnClick, { passive : false});
        } else {
            exBtnArray[i].style.display = 'none';
        }
    }
    // help button : set message, hide it and add event listener to click on help button
    exHelpText.innerHTML = ex.getHelp(exKeyword);
    exHelpText.style.display = 'none';
    exHelpBtn.addEventListener('click', displayExHelpTextOnClick, { passive : false});
}

// exercise listener onclick
function displayExerciseButtonOnClick(event) {
    const exKeyword = event.currentTarget.id.split(" ")[event.currentTarget.id.split(" ").length - 1];
    const exFeedback = document.getElementById('ex-feedback');

    // display exercise only
    document.getElementById('popup').style.display = 'block'; // show popup
    document.getElementById('ex-container').style.display = 'block'; // show exercise container
    // return to default exercise container style
    exFeedback.style.color = "black";
    exFeedback.innerHTML = "";
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

    // IF BUTTON IS A MEDIA
    if (flag.split(" ")[0] === 'media') {
        // remove exercise listener
        mediaBtnArray[i].removeEventListener('click', displayExerciseButtonOnClick);
        // if media is image, begin image listener onclick
        if (type === 'image') {
            mediaBtnArray[i].removeEventListener('click', displayVideoButtonOnClick);
            mediaBtnArray[i].addEventListener('click', displayImageButtonOnClick, { passive : false});
        // if media is video, begin video listener onclick
        } else if (type === 'video') {
            mediaBtnArray[i].removeEventListener('click', displayImageButtonOnClick);
            mediaBtnArray[i].addEventListener('click', displayVideoButtonOnClick, { passive : false});
        }
    // IF BUTTON IS AN EXERCISE
    } else if (flag === 'exercise') { 
        // remove image and video listeners of each btn
        for (let i = 0; i < 3; i++) {
            mediaBtnArray[i].removeEventListener('click', displayImageButtonOnClick);
            mediaBtnArray[i].removeEventListener('click', displayVideoButtonOnClick);    
        }
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
    // IF BUTTON IS A MEDIA
    if (flag.split(" ")[0] === 'media') {
        mediaBtnArray[i].id = "media-btn-" + (i + 1);
        mediaBtnArray[i].id += dic.getMediaBtnSuffix(searchWord, i, ' '); // add code number after button id, to be able to display the corresponding media in ButtonOnClick()
        mediaBtnArray[i].innerHTML = "Search Result " + (i + 1); // change label of button
        // if flag = "media blocked" && exercise not completed, change css to virus-blocked
        if (flag.split(" ").length === 2 && !ex.getCompleted(searchWord)) {
            mediaBtnArray[i].style.backgroundColor = '#8e4c98';
            mediaBtnArray[i].animate({ // https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API/Keyframe_Formats
                opacity: [0.1, 1], // [ from, to ]
                color: ["#8e4c98", "#000"], // [ from, to ]
                },750);  // timing
        // if flag = media, change css to normal button
        } else { 
            mediaBtnArray[i].style.backgroundColor = '#f1fff1';
            mediaBtnArray[i].animate({ // https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API/Keyframe_Formats
                opacity: [0.3, 1], // [ from, to ]
                color: ["#fff", "#000"], // [ from, to ]
                },750);
            mediaBtnArray[i].style.cursor = 'pointer';
        }
    // IF BUTTON IS AN EXERCISE
    } else if (flag.split(" ")[0] === 'exercise') {
        mediaBtnArray[i].id = "media-btn-" + (i + 1);
        mediaBtnArray[i].id += dic.getMediaBtnSuffix(searchWord, i, ' '); // add keyword to be able to display exercise
        mediaBtnArray[i].style.cursor = 'pointer';
        // if flag = "exercise completed", change css to exercise SUCCEED
        if (flag.split(" ").length === 2 && ex.getCompleted(searchWord)) {
            mediaBtnArray[2].innerHTML = "EXERCISE SUCCEED"; // change label of button
            mediaBtnArray[i].style.backgroundColor = 'green';
        // if ex not done purple
        } else {
            mediaBtnArray[i].innerHTML = "VIRUS Exercise"; // change label of button
            mediaBtnArray[i].style.backgroundColor = '#ee82ee';
            mediaBtnArray[i].animate({ // https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API/Keyframe_Formats
                    opacity: [0.1, 1], // [ from, to ]
                    color: ["#ee82ee", "#000"], // [ from, to ]
                },750);
        }
    }
}

// changes each media btn visually 
function mediaBtnBehavior(searchWord) {
    // for each media btn
    for (let i = 0; i < mediaBtnArray.length; i++) {
        // Is the slot linked with a media ? Yes, flag = media. No flag = exercise.
        let flag = i < dic.getOccurrences(searchWord) ? 'media' : 'exercise';

        // Is the media linked with an exercise ? Yes, flag = media block. No, flag = media.
        flag = flag === 'media' && dic.getOccurrences(searchWord) <= 2 ? flag + ' blocked' : flag;
        // Is the exercise completed ? Yes, flag = exercise completed. No, flag = exercise
        flag = flag === 'exercise' && ex.getCompleted(searchWord) ? flag + ' completed' : flag;
        // change media btn css depending on media or exercise
        changeMediaBtnCSS(searchWord, i, flag);
        // display red dot if never seen media
        handleRedDot(searchWord, i); 
        // initiate btn listener depending on media or exercise
        mediaBtnHandleListener(flag, searchWord, i)
    }
}

/////////////////////////////
// MAIN INTERFACE FUNCTION //
/////////////////////////////

// handle UI search bar
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
            // remove the animation
            document.querySelector('.search-bar').style.animation = ('unset');
            // do the main interface function
            mainInterfaceFct(document.getElementById('search-input').value.trim().toLowerCase());
    }
});

// Search icon functionality
document.querySelector('.search-icon').addEventListener(
    // when clicking on the search-icon
    'click', (event) => {
        // remove the animation
        document.querySelector('.search-bar').style.animation = ('unset');
        // do the main interface function
        mainInterfaceFct(document.getElementById('search-input').value.trim());
});

// Search icon functionality
document.getElementById('main-first').addEventListener('click',displayVideoButtonOnClick, { passive : false}); 

// Intro (done on ChatGPT)
// Chapter 1 button listener
document.getElementById('chapter-btn-1').addEventListener('click', function() {
    const introVideoContainer = document.getElementById('intro-video-container');
    const introVideoPlayer = document.getElementById('intro-video-player');

    introVideoContainer.classList.add('show');
    introVideoPlayer.load();
    introVideoPlayer.play();
});

// when video ends, shows "Let's find her"
document.getElementById('intro-video-player').addEventListener('ended', function() {
    const beginButton = document.getElementById('begin-button');
    const introVideoPlayer = document.getElementById('intro-video-player')

    beginButton.style.display = 'block';
    introVideoPlayer.removeAttribute("controls");
});

// "Let's find her" button listener
document.getElementById('begin-button').addEventListener('click', function() {
    const introVideoContainer = document.getElementById('intro-video-container');
    const firstPage = document.getElementById('first-page');
    const gameContainer = document.getElementById('game');

    introVideoContainer.classList.remove('show');
    firstPage.style.display = 'none';
    gameContainer.removeAttribute('hidden');
  });