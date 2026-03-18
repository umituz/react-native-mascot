/**
 * Data Transfer Objects
 * Used for data transfer between layers
 */

import type { MascotConfig, MascotState, MascotAppearance, MascotPersonality } from '../../domain/types/MascotTypes';

/**
 * Mascot DTO - simplified mascot data for presentation
 */
export interface MascotDTO {
  id: string;
  name: string;
  type: string;
  personality: MascotPersonality;
  appearance: MascotAppearance;
  state: MascotState;
  interactive: boolean;
  touchEnabled: boolean;
  soundEnabled: boolean;
}

/**
 * Animation State DTO
 */
export interface AnimationStateDTO {
  isPlaying: boolean;
  currentAnimation: string | null;
  progress: number;
  speed: number;
}

/**
 * Mascot Initialization Options DTO
 */
export interface MascotInitOptionsDTO {
  config?: MascotConfig;
  template?: string;
  autoInitialize?: boolean;
}

/**
 * Animation Playback Options DTO
 */
export interface AnimationPlaybackOptionsDTO {
  speed?: number;
  loop?: boolean;
  autoplay?: boolean;
  onStart?: () => void;
  onFinish?: () => void;
  onError?: (error: Error) => void;
}

/**
 * Mascot Update Options DTO
 */
export interface MascotUpdateOptionsDTO {
  mood?: string;
  energy?: number;
  friendliness?: number;
  playfulness?: number;
  baseColor?: string;
  accentColor?: string;
}
