
import React, { useState, useEffect } from 'react';
import { ParticleConfig, Vector3Type, RampGradient } from '../types';
import { TEXTURE_PRESETS, URL_CLOUD, NOISE_PRESETS } from '../assets';
import { Sliders, Palette, Wind, Box, FileImage, ChevronDown, ChevronRight, MoveVertical, MoveHorizontal, Clock, Droplets, Download, Plus, Image as ImageIcon, Waves, X, Sparkles, Flame, Snowflake, Rainbow, ArrowUpCircle, ArrowDownCircle, Globe, Target, Maximize, Minimize2, MousePointer2, Anchor, CloudFog } from 'lucide-react';

interface ControlsProps {
  config: ParticleConfig;
  onChange: (newConfig: ParticleConfig) => void;
  presets: ParticleConfig[];
}

// --- CONSTANTS ---
const GRADIENT_PRESETS = [
    {
        name: "Fire",
        icon: Flame,
        color: "text-orange-400",
        stops: [
            { gradient: 0, color: '#FFFFFF', opacity: 0 },
            { gradient: 0.1, color: '#FFD700', opacity: 1 },
            { gradient: 0.4, color: '#FF4500', opacity: 1 },
            { gradient: 1.0, color: '#000000', opacity: 0 }
        ]
    },
    {
        name: "Ice",
        icon: Snowflake,
        color: "text-cyan-300",
        stops: [
            { gradient: 0, color: '#FFFFFF', opacity: 0 },
            { gradient: 0.2, color: '#00FFFF', opacity: 0.8 },
            { gradient: 0.5, color: '#0088FF', opacity: 0.5 },
            { gradient: 1.0, color: '#000066', opacity: 0 }
        ]
    },
    {
        name: "Rainbow",
        icon: Rainbow,
        color: "text-pink-400",
        stops: [
            { gradient: 0.0, color: '#FF0000', opacity: 1 },
            { gradient: 0.2, color: '#FFFF00', opacity: 1 },
            { gradient: 0.4, color: '#00FF00', opacity: 1 },
            { gradient: 0.6, color: '#00FFFF', opacity: 1 },
            { gradient: 0.8, color: '#0000FF', opacity: 1 },
            { gradient: 1.0, color: '#FF00FF', opacity: 0 }
        ]
    },
    {
        name: "Fade Out",
        icon: Droplets,
        color: "text-zinc-400",
        stops: [
            { gradient: 0, color: '#FFFFFF', opacity: 1 },
            { gradient: 1, color: '#FFFFFF', opacity: 0 }
        ]
    }
];

const Section = ({ title, icon: Icon, children, defaultOpen = false }: { title: string, icon: any, children?: React.ReactNode, defaultOpen?: boolean }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-zinc-800 last:border-0">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center w-full p-3.5 text-xs font-bold text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 transition-colors uppercase tracking-wider"
      >
        {isOpen ? <ChevronDown size={14} className="mr-2" /> : <ChevronRight size={14} className="mr-2" />}
        <Icon size={16} className="mr-2 text-indigo-500" />
        {title}
      </button>
      {isOpen && (
        <div className="p-4 bg-zinc-900/30 space-y-5 animate-in fade-in slide-in-from-top-1">
          {children}
        </div>
      )}
    </div>
  );
};

const SliderControl = ({ label, value, onChange, min, max, step = 0.1, unit = "" }: { label: string, value: number, onChange: (val: number) => void, min: number, max: number, step?: number, unit?: string }) => {
  const safeVal = value ?? 0;
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label className="text-xs uppercase text-zinc-400 font-mono font-bold tracking-tight">{label}</label>
        <div className="flex items-center gap-1 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
             <input 
                type="number"
                className="bg-transparent text-xs font-mono text-indigo-400 font-bold focus:outline-none focus:text-indigo-300 w-14 text-right appearance-none"
                value={safeVal}
                onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    if (!isNaN(val)) onChange(val);
                }}
                step={step}
             />
             <span className="text-[11px] font-mono text-indigo-400/70 select-none">{unit}</span>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <input 
          type="range" min={min} max={max} step={step}
          className="flex-1 h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-indigo-500 hover:accent-indigo-400"
          value={safeVal} 
          onChange={(e) => onChange(parseFloat(e.target.value))} 
        />
      </div>
    </div>
  );
};

