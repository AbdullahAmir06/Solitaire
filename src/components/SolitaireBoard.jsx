import {
  DndContext,
  TouchSensor,
  MouseSensor,
  PointerSensor,
  useSensor,
  useSensors
} from "@dnd-kit/core";
import React, { useState, useRef, act, useImperativeHandle, forwardRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Card from "@heruka_urgyen/react-playing-cards";
import GameLogic from './../game/GameLogic.js';
import LinkedList from "../dataStructures/LinkedList";
import Stack from "../dataStructures/Stack";
import Queue from "../dataStructures/Queue";
// import { DndContext } from "@dnd-kit/core";
import DraggableCard from "./DraggableCard.jsx";
import DroppablePile from "./DroppablePile.jsx";
import Confetti from "react-confetti";
import { tr } from "framer-motion/client";
import { RefreshCw, Layers } from "lucide-react";


// Forward ref so parent can call showHint()
const SolitaireBoard = forwardRef(({ game, popupColor, lightTheme }, ref) => {
  const [update, setUpdate] = useState(false);
  const rerender = () => setUpdate(!update); // to trigger UI update
  const [hasWon, setHasWon] = useState(false); // to trigger Congrats Window
  const [hintResult, setHintResult] = useState(null); // card to move
  const [highlightedTopCard, setHighlightedTopCard] = useState(null); // top card of target pile
  const [stockHighlight, setStockHighlight] = useState(false); // highlight the stock pile
  const { color1, color2, color3 } = popupColor; // for Congrats UI text color 

const mouseSensor = useSensor(MouseSensor);
  const touchSensor = useSensor(TouchSensor, {
    // Press and hold for 250ms or move 5px to start dragging
    // This prevents accidental drags when trying to scroll the page
    activationConstraint: {
      delay: 250,
      tolerance: 5,
    },
  });

  const sensors = useSensors(mouseSensor, touchSensor);


  // Expose showHint to parent via ref
  useImperativeHandle(ref, () => ({
    showHint: () => {
      const hint = game.hint(); // returns { card, fromPile, toPile }

      if (hint) {
        if (hint.fromPile.type === "waste" && !hint.card.faceUp) {
          setStockHighlight(true);     // highlight stock instead
        } else {
          setHintResult(hint.card);    // highlight the waste card or other cards
        }



        // Determine top card of the target pile
        let toCard = null;
        if (hint.toPile.type === "foundation") {
          const pileArray = game.foundations[hint.toPile.suit].toArray();
          toCard = pileArray[0]; // top card of foundation
        } else if (hint.toPile.type === "tableau") {
          const pileArray = game.tableau[hint.toPile.index].toArray();
          toCard = pileArray[0]; // top card of tableau
        }

        setHighlightedTopCard(toCard);
      } else {
        // No moves possible → highlight stock pile
        setHintResult(null);
        setHighlightedTopCard(null);
        setStockHighlight(true);
      }

      // Remove highlights after 2 seconds
      setTimeout(() => {
        setHintResult(null);
        setHighlightedTopCard(null);
        setStockHighlight(false);
      }, 2000);
    }
  }));


  if (!game.deck.length) {
    game.initializeGame(LinkedList, Stack, Queue);
  }

  // function to handle the drag i.e where the card will be dropped so we can find the target pile
  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over) return;

    const draggedCard = active.data.current.card; // the card being dragged
    const from = active.data.current.origin; // source pile of card
    const to = over.id; // where the card is dropped

    console.log("From pile type:", getPileByOrigin(from));
    console.log("To pile Tableau:", game.tableau[parseInt(to.replace("tableau-", ""))]);
    console.log("To pile Foundation:", getFoundationPile(to));

    // Case 1: If card dropped from foundation to Tableau
    if (from.startsWith("foundation") && to.startsWith("tableau")) {
      const sourcePile = getFoundationPile(from);
      const targetPile = game.tableau[parseInt(to.replace("tableau-", ""))];
      game.FromFoundationCardToTableau(sourcePile, targetPile);
      rerender();
      return;
    }

    // Case 2: If card is dragged from waste pile to foundation or tableau
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

    // Case 3: If card is dropped to tableau
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



  return (<DndContext sensors={sensors} onDragEnd={handleDragEnd}>
    <div className="text-white pt-2 pb-10 px-4 min-h-screen w-full max-w-7xl mx-auto">

      {/* Stock + Waste */}
      <div className="flex flex-col sm:flex-row justify-between items-center sm:items-start gap-6 mb-12">
        <div className="flex gap-16">

          {/* Stock Pile */}
          <div
            id="stock"
            onClick={() => {
              if (game.stock.size() === 0) game.recycleWasteToStock(new Queue());
              else game.drawFromStock();
              rerender();
            }}
            className="w-16 h-24 sm:w-24 sm:h-36 bg-gray-700/70 rounded-lg flex items-center justify-center cursor-pointer" style={{
              boxShadow: stockHighlight
                ? "0 0 15px 5px rgba(255, 255, 0, 0.8)" // yellow glow
                : "none"
            }}
          >
            {game.stock.size() > 0 ? (
              <Card card="back" deckType="basic" height="100%" back />
            ) : (
              <div className="text-sm flex flex-col gap-2 items-center justify-center text-gray-400">
                <RefreshCw size={40} /> REDEAL
              </div>
            )}
          </div>


          {/* Waste Pile */}
          {/* Waste Pile */}
          {game.waste.length > 0 && (
            <div
              id="waste"
              // Remove fixed width/height; use responsive classes
              className="relative w-24 h-32 sm:w-28 sm:h-40 bg-transparent flex items-center justify-start"
            >
              <AnimatePresence>
                {game.waste.slice(-3).map((card, i) => (
                  <motion.div
                    key={card.toString() + "-" + card.faceUp}
                    // Simplify motion: only animate opacity and scale to prevent "jumping"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.2 }}
                    className="absolute"
                    // Use a smaller, consistent overlap (e.g., 20px or 25px)
                    style={{
                      left: `${i * 25}px`,
                      zIndex: i + 1,
                      width: '100%',
                      height: '100%'
                    }}
                  >
                    <DraggableCard
                      card={card}
                      origin="waste"
                      highlight={(hintResult && hintResult.rank === card.rank && hintResult.suit === card.suit) || (highlightedTopCard && highlightedTopCard.rank === card.rank && highlightedTopCard.suit === card.suit)}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}

        </div>

        {/* Foundations */}
        <div className="grid grid-cols-4 gap-2 sm:gap-4">
          {Object.keys(game.foundations).map((suit, i) => {
            const pile = game.foundations[suit].toArray();
            const topCard = pile[0];
            return (
              <DroppablePile key={`foundation-${i}`} id={`foundation-${i}`} >
                {/* Added flex centering and h-full to make the placeholder center vertically */}
                <div className="w-14 h-20 sm:w-24 sm:h-36 flex items-center justify-center">
                  {topCard ? (
                    <DraggableCard
                      id={`foundation-${i}-top`}
                      card={topCard}
                      origin={`foundation-${i}`}
                      highlight={(hintResult && hintResult.rank === topCard.rank && hintResult.suit === topCard.suit) ||
                        (highlightedTopCard && highlightedTopCard.rank === topCard.rank && highlightedTopCard.suit === topCard.suit)}
                    />
                  ) : (
                    /* Removed flex-col to keep the icon perfectly centered without extra spacing */
                    <span className="flex items-center justify-center text-gray-400">
                      <Layers size={30} />
                    </span>
                  )}
                </div>
              </DroppablePile>
            );
          })}
        </div>
      </div>

      {/* Tableau */}
      <div className="grid grid-cols-7 gap-1 sm:gap-4 justify-items-center">
        {game.tableau.map((pile, i) => (
          <DroppablePile key={`tableau-${i}`} id={`tableau-${i}`} pile={pile.toArray()}>
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
                  key={`tableau-${i}-${j}`}
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
                    highlight={
                      (hintResult && hintResult.rank === card.rank && hintResult.suit === card.suit) ||
                      (highlightedTopCard && highlightedTopCard.rank === card.rank && highlightedTopCard.suit === card.suit)
                    }

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
            style={{
              background: `
              linear-gradient(
                135deg,
                ${color1},
                ${color2},
                ${color3})`,
              color: lightTheme ? "black" : "white",
            }}
            className="px-10 py-6 rounded-2xl text-3xl font-bold shadow-xl"
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
  );
});

export default SolitaireBoard;