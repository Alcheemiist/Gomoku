import React from 'react';
import { Timer, User, HelpCircle } from 'lucide-react';

interface PlayerInfoProps {
  name: string;
  captured: number;
  time: number;
  isCurrentTurn: boolean;
  showHints: boolean;
  onToggleHints: () => void;
  hideHints?: boolean;
}

export default function PlayerInfo({ 
  name, 
  captured, 
  time, 
  isCurrentTurn,
  showHints,
  onToggleHints,
  hideHints = false
}: PlayerInfoProps) {
  const seconds = Math.floor(time);
  const milliseconds = Math.floor((time % 1) * 100);

  return (
    <div className={`glass-effect p-6 rounded-lg shadow-lg transition-all duration-300 hover-lift min-h-[200px] flex flex-col ${
      isCurrentTurn 
        ? 'bg-indigo-500/20 border-indigo-400/30 ring-2 ring-indigo-400/20' 
        : 'bg-white/5 border-white/10'
    }`}>
      <div className="flex items-center gap-3 mb-4">
        <div className={`p-2 rounded-full transition-all duration-300 ${
          isCurrentTurn ? 'bg-indigo-500/20' : 'bg-white/10'
        }`}>
          <User className={`w-6 h-6 transition-colors duration-300 ${
            isCurrentTurn ? 'text-indigo-300' : 'text-white/70'
          }`} />
        </div>
        <h3 className={`text-xl font-bold transition-colors duration-300 ${
          isCurrentTurn ? 'text-white' : 'text-white/80'
        }`}>{name}</h3>
      </div>
      <div className="space-y-3 flex-1">
        <div className="flex items-center gap-2">
          <Timer className={`w-5 h-5 transition-colors duration-300 ${
            isCurrentTurn ? 'text-indigo-300' : 'text-white/60'
          }`} />
          <span className={`text-lg font-mono transition-colors duration-300 ${
            isCurrentTurn ? 'text-white' : 'text-white/80'
          }`}>
            {String(seconds).padStart(2, '0')}<span className="text-sm">.{String(milliseconds).padStart(2, '0')}</span>
          </span>
        </div>
        <div className={`text-sm transition-colors duration-300 ${
          isCurrentTurn ? 'text-white/80' : 'text-white/60'
        }`}>
          Captured: <span className={`font-bold transition-colors duration-300 ${
            isCurrentTurn ? 'text-indigo-300' : 'text-white/80'
          }`}>{captured}</span>
        </div>
        <div className="flex items-center gap-2 mt-3">
          {isCurrentTurn && !hideHints ? (
            <button
              onClick={onToggleHints}
              className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium transition-all duration-300 hover-lift ${
                showHints 
                  ? 'bg-indigo-500/30 text-indigo-200 border border-indigo-400/30' 
                  : 'bg-white/10 text-white/70 border border-white/20 hover:bg-white/20'
              }`}
            >
              <HelpCircle className="w-4 h-4" />
              Hints: {showHints ? 'ON' : 'OFF'}
            </button>
          ) : (
            <div className="h-8"></div>
          )}
        </div>
      </div>
    </div>
  );
}