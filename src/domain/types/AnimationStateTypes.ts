/**
 * Animation State Types
 * State-based animation system inspired by AIStylistMascot implementation
 */

/**
 * Predefined animation states with specific behaviors
 */
export type MascotAnimationState =
  | 'idle'       // Calm breathing, default state (loop)
  | 'loading'    // Active processing, rotation/swirl (loop)
  | 'success'    // Confirmation, scale pulse (non-loop)
  | 'error'      // Error acknowledgment, shake (non-loop)
  | 'empty'      // Empty state, inviting gesture (loop)
  | 'guide';     // Onboarding assistance (loop)

/**
 * State configuration for each animation state
 */
export interface MascotStateConfig {
  state: MascotAnimationState;
  loop: boolean;
  duration?: number; // in milliseconds
  autoPlay?: boolean;
  speed?: number;
  onComplete?: () => void;
  transitionTo?: MascotAnimationState; // Auto-transition after completion
}

/**
 * State transition rules
 */
export interface StateTransition {
  from: MascotAnimationState;
  to: MascotAnimationState;
  condition?: 'always' | 'on-success' | 'on-error' | 'on-complete';
  delay?: number; // Delay before transition (ms)
}

/**
 * State history for tracking and debugging
 */
export interface StateHistoryEntry {
  state: MascotAnimationState;
  timestamp: number;
  duration?: number;
  triggeredBy?: 'user' | 'system' | 'auto-transition';
}

/**
 * Size variants for mascot display
 */
export type MascotSize = 'small' | 'medium' | 'large' | number;

/**
 * Size configuration in pixels
 */
export interface MascotSizeConfig {
  small: number;
  medium: number;
  large: number;
}

/**
 * Default state configurations
 */
export const DEFAULT_STATE_CONFIGS: Record<MascotAnimationState, MascotStateConfig> = {
  idle: {
    state: 'idle',
    loop: true,
    duration: 3000,
    autoPlay: true,
    speed: 1,
  },
  loading: {
    state: 'loading',
    loop: true,
    duration: 2000,
    autoPlay: true,
    speed: 1,
  },
  success: {
    state: 'success',
    loop: false,
    duration: 1000,
    autoPlay: true,
    speed: 1,
    transitionTo: 'idle',
  },
  error: {
    state: 'error',
    loop: false,
    duration: 500,
    autoPlay: true,
    speed: 1,
    transitionTo: 'idle',
  },
  empty: {
    state: 'empty',
    loop: true,
    duration: 3000,
    autoPlay: true,
    speed: 1,
  },
  guide: {
    state: 'guide',
    loop: true,
    duration: 2000,
    autoPlay: true,
    speed: 1,
  },
};

/**
 * Default size configurations in pixels
 */
export const DEFAULT_SIZE_CONFIG: MascotSizeConfig = {
  small: 40,
  medium: 80,
  large: 120,
};

/**
 * State transition mappings
 */
export const STATE_TRANSITIONS: Record<MascotAnimationState, StateTransition[]> = {
  idle: [
    { from: 'idle', to: 'loading', condition: 'always' },
    { from: 'idle', to: 'empty', condition: 'always' },
    { from: 'idle', to: 'guide', condition: 'always' },
  ],
  loading: [
    { from: 'loading', to: 'success', condition: 'on-success' },
    { from: 'loading', to: 'error', condition: 'on-error' },
  ],
  success: [
    { from: 'success', to: 'idle', condition: 'on-complete', delay: 100 },
  ],
  error: [
    { from: 'error', to: 'idle', condition: 'on-complete', delay: 100 },
  ],
  empty: [
    { from: 'empty', to: 'idle', condition: 'always' },
  ],
  guide: [
    { from: 'guide', to: 'idle', condition: 'on-complete', delay: 200 },
  ],
};
