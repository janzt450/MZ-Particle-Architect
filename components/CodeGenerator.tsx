
import React, { useState, useEffect } from 'react';
import { ParticleConfig } from '../types';
import { 
  Copy, Download, FileJson, Terminal, Info, BookOpen, AlertTriangle, 
  CheckCircle2, Cuboid, Monitor, Eye, Ruler, Bug, Scale, Zap, 
  Layers, Package, FolderOpen, Share2, Github, Shield, BrainCircuit, 
  Compass, X, Sparkles, Heart, Rocket, ExternalLink, Library, Map,
  Globe, Smartphone, Code2, Check, Bot, LogOut
} from 'lucide-react';

interface ExportPanelProps {
  config: ParticleConfig;
  presets: ParticleConfig[];
}

const GITHUB_URL = "https://github.com/janzt450/MZ-Particle-Architect";

const Modal = ({ isOpen, onClose, title, icon: Icon, children, maxWidth = "max-w-md" }: { isOpen: boolean, onClose: () => void, title: string, icon: any, children?: React.ReactNode, maxWidth?: string }) => {
  if (!isOpen) return null;
  return (
    <div 
      className="fixed inset-0 z-[9999] bg-black/70 flex items-center justify-center p-4 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className={`bg-[#0f172a] w-full ${maxWidth} rounded-2xl overflow-hidden flex flex-col relative shadow-2xl border border-zinc-800 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto custom-scrollbar`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 flex flex-col items-center">
          <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center mb-4 border border-indigo-500/20">
            <Icon className="text-indigo-400" size={24} />
          </div>
          <h2 className="text-xl font-bold text-white mb-2 text-center">{title}</h2>
          <button 
            onClick={onClose} 
            className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center rounded-full bg-zinc-900/50 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
          >
            <X size={20} />
          </button>
          {children}
        </div>
      </div>
    </div>
  );
};

