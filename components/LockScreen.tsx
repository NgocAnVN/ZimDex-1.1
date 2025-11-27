
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Wifi, Battery, User, Lock } from 'lucide-react';
import { useSystem } from '../contexts/SystemContext';

export const LockScreen: React.FC = () => {
  const { unlock, username, batteryLevel, isWifiEnabled, systemFont, avatar } = useSystem();
  const [passwordInput, setPasswordInput] = useState('');
  const [isLoginView, setIsLoginView] = useState(false);
  const [shake, setShake] = useState(0);
  
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleUnlock = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (unlock(passwordInput)) {
        // Success handled by context (unmounting this component)
    } else {
        setShake(prev => prev + 1);
        setPasswordInput('');
    }
  };

  const toggleView = () => setIsLoginView(!isLoginView);

  return (
    <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, y: -100, transition: { duration: 0.8, ease: [0.43, 0.13, 0.23, 0.96] } }}
        className="fixed inset-0 z-[9999] bg-cover bg-center flex flex-col overflow-hidden text-white select-none"
        style={{ 
            backgroundImage: `url('https://images.unsplash.com/photo-1477346611705-65d1883cee1e?q=80&w=2000')`,
            fontFamily: systemFont 
        }}
        onClick={() => !isLoginView && setIsLoginView(true)}
    >
        {/* Backdrop Blur that increases when logging in */}
        <motion.div 
            className="absolute inset-0 bg-black/30"
            animate={{ backdropFilter: isLoginView ? "blur(15px)" : "blur(0px)", backgroundColor: isLoginView ? "rgba(0,0,0,0.4)" : "rgba(0,0,0,0.2)" }}
            transition={{ duration: 0.8 }}
        />

        {/* Top Status Bar */}
        <div className="relative z-10 w-full p-6 flex justify-end gap-6 text-white/80">
             {isWifiEnabled && <Wifi size={24} />}
             <div className="flex items-center gap-2">
                 <span className="text-sm font-medium">{Math.round(batteryLevel)}%</span>
                 <Battery size={24} />
             </div>
        </div>

        {/* Main Content Container */}
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center w-full">
            <AnimatePresence mode="wait">
                {!isLoginView ? (
                    <motion.div 
                        key="clock"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -50, scale: 0.9 }}
                        transition={{ duration: 0.5 }}
                        className="flex flex-col items-center text-center"
                    >
                        <div className="text-[9rem] leading-none font-thin tracking-tight drop-shadow-2xl">
                            {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
                        </div>
                        <div className="text-3xl font-light mt-2 drop-shadow-lg">
                            {time.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="login"
                        initial={{ opacity: 0, y: 50, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 50, scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="flex flex-col items-center gap-6"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="w-32 h-32 rounded-full p-1 bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl overflow-hidden flex items-center justify-center">
                            {avatar ? (
                                <img 
                                    src={avatar} 
                                    alt="User" 
                                    className="w-full h-full rounded-full object-cover shadow-inner"
                                />
                            ) : (
                                <div className="w-full h-full rounded-full bg-black/20 flex items-center justify-center">
                                     <span className="text-5xl font-bold text-white" style={{ fontFamily: systemFont }}>
                                         {username.charAt(0).toUpperCase()}
                                     </span>
                                </div>
                            )}
                        </div>
                        
                        <h2 className="text-2xl font-medium tracking-wide">{username}</h2>

                        <motion.form 
                            onSubmit={handleUnlock}
                            animate={{ x: shake % 2 === 0 ? [0, -10, 10, -10, 10, 0] : 0 }}
                            className="flex items-center gap-2"
                        >
                            <div className="relative group w-64">
                                <input 
                                    type="password" 
                                    placeholder="Enter PIN" 
                                    value={passwordInput}
                                    onChange={(e) => setPasswordInput(e.target.value)}
                                    autoFocus
                                    className="w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-5 py-3 text-sm text-white placeholder-white/40 outline-none focus:bg-white/20 focus:border-white/40 transition-all text-center tracking-widest"
                                />
                                <button 
                                    type="submit"
                                    className="absolute right-1.5 top-1.5 bottom-1.5 w-9 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
                                >
                                    <ArrowRight size={16} />
                                </button>
                            </div>
                        </motion.form>

                        <button 
                            onClick={() => setIsLoginView(false)}
                            className="text-xs text-white/60 hover:text-white mt-4 transition-colors uppercase tracking-widest"
                        >
                            Cancel
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>

        {/* Bottom Hint */}
        <AnimatePresence>
            {!isLoginView && (
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, y: [0, -10, 0] }}
                    exit={{ opacity: 0 }}
                    transition={{ y: { repeat: Infinity, duration: 2 } }}
                    className="relative z-10 pb-10 text-center text-white/50 text-sm font-light uppercase tracking-[0.2em]"
                >
                    Swipe up to open
                </motion.div>
            )}
        </AnimatePresence>
    </motion.div>
  );
};
