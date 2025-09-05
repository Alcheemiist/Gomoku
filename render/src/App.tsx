import React from 'react';
import { Toaster } from 'react-hot-toast';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainMenu from './pages/MainMenu';
import PlayerVsPlayer from './pages/PlayerVsPlayer';
import PlayerVsAI from './pages/PlayerVsAI';
import Settings from './pages/Settings';
import { GameProvider } from './context/GameContext';
import { SoundProvider } from './context/SoundContext';
import { ThemeProvider } from './context/ThemeContext';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <SoundProvider>
          <GameProvider>
            <BrowserRouter>
            <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 dark:from-gray-900 dark:via-indigo-900 dark:to-purple-900">
          <Toaster
              position="top-right"
              toastOptions={{
                duration: 2000,
                style: {
                  background: '#363636',
                  color: '#fff',
                },
                success: {
                  iconTheme: {
                    primary: '#4ade80',
                    secondary: '#fff',
                  },
                },
                error: {
                  iconTheme: {
                    primary: '#ef4444',
                    secondary: '#fff',
                  },
                },
              }}
            />
            <Routes>
              <Route path="/" element={<MainMenu />} />
              <Route path="/pvp" element={<PlayerVsPlayer />} />
              <Route path="/ai" element={<PlayerVsAI />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
            </div>
            </BrowserRouter>
          </GameProvider>
        </SoundProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;