/**
 * Mascot Factory (100 lines)
 * Factory methods for mascot creation
 */

import { Mascot } from '../../domain/entities/Mascot';
import type { MascotConfig, MascotType } from '../../domain/types/MascotTypes';
import { getTemplateConfig } from './MascotTemplates';
import { MascotBuilder } from './MascotBuilder';

export type MascotTemplate =
  | 'friendly-bot'
  | 'cute-pet'
  | 'wise-owl'
  | 'pixel-hero';

export class MascotFactory {
  /**
   * Create a mascot from predefined template
   */
  static createFromTemplate(
    template: MascotTemplate,
    customizations?: Partial<MascotConfig>
  ): Mascot {
    const config = getTemplateConfig(template);
    const finalConfig = this._mergeConfigs(config, customizations);
    return new Mascot(finalConfig);
  }

  /**
   * Create a custom mascot
   */
  static createCustom(config: MascotConfig): Mascot {
    return new Mascot(config);
  }

  /**
   * Create a simple mascot with minimal configuration
   */
  static createSimple(options: {
    id?: string;
    name?: string;
    type?: MascotType;
    baseColor?: string;
  }): Mascot {
    const builder = new MascotBuilder(options);
    if (options.baseColor) {
      builder.withBaseColor(options.baseColor);
    }
    return new Mascot(builder.build());
  }

  /**
   * Get a builder for fluent mascot creation
   */
  static builder(): MascotBuilder {
    return new MascotBuilder();
  }

  /**
   * Merge base config with customizations
   */
  private static _mergeConfigs(
    base: MascotConfig,
    custom?: Partial<MascotConfig>
  ): MascotConfig {
    if (!custom) {
      return base;
    }

    return {
      ...base,
      ...custom,
      id: custom.id || base.id,
      personality: {
        ...base.personality,
        ...custom.personality,
      },
      appearance: {
        ...base.appearance,
        ...custom.appearance,
        accessories: custom.appearance?.accessories || base.appearance.accessories,
      },
      animations: custom.animations || base.animations,
    };
  }
}
