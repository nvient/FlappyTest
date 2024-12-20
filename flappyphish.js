document.addEventListener("DOMContentLoaded", () => {
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const overlay = document.getElementById("overlay");

console.log("Start button:", document.getElementById("startButton"));
  
let gravity = 0.5;
let jumpHeight = 25;
let gameRunning = false; // Initialize game as not running
let score = 0;
  let gameOver = false; 
  let obstacles = [];
  let obstacleSpeed = 2;
  let fish = { 
  x: 100, 
  y: 0, 
  width: canvas.width * 0.05, // Dynamically scale width based on canvas size
  height: canvas.height * 0.05, // Dynamically scale height based on canvas size
  velocity: 0
};

const fishImg = new Image();
fishImg.src = "fish.png";
  
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

const fishScaleFactor = 1.5; // Scale the fish to be 1.5 times larger
fishImg.onload = () => {
  const aspectRatio = fishImg.naturalWidth / fishImg.naturalHeight || 1;
  
  fish.width = Math.max(canvas.width * 0.05 * fishScaleFactor, 40); 
  fish.height = fish.width / aspectRatio;
  
  // Center fish vertically
  fish.y = (canvas.height / 2) - (fish.height / 2);
};

// Fallback in case `onload` triggers after resizing
if (fishImg.complete) fishImg.onload();

  // Center fish
  fish.y = (canvas.height / 2) - (fish.height / 2);
}

// Add Resize Listener
window.addEventListener("resize", resizeCanvas);
resizeCanvas(); // Initial resize setup

const obstacleImages = [
  "firewall.svg",
  "behavior-blocker.svg",
  "cloud-firewall.svg",
  "cyber-security.svg",
  "virus-free.svg"
].map((src) => {
  const img = new Image();
  img.src = src;
  return img;
});

const backgroundImg = new Image();
backgroundImg.src = "UnderseaBackground.png";

const foregroundImg = new Image();
foregroundImg.src = "Seafloor.png";

// Random phishing facts
const phishingFacts = [
  "Remember the SLAM method.",
  "Hover over, but do not click, on links in unsolicited emails to verify URLs.",
  "Never open unexpected attachments, especially in an unsolicited email.",
  "Phishing often uses urgency to trick you.",
  "Check the email sender addresses carefully."
];

// Event Listeners for User Interaction
document.getElementById("startButton").addEventListener("click", () => {
  console.log("Start button clicked!"); 
  startGame();
});

canvas.addEventListener("click", () => {
  if (gameRunning) {
    fish.velocity = -6; // Adjust upward jump strength
    console.log("Fish jumps!"); // Debug log to confirm clicks
  }
});
  document.addEventListener("keydown", (event) => {
  if (gameRunning && event.code === "Space") {
    fish.velocity = -4.5; // Spacebar makes fish jump
    console.log("Spacebar pressed! Fish jumps!");
  }
});
function createObstacle() {
  const randomImage = obstacleImages[Math.floor(Math.random() * obstacleImages.length)];
  const baseWidth = canvas.width * 0.05; // Adjust the scaling as needed
  const aspectRatio = randomImage.naturalWidth / randomImage.naturalHeight;

  obstacles.push({
    x: canvas.width,
    y: Math.random() * (canvas.height - 100), // Random y-position
    width: baseWidth,                        // Dynamically scaled width
    height: baseWidth / aspectRatio,         // Proportional height
    img: randomImage                         // Store the selected image
  });
}
function drawBackground() {
  // Scale the background to match the canvas width while maintaining proportions
  const scale = canvas.width / backgroundImg.naturalWidth;
  const scaledHeight = backgroundImg.naturalHeight * scale;

  ctx.drawImage(backgroundImg, 0, 0, canvas.width, scaledHeight);
}

function drawForeground() {
  // Scale the foreground to match the canvas width while maintaining proportions
  const scale = canvas.width / foregroundImg.naturalWidth;
  const scaledHeight = foregroundImg.naturalHeight * scale;

  const yPosition = canvas.height - scaledHeight; // Align to the bottom of the canvas

  ctx.drawImage(foregroundImg, 0, yPosition, canvas.width, scaledHeight);
}                          
// Start Game
function startGame() {
console.log("Start button clicked!");
    fish.x = 100, 
    fish.y = canvas.height / 2, 
    fish.velocity = 0
 
  obstacles = [];
  obstacleSpeed = 2;
  gameRunning = true;
  gameOver = false;
  score = 0;
  overlay.style.display = "none";
  animate();
}

// Draw Fish
function drawFish() {
  ctx.drawImage(fishImg, fish.x, fish.y, fish.width, fish.height);
}

// Draw Obstacles
function drawObstacles() {
  obstacles.forEach((obstacle) => {
    ctx.drawImage(obstacle.img, obstacle.x, obstacle.y, obstacle.width, obstacle.height);
  });
}

function updateObstacles() {
  if (gameRunning && Math.random() < 0.01) {
    createObstacle(); // Call the new obstacle creation function
  }
obstacles.forEach((obstacle, index) => {
  obstacle.x -= obstacleSpeed; // Move the obstacle to the left

  // Check if the obstacle has been passed by the fish
  if (!obstacle.cleared && obstacle.x + obstacle.width < fish.x) {
    score++; // Increment score only when the obstacle is cleared
    obstacle.cleared = true; // Mark the obstacle as cleared
    console.log(`Score: ${score}`); // Debug log
  }

  // Remove the obstacle if it moves off-screen
  if (obstacle.x + obstacle.width < 0) {
    obstacles.splice(index, 1);
  }
});

}
function drawScore() {
  ctx.font = "24px 'Lato'"; // Set font size and family
  ctx.fillStyle = "white"; // Set text color
  ctx.fillText(`Score: ${score}`, 20, 30); // Draw score at top-left
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
    drawScore();

    if (detectCollision()) endGame();
  }

  drawForeground();
  if (!gameOver) requestAnimationFrame(animate);
}
 
// Initialize Game
document.getElementById("overlay").style.display = "flex";
});
