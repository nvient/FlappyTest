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

// Center the fish horizontally and vertically
let fishX, fishY;
let gravity = 1.5;
let jumpHeight = 25;
let gap = 150;
let obstacles = [];
let score = 0;
let isGameOver = false;

// Load images
let bg = new Image();
bg.src = "UnderseaBackground.png";
bg.onload = () => console.log("Background image loaded");

let obstacleTop = new Image();
obstacleTop.src = "computerpiletop.png";
obstacleTop.onload = () => console.log("Obstacle image loaded");

let fg = new Image();
fg.src = "UnderseaForeground.png";
fg.onload = () => console.log("Foreground image loaded");

let fish = new Image();
fish.src = "fish.png";
fish.onload = () => console.log("Fish image loaded");

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

// Attach onload listeners to count loaded images
bg.onload = imageLoaded;
obstacleTop.onload = imageLoaded;
fg.onload = imageLoaded;
fish.onload = imageLoaded;

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

  fishWidth = canvas.width / 12;
  fishHeight = fish.Width * (fish.height / fish.width);
  obstacleWidth = 80 * scaleX;
  obstacleHeight = 300 * scaleY;
  fgHeight = 80 * scaleY;
  
  // Dynamically set fish's starting position
  fishX = canvas.width / 4; // 1/4th of the current canvas width
  fishY = canvas.height / 2; // Centered vertically
  console.log("Canvas resized:", canvas.width, canvas.height);
}

// Function to reset game variables
function resetGame() {
  fishY = 150;
  obstacles = [
    {
      x: canvas.width,
      y: Math.floor(Math.random() * obstacleHeight) - obstacleHeight
    }
  ];
  score = 0;
  isGameOver = false;
  factDisplay.style.display = "none"; // Hide fact display
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

function moveUp(event) {
  if (!isGameOver) {
    fishY -= jumpHeight * scaleY;
    console.log("Fish moved up:", fishY); // Debug: Confirm fish movement
  }
}

// Start game when button is clicked
startButton.onclick = () => {
  console.log("Start button clicked");
  startButton.style.display = "none"; // Hide start button
  resetGame();
  draw(); // Start game loop

  // Remove button focus to ensure game controls work
  startButton.blur();
};

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw background
  ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);

  // Update and draw obstacles
  for (let i = 0; i < obstacles.length; i++) {
    let constant = obstacleHeight + obstacles[i].gap;

    // Draw top and bottom obstacles
    ctx.drawImage(obstacleTop, obstacles[i].x, obstacles[i].y, obstacleWidth, obstacleHeight);
    ctx.drawImage(obstacleTop, obstacles[i].x, obstacles[i].y + constant, obstacleWidth, obstacleHeight);

    // Move obstacles to the left
    obstacles[i].x -= (2 * scaleX) + (score * 0.1); // Speed increases slightly with score

    // Check if the obstacle is off the screen
    if (obstacles[i].x + obstacleWidth < 0) {
      obstacles.splice(i, 1); // Remove off-screen obstacle
      i--; // Adjust index after removal
      continue; // Skip to the next iteration
    }

    // Collision detection
    if (
      (fishX + fishWidth > obstacles[i].x && // Fish overlaps obstacle horizontally
        fishX < obstacles[i].x + obstacleWidth &&
        (fishY < obstacles[i].y + obstacleHeight || // Fish hits top obstacle
          fishY + fishHeight > obstacles[i].y + constant)) || // Fish hits bottom obstacle
      fishY + fishHeight >= canvas.height - fgHeight // Fish hits the ground
    ) {
      if (isGameOver) {
  // Draw semi-opaque overlay
  ctx.fillStyle = "rgba(0, 0, 0, 0.5)"; // Black with 50% opacity
  ctx.fillRect(0, 0, canvas.width, canvas.height); // Cover the entire canvas
}
      if (!isGameOver) {
        displayFact();
        isGameOver = true;
        setTimeout(() => startButton.style.display = "block", 1000);
        console.log("Collision detected, game over");
        return; // Stop draw loop
      }
    }

    // Increase score when the fish clears an obstacle
    if (!obstacles[i].scored && obstacles[i].x + obstacleWidth < fishX) {
      score++;
      obstacles[i].scored = true; // Mark obstacle as scored
      console.log("Score updated:", score);
    }
  }

  // Add new obstacles at varying heights and gaps
  if (obstacles.length === 0 || obstacles[obstacles.length - 1].x < canvas.width * 0.75) {
    let newObstacleY = Math.floor(Math.random() * (canvas.height / 2)) - obstacleHeight;
    let newGap = gap * (0.8 + Math.random() * 0.4); // Vary the gap size slightly

    obstacles.push({
      x: canvas.width, // Start just outside the canvas
      y: newObstacleY,
      gap: newGap,
      scored: false // Mark for scoring
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

  // Continue game loop if not over
  if (!isGameOver) {
    requestAnimationFrame(draw);
  }
}

// Initialize canvas and handle resizing
resizeCanvas();
window.addEventListener("resize", resizeCanvas);
