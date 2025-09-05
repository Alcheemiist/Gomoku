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
  const [lastMove, setLastMove] = useState<[number, number] | null>(null);
  const [lastMovePlayer, setLastMovePlayer] = useState<1 | 2 | null>(null);
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
    
    // Calculate the direction vector
    const dx = end[1] - start[1];
    const dy = end[0] - start[0];
    
    // Normalize the direction to get unit vector
    const length = Math.sqrt(dx * dx + dy * dy);
    const unitDx = dx / length;
    const unitDy = dy / length;
    
    // Calculate all 5 positions in the winning line
    const winningPositions: [number, number][] = [];
    
    // Generate exactly 5 consecutive positions
    for (let i = 0; i < 5; i++) {
      const x = Math.round(start[1] + unitDx * i);
      const y = Math.round(start[0] + unitDy * i);
      winningPositions.push([y, x]);
    }

    return (
      <>
        {/* Winning line connecting all 5 stones */}
        <div
          className="absolute bg-yellow-400 rounded-full transform -translate-x-1/2 -translate-y-1/2 z-20 shadow-lg"
          style={{
            width: `${Math.sqrt((end[1] - start[1]) * cellSize * (end[1] - start[1]) * cellSize + (end[0] - start[0]) * cellSize * (end[0] - start[0]) * cellSize)}px`,
            height: '6px',
            left: `${start[1] * cellSize + cellSize/2}px`,
            top: `${start[0] * cellSize + cellSize/2}px`,
            transform: `translate(-50%, -50%) rotate(${Math.atan2((end[0] - start[0]) * cellSize, (end[1] - start[1]) * cellSize) * (180 / Math.PI)}deg)`,
            boxShadow: '0 0 10px rgba(255, 255, 0, 0.8)',
          }}
        />
        
        {/* Highlight all 5 winning stones */}
        {winningPositions.map(([row, col], index) => (
          <div
            key={index}
            className="absolute rounded-full border-4 border-yellow-400 z-30 animate-pulse"
            style={{
              width: `${cellSize * 0.8}px`,
              height: `${cellSize * 0.8}px`,
              left: `${col * cellSize + cellSize * 0.1}px`,
              top: `${row * cellSize + cellSize * 0.1}px`,
              boxShadow: '0 0 15px rgba(255, 255, 0, 1), inset 0 0 10px rgba(255, 255, 0, 0.5)',
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
      
      // Set last move for animation
      setLastMove([row, col]);
      
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
    <div className="relative bg-gradient-to-br from-amber-50 to-amber-100 p-8 rounded-2xl shadow-2xl border border-amber-200" style={{ 
      width: BOARD_SIZE + 64, 
      height: BOARD_SIZE + 64,
      minWidth: BOARD_SIZE + 64,
      minHeight: BOARD_SIZE + 64
    }}>
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
        className="relative"
        style={{ 
          width: BOARD_SIZE,
          height: BOARD_SIZE,
        }}
      >
        {/* Enhanced Grid lines with subtle animations */}
        {Array.from({ length: DISPLAY_SIZE }, (_, i) => (
          <React.Fragment key={i}>
            {/* Vertical lines */}
            <div
              className="absolute bg-gradient-to-b from-[#855E42] to-[#6B4423] w-[1px] shadow-sm"
              style={{
                left: `${cellSize * i}px`,
                top: '0px',
                height: `${BOARD_SIZE}px`,
                animation: `fadeIn 0.5s ease-out ${i * 0.02}s both`
              }}
            />
            {/* Horizontal lines */}
            <div
              className="absolute bg-gradient-to-r from-[#855E42] to-[#6B4423] h-[1px] shadow-sm"
              style={{
                top: `${cellSize * i}px`,
                left: '0px',
                width: `${BOARD_SIZE}px`,
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
              const isLastMove = lastMove && lastMove[0] === i && lastMove[1] === j;
              const isRipple = rippleEffect && rippleEffect[0] === i && rippleEffect[1] === j;
              const isWinning = winningLine && (() => {
                const { start, end } = winningLine;
                const dx = end[1] - start[1];
                const dy = end[0] - start[0];
                
                // Check if this position is part of the winning line
                for (let k = 0; k < 5; k++) {
                  const x = start[1] + (dx / 4) * k;
                  const y = start[0] + (dy / 4) * k;
                  if (Math.round(y) === i && Math.round(x) === j) {
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
                      className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full
                        ${cell === 1 ? 'stone-black' : 'stone-white'}
                        ${isWinning ? 'animate-win-pulse border-4 border-yellow-400 shadow-lg' : ''}
                        ${isLastMove ? 'animate-bounce-in ring-4 ring-blue-400 ring-opacity-50' : 'animate-stone-place'}
                        ${isRipple ? 'animate-ripple' : ''}`}
                      style={{ 
                        width: `${Math.max(cellSize * 0.8, 16)}px`, 
                        height: `${Math.max(cellSize * 0.8, 16)}px`,
                        ...(isWinning && {
                          boxShadow: '0 0 20px rgba(255, 255, 0, 0.8), inset 0 0 10px rgba(255, 255, 0, 0.3)',
                          zIndex: 25
                        }),
                        ...(isLastMove && {
                          boxShadow: '0 0 15px rgba(59, 130, 246, 0.6), inset 0 0 8px rgba(59, 130, 246, 0.2)',
                          zIndex: 20
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