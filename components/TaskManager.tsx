
import React, { useState } from 'react';
import { X, Minus, Square, Activity, Layers, Cpu, HardDrive, Wifi, Settings, Play, Search, Menu, List, Clock, Users, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface TaskManagerProps {
  onClose: () => void;
  onRestoreExplorer: () => void;
}

export const TaskManager: React.FC<TaskManagerProps> = ({ onClose, onRestoreExplorer }) => {
  const [activeTab, setActiveTab] = useState('Processes');
  const [showRunTask, setShowRunTask] = useState(false);
  const [taskInput, setTaskInput] = useState('');
  const [isRestoring, setIsRestoring] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(false);

  const handleRunTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (taskInput.toLowerCase() === 'fileexplorer.exe') {
        setShowRunTask(false);
        setIsRestoring(true);
        // Load for 4 seconds as requested
        setTimeout(() => {
            onRestoreExplorer();
            setIsRestoring(false);
            onClose(); 
        }, 4000);
    } else {
        alert(`Windows cannot find '${taskInput}'. Make sure you typed the name correctly, and then try again.`);
    }
  };

  const NavItem = ({ id, icon: Icon, label }: { id: string, icon: any, label: string }) => (
      <button 
        onClick={() => setActiveTab(id)}
        className={`w-full flex items-center gap-3 px-2 py-2.5 rounded-md transition-colors ${activeTab === id ? 'bg-white shadow-sm text-blue-600' : 'text-gray-600 hover:bg-white/50'}`}
        title={!sidebarExpanded ? label : ''}
      >
          <Icon size={18} />
          {sidebarExpanded && <span className="text-sm font-medium">{label}</span>}
          {activeTab === id && sidebarExpanded && <div className="ml-auto w-1 h-4 bg-blue-600 rounded-full" />}
      </button>
  );

  return (
    <div className="flex flex-col h-full bg-[#f3f3f3] text-gray-900 font-sans select-none relative shadow-2xl rounded-lg overflow-hidden border border-gray-300">
       
       {/* Overlay for "Loading" if restoring */}
       {isRestoring && (
           <div className="absolute inset-0 z-50 bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center cursor-wait gap-6">
               <div className="relative">
                   <div className="w-12 h-12 border-4 border-blue-100 rounded-full" />
                   <div className="absolute inset-0 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
               </div>
               <div className="text-gray-900 font-medium">Starting FileExplorer.exe...</div>
           </div>
       )}

       {/* Title Bar */}
       <div className="h-10 flex items-center justify-between bg-[#f3f3f3] px-3 shrink-0" onPointerDown={(e) => e.stopPropagation()}>
          <div className="flex items-center gap-3">
             <div className="w-5 h-5 bg-gradient-to-br from-blue-500 to-teal-400 rounded-sm flex items-center justify-center shadow-sm">
                 <Activity size={12} className="text-white" />
             </div>
             <span className="text-xs font-medium text-gray-700">Task Manager</span>
          </div>
          <div className="flex items-center gap-1">
             <button className="p-2 hover:bg-gray-200 rounded-md transition-colors"><Minus size={14} className="text-gray-600" /></button>
             <button className="p-2 hover:bg-gray-200 rounded-md transition-colors"><Square size={12} className="text-gray-600" /></button>
             <button onClick={onClose} className="p-2 hover:bg-red-600 hover:text-white rounded-md text-gray-600 transition-colors"><X size={14} /></button>
          </div>
       </div>

       {/* Main Layout */}
       <div className="flex-1 flex overflow-hidden">
           {/* Sidebar */}
           <div className={`flex flex-col gap-1 p-2 transition-all duration-300 ${sidebarExpanded ? 'w-48' : 'w-12 items-center'}`}>
               <button onClick={() => setSidebarExpanded(!sidebarExpanded)} className="p-2 hover:bg-white/50 rounded-md mb-2 self-start text-gray-600">
                   <Menu size={18} />
               </button>
               
               <NavItem id="Processes" icon={List} label="Processes" />
               <NavItem id="Performance" icon={Activity} label="Performance" />
               <NavItem id="App history" icon={Clock} label="App history" />
               <NavItem id="Startup" icon={Play} label="Startup apps" />
               <NavItem id="Users" icon={Users} label="Users" />
               <NavItem id="Services" icon={Layers} label="Services" />
               
               <div className="mt-auto">
                   <NavItem id="Settings" icon={Settings} label="Settings" />
               </div>
           </div>

           {/* Content Area */}
           <div className="flex-1 bg-white m-2 ml-0 rounded-lg shadow-sm border border-gray-200 flex flex-col overflow-hidden">
               {/* Content Header */}
               <div className="h-14 flex items-center justify-between px-6 border-b border-gray-100 shrink-0">
                   <h2 className="text-lg font-semibold text-gray-800">{activeTab}</h2>
                   <div className="flex items-center gap-3">
                       <button 
                           onClick={() => setShowRunTask(true)} 
                           className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded shadow-sm transition-colors"
                       >
                           Run new task
                       </button>
                       <div className="relative">
                           <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                           <input 
                              type="text" 
                              placeholder={`Search ${activeTab}`}
                              className="pl-8 pr-3 py-1.5 bg-gray-50 border border-gray-200 rounded text-xs outline-none focus:border-blue-500 w-48 transition-all"
                           />
                       </div>
                   </div>
               </div>

               {/* Grid / Content */}
               <div className="flex-1 overflow-auto custom-scrollbar">
                   {activeTab === 'Processes' && (
                       <table className="w-full text-left border-collapse">
                           <thead className="sticky top-0 bg-white z-10 shadow-sm">
                               <tr className="text-xs text-gray-500 font-medium border-b border-gray-100">
                                   <th className="py-2 pl-6 font-normal w-[40%]">Name</th>
                                   <th className="py-2 font-normal w-[15%]">Status</th>
                                   <th className="py-2 font-normal w-[15%] text-right">CPU</th>
                                   <th className="py-2 font-normal w-[15%] text-right">Memory</th>
                                   <th className="py-2 font-normal w-[15%] text-right pr-6">Disk</th>
                               </tr>
                           </thead>
                           <tbody className="text-xs text-gray-700">
                               {[
                                   { name: 'Task Manager', status: 'Running', cpu: '0.1%', mem: '14.2 MB', disk: '0.1 MB/s', icon: Activity, color: 'text-blue-500' },
                                   { name: 'Desktop Window Manager', status: 'Running', cpu: '1.2%', mem: '45.0 MB', disk: '0 MB/s', icon: Layers, color: 'text-purple-500' },
                                   { name: 'Client Server Runtime Process', status: 'Running', cpu: '0.0%', mem: '1.4 MB', disk: '0 MB/s', icon: Settings, color: 'text-gray-500' },
                                   { name: 'Service Host: Local System', status: 'Running', cpu: '0.0%', mem: '2.1 MB', disk: '0 MB/s', icon: Layers, color: 'text-gray-500' },
                                   { name: 'System', status: 'Running', cpu: '0.1%', mem: '0.1 MB', disk: '0.5 MB/s', icon: Cpu, color: 'text-gray-500' },
                                   { name: 'Antimalware Service Executable', status: 'Running', cpu: '0.3%', mem: '120.5 MB', disk: '0 MB/s', icon: Shield, color: 'text-blue-500' },
                                   { name: 'Windows Explorer', status: 'Suspended', cpu: '0.0%', mem: '0 MB', disk: '0 MB/s', icon: HardDrive, color: 'text-yellow-500' },
                               ].map((p, i) => (
                                   <tr key={i} className="hover:bg-blue-50 transition-colors group">
                                       <td className="py-2 pl-6 flex items-center gap-3">
                                           <div className={`p-1 rounded bg-gray-50 group-hover:bg-white transition-colors`}>
                                               <p.icon size={14} className={p.color} />
                                           </div>
                                           <span className="font-medium text-gray-900">{p.name}</span>
                                       </td>
                                       <td className="py-2 text-gray-500">{p.status}</td>
                                       <td className={`py-2 text-right ${parseFloat(p.cpu) > 1 ? 'text-orange-600 font-medium' : ''}`}>{p.cpu}</td>
                                       <td className="py-2 text-right">{p.mem}</td>
                                       <td className="py-2 text-right pr-6 text-gray-400">{p.disk}</td>
                                   </tr>
                               ))}
                           </tbody>
                       </table>
                   )}
                   {activeTab !== 'Processes' && (
                       <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-2">
                           <Activity size={48} className="opacity-20" />
                           <p>No data available for {activeTab}</p>
                       </div>
                   )}
               </div>
           </div>
       </div>

       {/* Run Task Modal */}
       <AnimatePresence>
           {showRunTask && (
               <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-[2px]">
                   <motion.div 
                     initial={{ scale: 0.95, opacity: 0, y: 10 }}
                     animate={{ scale: 1, opacity: 1, y: 0 }}
                     exit={{ scale: 0.95, opacity: 0, y: 10 }}
                     className="bg-white rounded-lg shadow-2xl w-[420px] overflow-hidden border border-gray-200"
                     onClick={(e) => e.stopPropagation()}
                   >
                       <div className="px-5 py-4">
                           <h3 className="text-lg font-semibold text-gray-900 mb-1">Run new task</h3>
                           <p className="text-xs text-gray-500 mb-4">
                               Type the name of a program, folder, document, or Internet resource, and Windows will open it for you.
                           </p>

                           <div className="flex items-center gap-3 mb-4">
                               <label className="text-sm font-medium text-gray-700 w-12">Open:</label>
                               <div className="flex-1 relative">
                                   <input 
                                     autoFocus
                                     type="text" 
                                     value={taskInput}
                                     onChange={(e) => setTaskInput(e.target.value)}
                                     className="w-full border border-gray-300 rounded-[4px] px-3 py-1.5 text-sm text-black bg-white outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-inner"
                                     style={{ color: 'black' }} // Force black text
                                     onKeyDown={(e) => e.key === 'Enter' && handleRunTask(e)}
                                   />
                               </div>
                           </div>

                           <div className="flex items-center gap-2 mb-2">
                               <input type="checkbox" id="admin" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                               <label htmlFor="admin" className="text-xs text-gray-600 select-none">Create this task with administrative privileges.</label>
                           </div>
                       </div>

                       <div className="bg-gray-50 px-5 py-3 flex justify-end gap-2 border-t border-gray-100">
                           <button 
                                onClick={handleRunTask}
                                className="px-6 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-[4px] shadow-sm transition-colors"
                           >
                               OK
                           </button>
                           <button 
                                onClick={() => setShowRunTask(false)}
                                className="px-6 py-1.5 bg-white hover:bg-gray-100 border border-gray-300 text-gray-700 text-sm rounded-[4px] shadow-sm transition-colors"
                           >
                               Cancel
                           </button>
                           <button 
                                className="px-6 py-1.5 bg-white hover:bg-gray-100 border border-gray-300 text-gray-700 text-sm rounded-[4px] shadow-sm transition-colors"
                           >
                               Browse...
                           </button>
                       </div>
                   </motion.div>
               </div>
           )}
       </AnimatePresence>
    </div>
  );
};
