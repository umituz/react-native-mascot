/**
 * Animation Timer (60 lines)
 * Timer management with proper cleanup
 */

export class AnimationTimer {
  private _timer: NodeJS.Timeout | null = null;
  private _paused: boolean = false;
  private _startTime: number = 0;
  private _duration: number = 0;
  private _remaining: number = 0;

  start(duration: number, onComplete: () => void): void {
    this._duration = duration;
    this._startTime = Date.now();
    this._remaining = duration;
    this._paused = false;

    this._timer = setTimeout(() => {
      onComplete();
      this._timer = null;
    }, duration);
  }

  pause(): void {
    if (!this._timer || this._paused) return;

    const elapsed = Date.now() - this._startTime;
    this._remaining = this._duration - elapsed;
    clearTimeout(this._timer);
    this._timer = null;
    this._paused = true;
  }

  resume(): void {
    if (this._timer || !this._paused || this._remaining <= 0) return;

    this._startTime = Date.now();
    this._paused = false;

    this._timer = setTimeout(() => {
      this._timer = null;
    }, this._remaining);
  }

  stop(): void {
    if (this._timer) {
      clearTimeout(this._timer);
      this._timer = null;
    }
    this._paused = false;
    this._remaining = 0;
  }

  destroy(): void {
    this.stop();
  }

  get isActive(): boolean {
    return this._timer !== null;
  }
}
