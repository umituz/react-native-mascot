/**
 * Asset Manager Interface
 * Defines contract for loading and managing mascot assets
 */

import type { MascotAnimation } from '../types/MascotTypes';

export interface IAssetManager {
  /**
   * Load a Lottie animation
   */
  loadLottieAnimation(source: string | object): Promise<MascotAnimation>;

  /**
   * Load an SVG asset
   */
  loadSVGAsset(source: string): Promise<string>;

  /**
   * Preload multiple animations
   */
  preloadAnimations(sources: Array<string | object>): Promise<void>;

  /**
   * Clear cached assets
   */
  clearCache(): void;

  /**
   * Get asset URL or path
   */
  getAssetUrl(assetId: string): string | null;

  /**
   * Check if asset is loaded
   */
  isAssetLoaded(assetId: string): boolean;

  /**
   * Get all loaded assets
   */
  getLoadedAssets(): string[];
}

export interface AssetCache {
  [key: string]: {
    data: unknown;
    timestamp: number;
    size: number;
  };
}
