
import React, { useState, useEffect, useRef } from 'react';
import { ParticleConfig, DEFAULT_CONFIG } from './types';
import BabylonPreview from './components/BabylonPreview';
import Controls from './components/Controls';
import ExportPanel from './components/CodeGenerator'; 
import { Sparkles, Book, X, Settings, Type, ChevronDown, ChevronRight, Tag, List, Trash2, Upload, PanelLeft, PanelRight, Menu, Code2 } from 'lucide-react';
import { DOCS_HTML } from './documentationContent';

// Shared Section component for consistent look across the sidebar
// Fixed: children is now optional (?) to resolve TS errors when passed as nested elements in JSX
const SidebarSection = ({ title, icon: Icon, children, isOpen, onToggle, badge }: { title: string, icon: any, children?: React.ReactNode, isOpen: boolean, onToggle: () => void, badge?: string }) => {
  return (
    <div className="border-b border-zinc-800 bg-zinc-950">
      <button 
        onClick={onToggle}
        className="flex items-center justify-between w-full p-4 hover:bg-zinc-900/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Icon size={14} className={`${isOpen ? 'text-indigo-400' : 'text-zinc-500'} transition-colors`} />
          <span className="text-xs font-bold text-zinc-100 uppercase tracking-wider">{title}</span>
          {badge && !isOpen && <span className="text-[9px] font-mono text-indigo-400 bg-indigo-500/10 px-1.5 rounded border border-indigo-500/20">{badge}</span>}
        </div>
        {isOpen ? <ChevronDown size={14} className="text-zinc-600" /> : <ChevronRight size={14} className="text-zinc-600" />}
      </button>
      
      {isOpen && (
        <div className="px-4 pb-4 animate-in fade-in slide-in-from-top-1">
          {children}
        </div>
      )}
    </div>
  );
};

