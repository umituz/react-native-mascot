/**
 * Mood Value Object
 * Encapsulates mood logic and validation
 */

import type { MascotMood } from '../types/MascotTypes';

export class Mood {
  private constructor(public readonly value: MascotMood) {}

  static create(value: MascotMood): Mood {
    return new Mood(value);
  }

  /**
   * Check if mood is positive
   */
  isPositive(): boolean {
    return ['happy', 'excited', 'surprised'].includes(this.value);
  }

  /**
   * Check if mood is negative
   */
  isNegative(): boolean {
    return ['sad', 'angry'].includes(this.value);
  }

  /**
   * Check if mood is neutral
   */
  isNeutral(): boolean {
    return ['neutral', 'thinking'].includes(this.value);
  }

  /**
   * Get opposite mood
   */
  getOpposite(): Mood {
    const opposites: Record<MascotMood, MascotMood> = {
      happy: 'sad',
      sad: 'happy',
      excited: 'angry',
      angry: 'excited',
      thinking: 'neutral',
      neutral: 'thinking',
      surprised: 'neutral',
    };
    return Mood.create(opposites[this.value]);
  }

  equals(other: Mood): boolean {
    return this.value === other.value;
  }

  toJSON(): MascotMood {
    return this.value;
  }
}
