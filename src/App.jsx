import { useState, useEffect } from 'react'
import './App.css'
import GameLogic from './game/GameLogic'
import LinkedList from './dataStructures/LinkedList'
import Stack from './dataStructures/Stack'
import Queue from './dataStructures/Queue'
import Card from '@heruka_urgyen/react-playing-cards'
import SolitaireBoard from './components/SolitaireBoard'
import Header from './components/Header.jsx'
import Balatro from './components/Balatro/Balatro.jsx';;


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
    game.logCardMap();

  }, [game]);

  return (
    <>
      <div className="relative w-screen h-screen overflow-hidden bg-black">
        <Balatro
          isRotate={false}
          mouseInteraction={false}
          pixelFilter={2000}
        />
        <div className="absolute inset-0  text-white p-6">
          <Header />
          {/* <h1 className="text-3xl font-bold  text-center drop-shadow-lg">
            Solitaire Klondike
          </h1> */}
          <div className="mt-8">
            <SolitaireBoard game={game} />
          </div>
        </div>
      </div>

    </>
  );
}

export default App;