const DebouncedColorPicker = ({ label, value, onChange }: { label: string, value: string, onChange: (val: string) => void }) => {
  const [localColor, setLocalColor] = useState(value);
  useEffect(() => { setLocalColor(value); }, [value]);
  useEffect(() => {
    const handler = setTimeout(() => {
      if (localColor !== value) onChange(localColor);
    }, 600);
    return () => clearTimeout(handler);
  }, [localColor, value, onChange]);

  return (
    <div className="flex items-center justify-between bg-zinc-950 p-2.5 rounded border border-zinc-800">
        <span className="text-xs font-bold font-mono text-zinc-400 uppercase tracking-tight">{label}</span>
        <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-zinc-500 uppercase">{localColor}</span>
            <div className="w-9 h-9 rounded overflow-hidden border border-zinc-700 relative shadow-md">
                <div className="absolute inset-0 pointer-events-none" style={{backgroundColor: localColor}} />
                <input type="color" className="absolute -top-4 -left-4 w-20 h-20 cursor-pointer opacity-0" value={localColor} onChange={e => setLocalColor(e.target.value)} />
            </div>
        </div>
    </div>
  );
};

const QuickAction = ({ icon: Icon, label, onClick, title }: any) => (
  <button 
    onClick={onClick}
    className="flex flex-col items-center justify-center gap-2 p-3 bg-zinc-900 border border-zinc-800 rounded hover:bg-zinc-800 hover:border-zinc-700 hover:text-zinc-200 text-zinc-500 transition-all group shadow-sm"
    title={title}
  >
    <Icon size={18} className="group-hover:text-indigo-400 transition-colors" />
    <span className="text-[10px] font-bold uppercase tracking-widest">{label}</span>
  </button>
);

