// Get canvas and context
const canvas = document.getElementById("flappyCanvas");
const ctx = canvas.getContext("2d");

// Game variables
let fishX = 50;
let fishY = 150;
let gravity = 1.5;
let gap = 120;
let obstacles = [];
let score = 0;
let isGameOver = false;

// Load images
let bg = new Image();
bg.src = "underwater.png";

let obstacleTop = new Image();
obstacleTop.src = "computerpiletop.png";

let obstacleBottom = new Image();
obstacleBottom.src = "computerpiletop.png";

let fg = new Image();
fg.src = "seafloor.png";

let fish = new Image();
fish.src = "fish.png";

// Flag to track if all images are loaded
let imagesLoaded = 0;
const totalImages = 5;

// Increment imagesLoaded when each image finishes loading
function imageLoaded() {
  imagesLoaded++;
  if (imagesLoaded === totalImages) {
    document.getElementById("startButton").disabled = false;
  }
}

// Attach onload to each image
bg.onload = imageLoaded;
obstacleTop.onload = imageLoaded;
obstacleBottom.onload = imageLoaded;
fg.onload = imageLoaded;
fish.onload = imageLoaded;

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

// Initialize first obstacle
obstacles[0] = {
  x: canvas.width,
  y: Math.floor(Math.random() * obstacleTop.height) - obstacleTop.height
};

// Move fish up on spacebar press
document.addEventListener("keydown", moveUp);
function moveUp() {
  fishY -= 25;
}

// Main draw function
function draw() {
  // Clear the canvas before each frame
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw background
  ctx.drawImage(bg, 0, 0);

  // Draw and update obstacles
  for (let i = 0; i < obstacles.length; i++) {
    let constant = obstacleTop.height + gap;
    ctx.drawImage(obstacleTop, obstacles[i].x, obstacles[i].y);
    ctx.drawImage(obstacleBottom, obstacles[i].x, obstacles[i].y + constant);

    // Move obstacles to the left
    obstacles[i].x--;

    // Add new obstacle when one reaches a certain position
    if (obstacles[i].x === 125) {
      obstacles.push({
        x: canvas.width,
        y: Math.floor(Math.random() * obstacleTop.height) - obstacleTop.height
      });
    }

    // Check for collision with obstacles or ground
    if (
      fishX + fish.width >= obstacles[i].x &&
      fishX <= obstacles[i].x + obstacleTop.width &&
      (fishY <= obstacles[i].y + obstacleTop.height ||
        fishY + fish.height >= obstacles[i].y + constant) ||
      fishY + fish.height >= canvas.height - fg.height
    ) {
      if (!isGameOver) {
        displayFact();
        isGameOver = true;
        setTimeout(() => location.reload(), 1000); // Delay before reload
      }
    }

    // Increase score when passing an obstacle
    if (obstacles[i].x === 5) {
      score++;
    }
  }

  // Draw foreground
  ctx.drawImage(fg, 0, canvas.height - fg.height);

  // Draw fish
  ctx.drawImage(fish, fishX, fishY);

  // Apply gravity to the fish
  fishY += gravity;

  // Display score
  ctx.fillStyle = "#000";
  ctx.font = "20px Verdana";
  ctx.fillText("Score: " + score, 10, canvas.height - 20);

  // Continue animation if game is not over
  if (!isGameOver) {
    requestAnimationFrame(draw);
  }
}

// Start game function triggered by "Start Game" button
function startGame() {
  if (imagesLoaded === totalImages) {
    document.getElementById("startButton").style.display = "none"; // Hide start button
    draw(); // Start the game loop
  }
}

// Attach startGame to the button
document.getElementById("startButton").onclick = startGame;
