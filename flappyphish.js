// Get the canvas and context
const canvas = document.getElementById('flappyCanvas');
const ctx = canvas.getContext('2d');

// Load images
const fish = new Image();
const bg = new Image();
const fg = new Image();
const obstacleTop = new Image();
const obstacleBottom = new Image();

fish.src = "images/fish.png"; // The fish image you uploaded
bg.src = "images/underwater.png"; // The underwater background you uploaded
fg.src = "images/underwater.png"; // Sea floor - reuse the background for simplicity, or replace with another image
obstacleTop.src = "images/computerpiletop.png"; // The tech obstacle image (top pile of tech)
obstacleBottom.src = "images/computerpiletop.png"; // Reusing the same tech image for the bottom pile of tech

// Phishing facts array
const phishingFacts = [
  "Phishing accounts for 90% of data breaches.",
  "1 in every 99 emails is a phishing attempt.",
  "85% of organizations have faced phishing attacks.",
  "The average cost of a phishing attack is $1.4 million.",
  // Add more facts, up to 20
];

// Game variables
const gap = 85;
let constant;

let fishX = 10;
let fishY = 150;
const gravity = 1.5;

let score = 0;
let factElement = document.getElementById('fact');

// Create obstacle coordinates
const obstacles = [];
obstacles[0] = {
  x: canvas.width,
  y: 0
};

// Control the fish with the spacebar
document.addEventListener('keydown', moveUp);

function moveUp() {
  fishY -= 25;
}

// Draw everything
function draw() {
  ctx.drawImage(bg, 0, 0); // Draw the underwater background

  for (let i = 0; i < obstacles.length; i++) {
    constant = obstacleTop.height + gap;
    ctx.drawImage(obstacleTop, obstacles[i].x, obstacles[i].y); // Draw the top obstacle (pile of tech)
    ctx.drawImage(obstacleBottom, obstacles[i].x, obstacles[i].y + constant); // Draw the bottom obstacle

    obstacles[i].x--;

    if (obstacles[i].x == 125) {
      obstacles.push({
        x: canvas.width,
        y: Math.floor(Math.random() * obstacleTop.height) - obstacleTop.height
      });
    }

    // Detect collision
    if (
      fishX + fish.width >= obstacles[i].x &&
      fishX <= obstacles[i].x + obstacleTop.width &&
      (fishY <= obstacles[i].y + obstacleTop.height ||
        fishY + fish.height >= obstacles[i].y + constant) ||
      fishY + fish.height >= canvas.height - fg.height
    ) {
      displayFact();
      location.reload(); // Reload the page if the fish hits an obstacle
    }

    if (obstacles[i].x == 5) {
      score++;
    }
  }

  ctx.drawImage(fg, 0, canvas.height - fg.height); // Draw the sea floor (foreground)
  ctx.drawImage(fish, fishX, fishY); // Draw the fish character

  fishY += gravity;

  ctx.fillStyle = '#000';
  ctx.font = '20px Verdana';
  ctx.fillText('Score : ' + score, 10, canvas.height - 20);

  requestAnimationFrame(draw);
}

// Function to display a random phishing fact after game over
function displayFact() {
  const randomIndex = Math.floor(Math.random() * phishingFacts.length);
  factElement.innerText = phishingFacts[randomIndex];
}

draw();
