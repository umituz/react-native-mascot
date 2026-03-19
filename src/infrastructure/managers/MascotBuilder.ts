/**
 * Mascot Builder (80 lines)
 * Builder pattern for custom mascot creation
 */

import type { MascotConfig, MascotType } from '../../domain/types/MascotTypes';
import { getDefaultAnimations } from './MascotTemplates';

export class MascotBuilder {
  private config: MascotConfig;

  constructor(options: {
    id?: string;
    name?: string;
    type?: MascotType;
  } = {}) {
    this.config = {
      id: options.id || 'custom-mascot',
      name: options.name || 'Custom Mascot',
      type: options.type || 'svg',
      personality: {
        mood: 'happy',
        energy: 0.7,
        friendliness: 0.8,
        playfulness: 0.6,
      },
      appearance: {
        baseColor: '#FF6B6B',
        accentColor: '#4ECDC4',
        accessories: [],
        style: 'minimal',
        scale: 1,
      },
      animations: getDefaultAnimations(),
      interactive: true,
      touchEnabled: true,
      soundEnabled: false,
    };
  }

  withId(id: string): MascotBuilder {
    this.config.id = id;
    return this;
  }

  withName(name: string): MascotBuilder {
    this.config.name = name;
    return this;
  }

  withType(type: MascotType): MascotBuilder {
    this.config.type = type;
    return this;
  }

  withPersonality(personality: Partial<MascotConfig['personality']>): MascotBuilder {
    this.config.personality = { ...this.config.personality, ...personality };
    return this;
  }

  withAppearance(appearance: Partial<MascotConfig['appearance']>): MascotBuilder {
    this.config.appearance = { ...this.config.appearance, ...appearance };
    return this;
  }

  withBaseColor(color: string): MascotBuilder {
    this.config.appearance.baseColor = color;
    return this;
  }

  withAccentColor(color: string): MascotBuilder {
    this.config.appearance.accentColor = color;
    return this;
  }

  interactive(enabled: boolean = true): MascotBuilder {
    this.config.interactive = enabled;
    return this;
  }

  touchEnabled(enabled: boolean = true): MascotBuilder {
    this.config.touchEnabled = enabled;
    return this;
  }

  build(): MascotConfig {
    return this.config;
  }
}
