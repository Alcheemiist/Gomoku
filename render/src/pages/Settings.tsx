import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import { useSoundSettings } from '../context/SoundContext';
import { ArrowLeft, User, Bot, Zap, Volume2, VolumeX, Palette, Clock, Eye } from 'lucide-react';

export default function Settings() {
  const navigate = useNavigate();
  const {
    player1Name,
    player2Name,
    aiName,
    difficulty,
    setPlayer1Name,
    setPlayer2Name,
    setAiName,
    setDifficulty,
  } = useGame();

  const { settings: soundSettings, updateSettings: updateSoundSettings } = useSoundSettings();
  
  // Additional game settings
  const [boardTheme, setBoardTheme] = useState<'classic' | 'modern' | 'dark'>('classic');
  const [animationSpeed, setAnimationSpeed] = useState<'slow' | 'normal' | 'fast'>('normal');
  const [showCoordinates, setShowCoordinates] = useState(false);
  const [autoSave, setAutoSave] = useState(true);

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <button
        onClick={() => navigate('/')}
        className="absolute top-4 left-4 text-white hover:text-gray-300 flex items-center gap-2 transition-colors hover-lift"
      >
        <ArrowLeft className="w-6 h-6" />
        Back to Menu
      </button>

      <div className="glass-effect p-8 rounded-2xl shadow-2xl w-full max-w-md animate-slide-in">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gradient mb-2">Settings</h2>
          <p className="text-white/70 text-sm">Customize your game experience</p>
        </div>

        <div className="space-y-6">
          <div className="space-y-4">
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-indigo-300 w-5 h-5" />
              <input
                type="text"
                value={player1Name}
                onChange={(e) => setPlayer1Name(e.target.value)}
                placeholder="Player 1 Name"
                className="w-full bg-white/5 border border-indigo-300/20 rounded-lg py-3 pl-12 pr-4 text-white placeholder-indigo-300 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20 transition-all"
                maxLength={12}
              />
            </div>

            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-300 w-5 h-5" />
              <input
                type="text"
                value={player2Name}
                onChange={(e) => setPlayer2Name(e.target.value)}
                placeholder="Player 2 Name"
                className="w-full bg-white/5 border border-purple-300/20 rounded-lg py-3 pl-12 pr-4 text-white placeholder-purple-300 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all"
                maxLength={12}
              />
            </div>

            <div className="relative">
              <Bot className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-300 w-5 h-5" />
              <input
                type="text"
                value={aiName}
                onChange={(e) => setAiName(e.target.value)}
                placeholder="AI Player Name"
                className="w-full bg-white/5 border border-green-300/20 rounded-lg py-3 pl-12 pr-4 text-white placeholder-green-300 focus:border-green-400 focus:ring-2 focus:ring-green-400/20 transition-all"
                maxLength={12}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-white">
              <Zap className="w-5 h-5" />
              AI Difficulty
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['easy', 'medium', 'hard'] as const).map((level) => (
                <button
                  key={level}
                  onClick={() => setDifficulty(level)}
                  className={`py-2 px-4 rounded-lg font-medium transition-all duration-200 hover-lift ${
                    difficulty === level
                      ? 'bg-indigo-600 text-white shadow-lg'
                      : 'bg-white/5 text-white/80 hover:bg-white/10 border border-white/10'
                  }`}
                >
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Sound Settings */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-white">
              {soundSettings.enabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
              Sound Settings
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-white/80 text-sm">Enable Sounds</span>
                <button
                  onClick={() => updateSoundSettings({ enabled: !soundSettings.enabled })}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    soundSettings.enabled ? 'bg-indigo-600' : 'bg-gray-600'
                  }`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                    soundSettings.enabled ? 'translate-x-6' : 'translate-x-1'
                  }`}></div>
                </button>
              </div>

              {soundSettings.enabled && (
                <>
                  <div className="space-y-2">
                    <label className="text-white/80 text-sm">Volume</label>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={soundSettings.volume}
                      onChange={(e) => updateSoundSettings({ volume: parseFloat(e.target.value) })}
                      className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {[
                      { key: 'stonePlace', label: 'Stone Place' },
                      { key: 'win', label: 'Win Sound' },
                      { key: 'error', label: 'Error Sound' },
                      { key: 'click', label: 'Click Sound' },
                    ].map(({ key, label }) => (
                      <div key={key} className="flex items-center justify-between">
                        <span className="text-white/70">{label}</span>
                        <button
                          onClick={() => updateSoundSettings({ [key]: !soundSettings[key as keyof typeof soundSettings] })}
                          className={`w-8 h-4 rounded-full transition-colors ${
                            soundSettings[key as keyof typeof soundSettings] ? 'bg-indigo-600' : 'bg-gray-600'
                          }`}
                        >
                          <div className={`w-3 h-3 bg-white rounded-full transition-transform ${
                            soundSettings[key as keyof typeof soundSettings] ? 'translate-x-4' : 'translate-x-0.5'
                          }`}></div>
                        </button>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Visual Settings */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-white">
              <Palette className="w-5 h-5" />
              Visual Settings
            </div>
            
            <div className="space-y-3">
              <div className="space-y-2">
                <label className="text-white/80 text-sm">Board Theme</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['classic', 'modern', 'dark'] as const).map((theme) => (
                    <button
                      key={theme}
                      onClick={() => setBoardTheme(theme)}
                      className={`py-2 px-3 rounded-lg font-medium transition-all duration-200 hover-lift ${
                        boardTheme === theme
                          ? 'bg-indigo-600 text-white shadow-lg'
                          : 'bg-white/5 text-white/80 hover:bg-white/10 border border-white/10'
                      }`}
                    >
                      {theme.charAt(0).toUpperCase() + theme.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-white/80 text-sm">Animation Speed</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['slow', 'normal', 'fast'] as const).map((speed) => (
                    <button
                      key={speed}
                      onClick={() => setAnimationSpeed(speed)}
                      className={`py-2 px-3 rounded-lg font-medium transition-all duration-200 hover-lift ${
                        animationSpeed === speed
                          ? 'bg-indigo-600 text-white shadow-lg'
                          : 'bg-white/5 text-white/80 hover:bg-white/10 border border-white/10'
                      }`}
                    >
                      {speed.charAt(0).toUpperCase() + speed.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-white/80 text-sm">Show Coordinates</span>
                <button
                  onClick={() => setShowCoordinates(!showCoordinates)}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    showCoordinates ? 'bg-indigo-600' : 'bg-gray-600'
                  }`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                    showCoordinates ? 'translate-x-6' : 'translate-x-1'
                  }`}></div>
                </button>
              </div>
            </div>
          </div>

          {/* Game Settings */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-white">
              <Clock className="w-5 h-5" />
              Game Settings
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-white/80 text-sm">Auto-save Games</span>
                <button
                  onClick={() => setAutoSave(!autoSave)}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    autoSave ? 'bg-indigo-600' : 'bg-gray-600'
                  }`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                    autoSave ? 'translate-x-6' : 'translate-x-1'
                  }`}></div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}