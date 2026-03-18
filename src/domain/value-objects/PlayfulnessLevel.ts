/**
 * PlayfulnessLevel Value Object
 * Encapsulates playfulness validation and business rules
 */

export class PlayfulnessLevel {
  private readonly MIN = 0;
  private readonly MAX = 1;
  private readonly PLAYFUL_THRESHOLD = 0.5;
  private readonly VERY_PLAYFUL_THRESHOLD = 0.8;

  private constructor(public readonly value: number) {
    if (value < this.MIN || value > this.MAX) {
      throw new Error(`Playfulness level must be between ${this.MIN} and ${this.MAX}, got: ${value}`);
    }
  }

  static create(value: number): PlayfulnessLevel {
    return new PlayfulnessLevel(value);
  }

  /**
   * Check if mascot is playful
   */
  isPlayful(): boolean {
    return this.value >= this.PLAYFUL_THRESHOLD;
  }

  /**
   * Check if mascot is very playful
   */
  isVeryPlayful(): boolean {
    return this.value >= this.VERY_PLAYFUL_THRESHOLD;
  }

  /**
   * Check if mascot is serious
   */
  isSerious(): boolean {
    return this.value < 0.3;
  }

  /**
   * Increase playfulness
   */
  increase(amount: number): PlayfulnessLevel {
    const newValue = Math.min(this.MAX, this.value + amount);
    return PlayfulnessLevel.create(newValue);
  }

  /**
   * Decrease playfulness
   */
  decrease(amount: number): PlayfulnessLevel {
    const newValue = Math.max(this.MIN, this.value - amount);
    return PlayfulnessLevel.create(newValue);
  }

  equals(other: PlayfulnessLevel): boolean {
    return this.value === other.value;
  }

  toJSON(): number {
    return this.value;
  }
}
