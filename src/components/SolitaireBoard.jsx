import React, { useState, useRef, act } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Card from "@heruka_urgyen/react-playing-cards";
import GameLogic from './../game/GameLogic.js';
import LinkedList from "../dataStructures/LinkedList";
import Stack from "../dataStructures/Stack";
import Queue from "../dataStructures/Queue";
import { DndContext } from "@dnd-kit/core";
import DraggableCard from "./DraggableCard.jsx";
import DroppablePile from "./DroppablePile.jsx";
import Confetti from "react-confetti";
import { tr } from "framer-motion/client";
import { RefreshCw, Layers } from "lucide-react";

const game = new GameLogic();

export default function SolitaireBoard({ game }) {
  const [update, setUpdate] = useState(false);
  const rerender = () => setUpdate(!update);
  const [draggedCards, setDraggedCards] = useState([]); // it is for the multiple dragging cards effect
  const [hasWon, setHasWon] = useState(false);


  if (!game.deck.length) {
    game.initializeGame(LinkedList, Stack, Queue);
  }


  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over) return;

    const draggedCard = active.data.current.card;
    const from = active.data.current.origin;
    const to = over.id;

    console.log("From pile type:", getPileByOrigin(from));
    console.log("To pile Tableau:", game.tableau[parseInt(to.replace("tableau-", ""))]);
    console.log("To pile Foundation:", getFoundationPile(to));


    if (from.startsWith("foundation") && to.startsWith("tableau")) {
      const sourcePile = getFoundationPile(from);
      const targetPile = game.tableau[parseInt(to.replace("tableau-", ""))];
      game.FromFoundationCardToTableau(sourcePile, targetPile);
      rerender();
      return;
    }

    if (from === "waste") {
      let indexFromTop = game.waste.length - 1 - game.waste.findIndex(c => c === draggedCard);
      let isFoundation = to.startsWith("foundation") ? true : false;
      let targetPile = isFoundation ? getFoundationPile(to) : game.tableau[parseInt(to.replace("tableau-", ""))];
      game.moveWasteCard(indexFromTop, targetPile, isFoundation);
      game.showTop3CardsFromWaste();
      rerender();
      if (game.checkWin()) {
        setHasWon(true);
      }

      return;
    }

    // Example logic
    if (to.startsWith("tableau")) {
      const sourcePile = getPileByOrigin(from);
      const targetPile = game.tableau[parseInt(to.replace("tableau-", ""))];

      // Determine if moving multiple cards
      let multipleCards = false;
      let node = sourcePile.head;
      let clickedCard = active.data.current.card;
      while (node && node.data !== clickedCard) {
        if (node.data.faceUp)
          multipleCards = true;
        node = node.next;
      }

      if (multipleCards) {
        game.moveMultipleCardWithinTableau(sourcePile, targetPile, clickedCard);
      } else {
        game.moveCardToTableau(sourcePile, targetPile);
      }

    } else if (to.startsWith("foundation")) {
      game.moveCardToFoundation(getPileByOrigin(from), getFoundationPile(to));
    }

    rerender();
    if (game.checkWin()) {
      setHasWon(true);
    }
  };

  const getPileByOrigin = (origin) => {
    if (origin.startsWith("tableau")) {
      return game.tableau[parseInt(origin.replace("tableau-", ""))];
    } else if (origin === "waste") {
      return game.waste;
    }
    return null;
  };

  const getFoundationPile = (id) => {
    const suitOrder = ["hearts", "diamonds", "clubs", "spades"];
    const index = parseInt(id.replace("foundation-", ""), 10);
    const suit = suitOrder[index];
    return game.foundations[suit];
  };

  // const forceWin = () => {
  //   const suits = ["hearts", "diamonds", "clubs", "spades"];
  //   const ranks = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

  //   suits.forEach((suit) => {
  //     const foundation = game.foundations[suit];
  //     foundation.head = null;
  //     // foundation._size = 0;

  //     ranks.forEach((rank) => {
  //       foundation.push({ rank, suit, toString: () => rank + suit[0].toLowerCase() });
  //     });
  //   });

  //   if (game.checkWin()) setHasWon(true);
  //   rerender();
  // };



  return (<DndContext onDragEnd={handleDragEnd}>
    <div className="text-white p-4">

      {/* //////////////////////////////////////////////////////// */}
      {/* <div className="flex justify-center mb-4">
        <button
          onClick={forceWin}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold"
        >
          Force Win (Test)
        </button>
      </div> */}

      {/* /////////////////////////////////////////////////////// */}

      {/* Stock + Waste */}
      <div className="flex justify-between mb-10 mr-36">
        <div className="flex gap-16">

          {/* Stock Pile */}
          <div
            id="stock"
            onClick={() => {
              if (game.stock.size() === 0) game.recycleWasteToStock(new Queue());
              else game.drawFromStock();
              rerender();
            }}
            className="w-[100px] h-[140px] bg-gray-700/70 rounded-lg flex items-center justify-center cursor-pointer select-none"
          >
            {game.stock.size() > 0 ? (
              <Card card="back" deckType="basic" height="140px" back />
            ) : (
              <div className="text-sm flex flex-col gap-2 items-center justify-center text-gray-400">
                <RefreshCw size={40} /> REDEAL</div>
            )}
          </div>

          {/* Waste Pile */}
          {game.waste.length > 0 && (
            <div
              id="waste"
              className="relative w-[160px] h-[140px] bg-transparent rounded-lg flex items-center justify-center cursor-grab select-none"
            >
              <AnimatePresence>
                {game.waste.slice(-3).map((card, i) => (
                  <motion.div
                    key={card.toString() + "-" + card.faceUp}
                    initial={{ x: -20 * (2 - i), opacity: 0, scale: 0.9 }}
                    animate={{ x: -20 * (2 - i), opacity: 1, scale: 1 }}
                    exit={{ x: -30, opacity: 0, scale: 0.8 }}
                    whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    transition={{ duration: 0.3, ease: "easeInOut", delay: i * 0.1 }}
                    className="absolute"
                    style={{ left: `${i * 30}px`, zIndex: i + 1 }}
                  >
                    <DraggableCard
                      id={`waste-${i}`}
                      card={card}
                      origin="waste"
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}

        </div>

        {/* Foundations */}
        <div className="flex gap-6">
          {Object.keys(game.foundations).map((suit, i) => { // it means my foundation-0 --> hearts and foundation-1 --> diamonds and foundation-2 --> clubs  and foundation-3 --> spades 
            const pile = game.foundations[suit].toArray();
            const topCard = pile[0];
            return (
              <DroppablePile key={i} id={`foundation-${i}`}>
                <div className="w-[100px] h-[140px] flex items-center justify-center">
                  {topCard ? (
                    // <Card card={topCard.toString()} deckType="basic" height="140px" />
                    <DraggableCard
                      id={`foundation-${i}-top`}
                      card={topCard}
                      origin={`foundation-${i}`}
                    />
                  ) : (
                    <span className="text-sm flex flex-col gap-2 items-center justify-center text-gray-400">
                      <Layers size={30} /></span>
                  )}
                </div>
              </DroppablePile>

            );
          })}
        </div>
      </div>

      {/* Tableau */}
      <div className="flex justify-center gap-6">
        {game.tableau.map((pile, i) => (
          <DroppablePile key={i} id={`tableau-${i}`} pile={pile.toArray()}>
            {(() => {
              const pileArray = pile.toArray().reverse();
              const maxPileHeight = 350; // available visual space (adjust based on layout)
              const cardHeight = 140;
              const baseSpacing = 25;
              const totalHeight = cardHeight + (pileArray.length - 1) * baseSpacing;

              // if totalHeight exceeds available space, compress spacing
              const spacing =
                totalHeight > maxPileHeight
                  ? (maxPileHeight - cardHeight) / (pileArray.length - 1)
                  : baseSpacing;

              return pileArray.map((card, j) => (
                <motion.div
                  key={j}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2, delay: j * 0.05 }}
                  style={{
                    position: "absolute",
                    top: `${j * spacing}px`,
                    left: 0,
                  }}
                >
                  <DraggableCard
                    id={`tableau-${i}-${j}`}
                    card={card}
                    origin={`tableau-${i}`}
                  // disabled={!card.faceUp}  // disable the card with face down
                  />
                </motion.div>
              ));
            })()}

          </DroppablePile>

        ))}
      </div>
    </div>
    {hasWon && (
      <>
        <Confetti friction={1} gravity={0.1} />
        <motion.div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
          <motion.div
            className="bg-stone-800 text-white px-10 py-6 rounded-2xl text-3xl font-bold shadow-xl"
            initial={{ scale: 0.5 }}
            animate={{ scale: 1.1 }}
            transition={{ type: "spring", stiffness: 120 }}
          >
            🎉 Congratulations! You Won! 🎉
          </motion.div>
        </motion.div>
      </>
    )}


  </DndContext>
  )
}