export default function App() {
  const [config, setConfig] = useState<ParticleConfig>(DEFAULT_CONFIG);
  const [showDocs, setShowDocs] = useState(false);
  const [uiScale, setUiScale] = useState(110); 
  
  // Layout State
  const [leftPanelOpen, setLeftPanelOpen] = useState(true);
  const [rightPanelOpen, setRightPanelOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Section states
  const [showPrefs, setShowPrefs] = useState(false);
  const [showLoadPreset, setShowLoadPreset] = useState(true); // Expanded by default
  const [showEffectName, setShowEffectName] = useState(false); // Minimized by default

  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Preset State
  const [presets, setPresets] = useState<ParticleConfig[]>([]);

  // Mobile Detection & Init
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024; // Treat tablets as mobile-ish for layout
      setIsMobile(mobile);
      if (mobile) {
        setLeftPanelOpen(false);
        setRightPanelOpen(false);
      } else {
        setLeftPanelOpen(true);
        setRightPanelOpen(true);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem('mz_particle_presets');
    if (saved) {
      try {
        setPresets(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load presets", e);
      }
    }
    
    const savedScale = localStorage.getItem('mz_particle_ui_scale');
    if (savedScale) {
        setUiScale(parseInt(savedScale));
    }
  }, []);

  useEffect(() => {
    const session = localStorage.getItem('mz_particle_session');
    if (session) {
      try {
        const parsed = JSON.parse(session);
        setConfig({ ...DEFAULT_CONFIG, ...parsed });
      } catch (e) {
        console.error("Failed to load session", e);
      }
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
        localStorage.setItem('mz_particle_session', JSON.stringify(config));
        localStorage.setItem('mz_particle_ui_scale', uiScale.toString());
    }, 1000);
    return () => clearTimeout(timer);
  }, [config, uiScale]);

  useEffect(() => {
    document.documentElement.style.fontSize = `${uiScale}%`;
  }, [uiScale]);

  const handleSavePreset = () => {
    if (!config.name.trim()) {
        alert("Please give your effect a name before saving.");
        setShowEffectName(true);
        return;
    }
    setPresets(prev => {
      const filtered = prev.filter(p => p.name !== config.name);
      const updated = [...filtered, config].sort((a, b) => a.name.localeCompare(b.name));
      localStorage.setItem('mz_particle_presets', JSON.stringify(updated));
      return updated;
    });
  };

  const handleDeletePreset = (name: string) => {
    if (!confirm(`Delete preset "${name}"?`)) return;
    setPresets(prev => {
      const updated = prev.filter(p => p.name !== name);
      localStorage.setItem('mz_particle_presets', JSON.stringify(updated));
      return updated;
    });
  };

  const handleLoadPreset = (name: string) => {
    const found = presets.find(p => p.name === name);
    if (found) {
        setConfig({ ...DEFAULT_CONFIG, ...found });
    }
  };

  const handleImportPresets = (newPresets: ParticleConfig[]) => {
      setPresets(prev => {
          const map = new Map<string, ParticleConfig>();
          prev.forEach(p => map.set(p.name, p));
          newPresets.forEach(p => map.set(p.name, p));
          
          const updated = Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name));
          localStorage.setItem('mz_particle_presets', JSON.stringify(updated));
          return updated;
      });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (event) => {
          try {
              const json = JSON.parse(event.target?.result as string);
              const sanitize = (cfg: any) => ({ ...DEFAULT_CONFIG, ...cfg });
              let imported: ParticleConfig[] = [];
              if (Array.isArray(json)) imported = json.map(c => sanitize(c));
              else if (typeof json === 'object') imported = [sanitize(json)];
              if (imported.length > 0) {
                   handleImportPresets(imported);
                   setConfig(imported[0]);
              }
          } catch (err) { console.error(err); }
      };
      reader.readAsText(file);
      e.target.value = '';
  };

  const toggleLeftPanel = () => {
    setLeftPanelOpen(!leftPanelOpen);
    if (isMobile && !leftPanelOpen) setRightPanelOpen(false); // Close other panel on mobile
  };

  const toggleRightPanel = () => {
    setRightPanelOpen(!rightPanelOpen);
    if (isMobile && !rightPanelOpen) setLeftPanelOpen(false); // Close other panel on mobile
  };

  return (
    <div className="flex flex-col h-screen w-full bg-zinc-950 text-zinc-200 font-sans overflow-hidden">
      
      {/* HEADER */}
      <header className="h-12 border-b border-zinc-800 bg-zinc-950 flex items-center justify-between px-3 shrink-0 z-50 relative">
        <div className="flex items-center gap-3">
           <button 
             onClick={toggleLeftPanel}
             className={`w-8 h-8 flex items-center justify-center rounded-md hover:bg-zinc-800 transition-colors ${leftPanelOpen ? 'text-indigo-400 bg-indigo-500/10' : 'text-zinc-500'}`}
             title="Toggle Controls"
           >
             {isMobile ? <Menu size={18} /> : <PanelLeft size={18} />}
           </button>
           
           <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-indigo-600 rounded flex items-center justify-center text-white shadow-[0_0_10px_rgba(79,70,229,0.3)] hidden sm:flex">
                <Sparkles size={14} />
              </div>
              <h1 className="font-bold text-sm tracking-wide text-zinc-100 font-mono flex gap-1">
                <span className="hidden sm:inline">MZ PARTICLE</span>
                <span className="text-indigo-500">ARCHITECT</span>
              </h1>
           </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4 text-xs text-zinc-500 font-mono">
           <button 
              onClick={() => setShowDocs(true)}
              className="flex items-center gap-2 text-zinc-400 hover:text-zinc-100 transition-all text-xs font-bold uppercase tracking-wide bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-sm hover:border-zinc-600 hover:bg-zinc-800 shadow-sm"
           >
              <Book size={14} />
              <span className="hidden sm:inline">Docs</span>
           </button>
           
           <div className="w-px h-4 bg-zinc-800 mx-1 hidden sm:block"></div>
           <span className="opacity-70 hidden md:inline">BABYLON.JS v7.43</span>
           
           <button 
             onClick={toggleRightPanel}
             className={`w-8 h-8 flex items-center justify-center rounded-md hover:bg-zinc-800 transition-colors ml-1 ${rightPanelOpen ? 'text-indigo-400 bg-indigo-500/10' : 'text-zinc-500'}`}
             title="Toggle Export Panel"
           >
             {isMobile ? <Code2 size={18} /> : <PanelRight size={18} />}
           </button>
        </div>
      </header>

      {/* MAIN WORKSPACE - 3 Column Layout (Responsive) */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* LEFT PANEL: SCROLLABLE SIDEBAR */}
        {/* On Mobile: Top Dropdown Overlay (50% Height). On Desktop: Left Flex Item. */}
        <div 
            className={`
                bg-zinc-950 flex flex-col shadow-2xl overflow-y-auto custom-scrollbar transition-all duration-300 ease-in-out
                ${isMobile 
                  ? 'fixed top-12 left-0 w-full max-h-[50vh] border-b border-zinc-800 z-40 bg-zinc-950/95 backdrop-blur-sm' 
                  : 'w-[320px] shrink-0 z-10 border-r border-zinc-800'
                }
                ${!leftPanelOpen ? 'hidden' : 'flex'}
            `}
        >
           {/* Mobile Header for Panel */}
           {isMobile && (
               <div className="p-3 bg-zinc-900 border-b border-zinc-800 flex justify-between items-center shrink-0">
                   <span className="text-xs font-bold uppercase text-zinc-400">Controls</span>
                   <button onClick={() => setLeftPanelOpen(false)}><X size={18} className="text-zinc-500" /></button>
               </div>
           )}

           {/* 1. Preferences Section */}
           <SidebarSection 
             title="Preferences" 
             icon={Settings} 
             isOpen={showPrefs} 
             onToggle={() => setShowPrefs(!showPrefs)}
             badge={`${uiScale}%`}
           >
              <div className="space-y-1.5 bg-zinc-950/50 p-3 rounded border border-zinc-800/50">
                  <div className="flex justify-between items-center mb-0.5">
                      <div className="flex items-center gap-1.5">
                          <Type size={12} className="text-zinc-600" />
                          <span className="text-[10px] uppercase text-zinc-500 font-mono font-bold tracking-tight">UI Global Scale</span>
                      </div>
                  </div>
                  <input 
                      type="range" min="70" max="150" step="1"
                      value={uiScale}
                      onChange={(e) => setUiScale(parseInt(e.target.value))}
                      className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-indigo-500 hover:accent-indigo-400 transition-all"
                  />
                  <div className="flex justify-between text-[8px] text-zinc-700 font-mono uppercase tracking-widest mt-1 px-0.5">
                      <span>70%</span>
                      <span>150%</span>
                  </div>
              </div>
           </SidebarSection>

           {/* 2. Load Preset Section - Expanded by default */}
           <SidebarSection 
             title="Load Preset" 
             icon={List} 
             isOpen={showLoadPreset} 
             onToggle={() => setShowLoadPreset(!showLoadPreset)}
           >
              <div className="space-y-3">
                  <div className="flex gap-2">
                    <div className="flex-1 relative">
                        <select 
                            className="w-full bg-zinc-900 border border-zinc-700 rounded-sm p-1.5 text-xs text-zinc-300 focus:border-indigo-500 focus:outline-none appearance-none"
                            value="" 
                            onChange={(e) => {
                                if (e.target.value) handleLoadPreset(e.target.value);
                            }}
                        >
                            <option value="" disabled>Select Preset...</option>
                            {presets.map(p => (
                                <option key={p.name} value={p.name}>{p.name}</option>
                            ))}
                        </select>
                        <div className="absolute right-2 top-2 pointer-events-none text-zinc-500">
                            <ChevronDown size={12} />
                        </div>
                    </div>
                    {presets.find(p => p.name === config.name) && (
                        <button 
                            onClick={() => handleDeletePreset(config.name)}
                            className="bg-red-900/20 border border-red-900/50 hover:bg-red-900/50 text-red-400 p-1.5 rounded-sm transition-colors"
                            title="Delete this preset"
                        >
                            <Trash2 size={14} />
                        </button>
                    )}
                    <button 
                       onClick={() => fileInputRef.current?.click()}
                       className="bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-200 px-2 rounded-sm transition-colors"
                       title="Import JSON"
                    >
                       <Upload size={14} />
                    </button>
                    <input type="file" ref={fileInputRef} className="hidden" accept=".json" onChange={handleFileChange} />
                  </div>
              </div>
           </SidebarSection>

           {/* 3. Effect Name Section - Minimized by default */}
           <SidebarSection 
             title="Effect Name" 
             icon={Tag} 
             isOpen={showEffectName} 
             onToggle={() => setShowEffectName(!showEffectName)}
             badge={config.name}
           >
              <div className="space-y-3">
                  <div className="flex gap-2">
                     <input 
                        type="text"
                        className="flex-1 bg-zinc-950 border border-zinc-700 rounded-sm p-1.5 text-xs text-indigo-300 font-mono focus:border-indigo-500 focus:outline-none font-bold"
                        value={config.name}
                        onChange={(e) => setConfig({ ...config, name: e.target.value.replace(/\s+/g, '') })}
                        placeholder="EffectName"
                     />
                     <button 
                        onClick={handleSavePreset}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white px-3 rounded-sm text-xs font-bold uppercase transition-colors shadow-md"
                    >
                        Save
                    </button>
                  </div>
              </div>
           </SidebarSection>

           {/* 4. Parameters Section (Controls) */}
           <Controls 
              config={config} 
              onChange={setConfig} 
              presets={presets}
           />
        </div>

        {/* MIDDLE PANEL: PREVIEW CANAVS */}
        <div className="flex-1 relative z-0 bg-black flex flex-col min-w-0 transition-all duration-300">
          <div className="absolute inset-0 z-0 pointer-events-none opacity-20" 
               style={{ backgroundImage: 'radial-gradient(#333 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
          </div>
          <div className="absolute top-4 left-4 z-10 pointer-events-none">
             <span className="text-[10px] font-mono text-zinc-500 bg-black/50 px-2 py-1 rounded border border-zinc-800 uppercase tracking-widest shadow-lg">
               Viewport
             </span>
          </div>
          <BabylonPreview config={config} />
        </div>

        {/* RIGHT PANEL: EXPORT & INFO */}
        <div 
            className={`
                bg-zinc-950 border-l border-zinc-800 flex flex-col shadow-[-10px_0_30px_rgba(0,0,0,0.5)] z-10 transition-all duration-300 ease-in-out
                ${isMobile ? 'fixed top-12 bottom-0 left-0 w-full z-40' : 'w-[380px] shrink-0'}
                ${!rightPanelOpen ? 'hidden' : 'flex'}
            `}
        >
           {/* Mobile Header for Panel */}
           {isMobile && (
               <div className="p-3 bg-zinc-900 border-b border-zinc-800 flex justify-between items-center shrink-0">
                   <span className="text-xs font-bold uppercase text-zinc-400">Export & Info</span>
                   <button onClick={() => setRightPanelOpen(false)}><X size={18} className="text-zinc-500" /></button>
               </div>
           )}

           <ExportPanel config={config} presets={presets} />
        </div>

      </div>

      {/* DOCUMENTATION MODAL */}
      {showDocs && (
          <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
             <div className="bg-zinc-900 w-full h-full max-w-6xl rounded-lg overflow-hidden flex flex-col relative shadow-2xl animate-in zoom-in-95 duration-200 border border-zinc-800">
                <div className="h-12 bg-zinc-950 border-b border-zinc-800 flex items-center justify-between px-4 shrink-0">
                   <div className="flex items-center gap-2 text-zinc-400">
                       <Book size={18} className="text-indigo-500" />
                       <span className="text-sm font-bold uppercase tracking-wide text-zinc-200">Documentation</span>
                   </div>
                   <button onClick={() => setShowDocs(false)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-zinc-800 text-zinc-500 hover:text-zinc-200 transition-colors">
                     <X size={20} />
                   </button>
                </div>
                <iframe srcDoc={DOCS_HTML} className="flex-1 w-full h-full border-0 bg-zinc-950" title="Documentation" />
             </div>
          </div>
      )}
    </div>
  );
}
