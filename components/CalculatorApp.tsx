
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { Delete, Divide, X, Minus, Plus, Equal, RotateCcw } from 'lucide-react';

export const CalculatorApp: React.FC = () => {
  const [display, setDisplay] = useState('0');
  const [equation, setEquation] = useState('');
  const [isNewNumber, setIsNewNumber] = useState(true);
  const [lastOperator, setLastOperator] = useState<string | null>(null);
  const [prevValue, setPrevValue] = useState<number | null>(null);
  
  const displayControls = useAnimation();

  useEffect(() => {
    displayControls.start({
      scale: [1.05, 1],
      opacity: [0.8, 1],
      transition: { duration: 0.2, ease: "easeOut" }
    });
  }, [display, displayControls]);

  const handleNum = (num: string) => {
    if (display.length > 12 && !isNewNumber) return;

    if (isNewNumber) {
      setDisplay(num);
      setIsNewNumber(false);
    } else {
      setDisplay(display === '0' ? num : display + num);
    }
  };

  const handleDecimal = () => {
    if (isNewNumber) {
      setDisplay('0.');
      setIsNewNumber(false);
    } else if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  const calculate = (a: number, b: number, op: string) => {
    switch (op) {
      case '+': return a + b;
      case '-': return a - b;
      case '*': return a * b;
      case '/': return b === 0 ? NaN : a / b;
      default: return b;
    }
  };

  const handleOperator = (op: string) => {
    const current = parseFloat(display);

    if (lastOperator && !isNewNumber && prevValue !== null) {
      const result = calculate(prevValue, current, lastOperator);
      if (isNaN(result)) {
        setDisplay('Error');
        setPrevValue(null);
        setLastOperator(null);
        setIsNewNumber(true);
        return;
      }
      setDisplay(String(result));
      setPrevValue(result);
    } else {
      setPrevValue(current);
    }

    setLastOperator(op);
    setIsNewNumber(true);
    setEquation(`${current} ${op}`);
  };

  const handleEqual = () => {
    if (!lastOperator || prevValue === null) return;

    const current = parseFloat(display);
    const result = calculate(prevValue, current, lastOperator);
    
    setEquation('');
    if (isNaN(result) || !isFinite(result)) {
      setDisplay('Error');
    } else {
      setDisplay(String(result));
      displayControls.start({
          scale: [1.1, 1],
          transition: { duration: 0.3 }
      });
    }
    
    setPrevValue(null);
    setLastOperator(null);
    setIsNewNumber(true);
  };

  const handleClear = () => {
    setDisplay('0');
    setEquation('');
    setPrevValue(null);
    setLastOperator(null);
    setIsNewNumber(true);
  };

  const handlePercent = () => {
    const current = parseFloat(display);
    setDisplay(String(current / 100));
    setIsNewNumber(true);
  };

  const handleBackspace = () => {
      if (isNewNumber) return;
      if (display.length === 1) {
          setDisplay('0');
          setIsNewNumber(true);
      } else {
          setDisplay(display.slice(0, -1));
      }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key;
      if (/\d/.test(key)) handleNum(key);
      if (key === '.') handleDecimal();
      if (key === '+' || key === '-') handleOperator(key);
      if (key === '*') handleOperator('*');
      if (key === '/') handleOperator('/');
      if (key === 'Enter' || key === '=') { e.preventDefault(); handleEqual(); }
      if (key === 'Backspace') handleBackspace();
      if (key === 'Escape') handleClear();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [display, isNewNumber, lastOperator, prevValue]);

  const fontSize = display.length > 9 ? 'text-4xl' : display.length > 6 ? 'text-5xl' : 'text-6xl';

  const btnClass = "h-14 rounded-full font-medium text-lg transition-all active:scale-90 hover:scale-105 flex items-center justify-center select-none shadow-sm border border-black/5 dark:border-transparent relative overflow-hidden group";
  const ripple = (
      <span className="absolute w-full h-full bg-black/10 dark:bg-white/20 rounded-full scale-0 opacity-0 group-active:animate-ping pointer-events-none" />
  );

  const numBtn = `${btnClass} bg-white dark:bg-[#333] hover:bg-gray-50 dark:hover:bg-[#444] text-gray-900 dark:text-white`;
  const opBtn = `${btnClass} bg-orange-500 hover:bg-orange-400 text-white border-transparent`;
  const funcBtn = `${btnClass} bg-gray-200 dark:bg-[#a5a5a5] hover:bg-gray-300 dark:hover:bg-[#bfbfbf] text-black`;

  return (
    <div className="w-full h-full bg-gray-100 dark:bg-[#1c1c1c] flex flex-col p-4 font-sans select-none transition-colors duration-300">
       {/* Display */}
       <div className="flex-1 flex flex-col justify-end items-end px-2 mb-4 relative">
           <div className="h-8 w-full flex justify-end items-center overflow-hidden mb-1">
               <AnimatePresence mode="wait">
                   {equation && (
                       <motion.div 
                           key={equation}
                           initial={{ y: 20, opacity: 0 }}
                           animate={{ y: 0, opacity: 1 }}
                           exit={{ y: -20, opacity: 0 }}
                           transition={{ duration: 0.2 }}
                           className="text-gray-500 dark:text-gray-400 text-lg font-light"
                       >
                           {equation}
                       </motion.div>
                   )}
               </AnimatePresence>
           </div>
           <motion.div 
             animate={displayControls}
             className={`font-light text-gray-900 dark:text-white ${fontSize} break-all text-right origin-right transition-colors`}
           >
             {display}
           </motion.div>
       </div>

       {/* Keypad */}
       <div className="grid grid-cols-4 gap-3">
           <button onClick={handleClear} className={funcBtn}>
               {display === '0' && lastOperator === null ? 'AC' : 'C'}
               {ripple}
           </button>
           <button onClick={handleBackspace} className={funcBtn}><Delete size={20} />{ripple}</button>
           <button onClick={handlePercent} className={funcBtn}>%{ripple}</button>
           <button onClick={() => handleOperator('/')} className={opBtn}><Divide size={24} />{ripple}</button>

           <button onClick={() => handleNum('7')} className={numBtn}>7{ripple}</button>
           <button onClick={() => handleNum('8')} className={numBtn}>8{ripple}</button>
           <button onClick={() => handleNum('9')} className={numBtn}>9{ripple}</button>
           <button onClick={() => handleOperator('*')} className={opBtn}><X size={24} />{ripple}</button>

           <button onClick={() => handleNum('4')} className={numBtn}>4{ripple}</button>
           <button onClick={() => handleNum('5')} className={numBtn}>5{ripple}</button>
           <button onClick={() => handleNum('6')} className={numBtn}>6{ripple}</button>
           <button onClick={() => handleOperator('-')} className={opBtn}><Minus size={24} />{ripple}</button>

           <button onClick={() => handleNum('1')} className={numBtn}>1{ripple}</button>
           <button onClick={() => handleNum('2')} className={numBtn}>2{ripple}</button>
           <button onClick={() => handleNum('3')} className={numBtn}>3{ripple}</button>
           <button onClick={() => handleOperator('+')} className={opBtn}><Plus size={24} />{ripple}</button>

           <button onClick={() => handleNum('0')} className={`${numBtn} col-span-2 rounded-2xl`}>0{ripple}</button>
           <button onClick={handleDecimal} className={numBtn}>.{ripple}</button>
           <button onClick={handleEqual} className={opBtn}><Equal size={24} />{ripple}</button>
       </div>
    </div>
  );
};
