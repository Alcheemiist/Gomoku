import React from 'react';
import { Brain, Target, TrendingUp, AlertCircle, CheckCircle, Clock, BarChart3 } from 'lucide-react';

interface GameInsights {
  gamePhase: 'opening' | 'midgame' | 'endgame';
  aiAdvantage: number;
  predictedOutcome: 'win' | 'loss' | 'draw' | 'unclear';
  keyThreats: string[];
  strategicRecommendations: string[];
  positionEvaluation: number;
}

interface AIGameInsightsProps {
  insights: GameInsights | null;
  className?: string;
}

export default function AIGameInsights({ insights, className = '' }: AIGameInsightsProps) {
  if (!insights) return null;

  const getPhaseColor = (phase: string) => {
    switch (phase) {
      case 'opening': return 'text-blue-400';
      case 'midgame': return 'text-yellow-400';
      case 'endgame': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getOutcomeColor = (outcome: string) => {
    switch (outcome) {
      case 'win': return 'text-green-400';
      case 'loss': return 'text-red-400';
      case 'draw': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

  const getOutcomeIcon = (outcome: string) => {
    switch (outcome) {
      case 'win': return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'loss': return <AlertCircle className="w-4 h-4 text-red-400" />;
      case 'draw': return <Clock className="w-4 h-4 text-yellow-400" />;
      default: return <Brain className="w-4 h-4 text-gray-400" />;
    }
  };

  const getAdvantageText = (advantage: number) => {
    if (advantage > 20) return 'Strong Advantage';
    if (advantage > 10) return 'Advantage';
    if (advantage > -10) return 'Equal Position';
    if (advantage > -20) return 'Disadvantage';
    return 'Strong Disadvantage';
  };

  const getAdvantageColor = (advantage: number) => {
    if (advantage > 10) return 'text-green-400';
    if (advantage > -10) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className={`glass-effect p-4 rounded-lg border border-white/20 shadow-xl ${className}`}>
      <div className="flex items-center gap-2 mb-4">
        <Brain className="w-5 h-5 text-indigo-400" />
        <h3 className="text-white font-semibold">Game Insights</h3>
      </div>

      {/* Horizontal Layout for Key Metrics */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        {/* Game Phase */}
        <div className="bg-white/5 rounded-lg p-3 text-center">
          <Clock className="w-5 h-5 text-white/70 mx-auto mb-2" />
          <div className="text-white/60 text-xs mb-1">Phase</div>
          <div className={`font-semibold text-sm ${getPhaseColor(insights.gamePhase)}`}>
            {insights.gamePhase.charAt(0).toUpperCase() + insights.gamePhase.slice(1)}
          </div>
        </div>

        {/* AI Advantage */}
        <div className="bg-white/5 rounded-lg p-3 text-center">
          <TrendingUp className="w-5 h-5 text-white/70 mx-auto mb-2" />
          <div className="text-white/60 text-xs mb-1">Advantage</div>
          <div className={`font-semibold text-sm ${getAdvantageColor(insights.aiAdvantage)}`}>
            {insights.aiAdvantage > 0 ? `+${insights.aiAdvantage}` : insights.aiAdvantage}
          </div>
        </div>

        {/* Predicted Outcome */}
        <div className="bg-white/5 rounded-lg p-3 text-center">
          {getOutcomeIcon(insights.predictedOutcome)}
          <div className="text-white/60 text-xs mb-1 mt-2">Outcome</div>
          <div className={`font-semibold text-sm ${getOutcomeColor(insights.predictedOutcome)}`}>
            {insights.predictedOutcome.charAt(0).toUpperCase() + insights.predictedOutcome.slice(1)}
          </div>
        </div>
      </div>

      {/* Key Threats */}
      {insights.keyThreats.length > 0 && (
        <div className="pt-3 border-t border-white/10">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="w-4 h-4 text-orange-400" />
            <span className="text-white/80 text-sm font-semibold">Key Threats</span>
          </div>
          <ul className="space-y-1">
            {insights.keyThreats.slice(0, 2).map((threat, index) => (
              <li key={index} className="text-white/70 text-xs flex items-start gap-2">
                <span className="text-orange-400 mt-0.5">•</span>
                <span>{threat}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Strategic Recommendations */}
      {insights.strategicRecommendations.length > 0 && (
        <div className="pt-3 border-t border-white/10">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-green-400" />
            <span className="text-white/80 text-sm font-semibold">Recommendations</span>
          </div>
          <ul className="space-y-1">
            {insights.strategicRecommendations.slice(0, 2).map((rec, index) => (
              <li key={index} className="text-white/70 text-xs flex items-start gap-2">
                <span className="text-green-400 mt-0.5">•</span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
