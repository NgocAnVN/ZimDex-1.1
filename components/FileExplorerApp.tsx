
import React, { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { 
  ArrowLeft, ArrowRight, ArrowUp, Search, 
  Folder, FileText, Image as ImageIcon, Music, Video, FileCode,
  LayoutGrid, List as ListIcon, Star, Cloud, HardDrive,
  ChevronRight, Download, Laptop, Shield, Server, Wifi, Smartphone,
  Monitor, Trash2, Edit2, Info, ExternalLink, X, Plus, Save,
  MoreVertical, Check, SortAsc, SortDesc, Play, Pause, ZoomIn, ZoomOut, AlertTriangle, Package
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileSystemNode, FileType } from '../types';
import { useSystem } from '../contexts/SystemContext';

// --- Mock Data with Content ---

const initialFileSystem: FileSystemNode[] = [
  // Root Level Items
  { id: 'desktop', parentId: 'root', name: 'Desktop', type: 'folder', size: '', date: 'Today' },
  { id: 'downloads', parentId: 'root', name: 'Downloads', type: 'folder', size: '', date: 'Today' },
  { id: 'docs', parentId: 'root', name: 'Documents', type: 'folder', size: '', date: 'Yesterday' },
  { id: 'pics', parentId: 'root', name: 'Pictures', type: 'folder', size: '', date: 'Jan 10' },
  { id: 'music', parentId: 'root', name: 'Music', type: 'folder', size: '', date: 'Jan 5' },
  { id: 'c_drive', parentId: 'root', name: 'Local Disk (C:)', type: 'drive', size: '1.2 TB free', date: '', meta: { totalSpace: '2 TB', freeSpace: '1.2 TB', percentUsed: 40 } },
  { id: 'network', parentId: 'root', name: 'Network', type: 'network', size: '', date: '' },
  
  // Desktop Content
  { id: 'c1', parentId: 'desktop', name: 'main.tsx', type: 'code', size: '12 KB', date: 'Today 10:42 AM', content: "import React from 'react';\n\nexport const App = () => {\n  return <div>Hello World</div>;\n}" },
  { id: 'link1', parentId: 'desktop', name: 'todo_list.txt', type: 'text', size: '2 KB', date: 'Yesterday', content: "- Fix bugs in File Explorer\n- Implement file saving\n- Buy groceries\n- Water the plants" },
  { id: 'f_project', parentId: 'desktop', name: 'Project Alpha', type: 'folder', size: '', date: 'Jan 20' },

  // Documents Content
  { id: 'd1', parentId: 'docs', name: 'Project_Specs.txt', type: 'text', size: '2.4 KB', date: 'Jan 15', content: "PROJECT SPECIFICATIONS v1.0\n\n1. Overview\nThe system must be robust and secure.\n\n2. Requirements\n- React 18\n- TypeScript\n- Tailwind CSS" },
  { id: 'w1', parentId: 'f_project', name: 'Readme.md', type: 'code', size: '1 KB', date: 'Jan 16', content: "# Project Alpha\n\nThis is a top secret project.\n\n## Installation\n`npm install`" },

  // Downloads
  { id: 'dl1', parentId: 'downloads', name: 'Installer_v2.exe', type: 'archive', size: '150 MB', date: 'Today', content: "" },

  // Pictures
  { id: 'p1', parentId: 'pics', name: 'Cyberpunk_City.jpg', type: 'image', size: '4.2 MB', date: 'Jan 10', content: "https://images.unsplash.com/photo-1605647540924-852290f6b0d5?q=80&w=1000&auto=format&fit=crop" },
  { id: 'p2', parentId: 'pics', name: 'Abstract_Neon.png', type: 'image', size: '1.1 MB', date: 'Jan 11', content: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1000&auto=format&fit=crop" },
  
  // Music
  { id: 'm1', parentId: 'music', name: 'Loretta - Ginger Root.mp3', type: 'audio', size: '8.4 MB', date: 'Jan 05', content: "https://archive.org/download/ginger-root-loretta/Ginger%20Root%20-%20Loretta.mp3", meta: { duration: "3:12" } },
  { id: 'm2', parentId: 'music', name: 'Ambient_Drift.mp3', type: 'audio', size: '5 MB', date: 'Jan 02', content: "https://files.freemusicarchive.org/storage-freemusicarchive-org/music/ccCommunity/Kai_Engel/Satin/Kai_Engel_-_04_-_Sentinel.mp3" },
  { id: 'm3', parentId: 'music', name: 'Roar - I Can\'t Handle Change (Instrumental).mp3', type: 'audio', size: '3.5 MB', date: 'Today', content: "https://files.freemusicarchive.org/storage-freemusicarchive-org/music/no_curator/Tours/Enthusiast/Tours_-_01_-_Enthusiast.mp3" },
  { id: 'm4', parentId: 'music', name: 'Tours - Enthusiast.mp3', type: 'audio', size: '3.5 MB', date: 'Today', content: "https://files.freemusicarchive.org/storage-freemusicarchive-org/music/no_curator/Tours/Enthusiast/Tours_-_01_-_Enthusiast.mp3" },

  // C Drive
  { id: 'zimdex', parentId: 'c_drive', name: 'ZimDex', type: 'folder', size: '', date: 'Jan 1' },
  { id: 'sys32', parentId: 'zimdex', name: 'System32', type: 'folder', size: '', date: 'Jan 1' },
  { id: 'hosts', parentId: 'sys32', name: 'hosts', type: 'code', size: '1 KB', date: 'Jan 1', content: "127.0.0.1 localhost\n::1 localhost" },
];

interface FileExplorerAppProps {
  onOpenFile?: (file: FileSystemNode, onSave: (id: string, content: string) => void) => void;
  onSystemDelete?: () => void;
  onRunInstaller?: () => void;
}

export const FileExplorerApp: React.FC<FileExplorerAppProps> = ({ onOpenFile, onSystemDelete, onRunInstaller }) => {
  const { theme } = useSystem();
  // State
  const [currentPath, setCurrentPath] = useState<string[]>(['root']);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [fileSystem, setFileSystem] = useState<FileSystemNode[]>(initialFileSystem);
  const [sortConfig, setSortConfig] = useState<{ key: 'name' | 'date' | 'size'; dir: 'asc' | 'desc' }>({ key: 'name', dir: 'asc' });
  
  const [isFrozen, setIsFrozen] = useState(false);
  
  // Context Menu & Modals
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; fileId: string | null } | null>(null);
  const [propertiesFile, setPropertiesFile] = useState<FileSystemNode | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState<'folder' | 'file' | null>(null);
  const [newItemName, setNewItemName] = useState('');
  const [deleteConfirmation, setDeleteConfirmation] = useState<{ isOpen: boolean, id: string | null }>({ isOpen: false, id: null });
  const [renameModal, setRenameModal] = useState<{ isOpen: boolean, id: string | null, name: string }>({ isOpen: false, id: null, name: '' });

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.02,
        delayChildren: 0.01
      }
    },
    exit: { 
      opacity: 0,
      transition: { duration: 0.1 }
    }
  };

  const fileItemVariants = {
    hidden: { opacity: 0, y: 10, scale: 0.98 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { type: "spring" as const, stiffness: 350, damping: 25, mass: 1 }
    },
    exit: { opacity: 0, scale: 0.95, transition: { duration: 0.1 } }
  };

  useEffect(() => {
    if (isCreatingNew) {
        setNewItemName('');
    }
  }, [isCreatingNew]);

  const currentFolderId = currentPath[currentPath.length - 1];

  // --- Helpers ---

  const getFiles = useMemo(() => {
    let filtered = fileSystem.filter(f => {
        if (currentFolderId === 'root') return f.parentId === 'root';
        return f.parentId === currentFolderId;
    });

    if (searchQuery) {
        filtered = filtered.filter(f => f.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }

    return filtered.sort((a, b) => {
        const modifier = sortConfig.dir === 'asc' ? 1 : -1;
        if (sortConfig.key === 'name') return a.name.localeCompare(b.name) * modifier;
        if (sortConfig.key === 'date') return a.date.localeCompare(b.date) * modifier;
        if (sortConfig.key === 'size') return a.size.localeCompare(b.size) * modifier;
        return 0;
    });
  }, [fileSystem, currentFolderId, searchQuery, sortConfig]);

  const getCurrentFolderName = () => {
    if (currentFolderId === 'root') return 'This PC';
    return fileSystem.find(f => f.id === currentFolderId)?.name || 'Unknown';
  };

  const getFileIcon = (type: FileType) => {
    switch (type) {
      case 'folder': return <Folder className="text-yellow-400 fill-yellow-400/20" />;
      case 'image': return <ImageIcon className="text-purple-500 dark:text-purple-400" />;
      case 'text': return <FileText className="text-blue-500 dark:text-blue-400" />;
      case 'code': return <FileCode className="text-green-500 dark:text-green-400" />;
      case 'audio': return <Music className="text-pink-500 dark:text-pink-400" />;
      case 'video': return <Video className="text-red-500 dark:text-red-400" />;
      case 'archive': return <Package className="text-orange-500 dark:text-orange-400" />;
      case 'drive': return <HardDrive className="text-gray-500 dark:text-gray-300" />;
      case 'network': return <Cloud className="text-blue-400 dark:text-blue-300" />;
      case 'computer': return <Monitor className="text-blue-600 dark:text-blue-400" />;
      default: return <FileText className="text-gray-400" />;
    }
  };

  // --- Actions ---

  const handleNavigate = (id: string) => {
    setCurrentPath([...currentPath, id]);
    setSearchQuery('');
    setSelectedId(null);
  };

  const handleNavigateUp = () => {
    if (currentPath.length > 1) {
      setCurrentPath(currentPath.slice(0, -1));
      setSelectedId(null);
    }
  };

  const handleSaveFile = (id: string, newContent: string) => {
    setFileSystem(prev => prev.map(f => f.id === id ? { ...f, content: newContent, date: 'Just now' } : f));
  };

  const handleOpenItem = (file: FileSystemNode) => {
    // Special case for the installer
    if (file.id === 'dl1' && onRunInstaller) {
        onRunInstaller();
        return;
    }

    if (['folder', 'drive', 'network'].includes(file.type)) {
        handleNavigate(file.id);
    } else {
        if (onOpenFile) {
            onOpenFile(file, handleSaveFile);
        }
    }
  };

  const handleCreateItem = (type: 'folder' | 'file', name: string) => {
    const finalName = name.trim() || `New ${type === 'folder' ? 'Folder' : 'Text File'}`;
    const newItem: FileSystemNode = {
        id: `${type}_${Date.now()}`,
        parentId: currentFolderId,
        name: finalName,
        type: type === 'folder' ? 'folder' : 'text',
        size: type === 'folder' ? '' : '0 KB',
        date: 'Just now',
        content: type === 'file' ? '' : undefined
    };
    setFileSystem(prev => [...prev, newItem]);
    setIsCreatingNew(null);
  };

  const requestDelete = (id: string) => {
    setDeleteConfirmation({ isOpen: true, id });
  };

  const confirmDelete = () => {
     const id = deleteConfirmation.id;
     if (!id) return;
     
     const idsToDelete = new Set<string>();
     const collectIds = (targetId: string) => {
         idsToDelete.add(targetId);
         fileSystem.filter(f => f.parentId === targetId).forEach(child => collectIds(child.id));
     };
     collectIds(id);

     if (idsToDelete.has('sys32')) {
         setDeleteConfirmation({ isOpen: false, id: null });
         setIsFrozen(true); 
         setTimeout(() => {
             if (onSystemDelete) {
                 onSystemDelete();
             }
         }, 3000);
         return; 
     }

     setFileSystem(prev => prev.filter(f => !idsToDelete.has(f.id)));
     if (selectedId && idsToDelete.has(selectedId)) setSelectedId(null);
     setDeleteConfirmation({ isOpen: false, id: null });
  };

  const handleRename = (id: string) => {
    const file = fileSystem.find(f => f.id === id);
    if (!file) return;
    setRenameModal({ isOpen: true, id, name: file.name });
  };

  const confirmRename = () => {
      if (renameModal.id && renameModal.name.trim()) {
          setFileSystem(prev => prev.map(f => f.id === renameModal.id ? { ...f, name: renameModal.name.trim() } : f));
          setRenameModal({ isOpen: false, id: null, name: '' });
      }
  };

  // --- Context Menu ---

  const handleContextMenu = (e: React.MouseEvent, fileId: string | null) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({ x: e.clientX, y: e.clientY, fileId });
    if (fileId) setSelectedId(fileId);
  };

  useEffect(() => {
      const close = () => setContextMenu(null);
      window.addEventListener('click', close);
      return () => window.removeEventListener('click', close);
  }, []);

  return (
    <div className="w-full h-full flex flex-col bg-white/90 dark:bg-[#191919]/80 backdrop-blur-2xl text-gray-800 dark:text-gray-200 font-sans overflow-hidden relative transition-colors duration-300">

      {/* Freeze Overlay */}
      {isFrozen && (
         <div 
            className="absolute inset-0 z-[9999] bg-white/5 backdrop-blur-[1px]" 
            style={{ cursor: 'wait' }}
            onClick={e => e.stopPropagation()}
            onContextMenu={e => e.stopPropagation()}
         />
      )}

      {/* Top Bar */}
      <div className="h-12 bg-gray-50/90 dark:bg-[#202020] border-b border-black/5 dark:border-white/5 flex items-center px-4 gap-4 shrink-0 transition-colors">
         {/* Navigation Controls */}
         <div className="flex items-center gap-1">
            <button onClick={handleNavigateUp} disabled={currentPath.length <= 1} className="p-1.5 rounded hover:bg-black/5 dark:hover:bg-white/10 disabled:opacity-30 transition-colors">
              <ArrowLeft size={16} />
            </button>
            <button disabled className="p-1.5 rounded hover:bg-black/5 dark:hover:bg-white/10 disabled:opacity-30 transition-colors">
              <ArrowRight size={16} />
            </button>
            <button onClick={handleNavigateUp} disabled={currentPath.length <= 1} className="p-1.5 rounded hover:bg-black/5 dark:hover:bg-white/10 disabled:opacity-30 transition-colors">
               <ArrowUp size={16} />
            </button>
         </div>

         {/* Breadcrumbs */}
         <div className="flex-1 bg-gray-200/50 dark:bg-[#111]/50 border border-black/5 dark:border-white/10 rounded flex items-center px-3 h-8 text-sm text-gray-600 dark:text-gray-400 gap-2 hover:border-black/10 dark:hover:border-white/20 transition-colors overflow-hidden">
            <Laptop size={14} className="text-gray-500 shrink-0" />
            <ChevronRight size={14} className="text-gray-400 dark:text-gray-600 shrink-0" />
            <div className="flex items-center gap-2 overflow-hidden">
                <AnimatePresence mode="popLayout">
                    {currentPath.map((pid, idx) => {
                        const name = pid === 'root' ? 'This PC' : fileSystem.find(f => f.id === pid)?.name || pid;
                        return (
                            <motion.div 
                                key={pid}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0 }}
                                className="flex items-center gap-2 shrink-0"
                            >
                                <span 
                                    className={`cursor-pointer hover:text-black dark:hover:text-white transition-colors truncate max-w-[150px] ${idx === currentPath.length - 1 ? 'text-black dark:text-white font-medium' : ''}`} 
                                    onClick={() => setCurrentPath(currentPath.slice(0, idx + 1))}
                                >
                                    {name}
                                </span>
                                {idx < currentPath.length - 1 && <ChevronRight size={14} className="text-gray-400 dark:text-gray-600 shrink-0" />}
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>
         </div>

         {/* Search */}
         <div className="w-56 bg-gray-200/50 dark:bg-[#111]/50 border border-black/5 dark:border-white/10 rounded flex items-center px-3 h-8 text-sm focus-within:border-blue-500/50 transition-colors">
             <Search size={14} className="text-gray-500 mr-2" />
             <input type="text" placeholder={`Search ${getCurrentFolderName()}`} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="bg-transparent outline-none w-full text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-600" />
         </div>
      </div>

      {/* Action Bar */}
      <div className="h-10 bg-gray-50 dark:bg-[#252525] border-b border-black/5 dark:border-white/5 flex items-center px-4 justify-between shrink-0 text-xs text-gray-600 dark:text-gray-300 transition-colors">
          <div className="flex items-center gap-4">
             <button onClick={() => setIsCreatingNew('folder')} className="flex items-center gap-1.5 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 px-2 py-1 rounded transition-all">
                 <Plus size={14} className="text-yellow-500 dark:text-yellow-400" /> New Folder
             </button>
             <button onClick={() => setIsCreatingNew('file')} className="flex items-center gap-1.5 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 px-2 py-1 rounded transition-all">
                 <FileText size={14} className="text-blue-500 dark:text-blue-400" /> New File
             </button>
             
             <div className="w-[1px] h-4 bg-black/10 dark:bg-white/10" />
             
             <button 
               onClick={() => selectedId && handleRename(selectedId)} 
               disabled={!selectedId}
               className={`flex items-center gap-1.5 px-2 py-1 rounded transition-all ${selectedId ? 'hover:bg-black/5 dark:hover:bg-white/10 hover:text-black dark:hover:text-white text-gray-600 dark:text-gray-300' : 'opacity-30 cursor-default'}`}
             >
                 <Edit2 size={14} /> Rename
             </button>

             <button 
               onClick={() => selectedId && requestDelete(selectedId)} 
               disabled={!selectedId}
               className={`flex items-center gap-1.5 px-2 py-1 rounded transition-all ${selectedId ? 'hover:bg-red-500/10 dark:hover:bg-red-500/20 hover:text-red-600 dark:hover:text-red-400 text-gray-600 dark:text-gray-300' : 'opacity-30 cursor-default'}`}
             >
                 <Trash2 size={14} /> Delete
             </button>

             <div className="w-[1px] h-4 bg-black/10 dark:bg-white/10" />
             <button onClick={() => setSortConfig(prev => ({ ...prev, dir: prev.dir === 'asc' ? 'desc' : 'asc' }))} className="flex items-center gap-1.5 hover:text-black dark:hover:text-white px-2 py-1 rounded">
                 {sortConfig.dir === 'asc' ? <SortAsc size={14} /> : <SortDesc size={14} />} Sort
             </button>
          </div>
          <div className="flex items-center gap-1 bg-gray-200/50 dark:bg-[#111]/50 rounded p-0.5 border border-black/5 dark:border-white/5">
             <button onClick={() => setViewMode('grid')} className={`p-1 rounded ${viewMode === 'grid' ? 'bg-white shadow-sm text-blue-600 dark:bg-white/10 dark:text-white' : 'hover:bg-black/5 dark:hover:bg-white/5'}`}><LayoutGrid size={14} /></button>
             <button onClick={() => setViewMode('list')} className={`p-1 rounded ${viewMode === 'list' ? 'bg-white shadow-sm text-blue-600 dark:bg-white/10 dark:text-white' : 'hover:bg-black/5 dark:hover:bg-white/5'}`}><ListIcon size={14} /></button>
          </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
         {/* Sidebar */}
         <div className="w-48 bg-gray-50/50 dark:bg-[#1c1c1c] border-r border-black/5 dark:border-white/5 flex flex-col py-4 overflow-y-auto shrink-0 custom-scrollbar transition-colors">
            <div className="px-4 mb-2 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Pinned</div>
            {['root', 'desktop', 'downloads', 'docs', 'pics', 'music'].map(id => {
                const node = fileSystem.find(n => n.id === id) || { name: 'Quick Access', type: 'folder', id: 'root' };
                const isActive = currentFolderId === id;
                return (
                    <button 
                        key={id} 
                        onClick={() => { setCurrentPath(id === 'root' ? ['root'] : ['root', id]); setSelectedId(null); }} 
                        className="w-full relative flex items-center gap-3 px-4 py-1.5 text-sm transition-colors text-gray-600 dark:text-gray-400 hover:bg-black/5 dark:hover:bg-white/5 group"
                    >
                         {isActive && (
                             <motion.div 
                                layoutId="active-sidebar-item"
                                className="absolute inset-0 bg-blue-600/10 border-r-2 border-blue-500 dark:border-blue-400"
                                initial={false}
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                             />
                         )}
                         <span className={`relative z-10 flex items-center gap-3 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'}`}>
                             {getFileIcon(node.type as FileType)} {id === 'root' ? 'Home' : node.name}
                         </span>
                    </button>
                )
            })}
            <div className="h-[1px] bg-black/5 dark:bg-white/5 mx-4 my-3" />
            <div className="px-4 mb-2 text-[10px] font-bold text-gray-500 uppercase tracking-wider">Drives</div>
            {['c_drive', 'network'].map(id => {
                const isActive = currentFolderId === id;
                return (
                    <button 
                        key={id}
                        onClick={() => { setCurrentPath(['root', id]); setSelectedId(null); }} 
                        className="w-full relative flex items-center gap-3 px-4 py-1.5 text-sm transition-colors text-gray-600 dark:text-gray-400 hover:bg-black/5 dark:hover:bg-white/5 group"
                    >
                         {isActive && (
                             <motion.div 
                                layoutId="active-sidebar-item"
                                className="absolute inset-0 bg-blue-600/10 border-r-2 border-blue-500 dark:border-blue-400"
                                initial={false}
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                             />
                         )}
                         <span className={`relative z-10 flex items-center gap-3 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'}`}>
                            {id === 'c_drive' ? <HardDrive size={16} /> : <Cloud size={16} />} 
                            {id === 'c_drive' ? 'Local Disk (C:)' : 'Network'}
                         </span>
                    </button>
                );
            })}
         </div>

         {/* Main View */}
         <div className="flex-1 bg-white dark:bg-[#151515] p-4 overflow-y-auto custom-scrollbar transition-colors" onContextMenu={(e) => handleContextMenu(e, null)} onClick={() => setSelectedId(null)}>
            <AnimatePresence mode="popLayout">
                {getFiles.length === 0 ? (
                    <motion.div 
                        key="empty"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="h-full flex flex-col items-center justify-center text-gray-400 dark:text-gray-600 gap-2 select-none"
                    >
                        <Folder size={48} className="opacity-20" strokeWidth={1} />
                        <span className="text-sm">This folder is empty.</span>
                    </motion.div>
                ) : (
                    <motion.div
                        key={currentFolderId + viewMode + searchQuery} 
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className={viewMode === 'grid' ? 'grid grid-cols-4 md:grid-cols-5 gap-4' : 'flex flex-col gap-1'}
                    >
                        {viewMode === 'list' && (
                            <motion.div initial={{opacity:0}} animate={{opacity:1}} className="flex text-xs text-gray-500 px-4 py-2 border-b border-black/5 dark:border-white/5 font-medium sticky top-0 bg-white dark:bg-[#151515] z-10 mb-2 transition-colors">
                                <div className="flex-1">Name</div>
                                <div className="w-32">Date modified</div>
                                <div className="w-24">Type</div>
                                <div className="w-24 text-right">Size</div>
                            </motion.div>
                        )}
                        
                        <AnimatePresence mode="popLayout">
                            {getFiles.map(file => (
                                <motion.div 
                                    layout
                                    variants={fileItemVariants}
                                    key={file.id}
                                    onClick={(e) => { e.stopPropagation(); setSelectedId(file.id); }}
                                    onDoubleClick={() => handleOpenItem(file)}
                                    onContextMenu={(e) => handleContextMenu(e, file.id)}
                                    className={`
                                        group cursor-pointer select-none relative transition-colors duration-200
                                        ${viewMode === 'grid' 
                                            ? `flex flex-col items-center gap-2 p-3 rounded-lg border ${selectedId === file.id ? 'bg-blue-50 border-blue-200 dark:bg-white/10 dark:border-blue-500/50' : 'border-transparent hover:bg-gray-100 dark:hover:bg-white/5'}` 
                                            : `flex items-center px-4 py-1.5 rounded ${selectedId === file.id ? 'bg-blue-50 dark:bg-white/10' : 'hover:bg-gray-100 dark:hover:bg-white/5'}`
                                        }
                                    `}
                                >
                                    <div className={`${viewMode === 'grid' ? 'w-16 h-14 mb-1' : 'w-5 h-5 mr-3'} flex items-center justify-center overflow-hidden rounded`}>
                                        {file.type === 'image' && file.content && viewMode === 'grid' ? (
                                            <img src={file.content} alt={file.name} className="w-full h-full object-cover rounded shadow-md" />
                                        ) : (
                                            React.cloneElement(getFileIcon(file.type) as React.ReactElement<any>, { size: viewMode === 'grid' ? 48 : 18, strokeWidth: 1.5 })
                                        )}
                                    </div>

                                    {viewMode === 'grid' ? (
                                        <span className={`text-xs text-center break-all line-clamp-2 ${selectedId === file.id ? 'text-blue-600 dark:text-white font-medium' : 'text-gray-700 dark:text-gray-300'}`}>
                                            {file.name}
                                        </span>
                                    ) : (
                                        <>
                                            <span className={`flex-1 text-sm truncate ${selectedId === file.id ? 'text-blue-600 dark:text-white' : 'text-gray-800 dark:text-gray-200'}`}>{file.name}</span>
                                            <span className="w-32 text-xs text-gray-500">{file.date}</span>
                                            <span className="w-24 text-xs text-gray-500 capitalize">{file.type}</span>
                                            <span className="w-24 text-xs text-gray-500 text-right">{file.size || '--'}</span>
                                        </>
                                    )}
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>
                )}
            </AnimatePresence>
         </div>

         {/* Context Menu Portal */}
         {contextMenu && createPortal(
            <div className={theme}>
                <div 
                    className="fixed z-[9999] bg-white/90 dark:bg-[#1e1e1e]/95 backdrop-blur-xl border border-black/10 dark:border-white/15 shadow-2xl rounded-lg overflow-hidden py-1 text-sm min-w-[180px] text-gray-800 dark:text-gray-200"
                    style={{ top: Math.min(contextMenu.y, window.innerHeight - 300), left: Math.min(contextMenu.x, window.innerWidth - 200) }}
                    onClick={(e) => e.stopPropagation()}
                >
                    {contextMenu.fileId ? (
                        <>
                            <button onClick={() => { contextMenu.fileId && handleOpenItem(fileSystem.find(f => f.id === contextMenu.fileId)!); setContextMenu(null); }} className="w-full text-left px-4 py-2 hover:bg-blue-500 hover:text-white transition-colors flex items-center gap-2">
                                <ExternalLink size={14} /> Open
                            </button>
                            <div className="h-[1px] bg-black/5 dark:bg-white/10 my-1 mx-2" />
                            <button onClick={() => { contextMenu.fileId && handleRename(contextMenu.fileId); setContextMenu(null); }} className="w-full text-left px-4 py-2 hover:bg-blue-500 hover:text-white transition-colors flex items-center gap-2">
                                <Edit2 size={14} /> Rename
                            </button>
                            <button onClick={() => { contextMenu.fileId && requestDelete(contextMenu.fileId); setContextMenu(null); }} className="w-full text-left px-4 py-2 hover:bg-blue-500 hover:text-white transition-colors flex items-center gap-2">
                                <Trash2 size={14} /> Delete
                            </button>
                            <div className="h-[1px] bg-black/5 dark:bg-white/10 my-1 mx-2" />
                            <button onClick={() => { setPropertiesFile(fileSystem.find(f => f.id === contextMenu.fileId) || null); setContextMenu(null); }} className="w-full text-left px-4 py-2 hover:bg-blue-500 hover:text-white transition-colors flex items-center gap-2">
                                <Info size={14} /> Properties
                            </button>
                        </>
                    ) : (
                        <>
                            <button onClick={() => { setIsCreatingNew('folder'); setContextMenu(null); }} className="w-full text-left px-4 py-2 hover:bg-blue-500 hover:text-white transition-colors flex items-center gap-2">
                                <Folder size={14} /> New Folder
                            </button>
                            <button onClick={() => { setIsCreatingNew('file'); setContextMenu(null); }} className="w-full text-left px-4 py-2 hover:bg-blue-500 hover:text-white transition-colors flex items-center gap-2">
                                <FileText size={14} /> New File
                            </button>
                            <div className="h-[1px] bg-black/5 dark:bg-white/10 my-1 mx-2" />
                            <button onClick={() => { setViewMode(m => m === 'grid' ? 'list' : 'grid'); setContextMenu(null); }} className="w-full text-left px-4 py-2 hover:bg-blue-500 hover:text-white transition-colors flex items-center gap-2">
                                <LayoutGrid size={14} /> Switch View
                            </button>
                        </>
                    )}
                </div>
            </div>,
            document.body
         )}

         {/* Modals */}
         <AnimatePresence>
            {/* Delete Confirmation */}
            {deleteConfirmation.isOpen && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/20 backdrop-blur-[2px]">
                    <motion.div 
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="bg-white dark:bg-[#252525] p-6 rounded-lg shadow-2xl max-w-sm w-full border border-black/5 dark:border-white/10"
                    >
                        <div className="flex flex-col items-center text-center gap-4">
                            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center text-red-600 dark:text-red-400">
                                <Trash2 size={24} />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Delete Item?</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Are you sure you want to delete this item? This action cannot be undone.
                            </p>
                            <div className="flex gap-3 w-full mt-2">
                                <button onClick={() => setDeleteConfirmation({isOpen: false, id: null})} className="flex-1 px-4 py-2 bg-gray-200 dark:bg-white/10 hover:bg-gray-300 dark:hover:bg-white/20 text-gray-800 dark:text-white rounded-md font-medium transition-colors">Cancel</button>
                                <button onClick={confirmDelete} className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-md font-medium transition-colors shadow-lg shadow-red-500/20">Delete</button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}

            {/* Properties Modal */}
            {propertiesFile && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/20 backdrop-blur-[2px]" onClick={() => setPropertiesFile(null)}>
                    <motion.div 
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="bg-white dark:bg-[#252525] rounded-xl shadow-2xl w-80 overflow-hidden border border-black/5 dark:border-white/10"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="h-12 bg-gray-50 dark:bg-[#202020] border-b border-black/5 dark:border-white/5 flex items-center justify-between px-4">
                            <span className="font-bold text-sm text-gray-800 dark:text-white">Properties</span>
                            <button onClick={() => setPropertiesFile(null)} className="hover:text-red-500 transition-colors"><X size={16} /></button>
                        </div>
                        <div className="p-6 flex flex-col items-center gap-4">
                             <div className="w-16 h-16 flex items-center justify-center">
                                 {React.cloneElement(getFileIcon(propertiesFile.type) as React.ReactElement<any>, { size: 48 })}
                             </div>
                             <div className="text-center">
                                 <h3 className="font-bold text-gray-900 dark:text-white">{propertiesFile.name}</h3>
                                 <p className="text-xs text-gray-500 capitalize">{propertiesFile.type}</p>
                             </div>
                             <div className="w-full h-[1px] bg-black/5 dark:bg-white/10" />
                             <div className="w-full text-sm space-y-2 text-gray-600 dark:text-gray-300">
                                 <div className="flex justify-between"><span>Size:</span> <span>{propertiesFile.size || 'N/A'}</span></div>
                                 <div className="flex justify-between"><span>Modified:</span> <span>{propertiesFile.date}</span></div>
                                 <div className="flex justify-between"><span>Location:</span> <span className="truncate max-w-[120px]">{propertiesFile.parentId === 'root' ? '/' : '/.../' + propertiesFile.parentId.slice(0,8)}</span></div>
                             </div>
                             <button onClick={() => setPropertiesFile(null)} className="w-full py-2 mt-2 bg-blue-600 hover:bg-blue-500 text-white rounded-md font-medium transition-colors">OK</button>
                        </div>
                    </motion.div>
                </div>
            )}

            {/* New Item / Rename Modal (shared logic roughly) */}
            {(isCreatingNew || renameModal.isOpen) && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/20 backdrop-blur-[2px]">
                    <motion.div 
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="bg-white dark:bg-[#252525] p-5 rounded-lg shadow-2xl w-80 border border-black/5 dark:border-white/10"
                    >
                        <h3 className="font-bold text-gray-900 dark:text-white mb-4">{isCreatingNew ? `New ${isCreatingNew === 'folder' ? 'Folder' : 'File'}` : 'Rename Item'}</h3>
                        <input 
                            autoFocus
                            type="text" 
                            placeholder="Enter name..." 
                            value={isCreatingNew ? newItemName : renameModal.name}
                            onChange={(e) => isCreatingNew ? setNewItemName(e.target.value) : setRenameModal(prev => ({ ...prev, name: e.target.value }))}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    if (isCreatingNew) handleCreateItem(isCreatingNew, newItemName);
                                    else confirmRename();
                                }
                            }}
                            className="w-full bg-gray-100 dark:bg-black/20 border border-gray-300 dark:border-white/10 rounded px-3 py-2 text-sm outline-none focus:border-blue-500 text-gray-900 dark:text-white mb-4"
                        />
                        <div className="flex justify-end gap-2">
                            <button 
                                onClick={() => { setIsCreatingNew(null); setRenameModal({ isOpen: false, id: null, name: '' }); }} 
                                className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-black/5 dark:hover:bg-white/5 rounded transition-colors"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={() => {
                                    if (isCreatingNew) handleCreateItem(isCreatingNew, newItemName);
                                    else confirmRename();
                                }}
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm rounded font-medium transition-colors"
                            >
                                {isCreatingNew ? 'Create' : 'Rename'}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
         </AnimatePresence>
      </div>
    </div>
  );
};
