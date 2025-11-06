# 📘 Solitaire (Turn-Three) – DSA Project

A modern implementation of **Klondike Solitaire (Turn-Three)** built using **React**, featuring custom data structure implementations (Linked List, Stack, Queue), smooth animations, undo-redo support, hints, and a responsive UI.

 Developed as part of the **CSC200 – Data Structures & Algorithms** mid-term project.

---

### Features

- ✔ Turn-Three solitaire gameplay  
- ✔ Access to **any of the top three waste cards**  
- ✔ Move multiple cards within tableau  
- ✔ Custom data structures  
  - Linked List — Tableau  
  - Stack — Foundation & Undo/Redo  
  - Queue — Stock  
- ✔ Undo / Redo functionality  
- ✔ Hint system  
- ✔ Timer  
- ✔ Smooth animations & effects  
- ✔ Light / Dark / Bold themes  
- ✔ Full win detection & celebration  



### 🧠 Data Structures Used

| Component   | Structure   | Reason                       |
|-------------|-------------|------------------------------|
| Tableau     | Linked List | Efficient multi-card movement |
| Foundation  | Stack       | Only top card access         |
| Stock       | Queue       | Draw FIFO order              |
| Waste       | Array       | Access any top 3 cards       |
| Undo/Redo   | Stack       | State traversal              |

---

### 🚀 Live Demo
🔗 **Play here:**  
https://solitairegame.vercel.app/

---

### 🛠 Tech Stack

- React  
- Vite  
- Tailwind CSS  
- Framer Motion  
- Lucide React  
- @heruka_urgyen/react-playing-cards  
- NPM  
- Custom DSA structures: Linked List, Stack, Queue  

---

### 📁 Project Structure

src/
├── components/
│ ├── Balatro/
│ ├── DraggableCard.jsx
│ ├── DroppablePile.jsx
│ ├── Header.jsx
│ └── SolitaireBoard.jsx
├── dataStructures/
│ ├── LinkedList.js
│ ├── Stack.js
│ └── Queue.js
├── game/
│ ├── GameLogic.js
│ └── Card.js
├── main.jsx
├── index.css
└── App.jsx


---

### ⚙️ Installation & Setup

#### ✅ Requirements
- Node.js **v16+**
- NPM **v8+**

 Due to peer dependency conflicts, this project uses:  
 `legacy-peer-deps=true` (already configured via `.npmrc`)

#### ✅ Steps

```bash
# Clone repository
git clone https://gitlab.com/aa727dar/csc200m24pid156.git

# Navigate
cd CSC200M24PID156

# Install dependencies
npm install

# Start dev server
npm run dev

Open in browser 👉 http://localhost:5173

```

### 🎮 How to Play

- Tableau piles → Arrange alternating colors & descending rank

- Foundation → Build A → K (same suit)

- Stock → Draw 3 cards to waste

- Waste → You may choose any of the top 3 cards

- Move sequences within tableau allowed

- Win when all cards reach foundation

### ♻️ Undo / Redo

Game state stored after every valid move

- Undo → Restore previous state

- Redo → Re-apply undone state

### 💡 Hint System

Highlights a valid next move when the player is stuck

### 📸 Screenshots 

![Gameplay](./screenshots/gameplay.png)

![Win Screen](./screenshots/win.png)
![Hint Detection](./screenshots/hint.png)
![Drag and Drop](./screenshots/drag.png)

### Testing

- Move validation
- Tableau ↔ Foundation rules
- Waste top-3 selection
- Undo / Redo state recovery
- Win detection
- Hint suggestions
- Stock recycling

### 🏁 Results

- Fully playable

- Valid rules enforced

- Undo / redo functional

- Hint system available

- Smooth user experience

### 🔮 Future Improvements

- Auto-solve

- Mobile support

- Save game

- Advanced hint logic

### 📚 References

https://solitaired.com
 — gameplay reference

https://www.npmjs.com/package/@heruka_urgyen/react-playing-cards 

### 👤 Author

Name: Abdullah Amir

Course: CSC200 – Data Structures & Algorithms

Instructor: Nazeef-ul-Haq