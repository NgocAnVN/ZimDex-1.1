
import React, { useState } from 'react';
import { Trash2, AlertTriangle, Loader2, HardDrive, ShieldAlert, Check, X, Calculator, FileText, Folder } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface UninstallAppProps {
  onDeleteFileExplorer: () => void;
  onClose: () => void;
}

export const UninstallApp: React.FC<UninstallAppProps> = ({ onDeleteFileExplorer, onClose }) => {
  const [step, setStep] = useState<'idle' | 'scanning' | 'results' | 'deleting' | 'finished'>('idle');
  const [progress, setProgress] = useState(0);
  const [deletedIds, setDeletedIds] = useState<string[]>([]);
  const [currentAction, setCurrentAction] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const apps = [
    { name: 'Calculator', Icon: Calculator, size: '1.2 MB', id: 'calc', type: 'Application' },
    { name: 'Notepad', Icon: FileText, size: '800 KB', id: 'note', type: 'Application' },
    { name: 'File Explorer', Icon: Folder, size: 'System Component', id: 'explorer', isSystem: true, type: 'System' },
  ];

  const startScan = () => {
    setStep('scanning');
    // Pre-select all by default when scan finishes
    let p = 0;
    const interval = setInterval(() => {
      p += 2; // faster scan
      setProgress(p);
      setCurrentAction(`Scanning sector ${Math.floor(Math.random() * 9000) + 1000}...`);
      if (p >= 100) {
        clearInterval(interval);
        setStep('results');
        setCurrentAction('');
        setSelectedIds(apps.map(a => a.id));
      }
    }, 30);
  };

  const toggleSelect = (id: string) => {
      if (step === 'deleting') return;
      setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const startDelete = async () => {
    if (selectedIds.length === 0) return;
    setStep('deleting');
    
    const targets = apps.filter(a => selectedIds.includes(a.id));

    for (const app of targets) {
        setCurrentAction(`Stopping process: ${app.name.toLowerCase().replace(' ', '')}.exe`);
        await new Promise(r => setTimeout(r, 800));
        setCurrentAction(`Removing ${app.name} registry keys...`);
        await new Promise(r => setTimeout(r, 600));
        
        setDeletedIds(prev => [...prev, app.id]);

        if (app.id === 'explorer') {
            setCurrentAction('CRITICAL: Modifying System32...');
            await new Promise(r => setTimeout(r, 1000));
            onDeleteFileExplorer();
            return; // App crashes here
        }
    }
    
    setCurrentAction('Cleanup complete.');
    await new Promise(r => setTimeout(r, 500));
    setStep('finished');
  };

  return (
    <div className="w-full h-full bg-[#121212] text-gray-200 flex flex-col font-sans border border-white/5 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="h-16 flex items-center justify-between px-6 border-b border-white/5 bg-[#181818]">
        <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-red-600 to-red-800 rounded-md flex items-center justify-center shadow-lg shadow-red-900/20">
                <Trash2 size={18} className="text-white" />
            </div>
            <div>
                <h2 className="text-sm font-bold text-white tracking-wide">Force Uninstaller</h2>
                <p className="text-[10px] text-gray-500 font-mono">v2.4.1-ADMIN</p>
            </div>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors">
            <X size={16} className="text-gray-400" />
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 relative">
         <AnimatePresence mode="wait">
         {step === 'idle' && (
             <motion.div 
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full flex flex-col items-center justify-center text-center gap-6"
             >
                 <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center border border-white/10 relative group">
                     <HardDrive size={40} className="text-gray-500 group-hover:text-blue-400 transition-colors" />
                     <div className="absolute inset-0 border-2 border-blue-500/20 rounded-full scale-110 opacity-0 group-hover:opacity-100 transition-all duration-500" />
                 </div>
                 <div>
                    <h3 className="text-lg font-medium text-white mb-2">Ready to Scan</h3>
                    <p className="text-xs text-gray-500 max-w-[240px] mx-auto leading-relaxed">
                        This tool will locate and force-remove stubborn applications and system artifacts.
                    </p>
                 </div>
                 <button 
                    onClick={startScan}
                    className="px-8 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-bold shadow-lg shadow-blue-600/20 transition-all hover:scale-105 active:scale-95"
                 >
                    Start System Scan
                 </button>
             </motion.div>
         )}

         {step === 'scanning' && (
             <motion.div 
                key="scanning"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full flex flex-col items-center justify-center gap-8"
             >
                 <div className="relative w-40 h-40">
                     <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                         <circle cx="50" cy="50" r="40" fill="none" stroke="#1f1f1f" strokeWidth="4" />
                         <circle 
                            cx="50" 
                            cy="50" 
                            r="40" 
                            fill="none" 
                            stroke="#3b82f6" 
                            strokeWidth="4" 
                            strokeLinecap="round"
                            strokeDasharray="251.2" 
                            strokeDashoffset={251.2 - (251.2 * progress) / 100} 
                            className="transition-all duration-75" 
                         />
                     </svg>
                     <div className="absolute inset-0 flex flex-col items-center justify-center">
                         <span className="text-2xl font-bold font-mono text-white">{progress}%</span>
                     </div>
                     <div className="absolute inset-0 bg-blue-500/10 blur-xl rounded-full" />
                 </div>

                 <div className="space-y-2 text-center">
                     <div className="h-1 w-32 bg-gray-800 rounded-full overflow-hidden mx-auto">
                         <motion.div 
                            className="h-full bg-blue-500"
                            animate={{ x: [-100, 100] }}
                            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                         />
                     </div>
                     <p className="text-xs text-blue-400 font-mono">{currentAction}</p>
                 </div>
             </motion.div>
         )}

         {(step === 'results' || step === 'deleting' || step === 'finished') && (
             <motion.div 
                key="results"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="h-full flex flex-col"
             >
                 <div className="flex items-center justify-between mb-4">
                     <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Identified Targets</span>
                     {step === 'results' && (
                         <div className="px-2 py-1 bg-red-500/10 border border-red-500/20 rounded text-[10px] text-red-400 font-bold flex items-center gap-1">
                             <ShieldAlert size={12} /> ROOT ACCESS GRANTED
                         </div>
                     )}
                 </div>
                 
                 <div className="flex-1 space-y-2 overflow-y-auto custom-scrollbar pr-2">
                     {apps.map((app, i) => {
                         const isSelected = selectedIds.includes(app.id);
                         const isDeleted = deletedIds.includes(app.id);
                         
                         return (
                            <div 
                                key={app.id}
                                onClick={() => step === 'results' && toggleSelect(app.id)}
                                className={`
                                    relative flex items-center justify-between p-3 rounded-lg border transition-all
                                    ${step === 'results' ? 'cursor-pointer hover:bg-white/5' : ''}
                                    ${isSelected ? 'bg-[#1a1a1a] border-blue-500/30' : 'bg-[#151515] border-transparent opacity-60'}
                                    ${isDeleted ? 'bg-red-500/5 border-red-500/10 opacity-50' : ''}
                                `}
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded bg-[#252525] flex items-center justify-center text-lg shadow-inner">
                                        <app.Icon size={20} className={isDeleted ? 'text-red-500' : 'text-gray-300'} />
                                    </div>
                                    <div>
                                        <div className="font-bold text-sm text-gray-200">{app.name}</div>
                                        <div className="text-[10px] text-gray-500 flex items-center gap-2">
                                            <span>{app.size}</span> • <span>{app.type}</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="text-right">
                                    {isDeleted ? (
                                        <span className="text-red-500 text-[10px] font-bold bg-red-500/10 px-2 py-1 rounded">REMOVED</span>
                                    ) : step === 'deleting' && isSelected ? (
                                        <Loader2 size={16} className="text-blue-500 animate-spin" />
                                    ) : (
                                        <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${isSelected ? 'bg-blue-600 border-blue-600' : 'border-gray-600'}`}>
                                            {isSelected && <Check size={12} className="text-white" />}
                                        </div>
                                    )}
                                </div>
                            </div>
                         );
                     })}
                 </div>

                 <div className="mt-4 pt-4 border-t border-white/5">
                     {step === 'results' ? (
                         <>
                             {selectedIds.includes('explorer') && (
                                <div className="bg-red-900/10 border border-red-900/30 p-3 rounded-lg mb-4 flex gap-3">
                                    <AlertTriangle size={18} className="text-red-500 shrink-0 mt-0.5" />
                                    <div>
                                        <h4 className="text-xs font-bold text-red-400 mb-0.5">Warning: System Instability Risk</h4>
                                        <p className="text-[10px] text-red-400/70 leading-relaxed">
                                            You have selected "File Explorer". Removing core system components will result in critical failure.
                                        </p>
                                    </div>
                                </div>
                             )}
                             <button 
                                onClick={startDelete}
                                disabled={selectedIds.length === 0}
                                className="w-full py-3 bg-red-600 hover:bg-red-500 disabled:opacity-50 disabled:hover:bg-red-600 rounded-lg text-sm font-bold text-white shadow-lg shadow-red-600/20 transition-all active:scale-[0.98]"
                             >
                                Confirm Uninstall ({selectedIds.length})
                             </button>
                         </>
                     ) : step === 'finished' ? (
                        <div className="flex flex-col gap-3">
                            <div className="bg-green-500/10 border border-green-500/20 p-3 rounded-lg flex items-center gap-3">
                                <Check size={18} className="text-green-500" />
                                <span className="text-xs text-green-400 font-bold">Uninstallation Completed Successfully</span>
                            </div>
                            <button onClick={onClose} className="w-full py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm text-white">
                                Close
                            </button>
                        </div>
                     ) : (
                         <div className="bg-[#0f0f0f] border border-white/5 rounded-lg p-3">
                             <div className="text-[10px] text-blue-400 font-mono mb-1">>_ {currentAction}</div>
                             <div className="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden">
                                 <motion.div 
                                    className="h-full bg-blue-500"
                                    initial={{ width: "0%" }}
                                    animate={{ width: "100%" }}
                                    transition={{ duration: 0.5, repeat: Infinity }}
                                 />
                             </div>
                         </div>
                     )}
                 </div>
             </motion.div>
         )}
         </AnimatePresence>
      </div>
    </div>
  );
};
