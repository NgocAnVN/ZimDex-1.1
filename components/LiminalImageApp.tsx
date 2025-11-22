
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Send, Image as ImageIcon, Sparkles, AlertCircle, Loader2, Download, Maximize2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface Message {
  role: 'user' | 'model';
  text?: string;
  imageUrl?: string;
}

export const LiminalImageApp: React.FC = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: 'Visual Cortex linked. Describe the imagery you wish to manifest.' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleGenerate = async () => {
    if (!input.trim() || isLoading) return;

    const prompt = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: prompt }]);
    setIsLoading(true);
    setError(null);

    try {
      // Use process.env.API_KEY directly as per strict guidelines
      const apiKey = process.env.API_KEY;
      
      if (!apiKey) {
        throw new Error("API Key missing in environment variables.");
      }

      const ai = new GoogleGenAI({ apiKey });
      
      // Using gemini-2.5-flash-image for standard generation
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
            parts: [{ text: prompt }]
        }
      });

      let generatedImage = null;
      
      // Iterate through parts to find the image
      if (response.candidates && response.candidates[0].content.parts) {
          for (const part of response.candidates[0].content.parts) {
              if (part.inlineData) {
                  generatedImage = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
                  break;
              }
          }
      }

      if (generatedImage) {
          setMessages(prev => [...prev, { role: 'model', imageUrl: generatedImage }]);
      } else {
           const text = response.text || "Generation failed. The void refused to visualize this request.";
           setMessages(prev => [...prev, { role: 'model', text: text }]);
      }

    } catch (err: any) {
      console.error(err);
      const errorMessage = err.message || "Visual synthesis failed.";
      setError(errorMessage);
      setMessages(prev => [...prev, { role: 'model', text: `Error: ${errorMessage}` }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleGenerate();
    }
  };

  const handleDownload = (dataUrl: string) => {
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `liminal-artifact-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#080a0c]/90 backdrop-blur-2xl text-gray-200 font-sans overflow-hidden relative border border-cyan-900/20">
      {/* Background FX */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
         <div className="absolute top-[-20%] left-[20%] w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[100px]" />
         <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-teal-600/10 rounded-full blur-[80px]" />
         <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 mix-blend-overlay" />
      </div>

      {/* Header */}
      <div className="h-14 border-b border-white/5 flex items-center justify-between px-6 bg-white/5 backdrop-blur-md z-10">
        <div className="flex items-center gap-3">
           <div className="relative">
             <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-600 to-teal-400 flex items-center justify-center shadow-[0_0_15px_rgba(8,145,178,0.3)]">
                <ImageIcon size={16} className="text-white" />
             </div>
             <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-[#080a0c]" />
           </div>
           <div>
             <h2 className="font-bold text-sm text-white tracking-wide">LIMINAL <span className="font-light text-cyan-400">VISUALIZER</span></h2>
             <div className="text-[10px] text-gray-500 font-mono uppercase tracking-wider">GEMINI-2.5-FLASH-IMAGE</div>
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
                 <div className="max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed shadow-lg backdrop-blur-sm bg-gradient-to-br from-cyan-600/20 to-blue-600/20 border border-cyan-500/30 text-white rounded-tr-sm">
                   {msg.text}
                 </div>
             ) : (
                 <div className="max-w-[80%]">
                    {msg.imageUrl ? (
                        <div className="relative group rounded-xl overflow-hidden border border-white/10 shadow-2xl bg-black/50">
                            <img src={msg.imageUrl} alt="Generated content" className="w-full h-auto max-w-md object-cover" />
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 backdrop-blur-sm">
                                <button 
                                  onClick={() => msg.imageUrl && handleDownload(msg.imageUrl)}
                                  className="p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-transform hover:scale-110 border border-white/10"
                                  title="Download"
                                >
                                    <Download size={20} />
                                </button>
                                <button className="p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-transform hover:scale-110 border border-white/10">
                                    <Maximize2 size={20} />
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="p-4 rounded-2xl text-sm leading-relaxed shadow-lg backdrop-blur-sm bg-white/5 border border-white/10 text-gray-200 rounded-tl-sm">
                            {msg.text}
                        </div>
                    )}
                 </div>
             )}
           </motion.div>
        ))}
        
        {isLoading && (
           <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
               <div className="bg-white/5 border border-white/10 px-4 py-3 rounded-2xl rounded-tl-sm flex items-center gap-3">
                   <Loader2 size={16} className="text-cyan-400 animate-spin" />
                   <span className="text-xs text-cyan-400/80 font-mono">Synthesizing pixels...</span>
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
      <div className="p-4 bg-[#0a0a0c]/80 border-t border-white/5 relative z-20">
         <div className="relative flex items-center gap-3 bg-[#15171a] border border-white/10 rounded-xl px-4 py-3 focus-within:border-cyan-500/50 focus-within:shadow-[0_0_20px_rgba(6,182,212,0.1)] transition-all">
            <Sparkles size={18} className={`text-gray-500 transition-colors ${isLoading ? 'text-cyan-400 animate-pulse' : ''}`} />
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Describe an image to generate..."
              className="flex-1 bg-transparent outline-none text-white placeholder-gray-600 text-sm font-medium"
              disabled={isLoading}
              autoFocus
            />
            <button 
               onClick={handleGenerate}
               disabled={isLoading || !input.trim()}
               className="p-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 disabled:hover:bg-cyan-600 text-white transition-all shadow-lg shadow-cyan-600/20"
            >
               {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
            </button>
         </div>
         <div className="text-center mt-2">
            <span className="text-[9px] text-gray-600 font-mono">POWERED BY GEMINI 2.5 • IMAGE GENERATION MODEL</span>
         </div>
      </div>
    </div>
  );
};
