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
import { tr } from "framer-motion/client";

const game = new GameLogic();

export default function SolitaireBoard({ game }) {
  const [update, setUpdate] = useState(false);
  const rerender = () => setUpdate(!update);

  if (!game.deck.length) {
    game.initializeGame(LinkedList, Stack, Queue);
  }


  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over) return;

    const draggedCard = active.data.current.card;
    const from = active.data.current.origin;
    const to = over.id;

    // Example logic
    if (to.startsWith("tableau")) {
      game.moveCardToTableau(
        getPileByOrigin(from),
        game.tableau[parseInt(to.replace("tableau-", ""))]
      );
    } else if (to.startsWith("foundation")) {
      game.moveCardToFoundation(
        getPileByOrigin(from),
        Object.values(game.foundations)[parseInt(to.replace("foundation-", ""))]
      );
    }

    rerender();
  };

  const getPileByOrigin = (origin) => {
    if (origin.startsWith("tableau")) {
      return game.tableau[parseInt(origin.replace("tableau-", ""))];
    } else if (origin === "waste") {
      return game.waste;
    }
    return null;
  };

  return (<DndContext onDragEnd={handleDragEnd}>
    <div className="text-white p-4">
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
              <div className="text-sm text-gray-400">REDEAL</div>
            )}
          </div>

          {/* Waste Pile */}
          {game.waste.length > 0 && (
            <div
              id="waste"
              className="relative w-[160px] h-[140px] bg-gray-600/70 rounded-lg flex items-center justify-center cursor-grab select-none"
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
          {Object.keys(game.foundations).map((suit, i) => {
            const pile = game.foundations[suit].toArray();
            const topCard = pile[pile.length - 1];
            return (
              <DroppablePile key={i} id={`foundation-${i}`}>
                <div className="w-[100px] h-[140px] flex items-center justify-center">
                  {topCard ? (
                    <Card card={topCard.toString()} deckType="basic" height="140px" />
                  ) : (
                    <span className="text-gray-400">Empty</span>
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
          <DroppablePile key={i} id={`tableau-${i}`}>
            {pile.toArray().map((card, j) => (
              <div
                key={j}
                className="absolute"
                style={{ top: `${j * 25}px` }}
              >
                {/* <div style={{ perspective: "1000px" }}> */}
                {/* <motion.div
                    key={j}
                    initial={{ rotateY: 180 }}
                    animate={{ rotateY: card.faceUp ? 0 : 180 }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                    whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    style={{
                      transformStyle: "preserve-3d",
                      position: "relative",
                      width: "100px",
                      height: "140px",
                    }}
                  > */}
                <DraggableCard
                  id={`tableau-${i}-${j}`}
                  card={card}
                  origin={`tableau-${i}`}
                />
                {/* </motion.div> */}
                {/* </div> */}
              </div>
            ))}
          </DroppablePile>
        ))}
      </div>
    </div>
  </DndContext>
  )
}
