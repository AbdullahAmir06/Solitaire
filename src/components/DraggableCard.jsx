import React from "react";
import { useDraggable } from "@dnd-kit/core";
import Card from "@heruka_urgyen/react-playing-cards";

export default function DraggableCard({ card, origin }) {
  // Only make draggable if card is face up
  const draggableProps = card.faceUp
    ? useDraggable({
        id: `${origin}-${card.toString()}`,
        data: { card, origin },
      })
    : {};

  const { attributes, listeners, setNodeRef, transform, isDragging } = draggableProps;

  const style = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    zIndex: isDragging ? 9999 : "auto",
    position: "relative",
    cursor: card.faceUp ? "grab" : "default", // optional visual cue
  };

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      <Card
        card={card.faceUp ? card.toString() : "back"}
        deckType="basic"
        height="140px"
        back={!card.faceUp}
      />
    </div>
  );
}
