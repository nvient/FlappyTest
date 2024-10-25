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
bg.src = "background.png";
bg.onload = () => console.log("Background image loaded");

let obstacleTop = new Image();
obstacleTop.src = "obstacleTop.png";
obstacleTop.onload = () => console.log("Top obstacle image loaded");

let obstacleBottom = new Image();
obstacleBottom.src = "obstacleBottom.png";
obstacleBottom.onload = () => console.log("Bottom obstacle image loaded");

let fg = new Image();
fg.src = "foreground.png";
fg.onload = () => console.log("Foreground image loaded");

let fish = new Image();
fish.src = "fish.png";
fish.onload = () => console.log("Fish image loaded");

// Track loaded images
let imagesLoaded = 0;
const totalImages = 5;

// Increment imagesLoaded counter
function imageLoaded() {
  imagesLoaded++;
  console.log(`Images loaded: ${imagesLoaded}/${totalImages}`);
  if (imagesLoaded === totalImages) {
    document.getElementById("startButton").disabled = false;
  }
}

// Attach onload listeners to count loaded images
bg.onload = imageLoaded;
obstacleTop.onload = imageLoaded;
obstacleBottom.onload = imageLoaded;
fg.onload = imageLoaded;
fish.onload = imageLoaded;

// Display a random fact on collision
function displayFact() {
  const facts = [
    "Fact 1: Phishing is dangerous!",
    "Fact 2: Be careful with suspicious links!",
    "Fact 3: Keep your credentials safe!"
  ];
  const randomFact = facts[Math.floor(Math.random() * facts.length)];
  document.getElementById("fact").innerText = randomFact;
}

// Initialize the first obstacle
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
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  console.log("Drawing frame...");

  // Draw background
  ctx.drawImage(bg, 0, 0);

  // Draw obstacles
  for (let i = 0; i < obstacles.length; i++) {
    let constant = obstacleTop.height + gap;
    ctx.drawImage(obstacleTop, obstacles[i].x, obstacles[i].y);
    ctx.drawImage(obstacleBottom, obstacles[i].x, obstacles[i].y + constant);

    // Move obstacles to the left
    obstacles[i].x--;

    // Add a new obstacle
    if (obstacles[i].x === 125) {
      obstacles.push({
        x: canvas.width,
        y: Math.floor(Math.random() * obstacleTop.height) - obstacleTop.height
      });
    }

    // Collision detection
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
        setTimeout(() => location.reload(), 1000);
      }
    }

    // Score update
    if (obstacles[i].x === 5) {
      score++;
    }
  }

  // Draw foreground
  ctx.drawImage(fg, 0, canvas.height - fg.height);

  // Draw fish
  ctx.drawImage(fish, fishX, fishY);

  // Apply gravity
  fishY += gravity;

  // Display score
  ctx.fillStyle = "#000";
  ctx.font = "20px Verdana";
  ctx.fillText("Score: " + score, 10, canvas.height - 20);

  if (!isGameOver) {
    requestAnimationFrame(draw);
  }
}

// Start game when button is clicked
function startGame() {
  if (imagesLoaded === totalImages) {
    console.log("Starting game...");
    document.getElementById("startButton").style.display = "none";
    draw();
  }
}

// Attach startGame to button
document.getElementById("startButton").onclick = startGame;
