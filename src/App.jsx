import { useState } from 'react'
import './App.css'
import GameLogic from './game/GameLogic'
import LinkedList from './dataStructures/LinkedList'
import Stack from './dataStructures/Stack'
import Queue from './dataStructures/Queue'


function App() {
  // const [count, setCount] = useState(0)
  const game = new GameLogic();
  game.initializeGame(LinkedList,Stack,Queue);
  console.log(game.tableau);
  console.log(game.stock);
  console.log("App rendered");


  return (
    <>
      <div>Solitaire</div>
    </>
  )
}

export default App
