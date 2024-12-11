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
let fishX = 50;
let fishY = 150;
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

  fishWidth = 50 * scaleX;
  fishHeight = 38 * scaleY;
  obstacleWidth = 80 * scaleX;
  obstacleHeight = 300 * scaleY;
  fgHeight = 80 * scaleY;

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

// Main draw function
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  console.log("Drawing frame...");

  // Draw background
  ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);

  // Draw and update obstacles
  for (let i = 0; i < obstacles.length; i++) {
    let constant = obstacleHeight + gap * scaleY;
    ctx.drawImage(obstacleTop, obstacles[i].x, obstacles[i].y, obstacleWidth, obstacleHeight);
    ctx.drawImage(obstacleTop, obstacles[i].x, obstacles[i].y + constant, obstacleWidth, obstacleHeight);

    // Move obstacles to the left
    obstacles[i].x -= 2 * scaleX;

    // Add a new obstacle
    if (obstacles[i].x === 125 * scaleX) {
      obstacles.push({
        x: canvas.width,
        y: Math.floor(Math.random() * obstacleHeight) - obstacleHeight
      });
    }

    // Check for collision with obstacles or ground
    if (
      (fishX + fishWidth >= obstacles[i].x &&
        fishX <= obstacles[i].x + obstacleWidth &&
        (fishY <= obstacles[i].y + obstacleHeight ||
          fishY + fishHeight >= obstacles[i].y + constant)) ||
      fishY + fishHeight >= canvas.height - fgHeight
    ) {
      if (!isGameOver) {
        displayFact();
        isGameOver = true;
        setTimeout(() => startButton.style.display = "block", 1000);
        console.log("Collision detected, game over");
        return; // Stop the draw loop on game over
      }
    }

    // Increase score when passing an obstacle
    if (obstacles[i].x === 5 * scaleX) {
      score++;
      console.log("Score:", score);
    }
  }

  // Draw foreground
  ctx.drawImage(fg, 0, canvas.height - fgHeight, canvas.width, fgHeight);

  // Draw fish and apply gravity
  ctx.drawImage(fish, fishX, fishY, fishWidth, fishHeight);
  fishY += gravity * scaleY;

  // Display score
  ctx.fillStyle = "#000";
  ctx.font = `${20 * scaleY}px Verdana`;
  ctx.fillText("Score: " + score, 10 * scaleX, canvas.height - 20 * scaleY);

  // Continue animation if game is not over
  if (!isGameOver) {
    requestAnimationFrame(draw);
  }
}

// Start game when button is clicked
startButton.onclick = () => {
  console.log("Start button clicked");
  startButton.style.display = "none"; // Hide start button
  resetGame();
  draw(); // Start game loop
};

// Initialize canvas and handle resizing
resizeCanvas();
window.addEventListener("resize", resizeCanvas);
