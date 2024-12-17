const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const overlay = document.getElementById("overlay");

function resizeCanvas() {
  const aspectRatio = 16 / 9;
  const maxWidth = window.innerWidth * 0.9;
  const maxHeight = window.innerHeight * 0.9; 
  
  if (maxWidth / aspectRatio < maxHeight) {
    canvas.width = maxWidth;
    canvas.height = maxWidth / aspectRatio;
  } else {
    canvas.height = maxHeight;
    canvas.width = maxHeight * aspectRatio;
  }

  canvas.style.position = "absolute";
  canvas.style.top = "50%";
  canvas.style.left = "50%";
  canvas.style.transform = "translate(-50%, -50%)";
  
  overlay.style.width = `${canvas.width}px`;
  overlay.style.height = `${canvas.height}px`;
  overlay.style.top = "50%";
  overlay.style.left = "50%";
  overlay.style.transform = "translate(-50%, -50%)";

  fish.x = 100; 
  fish.y = canvas.height / 2; // Reset fish position to center

  gravity = canvas.height / 1600;

}
// Add Resize Listener
window.addEventListener("resize", resizeCanvas);
resizeCanvas(); // Initial resize setup

// Global Variables
const fishImg = new Image();
fishImg.src = "fish.png";

const obstacleImg = new Image();
obstacleImg.src = "computerpiletop.png";

const backgroundImg = new Image();
backgroundImg.src = "UnderseaBackground.png";

const foregroundImg = new Image();
foregroundImg.src = "UnderseaForeground.png";

let fish = { x: 100, y: canvas.height / 2, width: 40, height: 30, velocity: 0 };
let gravity = 0.25;
let obstacles = [];
let gameRunning = false;
let gameOver = false;

// Random phishing facts
const phishingFacts = [
  "Remember the SLAM method.",
  "Hover over, but do not click, on links in unsolicited emails to verify URLs.",
  "Never open unexpected attachments, especially in an unsolicited email.",
  "Phishing often uses urgency to trick you.",
  "Check the email sender addresses carefully."
];

// Event Listeners for User Interaction
document.getElementById("startButton").addEventListener("click", startGame);
canvas.addEventListener("click", () => {
  if (gameRunning) fish.velocity = -8; // Fish "jump"
});

// Start Game
function startGame() {
  fish = { x: 100, y: 200, width: 40, height: 30, velocity: 0 };
  obstacles = [];
  gameRunning = true;
  gameOver = false;
  overlay.style.display = "none";
  animate();
}

// Draw Background
function drawBackground() {
  ctx.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);
}

// Draw Fish
function drawFish() {
  ctx.drawImage(fishImg, fish.x, fish.y, fish.width, fish.height);
}

// Draw Obstacles
function drawObstacles() {
  obstacles.forEach((obstacle) => {
    ctx.drawImage(obstacleImg, obstacle.x, obstacle.y, obstacle.width, obstacle.height);
  });
}

// Update Obstacles
function updateObstacles() {
  if (gameRunning && Math.random() < 0.02) {
    obstacles.push({
      x: canvas.width,
      y: canvas.height - 100,
      width: 40,
      height: 80
    });
  }
  obstacles.forEach((obstacle, index) => {
    obstacle.x -= 5;
    if (obstacle.x + obstacle.width < 0) obstacles.splice(index, 1);
  });
}

// Collision Detection
function detectCollision() {
  if (fish.y + fish.height > canvas.height) return true;
  return obstacles.some(
    (obstacle) =>
      fish.x < obstacle.x + obstacle.width &&
      fish.x + fish.width > obstacle.x &&
      fish.y < obstacle.y + obstacle.height &&
      fish.y + fish.height > obstacle.y
  );
}

// End Game
function endGame() {
  gameRunning = false;
  gameOver = true;
  document.getElementById("phishingFact").textContent =
    phishingFacts[Math.floor(Math.random() * phishingFacts.length)];
  document.getElementById("overlay").style.display = "flex";
}

// Animation Loop
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBackground();

  if (gameRunning) {
    fish.velocity += gravity;
    fish.y += fish.velocity;

    drawFish();
    updateObstacles();
    drawObstacles();

    if (detectCollision()) endGame();
  }

  drawForeground();
  if (!gameOver) requestAnimationFrame(animate);
}

// Draw Foreground
function drawForeground() {
  ctx.drawImage(foregroundImg, 0, canvas.height - 40, canvas.width, 40);
}

// Initialize Game
document.getElementById("overlay").style.display = "flex";
