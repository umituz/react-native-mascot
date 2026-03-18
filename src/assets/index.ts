/**
 * Built-in Mascot Assets
 * Pre-configured mascots and animations
 */

/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { MascotConfig, MascotAnimationType } from '../domain/types/MascotTypes';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const idleAnim = require('./lottie/idle.json');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const waveAnim = require('./lottie/wave.json');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const jumpAnim = require('./lottie/jump.json');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const successAnim = require('./lottie/success.json');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const errorAnim = require('./lottie/error.json');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const danceAnim = require('./lottie/dance.json');

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
        source: idleAnim,
        loop: true,
        autoplay: true,
      },
      {
        id: 'wave',
        name: 'Wave',
        type: 'action' as MascotAnimationType,
        source: waveAnim,
        loop: false,
      },
      {
        id: 'jump',
        name: 'Jump',
        type: 'action' as MascotAnimationType,
        source: jumpAnim,
        loop: false,
      },
      {
        id: 'success',
        name: 'Success',
        type: 'reaction' as MascotAnimationType,
        source: successAnim,
        loop: false,
      },
      {
        id: 'error',
        name: 'Error',
        type: 'reaction' as MascotAnimationType,
        source: errorAnim,
        loop: false,
      },
      {
        id: 'dance',
        name: 'Dance',
        type: 'action' as MascotAnimationType,
        source: danceAnim,
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
