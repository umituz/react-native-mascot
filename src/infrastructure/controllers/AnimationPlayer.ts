/**
 * Animation Player (100 lines)
 * Core playback logic for mascot animations
 */

import type { MascotAnimation } from '../../domain/types/MascotTypes';
import type { AnimationOptions } from '../../domain/interfaces/IAnimationController';
import { AnimationTimer } from './AnimationTimer';

export class AnimationPlayer {
  private _currentAnimation: MascotAnimation | null = null;
  private _isPlaying: boolean = false;
  private _isPaused: boolean = false;
  private _progress: number = 0;
  private _speed: number = 1;
  private readonly _timer: AnimationTimer;

  constructor() {
    this._timer = new AnimationTimer();
  }

  get currentAnimation(): MascotAnimation | null {
    return this._currentAnimation;
  }

  get isPlaying(): boolean {
    return this._isPlaying && !this._isPaused;
  }

  get progress(): number {
    return this._progress;
  }

  get speed(): number {
    return this._speed;
  }

  play(animation: MascotAnimation, options?: AnimationOptions): Promise<void> {
    // Stop existing animation
    this.stop();

    this._currentAnimation = animation;
    this._isPlaying = true;
    this._isPaused = false;

    if (options?.speed !== undefined) {
      this._speed = options.speed;
    }

    const duration = animation.duration || 2000;
    const adjustedDuration = duration / this._speed;

    // Start timer
    this._timer.start(adjustedDuration, () => {
      this._isPlaying = false;
      this._progress = 1;
      options?.onFinish?.();
    });

    options?.onStart?.();
    return Promise.resolve();
  }

  pause(): void {
    if (!this._isPlaying || this._isPaused) return;

    this._isPaused = true;
    this._timer.pause();
  }

  resume(): void {
    if (!this._isPaused) return;

    this._isPaused = false;
    this._timer.resume();
  }

  stop(): void {
    this._isPlaying = false;
    this._isPaused = false;
    this._progress = 0;
    this._currentAnimation = null;
    this._timer.stop();
  }

  setProgress(progress: number): void {
    if (progress < 0 || progress > 1) {
      throw new Error('Progress must be between 0 and 1');
    }
    this._progress = progress;
  }

  setSpeed(speed: number): void {
    if (speed <= 0) {
      throw new Error('Speed must be greater than 0');
    }
    this._speed = speed;
  }

  destroy(): void {
    this.stop();
    this._timer.destroy();
  }
}
