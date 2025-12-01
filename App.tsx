
import React, { useState, useEffect, useRef, useMemo } from 'react';
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
import { TaskManager } from './components/TaskManager';
import { UninstallApp } from './components/UninstallApp';
import { CalculatorApp } from './components/CalculatorApp';
import { NoteApp } from './components/NoteApp';
import { DesktopWidgets } from './components/DesktopWidgets'; 
import { WidgetPicker } from './components/WidgetPicker';
import { TextEditor, ImageViewer, MediaPlayer } from './components/FileViewers';
import { LockScreen } from './components/LockScreen';
import { Windows10Env } from './components/Windows10Env';
import { SystemProvider, useSystem } from './contexts/SystemContext';
import { 
  Settings, Wifi, Volume2, Battery, Power, Monitor, Image as ImageIcon, 
  RefreshCw, Disc, Folder, ArrowLeft, Wrench, Terminal, 
  RotateCcw, Cpu, HardDrive, Pause, Play, SkipBack, SkipForward, Trash2, Lock,
  Globe, Gamepad2, Sparkles, Film, Music, Video, Mail, Calculator, StickyNote, Shield, Layout
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { FileSystemNode, WidgetInstance, WidgetType, WidgetStyle } from './types'; 

// ... (Keep all the existing helper components like Clock, AmeOSLogo, AmeOSInstaller, AmeOSDesktop, LinuxCrashScreen, AmeOSBootScreen - NO CHANGES TO THEM) ...

// Simple clock component
const Clock = () => {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  return (
    <div className="text-white font-medium text-sm select-none tracking-wide drop-shadow-md">
      {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
    </div>
  );
};

// AmeOS "S" Logo Component
const AmeOSLogo = () => (
  <svg width="120" height="120" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 20H80V40H40L30 50L40 60H80V80H20V60H60L70 50L60 40H20V20Z" fill="white"/>
  </svg>
);

// AmeOS Installer Component
const AmeOSInstaller = ({ onComplete }: { onComplete: () => void }) => {
    const [step, setStep] = useState(0);
    const [progress, setProgress] = useState(0);
    const [log, setLog] = useState<string[]>([]);

    useEffect(() => {
        if (step === 0) {
            // Logo Screen
            setTimeout(() => setStep(1), 3000);
        } else if (step === 1) {
            // Installation Progress
            const interval = setInterval(() => {
                setProgress(prev => {
                    if (prev >= 100) {
                        clearInterval(interval);
                        setTimeout(() => setStep(2), 1000);
                        return 100;
                    }
                    // Random increments
                    return Math.min(prev + Math.random() * 5, 100);
                });
                
                if (Math.random() > 0.7) {
                    const logs = [
                        "Extracting system files...",
                        "Configuring kernel modules...",
                        "Optimizing visual subsystem...",
                        "Mounting /dev/sda1...",
                        "Bypassing security policies...",
                        "Installing backdoor services...",
                        "Writing bootloader...",
                    ];
                    setLog(prev => [...prev, logs[Math.floor(Math.random() * logs.length)]].slice(-5));
                }
            }, 200);
            return () => clearInterval(interval);
        } else if (step === 2) {
            // Complete
            setTimeout(onComplete, 2000);
        }
    }, [step, onComplete]);

    return (
        <div className="fixed inset-0 bg-black z-[6000] flex flex-col items-center justify-center font-mono text-white">
            {step === 0 && (
                <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }} 
                    animate={{ opacity: 1, scale: 1 }} 
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center gap-8"
                >
                    <AmeOSLogo />
                    <div className="text-2xl font-bold tracking-widest">AmeOS</div>
                </motion.div>
            )}

            {step === 1 && (
                <div className="w-full max-w-md space-y-6">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12">
                            <AmeOSLogo />
                        </div>
                        <div className="text-xl font-bold">Installing AmeOS...</div>
                    </div>
                    
                    <div className="w-full bg-gray-900 h-2 rounded-full overflow-hidden border border-gray-800">
                        <div className="h-full bg-white transition-all duration-200" style={{ width: `${progress}%` }} />
                    </div>
                    <div className="flex justify-between text-xs text-gray-500">
                        <span>{Math.round(progress)}%</span>
                        <span>Target: System Partition</span>
                    </div>

                    <div className="h-32 bg-gray-900/50 border border-gray-800 rounded p-4 font-mono text-xs text-gray-400 overflow-hidden flex flex-col justify-end">
                        {log.map((l, i) => (
                            <div key={i}>{l}</div>
                        ))}
                    </div>
                </div>
            )}

            {step === 2 && (
                <div className="text-center space-y-4 animate-pulse">
                    <div className="text-green-500 font-bold text-xl">Installation Complete</div>
                    <div className="text-sm text-gray-400">Rebooting...</div>
                </div>
            )}
        </div>
    );
};

