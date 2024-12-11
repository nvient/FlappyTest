// Get canvas, context, and overlays
const canvas = document.getElementById("flappyCanvas");
const ctx = canvas.getContext("2d");
const startButton = document.getElementById("startButton");
const factDisplay = document.getElementById("fact");

// Reference background image dimensions
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

let obstacleTop = new Image();
obstacleTop.src = "computerpiletop.png";

let obstacleBottom = obstacleTop;

let fg = new Image();
fg.src = "UnderseaForeground.png";

let fish = new Image();
fish.src = "fish.png";

// Track loaded images
let imagesLoaded = 0;
const totalImages = 4;

function imageLoaded() {
  imagesLoaded++;
  if (imagesLoaded === totalImages) {
    startButton.style.display = "block"; // Show the start button once images are loaded
  }
}

// Attach onload listeners to count loaded images
bg.onload = imageLoaded;
obstacleTop.onload = imageLoaded;
fg.onload = imageLoaded;
fish.onload = imageLoaded;

// Resize canvas and scale elements proportionally
function resizeCanvas() {
  const container = document.querySelector(".game-container");
  const containerWidth = container.offsetWidth;
  const containerHeight = container.offsetHeight;

  // Scale canvas to container while preserving aspect ratio
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

  fishY = Math.min(fishY, canvas.height - fgHeight - fishHeight);
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

// Game logic functions (unchanged)...

// Start game when button is clicked
startButton.onclick = () => {
  startButton.style.display = "none"; // Hide start button
  resetGame();
  draw(); // Start the game loop
};

// Initialize canvas and handle resizing
resizeCanvas();
window.addEventListener("resize", resizeCanvas);
