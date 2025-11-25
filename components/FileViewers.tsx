
import React, { useState, useRef, useEffect } from 'react';
import { FileText, Save, X, ZoomIn, ZoomOut, Music, Video, Info, Sliders, Sparkles, RotateCw, Check, Undo, Download, Loader2, Wand2, Image as ImageIcon } from 'lucide-react';
import { FileSystemNode } from '../types';
import { GoogleGenAI } from "@google/genai";
import { motion, AnimatePresence } from 'framer-motion';

// --- Helper: Convert Blob to Base64 ---
const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

// --- Text / Code Editor ---
export const TextEditor = ({ file, onSave }: { file: FileSystemNode, onSave: (id: string, content: string) => void }) => {
  const [content, setContent] = useState(file.content || '');
  const [isDirty, setIsDirty] = useState(false);

  const handleSave = () => {
    onSave(file.id, content);
    setIsDirty(false);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full h-full bg-[#1e1e1e] flex flex-col"
    >
      {/* Toolbar */}
      <div className="h-10 bg-[#2d2d2d] flex items-center justify-between px-4 border-b border-black/20 shrink-0">
        <div className="flex items-center gap-2">
          <FileText size={14} className="text-blue-400" />
          <span className="text-sm text-gray-300 font-mono">{file.name} {isDirty && '*'}</span>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={handleSave} 
            className={`p-1.5 rounded flex items-center gap-2 text-xs transition-colors ${isDirty ? 'bg-blue-600 text-white' : 'hover:bg-white/10 text-gray-300'}`}
            title="Save (Ctrl+S)"
          >
            <Save size={14} />
            Save
          </button>
        </div>
      </div>
      {/* Editor Area */}
      <textarea 
        className="flex-1 bg-[#1e1e1e] text-gray-300 p-4 outline-none font-mono text-sm resize-none custom-scrollbar"
        value={content}
        onChange={(e) => { setContent(e.target.value); setIsDirty(true); }}
        spellCheck={false}
        onKeyDown={(e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 's') {
                e.preventDefault();
                handleSave();
            }
        }}
      />
      {/* Status Bar */}
      <div className="h-6 bg-[#007acc] text-white text-[10px] flex items-center px-3 gap-4 shrink-0">
          <span>Ln {content.split('\n').length}, Col 1</span>
          <span>UTF-8</span>
          <span>{file.type === 'code' ? 'TypeScript' : 'Plain Text'}</span>
      </div>
    </motion.div>
  );
};

// --- Image Viewer & Editor ---
interface EditState {
  brightness: number;
  contrast: number;
  saturation: number;
  blur: number;
  grayscale: number;
  sepia: number;
  hueRotate: number;
  invert: number;
}

const DEFAULT_EDITS: EditState = {
  brightness: 100,
  contrast: 100,
  saturation: 100,
  blur: 0,
  grayscale: 0,
  sepia: 0,
  hueRotate: 0,
  invert: 0,
};

