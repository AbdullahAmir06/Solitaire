import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Card from "@heruka_urgyen/react-playing-cards";
import GameLogic from './../game/GameLogic.js';
import LinkedList from "../dataStructures/LinkedList";
import Stack from "../dataStructures/Stack";
import Queue from "../dataStructures/Queue";

const game = new GameLogic();


export default function SolitaireBoard({ game }) {

  const [update, setUpdate] = useState(false);
  if (!game.deck.length) {
    game.initializeGame(LinkedList, Stack, Queue);
  }

  const rerender = () => setUpdate(!update);

  const DrawStock = () => {
    game.drawFromStock();
    rerender();
  };

  const RecycleWaste = () => {
    game.recycleWasteToStock();
    rerender();
  };

  const MoveWasteToTableau = (indexFromTop, tableauIndex) => {
    game.moveWasteCard(indexFromTop, game.tableau[tableauIndex], false);
    rerender();
  }

  const MoveWasteToFoundation = (indexFromTop, foundationIndex) => {
    game.moveWasteCard(indexFromTop, game.foundations[foundationIndex], true);
    rerender();
  }

  return (
    <div className="text-white p-4">
      <div className="flex justify-between mb-10 mr-36">
        <div className="flex gap-16">
          {/* Stock Pile  */}
          <div id="stock"
            onClick={() => {
              if (game.stock.size() === 0) {
                game.recycleWasteToStock(new Queue());
              } else {
                game.drawFromStock();
              }
              rerender();
            }}

            className="w-[100px] h-[140px] bg-gray-700/70 rounded-lg flex items-center justify-center cursor-pointer select-none">
            {/* console.log("Stock size:", {game.stock.size()}, "Waste size:", {game.waste.length}); */}

            {game.stock.size() > 0 ? (<div className="w-[100px] h-[140px] bg-gray-700 rounded-lg flex items-center justify-center">
              <Card card="back" deckType="basic" height="140px" back />
            </div>
            ) : (<div className="w-[100px] h-[140px] bg-gray-900/40 rounded-lg flex items-center justify-center text-sm">
              REDEAL
            </div>
            )}
          </div>


          {/* Waste Pile */}
          {game.waste.length > 0 && (
            <div id="waste" className=" relative w-[160px] h-[140px] bg-gray-600/70 rounded-lg flex items-center justify-center cursor-pointer select-none">
              <AnimatePresence>
                {/* The first element of .slice(-3) → the oldest card (drawn earliest) and The last element of .slice(-3) → the topmost card (latest drawn) */}
                {game.waste.slice(-3).map((card, i) => (
                  <motion.div
                    key={card.toString() + "-" + card.faceUp}
                    initial={{ x: -20 * (2 - i), opacity: 0, scale: 0.9 }}
                    animate={{ x: -20 * (2 - i), opacity: 1, scale: 1 }}
                    exit={{ x: -30, opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.3, ease: "easeInOut", delay: i * 0.1 }}
                    className="absolute"
                    style={{ left: `${i * 30}px` }}
                  >
                    {card.faceUp ? (
                      <Card card={card.toString()} deckType="basic" height="140px" />
                    ) : (
                      <Card card={card.toString()} deckType="basic" height="140px" back={!card.faceUp} />
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

        <div className="flex gap-6">
          {Object.keys(game.foundations).map((suit, i) => {
            const pile = game.foundations[suit].toArray(); // convert stack to array
            const topCard = pile[pile.length - 1]; // top of the stack
            return (
              <div key={i} className="w-[100px] h-[140px] bg-gray-500/70 rounded-lg flex items-center justify-center cursor-pointer select-none">
                {topCard ? (
                  <Card card={topCard.toString()} deckType="basic" height="140px" />
                ) : (
                  <span className="text-gray-400">Empty</span>
                )}
              </div>
            );
          })}
        </div>

      </div>

      <div className="flex justify-center gap-6">
        {game.tableau.map((pile, i) => (
          <div key={i} className="relative w-[100px] cursor-pointer select-none">
            {pile.toArray().map((card, j) => (
              <div
                key={j}
                className="absolute"
                style={{ top: `${j * 25}px` }} // space between stacked cards
              >
                <div style={{ perspective: "1000px" }}>
                  <motion.div
                    key={j}
                    initial={{ rotateY: 180 }}
                    animate={{ rotateY: card.faceUp ? 0 : 180 }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                    style={{
                      transformStyle: "preserve-3d",
                      position: "relative",
                      width: "100px",
                      height: "140px",
                    }}

                    drag
                    dragConstraints={{ top: 0, left: 0, right: 0, bottom: 0 }} // optional: limits
                    dragElastic={0.2} // slight "stretchy" effect
                    onDragEnd={(event, info) => handleDrop(info.point, card, pileIndex)}

                  >
                    {card.faceUp ? (
                      <div
                        style={{
                          position: "absolute",
                          width: "100%",
                          height: "100%",
                          backfaceVisibility: "hidden",
                        }}
                      >
                        <Card card={card.toString()} deckType="basic" height="140px" />
                      </div>
                    ) : (
                      <div
                        style={{
                          position: "absolute",
                          width: "100%",
                          height: "100%",
                          transform: "rotateY(180deg)",
                          backfaceVisibility: "hidden",
                        }}
                      >
                        <Card card={card.toString()} deckType="basic" height="140px" back />
                      </div>
                    )}
                  </motion.div>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

    </div >

  )

}