// AmeOS Desktop (Fake)
const AmeOSDesktop = ({ onCrash }: { onCrash: () => void }) => {
    return (
        <div 
            className="fixed inset-0 bg-[#111] z-[5500] cursor-none overflow-hidden" 
            onClick={onCrash}
            onContextMenu={(e) => { e.preventDefault(); onCrash(); }}
        >
            {/* Fake Top Bar */}
            <div className="h-8 bg-[#222] border-b border-[#333] flex items-center justify-between px-4 text-xs text-gray-400 select-none">
                <div className="flex gap-4">
                    <span className="font-bold text-white">Applications</span>
                    <span>Places</span>
                    <span>System</span>
                </div>
                <div>root@ame-os:~</div>
            </div>

            {/* Fake Windows */}
            <div className="absolute top-20 left-20 w-[600px] h-[400px] bg-[#1a1a1a] border border-[#333] rounded shadow-2xl overflow-hidden">
                <div className="h-8 bg-[#252525] border-b border-[#333] flex items-center px-3 gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/50" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                    <div className="w-3 h-3 rounded-full bg-green-500/50" />
                    <div className="ml-4 text-xs text-gray-400">Terminal - root</div>
                </div>
                <div className="p-4 font-mono text-sm text-green-500/80">
                    <div>root@ame-os:~# neofetch</div>
                    <div className="mt-2 text-white">
                        <pre>{`
       .---.
      /     \\      OS: AmeOS x86_64
      |  O  |      Kernel: 6.6.6-ame
      \\     /      Uptime: 1 min
       '---'       Shell: zsh 5.9
      `}</pre>
                    </div>
                    <div className="mt-4 animate-pulse">root@ame-os:~# _</div>
                </div>
            </div>

            {/* Dock */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 h-14 bg-[#222]/90 border border-[#333] rounded-xl flex items-center px-4 gap-4">
                {[1,2,3,4,5].map(i => (
                    <div key={i} className="w-8 h-8 bg-[#333] rounded hover:bg-[#444] transition-colors" />
                ))}
            </div>
        </div>
    );
};

// Linux Crash Screen
const LinuxCrashScreen = () => {
    return (
        <div className="fixed inset-0 bg-black z-[7000] p-8 font-mono text-sm md:text-base text-white overflow-hidden select-none cursor-none">
            <div className="space-y-1">
                <p>[    0.000000] Linux version 6.6.6-ame (root@buildhost) (gcc version 12.2.0 (Debian 12.2.0-14)) #1 SMP PREEMPT_DYNAMIC Fri Feb 16 00:00:00 UTC 2025</p>
                <p>[    0.283122] Kernel panic - not syncing: VFS: Unable to mount root fs on unknown-block(0,0)</p>
                <p>[    0.283190] CPU: 0 PID: 1 Comm: swapper/0 Not tainted 6.6.6-ame #1</p>
                <p>[    0.283244] Hardware name: AmeOS Virtual Machine, BIOS 1.0 01/01/2025</p>
                <p>[    0.283298] Call Trace:</p>
                <p>[    0.283345]  &lt;TASK&gt;</p>
                <p>[    0.283392]  dump_stack_lvl+0x48/0x60</p>
                <p>[    0.283441]  panic+0x118/0x2f0</p>
                <p>[    0.283490]  mount_block_root+0x148/0x1f0</p>
                <p>[    0.283542]  mount_root+0x38/0x40</p>
                <p>[    0.283591]  prepare_namespace+0x13c/0x170</p>
                <p>[    0.283643]  kernel_init_freeable+0x258/0x2a0</p>
                <p>[    0.283698]  ? rest_init+0xc0/0xc0</p>
                <p>[    0.283749]  kernel_init+0x18/0x120</p>
                <p>[    0.283799]  ret_from_fork+0x22/0x30</p>
                <p>[    0.283848]  &lt;/TASK&gt;</p>
                <p>[    0.283952] Kernel Offset: disabled</p>
                <p>[    0.284001] ---[ end Kernel panic - not syncing: VFS: Unable to mount root fs on unknown-block(0,0) ]---</p>
            </div>
            <div className="absolute bottom-8 left-8 animate-pulse bg-white text-black px-2">
                SYSTEM HALTED
            </div>
        </div>
    );
};

// AmeOS Boot Screen / Recovery Environment
const AmeOSBootScreen = ({ onRecover, onInstallHiddenOS }: { onRecover: () => void, onInstallHiddenOS: () => void }) => {
  const [bootPhase, setBootPhase] = useState(0); // 0: BIOS, 1: Loading, 2: Menu System, -1: Rebooting
  const [menuScreen, setMenuScreen] = useState('restore_failed'); // 'restore_failed' | 'choose_option' | 'troubleshoot' | 'advanced_options' | 'loading' | 'error' | 'command_prompt'
  const [loadingText, setLoadingText] = useState('Loading...');
  const [errorState, setErrorState] = useState({ title: '', message: '', backTo: '' });
  
  // Command Prompt State
  const [terminalInput, setTerminalInput] = useState('');
  const [terminalOutput, setTerminalOutput] = useState<string[]>(['ZimDex OS [Version 10.0.22621.1]', '(c) ZimDex Corporation. All rights reserved.', '']);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
      terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [terminalOutput]);

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
    return () => clearInterval(timer);
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

  const handleTerminalSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      const cmd = terminalInput.trim();
      const newHistory = [...terminalOutput, `X:\\ZimDex\\System32>${cmd}`];
      
      if (cmd === 'Back-to-ZimDex==') {
          newHistory.push('Restoring system configuration...');
          newHistory.push('Rebooting...');
          setTerminalOutput(newHistory);
          setTerminalInput('');
          setTimeout(onRecover, 2000);
          return;
      }

      if (cmd === 'Install-AmeOS==') {
          newHistory.push('Initiating AmeOS installation sequence...');
          newHistory.push('Rebooting into installer...');
          setTerminalOutput(newHistory);
          setTerminalInput('');
          setTimeout(onInstallHiddenOS, 2000);
          return;
      }

      if (cmd === 'help') {
          newHistory.push('Supported commands:');
          newHistory.push('  exit               - Return to Advanced Options');
          newHistory.push('  dir                - List directory contents');
          newHistory.push('  Back-to-ZimDex==   - Restore normal operation');
      } else if (cmd === 'exit') {
          setMenuScreen('advanced_options');
          setTerminalInput('');
          return;
      } else if (cmd !== '') {
          newHistory.push(`'${cmd}' is not recognized as an internal or external command,`);
          newHistory.push('operable program or batch file.');
      }

      newHistory.push(''); // New line
      setTerminalOutput(newHistory);
      setTerminalInput('');
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
                    <div className="mb-6 font-bold text-white text-lg">ZimDex BIOS v2.1.4 BETA</div>
                    <div className="space-y-1">
                        <p>Main Processor: Intel(R) Core(TM) i9-14900K CPU @ 6.00GHz</p>
                        <p>Memory Testing: 65536MB OK</p>
                        <p>Detecting Primary Master ... ZimDex_System_Drive</p>
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
                                <p className="text-xs text-gray-500 font-mono">Log file: C:\ZimDex\System32\Logfiles\Srt\SrtTrail.txt</p>
                            </div>
                            <div className="bg-[#202020] p-4 flex justify-end gap-3 border-t border-white/5">
                                <button onClick={() => setMenuScreen('choose_option')} className="px-6 py-2 bg-[#333] hover:bg-[#444] text-white text-sm font-medium rounded transition-colors border border-white/5">Advanced options</button>
                                <button onClick={handleRestart} className="px-6 py-2 bg-[#0078d7] hover:bg-[#006cbd] text-white text-sm font-medium rounded transition-colors shadow-lg">Restart</button>
                            </div>
                        </motion.div>
                    )}

                    {/* ... other menu screens (choose_option, troubleshoot, etc) omitted for brevity as they are unchanged logic ... */}
                    {menuScreen === 'choose_option' && (
                         <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl w-full pointer-events-auto">
                             <h2 className="text-3xl font-light text-white mb-12 text-center">Choose an option</h2>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                                 <button onClick={handleRestart} className="bg-[#202020] hover:bg-[#2a2a2a] p-4 rounded flex items-center gap-4 transition-colors border border-white/10">
                                     <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center"><ArrowLeft className="rotate-180" size={20} /></div>
                                     <div className="text-left">
                                         <div className="font-medium">Continue</div>
                                         <div className="text-xs text-gray-400">Exit and continue to ZimDex</div>
                                     </div>
                                 </button>
                                 {/* ... other buttons ... */}
                                  <button onClick={() => setMenuScreen('troubleshoot')} className="bg-[#202020] hover:bg-[#2a2a2a] p-4 rounded flex items-center gap-4 transition-colors border border-white/10">
                                     <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center"><Wrench size={20} /></div>
                                     <div className="text-left">
                                         <div className="font-medium">Troubleshoot</div>
                                         <div className="text-xs text-gray-400">Reset your PC or see advanced options</div>
                                     </div>
                                 </button>
                             </div>
                         </motion.div>
                    )}
                    
                    {menuScreen === 'troubleshoot' && (
                         <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl w-full pointer-events-auto">
                             <h2 className="text-3xl font-light text-white mb-12 text-center">Troubleshoot</h2>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto mb-8">
                                 <button onClick={() => setMenuScreen('advanced_options')} className="bg-[#202020] hover:bg-[#2a2a2a] p-4 rounded flex items-center gap-4 transition-colors border border-white/10">
                                     <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center"><Wrench size={20} /></div>
                                     <div className="text-left">
                                         <div className="font-medium">Advanced options</div>
                                     </div>
                                 </button>
                             </div>
                         </motion.div>
                    )}

                    {menuScreen === 'advanced_options' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl w-full pointer-events-auto">
                            <h2 className="text-3xl font-light text-white mb-8 text-center">Advanced options</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-3xl mx-auto mb-8">
                                <OptionButton 
                                    icon={Terminal} title="Command Prompt" sub="Use the Command Prompt for advanced troubleshooting" 
                                    onClick={() => triggerLoading("Initializing Command Prompt...", "screen", "command_prompt")}
                                />
                                {/* ... other options ... */}
                            </div>
                        </motion.div>
                    )}

                    {menuScreen === 'command_prompt' && (
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                            className="w-[800px] h-[500px] bg-black border-2 border-[#333] shadow-2xl flex flex-col font-mono text-sm pointer-events-auto"
                        >
                             <div className="bg-[#ddd] text-black px-2 py-1 flex justify-between items-center text-xs">
                                 <span>Administrator: X:\ZimDex\System32\cmd.exe</span>
                                 <button onClick={() => setMenuScreen('advanced_options')} className="px-2 hover:bg-red-500 hover:text-white">X</button>
                             </div>
                             <div className="flex-1 p-2 overflow-y-auto custom-scrollbar text-gray-300" onClick={() => document.getElementById('cmd-input')?.focus()}>
                                 {terminalOutput.map((line, i) => (
                                     <div key={i}>{line}</div>
                                 ))}
                                 <form onSubmit={handleTerminalSubmit} className="flex">
                                     <span className="mr-1">X:\ZimDex\System32&gt;</span>
                                     <input 
                                        id="cmd-input"
                                        type="text" 
                                        value={terminalInput}
                                        onChange={(e) => setTerminalInput(e.target.value)}
                                        className="flex-1 bg-transparent outline-none text-gray-300"
                                        autoFocus
                                        autoComplete="off"
                                     />
                                 </form>
                                 <div ref={terminalEndRef} />
                             </div>
                        </motion.div>
                    )}

                    {menuScreen === 'loading' && (
                         <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center gap-8 z-30">
                             <div className="relative">
                                 <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
                             </div>
                             <div className="text-lg font-light tracking-wide text-white">{loadingText}</div>
                         </motion.div>
                    )}
                </div>
            )}
        </AnimatePresence>
    </div>
  );
};

