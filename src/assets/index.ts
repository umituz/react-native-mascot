/**
 * Built-in Mascot Assets
 * Pre-configured mascots and animations
 */

import type { MascotConfig, MascotAnimationType } from '../domain/types/MascotTypes';
import type { MascotAnimation } from '../domain/types/MascotTypes';

// Import JSON animations from infrastructure/assets
import idleAnim from '../infrastructure/assets/lottie/idle.json';
import waveAnim from '../infrastructure/assets/lottie/wave.json';
import jumpAnim from '../infrastructure/assets/lottie/jump.json';
import successAnim from '../infrastructure/assets/lottie/success.json';
import errorAnim from '../infrastructure/assets/lottie/error.json';
import danceAnim from '../infrastructure/assets/lottie/dance.json';

export const BUILT_IN_MASCOTS: Record<string, MascotConfig> = {
  'happy-robot': {
    id: 'happy-robot',
    name: 'Happy Robot',
    type: 'lottie',
    personality: {
      mood: 'happy',
      energy: 0.8,
      friendliness: 0.9,
      playfulness: 0.7,
    },
    appearance: {
      baseColor: '#4A90E2',
      accentColor: '#50E3C2',
      accessories: [],
      style: 'cartoon',
      scale: 1,
    },
    animations: [
      {
        id: 'idle',
        name: 'Idle',
        type: 'idle' as MascotAnimationType,
        source: idleAnim as MascotAnimation['source'],
        loop: true,
        autoplay: true,
      },
      {
        id: 'wave',
        name: 'Wave',
        type: 'action' as MascotAnimationType,
        source: waveAnim as MascotAnimation['source'],
        loop: false,
      },
      {
        id: 'jump',
        name: 'Jump',
        type: 'action' as MascotAnimationType,
        source: jumpAnim as MascotAnimation['source'],
        loop: false,
      },
      {
        id: 'success',
        name: 'Success',
        type: 'reaction' as MascotAnimationType,
        source: successAnim as MascotAnimation['source'],
        loop: false,
      },
      {
        id: 'error',
        name: 'Error',
        type: 'reaction' as MascotAnimationType,
        source: errorAnim as MascotAnimation['source'],
        loop: false,
      },
      {
        id: 'dance',
        name: 'Dance',
        type: 'action' as MascotAnimationType,
        source: danceAnim as MascotAnimation['source'],
        loop: true,
      },
    ],
    interactive: true,
    touchEnabled: true,
    soundEnabled: false,
  },
};

// Helper function to get built-in mascot
export function getBuiltInMascot(id: string): MascotConfig | undefined {
  return BUILT_IN_MASCOTS[id];
}

// Helper function to get all built-in mascot IDs
export function getBuiltInMascotIds(): string[] {
  return Object.keys(BUILT_IN_MASCOTS);
}

// Helper function to check if mascot is built-in
export function isBuiltInMascot(id: string): boolean {
  return id in BUILT_IN_MASCOTS;
}
