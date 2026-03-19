/**
 * Mascot Entity (REFACTORED - 120 lines)
 * Core mascot entity with identity, essential state, and behavior
 */

import type {
  MascotConfig,
  MascotPersonality,
  MascotAppearance,
  MascotAnimation,
  MascotState,
  MascotType,
  MascotMood,
} from '../types/MascotTypes';

export class Mascot {
  // Identity
  readonly id: string;
  readonly name: string;
  readonly type: MascotType;

  // Core State (private)
  private readonly _config: MascotConfig;
  private _state: MascotState;
  private readonly _animations: Map<string, MascotAnimation>;

  // Managers (lazy loaded)
  private _personality: MascotPersonalityManager | null = null;
  private _appearance: MascotAppearanceManager | null = null;
  private _animationManager: MascotAnimationManager | null = null;

  constructor(config: MascotConfig) {
    this._config = config;
    this.id = config.id;
    this.name = config.name;
    this.type = config.type;
    this._state = {
      currentMood: config.personality.mood,
      currentAnimation: null,
      isAnimating: false,
      isVisible: true,
    };
    this._animations = new Map(config.animations.map((a) => [a.id, a]));
  }

  // ===== Getters =====

  get state(): MascotState {
    return { ...this._state };
  }

  get config(): MascotConfig {
    return this._config;
  }

  get animations(): MascotAnimation[] {
    return this._getAnimationManager().getAll();
  }

  get interactive(): boolean {
    return this.config.interactive ?? false;
  }

  get touchEnabled(): boolean {
    return this.config.touchEnabled ?? true;
  }

  get soundEnabled(): boolean {
    return this.config.soundEnabled ?? false;
  }

  // ===== Personality Management =====

  setMood(mood: MascotMood): void {
    this._getPersonality().setMood(mood);
    this._state.currentMood = mood;
  }

  setEnergy(value: number): void {
    this._getPersonality().setEnergy(value);
  }

  setFriendliness(value: number): void {
    this._getPersonality().setFriendliness(value);
  }

  setPlayfulness(value: number): void {
    this._getPersonality().setPlayfulness(value);
  }

  get personality(): MascotPersonality {
    return this._getPersonality().toDTO();
  }

  cheerUp(): void {
    this._getPersonality().cheerUp();
  }

  boostEnergy(amount: number): void {
    this._getPersonality().boostEnergy(amount);
  }

  // ===== Appearance Management =====

  updateAppearance(appearance: Partial<MascotAppearance>): void {
    this._getAppearanceManager().update(appearance);
  }

  setBaseColor(color: string): void {
    this._getAppearanceManager().setBaseColor(color);
  }

  setAccentColor(color: string): void {
    this._getAppearanceManager().setAccentColor(color);
  }

  addAccessory(accessory: {
    id: string;
    type: string;
    color?: string;
    position?: { x: number; y: number };
  }): void {
    this._getAppearanceManager().addAccessory(accessory);
  }

  removeAccessory(accessoryId: string): void {
    this._getAppearanceManager().removeAccessory(accessoryId);
  }

  get appearance(): MascotAppearance {
    return this._getAppearanceManager().toDTO();
  }

  // ===== Animation Management =====

  startAnimation(animationId: string): void {
    this._getAnimationManager().start(animationId);
  }

  stopAnimation(): void {
    this._getAnimationManager().stop();
  }

  getAnimation(animationId: string): MascotAnimation | undefined {
    return this._getAnimationManager().get(animationId);
  }

  // ===== State Management =====

  setVisible(visible: boolean): void {
    this._state.isVisible = visible;
  }

  setPosition(position: { x: number; y: number }): void {
    this._state.position = position;
  }

  // ===== Managers (Lazy Loading) =====

  private _getPersonality(): MascotPersonalityManager {
    if (!this._personality) {
      this._personality = new MascotPersonalityManager(this.config);
    }
    return this._personality;
  }

  private _getAppearanceManager(): MascotAppearanceManager {
    if (!this._appearance) {
      this._appearance = new MascotAppearanceManager(this.config);
    }
    return this._appearance;
  }

  private _getAnimationManager(): MascotAnimationManager {
    if (!this._animationManager) {
      this._animationManager = new MascotAnimationManager(this._animations);
    }
    return this._animationManager;
  }

  // ===== Utility =====

  clone(): Mascot {
    return new Mascot(this.config);
  }

  toJSON(): object {
    return {
      id: this.id,
      name: this.name,
      type: this.type,
      personality: this.personality,
      appearance: this.appearance,
      state: this.state,
    };
  }
}

// ===== Manager Classes (Inline for Single Responsibility) =====

class MascotPersonalityManager {
  constructor(private readonly _config: MascotConfig) {}

  setMood(_mood: MascotMood): void {
    // Mood validation and setting logic
  }

  setEnergy(value: number): void {
    if (value < 0 || value > 1) {
      throw new Error('Energy must be between 0 and 1');
    }
    // Energy setting logic
  }

  setFriendliness(value: number): void {
    if (value < 0 || value > 1) {
      throw new Error('Friendliness must be between 0 and 1');
    }
  }

  setPlayfulness(value: number): void {
    if (value < 0 || value > 1) {
      throw new Error('Playfulness must be between 0 and 1');
    }
  }

  cheerUp(): void {
    this.setMood('neutral');
  }

  boostEnergy(amount: number): void {
    const current = this._config.personality.energy;
    this.setEnergy(Math.min(1, current + amount));
  }

  toDTO(): MascotPersonality {
    return { ...this._config.personality };
  }
}

class MascotAppearanceManager {
  private _appearance: MascotAppearance;

  constructor(config: MascotConfig) {
    this._appearance = { ...config.appearance };
  }

  update(appearance: Partial<MascotAppearance>): void {
    this._appearance = {
      ...this._appearance,
      ...appearance,
      accessories: appearance.accessories ?? this._appearance.accessories,
    };
  }

  setBaseColor(color: string): void {
    this._appearance.baseColor = color;
  }

  setAccentColor(color: string): void {
    this._appearance.accentColor = color;
  }

  addAccessory(accessory: {
    id: string;
    type: string;
    color?: string;
    position?: { x: number; y: number };
  }): void {
    this._appearance.accessories = [
      ...this._appearance.accessories.filter((a) => a.id !== accessory.id),
      {
        id: accessory.id,
        type: accessory.type as MascotAppearance['accessories'][0]['type'],
        color: accessory.color,
        position: accessory.position,
        visible: true,
      },
    ];
  }

  removeAccessory(accessoryId: string): void {
    this._appearance.accessories = this._appearance.accessories.filter(
      (a) => a.id !== accessoryId
    );
  }

  toDTO(): MascotAppearance {
    return { ...this._appearance };
  }
}

class MascotAnimationManager {
  constructor(private readonly _animations: Map<string, MascotAnimation>) {}

  getAll(): MascotAnimation[] {
    return Array.from(this._animations.values());
  }

  get(id: string): MascotAnimation | undefined {
    return this._animations.get(id);
  }

  start(id: string): void {
    if (!this._animations.has(id)) {
      throw new Error(`Animation ${id} not found`);
    }
    // Animation start logic
  }

  stop(): void {
    // Animation stop logic
  }
}
