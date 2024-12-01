# Arduino + p5.js Interactive Project

# **Color Picker Game Using Potentiometer**

## **Milestone 2: Project Proposal, Planning, and Organizing**

### **1. Project Overview**
This project transforms a simple potentiometer-controlled color picker into an interactive color-matching game. Players will use three potentiometers to adjust Red, Green, and Blue (RGB) color values, attempting to match a randomly generated target color displayed on the p5.js interface. Feedback will be provided in real-time, with scores indicating how closely the player’s selected color matches the target.

The system combines Arduino hardware (potentiometers, RGB LEDs, and a buzzer) with p5.js for an engaging experience that explores how physical inputs can interact with visual outputs creatively.

---

### **2. Key Objectives**

#### **Gameplay Experience:**
- Develop an interactive game where players match colors using physical controls.
- Provide real-time visual, auditory, and numerical feedback to enhance engagement.

#### **Educational Element:**
- Help users understand the relationship between physical potentiometer adjustments and RGB color mixing.

#### **Creative Expression:**
- Integrate sound effects, animations, and a progression system to create a user experience.

---

### **3. Project Features**

#### **Core Features:**
- Use three potentiometers to adjust RGB values.
- Display the target color and selected color on the p5.js canvas.
- Score the match based on the percentage similarity between the target and selected colors.
- Output the selected color to an RGB LED in real time.
- **Buzzer Feedback**: Play tones to indicate high or low match scores.

#### **Interactive Gameplay:**
- A timer to add urgency to the gameplay.
- Randomly generated target colors for each round.

#### **Feedback Mechanisms:**
- Display a score indicating the match percentage.
- Provide visual and auditory feedback using animations, RGB LED, and buzzer.

#### **Scalability:**
- Potential for additional levels or multiplayer functionality in future iterations.

---

### **4. Narrative and Engagement**

#### **Narrative:**
Players act as futuristic digital artists tasked with "restoring" corrupted digital art by matching its original colors using physical controls. The experience immerses players in a blend of physical and digital interactions.

#### **Feelings to Convey:**
- **Challenge**: Time pressure and scoring encourage focus and precision.
- **Satisfaction**: Real-time feedback (visual, auditory, and tactile) rewards player success.

---

### **5. Hardware and Software Requirements**

#### **Hardware:**
- Arduino Board (e.g., Uno, Nano)
- RGB LED
- 3 Potentiometers (10kΩ)
- Resistors (220Ω - 330Ω)
- Buzzer (Piezo Speaker)
- Breadboard and Jumper Wires
- USB Cable

#### **Software:**
- Arduino IDE
- p5.js (JavaScript Library)
- Serial Communication between Arduino and p5.js

---

### **6. Implementation Plan**

#### **Phase 1: Setup and Testing (Dec 2 – Dec 5)**
- Assemble the circuit with Arduino, potentiometers, RGB LED, and buzzer.
- Test individual components:
  - Reading potentiometer values.
  - Controlling RGB LED brightness.
  - Generating tones with the buzzer.

#### **Phase 2: p5.js Integration (Dec 6 – Dec 10)**
- Set up serial communication between Arduino and p5.js.
- Display RGB values on the p5.js canvas.
- Test the live adjustment of colors with potentiometer inputs.

#### **Phase 3: Game Development (Dec 11 – Dec 14)**
- Implement the color-matching gameplay logic:
  - Random target color generation.
  - Scoring algorithm (percentage match).
  - Timer and feedback mechanisms.
- Add buzzer tones for:
  - High matches (pleasant sound).
  - Low matches (dissonant sound).
- Add animations and visual feedback.

#### **Phase 4: Testing and Refinement (Dec 15 – Dec 16)**
- Test the entire system for usability, accuracy, and performance.
- Refine based on user feedback or identified bugs.

---

### **7. Timeline**

| Task                          | Due Date  | Status   |
|-------------------------------|-----------|----------|
| Assemble and test hardware     | Dec 5     | Pending  |
| Implement serial communication | Dec 10    | Pending  |
| Game logic and buzzer integration | Dec 14 | Pending  |
| Final testing and refinement   | Dec 16    | Pending  |

---

### **8. Expected Outcomes**
- A functional color-matching game with an interactive hardware interface.
- Real-time visual, auditory, and numerical feedback.
- A polished gameplay experience that integrates physical and digital components seamlessly.

--------------

## **Milestone 1: Project Ideas and Diagrams**
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
