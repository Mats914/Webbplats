// Hämtar canvas-elementet från HTML och dess 2D-renderingskontext
const canvas = document.getElementById("gameCanvas"); 
const ctx = canvas.getContext("2d");

// Hämtar elementet där poängen visas
const scoreDisplay = document.getElementById("score");

// Startvärde för spelarens poäng
let score = 0;

// Skapar ett objekt som representerar bollen och dess egenskaper
let ball = {
  x: 100,         // Startposition på x-axeln
  y: 100,         // Startposition på y-axeln
  radius: 20      // Bollens radie
};

// Funktion för att rita bollen på canvas
function drawBall() {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Rensar hela canvasen
  ctx.beginPath();                                  // Startar en ny väg
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2); // Ritar en cirkel (bollen)
  ctx.fillStyle = "red";                            // Färg på bollen
  ctx.fill();                                       // Fyller bollen med färg
  ctx.closePath();                                  // Avslutar ritningen
}

// Funktion som flyttar bollen till en slumpmässig position
function moveBall() {
  ball.x = Math.random() * (canvas.width - 40) + 20;   // Ny x-position
  ball.y = Math.random() * (canvas.height - 40) + 20;  // Ny y-position
  drawBall();                                          // Ritar bollen på nya positionen
}

// Lyssnar på klick på canvas
canvas.addEventListener("click", function(e) {
  // Hämtar musens klickposition relativt till canvas
  const rect = canvas.getBoundingClientRect();
  const clickX = e.clientX - rect.left;
  const clickY = e.clientY - rect.top;

  // Beräknar avståndet mellan klicket och bollens centrum
  const dist = Math.hypot(clickX - ball.x, clickY - ball.y);

  // Om användaren klickade inom bollens radie
  if (dist < ball.radius) {
    score++;                               // Ökar poängen med 1
    scoreDisplay.textContent = score;      // Uppdaterar poängen på sidan
    moveBall();                            // Flyttar bollen till ny position
  }
});

// Ritar bollen första gången när sidan laddas
drawBall();
