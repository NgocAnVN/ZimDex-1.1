
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Utensils, Ghost, Dog, MapPin, Clock, User, ChefHat, ArrowRight, MessageCircle, CheckCircle2, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Types & Constants ---

type GameMode = 'menu' | 'intro' | 'roaming' | 'cooking' | 'dialogue' | 'night_choice' | 'ending';
type Ingredient = 'noodles' | 'beef' | 'chicken' | 'herbs' | 'onion' | 'broth' | 'special_sauce';
type EndingType = 'good' | 'neutral' | 'bad';
type Direction = 'up' | 'down' | 'left' | 'right';

const GRID_W = 16;
const GRID_H = 12;
const TILE_SIZE = 48; // px

interface Position {
  x: number;
  y: number;
}

interface Entity {
  id: string;
  pos: Position;
  type: 'player' | 'dog' | 'customer' | 'chef';
  dir: Direction;
  name?: string;
}

interface Customer {
  id: number;
  name: string;
  desc: string;
  order: Ingredient[];
  dialogue: string;
  isCreepy: boolean;
  spriteColor: string;
}

const INGREDIENTS: { id: Ingredient; label: string; color: string }[] = [
  { id: 'noodles', label: 'Rice Noodles', color: 'bg-white text-black' },
  { id: 'beef', label: 'Rare Beef', color: 'bg-red-700 text-white' },
  { id: 'chicken', label: 'Shredded Chicken', color: 'bg-yellow-200 text-black' },
  { id: 'onion', label: 'Onions', color: 'bg-green-100 text-black' },
  { id: 'herbs', label: 'Fresh Herbs', color: 'bg-green-600 text-white' },
  { id: 'broth', label: 'Bone Broth', color: 'bg-yellow-600 text-white' },
  { id: 'special_sauce', label: 'Secret Sauce', color: 'bg-purple-900 text-white' },
];

// --- Story Data ---

const STORY_LOGIC = {
  day1: {
    intro: "Welcome to No. 10 Dan Phuong. My name is Hai. This is my shop. Keep an eye on Mr. Gold, my dog. He wanders off.",
    night: "The shop is closed. It's strangely quiet tonight. Mr. Gold is staring at the wall."
  },
  day2: {
    intro: "Day 2. Grandma Hạnh came by early. She mumbled something about 'the old fire' appearing again.",
    night: "Mr. Gold is barking at the empty storage room. Do you investigate?"
  },
  day3: {
    intro: "Day 3. The customers are acting strange. They eat without chewing. Just... swallowing.",
    night: "Mr. Gold is missing."
  }
};

