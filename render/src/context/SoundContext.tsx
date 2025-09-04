import React, { createContext, useContext, useState, useEffect } from 'react';

interface SoundSettings {
  enabled: boolean;
  volume: number;
  stonePlace: boolean;
  win: boolean;
  error: boolean;
  hover: boolean;
  click: boolean;
}

interface SoundContextType {
  settings: SoundSettings;
  updateSettings: (newSettings: Partial<SoundSettings>) => void;
  toggleSound: () => void;
}

const defaultSettings: SoundSettings = {
  enabled: true,
  volume: 0.5,
  stonePlace: true,
  win: true,
  error: true,
  hover: false, // Disabled by default to avoid annoyance
  click: true,
};

const SoundContext = createContext<SoundContextType | undefined>(undefined);

export function SoundProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<SoundSettings>(() => {
    const saved = localStorage.getItem('gomoku-sound-settings');
    return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings;
  });

  useEffect(() => {
    localStorage.setItem('gomoku-sound-settings', JSON.stringify(settings));
  }, [settings]);

  const updateSettings = (newSettings: Partial<SoundSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const toggleSound = () => {
    setSettings(prev => ({ ...prev, enabled: !prev.enabled }));
  };

  return (
    <SoundContext.Provider value={{ settings, updateSettings, toggleSound }}>
      {children}
    </SoundContext.Provider>
  );
}

export function useSoundSettings() {
  const context = useContext(SoundContext);
  if (context === undefined) {
    throw new Error('useSoundSettings must be used within a SoundProvider');
  }
  return context;
}
