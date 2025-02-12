// Pages
const gamePage = document.getElementById('game-page');
const scorePage = document.getElementById('score-page');
const splashPage = document.getElementById('splash-page');
const countdownPage = document.getElementById('countdown-page');
// Splash Page
const startForm = document.getElementById('start-form');
const radioContainers = document.querySelectorAll('.radio-container');
const radioInputs = document.querySelectorAll('input');
const bestScores = document.querySelectorAll('.best-score-value');
// Countdown Page
const countdown = document.querySelector('.countdown');
// Game Page
const itemContainer = document.querySelector('.item-container');
// Score Page
const finalTimeEl = document.querySelector('.final-time');
const baseTimeEl = document.querySelector('.base-time');
const penaltyTimeEl = document.querySelector('.penalty-time');
const playAgainBtn = document.querySelector('.play-again');

// Equations
let questionAmmount = 0;
let equationsArray = [];
let playerGuessArray = [];
let bestScoreArray = [];

// Game Page
let firstNumber = 0;
let secondNumber = 0;
let equationObject = {};
const wrongFormat = [];

// Time

let timer;
let timePlayed = 0;
let baseTime = 0;
let penaltyTime = 0;
let finalTime = 0;
let finalTimeDisplay = '0.0';


// Scroll
let valueY = 0;

// best score
function bestScoresToDOM(){

  bestScores.forEach((bestScore , index) =>{

    const bestScoreEl = bestScore;
    bestScoreEl.textContent = `${bestScoreArray[index].bestScore}s`;

  })


}
// update best score array
function updateBestScore(){
  bestScoreArray.forEach((score , index) => {

    // select correct best score to update
    if(questionAmmount == score.questions){
      const SavedBestScore = Number(bestScoreArray[index].bestScore);
      //update if the new final socre is best or was 0 before
      if(SavedBestScore === 0 || SavedBestScore > finalTime){
        bestScoreArray[index].bestScore = finalTimeDisplay;
      }
    }

  });
  bestScoresToDOM();
  localStorage.setItem('bestScores' , JSON.stringify(bestScoreArray));

}

//check local storage for best scores and adding 
function getSavedBestScores(){
  if(localStorage.getItem('bestScores')){
    bestScoreArray = JSON.parse(localStorage.bestScores);
  } else {
    bestScoreArray = [

      { questions: 10 , bestScore: finalTimeDisplay} ,
      { questions: 25 , bestScore: finalTimeDisplay} ,
      { questions: 50 , bestScore: finalTimeDisplay} ,
      { questions: 99 , bestScore: finalTimeDisplay} , 
    
    ];
    localStorage.setItem('bestScores' , JSON.stringify(bestScoreArray));
  }
  bestScoresToDOM();
}

// play again
function playAgain(){

  gamePage.addEventListener('click' , startTimer);
  scorePage.hidden = true;
  splashPage.hidden = false;
  equationsArray = [];
  playerGuessArray = [];
  valueY = 0;
  playAgainBtn.hidden = true;
}

// show score page
function showScorePage(){
  // show play again after 1s
  setTimeout(() => {
    playAgainBtn.hidden = false;
  } , 1000);
  gamePage.hidden = true;
  scorePage.hidden = false;
}
//scores to DOM

function scoresToDOM(){
  finalTimeDisplay = finalTime.toFixed(1);
  baseTime = timePlayed.toFixed(1);
  penaltyTime = penaltyTime.toFixed(1);
  baseTimeEl.textContent = `Base Time : ${baseTime}`;
  penaltyTimeEl.textContent = `Penalty : + ${penaltyTime}s`;
  finalTimeEl.textContent = `${finalTimeDisplay}s`;
  updateBestScore();
  //scroll to the top 
  itemContainer.scrollTo({top: 0 , behavior : 'instant'});
  showScorePage();
}

//Stop timer , prossecc results go to score page

function checkTime() {
  console.log(timePlayed);
  if(playerGuessArray.length == questionAmmount){
    console.log('player guess : ' , playerGuessArray);
    clearInterval(timer);
    // check wrong and add penalty
    equationsArray.forEach((equation , index) => {
      if(equation.evaluated === playerGuessArray[index]){
        //correct
      }else{
        //wrong + penalty
        penaltyTime += 0.5;
      }
    });
    finalTime = timePlayed + penaltyTime;
    scoresToDOM();
  }

}

// add a tenth of a second to timePlayed
function addtime(){
  timePlayed += 0.1;
  checkTime();
}

// start timer when game page is clicked
function startTimer(){

  timePlayed = 0;
  penaltyTime = 0;
  finalTime = 0;
  timer = setInterval(addtime , 100);
  gamePage.removeEventListener('click' , startTimer);
}

