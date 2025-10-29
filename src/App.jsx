import { useState, useEffect } from 'react'
import './App.css'
import GameLogic from './game/GameLogic'
import LinkedList from './dataStructures/LinkedList'
import Stack from './dataStructures/Stack'
import Queue from './dataStructures/Queue'

function App() {
  const [game] = useState(() => {
    const g = new GameLogic();
    g.initializeGame(LinkedList, Stack, Queue);
    return g;
  });

  useEffect(() => {
    console.log("=== Initial Game State ===");
    console.log("Tableau:", game.tableau);
    console.log("Stock:", game.stock);
    console.log("Foundation:", game.foundations);

    // Example test 1: Draw from stock
    console.log("\n--- Drawing from stock ---");
    game.drawFromStock();
    console.log("Waste pile:", game.waste);
    game.drawFromStock();
    console.log("Waste pile:", game.waste);

    // Example test 2: Try moving multiple cards within tableau
    console.log("\n--- Move Multiple Cards Test ---");
    const src = game.tableau[1];
    const dst = game.tableau[0];
    let clickedNode = src.getHead();
    const clickedCard = clickedNode ? clickedNode.data : null;
    if (clickedCard) {
      console.log("Before move:", game.tableau[1]);
      console.log("Before move:", game.tableau[0]);
      const ok = game.moveMultipleCardWithinTableau(src, dst, clickedCard);
      console.log("After move:", game.tableau[1]);
      console.log("After move:", game.tableau[0]);
      console.log("Multi-card move result:", ok);
    }
    console.log("Updated tableau:", game.tableau);

    // Example test 3: Print a specific pile
    console.log("\n--- Display first tableau pile ---");
    game.tableau[0].displayList();

  }, [game]);

  return (
    <>
      <div>Solitaire Console Testing</div>
    </>
  );
}

export default App;
