function draw() {
  console.log("Drawing background");
  ctx.drawImage(bg, 0, 0); // Background

  console.log("Drawing obstacles");
  for (let i = 0; i < obstacles.length; i++) {
    constant = obstacleTop.height + gap;
    ctx.drawImage(obstacleTop, obstacles[i].x, obstacles[i].y);
    ctx.drawImage(obstacleBottom, obstacles[i].x, obstacles[i].y + constant);

    obstacles[i].x--;

    if (obstacles[i].x == 125) {
      obstacles.push({
        x: canvas.width,
        y: Math.floor(Math.random() * obstacleTop.height) - obstacleTop.height
      });
    }

    if (
      fishX + fish.width >= obstacles[i].x &&
      fishX <= obstacles[i].x + obstacleTop.width &&
      (fishY <= obstacles[i].y + obstacleTop.height ||
        fishY + fish.height >= obstacles[i].y + constant) ||
      fishY + fish.height >= canvas.height - fg.height
    ) {
      displayFact();
      console.log("Collision detected, reloading game...");
      location.reload();
    }

    if (obstacles[i].x == 5) {
      score++;
    }
  }

  console.log("Drawing foreground");
  ctx.drawImage(fg, 0, canvas.height - fg.height); // Foreground

  console.log("Drawing fish");
  ctx.drawImage(fish, fishX, fishY); // Fish

  fishY += gravity;

  console.log("Score: " + score);
  ctx.fillStyle = '#000';
  ctx.font = '20px Verdana';
  ctx.fillText('Score : ' + score, 10, canvas.height - 20);

  requestAnimationFrame(draw);
}

draw();
