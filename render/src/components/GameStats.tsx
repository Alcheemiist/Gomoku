import React from 'react';
import { BarChart3, Clock, Target, Trophy } from 'lucide-react';

interface GameStatsProps {
  totalMoves: number;
  gameTime: number;
  currentPlayer: number;
  player1Captured: number;
  player2Captured: number;
  className?: string;
}

export default function GameStats({ 
  totalMoves, 
  gameTime, 
  currentPlayer, 
  player1Captured, 
  player2Captured,
  className = ''
}: GameStatsProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`glass-effect p-4 rounded-lg ${className}`}>
      <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
        <BarChart3 className="w-5 h-5" />
        Game Statistics
      </h3>
      
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="flex items-center gap-2 text-white/80">
          <Clock className="w-4 h-4" />
          <span>Time: {formatTime(gameTime)}</span>
        </div>
        
        <div className="flex items-center gap-2 text-white/80">
          <Target className="w-4 h-4" />
          <span>Moves: {totalMoves}</span>
        </div>
        
        <div className="flex items-center gap-2 text-white/80">
          <Trophy className="w-4 h-4" />
          <span>P1 Captured: {player1Captured}</span>
        </div>
        
        <div className="flex items-center gap-2 text-white/80">
          <Trophy className="w-4 h-4" />
          <span>P2 Captured: {player2Captured}</span>
        </div>
      </div>
      
      <div className="mt-3 pt-3 border-t border-white/10">
        <div className="flex items-center gap-2 text-white/70 text-xs">
          <div className={`w-2 h-2 rounded-full ${currentPlayer === 1 ? 'bg-black' : 'bg-white border border-gray-400'}`}></div>
          <span>Current Turn: Player {currentPlayer}</span>
        </div>
      </div>
    </div>
  );
}
