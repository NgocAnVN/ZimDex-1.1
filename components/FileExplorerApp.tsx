
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  ArrowLeft, ArrowRight, ArrowUp, Search, 
  Folder, FileText, Image as ImageIcon, Music, Video, FileCode,
  LayoutGrid, List as ListIcon, Star, Cloud, HardDrive,
  ChevronRight, Download, Laptop, Shield, Server, Wifi, Smartphone,
  Monitor, Trash2, Edit2, Info, ExternalLink, X, Calendar, PieChart
} from 'lucide-react';

// --- Types ---

type FileType = 'folder' | 'image' | 'text' | 'code' | 'audio' | 'video' | 'archive' | 'drive' | 'network' | 'computer';

interface FileSystemNode {
  id: string;
  parentId: string | null;
  name: string;
  type: FileType;
  size: string;
  date: string;
  meta?: {
    totalSpace?: string;
    freeSpace?: string;
    percentUsed?: number;
  };
}

// --- Mock Data ---

const initialFileSystem: FileSystemNode[] = [
  // Root Level Items (Quick Access / This PC)
  { 
    id: 'desktop', parentId: 'root', name: 'Desktop', type: 'folder', size: '', date: 'Today',
  },
  { 
    id: 'downloads', parentId: 'root', name: 'Downloads', type: 'folder', size: '', date: 'Today' 
  },
  { 
    id: 'docs', parentId: 'root', name: 'Documents', type: 'folder', size: '', date: 'Yesterday' 
  },
  { 
    id: 'pics', parentId: 'root', name: 'Pictures', type: 'folder', size: '', date: 'Jan 10' 
  },
  { 
    id: 'music', parentId: 'root', name: 'Music', type: 'folder', size: '', date: 'Jan 5' 
  },
  { 
    id: 'c_drive', parentId: 'root', name: 'Local Disk (C:)', type: 'drive', size: '1.2 TB free', date: '',
    meta: { totalSpace: '2 TB', freeSpace: '1.2 TB', percentUsed: 40 }
  },
  { 
    id: 'network', parentId: 'root', name: 'Network', type: 'network', size: '', date: '' 
  },
  
  // Desktop Content
  { id: 'c1', parentId: 'desktop', name: 'main.tsx', type: 'code', size: '12 KB', date: 'Today 10:42 AM' },
  { id: 'c2', parentId: 'desktop', name: 'styles.css', type: 'code', size: '8 KB', date: 'Today 10:45 AM' },
  { id: 'link1', parentId: 'desktop', name: 'ZimDex_Specs.txt', type: 'text', size: '2 KB', date: 'Yesterday' },
  { id: 'f_project', parentId: 'desktop', name: 'Project Alpha', type: 'folder', size: '', date: 'Jan 20' },

  // Documents Content
  { id: 'd1', parentId: 'docs', name: 'Resume_2025.pdf', type: 'text', size: '2.4 MB', date: 'Jan 15' },
  { id: 'd2', parentId: 'docs', name: 'Notes.txt', type: 'text', size: '4 KB', date: 'Jan 14' },
  { id: 'd3', parentId: 'docs', name: 'Budget_2025.xlsx', type: 'text', size: '14 KB', date: 'Jan 12' },
  { id: 'work_folder', parentId: 'docs', name: 'Work Stuff', type: 'folder', size: '', date: 'Jan 10' },
  
  // Nested Work Folder
  { id: 'w1', parentId: 'work_folder', name: 'Proposal_Final.docx', type: 'text', size: '1.2 MB', date: 'Jan 16' },
  { id: 'w2', parentId: 'work_folder', name: 'Meeting_Recap.md', type: 'code', size: '2 KB', date: 'Jan 16' },

  // Downloads
  { id: 'dl1', parentId: 'downloads', name: 'installer_v2.exe', type: 'archive', size: '150 MB', date: 'Today' },
  { id: 'dl2', parentId: 'downloads', name: 'image_assets.zip', type: 'archive', size: '45 MB', date: 'Yesterday' },

  // Pictures
  { id: 'p1', parentId: 'pics', name: 'Vacation_01.jpg', type: 'image', size: '4.2 MB', date: 'Jan 10' },
  { id: 'p2', parentId: 'pics', name: 'Design_Mockup.png', type: 'image', size: '1.1 MB', date: 'Jan 11' },
  { id: 'p3', parentId: 'pics', name: 'Screenshot_2025.png', type: 'image', size: '2.5 MB', date: 'Jan 08' },
  
  // Music
  { id: 'm1', parentId: 'music', name: 'Lo-fi Beats.mp3', type: 'audio', size: '8.4 MB', date: 'Jan 05' },
  { id: 'm2', parentId: 'music', name: 'Podcast_Ep1.mp3', type: 'audio', size: '54 MB', date: 'Jan 02' },

  // C Drive Content
  { id: 'win', parentId: 'c_drive', name: 'Windows', type: 'folder', size: '', date: 'Jan 1' },
  { id: 'prog', parentId: 'c_drive', name: 'Program Files', type: 'folder', size: '', date: 'Jan 1' },
  { id: 'users', parentId: 'c_drive', name: 'Users', type: 'folder', size: '', date: 'Jan 1' },

  // Network Content
  { id: 'nas', parentId: 'network', name: 'ZimDex-NAS', type: 'drive', size: '4 TB', date: 'Online', meta: { percentUsed: 75, totalSpace: '8 TB', freeSpace: '4 TB' } },
  { id: 'router', parentId: 'network', name: 'Gateway', type: 'network', size: '', date: 'Online' },
  { id: 'pc2', parentId: 'network', name: 'LivingRoom-PC', type: 'computer', size: '', date: 'Online' },
];

