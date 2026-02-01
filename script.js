// Hämtar canvas-elementet från HTML och dess 2D-renderingskontext
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Hämtar element för poäng, högsta poäng, nivå, timer och meddelanden
const scoreDisplay = document.getElementById("score");
const highScoreDisplay = document.getElementById("highScore");
const levelDisplay = document.getElementById("level");
const timerDisplay = document.getElementById("timer");
const gameMessage = document.getElementById("gameMessage");

// Spelvariabler
let score = 0;
let level = 1;
let timeLeft = 60;
let timerInterval = null;
let gameOver = false;

// Hämta högsta poäng från localStorage (sparas mellan sessioner)
let highScore = parseInt(localStorage.getItem("ballGameHighScore")) || 0;
if (highScoreDisplay) highScoreDisplay.textContent = highScore;

// Skapar ett objekt som representerar bollen och dess egenskaper
let ball = {
  x: 100,         // Startposition på x-axeln
  y: 100,         // Startposition på y-axeln
  radius: 20      // Bollens radie
};

// Poäng per nivå för att öka till nästa nivå
const SCORE_PER_LEVEL = 5;

// Skapar en enkel pip-ljud med Web Audio API (inga externa filer behövs)
function playClickSound() {
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    oscillator.frequency.value = 800;
    oscillator.type = "sine";
    gainNode.gain.value = 0.1;
    oscillator.start(audioCtx.currentTime);
    oscillator.stop(audioCtx.currentTime + 0.1);
  } catch (e) {
    // Ljud stöds inte - fortsätt tyst
  }
}

// Funktion för att rita bollen på canvas
function drawBall() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.fillStyle = "red";
  ctx.fill();
  ctx.closePath();
}

// Funktion som flyttar bollen till en slumpmässig position
// Ökar svårigheten på högre nivåer genom mindre boll
function moveBall() {
  ball.x = Math.random() * (canvas.width - 40) + 20;
  ball.y = Math.random() * (canvas.height - 40) + 20;
  // Bollens radie minskar på högre nivåer (minst 10px)
  ball.radius = Math.max(10, 20 - (level - 1) * 2);
  drawBall();
}

// Uppdaterar nivå baserat på poäng
function updateLevel() {
  const newLevel = Math.floor(score / SCORE_PER_LEVEL) + 1;
  if (newLevel > level) {
    level = newLevel;
    if (levelDisplay) levelDisplay.textContent = level;
    // Ge extra tid vid ny nivå
    timeLeft += 10;
  }
}

// Uppdaterar högsta poäng och sparar i localStorage
function updateHighScore() {
  if (score > highScore) {
    highScore = score;
    if (highScoreDisplay) highScoreDisplay.textContent = highScore;
    localStorage.setItem("ballGameHighScore", highScore.toString());
  }
}

// Startar spelet (timer)
function startGame() {
  if (timerInterval) return;
  gameOver = false;
  gameMessage.textContent = "";
  timerInterval = setInterval(function () {
    timeLeft--;
    if (timerDisplay) timerDisplay.textContent = timeLeft;
    if (timeLeft <= 0) {
      endGame();
    }
  }, 1000);
}

// Avslutar spelet
function endGame() {
  clearInterval(timerInterval);
  timerInterval = null;
  gameOver = true;
  updateHighScore();
  if (gameMessage) {
    gameMessage.textContent = "Spelet är slut! Din poäng: " + score + ". Klicka på bollen för att starta om.";
  }
  drawBall();
}

// Startar om spelet
function resetGame() {
  score = 0;
  level = 1;
  timeLeft = 60;
  if (scoreDisplay) scoreDisplay.textContent = score;
  if (levelDisplay) levelDisplay.textContent = level;
  if (timerDisplay) timerDisplay.textContent = timeLeft;
  ball.radius = 20;
  gameOver = false;
  gameMessage.textContent = "";
  moveBall();
  startGame();
}

// Lyssnar på klick på canvas
if (canvas) {
  canvas.addEventListener("click", function (e) {
    if (gameOver) {
      resetGame();
      return;
    }

    // Starta timer vid första klick
    if (!timerInterval) {
      startGame();
    }

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const clickX = (e.clientX - rect.left) * scaleX;
    const clickY = (e.clientY - rect.top) * scaleY;

    const dist = Math.hypot(clickX - ball.x, clickY - ball.y);

    if (dist < ball.radius) {
      score++;
      if (scoreDisplay) scoreDisplay.textContent = score;
      updateLevel();
      playClickSound();
      moveBall();
    }
  });
}

// Ritar bollen första gången när sidan laddas
if (canvas) {
  drawBall();
}
