
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Send, Video, Film, AlertCircle, Loader2, PlayCircle, Clock, Key, ExternalLink, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

interface Message {
  role: 'user' | 'model';
  text?: string;
  videoUri?: string;
}

export const LiminalVideoApp: React.FC = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: 'Veo Motion Engine online. Describe the scene you wish to animate.' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [hasKey, setHasKey] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Check for API Key Selection on Mount
  useEffect(() => {
    const checkKey = async () => {
      const win = window as any;
      if (win.aistudio && win.aistudio.hasSelectedApiKey) {
        const selected = await win.aistudio.hasSelectedApiKey();
        setHasKey(selected);
      } else {
        // Fallback for dev environments without the studio bridge
        setHasKey(!!process.env.API_KEY);
      }
    };
    checkKey();
  }, []);

  const handleSelectKey = async () => {
    const win = window as any;
    if (win.aistudio && win.aistudio.openSelectKey) {
      await win.aistudio.openSelectKey();
      // Mitigate race condition: Assume success immediately
      setHasKey(true);
    }
  };

  const handleGenerate = async () => {
    if (!input.trim() || isLoading) return;

    const prompt = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: prompt }]);
    setIsLoading(true);
    setError(null);
    setStatusMsg('Initializing temporal synthesis...');

    try {
      // Always create a new instance to get the latest key from the environment
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      setStatusMsg('Sending instructions to Veo model...');

      // Start Video Generation Operation
      let operation = await ai.models.generateVideos({
        model: 'veo-3.1-fast-generate-preview',
        prompt: prompt,
        config: {
            numberOfVideos: 1,
            resolution: '720p',
            aspectRatio: '16:9'
        }
      });

      setStatusMsg('Rendering frames (this may take a minute)...');
      
      // Polling Loop
      while (!operation.done) {
          await new Promise(resolve => setTimeout(resolve, 5000)); // Poll every 5s
          operation = await ai.operations.getVideosOperation({ operation: operation });
          setStatusMsg((prev) => prev === 'Rendering frames...' ? 'Processing physics...' : 'Rendering frames...');
      }

      const videoUri = operation.response?.generatedVideos?.[0]?.video?.uri;
      
      if (videoUri) {
          // Append key for viewing protected content
          const fetchUrl = `${videoUri}&key=${process.env.API_KEY}`;
          setMessages(prev => [...prev, { role: 'model', videoUri: fetchUrl }]);
      } else {
          throw new Error("Video generation completed but no URI was returned.");
      }

    } catch (err: any) {
      console.error(err);
      
      // Handle "Requested entity was not found" (404) by resetting key selection
      if (err.message && (err.message.includes('Requested entity was not found') || err.message.includes('404'))) {
          setHasKey(false);
          setError("Access denied. Please select a valid paid API Key to continue.");
      } else {
          setError(err.message || "Motion synthesis failed.");
          setMessages(prev => [...prev, { role: 'model', text: `Error: ${err.message || "Unknown error."}` }]);
      }
    } finally {
      setIsLoading(false);
      setStatusMsg('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleGenerate();
    }
  };

  if (!hasKey) {
      return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-[#0c0a08]/95 backdrop-blur-2xl text-gray-200 p-8 text-center space-y-6 border border-orange-900/30 relative overflow-hidden">
            {/* Background Ambient */}
            <div className="absolute inset-0 pointer-events-none">
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-orange-600/10 rounded-full blur-[100px]" />
                 <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 mix-blend-overlay" />
            </div>

            <div className="relative z-10 bg-[#1c1917] p-8 rounded-2xl border border-orange-500/20 shadow-2xl max-w-md w-full">
                <div className="w-16 h-16 rounded-full bg-orange-900/30 flex items-center justify-center mx-auto mb-6 border border-orange-500/30">
                    <Lock size={32} className="text-orange-500" />
                </div>
                
                <h2 className="text-2xl font-bold text-white mb-2">Authentication Required</h2>
                <p className="text-gray-400 text-sm mb-8 leading-relaxed">
                    Accessing the <strong>Veo-3.1 Motion Engine</strong> requires a verified API key from a paid Google Cloud Project.
                </p>

                <button 
                    onClick={handleSelectKey}
                    className="w-full py-3 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-lg transition-all shadow-lg shadow-orange-600/20 flex items-center justify-center gap-2 mb-4"
                >
                    <Key size={18} />
                    Select API Key
                </button>

                <a 
                    href="https://ai.google.dev/gemini-api/docs/billing" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 text-xs text-orange-400/80 hover:text-orange-400 hover:underline transition-colors"
                >
                    View Billing Documentation <ExternalLink size={10} />
                </a>
                
                {error && (
                    <div className="mt-6 p-3 bg-red-900/20 border border-red-900/50 rounded text-xs text-red-400 flex items-center gap-2">
                        <AlertCircle size={14} />
                        {error}
                    </div>
                )}
            </div>
        </div>
      );
  }

  return (
    <div className="w-full h-full flex flex-col bg-[#0c0a08]/90 backdrop-blur-2xl text-gray-200 font-sans overflow-hidden relative border border-orange-900/20">
      {/* Background FX */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
         <div className="absolute top-[-10%] left-[40%] w-[600px] h-[600px] bg-orange-600/10 rounded-full blur-[120px]" />
         <div className="absolute bottom-[-20%] left-[-10%] w-[400px] h-[400px] bg-red-600/10 rounded-full blur-[100px]" />
         <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 mix-blend-overlay" />
      </div>

      {/* Header */}
      <div className="h-14 border-b border-white/5 flex items-center justify-between px-6 bg-white/5 backdrop-blur-md z-10">
        <div className="flex items-center gap-3">
           <div className="relative">
             <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-orange-600 to-red-500 flex items-center justify-center shadow-[0_0_15px_rgba(234,88,12,0.3)]">
                <Video size={16} className="text-white" />
             </div>
             <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-[#0c0a08]" />
           </div>
           <div>
             <h2 className="font-bold text-sm text-white tracking-wide">LIMINAL <span className="font-light text-orange-400">VIDEO</span></h2>
             <div className="text-[10px] text-gray-500 font-mono uppercase tracking-wider">VEO-3.1 PREVIEW // ONLINE</div>
           </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8 relative z-0">
        {messages.map((msg, idx) => (
           <motion.div 
             key={idx}
             initial={{ opacity: 0, y: 10 }}
             animate={{ opacity: 1, y: 0 }}
             className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
           >
             {msg.role === 'user' ? (
                 <div className="max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed shadow-lg backdrop-blur-sm bg-gradient-to-br from-orange-600/20 to-red-600/20 border border-orange-500/30 text-white rounded-tr-sm">
                   {msg.text}
                 </div>
             ) : (
                 <div className="max-w-[90%]">
                    {msg.videoUri ? (
                        <div className="relative group rounded-xl overflow-hidden border border-white/10 shadow-2xl bg-black/50">
                            <video 
                                src={msg.videoUri} 
                                controls 
                                autoPlay 
                                loop
                                className="w-full h-auto max-w-lg object-cover rounded-lg" 
                            />
                            <div className="flex items-center gap-2 p-2 bg-black/40 backdrop-blur-sm absolute top-2 left-2 rounded-lg border border-white/5">
                                <Film size={14} className="text-orange-400" />
                                <span className="text-[10px] font-mono text-white/80">GENERATED_VEO_CLIP.MP4</span>
                            </div>
                        </div>
                    ) : (
                        <div className="p-4 rounded-2xl text-sm leading-relaxed shadow-lg backdrop-blur-sm bg-white/5 border border-white/10 text-gray-200 rounded-tl-sm flex items-start gap-3">
                            <div className="mt-1 text-orange-500"><PlayCircle size={16} /></div>
                            <div>{msg.text}</div>
                        </div>
                    )}
                 </div>
             )}
           </motion.div>
        ))}
        
        {isLoading && (
           <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
               <div className="bg-white/5 border border-white/10 px-4 py-3 rounded-2xl rounded-tl-sm flex items-center gap-3">
                   <Loader2 size={16} className="text-orange-400 animate-spin" />
                   <div className="flex flex-col">
                       <span className="text-xs text-orange-400/90 font-mono">Generating frames...</span>
                       <span className="text-[10px] text-gray-500 flex items-center gap-1"><Clock size={8} /> {statusMsg}</span>
                   </div>
               </div>
           </motion.div>
        )}

        {error && (
           <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-center">
              <div className="bg-red-500/10 border border-red-500/20 px-4 py-2 rounded-lg flex items-center gap-2 text-red-400 text-xs">
                 <AlertCircle size={14} /> {error}
              </div>
           </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-[#0c0a08]/80 border-t border-white/5 relative z-20">
         <div className="relative flex items-center gap-3 bg-[#1c1917] border border-white/10 rounded-xl px-4 py-3 focus-within:border-orange-500/50 focus-within:shadow-[0_0_20px_rgba(249,115,22,0.1)] transition-all">
            <Film size={18} className={`text-gray-500 transition-colors ${isLoading ? 'text-orange-400 animate-pulse' : ''}`} />
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Describe a video to generate (e.g., A neon cyberpunk city in rain)..."
              className="flex-1 bg-transparent outline-none text-white placeholder-gray-600 text-sm font-medium"
              disabled={isLoading}
              autoFocus
            />
            <button 
               onClick={handleGenerate}
               disabled={isLoading || !input.trim()}
               className="p-2 rounded-lg bg-orange-600 hover:bg-orange-500 disabled:opacity-50 disabled:hover:bg-orange-600 text-white transition-all shadow-lg shadow-orange-600/20"
            >
               {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
            </button>
         </div>
         <div className="text-center mt-2">
            <span className="text-[9px] text-gray-600 font-mono">POWERED BY GOOGLE VEO • VIDEO GENERATION PREVIEW</span>
         </div>
      </div>
    </div>
  );
};
