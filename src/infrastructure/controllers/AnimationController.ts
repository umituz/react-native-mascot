/**
 * Animation Controller (Main - 60 lines)
 * Unified animation control interface
 */

import type { IAnimationController, AnimationOptions, AnimationEvent } from '../../domain/interfaces/IAnimationController';
import type { MascotAnimation } from '../../domain/types/MascotTypes';
import { AnimationPlayer } from './AnimationPlayer';
import { EventManager } from './EventManager';

export class AnimationController implements IAnimationController {
  private _player: AnimationPlayer;
  private _events: EventManager;

  constructor() {
    this._player = new AnimationPlayer();
    this._events = new EventManager();
  }

  play(animation: MascotAnimation, options?: AnimationOptions): Promise<void> {
    return this._player.play(animation, options);
  }

  pause(): void {
    this._player.pause();
    this._events.emit('pause');
  }

  resume(): void {
    this._player.resume();
    this._events.emit('resume');
  }

  stop(): void {
    this._player.stop();
  }

  getProgress(): number {
    return this._player.progress;
  }

  setProgress(progress: number): void {
    this._player.setProgress(progress);
    this._events.emit('progress', { progress });
  }

  setSpeed(speed: number): void {
    this._player.setSpeed(speed);
  }

  isPlaying(): boolean {
    return this._player.isPlaying;
  }

  on(event: AnimationEvent, callback: (data?: unknown) => void): () => void {
    return this._events.on(event, callback);
  }

  off(event: AnimationEvent, callback: (data?: unknown) => void): void {
    this._events.off(event, callback);
  }

  destroy(): void {
    this._player.destroy();
    this._events.clear();
  }
}
