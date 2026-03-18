/**
 * Animation Controller Implementation
 * Controls Lottie and SVG animations with unified API
 */

import type {
  IAnimationController,
  AnimationOptions,
  AnimationEvent,
} from '../../domain/interfaces/IAnimationController';
import type { MascotAnimation } from '../../domain/types/MascotTypes';

export class AnimationController implements IAnimationController {
  private _currentAnimation: MascotAnimation | null = null;
  private _isPlaying: boolean = false;
  private _isPaused: boolean = false;
  private _progress: number = 0;
  private _speed: number = 1;
  private _eventListeners: Map<AnimationEvent, Set<(data?: unknown) => void>>;

  constructor() {
    this._eventListeners = new Map();
    this._initializeEventListeners();
  }

  play(
    animation: MascotAnimation,
    options?: AnimationOptions
  ): Promise<void> {
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
      setTimeout(() => {
        if (this._isPlaying && !this._isPaused) {
          this._isPlaying = false;
          this._progress = 1;
          this._emit('finish', { animation: animation.id });
          options?.onFinish?.();
        }
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

    this._eventListeners.get(event)!.add(callback);

    // Return unsubscribe function
    return () => {
      this.off(event, callback);
    };
  }

  off(event: AnimationEvent, callback: (data?: unknown) => void): void {
    const listeners = this._eventListeners.get(event);
    if (listeners) {
      listeners.delete(callback);
    }
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

  private _emit(event: AnimationEvent, data?: unknown): void {
    const listeners = this._eventListeners.get(event);
    if (listeners) {
      listeners.forEach((callback) => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in ${event} event listener:`, error);
        }
      });
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
