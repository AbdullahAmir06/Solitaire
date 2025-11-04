// DroppablePile.jsx
import React from "react";
import { useDroppable } from "@dnd-kit/core";

export default function DroppablePile({ id, children, pile = [] }) {
    const { setNodeRef, isOver } = useDroppable({ id });

    const cardHeight = 140;
    const baseSpacing = 25;
    const maxPileHeight = 350;

    // Calculate the dynamic spacing
    const totalHeight = cardHeight + (pile.length - 1) * baseSpacing;
    const spacing =
        totalHeight > maxPileHeight
            ? (maxPileHeight - cardHeight) / (pile.length - 1 || 1)
            : baseSpacing;

    // Dynamic height of the droppable zone
    const pileHeight = pile.length > 0
        ? cardHeight + (pile.length - 1) * spacing
        : cardHeight;

    const bgColor = isOver ? "bg-green-600/40" : "bg-gray-600/40";


    return (
        <div
            ref={setNodeRef}
            className={`relative w-[100px] rounded-lg transition-all duration-300 ${bgColor}`}
            style={{
                height: pileHeight
                // height: pile.length > 0 ? 140 + (pile.length - 1) * 25 : 140,
            }}
        >
            {children}
        </div>
    );
}
