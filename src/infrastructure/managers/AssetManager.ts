/**
 * Asset Manager Implementation
 * Loads and caches Lottie and SVG assets
 */

import type {
  IAssetManager,
  AssetCache,
} from '../../domain/interfaces/IAssetManager';
import type { MascotAnimation } from '../../domain/types/MascotTypes';

export class AssetManager implements IAssetManager {
  private readonly _cache: AssetCache;
  private readonly _loadedAssets: Set<string>;
  private readonly _maxCacheSize: number = 50 * 1024 * 1024; // 50MB
  private _currentCacheSize: number = 0;

  constructor() {
    this._cache = {};
    this._loadedAssets = new Set();
  }

  loadLottieAnimation(
    source: string | object
  ): Promise<MascotAnimation> {
    const assetId = this._getAssetId(source);

    if (this._isAssetLoaded(assetId)) {
      return Promise.resolve(this._cache[assetId].data as MascotAnimation);
    }

    // Simulate loading - in real implementation, this would actually load the file
    const animation: MascotAnimation = {
      id: assetId,
      name: typeof source === 'string' ? source.split('/').pop() || 'unknown' : 'custom',
      type: 'idle',
      source,
      loop: false,
      autoplay: false,
    };

    this._cacheAsset(assetId, animation);
    return Promise.resolve(animation);
  }

  loadSVGAsset(source: string): Promise<string> {
    if (this._isAssetLoaded(source)) {
      return Promise.resolve(this._cache[source].data as string);
    }

    // Simulate loading - in real implementation, this would load the SVG file
    const svgContent = this._loadSVGFromFile(source);
    this._cacheAsset(source, svgContent);
    return Promise.resolve(svgContent);
  }

  async preloadAnimations(sources: Array<string | object>): Promise<void> {
    const promises = sources.map((source) =>
      this.loadLottieAnimation(source)
    );
    await Promise.all(promises);
  }

  clearCache(): void {
    Object.keys(this._cache).forEach((key) => {
      delete this._cache[key];
    });
    this._loadedAssets.clear();
    this._currentCacheSize = 0;
  }

  getAssetUrl(assetId: string): string | null {
    if (this._isAssetLoaded(assetId)) {
      return assetId;
    }
    return null;
  }

  isAssetLoaded(assetId: string): boolean {
    return this._loadedAssets.has(assetId);
  }

  getLoadedAssets(): string[] {
    return Array.from(this._loadedAssets);
  }

  // Private Methods
  private _getAssetId(source: string | object): string {
    if (typeof source === 'string') {
      return source;
    }
    return JSON.stringify(source);
  }

  private _cacheAsset(assetId: string, data: unknown): void {
    const size = this._estimateSize(data);

    // Check if cache is full
    if (this._currentCacheSize + size > this._maxCacheSize) {
      this._evictOldestAssets();
    }

    this._cache[assetId] = {
      data,
      timestamp: Date.now(),
      size,
    };

    this._loadedAssets.add(assetId);
    this._currentCacheSize += size;
  }

  private _isAssetLoaded(assetId: string): boolean {
    return this._loadedAssets.has(assetId) && !!this._cache[assetId];
  }

  private _evictOldestAssets(): void {
    const sortedAssets = Object.entries(this._cache)
      .sort(([, a], [, b]) => a.timestamp - b.timestamp);

    let freedSpace = 0;
    const targetSpace = this._maxCacheSize * 0.3; // Evict 30% of cache

    for (const [assetId, asset] of sortedAssets) {
      if (freedSpace >= targetSpace) {
        break;
      }

      delete this._cache[assetId];
      this._loadedAssets.delete(assetId);
      freedSpace += asset.size;
      this._currentCacheSize -= asset.size;
    }
  }

  private _estimateSize(data: unknown): number {
    // Rough estimation in bytes
    return JSON.stringify(data).length * 2; // 2 bytes per char (UTF-16)
  }

  private _loadSVGFromFile(_source: string): string {
    // In real implementation, this would use FileSystem or require()
    // For now, return a placeholder
    return `<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="currentColor"/></svg>`;
  }

  // Getters
  get cacheSize(): number {
    return this._currentCacheSize;
  }

  get cacheStats(): { size: number; count: number; maxSize: number } {
    return {
      size: this._currentCacheSize,
      count: this._loadedAssets.size,
      maxSize: this._maxCacheSize,
    };
  }
}
