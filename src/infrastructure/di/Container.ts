/**
 * DI Container (OPTIMIZED)
 * Lazy imports with caching and better singleton management
 */

import type { IMascotRepository } from '../../domain/interfaces/IMascotRepository';
import type { MascotService } from '../../application/services/MascotService';
import { AnimationController } from '../controllers/AnimationController';
import { AssetManager } from '../managers/AssetManager';
import { MascotRepository } from '../repositories/MascotRepository';

// Cache for lazy-loaded modules
interface ModuleCache<T> {
  module: T | null;
  initialized: boolean;
}

export class DIContainer {
  private static _instance: DIContainer;
  private _animationController: AnimationController | null = null;
  private _assetManager: AssetManager | null = null;
  private _repository: IMascotRepository | null = null;
  private _mascotServiceCache: ModuleCache<MascotService> = {
    module: null,
    initialized: false,
  };

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
   * Get or create MascotService singleton (with caching)
   */
  getMascotService(): MascotService {
    if (!this._mascotServiceCache.initialized) {
      // Lazy import to avoid circular dependencies
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { MascotService } = require('../../application/services/MascotService');

      this._mascotServiceCache.module = new MascotService(
        this.getRepository(),
        this.getAnimationController(),
        this.getAssetManager()
      );
      this._mascotServiceCache.initialized = true;
    }

    return this._mascotServiceCache.module!;
  }

  /**
   * Reset all instances (useful for testing)
   */
  reset(): void {
    // Cleanup animation controller
    if (this._animationController) {
      this._animationController.destroy();
      this._animationController = null;
    }

    this._assetManager = null;
    this._repository = null;
    this._mascotServiceCache = {
      module: null,
      initialized: false,
    };
  }

  /**
   * Check if container has been initialized
   */
  isInitialized(): boolean {
    return this._mascotServiceCache.initialized;
  }

  /**
   * Get container statistics (for debugging)
   */
  getStats(): {
    singletons: {
      animationController: boolean;
      assetManager: boolean;
      repository: boolean;
      mascotService: boolean;
    };
  } {
    return {
      singletons: {
        animationController: this._animationController !== null,
        assetManager: this._assetManager !== null,
        repository: this._repository !== null,
        mascotService: this._mascotServiceCache.initialized,
      },
    };
  }

  /**
   * Cleanup method (call when app unmounts)
   */
  destroy(): void {
    // Destroy animation controller
    if (this._animationController) {
      this._animationController.destroy();
      this._animationController = null;
    }

    // Clear cache
    this._mascotServiceCache = {
      module: null,
      initialized: false,
    };

    // Reset other singletons
    this._assetManager = null;
    this._repository = null;
  }
}
