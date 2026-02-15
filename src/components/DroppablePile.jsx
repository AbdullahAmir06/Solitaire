// DroppablePile.jsx
import React from "react";
import { useDroppable } from "@dnd-kit/core";

export default function DroppablePile({ id, children, pile = [] }) {
    const { setNodeRef, isOver } = useDroppable({ id });

    // Switch from fixed pixels to relative percentages or REMs
    const baseSpacing = 20; // Slightly tighter for mobile
    const spacing = pile.length > 10 ? 15 : baseSpacing; 

    const bgColor = isOver ? "bg-green-600/40" : "bg-gray-600/40";

    return (
        <div
            ref={setNodeRef}
            // Use w-full with a max-width, and aspect-ratio to maintain card shape
            className={`relative w-full max-w-[100px] aspect-[2/3] rounded-lg transition-all duration-300 ${bgColor}`}
        >
            {children}
        </div>
    );
}