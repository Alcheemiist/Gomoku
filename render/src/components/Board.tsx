import React, { useState } from 'react';
import type { WinningLine } from '../types/game';
import { useSoundEffects } from '../hooks/useSoundEffects';
import { useSoundSettings } from '../context/SoundContext';

interface BoardProps {
  board: number[][];
  onCellClick: (row: number, col: number) => void;
  hintPosition: [number, number] | null;
  winningLine: WinningLine;
  isLoading?: boolean;
  disabled?: boolean;
}

export default function Board({ board, onCellClick, hintPosition, winningLine, isLoading = false, disabled = false }: BoardProps) {
  // Responsive cell size based on screen size
  const [cellSize, setCellSize] = useState(24);
  const GRID_SIZE = 19;
  const DISPLAY_SIZE = 20;
  const BOARD_SIZE = cellSize * (DISPLAY_SIZE - 1);
  const [hoveredCell, setHoveredCell] = useState<[number, number] | null>(null);
  const [rippleEffect, setRippleEffect] = useState<[number, number] | null>(null);
  const { playStonePlace, playHover } = useSoundEffects();
  const { settings: soundSettings } = useSoundSettings();

  // Responsive cell size calculation
  React.useEffect(() => {
    const updateCellSize = () => {
      const screenWidth = window.innerWidth;
      if (screenWidth < 640) {
        setCellSize(16); // Mobile
      } else if (screenWidth < 1024) {
        setCellSize(20); // Tablet
      } else {
        setCellSize(24); // Desktop
      }
    };

    updateCellSize();
    window.addEventListener('resize', updateCellSize);
    return () => window.removeEventListener('resize', updateCellSize);
  }, []);


  const renderWinningLine = () => {
    if (!winningLine) return null;

    const { start, end } = winningLine;
    const dx = end[1] - start[1];
    const dy = end[0] - start[0];

    const winningPositions: [number, number][] = [];
    for (let i = 0; i < 5; i++) {
      const t = i / 4;
      const x = Math.round(start[1] + dx * t);
      const y = Math.round(start[0] + dy * t);
      winningPositions.push([y, x]);
    }

    const lineLength = Math.sqrt(dx * dx + dy * dy) * cellSize;
    const lineAngle = Math.atan2(dy, dx) * (180 / Math.PI);
    const centerX = (start[1] + end[1]) / 2 * cellSize + cellSize / 2;
    const centerY = (start[0] + end[0]) / 2 * cellSize + cellSize / 2;

    const strokeLength = lineLength;
    const half = strokeLength / 2;
    const svgSize = Math.max(lineLength + 80, 120);

    return (
      <>
        <svg
          className="absolute z-20 overflow-visible"
          width={svgSize}
          height={svgSize}
          style={{
            left: centerX - svgSize / 2,
            top: centerY - svgSize / 2,
          }}
        >
          <defs>
            <linearGradient id="winLineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(250,204,21,0.9)" />
              <stop offset="50%" stopColor="rgba(253,224,71,1)" />
              <stop offset="100%" stopColor="rgba(250,204,21,0.9)" />
            </linearGradient>
            <filter id="winLineGlow">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <line
            x1={svgSize / 2 - half}
            y1={svgSize / 2}
            x2={svgSize / 2 + half}
            y2={svgSize / 2}
            stroke="url(#winLineGradient)"
            strokeWidth="6"
            strokeLinecap="round"
            fill="none"
            filter="url(#winLineGlow)"
            style={{
              strokeDasharray: strokeLength,
              strokeDashoffset: strokeLength,
              transformOrigin: `${svgSize / 2}px ${svgSize / 2}px`,
              transform: `rotate(${lineAngle}deg)`,
              animation: 'drawLine 0.6s ease-out 0.15s forwards',
            }}
          />
        </svg>

        {winningPositions.map(([row, col], index) => (
          <div
            key={index}
            className="absolute rounded-full z-30 winning-stone-glow"
            style={{
              width: `${cellSize * 0.8}px`,
              height: `${cellSize * 0.8}px`,
              left: `${col * cellSize + cellSize * 0.1}px`,
              top: `${row * cellSize + cellSize * 0.1}px`,
              animationDelay: `${0.2 + index * 0.08}s`,
            }}
          />
        ))}
      </>
    );
  };

  const handleCellClick = (row: number, col: number) => {
    if (!disabled && !isLoading && board[row][col] === 0) {
      if (soundSettings.enabled && soundSettings.stonePlace) {
        playStonePlace();
      }
      
      // Trigger ripple effect
      setRippleEffect([row, col]);
      setTimeout(() => setRippleEffect(null), 600);
      
      onCellClick(row, col);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent, row: number, col: number) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleCellClick(row, col);
    }
  };

  return (
    <div 
      className="relative rounded-2xl shadow-2xl overflow-hidden"
      style={{ 
        width: BOARD_SIZE + 64, 
        height: BOARD_SIZE + 64,
        minWidth: BOARD_SIZE + 64,
        minHeight: BOARD_SIZE + 64,
        background: 'linear-gradient(145deg, #c4a574 0%, #8b6914 30%, #6b4423 70%, #4a3520 100%)',
        border: '8px solid #5d4e37',
        boxShadow: 'inset 0 0 60px rgba(0,0,0,0.15), 0 20px 50px rgba(0,0,0,0.4), 0 0 0 2px rgba(139,105,20,0.3)',
      }}
    >
      {/* Enhanced loading overlay */}
      {isLoading && (
        <div className="loading-overlay">
          <div className="bg-white/95 backdrop-blur-md rounded-2xl p-6 shadow-2xl border border-white/20">
            <div className="flex flex-col items-center">
              <div className="relative">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-200 border-t-indigo-600"></div>
                <div className="absolute inset-0 animate-ping rounded-full h-12 w-12 border-2 border-indigo-400 opacity-20"></div>
              </div>
              <p className="text-gray-700 mt-4 text-sm font-semibold animate-pulse">AI is thinking...</p>
              <div className="flex space-x-1 mt-2">
                <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        </div>
      )}
      <div 
        className="relative m-6 board-3d"
        style={{ 
          width: BOARD_SIZE,
          height: BOARD_SIZE,
        }}
      >
        {/* Grid lines */}
        {Array.from({ length: DISPLAY_SIZE }, (_, i) => (
          <React.Fragment key={i}>
            <div
              className="absolute w-[1px] shadow-sm"
              style={{
                left: `${cellSize * i}px`,
                top: '0px',
                height: `${BOARD_SIZE}px`,
                background: 'linear-gradient(to bottom, rgba(90,60,35,0.85), rgba(60,40,22,0.9))',
                animation: `fadeIn 0.5s ease-out ${i * 0.02}s both`
              }}
            />
            <div
              className="absolute h-[1px] shadow-sm"
              style={{
                top: `${cellSize * i}px`,
                left: '0px',
                width: `${BOARD_SIZE}px`,
                background: 'linear-gradient(to right, rgba(90,60,35,0.85), rgba(60,40,22,0.9))',
                animation: `fadeIn 0.5s ease-out ${i * 0.02}s both`
              }}
            />
          </React.Fragment>
        ))}

        {renderWinningLine()}

        {/* Intersection points for gameplay (19x19) */}
        <div className="absolute inset-0 grid"
          style={{ 
            gridTemplateColumns: `repeat(${GRID_SIZE}, ${cellSize}px)`,
            gridTemplateRows: `repeat(${GRID_SIZE}, ${cellSize}px)`,
            transform: `translate(${-cellSize/2}px, ${-cellSize/2}px)`,
          }}
        >
          {board.map((row, i) =>
            row.map((cell, j) => {
              const isHovered = hoveredCell && hoveredCell[0] === i && hoveredCell[1] === j;
              const isHint = hintPosition && hintPosition[0] === i && hintPosition[1] === j;
              const isRipple = rippleEffect && rippleEffect[0] === i && rippleEffect[1] === j;
              const isWinning = winningLine && (() => {
                const { start, end } = winningLine;
                const dx = end[1] - start[1];
                const dy = end[0] - start[0];
                
                // Normalize the direction to get unit vector
                const length = Math.sqrt(dx * dx + dy * dy);
                const unitDx = dx / length;
                const unitDy = dy / length;
                
                // Check if this position is part of the winning line
                for (let k = 0; k < 5; k++) {
                  const x = Math.round(start[1] + unitDx * k);
                  const y = Math.round(start[0] + unitDy * k);
                  if (y === i && x === j) {
                    return true;
                  }
                }
                return false;
              })();
              
              return (
                <button
                  key={`${i}-${j}`}
                  className={`board-intersection ${disabled || isLoading ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                  onClick={() => handleCellClick(i, j)}
                  onKeyDown={(e) => handleKeyPress(e, i, j)}
                  onMouseEnter={() => {
                    setHoveredCell([i, j]);
                    if (soundSettings.enabled && soundSettings.hover && cell === 0) {
                      playHover();
                    }
                  }}
                  onMouseLeave={() => setHoveredCell(null)}
                  disabled={disabled || isLoading || cell !== 0}
                  aria-label={`Intersection at row ${i + 1}, column ${j + 1}${cell !== 0 ? `, occupied by ${cell === 1 ? 'black' : 'white'} stone` : ', empty'}`}
                  tabIndex={cell === 0 ? 0 : -1}
                >
                  {cell !== 0 && (
                    <div 
                      className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full stone-glossy
                        ${cell === 1 ? 'stone-black-glossy' : 'stone-white-glossy'}
                        ${isWinning ? 'winning-stone-pulse' : 'stone-drop'}
                        ${isRipple ? 'animate-ripple' : ''}`}
                      style={{ 
                        width: `${Math.max(cellSize * 0.8, 16)}px`, 
                        height: `${Math.max(cellSize * 0.8, 16)}px`,
                        ...(isWinning && {
                          boxShadow: '0 0 20px rgba(250, 204, 21, 0.8), inset -2px -2px 4px rgba(0,0,0,0.2), inset 2px 2px 4px rgba(255,255,255,0.3)',
                          zIndex: 25
                        })
                      }}
                    />
                  )}
                  {isHint && cell === 0 && (
                    <div 
                      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-indigo-500 animate-pulse shadow-lg" 
                      style={{ 
                        width: `${Math.max(cellSize * 0.8, 16)}px`, 
                        height: `${Math.max(cellSize * 0.8, 16)}px`,
                        boxShadow: '0 0 10px rgba(99, 102, 241, 0.5)'
                      }}
                    />
                  )}
                  {isHovered && cell === 0 && !isHint && (
                    <div 
                      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-blue-400/60 to-indigo-400/60 animate-scale-in shadow-md" 
                      style={{ 
                        width: `${Math.max(cellSize * 0.6, 14)}px`, 
                        height: `${Math.max(cellSize * 0.6, 14)}px`,
                        boxShadow: '0 0 8px rgba(59, 130, 246, 0.4)'
                      }}
                    />
                  )}
                  {/* Ripple effect overlay */}
                  {isRipple && (
                    <div 
                      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-blue-400 animate-ripple" 
                      style={{ 
                        width: `${Math.max(cellSize * 1.2, 20)}px`, 
                        height: `${Math.max(cellSize * 1.2, 20)}px`,
                        opacity: 0.6
                      }}
                    />
                  )}
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}