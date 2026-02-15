import React from "react";
import { useDraggable } from "@dnd-kit/core";
import Card from "@heruka_urgyen/react-playing-cards";

export default function DraggableCard({ card, origin, highlight }) {
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
    cursor: card.faceUp ? "grab" : "default",

    touchAction: "none", // Prevents the browser from handling touch events
    userSelect: "none",  // Prevents text selection during drag
    WebkitUserSelect: "none",

    transition: isDragging ? "none" : "box-shadow 0.3s ease, transform 0.2s ease",
    boxShadow: highlight
      ? "0 0 15px 5px rgba(255, 255, 0, 0.8)" // yellow glow for hint
      : "none",
    borderRadius: "8px",
  };

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes} className="w-full">
      <Card
        card={card.faceUp ? card.toString() : "back"}
        deckType="basic"
        // Use a responsive height or "100%" to let the parent control it
        height="100%"
        back={!card.faceUp}
        className="rounded-lg shadow-md"
      />
    </div>
  );
}
