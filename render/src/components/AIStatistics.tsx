import React from 'react';
import { Brain, Clock, Target, TrendingUp, Zap, BarChart3 } from 'lucide-react';

interface AIStats {
  totalMoves: number;
  averageThinkingTime: number;
  fastestMove: number;
  slowestMove: number;
  difficulty: 'easy' | 'medium' | 'hard';
  winRate: number;
  totalGames: number;
  currentGameTime: number;
  nodesEvaluated: number;
  depthReached: number;
}

interface AIStatisticsProps {
  stats: AIStats;
  isThinking: boolean;
  currentThinkingTime: number;
  className?: string;
}

export default function AIStatistics({ 
  stats, 
  isThinking, 
  currentThinkingTime,
  className = '' 
}: AIStatisticsProps) {
  const getDifficultyColor = () => {
    switch (stats.difficulty) {
      case 'easy': return 'text-green-400';
      case 'medium': return 'text-yellow-400';
      case 'hard': return 'text-red-400';
      default: return 'text-blue-400';
    }
  };

  const getDifficultyIcon = () => {
    switch (stats.difficulty) {
      case 'easy': return '🟢';
      case 'medium': return '🟡';
      case 'hard': return '🔴';
      default: return '🔵';
    }
  };

  const formatTime = (seconds: number) => {
    if (seconds === Infinity || seconds < 0 || Number.isNaN(seconds)) return '—';
    if (seconds < 1) return `${(seconds * 1000).toFixed(0)}ms`;
    return `${seconds.toFixed(1)}s`;
  };

  return (
    <div className={`glass-effect p-4 rounded-lg border border-white/20 ${className}`}>
      <div className="flex items-center gap-2 mb-4">
        <Brain className="w-5 h-5 text-indigo-400" />
        <h3 className="text-white font-semibold">AI Statistics</h3>
        <span className="text-xs px-2 py-1 rounded-full bg-white/10 text-white/70">
          {getDifficultyIcon()} {stats.difficulty.toUpperCase()}
        </span>
      </div>


      {/* Performance Metrics */}
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="flex items-center gap-2 text-white/80">
          <Target className="w-4 h-4" />
          <span>Moves: {stats.totalMoves}</span>
        </div>
        
        <div className="flex items-center gap-2 text-white/80">
          <Clock className="w-4 h-4" />
          <span>Avg: {formatTime(stats.averageThinkingTime)}</span>
        </div>
        
        <div className="flex items-center gap-2 text-white/80">
          <TrendingUp className="w-4 h-4 text-green-400" />
          <span>Fastest: {formatTime(stats.fastestMove)}</span>
        </div>
        
        <div className="flex items-center gap-2 text-white/80">
          <BarChart3 className="w-4 h-4 text-red-400" />
          <span>Slowest: {formatTime(stats.slowestMove)}</span>
        </div>
      </div>

      {/* Advanced Stats */}
      <div className="mt-4 pt-3 border-t border-white/10">
        <div className="grid grid-cols-2 gap-2 text-xs text-white/60">
          <div>Win Rate: {(stats.winRate * 100).toFixed(1)}%</div>
          <div>Games: {stats.totalGames}</div>
          <div>Nodes: {stats.totalMoves > 0 ? stats.nodesEvaluated.toLocaleString() : '—'}</div>
          <div>Depth: {stats.totalMoves > 0 ? stats.depthReached : '—'}</div>
        </div>
      </div>

      {/* Performance Indicator */}
      <div className="mt-3">
        <div className="flex items-center justify-between text-xs text-white/60 mb-1">
          <span>Performance</span>
          <span>{stats.difficulty === 'hard' ? 'Expert' : stats.difficulty === 'medium' ? 'Advanced' : 'Beginner'}</span>
        </div>
        <div className="w-full bg-white/10 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-500 ${
              stats.difficulty === 'hard' ? 'bg-red-400' : 
              stats.difficulty === 'medium' ? 'bg-yellow-400' : 'bg-green-400'
            }`}
            style={{ 
              width: `${stats.difficulty === 'hard' ? 100 : stats.difficulty === 'medium' ? 66 : 33}%` 
            }}
          ></div>
        </div>
      </div>
    </div>
  );
}