export const ImageViewer = ({ file, onSave }: { file: FileSystemNode, onSave?: (id: string, content: string) => void }) => {
  const [scale, setScale] = useState(1);
  const [isEditing, setIsEditing] = useState(false);
  const [edits, setEdits] = useState<EditState>(DEFAULT_EDITS);
  const [imageSrc, setImageSrc] = useState(file.content || '');
  const [activeToolTab, setActiveToolTab] = useState<'adjust' | 'filters' | 'ai'>('adjust');
  
  // AI State
  const [aiPrompt, setAiPrompt] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  const imgRef = useRef<HTMLImageElement>(null);

  // Apply edits to a temporary canvas and return DataURL
  const processImageToDataUrl = async (): Promise<string> => {
    if (!imgRef.current) return imageSrc;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return imageSrc;

    const img = imgRef.current;
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;

    // Apply filters
    const filterString = `
      brightness(${edits.brightness}%) 
      contrast(${edits.contrast}%) 
      saturate(${edits.saturation}%) 
      blur(${edits.blur}px)
      grayscale(${edits.grayscale}%)
      sepia(${edits.sepia}%)
      hue-rotate(${edits.hueRotate}deg)
      invert(${edits.invert}%)
    `;
    
    ctx.filter = filterString;
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    
    return canvas.toDataURL('image/png');
  };

  const handleSaveEdit = async () => {
    if (!onSave) return;
    try {
       const newDataUrl = await processImageToDataUrl();
       onSave(file.id, newDataUrl);
       setImageSrc(newDataUrl);
       setIsEditing(false);
       setEdits(DEFAULT_EDITS); // Reset edits as they are now baked in
    } catch (e) {
       console.error("Failed to save image", e);
       alert("Could not save image (Cross-origin issues likely with external URLs).");
    }
  };

  const handleAiGenerate = async () => {
    if (!aiPrompt.trim()) return;
    setIsAiLoading(true);
    setAiError(null);

    try {
        const currentImageData = await processImageToDataUrl();
        const base64Data = currentImageData.split(',')[1]; // Remove 'data:image/png;base64,'

        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        
        // Using gemini-2.5-flash-image for editing/variation
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
                parts: [
                    {
                        inlineData: {
                            mimeType: 'image/png',
                            data: base64Data
                        }
                    },
                    { text: `Edit this image: ${aiPrompt}. Return only the image.` }
                ]
            }
        });

        let newImageBase64 = null;
        
        if (response.candidates && response.candidates[0].content.parts) {
            for (const part of response.candidates[0].content.parts) {
                if (part.inlineData) {
                    newImageBase64 = part.inlineData.data;
                    break;
                }
            }
        }

        if (newImageBase64) {
            setImageSrc(`data:image/png;base64,${newImageBase64}`);
            // Reset sliders as the new image is the base
            setEdits(DEFAULT_EDITS);
            setAiPrompt('');
        } else {
            throw new Error("No image returned from AI");
        }

    } catch (err: any) {
        console.error(err);
        setAiError(err.message || "AI Generation failed");
    } finally {
        setIsAiLoading(false);
    }
  };

  const FilterPreset = ({ name, filterSettings }: { name: string, filterSettings: Partial<EditState> }) => (
     <button 
       onClick={() => setEdits({ ...DEFAULT_EDITS, ...filterSettings })}
       className="flex flex-col items-center gap-2 group"
     >
        <div className="w-16 h-16 rounded-lg overflow-hidden border-2 border-white/10 group-hover:border-blue-500 transition-colors relative">
            <img src={imageSrc} className="w-full h-full object-cover" style={{
                filter: `
                    brightness(${filterSettings.brightness ?? 100}%) 
                    contrast(${filterSettings.contrast ?? 100}%) 
                    saturate(${filterSettings.saturation ?? 100}%) 
                    grayscale(${filterSettings.grayscale ?? 0}%)
                    sepia(${filterSettings.sepia ?? 0}%)
                    hue-rotate(${filterSettings.hueRotate ?? 0}deg)
                    invert(${filterSettings.invert ?? 0}%)
                    blur(${filterSettings.blur ?? 0}px)
                `
            }} />
        </div>
        <span className="text-xs text-gray-400 group-hover:text-white">{name}</span>
     </button>
  );

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full h-full bg-[#111] flex flex-col relative overflow-hidden"
    >
      {/* Top Bar */}
      <div className="h-12 bg-[#1a1a1a] flex items-center justify-between px-4 shrink-0 border-b border-white/5 z-10">
        <div className="flex items-center gap-3">
            <span className="text-gray-300 font-medium text-sm truncate max-w-[200px]">{file.name}</span>
            {isEditing && <span className="text-[10px] bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded border border-blue-500/30">EDITING</span>}
        </div>
        
        <div className="flex items-center gap-2">
          {!isEditing ? (
             <>
                <button onClick={() => setIsEditing(true)} className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded text-xs text-white font-medium flex items-center gap-2 transition-colors">
                    <Sliders size={14} /> Edit
                </button>
                <div className="w-[1px] h-4 bg-white/10 mx-1" />
                <div className="flex items-center gap-1 bg-black/20 rounded-lg p-1">
                    <button onClick={() => setScale(s => Math.max(0.1, s - 0.1))} className="p-1.5 hover:bg-white/10 rounded text-gray-400 hover:text-white"><ZoomOut size={16} /></button>
                    <span className="text-xs w-12 text-center text-gray-500">{Math.round(scale * 100)}%</span>
                    <button onClick={() => setScale(s => Math.min(5, s + 0.1))} className="p-1.5 hover:bg-white/10 rounded text-gray-400 hover:text-white"><ZoomIn size={16} /></button>
                </div>
             </>
          ) : (
             <>
                <button onClick={() => { setIsEditing(false); setEdits(DEFAULT_EDITS); }} className="px-3 py-1.5 hover:bg-white/10 rounded text-xs text-gray-300 flex items-center gap-2">
                    <X size={14} /> Cancel
                </button>
                <button onClick={handleSaveEdit} className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 rounded text-xs text-white font-medium flex items-center gap-2 shadow-lg shadow-blue-600/20">
                    <Check size={14} /> Save Copy
                </button>
             </>
          )}
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
          {/* Main Canvas */}
          <div className="flex-1 flex items-center justify-center overflow-hidden p-4 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-opacity-5 relative">
            <motion.img 
                ref={imgRef}
                src={imageSrc} 
                alt={file.name} 
                crossOrigin="anonymous"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: scale, opacity: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 25 }}
                className="max-w-full max-h-full object-contain shadow-2xl"
                style={{ 
                    filter: `
                        brightness(${edits.brightness}%) 
                        contrast(${edits.contrast}%) 
                        saturate(${edits.saturation}%) 
                        blur(${edits.blur}px)
                        grayscale(${edits.grayscale}%)
                        sepia(${edits.sepia}%)
                        hue-rotate(${edits.hueRotate}deg)
                        invert(${edits.invert}%)
                    `
                }}
                draggable={false}
            />
          </div>

          {/* Editor Sidebar */}
          <AnimatePresence>
          {isEditing && (
              <motion.div 
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="w-72 bg-[#181818] border-l border-white/5 flex flex-col shrink-0 z-20"
              >
                  {/* Tabs */}
                  <div className="flex border-b border-white/5">
                      <button 
                        onClick={() => setActiveToolTab('adjust')}
                        className={`flex-1 py-3 text-xs font-medium text-center transition-colors ${activeToolTab === 'adjust' ? 'text-white border-b-2 border-blue-500 bg-white/5' : 'text-gray-500 hover:text-gray-300'}`}
                      >
                        Adjust
                      </button>
                      <button 
                        onClick={() => setActiveToolTab('filters')}
                        className={`flex-1 py-3 text-xs font-medium text-center transition-colors ${activeToolTab === 'filters' ? 'text-white border-b-2 border-blue-500 bg-white/5' : 'text-gray-500 hover:text-gray-300'}`}
                      >
                        Filters
                      </button>
                      <button 
                        onClick={() => setActiveToolTab('ai')}
                        className={`flex-1 py-3 text-xs font-medium text-center transition-colors ${activeToolTab === 'ai' ? 'text-purple-400 border-b-2 border-purple-500 bg-purple-500/10' : 'text-gray-500 hover:text-gray-300'}`}
                      >
                        AI Tools
                      </button>
                  </div>

                  {/* Tools Content */}
                  <div className="flex-1 overflow-y-auto custom-scrollbar p-5 space-y-6">
                      {activeToolTab === 'adjust' && (
                          <div className="space-y-4">
                              <div className="space-y-2">
                                  <div className="flex justify-between text-xs text-gray-400">
                                      <span>Brightness</span>
                                      <span>{edits.brightness}%</span>
                                  </div>
                                  <input type="range" min="0" max="200" value={edits.brightness} onChange={(e) => setEdits({...edits, brightness: Number(e.target.value)})} className="w-full accent-blue-500" />
                              </div>
                              <div className="space-y-2">
                                  <div className="flex justify-between text-xs text-gray-400">
                                      <span>Contrast</span>
                                      <span>{edits.contrast}%</span>
                                  </div>
                                  <input type="range" min="0" max="200" value={edits.contrast} onChange={(e) => setEdits({...edits, contrast: Number(e.target.value)})} className="w-full accent-blue-500" />
                              </div>
                              <div className="space-y-2">
                                  <div className="flex justify-between text-xs text-gray-400">
                                      <span>Saturation</span>
                                      <span>{edits.saturation}%</span>
                                  </div>
                                  <input type="range" min="0" max="200" value={edits.saturation} onChange={(e) => setEdits({...edits, saturation: Number(e.target.value)})} className="w-full accent-blue-500" />
                              </div>
                              <div className="space-y-2">
                                  <div className="flex justify-between text-xs text-gray-400">
                                      <span>Blur</span>
                                      <span>{edits.blur}px</span>
                                  </div>
                                  <input type="range" min="0" max="20" step="0.5" value={edits.blur} onChange={(e) => setEdits({...edits, blur: Number(e.target.value)})} className="w-full accent-blue-500" />
                              </div>
                              <div className="space-y-2">
                                  <div className="flex justify-between text-xs text-gray-400">
                                      <span>Invert</span>
                                      <span>{edits.invert}%</span>
                                  </div>
                                  <input type="range" min="0" max="100" value={edits.invert} onChange={(e) => setEdits({...edits, invert: Number(e.target.value)})} className="w-full accent-blue-500" />
                              </div>
                              <div className="pt-4 border-t border-white/10">
                                 <button onClick={() => setEdits(DEFAULT_EDITS)} className="w-full py-2 text-xs text-red-400 hover:bg-red-900/20 rounded border border-red-900/30">Reset Adjustments</button>
                              </div>
                          </div>
                      )}

                      {activeToolTab === 'filters' && (
                          <div className="grid grid-cols-3 gap-3">
                              <FilterPreset name="Normal" filterSettings={DEFAULT_EDITS} />
                              <FilterPreset name="B&W" filterSettings={{ grayscale: 100 }} />
                              <FilterPreset name="Sepia" filterSettings={{ sepia: 100 }} />
                              <FilterPreset name="Vivid" filterSettings={{ contrast: 130, saturation: 140 }} />
                              <FilterPreset name="Dim" filterSettings={{ brightness: 70, contrast: 110 }} />
                              <FilterPreset name="Cold" filterSettings={{ hueRotate: 180, saturation: 50 }} />
                              <FilterPreset name="Invert" filterSettings={{ invert: 100 }} />
                              <FilterPreset name="Warm" filterSettings={{ hueRotate: 30, saturation: 120 }} />
                              <FilterPreset name="Vintage" filterSettings={{ sepia: 60, contrast: 85, brightness: 110 }} />
                              <FilterPreset name="Noir" filterSettings={{ grayscale: 100, contrast: 140, brightness: 90 }} />
                              <FilterPreset name="Fade" filterSettings={{ saturation: 60, brightness: 110, contrast: 90 }} />
                              <FilterPreset name="Cyber" filterSettings={{ saturation: 200, contrast: 120, hueRotate: 180 }} />
                          </div>
                      )}

                      {activeToolTab === 'ai' && (
                          <div className="space-y-4">
                             <div className="p-3 bg-purple-900/20 border border-purple-500/20 rounded-lg">
                                <div className="flex items-center gap-2 text-purple-400 text-xs font-bold mb-2 uppercase">
                                    <Sparkles size={12} /> Generative Edit
                                </div>
                                <p className="text-[10px] text-gray-400 leading-relaxed">
                                    Describe how you want to modify the image. The AI will regenerate the visual based on your prompt.
                                </p>
                             </div>

                             <textarea 
                                value={aiPrompt}
                                onChange={(e) => setAiPrompt(e.target.value)}
                                placeholder="E.g., 'Make it look like a cyberpunk city', 'Turn into a pencil sketch'..."
                                className="w-full h-24 bg-black/30 border border-white/10 rounded-lg p-3 text-xs text-white placeholder-gray-600 outline-none focus:border-purple-500 resize-none"
                             />
                             
                             {aiError && (
                                 <div className="text-[10px] text-red-400 flex items-center gap-1">
                                     <Info size={10} /> {aiError}
                                 </div>
                             )}

                             <button 
                                onClick={handleAiGenerate}
                                disabled={isAiLoading || !aiPrompt.trim()}
                                className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white rounded-lg text-xs font-bold shadow-lg shadow-purple-900/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                             >
                                {isAiLoading ? <Loader2 size={14} className="animate-spin" /> : <Wand2 size={14} />}
                                {isAiLoading ? 'Generating...' : 'Generate'}
                             </button>
                          </div>
                      )}
                  </div>
              </motion.div>
          )}
          </AnimatePresence>
      </div>
    </motion.div>
  );
};

// --- Media Player ---
export const MediaPlayer = ({ file }: { file: FileSystemNode }) => {
  return (
    <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="w-full h-full bg-black flex flex-col"
    >
      <div className="flex-1 flex flex-col items-center justify-center p-8">
         <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-[0_0_50px_rgba(59,130,246,0.4)] flex items-center justify-center mb-8 animate-pulse">
            {file.type === 'audio' ? <Music size={48} className="text-white" /> : <Video size={48} className="text-white" />}
         </div>
         <h3 className="text-xl font-bold text-white mb-2 tracking-wide">{file.name}</h3>
         <p className="text-gray-500 text-sm mb-8 uppercase tracking-wider">{file.type === 'audio' ? 'Audio Track' : 'Video Clip'}</p>
         
         <audio 
           controls 
           autoPlay 
           className="w-full max-w-md"
           src={file.content}
         />
      </div>
    </motion.div>
  );
};
