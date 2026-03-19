/**
 * @umituz/react-native-mascot
 *
 * Interactive mascot system for React Native apps with DDD architecture
 * Version: 1.0.6
 */

// Re-export all layers
export * from './core';
export * from './application';
export * from './infrastructure';
export * from './presentation';

// Constants
import type { MascotMood, AnimationSpeed } from './domain/types/MascotTypes';

export const MASCOT_TEMPLATES = [
  'friendly-bot',
  'cute-pet',
  'wise-owl',
  'pixel-hero',
] as const;

export const DEFAULT_MASCOT_MOODS: MascotMood[] = [
  'happy',
  'sad',
  'excited',
  'thinking',
  'angry',
  'neutral',
  'surprised',
];

export const DEFAULT_ANIMATION_SPEEDS: AnimationSpeed[] = [
  'very-slow',
  'slow',
  'normal',
  'fast',
  'very-fast',
];

// Convenience export - get service instance
export const getMascotService = () => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { DIContainer } = require('./infrastructure/di/Container');
  return DIContainer.getInstance().getMascotService();
};