//scroll, store user selection to playerArray
function select(guessedTrue){
  valueY += 80;
  itemContainer.scroll(0,valueY);
  // add player guess
  return guessedTrue ? playerGuessArray.push('true') : playerGuessArray.push('false');
}
//display game page
function showGamePage(){
  gamePage.hidden = false;
  countdownPage.hidden = true;
}
// get rndom number

function getRandomInt(max){
  return Math.floor(Math.random() * Math.floor(max));
}

// Create Correct/Incorrect Random Equations
function createEquations() {
  // Randomly choose how many correct equations there should be
  const correctEquations =  getRandomInt(questionAmmount);
  console.log('correct' , correctEquations);
  // Set amount of wrong equations
  const wrongEquations = questionAmmount - correctEquations;
  console.log('wrong' , wrongEquations);
  // Loop through, multiply random numbers up to 9, push to array
  for (let i = 0; i < correctEquations; i++) {
    firstNumber = getRandomInt(9);
    secondNumber = getRandomInt(9);
    const equationValue = firstNumber * secondNumber;
    const equation = `${firstNumber} x ${secondNumber} = ${equationValue}`;
    equationObject = { value: equation, evaluated: 'true' };
    equationsArray.push(equationObject);
  }
  // Loop through, mess with the equation results, push to array
  for (let i = 0; i < wrongEquations; i++) {
    firstNumber = getRandomInt(9);
    secondNumber = getRandomInt(9);
    const equationValue = firstNumber * secondNumber;
    wrongFormat[0] = `${firstNumber} x ${secondNumber + 1} = ${equationValue}`;
    wrongFormat[1] = `${firstNumber} x ${secondNumber} = ${equationValue - 1}`;
    wrongFormat[2] = `${firstNumber + 1} x ${secondNumber} = ${equationValue}`;
    const formatChoice = getRandomInt(3);
    const equation = wrongFormat[formatChoice];
    equationObject = { value: equation, evaluated: 'false' };
    equationsArray.push(equationObject);
  }
  shuffle(equationsArray);
}
// add equations to DOM
function equationsToDOM(){

  equationsArray.forEach((equation) =>{

    //item 
    const item = document.createElement('div');
    item.classList.add('item');
    const equationText = document.createElement('h1');
    equationText.textContent = equation.value;
    //append
    item.appendChild(equationText);
    itemContainer.appendChild(item);

  });

}


//Dynamically adding correct/incorrect equations
function populateGamePage() {
  // Reset DOM, Set Blank Space Above
  itemContainer.textContent = '';
  // Spacer
  const topSpacer = document.createElement('div');
  topSpacer.classList.add('height-240');
  // Selected Item
  const selectedItem = document.createElement('div');
  selectedItem.classList.add('selected-item');
  // Append
  itemContainer.append(topSpacer, selectedItem);

  // Create Equations, Build Elements in DOM
  createEquations();
  equationsToDOM();

  // Set Blank Space Below
  const bottomSpacer = document.createElement('div');
  bottomSpacer.classList.add('height-500');
  itemContainer.appendChild(bottomSpacer);
}

//displlay 3,2,1

function countdownStart(){
  
  countdown.textContent = '3';
  setTimeout(() => {
    countdown.textContent = '2';
  } , 1000);
  setTimeout(() => {
    countdown.textContent = '1';
  } , 2000);
  setTimeout(() => {
    countdown.textContent = 'GO!';
  } , 3000);

}

// splash to countdown page

function showCountdown() {
  
  countdownPage.hidden = false;
  splashPage.hidden = true;
  countdownStart();  
  populateGamePage();
  setTimeout(showGamePage,4000);

}

// get value from selected radio button
function getRadioValue() {

  let radioValue;
  radioInputs.forEach((radioInput)=>{

    if(radioInput.checked){
      radioValue = radioInput.value;
    }

  });
  return radioValue;

}

// form ammount of questions

function selectQuestionAmount(e){

  e.preventDefault();
  questionAmmount = getRadioValue();
  console.log('questions' , questionAmmount);
  if(questionAmmount){
    showCountdown();
  }
  
}

startForm.addEventListener('click' , () => {

  radioContainers.forEach((radioEl) => {

    //remove selected
    radioEl.classList.remove('selected-label');
    // add selected if checked
    if(radioEl.children[1].checked){
      radioEl.classList.add('selected-label');
    }
  });

});

//event listeners

startForm.addEventListener('submit' , selectQuestionAmount);
gamePage.addEventListener('click' , startTimer);

// onload
getSavedBestScores();