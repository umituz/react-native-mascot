/**
 * EnergyLevel Value Object
 * Encapsulates energy level validation and business rules
 */

export class EnergyLevel {
  private readonly MIN = 0;
  private readonly MAX = 1;
  private readonly HIGH_THRESHOLD = 0.7;
  private readonly LOW_THRESHOLD = 0.3;

  private constructor(public readonly value: number) {
    if (value < this.MIN || value > this.MAX) {
      throw new Error(`Energy level must be between ${this.MIN} and ${this.MAX}, got: ${value}`);
    }
  }

  static create(value: number): EnergyLevel {
    return new EnergyLevel(value);
  }

  /**
   * Check if energy is high
   */
  isHigh(): boolean {
    return this.value > this.HIGH_THRESHOLD;
  }

  /**
   * Check if energy is low
   */
  isLow(): boolean {
    return this.value < this.LOW_THRESHOLD;
  }

  /**
   * Check if energy is moderate
   */
  isModerate(): boolean {
    return !this.isHigh() && !this.isLow();
  }

  /**
   * Increase energy by amount (clamped to MAX)
   */
  increase(amount: number): EnergyLevel {
    const newValue = Math.min(this.MAX, this.value + amount);
    return EnergyLevel.create(newValue);
  }

  /**
   * Decrease energy by amount (clamped to MIN)
   */
  decrease(amount: number): EnergyLevel {
    const newValue = Math.max(this.MIN, this.value - amount);
    return EnergyLevel.create(newValue);
  }

  /**
   * Set energy to specific level
   */
  setLevel(value: number): EnergyLevel {
    return EnergyLevel.create(value);
  }

  /**
   * Get energy as percentage (0-100)
   */
  toPercentage(): number {
    return Math.round(this.value * 100);
  }

  equals(other: EnergyLevel): boolean {
    return this.value === other.value;
  }

  toJSON(): number {
    return this.value;
  }
}