const Controls: React.FC<ControlsProps> = ({ config, onChange }) => {
  // Custom Textures State
  const [customTextures, setCustomTextures] = useState<{name: string, url: string}[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('mz_custom_textures');
    if (saved) { try { setCustomTextures(JSON.parse(saved)); } catch (e) { console.error(e); } }
  }, []);

  const saveCustomTexture = () => {
      const name = prompt("Enter a name for this custom shape:", "MyShape");
      if (!name) return;
      const newTexture = { name, url: config.textureUrl };
      setCustomTextures(prev => {
          const updated = [...prev, newTexture];
          localStorage.setItem('mz_custom_textures', JSON.stringify(updated));
          return updated;
      });
  };

  const updateField = (key: keyof ParticleConfig, value: any) => {
    onChange({ ...config, [key]: value });
  };

  const updateVector = (key: keyof ParticleConfig, axis: keyof Vector3Type, value: number) => {
    const vector = { ...(config[key] as Vector3Type) };
    vector[axis] = value;
    onChange({ ...config, [key]: vector });
  };

  const setStatic = () => {
    onChange({ ...config, minEmitPower: 0, maxEmitPower: 0, gravity: { x: 0, y: 0, z: 0 } });
  };

  const setFoggy = () => {
    onChange({
        ...config, capacity: 1500, emitRate: 250, minLifeTime: 4, maxLifeTime: 6, minEmitPower: 0.1, maxEmitPower: 0.3, updateSpeed: 0.01,
        gravity: { x: 0, y: 0, z: 0 }, direction1: { x: -1, y: -0.2, z: -1 }, direction2: { x: 1, y: 0.2, z: 1 }, textureUrl: URL_CLOUD
    });
  };

  // --- RAMP GRADIENT HELPERS ---
  const addGradient = () => {
    const grads = config.rampGradients ? [...config.rampGradients] : [];
    grads.push({ gradient: 0.5, color: '#FFFFFF', opacity: 1.0 });
    grads.sort((a,b) => a.gradient - b.gradient);
    updateField('rampGradients', grads);
  };

  const removeGradient = (index: number) => {
    const grads = config.rampGradients ? [...config.rampGradients] : [];
    grads.splice(index, 1);
    updateField('rampGradients', grads);
  };

  const updateGradient = (index: number, field: keyof RampGradient, val: any) => {
    const grads = config.rampGradients ? [...config.rampGradients] : [];
    grads[index] = { ...grads[index], [field]: val };
    updateField('rampGradients', grads);
  };

  const applyPreset = (preset: typeof GRADIENT_PRESETS[0]) => {
      updateField('rampGradients', preset.stops.map(s => ({...s})));
  };

  const getGradientCss = (gradients: RampGradient[]) => {
      if (!gradients || gradients.length === 0) return 'linear-gradient(to right, #000, #fff)';
      const sorted = [...gradients].sort((a, b) => a.gradient - b.gradient);
      const stops = sorted.map(g => {
          const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(g.color);
          const rgb = result ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) } : { r: 255, g: 255, b: 255 };
          return `rgba(${rgb.r},${rgb.g},${rgb.b},${g.opacity}) ${g.gradient * 100}%`;
      });
      return `linear-gradient(to right, ${stops.join(', ')})`;
  };

  const getBoxSize = (axis: keyof Vector3Type) => config.maxEmitBox[axis] - config.minEmitBox[axis];
  const updateBoxSize = (axis: keyof Vector3Type, newSize: number) => {
    const center = (config.maxEmitBox[axis] + config.minEmitBox[axis]) / 2;
    const half = newSize / 2;
    const min = { ...config.minEmitBox };
    const max = { ...config.maxEmitBox };
    min[axis] = center - half;
    max[axis] = center + half;
    onChange({ ...config, minEmitBox: min, maxEmitBox: max });
  };
  
  const getDirBase = (axis: keyof Vector3Type) => (config.direction1[axis] + config.direction2[axis]) / 2;
  const updateDirBase = (axis: keyof Vector3Type, val: number) => {
    const spread = Math.abs(config.direction2[axis] - config.direction1[axis]) / 2;
    const d1 = { ...config.direction1 };
    const d2 = { ...config.direction2 };
    d1[axis] = val - spread;
    d2[axis] = val + spread;
    onChange({ ...config, direction1: d1, direction2: d2 });
  };

  const getDirSpread = (axis: keyof Vector3Type) => Math.abs(config.direction2[axis] - config.direction1[axis]) / 2;
  const updateDirSpread = (axis: keyof Vector3Type, val: number) => {
    const base = (config.direction1[axis] + config.direction2[axis]) / 2;
    const d1 = { ...config.direction1 };
    const d2 = { ...config.direction2 };
    d1[axis] = base - val;
    d2[axis] = base + val;
    onChange({ ...config, direction1: d1, direction2: d2 });
  };

  return (
    <>
        {/* New Shape Preview Overlay */}
        {(() => {
            const isPreset = TEXTURE_PRESETS.some(p => p.url === config.textureUrl);
            const isLibrary = customTextures.some(p => p.url === config.textureUrl);
            if (config.textureUrl && config.textureUrl.length > 5 && !isPreset) {
                return (
                    <div className="mx-4 mt-4 mb-4 bg-indigo-900/20 border border-indigo-500/40 p-4 rounded-xl flex items-center gap-4 relative overflow-hidden shadow-lg">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                        <div className="w-14 h-14 rounded-lg bg-zinc-950 border border-indigo-500/50 flex items-center justify-center relative overflow-hidden shrink-0 shadow-inner">
                            <div className="absolute inset-0 opacity-20" style={{backgroundImage: 'linear-gradient(45deg, #333 25%, transparent 25%), linear-gradient(-45deg, #333 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #333 75%), linear-gradient(-45deg, transparent 75%, #333 75%)', backgroundSize: '8px 8px'}}></div>
                            <img src={config.textureUrl} className="w-12 h-12 object-contain z-10" alt="Preview" />
                        </div>
                        <div className="flex-1 min-w-0 z-10">
                            <div className="text-xs font-bold text-indigo-300 uppercase truncate flex items-center gap-2 mb-2">
                                <Sparkles size={14} className="text-amber-400 animate-pulse" />
                                <span className="text-amber-100 tracking-wider">Dynamic Texture</span>
                            </div>
                            {!isLibrary && (
                                <button onClick={saveCustomTexture} className="flex items-center gap-2 text-[10px] bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-lg font-bold uppercase transition-colors shadow-md active:scale-95">
                                    <Plus size={12} /> Save Shape
                                </button>
                            )}
                        </div>
                    </div>
                );
            }
            return null;
        })()}

        <Section title="Shape & Texture" icon={FileImage} defaultOpen={false}>
            <div className="space-y-4">
                <div className="grid grid-cols-4 gap-2.5">
                {TEXTURE_PRESETS.map((tex) => (
                    <button
                    key={tex.name}
                    onClick={() => updateField('textureUrl', tex.url)}
                    className={`flex flex-col items-center gap-2 p-2.5 rounded-lg border transition-all ${config.textureUrl === tex.url ? 'bg-indigo-600/20 border-indigo-500 text-indigo-200' : 'bg-zinc-950 border-zinc-800 text-zinc-500 hover:bg-zinc-900 hover:border-zinc-700'}`}
                    >
                    <div className="w-10 h-10 rounded bg-black flex items-center justify-center overflow-hidden border border-zinc-800 relative">
                        <img src={tex.url} alt={tex.name} className="w-8 h-8 object-contain z-10" />
                    </div>
                    <span className="text-[10px] uppercase font-bold tracking-tight truncate w-full text-center">{tex.name}</span>
                    </button>
                ))}
                </div>
                <div className="space-y-2.5 pt-4 border-t border-zinc-800/50">
                    <label className="text-xs uppercase text-zinc-400 font-mono font-bold tracking-tight">Blend Mode</label>
                    <select className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2.5 text-xs text-zinc-200 font-mono font-bold focus:border-indigo-500 transition-all" value={config.blendMode} onChange={(e) => updateField('blendMode', e.target.value)}>
                        <option value="ONEONE">Additive (Glow)</option>
                        <option value="STANDARD">Standard (Alpha)</option>
                    </select>
                </div>
            </div>
        </Section>

        <Section title="Turbulence (Noise)" icon={Waves} defaultOpen={false}>
            <div className="space-y-4">
                <div className="grid grid-cols-2 gap-2.5">
                    {NOISE_PRESETS.map((p, i) => (
                         <button key={i} onClick={() => updateField('noiseTextureUrl', p.url)} className={`flex items-center justify-center p-3 rounded-lg border transition-all text-xs font-mono font-bold uppercase ${config.noiseTextureUrl === p.url ? 'bg-indigo-600/20 border-indigo-500 text-indigo-200' : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:bg-zinc-800'}`}>
                            {p.name}
                         </button>
                    ))}
                </div>
                {config.noiseTextureUrl && (
                    <div className="space-y-4 pt-4 border-t border-zinc-800 animate-in fade-in">
                        <SliderControl label="Turbulence X" value={config.noiseStrength?.x ?? 10} onChange={v => updateVector('noiseStrength', 'x', v)} min={0} max={100} step={1} />
                        <SliderControl label="Turbulence Y" value={config.noiseStrength?.y ?? 10} onChange={v => updateVector('noiseStrength', 'y', v)} min={0} max={100} step={1} />
                    </div>
                )}
            </div>
        </Section>

        <Section title="Emitter & Flow" icon={Box} defaultOpen={false}>
            <div className="space-y-6">
                <div className="space-y-4">
                    <label className="text-xs uppercase text-zinc-400 font-mono font-bold tracking-widest">Spawn Volume</label>
                    <div className="space-y-3">
                        <SliderControl label="Width (X)" value={getBoxSize('x')} onChange={v => updateBoxSize('x', v)} min={0} max={10} step={0.1} />
                        <SliderControl label="Height (Y)" value={getBoxSize('y')} onChange={v => updateBoxSize('y', v)} min={0} max={10} step={0.1} />
                    </div>
                </div>
                <div className="space-y-4 border-t border-zinc-800 pt-4">
                    <label className="text-xs uppercase text-zinc-400 font-mono font-bold tracking-widest">Velocity Vectors</label>
                    <div className="grid grid-cols-1 gap-4">
                        <div className="grid grid-cols-2 gap-4">
                            <SliderControl label="Dir X" value={getDirBase('x')} onChange={v => updateDirBase('x', v)} min={-5} max={5} step={0.1} />
                            <SliderControl label="Spread X" value={getDirSpread('x')} onChange={v => updateDirSpread('x', v)} min={0} max={5} step={0.1} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <SliderControl label="Dir Y" value={getDirBase('y')} onChange={v => updateDirBase('y', v)} min={-5} max={5} step={0.1} />
                            <SliderControl label="Spread Y" value={getDirSpread('y')} onChange={v => updateDirSpread('y', v)} min={0} max={5} step={0.1} />
                        </div>
                    </div>
                </div>
            </div>
        </Section>

        <Section title="Physics & Time" icon={Wind} defaultOpen={false}>
            <div className="space-y-5">
                <SliderControl label="Sim Speed" value={config.updateSpeed} onChange={v => updateField('updateSpeed', v)} min={0.001} max={0.06} step={0.001} />
                <SliderControl label="Pre-warm" value={config.preWarmCycles ?? 0} onChange={v => updateField('preWarmCycles', v)} min={0} max={20000} step={100} unit=" cyc" />
                <div className="grid grid-cols-2 gap-3">
                    <QuickAction icon={Anchor} label="Freeze" onClick={setStatic} />
                    <QuickAction icon={CloudFog} label="Drift" onClick={setFoggy} />
                </div>
                <div className="space-y-4 pt-4 border-t border-zinc-800">
                    <SliderControl label="Gravity Y" value={config.gravity.y} onChange={v => updateVector('gravity', 'y', v)} min={-20} max={20} step={0.5} />
                    <SliderControl label="Wind X" value={config.gravity.x} onChange={v => updateVector('gravity', 'x', v)} min={-10} max={10} step={0.5} />
                </div>
            </div>
        </Section>

        <Section title="Size & Life" icon={Sliders} defaultOpen={false}>
            <div className="space-y-5">
                <SliderControl label="Min Size" value={config.minSize} onChange={v => updateField('minSize', v)} min={0.01} max={5} step={0.01} />
                <SliderControl label="Max Size" value={config.maxSize} onChange={v => updateField('maxSize', v)} min={0.01} max={5} step={0.01} />
                <div className="h-px bg-zinc-800" />
                <SliderControl label="Min Lifetime" value={config.minLifeTime} onChange={v => updateField('minLifeTime', v)} min={0.1} max={10} unit="s" />
                <SliderControl label="Max Lifetime" value={config.maxLifeTime} onChange={v => updateField('maxLifeTime', v)} min={0.1} max={10} unit="s" />
                <div className="h-px bg-zinc-800" />
                <SliderControl label="Capacity" value={config.capacity} onChange={v => updateField('capacity', v)} min={1} max={2000} step={1} />
                <SliderControl label="Rate" value={config.emitRate} onChange={v => updateField('emitRate', v)} min={1} max={2000} step={1} />
            </div>
        </Section>

        <Section title="Color & Fade" icon={Palette} defaultOpen={false}>
            <div className="space-y-5">
                <div className="flex bg-zinc-900 rounded-lg p-1.5 border border-zinc-800 shadow-inner">
                    <button onClick={() => updateField('useRampGradients', false)} className={`flex-1 py-2 text-xs font-bold uppercase rounded-md transition-all ${!config.useRampGradients ? 'bg-zinc-700 text-white shadow' : 'text-zinc-500 hover:text-zinc-400'}`}>Simple</button>
                    <button onClick={() => updateField('useRampGradients', true)} className={`flex-1 py-2 text-xs font-bold uppercase rounded-md transition-all ${config.useRampGradients ? 'bg-indigo-600 text-white shadow' : 'text-zinc-500 hover:text-zinc-400'}`}>Ramp</button>
                </div>
                {!config.useRampGradients ? (
                    <div className="space-y-4 animate-in fade-in">
                        <DebouncedColorPicker label="Start Color" value={config.color1} onChange={v => updateField('color1', v)} />
                        <DebouncedColorPicker label="End Color" value={config.colorDead} onChange={v => updateField('colorDead', v)} />
                        <SliderControl label="Start Opacity" value={config.startAlpha} onChange={v => updateField('startAlpha', v)} min={0} max={1} step={0.05} />
                        <SliderControl label="End Opacity" value={config.endAlpha} onChange={v => updateField('endAlpha', v)} min={0} max={1} step={0.05} />
                    </div>
                ) : (
                    <div className="space-y-5 animate-in fade-in">
                        <div className="h-7 w-full rounded-lg ring-1 ring-zinc-700 relative overflow-hidden bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAYAAADED76LAAAAFElEQVQYV2N89+7df2RkZISwAS0AAJ5OOCeqj7+7AAAAAElFTkSuQmCC')] shadow-inner">
                            <div className="absolute inset-0 transition-all duration-300" style={{ background: getGradientCss(config.rampGradients) }} />
                        </div>
                        <div className="flex justify-between items-center px-0.5">
                             <button onClick={addGradient} className="text-xs bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-lg text-white font-bold flex items-center gap-2 shadow-md active:scale-95 transition-transform"><Plus size={14} /> Add Stop</button>
                             <div className="text-[10px] text-zinc-500 font-mono uppercase font-bold tracking-widest">Gradients ({config.rampGradients?.length || 0})</div>
                        </div>
                        <div className="space-y-2 max-h-[300px] overflow-y-auto custom-scrollbar pr-1">
                             {config.rampGradients?.map((g, i) => (
                                 <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 flex items-center gap-3 shadow-sm">
                                     <div className="relative w-10 h-10 shrink-0 rounded-lg border border-zinc-700 overflow-hidden shadow-md"><input type="color" value={g.color} onChange={(e) => updateGradient(i, 'color', e.target.value)} className="absolute -top-4 -left-4 w-20 h-20 cursor-pointer" /></div>
                                     <div className="flex-1 space-y-2">
                                         <div className="flex items-center gap-2">
                                             <span className="text-[9px] text-zinc-500 font-mono font-bold uppercase w-8">Grad</span>
                                             <input type="range" min={0} max={1} step={0.01} value={g.gradient} onChange={(e) => updateGradient(i, 'gradient', parseFloat(e.target.value))} className="w-full h-1.5 accent-indigo-500" />
                                         </div>
                                         <div className="flex items-center gap-2">
                                             <span className="text-[9px] text-zinc-500 font-mono font-bold uppercase w-8">Alpha</span>
                                             <input type="range" min={0} max={1} step={0.01} value={g.opacity} onChange={(e) => updateGradient(i, 'opacity', parseFloat(e.target.value))} className="w-full h-1.5 accent-blue-400" />
                                         </div>
                                     </div>
                                     <button onClick={() => removeGradient(i)} className="p-2 text-zinc-600 hover:text-red-400 hover:bg-red-400/10 rounded-full transition-all"><X size={16} /></button>
                                 </div>
                             ))}
                        </div>
                    </div>
                )}
            </div>
        </Section>
    </>
  );
};

export default Controls;
