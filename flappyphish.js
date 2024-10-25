// Set up canvas and context
const canvas = document.getElementById("flappyCanvas");
const ctx = canvas.getContext("2d");

// Load images
let bg = new Image();
bg.src = "underwater.png"; // Replace with the correct path

let obstacleTop = new Image();
obstacleTop.src = "computerpiletop.png"; // Replace with the correct path

let obstacleBottom = new Image();
obstacleBottom.src = "computerpiletop.png"; // Replace with the correct path

let fg = new Image();
fg.src = "seafloor.png"; // Replace with the correct path

let fish = new Image();
fish.src = "fish.png"; // Replace with the correct path

// Game variables
let fishX = 50;
let fishY = 150;
let gravity = 1.5;
let gap = 100;
let obstacles = [];
let score = 0;

// Initialize first obstacle
obstacles[0] = {
  x: canvas.width,
  y: Math.floor(Math.random() * obstacleTop.height) - obstacleTop.height
};

// Function to move fish up on spacebar
document.addEventListener("keydown", moveUp);
function moveUp() {
  fishY -= 25; // Adjust jump height as needed
}

// Function to display random fact on collision
function displayFact() {
  const facts = [
    "Fact 1: Phishing is dangerous!",
    "Fact 2: Be careful with suspicious links!",
    "Fact 3: Keep your credentials safe!"
  ];
  const randomFact = facts[Math.floor(Math.random() * facts.length)];
  document.getElementById("fact").innerText = randomFact;
}

// Main game drawing function
function draw() {
  // Clear the canvas before each draw to reduce “glitches”
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw background
  ctx.drawImage(bg, 0, 0);

  // Draw and update obstacles
  for (let i = 0; i < obstacles.length; i++) {
    let constant = obstacleTop.height + gap;
    ctx.drawImage(obstacleTop, obstacles[i].x, obstacles[i].y);
    ctx.drawImage(obstacleBottom, obstacles[i].x, obstacles[i].y + constant);

    // Move obstacles
    obstacles[i].x -= 2;

    // Spawn a new obstacle with a controlled interval
    if (obstacles[i].x === 125) {
      obstacles.push({
        x: canvas.width,
        y: Math.floor(Math.random() * obstacleTop.height) - obstacleTop.height
      });
    }

    // Limit the obstacle count for smoother gameplay
    if (obstacles.length > 5) {
      obstacles.shift();
    }

    // Check for collision
    checkCollision();
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
  ctx.fillText("Score : " + score, 10, canvas.height - 20);
}

  requestAnimationFrame(draw);
}

// Start the game
draw();
