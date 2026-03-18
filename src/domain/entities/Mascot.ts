/**
 * Mascot Entity
 * Core mascot representation following DDD principles
 */

import type {
  MascotConfig,
  MascotPersonality,
  MascotAppearance,
  MascotAnimation,
  MascotState,
  MascotType,
  MascotMood,
  MascotAccessory,
} from '../types/MascotTypes';

export class Mascot {
  readonly id: string;
  readonly name: string;
  readonly type: MascotType;
  private _personality: MascotPersonality;
  private _appearance: MascotAppearance;
  private readonly _animations: Map<string, MascotAnimation>;
  private readonly _config: MascotConfig;
  private _state: MascotState;
  private _interactions: Map<string, () => void | Promise<void>>;

  constructor(config: MascotConfig) {
    this.id = config.id;
    this.name = config.name;
    this.type = config.type;
    this._personality = config.personality;
    this._appearance = config.appearance;
    this._animations = new Map(
      config.animations.map((anim) => [anim.id, anim])
    );
    this._config = config;
    this._state = {
      currentMood: config.personality.mood,
      currentAnimation: null,
      isAnimating: false,
      isVisible: true,
    };
    this._interactions = new Map();
  }

  // Getters
  get personality(): MascotPersonality {
    return { ...this._personality };
  }

  get appearance(): MascotAppearance {
    return { ...this._appearance };
  }

  get state(): MascotState {
    return { ...this._state };
  }

  get config(): MascotConfig {
    return { ...this._config };
  }

  get animations(): MascotAnimation[] {
    return Array.from(this._animations.values());
  }

  get interactive(): boolean {
    return this._config.interactive ?? false;
  }

  get touchEnabled(): boolean {
    return this._config.touchEnabled ?? true;
  }

  get soundEnabled(): boolean {
    return this._config.soundEnabled ?? false;
  }

  // Personality Management
  setMood(mood: MascotMood): void {
    this._personality.mood = mood;
    this._state.currentMood = mood;
  }

  setEnergy(energy: number): void {
    if (energy < 0 || energy > 1) {
      throw new Error('Energy must be between 0 and 1');
    }
    this._personality.energy = energy;
  }

  setFriendliness(friendliness: number): void {
    if (friendliness < 0 || friendliness > 1) {
      throw new Error('Friendliness must be between 0 and 1');
    }
    this._personality.friendliness = friendliness;
  }

  setPlayfulness(playfulness: number): void {
    if (playfulness < 0 || playfulness > 1) {
      throw new Error('Playfulness must be between 0 and 1');
    }
    this._personality.playfulness = playfulness;
  }

  // Appearance Management
  updateAppearance(appearance: Partial<MascotAppearance>): void {
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
    const newAccessory: MascotAccessory = {
      id: accessory.id,
      type: accessory.type as MascotAccessory['type'],
      color: accessory.color,
      position: accessory.position,
      visible: true,
    };
    this._appearance.accessories = [
      ...this._appearance.accessories.filter((a) => a.id !== accessory.id),
      newAccessory,
    ];
  }

  removeAccessory(accessoryId: string): void {
    this._appearance.accessories = this._appearance.accessories.filter(
      (a) => a.id !== accessoryId
    );
  }

  // Animation Management
  getAnimation(animationId: string): MascotAnimation | undefined {
    return this._animations.get(animationId);
  }

  getAnimationsByType(type: string): MascotAnimation[] {
    return this.animations.filter((anim) => anim.type === type);
  }

  // State Management
  startAnimation(animationId: string): void {
    const animation = this._animations.get(animationId);
    if (!animation) {
      throw new Error(`Animation ${animationId} not found`);
    }
    this._state.currentAnimation = animationId;
    this._state.isAnimating = true;
  }

  stopAnimation(): void {
    this._state.isAnimating = false;
    this._state.currentAnimation = null;
  }

  setVisible(visible: boolean): void {
    this._state.isVisible = visible;
  }

  setPosition(position: { x: number; y: number }): void {
    this._state.position = position;
  }

  // Interaction Management
  registerInteraction(
    id: string,
    handler: () => void | Promise<void>
  ): void {
    this._interactions.set(id, handler);
  }

  unregisterInteraction(id: string): void {
    this._interactions.delete(id);
  }

  async triggerInteraction(id: string): Promise<void> {
    const handler = this._interactions.get(id);
    if (handler) {
      await handler();
    }
  }

  // Utility Methods
  clone(): Mascot {
    return new Mascot(this._config);
  }

  toJSON(): object {
    return {
      id: this.id,
      name: this.name,
      type: this.type,
      personality: this._personality,
      appearance: this._appearance,
      state: this._state,
      config: this._config,
    };
  }
}
