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
    
    // Calculate all 5 positions in the winning line
    const winningPositions: [number, number][] = [];
    const dx = end[1] - start[1];
    const dy = end[0] - start[0];
    
    // Generate all 5 positions
    for (let i = 0; i < 5; i++) {
      const x = start[1] + (dx / 4) * i;
      const y = start[0] + (dy / 4) * i;
      winningPositions.push([Math.round(y), Math.round(x)]);
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
    <div className="relative bg-amber-100 p-8 rounded-lg shadow-xl" style={{ 
      width: BOARD_SIZE + 64, 
      height: BOARD_SIZE + 64,
      minWidth: BOARD_SIZE + 64,
      minHeight: BOARD_SIZE + 64
    }}>
      {isLoading && (
        <div className="loading-overlay">
          <div className="bg-white/90 backdrop-blur-sm rounded-lg p-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="text-gray-700 mt-2 text-sm font-medium">AI is thinking...</p>
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
        {/* Grid lines */}
        {Array.from({ length: DISPLAY_SIZE }, (_, i) => (
          <React.Fragment key={i}>
            {/* Vertical lines */}
            <div
              className="absolute bg-[#855E42] w-[1px]"
              style={{
                left: `${cellSize * i}px`,
                top: '0px',
                height: `${BOARD_SIZE}px`,
              }}
            />
            {/* Horizontal lines */}
            <div
              className="absolute bg-[#855E42] h-[1px]"
              style={{
                top: `${cellSize * i}px`,
                left: '0px',
                width: `${BOARD_SIZE}px`,
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
                      className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full animate-stone-place
                        ${cell === 1 ? 'stone-black' : 'stone-white'}
                        ${isWinning ? 'animate-win-pulse border-4 border-yellow-400 shadow-lg' : ''}`}
                      style={{ 
                        width: `${Math.max(cellSize * 0.8, 16)}px`, 
                        height: `${Math.max(cellSize * 0.8, 16)}px`,
                        ...(isWinning && {
                          boxShadow: '0 0 20px rgba(255, 255, 0, 0.8), inset 0 0 10px rgba(255, 255, 0, 0.3)',
                          zIndex: 25
                        })
                      }}
                    />
                  )}
                  {isHint && cell === 0 && (
                    <div 
                      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-indigo-500 animate-pulse" 
                      style={{ 
                        width: `${Math.max(cellSize * 0.8, 16)}px`, 
                        height: `${Math.max(cellSize * 0.8, 16)}px` 
                      }}
                    />
                  )}
                  {isHovered && cell === 0 && !isHint && (
                    <div 
                      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-400/50" 
                      style={{ 
                        width: `${Math.max(cellSize * 0.5, 12)}px`, 
                        height: `${Math.max(cellSize * 0.5, 12)}px` 
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