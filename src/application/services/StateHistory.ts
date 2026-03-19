/**
 * State History (60 lines)
 * Efficient history tracking with circular buffer
 */

import type { MascotAnimationState } from '../../domain/types/AnimationStateTypes';

interface HistoryEntry {
  state: MascotAnimationState;
  timestamp: number;
  triggeredBy: 'user' | 'system' | 'auto-transition';
}

export class StateHistory {
  private readonly _buffer: HistoryEntry[];
  private readonly _capacity: number;
  private _size: number = 0;
  private _head: number = 0;

  constructor(capacity: number = 50) {
    this._capacity = capacity;
    this._buffer = new Array(capacity);
  }

  add(state: MascotAnimationState, triggeredBy: HistoryEntry['triggeredBy']): void {
    this._buffer[this._head] = { state, timestamp: Date.now(), triggeredBy };
    this._head = (this._head + 1) % this._capacity;

    if (this._size < this._capacity) {
      this._size++;
    }
  }

  getStates(): MascotAnimationState[] {
    const result: MascotAnimationState[] = [];
    let index = this._head - this._size;

    for (let i = 0; i < this._size; i++) {
      if (index < 0) index += this._capacity;
      result.push(this._buffer[index].state);
      index++;
    }

    return result;
  }

  clear(): void {
    this._size = 0;
    this._head = 0;
  }

  get size(): number {
    return this._size;
  }
}
