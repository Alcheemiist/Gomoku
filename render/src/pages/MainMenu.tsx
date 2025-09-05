import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Bot, Settings as SettingsIcon, Power, Sparkles, Zap } from 'lucide-react';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';
import ThemeToggle from '../components/ThemeToggle';
import axios from 'axios';
import config from '../Config';

export default function MainMenu() {
  const navigate = useNavigate();
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([]);

  // Generate floating particles
  useEffect(() => {
    const generateParticles = () => {
      const newParticles = Array.from({ length: 20 }, (_, i) => ({
        id: i,
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        delay: Math.random() * 5
      }));
      setParticles(newParticles);
    };

    generateParticles();
    const interval = setInterval(() => {
      setParticles(prev => prev.map(particle => ({
        ...particle,
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        delay: Math.random() * 5
      })));
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  const handleQuit = async () => {
    if (window.confirm('Are you sure you want to quit the game?')) {
      try {
        // Try to gracefully shutdown the backend
        await axios.post(`${config.serverUrl}/api/shutdown`, {}, { 
          headers: config.headers_data,
          timeout: 2000 // 2 second timeout
        });
      } catch (error) {
        // If backend shutdown fails, just close the window
        console.log('Backend shutdown failed, closing window anyway');
      }
      // Close the window/tab
      window.close();
    }
  };

  // Keyboard shortcuts
  useKeyboardShortcuts({
    onQuit: handleQuit
  });

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 dark:from-gray-900 dark:via-indigo-900 dark:to-purple-900 relative overflow-hidden">
      {/* Theme Toggle */}
      <div className="absolute top-4 right-4 z-20">
        <ThemeToggle />
      </div>
      
      {/* Animated Background Particles */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute w-2 h-2 bg-white/20 rounded-full animate-float"
          style={{
            left: particle.x,
            top: particle.y,
            animationDelay: `${particle.delay}s`,
            animationDuration: `${3 + Math.random() * 4}s`
          }}
        />
      ))}

      {/* Gradient Orbs */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-purple-500/30 to-pink-500/30 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-indigo-500/30 to-blue-500/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />

      <div className="glass-effect p-8 rounded-2xl shadow-2xl w-full max-w-md animate-fade-in relative z-10">
        {/* Header with enhanced animations */}
        <div className="text-center mb-8">
          <div className="mb-4 relative">
            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mb-4 animate-float relative overflow-hidden">
              <span className="text-3xl font-bold text-white relative z-10">五</span>
              {/* Rotating ring effect */}
              <div className="absolute inset-0 border-2 border-white/30 rounded-full animate-spin" style={{ animationDuration: '3s' }} />
              <div className="absolute inset-0 border-2 border-transparent border-t-white/50 rounded-full animate-spin" style={{ animationDuration: '2s', animationDirection: 'reverse' }} />
            </div>
            {/* Sparkle effects */}
            <div className="absolute -top-2 -right-2">
              <Sparkles className="w-6 h-6 text-yellow-400 animate-pulse" />
            </div>
            <div className="absolute -bottom-2 -left-2">
              <Zap className="w-4 h-4 text-blue-400 animate-bounce" />
            </div>
          </div>
          <h1 className="text-5xl font-bold text-gradient mb-2 animate-glow">
            Gomoku
          </h1>
          <p className="text-white/70 text-sm animate-slide-in" style={{ animationDelay: '0.2s' }}>
            Five in a Row Strategy Game
          </p>
        </div>
        {/* Enhanced button animations */}
        <div className="space-y-4">
          <button
            onClick={() => navigate('/pvp')}
            onMouseEnter={() => setHoveredButton('pvp')}
            onMouseLeave={() => setHoveredButton(null)}
            className={`btn-primary w-full flex items-center justify-center gap-3 py-4 text-lg relative overflow-hidden group transition-all duration-300 ${
              hoveredButton === 'pvp' ? 'transform scale-105 shadow-2xl' : ''
            }`}
            style={{
              background: hoveredButton === 'pvp' 
                ? 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)'
                : 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              boxShadow: hoveredButton === 'pvp' 
                ? '0 20px 40px rgba(99, 102, 241, 0.4)' 
                : '0 10px 25px rgba(99, 102, 241, 0.2)'
            }}
          >
            <Users className="w-6 h-6 transition-transform duration-300 group-hover:rotate-12" />
            <span className="relative z-10">Player vs Player</span>
            {/* Ripple effect */}
            <div className="absolute inset-0 bg-white/20 rounded-lg transform scale-0 group-hover:scale-100 transition-transform duration-300" />
          </button>

          <button
            onClick={() => navigate('/ai')}
            onMouseEnter={() => setHoveredButton('ai')}
            onMouseLeave={() => setHoveredButton(null)}
            className={`btn-secondary w-full flex items-center justify-center gap-3 py-4 text-lg relative overflow-hidden group transition-all duration-300 ${
              hoveredButton === 'ai' ? 'transform scale-105 shadow-2xl' : ''
            }`}
            style={{
              background: hoveredButton === 'ai' 
                ? 'linear-gradient(135deg, #7c3aed 0%, #ec4899 100%)'
                : 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
              boxShadow: hoveredButton === 'ai' 
                ? '0 20px 40px rgba(139, 92, 246, 0.4)' 
                : '0 10px 25px rgba(139, 92, 246, 0.2)'
            }}
          >
            <Bot className="w-6 h-6 transition-transform duration-300 group-hover:scale-110" />
            <span className="relative z-10">Player vs AI</span>
            {/* Ripple effect */}
            <div className="absolute inset-0 bg-white/20 rounded-lg transform scale-0 group-hover:scale-100 transition-transform duration-300" />
          </button>

          <button
            onClick={() => navigate('/settings')}
            onMouseEnter={() => setHoveredButton('settings')}
            onMouseLeave={() => setHoveredButton(null)}
            className={`btn-ghost w-full flex items-center justify-center gap-3 py-4 text-lg relative overflow-hidden group transition-all duration-300 ${
              hoveredButton === 'settings' ? 'transform scale-105' : ''
            }`}
            style={{
              background: hoveredButton === 'settings' 
                ? 'rgba(255, 255, 255, 0.25)' 
                : 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              boxShadow: hoveredButton === 'settings' 
                ? '0 10px 25px rgba(255, 255, 255, 0.1)' 
                : 'none'
            }}
          >
            <SettingsIcon className="w-6 h-6 transition-transform duration-300 group-hover:rotate-90" />
            <span className="relative z-10">Settings</span>
            {/* Ripple effect */}
            <div className="absolute inset-0 bg-white/10 rounded-lg transform scale-0 group-hover:scale-100 transition-transform duration-300" />
          </button>

          <button
            onClick={handleQuit}
            onMouseEnter={() => setHoveredButton('quit')}
            onMouseLeave={() => setHoveredButton(null)}
            className={`btn-danger w-full flex items-center justify-center gap-3 py-4 text-lg relative overflow-hidden group transition-all duration-300 ${
              hoveredButton === 'quit' ? 'transform scale-105' : ''
            }`}
            style={{
              background: hoveredButton === 'quit' 
                ? 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)'
                : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
              boxShadow: hoveredButton === 'quit' 
                ? '0 10px 25px rgba(239, 68, 68, 0.3)' 
                : '0 5px 15px rgba(239, 68, 68, 0.2)'
            }}
          >
            <Power className="w-6 h-6 transition-transform duration-300 group-hover:scale-110" />
            <span className="relative z-10">Quit Game</span>
            {/* Ripple effect */}
            <div className="absolute inset-0 bg-white/20 rounded-lg transform scale-0 group-hover:scale-100 transition-transform duration-300" />
          </button>
        </div>
        {/* Enhanced footer with animated text */}
        <div className="mt-8 text-center">
          <p className="text-white/50 text-xs leading-relaxed animate-fade-in" style={{ animationDelay: '0.5s' }}>
            <span className="inline-block animate-bounce" style={{ animationDelay: '1s' }}>Click</span> on intersections to place stones.<br />
            Get <span className="text-yellow-400 font-semibold animate-pulse">5 in a row</span> to win!
          </p>
        </div>
      </div>
    </div>
  );
}