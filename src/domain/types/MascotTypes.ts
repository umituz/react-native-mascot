/**
 * Mascot Types
 * Core type definitions for the mascot system
 */

export type MascotType = 'lottie' | 'svg' | 'custom';

export type MascotStyle = 'minimal' | 'cartoon' | 'realistic' | 'pixel';

export type MascotMood = 'happy' | 'sad' | 'excited' | 'thinking' | 'angry' | 'neutral' | 'surprised';

export type MascotAnimationType = 'idle' | 'action' | 'reaction' | 'transition';

export type AnimationSpeed = 'very-slow' | 'slow' | 'normal' | 'fast' | 'very-fast';

export interface MascotAppearance {
  baseColor: string;
  accentColor: string;
  secondaryColor?: string;
  accessories: MascotAccessory[];
  style: MascotStyle;
  scale?: number;
}

export interface MascotAccessory {
  id: string;
  type: 'glasses' | 'hat' | 'bow' | 'crown' | 'headphones' | 'mask' | 'custom';
  color?: string;
  position?: { x: number; y: number };
  visible?: boolean;
}

export interface MascotPersonality {
  mood: MascotMood;
  energy: number; // 0-1
  friendliness: number; // 0-1
  playfulness: number; // 0-1
}

export interface MascotAnimation {
  id: string;
  name: string;
  type: MascotAnimationType;
  source: string | object;
  loop: boolean;
  duration?: number;
  speed?: number;
  autoplay?: boolean;
}

export interface MascotConfig {
  id: string;
  name: string;
  type: MascotType;
  personality: MascotPersonality;
  appearance: MascotAppearance;
  animations: MascotAnimation[];
  interactive?: boolean;
  touchEnabled?: boolean;
  soundEnabled?: boolean;
}

export interface MascotState {
  currentMood: MascotMood;
  currentAnimation: string | null;
  isAnimating: boolean;
  isVisible: boolean;
  position?: { x: number; y: number };
}

export interface MascotInteraction {
  type: 'tap' | 'longPress' | 'drag' | 'pinch' | 'custom';
  handler: () => void | Promise<void>;
  animation?: string;
}
