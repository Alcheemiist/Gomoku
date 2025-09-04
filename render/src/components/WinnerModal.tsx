import React, { useEffect, useState } from 'react';
import { Trophy, RotateCcw, Home, X, Star, Crown, Zap, Sparkles } from 'lucide-react';

interface WinnerModalProps {
  winner: string;
  onNewGame: () => void;
  onMainMenu: () => void;
  onClose: () => void;
}

export default function WinnerModal({ winner, onNewGame, onMainMenu, onClose }: WinnerModalProps) {
  const [showConfetti, setShowConfetti] = useState(false);
  const [isAIWinner, setIsAIWinner] = useState(false);

  useEffect(() => {
    // Trigger confetti animation
    setShowConfetti(true);
    setIsAIWinner(winner.toLowerCase().includes('ai') || winner.toLowerCase().includes('bot'));
    
    // Auto-hide confetti after animation
    const timer = setTimeout(() => setShowConfetti(false), 3000);
    return () => clearTimeout(timer);
  }, [winner]);

  const getWinnerIcon = () => {
    if (isAIWinner) {
      return <Crown className="w-24 h-24 text-purple-500 animate-bounce" />;
    }
    return <Trophy className="w-24 h-24 text-yellow-500 animate-win-pulse" />;
  };

  const getWinnerColor = () => {
    return isAIWinner ? 'from-purple-500 to-pink-500' : 'from-yellow-400 to-orange-500';
  };

  const getCelebrationText = () => {
    if (isAIWinner) {
      return "AI Dominance!";
    }
    return "Victory Achieved!";
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 animate-fade-in p-4">
      {/* Confetti Effect */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className={`absolute w-2 h-2 rounded-full animate-ping ${
                i % 4 === 0 ? 'bg-yellow-400' : 
                i % 4 === 1 ? 'bg-purple-400' : 
                i % 4 === 2 ? 'bg-pink-400' : 'bg-blue-400'
              }`}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>
      )}

      <div className="relative">
        {/* Glowing background effect */}
        <div className={`absolute inset-0 bg-gradient-to-r ${getWinnerColor()} rounded-2xl blur-xl opacity-30 scale-110 animate-pulse`}></div>
        
        <div className="relative bg-white/95 backdrop-blur-sm rounded-2xl p-8 shadow-2xl max-w-lg w-full animate-slide-in border border-white/20">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-all duration-200 p-2 rounded-full hover:bg-gray-100"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex flex-col items-center text-center">
            {/* Winner Icon with enhanced effects */}
            <div className="relative mb-6">
              <div className={`absolute inset-0 bg-gradient-to-r ${getWinnerColor()} rounded-full blur-lg opacity-50 scale-125`}></div>
              <div className="relative">
                {getWinnerIcon()}
                <div className="absolute -top-3 -right-3 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                  <Sparkles className="w-4 h-4 text-white animate-spin" />
                </div>
              </div>
            </div>

            {/* Celebration Text */}
            <div className="mb-4">
              <h2 className={`text-4xl font-bold bg-gradient-to-r ${getWinnerColor()} bg-clip-text text-transparent mb-2`}>
                {getCelebrationText()}
              </h2>
              <div className="flex items-center justify-center gap-2 mb-3">
                <Star className="w-5 h-5 text-yellow-400 animate-pulse" />
                <Star className="w-6 h-6 text-yellow-400 animate-pulse" style={{ animationDelay: '0.2s' }} />
                <Star className="w-5 h-5 text-yellow-400 animate-pulse" style={{ animationDelay: '0.4s' }} />
              </div>
            </div>

            {/* Winner Name */}
            <div className="mb-8">
              <p className="text-2xl text-gray-700 font-bold mb-2">
                {winner} Wins!
              </p>
              <div className="flex items-center justify-center gap-2 text-gray-600">
                <Zap className="w-4 h-4" />
                <span className="text-sm">Five in a Row Achieved</span>
                <Zap className="w-4 h-4" />
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 w-full">
              <button
                onClick={onNewGame}
                className="btn-primary flex items-center justify-center gap-2 flex-1 py-4 text-lg font-semibold hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <RotateCcw className="w-5 h-5" />
                New Game
              </button>
              <button
                onClick={onMainMenu}
                className="btn-ghost flex items-center justify-center gap-2 flex-1 py-4 text-lg font-semibold hover:scale-105 transition-all duration-200 border-2 border-gray-300 hover:border-gray-400"
              >
                <Home className="w-5 h-5" />
                Main Menu
              </button>
            </div>

            {/* Additional celebration elements */}
            <div className="mt-6 flex items-center justify-center gap-4 text-gray-500 text-sm">
              <div className="flex items-center gap-1">
                <Trophy className="w-4 h-4" />
                <span>Victory</span>
              </div>
              <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4" />
                <span>Excellence</span>
              </div>
              <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
              <div className="flex items-center gap-1">
                <Crown className="w-4 h-4" />
                <span>Champion</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}