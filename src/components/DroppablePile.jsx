// DroppablePile.jsx
import React from "react";
import { useDroppable } from "@dnd-kit/core";

export default function DroppablePile({ id, children, pile = [] }) {
    const { setNodeRef, isOver } = useDroppable({ id });
    
    // console.log("height of ",{pile}," is ",pile.length > 0 ? 140 + (pile.length - 1) * 25 : 140);
    return (
        <div
            ref={setNodeRef}
            className={`relative w-[100px] rounded-lg transition-colors ${isOver ? "bg-green-600/40" : "bg-gray-600/40"
                }`}
            style={{
                height: pile.length > 0 ? 140 + (pile.length - 1) * 25 : 140,
            }}
        >
            {children}
        </div>
    );
}
