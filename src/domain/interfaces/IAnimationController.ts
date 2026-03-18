/**
 * Animation Controller Interface
 * Defines contract for animation playback control
 */

import type { MascotAnimation } from '../types/MascotTypes';

export interface IAnimationController {
  /**
   * Play an animation
   */
  play(animation: MascotAnimation, options?: AnimationOptions): Promise<void>;

  /**
   * Pause current animation
   */
  pause(): void;

  /**
   * Resume paused animation
   */
  resume(): void;

  /**
   * Stop current animation
   */
  stop(): void;

  /**
   * Get current animation progress (0-1)
   */
  getProgress(): number;

  /**
   * Set animation progress (0-1)
   */
  setProgress(progress: number): void;

  /**
   * Set animation speed multiplier
   */
  setSpeed(speed: number): void;

  /**
   * Check if currently playing
   */
  isPlaying(): boolean;

  /**
   * Add event listener
   */
  on(
    event: AnimationEvent,
    callback: (data?: unknown) => void
  ): () => void;

  /**
   * Remove event listener
   */
  off(event: AnimationEvent, callback: (data?: unknown) => void): void;
}

export type AnimationEvent =
  | 'start'
  | 'finish'
  | 'pause'
  | 'resume'
  | 'progress'
  | 'error';

export interface AnimationOptions {
  speed?: number;
  loop?: boolean;
  autoplay?: boolean;
  onStart?: () => void;
  onFinish?: () => void;
  onError?: (error: Error) => void;
}
