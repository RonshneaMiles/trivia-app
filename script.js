let score = 0;
let index = 0;
function getRandomQuestionIndex(array) {
  return Math.floor(Math.random() * array.length);
}

const game = document.getElementById("jeopardyApp");
const userAnswer = document.getElementById("player-answer");
const buttonDiv = document.getElementById("button-container");
const startButton = document.getElementById("start-button");
const clueText = document.querySelector(".clue-text");
const correctResults = document.querySelector(".correct-result");
const incorrectResults = document.querySelector(".incorrect-result");
const answerDiv = document.querySelector(".answerDiv");
const gameCard = document.querySelector(".game-card");
const categoryDiv = document.getElementById("categoryDiv");
let displayScore = document.querySelector(".score-value");
userAnswer.value = userAnswer.value.toString();
const submitForm = document.getElementById("submit-form");

startButton.innerText = "Let's Begin!";

startButton.addEventListener("click", getCategory);
let fetchDataArray = [];
let cluesArray = [];
let gameAnswer = "";

function getCategory() {
  buttonDiv.style.display = "none";
  //   startButton.style.visibility = "hidden";
  categoryDiv.style.visibility = "visible";
  gameCard.style.display = "flex";
  answerDiv.style.display = "block";

  const categoriesURL =
    "https://jservice.kenzie.academy/api/random-clue?valid=true";
  userAnswer.value = "";

  fetch(categoriesURL)
    .then((response) => response.json())
    .then(getQuestionAndAnswer);
}

function getQuestionAndAnswer(category) {
  const categoryTitle = category.category.title;
  categoryDiv.innerHTML = `${categoryTitle}`;
  const categoryID = category.categoryId;
  console.log(categoryID);
  const questionUrl =
    "https://jservice.kenzie.academy/api/clues/?category=" + categoryID;
  console.log(questionUrl);

  fetch(questionUrl)
    .then((response) => response.json())
    .then((clue) => {
      fetchDataArray = clue.clues;
      console.log(fetchDataArray);

      cluesArray = fetchDataArray.map((questionItem) => ({
        question: questionItem.question,
        answer: questionItem.answer,
      }));
      index = getRandomQuestionIndex(fetchDataArray);
      const currentQuestion = fetchDataArray[index].question;
      clueText.innerHTML = `${currentQuestion}`;
      gameAnswer = cluesArray[index].answer;
      console.log(gameAnswer);
    });
}

submitForm.addEventListener("submit", checkAnswer);

function checkAnswer(event) {
  event.preventDefault();
  if (
    gameAnswer.toLowerCase() === userAnswer.value ||
    gameAnswer === userAnswer.value
  ) {
    correctAnswer();
  } else if (gameAnswer.toLowerCase().includes(userAnswer.value)) {
    correctAnswer();
  } else {
    incorrectAnswer();
  }
}

function correctAnswer() {
  score += 1;
  cluesArray.splice(index, 1);
  displayScore.innerHTML = `${score}`;
  correctResults.style.visibility = "visible";

  if (cluesArray.length < 1) {
    setTimeout(() => {
      getCategory();
    }, 1000);
  } else {
    setTimeout(() => {
      continueGame();
    }, 1000);
  }
}

function continueGame() {
  index = getRandomQuestionIndex(cluesArray);
  currentQuestion = cluesArray[index].question;
  clueText.innerHTML = `${currentQuestion}`;
  gameAnswer = cluesArray[index].answer;
  console.log(gameAnswer);
  correctResults.style.visibility = "hidden";
  userAnswer.value = "";
}

function incorrectAnswer() {
  console.log(userAnswer.value);
  correctResults.style.visibility = "hidden";
  incorrectResults.style.visibility = "visible";
  setTimeout(() => {
    restartGame();
  }, 1000);
}

function restartGame() {
  score = 0;
  displayScore.innerHTML = `${score}`;
  categoryDiv.style.visibility = "hidden";
  gameCard.style.display = "none";
  answerDiv.style.display = "none";
  buttonDiv.style.display = "block";
  //   startButton.style.visibility = "visible";
  incorrectResults.style.visibility = "hidden";
  correctResults.style.visibility = "hidden";
}
