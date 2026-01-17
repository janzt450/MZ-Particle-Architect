
import { DEFAULT_TEXTURE } from './assets';

export interface Vector3Type {
  x: number;
  y: number;
  z: number;
}

export interface RampGradient {
  gradient: number; // 0.0 to 1.0
  color: string;    // Hex #RRGGBB
  opacity: number;  // 0.0 to 1.0
}

export interface ParticleConfig {
  name: string;
  // Emitter
  capacity: number;
  emitRate: number;
  
  // Lifecycle
  minLifeTime: number;
  maxLifeTime: number;
  
  // Size
  minSize: number;
  maxSize: number;
  
  // Speed & Force
  minEmitPower: number;
  maxEmitPower: number;
  updateSpeed: number;
  gravity: Vector3Type;
  
  // Colors (Simple Mode)
  color1: string;
  color2: string;
  colorDead: string;
  colorMidPoint: number; // 0.0 to 1.0
  
  // Transparency / Fading (Simple Mode)
  startAlpha: number;
  endAlpha: number;

  // Advanced Gradients
  useRampGradients: boolean;
  rampGradients: RampGradient[];
  
  // Emission Box
  direction1: Vector3Type;
  direction2: Vector3Type;
  minEmitBox: Vector3Type;
  maxEmitBox: Vector3Type;
  
  // Texture
  textureUrl: string;
  blendMode: 'ONEONE' | 'STANDARD';

  // Noise / Turbulence
  noiseTextureUrl?: string;
  noiseStrength?: Vector3Type;

  // Setup
  preWarmCycles: number;
}

export const DEFAULT_CONFIG: ParticleConfig = {
  name: "MagicSparkle",
  capacity: 2000,
  emitRate: 100,
  minLifeTime: 0.5,
  maxLifeTime: 1.5,
  minSize: 0.1,
  maxSize: 0.5,
  minEmitPower: 1,
  maxEmitPower: 3,
  updateSpeed: 0.01,
  gravity: { x: 0, y: -9.81, z: 0 },
  
  color1: "#ffffff",
  color2: "#ffaa00",
  colorDead: "#000000",
  startAlpha: 1.0,
  endAlpha: 0.0,
  colorMidPoint: 0.5,
  
  useRampGradients: false,
  rampGradients: [],

  direction1: { x: -1, y: 1, z: -1 },
  direction2: { x: 1, y: 1, z: 1 },
  minEmitBox: { x: -0.5, y: 0, z: -0.5 },
  maxEmitBox: { x: 0.5, y: 0, z: 0.5 },
  textureUrl: DEFAULT_TEXTURE,
  blendMode: 'ONEONE',
  
  noiseTextureUrl: "",
  noiseStrength: { x: 10, y: 10, z: 10 },

  preWarmCycles: 0
};
