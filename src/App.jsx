import { useState, useEffect } from 'react'
import './App.css'
import GameLogic from './game/GameLogic'
import LinkedList from './dataStructures/LinkedList'
import Stack from './dataStructures/Stack'
import Queue from './dataStructures/Queue'
import Card from '@heruka_urgyen/react-playing-cards'
import SolitaireBoard from './components/SolitaireBoard'
import Header from './components/Header.jsx'
import Balatro from './components/Balatro/Balatro.jsx';
import { balatroThemes } from './components/Balatro/BalatroPreset.jsx'

function App() {
  const [game] = useState(() => {
    const g = new GameLogic();
    g.initializeGame(LinkedList, Stack, Queue);
    return g;
  });

  const themeKeys = Object.keys(balatroThemes);
  const [themeIndex, setThemeIndex] = useState(0);

  const currentTheme = balatroThemes[themeKeys[themeIndex]];

  const handleThemeChange = () => {
    setThemeIndex((prev) => (prev + 1) % themeKeys.length);
  };

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
          color1={currentTheme.color1}
          color2={currentTheme.color2}
          color3={currentTheme.color3}
          isRotate={false}
          mouseInteraction={false}
          pixelFilter={2000}
        />
        <div className="absolute inset-0  text-white p-6">
          <Header onThemeChange={handleThemeChange} />
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
