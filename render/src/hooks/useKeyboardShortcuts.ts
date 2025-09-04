import { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

interface KeyboardShortcutsOptions {
  onNewGame?: () => void;
  onMainMenu?: () => void;
  onSettings?: () => void;
  onToggleHints?: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
  disabled?: boolean;
}

export function useKeyboardShortcuts({
  onNewGame,
  onMainMenu,
  onSettings,
  onToggleHints,
  onUndo,
  onRedo,
  disabled = false
}: KeyboardShortcutsOptions = {}) {
  const navigate = useNavigate();

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (disabled) return;

    // Don't trigger shortcuts when typing in input fields
    if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
      return;
    }

    const { key, ctrlKey, metaKey, altKey } = event;
    const isModifierPressed = ctrlKey || metaKey;

    switch (key.toLowerCase()) {
      case 'n':
        if (isModifierPressed) {
          event.preventDefault();
          onNewGame?.();
        }
        break;
      
      case 'm':
        if (isModifierPressed) {
          event.preventDefault();
          onMainMenu?.() || navigate('/');
        }
        break;
      
      case ',':
        if (isModifierPressed) {
          event.preventDefault();
          onSettings?.() || navigate('/settings');
        }
        break;
      
      case 'h':
        if (isModifierPressed) {
          event.preventDefault();
          onToggleHints?.();
        }
        break;
      
      case 'z':
        if (isModifierPressed && !altKey) {
          event.preventDefault();
          onUndo?.();
        }
        break;
      
      case 'y':
        if (isModifierPressed) {
          event.preventDefault();
          onRedo?.();
        }
        break;
      
      case 'escape':
        event.preventDefault();
        onMainMenu?.() || navigate('/');
        break;
      
      case 'f1':
        event.preventDefault();
        // Show help modal or keyboard shortcuts
        break;
    }
  }, [disabled, onNewGame, onMainMenu, onSettings, onToggleHints, onUndo, onRedo, navigate]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return {
    // Return any additional functionality if needed
  };
}