// --- Helper Icons ---

const getFileIcon = (type: FileType) => {
  switch (type) {
    case 'folder': return <Folder className="text-yellow-500 fill-yellow-500/20" />;
    case 'image': return <ImageIcon className="text-purple-400" />;
    case 'text': return <FileText className="text-blue-400" />;
    case 'code': return <FileCode className="text-green-400" />;
    case 'audio': return <Music className="text-pink-400" />;
    case 'video': return <Video className="text-red-400" />;
    case 'archive': return <HardDrive className="text-orange-400" />;
    case 'drive': return <HardDrive className="text-gray-300" />;
    case 'network': return <Cloud className="text-blue-300" />;
    case 'computer': return <Monitor className="text-blue-400" />;
    default: return <FileText className="text-gray-400" />;
  }
};

export const FileExplorerApp: React.FC = () => {
  const [currentPath, setCurrentPath] = useState<string[]>(['root']);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  
  // State for file system and context menu
  const [fileSystem, setFileSystem] = useState<FileSystemNode[]>(initialFileSystem);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; fileId: string } | null>(null);
  
  // Properties Modal State
  const [propertiesFile, setPropertiesFile] = useState<FileSystemNode | null>(null);

  const currentFolderId = currentPath[currentPath.length - 1];

  const files = fileSystem.filter(f => {
      if (currentFolderId === 'root') {
          return f.parentId === 'root';
      }
      return f.parentId === currentFolderId;
  }).filter(f => f.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const getCurrentFolderName = () => {
    if (currentFolderId === 'root') return 'This PC';
    const folder = fileSystem.find(f => f.id === currentFolderId);
    return folder ? folder.name : 'Unknown';
  };

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

  const handleSidebarClick = (id: string) => {
    if (id === 'root') {
        setCurrentPath(['root']);
    } else {
        setCurrentPath(['root', id]);
    }
    setSelectedId(null);
  };

  // --- Context Menu Handlers ---

  const handleContextMenu = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Adjust coordinates to prevent overflow if needed, but Portal handles z-index
    let x = e.clientX;
    let y = e.clientY;
    
    // Simple boundary check logic could go here
    if (x + 200 > window.innerWidth) x -= 200;
    if (y + 160 > window.innerHeight) y -= 160;

    setContextMenu({ x, y, fileId: id });
    setSelectedId(id);
  };

  const handleMenuAction = (action: 'open' | 'rename' | 'delete' | 'properties') => {
    if (!contextMenu) return;
    const file = fileSystem.find(f => f.id === contextMenu.fileId);
    if (!file) return;

    switch(action) {
        case 'open':
             if (['folder', 'drive', 'network'].includes(file.type)) {
                 handleNavigate(file.id);
             }
             break;
        case 'rename':
             const newName = window.prompt("Enter new name:", file.name);
             if(newName && newName.trim() !== "") {
                 setFileSystem(prev => prev.map(f => f.id === file.id ? {...f, name: newName.trim()} : f));
             }
             break;
        case 'delete':
             // In a real app, we might use a custom modal instead of confirm
             if(window.confirm(`Are you sure you want to delete "${file.name}"?`)) {
                setFileSystem(prev => prev.filter(f => f.id !== file.id));
             }
             break;
        case 'properties':
             setPropertiesFile(file);
             break;
    }
    setContextMenu(null);
  };

  // Close menu on global click
  useEffect(() => {
      const closeMenu = () => setContextMenu(null);
      window.addEventListener('click', closeMenu);
      return () => window.removeEventListener('click', closeMenu);
  }, []);

  const SidebarItem = ({ icon: Icon, label, id, active }: { icon: any, label: string, id: string, active?: boolean }) => (
    <button 
      onClick={() => handleSidebarClick(id)}
      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors mb-1 ${active ? 'bg-blue-600/20 text-blue-400 font-medium' : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'}`}
    >
      <Icon size={16} />
      {label}
    </button>
  );

  return (
    <div className="w-full h-full flex flex-col bg-[#191919]/60 backdrop-blur-2xl text-gray-200 font-sans overflow-hidden relative">
      
      {/* Toolbar */}
      <div className="h-12 bg-[#202020]/80 border-b border-white/5 flex items-center px-4 gap-4 shrink-0">
         <div className="flex items-center gap-1">
            <button 
              onClick={handleNavigateUp} 
              disabled={currentPath.length <= 1}
              className="p-1.5 rounded hover:bg-white/10 disabled:opacity-30 transition-colors"
            >
              <ArrowLeft size={16} />
            </button>
            <button className="p-1.5 rounded hover:bg-white/10 disabled:opacity-30 transition-colors" disabled>
              <ArrowRight size={16} />
            </button>
            <button 
              onClick={() => handleNavigateUp()}
              disabled={currentPath.length <= 1}
              className="p-1.5 rounded hover:bg-white/10 disabled:opacity-30 transition-colors"
            >
               <ArrowUp size={16} />
            </button>
         </div>

         {/* Breadcrumb */}
         <div className="flex-1 bg-[#111]/50 border border-white/10 rounded flex items-center px-3 h-8 text-sm text-gray-400 gap-2 hover:border-white/20 transition-colors">
            <Laptop size={14} className="text-gray-500" />
            <ChevronRight size={14} className="text-gray-600" />
            {currentPath.map((pid, idx) => {
                const name = pid === 'root' ? 'This PC' : fileSystem.find(f => f.id === pid)?.name || pid;
                return (
                    <React.Fragment key={pid}>
                        <span 
                          className={`cursor-pointer hover:text-white transition-colors ${idx === currentPath.length - 1 ? 'text-white font-medium' : ''}`}
                          onClick={() => setCurrentPath(currentPath.slice(0, idx + 1))}
                        >
                            {name}
                        </span>
                        {idx < currentPath.length - 1 && <ChevronRight size={14} className="text-gray-600" />}
                    </React.Fragment>
                );
            })}
         </div>

         {/* Search */}
         <div className="w-48 bg-[#111]/50 border border-white/10 rounded flex items-center px-3 h-8 text-sm focus-within:border-blue-500/50 transition-colors">
             <Search size={14} className="text-gray-500 mr-2" />
             <input 
               type="text" 
               placeholder={`Search ${getCurrentFolderName()}`}
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               className="bg-transparent outline-none w-full text-white placeholder-gray-600"
             />
         </div>
      </div>

      {/* Sub-Toolbar */}
      <div className="h-10 bg-[#202020]/80 border-b border-white/5 flex items-center px-4 justify-between shrink-0 text-xs text-gray-400">
          <div className="flex items-center gap-4">
             <button 
               className="flex items-center gap-1.5 hover:text-white transition-colors"
               onClick={() => {
                 // Dummy add implementation
                 const name = prompt("Enter folder name:", "New Folder");
                 if (name) {
                     const newFolder: FileSystemNode = {
                         id: `new_${Date.now()}`,
                         parentId: currentFolderId,
                         name: name,
                         type: 'folder',
                         size: '',
                         date: 'Just now'
                     };
                     setFileSystem(prev => [...prev, newFolder]);
                 }
               }}
             >
               <div className="w-4 h-4 bg-blue-600 rounded flex items-center justify-center text-white"><span className="text-xs">+</span></div>
               <span className="text-gray-300">New</span>
             </button>
             <div className="w-[1px] h-4 bg-white/10" />
             <button className="hover:text-white transition-colors">Sort</button>
             <button className="hover:text-white transition-colors">View</button>
          </div>
          <div className="flex items-center gap-1 bg-[#111]/50 rounded p-0.5 border border-white/5">
             <button 
               onClick={() => setViewMode('grid')}
               className={`p-1 rounded ${viewMode === 'grid' ? 'bg-white/10 text-white' : 'hover:bg-white/5'}`}
             >
               <LayoutGrid size={14} />
             </button>
             <button 
               onClick={() => setViewMode('list')}
               className={`p-1 rounded ${viewMode === 'list' ? 'bg-white/10 text-white' : 'hover:bg-white/5'}`}
             >
               <ListIcon size={14} />
             </button>
          </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
         {/* Sidebar */}
         <div className="w-48 bg-[#171717]/50 border-r border-white/5 flex flex-col py-4 overflow-y-auto shrink-0 custom-scrollbar">
            <div className="px-3 mb-2 text-xs font-bold text-gray-600 uppercase tracking-wider">Favorites</div>
            <SidebarItem icon={Star} label="Quick Access" id="root" active={currentFolderId === 'root'} />
            <SidebarItem icon={Laptop} label="Desktop" id="desktop" active={currentFolderId === 'desktop'} />
            <SidebarItem icon={Download} label="Downloads" id="downloads" active={currentFolderId === 'downloads'} />
            
            <div className="h-[1px] bg-white/5 mx-4 my-2" />
            
            <div className="px-3 mb-2 text-xs font-bold text-gray-600 uppercase tracking-wider">Libraries</div>
            <SidebarItem icon={FileText} label="Documents" id="docs" active={currentFolderId === 'docs'} />
            <SidebarItem icon={ImageIcon} label="Pictures" id="pics" active={currentFolderId === 'pics'} />
            <SidebarItem icon={Music} label="Music" id="music" active={currentFolderId === 'music'} />
            
            <div className="h-[1px] bg-white/5 mx-4 my-2" />
            
            <div className="px-3 mb-2 text-xs font-bold text-gray-600 uppercase tracking-wider">System</div>
            <SidebarItem icon={HardDrive} label="Local Disk (C:)" id="c_drive" active={currentFolderId === 'c_drive'} />
            <SidebarItem icon={Cloud} label="Network" id="network" active={currentFolderId === 'network'} />
         </div>

         {/* Main Content */}
         <div 
            className="flex-1 bg-[#121212]/50 p-4 overflow-y-auto custom-scrollbar" 
            onClick={() => setSelectedId(null)}
         >
            {files.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-600 gap-4">
                    <Folder size={48} className="opacity-20" />
                    <span className="text-sm">This folder is empty.</span>
                </div>
            ) : (
                <div className={viewMode === 'grid' ? 'grid grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4' : 'flex flex-col gap-1'}>
                    {viewMode === 'list' && (
                        <div className="flex text-xs text-gray-500 px-4 py-2 border-b border-white/5 font-medium sticky top-0 bg-[#121212]/90 backdrop-blur-sm z-10">
                            <div className="flex-1">Name</div>
                            <div className="w-32">Date modified</div>
                            <div className="w-24">Type</div>
                            <div className="w-24 text-right">Size</div>
                        </div>
                    )}
                    
                    {files.map(file => (
                        <div 
                          key={file.id}
                          onClick={(e) => {
                              e.stopPropagation();
                              setSelectedId(file.id);
                          }}
                          onDoubleClick={() => {
                              if (['folder', 'drive', 'network'].includes(file.type)) {
                                  handleNavigate(file.id);
                              }
                          }}
                          onContextMenu={(e) => handleContextMenu(e, file.id)}
                          className={`
                             group cursor-pointer transition-all select-none relative
                             ${viewMode === 'grid' 
                                ? `flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-white/5 border border-transparent ${selectedId === file.id ? 'bg-blue-500/20 border-blue-500/30' : ''}` 
                                : `flex items-center px-4 py-2 rounded hover:bg-white/5 ${selectedId === file.id ? 'bg-white/10' : ''}`
                             }
                          `}
                        >
                            {/* Icon */}
                            <div className={`${viewMode === 'grid' ? 'w-12 h-12' : 'w-5 h-5 mr-3'} flex items-center justify-center transition-transform group-hover:scale-105`}>
                                {React.cloneElement(getFileIcon(file.type) as React.ReactElement<any>, { 
                                    size: viewMode === 'grid' ? 40 : 18, 
                                    strokeWidth: 1.5 
                                })}
                            </div>

                            {/* Text Info */}
                            {viewMode === 'grid' ? (
                                <div className="text-center w-full">
                                  <div className="text-xs text-gray-300 w-full truncate px-1 group-hover:text-white font-medium">
                                      {file.name}
                                  </div>
                                  
                                  {/* Drive Meta (Progress Bar) */}
                                  {file.meta && (
                                    <div className="mt-2 w-full px-2">
                                       <div className="w-full h-1.5 bg-gray-700 rounded-full overflow-hidden">
                                          <div className="h-full bg-blue-500" style={{ width: `${file.meta.percentUsed}%` }} />
                                       </div>
                                       <div className="text-[10px] text-gray-500 mt-1">{file.meta.freeSpace} free</div>
                                    </div>
                                  )}
                                </div>
                            ) : (
                                <>
                                    <div className="flex-1 min-w-0 text-sm text-gray-300 group-hover:text-white truncate">{file.name}</div>
                                    <div className="w-32 text-xs text-gray-500">{file.date}</div>
                                    <div className="w-24 text-xs text-gray-500 capitalize">{file.type}</div>
                                    <div className="w-24 text-xs text-gray-500 text-right">{file.size || '--'}</div>
                                </>
                            )}
                        </div>
                    ))}
                </div>
            )}
         </div>
      </div>

      {/* Footer Status Bar */}
      <div className="h-6 bg-[#2a2e35]/80 border-t border-white/5 flex items-center px-4 justify-between text-[10px] text-gray-500 select-none">
          <div className="flex gap-4">
              <span>{files.length} items</span>
              {selectedId && <span>1 item selected</span>}
          </div>
          <div className="flex gap-4">
              <div className="flex items-center gap-1"><ListIcon size={10} /> <span>Grid View</span></div>
              <div className="flex items-center gap-1"><Shield size={10} /> <span>Secure</span></div>
          </div>
      </div>

      {/* Context Menu Portal */}
      {contextMenu && createPortal(
        <div 
          className="fixed z-[9999] w-48 bg-[#1f1f1f]/95 backdrop-blur-md border border-white/10 rounded-lg shadow-2xl py-1.5 flex flex-col animate-in fade-in zoom-in-95 duration-75 origin-top-left text-gray-200"
          style={{ top: contextMenu.y, left: contextMenu.x }}
          onClick={(e) => e.stopPropagation()}
        >
           <button 
             onClick={() => handleMenuAction('open')}
             className="flex items-center gap-3 px-3 py-2 hover:bg-blue-600 hover:text-white hover:shadow-[0_0_15px_rgba(59,130,246,0.6)] text-xs mx-1 rounded transition-all text-left"
           >
             <ExternalLink size={14} /> Open
           </button>
           <div className="h-[1px] bg-white/10 my-1 mx-2" />
           <button 
             onClick={() => handleMenuAction('rename')}
             className="flex items-center gap-3 px-3 py-2 hover:bg-blue-600 hover:text-white hover:shadow-[0_0_15px_rgba(59,130,246,0.6)] text-xs mx-1 rounded transition-all text-left"
           >
             <Edit2 size={14} /> Rename
           </button>
           <button 
             onClick={() => handleMenuAction('delete')}
             className="flex items-center gap-3 px-3 py-2 hover:bg-red-600 hover:text-white hover:shadow-[0_0_15px_rgba(220,38,38,0.6)] text-xs mx-1 rounded transition-all text-left"
           >
             <Trash2 size={14} /> Delete
           </button>
           <div className="h-[1px] bg-white/10 my-1 mx-2" />
           <button 
             onClick={() => handleMenuAction('properties')}
             className="flex items-center gap-3 px-3 py-2 hover:bg-blue-600 hover:text-white hover:shadow-[0_0_15px_rgba(59,130,246,0.6)] text-xs mx-1 rounded transition-all text-left"
           >
             <Info size={14} /> Properties
           </button>
        </div>,
        document.body
      )}

      {/* Properties Modal Portal */}
      {propertiesFile && createPortal(
          <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setPropertiesFile(null)}>
              <div className="w-[380px] bg-[#202020] rounded-xl shadow-2xl border border-white/10 text-gray-200 text-xs font-sans overflow-hidden animate-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
                  {/* Header */}
                  <div className="h-9 flex items-center justify-between px-3 bg-white/5 border-b border-white/5 select-none">
                      <span className="font-medium">{propertiesFile.name} Properties</span>
                      <button onClick={() => setPropertiesFile(null)} className="p-1 hover:bg-red-500/80 rounded transition-colors">
                          <X size={14} />
                      </button>
                  </div>
                  
                  {/* Content */}
                  <div className="p-5 space-y-4">
                      {/* Top Section: Icon & Name */}
                      <div className="flex gap-4 items-start pb-4 border-b border-white/5">
                           <div className="w-12 h-12 flex items-center justify-center">
                               {React.cloneElement(getFileIcon(propertiesFile.type) as React.ReactElement<any>, { size: 40 })}
                           </div>
                           <div className="flex-1 space-y-1">
                               <input 
                                  type="text" 
                                  value={propertiesFile.name} 
                                  readOnly 
                                  className="w-full bg-[#151515] border border-white/10 rounded px-2 py-1.5 outline-none focus:border-blue-500/50"
                               />
                           </div>
                      </div>

                      {/* Details */}
                      <div className="space-y-2">
                           <div className="grid grid-cols-[80px_1fr] items-center">
                               <span className="text-gray-500">Type:</span>
                               <span className="capitalize">{propertiesFile.type} File</span>
                           </div>
                           <div className="grid grid-cols-[80px_1fr] items-center">
                               <span className="text-gray-500">Location:</span>
                               <span className="truncate">C:\{getCurrentFolderName()}\{propertiesFile.name}</span>
                           </div>
                           <div className="grid grid-cols-[80px_1fr] items-center">
                               <span className="text-gray-500">Size:</span>
                               <span>{propertiesFile.size || '0 bytes'}</span>
                           </div>
                      </div>

                      <div className="h-[1px] bg-white/5" />

                      {/* Timestamps */}
                      <div className="space-y-2">
                           <div className="grid grid-cols-[80px_1fr] items-center">
                               <span className="text-gray-500">Created:</span>
                               <span>{propertiesFile.date}</span>
                           </div>
                           <div className="grid grid-cols-[80px_1fr] items-center">
                               <span className="text-gray-500">Modified:</span>
                               <span>{propertiesFile.date}</span>
                           </div>
                           <div className="grid grid-cols-[80px_1fr] items-center">
                               <span className="text-gray-500">Accessed:</span>
                               <span>Today, {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                           </div>
                      </div>

                      <div className="h-[1px] bg-white/5" />

                      {/* Attributes */}
                      <div className="flex items-center gap-4">
                          <span className="text-gray-500 w-[80px]">Attributes:</span>
                          <div className="flex items-center gap-4">
                              <label className="flex items-center gap-2">
                                  <input type="checkbox" className="rounded bg-[#151515] border-white/10" /> Read-only
                              </label>
                              <label className="flex items-center gap-2">
                                  <input type="checkbox" className="rounded bg-[#151515] border-white/10" /> Hidden
                              </label>
                          </div>
                      </div>
                  </div>

                  {/* Footer Actions */}
                  <div className="bg-[#181818] p-3 flex justify-end gap-2 border-t border-white/5">
                      <button onClick={() => setPropertiesFile(null)} className="px-4 py-1.5 rounded border border-white/10 hover:bg-white/5 transition-colors min-w-[70px]">OK</button>
                      <button onClick={() => setPropertiesFile(null)} className="px-4 py-1.5 rounded border border-white/10 hover:bg-white/5 transition-colors min-w-[70px]">Cancel</button>
                      <button className="px-4 py-1.5 rounded bg-blue-600/20 text-blue-400 border border-blue-500/30 hover:bg-blue-600/30 transition-colors min-w-[70px]">Apply</button>
                  </div>
              </div>
          </div>,
          document.body
      )}
    </div>
  );
};
