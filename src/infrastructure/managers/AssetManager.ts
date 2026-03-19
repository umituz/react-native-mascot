/**
 * Asset Manager Implementation (OPTIMIZED)
 * Loads and caches Lottie and SVG assets with LRU cache
 */

import type { IAssetManager } from '../../domain/interfaces/IAssetManager';
import type { MascotAnimation } from '../../domain/types/MascotTypes';
import { LRUCache } from '../utils/LRUCache';

// Cache size constants
const DEFAULT_MAX_CACHE_SIZE_BYTES = 50 * 1024 * 1024; // 50MB
const CACHE_EVICTION_RATIO = 0.3; // Evict 30% of cache when full
const BYTES_PER_CHAR = 2; // UTF-16 encoding

// Size cache to avoid repeated JSON.stringify calls
const SIZE_CACHE_MAX_SIZE = 100;
const sizeCache = new Map<unknown, number>();

/**
 * Get estimated size with caching
 */
function getEstimatedSize(data: unknown): number {
  // Check cache first
  if (sizeCache.has(data)) {
    return sizeCache.get(data)!;
  }

  // Calculate and cache
  const size = JSON.stringify(data).length * BYTES_PER_CHAR;

  // Add to cache if space available
  if (sizeCache.size < SIZE_CACHE_MAX_SIZE) {
    sizeCache.set(data, size);
  }

  return size;
}

/**
 * Cache entry with metadata
 */
interface CacheEntry {
  data: unknown;
  size: number;
  timestamp: number;
}

export class AssetManager implements IAssetManager {
  private readonly lruCache: LRUCache<string, CacheEntry>;
  private _currentCacheSize: number = 0;
  private readonly _maxCacheSize: number;

  constructor(maxCacheSize: number = DEFAULT_MAX_CACHE_SIZE_BYTES) {
    this._maxCacheSize = maxCacheSize;
    // Cache up to 1000 items (will be limited by size anyway)
    this.lruCache = new LRUCache<string, CacheEntry>(1000);
  }

  loadLottieAnimation(
    source: string | object
  ): Promise<MascotAnimation> {
    const assetId = this._getAssetId(source);

    // Check LRU cache first (O(1) operation)
    const cached = this.lruCache.get(assetId);
    if (cached) {
      return Promise.resolve(cached.data as MascotAnimation);
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

    // Cache the animation
    this._cacheAsset(assetId, animation);
    return Promise.resolve(animation);
  }

  loadSVGAsset(source: string): Promise<string> {
    // Check LRU cache first
    const cached = this.lruCache.get(source);
    if (cached) {
      return Promise.resolve(cached.data as string);
    }

    // Simulate loading - in real implementation, this would load the SVG file
    const svgContent = this._loadSVGFromFile(source);
    this._cacheAsset(source, svgContent);
    return Promise.resolve(svgContent);
  }

  async preloadAnimations(sources: Array<string | object>): Promise<void> {
    // Load in parallel for better performance
    const promises = sources.map((source) =>
      this.loadLottieAnimation(source)
    );
    await Promise.all(promises);
  }

  clearCache(): void {
    this.lruCache.clear();
    this._currentCacheSize = 0;
    sizeCache.clear(); // Clear size cache too
  }

  getAssetUrl(assetId: string): string | null {
    if (this.lruCache.has(assetId)) {
      return assetId;
    }
    return null;
  }

  isAssetLoaded(assetId: string): boolean {
    return this.lruCache.has(assetId);
  }

  getLoadedAssets(): string[] {
    return this.lruCache.keys();
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): {
    size: number;
    count: number;
    maxSize: number;
    usage: number;
    lruStats: { size: number; capacity: number; usage: number };
  } {
    return {
      size: this._currentCacheSize,
      count: this.lruCache.size(),
      maxSize: this._maxCacheSize,
      usage: this._currentCacheSize / this._maxCacheSize,
      lruStats: this.lruCache.getStats(),
    };
  }

  // Private Methods
  private _getAssetId(source: string | object): string {
    if (typeof source === 'string') {
      return source;
    }
    return JSON.stringify(source);
  }

  /**
   * Cache asset with LRU eviction
   */
  private _cacheAsset(assetId: string, data: unknown): void {
    const size = getEstimatedSize(data);

    // Check if single asset exceeds cache size
    if (size > this._maxCacheSize) {
      console.warn(`Asset ${assetId} (${size} bytes) exceeds cache size (${this._maxCacheSize} bytes)`);
      return;
    }

    // Check if updating existing asset
    const existing = this.lruCache.get(assetId);
    if (existing) {
      this._currentCacheSize -= existing.size;
    }

    // Evict assets if needed (LRU handles this automatically)
    const spaceNeeded = size - (existing?.size || 0);
    if (this._currentCacheSize + spaceNeeded > this._maxCacheSize) {
      this._evictLRUAssets(spaceNeeded);
    }

    // Add to cache
    this.lruCache.set(assetId, {
      data,
      size,
      timestamp: Date.now(),
    });

    this._currentCacheSize += spaceNeeded;
  }

  /**
   * Evict LRU assets to make space (much faster than sorting)
   */
  private _evictLRUAssets(requiredSpace: number): void {
    const targetSpace = this._maxCacheSize * CACHE_EVICTION_RATIO;
    const spaceToFree = Math.max(requiredSpace, targetSpace);

    let freedSpace = 0;
    const keysToRemove: string[] = [];

    // Iterate from least recently used (tail) to most recently used (head)
    const keys = this.lruCache.keys();
    for (const key of keys) {
      if (freedSpace >= spaceToFree) {
        break;
      }

      const entry = this.lruCache.get(key);
      if (entry) {
        freedSpace += entry.size;
        keysToRemove.push(key);
      }
    }

    // Remove evicted entries
    for (const key of keysToRemove) {
      const entry = this.lruCache.get(key);
      if (entry) {
        this._currentCacheSize -= entry.size;
      }
      this.lruCache.delete(key);
    }
  }

  /**
   * Load SVG from file (placeholder)
   */
  private _loadSVGFromFile(_source: string): string {
    // In real implementation, this would use FileSystem or require()
    // For now, return a placeholder
    return `<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="currentColor"/></svg>`;
  }
}
