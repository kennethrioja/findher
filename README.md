# Journal de developpement

## 26.04.2023 : 

3h : 
- 3h stylo-papier, variables à avoir, fonctions à implémenter, questions avant de commencer, to-do-list

## 31.05.2023 : Prompting et test

3h : 
- 2h sur le prompting
- 1h de test

Voici ce qui a été demandé à ChatGPT : 

```
Act as a front-end web developper. Come up with an architecture and code for developping an webpage using HTML, CSS and Javascript. The webpage is optimised for mobile use and all the content should be seen on-screen, which means no scrolling at all. The HTML, CSS, and JS codes are commented like an intermediate developper would do. For any image or icon I ask, use CC0 content. For each content used, make a comment at the bottom of the code with the name of the content, the attribution about the author and the website where you took the content. Make the least amount of lines in the HTML, CSS, and JS codes and do not use frameworks. There will be no memory leaks in the JavaScript code.

The webpage looks like this way :
- The webpage appears to the user as a modern smartphone interface. Do not use existing mobile interfaces to avoid copyright issues.
- On the top of the page (1/10 of the screen height) : a static header (div class = "header") shaped like a mobile phone header. The background is black and the icons are white. On the left of this header there are icons of the network and wifi. On the middle, the current real time (hh:mm). On the left an icon of the battery.
- On the rest of the screen (9/10 of the screen height, div class = "main") shows an interface (6/10 of the screen height, div class = "interface") and a footer (3/10 of the screen height, div class = "footer"). 
-- In the div class "interface", on the top, the there is a rectangular shaped search bar (class = "search-bar") where the user can click and write something, a magnifier icon is also clickable on the right of the search bar. In the main interface, under this search bar, there is a div (div class = "media") and inside it 3 buttons (of class = "media-btn" and respectively : id = "media-btn-1", id = "media-btn-2", id = "media-btn-3") displayed vertically. The buttons are rectangular with rounded angles to the same width of the search bar (add to your comments in the .css file : "CHANGE BUTTON SHAPE"). The search bar is a bit more distant that the three buttons. 
-- In the div class "footer", there are two buttons (of class = "apps-btn" and respectively id = "apps-msg" and id = "apps-notebook") equally distant from the middle of the screen width. There is also one button on the right (class = "apps-btn" and id = "apps-options"). The two first buttons are squares with rounded angles and a bit more larger than the last button. The "apps-msg" button displays a conversation icon. The "apps-notebook" button displays a notebook icon. The "apps-options" button displays an option icon.

The user's possible interactions on this page are : 
- Clicking on the search bar and writing things on the search bar.
- Pressing "enter" on the search bar or clicking the magnifier icon of the search bar would either change the buttons' images or make a pop-up window saying "Wrong". The images would be taken in "./assets/img". Since you do not know the images used, you can add to the comment where you implement this : "CHANGE IMG HERE".
- Clicking on one of the three button (id = "media-btn-1", id = "media-btn-2", id = "media-btn-3") shows a pop-up window, making the background grey (like images that can be viewed in most of webpages). This pop-up window shows an image located in "./assets/img" and plays a specific audio localised in "./assets/audio". Since you do not know the audio used, you can add to the comment where you implement this : "CHANGE AUDIO HERE".
- Clicking on the button of id = "apps-msg" changes the main interface (class = "main") to an other interface (class = "msg"). This "msg" interface displays on the top left a return button (class = "return-btn"), when clicked redirects to the main interface. On the rest of the screen, 5 vertically-structured buttons (respectively id = "msg-slot-{1..5}").
- Clicking on the button of id = "apps-notebook" changes the main interface (class = "main") to an other interface (class = "notebook"). This "notebook" interface displays on the top left the same return button than the previous "msg" interface. On the rest of the screen, 2 div (of class = "notebook-div" and respectively id = "notebook-true" and id = "notebook-false") vertically displayed. Each div has a centered text on the top it (respectively "TRUE" and "WRONG"). Each div has inside it another div (of class = "notebook-div-content" and respectively id = "notebook-true-content" and class = "notebook-false-content") with text inside it (respectively "TRUECONTENTS" and "WRONGCONTENTS").
- Clicking on the button of id "apps-options" changes the main interface (class = "main") to an other interface (class = "options"). This "options" interface displays on the top left the same return button than the previous "msg" interface. On the rest of the screen, there are 2 buttons (of class = "options-btn" and respectively id = "options-home", id = "options-credits").`
```

Le résultat se trouve au premier commit du repo : https://github.com/kennethrioja/findher/commit/ea299305432fd4cf025686c543d71e75d422ec5b

A faire ensuite : 

* Meca primaire, secondaire et gestion erreur

## 03.06.2023 : 

4h : 
- 1h : introduit le JSON et how to use it
- 3h : comment chercher dans le JSON, search word in json works, idée pour implémentation de notebook, commence à changer le media

## 04.06.2023 : 

+/- 10h : 
- 2h : change media button label
- 2h : begin media button behavior
- 2h : handle media types to be displayed
- 15min : check final json
- 1h : downloaded all media and figuring out how to display them with each object/criteria in json file
- 1h : created 'Json' class, pretty happy about it
- 1h : create and handle red dot
- 1h : get right image extension to be able to show correct image, 

## 05.06.2023 : 

5h30h : 
- 1h : now shows correct images with keyword, and badge gets removed when we click on the img - it is constant
- 10min : looking at cookies to be able to save : https://stackoverflow.com/questions/4825683/how-do-i-create-and-read-a-value-from-cookie-with-javascript/4825695#4825695, https://www.quirksmode.org/js/cookies.html, https://stackoverflow.com/questions/11344531/pure-javascript-store-object-in-cookie
- 1h : audio with autoplay works, nailed it
- 30min : video works
- 30min : changed css, cursor, how to begin the game
- 1h : setting up Notebook class
- 9:56, 30min: new history for each input entered, don't know where to put the mirador-like to check if all media from a keyword are already seen to be able to put it in green in notebook.
- 10:31, 1h, notebook behavior

## 11.06.2023 : 

1h : think about virus implementation, autoplay true

## 12.06.2023 : 

9h :
- 30min: notebook interface in popup window
- 1h : progress bar
- 1h30 : compteur mot-clés, circular progress bars for media and word
- 30min : new media added fade in for red dot
- 30min : fixed media progression bug
- 5min : error handling minuscules
- 1h : asked chatgpt to find leaks in js code, he did not find leaks but ways to improve the code, which I did so.
- 2h : clean code before doing begin and end
- 2h : begin exercise, create class, import json

## 13.06.2023 : 

7h :
- 7h : exercise mechanic

## 17.06.2023 :

5h : 
- 1h30 : begin game/intro with chatGPT
- 20min : keep Introduction video always at hand
- 3h : how to finish the game

## 18.06.2023 :

5h :
- 1h : finish game
- 2h : help mechanic
- 2h : team meeting on design

## 19.06.2023 : 

4h : 
- 4h html/css

# TODO

## details : 
- searchbar icon hover (css styling)
- css, styling
- begin : block chap 2 and 3
- unlock chap 2 but say "TO BE CONTINUED"
- début du jeu, media-btn are disabled (css styling)

## to check after finishing :
- criminal 3 marche pas / 43 marche pas
- drunk 2 marche pas
- 44

## Functionalities not included : 
- save (includes cookies)
- mobile 

## Les mécaniques incluses dans cette version sont : 
- exercise (quand keyword a 2 media, le 3è est un exercice)
- help (après 4 mots faux, donne mot clé pour exercice)


# Attributions : 

Search icon : <a href="https://www.flaticon.com/free-icons/loupe" title="loupe icons">Loupe icons created by Fuzzee - Flaticon</a>
Wifi icon : <a href="https://www.flaticon.com/free-icons/wifi" title="wifi icons">Wifi icons created by Google - Flaticon</a>
Signal icon : <a href="https://www.flaticon.com/free-icons/signal" title="signal icons">Signal icons created by Iconjam - Flaticon</a>
Battery icon : <a href="https://www.flaticon.com/free-icons/half" title="half icons">Half icons created by Freepik - Flaticon</a>