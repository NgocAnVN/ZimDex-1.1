
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Cloud, Sun, Calendar as CalendarIcon, Clock as ClockIcon, 
  Activity, Music, Search, CheckSquare, X, Move, Thermometer, 
  Wind, Droplets, Play, Pause, SkipForward, SkipBack, StickyNote,
  Palette, Trash2, MoreHorizontal, Check
} from 'lucide-react';
import { WidgetInstance, WidgetType, WidgetStyle } from '../types';
import { useSystem } from '../contexts/SystemContext';

interface DesktopWidgetsProps {
  widgets: WidgetInstance[];
  onRemoveWidget: (id: string) => void;
  onUpdatePosition: (id: string, x: number, y: number) => void;
}

export const WIDGET_STYLES: Record<WidgetStyle, string> = {
  // Original
  glass: "bg-white/10 dark:bg-black/20 backdrop-blur-xl border border-white/20 text-white",
  midnight: "bg-[#0f0f0f]/90 border border-gray-800 text-gray-200 shadow-2xl",
  ceramic: "bg-[#f5f5f7]/90 border border-white text-gray-900 shadow-lg",
  cyber: "bg-blue-900/40 border border-blue-500/50 text-blue-100 shadow-[0_0_15px_rgba(59,130,246,0.2)] backdrop-blur-md",
  retro: "bg-[#f0e6d2] border border-[#d4c5b0] text-[#5c4b37] shadow-md",
  forest: "bg-[#1a2e1a]/80 border border-[#2d4a2d] text-[#e2f0e2] backdrop-blur-md",
  sunset: "bg-gradient-to-br from-orange-500/40 to-pink-600/40 border border-orange-300/30 text-white backdrop-blur-md",
  ocean: "bg-gradient-to-br from-cyan-900/60 to-blue-900/60 border border-cyan-500/30 text-cyan-50 backdrop-blur-md",
  terminal: "bg-black border border-green-500/50 text-green-500 font-mono shadow-[0_0_10px_rgba(34,197,94,0.1)]",
  royal: "bg-[#2e1065]/80 border border-purple-500/30 text-purple-100 backdrop-blur-md shadow-lg",
  
  // New UI Styles
  minimal: "bg-white text-black border-2 border-black rounded-none shadow-none",
  neumorph: "bg-[#e0e5ec] text-slate-700 shadow-[9px_9px_16px_rgb(163,177,198),-9px_-9px_16px_rgba(255,255,255,0.5)] rounded-2xl border border-white/40",
  brutal: "bg-[#facc15] text-black border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-none font-bold",
  blueprint: "bg-[#1e3a8a] text-blue-100 border-2 border-dashed border-blue-300/50 font-mono rounded-sm shadow-lg",
  outline: "bg-transparent text-white border-2 border-white/80 rounded-xl backdrop-blur-[2px] shadow-sm",
  acrylic: "bg-white/40 dark:bg-black/40 text-black dark:text-white backdrop-blur-2xl border border-white/20 shadow-xl rounded-2xl",
  paper: "bg-[#fef3c7] text-gray-800 border border-gray-300 shadow-md rounded-sm bg-[linear-gradient(#e5e7eb_1px,transparent_1px)] bg-[length:100%_20px]",
  clay: "bg-[#e0e0e0] text-gray-700 rounded-3xl shadow-[inset_8px_8px_16px_#bebebe,inset_-8px_-8px_16px_#ffffff] border-4 border-[#e0e0e0]",
  tech: "bg-[#09090b] text-cyan-400 border border-cyan-800 shadow-[0_0_20px_rgba(6,182,212,0.15)] bg-[radial-gradient(#155e75_1px,transparent_1px)] bg-[length:4px_4px] rounded-lg",
  gothic: "bg-[#1c1917] text-stone-300 border-4 double border-stone-600 rounded-sm font-serif shadow-2xl"
};

// --- Widget Components ---

