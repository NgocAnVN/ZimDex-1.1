
import React, { useState, useRef, useEffect } from 'react';
import { Terminal as TerminalIcon } from 'lucide-react';

interface TerminalAppProps {
  onUnlockSecret: () => void;
  onOpenBrowser: () => void;
  onOpenSnake: () => void;
  onInstallAmeOS: () => void;
}

interface HistoryItem {
  type: 'input' | 'output';
  content: string;
}

export const TerminalApp: React.FC<TerminalAppProps> = ({ onUnlockSecret, onOpenBrowser, onOpenSnake, onInstallAmeOS }) => {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<HistoryItem[]>([
    { type: 'output', content: 'ZimDex OS [Version 10.0.25398.1]' },
    { type: 'output', content: '(c) ZimDex Corporation. All rights reserved.' },
    { type: 'output', content: '' },
  ]);
  const [isLocked, setIsLocked] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
    inputRef.current?.focus();
  }, [history]);

  const addToHistory = (text: string, type: 'input' | 'output' = 'output') => {
    setHistory(prev => [...prev, { type, content: text }]);
  };

  const runFakeInstallation = async () => {
     setIsLocked(true);
     const delays = [500, 800, 1200, 400, 600, 1500, 800, 1000, 2000];
     const messages = [
        'Connecting to ShadowNet repositories...',
        'Resolving dependencies for AmeOS...',
        'Downloading ame-kernel-v6.6.6 [================>  ] 82%',
        'Downloading ame-kernel-v6.6.6 [===================] 100%',
        'Verifying signatures...',
        'WARNING: Signature verification failed! (Error 0x8008135)',
        'Bypassing security protocols...',
        'Overwriting System32...',
        'Installing AmeOS Bootloader...',
        'System requires a restart to complete installation.'
     ];

     for (let i = 0; i < messages.length; i++) {
         await new Promise(r => setTimeout(r, delays[i] || 500));
         addToHistory(messages[i]);
     }

     await new Promise(r => setTimeout(r, 2000));
     addToHistory('Rebooting system now...');
     await new Promise(r => setTimeout(r, 1000));
     onInstallAmeOS();
  };

  const handleCommand = async (cmd: string) => {
    const trimmedCmd = cmd.trim();
    addToHistory(cmd, 'input');

    if (trimmedCmd === '') return;

    // Easter Egg: Install AmeOS
    if (trimmedCmd === 'install AmeOS') {
        runFakeInstallation();
        return;
    }
    
    // Easter Egg: Self Destruct
    if (trimmedCmd === 'rm -rf --no-preserve-root /') {
        setIsLocked(true);
        const crashSequence = [
            "rm: removing '/'",
            "rm: removing '/bin'",
            "rm: removing '/boot'",
            "rm: removing '/dev'",
            "rm: removing '/etc'",
            "rm: removing '/home'",
            "rm: removing '/lib'",
            "rm: removing '/mnt'",
            "rm: removing '/proc'",
            "rm: removing '/root'",
            "rm: removing '/run'",
            "rm: removing '/sbin'",
            "rm: removing '/sys'",
            "rm: removing '/usr'",
            "rm: removing '/var'",
            "rm: cannot remove '/proc/1/fd/0': Operation not permitted",
            "rm: cannot remove '/sys/kernel/security': Operation not permitted",
            "FAILED TO WRITE LOG: Disk quota exceeded",
            "CRITICAL PROCESS DIED: init",
            "Kernel panic - not syncing: Attempted to kill init! exitcode=0x00000000",
            "CPU: 0 PID: 1 Comm: rm Not tainted 6.6.6-zimdex #1",
            "Call Trace:",
            " <TASK>",
            " panic+0x140/0x2a0",
            " do_exit+0x300/0xa00",
            "Rebooting in 3 seconds..."
        ];

        for (const line of crashSequence) {
             await new Promise(r => setTimeout(r, Math.random() * 100 + 50));
             addToHistory(line);
        }
        
        await new Promise(r => setTimeout(r, 3000));
        onInstallAmeOS(); // Reusing the crash handler which triggers the boot loop
        return;
    }

    // Secret Code: Liminal AI
    if (trimmedCmd === 'ZImAI==') {
       addToHistory('authenticating hash...');
       addToHistory('verifying encryption keys...');
       addToHistory('ACCESS GRANTED. WELCOME, ADMINISTRATOR.');
       addToHistory('INITIALIZING LIMINAL PROTOCOL...');
       
       setTimeout(() => {
         onUnlockSecret();
         addToHistory('[SUCCESS] Liminal UI loaded.');
       }, 1500);
       return;
    }

    // Secret Code: Browser
    if (trimmedCmd === 'ZimBr==') {
        addToHistory('resolving proxy chains...');
        addToHistory('OPENING SECURE BROWSER...');
        
        setTimeout(() => {
          onOpenBrowser();
          addToHistory('[SUCCESS] Browser active.');
        }, 1000);
        return;
     }

     // Secret Code: Snake Game
    if (trimmedCmd === 'ZImGame==') {
        addToHistory('loading arcade assets...');
        addToHistory('STARTING SNAKE...');
        
        setTimeout(() => {
          onOpenSnake();
          addToHistory('[SUCCESS] Game Running.');
        }, 1000);
        return;
     }

    switch (trimmedCmd.toLowerCase()) {
      case 'help':
        addToHistory('Available commands:');
        addToHistory('  help           - Show this help message');
        addToHistory('  clear          - Clear terminal screen');
        addToHistory('  whoami         - Display current user');
        addToHistory('  install [pkg]  - Install software packages');
        addToHistory('  date           - Display current system date');
        break;
      case 'clear':
        setHistory([]);
        break;
      case 'whoami':
        addToHistory('guest@zimdex-os');
        break;
      case 'date':
        addToHistory(new Date().toString());
        break;
      default:
        if (trimmedCmd.startsWith('echo ')) {
            addToHistory(trimmedCmd.substring(5));
        } else if (trimmedCmd.startsWith('install ')) {
            addToHistory(`Error: Package '${trimmedCmd.substring(8)}' not found in standard repositories.`);
        } else {
            addToHistory(`Command not found: ${trimmedCmd}`);
        }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isLocked) {
      handleCommand(input);
      setInput('');
    }
  };

  return (
    <div 
      className="w-full h-full bg-[#0c0c0c]/90 backdrop-blur-md text-green-500 font-mono p-4 text-sm overflow-hidden flex flex-col"
      onClick={() => !isLocked && inputRef.current?.focus()}
    >
      <div className="flex-1 overflow-y-auto custom-scrollbar" ref={containerRef}>
        {history.map((item, i) => (
          <div key={i} className={`mb-1 ${item.type === 'input' ? 'text-white' : 'text-green-400'}`}>
            {item.type === 'input' && <span className="text-green-600 mr-2">guest@zimdex:~$</span>}
            <span className="whitespace-pre-wrap break-words">{item.content}</span>
          </div>
        ))}
        
        {!isLocked && (
            <div className="flex items-center">
            <span className="text-green-600 mr-2 shrink-0">guest@zimdex:~$</span>
            <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="bg-transparent border-none outline-none flex-1 text-white caret-white"
                autoComplete="off"
                autoCapitalize="off"
                spellCheck="false"
            />
            </div>
        )}
        {isLocked && (
            <div className="mt-2 animate-pulse text-green-400">_</div>
        )}
      </div>
    </div>
  );
};
