int redPin = 9;
int greenPin = 10;
int bluePin = 11;
int potRPin = A0;
int potGPin = A1;
int potBPin = A2;
int buzzerPin = 8;
int buttonPin = 4; // Existing button on pin 4
int resetButtonPin = 7; // Reset button on pin 7

void setup() {
  Serial.begin(9600);
  pinMode(redPin, OUTPUT);
  pinMode(greenPin, OUTPUT);
  pinMode(bluePin, OUTPUT);
  pinMode(buzzerPin, OUTPUT);
  pinMode(buttonPin, INPUT_PULLUP);
  pinMode(resetButtonPin, INPUT_PULLUP); // Setup reset button with pull-up resistor
}

void loop() {
  // Read potentiometer values
  int redValue = analogRead(potRPin);
  int greenValue = analogRead(potGPin);
  int blueValue = analogRead(potBPin);
  int buttonState = digitalRead(buttonPin);
  int resetButtonState = digitalRead(resetButtonPin);

  // Map and write values to RGB LED
  redValue=map(redValue, 0, 1023, 0, 255);
  greenValue=map(greenValue, 0, 1023, 0, 255);
  blueValue=map(blueValue, 0, 1023, 0, 255);
  analogWrite(redPin, redValue );
  analogWrite(greenPin, greenValue );
  analogWrite(bluePin, blueValue);

  // Send data to p5.js
  Serial.print(redValue);
  Serial.print(",");
  Serial.print(greenValue);
  Serial.print(",");
  Serial.print(blueValue);
  Serial.print(",");
  Serial.print(buttonState);
  Serial.print(",");
  Serial.println(resetButtonState);

  // Check for signals from p5.js for buzzer actions
  if (Serial.available() > 0) {
    int buzzerSignal = Serial.read();
    playBuzzer(buzzerSignal);
  }

  delay(100);
}

// Function to control buzzer based on the signal
void playBuzzer(int signal) {
  switch (signal) {
    case 1: // Single beep for score match
      tone(buzzerPin, 1000, 200); // 1000 Hz for 200 ms
      delay(300); // Wait before turning off tone
      noTone(buzzerPin);
      break;

    case 2: // Rapid beeps for time nearing end
      for (int i = 0; i < 5; i++) {
        tone(buzzerPin, 1500, 100); // 1500 Hz for 100 ms
        delay(200); // Delay between beeps
        noTone(buzzerPin);
      }
      break;

    case 3: // Continuous sound for game over
      tone(buzzerPin, 500); // 500 Hz continuous tone
      delay(4000); // Play for 4 seconds
      noTone(buzzerPin);
      break;

    default:
      noTone(buzzerPin); // Turn off buzzer
      break;
  }
}
