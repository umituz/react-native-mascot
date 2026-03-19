/**
 * Mascot Entity
 * Core mascot representation following DDD principles with Value Objects
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
import { Mood } from '../value-objects/Mood';
import { EnergyLevel } from '../value-objects/EnergyLevel';
import { FriendlinessLevel } from '../value-objects/FriendlinessLevel';
import { PlayfulnessLevel } from '../value-objects/PlayfulnessLevel';

export class Mascot {
  readonly id: string;
  readonly name: string;
  readonly type: MascotType;
  private _mood: Mood;
  private _energy: EnergyLevel;
  private _friendliness: FriendlinessLevel;
  private _playfulness: PlayfulnessLevel;
  private _appearance: MascotAppearance;
  private readonly _animations: Map<string, MascotAnimation>;
  private readonly _config: MascotConfig;
  private _state: MascotState;
  private _interactions: Map<string, () => void | Promise<void>>;

  constructor(config: MascotConfig) {
    this.id = config.id;
    this.name = config.name;
    this.type = config.type;
    this._mood = Mood.create(config.personality.mood);
    this._energy = EnergyLevel.create(config.personality.energy);
    this._friendliness = FriendlinessLevel.create(config.personality.friendliness);
    this._playfulness = PlayfulnessLevel.create(config.personality.playfulness);
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
    return {
      mood: this._mood.value,
      energy: this._energy.value,
      friendliness: this._friendliness.value,
      playfulness: this._playfulness.value,
    };
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

  // Value Object Getters (for domain logic)
  get mood(): Mood {
    return this._mood;
  }

  get energy(): EnergyLevel {
    return this._energy;
  }

  get friendliness(): FriendlinessLevel {
    return this._friendliness;
  }

  get playfulness(): PlayfulnessLevel {
    return this._playfulness;
  }

  // Personality Management (using Value Objects)
  setMood(mood: MascotMood): void {
    this._mood = Mood.create(mood);
    this._state.currentMood = mood;
  }

  setEnergy(value: number): void {
    this._energy = EnergyLevel.create(value);
  }

  setFriendliness(value: number): void {
    this._friendliness = FriendlinessLevel.create(value);
  }

  setPlayfulness(value: number): void {
    this._playfulness = PlayfulnessLevel.create(value);
  }

  // Rich behavior with Value Objects
  cheerUp(): void {
    if (this._mood.isNegative()) {
      this._mood = Mood.create('neutral');
    }
  }

  boostEnergy(amount: number): void {
    this._energy = this._energy.increase(amount);
  }

  drainEnergy(amount: number): void {
    this._energy = this._energy.decrease(amount);
  }

  makeMoreFriendly(amount: number): void {
    this._friendliness = this._friendliness.increase(amount);
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
      personality: this.personality,
      appearance: this._appearance,
      state: this._state,
      config: this._config,
    };
  }
}
