
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { Send, Cpu, Sparkles, AlertCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  role: 'user' | 'model';
  text: string;
  isTyping?: boolean;
}

export const LiminalAIApp: React.FC = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: 'Liminal Protocol engaged. I am ready to assist you.' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const chatSessionRef = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Auto-scroll to bottom
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const initializeChat = () => {
    try {
      // ROBUST API KEY RETRIEVAL
      // This prevents crashes if 'process' is undefined in browser
      let apiKey = '';
      const win = window as any;
      
      // Check window.process (shim)
      if (win.process && win.process.env && win.process.env.API_KEY) {
        apiKey = win.process.env.API_KEY;
      }
      
      // Check global process if safe
      if (!apiKey) {
        try {
            if (typeof process !== 'undefined' && process.env && process.env.API_KEY) {
                apiKey = process.env.API_KEY;
            }
        } catch (e) {
            // ignore reference errors
        }
      }
      
      if (!apiKey) {
        console.warn("API Key missing. Please set process.env.API_KEY or window.process.env.API_KEY");
        setError("Neural link severed. API Configuration missing. (Check Console)");
        return;
      }
      
      const ai = new GoogleGenAI({ apiKey });
      chatSessionRef.current = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
            systemInstruction: "You are Liminal, a highly advanced, slightly enigmatic AI embedded within the ZimDex OS. You are helpful, concise, and have a dry, witty personality. You prefer cyberpunk or tech metaphors."
        }
      });
    } catch (err: any) {
      console.error("Failed to initialize AI", err);
      setError(`Neural link severed. Init Failed: ${err.message}`);
    }
  };

  useEffect(() => {
    initializeChat();
  }, []);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);
    setError(null);

    try {
      if (!chatSessionRef.current) {
         // Try to re-init if failed previously
         initializeChat();
         if (!chatSessionRef.current) throw new Error("AI Service Unavailable (Check API Key)");
      }

      // Add placeholder for streaming response
      setMessages(prev => [...prev, { role: 'model', text: '', isTyping: true }]);

      const result = await chatSessionRef.current.sendMessageStream({ message: userMessage });
      
      let fullText = '';
      
      for await (const chunk of result) {
        const c = chunk as GenerateContentResponse;
        const text = c.text || '';
        fullText += text;
        
        setMessages(prev => {
            const newArr = [...prev];
            const lastMsg = newArr[newArr.length - 1];
            if (lastMsg.role === 'model' && lastMsg.isTyping) {
                lastMsg.text = fullText;
            }
            return newArr;
        });
      }
      
      // Finalize
      setMessages(prev => {
        const newArr = [...prev];
        const lastMsg = newArr[newArr.length - 1];
        if (lastMsg.role === 'model') {
            lastMsg.isTyping = false;
        }
        return newArr;
      });

    } catch (err: any) {
      console.error(err);
      setMessages(prev => {
          // Remove the typing placeholder if it exists
          const newArr = [...prev];
          if (newArr.length > 0 && newArr[newArr.length - 1].isTyping) {
              newArr.pop();
          }
          return newArr;
      });
      setError("Connection interrupted. The void is silent.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#050508]/80 backdrop-blur-2xl text-gray-200 font-sans overflow-hidden relative">
      {/* Background FX */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
         <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[100px]" />
         <div className="absolute bottom-[-20%] left-[-10%] w-[400px] h-[400px] bg-cyan-600/10 rounded-full blur-[80px]" />
         <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 mix-blend-overlay" />
      </div>

      {/* Header */}
      <div className="h-14 border-b border-white/5 flex items-center justify-between px-6 bg-white/5 backdrop-blur-md z-10">
        <div className="flex items-center gap-3">
           <div className="relative">
             <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 to-cyan-400 flex items-center justify-center shadow-[0_0_15px_rgba(147,51,234,0.3)]">
                <Sparkles size={16} className="text-white" />
             </div>
             <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-[#050508]" />
           </div>
           <div>
             <h2 className="font-bold text-sm text-white tracking-wide">LIMINAL <span className="font-light text-purple-400">AI</span></h2>
             <div className="text-[10px] text-gray-500 font-mono uppercase tracking-wider">v2.5-FLASH // ONLINE</div>
           </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6 relative z-0">
        {messages.map((msg, idx) => (
           <motion.div 
             key={idx}
             initial={{ opacity: 0, y: 10 }}
             animate={{ opacity: 1, y: 0 }}
             className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
           >
             <div className={`
                max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed shadow-lg backdrop-blur-sm
                ${msg.role === 'user' 
                   ? 'bg-gradient-to-br from-purple-600/20 to-blue-600/20 border border-purple-500/30 text-white rounded-tr-sm' 
                   : 'bg-white/5 border border-white/10 text-gray-200 rounded-tl-sm'}
             `}>
               {msg.text}
               {msg.isTyping && (
                  <span className="inline-block w-1.5 h-4 ml-1 align-middle bg-purple-400 animate-pulse" />
               )}
             </div>
           </motion.div>
        ))}
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
         <div className="relative flex items-center gap-3 bg-[#1a1a1d] border border-white/10 rounded-xl px-4 py-3 focus-within:border-purple-500/50 focus-within:shadow-[0_0_20px_rgba(168,85,247,0.1)] transition-all">
            <Cpu size={18} className={`text-gray-500 transition-colors ${isLoading ? 'text-purple-400 animate-pulse' : ''}`} />
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Query the Liminal Neural Net..."
              className="flex-1 bg-transparent outline-none text-white placeholder-gray-600 text-sm font-medium"
              disabled={isLoading}
              autoFocus
            />
            <button 
               onClick={handleSend}
               disabled={isLoading || !input.trim()}
               className="p-2 rounded-lg bg-purple-600 hover:bg-purple-500 disabled:opacity-50 disabled:hover:bg-purple-600 text-white transition-all shadow-lg shadow-purple-600/20"
            >
               {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
            </button>
         </div>
         <div className="text-center mt-2">
            <span className="text-[9px] text-gray-600 font-mono">POWERED BY GOOGLE GEMINI • ENCRYPTED CONNECTION</span>
         </div>
      </div>
    </div>
  );
};
