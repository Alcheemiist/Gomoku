import React from 'react';
import { ChevronLeft, ChevronRight, RotateCcw, History } from 'lucide-react';

interface Move {
  position: [number, number];
  player: number;
  turn: number;
  timestamp: number;
}

interface MoveHistoryProps {
  moves: Move[];
  currentMoveIndex: number;
  onMoveTo: (index: number) => void;
  onReset: () => void;
  className?: string;
}

export default function MoveHistory({ 
  moves, 
  currentMoveIndex, 
  onMoveTo, 
  onReset, 
  className = '' 
}: MoveHistoryProps) {
  const canGoBack = currentMoveIndex > 0;
  const canGoForward = currentMoveIndex < moves.length - 1;

  const handlePreviousMove = () => {
    if (canGoBack) {
      onMoveTo(currentMoveIndex - 1);
    }
  };

  const handleNextMove = () => {
    if (canGoForward) {
      onMoveTo(currentMoveIndex + 1);
    }
  };

  const handleGoToStart = () => {
    onMoveTo(0);
  };

  const handleGoToEnd = () => {
    onMoveTo(moves.length - 1);
  };

  return (
    <div className={`glass-effect p-4 rounded-lg border border-white/20 shadow-xl ${className}`}>
      <div className="flex items-center gap-2 mb-4">
        <History className="w-5 h-5 text-indigo-400" />
        <h3 className="text-white font-semibold">Move History</h3>
        <span className="text-white/60 text-sm ml-auto">
          {currentMoveIndex + 1} / {moves.length}
        </span>
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <button
            onClick={handleGoToStart}
            disabled={!canGoBack}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            title="Go to start"
          >
            <RotateCcw className="w-4 h-4 text-white" />
          </button>
          
          <button
            onClick={handlePreviousMove}
            disabled={!canGoBack}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            title="Previous move"
          >
            <ChevronLeft className="w-4 h-4 text-white" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleNextMove}
            disabled={!canGoForward}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            title="Next move"
          >
            <ChevronRight className="w-4 h-4 text-white" />
          </button>
          
          <button
            onClick={onReset}
            className="p-2 rounded-lg bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-400/30 transition-all duration-200"
            title="Reset to current game"
          >
            <RotateCcw className="w-4 h-4 text-indigo-300" />
          </button>
        </div>
      </div>

      {/* Move List */}
      <div className="max-h-48 overflow-y-auto space-y-2">
        {moves.map((move, index) => (
          <div
            key={index}
            className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-all duration-200 ${
              index === currentMoveIndex
                ? 'bg-indigo-500/30 border border-indigo-400/50'
                : 'bg-white/5 hover:bg-white/10'
            }`}
            onClick={() => onMoveTo(index)}
          >
            <div className="flex items-center gap-3">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                move.player === 1 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-red-500 text-white'
              }`}>
                {move.player}
              </div>
              <div>
                <span className="text-white text-sm">
                  Turn {move.turn}
                </span>
                <div className="text-white/60 text-xs">
                  ({move.position[0] + 1}, {move.position[1] + 1})
                </div>
              </div>
            </div>
            
            <div className="text-white/40 text-xs">
              {new Date(move.timestamp).toLocaleTimeString()}
            </div>
          </div>
        ))}
      </div>

      {/* Current Position Info */}
      {moves.length > 0 && (
        <div className="mt-4 p-3 bg-white/5 rounded-lg border border-white/10">
          <div className="text-white/80 text-sm">
            <span className="font-semibold">Current Position:</span>
            <span className="ml-2">
              {moves[currentMoveIndex] ? 
                `Turn ${moves[currentMoveIndex].turn} - Player ${moves[currentMoveIndex].player} at (${moves[currentMoveIndex].position[0] + 1}, ${moves[currentMoveIndex].position[1] + 1})` :
                'Game Start'
              }
            </span>
          </div>
        </div>
      )}
    </div>
  );
}