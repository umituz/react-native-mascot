/**
 * Mascot Templates (100 lines)
 * Predefined mascot template configurations
 */

import type { MascotConfig } from '../../domain/types/MascotTypes';
import type { MascotTemplate } from './MascotFactory';

export function getTemplateConfig(template: MascotTemplate): MascotConfig {
  const templates: Record<MascotTemplate, MascotConfig> = {
    'friendly-bot': {
      id: 'friendly-bot',
      name: 'Friendly Bot',
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
      animations: getDefaultAnimations(),
      interactive: true,
      touchEnabled: true,
      soundEnabled: false,
    },
    'cute-pet': {
      id: 'cute-pet',
      name: 'Cute Pet',
      type: 'svg',
      personality: {
        mood: 'excited',
        energy: 0.9,
        friendliness: 1.0,
        playfulness: 0.95,
      },
      appearance: {
        baseColor: '#FFB6C1',
        accentColor: '#FF69B4',
        secondaryColor: '#FFF',
        accessories: [
          { id: 'bow', type: 'bow', color: '#FF69B4', visible: true },
        ],
        style: 'cartoon',
        scale: 1,
      },
      animations: getDefaultAnimations(),
      interactive: true,
      touchEnabled: true,
      soundEnabled: false,
    },
    'wise-owl': {
      id: 'wise-owl',
      name: 'Wise Owl',
      type: 'lottie',
      personality: {
        mood: 'thinking',
        energy: 0.4,
        friendliness: 0.7,
        playfulness: 0.3,
      },
      appearance: {
        baseColor: '#8B4513',
        accentColor: '#DAA520',
        accessories: [
          { id: 'glasses', type: 'glasses', visible: true },
        ],
        style: 'realistic',
        scale: 1,
      },
      animations: getDefaultAnimations(),
      interactive: true,
      touchEnabled: true,
      soundEnabled: false,
    },
    'pixel-hero': {
      id: 'pixel-hero',
      name: 'Pixel Hero',
      type: 'svg',
      personality: {
        mood: 'happy',
        energy: 0.85,
        friendliness: 0.75,
        playfulness: 0.8,
      },
      appearance: {
        baseColor: '#3498DB',
        accentColor: '#E74C3C',
        secondaryColor: '#F1C40F',
        accessories: [
          { id: 'crown', type: 'crown', color: '#F1C40F', visible: true },
        ],
        style: 'pixel',
        scale: 1,
      },
      animations: getDefaultAnimations(),
      interactive: true,
      touchEnabled: true,
      soundEnabled: false,
    },
  };

  return templates[template];
}

export function getDefaultAnimations() {
  return [
    {
      id: 'idle',
      name: 'Idle',
      type: 'idle' as const,
      source: 'idle.json',
      loop: true,
      autoplay: true,
    },
    {
      id: 'wave',
      name: 'Wave',
      type: 'action' as const,
      source: 'wave.json',
      loop: false,
    },
    {
      id: 'jump',
      name: 'Jump',
      type: 'action' as const,
      source: 'jump.json',
      loop: false,
    },
    {
      id: 'success',
      name: 'Success',
      type: 'reaction' as const,
      source: 'success.json',
      loop: false,
    },
    {
      id: 'error',
      name: 'Error',
      type: 'reaction' as const,
      source: 'error.json',
      loop: false,
    },
  ];
}