// Hyprland-style Top Bar Component
const Waybar = () => {
  const { batteryLevel, isWifiEnabled, volume, toggleWifi, accentColor } = useSystem();
  const [time, setTime] = useState(new Date());
  const [activeWorkspace, setActiveWorkspace] = useState(1);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="absolute top-0 left-0 right-0 flex justify-between items-start p-3 z-[1000] pointer-events-none text-white font-sans text-xs font-medium">
      
      {/* Left Module: Workspaces */}
      <div className="bg-[#1e1e2e]/90 backdrop-blur-xl border border-white/10 rounded-full py-1.5 px-2 pointer-events-auto flex items-center gap-1 shadow-2xl">
         {[1, 2, 3, 4].map(i => (
             <button 
                key={i} 
                onClick={() => setActiveWorkspace(i)}
                className={`w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 ${activeWorkspace === i ? 'text-white font-bold shadow-lg scale-105' : 'hover:bg-white/10 text-gray-400 hover:text-white'}`}
                style={{ backgroundColor: activeWorkspace === i ? accentColor : undefined }}
             >
                 {i}
             </button>
         ))}
      </div>

      {/* Center Module: Clock */}
      <div className="bg-[#1e1e2e]/90 backdrop-blur-xl border border-white/10 rounded-full py-2 px-6 pointer-events-auto shadow-2xl font-bold tracking-wide hidden md:block">
          {time.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })} 
          <span className="mx-2 opacity-30">|</span> 
          {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </div>

      {/* Right Module: System Tray */}
      <div className="bg-[#1e1e2e]/90 backdrop-blur-xl border border-white/10 rounded-full py-2 px-5 pointer-events-auto flex items-center gap-4 shadow-2xl">
          <button onClick={toggleWifi} className="flex items-center gap-2 cursor-pointer hover:text-white transition-colors group">
              <div className={`w-2 h-2 rounded-full ${isWifiEnabled ? 'bg-emerald-400' : 'bg-red-400'}`} />
              <Wifi size={14} className={`text-gray-300 group-hover:text-white transition-colors`} />
              <span className="hidden sm:inline text-gray-300 group-hover:text-white transition-colors">ZimDex</span>
          </button>
          <div className="w-[1px] h-3 bg-white/10" />
          <div className="flex items-center gap-2">
              <Volume2 size={14} className="text-blue-400" />
              <span className="text-gray-300">{volume}%</span>
          </div>
          <div className="w-[1px] h-3 bg-white/10" />
          <div className="flex items-center gap-2">
              <Battery size={14} className={batteryLevel < 20 ? "text-red-400" : "text-emerald-400"} />
              <span className="text-gray-300">{Math.round(batteryLevel)}%</span>
          </div>
      </div>
    </div>
  );
};

const WelcomePopup = ({ onClose }: { onClose: () => void }) => (
  <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
    <motion.div 
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-2xl shadow-2xl max-w-md w-full text-center text-white"
    >
      <div className="mb-6">
        <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-600/30">
           <StickyNote size={32} />
        </div>
        <h2 className="text-2xl font-bold mb-2">Welcome to ZimDex OS</h2>
        <p className="text-white/70 text-sm">System initialized and ready.</p>
      </div>
      
      <div className="bg-black/30 rounded-lg p-4 mb-6 border border-white/10">
         <div className="text-xs text-white/50 uppercase tracking-widest mb-1">Default Password</div>
         <div className="text-2xl font-mono font-bold tracking-widest text-blue-400">1234</div>
      </div>

      <p className="text-xs text-white/40 mb-6">
        Copyright © 2025 <span className="text-white font-bold">Ngoc Ann</span>. All rights reserved.
      </p>

      <button 
        onClick={onClose}
        className="w-full py-3 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold transition-all shadow-lg hover:shadow-blue-500/20"
      >
        Enter System
      </button>
    </motion.div>
  </div>
);