export const PhoAnhHaiApp: React.FC = () => {
  // --- Game State ---
  const [mode, setMode] = useState<GameMode>('menu');
  const [day, setDay] = useState(1);
  const [sanity, setSanity] = useState(100);
  const [money, setMoney] = useState(0);
  const [mrGoldStatus, setMrGoldStatus] = useState<'safe' | 'weird' | 'missing'>('safe');

  // --- Roaming State ---
  const [playerPos, setPlayerPos] = useState<Position>({ x: 8, y: 8 });
  const [playerDir, setPlayerDir] = useState<Direction>('down');
  const [mrGoldPos, setMrGoldPos] = useState<Position>({ x: 12, y: 4 });
  const [activeCustomer, setActiveCustomer] = useState<Customer | null>(null);
  const [customerPos, setCustomerPos] = useState<Position | null>(null); // Usually {x: 8, y: 5} (Counter)
  const [customersServedCount, setCustomersServedCount] = useState(0);
  
  // --- Cooking State ---
  const [currentBowl, setCurrentBowl] = useState<Ingredient[]>([]);
  const [cookingFeedback, setCookingFeedback] = useState<string | null>(null);

  // --- Narrative ---
  const [ending, setEnding] = useState<EndingType | null>(null);
  const [dialogueText, setDialogueText] = useState<string | null>(null);

  const mapRef = useRef<HTMLDivElement>(null);

  // --- Initialization ---

  const startGame = () => {
    setMode('intro');
    setDay(1);
    setSanity(100);
    setMoney(50);
    setMrGoldStatus('safe');
    setCustomersServedCount(0);
    setPlayerPos({ x: 8, y: 10 });
    setMrGoldPos({ x: 12, y: 5 });
  };

  const startDay = () => {
    setMode('roaming');
    setCustomersServedCount(0);
    spawnCustomer();
  };

  const spawnCustomer = () => {
    const isCreepyDay = day >= 2;
    const isCreepyChance = Math.random() > 0.6;

    const normalOrders: Customer[] = [
      { id: 1, name: "Office Worker", desc: "Looks tired.", order: ['noodles', 'beef', 'onion', 'broth'], dialogue: "Just a regular bowl, please.", isCreepy: false, spriteColor: 'bg-blue-500' },
      { id: 2, name: "Student", desc: "Wearing a uniform.", order: ['noodles', 'chicken', 'herbs', 'broth'], dialogue: "Chicken pho, please!", isCreepy: false, spriteColor: 'bg-green-500' },
      { id: 3, name: "Grandma Hạnh", desc: "Local elder.", order: ['noodles', 'beef', 'herbs', 'broth'], dialogue: "Make it soft, Hai.", isCreepy: false, spriteColor: 'bg-gray-400' },
    ];

    const creepyOrders: Customer[] = [
      { id: 4, name: "Pale Man", desc: "Staring unblinkingly.", order: ['noodles', 'beef', 'beef', 'broth'], dialogue: "Meat. More meat. Raw.", isCreepy: true, spriteColor: 'bg-gray-200' },
      { id: 5, name: "Shadow", desc: "Hard to focus on.", order: ['noodles', 'special_sauce', 'broth'], dialogue: "Just the liquid.", isCreepy: true, spriteColor: 'bg-black shadow-[0_0_10px_rgba(0,0,0,0.5)]' },
    ];

    const pool = (isCreepyDay && isCreepyChance) ? creepyOrders : normalOrders;
    const random = pool[Math.floor(Math.random() * pool.length)];
    
    setActiveCustomer(random);
    setCustomerPos({ x: 8, y: 4 }); // Fixed position at counter
  };

  // --- Movement System ---

  const isWalkable = (x: number, y: number): boolean => {
    // Map Boundaries
    if (x < 1 || x >= GRID_W - 1 || y < 2 || y >= GRID_H - 1) return false;

    // Counter Collision (Row 4 is counter)
    if (y === 4 && (x >= 5 && x <= 11)) return false;

    // Kitchen Objects
    if (y === 2 && (x >= 6 && x <= 10)) return false; // Stove

    return true;
  };

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (mode !== 'roaming') return;

    let dx = 0;
    let dy = 0;
    let newDir = playerDir;

    if (e.key === 'ArrowUp') { dy = -1; newDir = 'up'; }
    if (e.key === 'ArrowDown') { dy = 1; newDir = 'down'; }
    if (e.key === 'ArrowLeft') { dx = -1; newDir = 'left'; }
    if (e.key === 'ArrowRight') { dx = 1; newDir = 'right'; }

    if (dx !== 0 || dy !== 0) {
      setPlayerDir(newDir);
      const nextX = playerPos.x + dx;
      const nextY = playerPos.y + dy;

      if (isWalkable(nextX, nextY)) {
        setPlayerPos({ x: nextX, y: nextY });
      }
    }
    
    // Interaction
    if (e.key === ' ' || e.key === 'Enter') {
        checkInteraction();
    }
  }, [mode, playerPos, playerDir]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // --- Interaction System ---

  const checkInteraction = () => {
    const targetX = playerPos.x + (playerDir === 'left' ? -1 : playerDir === 'right' ? 1 : 0);
    const targetY = playerPos.y + (playerDir === 'up' ? -1 : playerDir === 'down' ? 1 : 0);

    // 1. Interact with Customer (Take Order)
    if (activeCustomer && customerPos && targetX === customerPos.x && targetY === customerPos.y) {
       setDialogueText(`${activeCustomer.name}: "${activeCustomer.dialogue}"`);
       return;
    }

    // 2. Interact with Mr. Gold
    if (targetX === mrGoldPos.x && targetY === mrGoldPos.y) {
        if (mrGoldStatus === 'safe') setDialogueText("Mr. Gold wags his tail happily.");
        if (mrGoldStatus === 'weird') setDialogueText("Mr. Gold is growling at the wall...");
        return;
    }

    // 3. Interact with Kitchen (Stove)
    // Counter is at Y=4. Player stands at Y=5 facing UP to serve/cook? 
    // Actually let's say Kitchen Station is at y=2, x=8 (behind counter).
    // Or Player stands IN FRONT of counter (y=5) to talk to customer, 
    // AND player can walk BEHIND counter (y=3) to cook at stove (y=2).
    
    // Let's say Stove is at x=8, y=2.
    if (targetX === 8 && targetY === 2) {
       if (activeCustomer) {
          setCurrentBowl([]);
          setCookingFeedback(null);
          setMode('cooking');
       } else {
          setDialogueText("No orders to cook right now.");
       }
       return;
    }

    // 4. End Day (Door at bottom)
    if (targetY === GRID_H - 1 && (targetX === 8 || targetX === 7)) {
        if (customersServedCount >= 2) {
            setMode('night_choice');
        } else {
            setDialogueText("I need to earn more money before closing.");
        }
        return;
    }
  };

  // --- Minigame Logic ---

  const addToBowl = (ing: Ingredient) => {
    if (currentBowl.length < 5) {
      setCurrentBowl([...currentBowl, ing]);
    }
  };

  const serveBowl = () => {
    if (!activeCustomer) return;

    const required = activeCustomer.order;
    const attempt = currentBowl;
    
    // Simple check: Must contain all required ingredients
    const isCorrect = required.every(r => attempt.includes(r)) && attempt.length >= required.length;

    if (isCorrect) {
      setMoney(m => m + 25);
      setCookingFeedback("PERFECT! They loved it.");
      if (activeCustomer.isCreepy) setSanity(s => s - 10);
    } else {
      setCookingFeedback("They looked disappointed...");
      setSanity(s => s - 5);
    }

    setTimeout(() => {
      setMode('roaming');
      setActiveCustomer(null);
      setCustomerPos(null);
      setCustomersServedCount(c => c + 1);
      
      // Spawn next customer after delay if not finished
      if (customersServedCount < 3) {
         setTimeout(spawnCustomer, 4000);
      }
    }, 2000);
  };

  // --- Night Logic ---

  const handleNightChoice = (choice: 'investigate' | 'sleep' | 'search_dog') => {
    if (choice === 'sleep') {
      if (day < 3) {
        setDay(d => d + 1);
        setMode('intro');
      } else {
        triggerEnding('bad'); // Ignored the problem
      }
    } else if (choice === 'investigate') {
      if (day === 2) {
        setMrGoldStatus('weird');
        setSanity(s => s - 20);
        setDay(3);
        setMode('intro');
      } else if (day === 3) {
        triggerEnding('bad');
      }
    } else if (choice === 'search_dog') {
      if (sanity > 50) {
        triggerEnding('good');
      } else {
        triggerEnding('neutral');
      }
    }
  };

  const triggerEnding = (type: EndingType) => {
    setEnding(type);
    setMode('ending');
  };

  // --- Renders ---

  if (mode === 'menu') {
    return (
      <div className="w-full h-full bg-[#1a1614] flex flex-col items-center justify-center text-[#d4c5b0] font-mono relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10" />
        <div className="z-10 text-center space-y-6">
             <ChefHat size={64} className="mx-auto mb-4 text-red-800" />
             <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-red-600 drop-shadow-lg">PHỞ ANH HAI</h1>
             <div className="text-sm mt-2 tracking-[0.3em] uppercase">RPG Edition</div>
             
             <button onClick={startGame} className="mt-8 px-8 py-3 bg-[#2c2420] hover:bg-[#3d322c] border border-[#594a42] text-white transition-all w-64 block mx-auto">
               START GAME
             </button>
             <p className="text-xs text-[#594a42]">Use Arrow Keys to Move • Space to Interact</p>
        </div>
      </div>
    );
  }

  if (mode === 'intro') {
    return (
      <div className="w-full h-full bg-black flex items-center justify-center p-8 text-center font-mono">
         <div className="max-w-2xl animate-in fade-in duration-1000">
            <h2 className="text-3xl text-white mb-6 border-b border-white/20 pb-4">Day {day}</h2>
            <p className="text-xl text-gray-300 leading-relaxed mb-8">
              {day === 1 && STORY_LOGIC.day1.intro}
              {day === 2 && STORY_LOGIC.day2.intro}
              {day === 3 && STORY_LOGIC.day3.intro}
            </p>
            <button onClick={startDay} className="text-red-500 hover:text-red-400 flex items-center gap-2 mx-auto animate-pulse">
               Open Shop <ArrowRight size={20} />
            </button>
         </div>
      </div>
    );
  }

  if (mode === 'roaming' || mode === 'cooking' || mode === 'dialogue') {
    return (
        <div className="w-full h-full bg-[#111] relative font-mono overflow-hidden flex items-center justify-center">
            {/* HUD */}
            <div className="absolute top-4 left-4 right-4 z-20 flex justify-between text-white bg-black/60 backdrop-blur p-2 rounded-lg border border-white/10 pointer-events-none">
                 <div className="flex gap-4">
                     <span className="flex items-center gap-2"><Clock size={14} /> Day {day}</span>
                     <span className="flex items-center gap-2 text-green-400"><MapPin size={14} /> ${money}</span>
                 </div>
                 <div className="flex gap-4">
                     <span className={`flex items-center gap-2 ${sanity < 50 ? 'text-red-500' : 'text-blue-300'}`}><Ghost size={14} /> {sanity}%</span>
                 </div>
            </div>

            {/* Game Container */}
            <div 
               className="relative bg-[#2a221e] shadow-2xl overflow-hidden border-4 border-[#1a1614]"
               style={{ width: GRID_W * TILE_SIZE, height: GRID_H * TILE_SIZE }}
            >
                {/* --- Floor & Walls --- */}
                {/* Floor Pattern */}
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle,#4a3b32_1px,transparent_1px)] bg-[length:16px_16px]" />
                
                {/* Kitchen Floor Area (Top) */}
                <div className="absolute top-0 left-0 right-0 h-[192px] bg-[#3d322c] border-b-2 border-[#1a1614]" />

                {/* --- Static Objects --- */}
                
                {/* Stove / Prep Station */}
                <div className="absolute top-[96px] left-[384px] w-[144px] h-[48px] bg-gray-700 border-2 border-gray-600 flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full bg-red-900/50 animate-pulse" />
                    <span className="text-[10px] text-white/50 absolute -top-5">STOVE</span>
                </div>

                {/* Counter */}
                <div className="absolute top-[192px] left-[240px] w-[336px] h-[48px] bg-[#5c4033] border border-[#3e2b22] shadow-lg flex items-center justify-center z-10">
                   <span className="text-white/20 tracking-[0.5em] text-xs">COUNTER</span>
                </div>

                {/* Tables */}
                <div className="absolute top-[350px] left-[100px] w-[96px] h-[96px] bg-[#5c4033] rounded-full border-4 border-[#3e2b22] opacity-80" />
                <div className="absolute top-[350px] right-[100px] w-[96px] h-[96px] bg-[#5c4033] rounded-full border-4 border-[#3e2b22] opacity-80" />

                {/* --- Entities --- */}

                {/* Mr. Gold (Dog) */}
                {mrGoldStatus !== 'missing' && (
                    <div 
                        className="absolute w-[48px] h-[48px] transition-all duration-500 ease-linear flex items-center justify-center"
                        style={{ left: mrGoldPos.x * TILE_SIZE, top: mrGoldPos.y * TILE_SIZE }}
                    >
                        <div className="relative">
                            <Dog size={32} className="text-yellow-500 drop-shadow-md" />
                            {mrGoldStatus === 'weird' && <div className="absolute -top-2 right-0 text-lg">?</div>}
                        </div>
                    </div>
                )}

                {/* Customer */}
                {activeCustomer && customerPos && (
                     <div 
                        className="absolute w-[48px] h-[48px] transition-all duration-300 flex items-center justify-center z-10"
                        style={{ left: customerPos.x * TILE_SIZE, top: customerPos.y * TILE_SIZE }}
                     >
                        <div className={`w-10 h-10 rounded-full ${activeCustomer.spriteColor} border-2 border-white shadow-lg flex items-center justify-center`}>
                            <User size={24} className="text-white/80" />
                        </div>
                        {/* Order Bubble */}
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white text-black px-2 py-0.5 rounded text-[10px] whitespace-nowrap border border-gray-300 animate-bounce">
                            Pho pls!
                        </div>
                     </div>
                )}

                {/* Player */}
                <div 
                    className="absolute w-[48px] h-[48px] transition-all duration-150 ease-out flex items-center justify-center z-20"
                    style={{ left: playerPos.x * TILE_SIZE, top: playerPos.y * TILE_SIZE }}
                >
                    <div className={`
                        w-10 h-10 rounded-full bg-red-600 border-2 border-white shadow-xl flex items-center justify-center relative
                        ${playerDir === 'left' ? '-scale-x-100' : ''}
                    `}>
                         <ChefHat size={24} className="text-white" />
                         <div className="absolute bottom-0 w-full h-1 bg-black/20 rounded-full blur-sm translate-y-1" />
                    </div>
                </div>

            </div>

            {/* --- Dialogue Overlay --- */}
            <AnimatePresence>
                {dialogueText && (
                    <motion.div 
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 50, opacity: 0 }}
                        className="absolute bottom-8 left-8 right-8 bg-black/90 border border-white/20 p-4 rounded-xl z-50 text-white flex items-center gap-4 shadow-2xl"
                    >
                        <MessageCircle className="text-gray-400 shrink-0" size={32} />
                        <div className="flex-1 text-sm md:text-base">{dialogueText}</div>
                        <button onClick={() => setDialogueText(null)} className="text-xs bg-white/10 px-3 py-1 rounded hover:bg-white/20">Close</button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* --- Cooking Minigame Overlay --- */}
            <AnimatePresence>
                {mode === 'cooking' && (
                    <motion.div 
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="absolute inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-8"
                    >
                        <div className="bg-[#d6cbbd] w-full max-w-2xl rounded-xl overflow-hidden shadow-2xl border-4 border-[#594a42] flex flex-col">
                             <div className="bg-[#594a42] text-[#d6cbbd] p-3 flex justify-between items-center">
                                 <div className="font-bold tracking-widest flex items-center gap-2"><Utensils size={16} /> COOKING MODE</div>
                                 <button onClick={() => setMode('roaming')} className="hover:text-white"><XCircle size={20} /></button>
                             </div>
                             
                             <div className="p-6 flex-1 flex gap-6">
                                 {/* Left: Pot */}
                                 <div className="flex-1 flex flex-col">
                                     <div className="flex-1 bg-white rounded border-2 border-[#a89f91] p-4 relative">
                                         <div className="absolute top-2 right-2 text-xs text-gray-400 font-bold">CURRENT BOWL</div>
                                         <div className="flex flex-wrap gap-2 mt-4">
                                             {currentBowl.length === 0 && <span className="text-gray-400 italic text-sm">Add ingredients...</span>}
                                             {currentBowl.map((ing, i) => (
                                                 <span key={i} className={`px-2 py-1 text-xs rounded border ${INGREDIENTS.find(x=>x.id===ing)?.color || 'bg-gray-200'}`}>
                                                     {INGREDIENTS.find(x=>x.id===ing)?.label}
                                                 </span>
                                             ))}
                                         </div>
                                     </div>
                                     <div className="mt-4 flex justify-between items-center">
                                         <button onClick={() => setCurrentBowl([])} className="text-xs text-red-600 font-bold hover:underline">RESET BOWL</button>
                                         <button 
                                            onClick={serveBowl} 
                                            disabled={!!cookingFeedback}
                                            className="px-6 py-2 bg-green-600 hover:bg-green-500 text-white font-bold rounded shadow-lg flex items-center gap-2"
                                         >
                                            SERVE <ArrowRight size={16} />
                                         </button>
                                     </div>
                                 </div>

                                 {/* Right: Ingredients */}
                                 <div className="w-48 grid grid-cols-1 gap-2 overflow-y-auto">
                                     {INGREDIENTS.map(ing => (
                                         <button 
                                            key={ing.id}
                                            onClick={() => addToBowl(ing.id)}
                                            className="text-left px-3 py-2 bg-white border border-[#a89f91] rounded hover:bg-[#f5f5f5] text-xs font-bold text-[#594a42] transition-transform active:scale-95"
                                         >
                                             {ing.label}
                                         </button>
                                     ))}
                                 </div>
                             </div>

                             {/* Order Info */}
                             {activeCustomer && (
                                 <div className="bg-[#e8e0d5] p-3 text-xs text-[#594a42] border-t border-[#a89f91] flex justify-between items-center">
                                     <span className="font-bold">Order: {activeCustomer.name}</span>
                                     <span className="italic">"{activeCustomer.dialogue}"</span>
                                 </div>
                             )}

                             {/* Feedback Overlay */}
                             {cookingFeedback && (
                                 <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
                                     <div className="bg-white p-6 rounded-lg text-center animate-in zoom-in">
                                         <div className="text-4xl mb-2">{cookingFeedback.includes('PERFECT') ? '🌟' : '😐'}</div>
                                         <div className="font-bold text-lg mb-1">{cookingFeedback}</div>
                                     </div>
                                 </div>
                             )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
  }

  if (mode === 'night_choice') {
    return (
        <div className="w-full h-full bg-[#0a0a0a] flex flex-col items-center justify-center p-12 font-mono text-gray-300">
            <div className="max-w-2xl w-full space-y-8">
                <div className="border-l-2 border-red-900 pl-6 py-2">
                   <p className="text-xl italic mb-4">
                      {day === 1 && STORY_LOGIC.day1.night}
                      {day === 2 && STORY_LOGIC.day2.night}
                      {day === 3 && STORY_LOGIC.day3.night}
                   </p>
                </div>
 
                <div className="grid gap-4">
                   {day < 3 && (
                     <button onClick={() => handleNightChoice('sleep')} className="p-4 border border-gray-800 hover:bg-gray-900 hover:border-gray-600 text-left transition-all group">
                        <span className="text-gray-500 group-hover:text-white block text-xs uppercase tracking-widest mb-1">Option A</span>
                        Close the shop and sleep.
                     </button>
                   )}
                   
                   {day >= 2 && (
                     <button onClick={() => handleNightChoice('investigate')} className="p-4 border border-red-900/30 hover:bg-red-950/30 hover:border-red-800 text-left transition-all group">
                        <span className="text-red-900 group-hover:text-red-500 block text-xs uppercase tracking-widest mb-1">Option B</span>
                        Investigate the noise in the back.
                     </button>
                   )}
 
                   {day === 3 && (
                      <button onClick={() => handleNightChoice('search_dog')} className="p-4 border border-yellow-900/30 hover:bg-yellow-950/30 hover:border-yellow-600 text-left transition-all group">
                         <span className="text-yellow-600 group-hover:text-yellow-400 block text-xs uppercase tracking-widest mb-1">Option C</span>
                         Go find Mr. Gold.
                      </button>
                   )}
                </div>
            </div>
        </div>
     );
  }

  if (mode === 'ending') {
    return (
        <div className="w-full h-full bg-black flex flex-col items-center justify-center text-center p-8 font-mono">
           <h1 className={`text-4xl font-bold mb-6 ${ending === 'good' ? 'text-green-500' : ending === 'bad' ? 'text-red-600' : 'text-gray-400'}`}>
              {ending === 'good' ? "THE GOOD ENDING" : ending === 'bad' ? "THE BAD ENDING" : "THE NEUTRAL ENDING"}
           </h1>
           <p className="text-gray-300 max-w-xl leading-relaxed mb-12">
              {ending === 'good' && "You found Mr. Gold barking at a rat in the alleyway. The creepy customers were just exhausted construction workers covered in dust. The pho is safe."}
              {ending === 'bad' && "You ignored the signs. The broth began to taste... different. Mr. Gold was never seen again, but the customers have never been happier with the meat."}
              {ending === 'neutral' && "You closed the shop and moved away. Some mysteries are better left unsolved."}
           </p>
           <button onClick={startGame} className="text-white border border-white/20 px-6 py-2 hover:bg-white/10 rounded transition-all">
              Play Again
           </button>
        </div>
    );
  }

  return null;
};
