/**
 * Dependency Injection Container
 * Manages singleton instances and dependencies
 */

import type { IMascotRepository } from '../../domain/interfaces/IMascotRepository';
import type { MascotService } from '../../application/services/MascotService';
import { AnimationController } from '../controllers/AnimationController';
import { AssetManager } from '../managers/AssetManager';
import { MascotRepository } from '../repositories/MascotRepository';

export class DIContainer {
  private static _instance: DIContainer;
  private _animationController: AnimationController | null = null;
  private _assetManager: AssetManager | null = null;
  private _repository: IMascotRepository | null = null;
  private _mascotService: MascotService | null = null;

  private constructor() {}

  static getInstance(): DIContainer {
    if (!this._instance) {
      this._instance = new DIContainer();
    }
    return this._instance;
  }

  /**
   * Get or create AnimationController singleton
   */
  getAnimationController(): AnimationController {
    if (!this._animationController) {
      this._animationController = new AnimationController();
    }
    return this._animationController;
  }

  /**
   * Get or create AssetManager singleton
   */
  getAssetManager(): AssetManager {
    if (!this._assetManager) {
      this._assetManager = new AssetManager();
    }
    return this._assetManager;
  }

  /**
   * Get or create MascotRepository singleton
   */
  getRepository(): IMascotRepository {
    if (!this._repository) {
      this._repository = new MascotRepository();
    }
    return this._repository;
  }

  /**
   * Get or create MascotService singleton
   */
  getMascotService(): MascotService {
    if (!this._mascotService) {
      // Lazy import to avoid circular dependencies
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { MascotService } = require('../../application/services/MascotService');
      this._mascotService = new MascotService(
        this.getRepository(),
        this.getAnimationController(),
        this.getAssetManager()
      );
    }
    return this._mascotService!;
  }

  /**
   * Reset all instances (useful for testing)
   */
  reset(): void {
    this._animationController = null;
    this._assetManager = null;
    this._repository = null;
    this._mascotService = null;
  }

  /**
   * Check if container has been initialized
   */
  isInitialized(): boolean {
    return this._mascotService !== null;
  }
}