const ExportPanel: React.FC<ExportPanelProps> = ({ config, presets }) => {
  const [exportMode, setExportMode] = useState<'json' | 'bundle'>('json');
  const [selectedPresetNames, setSelectedPresetNames] = useState<string[]>([]);
  const [activeModal, setActiveModal] = useState<'ai' | 'privacy' | 'about' | 'roadmap' | 'share' | null>(null);
  const [copied, setCopied] = useState(false);
  
  // External Link Warning State
  const [pendingExternalUrl, setPendingExternalUrl] = useState<string | null>(null);
  const [externalCopied, setExternalCopied] = useState(false);

  useEffect(() => {
      const exists = presets.find(p => p.name === config.name);
      if (exists && !selectedPresetNames.includes(config.name)) {
          setSelectedPresetNames(prev => [...prev, config.name]);
      }
  }, [presets, config.name]);

  const togglePreset = (name: string) => {
      setSelectedPresetNames(prev => 
         prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name]
      );
  };

  const toHexAlpha = (alpha: number) => {
    const a = Math.max(0, Math.min(1, alpha));
    return Math.floor(a * 255).toString(16).padStart(2, '0').toUpperCase();
  };

  const getRuntimeConfig = (cfg: ParticleConfig) => {
    const startHex = toHexAlpha(cfg.startAlpha ?? 1);
    const endHex = toHexAlpha(cfg.endAlpha ?? 0);
    return {
        ...cfg,
        color1: cfg.color1 + startHex,
        color2: cfg.color2 + endHex,
        colorDead: cfg.colorDead + "00", 
    };
  };

  const downloadFile = (filename: string, content: string) => {
    const blob = new Blob([content], { type: 'text/javascript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText("https://outlandproductions.neocities.org");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // --- External Link Handler ---
  const handleExternalLink = (url: string) => {
      // Check localStorage to see if user has already acknowledged the external link notice
      const hasSeenNotice = localStorage.getItem('mz_external_notice_seen');
      
      if (hasSeenNotice === 'true') {
          // If already seen, open immediately
          window.open(url, '_blank');
      } else {
          // Otherwise, show the friendly dialog
          setPendingExternalUrl(url);
      }
  };

  const confirmExternalLink = () => {
      if (pendingExternalUrl) {
          // Mark as seen so it doesn't appear again
          localStorage.setItem('mz_external_notice_seen', 'true');
          window.open(pendingExternalUrl, '_blank');
          setPendingExternalUrl(null);
      }
  };

  const generateCorePlugin = () => {
      return `/*:
 * @target MZ
 * @plugindesc [Core] Babylon.js Particle Loader.
 * @author Gemini Particle Architect
 */
// logic...`;
  };

  const generateBundlePlugin = () => {
    let configsToExport = presets.filter(p => selectedPresetNames.includes(p.name));
    if (configsToExport.length === 0) configsToExport = [config];
    const libraryStr = configsToExport.map(cfg => {
        const rc = getRuntimeConfig(cfg);
        return `"${cfg.name}": ${JSON.stringify(rc)}`;
    }).join(",");
    return `(() => { const EFFECT_LIBRARY = { ${libraryStr} }; })();`;
  };

  return (
    <div className="flex flex-col h-full bg-zinc-950 border-l border-zinc-800 shadow-2xl overflow-hidden">
        <div className="flex border-b border-zinc-800 bg-zinc-950 shrink-0">
            <button 
                onClick={() => setExportMode('json')}
                className={`flex-1 py-3 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 ${exportMode === 'json' ? 'text-green-400 border-b-2 border-green-500 bg-green-500/5' : 'text-zinc-500 hover:text-zinc-300 transition-all'}`}
            >
                <FolderOpen size={14} /> JSON EXPORT
            </button>
            <button 
                onClick={() => setExportMode('bundle')}
                className={`flex-1 py-3 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 ${exportMode === 'bundle' ? 'text-amber-400 border-b-2 border-amber-500 bg-amber-500/5' : 'text-zinc-500 hover:text-zinc-300 transition-all'}`}
            >
                <Package size={14} /> JS BUNDLE
            </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar space-y-5">
            {exportMode === 'json' ? (
                <div className="space-y-6">
                    <div className="space-y-3">
                         <h3 className="text-zinc-400 font-bold text-xs uppercase tracking-widest flex items-center gap-2">
                             <span className="w-5 h-5 rounded-full bg-green-900/50 text-green-400 flex items-center justify-center text-[10px] border border-green-800/50 font-mono font-bold">1</span>
                             Plugins
                         </h3>
                         <div className="bg-zinc-900/30 p-3 rounded-xl border border-zinc-800/50 space-y-3 shadow-inner">
                             <button 
                                onClick={() => downloadFile('BabylonParticle_Core.js', generateCorePlugin())}
                                className="w-full bg-zinc-800 hover:bg-zinc-700 text-green-400 border border-green-900/30 py-2.5 rounded-lg text-xs font-bold uppercase transition-all flex items-center justify-center gap-2 shadow-md active:scale-95"
                             >
                                <Download size={14} /> Loader Plugin.js
                             </button>
                         </div>
                    </div>

                    <div className="space-y-3">
                         <h3 className="text-zinc-400 font-bold text-xs uppercase tracking-widest flex items-center gap-2">
                             <span className="w-5 h-5 rounded-full bg-blue-900/50 text-blue-400 flex items-center justify-center text-[10px] border border-blue-800/50 font-mono font-bold">2</span>
                             Effect Data
                         </h3>
                         <div className="bg-zinc-900/30 p-3 rounded-xl border border-zinc-800/50 space-y-2.5 shadow-inner">
                             <div className="flex items-center justify-between bg-zinc-950 border border-zinc-800 p-3 rounded-lg shadow-sm">
                                 <div className="flex flex-col truncate mr-4">
                                     <span className="text-xs font-bold text-white uppercase truncate tracking-tight">{config.name}</span>
                                     <span className="text-[10px] text-zinc-600 font-mono font-bold uppercase tracking-widest mt-0.5">Active Session</span>
                                 </div>
                                 <button 
                                    onClick={() => downloadFile(`${config.name}.json`, JSON.stringify(getRuntimeConfig(config), null, 2))}
                                    className="bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-md text-[10px] font-bold uppercase shrink-0 transition-all active:scale-95 shadow-md"
                                 >
                                    JSON
                                 </button>
                             </div>
                             {presets.filter(p => p.name !== config.name).map(p => (
                                 <div key={p.name} className="flex items-center justify-between bg-zinc-950 border border-zinc-800/50 p-3 rounded-lg opacity-80 hover:opacity-100 transition-opacity">
                                     <span className="text-xs font-bold text-zinc-500 uppercase truncate mr-4 tracking-tight">{p.name}</span>
                                     <button 
                                        onClick={() => downloadFile(`${p.name}.json`, JSON.stringify(getRuntimeConfig(p), null, 2))}
                                        className="bg-zinc-800 hover:bg-zinc-700 text-zinc-400 px-3 py-1.5 rounded-md text-[10px] font-bold uppercase shrink-0 transition-all active:scale-95"
                                     >
                                        JSON
                                     </button>
                                 </div>
                             ))}
                         </div>
                    </div>
                </div>
            ) : (
                <div className="space-y-4">
                     <div className="bg-amber-900/10 border border-amber-900/30 p-3 rounded-lg text-amber-500 text-[10px] flex items-start gap-2.5 uppercase font-bold tracking-tight shadow-inner">
                        <AlertTriangle size={16} className="shrink-0 mt-0.5" />
                        <p className="leading-tight">Static bundle mode aggregates multiple selected effects into a single JS file.</p>
                     </div>
                     <div className="bg-zinc-900/30 rounded-xl p-3 border border-zinc-800/50 space-y-1 max-h-64 overflow-y-auto custom-scrollbar shadow-inner">
                        {presets.map(p => (
                            <label key={p.name} className="flex items-center gap-3 p-2 hover:bg-zinc-800/50 rounded-lg cursor-pointer transition-colors">
                                <input type="checkbox" checked={selectedPresetNames.includes(p.name)} onChange={() => togglePreset(p.name)} className="accent-indigo-500 w-4 h-4" />
                                <span className={`text-xs font-mono uppercase truncate tracking-tight ${selectedPresetNames.includes(p.name) ? 'text-zinc-200 font-bold' : 'text-zinc-600'}`}>{p.name}</span>
                            </label>
                        ))}
                     </div>
                     <button 
                        onClick={() => downloadFile('BabylonParticle_Bundle.js', generateBundlePlugin())}
                        className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-2.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-lg active:scale-95"
                     >
                        <Package size={16} /> GENERATE BUNDLE JS
                     </button>
                </div>
            )}
        </div>

        {/* Footer Design Redesign - Optimized Font Size */}
        <div className="p-4 border-t border-zinc-800 bg-zinc-950 shrink-0">
             <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-2xl p-4 shadow-xl">
                <div className="grid grid-cols-2 gap-y-3.5 gap-x-6">
                    <button onClick={() => setActiveModal('share')} className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-zinc-500 hover:text-indigo-400 transition-colors">
                        <Share2 size={13} className="shrink-0" /> Share
                    </button>
                    <button onClick={() => handleExternalLink(GITHUB_URL)} className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-zinc-500 hover:text-indigo-400 transition-colors">
                        <Github size={13} className="shrink-0" /> Source
                    </button>
                    <button onClick={() => setActiveModal('about')} className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-zinc-500 hover:text-indigo-400 transition-colors">
                        <Info size={13} className="shrink-0" /> About
                    </button>
                    <button onClick={() => setActiveModal('privacy')} className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-zinc-500 hover:text-indigo-400 transition-colors text-left">
                        <Shield size={13} className="shrink-0" /> Privacy
                    </button>
                    <button onClick={() => setActiveModal('ai')} className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-zinc-500 hover:text-indigo-400 transition-colors text-left">
                        <BrainCircuit size={13} className="shrink-0" /> AI Info
                    </button>
                    <button onClick={() => setActiveModal('roadmap')} className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-zinc-500 hover:text-indigo-400 transition-colors">
                        <Compass size={13} className="shrink-0" /> Roadmap
                    </button>
                </div>
                <button onClick={() => setActiveModal('share')} className="w-full mt-4 flex items-center justify-center gap-2 text-[11px] font-bold uppercase tracking-widest text-zinc-400 hover:text-white transition-all py-2 bg-zinc-950/60 rounded-xl border border-zinc-800/80 shadow-inner group">
                    <Download size={13} className="group-hover:translate-y-0.5 transition-transform" /> Downloads
                </button>
             </div>
        </div>

        {/* AI Transparency Modal */}
        <Modal 
          isOpen={activeModal === 'ai'} 
          onClose={() => setActiveModal(null)} 
          title="AI Transparency Statement" 
          icon={Bot}
          maxWidth="max-w-md"
        >
          <div className="mt-0 text-zinc-500 text-xs font-bold mb-6 uppercase tracking-widest opacity-60 text-center">Created with Human Vision & Machine Intelligence</div>
          <div className="w-full space-y-6 text-left">
            <div className="flex gap-4">
              <Sparkles className="text-amber-400 shrink-0 mt-0.5" size={20} />
              <div>
                <h3 className="text-white font-bold text-sm mb-1 uppercase tracking-wider">A Historical Artifact</h3>
                <p className="text-zinc-400 text-xs leading-relaxed">This app serves as a historical artifact of the 'vibecoding' era—a time when natural language became a programming language. It was generated as an intentional exercise in UX design, bridging the gap between concept and reality through Large Language Models.</p>
              </div>
            </div>
            
            <div className="bg-[#059669]/10 border border-[#059669]/30 rounded-xl p-3 text-center shadow-inner mx-2">
              <p className="text-[#10b981] font-bold text-[10px] tracking-wide uppercase">"Originally created with Gemini 3 Pro Preview using Google AI Studio - January 2026"</p>
            </div>

            <div className="flex gap-4">
              <Bot className="text-purple-400 shrink-0 mt-0.5" size={20} />
              <div>
                <h3 className="text-white font-bold text-sm mb-1 uppercase tracking-wider">The Human Element</h3>
                <p className="text-zinc-400 text-xs leading-relaxed">Created as a meaningful distraction from nicotine cravings, this project proves that building software can be a pleasant, revolutionary experience. It empowers those with a vision for product design and information systems to build freely, regardless of their coding fluency.</p>
              </div>
            </div>

            <div className="flex gap-4">
               <Shield className="text-blue-400 shrink-0 mt-0.5" size={20} />
               <div>
                 <h3 className="text-white font-bold text-sm mb-1 uppercase tracking-wider">Our Responsibility</h3>
                 <p className="text-zinc-400 text-xs leading-relaxed">With AI now woven into our reality, the responsibility falls on humans to guide it with wisdom. Despite the challenges ahead, there is immense hope. We have the power to use these tools to find truth, uplift one another, and understand the world we live in.</p>
               </div>
            </div>

            <div className="bg-indigo-900/30 border border-indigo-500/30 rounded-2xl p-4 text-center shadow-lg transform hover:scale-[1.02] transition-transform mt-2">
                <span className="text-white font-bold text-[11px] uppercase tracking-widest">This app was created 100% with AI <span className="text-indigo-400 font-black">*AND*</span> HUMANS</span>
            </div>
          </div>
        </Modal>

        {/* Privacy Modal */}
        <Modal 
          isOpen={activeModal === 'privacy'} 
          onClose={() => setActiveModal(null)} 
          title="Open Source & Privacy" 
          icon={Shield}
        >
          <div className="mt-2 text-zinc-500 text-xs font-bold mb-6 uppercase tracking-widest opacity-60">Transparency is Trust</div>
          <div className="w-full space-y-6 text-left">
            <div className="flex gap-4">
              <div className="bg-blue-500/10 p-2 rounded-xl border border-blue-500/20 shadow-sm"><FileJson className="text-blue-400" size={18} /></div>
              <div>
                <h3 className="text-white font-bold text-sm mb-1 uppercase tracking-wider">Auditability</h3>
                <p className="text-zinc-400 text-xs leading-relaxed italic">The source is public. Anyone can inspect the architecture to ensure total data integrity with zero trackers.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="bg-amber-500/10 p-2 rounded-xl border border-amber-500/20 shadow-sm"><Shield className="text-amber-400" size={18} /></div>
              <div>
                <h3 className="text-white font-bold text-sm mb-1 uppercase tracking-wider">Data Sovereignty</h3>
                <p className="text-zinc-400 text-xs leading-relaxed italic">"Local Only" logic. Your assets and configurations remain on your machine. We never touch your creative data.</p>
              </div>
            </div>

            <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 shadow-inner">
              <span className="text-zinc-500 font-black text-[10px] uppercase tracking-widest block mb-3 opacity-60">Principles supported:</span>
              <ul className="space-y-2.5">
                <li className="text-zinc-300 font-bold text-xs flex items-center justify-between hover:text-white transition-colors cursor-default">Free Software Foundation <ExternalLink size={12} className="opacity-20" /></li>
                <li className="text-zinc-300 font-bold text-xs flex items-center justify-between hover:text-white transition-colors cursor-default">Open Source Initiative <ExternalLink size={12} className="opacity-20" /></li>
                <li className="text-zinc-300 font-bold text-xs flex items-center justify-between hover:text-white transition-colors cursor-default">Electronic Frontier Foundation <ExternalLink size={12} className="opacity-20" /></li>
              </ul>
            </div>
          </div>
        </Modal>

        {/* About Modal - Redesigned to match requested style */}
        <Modal 
          isOpen={activeModal === 'about'} 
          onClose={() => setActiveModal(null)} 
          title="Architect" 
          icon={Sparkles}
          maxWidth="max-w-md"
        >
          <div className="w-full flex flex-col items-center">
             <h3 className="text-lg font-bold text-white -mt-2">MZ Particle Architect</h3>
             <p className="text-zinc-500 text-xs font-medium uppercase tracking-widest mb-6">Open Source VFX Tool</p>

             <div className="text-zinc-400 text-sm leading-relaxed space-y-4 text-left">
                <p>
                    Built to empower RPG Maker developers to create high-performance 3D particle systems without needing to master complex code.
                </p>
                <p>
                    Unlike many proprietary tools, this exists solely to fuel your creativity. All presets and textures are stored locally on your device. We do not track your usage, store your designs on servers, or harvest your data.
                </p>
             </div>

             <div className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 mt-6">
                 <div className="flex items-center gap-2 mb-3">
                     <Shield size={16} className="text-green-500" />
                     <span className="text-white font-bold text-sm">Privacy Promise</span>
                 </div>
                 <ul className="space-y-2">
                     {['No Account Required', 'Local Storage Only', 'No Ad Tracking', 'Open Source Code'].map(item => (
                         <li key={item} className="flex items-center gap-2 text-xs text-zinc-400">
                             <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_5px_rgba(34,197,94,0.5)]"></div>
                             {item}
                         </li>
                     ))}
                 </ul>
             </div>

             <div className="w-full bg-red-500/10 border border-red-500/20 rounded-xl p-4 mt-4 flex items-start gap-3">
                 <AlertTriangle size={20} className="text-red-400 shrink-0 mt-0.5" />
                 <p className="text-red-300 text-xs leading-relaxed font-medium">
                     This tool is free and open source. It is never intended to be sold, bartered, or traded. Free forever.
                 </p>
             </div>

             <div className="mt-8 text-center">
                 <p className="text-zinc-600 text-[10px] font-mono">Version 1.0.0 • Built with React & Babylon.js</p>
             </div>
          </div>
        </Modal>

        {/* Roadmap Modal */}
        <Modal 
          isOpen={activeModal === 'roadmap'} 
          onClose={() => setActiveModal(null)} 
          title="Roadmap" 
          icon={Map}
        >
          <div className="mt-2 text-zinc-500 text-xs font-bold mb-6 uppercase tracking-widest opacity-60">Future Visions</div>
          <div className="w-full space-y-4 text-left">
            <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-5 shadow-inner">
               <div className="flex gap-4">
                 <div className="bg-indigo-500/10 p-2 rounded-xl border border-indigo-500/20 shadow-sm h-fit">
                    <Monitor className="text-indigo-400" size={18} />
                 </div>
                 <div>
                    <h3 className="text-white font-bold text-sm mb-1 uppercase tracking-wider">Visual Node Editor</h3>
                    <p className="text-zinc-400 text-xs leading-relaxed italic">A full graph-based editor for constructing shaders without writing code, similar to Unreal Material Editor.</p>
                 </div>
               </div>
            </div>

            <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-5 shadow-inner">
               <div className="flex gap-4">
                 <div className="bg-green-500/10 p-2 rounded-xl border border-green-500/20 shadow-sm h-fit">
                    <Library className="text-green-400" size={18} />
                 </div>
                 <div>
                    <h3 className="text-white font-bold text-sm mb-1 uppercase tracking-wider">Community Library</h3>
                    <p className="text-zinc-400 text-xs leading-relaxed italic">Built-in browser to share and download presets from other users directly within the app.</p>
                 </div>
               </div>
            </div>

            <div className="bg-zinc-800/30 border border-zinc-800/50 rounded-2xl p-4 text-center mt-2">
               <p className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest leading-relaxed">
                 This roadmap is not fixed. As an open-source tool, its destiny lies with the community.
               </p>
            </div>
          </div>
        </Modal>

        {/* Share Modal - "Spread the Word" */}
        <Modal 
          isOpen={activeModal === 'share'} 
          onClose={() => setActiveModal(null)} 
          title="Spread the Word" 
          icon={Share2}
          maxWidth="max-w-2xl"
        >
          <div className="mt-2 text-zinc-500 text-sm font-medium mb-8 text-center max-w-sm">
            Help others create amazing visual effects. Share this tool with friends or your community.
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full text-left">
            {/* Web App Section */}
            <div className="bg-zinc-900/40 border border-zinc-800 p-5 rounded-2xl shadow-inner flex flex-col h-full">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center border border-indigo-500/20">
                   <Globe className="text-indigo-400" size={20} />
                </div>
                <div>
                   <h3 className="text-white font-bold text-sm uppercase tracking-wider">Web App</h3>
                   <p className="text-zinc-500 text-xs">Run in browser</p>
                </div>
              </div>
              <div className="mt-auto flex items-center bg-zinc-950 border border-zinc-800 rounded-lg p-1.5 pl-3">
                 <span className="text-[10px] text-zinc-500 font-mono truncate flex-1 select-all">https://outlandproductions.neocities.org</span>
                 <button 
                  onClick={handleCopyUrl}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-md text-[10px] font-bold uppercase transition-all flex items-center gap-1.5 ml-2 shadow-md active:scale-95"
                 >
                    {copied ? <Check size={12} /> : <Copy size={12} />}
                    {copied ? "COPIED" : "COPY"}
                 </button>
              </div>
            </div>

            {/* Windows Section */}
            <div className="bg-zinc-900/40 border border-zinc-800 p-5 rounded-2xl shadow-inner flex flex-col h-full">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center border border-blue-500/20">
                   <Monitor className="text-blue-400" size={20} />
                </div>
                <div>
                   <h3 className="text-white font-bold text-sm uppercase tracking-wider">Windows</h3>
                   <p className="text-zinc-500 text-xs">Desktop Installer (.exe)</p>
                </div>
              </div>
              <div className="mt-auto space-y-2">
                <span className="text-[9px] text-zinc-600 font-bold uppercase tracking-[0.2em] block text-center mb-1">Download Mirrors</span>
                <div className="flex gap-2">
                   <button onClick={() => handleExternalLink('https://mega.nz/folder/sKNTWZqQ#doGLWeBTgEC0VT842UPI4g')} className="flex-1 bg-red-950/20 hover:bg-red-900/40 border border-red-900/30 text-red-400 py-2 rounded-lg text-[9px] font-bold uppercase transition-all shadow-sm">Mega.nz</button>
                   <button onClick={() => handleExternalLink('https://drive.google.com/drive/folders/1ZDk6uAsAx-BcUMEBhBsy6nORkZP7vRgF?usp=drive_link')} className="flex-1 bg-blue-950/20 hover:bg-blue-900/40 border border-blue-900/30 text-blue-400 py-2 rounded-lg text-[9px] font-bold uppercase transition-all shadow-sm">Google</button>
                   <button onClick={() => handleExternalLink('https://www.mediafire.com/folder/fv9es8v0fqguf/MZ_Particle_Architect')} className="flex-1 bg-cyan-950/20 hover:bg-cyan-900/40 border border-cyan-900/30 text-cyan-400 py-2 rounded-lg text-[9px] font-bold uppercase transition-all shadow-sm">MediaFire</button>
                </div>
              </div>
            </div>

            {/* Android Section */}
            <div className="bg-zinc-900/40 border border-zinc-800 p-5 rounded-2xl shadow-inner flex flex-col h-full opacity-60">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-green-500/10 rounded-xl flex items-center justify-center border border-green-500/20">
                   <Smartphone className="text-green-400" size={20} />
                </div>
                <div>
                   <h3 className="text-white font-bold text-sm uppercase tracking-wider">Android</h3>
                   <p className="text-zinc-500 text-xs">Mobile App (.apk)</p>
                </div>
              </div>
              <div className="mt-auto bg-zinc-950/50 border border-zinc-800/50 rounded-lg py-2.5 text-center">
                 <span className="text-xs font-bold text-zinc-600 uppercase tracking-[0.15em]">Coming Soon</span>
              </div>
            </div>

            {/* Source Section */}
            <div className="bg-zinc-900/40 border border-zinc-800 p-5 rounded-2xl shadow-inner flex flex-col h-full">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-zinc-500/10 rounded-xl flex items-center justify-center border border-zinc-500/20">
                   <Code2 className="text-zinc-400" size={20} />
                </div>
                <div>
                   <h3 className="text-white font-bold text-sm uppercase tracking-wider">Source Code</h3>
                   <p className="text-zinc-500 text-xs">GitHub Repository</p>
                </div>
              </div>
              <button 
                onClick={() => handleExternalLink(GITHUB_URL)}
                className="mt-auto bg-zinc-800 hover:bg-zinc-700 text-zinc-300 py-2.5 rounded-lg text-[10px] font-bold uppercase transition-all border border-zinc-700/50 shadow-md flex items-center justify-center gap-2"
              >
                <ExternalLink size={12} /> View Code
              </button>
            </div>
          </div>
        </Modal>

        {/* EXTERNAL LINK NOTICE MODAL (FRIENDLY) */}
        <Modal
            isOpen={!!pendingExternalUrl}
            onClose={() => setPendingExternalUrl(null)}
            title="External Link"
            icon={ExternalLink}
            maxWidth="max-w-lg"
        >
            <div className="w-full space-y-6">
                <p className="text-zinc-400 text-sm leading-relaxed mt-2 text-center">
                    You are navigating to an external website.
                </p>
                
                <div className="bg-zinc-950 p-2 rounded-xl border border-zinc-800 flex items-center gap-2 shadow-inner group focus-within:border-indigo-500/50 transition-colors">
                    <div className="w-10 h-10 shrink-0 flex items-center justify-center bg-zinc-900 border border-zinc-800 rounded-lg group-focus-within:border-indigo-500/30">
                        <Globe size={18} className="text-zinc-500 group-focus-within:text-indigo-400 transition-colors"/>
                    </div>
                    
                    <input 
                        type="text" 
                        readOnly 
                        value={pendingExternalUrl || ''} 
                        className="bg-transparent border-none outline-none text-indigo-400 text-xs font-mono w-full h-full px-2 py-2 focus:ring-0 selection:bg-indigo-500/30"
                        onClick={(e) => e.currentTarget.select()}
                    />

                    <button 
                        onClick={() => {
                            if(pendingExternalUrl) {
                                navigator.clipboard.writeText(pendingExternalUrl);
                                setExternalCopied(true);
                                setTimeout(() => setExternalCopied(false), 2000);
                            }
                        }}
                        className="w-10 h-10 shrink-0 flex items-center justify-center hover:bg-zinc-800 rounded-lg text-zinc-500 hover:text-zinc-200 transition-all active:scale-95"
                        title="Copy Link"
                    >
                        {externalCopied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                    </button>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                    <button 
                        onClick={() => setPendingExternalUrl(null)}
                        className="w-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all"
                    >
                        Stay Here
                    </button>
                    <button 
                        onClick={confirmExternalLink}
                        className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg"
                    >
                        Open Link
                    </button>
                </div>
                <p className="text-zinc-600 text-[9px] font-bold uppercase tracking-widest opacity-60 text-center">
                    This notice will not appear again.
                </p>
            </div>
        </Modal>
    </div>
  );
};

export default ExportPanel;
