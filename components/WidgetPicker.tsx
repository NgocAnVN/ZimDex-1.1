
import React, { useState } from 'react';
import { 
  Layout, Search, Clock, Cloud, Calendar, Activity, Music, 
  CheckSquare, StickyNote, ArrowRight
} from 'lucide-react';
import { WidgetType, WidgetStyle } from '../types';
import { WIDGET_STYLES } from './DesktopWidgets';

interface WidgetPickerProps {
  onDragStart: (e: React.DragEvent, type: WidgetType, style: WidgetStyle) => void;
}

const STYLES: { id: WidgetStyle; label: string }[] = [
  { id: 'glass', label: 'Glass' },
  { id: 'midnight', label: 'Midnight' },
  { id: 'ceramic', label: 'Ceramic' },
  { id: 'cyber', label: 'Cyber' },
  { id: 'retro', label: 'Retro' },
  { id: 'forest', label: 'Forest' },
  { id: 'sunset', label: 'Sunset' },
  { id: 'ocean', label: 'Ocean' },
  { id: 'terminal', label: 'Terminal' },
  { id: 'royal', label: 'Royal' },
  { id: 'minimal', label: 'Minimal' },
  { id: 'neumorph', label: 'Neumorph' },
  { id: 'brutal', label: 'Brutal' },
  { id: 'blueprint', label: 'Blueprint' },
  { id: 'outline', label: 'Outline' },
  { id: 'acrylic', label: 'Acrylic' },
  { id: 'paper', label: 'Paper' },
  { id: 'clay', label: 'Clay' },
  { id: 'tech', label: 'Tech' },
  { id: 'gothic', label: 'Gothic' },
];

const WIDGETS: { type: WidgetType; label: string; icon: any }[] = [
  { type: 'clock', label: 'Clock', icon: Clock },
  { type: 'weather', label: 'Weather', icon: Cloud },
  { type: 'calendar', label: 'Calendar', icon: Calendar },
  { type: 'system', label: 'System', icon: Activity },
  { type: 'music', label: 'Music', icon: Music },
  { type: 'search', label: 'Search', icon: Search },
  { type: 'todo', label: 'To-Do', icon: CheckSquare },
  { type: 'note', label: 'Note', icon: StickyNote },
];

export const WidgetPicker: React.FC<WidgetPickerProps> = ({ onDragStart }) => {
  const [selectedStyle, setSelectedStyle] = useState<WidgetStyle>('glass');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredStyles = STYLES.filter(s => s.label.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="w-full h-full flex bg-[#1e1e1e] text-white overflow-hidden font-sans rounded-xl">
      
      {/* Sidebar */}
      <div className="w-64 bg-[#141414] flex flex-col border-r border-white/5 shrink-0">
         <div className="p-5 border-b border-white/5">
             <div className="flex items-center gap-2 mb-4 text-blue-500">
                 <Layout size={20} />
                 <span className="font-bold text-lg tracking-tight">Widget Gallery</span>
             </div>
             <div className="relative bg-white/5 rounded-lg flex items-center px-3 py-2 border border-white/5 focus-within:border-blue-500/50 transition-colors">
                 <Search size={14} className="text-gray-500 mr-2" />
                 <input 
                    type="text" 
                    placeholder="Search styles..." 
                    className="bg-transparent border-none outline-none text-sm w-full text-gray-200 placeholder-gray-600"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                 />
             </div>
         </div>
         <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
             {filteredStyles.map(style => (
                 <button
                    key={style.id}
                    onClick={() => setSelectedStyle(style.id)}
                    className={`w-full text-left px-4 py-3 rounded-lg text-sm transition-all flex items-center justify-between group ${selectedStyle === style.id ? 'bg-blue-600 text-white shadow-md' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
                 >
                    <span className="font-medium">{style.label}</span>
                    {selectedStyle === style.id && <ArrowRight size={14} />}
                 </button>
             ))}
         </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col bg-[#1e1e1e]">
         <div className="h-16 border-b border-white/5 flex items-center px-8 shrink-0 bg-[#1e1e1e]">
             <h2 className="text-xl font-bold">{STYLES.find(s => s.id === selectedStyle)?.label} Widgets</h2>
             <span className="ml-3 text-xs text-gray-500 border border-white/10 px-2 py-0.5 rounded-full">8 available</span>
         </div>
         <div className="flex-1 overflow-y-auto custom-scrollbar p-8 bg-[#191919]">
             <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pb-8">
                 {WIDGETS.map(widget => (
                     <div 
                       key={widget.type}
                       draggable
                       onDragStart={(e) => onDragStart(e, widget.type, selectedStyle)}
                       className="flex flex-col gap-3 group cursor-grab active:cursor-grabbing"
                     >
                        {/* Preview Card - Styled based on selection */}
                        <div className={`aspect-[16/10] rounded-2xl relative overflow-hidden shadow-lg transition-transform group-hover:scale-105 border border-white/5 flex items-center justify-center ${WIDGET_STYLES[selectedStyle]}`}>
                            <div className="flex flex-col items-center gap-2 opacity-80">
                                <widget.icon size={32} />
                            </div>
                        </div>
                        <div className="text-center">
                            <div className="text-sm font-medium text-gray-400 group-hover:text-white transition-colors">{widget.label}</div>
                        </div>
                     </div>
                 ))}
             </div>
         </div>
      </div>
    </div>
  );
};
