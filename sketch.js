let serialPort;
let redValue = 0;
let greenValue = 0;
let blueValue = 0;
let buttonState = 1;
let resetButtonState = 0;
let lastResetButtonState = 1;
let modeButtonState = 0; // New button state for mode selection
let lastModeButtonState = 0; // To track button press for mode change

let targetColors;
let currentTargetIndex = 0;
let score = 0;
let matchPercentage = 0;
let roundScores = [];

let startTime;
let gameDuration = 3000; // Default 45 seconds
let gameOverTime = 3000; // 3 seconds for game over screen

let isGameOver = false;
let gameOverStartTime = 0;
let isGameStarted = false;
let isWelcomeScreen = true;
let isEasyMode = true; // Default mode is Easy

function setup() {
  createCanvas(windowWidth, windowHeight);

  serialPort = new p5.SerialPort();
  serialPort.open('COM12'); // Adjust to your serial port
  serialPort.on('data', serialEvent); // Read incoming data from Arduino
  serialPort.on('error', serialError);

  // Define target colors for easy and hard modes
  targetColors = [
    color(255, 0, 0),  // Red
    color(0, 255, 0),  // Green
    color(0, 0, 255)   // Blue
  ];
}

function draw() {
  // Vibrant animated gradient background
  let gradientStart = color(0, 80, 200);
  let gradientEnd = color(100, 180, 255);
  for (let i = 0; i < height; i++) {
    let inter = map(i, 0, height, 0, 1);
    stroke(lerpColor(gradientStart, gradientEnd, inter));
    line(0, i, width, i);
  }

  // Welcome screen
  if (isWelcomeScreen) {
    displayWelcomeScreen();
    if (resetButtonState == 1 && lastResetButtonState == 0) {
      startGame();  // Start the game when button is pressed
    }
    lastResetButtonState = resetButtonState;
    return; // Exit here to ensure game logic doesn't run yet
  }

  // Once game starts, handle the game logic
  if (isGameOver) {
    displayGameOverScreen();
    if (resetButtonState == 1 && lastResetButtonState == 0) {
      resetGame();  // Reset the game when button is pressed
    }
    lastResetButtonState = resetButtonState;
    return;
  }

  // Main game logic
  displayGameElements();
  handleMatchLogic();
}

function displayWelcomeScreen() {
  textSize(48);
  fill(255);
  textAlign(CENTER);
  text('Welcome to the Color Picker Game!', width / 2, height / 3);

  textSize(24);
  text('Use the potentiometers to match the colors.', width / 2, height / 3 + 50);
  text('Press the Start Button to begin.', width / 2, height / 3 + 100);

  // Pulsating start instruction
  let alpha = map(sin(frameCount * 0.1), -1, 1, 100, 255);
  fill(255, alpha);
  textSize(20);
  text('Waiting for you to press the Start button...', width / 2, height - 100);

  // Mode change instructions
  textSize(24);
  text('Press Mode Button for Easy/Hard Mode', width / 2, height - 150);

  // Display the current game mode
  textSize(30);
  fill(255);
  text(`Current Mode: ${isEasyMode ? "Easy" : "Hard"}`, width / 2, height - 200);

  // Toggle mode if button is pressed
  if (modeButtonState == 1 && lastModeButtonState == 0) {
    toggleGameMode();
  }
  lastModeButtonState = modeButtonState;
}

function displayGameOverScreen() {
  // Dim the background
  fill(0, 0, 0, 200);
  rect(0, 0, width, height);

  // Main Game Over Title
  textSize(48);
  fill(255);
  textAlign(CENTER);
  text('Game Over!', width / 2, height / 4);

  // Total Score
  textSize(24);
  text(`Total Score: ${score}`, width / 2, height / 4 + 50);

  // Round-wise Scores (Displayed on the left side)
  textSize(18);
  textAlign(LEFT);
  fill(255);
  text('Round Scores:', 30, height / 14);

  let yOffset = height / 7 + 4;
  roundScores.forEach((roundScore, index) => {
    text(`Round ${index + 1}: ${roundScore.score} points`, 50, yOffset);
    yOffset += 30; // Add spacing for each round
  });

  // Restart Text
  let alpha = map(sin(frameCount * 0.1), -1, 1, 100, 255);
  fill(255, alpha);
  textAlign(CENTER);
  text('Press Reset Button to Restart', width / 2, height - 100);
}

function displayGameElements() {
  // Display Target Color
  fill(targetColors[currentTargetIndex]);
  rect(width / 4, height / 4, 200, 200, 20);
  fill(0);
  textSize(16);
  textAlign(CENTER);
  text('Target Color', width / 4 + 100, height / 4 + 240);

  // Display Player Color with glow effect
  drawingContext.shadowBlur = matchPercentage * 2;
  drawingContext.shadowColor = color(redValue, greenValue, blueValue);
  fill(redValue, greenValue, blueValue);
  rect(3 * width / 4 - 200, height / 4, 200, 200, 20);
  drawingContext.shadowBlur = 0; // Reset glow
  fill(0);
  textSize(16);
  textAlign(CENTER);
  text('Your Color', 3 * width / 4 - 100, height / 4 + 240);

  // Display Match Similarity
  textSize(24);
  fill(255);
  textAlign(CENTER);
  text(`Match Similarity: ${matchPercentage.toFixed(2)}%`, width / 2, height / 2 + 150);

  // Display Score and Timer
  textSize(24);
  fill(255);
  textAlign(LEFT);
  text(`Score: ${score}`, 50, height - 50);
  let remainingTime = gameDuration - (millis() - startTime);
  textAlign(RIGHT);
  text(`Time: ${ceil(remainingTime / 1000)}s`, width - 50, height - 50);

  if (remainingTime <= 0) {
    endGame();
  }
}

function handleMatchLogic() {
  let similarity = calculateSimilarity(redValue, greenValue, blueValue, targetColors[currentTargetIndex].levels);
  matchPercentage = similarity;

  if (matchPercentage >= 80) {
    score += 5;
    roundScores.push({ round: roundScores.length + 1, score: 5 });
    matchPercentage = 0;
    currentTargetIndex = (currentTargetIndex + 1) % targetColors.length;

    // Send signal to Arduino for score match beep (Signal 1)
    serialPort.write(1);  // Signal 1 for single beep
  }
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
  currentTargetIndex = 0;
  startTime = millis();
  isGameOver = false;
  isGameStarted = true;
  isWelcomeScreen = false; // Transition away from welcome screen
}

function endGame() {
  isGameOver = true;
  gameOverStartTime = millis();
  serialPort.write(3); // Signal 3 for continuous beep on game over
}

function resetGame() {
  isWelcomeScreen = true;  // Reset to welcome screen
  isGameStarted = false;   // Not yet started
  isGameOver = false;      // No game over
}

function toggleGameMode() {
  if (isEasyMode) {
    gameDuration = 2000; // Shorter time for hard mode
    isEasyMode = false;
    console.log("Switched to Hard Mode");
  } else {
    gameDuration = 3000; // Default time for easy mode
    isEasyMode = true;
    console.log("Switched to Easy Mode");
  }
}

// Serial communication functions
function serialEvent() {
  let incomingData = serialPort.readLine();
  if (incomingData) {
    let values = incomingData.split(',');
    if (values.length >= 4) {
      redValue = int(values[0]);
      greenValue = int(values[1]);
      blueValue = int(values[2]);
      resetButtonState = int(values[3]);
      modeButtonState = int(values[4]);
    }
  }
}

function serialError(err) {
  console.error("Serial Error: ", err);
}
