/**
 * Personality Management (60 lines)
 * Mascot personality operations and behaviors
 */

import { Mascot } from '../../domain/entities/Mascot';
import type { MascotMood } from '../../domain/types/MascotTypes';

export class PersonalityManagement {
  constructor(private readonly mascot: Mascot) {}

  setMood(mood: MascotMood): void {
    this.mascot.setMood(mood);
  }

  setEnergy(value: number): void {
    this.mascot.setEnergy(value);
  }

  setFriendliness(value: number): void {
    this.mascot.setFriendliness(value);
  }

  setPlayfulness(value: number): void {
    this.mascot.setPlayfulness(value);
  }

  cheerUp(): void {
    this.mascot.cheerUp();
  }

  boostEnergy(amount: number): void {
    this.mascot.boostEnergy(amount);
  }

  get personality() {
    return this.mascot.personality;
  }
}