const DesktopContent: React.FC = () => {
  const { brightness, isNightLight, setLocked, isLocked, animationSpeed, animationType, theme, isTransparencyEnabled, systemFont, accentColor } = useSystem();
  const [showWelcome, setShowWelcome] = useState(true);
  
  // System Status
  const [systemMode, setSystemMode] = useState<'normal' | 'ame_virus' | 'ame_install' | 'ame_desktop' | 'ame_crash' | 'win10_installer_window' | 'win10_boot' | 'win10_env'>('normal');

  // Crash State
  const [isExplorerCrashed, setIsExplorerCrashed] = useState(false);
  const [isTaskManagerOpen, setIsTaskManagerOpen] = useState(false);

  // Win10 Installer State
  const [showUAC, setShowUAC] = useState(false);
  const [installProgress, setInstallProgress] = useState(0);

  // Widgets State
  const [activeWidgets, setActiveWidgets] = useState<WidgetInstance[]>([]);
  const [isWidgetPickerOpen, setIsWidgetPickerOpen] = useState(false);
  
  const [widgetPickerPosition, setWidgetPickerPosition] = useState({ x: 0, y: 0 });
  const [widgetPickerLaunchOrigin, setWidgetPickerLaunchOrigin] = useState({ x: 0, y: 0 });

  const removeWidget = (id: string) => {
    setActiveWidgets(prev => prev.filter(w => w.id !== id));
  };

  const updateWidgetPosition = (id: string, x: number, y: number) => {
    setActiveWidgets(prev => prev.map(w => w.id === id ? { ...w, x, y } : w));
  };

  // Global Hotkey for Task Manager
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
        // Ctrl + Shift + ~ (Tilde/Backquote)
        if (e.ctrlKey && e.shiftKey && (e.key === '~' || e.code === 'Backquote' || e.key === '`')) {
            e.preventDefault();
            setIsTaskManagerOpen(prev => !prev);
        }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Window Visibility States
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
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
  const [isUninstallOpen, setIsUninstallOpen] = useState(false);
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const [isNoteOpen, setIsNoteOpen] = useState(false);
  
  // Dynamic File Windows
  const [openFiles, setOpenFiles] = useState<Array<{ 
    id: string; 
    file: FileSystemNode; 
    onSave: (id: string, content: string) => void; 
    position: { x: number, y: number };
  }>>([]);

  // Window Stack for Z-Indexing and Minimization
  const [windowStack, setWindowStack] = useState<string[]>(['settings']);
  const [minimizedWindows, setMinimizedWindows] = useState<string[]>([]);

  const focusWindow = (id: string) => {
    setWindowStack(prev => {
        const filtered = prev.filter(w => w !== id);
        return [...filtered, id];
    });
  };

  const isActive = (id: string) => {
      return windowStack.length > 0 && windowStack[windowStack.length - 1] === id;
  };

  // Helper to open a window and reset minimized state
  const openWindow = (id: string, setOpen: (v: boolean) => void) => {
      updateOrigins();
      setOpen(true);
      focusWindow(id);
      setMinimizedWindows(prev => prev.filter(w => w !== id)); // Ensure freshly opened window is not minimized
      setIsStartMenuOpen(false);
  };

  // Helper to handle dock click (Open / Minimize / Restore)
  const handleWindowToggle = (id: string, isOpen: boolean, setOpen: (v: boolean) => void) => {
      if (isOpen) {
          // If active and NOT minimized -> Minimize
          if (isActive(id) && !minimizedWindows.includes(id)) {
              setMinimizedWindows(prev => [...prev, id]);
          } else {
              // If inactive OR minimized -> Restore & Focus
              setMinimizedWindows(prev => prev.filter(w => w !== id));
              focusWindow(id);
          }
      } else {
          openWindow(id, setOpen);
      }
  };

  // Helper to fully close window (Unmount)
  const handleWindowClose = (id: string, setOpen: (v: boolean) => void) => {
      setOpen(false);
      setMinimizedWindows(prev => prev.filter(w => w !== id));
  };

  const handleOpenFile = (file: FileSystemNode, onSave: (id: string, content: string) => void) => {
      // Check if already open
      const isOpen = openFiles.find(f => f.id === file.id);
      if (isOpen) {
          handleWindowToggle(`file-${file.id}`, true, () => {});
          return;
      }

      const centerX = (window.innerWidth - 800) / 2 + (openFiles.length * 20);
      const centerY = (window.innerHeight - 600) / 2 + (openFiles.length * 20);

      setOpenFiles(prev => [...prev, {
          id: file.id,
          file,
          onSave,
          position: { x: centerX, y: centerY }
      }]);
      focusWindow(`file-${file.id}`);
  };

  const closeFileWindow = (fileId: string) => {
      setOpenFiles(prev => prev.filter(f => f.id !== fileId));
      setWindowStack(prev => prev.filter(w => w !== `file-${fileId}`));
      setMinimizedWindows(prev => prev.filter(w => w !== `file-${fileId}`));
  };

  const getZIndex = (id: string) => {
      const index = windowStack.indexOf(id);
      return 50 + (index !== -1 ? index : 0);
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
  const [uninstallPosition, setUninstallPosition] = useState({ x: 0, y: 0 });
  const [calculatorPosition, setCalculatorPosition] = useState({ x: 0, y: 0 });
  const [notePosition, setNotePosition] = useState({ x: 0, y: 0 });
  const [installerPosition, setInstallerPosition] = useState({ x: 0, y: 0 });
  const [hasInitializedPos, setHasInitializedPos] = useState(false);

  const [startMenuX, setStartMenuX] = useState(0);
  const constraintsRef = useRef<HTMLDivElement>(null);

  // Dock References
  const [launchOrigin, setLaunchOrigin] = useState({ x: 0, y: 0 });
  const [musicLaunchOrigin, setMusicLaunchOrigin] = useState({ x: 0, y: 0 });
  const [galleryLaunchOrigin, setGalleryLaunchOrigin] = useState({ x: 0, y: 0 });
  const [recorderLaunchOrigin, setRecorderLaunchOrigin] = useState({ x: 0, y: 0 });
  const [terminalLaunchOrigin, setTerminalLaunchOrigin] = useState({ x: 0, y: 0 });
  const [browserLaunchOrigin, setBrowserLaunchOrigin] = useState({ x: 0, y: 0 });
  const [filesLaunchOrigin, setFilesLaunchOrigin] = useState({ x: 0, y: 0 });
  const [monitorLaunchOrigin, setMonitorLaunchOrigin] = useState({ x: 0, y: 0 });
  const [mailLaunchOrigin, setMailLaunchOrigin] = useState({ x: 0, y: 0 });
  const [uninstallLaunchOrigin, setUninstallLaunchOrigin] = useState({ x: 0, y: 0 });
  const [calculatorLaunchOrigin, setCalculatorLaunchOrigin] = useState({ x: 0, y: 0 });
  const [noteLaunchOrigin, setNoteLaunchOrigin] = useState({ x: 0, y: 0 });
  
  const settingsButtonRef = useRef<HTMLButtonElement>(null);
  const musicDockRef = useRef<HTMLDivElement>(null);
  const startButtonRef = useRef<HTMLButtonElement>(null);
  const dockRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

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
    { title: "I Can't Handle Change (Instrumental)", artist: "Roar", url: "https://files.freemusicarchive.org/storage-freemusicarchive-org/music/no_curator/Tours/Enthusiast/Tours_-_01_-_Enthusiast.mp3", cover: "" },
    { title: "Enthusiast", artist: "Tours", url: "https://files.freemusicarchive.org/storage-freemusicarchive-org/music/no_curator/Tours/Enthusiast/Tours_-_01_-_Enthusiast.mp3", cover: "" }
  ];

  // Wallpaper State
  const [wallpaperIndex, setWallpaperIndex] = useState(0);
  const [wallpapers, setWallpapers] = useState([
    'https://images.unsplash.com/photo-1477346611705-65d1883cee1e?q=80&w=2000', // Dark Mountains
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=2000', // Yosemite
    'https://images.unsplash.com/photo-1511300636408-a63a89df3482?q=80&w=2000', // Abstract Geometry
  ]);

  const [contextMenu, setContextMenu] = useState<{ show: boolean; x: number; y: number; type: 'desktop' | 'music' } | null>(null);

  // Toggle Handlers using the new generic handler
  const toggleSettings = () => handleWindowToggle('settings', isSettingsOpen, setIsSettingsOpen);
  const toggleMusicApp = () => { handleWindowToggle('music', isMusicOpen, setIsMusicOpen); setContextMenu(null); };
  const toggleGallery = () => handleWindowToggle('gallery', isGalleryOpen, setIsGalleryOpen);
  const toggleRecorder = () => handleWindowToggle('recorder', isRecorderOpen, setIsRecorderOpen);
  const toggleTerminal = () => handleWindowToggle('terminal', isTerminalOpen, setIsTerminalOpen);
  const toggleBrowser = () => handleWindowToggle('browser', isBrowserOpen, setIsBrowserOpen);
  const toggleLiminalAI = () => handleWindowToggle('ai', isAIOpen, setIsAIOpen);
  const toggleImageGen = () => handleWindowToggle('imageGen', isImageGenOpen, setIsImageGenOpen);
  const toggleVideoGen = () => handleWindowToggle('videoGen', isVideoGenOpen, setIsVideoGenOpen);
  const toggleSnake = () => handleWindowToggle('snake', isSnakeOpen, setIsSnakeOpen);
  const toggleFiles = () => handleWindowToggle('files', isFilesOpen, setIsFilesOpen);
  const toggleMonitor = () => handleWindowToggle('monitor', isMonitorOpen, setIsMonitorOpen);
  const toggleMail = () => handleWindowToggle('mail', isMailOpen, setIsMailOpen);
  const toggleUninstall = () => handleWindowToggle('uninstall', isUninstallOpen, setIsUninstallOpen);
  const toggleCalculator = () => handleWindowToggle('calculator', isCalculatorOpen, setIsCalculatorOpen);
  const toggleNote = () => handleWindowToggle('note', isNoteOpen, setIsNoteOpen);
  const toggleWidgetPicker = () => handleWindowToggle('widgetPicker', isWidgetPickerOpen, setIsWidgetPickerOpen);

  // App Configuration
  const allApps = useMemo(() => [
    { id: 'settings', name: 'Settings', isOpen: isSettingsOpen, toggle: toggleSettings, icon: Settings, pinned: true, color: 'bg-gray-600' },
    { id: 'browser', name: 'Browser', isOpen: isBrowserOpen, toggle: toggleBrowser, icon: Globe, pinned: false, color: 'bg-blue-600', gradient: 'from-blue-600 to-cyan-500' },
    { id: 'gallery', name: 'Gallery', isOpen: isGalleryOpen, toggle: toggleGallery, icon: ImageIcon, pinned: false, color: 'bg-purple-600', gradient: 'from-purple-500 to-indigo-600' },
    { id: 'files', name: 'Files', isOpen: isFilesOpen, toggle: toggleFiles, icon: Folder, pinned: true, color: 'bg-yellow-500', gradient: 'from-yellow-500 to-orange-500' },
    { id: 'terminal', name: 'Terminal', isOpen: isTerminalOpen, toggle: toggleTerminal, icon: Terminal, pinned: false, color: 'bg-black', gradient: 'from-gray-900 to-black border border-white/20' },
    { id: 'music', name: 'Music', isOpen: isMusicOpen, toggle: toggleMusicApp, icon: Music, pinned: false, color: 'bg-pink-500', gradient: 'from-pink-600 to-rose-500' },
    { id: 'recorder', name: 'Recorder', isOpen: isRecorderOpen, toggle: toggleRecorder, icon: Video, pinned: false, color: 'bg-red-500', gradient: 'from-red-600 to-red-500' },
    { id: 'monitor', name: 'Monitor', isOpen: isMonitorOpen, toggle: toggleMonitor, icon: Monitor, pinned: false, color: 'bg-emerald-500', gradient: 'from-teal-600 to-emerald-500' },
    { id: 'mail', name: 'Mail', isOpen: isMailOpen, toggle: toggleMail, icon: Mail, pinned: false, color: 'bg-blue-400', gradient: 'from-blue-500 to-blue-400' },
    { id: 'note', name: 'Diary', isOpen: isNoteOpen, toggle: toggleNote, icon: StickyNote, pinned: false, color: 'bg-amber-400', gradient: 'from-amber-400 to-yellow-500' },
    { id: 'calculator', name: 'Calculator', isOpen: isCalculatorOpen, toggle: toggleCalculator, icon: Calculator, pinned: true, color: 'bg-orange-500', gradient: 'from-orange-500 to-amber-500' },
    { id: 'snake', name: 'Snake', isOpen: isSnakeOpen, toggle: toggleSnake, icon: Gamepad2, pinned: false, color: 'bg-green-500', gradient: 'from-green-500 to-emerald-600' },
    { id: 'ai', name: 'Liminal AI', isOpen: isAIOpen, toggle: toggleLiminalAI, icon: Sparkles, pinned: false, color: 'bg-purple-500', gradient: 'from-purple-600 to-fuchsia-600' },
    { id: 'imageGen', name: 'Visualizer', isOpen: isImageGenOpen, toggle: toggleImageGen, icon: ImageIcon, pinned: false, color: 'bg-cyan-500', gradient: 'from-cyan-600 to-blue-600' },
    { id: 'videoGen', name: 'Motion', isOpen: isVideoGenOpen, toggle: toggleVideoGen, icon: Film, pinned: false, color: 'bg-orange-500', gradient: 'from-orange-500 to-red-500' },
    { id: 'uninstall', name: 'Uninstall Tool', isOpen: isUninstallOpen, toggle: toggleUninstall, icon: Trash2, pinned: false, color: 'bg-red-700', gradient: 'from-red-700 to-red-900' },
  ], [
    isSettingsOpen, isBrowserOpen, isGalleryOpen, isFilesOpen, isTerminalOpen,
    isMusicOpen, isRecorderOpen, isMonitorOpen, isMailOpen, isCalculatorOpen, isNoteOpen,
    isSnakeOpen, isAIOpen, isImageGenOpen, isVideoGenOpen, isUninstallOpen,
    minimizedWindows, windowStack
  ]);

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
        setNoteLaunchOrigin(menuLaunchPoint);
    }
    
    // Update origins for dynamically docked apps
    allApps.forEach(app => {
        const el = dockRefs.current.get(app.id);
        if (el) {
            const rect = el.getBoundingClientRect();
            const origin = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
            
            switch(app.id) {
                case 'settings': setLaunchOrigin(origin); break;
                case 'music': setMusicLaunchOrigin(origin); break;
                case 'gallery': setGalleryLaunchOrigin(origin); break;
                case 'files': setFilesLaunchOrigin(origin); break;
                case 'browser': setBrowserLaunchOrigin(origin); break;
                case 'recorder': setRecorderLaunchOrigin(origin); break;
                case 'terminal': setTerminalLaunchOrigin(origin); break;
                case 'monitor': setMonitorLaunchOrigin(origin); break;
                case 'mail': setMailLaunchOrigin(origin); break;
                case 'note': setNoteLaunchOrigin(origin); break;
                case 'uninstall': setUninstallLaunchOrigin(origin); break;
                case 'calculator': setCalculatorLaunchOrigin(origin); break;
            }
        }
    });
  };

  useEffect(() => {
    if (!hasInitializedPos) {
      const centerX = (window.innerWidth - 950) / 2;
      const centerY = (window.innerHeight - 600) / 2;
      
      setSettingsPosition({ x: centerX, y: centerY });
      setMusicPosition({ x: centerX, y: centerY });
      setGalleryPosition({ x: centerX, y: centerY });
      setRecorderPosition({ x: centerX, y: centerY });
      setTerminalPosition({ x: centerX + 50, y: centerY + 50 });
      setAiPosition({ x: centerX, y: centerY });
      setImageGenPosition({ x: centerX + 30, y: centerY + 30 });
      setVideoGenPosition({ x: centerX + 60, y: centerY + 60 });
      setBrowserPosition({ x: centerX, y: centerY });
      setSnakePosition({ x: centerX, y: centerY });
      setFilesPosition({ x: centerX, y: centerY });
      setMonitorPosition({ x: centerX, y: centerY });
      setMailPosition({ x: centerX, y: centerY });
      setUninstallPosition({ x: centerX, y: centerY });
      setCalculatorPosition({ x: centerX + 100, y: centerY + 50 });
      setNotePosition({ x: centerX + 80, y: centerY + 40 });
      setInstallerPosition({ x: centerX, y: centerY });
      setWidgetPickerPosition({ x: centerX, y: centerY });
      setWidgetPickerLaunchOrigin({ x: centerX, y: centerY });
      
      setHasInitializedPos(true);
    }

    const timer = setTimeout(updateOrigins, 100);
    window.addEventListener('resize', updateOrigins);
    return () => {
        window.removeEventListener('resize', updateOrigins);
        clearTimeout(timer);
    }
  }, [hasInitializedPos, allApps]); // Depend on allApps to update origins when apps open/close in dock

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

  const handleInstallAmeOS = () => {
      // Close windows to simulate restart
      closeAllWindows();
      setSystemMode('ame_install');
  };

  const handleInstallHidden = () => {
      setSystemMode('ame_install');
  };

  const handleAmeInstallComplete = () => {
      setSystemMode('ame_desktop');
  };

  const handleAmeCrash = () => {
      setSystemMode('ame_crash');
      setTimeout(() => {
          setSystemMode('ame_virus'); // Boot into recovery
      }, 5000);
  };

  const handleCrashExplorer = () => {
      setIsExplorerCrashed(true);
      setIsUninstallOpen(false); // Close the uninstall tool when crash happens
  };

  const handleRestoreExplorer = () => {
      setIsExplorerCrashed(false);
      setIsFilesOpen(true);
      focusWindow('files');
  };

  const closeAllWindows = () => {
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
      setIsUninstallOpen(false);
      setIsCalculatorOpen(false);
      setIsNoteOpen(false);
      setIsWidgetPickerOpen(false);
      setMinimizedWindows([]); // Clear minimized state on full close
  };

  // Windows 10 Logic
  const handleRunWin10Installer = () => {
      setShowUAC(true);
  };

  const handleUACResponse = (allow: boolean) => {
      setShowUAC(false);
      if (allow) {
          setSystemMode('win10_installer_window');
          focusWindow('win10-installer');
          
          // Simulate installation process
          let progress = 0;
          const interval = setInterval(() => {
              progress += Math.random() * 15;
              if (progress >= 100) {
                  progress = 100;
                  clearInterval(interval);
                  // After install, reboot
                  setTimeout(() => {
                      closeAllWindows();
                      setSystemMode('win10_env');
                  }, 1500);
              }
              setInstallProgress(progress);
          }, 500);
      }
  };

  // Widget Drag & Drop
  const handleWidgetDragStart = (e: React.DragEvent, type: WidgetType, style: WidgetStyle) => {
    e.dataTransfer.setData('widgetType', type);
    e.dataTransfer.setData('widgetStyle', style);
  };

  const handleDesktopDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const type = e.dataTransfer.getData('widgetType') as WidgetType;
    const style = e.dataTransfer.getData('widgetStyle') as WidgetStyle;
    
    if (type) {
        const newWidget: WidgetInstance = {
            id: `widget-${Date.now()}`,
            type,
            style: style || 'glass',
            x: e.clientX - 100, // Offset to center somewhat
            y: e.clientY - 50,
            zIndex: 10
        };
        setActiveWidgets(prev => [...prev, newWidget]);
    }
  };

  const handleDesktopDragOver = (e: React.DragEvent) => {
      e.preventDefault(); // Allow drop
  };

  const ZLogo = () => {
    if (systemMode === 'ame_virus') {
        return <div className="font-bold text-xl text-red-600 font-mono">A</div>;
    }
    return (
        <svg viewBox="0 0 24 24" className="w-7 h-7 fill-current" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 20h16v-4h-2v2H6.8l11.2-14v-2H2v4h2V4h11.2L4 18z"/>
        </svg>
    );
  };

  const getDockAnimation = () => {
      const duration = 0.2 / animationSpeed;
      switch(animationType) {
          case 'snappy': return { type: "spring", stiffness: 600, damping: 25 };
          case 'bouncy': return { type: "spring", stiffness: 400, damping: 10 };
          case 'linear': return { duration: duration, ease: "linear" };
          case 'default':
          default: return { type: "spring", stiffness: 500 * animationSpeed, damping: 30, mass: 0.8 };
      }
  };

  // If in Windows 10 Environment, replace everything
  if (systemMode === 'win10_env') {
      return (
          <SystemProvider>
              <Windows10Env />
          </SystemProvider>
      );
  }

  return (
    <div 
      className={`w-screen h-screen overflow-hidden relative select-none font-sans transition-all duration-500 ${theme === 'dark' ? 'dark bg-black' : 'bg-gray-200'}`}
      style={{ 
        filter: `brightness(${brightness}%) ${isNightLight ? 'sepia(20%) hue-rotate(-10deg)' : ''}`,
        fontFamily: systemFont
      }}
      onClick={handleGlobalClick}
      onContextMenu={(e) => handleContextMenu(e, 'desktop')}
    >
      
      {/* Startup Popup */}
      <AnimatePresence>
        {showWelcome && <WelcomePopup onClose={() => setShowWelcome(false)} />}
      </AnimatePresence>

      {/* UAC Modal - Redesigned */}
      <AnimatePresence>
        {showUAC && (
            <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-md flex items-center justify-center p-4" onClick={(e) => e.stopPropagation()}>
                <motion.div 
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    className="bg-[#1c1c1e] w-full max-w-md rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/10 overflow-hidden"
                >
                    <div className="p-6 flex flex-col items-center text-center">
                        <div className="w-16 h-16 rounded-full bg-yellow-500/10 flex items-center justify-center mb-4 border border-yellow-500/20 shadow-[0_0_15px_rgba(234,179,8,0.2)]">
                            <Shield className="text-yellow-500" size={32} />
                        </div>
                        
                        <h3 className="text-xl font-bold text-white mb-2">Admin Access Required</h3>
                        <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                            <span className="text-white font-medium">Windows 10 Installer</span> is requesting permission to make changes to your system.
                        </p>

                        <div className="w-full bg-white/5 rounded-lg p-3 mb-6 text-left border border-white/5">
                            <div className="flex justify-between text-xs mb-1">
                                <span className="text-gray-500">Publisher</span>
                                <span className="text-gray-300">Microsoft Corporation</span>
                            </div>
                            <div className="flex justify-between text-xs">
                                <span className="text-gray-500">Origin</span>
                                <span className="text-gray-300">Local Drive</span>
                            </div>
                        </div>

                        <div className="flex gap-3 w-full">
                            <button 
                                onClick={() => handleUACResponse(false)}
                                className="flex-1 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm font-medium rounded-xl transition-all"
                            >
                                Deny
                            </button>
                            <button 
                                onClick={() => handleUACResponse(true)}
                                className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold rounded-xl shadow-lg shadow-blue-600/20 transition-all"
                            >
                                Authorize
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        )}
      </AnimatePresence>

      {/* Lock Screen */}
      <AnimatePresence>
        {systemMode === 'normal' && isLocked && <LockScreen key="lock" />}
      </AnimatePresence>

      {systemMode === 'ame_virus' && (
          <AmeOSBootScreen 
            onRecover={() => setSystemMode('normal')} 
            onInstallHiddenOS={handleInstallHidden}
          />
      )}
      
      {systemMode === 'ame_install' && (
          <AmeOSInstaller onComplete={handleAmeInstallComplete} />
      )}

      {systemMode === 'ame_desktop' && (
          <AmeOSDesktop onCrash={handleAmeCrash} />
      )}

      {systemMode === 'ame_crash' && (
          <LinuxCrashScreen />
      )}

      <audio 
        ref={audioRef}
        src={playlist[currentSong].url}
        onEnded={() => nextSong()}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
      />

      <CustomCursor />

      {/* EXPLORER CRASH OVERLAY - BLACK SCREEN */}
      {isExplorerCrashed && (
          <div className="absolute inset-0 bg-black z-[9000] cursor-default" onContextMenu={(e) => e.preventDefault()}></div>
      )}

      {/* TASK MANAGER - ALWAYS ON TOP IF OPEN */}
      {isTaskManagerOpen && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[450px] z-[9999] shadow-2xl rounded overflow-hidden font-sans">
              <TaskManager onClose={() => setIsTaskManagerOpen(false)} onRestoreExplorer={handleRestoreExplorer} />
          </div>
      )}

      {/* Normal Desktop Content - Hidden if Explorer Crashed */}
      {!isExplorerCrashed && (
      <motion.div 
         className="absolute inset-0 w-full h-full"
         animate={{
            scale: isLocked ? 1.1 : 1,
            filter: isLocked ? "blur(15px) brightness(0.8)" : "none"
         }}
         transition={{ duration: 0.6 / animationSpeed, ease: [0.22, 1, 0.36, 1] }}
         onDrop={handleDesktopDrop}
         onDragOver={handleDesktopDragOver}
      >
        <div 
            className="absolute inset-0 w-full h-full bg-cover bg-center transition-all duration-700 ease-in-out"
            style={{ 
            backgroundImage: `url("${wallpapers[wallpaperIndex]}")`,
            }}
        >
            {/* Dark mode overlay vs Light mode overlay */}
            <div className={`absolute inset-0 transition-colors duration-700 ${theme === 'dark' ? 'bg-black/20' : 'bg-white/5'}`} />
        </div>

        {/* Hyprland-style Top Bar */}
        <Waybar />

        {/* Desktop Widgets Layer */}
        <DesktopWidgets 
            widgets={activeWidgets} 
            onRemoveWidget={removeWidget} 
            onUpdatePosition={updateWidgetPosition} 
        />

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
                    onOpenCalculator={toggleCalculator}
                    onOpenNote={toggleNote}
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
            
            {/* Windows 10 Installer Window */}
            {systemMode === 'win10_installer_window' && (
                <OSWindow
                    key="win10-installer"
                    isOpen={true}
                    onClose={() => {}} // Prevent closing
                    title="Windows 10 Setup"
                    isActive={true}
                    zIndex={9999}
                    onFocus={() => {}}
                    launchOrigin={filesPosition}
                    initialPosition={installerPosition}
                    onDragEnd={() => {}}
                    dragConstraints={constraintsRef}
                    width={600}
                    height={400}
                >
                    <div className="w-full h-full bg-[#4b0082] text-white flex flex-col p-8 font-sans">
                        <h1 className="text-2xl font-light mb-8">Installing Windows 10</h1>
                        <p className="text-sm mb-2">Your PC will restart several times. This might take a while.</p>
                        <div className="text-4xl font-light mb-8">{Math.round(installProgress)}%</div>
                        <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
                            <div 
                                className="h-full bg-white transition-all duration-300 ease-out" 
                                style={{ width: `${installProgress}%` }}
                            />
                        </div>
                        <div className="mt-auto text-xs text-white/60 text-center">
                            Copying files...
                        </div>
                    </div>
                </OSWindow>
            )}

            {isSettingsOpen && (
                <OSWindow 
                key="settings-window"
                isOpen={isSettingsOpen} 
                onClose={() => handleWindowClose('settings', setIsSettingsOpen)}
                title="Settings"
                isActive={isActive('settings')}
                zIndex={getZIndex('settings')}
                onFocus={() => focusWindow('settings')}
                launchOrigin={launchOrigin}
                initialPosition={settingsPosition}
                onDragEnd={(pos) => setSettingsPosition(pos)}
                dragConstraints={constraintsRef}
                isMinimized={minimizedWindows.includes('settings')}
                >
                <SettingsApp onOpenWidgetPicker={toggleWidgetPicker} />
                </OSWindow>
            )}

            {isWidgetPickerOpen && (
                <OSWindow
                    key="widget-picker-window"
                    isOpen={isWidgetPickerOpen}
                    onClose={() => handleWindowClose('widgetPicker', setIsWidgetPickerOpen)}
                    title="Widget Gallery"
                    isActive={isActive('widgetPicker')}
                    zIndex={getZIndex('widgetPicker')}
                    onFocus={() => focusWindow('widgetPicker')}
                    launchOrigin={widgetPickerLaunchOrigin}
                    initialPosition={widgetPickerPosition}
                    onDragEnd={(pos) => setWidgetPickerPosition(pos)}
                    dragConstraints={constraintsRef}
                    width={920}
                    height={650}
                    isMinimized={minimizedWindows.includes('widgetPicker')}
                >
                    <WidgetPicker onDragStart={handleWidgetDragStart} />
                </OSWindow>
            )}

            {isMusicOpen && (
                <OSWindow
                    key="music-window"
                    isOpen={isMusicOpen}
                    onClose={() => handleWindowClose('music', setIsMusicOpen)}
                    title="Music Player"
                    isActive={isActive('music')}
                    zIndex={getZIndex('music')}
                    onFocus={() => focusWindow('music')}
                    launchOrigin={musicLaunchOrigin}
                    initialPosition={musicPosition}
                    onDragEnd={(pos) => setMusicPosition(pos)}
                    dragConstraints={constraintsRef}
                    isMinimized={minimizedWindows.includes('music')}
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
                    onClose={() => handleWindowClose('gallery', setIsGalleryOpen)}
                    title="Gallery & Wallpapers"
                    isActive={isActive('gallery')}
                    zIndex={getZIndex('gallery')}
                    onFocus={() => focusWindow('gallery')}
                    launchOrigin={galleryLaunchOrigin}
                    initialPosition={galleryPosition}
                    onDragEnd={(pos) => setGalleryPosition(pos)}
                    dragConstraints={constraintsRef}
                    isMinimized={minimizedWindows.includes('gallery')}
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
                    onClose={() => handleWindowClose('recorder', setIsRecorderOpen)}
                    title="Screen Recorder"
                    isActive={isActive('recorder')}
                    zIndex={getZIndex('recorder')}
                    onFocus={() => focusWindow('recorder')}
                    launchOrigin={recorderLaunchOrigin}
                    initialPosition={recorderPosition}
                    onDragEnd={(pos) => setRecorderPosition(pos)}
                    dragConstraints={constraintsRef}
                    isMinimized={minimizedWindows.includes('recorder')}
                >
                    <ScreenRecorderApp />
                </OSWindow>
            )}

            {isTerminalOpen && (
                <OSWindow
                    key="terminal-window"
                    isOpen={isTerminalOpen}
                    onClose={() => handleWindowClose('terminal', setIsTerminalOpen)}
                    title="Terminal"
                    isActive={isActive('terminal')}
                    zIndex={getZIndex('terminal')}
                    onFocus={() => focusWindow('terminal')}
                    launchOrigin={terminalLaunchOrigin}
                    initialPosition={terminalPosition}
                    onDragEnd={(pos) => setTerminalPosition(pos)}
                    dragConstraints={constraintsRef}
                    isMinimized={minimizedWindows.includes('terminal')}
                >
                    <TerminalApp 
                    onUnlockSecret={() => openWindow('ai', setIsAIOpen)} 
                    onOpenBrowser={() => openWindow('browser', setIsBrowserOpen)} 
                    onOpenSnake={() => openWindow('snake', setIsSnakeOpen)}
                    onInstallAmeOS={handleInstallAmeOS}
                    onOpenImageGen={() => openWindow('imageGen', setIsImageGenOpen)}
                    onOpenVideoGen={() => openWindow('videoGen', setIsVideoGenOpen)}
                    onDeleteFileExplorer={handleCrashExplorer}
                    onOpenUninstallTool={() => openWindow('uninstall', setIsUninstallOpen)}
                    />
                </OSWindow>
            )}

            {isBrowserOpen && (
                <OSWindow
                    key="browser-window"
                    isOpen={isBrowserOpen}
                    onClose={() => handleWindowClose('browser', setIsBrowserOpen)}
                    title="ZimDex Browser"
                    isActive={isActive('browser')}
                    zIndex={getZIndex('browser')}
                    onFocus={() => focusWindow('browser')}
                    launchOrigin={browserLaunchOrigin}
                    initialPosition={browserPosition}
                    onDragEnd={(pos) => setBrowserPosition(pos)}
                    dragConstraints={constraintsRef}
                    isMinimized={minimizedWindows.includes('browser')}
                >
                    <BrowserApp />
                </OSWindow>
            )}

            {isFilesOpen && (
                <OSWindow
                    key="files-window"
                    isOpen={isFilesOpen}
                    onClose={() => handleWindowClose('files', setIsFilesOpen)}
                    title="File Explorer"
                    isActive={isActive('files')}
                    zIndex={getZIndex('files')}
                    onFocus={() => focusWindow('files')}
                    launchOrigin={filesLaunchOrigin}
                    initialPosition={filesPosition}
                    onDragEnd={(pos) => setFilesPosition(pos)}
                    dragConstraints={constraintsRef}
                    isMinimized={minimizedWindows.includes('files')}
                >
                    <FileExplorerApp 
                        onOpenFile={handleOpenFile}
                        onSystemDelete={handleAmeCrash}
                        onRunInstaller={handleRunWin10Installer}
                    />
                </OSWindow>
            )}

            {isMonitorOpen && (
                <OSWindow
                    key="monitor-window"
                    isOpen={isMonitorOpen}
                    onClose={() => handleWindowClose('monitor', setIsMonitorOpen)}
                    title="System Monitor"
                    isActive={isActive('monitor')}
                    zIndex={getZIndex('monitor')}
                    onFocus={() => focusWindow('monitor')}
                    launchOrigin={monitorLaunchOrigin}
                    initialPosition={monitorPosition}
                    onDragEnd={(pos) => setMonitorPosition(pos)}
                    dragConstraints={constraintsRef}
                    isMinimized={minimizedWindows.includes('monitor')}
                >
                    <MonitorApp />
                </OSWindow>
            )}

            {isMailOpen && (
                <OSWindow
                    key="mail-window"
                    isOpen={isMailOpen}
                    onClose={() => handleWindowClose('mail', setIsMailOpen)}
                    title="Mail"
                    isActive={isActive('mail')}
                    zIndex={getZIndex('mail')}
                    onFocus={() => focusWindow('mail')}
                    launchOrigin={mailLaunchOrigin}
                    initialPosition={mailPosition}
                    onDragEnd={(pos) => setMailPosition(pos)}
                    dragConstraints={constraintsRef}
                    isMinimized={minimizedWindows.includes('mail')}
                >
                    <MailApp />
                </OSWindow>
            )}

            {isCalculatorOpen && (
                <OSWindow
                    key="calculator-window"
                    isOpen={isCalculatorOpen}
                    onClose={() => handleWindowClose('calculator', setIsCalculatorOpen)}
                    title="Calculator"
                    isActive={isActive('calculator')}
                    zIndex={getZIndex('calculator')}
                    onFocus={() => focusWindow('calculator')}
                    launchOrigin={calculatorLaunchOrigin}
                    initialPosition={calculatorPosition}
                    onDragEnd={(pos) => setCalculatorPosition(pos)}
                    dragConstraints={constraintsRef}
                    width={320}
                    height={540}
                    isMinimized={minimizedWindows.includes('calculator')}
                >
                    <CalculatorApp />
                </OSWindow>
            )}

            {isNoteOpen && (
                <OSWindow
                    key="note-window"
                    isOpen={isNoteOpen}
                    onClose={() => handleWindowClose('note', setIsNoteOpen)}
                    title="My Diary"
                    isActive={isActive('note')}
                    zIndex={getZIndex('note')}
                    onFocus={() => focusWindow('note')}
                    launchOrigin={noteLaunchOrigin}
                    initialPosition={notePosition}
                    onDragEnd={(pos) => setNotePosition(pos)}
                    dragConstraints={constraintsRef}
                    isMinimized={minimizedWindows.includes('note')}
                >
                    <NoteApp />
                </OSWindow>
            )}

            {isAIOpen && (
                <OSWindow
                    key="ai-window"
                    isOpen={isAIOpen}
                    onClose={() => handleWindowClose('ai', setIsAIOpen)}
                    title="Liminal AI // CLASSIFIED"
                    isActive={isActive('ai')}
                    zIndex={getZIndex('ai')}
                    onFocus={() => focusWindow('ai')}
                    launchOrigin={terminalPosition} 
                    initialPosition={aiPosition}
                    onDragEnd={(pos) => setAiPosition(pos)}
                    dragConstraints={constraintsRef}
                    isMinimized={minimizedWindows.includes('ai')}
                >
                    <LiminalAIApp />
                </OSWindow>
            )}

            {isImageGenOpen && (
                <OSWindow
                    key="imageGen-window"
                    isOpen={isImageGenOpen}
                    onClose={() => handleWindowClose('imageGen', setIsImageGenOpen)}
                    title="Liminal Visualizer // CLASSIFIED"
                    isActive={isActive('imageGen')}
                    zIndex={getZIndex('imageGen')}
                    onFocus={() => focusWindow('imageGen')}
                    launchOrigin={terminalPosition} 
                    initialPosition={imageGenPosition}
                    onDragEnd={(pos) => setImageGenPosition(pos)}
                    dragConstraints={constraintsRef}
                    isMinimized={minimizedWindows.includes('imageGen')}
                >
                    <LiminalImageApp />
                </OSWindow>
            )}

            {isVideoGenOpen && (
                <OSWindow
                    key="videoGen-window"
                    isOpen={isVideoGenOpen}
                    onClose={() => handleWindowClose('videoGen', setIsVideoGenOpen)}
                    title="Liminal Motion Engine // CLASSIFIED"
                    isActive={isActive('videoGen')}
                    zIndex={getZIndex('videoGen')}
                    onFocus={() => focusWindow('videoGen')}
                    launchOrigin={terminalPosition} 
                    initialPosition={videoGenPosition}
                    onDragEnd={(pos) => setVideoGenPosition(pos)}
                    dragConstraints={constraintsRef}
                    isMinimized={minimizedWindows.includes('videoGen')}
                >
                    <LiminalVideoApp />
                </OSWindow>
            )}
            
            {isUninstallOpen && (
                <OSWindow
                    key="uninstall-window"
                    isOpen={isUninstallOpen}
                    onClose={() => handleWindowClose('uninstall', setIsUninstallOpen)}
                    title="Uninstall Tool"
                    isActive={isActive('uninstall')}
                    zIndex={getZIndex('uninstall')}
                    onFocus={() => focusWindow('uninstall')}
                    launchOrigin={uninstallLaunchOrigin}
                    initialPosition={uninstallPosition}
                    onDragEnd={(pos) => setUninstallPosition(pos)}
                    dragConstraints={constraintsRef}
                    isMinimized={minimizedWindows.includes('uninstall')}
                >
                    <UninstallApp onDeleteFileExplorer={handleCrashExplorer} onClose={toggleUninstall} />
                </OSWindow>
            )}

            {openFiles.map((fileWin) => {
                const winId = `file-${fileWin.id}`;
                const updatePos = (pos: {x:number, y:number}) => {
                    setOpenFiles(prev => prev.map(fw => fw.id === fileWin.id ? { ...fw, position: pos } : fw));
                };

                return (
                    <OSWindow
                        key={winId}
                        isOpen={true}
                        onClose={() => closeFileWindow(fileWin.id)}
                        title={fileWin.file.name}
                        isActive={isActive(winId)}
                        zIndex={getZIndex(winId)}
                        onFocus={() => focusWindow(winId)}
                        launchOrigin={filesPosition}
                        initialPosition={fileWin.position}
                        onDragEnd={updatePos}
                        dragConstraints={constraintsRef}
                        isMinimized={minimizedWindows.includes(winId)}
                    >
                        {['text', 'code'].includes(fileWin.file.type) ? (
                            <TextEditor file={fileWin.file} onSave={fileWin.onSave} />
                        ) : fileWin.file.type === 'image' ? (
                            <ImageViewer file={fileWin.file} onSave={fileWin.onSave} />
                        ) : ['audio', 'video'].includes(fileWin.file.type) ? (
                            <MediaPlayer file={fileWin.file} />
                        ) : (
                            <div className="flex items-center justify-center h-full text-gray-400">
                                No preview available.
                            </div>
                        )}
                    </OSWindow>
                );
            })}

            </AnimatePresence>
        </div>

        {/* Bottom Dock */}
        <div 
            className="absolute bottom-0 left-0 right-0 z-[200] flex justify-center pb-4 pointer-events-none"
            onContextMenu={(e) => e.stopPropagation()} 
        >
            <motion.div 
                layout
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className={`
                flex items-center px-2 py-2
                h-[68px]
                border border-white/20 dark:border-white/10
                shadow-2xl pointer-events-auto
                rounded-2xl
                ${isTransparencyEnabled ? 'bg-white/60 dark:bg-[#1c1c1e]/80 backdrop-blur-2xl' : 'bg-white dark:bg-[#1c1c1e]'}
            `}>
                <button 
                    ref={startButtonRef}
                    onClick={toggleStartMenu}
                    className={`
                    w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 mr-2
                    ${isStartMenuOpen ? 'text-white shadow-lg' : 'text-gray-800 dark:text-white/90 hover:bg-black/10 dark:hover:bg-white/10 hover:scale-105'}
                    ${systemMode === 'ame_virus' ? 'bg-red-900/50 hover:bg-red-800/50' : ''}
                    `}
                    style={{ backgroundColor: isStartMenuOpen && systemMode !== 'ame_virus' ? accentColor : undefined }}
                >
                    <ZLogo />
                </button>

                <div className="w-[1px] h-8 bg-black/10 dark:bg-white/10 mx-2" />

                <div className="flex items-center gap-2 px-2">
                    <AnimatePresence mode="popLayout">
                    {allApps.filter(app => app.pinned || app.isOpen).map((app, index, array) => {
                        // Check if previous item was pinned and current is not (to add separator)
                        const isSeparator = !app.pinned && array[index-1]?.pinned;
                        const isAppActive = isActive(app.id) && !minimizedWindows.includes(app.id);

                        return (
                            <motion.div 
                                key={app.id}
                                layout
                                initial={{ opacity: 0, scale: 0.5, y: 50 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.5, y: 50, transition: { duration: 0.2 / animationSpeed } }}
                                transition={getDockAnimation() as any}
                                className="flex items-center"
                            >
                                {isSeparator && <div className="w-[1px] h-8 bg-black/10 dark:bg-white/10 mx-1" />}
                                <div className="relative group">
                                    <button
                                        ref={el => { if(el) dockRefs.current.set(app.id, el); else dockRefs.current.delete(app.id); }}
                                        onClick={(e) => {
                                            app.toggle();
                                        }}
                                        className={`
                                            w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300
                                            ${app.isOpen && !minimizedWindows.includes(app.id) ? 'bg-black/10 dark:bg-white/10 shadow-[0_0_15px_rgba(0,0,0,0.1)] dark:shadow-[0_0_15px_rgba(255,255,255,0.1)]' : 'hover:bg-black/10 dark:hover:bg-white/10 hover:-translate-y-2 hover:scale-110'}
                                        `}
                                    >
                                        {/* Icon Rendering */}
                                        {app.id === 'settings' ? (
                                            <div className={`transition-transform duration-[3s] ease-linear ${app.isOpen ? 'rotate-[120deg]' : ''}`}>
                                                <app.icon size={26} className="text-gray-700 dark:text-white drop-shadow-md" strokeWidth={1.5} />
                                            </div>
                                        ) : (
                                            <div className={`w-10 h-10 bg-gradient-to-br ${app.gradient || app.color} rounded-xl flex items-center justify-center text-white shadow-lg`}>
                                                <app.icon size={20} className="text-white drop-shadow-md" />
                                            </div>
                                        )}
                                    </button>
                                    
                                    {/* Windows 11 Style Indicator */}
                                    {app.isOpen && (
                                        <div 
                                            className={`absolute -bottom-1.5 left-1/2 -translate-x-1/2 h-1 rounded-full transition-all duration-300 
                                            ${isAppActive
                                                ? 'w-4 shadow-[0_0_8px_rgba(var(--accent-rgb),0.6)]' 
                                                : 'w-1 bg-gray-400 dark:bg-gray-500'
                                            }`}
                                            style={{
                                                backgroundColor: isAppActive ? accentColor : undefined
                                            }}
                                        />
                                    )}
                                    
                                    {/* Tooltip */}
                                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap border border-black/5 dark:border-white/10 shadow-sm">
                                        {app.name}
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
      </motion.div>
      )}

      {contextMenu && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.1 }}
          style={{ top: contextMenu.y, left: contextMenu.x }}
          className="absolute z-[9999] w-56 bg-white/90 dark:bg-[#141414]/90 backdrop-blur-xl border border-black/10 dark:border-white/15 rounded-lg shadow-2xl py-1.5 flex flex-col pointer-events-auto origin-top-left"
          onClick={(e) => e.stopPropagation()}
        >
          {contextMenu.type === 'desktop' ? (
            <>
              <button 
                onClick={changeWallpaper}
                className="flex items-center gap-3 px-3 py-2 hover:bg-[#3b82f6] text-gray-800 dark:text-gray-200 hover:text-white text-sm mx-1 rounded transition-colors group"
              >
                <ImageIcon size={15} />
                Next Wallpaper
              </button>
              <button 
                onClick={() => { setContextMenu(null); toggleGallery(); }}
                className="flex items-center gap-3 px-3 py-2 hover:bg-[#3b82f6] text-gray-800 dark:text-gray-200 hover:text-white text-sm mx-1 rounded transition-colors"
              >
                <Folder size={15} />
                Wallpaper Library
              </button>
              <div className="h-[1px] bg-black/5 dark:bg-white/10 my-1.5 mx-2" />
              <button onClick={() => { setContextMenu(null); toggleWidgetPicker(); }} className="flex items-center gap-3 px-3 py-2 hover:bg-[#3b82f6] text-gray-800 dark:text-gray-200 hover:text-white text-sm mx-1 rounded transition-colors">
                <Layout size={15} />
                Add Widgets...
              </button>
              <button className="flex items-center gap-3 px-3 py-2 hover:bg-[#3b82f6] text-gray-800 dark:text-gray-200 hover:text-white text-sm mx-1 rounded transition-colors">
                <RefreshCw size={15} />
                Refresh
              </button>
              <div className="h-[1px] bg-black/5 dark:bg-white/10 my-1.5 mx-2" />
              <button onClick={() => setLocked(true)} className="flex items-center gap-3 px-3 py-2 hover:bg-[#3b82f6] text-gray-800 dark:text-gray-200 hover:text-white text-sm mx-1 rounded transition-colors">
                <Lock size={15} />
                Lock
              </button>
              <button className="flex items-center gap-3 px-3 py-2 hover:bg-red-500/80 text-gray-800 dark:text-gray-200 hover:text-white text-sm mx-1 rounded transition-colors">
                <Power size={15} />
                Shut down
              </button>
            </>
          ) : (
            <>
               <div className="px-3 py-2 text-xs font-bold text-gray-500 uppercase tracking-wider">Music Player</div>
               <button 
                 onClick={toggleMusicApp} 
                 className="flex items-center gap-3 px-3 py-2 hover:bg-[#3b82f6] text-gray-800 dark:text-gray-200 hover:text-white text-sm mx-1 rounded transition-colors"
               >
                 <Disc size={15} />
                 Open Music App
               </button>
               <button onClick={togglePlay} className="flex items-center gap-3 px-3 py-2 hover:bg-[#3b82f6] text-gray-800 dark:text-gray-200 hover:text-white text-sm mx-1 rounded transition-colors">
                 {isPlaying ? <div className="w-4 h-4 flex items-center justify-center"><div className="w-2 h-2 bg-current"/></div> : <Play size={15} />}
                 {isPlaying ? "Pause" : "Play"}
               </button>
               <button onClick={nextSong} className="flex items-center gap-3 px-3 py-2 hover:bg-[#3b82f6] text-gray-800 dark:text-gray-200 hover:text-white text-sm mx-1 rounded transition-colors">
                 <SkipForward size={15} />
                 Next Track
               </button>
            </>
          )}
        </motion.div>
      )}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <SystemProvider>
      <DesktopContent />
    </SystemProvider>
  );
};

export default App;
