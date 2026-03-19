/**
 * Appearance Management (60 lines)
 * Mascot appearance and accessory operations
 */

import { Mascot } from '../../domain/entities/Mascot';
import type { MascotAppearance } from '../../domain/types/MascotTypes';

export class AppearanceManagement {
  constructor(private readonly mascot: Mascot) {}

  updateAppearance(appearance: Partial<MascotAppearance>): void {
    this.mascot.updateAppearance(appearance);
  }

  setBaseColor(color: string): void {
    this.mascot.setBaseColor(color);
  }

  setAccentColor(color: string): void {
    this.mascot.setAccentColor(color);
  }

  addAccessory(accessory: {
    id: string;
    type: string;
    color?: string;
    position?: { x: number; y: number };
  }): void {
    this.mascot.addAccessory(accessory);
  }

  removeAccessory(accessoryId: string): void {
    this.mascot.removeAccessory(accessoryId);
  }

  get appearance() {
    return this.mascot.appearance;
  }
}
