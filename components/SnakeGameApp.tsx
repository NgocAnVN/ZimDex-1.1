
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Trophy, RefreshCcw, Play } from 'lucide-react';

const GRID_SIZE = 20;
const CELL_SIZE = 20;
const INITIAL_SNAKE = [[10, 10]];
const INITIAL_DIR = [0, -1]; // Moving Up
const SPEED = 150;

export const SnakeGameApp: React.FC = () => {
  const [snake, setSnake] = useState<number[][]>(INITIAL_SNAKE);
  const [food, setFood] = useState<number[]>([5, 5]);
  const [direction, setDirection] = useState<number[]>(INITIAL_DIR);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  
  // Refs for mutable state in interval
  const directionRef = useRef(INITIAL_DIR);
  const gameLoopRef = useRef<any>(null);

  useEffect(() => {
    const saved = localStorage.getItem('zimdex-snake-highscore');
    if (saved) setHighScore(parseInt(saved));
  }, []);

  const generateFood = useCallback(() => {
    const x = Math.floor(Math.random() * (30 - 2)) + 1; // Width approx 30 cols
    const y = Math.floor(Math.random() * (20 - 2)) + 1; // Height approx 20 rows
    return [x, y];
  }, []);

  const startGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIR);
    directionRef.current = INITIAL_DIR;
    setFood(generateFood());
    setScore(0);
    setIsGameOver(false);
    setIsPlaying(true);
  };

  const endGame = () => {
    setIsPlaying(false);
    setIsGameOver(true);
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('zimdex-snake-highscore', score.toString());
    }
    if (gameLoopRef.current) clearInterval(gameLoopRef.current);
  };

  // Input Handling
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isPlaying) return;
      
      const key = e.key;
      const current = directionRef.current;

      // Prevent reversing directly
      if (key === 'ArrowUp' && current[1] !== 1) directionRef.current = [0, -1];
      if (key === 'ArrowDown' && current[1] !== -1) directionRef.current = [0, 1];
      if (key === 'ArrowLeft' && current[0] !== 1) directionRef.current = [-1, 0];
      if (key === 'ArrowRight' && current[0] !== -1) directionRef.current = [1, 0];
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying]);

  // Game Loop
  useEffect(() => {
    if (isPlaying) {
      gameLoopRef.current = setInterval(() => {
        setSnake((prevSnake) => {
          const newHead = [
            prevSnake[0][0] + directionRef.current[0],
            prevSnake[0][1] + directionRef.current[1]
          ];

          // Wall Collision
          if (
            newHead[0] < 0 || 
            newHead[0] >= 38 || // Approx width in grid cells
            newHead[1] < 0 || 
            newHead[1] >= 23    // Approx height in grid cells
          ) {
            endGame();
            return prevSnake;
          }

          // Self Collision
          for (const segment of prevSnake) {
            if (newHead[0] === segment[0] && newHead[1] === segment[1]) {
              endGame();
              return prevSnake;
            }
          }

          const newSnake = [newHead, ...prevSnake];

          // Food Collision
          if (newHead[0] === food[0] && newHead[1] === food[1]) {
            setScore(s => s + 10);
            setFood(generateFood());
            // Don't pop tail, so it grows
          } else {
            newSnake.pop();
          }

          return newSnake;
        });
      }, SPEED);
    }

    return () => clearInterval(gameLoopRef.current);
  }, [isPlaying, food, generateFood]);

  return (
    <div className="w-full h-full bg-[#1a1b26]/95 backdrop-blur-xl flex flex-col text-white font-mono relative overflow-hidden">
       {/* Header / Scoreboard */}
       <div className="h-14 border-b border-white/10 bg-black/20 flex items-center justify-between px-6">
          <div className="flex items-center gap-2 text-green-400 font-bold text-lg tracking-widest">
             SNAKE_OS <span className="text-[10px] bg-green-500/20 px-1 py-0.5 rounded text-green-300">v1.0</span>
          </div>
          <div className="flex items-center gap-6">
             <div className="flex flex-col items-end">
                <span className="text-[10px] text-gray-500 uppercase">Score</span>
                <span className="font-bold text-xl leading-none">{score}</span>
             </div>
             <div className="flex flex-col items-end">
                <span className="text-[10px] text-yellow-600 uppercase">High</span>
                <div className="flex items-center gap-1 text-yellow-500">
                   <Trophy size={12} />
                   <span className="font-bold text-lg leading-none">{highScore}</span>
                </div>
             </div>
          </div>
       </div>

       {/* Game Board */}
       <div className="flex-1 relative bg-[#0f0f14]/80 m-4 rounded-xl border border-white/5 shadow-inner overflow-hidden">
          {/* Grid Background Pattern */}
          <div 
            className="absolute inset-0 opacity-10" 
            style={{ 
                backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)',
                backgroundSize: '20px 20px'
            }} 
          />

          {!isPlaying && !isGameOver && (
             <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-black/60 backdrop-blur-sm">
                <button 
                  onClick={startGame}
                  className="group relative px-8 py-3 bg-green-600 hover:bg-green-500 text-white font-bold rounded-full transition-all shadow-[0_0_20px_rgba(34,197,94,0.4)] hover:scale-105 active:scale-95 flex items-center gap-2"
                >
                   <Play size={20} fill="currentColor" />
                   START GAME
                </button>
                <p className="mt-4 text-gray-400 text-xs">Use Arrow Keys to Move</p>
             </div>
          )}

          {isGameOver && (
             <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-red-900/20 backdrop-blur-md">
                <h2 className="text-4xl font-bold text-red-500 mb-2 tracking-wider drop-shadow-lg">GAME OVER</h2>
                <p className="text-gray-300 mb-6">Final Score: {score}</p>
                <button 
                  onClick={startGame}
                  className="px-6 py-2 bg-white/10 hover:bg-white/20 border border-white/10 text-white rounded-lg transition-all flex items-center gap-2"
                >
                   <RefreshCcw size={16} />
                   Try Again
                </button>
             </div>
          )}

          {/* Rendering Snake & Food */}
          <div className="relative w-full h-full">
             {/* Food */}
             <div 
               style={{
                 position: 'absolute',
                 left: food[0] * 20 + 20, // Offset for padding
                 top: food[1] * 20 + 20,
                 width: 20,
                 height: 20,
               }}
               className="bg-red-500 rounded-full shadow-[0_0_15px_rgba(239,68,68,0.8)] animate-pulse"
             />

             {/* Snake */}
             {snake.map((segment, i) => (
                <div 
                  key={i}
                  style={{
                    position: 'absolute',
                    left: segment[0] * 20 + 20,
                    top: segment[1] * 20 + 20,
                    width: 20,
                    height: 20,
                  }}
                  className={`${i === 0 ? 'bg-white z-10' : 'bg-green-500'} rounded-sm border border-black/20 shadow-[0_0_10px_rgba(34,197,94,0.5)]`}
                >
                   {/* Eyes for head */}
                   {i === 0 && (
                      <div className="relative w-full h-full">
                         <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-black rounded-full" />
                         <div className="absolute top-1 left-1 w-1.5 h-1.5 bg-black rounded-full" />
                      </div>
                   )}
                </div>
             ))}
          </div>
       </div>
    </div>
  );
};
