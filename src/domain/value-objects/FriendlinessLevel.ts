/**
 * FriendlinessLevel Value Object
 * Encapsulates friendliness validation and business rules
 */

export class FriendlinessLevel {
  private readonly MIN = 0;
  private readonly MAX = 1;
  private readonly FRIENDLY_THRESHOLD = 0.6;
  private readonly VERY_FRIENDLY_THRESHOLD = 0.8;

  private constructor(public readonly value: number) {
    if (value < this.MIN || value > this.MAX) {
      throw new Error(`Friendliness level must be between ${this.MIN} and ${this.MAX}, got: ${value}`);
    }
  }

  static create(value: number): FriendlinessLevel {
    return new FriendlinessLevel(value);
  }

  /**
   * Check if mascot is friendly
   */
  isFriendly(): boolean {
    return this.value >= this.FRIENDLY_THRESHOLD;
  }

  /**
   * Check if mascot is very friendly
   */
  isVeryFriendly(): boolean {
    return this.value >= this.VERY_FRIENDLY_THRESHOLD;
  }

  /**
   * Check if mascot is shy
   */
  isShy(): boolean {
    return this.value < 0.4;
  }

  /**
   * Increase friendliness
   */
  increase(amount: number): FriendlinessLevel {
    const newValue = Math.min(this.MAX, this.value + amount);
    return FriendlinessLevel.create(newValue);
  }

  /**
   * Decrease friendliness
   */
  decrease(amount: number): FriendlinessLevel {
    const newValue = Math.max(this.MIN, this.value - amount);
    return FriendlinessLevel.create(newValue);
  }

  equals(other: FriendlinessLevel): boolean {
    return this.value === other.value;
  }

  toJSON(): number {
    return this.value;
  }
}
