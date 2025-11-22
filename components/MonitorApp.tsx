
import React, { useState, useEffect, useMemo } from 'react';
import { Activity, Cpu, HardDrive, Wifi, Layers, Server, Zap, Search, ArrowUp, ArrowDown, Microchip } from 'lucide-react';

// --- Helper Hook for Simulated Data ---
const useSimulatedData = (initialValue: number, volatility: number = 10, min: number = 0, max: number = 100) => {
  const [value, setValue] = useState(initialValue);
  const [history, setHistory] = useState<number[]>(new Array(40).fill(initialValue));

  useEffect(() => {
    const interval = setInterval(() => {
      setValue(prev => {
        const change = (Math.random() - 0.5) * volatility;
        let next = prev + change;
        if (next < min) next = min;
        if (next > max) next = max;
        
        setHistory(h => [...h.slice(1), next]);
        return next;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [volatility, min, max]);

  return { value, history };
};

// --- Simple Graph Component ---
const LineGraph: React.FC<{ data: number[]; color: string; height?: number }> = ({ data, color, height = 60 }) => {
  const max = 100;
  const points = data.map((val, i) => {
    const x = (i / (data.length - 1)) * 100;
    const y = 100 - (val / max) * 100;
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="w-full overflow-hidden rounded bg-black/20 relative" style={{ height }}>
       {/* Grid lines */}
       <div className="absolute inset-0 flex flex-col justify-between opacity-20 pointer-events-none p-2">
          <div className="border-t border-dashed border-white/50 w-full h-px" />
          <div className="border-t border-dashed border-white/50 w-full h-px" />
          <div className="border-t border-dashed border-white/50 w-full h-px" />
       </div>
       <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full opacity-80">
          <defs>
            <linearGradient id={`gradient-${color}`} x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity="0.5" />
              <stop offset="100%" stopColor={color} stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={`M0,100 L0,${100 - (data[0]/max)*100} ${points.replace(/,/g, ' ')} L100,100 Z`} fill={`url(#gradient-${color})`} />
          <polyline points={points} fill="none" stroke={color} strokeWidth="2" vectorEffect="non-scaling-stroke" />
       </svg>
    </div>
  );
};

// --- Process List Data ---
const initialProcesses = [
  { name: 'ZimDex Browser', user: 'NgocAnn', cpu: 12.5, mem: 450, disk: 0.5, net: 2.1, icon: Activity },
  { name: 'System Kernel', user: 'SYSTEM', cpu: 4.2, mem: 120, disk: 12.0, net: 0.0, icon: Microchip },
  { name: 'Music Player', user: 'NgocAnn', cpu: 1.8, mem: 180, disk: 0.0, net: 0.5, icon: Layers },
  { name: 'Desktop Window Mgr', user: 'SYSTEM', cpu: 5.5, mem: 85, disk: 0.1, net: 0.0, icon: Server },
  { name: 'Node.js Runtime', user: 'NgocAnn', cpu: 0.2, mem: 60, disk: 0.0, net: 0.0, icon: Server },
  { name: 'Service Host', user: 'SYSTEM', cpu: 0.1, mem: 45, disk: 0.0, net: 0.0, icon: Layers },
  { name: 'Antimalware Exec', user: 'SYSTEM', cpu: 1.2, mem: 210, disk: 4.5, net: 0.1, icon: Activity },
  { name: 'Terminal', user: 'NgocAnn', cpu: 0.0, mem: 32, disk: 0.0, net: 0.0, icon: Layers },
  { name: 'Registry', user: 'SYSTEM', cpu: 0.0, mem: 12, disk: 0.0, net: 0.0, icon: Server },
];

export const MonitorApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'processes'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Simulated System Stats
  const cpu = useSimulatedData(15, 15);
  const mem = useSimulatedData(42, 5);
  const disk = useSimulatedData(5, 20);
  const net = useSimulatedData(20, 30);

  // Randomized Processes
  const processes = useMemo(() => {
     return initialProcesses.map(p => ({
       ...p,
       cpu: Math.max(0, p.cpu + (Math.random() - 0.5) * 2),
       mem: Math.max(10, p.mem + (Math.random() - 0.5) * 10)
     })).filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [cpu.value, searchTerm]); 

  const TabButton = ({ id, label, icon: Icon }: any) => (
    <button 
      onClick={() => setActiveTab(id)}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
        activeTab === id 
          ? 'bg-blue-600/20 text-blue-400' 
          : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'
      }`}
    >
      <Icon size={18} />
      {label}
    </button>
  );

  return (
    <div className="w-full h-full flex bg-[#111]/90 backdrop-blur-xl text-gray-100 font-sans overflow-hidden">
      {/* Sidebar */}
      <div className="w-56 border-r border-white/5 bg-black/20 flex flex-col p-4 gap-1">
        <div className="text-xs font-bold text-gray-500 uppercase tracking-wider px-3 mb-2">System Monitor</div>
        <TabButton id="overview" label="Overview" icon={Activity} />
        <TabButton id="processes" label="Processes" icon={Layers} />
        
        <div className="h-[1px] bg-white/5 my-2 mx-3" />
        
        <div className="mt-auto">
            <div className="bg-[#1a1a1a] rounded-lg p-3 border border-white/5">
                <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
                    <Server size={14} />
                    <span>Uptime</span>
                </div>
                <div className="text-lg font-mono font-medium text-white">
                    3:12:45
                </div>
            </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* Content View */}
        {activeTab === 'overview' && (
          <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">
             {/* CPU Section */}
             <div className="bg-[#1a1a1a]/80 border border-white/5 rounded-xl p-5">
                <div className="flex items-center justify-between mb-4">
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400">
                         <Cpu size={20} />
                      </div>
                      <div>
                         <h3 className="font-bold text-white">CPU</h3>
                         <div className="text-xs text-gray-400">Intel Core i9-14900K @ 6.0GHz</div>
                      </div>
                   </div>
                   <div className="text-right">
                      <div className="text-2xl font-mono font-bold text-blue-400">{cpu.value.toFixed(1)}%</div>
                      <div className="text-xs text-gray-500">Utilization</div>
                   </div>
                </div>
                <LineGraph data={cpu.history} color="#60a5fa" height={120} />
                <div className="grid grid-cols-4 gap-4 mt-4 pt-4 border-t border-white/5">
                    <div>
                        <div className="text-xs text-gray-500">Processes</div>
                        <div className="text-sm text-white font-medium">248</div>
                    </div>
                    <div>
                        <div className="text-xs text-gray-500">Threads</div>
                        <div className="text-sm text-white font-medium">3214</div>
                    </div>
                    <div>
                        <div className="text-xs text-gray-500">Handles</div>
                        <div className="text-sm text-white font-medium">115,420</div>
                    </div>
                    <div>
                        <div className="text-xs text-gray-500">Up Time</div>
                        <div className="text-sm text-white font-medium">0:03:12:45</div>
                    </div>
                </div>
             </div>

             {/* Memory Section */}
             <div className="bg-[#1a1a1a]/80 border border-white/5 rounded-xl p-5">
                <div className="flex items-center justify-between mb-4">
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-400">
                         <Microchip size={20} />
                      </div>
                      <div>
                         <h3 className="font-bold text-white">Memory</h3>
                         <div className="text-xs text-gray-400">64 GB DDR5</div>
                      </div>
                   </div>
                   <div className="text-right">
                      <div className="text-2xl font-mono font-bold text-purple-400">{mem.value.toFixed(1)}%</div>
                      <div className="text-xs text-gray-500">{(mem.value * 0.64).toFixed(1)} GB Used</div>
                   </div>
                </div>
                <LineGraph data={mem.history} color="#a855f7" height={80} />
                
                <div className="mt-4 space-y-2">
                   <div className="flex justify-between text-xs text-gray-400">
                       <span>In Use (Compressed)</span>
                       <span>Available</span>
                   </div>
                   <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden flex">
                       <div className="h-full bg-purple-500" style={{ width: `${mem.value}%` }} />
                       <div className="h-full bg-gray-700" style={{ width: `${100 - mem.value}%` }} />
                   </div>
                </div>
             </div>

             <div className="grid grid-cols-2 gap-6">
                {/* Disk Section */}
                <div className="bg-[#1a1a1a]/80 border border-white/5 rounded-xl p-5">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center text-green-400">
                            <HardDrive size={20} />
                        </div>
                        <div>
                            <h3 className="font-bold text-white">Disk (C:)</h3>
                            <div className="text-xs text-gray-400">NVMe SSD</div>
                        </div>
                         <div className="ml-auto text-right">
                            <div className="text-xl font-mono font-bold text-green-400">{disk.value.toFixed(1)}%</div>
                         </div>
                    </div>
                    <LineGraph data={disk.history} color="#10b981" height={60} />
                </div>

                {/* Network Section */}
                <div className="bg-[#1a1a1a]/80 border border-white/5 rounded-xl p-5">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-lg bg-yellow-500/20 flex items-center justify-center text-yellow-400">
                            <Wifi size={20} />
                        </div>
                        <div>
                            <h3 className="font-bold text-white">Wi-Fi</h3>
                            <div className="text-xs text-gray-400">ZimDex-5G</div>
                        </div>
                         <div className="ml-auto text-right">
                            <div className="text-xl font-mono font-bold text-yellow-400">{net.value.toFixed(1)} Kbps</div>
                         </div>
                    </div>
                    <LineGraph data={net.history} color="#f59e0b" height={60} />
                </div>
             </div>
          </div>
        )}

        {activeTab === 'processes' && (
          <div className="flex-1 flex flex-col">
             {/* Header for table */}
             <div className="flex items-center px-6 py-3 border-b border-white/5 text-xs text-gray-400 font-medium uppercase tracking-wider bg-[#151515]">
                 <div className="flex-1">Name</div>
                 <div className="w-24">User</div>
                 <div className="w-20 text-right">CPU</div>
                 <div className="w-20 text-right">Memory</div>
                 <div className="w-20 text-right">Disk</div>
                 <div className="w-20 text-right">Network</div>
             </div>
             {/* List */}
             <div className="flex-1 overflow-y-auto custom-scrollbar">
                 {processes.map((p, i) => (
                     <div key={i} className="flex items-center px-6 py-3 border-b border-white/5 hover:bg-white/5 transition-colors text-sm">
                         <div className="flex-1 flex items-center gap-3">
                             <div className="w-8 h-8 rounded bg-white/5 flex items-center justify-center text-gray-400">
                                 <p.icon size={16} />
                             </div>
                             <span className="text-white font-medium">{p.name}</span>
                         </div>
                         <div className="w-24 text-gray-400">{p.user}</div>
                         <div className="w-20 text-right text-white">{p.cpu.toFixed(1)}%</div>
                         <div className="w-20 text-right text-gray-300">{Math.round(p.mem)} MB</div>
                         <div className="w-20 text-right text-gray-400">{p.disk.toFixed(1)} MB/s</div>
                         <div className="w-20 text-right text-gray-400">{p.net.toFixed(1)} Mbps</div>
                     </div>
                 ))}
             </div>
          </div>
        )}
      </div>
    </div>
  );
};
