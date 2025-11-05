import { useState, useEffect, useRef } from 'react'
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

  const [resetTimerSignal, setResetTimerSignal] = useState(0); // for resetting timer upon new game

  //--------------- Score Chart --------------- 
  // to Foundation +10
  // within tableau movement +5
  // flip facedown card +5
  // draw from stock -1
  // use hint -5 

  const [score, setScore] = useState(0); // for game score
  function handleScore(change) {
    setScore(prev => prev + change);
  }
  const [game, setGame] = useState(() => { // for game state


    const g = new GameLogic(handleScore);
    g.initializeGame(LinkedList, Stack, Queue);
    return g;
  });

  const newGame = () => {    // when button is pressed .... new game state
    const g = new GameLogic(handleScore);
    g.initializeGame(LinkedList, Stack, Queue);
    setGame(g);

    setScore(0);
    setResetTimerSignal(s => s + 1); // it will notify the header
  };

  const themeKeys = Object.keys(balatroThemes);
  const [themeIndex, setThemeIndex] = useState(0);
  const boardRef = useRef(); // create a ref


  const currentTheme = balatroThemes[themeKeys[themeIndex]];

  const handleThemeChange = () => {
    setThemeIndex((prev) => (prev + 1) % themeKeys.length);
  };


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
          <Header onThemeChange={handleThemeChange} onNewGame={newGame} resetTimerSignal={resetTimerSignal} score={score} onHint={() => boardRef.current.showHint()} />

          <div className="mt-8">
            <SolitaireBoard game={game} ref={boardRef} />
          </div>
        </div>
      </div>

    </>
  );
}

export default App;
