import React from 'react';
import { Brain, Zap } from 'lucide-react';

interface AIThinkingIndicatorProps {
  isThinking: boolean;
  difficulty: 'easy' | 'medium' | 'hard';
  thinkingTime?: number;
  className?: string;
}

export default function AIThinkingIndicator({ 
  isThinking, 
  difficulty, 
  thinkingTime = 0,
  className = '' 
}: AIThinkingIndicatorProps) {
  if (!isThinking) return null;

  const getDifficultyColor = () => {
    switch (difficulty) {
      case 'easy': return 'text-green-400';
      case 'medium': return 'text-yellow-400';
      case 'hard': return 'text-red-400';
      default: return 'text-blue-400';
    }
  };

  const getDifficultyText = () => {
    switch (difficulty) {
      case 'easy': return 'Easy';
      case 'medium': return 'Medium';
      case 'hard': return 'Hard';
      default: return 'Unknown';
    }
  };

  return (
    <div className={`fixed top-4 right-4 z-50 glass-effect p-4 rounded-lg border border-white/20 shadow-2xl ${className}`}>
      <div className="flex items-center gap-3">
        <div className="relative">
          <Brain className={`w-6 h-6 ${getDifficultyColor()} animate-pulse`} />
          <div className="absolute -top-1 -right-1">
            <Zap className="w-3 h-3 text-yellow-400 animate-bounce" />
          </div>
        </div>
        
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-white font-medium">AI is thinking...</span>
            <span className={`text-xs px-2 py-1 rounded-full bg-white/10 ${getDifficultyColor()}`}>
              {getDifficultyText()}
            </span>
          </div>
          
          {thinkingTime > 0 && (
            <div className="text-white/60 text-sm mt-1">
              Thinking time: {thinkingTime.toFixed(1)}s
            </div>
          )}
        </div>

        <div className="flex space-x-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse"
              style={{
                animationDelay: `${i * 0.2}s`,
                animationDuration: '1s'
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
