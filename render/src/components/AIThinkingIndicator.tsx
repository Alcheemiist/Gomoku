import React, { useState, useEffect } from 'react';
import { Brain, Zap, Cpu, Activity } from 'lucide-react';

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
  const [animationPhase, setAnimationPhase] = useState(0);
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([]);

  // Generate thinking particles
  useEffect(() => {
    if (!isThinking) return;
    
    const generateParticles = () => {
      const newParticles = Array.from({ length: 8 }, (_, i) => ({
        id: i,
        x: Math.random() * 200,
        y: Math.random() * 100,
        delay: Math.random() * 2
      }));
      setParticles(newParticles);
    };

    generateParticles();
    const interval = setInterval(() => {
      setParticles(prev => prev.map(particle => ({
        ...particle,
        x: Math.random() * 200,
        y: Math.random() * 100,
        delay: Math.random() * 2
      })));
    }, 3000);

    return () => clearInterval(interval);
  }, [isThinking]);

  // Animation phase cycling
  useEffect(() => {
    if (!isThinking) return;
    
    const interval = setInterval(() => {
      setAnimationPhase(prev => (prev + 1) % 3);
    }, 2000);

    return () => clearInterval(interval);
  }, [isThinking]);

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

  const getThinkingMessage = () => {
    const messages = [
      "Analyzing board position...",
      "Calculating optimal moves...",
      "Evaluating strategies...",
      "Processing possibilities...",
      "Computing best response...",
      "Deep analysis in progress..."
    ];
    return messages[animationPhase] || messages[0];
  };

  return (
    <div className={`fixed top-4 right-4 z-50 glass-effect p-6 rounded-2xl border border-white/20 shadow-2xl backdrop-blur-md ${className} animate-slide-in`}>
      <div className="relative">
        {/* Animated background particles */}
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute w-1 h-1 bg-white/30 rounded-full animate-particle-float"
            style={{
              left: particle.x,
              top: particle.y,
              animationDelay: `${particle.delay}s`,
              animationDuration: '2s'
            }}
          />
        ))}

        <div className="flex items-center gap-4 relative z-10">
          <div className="relative">
            <div className="relative">
              <Brain className={`w-8 h-8 ${getDifficultyColor()} animate-pulse`} />
              <div className="absolute -top-1 -right-1">
                <Zap className="w-4 h-4 text-yellow-400 animate-bounce" />
              </div>
              <div className="absolute -bottom-1 -left-1">
                <Cpu className="w-3 h-3 text-blue-400 animate-pulse" />
              </div>
            </div>
            {/* Rotating ring around brain */}
            <div className="absolute inset-0 border-2 border-white/20 rounded-full animate-spin" style={{ animationDuration: '3s' }} />
            <div className="absolute inset-0 border-2 border-transparent border-t-white/40 rounded-full animate-spin" style={{ animationDuration: '2s', animationDirection: 'reverse' }} />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-white font-semibold text-lg">AI Thinking</span>
              <span className={`text-xs px-3 py-1 rounded-full bg-white/10 ${getDifficultyColor()} font-medium`}>
                {getDifficultyText()}
              </span>
            </div>
            
            <div className="text-white/80 text-sm mb-2 animate-fade-in">
              {getThinkingMessage()}
            </div>
            
            {thinkingTime > 0 && (
              <div className="flex items-center gap-2 text-white/60 text-sm">
                <Activity className="w-4 h-4 animate-pulse" />
                <span>Time: {thinkingTime.toFixed(1)}s</span>
              </div>
            )}
          </div>

          {/* Enhanced loading dots */}
          <div className="flex flex-col space-y-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2 h-2 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full animate-pulse"
                style={{
                  animationDelay: `${i * 0.3}s`,
                  animationDuration: '1.2s'
                }}
              />
            ))}
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-4 w-full bg-white/10 rounded-full h-1 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full animate-pulse"
            style={{
              width: `${(thinkingTime % 5) * 20}%`,
              transition: 'width 0.3s ease'
            }}
          />
        </div>
      </div>
    </div>
  );
}


