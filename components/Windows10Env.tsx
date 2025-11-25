
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Wifi, Volume2, Battery, ChevronUp, Mic, 
  User, Check, Settings, Power, RefreshCw, 
  Layout, Monitor, ArrowRight, Grid
} from 'lucide-react';

export const Windows10Env: React.FC = () => {
  const [phase, setPhase] = useState<'boot' | 'setup' | 'desktop'>('boot');
  const [setupStep, setSetupStep] = useState(0);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isStartOpen, setIsStartOpen] = useState(false);
  const [time, setTime] = useState(new Date());
  const [selectedNetwork, setSelectedNetwork] = useState<string | null>(null);
  
  // Context Menu State
  const [contextMenu, setContextMenu] = useState<{ show: boolean; x: number; y: number } | null>(null);
  
  // Setup Selections
  const [selectedRegion, setSelectedRegion] = useState('United States');
  const [selectedKeyboard, setSelectedKeyboard] = useState('US');

  // Icons
  const winIcons = {
    recycle: "https://img.icons8.com/color/48/recycle-bin.png",
    edge: "https://img.icons8.com/color/48/microsoft-edge-new.png",
    thisPc: "https://img.icons8.com/color/48/workstation.png",
    word: "https://img.icons8.com/color/48/microsoft-word-2019--v2.png",
    excel: "https://img.icons8.com/color/48/microsoft-excel-2019--v1.png",
    powerpoint: "https://img.icons8.com/color/48/microsoft-powerpoint-2019--v1.png",
    store: "https://img.icons8.com/fluency/48/microsoft-store.png",
    photos: "https://img.icons8.com/fluency/48/microsoft-photos.png",
    settings: "https://img.icons8.com/fluency/48/settings.png",
    explorer: "https://img.icons8.com/fluency/48/file-explorer.png",
    calculator: "https://img.icons8.com/fluency/48/calculator.png",
    camera: "https://img.icons8.com/fluency/48/camera.png",
    calendar: "https://img.icons8.com/fluency/48/calendar.png",
    mail: "https://img.icons8.com/fluency/48/mail.png",
  };
  
  // Boot Loader
  useEffect(() => {
    if (phase === 'boot') {
      const timer = setTimeout(() => setPhase('setup'), 4000);
      return () => clearTimeout(timer);
    }
  }, [phase]);

  // Clock
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    let x = e.clientX;
    let y = e.clientY;
    
    // Boundary checks
    if (x + 200 > window.innerWidth) x = window.innerWidth - 200;
    if (y + 250 > window.innerHeight) y = window.innerHeight - 250;

    setContextMenu({ show: true, x, y });
  };

  const handleGlobalClick = () => {
    setContextMenu(null);
    if (isStartOpen) setIsStartOpen(false);
  };

  const nextStep = () => setSetupStep(prev => prev + 1);
  const prevStep = () => setSetupStep(prev => Math.max(0, prev - 1));

  const WinLogo = ({ size = 40, className = "" }: { size?: number, className?: string }) => (
    <svg width={size} height={size} viewBox="0 0 88 88" className={className} shapeRendering="geometricPrecision">
      <path fill="currentColor" d="M0 12.5 L36 7.7 V42 H0 V12.5 Z M36 46 V80.5 L0 75.5 V46 H36 Z M40 6.5 L88 0 V42 H40 V6.5 Z M40 46 H88 V88 L40 81.5 V46 Z" />
    </svg>
  );

  // Animation Variants
  const setupContentVariants = {
    initial: { opacity: 0, x: 40, filter: 'blur(10px)' },
    animate: { opacity: 1, x: 0, filter: 'blur(0px)', transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
    exit: { opacity: 0, x: -40, filter: 'blur(10px)', transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } }
  };

  // --- RENDER: BOOT SCREEN ---
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

  // --- RENDER: SETUP SCREEN (OOBE) ---
  if (phase === 'setup') {
    return (
      <div className="fixed inset-0 z-[9999] font-sans select-none text-white overflow-hidden bg-[#000]">
        {/* Animated Gradient Background */}
        <div className="absolute inset-0 z-0 overflow-hidden">
            <div className="absolute inset-0 bg-[#000]" />
            <motion.div 
              animate={{ 
                scale: [1, 1.4, 1],
                rotate: [0, 20, 0],
                opacity: [0.3, 0.6, 0.3]
              }}
              transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-[30%] -left-[10%] w-[80%] h-[80%] bg-[#004e98] rounded-full blur-[180px]" 
            />
            <motion.div 
              animate={{ 
                scale: [1, 1.3, 1],
                x: [0, -50, 0],
                opacity: [0.2, 0.5, 0.2]
              }}
              transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 2 }}
              className="absolute bottom-[0%] right-[0%] w-[70%] h-[70%] bg-[#002b5c] rounded-full blur-[150px]" 
            />
            <div className="absolute inset-0 bg-black/20 backdrop-blur-3xl" />
        </div>

        <div className="relative z-10 w-full h-full flex flex-col md:flex-row">
            
            {/* Left Panel - Assistant / Info */}
            <div className="hidden md:flex w-[40%] bg-black/10 backdrop-blur-sm flex-col justify-center p-16 relative overflow-hidden border-r border-white/5">
               <AnimatePresence mode="wait">
                 <motion.div 
                   key={setupStep}
                   initial={{ opacity: 0, y: 10 }}
                   animate={{ opacity: 1, y: 0 }}
                   exit={{ opacity: 0, y: -10 }}
                   transition={{ duration: 0.5 }}
                   className="relative z-10"
                 >
                    <h1 className="text-4xl font-light leading-snug mb-6">
                      {setupStep === 0 && "Let's start with region. Is this right?"}
                      {setupStep === 1 && "Is this the right keyboard layout?"}
                      {setupStep === 2 && "Let's connect you to a network."}
                      {setupStep === 3 && "Who's going to use this PC?"}
                      {setupStep === 4 && "Create a super memorable password."}
                      {setupStep === 5 && "Choose privacy settings for your device."}
                    </h1>
                    <div className="flex items-center gap-3 text-blue-200">
                       <div className="w-5 h-5 bg-[#0078d7] rounded-full animate-pulse" />
                       <span className="text-sm font-medium tracking-wide uppercase opacity-80">Cortana Active</span>
                    </div>
                 </motion.div>
               </AnimatePresence>
            </div>

            {/* Right Panel - Interaction */}
            <div className="flex-1 bg-[#121212]/90 backdrop-blur-2xl flex flex-col relative shadow-2xl">
                
                {/* Main Content Area */}
                <div className="flex-1 flex flex-col justify-center items-center p-12 overflow-y-auto custom-scrollbar">
                    <AnimatePresence mode="wait">
                        {setupStep === 0 && (
                            <motion.div key="region" variants={setupContentVariants} initial="initial" animate="animate" exit="exit" className="w-full max-w-md h-[60vh] flex flex-col">
                                <h2 className="text-2xl mb-6 md:hidden font-light">Select Region</h2>
                                <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-1">
                                    {['United States', 'United Kingdom', 'Canada', 'Germany', 'France', 'Japan', 'Vietnam', 'Australia', 'South Korea', 'India', 'Brazil'].map(region => (
                                        <button 
                                            key={region}
                                            onClick={() => setSelectedRegion(region)}
                                            className={`w-full text-left p-4 rounded hover:bg-white/10 transition-all border-l-4 ${selectedRegion === region ? 'bg-white/10 border-[#0078d7] shadow-md' : 'border-transparent opacity-80 hover:opacity-100'}`}
                                        >
                                            {region}
                                        </button>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {setupStep === 1 && (
                            <motion.div key="keyboard" variants={setupContentVariants} initial="initial" animate="animate" exit="exit" className="w-full max-w-md h-[60vh] flex flex-col">
                                <h2 className="text-2xl mb-6 md:hidden font-light">Keyboard Layout</h2>
                                <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-1">
                                    {['US', 'UK', 'Canadian Multilingual', 'French', 'German', 'Japanese', 'Vietnamese', 'Dvorak'].map(kb => (
                                        <button 
                                            key={kb}
                                            onClick={() => setSelectedKeyboard(kb)}
                                            className={`w-full text-left p-4 rounded hover:bg-white/10 transition-all border-l-4 ${selectedKeyboard === kb ? 'bg-white/10 border-[#0078d7] shadow-md' : 'border-transparent opacity-80 hover:opacity-100'}`}
                                        >
                                            {kb}
                                        </button>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {setupStep === 2 && (
                            <motion.div key="network" variants={setupContentVariants} initial="initial" animate="animate" exit="exit" className="w-full max-w-md">
                                <h2 className="text-2xl mb-6 md:hidden font-light">Network</h2>
                                <div className="space-y-3">
                                    {['ZimDex-5G', 'Home-Network', 'Free-WiFi'].map(net => (
                                        <button 
                                            key={net}
                                            onClick={() => setSelectedNetwork(net)}
                                            className={`w-full flex items-center justify-between p-5 border border-white/10 hover:border-[#0078d7]/50 bg-black/40 hover:bg-black/60 rounded-lg transition-all group ${selectedNetwork === net ? 'ring-2 ring-[#0078d7] bg-[#0078d7]/10' : ''}`}
                                        >
                                            <span className="font-medium">{net}</span>
                                            {selectedNetwork === net ? <Check size={20} className="text-[#0078d7]" /> : <Wifi size={20} className="text-gray-400 group-hover:text-white" />}
                                        </button>
                                    ))}
                                </div>
                                <button onClick={nextStep} className="mt-8 text-[#0078d7] hover:text-[#429ce3] hover:underline text-sm font-medium flex items-center gap-2 transition-colors">
                                    I don't have internet <ArrowRight size={14} />
                                </button>
                            </motion.div>
                        )}

                        {setupStep === 3 && (
                            <motion.div key="user" variants={setupContentVariants} initial="initial" animate="animate" exit="exit" className="w-full max-w-md">
                                <label className="block text-lg font-light mb-4 text-gray-100">Who's going to use this PC?</label>
                                <input 
                                    type="text" 
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full bg-white text-gray-900 p-3 rounded-sm outline-none border-b-2 border-[#0078d7] focus:border-blue-400 transition-all shadow-lg"
                                    placeholder="Type your name..."
                                    autoFocus
                                />
                            </motion.div>
                        )}

                        {setupStep === 4 && (
                            <motion.div key="pass" variants={setupContentVariants} initial="initial" animate="animate" exit="exit" className="w-full max-w-md">
                                <label className="block text-lg font-light mb-4 text-gray-100">Create a super memorable password</label>
                                <input 
                                    type="password" 
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-white text-gray-900 p-3 rounded-sm outline-none border-b-2 border-[#0078d7] focus:border-blue-400 transition-all shadow-lg"
                                    placeholder="Password"
                                    autoFocus
                                />
                            </motion.div>
                        )}

                        {setupStep === 5 && (
                            <motion.div key="privacy" variants={setupContentVariants} initial="initial" animate="animate" exit="exit" className="w-full max-w-2xl h-[60vh] overflow-y-auto custom-scrollbar pr-2">
                                <h2 className="text-2xl mb-6 md:hidden font-light">Privacy Settings</h2>
                                <div className="grid grid-cols-1 gap-4">
                                    {[
                                        { title: 'Location', desc: 'Get location-based experiences like weather and directions.' },
                                        { title: 'Diagnostics', desc: 'Send data to help Microsoft improve windows.' },
                                        { title: 'Tailored experiences', desc: 'Let Microsoft use your diagnostic data for tips and ads.' },
                                        { title: 'Find my device', desc: 'Use your device\'s location data to help you find it.' },
                                        { title: 'Advertising ID', desc: 'Apps can use advertising ID to provide more interesting ads.' }
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-start justify-between p-5 bg-white/5 border border-white/10 rounded hover:bg-white/10 transition-colors">
                                            <div>
                                                <h3 className="font-bold mb-1 text-sm">{item.title}</h3>
                                                <p className="text-xs text-gray-400">{item.desc}</p>
                                            </div>
                                            <div className="relative w-10 h-5 bg-[#0078d7] rounded-full shrink-0 ml-4 cursor-pointer">
                                                <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full shadow-sm" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Bottom Bar */}
                <div className="h-20 bg-[#111] border-t border-white/10 flex items-center justify-between px-8 shrink-0 z-20">
                    <div className="flex gap-4">
                        <button className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white"><Volume2 size={20} /></button>
                        <button className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white"><Mic size={20} /></button>
                    </div>
                    <div className="flex gap-3">
                        {setupStep > 0 && (
                            <button onClick={prevStep} className="px-6 py-2 bg-[#333] hover:bg-[#444] border border-white/10 text-sm font-medium transition-colors rounded-sm">
                                Back
                            </button>
                        )}
                        <button 
                            onClick={() => {
                                if (setupStep === 5) setPhase('desktop');
                                else nextStep();
                            }}
                            className="px-8 py-2 bg-[#0078d7] hover:bg-[#006cbd] text-sm font-medium transition-colors shadow-lg rounded-sm"
                        >
                            {setupStep === 5 ? 'Accept' : 'Yes'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
      </div>
    );
  }

  // --- RENDER: DESKTOP ---
  return (
    <div 
        className="fixed inset-0 z-[9000] bg-black overflow-hidden font-sans select-none cursor-default"
        onClick={handleGlobalClick}
        onContextMenu={handleContextMenu}
    >
      {/* Wallpaper */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-all duration-1000"
        style={{ backgroundImage: "url('https://images.hdqwalls.com/wallpapers/windows-10-hero-4k-new-dark-8i.jpg')" }} 
      />

      {/* Desktop Icons */}
      <div className="absolute top-0 left-0 p-2 grid gap-2 grid-cols-1 w-auto pointer-events-none">
         <div className="pointer-events-auto flex flex-col items-center justify-start gap-1 w-[76px] group hover:bg-white/10 border border-transparent hover:border-white/20 rounded-sm p-2 transition-colors cursor-pointer active:scale-95">
            <img src={winIcons.recycle} alt="Recycle Bin" className="w-10 h-10 drop-shadow-md" />
            <span className="text-white text-xs drop-shadow-lg text-center line-clamp-2">Recycle Bin</span>
         </div>
         <div className="pointer-events-auto flex flex-col items-center justify-start gap-1 w-[76px] group hover:bg-white/10 border border-transparent hover:border-white/20 rounded-sm p-2 transition-colors cursor-pointer active:scale-95">
            <img src={winIcons.edge} alt="Microsoft Edge" className="w-10 h-10 drop-shadow-md" />
            <span className="text-white text-xs drop-shadow-lg text-center line-clamp-2">Microsoft Edge</span>
         </div>
         <div className="pointer-events-auto flex flex-col items-center justify-start gap-1 w-[76px] group hover:bg-white/10 border border-transparent hover:border-white/20 rounded-sm p-2 transition-colors cursor-pointer active:scale-95">
            <img src={winIcons.thisPc} alt="This PC" className="w-10 h-10 drop-shadow-md" />
            <span className="text-white text-xs drop-shadow-lg text-center line-clamp-2">This PC</span>
         </div>
      </div>

      {/* Context Menu */}
      <AnimatePresence>
      {contextMenu && (
        <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.1 }}
            className="absolute bg-[#2b2b2b] border border-[#1f1f1f] shadow-[0_4px_20px_rgba(0,0,0,0.5)] py-1.5 w-64 z-[9999] text-white/90 text-xs"
            style={{ top: contextMenu.y, left: contextMenu.x }}
            onClick={(e) => e.stopPropagation()}
        >
            <div className="hover:bg-white/10 px-3 py-2 flex items-center gap-3 cursor-pointer">
                <Monitor size={14} /> View
            </div>
            <div className="hover:bg-white/10 px-3 py-2 flex items-center gap-3 cursor-pointer">
                <Grid size={14} /> Sort by
            </div>
            <div className="hover:bg-white/10 px-3 py-2 flex items-center gap-3 cursor-pointer">
                <RefreshCw size={14} /> Refresh
            </div>
            <div className="h-[1px] bg-white/10 my-1" />
            <div className="hover:bg-white/10 px-3 py-2 flex items-center gap-3 cursor-pointer">
                <Settings size={14} /> Personalize
            </div>
            <div className="hover:bg-white/10 px-3 py-2 flex items-center gap-3 cursor-pointer">
                <Layout size={14} /> Display settings
            </div>
        </motion.div>
      )}
      </AnimatePresence>

      {/* Start Menu */}
      <AnimatePresence>
        {isStartOpen && (
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute bottom-10 left-0 w-[640px] h-[500px] bg-[#121212]/95 backdrop-blur-md text-white border border-[#333] flex z-50 shadow-2xl origin-bottom-left"
            onClick={(e) => e.stopPropagation()}
          >
             {/* Left Strip */}
             <div className="w-12 flex flex-col items-center justify-end pb-4 gap-1 absolute top-0 left-0 bottom-0 z-20 bg-[#1f1f1f]/50">
                 <button className="w-12 h-12 flex items-center justify-center hover:bg-white/10 transition-colors" title="User">
                    <div className="w-6 h-6 rounded-full bg-gray-500 flex items-center justify-center"><User size={14} /></div>
                 </button>
                 <button className="w-12 h-12 flex items-center justify-center hover:bg-white/10 transition-colors" title="Documents">
                    <Grid size={18} />
                 </button>
                 <button className="w-12 h-12 flex items-center justify-center hover:bg-white/10 transition-colors" title="Settings">
                    <Settings size={18} />
                 </button>
                 <button className="w-12 h-12 flex items-center justify-center hover:bg-white/10 transition-colors" title="Power">
                    <Power size={18} />
                 </button>
             </div>

             {/* App List */}
             <div className="w-60 pt-4 pl-14 pb-4 overflow-y-auto custom-scrollbar flex flex-col gap-1">
                 {[
                     { name: 'Calculator', icon: winIcons.calculator },
                     { name: 'Calendar', icon: winIcons.calendar },
                     { name: 'Camera', icon: winIcons.camera },
                     { name: 'Mail', icon: winIcons.mail },
                     { name: 'Microsoft Edge', icon: winIcons.edge },
                     { name: 'Settings', icon: winIcons.settings },
                 ].map((app, i) => (
                     <div key={i} className="flex items-center gap-3 p-2 hover:bg-white/10 cursor-default text-xs transition-colors group">
                         <img src={app.icon} alt={app.name} className="w-6 h-6" />
                         <span>{app.name}</span>
                     </div>
                 ))}
             </div>

             {/* Live Tiles */}
             <div className="flex-1 pt-4 px-4 pb-4 overflow-y-auto custom-scrollbar bg-[#1f1f1f]/30">
                 <div className="text-xs font-medium mb-2 pl-1 text-white/80">Productivity</div>
                 <div className="grid grid-cols-3 gap-1 mb-6">
                     <div className="aspect-square bg-[#0078d7] p-2 flex flex-col justify-between hover:outline outline-2 outline-white/50 cursor-pointer active:scale-95 transition-all group">
                         <div className="flex-1 flex items-center justify-center">
                             <img src={winIcons.edge} alt="Edge" className="w-8 h-8 group-hover:scale-110 transition-transform" />
                         </div>
                         <span className="text-[10px] font-medium">Edge</span>
                     </div>
                     <div className="aspect-square bg-[#2b579a] p-2 flex flex-col justify-between hover:outline outline-2 outline-white/50 cursor-pointer active:scale-95 transition-all group">
                         <div className="flex-1 flex items-center justify-center">
                             <img src={winIcons.word} alt="Word" className="w-8 h-8 group-hover:scale-110 transition-transform" />
                         </div>
                         <span className="text-[10px] font-medium">Word</span>
                     </div>
                     <div className="aspect-square bg-[#217346] p-2 flex flex-col justify-between hover:outline outline-2 outline-white/50 cursor-pointer active:scale-95 transition-all group">
                         <div className="flex-1 flex items-center justify-center">
                             <img src={winIcons.excel} alt="Excel" className="w-8 h-8 group-hover:scale-110 transition-transform" />
                         </div>
                         <span className="text-[10px] font-medium">Excel</span>
                     </div>
                 </div>
                 
                 <div className="text-xs font-medium mb-2 pl-1 text-white/80">Explore</div>
                 <div className="grid grid-cols-2 gap-1">
                     <div className="col-span-2 h-24 bg-[#0078d7] p-3 relative hover:outline outline-2 outline-white/50 cursor-pointer active:scale-95 transition-all group">
                         <div className="flex items-center gap-2 mb-2">
                             <img src={winIcons.store} alt="Store" className="w-5 h-5" />
                             <span className="text-xs font-bold">Microsoft Store</span>
                         </div>
                         <span className="text-[10px] text-white/80">Discover new apps and games</span>
                     </div>
                     <div className="aspect-square bg-[#333] p-2 flex flex-col justify-between hover:outline outline-2 outline-white/50 cursor-pointer active:scale-95 transition-all group">
                         <div className="flex-1 flex items-center justify-center">
                             <img src={winIcons.photos} alt="Photos" className="w-8 h-8 group-hover:scale-110 transition-transform" />
                         </div>
                         <span className="text-[10px] font-medium">Photos</span>
                     </div>
                     <div className="aspect-square bg-[#d13438] p-2 flex flex-col justify-between hover:outline outline-2 outline-white/50 cursor-pointer active:scale-95 transition-all group">
                         <div className="flex-1 flex items-center justify-center">
                             <img src={winIcons.settings} alt="Settings" className="w-8 h-8 group-hover:scale-110 transition-transform" />
                         </div>
                         <span className="text-[10px] font-medium">Settings</span>
                     </div>
                 </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Taskbar */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-10 bg-[#101010]/95 backdrop-blur-md flex items-center justify-between px-0 z-[6000] border-t border-white/10"
        onContextMenu={(e) => e.preventDefault()} 
      >
         <div className="flex items-center h-full">
            <button 
              onClick={(e) => { e.stopPropagation(); setIsStartOpen(!isStartOpen); setContextMenu(null); }}
              className={`w-12 h-full flex items-center justify-center hover:bg-white/10 hover:text-[#0078d7] transition-colors ${isStartOpen ? 'bg-white/10 text-[#0078d7]' : 'text-white'}`}
            >
               <WinLogo size={18} />
            </button>
            
            <div className="w-64 h-full flex items-center bg-white text-black px-3 border-t-2 border-b-2 border-white/0 mx-1 cursor-text hover:border-white/20 transition-colors">
                <Search size={14} className="text-gray-500 mr-3" />
                <span className="text-xs text-gray-500">Type here to search</span>
            </div>

            <button className="w-12 h-full flex items-center justify-center hover:bg-white/10 text-white transition-colors" title="Task View">
               <Grid size={16} />
            </button>

            <div className="w-[1px] h-6 bg-white/10 mx-1" />

            <button className="w-12 h-full flex items-center justify-center hover:bg-white/10 transition-colors group relative">
                <div className="absolute bottom-0 left-3 right-3 h-[2px] bg-blue-400 rounded-t-full" />
                <img src={winIcons.edge} alt="Edge" className="w-6 h-6" />
            </button>
            <button className="w-12 h-full flex items-center justify-center hover:bg-white/10 transition-colors">
                <img src={winIcons.explorer} alt="Explorer" className="w-6 h-6" />
            </button>
            <button className="w-12 h-full flex items-center justify-center hover:bg-white/10 transition-colors">
                <img src={winIcons.store} alt="Store" className="w-6 h-6" />
            </button>
         </div>

         {/* System Tray */}
         <div className="flex items-center h-full px-2 gap-1">
             <div className="flex items-center gap-3 px-2 py-1 hover:bg-white/10 rounded-sm cursor-default text-white transition-colors">
                 <ChevronUp size={14} />
             </div>
             <div className="flex items-center gap-3 px-2 py-1 hover:bg-white/10 rounded-sm cursor-default text-white transition-colors">
                 <Wifi size={16} />
                 <Volume2 size={16} />
                 <Battery size={16} />
             </div>
             <div className="flex flex-col items-end justify-center px-2 py-1 hover:bg-white/10 rounded-sm cursor-default text-white h-full min-w-[70px] transition-colors">
                 <span className="text-xs leading-none">{time.toLocaleTimeString([], {hour: 'numeric', minute:'2-digit'})}</span>
                 <span className="text-[10px] leading-none mt-0.5">{time.toLocaleDateString()}</span>
             </div>
             <div className="w-1 h-full border-l border-white/20 ml-1 flex items-end justify-center pb-1 hover:bg-white/20 transition-colors cursor-pointer w-2">
             </div>
         </div>
      </div>
    </div>
  );
};
