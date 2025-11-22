
import React, { useState, useEffect, useRef } from 'react';
import { Utensils, Ghost, Dog, MapPin, Clock, AlertTriangle, Heart, ChefHat, ArrowRight, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Game Types ---

type GameState = 'menu' | 'intro' | 'day_start' | 'cooking' | 'night_talk' | 'night_explore' | 'ending';
type Ingredient = 'noodles' | 'beef' | 'chicken' | 'herbs' | 'onion' | 'broth' | 'special_sauce';
type EndingType = 'good' | 'neutral' | 'bad';

interface Customer {
  id: number;
  name: string;
  desc: string;
  order: Ingredient[];
  dialogue: string;
  isCreepy: boolean;
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

export const PhoAnhHaiApp: React.FC = () => {
  // Core State
  const [gameState, setGameState] = useState<GameState>('menu');
  const [day, setDay] = useState(1);
  const [sanity, setSanity] = useState(100);
  const [money, setMoney] = useState(0);
  const [goldenBoyStatus, setGoldenBoyStatus] = useState<'safe' | 'weird' | 'missing'>('safe');
  
  // Cooking State
  const [currentBowl, setCurrentBowl] = useState<Ingredient[]>([]);
  const [currentCustomer, setCurrentCustomer] = useState<Customer | null>(null);
  const [customersServed, setCustomersServed] = useState(0);
  const [cookingFeedback, setCookingFeedback] = useState<string | null>(null);

  // Narrative State
  const [dialogueIndex, setDialogueIndex] = useState(0);
  const [ending, setEnding] = useState<EndingType | null>(null);

  // --- Narrative Data ---
  
  const STORY_LOGIC = {
    day1: {
      intro: "Welcome to No. 10 Dan Phuong. My name is Hai. This is my shop. It's not much, but the broth is good. Keep an eye on Golden Boy, my dog. He wanders off.",
      night: "The shop is closed. It's strangely quiet tonight. Golden Boy is staring at the wall."
    },
    day2: {
      intro: "Day 2. Grandma Hạnh came by early. She mumbled something about 'the old fire' appearing again.",
      night: "Golden Boy is barking at the empty storage room. Do you investigate?"
    },
    day3: {
      intro: "Day 3. The customers are acting strange. They eat without chewing. Just... swallowing.",
      night: "Golden Boy is missing."
    }
  };

  // --- Game Actions ---

  const startGame = () => {
    setGameState('intro');
    setDay(1);
    setSanity(100);
    setMoney(50);
    setGoldenBoyStatus('safe');
    setCustomersServed(0);
  };

  const startDay = () => {
    setGameState('cooking');
    setCustomersServed(0);
    generateCustomer();
  };

  const generateCustomer = () => {
    const isCreepyDay = day >= 2;
    const isCreepyChance = Math.random() > 0.6;
    
    const normalOrders: Customer[] = [
      { id: 1, name: "Office Worker", desc: "Looks tired.", order: ['noodles', 'beef', 'onion', 'broth'], dialogue: "Just a regular bowl, please. Quickly.", isCreepy: false },
      { id: 2, name: "Student", desc: "Wearing a uniform.", order: ['noodles', 'chicken', 'herbs', 'broth'], dialogue: "Chicken pho, please!", isCreepy: false },
      { id: 3, name: "Grandma Hạnh", desc: "Local elder.", order: ['noodles', 'beef', 'herbs', 'broth'], dialogue: "Make it soft, Hai. My teeth aren't what they used to be.", isCreepy: false },
    ];

    const creepyOrders: Customer[] = [
      { id: 4, name: "Pale Man", desc: "Staring unblinkingly.", order: ['noodles', 'beef', 'beef', 'broth'], dialogue: "Meat. More meat. Raw if possible.", isCreepy: true },
      { id: 5, name: "Shadowy Figure", desc: "Hard to focus on.", order: ['noodles', 'special_sauce', 'broth'], dialogue: "Just the liquid. And the secret sauce.", isCreepy: true },
    ];

    const pool = (isCreepyDay && isCreepyChance) ? creepyOrders : normalOrders;
    const random = pool[Math.floor(Math.random() * pool.length)];
    setCurrentCustomer(random);
    setCurrentBowl([]);
    setCookingFeedback(null);
  };

  const addToBowl = (ing: Ingredient) => {
    if (currentBowl.length < 5) {
      setCurrentBowl([...currentBowl, ing]);
    }
  };

  const serveBowl = () => {
    if (!currentCustomer) return;

    // Simple equality check (order matters for gameplay difficulty)
    const required = currentCustomer.order;
    const attempt = currentBowl;
    
    // Check if attempt contains all required ingredients (ignoring order for ease, or strict for hard)
    // Let's do loose matching
    const isCorrect = required.every(r => attempt.includes(r)) && required.length === attempt.length;

    if (isCorrect) {
      setMoney(m => m + 25);
      setCookingFeedback("Delicious! They left happy.");
      if (currentCustomer.isCreepy) setSanity(s => s - 10);
    } else {
      setCookingFeedback("They didn't like it...");
      setSanity(s => s - 5);
    }

    setTimeout(() => {
      if (customersServed >= 2) {
        setGameState('night_talk');
      } else {
        setCustomersServed(s => s + 1);
        generateCustomer();
      }
    }, 1500);
  };

  const handleNightChoice = (choice: 'investigate' | 'sleep' | 'search_dog') => {
    if (choice === 'sleep') {
      if (day < 3) {
        setDay(d => d + 1);
        setGameState('day_start');
      } else {
        triggerEnding('bad'); // Ignored the problem
      }
    } else if (choice === 'investigate') {
      if (day === 2) {
        setGoldenBoyStatus('weird');
        setSanity(s => s - 20);
        setDay(3);
        setGameState('day_start');
      } else if (day === 3) {
        triggerEnding('bad'); // Investigated too deep without the dog
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
    setGameState('ending');
  };

  // --- Renders ---

  if (gameState === 'menu') {
    return (
      <div className="w-full h-full bg-[#1a1614] flex flex-col items-center justify-center text-[#d4c5b0] font-mono relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay" />
        <div className="z-10 text-center space-y-6">
          <div className="mb-8 animate-pulse">
             <ChefHat size={64} className="mx-auto mb-4 text-red-800" />
             <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-red-600 drop-shadow-lg">PHỞ ANH HAI</h1>
             <p className="text-sm mt-2 tracking-[0.3em] uppercase">No. 10 Dan Phuong</p>
          </div>
          
          <div className="space-y-3">
            <button onClick={startGame} className="px-8 py-3 bg-[#2c2420] hover:bg-[#3d322c] border border-[#594a42] text-white transition-all w-64 block mx-auto hover:tracking-widest">
              START SHIFT
            </button>
            <button className="px-8 py-3 bg-transparent border border-[#594a42] text-[#8c7b70] w-64 block mx-auto cursor-not-allowed opacity-50">
              LOAD SAVE
            </button>
          </div>
          
          <div className="mt-12 text-xs text-[#594a42] max-w-md mx-auto leading-relaxed">
            Based on a true urban legend. <br/>
            Cooking time: 30 mins. Endings: 3.
          </div>
        </div>
      </div>
    );
  }

  if (gameState === 'intro' || gameState === 'day_start') {
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

  if (gameState === 'cooking') {
    return (
      <div className="w-full h-full bg-[#e6ddd0] flex flex-col font-mono relative">
        {/* HUD */}
        <div className="h-16 bg-[#2c2420] text-[#d4c5b0] flex items-center justify-between px-6 shadow-md shrink-0 z-10">
            <div className="flex items-center gap-4">
               <div className="flex items-center gap-2"><Clock size={16} /> <span>Day {day}</span></div>
               <div className="flex items-center gap-2 text-green-400"><MapPin size={16} /> <span>${money}</span></div>
            </div>
            <div className="font-bold text-xl tracking-widest">KITCHEN</div>
            <div className="flex items-center gap-4">
               <div className={`flex items-center gap-2 ${sanity < 50 ? 'text-red-500 animate-pulse' : 'text-blue-300'}`}>
                  <Ghost size={16} /> <span>{sanity}%</span>
               </div>
               <div className="flex items-center gap-2 text-yellow-500">
                  <Dog size={16} /> <span>{goldenBoyStatus}</span>
               </div>
            </div>
        </div>

        {/* Main Area */}
        <div className="flex-1 flex overflow-hidden">
           {/* Left: Kitchen / Ingredients */}
           <div className="w-1/2 bg-[#d6cbbd] p-6 border-r border-[#bbaabb] flex flex-col">
              <h3 className="text-sm font-bold text-[#594a42] uppercase mb-4 flex items-center gap-2">
                 <Utensils size={16} /> Prep Station
              </h3>
              
              <div className="grid grid-cols-2 gap-3 mb-6">
                 {INGREDIENTS.map(ing => (
                   <button 
                     key={ing.id}
                     onClick={() => addToBowl(ing.id)}
                     className={`p-4 rounded shadow-sm border-b-4 border-black/10 active:border-b-0 active:translate-y-1 transition-all text-sm font-bold ${ing.color}`}
                   >
                     {ing.label}
                   </button>
                 ))}
              </div>

              <div className="mt-auto bg-white p-4 rounded-lg border-2 border-[#594a42] shadow-inner min-h-[120px]">
                 <div className="text-xs text-gray-500 mb-2 uppercase font-bold">Current Bowl Assembly:</div>
                 <div className="flex flex-wrap gap-2">
                    {currentBowl.length === 0 && <span className="text-gray-400 italic">Empty...</span>}
                    {currentBowl.map((ing, idx) => (
                       <span key={idx} className="px-2 py-1 bg-gray-200 rounded text-xs border border-gray-300 animate-in zoom-in">
                         {INGREDIENTS.find(i => i.id === ing)?.label}
                       </span>
                    ))}
                 </div>
                 <div className="mt-4 flex justify-between">
                    <button onClick={() => setCurrentBowl([])} className="text-xs text-red-500 underline">Clear</button>
                    <button onClick={serveBowl} className="px-4 py-1 bg-green-600 text-white text-xs font-bold rounded shadow hover:bg-green-500">SERVE</button>
                 </div>
              </div>
           </div>

           {/* Right: Service / Customer */}
           <div className="w-1/2 bg-[#f0ebe5] p-6 flex flex-col items-center justify-center relative overflow-hidden">
               {/* Wallpaper Pattern */}
               <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-black to-transparent" />
               
               {cookingFeedback ? (
                  <div className="text-center animate-in zoom-in">
                     <h2 className="text-2xl font-bold mb-2">{cookingFeedback.includes('Delicious') ? '😊' : '😡'}</h2>
                     <p className="text-lg font-bold text-[#594a42]">{cookingFeedback}</p>
                  </div>
               ) : currentCustomer ? (
                  <div className="w-full max-w-sm">
                      {/* Customer Visual (Pixel Art Placeholder) */}
                      <div className="w-32 h-32 mx-auto bg-[#594a42] mb-6 rounded-full overflow-hidden relative shadow-xl border-4 border-white">
                          {currentCustomer.isCreepy ? (
                              <div className="absolute inset-0 bg-black mix-blend-multiply animate-pulse" />
                          ) : (
                              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20" />
                          )}
                          <div className="w-full h-full flex items-center justify-center text-6xl">
                             {currentCustomer.id === 3 ? '👵' : currentCustomer.isCreepy ? '👁️' : '👤'}
                          </div>
                      </div>

                      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 relative">
                          {/* Speech Bubble Arrow */}
                          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white rotate-45 border-t border-l border-gray-200" />
                          
                          <h4 className="font-bold text-lg text-gray-800 mb-1">{currentCustomer.name}</h4>
                          <p className="text-xs text-gray-500 italic mb-4">{currentCustomer.desc}</p>
                          
                          <div className="bg-gray-100 p-3 rounded text-sm text-gray-700 font-medium mb-4 border-l-4 border-red-400">
                             "{currentCustomer.dialogue}"
                          </div>

                          <div className="text-xs font-mono bg-yellow-50 p-2 rounded border border-yellow-100">
                             <span className="font-bold text-gray-500 uppercase mr-2">Order:</span>
                             {currentCustomer.order.map(o => INGREDIENTS.find(i => i.id === o)?.label).join(", ")}
                          </div>
                      </div>
                  </div>
               ) : (
                  <div className="text-gray-400 italic">Waiting for customers...</div>
               )}
           </div>
        </div>
      </div>
    );
  }

  if (gameState === 'night_talk') {
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
                        