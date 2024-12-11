// Get canvas and context
const canvas = document.getElementById("flappyCanvas");
const ctx = canvas.getContext("2d");

// Reference game dimensions
const referenceWidth = 1198;
const referenceHeight = 797;

// Responsive variables
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
    document.getElementById("startButton").disabled = false;
  }
}

// Attach onload listeners to count loaded images
bg.onload = imageLoaded;
obstacleTop.onload = imageLoaded;
fg.onload = imageLoaded;
fish.onload = imageLoaded;

// Resize canvas based on window size
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  scaleX = canvas.width / referenceWidth;
  scaleY = canvas.height / referenceHeight;

  // Scale elements based on canvas size
  fishWidth = 50 * scaleX;
  fishHeight = 38 * scaleY;
  obstacleWidth = 80 * scaleX;
  obstacleHeight = 300 * scaleY;
  fgHeight = 80 * scaleY;

  // Adjust fishY to stay in view
  fishY = Math.min(fishY, canvas.height - fgHeight - fishHeight);
}

// Function to display a random fact on collision
function displayFact() {
  const facts = [
    "Fact 1: Phishing is dangerous!",
    "Fact 2: Be careful with suspicious links!",
    "Fact 3: Keep your credentials safe!"
  ];
  const randomFact = facts[Math.floor(Math.random() * facts.length)];
  document.getElementById("fact").innerText = randomFact;
}

// Function to reset game variables and prepare for a new game
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
}

// Function to move fish up
document.addEventListener("keydown", moveUp);
function moveUp() {
  if (!isGameOver) {
    fishY -= jumpHeight * scaleY;
  }
}

// Main draw function
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw background
  ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);

  // Draw and update obstacles
  for (let i = 0; i < obstacles.length; i++) {
    let constant = obstacleHeight + gap * scaleY;
    ctx.drawImage(obstacleTop, obstacles[i].x, obstacles[i].y, obstacleWidth, obstacleHeight);
    ctx.drawImage(obstacleBottom, obstacles[i].x, obstacles[i].y + constant, obstacleWidth, obstacleHeight);

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
        setTimeout(() => document.getElementById("startButton").style.display = "block", 1000);
        return; // Stop the draw loop on game over
      }
    }

    // Increase score when passing an obstacle
    if (obstacles[i].x === 5 * scaleX) {
      score++;
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
function startGame() {
  if (imagesLoaded === totalImages) {
    document.getElementById("startButton").style.display = "none";
    resetGame(); // Reset game variables
    draw(); // Start the game loop
  }
}

// Resize canvas initially and on window resize
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// Attach startGame to button
document.getElementById("startButton").onclick = startGame;
