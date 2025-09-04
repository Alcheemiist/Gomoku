import { useCallback, useRef } from 'react';

interface SoundEffects {
  playStonePlace: () => void;
  playWin: () => void;
  playError: () => void;
  playHover: () => void;
  playClick: () => void;
}

export function useSoundEffects(): SoundEffects {
  const audioContextRef = useRef<AudioContext | null>(null);

  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioContextRef.current;
  }, []);

  const createTone = useCallback((frequency: number, duration: number, type: OscillatorType = 'sine') => {
    const audioContext = getAudioContext();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
    oscillator.type = type;

    // Create envelope for smooth sound
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration);
  }, [getAudioContext]);

  const playStonePlace = useCallback(() => {
    // Pleasant "plop" sound for stone placement
    createTone(800, 0.1, 'sine');
    setTimeout(() => createTone(600, 0.1, 'sine'), 50);
  }, [createTone]);

  const playWin = useCallback(() => {
    // Victory fanfare
    const notes = [523, 659, 784, 1047]; // C5, E5, G5, C6
    notes.forEach((note, index) => {
      setTimeout(() => createTone(note, 0.3, 'sine'), index * 150);
    });
  }, [createTone]);

  const playError = useCallback(() => {
    // Error sound
    createTone(200, 0.2, 'sawtooth');
    setTimeout(() => createTone(150, 0.2, 'sawtooth'), 100);
  }, [createTone]);

  const playHover = useCallback(() => {
    // Subtle hover sound
    createTone(1000, 0.05, 'sine');
  }, [createTone]);

  const playClick = useCallback(() => {
    // Button click sound
    createTone(1200, 0.08, 'square');
  }, [createTone]);

  return {
    playStonePlace,
    playWin,
    playError,
    playHover,
    playClick,
  };
}
