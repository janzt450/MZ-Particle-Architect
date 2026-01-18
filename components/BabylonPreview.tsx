import React, { useEffect, useRef, useState } from 'react';
import { 
  Engine, 
  Scene, 
  Vector3, 
  Color4, 
  Color3, 
  ArcRotateCamera, 
  HemisphericLight, 
  MeshBuilder, 
  ParticleSystem, 
  Texture, 
  LinesMesh,
  UtilityLayerRenderer,
  TransformNode
} from '@babylonjs/core';
import { ParticleConfig } from '../types';
import { Play, Pause, RotateCcw, Grid, Sun, Moon, Monitor, Minimize2 } from 'lucide-react';

interface BabylonPreviewProps {
  config: ParticleConfig;
}

type BgType = 'dark' | 'black' | 'light';

const BabylonPreview: React.FC<BabylonPreviewProps> = ({ config }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<Engine | null>(null);
  const sceneRef = useRef<Scene | null>(null);
  const systemRef = useRef<ParticleSystem | null>(null);
  const gridMeshRef = useRef<LinesMesh | null>(null);
  const widgetRootRef = useRef<TransformNode | null>(null);

  // UI State
  const [isPlaying, setIsPlaying] = useState(true);
  const [showGrid, setShowGrid] = useState(true);
  const [bgType, setBgType] = useState<BgType>('dark');
  const [showWidget, setShowWidget] = useState(false); // Default to false (minimized/invisible)

  // Helper to create a custom grid using Lines
  const createLineGrid = (scene: Scene, size: number = 20, divisions: number = 20) => {
      const color = new Color3(0.3, 0.3, 0.35); 
      const centerColor = new Color3(0.5, 0.3, 0.3); 
      
      const points: Vector3[][] = [];
      const colors: Color4[][] = [];
      
      const step = size / divisions;
      const halfSize = size / 2;

      for (let i = 0; i <= divisions; i++) {
          const p = -halfSize + (i * step);
          points.push([new Vector3(p, 0, -halfSize), new Vector3(p, 0, halfSize)]);
          points.push([new Vector3(-halfSize, 0, p), new Vector3(halfSize, 0, p)]);
          const isCenter = Math.abs(p) < 0.001;
          const c = isCenter ? centerColor : color;
          // Fix: Use c.b instead of b
          const c4 = new Color4(c.r, c.g, c.b, 0.5); 
          colors.push([c4, c4]);
          colors.push([c4, c4]);
      }

      return MeshBuilder.CreateLineSystem("grid", {
          lines: points,
          colors: colors,
          useVertexAlpha: true
      }, scene);
  };

  const createXYZWidget = (scene: Scene) => {
    // Utility layer for overlay UI
    const utilLayer = new UtilityLayerRenderer(scene);
    utilLayer.utilityLayerScene.autoClearDepthAndStencil = false;

    const root = new TransformNode("widgetRoot", utilLayer.utilityLayerScene);
    
    // X - Red
    const xLine = MeshBuilder.CreateLines("xLine", {
      points: [Vector3.Zero(), new Vector3(1, 0, 0)],
      colors: [new Color4(1, 0, 0, 1), new Color4(1, 0, 0, 1)]
    }, utilLayer.utilityLayerScene);
    xLine.parent = root;

    // Y - Green
    const yLine = MeshBuilder.CreateLines("yLine", {
      points: [Vector3.Zero(), new Vector3(0, 1, 0)],
      colors: [new Color4(0, 1, 0, 1), new Color4(0, 1, 0, 1)]
    }, utilLayer.utilityLayerScene);
    yLine.parent = root;

    // Z - Blue
    const zLine = MeshBuilder.CreateLines("zLine", {
      points: [Vector3.Zero(), new Vector3(0, 0, 1)],
      colors: [new Color4(0, 0.5, 1, 1), new Color4(0, 0.5, 1, 1)]
    }, utilLayer.utilityLayerScene);
    zLine.parent = root;

    // Small center sphere
    const sphere = MeshBuilder.CreateSphere("widgetSphere", { diameter: 0.1 }, utilLayer.utilityLayerScene);
    sphere.parent = root;

    return root;
  };

  const toHexAlpha = (alpha: number) => {
    const a = Math.max(0, Math.min(1, alpha));
    return Math.floor(a * 255).toString(16).padStart(2, '0').toUpperCase();
  };

  useEffect(() => {
    if (!canvasRef.current || engineRef.current) return;

    const engine = new Engine(canvasRef.current, true, {
      preserveDrawingBuffer: true,
      stencil: true
    });
    
    const scene = new Scene(engine);
    scene.clearColor = new Color4(0.1, 0.1, 0.12, 1);

    const camera = new ArcRotateCamera(
      "camera1",
      Math.PI / 2,
      Math.PI / 2.5,
      15,
      Vector3.Zero(),
      scene
    );
    camera.attachControl(canvasRef.current, true);
    camera.wheelPrecision = 50;

    new HemisphericLight("light1", new Vector3(0, 1, 0), scene);
    
    const grid = createLineGrid(scene);
    gridMeshRef.current = grid;

    const widget = createXYZWidget(scene);
    widgetRootRef.current = widget;

    engineRef.current = engine;
    sceneRef.current = scene;

    engine.runRenderLoop(() => {
      if (scene) scene.render();
      if (widget && scene.activeCamera) {
        // Match camera rotation but keep at origin
        widget.rotationQuaternion = scene.activeCamera.absoluteRotation;
      }
    });

    // Replace window resize listener with ResizeObserver on the canvas container
    // This allows the canvas to resize when UI panels collapse/expand
    const resizeObserver = new ResizeObserver(() => {
        engine.resize();
    });

    if (canvasRef.current) {
        resizeObserver.observe(canvasRef.current);
    }

    return () => {
      resizeObserver.disconnect();
      engine.stopRenderLoop();
      if (scene) scene.dispose();
      if (engine) engine.dispose();
      engineRef.current = null;
      sceneRef.current = null;
      systemRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!sceneRef.current) return;

    if (systemRef.current) {
      systemRef.current.dispose();
      systemRef.current = null;
    }

    const ps = new ParticleSystem("particles", config.capacity, sceneRef.current);
    try {
      ps.particleTexture = new Texture(config.textureUrl, sceneRef.current);
    } catch (e) {}

    if (config.noiseTextureUrl) {
       try {
           const noiseTex = new Texture(config.noiseTextureUrl, sceneRef.current);
           const fallbackData = new Uint8Array(4096);
           Object.defineProperty(noiseTex, "getContent", {
               value: () => Promise.resolve(fallbackData),
               writable: true,
               configurable: true
           });
           noiseTex.onLoadObservable.add(() => {
               if (noiseTex.readPixels) {
                   noiseTex.readPixels()!
                       .then((data) => {
                           if (data) {
                               // @ts-ignore
                               noiseTex.getContent = () => Promise.resolve(data);
                           }
                       })
                       .catch(e => { console.warn("Noise texture read failed.", e); });
               }
           });
           // Cast to any to bypass strict ProceduralTexture type requirement for noiseTexture
           ps.noiseTexture = noiseTex as any;
           ps.noiseStrength = new Vector3(config.noiseStrength?.x ?? 10, config.noiseStrength?.y ?? 10, config.noiseStrength?.z ?? 10);
       } catch (e) {}
    }

    ps.emitter = Vector3.Zero();
    ps.minEmitBox = new Vector3(config.minEmitBox.x, config.minEmitBox.y, config.minEmitBox.z);
    ps.maxEmitBox = new Vector3(config.maxEmitBox.x, config.maxEmitBox.y, config.maxEmitBox.z);

    if (config.useRampGradients && config.rampGradients && config.rampGradients.length > 0) {
        config.rampGradients.forEach(grad => {
            const hexAlpha = toHexAlpha(grad.opacity);
            const color = Color4.FromHexString(grad.color + hexAlpha);
            ps.addColorGradient(grad.gradient, color);
        });
    } else {
        const startHex = toHexAlpha(config.startAlpha ?? 1);
        const endHex = toHexAlpha(config.endAlpha ?? 0);
        ps.addColorGradient(0.0, Color4.FromHexString(config.color1 + startHex));
        ps.addColorGradient(config.colorMidPoint ?? 0.5, Color4.FromHexString(config.color2 + endHex));
        ps.addColorGradient(1.0, Color4.FromHexString(config.colorDead + "00"));
    }

    ps.minSize = config.minSize;
    ps.maxSize = config.maxSize;
    ps.minLifeTime = config.minLifeTime;
    ps.maxLifeTime = config.maxLifeTime;
    ps.emitRate = config.emitRate;
    ps.blendMode = config.blendMode === 'ONEONE' ? ParticleSystem.BLENDMODE_ONEONE : ParticleSystem.BLENDMODE_STANDARD;
    ps.gravity = new Vector3(config.gravity.x, config.gravity.y, config.gravity.z);
    ps.direction1 = new Vector3(config.direction1.x, config.direction1.y, config.direction1.z);
    ps.direction2 = new Vector3(config.direction2.x, config.direction2.y, config.direction2.z);
    ps.minEmitPower = config.minEmitPower;
    ps.maxEmitPower = config.maxEmitPower;
    ps.updateSpeed = config.updateSpeed;

    if (config.preWarmCycles && config.preWarmCycles > 0) {
        ps.preWarmCycles = config.preWarmCycles;
        ps.preWarmStepOffset = 10;
    }

    if (isPlaying) ps.start();
    systemRef.current = ps;
  }, [config]);

  useEffect(() => {
      if (sceneRef.current) {
          let c = new Color4(0.1, 0.1, 0.12, 1);
          if (bgType === 'black') c = new Color4(0, 0, 0, 1);
          if (bgType === 'light') c = new Color4(0.8, 0.8, 0.85, 1);
          sceneRef.current.clearColor = c;
      }
      if (gridMeshRef.current) gridMeshRef.current.setEnabled(showGrid);
      if (widgetRootRef.current) {
        widgetRootRef.current.setEnabled(showWidget);
      }
      if (systemRef.current) {
          if (isPlaying && !systemRef.current.isStarted()) systemRef.current.start();
          else if (!isPlaying && systemRef.current.isStarted()) systemRef.current.stop();
      }
  }, [bgType, showGrid, isPlaying, showWidget]);

  const handleRestart = () => {
      if (systemRef.current) {
          systemRef.current.stop();
          systemRef.current.reset();
          systemRef.current.start();
          setIsPlaying(true);
      }
  };

  return (
    <div className="w-full h-full relative group">
       <canvas ref={canvasRef} className="w-full h-full outline-none block" />
       
       {/* XYZ Orientation Widget */}
       <div 
          onClick={() => setShowWidget(!showWidget)}
          className={`absolute top-4 right-4 bg-zinc-900/90 backdrop-blur-md border border-zinc-700/50 rounded-md transition-all flex flex-col items-center justify-center shadow-lg z-10 hover:border-zinc-600 hover:bg-zinc-800 group ${showWidget ? 'w-24 h-24 gap-1 cursor-default' : 'w-10 h-10 cursor-pointer'}`}
       >
          {showWidget ? (
            <>
               <div className="w-full flex justify-between items-center px-2 mb-1 cursor-pointer hover:bg-zinc-800/50 rounded-t-md py-1" onClick={(e) => { e.stopPropagation(); setShowWidget(false); }}>
                  <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest text-shadow-sm">GIZMO</span>
                  <Minimize2 size={10} className="text-zinc-500 hover:text-zinc-300" />
               </div>
               
               <div className="flex-1 w-full flex flex-col justify-center items-center gap-1.5 opacity-0 animate-in fade-in duration-500">
                  {/* Legend */}
                  <div className="flex gap-2">
                      <div className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_4px_#ef4444]"></div><span className="text-[8px] text-zinc-400 font-bold">X</span></div>
                      <div className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_4px_#22c55e]"></div><span className="text-[8px] text-zinc-400 font-bold">Y</span></div>
                      <div className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_4px_#3b82f6]"></div><span className="text-[8px] text-zinc-400 font-bold">Z</span></div>
                   </div>
               </div>
            </>
          ) : (
             <span className="text-[10px] font-bold font-mono text-zinc-500 group-hover:text-zinc-300 uppercase tracking-widest">XYZ</span>
          )}
       </div>

       {/* Toolbar */}
       <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-zinc-900/90 backdrop-blur-md border border-zinc-700 shadow-2xl rounded-full p-1.5 flex items-center gap-1 z-50">
          <button onClick={() => setIsPlaying(!isPlaying)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-zinc-700 text-zinc-200" title={isPlaying ? "Pause" : "Play"}>
             {isPlaying ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" />}
          </button>
          <button onClick={handleRestart} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-zinc-700 text-zinc-200" title="Restart">
             <RotateCcw size={16} />
          </button>
          <div className="w-px h-4 bg-zinc-700 mx-1"></div>
          <button onClick={() => setShowGrid(!showGrid)} className={`w-8 h-8 flex items-center justify-center rounded-full transition-colors ${showGrid ? 'text-indigo-400 bg-indigo-500/10' : 'text-zinc-500 hover:text-zinc-300'}`} title="Toggle Grid">
             <Grid size={16} />
          </button>
          <div className="w-px h-4 bg-zinc-700 mx-1"></div>
          <div className="flex bg-zinc-950 rounded-full p-0.5 border border-zinc-800">
             <button onClick={() => setBgType('black')} className={`w-6 h-6 flex items-center justify-center rounded-full transition-all ${bgType === 'black' ? 'bg-zinc-800 text-white' : 'text-zinc-600 hover:text-zinc-400'}`} title="Black Background">
                <Monitor size={12} />
             </button>
             <button onClick={() => setBgType('dark')} className={`w-6 h-6 flex items-center justify-center rounded-full transition-all ${bgType === 'dark' ? 'bg-zinc-800 text-white' : 'text-zinc-600 hover:text-zinc-400'}`} title="Dark Background">
                <Moon size={12} />
             </button>
             <button onClick={() => setBgType('light')} className={`w-6 h-6 flex items-center justify-center rounded-full transition-all ${bgType === 'light' ? 'bg-zinc-200 text-black' : 'text-zinc-600 hover:text-zinc-400'}`} title="Light Background">
                <Sun size={12} />
             </button>
          </div>
       </div>
    </div>
  );
};

export default BabylonPreview;