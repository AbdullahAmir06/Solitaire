import { useState, useEffect } from "react";
import { Undo2, Redo2, Lightbulb, RefreshCw, Palette } from "lucide-react";

export default function Header({ onNewGame, onUndo, onRedo, onHint, onThemeChange, resetTimerSignal,score }) {
    const [time, setTime] = useState(0);
    // let score = 0;
    useEffect(() => {
        const interval = setInterval(() => setTime(t => t + 1), 1000);
        return () => clearInterval(interval);
    }, []);


    // reset timer when resetTimerSignal changes
    useEffect(() => {
        setTime(0);
    }, [resetTimerSignal]);


    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    };

    return (
        <header
            className="
        fixed top-0 left-0 w-full z-50
        flex items-center justify-center
        px-6 py-3  
        backdrop-blur-md
        bg-black/40 text-white
        shadow-md rounded-b-2xl
        transition-all duration-300
      "
        >
            {/* Left: Game Title */}
            <div className="absolute left-6 flex items-center">
                <h1 className="text-2xl font-bold tracking-wide drop-shadow-lg">
                    ♠ Solitaire
                </h1>
            </div>

            {/* Middle: Controls */}
            <div className="flex items-center gap-3">
                <button
                    onClick={onNewGame}
                    className="px-3 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg shadow-sm flex items-center gap-1 transition"
                >
                    <RefreshCw size={16} /> New Game
                </button>
                <button
                    onClick={onUndo}
                    className="p-2 bg-white/20 hover:bg-white/10 rounded-lg shadow-sm transition"
                >
                    <Undo2 size={18} />
                </button>
                <button
                    onClick={onRedo}
                    className="p-2 bg-white/20 hover:bg-white/10 rounded-lg shadow-sm transition"
                >
                    <Redo2 size={18} />
                </button>
                <button
                    onClick={onHint}
                    className="p-2 bg-yellow-400/70 hover:bg-yellow-400 rounded-lg shadow-sm transition"
                >
                    <Lightbulb size={18} />
                </button>
            </div>

            {/* Right: Timer + Theme Button */}
            <div className="absolute right-6 flex items-center gap-4">
                <span className="font-mono text-lg drop-shadow-md">{formatTime(time)}</span>
                <span className="font-mono text-lg drop-shadow-md">Score: {score}</span>
                <button
                    onClick={onThemeChange}
                    className="p-2 bg-white/20 hover:bg-white/10 rounded-lg shadow-sm transition"
                >
                    <Palette size={18} />
                </button>
            </div>

        </header>
    );
}
