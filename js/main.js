import { GAME_STATUS, GAME_TIME, PAIRS_COUNT } from './constants.js'
import { getColorElementList,  getColorListElement, getInActiveColorList, getPlayAgainButton} from './selectors.js'
import {createTimer, getRandomColorPairs , setBackgroundColor, hidePlayAgainButton, setTimerText, showPlayAgainButton} from './utils.js'

// Global variables
// 1 phan tu thi khong lam gi ca, 2 phan tu thi lam
let selections = []
let gameState = GAME_STATUS.PLAYING
let timer = createTimer({
    // seconds: GAME_TIME,
    seconds: GAME_TIME,
    onChange: handleTimerChange,
    onFinish: handleTimerFinish,
})

function handleTimerChange(second) {
    const fullSecond = `0${second}`.slice(-2)
    setTimerText(fullSecond)
}

function handleTimerFinish(){
    console.log('Finished')
    gameState = GAME_STATUS.FINISHED
    setTimerText('Game Over!!!')
    showPlayAgainButton();
}

// TODOs
// 1. Generating colors using https://github.com/davidmerfield/randomColor
// 2. Attach item click for all li elements
// 3. Check win logic
// 4. Add timer
// 5. Handle replay click


//handleColorClick 1
//handleColorClick 2
//handleColorClick 3
// set timeOut 2 -> reset selections
// set timeOut 3 -> errors

// lay duoc the li
function handleColorClick(liElement) {
    const shouldBlockClick = [GAME_STATUS.BLOCKING, GAME_STATUS.FINISHED].includes(gameState)

    // da click roi thi khong duoc click nua
    const isClicked = liElement.classList.contains('active')
    if(!liElement || isClicked || shouldBlockClick) return;

    // show color for clicked cell
    liElement.classList.add('active');

    //save clicked cell to selections
    selections.push(liElement);
    if(selections.length < 2) return;

    //check match
    const firstColor = selections[0].dataset.color;
    const secondColor = selections[1].dataset.color;
    const isMatch = firstColor == secondColor;

    if(isMatch){
        // check win
        // can use either first or second color (as they are the same)
         setBackgroundColor(firstColor)

        const isWin = getInActiveColorList().length == 0
        if (isWin) {
            //show replay
            showPlayAgainButton()
            //show youwin
            setTimerText('YOU WIN!')
            timer.clear()

            // khong click nua
            gameState = GAME_STATUS.FINISHED
        }

        // khong co the li nao khong co active

        selections = [];
        return ;
    }

    // in case of not match
    // remove active class for 2 li elements

gameState = GAME_STATUS.BLOCKING;

setTimeout(() => {
    selections[0].classList.remove('active')
    selections[1].classList.remove('active')

      //reset selections for the next turn
      selections = [];

      // race condition check with handleTimerFinish
      if(gameState != GAME_STATUS.FINISHED){
        gameState = GAME_STATUS.PLAYING;
      }

   },500)
}

function initColors() {
    // random 8 pairs of colors
    const colorList = getRandomColorPairs(PAIRS_COUNT)

    // bind to li > div.overlay
    const liList = getColorElementList()
    liList.forEach((liElement, index) => {

        liElement.dataset.color = colorList[index]

        const overlayElement = liElement.querySelector('.overlay')
        if(overlayElement) overlayElement.style.backgroundColor = colorList[index]
    })
}

// gan su kien cho the ul
function attachEventForColorList(){
    const ulElement = getColorListElement();
    if(!ulElement) return;

    ulElement.addEventListener('click', (event) => {
        // bo add active vao the div 
        if(event.target.tagName != 'LI') return;
        handleColorClick(event.target);
    })
 }


 function attachEventForPlayAgainButton(){
    const playAgainButton = getPlayAgainButton()
    if(!playAgainButton) return;

    playAgainButton.addEventListener('click', resetGame)
 }

 function resetGame(){
    // reset golbal vars
    let selections = []
    let gameState = GAME_STATUS.PLAYING

    // reset DOM elements
    // - remove active class from li
    // - hide replay button
    // - clear youwin / timeout text
    const colorElementList = getColorElementList();
    for( const colorElement of colorElementList){
        colorElement.classList.remove('active')
    }

    hidePlayAgainButton()
    setTimerText('')

    // re-generate new colors
    initColors()

     // reset background color
    setBackgroundColor('goldenrod')

    // start a new game
    startTimer()
 }


 function startTimer(){
    timer.start()
 }


// main
(() => {
    initColors();
    attachEventForColorList();
    attachEventForPlayAgainButton();
    startTimer();
})()