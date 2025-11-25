
import React, { useState, useRef } from 'react';
import { ArrowLeft, ArrowRight, RotateCw, Home, Star, Search, Plus, X, Globe, Lock } from 'lucide-react';

export const BrowserApp: React.FC = () => {
  const [url, setUrl] = useState('https://en.wikipedia.org/wiki/Special:Random');
  const [inputUrl, setInputUrl] = useState(url);
  const [isLoading, setIsLoading] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const [tabs, setTabs] = useState([
    { id: 1, title: 'New Tab', active: false, icon: Globe },
    { id: 2, title: 'Wikipedia', active: true, icon: Globe },
  ]);

  const handleNavigate = (e: React.FormEvent) => {
    e.preventDefault();
    let target = inputUrl;
    
    if (!target.startsWith('http')) {
       target = `https://www.bing.com/search?q=${encodeURIComponent(target)}`;
    }
    
    setUrl(target);
    setIsLoading(true);
  };

  const handleRefresh = () => {
    if (iframeRef.current) {
      iframeRef.current.src = iframeRef.current.src;
      setIsLoading(true);
    }
  };

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  return (
    <div className="w-full h-full flex flex-col bg-gray-50/95 dark:bg-[#1e1e24]/90 backdrop-blur-xl text-gray-800 dark:text-gray-200 font-sans overflow-hidden rounded-b-xl transition-colors duration-300">
      {/* Tabs Strip */}
      <div className="h-10 bg-gray-200/80 dark:bg-[#0a0a0c]/80 flex items-end px-2 gap-1 pt-2 select-none drag-handle transition-colors">
         {tabs.map(tab => (
             <div 
                key={tab.id}
                className={`
                   group relative flex items-center gap-2 px-3 py-1.5 rounded-t-lg text-xs max-w-[200px] flex-1 cursor-default transition-colors
                   ${tab.active ? 'bg-white dark:bg-[#2a2e35]/90 text-gray-900 dark:text-white shadow-sm' : 'bg-transparent text-gray-600 dark:text-gray-500 hover:bg-gray-300/50 dark:hover:bg-[#1a1d21]/50 hover:text-gray-800 dark:hover:text-gray-300'}
                `}
             >
                <tab.icon size={12} />
                <span className="truncate">{tab.title}</span>
                <button className="ml-auto p-0.5 rounded-md hover:bg-black/10 dark:hover:bg-white/10 opacity-0 group-hover:opacity-100 transition-all">
                    <X size={10} />
                </button>
             </div>
         ))}
         <button className="p-1.5 text-gray-500 hover:text-black dark:hover:text-white hover:bg-black/10 dark:hover:bg-white/10 rounded-md ml-1 transition-colors">
             <Plus size={14} />
         </button>
      </div>

      {/* Navigation Bar */}
      <div className="h-12 bg-white dark:bg-[#2a2e35]/90 flex items-center px-4 gap-3 border-b border-gray-200 dark:border-white/5 shadow-sm z-10 transition-colors">
          <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
             <button className="p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/5 hover:text-black dark:hover:text-white transition-colors disabled:opacity-30"><ArrowLeft size={16} /></button>
             <button className="p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/5 hover:text-black dark:hover:text-white transition-colors disabled:opacity-30"><ArrowRight size={16} /></button>
             <button onClick={handleRefresh} className="p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/5 hover:text-black dark:hover:text-white transition-colors">
                 <RotateCw size={16} className={isLoading ? "animate-spin" : ""} />
             </button>
             <button onClick={() => setUrl('https://www.bing.com')} className="p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/5 hover:text-black dark:hover:text-white transition-colors"><Home size={16} /></button>
          </div>

          {/* Omnibox */}
          <form onSubmit={handleNavigate} className="flex-1">
             <div className="bg-gray-100 dark:bg-[#15171a] border border-gray-300 dark:border-white/10 rounded-full h-8 flex items-center px-3 text-sm focus-within:border-blue-500/50 focus-within:shadow-[0_0_0_2px_rgba(59,130,246,0.1)] transition-all">
                <Lock size={12} className="text-green-600 dark:text-green-500 mr-2" />
                <input 
                  type="text" 
                  value={inputUrl}
                  onChange={(e) => setInputUrl(e.target.value)}
                  className="flex-1 bg-transparent outline-none text-gray-900 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-600"
                  placeholder="Search or enter website name"
                />
                <button type="button" className="text-gray-400 hover:text-yellow-500 transition-colors"><Star size={14} /></button>
             </div>
          </form>

          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xs shadow-lg">
              Z
          </div>
      </div>

      {/* Web Content */}
      <div className="flex-1 bg-white relative">
          {isLoading && (
              <div className="absolute top-0 left-0 w-full h-1 bg-blue-500/20 overflow-hidden z-20">
                  <div className="h-full bg-blue-500 animate-progress-indeterminate" />
              </div>
          )}
          <iframe 
             ref={iframeRef}
             src={url}
             title="Browser Viewport"
             className="w-full h-full border-none bg-white"
             sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
             onLoad={handleIframeLoad}
          />
      </div>
    </div>
  );
};
