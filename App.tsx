
import React, { useState, useEffect, useRef } from 'react';
import { OSWindow } from './components/OSWindow';
import { SettingsApp } from './components/SettingsApp';
import { CustomCursor } from './components/CustomCursor';
import { MusicApp } from './components/MusicApp';
import { StartMenu } from './components/StartMenu';
import { WallpaperApp } from './components/WallpaperApp';
import { ScreenRecorderApp } from './components/ScreenRecorderApp';
import { TerminalApp } from './components/TerminalApp';
import { LiminalAIApp } from './components/LiminalAIApp';
import { LiminalImageApp } from './components/LiminalImageApp';
import { LiminalVideoApp } from './components/LiminalVideoApp';
import { BrowserApp } from './components/BrowserApp';
import { SnakeGameApp } from './components/SnakeGameApp';
import { FileExplorerApp } from './components/FileExplorerApp';
import { MonitorApp } from './components/MonitorApp';
import { MailApp } from './components/MailApp';
import { 
  Settings, Wifi, Volume2, Battery, MessageSquare, Play, SkipBack, 
  SkipForward, Search, Power, Monitor, Calendar, Image as ImageIcon, 
  RefreshCw, Disc, Folder, Skull, ArrowLeft, Wrench, Terminal, 
  RotateCcw, Cpu, HardDrive, Pause
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

// Simple clock component
const Clock = () => {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  return (
    <div className="text-white font-medium text-sm select-none tracking-wide drop-shadow-md font-['Inter']">
      {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
    </div>
  );
};

// AmeOS Boot Screen / Recovery Environment
const AmeOSBootScreen = () => {
  const [bootPhase, setBootPhase] = useState(0); // 0: BIOS, 1: Loading, 2: Menu System, -1: Rebooting
  const [menuScreen, setMenuScreen] = useState('restore_failed'); // 'restore_failed' | 'choose_option' | 'troubleshoot' | 'advanced_options' | 'loading' | 'error'
  const [loadingText, setLoadingText] = useState('Loading...');
  const [errorState, setErrorState] = useState({ title: '', message: '', backTo: '' });

  // Boot sequence logic
  useEffect(() => {
    let timer: any;
    if (bootPhase === -1) {
        // Rebooting state (Black screen)
        timer = setTimeout(() => {
            setBootPhase(0);
            setMenuScreen('restore_failed');
        }, 2000);
    } else if (bootPhase === 0) {
        // Phase 0: BIOS (4s)
        timer = setTimeout(() => setBootPhase(1), 4000);
    } else if (bootPhase === 1) {
        // Phase 1: Loading Logo (5s) -> transitions to Menu
        timer = setTimeout(() => setBootPhase(2), 5000);
    }
    return () => clearTimeout(timer);
  }, [bootPhase]);

  const handleRestart = () => {
      setBootPhase(-1);
  };

  const triggerLoading = (text: string, nextAction: 'reboot' | 'error' | 'screen', nextTarget: string | any) => {
      setLoadingText(text);
      setMenuScreen('loading');
      
      setTimeout(() => {
          if (nextAction === 'reboot') {
              handleRestart();
          } else if (nextAction === 'error') {
              setErrorState(nextTarget);
              setMenuScreen('error');
          } else {
              setMenuScreen(nextTarget);
          }
      }, 2500);
  };

  // -- Render Helpers --
  const OptionButton = ({ icon: Icon, title, sub, onClick }: any) => (
    <button 
       onClick={onClick}
       className="bg-[#202020] hover:bg-[#2a2a2a] border border-white/10 p-4 flex flex-col items-start gap-2 rounded text-left transition-colors w-full h-full"
    >
       {Icon && <Icon size={24} className="text-blue-500 mb-2" />}
       <span className="text-white font-medium text-sm">{title}</span>
       {sub && <span className="text-gray-400 text-xs">{sub}</span>}
    </button>
  );

  return (
    <div className="fixed inset-0 bg-black z-[5000] flex flex-col items-center justify-center font-sans overflow-hidden select-none cursor-none text-white">
        {/* CRT Scanline Effect */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-10 pointer-events-none bg-[length:100%_2px,3px_100%] opacity-40" />
        <div className="absolute inset-0 bg-black/20 animate-pulse pointer-events-none z-20" />
        
        <AnimatePresence mode="wait">
            {/* Phase 0: BIOS */}
            {bootPhase === 0 && (
                <motion.div 
                    key="bios"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="w-full max-w-3xl p-10 font-mono text-sm md:text-base text-gray-300 z-30"
                >
                    <div className="mb-6 font-bold text-white text-lg">AmeOS BIOS v2.1.4 BETA</div>
                    <div className="space-y-1">
                        <p>Main Processor: Intel(R) Core(TM) i9-14900K CPU @ 6.00GHz</p>
                        <p>Memory Testing: 65536MB OK</p>
                        <p>Detecting Primary Master ... AmeOS_System_Drive</p>
                        <p>Detecting Primary Slave ... None</p>
                        <br/>
                        <p className="text-white">System BIOS Shadowed</p>
                        <p className="text-white">Video BIOS Shadowed</p>
                        <br/>
                        <p>Booting from Hard Disk...</p>
                    </div>
                    <div className="mt-8 animate-pulse">_</div>
                </motion.div>
            )}

            {/* Phase 1: Loading Spinner */}
            {bootPhase === 1 && (
                 <motion.div 
                    key="loading-boot"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center gap-8 z-30"
                 >
                     <div className="relative">
                         <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin" />
                     </div>
                     <div className="text-lg font-medium tracking-wide text-white animate-pulse">Preparing Automatic Repair...</div>
                 </motion.div>
            )}

            {/* Phase 2: Interactive Menu System */}
            {bootPhase === 2 && (
                <div className="z-30 w-full h-full flex items-center justify-center p-4">
                    
                    {/* Screen: Restore Failed */}
                    {menuScreen === 'restore_failed' && (
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                            className="max-w-xl w-full bg-[#181818] border border-white/10 shadow-2xl rounded-lg overflow-hidden pointer-events-auto"
                        >
                            <div className="p-8 pb-6">
                                <h2 className="text-2xl font-bold text-white mb-4">Automatic Repair</h2>
                                <p className="text-white font-semibold mb-4">Your PC did not start correctly</p>
                                <p className="text-gray-400 text-sm leading-relaxed mb-6">
                                    Press "Restart" to restart your PC, which can sometimes fix the problem. You can also press "Advanced options" to try other repair options to repair your PC.
                                </p>
                                <p className="text-xs text-gray-500 font-mono">Log file: C:\Windows\System32\Logfiles\Srt\SrtTrail.txt</p>
                            </div>
                            <div className="bg-[#202020] p-4 flex justify-end gap-3 border-t border-white/5">
                                <button onClick={() => setMenuScreen('choose_option')} className="px-6 py-2 bg-[#333] hover:bg-[#444] text-white text-sm font-medium rounded transition-colors border border-white/5">Advanced options</button>
                                <button onClick={handleRestart} className="px-6 py-2 bg-[#0078d7] hover:bg-[#006cbd] text-white text-sm font-medium rounded transition-colors shadow-lg">Restart</button>
                            </div>
                        </motion.div>
                    )}

                    {/* Screen: Choose Option */}
                    {menuScreen === 'choose_option' && (
                         <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl w-full pointer-events-auto">
                             <h2 className="text-3xl font-light text-white mb-12 text-center">Choose an option</h2>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                                 <button onClick={handleRestart} className="bg-[#202020] hover:bg-[#2a2a2a] p-4 rounded flex items-center gap-4 transition-colors border border-white/10">
                                     <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center"><ArrowLeft className="rotate-180" size={20} /></div>
                                     <div className="text-left">
                                         <div className="font-medium">Continue</div>
                                         <div className="text-xs text-gray-400">Exit and continue to Windows</div>
                                     </div>
                                 </button>
                                 <button onClick={() => triggerLoading("Scanning for devices...", "error", {title: "System Error", message: "No bootable devices found.", backTo: "choose_option"})} className="bg-[#202020] hover:bg-[#2a2a2a] p-4 rounded flex items-center gap-4 transition-colors border border-white/10">
                                     <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center"><Disc size={20} /></div>
                                     <div className="text-left">
                                         <div className="font-medium">Use a device</div>
                                         <div className="text-xs text-gray-400">Use a USB drive, network connection, or Windows recovery DVD</div>
                                     </div>
                                 </button>
                                 <button onClick={() => setMenuScreen('troubleshoot')} className="bg-[#202020] hover:bg-[#2a2a2a] p-4 rounded flex items-center gap-4 transition-colors border border-white/10">
                                     <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center"><Wrench size={20} /></div>
                                     <div className="text-left">
                                         <div className="font-medium">Troubleshoot</div>
                                         <div className="text-xs text-gray-400">Reset your PC or see advanced options</div>
                                     </div>
                                 </button>
                                 <button onClick={handleRestart} className="bg-[#202020] hover:bg-[#2a2a2a] p-4 rounded flex items-center gap-4 transition-colors border border-white/10">
                                     <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center"><Power size={20} /></div>
                                     <div className="text-left">
                                         <div className="font-medium">Turn off your PC</div>
                                     </div>
                                 </button>
                             </div>
                         </motion.div>
                    )}

                    {/* Screen: Troubleshoot */}
                    {menuScreen === 'troubleshoot' && (
                         <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl w-full pointer-events-auto">
                             <h2 className="text-3xl font-light text-white mb-12 text-center">Troubleshoot</h2>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto mb-8">
                                 <button onClick={() => triggerLoading("Getting things ready...", "error", {title: "Reset failed", message: "There was a problem resetting your PC. No changes were made.", backTo: "troubleshoot"})} className="bg-[#202020] hover:bg-[#2a2a2a] p-4 rounded flex items-center gap-4 transition-colors border border-white/10">
                                     <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center"><RefreshCw size={20} /></div>
                                     <div className="text-left">
                                         <div className="font-medium">Reset this PC</div>
                                         <div className="text-xs text-gray-400">Lets you choose to keep or remove your files, and then reinstalls Windows.</div>
                                     </div>
                                 </button>
                                 <button onClick={() => setMenuScreen('advanced_options')} className="bg-[#202020] hover:bg-[#2a2a2a] p-4 rounded flex items-center gap-4 transition-colors border border-white/10">
                                     <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center"><Wrench size={20} /></div>
                                     <div className="text-left">
                                         <div className="font-medium">Advanced options</div>
                                     </div>
                                 </button>
                             </div>
                             <div className="max-w-2xl mx-auto">
                                <button onClick={() => setMenuScreen('choose_option')} className="flex items-center gap-2 text-white/70 hover:text-white">
                                    <div className="w-6 h-6 rounded-full border border-white/20 flex items-center justify-center"><ArrowLeft size={14} /></div>
                                    <span>Back</span>
                                </button>
                             </div>
                         </motion.div>
                    )}

                    {/* Screen: Advanced Options */}
                    {menuScreen === 'advanced_options' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl w-full pointer-events-auto">
                            <h2 className="text-3xl font-light text-white mb-8 text-center">Advanced options</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-3xl mx-auto mb-8">
                                <OptionButton 
                                    icon={Wrench} title="Startup Repair" sub="Fix problems that keep Windows from loading" 
                                    onClick={() => triggerLoading("Diagnosing your PC...", "error", {title: "Startup Repair", message: "Startup Repair couldn't repair your PC.\nLog file: C:\\Windows\\System32\\Logfiles\\Srt\\SrtTrail.txt", backTo: "advanced_options"})}
                                />
                                <OptionButton 
                                    icon={Terminal} title="Command Prompt" sub="Use the Command Prompt for advanced troubleshooting" 
                                    onClick={() => triggerLoading("Preparing Command Prompt...", "error", {title: "Error", message: "Administrator account disabled by system policy.", backTo: "advanced_options"})}
                                />
                                <OptionButton 
                                    icon={RotateCcw} title="Uninstall Updates" sub="Remove recently installed quality or feature updates" 
                                    onClick={() => triggerLoading("Getting ready...", "error", {title: "Uninstall Updates", message: "We ran into a problem and won't be able to uninstall the latest quality update of Windows.", backTo: "advanced_options"})}
                                />
                                <OptionButton 
                                    icon={Cpu} title="UEFI Firmware Settings" sub="Change settings in your PC's UEFI firmware" 
                                    onClick={() => triggerLoading("Restarting...", "reboot", null)}
                                />
                                <OptionButton 
                                    icon={RefreshCw} title="System Restore" sub="Use a restore point recorded on your PC to restore Windows" 
                                    onClick={() => triggerLoading("Starting System Restore...", "error", {title: "System Restore", message: "No restore points have been created on your computer's system drive.", backTo: "advanced_options"})}
                                />
                                <OptionButton 
                                    icon={HardDrive} title="System Image Recovery" sub="Recover Windows using a specific system image file" 
                                    onClick={() => triggerLoading("Scanning for system images...", "error", {title: "System Image Recovery", message: "Windows cannot find a system image on this computer.", backTo: "advanced_options"})}
                                />
                            </div>
                            <div className="max-w-3xl mx-auto">
                                <button onClick={() => setMenuScreen('troubleshoot')} className="flex items-center gap-2 text-white/70 hover:text-white">
                                    <div className="w-6 h-6 rounded-full border border-white/20 flex items-center justify-center"><ArrowLeft size={14} /></div>
                                    <span>Back</span>
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* Screen: Generic Loading */}
                    {menuScreen === 'loading' && (
                         <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center gap-8 z-30">
                             <div className="relative">
                                 <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
                             </div>
                             <div className="text-lg font-light tracking-wide text-white">{loadingText}</div>
                         </motion.div>
                    )}

                    {/* Screen: Generic Error */}
                    {menuScreen === 'error' && (
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                            className="max-w-lg w-full bg-[#181818] border border-white/10 shadow-2xl rounded-lg overflow-hidden pointer-events-auto"
                        >
                            <div className="p-8 pb-6">
                                <h2 className="text-xl font-bold text-white mb-4">{errorState.title}</h2>
                                <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap mb-6">
                                    {errorState.message}
                                </p>
                            </div>
                            <div className="bg-[#202020] p-4 flex justify-end gap-3 border-t border-white/5">
                                <button onClick={() => setMenuScreen(errorState.backTo)} className="px-6 py-2 bg-[#333] hover:bg-[#444] text-white text-sm font-medium rounded transition-colors border border-white/5">
                                    Cancel
                                </button>
                            </div>
                        </motion.div>
                    )}

                </div>
            )}
        </AnimatePresence>
    </div>
  );
};

export default function App() {
  // System Status
  const [systemMode, setSystemMode] = useState<'normal' | 'ame_virus'>('normal');

  // Window Visibility States
  const [isSettingsOpen, setIsSettingsOpen] = useState(true);
  const [isMusicOpen, setIsMusicOpen] = useState(false);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [isRecorderOpen, setIsRecorderOpen] = useState(false);
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [isImageGenOpen, setIsImageGenOpen] = useState(false);
  const [isVideoGenOpen, setIsVideoGenOpen] = useState(false);
  const [isBrowserOpen, setIsBrowserOpen] = useState(false);
  const [isSnakeOpen, setIsSnakeOpen] = useState(false);
  const [isFilesOpen, setIsFilesOpen] = useState(false);
  const [isMonitorOpen, setIsMonitorOpen] = useState(false);
  const [isMailOpen, setIsMailOpen] = useState(false);
  const [isStartMenuOpen, setIsStartMenuOpen] = useState(false);
  
  // Window Stack for Z-Indexing
  // Stores IDs of open windows. The last element is "on top".
  const [windowStack, setWindowStack] = useState<string[]>(['settings']);

  // Helper to bring a window to front
  const focusWindow = (id: string) => {
    setWindowStack(prev => {
        const filtered = prev.filter(w => w !== id);
        return [...filtered, id];
    });
  };

  // Helper to open a window and focus it
  const openWindow = (id: string, setOpen: (v: boolean) => void) => {
      updateOrigins();
      setOpen(true);
      focusWindow(id);
      setIsStartMenuOpen(false);
  };

  // Helper to get Z-Index
  const getZIndex = (id: string) => {
      const index = windowStack.indexOf(id);
      // Base Z-index 50. If not found (closed), return 50.
      return 50 + (index !== -1 ? index : 0);
  };

  // Helper to check if active (top of stack)
  const isActive = (id: string) => {
      return windowStack.length > 0 && windowStack[windowStack.length - 1] === id;
  };
  
  // Window Positions
  const [settingsPosition, setSettingsPosition] = useState({ x: 0, y: 0 });
  const [musicPosition, setMusicPosition] = useState({ x: 0, y: 0 });
  const [galleryPosition, setGalleryPosition] = useState({ x: 0, y: 0 });
  const [recorderPosition, setRecorderPosition] = useState({ x: 0, y: 0 });
  const [terminalPosition, setTerminalPosition] = useState({ x: 0, y: 0 });
  const [aiPosition, setAiPosition] = useState({ x: 0, y: 0 });
  const [imageGenPosition, setImageGenPosition] = useState({ x: 0, y: 0 });
  const [videoGenPosition, setVideoGenPosition] = useState({ x: 0, y: 0 });
  const [browserPosition, setBrowserPosition] = useState({ x: 0, y: 0 });
  const [snakePosition, setSnakePosition] = useState({ x: 0, y: 0 });
  const [filesPosition, setFilesPosition] = useState({ x: 0, y: 0 });
  const [monitorPosition, setMonitorPosition] = useState({ x: 0, y: 0 });
  const [mailPosition, setMailPosition] = useState({ x: 0, y: 0 });
  const [hasInitializedPos, setHasInitializedPos] = useState(false);

  // Start Menu Anchor
  const [startMenuX, setStartMenuX] = useState(0);

  // Drag Constraints Ref
  const constraintsRef = useRef<HTMLDivElement>(null);

  // Dock References for Animation Origin
  const [launchOrigin, setLaunchOrigin] = useState({ x: 0, y: 0 });
  const [musicLaunchOrigin, setMusicLaunchOrigin] = useState({ x: 0, y: 0 });
  const [galleryLaunchOrigin, setGalleryLaunchOrigin] = useState({ x: 0, y: 0 });
  const [recorderLaunchOrigin, setRecorderLaunchOrigin] = useState({ x: 0, y: 0 });
  const [terminalLaunchOrigin, setTerminalLaunchOrigin] = useState({ x: 0, y: 0 });
  const [browserLaunchOrigin, setBrowserLaunchOrigin] = useState({ x: 0, y: 0 });
  const [filesLaunchOrigin, setFilesLaunchOrigin] = useState({ x: 0, y: 0 });
  const [monitorLaunchOrigin, setMonitorLaunchOrigin] = useState({ x: 0, y: 0 });
  const [mailLaunchOrigin, setMailLaunchOrigin] = useState({ x: 0, y: 0 });
  
  const settingsButtonRef = useRef<HTMLButtonElement>(null);
  const musicDockRef = useRef<HTMLDivElement>(null);
  const startButtonRef = useRef<HTMLButtonElement>(null);
  const galleryButtonRef = useRef<HTMLButtonElement>(null);

  // Music State
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSong, setCurrentSong] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const playlist = [
    { title: "Loretta", artist: "Ginger Root", url: "https://archive.org/download/ginger-root-loretta/Ginger%20Root%20-%20Loretta.mp3", cover: "" },
    { title: "Những Giai Điệu Khác 2", artist: "Minh Tốc & Lam", url: "https://files.freemusicarchive.org/storage-freemusicarchive-org/music/ccCommunity/Chad_Crouch/Arps/Chad_Crouch_-_Ell_Vee.mp3", cover: "" },
    { title: "An Than", artist: "Low G", url: "https://files.freemusicarchive.org/storage-freemusicarchive-org/music/ccCommunity/Chad_Crouch/Arps/Chad_Crouch_-_Algorithms.mp3", cover: "" },
    { title: "Simp Gais 808", artist: "Low G", url: "https://files.freemusicarchive.org/storage-freemusicarchive-org/music/ccCommunity/Kai_Engel/Satin/Kai_Engel_-_04_-_Sentinel.mp3", cover: "" },
    { title: "Tam Giac", artist: "Anh Phan ft Low G", url: "https://files.freemusicarchive.org/storage-freemusicarchive-org/music/ccCommunity/Kai_Engel/Satin/Kai_Engel_-_06_-_Contention.mp3", cover: "" },
  ];

  // Wallpaper State
  const [wallpaperIndex, setWallpaperIndex] = useState(0);
  const [wallpapers, setWallpapers] = useState([
    'https://images.unsplash.com/photo-1565347786727-2629aa068529?q=80&w=2000&auto=format&fit=crop', // Rooftop
    'https://images.unsplash.com/photo-1495616811223-4d98c6e9d869?q=80&w=2000&auto=format&fit=crop', // Rain
    'https://images.unsplash.com/photo-1477346611705-65d1883cee1e?q=80&w=2000', // Dark Mountains
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=2000', // Yosemite
    'https://images.unsplash.com/photo-1511300636408-a63a89df3482?q=80&w=2000', // Abstract Geometry
    'https://images.unsplash.com/photo-1534067783741-512d0deaf55c?q=80&w=2000'  // Colorful
  ]);

  // Context Menu State
  const [contextMenu, setContextMenu] = useState<{ show: boolean; x: number; y: number; type: 'desktop' | 'music' } | null>(null);

  const updateOrigins = () => {
    if (settingsButtonRef.current) {
      const rect = settingsButtonRef.current.getBoundingClientRect();
      setLaunchOrigin({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
    }
    if (musicDockRef.current) {
       const rect = musicDockRef.current.getBoundingClientRect();
       setMusicLaunchOrigin({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
    }
    if (startButtonRef.current) {
        const rect = startButtonRef.current.getBoundingClientRect();
        setStartMenuX(rect.left + rect.width / 2);
        const menuLaunchPoint = { x: rect.left + rect.width / 2, y: rect.top - 50 };
        setGalleryLaunchOrigin(menuLaunchPoint); 
        setRecorderLaunchOrigin(menuLaunchPoint);
        setTerminalLaunchOrigin(menuLaunchPoint);
        setBrowserLaunchOrigin(menuLaunchPoint);
        setFilesLaunchOrigin(menuLaunchPoint);
        setMonitorLaunchOrigin(menuLaunchPoint);
        setMailLaunchOrigin(menuLaunchPoint);
    }
  };

  // Initialize Positions and update on resize
  useEffect(() => {
    if (!hasInitializedPos) {
      const centerX = (window.innerWidth - 950) / 2;
      const centerY = (window.innerHeight - 600) / 2;
      
      setSettingsPosition({ x: centerX, y: centerY });
      setMusicPosition({ x: centerX, y: centerY });
      setGalleryPosition({ x: centerX, y: centerY });
      setRecorderPosition({ x: centerX, y: centerY });
      setTerminalPosition({ x: centerX + 50, y: centerY + 50 }); // Slight offset for style
      setAiPosition({ x: centerX, y: centerY });
      setImageGenPosition({ x: centerX + 30, y: centerY + 30 });
      setVideoGenPosition({ x: centerX + 60, y: centerY + 60 });
      setBrowserPosition({ x: centerX, y: centerY });
      setSnakePosition({ x: centerX, y: centerY });
      setFilesPosition({ x: centerX, y: centerY });
      setMonitorPosition({ x: centerX, y: centerY });
      setMailPosition({ x: centerX, y: centerY });
      
      setHasInitializedPos(true);
    }

    const timer = setTimeout(updateOrigins, 100);
    window.addEventListener('resize', updateOrigins);
    return () => {
        window.removeEventListener('resize', updateOrigins);
        clearTimeout(timer);
    }
  }, [hasInitializedPos]);

  // Audio Logic
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) audioRef.current.play().catch(() => setIsPlaying(false));
      else audioRef.current.pause();
    }
  }, [isPlaying, currentSong]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleSeek = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const togglePlay = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setIsPlaying(!isPlaying);
  };
  
  const nextSong = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentSong((prev) => (prev + 1) % playlist.length);
    setIsPlaying(true);
  };
  
  const prevSong = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentSong((prev) => (prev - 1 + playlist.length) % playlist.length);
    setIsPlaying(true);
  };

  const selectSong = (index: number) => {
     setCurrentSong(index);
     setIsPlaying(true);
  };

  // Toggle Wrappers that use the Stack Logic
  const toggleSettings = () => {
    if (isSettingsOpen) setIsSettingsOpen(false);
    else openWindow('settings', setIsSettingsOpen);
  };

  const toggleMusicApp = () => {
     if (isMusicOpen) setIsMusicOpen(false);
     else openWindow('music', setIsMusicOpen);
     setContextMenu(null);
  };

  const toggleGallery = () => {
     if (isGalleryOpen) setIsGalleryOpen(false);
     else openWindow('gallery', setIsGalleryOpen);
  };

  const toggleRecorder = () => {
     if (isRecorderOpen) setIsRecorderOpen(false);
     else openWindow('recorder', setIsRecorderOpen);
  }

  const toggleTerminal = () => {
      if (isTerminalOpen) setIsTerminalOpen(false);
      else openWindow('terminal', setIsTerminalOpen);
  }

  const toggleBrowser = () => {
     if (isBrowserOpen) setIsBrowserOpen(false);
     else openWindow('browser', setIsBrowserOpen);
  }

  const toggleLiminalAI = () => {
      if (isAIOpen) setIsAIOpen(false);
      else openWindow('ai', setIsAIOpen);
  }

  const toggleImageGen = () => {
      if (isImageGenOpen) setIsImageGenOpen(false);
      else openWindow('imageGen', setIsImageGenOpen);
  }

  const toggleVideoGen = () => {
      if (isVideoGenOpen) setIsVideoGenOpen(false);
      else openWindow('videoGen', setIsVideoGenOpen);
  }

  const toggleSnake = () => {
      if (isSnakeOpen) setIsSnakeOpen(false);
      else openWindow('snake', setIsSnakeOpen);
  }

  const toggleFiles = () => {
      if (isFilesOpen) setIsFilesOpen(false);
      else openWindow('files', setIsFilesOpen);
  }

  const toggleMonitor = () => {
      if (isMonitorOpen) setIsMonitorOpen(false);
      else openWindow('monitor', setIsMonitorOpen);
  }

  const toggleMail = () => {
      if (isMailOpen) setIsMailOpen(false);
      else openWindow('mail', setIsMailOpen);
  }

  const toggleStartMenu = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    updateOrigins();
    setIsStartMenuOpen(!isStartMenuOpen);
    setContextMenu(null);
  };

  const handleContextMenu = (e: React.MouseEvent, type: 'desktop' | 'music' = 'desktop') => {
    e.preventDefault();
    e.stopPropagation();
    
    let x = e.clientX;
    let y = e.clientY;
    
    if (x + 220 > window.innerWidth) x = window.innerWidth - 220;
    if (y + 200 > window.innerHeight) y = window.innerHeight - 200;

    setContextMenu({ show: true, x, y, type });
  };

  const handleGlobalClick = () => {
    if (contextMenu) setContextMenu(null);
    if (isStartMenuOpen) setIsStartMenuOpen(false);
  };

  const changeWallpaper = () => {
    setWallpaperIndex((prev) => (prev + 1) % wallpapers.length);
    setContextMenu(null);
  };

  const handleAddWallpaper = (file: File) => {
    const url = URL.createObjectURL(file);
    setWallpapers(prev => [...prev, url]);
    setWallpaperIndex(wallpapers.length); 
  };

  const handleRemoveWallpaper = (index: number) => {
    if (wallpapers.length <= 1) return;
    const newWallpapers = wallpapers.filter((_, i) => i !== index);
    setWallpapers(newWallpapers);
    if (wallpaperIndex === index) {
      setWallpaperIndex(0);
    } else if (wallpaperIndex > index) {
      setWallpaperIndex(wallpaperIndex - 1);
    }
  };

  // Triggered by Terminal Easter Egg
  const handleInstallAmeOS = () => {
      // Close windows to simulate restart
      setIsSettingsOpen(false);
      setIsMusicOpen(false);
      setIsGalleryOpen(false);
      setIsRecorderOpen(false);
      setIsTerminalOpen(false);
      setIsAIOpen(false);
      setIsImageGenOpen(false);
      setIsVideoGenOpen(false);
      setIsBrowserOpen(false);
      setIsSnakeOpen(false);
      setIsFilesOpen(false);
      setIsMonitorOpen(false);
      setIsMailOpen(false);
      setIsStartMenuOpen(false);

      setSystemMode('ame_virus');
  };

  const ZLogo = () => {
    if (systemMode === 'ame_virus') {
        // Glitched 'A' logo when infected
        return (
            <div className="font-bold text-xl text-red-600 font-mono">A</div>
        );
    }
    return (
        <svg viewBox="0 0 24 24" className="w-7 h-7 fill-current" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 20h16v-4h-2v2H6.8l11.2-14v-2H2v4h2V4h11.2L4 18z"/>
        </svg>
    );
  };

  return (
    <div 
      className="w-screen h-screen overflow-hidden relative bg-black select-none font-sans"
      onClick={handleGlobalClick}
      onContextMenu={(e) => handleContextMenu(e, 'desktop')}
    >
      {systemMode === 'ame_virus' && <AmeOSBootScreen />}

      <audio 
        ref={audioRef}
        src={playlist[currentSong].url}
        onEnded={() => nextSong()}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
      />

      <CustomCursor />

      <div 
        className="absolute inset-0 w-full h-full bg-cover bg-center transition-all duration-700 ease-in-out"
        style={{ 
          backgroundImage: `url("${wallpapers[wallpaperIndex]}")`,
        }}
      >
        <div className="absolute inset-0 bg-black/20" />
      </div>

      <div className="absolute top-0 left-0 right-0 h-10 flex justify-between items-center px-6 z-20 pointer-events-none">
          <div className="pointer-events-auto">
             <Clock />
          </div>
      </div>

      {/* Start Menu Layer */}
      <div className="relative z-[200]">
        <AnimatePresence>
            {isStartMenuOpen && (
            <StartMenu 
                onClose={() => setIsStartMenuOpen(false)} 
                onOpenSettings={toggleSettings}
                onOpenGallery={toggleGallery}
                onOpenRecorder={toggleRecorder}
                onOpenTerminal={toggleTerminal}
                onOpenBrowser={toggleBrowser}
                onOpenFiles={toggleFiles}
                onOpenMonitor={toggleMonitor}
                onOpenMail={toggleMail}
                onOpenMusic={toggleMusicApp}
                anchorX={startMenuX}
            />
            )}
        </AnimatePresence>
      </div>

      {/* Window Manager Layer */}
      <div 
        ref={constraintsRef} 
        className="absolute inset-0 z-30 pointer-events-none overflow-hidden perspective-[2000px]"
      >
         <AnimatePresence>
           {isSettingsOpen && (
             <OSWindow 
               key="settings-window"
               isOpen={isSettingsOpen} 
               onClose={toggleSettings}
               title="Settings"
               isActive={isActive('settings')}
               zIndex={getZIndex('settings')}
               onFocus={() => focusWindow('settings')}
               launchOrigin={launchOrigin}
               initialPosition={settingsPosition}
               onDragEnd={(pos) => setSettingsPosition(pos)}
               dragConstraints={constraintsRef}
             >
               <SettingsApp />
             </OSWindow>
           )}

           {isMusicOpen && (
             <OSWindow
                key="music-window"
                isOpen={isMusicOpen}
                onClose={toggleMusicApp}
                title="Music Player"
                isActive={isActive('music')}
                zIndex={getZIndex('music')}
                onFocus={() => focusWindow('music')}
                launchOrigin={musicLaunchOrigin}
                initialPosition={musicPosition}
                onDragEnd={(pos) => setMusicPosition(pos)}
                dragConstraints={constraintsRef}
              >
                <MusicApp 
                  isPlaying={isPlaying}
                  currentSong={playlist[currentSong]}
                  playlist={playlist}
                  onTogglePlay={() => setIsPlaying(!isPlaying)}
                  onNext={nextSong}
                  onPrev={prevSong}
                  onPlay={selectSong}
                  currentTime={currentTime}
                  duration={duration}
                  onSeek={handleSeek}
               />
             </OSWindow>
           )}

           {isGalleryOpen && (
              <OSWindow
                key="gallery-window"
                isOpen={isGalleryOpen}
                onClose={toggleGallery}
                title="Gallery & Wallpapers"
                isActive={isActive('gallery')}
                zIndex={getZIndex('gallery')}
                onFocus={() => focusWindow('gallery')}
                launchOrigin={galleryLaunchOrigin}
                initialPosition={galleryPosition}
                onDragEnd={(pos) => setGalleryPosition(pos)}
                dragConstraints={constraintsRef}
              >
                <WallpaperApp 
                  wallpapers={wallpapers}
                  activeIndex={wallpaperIndex}
                  onSelect={setWallpaperIndex}
                  onAdd={handleAddWallpaper}
                  onRemove={handleRemoveWallpaper}
                />
              </OSWindow>
           )}

           {isRecorderOpen && (
              <OSWindow
                key="recorder-window"
                isOpen={isRecorderOpen}
                onClose={toggleRecorder}
                title="Screen Recorder"
                isActive={isActive('recorder')}
                zIndex={getZIndex('recorder')}
                onFocus={() => focusWindow('recorder')}
                launchOrigin={recorderLaunchOrigin}
                initialPosition={recorderPosition}
                onDragEnd={(pos) => setRecorderPosition(pos)}
                dragConstraints={constraintsRef}
              >
                <ScreenRecorderApp />
              </OSWindow>
           )}

           {isTerminalOpen && (
              <OSWindow
                key="terminal-window"
                isOpen={isTerminalOpen}
                onClose={toggleTerminal}
                title="Terminal"
                isActive={isActive('terminal')}
                zIndex={getZIndex('terminal')}
                onFocus={() => focusWindow('terminal')}
                launchOrigin={terminalLaunchOrigin}
                initialPosition={terminalPosition}
                onDragEnd={(pos) => setTerminalPosition(pos)}
                dragConstraints={constraintsRef}
              >
                <TerminalApp 
                   onUnlockSecret={() => openWindow('ai', setIsAIOpen)} 
                   onOpenBrowser={() => openWindow('browser', setIsBrowserOpen)} 
                   onOpenSnake={() => openWindow('snake', setIsSnakeOpen)}
                   onInstallAmeOS={handleInstallAmeOS}
                   onOpenImageGen={() => openWindow('imageGen', setIsImageGenOpen)}
                   onOpenVideoGen={() => openWindow('videoGen', setIsVideoGenOpen)}
                />
              </OSWindow>
           )}

           {isBrowserOpen && (
              <OSWindow
                key="browser-window"
                isOpen={isBrowserOpen}
                onClose={toggleBrowser}
                title="ZimDex Browser"
                isActive={isActive('browser')}
                zIndex={getZIndex('browser')}
                onFocus={() => focusWindow('browser')}
                launchOrigin={browserLaunchOrigin}
                initialPosition={browserPosition}
                onDragEnd={(pos) => setBrowserPosition(pos)}
                dragConstraints={constraintsRef}
              >
                <BrowserApp />
              </OSWindow>
           )}

           {isFilesOpen && (
              <OSWindow
                key="files-window"
                isOpen={isFilesOpen}
                onClose={toggleFiles}
                title="File Explorer"
                isActive={isActive('files')}
                zIndex={getZIndex('files')}
                onFocus={() => focusWindow('files')}
                launchOrigin={filesLaunchOrigin}
                initialPosition={filesPosition}
                onDragEnd={(pos) => setFilesPosition(pos)}
                dragConstraints={constraintsRef}
              >
                <FileExplorerApp />
              </OSWindow>
           )}

           {isMonitorOpen && (
              <OSWindow
                key="monitor-window"
                isOpen={isMonitorOpen}
                onClose={toggleMonitor}
                title="System Monitor"
                isActive={isActive('monitor')}
                zIndex={getZIndex('monitor')}
                onFocus={() => focusWindow('monitor')}
                launchOrigin={monitorLaunchOrigin}
                initialPosition={monitorPosition}
                onDragEnd={(pos) => setMonitorPosition(pos)}
                dragConstraints={constraintsRef}
              >
                <MonitorApp />
              </OSWindow>
           )}

           {isMailOpen && (
              <OSWindow
                key="mail-window"
                isOpen={isMailOpen}
                onClose={toggleMail}
                title="Mail"
                isActive={isActive('mail')}
                zIndex={getZIndex('mail')}
                onFocus={() => focusWindow('mail')}
                launchOrigin={mailLaunchOrigin}
                initialPosition={mailPosition}
                onDragEnd={(pos) => setMailPosition(pos)}
                dragConstraints={constraintsRef}
              >
                <MailApp />
              </OSWindow>
           )}

           {isAIOpen && (
              <OSWindow
                key="ai-window"
                isOpen={isAIOpen}
                onClose={toggleLiminalAI}
                title="Liminal AI // CLASSIFIED"
                isActive={isActive('ai')}
                zIndex={getZIndex('ai')}
                onFocus={() => focusWindow('ai')}
                launchOrigin={terminalPosition} 
                initialPosition={aiPosition}
                onDragEnd={(pos) => setAiPosition(pos)}
                dragConstraints={constraintsRef}
              >
                <LiminalAIApp />
              </OSWindow>
           )}

           {isImageGenOpen && (
              <OSWindow
                key="imageGen-window"
                isOpen={isImageGenOpen}
                onClose={toggleImageGen}
                title="Liminal Visualizer // CLASSIFIED"
                isActive={isActive('imageGen')}
                zIndex={getZIndex('imageGen')}
                onFocus={() => focusWindow('imageGen')}
                launchOrigin={terminalPosition} 
                initialPosition={imageGenPosition}
                onDragEnd={(pos) => setImageGenPosition(pos)}
                dragConstraints={constraintsRef}
              >
                <LiminalImageApp />
              </OSWindow>
           )}

           {isVideoGenOpen && (
              <OSWindow
                key="videoGen-window"
                isOpen={isVideoGenOpen}
                onClose={toggleVideoGen}
                title="Liminal Motion Engine // CLASSIFIED"
                isActive={isActive('videoGen')}
                zIndex={getZIndex('videoGen')}
                onFocus={() => focusWindow('videoGen')}
                launchOrigin={terminalPosition} 
                initialPosition={videoGenPosition}
                onDragEnd={(pos) => setVideoGenPosition(pos)}
                dragConstraints={constraintsRef}
              >
                <LiminalVideoApp />
              </OSWindow>
           )}

           {isSnakeOpen && (
              <OSWindow
                key="snake-window"
                isOpen={isSnakeOpen}
                onClose={toggleSnake}
                title="ZImGame // Arcade"
                isActive={isActive('snake')}
                zIndex={getZIndex('snake')}
                onFocus={() => focusWindow('snake')}
                launchOrigin={terminalPosition}
                initialPosition={snakePosition}
                onDragEnd={(pos) => setSnakePosition(pos)}
                dragConstraints={constraintsRef}
              >
                <SnakeGameApp />
              </OSWindow>
           )}
         </AnimatePresence>
      </div>

      {/* Bottom Dock */}
      <div 
        className="absolute bottom-0 left-0 right-0 z-[200] flex justify-center pb-4 pointer-events-none"
        onContextMenu={(e) => e.stopPropagation()} 
      >
         <div className="
            flex items-center px-2 py-2
            h-[68px]
            bg-[#1c1c1e]/80 backdrop-blur-2xl 
            border border-white/10 
            shadow-2xl pointer-events-auto
            rounded-2xl
            min-w-[600px]
         ">
            <button 
                ref={startButtonRef}
                onClick={toggleStartMenu}
                className={`
                w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 mr-2
                ${isStartMenuOpen ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/40' : 'text-white/90 hover:bg-white/10 hover:scale-105'}
                ${systemMode === 'ame_virus' ? 'bg-red-900/50 hover:bg-red-800/50' : ''}
                `}
            >
                <ZLogo />
            </button>

            <div className="w-[1px] h-8 bg-white/10 mx-2" />

            <div className="flex items-center gap-3 px-2">
               <div className="relative group">
                   <button 
                     ref={settingsButtonRef}
                     onClick={toggleSettings}
                     className={`
                        w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-500 ease-out
                        ${isSettingsOpen ? 'bg-white/10 shadow-[0_0_15px_rgba(255,255,255,0.1)]' : 'hover:bg-white/10 hover:-translate-y-2 hover:scale-110'}
                     `}
                   >
                      <div className={`transition-transform duration-[3s] ease-linear ${isSettingsOpen ? 'rotate-[120deg]' : ''}`}>
                        <Settings size={26} className="text-white drop-shadow-md" strokeWidth={1.5} />
                      </div>
                   </button>
                   <div className={`absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full transition-all duration-300 ${isSettingsOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`} />
               </div>

               <button className="w-12 h-12 rounded-xl flex items-center justify-center hover:bg-white/10 hover:-translate-y-2 hover:scale-110 transition-all duration-300">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
                    <Search className="text-black" size={20} />
                  </div>
               </button>
               
               <button 
                 onClick={toggleGallery}
                 className={`
                   w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300
                   ${isGalleryOpen ? 'bg-white/10 shadow-[0_0_15px_rgba(255,255,255,0.1)]' : 'hover:bg-white/10 hover:-translate-y-2 hover:scale-110'}
                 `}
               >
                   <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                      <ImageIcon size={20} />
                   </div>
               </button>

               <button 
                 onClick={toggleFiles}
                 className={`
                   w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300
                   ${isFilesOpen ? 'bg-white/10 shadow-[0_0_15px_rgba(255,255,255,0.1)]' : 'hover:bg-white/10 hover:-translate-y-2 hover:scale-110'}
                 `}
               >
                   <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center text-white shadow-lg">
                      <Folder size={20} fill="currentColor" className="text-white/90" />
                   </div>
               </button>
            </div>

            <div className="flex-1" />

            <div 
                ref={musicDockRef}
                onContextMenu={(e) => handleContextMenu(e, 'music')}
                onClick={toggleMusicApp}
                className="hidden lg:flex items-center gap-3 px-3 py-1 hover:bg-white/5 rounded-xl transition-colors cursor-pointer mr-2"
            >
                <div className={`w-9 h-9 bg-gray-800 rounded-lg overflow-hidden shadow-inner border border-white/5 relative flex items-center justify-center`}>
                    <motion.div 
                        className="w-full h-full bg-gradient-to-br from-gray-800 to-black flex items-center justify-center"
                        animate={{ rotate: isPlaying ? 360 : 0 }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    >
                       <div className="w-3 h-3 rounded-full border-[3px] border-white/10" />
                       <div className="absolute inset-0 rounded-lg border border-white/5" />
                    </motion.div>
                </div>
                <div className="flex items-center gap-2 text-white/80 ml-1" onClick={(e) => e.stopPropagation()}>
                    <button className="hover:text-white" onClick={prevSong}><SkipBack size={14} fill="currentColor" /></button>
                    <button className="hover:text-white" onClick={togglePlay}>
                    {isPlaying ? <div className="w-2.5 h-2.5 bg-white rounded-[1px]" /> : <Play size={14} fill="currentColor" />}
                    </button>
                    <button className="hover:text-white" onClick={nextSong}><SkipForward size={14} fill="currentColor" /></button>
                </div>
            </div>

            <div className="w-[1px] h-8 bg-white/10 mx-2" />

            <div className="flex items-center gap-4 text-white/60 px-4">
               <Wifi size={18} />
               <Volume2 size={18} />
               <Battery size={18} />
            </div>
         </div>
      </div>

      {contextMenu && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.1 }}
          style={{ top: contextMenu.y, left: contextMenu.x }}
          className="absolute z-[9999] w-56 bg-[#141414]/90 backdrop-blur-xl border border-white/15 rounded-lg shadow-2xl py-1.5 flex flex-col pointer-events-auto origin-top-left"
          onClick={(e) => e.stopPropagation()}
        >
          {contextMenu.type === 'desktop' ? (
            <>
              <button 
                onClick={changeWallpaper}
                className="flex items-center gap-3 px-3 py-2 hover:bg-[#3b82f6] text-gray-200 hover:text-white text-sm mx-1 rounded transition-colors group"
              >
                <ImageIcon size={15} />
                Next Wallpaper
              </button>
              <button 
                onClick={() => { setContextMenu(null); toggleGallery(); }}
                className="flex items-center gap-3 px-3 py-2 hover:bg-[#3b82f6] text-gray-200 hover:text-white text-sm mx-1 rounded transition-colors"
              >
                <Folder size={15} />
                Wallpaper Library
              </button>
              <div className="h-[1px] bg-white/10 my-1.5 mx-2" />
              <button className="flex items-center gap-3 px-3 py-2 hover:bg-[#3b82f6] text-gray-200 hover:text-white text-sm mx-1 rounded transition-colors">
                <RefreshCw size={15} />
                Refresh
              </button>
              <button className="flex items-center gap-3 px-3 py-2 hover:bg-[#3b82f6] text-gray-200 hover:text-white text-sm mx-1 rounded transition-colors">
                <Monitor size={15} />
                Display Settings
              </button>
              <div className="h-[1px] bg-white/10 my-1.5 mx-2" />
              <button className="flex items-center gap-3 px-3 py-2 hover:bg-red-500/80 text-gray-200 hover:text-white text-sm mx-1 rounded transition-colors">
                <Power size={15} />
                Shut down
              </button>
            </>
          ) : (
            <>
               <div className="px-3 py-2 text-xs font-bold text-gray-500 uppercase tracking-wider">Music Player</div>
               <button 
                 onClick={toggleMusicApp} 
                 className="flex items-center gap-3 px-3 py-2 hover:bg-[#3b82f6] text-gray-200 hover:text-white text-sm mx-1 rounded transition-colors"
               >
                 <Disc size={15} />
                 Open Music App
               </button>
               <button onClick={togglePlay} className="flex items-center gap-3 px-3 py-2 hover:bg-[#3b82f6] text-gray-200 hover:text-white text-sm mx-1 rounded transition-colors">
                 {isPlaying ? <div className="w-4 h-4 flex items-center justify-center"><div className="w-2 h-2 bg-current"/></div> : <Play size={15} />}
                 {isPlaying ? "Pause" : "Play"}
               </button>
               <button onClick={nextSong} className="flex items-center gap-3 px-3 py-2 hover:bg-[#3b82f6] text-gray-200 hover:text-white text-sm mx-1 rounded transition-colors">
                 <SkipForward size={15} />
                 Next Track
               </button>
            </>
          )}
        </motion.div>
      )}
    </div>
  );
}
