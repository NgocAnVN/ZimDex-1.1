
import React, { useState, useEffect } from 'react';

export const Windows10Env: React.FC = () => {
  const [phase, setPhase] = useState<'boot' | 'bsod'>('boot');
  const [progress, setProgress] = useState(0);

  // Boot Sequence Logic
  useEffect(() => {
    if (phase === 'boot') {
      const timer = setTimeout(() => setPhase('bsod'), 5000); // 5 seconds of boot logo
      return () => clearTimeout(timer);
    }
  }, [phase]);

  // BSOD Progress Counter Logic
  useEffect(() => {
    if (phase === 'bsod') {
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) return 100;
          // Randomly increment to simulate data collection, eventually getting stuck
          const increment = Math.random() * 5;
          const next = prev + increment;
          return next > 100 ? 100 : next;
        });
      }, 800);
      return () => clearInterval(interval);
    }
  }, [phase]);

  const WinLogo = ({ size = 40, className = "" }: { size?: number, className?: string }) => (
    <svg width={size} height={size} viewBox="0 0 88 88" className={className} shapeRendering="geometricPrecision">
      <path fill="currentColor" d="M0 12.5 L36 7.7 V42 H0 V12.5 Z M36 46 V80.5 L0 75.5 V46 H36 Z M40 6.5 L88 0 V42 H40 V6.5 Z M40 46 H88 V88 L40 81.5 V46 Z" />
    </svg>
  );

  // --- PHASE 1: BOOT SCREEN ---
  if (phase === 'boot') {
    return (
      <div className="fixed inset-0 bg-black z-[9999] flex flex-col items-center justify-center cursor-none select-none">
        <div className="text-[#00a4ef] mb-24 animate-pulse">
          <WinLogo size={100} />
        </div>
        <div className="relative w-12 h-12">
           <div className="w-12 h-12 border-4 border-transparent border-t-white rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  // --- PHASE 2: BLUE SCREEN OF DEATH (BSOD) ---
  return (
    <div className="fixed inset-0 z-[9999] bg-[#0078d7] text-white font-sans cursor-none select-none p-10 md:p-20 flex flex-col justify-center items-start">
        <div className="text-[8rem] md:text-[10rem] mb-4 md:mb-8 font-light leading-none">:(</div>
        <div className="text-xl md:text-3xl mb-8 md:mb-10 max-w-5xl leading-snug font-light">
            Your PC ran into a problem and needs to restart. We're just collecting some error info, and then we'll restart for you.
        </div>
        <div className="text-xl md:text-3xl mb-8 md:mb-12 font-light">
            {Math.round(progress)}% complete
        </div>
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-8">
            <div className="w-24 h-24 md:w-32 md:h-32 bg-white p-2 shrink-0">
                {/* QR Code Pattern Simulation */}
                <div className="w-full h-full bg-black" style={{ 
                    backgroundImage: 'linear-gradient(45deg, white 25%, transparent 25%, transparent 75%, white 75%, white), linear-gradient(45deg, white 25%, transparent 25%, transparent 75%, white 75%, white)',
                    backgroundSize: '10px 10px',
                    backgroundPosition: '0 0, 5px 5px'
                }} />
            </div>
            <div className="text-xs md:text-sm font-light space-y-1">
                <p>For more information about this issue and possible fixes, visit https://www.windows.com/stopcode</p>
                <p className="mt-2">If you call a support person, give them this info:</p>
                <p className="font-mono mt-1">Stop code: CRITICAL_PROCESS_DIED</p>
            </div>
        </div>
    </div>
  );
};
