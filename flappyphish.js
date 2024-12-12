// Get canvas, context, and button elements
const canvas = document.getElementById("flappyCanvas");
const ctx = canvas.getContext("2d");
const startButton = document.getElementById("startButton");
const factDisplay = document.getElementById("fact");

// Reference dimensions
const referenceWidth = 1198;
const referenceHeight = 797;

// Game variables
let fishX, fishY, fishWidth, fishHeight, scaleX, scaleY;
let gravity = 1.5;
let jumpHeight = 25;
let obstacles = [];
let score = 0;
let isGameOver = false;
let gap = 150;

// Load images
const bg = new Image();
bg.src = "UnderseaBackground.png";

const obstacle = new Image();
obstacle.src = "computerpiletop.png";

const fg = new Image();
fg.src = "UnderseaForeground.png";

const fish = new Image();
fish.src = "fish.png";

// Track image loading
let imagesLoaded = 0;
const totalImages = 4;

function imageLoaded() {
  imagesLoaded++;
  console.log(`Images loaded: ${imagesLoaded}/${totalImages}`);
  if (imagesLoaded === totalImages) {
    startButton.style.display = "block"; // Show the start button
  }
}

// Attach load listeners to images
bg.onload = imageLoaded;
obstacle.onload = imageLoaded;
fg.onload = imageLoaded;
fish.onload = imageLoaded;

// Resize canvas based on window size
function resizeCanvas() {
  canvas.width = window.innerWidth * 0.8; // 80% of window width
  canvas.height = canvas.width * (referenceHeight / referenceWidth); // Maintain aspect ratio

  scaleX = canvas.width / referenceWidth;
  scaleY = canvas.height / referenceHeight;

  fishWidth = 50 * scaleX;
  fishHeight = 38 * scaleY;
  fishX = canvas.width / 4;
  fishY = canvas.height / 2;
}

// Reset game variables
function resetGame() {
  fishY = canvas.height / 2;
  obstacles = [
    {
      x: canvas.width,
      y: Math.random() * (canvas.height / 2) - 150
    }
  ];
  score = 0;
  isGameOver = false;
  factDisplay.style.display = "none";
}
function displayGameOver() {
  // Draw semi-opaque overlay
  ctx.save();
  ctx.globalAlpha = 0.5;
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.restore();

  // Draw "Game Over" text
  ctx.fillStyle = "#FFF"; // White text
  ctx.font = "40px 'Courier New', monospace"; // Static font size for clarity
  ctx.textAlign = "center";
  ctx.fillText("Game Over!", canvas.width / 2, canvas.height / 2 - 40);

  // Get the canvas's position and size
  const canvasBounds = canvas.getBoundingClientRect();

  // Position Start Button dynamically within the canvas
  startButton.style.position = "absolute";
  startButton.style.top = `${canvasBounds.top + canvas.height / 2 + 200}px`; // Adjust vertical position
  startButton.style.left = `${canvasBounds.left + canvas.width / 2}px`; // Center horizontally
  startButton.style.transform = "translate(-50%, -50%)"; // Proper centering
  startButton.style.display = "block"; // Make button visible

  // Position Fact Display below the button
  factDisplay.style.position = "absolute";
  factDisplay.style.top = `${canvasBounds.top + canvas.height / 2 + 120}px`; // Below the button
  factDisplay.style.left = `${canvasBounds.left + canvas.width / 2}px`;
  factDisplay.style.transform = "translate(-50%, -50%)";
  factDisplay.style.display = "block"; // Show fact
}
// Display a random fact
function displayFact() {
  const facts = [
    "Fact 1: Remember the SLAM method!",
    "Fact 2: Don’t click suspicious links!",
    "Fact 3: Don’t share login credentials!"
  ];
  factDisplay.innerText = facts[Math.floor(Math.random() * facts.length)];
  factDisplay.style.display = "block";
}

// Move fish up
document.addEventListener("keydown", () => {
  if (!isGameOver) fishY -= jumpHeight * scaleY;
});

// Start the game
startButton.onclick = () => {
  resetGame();
  startButton.style.display = "none";
  draw();
};

// Draw the game
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw background
  ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);

  // Draw obstacles
  for (let i = 0; i < obstacles.length; i++) {
    const constant = gap * scaleY;
    ctx.drawImage(obstacle, obstacles[i].x, obstacles[i].y, 80 * scaleX, 300 * scaleY);
    ctx.drawImage(obstacle, obstacles[i].x, obstacles[i].y + constant + 300 * scaleY, 80 * scaleX, 300 * scaleY);

    // Move obstacle left
    obstacles[i].x -= 2 * scaleX;

    // Check for collisions
    if (
      fishX + fishWidth >= obstacles[i].x &&
      fishX <= obstacles[i].x + 80 * scaleX &&
      (fishY <= obstacles[i].y + 300 * scaleY || fishY + fishHeight >= obstacles[i].y + constant + 300 * scaleY) ||
      fishY + fishHeight >= canvas.height
    ) {
      isGameOver = true;
      displayFact();
      setTimeout(() => (startButton.style.display = "block"), 1000);
      return;
    }

    // Remove off-screen obstacles
    if (obstacles[i].x + 80 * scaleX < 0) {
      obstacles.splice(i, 1);
    }

    // Add new obstacles
    if (obstacles.length === 0 || obstacles[obstacles.length - 1].x < canvas.width * 0.75) {
      obstacles.push({
        x: canvas.width,
        y: Math.random() * (canvas.height / 2) - 150
      });
    }
  }

  // Draw foreground
  ctx.drawImage(fg, 0, canvas.height - 80 * scaleY, canvas.width, 80 * scaleY);

  // Draw fish and apply gravity
  ctx.drawImage(fish, fishX, fishY, fishWidth, fishHeight);
  fishY += gravity * scaleY;

  // Draw score
  ctx.fillStyle = "#000";
  ctx.font = `${20 * scaleY}px Arial`;
  ctx.fillText(`Score: ${score}`, 10, 30);

  // Keep game loop running
  if (!isGameOver) requestAnimationFrame(draw);
}

// Initialize canvas and listen for resize
resizeCanvas();
window.addEventListener("resize", resizeCanvas);
