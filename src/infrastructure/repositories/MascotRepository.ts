/**
 * Mascot Repository Implementation
 * In-memory repository with support for persistence (can be extended)
 */

import type { IMascotRepository } from '../../domain/interfaces/IMascotRepository';
import type { MascotConfig } from '../../domain/types/MascotTypes';
import { Mascot } from '../../domain/entities/Mascot';

export class MascotRepository implements IMascotRepository {
  private readonly _storage: Map<string, MascotConfig>;
  private readonly _mascotCache: Map<string, Mascot>;

  constructor() {
    this._storage = new Map();
    this._mascotCache = new Map();
  }

  save(config: MascotConfig): Promise<void> {
    this._storage.set(config.id, config);
    this._mascotCache.delete(config.id); // Invalidate cache
    return Promise.resolve();
  }

  load(id: string): Promise<Mascot | null> {
    // Check cache first
    if (this._mascotCache.has(id)) {
      return Promise.resolve(this._mascotCache.get(id)!);
    }

    const config = this._storage.get(id);
    if (!config) {
      return Promise.resolve(null);
    }

    const mascot = new Mascot(config);
    this._mascotCache.set(id, mascot);
    return Promise.resolve(mascot);
  }

  async loadAll(): Promise<Mascot[]> {
    const mascots: Mascot[] = [];
    for (const config of this._storage.values()) {
      const mascot = await this.load(config.id);
      if (mascot !== null) {
        mascots.push(mascot);
      }
    }
    return mascots;
  }

  delete(id: string): Promise<void> {
    this._storage.delete(id);
    this._mascotCache.delete(id);
    return Promise.resolve();
  }

  update(id: string, config: Partial<MascotConfig>): Promise<void> {
    const existing = this._storage.get(id);
    if (!existing) {
      throw new Error(`Mascot ${id} not found`);
    }

    const updated: MascotConfig = {
      ...existing,
      ...config,
      id, // Ensure ID cannot be changed
    };

    this._storage.set(id, updated);
    this._mascotCache.delete(id);
    return Promise.resolve();
  }

  exists(id: string): Promise<boolean> {
    return Promise.resolve(this._storage.has(id));
  }

  /**
   * Clear all stored mascots
   */
  clear(): void {
    this._storage.clear();
    this._mascotCache.clear();
  }

  /**
   * Get storage size
   */
  get size(): number {
    return this._storage.size;
  }
}
