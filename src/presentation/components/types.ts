/**
 * Mascot Types
 * Shared type definitions for mascot components
 */

export type MascotState = 'idle' | 'thinking' | 'reacting' | 'excited' | 'speaking';

export type MascotSize = 'small' | 'medium' | 'large' | number;

export interface MascotTheme {
  /** Primary color (used for glow) */
  primary?: string;
  /** Glow effect color with alpha */
  glow?: string;
  /** Message bubble background */
  background?: string;
  /** Message text color */
  text?: string;
}
