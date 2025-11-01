// DroppablePile.jsx
import React from "react";
import { useDroppable } from "@dnd-kit/core";

export default function DroppablePile({ id, children }) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={`relative w-[100px] min-h-[140px] rounded-lg transition-colors ${
        isOver ? "bg-green-600/40" : "bg-gray-600/40"
      }`}
    >
      {children}
    </div>
  );
}
