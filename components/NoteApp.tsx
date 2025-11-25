
import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Search, Calendar, Save, PenTool, Book, Clock, Star, MoreVertical, ChevronLeft, Feather, Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSystem } from '../contexts/SystemContext';

interface Note {
  id: string;
  title: string;
  content: string;
  date: string;
  moodColor: string;
  isFavorite?: boolean;
}

const MOOD_COLORS = [
    { color: 'bg-[#C0A080]', label: 'Sand' },
    { color: 'bg-[#8B5A2B]', label: 'Bronze' },
    { color: 'bg-[#556B2F]', label: 'Olive' },
    { color: 'bg-[#800020]', label: 'Burgundy' },
    { color: 'bg-[#2F4F4F]', label: 'Slate' },
    { color: 'bg-[#191970]', label: 'Midnight' },
    { color: 'bg-[#4B0082]', label: 'Indigo' },
];

export const NoteApp: React.FC = () => {
  const { theme, toggleTheme } = useSystem();
  const isDarkMode = theme === 'dark';

  const [notes, setNotes] = useState<Note[]>(() => {
    try {
        const saved = localStorage.getItem('zimdex-notes-v2');
        return saved ? JSON.parse(saved) : [
            { 
                id: '1', 
                title: 'Một buổi chiều yên ả', 
                content: 'Hôm nay nắng nhẹ, gió thổi hiu hiu. Mình ngồi bên cửa sổ, nhâm nhi tách trà và nghe nhạc Trịnh. Cuộc sống đôi khi chỉ cần những khoảnh khắc bình yên như thế này...', 
                date: new Date().toISOString(), 
                moodColor: 'bg-[#556B2F]',
                isFavorite: true
            }
        ];
    } catch {
        return [];
    }
  });
  const [activeNoteId, setActiveNoteId] = useState<string | null>(notes[0]?.id || null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    localStorage.setItem('zimdex-notes-v2', JSON.stringify(notes));
  }, [notes]);

  const activeNote = notes.find(n => n.id === activeNoteId);

  const createNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: '',
      content: '',
      date: new Date().toISOString(),
      moodColor: MOOD_COLORS[0].color,
      isFavorite: false
    };
    setNotes([newNote, ...notes]);
    setActiveNoteId(newNote.id);
  };

  const updateNote = (id: string, updates: Partial<Note>) => {
    setNotes(notes.map(n => n.id === id ? { ...n, ...updates } : n));
  };

  const deleteNote = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newNotes = notes.filter(n => n.id !== id);
    setNotes(newNotes);
    if (activeNoteId === id) {
        setActiveNoteId(newNotes.length > 0 ? newNotes[0].id : null);
    }
  };

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
      e.stopPropagation();
      const note = notes.find(n => n.id === id);
      if (note) {
          updateNote(id, { isFavorite: !note.isFavorite });
      }
  }

  const filteredNotes = notes.filter(n => 
    n.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    n.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDateFull = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  };

  const formatTime = (iso: string) => {
      return new Date(iso).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  };

  // Animation Variants
  const editorContainerVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.98 },
    visible: { 
        opacity: 1, 
        y: 0, 
        scale: 1,
        transition: { 
            duration: 0.4, 
            ease: [0.2, 0.65, 0.3, 0.9] as any,
            staggerChildren: 0.1
        }
    },
    exit: { 
        opacity: 0, 
        y: 10, 
        transition: { duration: 0.2 } 
    }
  };

  const contentItemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  return (
    <div className={`flex h-full font-sans overflow-hidden transition-colors duration-500 ${isDarkMode ? 'bg-[#0a0a0a] text-[#e0e0e0]' : 'bg-[#f9f9f9] text-[#2d2d2d]'}`}>
      
      {/* Luxurious Sidebar */}
      <div className={`w-80 flex flex-col border-r relative z-20 transition-colors duration-500 ${isDarkMode ? 'bg-[#0f0f0f] border-[#222]' : 'bg-[#f0f0f0] border-[#e0e0e0]'}`}>
         {/* Sidebar Header */}
         <div className="p-6 pb-4">
             <div className="flex items-center justify-between mb-8">
                 <h1 className={`text-2xl font-bold tracking-tight flex items-center gap-3 font-playfair italic ${isDarkMode ? 'text-white' : 'text-[#1a1a1a]'}`}>
                     <Feather className="text-[#d4af37]" size={24} />
                     <span>Journal</span>
                 </h1>
                 <motion.button 
                   whileHover={{ scale: 1.1, rotate: 90 }}
                   whileTap={{ scale: 0.9 }}
                   onClick={toggleTheme}
                   className={`p-2 rounded-full transition-colors ${isDarkMode ? 'hover:bg-[#222] text-gray-400 hover:text-white' : 'hover:bg-gray-200 text-gray-500 hover:text-black'}`}
                 >
                    {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
                 </motion.button>
             </div>

             <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={createNote} 
                className={`
                   w-full py-3 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 group mb-6 border
                   ${isDarkMode 
                      ? 'bg-[#1a1a1a] hover:bg-[#222] border-[#333] hover:border-[#444] text-gray-300 hover:text-white' 
                      : 'bg-white hover:bg-gray-100 border-[#ddd] hover:border-[#ccc] text-gray-600 hover:text-black shadow-sm'}
                `}
             >
                 <Plus size={16} className="text-[#d4af37] group-hover:scale-110 transition-transform" />
                 <span>New Entry</span>
             </motion.button>

             <div className="relative mb-2 group">
                 <Search size={14} className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors ${isDarkMode ? 'text-gray-600 group-focus-within:text-[#d4af37]' : 'text-gray-400 group-focus-within:text-[#d4af37]'}`} />
                 <input 
                    type="text" 
                    placeholder="Search memories..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`
                       w-full bg-transparent border-b py-2 pl-9 pr-3 text-sm outline-none transition-all font-lora
                       ${isDarkMode 
                          ? 'border-[#333] focus:border-[#d4af37] text-gray-300 placeholder-gray-700' 
                          : 'border-[#ccc] focus:border-[#d4af37] text-gray-800 placeholder-gray-400'}
                    `}
                 />
             </div>
         </div>

         {/* Note List */}
         <div className="flex-1 overflow-y-auto custom-scrollbar px-4 pb-4 space-y-2">
             <AnimatePresence mode="popLayout">
             {filteredNotes.map(note => (
                 <motion.div
                    key={note.id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                    onClick={() => setActiveNoteId(note.id)}
                    className={`
                        group relative p-4 rounded-lg cursor-pointer transition-all border-l-2
                        ${activeNoteId === note.id 
                            ? (isDarkMode ? 'bg-[#161616] border-[#d4af37]' : 'bg-white border-[#d4af37] shadow-md') 
                            : (isDarkMode ? 'bg-transparent border-transparent hover:bg-[#141414] hover:border-gray-700' : 'bg-transparent border-transparent hover:bg-white/60 hover:border-gray-300')
                        }
                    `}
                 >
                    <div className="flex flex-col gap-1.5">
                        <div className="flex justify-between items-baseline">
                             <h3 className={`text-base font-bold line-clamp-1 font-playfair ${activeNoteId === note.id ? (isDarkMode ? 'text-white' : 'text-black') : (isDarkMode ? 'text-gray-400 group-hover:text-gray-200' : 'text-gray-600 group-hover:text-black')}`}>
                                 {note.title.trim() || 'Untitled'}
                             </h3>
                             <span className={`text-[10px] uppercase tracking-widest font-sans shrink-0 ml-2 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`}>
                                {new Date(note.date).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })}
                             </span>
                        </div>
                        <p className={`text-sm line-clamp-2 font-lora italic leading-relaxed ${activeNoteId === note.id ? (isDarkMode ? 'text-gray-400' : 'text-gray-600') : (isDarkMode ? 'text-gray-600' : 'text-gray-500')}`}>
                             {note.content || 'Empty entry...'}
                        </p>
                        
                        <div className={`flex items-center justify-between mt-2 pt-2 border-t opacity-0 group-hover:opacity-100 transition-opacity ${isDarkMode ? 'border-[#1a1a1a]' : 'border-gray-100'}`}>
                            <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${note.moodColor}`} />
                                {note.isFavorite && <Star size={10} className="text-[#d4af37] fill-[#d4af37]" />}
                            </div>
                            <div className="flex gap-2">
                                <motion.button whileHover={{ scale: 1.2 }} onClick={(e) => toggleFavorite(note.id, e)} className={`${isDarkMode ? 'text-gray-600' : 'text-gray-400'} hover:text-[#d4af37]`}>
                                    <Star size={12} />
                                </motion.button>
                                <motion.button whileHover={{ scale: 1.2 }} onClick={(e) => deleteNote(note.id, e)} className={`${isDarkMode ? 'text-gray-600' : 'text-gray-400'} hover:text-red-400`}>
                                    <Trash2 size={12} />
                                </motion.button>
                            </div>
                        </div>
                    </div>
                 </motion.div>
             ))}
             </AnimatePresence>
             {filteredNotes.length === 0 && (
                 <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`text-center py-12 flex flex-col items-center gap-3 ${isDarkMode ? 'text-gray-700' : 'text-gray-400'}`}>
                     <Feather size={24} className="opacity-20" />
                     <span className="text-xs font-lora italic">Start writing your story...</span>
                 </motion.div>
             )}
         </div>
      </div>

      {/* Luxurious Editor Area */}
      <div className={`flex-1 flex flex-col relative overflow-hidden transition-colors duration-500 ${isDarkMode ? 'bg-[#050505]' : 'bg-[#fdfbf7]'}`}>
         {/* Subtle Paper Texture Overlay */}
         <div className={`absolute inset-0 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] ${isDarkMode ? 'opacity-[0.03]' : 'opacity-[0.4] mix-blend-multiply'}`} />

         <AnimatePresence mode="wait">
         {activeNote ? (
             <motion.div 
                key={activeNote.id}
                variants={editorContainerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="flex-1 flex flex-col w-full h-full relative z-10"
             >
                {/* Minimalist Toolbar */}
                <motion.div variants={contentItemVariants} className="h-16 flex items-center justify-between px-8 md:px-16 shrink-0">
                    <div className={`flex items-center gap-4 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                         <span className="text-xs uppercase tracking-[0.2em] font-medium text-[#d4af37]">
                            {formatDateFull(activeNote.date)}
                         </span>
                         <span className={`w-1 h-1 rounded-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-300'}`} />
                         <span className={`text-xs font-serif italic ${isDarkMode ? 'text-gray-600' : 'text-gray-500'}`}>
                            {formatTime(activeNote.date)}
                         </span>
                    </div>
                    
                    <div className="flex items-center gap-4">
                        {/* Mood Selector - Subtle Dots */}
                        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${isDarkMode ? 'bg-[#111] border-[#222]' : 'bg-white border-gray-200 shadow-sm'}`}>
                            {MOOD_COLORS.map((m) => (
                                <motion.button
                                    key={m.color}
                                    whileHover={{ scale: 1.2 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => updateNote(activeNote.id, { moodColor: m.color })}
                                    className={`w-3 h-3 rounded-full transition-all duration-300 ${m.color} ${activeNote.moodColor === m.color ? 'scale-125 ring-2 ring-offset-1 ' + (isDarkMode ? 'ring-[#050505] ring-offset-gray-500' : 'ring-white ring-offset-gray-400') : 'opacity-40 hover:opacity-100'}`}
                                    title={m.label}
                                />
                            ))}
                        </div>
                        
                        <div className={`flex items-center gap-2 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`}>
                            <motion.button whileHover={{ scale: 1.1, rotate: 10 }} whileTap={{ scale: 0.9 }} onClick={() => updateNote(activeNote.id, { isFavorite: !activeNote.isFavorite })}>
                                <Star size={16} className={`transition-colors ${activeNote.isFavorite ? 'text-[#d4af37] fill-[#d4af37]' : 'hover:text-gray-400'}`} />
                            </motion.button>
                            <div className={`w-[1px] h-4 ${isDarkMode ? 'bg-[#222]' : 'bg-gray-200'}`} />
                            <div className={`flex items-center gap-1.5 text-[10px] uppercase tracking-wider ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`}>
                                <Save size={10} /> Saved
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Content Container */}
                <div className="flex-1 overflow-y-auto custom-scrollbar px-8 md:px-16 pb-12 max-w-5xl mx-auto w-full">
                    {/* Title Input */}
                    <motion.input 
                        variants={contentItemVariants}
                        type="text"
                        value={activeNote.title}
                        onChange={(e) => updateNote(activeNote.id, { title: e.target.value })}
                        placeholder="Tiêu đề..."
                        className={`
                            w-full bg-transparent text-4xl md:text-5xl font-bold outline-none border-none font-playfair tracking-tight mb-8 mt-4 transition-colors
                            ${isDarkMode ? 'text-[#e0e0e0] placeholder-gray-800' : 'text-[#1a1a1a] placeholder-gray-200'}
                        `}
                        style={{ lineHeight: 1.2 }}
                    />
                    
                    {/* Decorative Divider */}
                    <motion.div variants={contentItemVariants} className="w-16 h-[2px] bg-[#d4af37]/50 mb-8" />

                    {/* Content Textarea */}
                    <motion.textarea 
                        variants={contentItemVariants}
                        value={activeNote.content}
                        onChange={(e) => updateNote(activeNote.id, { content: e.target.value })}
                        placeholder="Viết nên câu chuyện của bạn..."
                        className={`
                            w-full h-full min-h-[500px] bg-transparent text-lg md:text-xl leading-loose outline-none border-none resize-none font-lora selection:bg-[#d4af37]/20 selection:text-[#d4af37] transition-colors
                            ${isDarkMode ? 'text-gray-300 placeholder-gray-800' : 'text-gray-800 placeholder-gray-200'}
                        `}
                        spellCheck={false}
                    />
                </div>
             </motion.div>
         ) : (
             <motion.div 
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={`flex-1 flex flex-col items-center justify-center gap-8 ${isDarkMode ? 'text-gray-600' : 'text-gray-300'}`}
             >
                 <div className="relative group">
                     <motion.div 
                        animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.2, 0.1] }}
                        transition={{ duration: 4, repeat: Infinity }}
                        className="absolute inset-0 bg-[#d4af37] blur-3xl rounded-full" 
                     />
                     <motion.div
                        animate={{ y: [0, -15, 0] }}
                        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                     >
                        <Book size={64} className={`relative ${isDarkMode ? 'text-gray-800' : 'text-gray-200'}`} strokeWidth={0.5} />
                     </motion.div>
                 </div>
                 <div className="text-center space-y-3">
                    <h3 className={`text-xl font-playfair italic ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Silence is a source of great strength.</h3>
                    <p className={`text-xs font-sans uppercase tracking-widest ${isDarkMode ? 'text-gray-700' : 'text-gray-400'}`}>Select an entry or start a new one.</p>
                 </div>
             </motion.div>
         )}
         </AnimatePresence>
      </div>
    </div>
  );
};
