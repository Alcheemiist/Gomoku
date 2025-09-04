import React from 'react';
import { Brain, Target, Zap, Eye, TrendingUp, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

interface MoveAnalysis {
  position: [number, number];
  score: number;
  reasoning: string;
  depth: number;
  nodesEvaluated: number;
  thinkingTime?: number;
  alternativeMoves?: Array<{
    position: [number, number];
    score: number;
    reasoning: string;
  }>;
  gamePhase?: 'opening' | 'midgame' | 'endgame';
  strategicValue?: number;
}

interface AIMoveAnalysisProps {
  analysis: MoveAnalysis | null;
  isVisible: boolean;
  className?: string;
}

export default function AIMoveAnalysis({ 
  analysis, 
  isVisible, 
  className = '' 
}: AIMoveAnalysisProps) {
  if (!analysis) return null;

  const getScoreColor = (score: number) => {
    if (score > 50) return 'text-green-400';
    if (score > 0) return 'text-yellow-400';
    if (score > -50) return 'text-orange-400';
    return 'text-red-400';
  };

  const getScoreText = (score: number) => {
    if (score > 75) return 'Brilliant';
    if (score > 50) return 'Excellent';
    if (score > 25) return 'Good';
    if (score > 0) return 'Fair';
    if (score > -25) return 'Questionable';
    if (score > -50) return 'Poor';
    return 'Blunder';
  };

  const getGamePhaseColor = (phase?: string) => {
    switch (phase) {
      case 'opening': return 'text-blue-400';
      case 'midgame': return 'text-yellow-400';
      case 'endgame': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getStrategicValueText = (value?: number) => {
    if (!value) return 'Unknown';
    if (value > 80) return 'Critical';
    if (value > 60) return 'Important';
    if (value > 40) return 'Moderate';
    if (value > 20) return 'Minor';
    return 'Negligible';
  };

  return (
    <div className={`glass-effect p-3 rounded-lg border border-white/20 shadow-xl max-w-xs ${className}`}>
      <div className="flex items-center gap-2 mb-2">
        <Brain className="w-4 h-4 text-indigo-400" />
        <h3 className="text-white font-semibold text-sm">Move Analysis</h3>
      </div>

      <div className="space-y-2">
        {/* Move Quality & Position */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            {analysis.score > 50 ? (
              <CheckCircle className="w-3 h-3 text-green-400" />
            ) : analysis.score < -25 ? (
              <AlertTriangle className="w-3 h-3 text-red-400" />
            ) : (
              <TrendingUp className="w-3 h-3 text-yellow-400" />
            )}
            <span className="text-white/80 text-xs">({analysis.position[0] + 1}, {analysis.position[1] + 1})</span>
          </div>
          <span className={`font-bold text-xs ${getScoreColor(analysis.score)}`}>
            {analysis.score}
          </span>
        </div>

        {/* Game Phase & Strategic Value */}
        <div className="flex items-center justify-between text-xs">
          {analysis.gamePhase && (
            <span className={`${getGamePhaseColor(analysis.gamePhase)}`}>
              {analysis.gamePhase.charAt(0).toUpperCase() + analysis.gamePhase.slice(1)}
            </span>
          )}
          {analysis.strategicValue && (
            <span className="text-purple-400">
              {getStrategicValueText(analysis.strategicValue)}
            </span>
          )}
        </div>

        {/* Reasoning */}
        <div className="text-white/70 text-xs leading-tight">
          {analysis.reasoning}
        </div>

        {/* Technical Details */}
        <div className="flex items-center justify-between text-xs text-white/60">
          <span>Depth: {analysis.depth}</span>
          <span>Nodes: {Math.floor(analysis.nodesEvaluated / 1000)}k</span>
          {analysis.thinkingTime && (
            <span>{analysis.thinkingTime.toFixed(1)}s</span>
          )}
        </div>
      </div>
    </div>
  );
}