const WeatherWidget = () => (
  <div className="flex flex-col h-full justify-between select-none p-1">
    <div className="flex items-start justify-between">
      <div>
        <h3 className="text-3xl font-light drop-shadow-md">24°</h3>
        <p className="text-xs opacity-80 drop-shadow-sm">Hanoi, Vietnam</p>
      </div>
      <Sun size={32} className="text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.6)]" />
    </div>
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs opacity-70">
        <span className="flex items-center gap-1"><Wind size={10} /> 12km/h</span>
        <span className="flex items-center gap-1"><Droplets size={10} /> 45%</span>
      </div>
      <div className="text-xs font-medium drop-shadow-sm">Mostly Sunny</div>
    </div>
  </div>
);

const ClockWidget = () => {
  const [time, setTime] = useState(new Date());
  const [showSeconds, setShowSeconds] = useState(false);
  const [contextMenu, setContextMenu] = useState<{x: number, y: number} | null>(null);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleClickOutside = () => setContextMenu(null);
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, []);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    setContextMenu({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <div 
      className="flex flex-col items-center justify-center h-full relative select-none"
      onContextMenu={handleContextMenu}
    >
      <div className="text-5xl font-light tracking-tighter drop-shadow-lg">
        {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: showSeconds ? '2-digit' : undefined, hour12: false })}
      </div>
      <div className="text-sm font-medium opacity-80 uppercase tracking-widest mt-1 drop-shadow-md">
        {time.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' })}
      </div>

      {/* Custom Context Menu */}
      <AnimatePresence>
        {contextMenu && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, transform: 'translateZ(50px)' }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute z-50 bg-white/90 dark:bg-[#2b2b2b]/95 backdrop-blur-xl border border-black/10 dark:border-white/10 rounded-lg shadow-2xl p-1 min-w-[140px]"
            style={{ top: contextMenu.y, left: contextMenu.x }}
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => { setShowSeconds(!showSeconds); setContextMenu(null); }}
              className="flex items-center justify-between w-full px-3 py-2 text-xs text-gray-800 dark:text-gray-200 hover:bg-blue-500 hover:text-white rounded transition-colors"
            >
              <span>Show Seconds</span>
              {showSeconds && <Check size={12} />}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const CalendarWidget = () => {
  const today = new Date();
  const days = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
  return (
    <div className="h-full flex flex-col select-none p-1">
      <div className="flex justify-between items-center mb-2 border-b border-current/10 pb-1">
        <span className="text-sm font-bold drop-shadow-sm">{today.toLocaleDateString([], { month: 'long', year: 'numeric' })}</span>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-[10px] mb-1 opacity-60">
        {days.map(d => <div key={d}>{d}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-xs flex-1">
        {Array.from({ length: 30 }).map((_, i) => {
          const day = i + 1;
          const isToday = day === today.getDate();
          return (
            <div 
              key={i} 
              className={`flex items-center justify-center rounded-full w-5 h-5 transition-all ${isToday ? 'bg-blue-500 font-bold text-white shadow-lg scale-110' : 'hover:bg-white/10'}`}
            >
              {day}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const SystemWidget = () => {
  const { batteryLevel } = useSystem();
  return (
    <div className="h-full flex flex-col justify-around px-1 select-none">
      <div className="flex items-center gap-3 group">
        <div className="w-8 h-8 rounded-full border-2 border-blue-500 flex items-center justify-center text-[10px] shadow-[0_0_10px_rgba(59,130,246,0.4)] group-hover:scale-110 transition-transform">32%</div>
        <div className="flex-1">
          <div className="text-xs opacity-70 mb-1 drop-shadow-sm">CPU Usage</div>
          <div className="h-1.5 bg-current/10 rounded-full overflow-hidden shadow-inner">
            <div className="h-full bg-blue-500 w-[32%] shadow-[0_0_5px_rgba(59,130,246,0.8)]" />
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3 group">
        <div className="w-8 h-8 rounded-full border-2 border-purple-500 flex items-center justify-center text-[10px] shadow-[0_0_10px_rgba(168,85,247,0.4)] group-hover:scale-110 transition-transform">4.2G</div>
        <div className="flex-1">
          <div className="text-xs opacity-70 mb-1 drop-shadow-sm">RAM</div>
          <div className="h-1.5 bg-current/10 rounded-full overflow-hidden shadow-inner">
            <div className="h-full bg-purple-500 w-[60%] shadow-[0_0_5px_rgba(168,85,247,0.8)]" />
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3 group">
        <div className="w-8 h-8 rounded-full border-2 border-green-500 flex items-center justify-center text-[10px] shadow-[0_0_10px_rgba(34,197,94,0.4)] group-hover:scale-110 transition-transform">{Math.round(batteryLevel)}%</div>
        <div className="flex-1">
          <div className="text-xs opacity-70 mb-1 drop-shadow-sm">Battery</div>
          <div className="h-1.5 bg-current/10 rounded-full overflow-hidden shadow-inner">
            <div className="h-full bg-green-500 shadow-[0_0_5px_rgba(34,197,94,0.8)]" style={{ width: `${batteryLevel}%` }} />
          </div>
        </div>
      </div>
    </div>
  );
};

const MusicWidget = () => (
  <div className="h-full flex flex-col select-none p-1">
    <div className="flex items-center gap-3 mb-3">
      <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-rose-500 rounded-md shadow-lg flex items-center justify-center transform rotate-3">
        <Music size={20} className="text-white drop-shadow-md" />
      </div>
      <div className="overflow-hidden">
        <div className="text-sm font-bold truncate drop-shadow-sm">Loretta</div>
        <div className="text-xs opacity-70 truncate drop-shadow-sm">Ginger Root</div>
      </div>
    </div>
    <div className="h-1 bg-current/10 rounded-full mb-3 overflow-hidden shadow-inner">
        <div className="h-full bg-current w-1/3 opacity-80" />
    </div>
    <div className="flex items-center justify-between px-2 mt-auto">
      <button className="hover:text-blue-400 hover:scale-110 transition-all"><SkipBack size={16} /></button>
      <button className="w-8 h-8 bg-white text-black rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-lg"><Pause size={14} fill="currentColor" /></button>
      <button className="hover:text-blue-400 hover:scale-110 transition-all"><SkipForward size={16} /></button>
    </div>
  </div>
);

const SearchWidget = () => (
  <div className="h-full flex items-center px-1">
    <div className="w-full h-10 bg-black/5 dark:bg-white/10 border border-current/10 rounded-full flex items-center px-4 gap-3 shadow-sm backdrop-blur-md group focus-within:ring-2 ring-blue-500/50 transition-all">
      <Search size={16} className="opacity-50 group-focus-within:opacity-100 transition-colors" />
      <input 
        type="text" 
        placeholder="Search..." 
        className="bg-transparent border-none outline-none text-sm placeholder-current/30 w-full drop-shadow-sm"
        onKeyDown={(e) => {
            if (e.key === 'Enter') {
                window.open(`https://www.google.com/search?q=${(e.target as HTMLInputElement).value}`, '_blank');
                (e.target as HTMLInputElement).value = '';
            }
        }}
      />
    </div>
  </div>
);

const TodoWidget = () => {
  const [todos, setTodos] = useState([{ id: 1, text: 'Buy groceries', done: false }, { id: 2, text: 'Finish project', done: true }]);
  return (
    <div className="h-full flex flex-col select-none p-1">
      <h3 className="text-xs font-bold uppercase tracking-wider opacity-70 mb-2 border-b border-current/10 pb-1 drop-shadow-sm">To-Do List</h3>
      <div className="flex-1 overflow-y-auto custom-scrollbar space-y-1">
        {todos.map(t => (
          <div key={t.id} className="flex items-center gap-2 group hover:bg-current/5 p-1 rounded transition-colors cursor-pointer" onClick={() => setTodos(todos.map(x => x.id === t.id ? { ...x, done: !x.done } : x))}>
            <button 
              className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${t.done ? 'bg-blue-500 border-blue-500 text-white' : 'border-current/30 hover:border-current'}`}
            >
              {t.done && <CheckSquare size={10} />}
            </button>
            <span className={`text-sm transition-all ${t.done ? 'line-through opacity-50' : 'drop-shadow-sm'}`}>{t.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const NoteWidget = ({ style }: { style: WidgetStyle }) => {
  const [content, setContent] = useState('Don\'t forget to hydrate! 💧');
  
  const isPaperStyle = style === 'retro' || style === 'paper';

  return (
    <div className="w-full h-full flex flex-col relative group">
       {/* Tape Visual - Only for certain styles */}
       {(style === 'retro' || style === 'glass' || style === 'ceramic' || style === 'paper') && (
         <div 
           className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-8 bg-white/30 backdrop-blur-[1px] rotate-1 shadow-[0_2px_4px_rgba(0,0,0,0.1)] z-20 pointer-events-none"
           style={{ transform: 'translateZ(10px)' }}
         />
       )}

       {/* Content Area */}
       <textarea 
         className={`w-full h-full bg-transparent border-none outline-none resize-none p-5 pt-8 text-lg placeholder-current/50 leading-relaxed font-hand tracking-wide ${isPaperStyle ? 'text-gray-800' : 'text-current'}`}
         value={content}
         onChange={(e) => setContent(e.target.value)}
         placeholder="Write a note..."
         spellCheck={false}
         style={{ transform: 'translateZ(2px)' }}
       />
       
       {/* Paper Texture Overlay for specific styles */}
       {style === 'retro' && (
          <div className="absolute inset-0 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')] opacity-40 mix-blend-multiply" />
       )}
       
       {/* Fold Effect (Bottom Right) - Only for opaque styles */}
       {(style !== 'glass' && style !== 'cyber' && style !== 'terminal' && style !== 'outline') && (
         <div 
           className="absolute bottom-0 right-0 w-0 h-0 
           border-b-[24px] border-b-black/10 
           border-l-[24px] border-l-transparent 
           shadow-[-2px_-2px_4px_rgba(0,0,0,0.05)]" 
           style={{ transform: 'translateZ(5px)' }}
         />
       )}
    </div>
  );
};

// --- Main Component ---

const WidgetCard: React.FC<{ 
  children: React.ReactNode; 
  title: string; 
  instance: WidgetInstance; 
  onRemove: () => void;
  onUpdatePosition: (x: number, y: number) => void;
  width?: number;
  height?: number;
  className?: string;
  overflow?: 'hidden' | 'visible';
}> = ({ children, title, instance, onRemove, onUpdatePosition, width = 200, height = 160, className = "", overflow = 'hidden' }) => {
  
  // 3D Animation Variants
  const variants = {
    hidden: { opacity: 0, scale: 0.5, rotateX: 45, z: -100 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      rotateX: 0, 
      z: 0,
      x: instance.x,
      y: instance.y,
      transition: { type: "spring" as const, stiffness: 200, damping: 20 }
    },
    hover: { 
      scale: 1.05, 
      rotateX: 5, 
      rotateY: -5, 
      z: 50,
      boxShadow: "0px 20px 40px rgba(0,0,0,0.4)",
      transition: { type: "spring" as const, stiffness: 300, damping: 15 }
    },
    tap: {
      scale: 0.98,
      rotateX: 2,
      z: 20,
      boxShadow: "0px 10px 20px rgba(0,0,0,0.3)",
    }
  };

  const styleClasses = WIDGET_STYLES[instance.style] || WIDGET_STYLES.glass;

  return (
    <motion.div
      drag
      dragMomentum={false}
      onDragEnd={(_, info) => {
        onUpdatePosition(instance.x + info.offset.x, instance.y + info.offset.y);
      }}
      variants={variants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      whileTap="tap"
      className={`absolute group pointer-events-auto ${className}`}
      style={{ 
        width, 
        height, 
        zIndex: instance.zIndex, 
        overflow: overflow,
        perspective: '1000px',
        transformStyle: 'preserve-3d',
        cursor: 'grab'
      }}
    >
      {/* 3D Container Wrapper */}
      <div 
        className={`w-full h-full relative transition-all duration-300 rounded-3xl ${styleClasses}`}
        style={{ 
          transformStyle: 'preserve-3d', 
          transform: 'rotateX(0deg)' 
        }}
      >
          {/* Drag Handle / Header - Floats above content */}
          <div 
            className={`absolute top-0 left-0 right-0 h-8 z-30 flex justify-end items-center px-2 opacity-0 group-hover:opacity-100 transition-opacity cursor-move pointer-events-auto`}
            style={{ transform: 'translateZ(30px)' }}
          >
             <button 
                onClick={onRemove} 
                onPointerDown={(e) => e.stopPropagation()}
                onMouseDown={(e) => e.stopPropagation()}
                className="p-1 rounded-full transition-colors mr-auto ml-2 bg-black/20 hover:bg-red-500 text-white border border-white/10 shadow-lg pointer-events-auto"
             >
                <X size={12} />
             </button>
          </div>
          
          {/* Widget Content */}
          <div 
            className={`w-full h-full p-5 relative z-10 pointer-events-auto`}
            style={{ transform: 'translateZ(10px)' }}
          >
            {children}
          </div>

          {/* Glossy Reflection Overlay (only for certain styles) */}
          {(instance.style === 'glass' || instance.style === 'cyber' || instance.style === 'ocean' || instance.style === 'outline') && (
             <div 
                className="absolute inset-0 rounded-3xl pointer-events-none bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-50" 
                style={{ transform: 'translateZ(1px)' }}
             />
          )}
      </div>
    </motion.div>
  );
};

export const DesktopWidgets: React.FC<DesktopWidgetsProps> = ({ widgets, onRemoveWidget, onUpdatePosition }) => {
  return (
    <div className="absolute inset-0 z-10 pointer-events-none overflow-visible perspective-[1200px]">
      <AnimatePresence>
      {widgets.map((widget) => {
        switch (widget.type) {
          case 'weather':
            return (
              <WidgetCard 
                key={widget.id} 
                title="Weather" 
                instance={widget} 
                onRemove={() => onRemoveWidget(widget.id)}
                onUpdatePosition={(x, y) => onUpdatePosition(widget.id, x, y)}
                width={180}
                height={140}
              >
                <WeatherWidget />
              </WidgetCard>
            );
          case 'clock':
            return (
              <WidgetCard 
                key={widget.id} 
                title="Clock" 
                instance={widget} 
                onRemove={() => onRemoveWidget(widget.id)}
                onUpdatePosition={(x, y) => onUpdatePosition(widget.id, x, y)}
                width={240}
                height={130}
                overflow="visible"
              >
                <ClockWidget />
              </WidgetCard>
            );
          case 'calendar':
            return (
              <WidgetCard 
                key={widget.id} 
                title="Calendar" 
                instance={widget} 
                onRemove={() => onRemoveWidget(widget.id)}
                onUpdatePosition={(x, y) => onUpdatePosition(widget.id, x, y)}
                width={220}
                height={200}
              >
                <CalendarWidget />
              </WidgetCard>
            );
          case 'system':
            return (
              <WidgetCard 
                key={widget.id} 
                title="System" 
                instance={widget} 
                onRemove={() => onRemoveWidget(widget.id)}
                onUpdatePosition={(x, y) => onUpdatePosition(widget.id, x, y)}
                width={200}
                height={160}
              >
                <SystemWidget />
              </WidgetCard>
            );
          case 'music':
            return (
              <WidgetCard 
                key={widget.id} 
                title="Music" 
                instance={widget} 
                onRemove={() => onRemoveWidget(widget.id)}
                onUpdatePosition={(x, y) => onUpdatePosition(widget.id, x, y)}
                width={220}
                height={140}
              >
                <MusicWidget />
              </WidgetCard>
            );
          case 'search':
            return (
              <WidgetCard 
                key={widget.id} 
                title="Search" 
                instance={widget} 
                onRemove={() => onRemoveWidget(widget.id)}
                onUpdatePosition={(x, y) => onUpdatePosition(widget.id, x, y)}
                width={300}
                height={60}
              >
                <SearchWidget />
              </WidgetCard>
            );
          case 'todo':
            return (
              <WidgetCard 
                key={widget.id} 
                title="To-Do" 
                instance={widget} 
                onRemove={() => onRemoveWidget(widget.id)}
                onUpdatePosition={(x, y) => onUpdatePosition(widget.id, x, y)}
                width={200}
                height={200}
              >
                <TodoWidget />
              </WidgetCard>
            );
          case 'note':
            return (
              <WidgetCard 
                key={widget.id} 
                title="Note" 
                instance={widget} 
                onRemove={() => onRemoveWidget(widget.id)}
                onUpdatePosition={(x, y) => onUpdatePosition(widget.id, x, y)}
                width={240}
                height={240}
                overflow="visible"
              >
                <NoteWidget style={widget.style} />
              </WidgetCard>
            );
          default:
            return null;
        }
      })}
      </AnimatePresence>
    </div>
  );
};
