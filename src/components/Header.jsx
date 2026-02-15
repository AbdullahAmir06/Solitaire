import { useState, useEffect } from "react";
import { Undo2, Redo2, Lightbulb, RefreshCw, Palette } from "lucide-react";

export default function Header({ onNewGame, onUndo, onRedo, canUndo, canRedo, onHint, onThemeChange, resetTimerSignal, score }) {
    const [time, setTime] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => setTime(t => t + 1), 1000);
        return () => clearInterval(interval);
    }, []);

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
                flex flex-col md:flex-row items-center justify-between
                px-4 md:px-6 py-2 md:py-3  
                backdrop-blur-md
                bg-black/60 text-white
                shadow-md rounded-b-xl md:rounded-b-2xl
                transition-all duration-300
                gap-2 md:gap-0
            "
        >
            {/* Top Row on Mobile / Left on Desktop: Title and Stats */}
            <div className="flex w-full md:w-auto items-center justify-between md:justify-start gap-4">
                <h1 className="text-xl md:text-2xl font-bold tracking-wide drop-shadow-lg flex items-center gap-1">
                    <span className="hidden xs:inline">♠</span> Solitaire
                </h1>
                
                {/* Stats moved here for mobile visibility */}
                <div className="flex items-center gap-3 md:hidden">
                    <span className="font-mono text-sm bg-white/10 px-2 py-1 rounded">{formatTime(time)}</span>
                    <span className="font-mono text-sm bg-white/10 px-2 py-1 rounded">pts: {score}</span>
                </div>
            </div>

            {/* Middle: Controls (Scrollable horizontally if screen is tiny) */}
            <div className="flex items-center gap-2 md:gap-3 overflow-x-auto no-scrollbar">
                <button
                    onClick={onNewGame}
                    className="whitespace-nowrap px-2 md:px-3 py-1 bg-emerald-700 hover:bg-emerald-800 text-white text-xs md:text-sm rounded-lg shadow-sm flex items-center gap-1 transition"
                >
                    <RefreshCw size={14} className="md:w-4 md:h-4" /> New
                </button>
                <div className="flex items-center gap-1 bg-white/5 p-1 rounded-lg">
                    <button
                        onClick={onUndo}
                        disabled={!canUndo}
                        className="p-1.5 md:p-2 hover:bg-white/10 rounded-md disabled:opacity-30 transition"
                    >
                        <Undo2 size={16} />
                    </button>
                    <button
                        onClick={onRedo}
                        disabled={!canRedo}
                        className="p-1.5 md:p-2 hover:bg-white/10 rounded-md disabled:opacity-30 transition"
                    >
                        <Redo2 size={16} />
                    </button>
                </div>
                <button
                    onClick={onHint}
                    className="p-1.5 md:p-2 bg-yellow-400/60 hover:bg-yellow-400 text-black md:text-inherit rounded-lg transition"
                >
                    <Lightbulb size={16} />
                </button>
                <button
                    onClick={onThemeChange}
                    className="p-1.5 md:p-2 bg-white/10 hover:bg-white/20 rounded-lg transition"
                >
                    <Palette size={16} />
                </button>
            </div>

            {/* Right: Desktop Stats (Hidden on Mobile) */}
            <div className="hidden md:flex items-center gap-4">
                <div className="flex flex-col items-end">
                    <span className="font-mono text-sm opacity-70">TIME</span>
                    <span className="font-mono text-lg leading-none">{formatTime(time)}</span>
                </div>
                <div className="h-8 w-[1px] bg-white/20 mx-1"></div>
                <div className="flex flex-col items-start">
                    <span className="font-mono text-sm opacity-70">SCORE</span>
                    <span className="font-mono text-lg leading-none">{score}</span>
                </div>
            </div>
        </header>
    );
}