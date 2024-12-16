let serialPort;
let redValue = 0;
let greenValue = 0;
let blueValue = 0;
let buttonState = 0;
let resetButtonState = 1;
let lastResetButtonState = 1;
let lastButtonState = 1;

let targetColors;
let currentTargetIndex = 0;
let score = 0;
let matchPercentage = 0;
let roundScores = [];

let startTime;
let gameDuration = 45000; // 45 seconds
let gameOverTime = 3000; // 3 seconds for game over screen

let isGameOver = false;
let gameOverStartTime = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);

  serialPort = new p5.SerialPort();
  serialPort.open('COM12'); // Serial port arduino is connected
  serialPort.on('connected', serverConnected);
  serialPort.on('data', serialEvent);
  serialPort.on('error', serialError);

  // Define target colors
  targetColors = [
    color(255, 0, 0), // Red
    color(0, 255, 0), // Green
    color(0, 0, 255)  // Blue
  ];

  startGame();
}

function draw() {
  if (isGameOver) {
    let elapsedGameOverTime = millis() - gameOverStartTime;
    // Display Game Over Screen
    background(255, 0, 0);
    textSize(32);
    fill(0);
    textAlign(CENTER);
    text('Game Over!', width / 2, height / 4);
    textSize(24);
    text(`Total Score: ${score}`, width / 2, height / 4 + 50);

    let yOffset = height / 4 + 100;
    textAlign(LEFT);
    roundScores.forEach((roundScore, index) => {
      text(`Round ${index + 1}: ${roundScore.score} points`, width / 2 - 100, yOffset);
      yOffset += 30;
    });

    // Wait for 3 seconds before allowing reset
    if (elapsedGameOverTime > gameOverTime) {
      // Only listen for reset button after 3 seconds
      if (resetButtonState == 0 && lastResetButtonState == 1) {
        console.log("Reset button pressed, restarting game...");
        resetGame();
      }
    }

    lastResetButtonState = resetButtonState;
    return; // Prevent the rest of the game code from running while game over screen is displayed

  } else {
    // Main Game Logic
    background(200);

    // Display Target Color
    fill(targetColors[currentTargetIndex]);
    rect(width / 4, height / 4, 200, 200);
    fill(0);
    textSize(16);
    text('Target Color', width / 4 + 50, height / 4 + 220);

    // Display Player Color
    fill(redValue, greenValue, blueValue);
    rect(3 * width / 4 - 200, height / 4, 200, 200);
    fill(0);
    textSize(16);
    text('Your Color', 3 * width / 4 - 150, height / 4 + 220);

    // Display Score and Match Percentage
    textSize(24);
    fill(0);
    text(`Score: ${score}`, width / 4, height - 50);
    text(`Match: ${matchPercentage.toFixed(2)}%`, width / 2 - 100, height - 50);

    // Timer
    let remainingTime = gameDuration - (millis() - startTime);
    textSize(24);
    fill(0);
    text(`Time: ${ceil(remainingTime / 1000)}`, 3 * width / 4, height - 50);

    if (remainingTime <= 0) {
      endGame();
    }

    // Match Logic
    let similarity = calculateSimilarity(redValue, greenValue, blueValue, targetColors[currentTargetIndex].levels);
    matchPercentage = similarity;

    if (matchPercentage >= 95) {
      score += 5;
      roundScores.push({ round: roundScores.length + 1, score: 5 });
      matchPercentage = 0;
      currentTargetIndex = (currentTargetIndex + 1) % targetColors.length;

      // Send signal to Arduino for score match beep (Signal 1)
      serialPort.write(1);  // Signal 1 for single beep
    }

    // Button to Cycle Target Colors
    if (buttonState == 0 && lastButtonState == 1) {
      currentTargetIndex = (currentTargetIndex + 1) % targetColors.length;
    }
    lastButtonState = buttonState;
  }
}

function serverConnected() {
  console.log('Connected to WebSocket server');
}

function serialEvent() {
  let inString = serialPort.readLine();
  console.log('Raw Serial Data: ' + inString);
  if (inString.length > 0) {
    let values = inString.trim().split(',');
    if (values.length == 5) {
      redValue = parseInt(values[0]);
      greenValue = parseInt(values[1]);
      blueValue = parseInt(values[2]);
      buttonState = parseInt(values[3]);
      resetButtonState = parseInt(values[4]);
      console.log(`Parsed Values - R: ${redValue}, G: ${greenValue}, B: ${blueValue}, Button: ${buttonState}, Reset: ${resetButtonState}`);
    }
  }
}

function serialError(err) {
  console.error('Serial port error: ' + err);
}

function calculateSimilarity(r, g, b, target) {
  let rDiff = abs(r - target[0]);
  let gDiff = abs(g - target[1]);
  let bDiff = abs(b - target[2]);
  let totalDiff = rDiff + gDiff + bDiff;
  let similarity = map(totalDiff, 0, 765, 100, 0);
  return similarity;
}

function startGame() {
  score = 0;
  roundScores = [];
  startTime = millis();
  isGameOver = false;
}

function endGame() {
  isGameOver = true;
  gameOverStartTime = millis(); // Record the time when game over started
  serialPort.write(3);  // Signal 3 for continuous beep on game over
}

function resetGame() {
  startGame();
  isGameOver = false;
}
