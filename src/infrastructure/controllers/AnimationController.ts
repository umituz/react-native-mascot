/**
 * Animation Controller Implementation (OPTIMIZED)
 * Controls Lottie and SVG animations with unified API
 * Performance optimizations for event system and memory management
 */

import type {
  IAnimationController,
  AnimationOptions,
  AnimationEvent,
} from '../../domain/interfaces/IAnimationController';
import type { MascotAnimation } from '../../domain/types/MascotTypes';

// Maximum listeners per event to prevent memory leaks
const MAX_LISTENERS_PER_EVENT = 10;

// Listener wrapper for cleanup tracking
interface ListenerWrapper {
  callback: (data?: unknown) => void;
  isActive: boolean;
}

export class AnimationController implements IAnimationController {
  private _currentAnimation: MascotAnimation | null = null;
  private _isPlaying: boolean = false;
  private _isPaused: boolean = false;
  private _progress: number = 0;
  private _speed: number = 1;
  private _eventListeners: Map<AnimationEvent, Set<ListenerWrapper>>;
  private _animationTimer: NodeJS.Timeout | null = null;

  constructor() {
    this._eventListeners = new Map();
    this._initializeEventListeners();
  }

  play(
    animation: MascotAnimation,
    options?: AnimationOptions
  ): Promise<void> {
    // Stop any existing animation
    this._stopCurrentAnimation();

    this._currentAnimation = animation;
    this._isPlaying = true;
    this._isPaused = false;

    if (options?.speed !== undefined) {
      this._speed = options.speed;
    }

    this._emit('start', { animation: animation.id });

    // Simulate animation completion
    // In real implementation, this would be controlled by LottieView
    const duration = animation.duration || 2000;
    const adjustedDuration = duration / this._speed;

    return new Promise((resolve) => {
      this._animationTimer = setTimeout(() => {
        if (this._isPlaying && !this._isPaused) {
          this._isPlaying = false;
          this._progress = 1;
          this._emit('finish', { animation: animation.id });
          options?.onFinish?.();
        }
        this._animationTimer = null;
        resolve();
      }, adjustedDuration);

      options?.onStart?.();
    });
  }

  pause(): void {
    if (!this._isPlaying || this._isPaused) {
      return;
    }

    this._isPaused = true;

    // Clear timer if set
    if (this._animationTimer) {
      clearTimeout(this._animationTimer);
      this._animationTimer = null;
    }

    this._emit('pause');
  }

  resume(): void {
    if (!this._isPaused) {
      return;
    }

    this._isPaused = false;
    this._emit('resume');
  }

  stop(): void {
    this._stopCurrentAnimation();
    this._isPlaying = false;
    this._isPaused = false;
    this._progress = 0;
    this._currentAnimation = null;
  }

  getProgress(): number {
    return this._progress;
  }

  setProgress(progress: number): void {
    if (progress < 0 || progress > 1) {
      throw new Error('Progress must be between 0 and 1');
    }
    this._progress = progress;
    this._emit('progress', { progress });
  }

  setSpeed(speed: number): void {
    if (speed <= 0) {
      throw new Error('Speed must be greater than 0');
    }
    this._speed = speed;
  }

  isPlaying(): boolean {
    return this._isPlaying && !this._isPaused;
  }

  on(event: AnimationEvent, callback: (data?: unknown) => void): () => void {
    if (!this._eventListeners.has(event)) {
      this._eventListeners.set(event, new Set());
    }

    const listeners = this._eventListeners.get(event)!;

    // Check limit to prevent memory leaks
    if (listeners.size >= MAX_LISTENERS_PER_EVENT) {
      console.warn(
        `Maximum listeners (${MAX_LISTENERS_PER_EVENT}) reached for event "${event}". ` +
        'This may indicate a memory leak. Consider removing unused listeners.'
      );
    }

    const wrapper: ListenerWrapper = {
      callback,
      isActive: true,
    };

    listeners.add(wrapper);

    // Return unsubscribe function
    return () => {
      wrapper.isActive = false;
      listeners.delete(wrapper);
    };
  }

  off(event: AnimationEvent, callback: (data?: unknown) => void): void {
    const listeners = this._eventListeners.get(event);
    if (!listeners) {
      return;
    }

    // Find and remove the matching wrapper
    for (const wrapper of listeners) {
      if (wrapper.callback === callback) {
        wrapper.isActive = false;
        listeners.delete(wrapper);
        break;
      }
    }
  }

  /**
   * Cleanup method (call when unmounting)
   */
  destroy(): void {
    this.stop();
    this._eventListeners.clear();
  }

  // Private Methods
  private _initializeEventListeners(): void {
    const events: AnimationEvent[] = ['start', 'finish', 'pause', 'resume', 'progress', 'error'];
    events.forEach((event) => {
      if (!this._eventListeners.has(event)) {
        this._eventListeners.set(event, new Set());
      }
    });
  }

  /**
   * Stop current animation and clean up timer
   */
  private _stopCurrentAnimation(): void {
    if (this._animationTimer) {
      clearTimeout(this._animationTimer);
      this._animationTimer = null;
    }
  }

  /**
   * Emit event to all active listeners (optimized)
   */
  private _emit(event: AnimationEvent, data?: unknown): void {
    const listeners = this._eventListeners.get(event);
    if (!listeners || listeners.size === 0) {
      return;
    }

    // Iterate and call only active listeners
    // Use for...of to avoid iterator allocation
    for (const wrapper of listeners) {
      if (!wrapper.isActive) {
        continue;
      }

      try {
        wrapper.callback(data);
      } catch {
        // Silently ignore errors in event listeners to prevent breaking the animation system
        // In production, consider logging to error tracking service
      }
    }

    // Clean up inactive listeners periodically
    if (listeners.size > MAX_LISTENERS_PER_EVENT / 2) {
      this._cleanupInactiveListeners(event);
    }
  }

  /**
   * Clean up inactive listeners for a specific event
   */
  private _cleanupInactiveListeners(event: AnimationEvent): void {
    const listeners = this._eventListeners.get(event);
    if (!listeners) {
      return;
    }

    const toRemove: ListenerWrapper[] = [];
    for (const wrapper of listeners) {
      if (!wrapper.isActive) {
        toRemove.push(wrapper);
      }
    }

    for (const wrapper of toRemove) {
      listeners.delete(wrapper);
    }
  }

  // Getters
  get currentAnimation(): MascotAnimation | null {
    return this._currentAnimation;
  }

  get speed(): number {
    return this._speed;
  }

  get isPaused(): boolean {
    return this._isPaused;
  }
}
