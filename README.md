# Arduino + p5.js Interactive Project

## Idea 1. Digital Dice  
### Description  
A button press rolls a digital dice. The dice roll result is displayed on a **p5.js canvas**, and the Arduino lights up LEDs corresponding to the dice number.  

### How It Works  
- The button triggers a dice roll in **p5.js**.  
- **p5.js** generates a random number (1 to 6) and sends it to the Arduino via serial.  
- The Arduino lights up the corresponding number of LEDs.  
 ![image description](images.png)
---

## Idea 2. Interactive Reaction Timer Game  
### Description  
A simple game where the player reacts as quickly as possible to an LED lighting up. The reaction time is displayed in **p5.js**, along with a leaderboard.  

### How It Works  
- The Arduino lights up an LED randomly.  
- The player must press the button as quickly as possible.  
- The Arduino sends the reaction time to **p5.js**, which displays it on the screen and updates the leaderboard.

---

## Idea 3. Color Picker Using a Potentiometer  
### Description  
A potentiometer is used to adjust colors dynamically in a **p5.js sketch**. The selected color is also displayed on an RGB LED connected to the Arduino.  

![image description](Colorpicker.png)

### How It Works  
- The potentiometer position is read by the Arduino and sent to **p5.js** via serial.  
- **p5.js** updates a shape's color or the canvas background dynamically based on the potentiometer's position
