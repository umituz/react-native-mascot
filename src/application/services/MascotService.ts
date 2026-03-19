/**
 * Mascot Service (120 lines)
 * Core application service for mascot operations
 */

import { Mascot } from '../../domain/entities/Mascot';
import type { MascotConfig, MascotMood, MascotAppearance } from '../../domain/types/MascotTypes';
import type { IMascotRepository } from '../../domain/interfaces/IMascotRepository';
import type { IAnimationController, AnimationOptions } from '../../domain/interfaces/IAnimationController';
import type { IAssetManager } from '../../domain/interfaces/IAssetManager';
import { MascotFactory } from '../../infrastructure/managers/MascotFactory';
import { MascotNotInitializedError, AnimationNotFoundError } from '../errors/MascotErrors';
import { PersonalityManagement } from './PersonalityManagement';
import { AppearanceManagement } from './AppearanceManagement';

export type MascotTemplate = 'friendly-bot' | 'cute-pet' | 'wise-owl' | 'pixel-hero';

export class MascotService {
  private _mascot: Mascot | null = null;
  private _changeListeners: Set<() => void> = new Set();
  private _personality: PersonalityManagement | null = null;
  private _appearance: AppearanceManagement | null = null;

  constructor(
    private readonly _repository: IMascotRepository,
    private readonly _animationController: IAnimationController,
    _assetManager: IAssetManager
  ) {
    void _assetManager;
  }

  // ✅ Initialization
  async initialize(config: MascotConfig): Promise<void> {
    this._mascot = new Mascot(config);
    await this._repository.save(config);
    this._notifyChange();
  }

  async fromTemplate(
    template: MascotTemplate,
    customizations?: Partial<MascotConfig>
  ): Promise<void> {
    const mascot = MascotFactory.createFromTemplate(template, customizations);
    this._mascot = mascot;
    await this._repository.save(mascot.config);
    this._notifyChange();
  }

  // ✅ State Getters
  get mascot(): Mascot | null {
    return this._mascot;
  }

  get isPlaying(): boolean {
    return this._animationController.isPlaying();
  }

  get currentAnimation(): string | null {
    return this._mascot?.state.currentAnimation ?? null;
  }

  get isReady(): boolean {
    return this._mascot !== null;
  }

  // ✅ Manager Access (lazy loaded)
  private _getPersonality(): PersonalityManagement {
    if (!this._personality) {
      this._ensureMascot();
      this._personality = new PersonalityManagement(this._mascot!);
    }
    return this._personality;
  }

  private _getAppearance(): AppearanceManagement {
    if (!this._appearance) {
      this._ensureMascot();
      this._appearance = new AppearanceManagement(this._mascot!);
    }
    return this._appearance;
  }

  // ✅ Personality Management (delegated)
  setMood(mood: MascotMood): void {
    this._getPersonality().setMood(mood);
    this._notifyChange();
  }

  setEnergy(value: number): void {
    this._getPersonality().setEnergy(value);
    this._notifyChange();
  }

  setFriendliness(value: number): void {
    this._getPersonality().setFriendliness(value);
    this._notifyChange();
  }

  setPlayfulness(value: number): void {
    this._getPersonality().setPlayfulness(value);
    this._notifyChange();
  }

  cheerUp(): void {
    this._getPersonality().cheerUp();
    this._notifyChange();
  }

  boostEnergy(amount: number): void {
    this._getPersonality().boostEnergy(amount);
    this._notifyChange();
  }

  // ✅ Appearance Management (delegated)
  updateAppearance(appearance: Partial<MascotAppearance>): void {
    this._getAppearance().updateAppearance(appearance);
    this._notifyChange();
  }

  setBaseColor(color: string): void {
    this._getAppearance().setBaseColor(color);
    this._notifyChange();
  }

  setAccentColor(color: string): void {
    this._getAppearance().setAccentColor(color);
    this._notifyChange();
  }

  addAccessory(accessory: {
    id: string;
    type: string;
    color?: string;
    position?: { x: number; y: number };
  }): void {
    this._getAppearance().addAccessory(accessory);
    this._notifyChange();
  }

  removeAccessory(accessoryId: string): void {
    this._getAppearance().removeAccessory(accessoryId);
    this._notifyChange();
  }

  // ✅ Animation Management
  async playAnimation(animationId: string, options?: AnimationOptions): Promise<void> {
    this._ensureMascot();
    const animation = this._mascot!.getAnimation(animationId);
    if (!animation) {
      throw new AnimationNotFoundError(animationId);
    }
    this._mascot!.startAnimation(animationId);
    await this._animationController.play(animation, options);
    this._notifyChange();
  }

  stopAnimation(): void {
    this._animationController.stop();
    if (this._mascot) {
      this._mascot.stopAnimation();
    }
    this._notifyChange();
  }

  pauseAnimation(): void {
    this._animationController.pause();
    this._notifyChange();
  }

  resumeAnimation(): void {
    this._animationController.resume();
    this._notifyChange();
  }

  // ✅ Visibility & Position
  setVisible(visible: boolean): void {
    this._ensureMascot();
    this._mascot!.setVisible(visible);
    this._notifyChange();
  }

  setPosition(position: { x: number; y: number }): void {
    this._ensureMascot();
    this._mascot!.setPosition(position);
    this._notifyChange();
  }

  // ✅ Observable Pattern
  subscribe(listener: () => void): () => void {
    this._changeListeners.add(listener);
    return () => this._changeListeners.delete(listener);
  }

  private _notifyChange(): void {
    this._changeListeners.forEach((listener) => listener());
  }

  private _ensureMascot(): void {
    if (!this._mascot) {
      throw new MascotNotInitializedError();
    }
  }
}
