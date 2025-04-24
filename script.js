// Select DOM elements
const btn = document.getElementById("reset-btn");
const container = document.querySelector(".game-blocks");
const inputBtn = document.getElementById("btn-name");
const playerNameInput = document.getElementById("player-name__input");
const playerNameDisplay = document.getElementById("player-name");
const timeDisplay = document.getElementById("time");
const triesDisplay = document.getElementById("tries-num");
const matchesDisplay = document.getElementById("matches");
const endPage = document.getElementById("endPage");
const finalScoreDisplay = document.getElementById("final-score");
const replayBtn = document.getElementById("replay");

// Game state variables
let flippedCards = [];
let lockBoard = false;
let scoreCounter = 0;
let triesCounter = 0;
let timer;
let timeLeft = 300;
let gameStarted = false;

// Event listeners
inputBtn.addEventListener("click", startGame);
playerNameInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") startGame();
});
btn.addEventListener("click", resetGame);
replayBtn.addEventListener("click", resetGame);

// Starts the game
function startGame() {
  const playerName = playerNameInput.value.trim();

  if (playerName) {
    const popup = document.getElementById("popup");
    if (popup) popup.remove();

    playerNameDisplay.textContent = playerName;
    gameStarted = true;
    shuffleCards();
    startTimer();
  } else {
    alert("Please enter your name to start the game.");
    playerNameInput.focus();
  }
}

// Shuffles the cards
function shuffleCards() {
  resetGameStats();
  const cards = Array.from(container.children);

  cards.forEach((card) => {
    card.classList.add("flipped");
    card.classList.remove("matched");
  });

  setTimeout(() => {
    cards.forEach((card) => card.classList.remove("flipped"));
  }, 2000);

  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }

  container.innerHTML = "";
  cards.forEach((card) => container.appendChild(card));

  cardClicks();
}

// Adds click listeners to each card
function cardClicks() {
  const cards = Array.from(container.children);

  cards.forEach((card) => {
    card.addEventListener("click", () => {
      if (
        !gameStarted ||
        lockBoard ||
        card.classList.contains("flipped") ||
        flippedCards.includes(card)
      )
        return;

      flipCard(card);
    });
  });
}

// Flips a card
function flipCard(card) {
  card.classList.add("flipped");
  flippedCards.push(card);

  if (flippedCards.length === 2) {
    lockBoard = true;
    checkMatch();
  }
}

// Checks if the two flipped cards match
function checkMatch() {
  triesCounter++;
  updateTries();

  const [card1, card2] = flippedCards;

  if (card1.dataset.techno === card2.dataset.techno) {
    scoreCounter++;
    updateScore();

    setTimeout(() => {
      card1.classList.add("matched");
      card2.classList.add("matched");
      resetBoard();

      if (scoreCounter === 10) {
        endGame(true);
        playSound("sounds/win.mp3");
      }
    }, 1000);
  } else {
    setTimeout(() => {
      card1.classList.remove("flipped");
      card2.classList.remove("flipped");
      resetBoard();
    }, 1000);
  }
}

// Updates score display
function updateScore() {
  matchesDisplay.textContent = scoreCounter;
}

// Updates tries display
function updateTries() {
  triesDisplay.textContent = triesCounter;
}

// Resets temporary board
function resetBoard() {
  flippedCards = [];
  lockBoard = false;
}

// Resets all game
function resetGameStats() {
  clearInterval(timer);
  flippedCards = [];
  lockBoard = false;
  scoreCounter = 0;
  triesCounter = 0;
  timeLeft = 300;
  timeDisplay.textContent = timeLeft;
  updateScore();
  updateTries();
  endPage.style.display = "none";
}

// Starts the timer
function startTimer() {
  clearInterval(timer);
  timeLeft = 300;
  timeDisplay.textContent = timeLeft;

  timer = setInterval(() => {
    timeLeft--;
    timeDisplay.textContent = timeLeft;

    if (timeLeft <= 0) {
      endGame(false);
    }
  }, 1000);
}

// Ends the game
function endGame(isWin) {
  clearInterval(timer);
  gameStarted = false;
  lockBoard = true;

  if (isWin) {
    finalScoreDisplay.textContent = `You won with ${triesCounter} tries!`;
  } else {
    finalScoreDisplay.textContent = `You lost with ${scoreCounter} matches!`;
  }

  endPage.style.display = "flex";
}

// Reset the  game
function resetGame() {
  resetGameStats();
  gameStarted = true;
  shuffleCards();
  startTimer();
}

// Initialize the game
window.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".game-block").forEach((card) => {
    card.classList.remove("flipped");
  });
});

// load Sound

function playSound(soundFilePath) {
  const sound = new Audio(soundFilePath);
  sound.play();
}
