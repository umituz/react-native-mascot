/**
 * Mascot Repository Interface
 * Defines contract for mascot data persistence and retrieval
 */

import type { Mascot } from '../entities/Mascot';
import type { MascotConfig } from '../types/MascotTypes';

export interface IMascotRepository {
  /**
   * Save a mascot configuration
   */
  save(config: MascotConfig): Promise<void>;

  /**
   * Load a mascot by ID
   */
  load(id: string): Promise<Mascot | null>;

  /**
   * Load all mascots
   */
  loadAll(): Promise<Mascot[]>;

  /**
   * Delete a mascot
   */
  delete(id: string): Promise<void>;

  /**
   * Update mascot configuration
   */
  update(id: string, config: Partial<MascotConfig>): Promise<void>;

  /**
   * Check if mascot exists
   */
  exists(id: string): Promise<boolean>;
}
