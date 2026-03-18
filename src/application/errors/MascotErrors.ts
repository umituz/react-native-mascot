/**
 * Domain Errors
 * Custom error classes for mascot domain
 */

export class MascotError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'MascotError';
    Object.setPrototypeOf(this, MascotError.prototype);
  }
}

export class MascotNotInitializedError extends MascotError {
  constructor() {
    super('Mascot has not been initialized. Call initialize() or fromTemplate() first.');
    this.name = 'MascotNotInitializedError';
    Object.setPrototypeOf(this, MascotNotInitializedError.prototype);
  }
}

export class AnimationNotFoundError extends MascotError {
  constructor(animationId: string) {
    super(`Animation with id "${animationId}" not found.`);
    this.name = 'AnimationNotFoundError';
    Object.setPrototypeOf(this, AnimationNotFoundError.prototype);
  }
}

export class InvalidEnergyLevelError extends MascotError {
  constructor(value: number) {
    super(`Energy level must be between 0 and 1, got: ${value}`);
    this.name = 'InvalidEnergyLevelError';
    Object.setPrototypeOf(this, InvalidEnergyLevelError.prototype);
  }
}

export class InvalidFriendlinessLevelError extends MascotError {
  constructor(value: number) {
    super(`Friendliness level must be between 0 and 1, got: ${value}`);
    this.name = 'InvalidFriendlinessLevelError';
    Object.setPrototypeOf(this, InvalidFriendlinessLevelError.prototype);
  }
}

export class InvalidPlayfulnessLevelError extends MascotError {
  constructor(value: number) {
    super(`Playfulness level must be between 0 and 1, got: ${value}`);
    this.name = 'InvalidPlayfulnessLevelError';
    Object.setPrototypeOf(this, InvalidPlayfulnessLevelError.prototype);
  }
}

export class InvalidMoodTransitionError extends MascotError {
  constructor(from: string, to: string) {
    super(`Cannot transition mood from "${from}" to "${to}".`);
    this.name = 'InvalidMoodTransitionError';
    Object.setPrototypeOf(this, InvalidMoodTransitionError.prototype);
  }
}

export class MascotNotFoundError extends MascotError {
  constructor(id: string) {
    super(`Mascot with id "${id}" not found.`);
    this.name = 'MascotNotFoundError';
    Object.setPrototypeOf(this, MascotNotFoundError.prototype);
  }
}

export class TemplateNotFoundError extends MascotError {
  constructor(template: string) {
    super(`Mascot template "${template}" not found.`);
    this.name = 'TemplateNotFoundError';
    Object.setPrototypeOf(this, TemplateNotFoundError.prototype);
  }
}
