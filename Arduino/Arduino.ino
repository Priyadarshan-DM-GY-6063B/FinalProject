// Pin definitions
const int redPin = 3;    // Red LED
const int greenPin = 5;  // Green LED
const int bluePin = 6;   // Blue LED

const int potRed = A0;   // Potentiometer for Red
const int potGreen = A1; // Potentiometer for Green
const int potBlue = A2;  // Potentiometer for Blue

void setup() {
  // Initialize serial communication
  Serial.begin(9600);

  // Set LED pins as outputs
  pinMode(redPin, OUTPUT);
  pinMode(greenPin, OUTPUT);
  pinMode(bluePin, OUTPUT);
}

void loop() {
  // Read potentiometer values
  int redValue = analogRead(potRed);
  int greenValue = analogRead(potGreen);
  int blueValue = analogRead(potBlue);

  // Map values to PWM range (0-255)
  redValue = map(redValue, 0, 1023, 0, 255);
  greenValue = map(greenValue, 0, 1023, 0, 255);
  blueValue = map(blueValue, 0, 1023, 0, 255);

  // Send values via Serial
  Serial.print(redValue);
  Serial.print(",");
  Serial.print(greenValue);
  Serial.print(",");
  Serial.println(blueValue);

  // Control LEDs
  analogWrite(redPin, redValue);
  analogWrite(greenPin, greenValue);
  analogWrite(bluePin, blueValue);

  delay(100); // Reduce the update frequency
}
