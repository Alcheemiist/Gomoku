import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import { useTheme } from '../context/ThemeContext';
import Board from '../components/Board';
import ThemeToggle from '../components/ThemeToggle';
import PlayerInfo from '../components/PlayerInfo';
import WinnerModal from '../components/WinnerModal';
import AIStatistics from '../components/AIStatistics';
import AIMoveAnalysis from '../components/AIMoveAnalysis';
import AIThinkingIndicator from '../components/AIThinkingIndicator';
import type { WinningLine } from '../types/game';
import { ArrowLeft } from 'lucide-react';
import axios from 'axios';
import config from '../Config';
import toast from 'react-hot-toast';

export default function PlayerVsAI() {
  const navigate = useNavigate();
  const { difficulty } = useGame();
  const { theme } = useTheme();
  const [playerName, setPlayerNameState] = useState('');
  const [playerAIName, setPlayerAINameState] = useState('');
  const [board, setBoard] = useState<number[][]>(
    Array(19)
      .fill(0)
      .map(() => Array(19).fill(0))
  );
  const [currentPlayer, setCurrentPlayer] = useState<1 | 2>(1);
  const [AIPlayerIndex, setAIPlayerIndex] = useState(0);
  const [turns, setTurns] = useState(1);
  const [playerTime, setPlayerTime] = useState(0);
  const [aiTime, setAiTime] = useState(0);
  const [playerCaptured, setPlayerCaptured] = useState(0);
  const [aiCaptured, setAiCaptured] = useState(0);
  const [winner, setWinner] = useState<string | null>(null);
  const [winningLine, setWinningLine] = useState<WinningLine>(null);
  const [showWinnerModal, setShowWinnerModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [lastMoveTime, setLastMoveTime] = useState<number>(Date.now());
  const [aiThinkingTime, setAiThinkingTime] = useState<number>(0);
  const [aiThinkingStart, setAiThinkingStart] = useState<number | null>(null);
  
  // AI Statistics
  const [aiStats, setAiStats] = useState({
    totalMoves: 0,
    averageThinkingTime: 0,
    fastestMove: Infinity,
    slowestMove: 0,
    difficulty: difficulty,
    winRate: 0.75, // Mock data
    totalGames: 1,
    currentGameTime: 0,
    nodesEvaluated: 0,
    depthReached: 0
  });
  
  const [thinkingTimes, setThinkingTimes] = useState<number[]>([]);
  
  // AI Move Analysis
  const [lastMoveAnalysis, setLastMoveAnalysis] = useState<{
    position: [number, number];
    score: number;
    reasoning: string;
    depth: number;
    nodesEvaluated: number;
  } | null>(null);


  const generateMoveReasoning = (x: number, y: number, thinkingTime: number): string => {
    const reasons = [
      "Strategic center control for board dominance",
      "Blocking opponent's potential winning sequence",
      "Creating multiple threat lines simultaneously",
      "Defensive positioning to prevent capture",
      "Building towards a winning combination",
      "Controlling key intersection points",
      "Responding to opponent's last move",
      "Setting up future tactical opportunities",
      "Exploiting opponent's weak formation",
      "Strengthening defensive perimeter",
      "Creating forcing moves for advantage",
      "Maintaining initiative in the position"
    ];
    
    const timeBasedReason = thinkingTime > 2 ? "Deep analysis of complex position" : "Quick tactical response";
    const randomReason = reasons[Math.floor(Math.random() * reasons.length)];
    
    return `${timeBasedReason}. ${randomReason} at position (${x + 1}, ${y + 1}).`;
  };

  const getGamePhase = (turns: number): 'opening' | 'midgame' | 'endgame' => {
    if (turns <= 20) return 'opening';
    if (turns <= 100) return 'midgame';
    return 'endgame';
  };

  const generateAlternativeMoves = (x: number, y: number) => {
    const alternatives = [];
    for (let i = 0; i < 3; i++) {
      const altX = Math.max(0, Math.min(18, x + Math.floor(Math.random() * 5) - 2));
      const altY = Math.max(0, Math.min(18, y + Math.floor(Math.random() * 5) - 2));
      if (altX !== x || altY !== y) {
        alternatives.push({
          position: [altX, altY] as [number, number],
          score: Math.floor(Math.random() * 100) - 50,
          reasoning: "Alternative strategic option"
        });
      }
    }
    return alternatives.slice(0, 2);
  };


  const get_Players_Name = async () => {
    try {
      const response = await axios.get(
        `${config.serverUrl}/api/game/players_name`,
        { headers: config.headers_data }
      );
      setPlayerNameState(response.data.message[0]);
      setPlayerAINameState(response.data.message[1]);
    } catch (error) {
      console.error('Error fetching players name:', error);
    }
  };

  const get_AiPlayer_index = async () => {
    try {
      const response = await axios.get(
        `${config.serverUrl}/api/game/ai_player`,
        { headers: config.headers_data }
      );
      setAIPlayerIndex(response.data.message+1)
    } catch (error) {
      console.error('Error fetching ai index:', error);
    }
  }

  const set_Captured = async () => {
    try {
      const response = await axios.get(
        `${config.serverUrl}/api/game/captured`,
        { headers: config.headers_data }
      );
      setPlayerCaptured(response.data.message[0]);
      setAiCaptured(response.data.message[1]);
    } catch (error) {
      console.error('Error fetching captured:', error);
    }
  };

  const set_Turns = async () => {
    try {
      const response = await axios.get(`${config.serverUrl}/api/game/turns`, {
        headers: config.headers_data,
      });
      setTurns(response.data.message);
    } catch (error) {
      console.error('Error fetching turns:', error);
    }
  };

  const set_CurrentPlayer = async () => {
    try {
      const response = await axios.get(
        `${config.serverUrl}/api/game/currentPlayer`,
        { headers: config.headers_data }
      );
      setCurrentPlayer(response.data.message + 1);
    } catch (error) {
      console.error('Error fetching current player:', error);
    }
  };

  const get_board = async () => {
    try {
      const response = await axios.get(`${config.serverUrl}/api/game/board`, {
        headers: config.headers_data,
      });
      setBoard(response.data.message);
    } catch (error) {
      console.error('Error fetching board:', error);
    }
  };

  const checkWinner = async () => {
    try {
      const response = await axios.get(
        `${config.serverUrl}/api/game/winner`,
        { headers: config.headers_data }
      );
      if (response.data.message !== null) {
        setWinner(response.data.message.winner_name);
        setWinningLine(response.data.message.winning_line ?? null);
        setShowWinnerModal(true);
        return true;
      }
    } catch (error) {
      console.error('Error fetching winner:', error);
    }
    return false;
  };

  const initializeGame = async () => {
    try {
      // Sync current difficulty to backend so the new game uses it
      await axios.post(
        `${config.serverUrl}/api/settings/difficulty/${difficulty}`,
        { difficulty },
        { headers: config.headers_data }
      );
      const response = await axios.post(
        `${config.serverUrl}/api/game/init`,
        { isAI: true },
        { headers: config.headers_data }
      );
      console.log('Game initialized:', response.data.message);
    } catch (error) {
      console.error('Error initializing game:', error);
    }

    await get_board();
    await set_CurrentPlayer();
    await set_Turns();
    await set_Captured();
    await get_Players_Name();
    await get_AiPlayer_index()
  };

  useEffect(() => {
    initializeGame();
  }, []);

  useEffect(() => {
    if (winner) {
      setShowWinnerModal(true);
    }
  }, [winner]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (!winner) {
        const now = Date.now();
        const elapsed = (now - lastMoveTime) / 1000;
        if (currentPlayer === 1) {
          setPlayerTime(elapsed);
        } else {
          setAiTime(elapsed);
        }
      }
    }, 100);

    return () => clearInterval(timer);
  }, [currentPlayer, winner, lastMoveTime]);

  const findBestMove = async () => {
    if (winner) return null;
    try {
      const response = await axios.get(
        `${config.serverUrl}/api/game/best_move`,
        { headers: config.headers_data }
      );
      const x = response.data.x;
      const y = response.data.y;
      const thinkingTimeSeconds = response.data.thinking_time_seconds ?? null;
      const depthUsed = response.data.depth_used ?? 0;
      const nodesEvaluated = response.data.nodes_evaluated ?? 0;
      return {
        move: [x, y] as [number, number],
        thinkingTimeSeconds,
        depthUsed,
        nodesEvaluated
      };
    } catch (error) {
      console.error('Error fetching best move:', error);
      return null;
    }
  };

  const makeAiMove = async () => {
    if (winner) return;

    setAiThinkingStart(Date.now());
    const result = await findBestMove();
    if (!result) {
      setAiThinkingStart(null);
      return;
    }
    const { move: bestMove, thinkingTimeSeconds: backendThinkingTime, depthUsed, nodesEvaluated } = result;
    const [x, y] = bestMove;

    try {
      const response = await axios.post(
        `${config.serverUrl}/api/game/move`,
        { x: x, y: y },
        { headers: config.headers_data }
      );
      if (response.data.played) {
        await get_board();
        await set_Captured();
        await set_Turns();
        const hasWinner = await checkWinner();
        if (hasWinner) {
          return;
        }
        await set_CurrentPlayer();
        setPlayerTime(0);
        setAiTime(0);
        setLastMoveTime(Date.now());
      } else {
        toast.error('Invalid move');
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        toast.error(`Error making move: ${error.response.data.message}`);
      } else {
        toast.error('Error making move');
      }
    } finally {
      if (aiThinkingStart && !winner) {
        const thinkingTime = backendThinkingTime != null && backendThinkingTime >= 0
          ? backendThinkingTime
          : (Date.now() - aiThinkingStart) / 1000;
        setAiThinkingTime(thinkingTime);
        setAiThinkingStart(null);
        
        // Update AI statistics (use real depth/nodes from backend)
        const newThinkingTimes = [...thinkingTimes, thinkingTime];
        setThinkingTimes(newThinkingTimes);

        setAiStats(prev => ({
          ...prev,
          totalMoves: prev.totalMoves + 1,
          averageThinkingTime: newThinkingTimes.reduce((a, b) => a + b, 0) / newThinkingTimes.length,
          fastestMove: Math.min(prev.fastestMove, thinkingTime),
          slowestMove: Math.max(prev.slowestMove, thinkingTime),
          nodesEvaluated: prev.nodesEvaluated + (nodesEvaluated ?? 0),
          depthReached: Math.max(prev.depthReached, depthUsed ?? 0)
        }));

                const analysis = {
                  position: [x, y] as [number, number],
                  score: 0,
                  reasoning: generateMoveReasoning(x, y, thinkingTime),
                  depth: depthUsed ?? 0,
                  nodesEvaluated: nodesEvaluated ?? 0,
                  thinkingTime: thinkingTime,
                  alternativeMoves: generateAlternativeMoves(x, y),
                  gamePhase: getGamePhase(turns),
                  strategicValue: 0
                };
                
                setLastMoveAnalysis(analysis);
                
      }
    }
  };

  useEffect(() => {
    if (currentPlayer === AIPlayerIndex && !winner) {
      const timeout = setTimeout(makeAiMove, 1000);
      return () => clearTimeout(timeout);
    }
  }, [currentPlayer, winner, AIPlayerIndex]);

  // Update thinking time in real-time
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (aiThinkingStart) {
      interval = setInterval(() => {
        setAiThinkingTime((Date.now() - aiThinkingStart) / 1000);
      }, 100);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [aiThinkingStart]);

  const handleCellClick = async (row: number, col: number) => {
    if (currentPlayer === AIPlayerIndex || winner || isLoading) return;

    setIsLoading(true);

    try {
      const response = await axios.post(
        `${config.serverUrl}/api/game/move`,
        { x: col, y: row },
        { headers: config.headers_data }
      );

      if (response.data.played) {
        await get_board();
        await set_Captured();
        await set_Turns();
        const hasWinner = await checkWinner();
        if (hasWinner) {
          return;
        }
        await set_CurrentPlayer();
        setPlayerTime(0);
        setAiTime(0);
        setLastMoveTime(Date.now());
      } else {
        toast.error('Invalid move');
      }
    } catch (error) {
      const errorMessage = axios.isAxiosError(error) && error.response
        ? error.response.data.message
        : 'Error making move';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewGame = async () => {
    await initializeGame();
    setPlayerTime(0);
    setAiTime(0);
    setWinner(null);
    setLastMoveTime(Date.now());
    setWinningLine(null);
    setShowWinnerModal(false);
  };


  const handleBackToMenu = async () => {
    try {
      await axios.post(
        `${config.serverUrl}/api/game/delete`,
        {},
        { headers: config.headers_data }
      );
      navigate('/');
    } catch (error) {
      console.error('Error deleting game:', error);
      toast.error('Error deleting game');
    }
  };

  return (
    <div className="min-h-screen p-8">
      <button
        onClick={handleBackToMenu}
        className="absolute top-4 left-4 text-white hover:text-gray-300 flex items-center gap-2 z-40"
      >
        <ArrowLeft className="w-6 h-6" />
        Back to Menu
      </button>

      {/* Theme Toggle */}
      <div className="absolute top-4 right-4 z-40">
        <ThemeToggle />
      </div>


      <div
        className={`flex items-center justify-center gap-8 max-w-7xl mx-auto ${
          showWinnerModal ? 'blur-sm' : ''
        }`}
      >
        <PlayerInfo
          name={playerName}
          captured={playerCaptured}
          time={playerTime}
          isCurrentTurn={currentPlayer === 1}
          showHints={false}
          onToggleHints={() => {}}
          hideHints={true}
        />

        <div className="flex flex-col items-center" style={{ minHeight: '600px' }}>
          <div className="mb-4 px-6 py-2 bg-white/10 backdrop-blur rounded-full min-h-12 flex flex-col items-center justify-center gap-0.5">
            <span className="text-xl font-bold text-white">
              Turn {turns}
            </span>
            <span className="text-xs font-medium text-white/80">
              {currentPlayer === AIPlayerIndex ? "AI's turn" : 'Your turn'}
            </span>
          </div>
          
          <div className="flex-shrink-0">
            <Board
              board={board}
              onCellClick={handleCellClick}
              hintPosition={null}
              winningLine={winningLine}
              isLoading={isLoading}
              disabled={!!winner}
            />
          </div>
          

        </div>

        <div className="flex flex-col gap-4">
          <PlayerInfo
            name={playerAIName}
            captured={aiCaptured}
            time={aiTime}
            isCurrentTurn={currentPlayer === 2}
            showHints={false}
            onToggleHints={() => {}}
            hideHints={true}
          />
          
          {/* AI Statistics */}
          <AIStatistics
            stats={aiStats}
            isThinking={currentPlayer === AIPlayerIndex}
            currentThinkingTime={aiThinkingTime}
          />
          
          {/* AI Move Analysis */}
          <AIMoveAnalysis
            analysis={lastMoveAnalysis}
            isVisible={true}
          />
          
        </div>
      </div>

      {/* AI Thinking Indicator */}
      <AIThinkingIndicator
        isThinking={currentPlayer === AIPlayerIndex && !winner}
        difficulty={difficulty}
        thinkingTime={aiThinkingTime}
      />

      {showWinnerModal && winner && (
        <WinnerModal
          winner={winner}
          onNewGame={handleNewGame}
          onMainMenu={() => navigate('/')}
          onClose={() => setShowWinnerModal(false)}
        />
      )}

    </div>
  );
}