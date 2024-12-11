// Get canvas, context, and overlay elements
const canvas = document.getElementById("flappyCanvas");
const ctx = canvas.getContext("2d");
const startButton = document.getElementById("startButton");
const factDisplay = document.getElementById("fact");

// Reference game dimensions
const referenceWidth = 1198;
const referenceHeight = 797;

// Game variables
let scaleX, scaleY, fishWidth, fishHeight, obstacleWidth, obstacleHeight, fgHeight;
let fishX, fishY;
let gravity = 1.5;
let jumpHeight = 25;
let gap = 195;
let obstacles = [];
let score = 0;
let isGameOver = false;

// Load images
let bg = new Image();
bg.src = "UnderseaBackground.png";

let obstacleTop = new Image();
obstacleTop.src = "computerpiletop.png";

let fg = new Image();
fg.src = "UnderseaForeground.png";

let fish = new Image();
fish.src = "fish.png";

// Track loaded images
let imagesLoaded = 0;
const totalImages = 4;

function imageLoaded() {
  imagesLoaded++;
  console.log(`Images loaded: ${imagesLoaded}/${totalImages}`);
  if (imagesLoaded === totalImages) {
    startButton.style.display = "block"; // Show start button when all images are loaded
  }
}

// Attach `onload` listeners to increment image load counter
bg.onload = imageLoaded;
obstacleTop.onload = imageLoaded;
fg.onload = imageLoaded;
fish.onload = () => {
  fishWidth = canvas.width / 16;
  fishHeight = fishWidth * (fish.height / fish.width);
  console.log("Fish dimensions set after image load:", fishWidth, fishHeight);
  imageLoaded();
};

// Resize canvas and adjust scaling
function resizeCanvas() {
  const container = document.querySelector(".game-container");
  const containerWidth = container.offsetWidth;
  const containerHeight = container.offsetHeight;

  // Preserve aspect ratio
  const canvasRatio = referenceWidth / referenceHeight;
  const containerRatio = containerWidth / containerHeight;

  if (canvasRatio > containerRatio) {
    canvas.width = containerWidth;
    canvas.height = containerWidth / canvasRatio;
  } else {
    canvas.height = containerHeight;
    canvas.width = containerHeight * canvasRatio;
  }

  scaleX = canvas.width / referenceWidth;
  scaleY = canvas.height / referenceHeight;

  obstacleWidth = 80 * scaleX;
  obstacleHeight = 300 * scaleY;
  fgHeight = 80 * scaleY;

  fishWidth = canvas.width / 12;
  fishHeight = fishWidth * (fish.height / fish.width);
  fishX = canvas.width / 4;
  fishY = canvas.height / 2;

  console.log("Canvas resized:", canvas.width, canvas.height);
}

// Function to reset game variables
function resetGame() {
  fishY = canvas.height / 2; // Start vertically centered
  obstacles = [
    {
      x: canvas.width,
      y: Math.floor(Math.random() * obstacleHeight) - obstacleHeight,
      scored: false,
    }
  ];
  score = 0;
  isGameOver = false;
  factDisplay.style.display = "none";
  console.log("Game reset");
}

// Function to display a random fact
function displayFact() {
  const facts = [
    "Fact 1: Remember the SLAM method!",
    "Fact 2: Don't click suspicious links!",
    "Fact 3: Don't share your login credentials!"
  ];
  factDisplay.innerText = facts[Math.floor(Math.random() * facts.length)];
  factDisplay.style.display = "block";
}

// Add keydown listener
document.addEventListener("keydown", moveUp);

function moveUp() {
  if (!isGameOver) {
    fishY -= jumpHeight * scaleY;
    console.log("Fish moved up:", fishY);
  }
}

// Start game when button is clicked
startButton.onclick = () => {
  console.log("Start button clicked");
  startButton.style.display = "none";
  resetGame();
  draw();
  startButton.blur(); // Ensure controls work
};

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw background
  ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);

  // Update and draw obstacles
  for (let i = 0; i < obstacles.length; i++) {
    const constant = obstacleHeight + gap * scaleY;

    // Draw top and bottom obstacles
    ctx.drawImage(obstacleTop, obstacles[i].x, obstacles[i].y, obstacleWidth, obstacleHeight);
    ctx.drawImage(obstacleTop, obstacles[i].x, obstacles[i].y + constant, obstacleWidth, obstacleHeight);

    obstacles[i].x -= (2 * scaleX) + (score * 0.1); // Speed increases with score

    // Remove off-screen obstacles
    if (obstacles[i].x + obstacleWidth < 0) {
      obstacles.splice(i, 1);
      i--; // Adjust index after removal
      continue;
    }

    // Collision detection
    if (
      fishX + fishWidth > obstacles[i].x && // Fish overlaps obstacle horizontally
      fishX < obstacles[i].x + obstacleWidth &&
      (fishY < obstacles[i].y + obstacleHeight || // Fish hits top obstacle
        fishY + fishHeight > obstacles[i].y + constant) || // Fish hits bottom obstacle
      fishY + fishHeight >= canvas.height - fgHeight // Fish hits the ground
    ) {
      console.log("Collision detected. Game over.");
      isGameOver = true;
      displayGameOver(); // Trigger game over overlay
      return; // Stop game loop
    }

    // Increase score when the fish passes an obstacle
    if (!obstacles[i].scored && obstacles[i].x + obstacleWidth < fishX) {
      score++;
      obstacles[i].scored = true;
      console.log("Score updated:", score);
    }
  }

  // Add new obstacles
  if (obstacles.length === 0 || obstacles[obstacles.length - 1].x < canvas.width * 0.75) {
    const newObstacleY = Math.floor(Math.random() * (canvas.height / 2)) - obstacleHeight;
    obstacles.push({
      x: canvas.width,
      y: newObstacleY,
      gap: gap * (0.8 + Math.random() * 0.4),
      scored: false,
    });
  }

  // Draw foreground
  ctx.drawImage(fg, 0, canvas.height - fgHeight, canvas.width, fgHeight);

  // Draw fish and apply gravity
  ctx.drawImage(fish, fishX, fishY, fishWidth, fishHeight);
  fishY += gravity * scaleY;

  // Draw score
  ctx.fillStyle = "#000";
  ctx.font = `${20 * scaleY}px Verdana`;
  ctx.fillText("Score: " + score, 10 * scaleX, canvas.height - 20 * scaleY);

  // Game over state
  if (isGameOver) {
    displayGameOver();
    return; // Stop rendering further frames
  }

  // Continue game loop
  requestAnimationFrame(draw);
}

function displayGameOver() {
  // Draw semi-opaque overlay
  ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw "Game Over" text
  ctx.fillStyle = "#FFF"; // White text
  ctx.font = `${40 * scaleY}px "Courier New", monospace`;
  ctx.textAlign = "center";
  ctx.fillText("Game Over!", canvas.width / 2, canvas.height / 2 - 20 * scaleY);

  // Draw restart instructions
  ctx.font = `${20 * scaleY}px "Arial", sans-serif`;
  ctx.fillText("Click Start to Play Again", canvas.width / 2, canvas.height / 2 + 20 * scaleY);

  // Show the start button
  setTimeout(() => {
    startButton.style.display = "block";
    factDisplay.style.display = "block"; // Ensure fact is shown
  }, 500);
}

// Initialize canvas
resizeCanvas();
window.addEventListener("resize", resizeCanvas);
