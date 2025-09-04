import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Bot, Settings as SettingsIcon } from 'lucide-react';

export default function MainMenu() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      <div className="glass-effect p-8 rounded-2xl shadow-2xl w-full max-w-md animate-fade-in">
        <div className="text-center mb-8">
          <div className="mb-4">
            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mb-4">
              <span className="text-3xl font-bold text-white">五</span>
            </div>
          </div>
          <h1 className="text-5xl font-bold text-gradient mb-2">Gomoku</h1>
          <p className="text-white/70 text-sm">Five in a Row Strategy Game</p>
        </div>
        <div className="space-y-4">
          <button
            onClick={() => navigate('/pvp')}
            className="btn-primary w-full flex items-center justify-center gap-3 py-4 text-lg"
          >
            <Users className="w-6 h-6" />
            Player vs Player
          </button>
          <button
            onClick={() => navigate('/ai')}
            className="btn-secondary w-full flex items-center justify-center gap-3 py-4 text-lg"
          >
            <Bot className="w-6 h-6" />
            Player vs AI
          </button>
          <button
            onClick={() => navigate('/settings')}
            className="btn-ghost w-full flex items-center justify-center gap-3 py-4 text-lg"
          >
            <SettingsIcon className="w-6 h-6" />
            Settings
          </button>
        </div>
        <div className="mt-8 text-center">
          <p className="text-white/50 text-xs leading-relaxed">
            Click on intersections to place stones.<br />
            Get 5 in a row to win!
          </p>
        </div>
      </div>
    </div>
  );
}