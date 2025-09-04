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
    const startX = start[1] * cellSize;
    const startY = start[0] * cellSize;
    const endX = end[1] * cellSize;
    const endY = end[0] * cellSize;

    // Calculate line length and angle
    const dx = endX - startX;
    const dy = endY - startY;
    const length = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan2(dy, dx) * (180 / Math.PI);

    return (
      <div
        className="absolute bg-green-500 rounded-full transform -translate-x-1/2 -translate-y-1/2 z-20"
        style={{
          width: `${length}px`,
          height: '4px',
          left: startX,
          top: startY,
          transformOrigin: 'left',
          transform: `rotate(${angle}deg)`,
        }}
      />
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
              const isWinning = winningLine && (
                (winningLine.start[0] === i && winningLine.start[1] === j) ||
                (winningLine.end[0] === i && winningLine.end[1] === j)
              );
              
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
                        ${isWinning ? 'animate-win-pulse' : ''}`}
                      style={{ 
                        width: `${Math.max(cellSize * 0.8, 16)}px`, 
                        height: `${Math.max(cellSize * 0.8, 16)}px` 
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