import React, { useState, useEffect } from 'react';
import { Clock, Trophy, User, Bot, Calendar, BarChart3, Trash2, RotateCcw } from 'lucide-react';

interface GameRecord {
  id: string;
  date: string;
  winner: string;
  player1: string;
  player2: string;
  totalMoves: number;
  duration: number;
  gameMode: 'pvp' | 'ai';
  aiDifficulty?: string;
}

interface GameHistoryProps {
  className?: string;
  onReplayGame?: (gameId: string) => void;
}

export default function GameHistory({ className = '', onReplayGame }: GameHistoryProps) {
  const [games, setGames] = useState<GameRecord[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    // Load games from localStorage
    const savedGames = localStorage.getItem('gomoku-game-history');
    if (savedGames) {
      setGames(JSON.parse(savedGames));
    }
  }, []);

  const saveGame = (game: Omit<GameRecord, 'id'>) => {
    const newGame: GameRecord = {
      ...game,
      id: Date.now().toString()
    };
    
    const updatedGames = [newGame, ...games].slice(0, 50); // Keep last 50 games
    setGames(updatedGames);
    localStorage.setItem('gomoku-game-history', JSON.stringify(updatedGames));
  };

  const clearHistory = () => {
    setGames([]);
    localStorage.removeItem('gomoku-game-history');
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getWinnerIcon = (winner: string, gameMode: string) => {
    if (gameMode === 'ai') {
      return winner.toLowerCase().includes('ai') || winner.toLowerCase().includes('bot') 
        ? <Bot className="w-4 h-4 text-purple-400" />
        : <User className="w-4 h-4 text-blue-400" />;
    }
    return <Trophy className="w-4 h-4 text-yellow-400" />;
  };

  const getGameStats = () => {
    if (games.length === 0) return null;
    
    const totalGames = games.length;
    const playerWins = games.filter(g => !g.winner.toLowerCase().includes('ai') && !g.winner.toLowerCase().includes('bot')).length;
    const aiWins = games.filter(g => g.winner.toLowerCase().includes('ai') || g.winner.toLowerCase().includes('bot')).length;
    const avgMoves = Math.round(games.reduce((sum, g) => sum + g.totalMoves, 0) / totalGames);
    const avgDuration = Math.round(games.reduce((sum, g) => sum + g.duration, 0) / totalGames);
    
    // Additional stats
    const winStreak = calculateWinStreak();
    const bestGame = games.reduce((best, current) => 
      current.duration < best.duration ? current : best
    );
    const longestGame = games.reduce((longest, current) => 
      current.duration > longest.duration ? current : longest
    );

    return { 
      totalGames, 
      playerWins, 
      aiWins, 
      avgMoves, 
      avgDuration, 
      winStreak,
      bestGame,
      longestGame
    };
  };

  const calculateWinStreak = () => {
    if (games.length === 0) return 0;
    
    let streak = 0;
    let currentStreak = 0;
    let lastWinner = null;
    
    for (const game of games) {
      const isPlayerWin = !game.winner.toLowerCase().includes('ai') && !game.winner.toLowerCase().includes('bot');
      
      if (lastWinner === null) {
        lastWinner = isPlayerWin;
        currentStreak = 1;
      } else if (lastWinner === isPlayerWin) {
        currentStreak++;
      } else {
        streak = Math.max(streak, currentStreak);
        currentStreak = 1;
        lastWinner = isPlayerWin;
      }
    }
    
    return Math.max(streak, currentStreak);
  };

  const stats = getGameStats();

  return (
    <div className={`glass-effect p-4 rounded-lg border border-white/20 shadow-xl ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-indigo-400" />
          <h3 className="text-white font-semibold">Game History</h3>
        </div>
        <button
          onClick={() => setShowHistory(!showHistory)}
          className="text-white/60 hover:text-white transition-colors text-sm"
        >
          {showHistory ? 'Hide' : 'Show'} ({games.length})
        </button>
      </div>

      {/* Game Statistics */}
      {stats && (
        <div className="space-y-3 mb-4">
          {/* Main Stats Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/5 rounded-lg p-3">
              <div className="text-white/60 text-xs">Total Games</div>
              <div className="text-white font-bold text-lg">{stats.totalGames}</div>
            </div>
            <div className="bg-white/5 rounded-lg p-3">
              <div className="text-white/60 text-xs">Win Rate</div>
              <div className="text-white font-bold text-lg">
                {Math.round((stats.playerWins / stats.totalGames) * 100)}%
              </div>
            </div>
            <div className="bg-white/5 rounded-lg p-3">
              <div className="text-white/60 text-xs">Win Streak</div>
              <div className="text-white font-bold text-lg">{stats.winStreak}</div>
            </div>
            <div className="bg-white/5 rounded-lg p-3">
              <div className="text-white/60 text-xs">Avg Moves</div>
              <div className="text-white font-bold text-lg">{stats.avgMoves}</div>
            </div>
          </div>
          
          {/* Performance Highlights */}
          <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-lg p-3 border border-indigo-400/20">
            <div className="text-white/80 text-sm font-semibold mb-2">Performance Highlights</div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="text-white/70">
                <span className="text-green-400">Fastest Win:</span> {formatDuration(stats.bestGame.duration)}
              </div>
              <div className="text-white/70">
                <span className="text-orange-400">Longest Game:</span> {formatDuration(stats.longestGame.duration)}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Game History List */}
      {showHistory && (
        <div className="space-y-3">
          {games.length === 0 ? (
            <div className="text-center py-8 text-white/60">
              <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No games played yet</p>
              <p className="text-sm">Start playing to see your history!</p>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center">
                <span className="text-white/80 text-sm">Recent Games</span>
                <button
                  onClick={clearHistory}
                  className="text-red-400 hover:text-red-300 transition-colors text-xs flex items-center gap-1"
                >
                  <Trash2 className="w-3 h-3" />
                  Clear
                </button>
              </div>
              
              <div className="max-h-64 overflow-y-auto space-y-2">
                {games.map((game) => (
                  <div
                    key={game.id}
                    className="bg-white/5 rounded-lg p-3 border border-white/10"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getWinnerIcon(game.winner, game.gameMode)}
                        <span className="text-white font-semibold text-sm">
                          {game.winner}
                        </span>
                        <span className="text-white/60 text-xs">
                          won
                        </span>
                      </div>
                      <div className="text-white/40 text-xs">
                        {new Date(game.date).toLocaleDateString()}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-white/60">
                      <div className="flex items-center gap-4">
                        <span>{game.player1} vs {game.player2}</span>
                        {game.gameMode === 'ai' && game.aiDifficulty && (
                          <span className="bg-purple-500/20 text-purple-300 px-2 py-1 rounded">
                            {game.aiDifficulty}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatDuration(game.duration)}
                        </span>
                        <span>{game.totalMoves} moves</span>
                        {onReplayGame && (
                          <button
                            onClick={() => onReplayGame(game.id)}
                            className="text-blue-400 hover:text-blue-300 transition-colors"
                            title="Replay this game"
                          >
                            <RotateCcw className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

// Export function to save game results
export const saveGameResult = (gameData: Omit<GameRecord, 'id'>) => {
  const savedGames = localStorage.getItem('gomoku-game-history');
  const games = savedGames ? JSON.parse(savedGames) : [];
  
  const newGame: GameRecord = {
    ...gameData,
    id: Date.now().toString()
  };
  
  const updatedGames = [newGame, ...games].slice(0, 50);
  localStorage.setItem('gomoku-game-history', JSON.stringify(updatedGames));
};
