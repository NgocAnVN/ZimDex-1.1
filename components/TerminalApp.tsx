
import React, { useState, useRef, useEffect } from 'react';
import { Terminal as TerminalIcon } from 'lucide-react';

interface TerminalAppProps {
  onUnlockSecret: () => void;
  onOpenBrowser: () => void;
  onOpenSnake: () => void;
  onInstallAmeOS: () => void;
  onOpenImageGen: () => void;
  onOpenVideoGen: () => void;
  onOpenPho: () => void;
  onDeleteFileExplorer: () => void;
  onOpenUninstallTool: () => void;
}

interface HistoryItem {
  type: 'input' | 'output';
  content: string;
}

export const TerminalApp: React.FC<TerminalAppProps> = ({ 
    onUnlockSecret, onOpenBrowser, onOpenSnake, onInstallAmeOS, 
    onOpenImageGen, onOpenVideoGen, onOpenPho, onDeleteFileExplorer, onOpenUninstallTool
}) => {
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
    setInput('');

    if (trimmedCmd === '') return;

    // --- New Command: Uninstall-tool== ---
    if (trimmedCmd === 'Uninstall-tool==') {
        addToHistory('Launching Uninstaller Tool v1.0...');
        onOpenUninstallTool();
        return;
    }

    // Easter Egg: Install AmeOS
    if (trimmedCmd === 'install AmeOS') {
        runFakeInstallation();
        return;
    }
    
    // Easter Egg: Self Destruct
    if (trimmedCmd === 'kill-system') {
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
            "rm: removing '/tmp'",
            "rm: removing '/usr'",
            "rm: removing '/var'",
            "rm: cannot remove '/sys/firmware/efi/efivars': Operation not permitted",
            "KERNEL PANIC: Init not found. Try passing init= option to kernel."
        ];

        for (let i = 0; i < crashSequence.length; i++) {
             await new Promise(r => setTimeout(r, 300));
             addToHistory(crashSequence[i]);
        }
        return;
    }

    // Application Launchers
    if (trimmedCmd === 'liminal') {
        onUnlockSecret();
        addToHistory('Accessing Liminal Protocol...');
        return;
    }

    if (trimmedCmd === 'browser' || trimmedCmd === 'start chrome') {
        onOpenBrowser();
        addToHistory('Launching Browser...');
        return;
    }

    if (trimmedCmd === 'snake' || trimmedCmd === 'game') {
        onOpenSnake();
        addToHistory('Launching Snake...');
        return;
    }

    if (trimmedCmd === 'pho' || trimmedCmd === 'cook') {
        onOpenPho();
        addToHistory('Opening Pho Anh Hai...');
        return;
    }

    if (trimmedCmd === 'imagine' || trimmedCmd === 'gen-img') {
        onOpenImageGen();
        addToHistory('Initializing Visualizer...');
        return;
    }

    if (trimmedCmd === 'animate' || trimmedCmd === 'gen-video') {
        onOpenVideoGen();
        addToHistory('Initializing Motion Engine...');
        return;
    }

    // Basic Commands
    if (trimmedCmd === 'help') {
        const helpText = [
            'Available Commands:',
            '  help              - Show this help message',
            '  cls / clear       - Clear the screen',
            '  date              - Display current date',
            '  whoami            - Display current user',
            '  liminal           - Access hidden AI layer',
            '  browser           - Launch Web Browser',
            '  snake             - Play Snake',
            '  pho               - Play Pho Anh Hai',
            '  imagine           - Launch AI Image Generator',
            '  animate           - Launch AI Video Generator',
            '  install AmeOS     - System Upgrade',
            '  Uninstall-tool==  - Remove system applications'
        ];
        helpText.forEach(line => addToHistory(line));
        return;
    }

    if (trimmedCmd === 'cls' || trimmedCmd === 'clear') {
        setHistory([]);
        return;
    }

    if (trimmedCmd === 'date') {
        addToHistory(new Date().toString());
        return;
    }

    if (trimmedCmd === 'whoami') {
        addToHistory('zimdex\\admin');
        return;
    }

    addToHistory(`'${trimmedCmd}' is not recognized as an internal or external command, operable program or batch file.`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
        handleCommand(input);
    }
  };

  return (
    <div 
        className="w-full h-full bg-black text-gray-300 font-mono text-sm p-4 overflow-hidden flex flex-col"
        onClick={() => inputRef.current?.focus()}
    >
        <div ref={containerRef} className="flex-1 overflow-y-auto custom-scrollbar">
            {history.map((item, index) => (
                <div key={index} className={`${item.type === 'input' ? 'mt-2' : ''}`}>
                    {item.type === 'input' && <span className="text-green-500 mr-2">C:\Users\NgocAnn&gt;</span>}
                    <span>{item.content}</span>
                </div>
            ))}
            
            {!isLocked && (
                <div className="mt-2 flex items-center">
                    <span className="text-green-500 mr-2">C:\Users\NgocAnn&gt;</span>
                    <input
                        ref={inputRef}
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="flex-1 bg-transparent outline-none text-gray-300 caret-gray-300"
                        autoComplete="off"
                        autoFocus
                    />
                </div>
            )}
        </div>
    </div>
  );
};
