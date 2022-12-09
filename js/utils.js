import { getColorBackground, getTimerElement, getPlayAgainButton} from './selectors.js'


// Random màu cho game


// Đảo mảng lên
function shuffle(arr){
  if(!Array.isArray(arr) || arr.length <= 2) return arr;

  for(let i = arr.length - 1; i> 1; i--){
    // tao ra mot con so nho hon i roi gán vào j
    const j = Math.floor(Math.random() * i);

    let temp = arr[i]
    arr[i] = arr[j]
    arr[j] = temp
  }
}

export const getRandomColorPairs = (count) => {
  // receive count --> return count * 2 random colors
  // using lib: https://github.com/davidmerfield/randomColor

  const colorList = []
  const hueList = ["red", "orange", "yellow", "green", "blue", "purple", "pink", "monochrome"]

  // random "count" colors
  for( let i =0; i< count; i++){
    //randomColor function is provided by https://github.com/davidmerfield/randomColor
    const color = window.randomColor({
      luminosity: 'dark',
      //run in hueList
      hue: hueList[i % hueList.length],
    })

    colorList.push(color)
  }

  //double current color list
  const fullColorList = [...colorList,...colorList]

  // shuffle it

  shuffle(fullColorList)
  return fullColorList;

}


export function showPlayAgainButton(){
  const playAgainButton = getPlayAgainButton();
  if(playAgainButton) playAgainButton.classList.add('show');
}

export function hidePlayAgainButton(){
  const playAgainButton = getPlayAgainButton();
  if(playAgainButton) playAgainButton.classList.add('remove');
}

export function setTimerText(text) {
  const timerElement = getTimerElement()
  if (timerElement) timerElement.textContent = text
}


// truyền vào 1 object
// onChange: mỗi giây bạn làm gì đó bạn làm
// xuống 0 thì gọi onFinish
export function createTimer({seconds, onChange, onFinish}){
  let intervalId = null;

  function start() {
    clear();

    let currentSecond = seconds

    intervalId = setInterval(() => {
      // cach 1: if(onChange) onChange(currentSecond )
      onChange ?. (currentSecond)

      currentSecond--;
      if(currentSecond<0)
      {
        clear()
        onFinish?.()
      }

    }, 1000);
  }

  function clear() {
    clearInterval(intervalId)
  }

  return{
    start,
    clear,
  }
}


export function setBackgroundColor(color) {
  const backgroundElement = getColorBackground()
  if (backgroundElement) backgroundElement.style.backgroundColor = color
}