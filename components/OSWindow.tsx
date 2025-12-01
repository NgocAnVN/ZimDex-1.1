
import React, { useState } from 'react';
import { motion, Variants, useDragControls, useMotionValue, useTransform, useMotionTemplate } from 'framer-motion';
import { X, Minus, Square } from 'lucide-react';
import { useSystem } from '../contexts/SystemContext';

interface OSWindowProps {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: (finalPos?: { x: number, y: number }) => void;
  title: string;
  isActive?: boolean; // Keep for styling internal elements if needed, but rely on zIndex for layering
  zIndex: number;     // New explicit zIndex prop
  onFocus: () => void;
  launchOrigin: { x: number, y: number };
  initialPosition: { x: number, y: number };
  onDragEnd: (pos: { x: number, y: number }) => void;
  dragConstraints?: React.RefObject<Element>;
  width?: number;
  height?: number;
  isMinimized?: boolean;
}

export const OSWindow: React.FC<OSWindowProps> = ({
  children,
  isOpen,
  onClose,
  title,
  isActive,
  zIndex,
  onFocus,
  launchOrigin,
  initialPosition,
  onDragEnd,
  dragConstraints,
  width = 950,
  height = 600,
  isMinimized = false
}) => {
  const { animationSpeed, animationType, isTransparencyEnabled } = useSystem();
  
  // Capture the initialPosition only when the component FIRST mounts.
  const [mountPosition] = useState(initialPosition);

  // Setup drag controls to restrict dragging to the header
  const dragControls = useDragControls();

  // Track drag deltas
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Context Menu State
  const [contextMenu, setContextMenu] = React.useState<{ x: number; y: number } | null>(null);

  // Dynamically calculate transform origin based on current position (mount + drag) relative to the launch origin
  const originX = useTransform(x, (currentX) => launchOrigin.x - (mountPosition.x + currentX));
  const originY = useTransform(y, (currentY) => launchOrigin.y - (mountPosition.y + currentY));
  
  const transformOrigin = useMotionTemplate`${originX}px ${originY}px`;
  
  const baseDuration = 0.5;

  // Animation Curve Logic based on Type
  const getTransition = () => {
      const duration = baseDuration / animationSpeed;
      switch (animationType) {
          case 'snappy': 
              return { duration: duration * 0.6, ease: [0.2, 0.8, 0.2, 1] };
          case 'bouncy': 
              return { type: "spring", stiffness: 400, damping: 15, mass: 1 };
          case 'linear': 
              return { duration: duration * 0.5, ease: "linear" };
          case 'default':
          default: 
              return { duration: duration, ease: [0.16, 1, 0.3, 1] };
      }
  };

  const variants: Variants = {
    initial: {
      opacity: 0,
      scale: 0.6,
      filter: "blur(15px)",
    },
    animate: {
      opacity: 1,
      scale: 1,
      y: 0,
      filter: "blur(0px)",
      transition: getTransition() as any
    },
    minimized: {
      opacity: 0,
      scale: 0,
      // Removed fixed y: 400 to let transformOrigin guide it to the dock icon
      filter: "blur(10px)",
      transition: { duration: 0.4 / animationSpeed, ease: [0.4, 0, 0.2, 1] }
    },
    exit: {
      opacity: 0,
      scale: 0.92, // Subtle scale down
      filter: "blur(5px)",
      transition: {
        duration: 0.2 / animationSpeed,
        ease: "easeIn", 
      }
    }
  };

  const handleClose = () => {
    onClose({
      x: mountPosition.x + x.get(),
      y: mountPosition.y + y.get()
    });
  };

  const handleDragEnd = () => {
    onDragEnd({
      x: mountPosition.x + x.get(),
      y: mountPosition.y + y.get()
    });
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({ x: e.clientX, y: e.clientY });
  };

  React.useEffect(() => {
    const closeMenu = () => setContextMenu(null);
    if (contextMenu) {
      window.addEventListener('click', closeMenu);
    }
    return () => window.removeEventListener('click', closeMenu);
  }, [contextMenu]);

  return (
    <>
      <motion.div
        variants={variants}
        initial="initial"
        animate={isMinimized ? "minimized" : "animate"}
        exit="exit"
        drag={!isMinimized}
        dragListener={false}
        dragControls={dragControls}
        dragMomentum={false}
        dragConstraints={dragConstraints}
        dragElastic={0.1}
        onDragEnd={handleDragEnd}
        style={{
          width: width,
          height: height,
          position: 'absolute',
          top: mountPosition.y,
          left: mountPosition.x,
          x, 
          y,
          transformOrigin: transformOrigin,
          transformStyle: "preserve-3d",
          zIndex: zIndex, // Dynamic Z-Index applied here
          pointerEvents: isMinimized ? 'none' : 'auto', // Disable interaction when minimized
        }}
        className="flex flex-col group"
        onPointerDown={onFocus}
      >
        {/* The Window Frame */}
        <div 
          className={`
            w-full h-full
            rounded-xl border transition-colors duration-300
            shadow-[0_30px_80px_rgba(0,0,0,0.4)] dark:shadow-[0_30px_80px_rgba(0,0,0,0.6)]
            flex flex-col overflow-hidden
            ${isTransparencyEnabled ? 'bg-white/85 dark:bg-[#1e2228]/85 backdrop-blur-xl' : 'bg-white dark:bg-[#1e2228]'}
            ${isActive ? 'border-black/10 dark:border-white/20 shadow-[0_0_0_1px_rgba(0,0,0,0.05)] dark:shadow-[0_0_0_1px_rgba(255,255,255,0.1)]' : 'border-black/5 dark:border-white/5'}
          `}
        >
          {/* Title Bar - Draggable Area */}
          <div 
            onPointerDown={(e) => {
              onFocus();
              dragControls.start(e);
            }}
            onContextMenu={handleContextMenu}
            className={`
               h-10 flex items-center justify-between px-4 select-none shrink-0 cursor-grab active:cursor-grabbing touch-none border-b
               ${isActive ? 'bg-black/5 dark:bg-white/10 border-black/5 dark:border-white/10' : 'bg-black/0 dark:bg-white/5 border-black/5 dark:border-white/5'}
            `}
          >
             {/* Search/Title area */}
             <div className="flex items-center w-1/3 pointer-events-none">
                 <div className={`text-xs font-medium flex items-center gap-2 ${isActive ? 'text-gray-900 dark:text-white' : 'text-gray-500'}`}>
                   <span className="opacity-80">{title}</span>
                 </div>
             </div>
             
             {/* Window Controls */}
             <div className="flex items-center gap-4 text-gray-400 pointer-events-auto" onPointerDown={(e) => e.stopPropagation()}>
               <button className="hover:text-gray-900 dark:hover:text-white transition-colors"><Minus size={14} /></button>
               <button className="hover:text-gray-900 dark:hover:text-white transition-colors"><Square size={12} /></button>
               <button 
                  onClick={(e) => { e.stopPropagation(); handleClose(); }} 
                  className="hover:text-red-500 dark:hover:text-red-400 transition-colors"
               >
                 <X size={14} />
               </button>
             </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-hidden relative text-gray-800 dark:text-gray-200 cursor-auto">
            {children}
          </div>
        </div>
      </motion.div>

      {/* Context Menu */}
      {contextMenu && (
        <div 
            style={{ 
              position: 'fixed', 
              top: contextMenu.y, 
              left: contextMenu.x,
              zIndex: 9999 
            }}
            className={`w-48 border border-black/10 dark:border-white/15 rounded-lg shadow-2xl py-1.5 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-100 origin-top-left ${isTransparencyEnabled ? 'bg-white/95 dark:bg-[#141414]/95 backdrop-blur-xl' : 'bg-white dark:bg-[#141414]'}`}
            onClick={(e) => e.stopPropagation()}
        >
             <button className="flex items-center gap-3 px-3 py-2 hover:bg-blue-500 hover:text-white text-gray-800 dark:text-gray-200 dark:hover:text-white text-xs mx-1 rounded transition-colors text-left">
               Minimize
             </button>
             <button className="flex items-center gap-3 px-3 py-2 hover:bg-blue-500 hover:text-white text-gray-800 dark:text-gray-200 dark:hover:text-white text-xs mx-1 rounded transition-colors text-left">
               Maximize
             </button>
             <div className="h-[1px] bg-black/5 dark:bg-white/10 my-1 mx-2" />
             <button 
                onClick={() => { setContextMenu(null); handleClose(); }}
                className="flex items-center gap-3 px-3 py-2 hover:bg-red-500/80 text-gray-800 dark:text-gray-200 hover:text-white dark:hover:text-white text-xs mx-1 rounded transition-colors text-left"
             >
               Close
             </button>
        </div>
      )}
    </>
  );
};
