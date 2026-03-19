/**
 * Event Manager (80 lines)
 * Event listener management with memory leak prevention
 */

import type { AnimationEvent } from '../../domain/interfaces/IAnimationController';

// Maximum listeners per event
const MAX_LISTENERS = 10;

interface ListenerWrapper {
  callback: (data?: unknown) => void;
  isActive: boolean;
}

export class EventManager {
  private _listeners: Map<AnimationEvent, Set<ListenerWrapper>>;

  constructor() {
    this._listeners = new Map();
    this._initializeListeners();
  }

  on(event: AnimationEvent, callback: (data?: unknown) => void): () => void {
    const listeners = this._getListeners(event);

    // Check limit
    if (listeners.size >= MAX_LISTENERS) {
      console.warn(`Max listeners (${MAX_LISTENERS}) for event "${event}"`);
    }

    const wrapper: ListenerWrapper = { callback, isActive: true };
    listeners.add(wrapper);

    return () => {
      wrapper.isActive = false;
      listeners.delete(wrapper);
    };
  }

  off(event: AnimationEvent, callback: (data?: unknown) => void): void {
    const listeners = this._getListeners(event);
    for (const wrapper of listeners) {
      if (wrapper.callback === callback) {
        wrapper.isActive = false;
        listeners.delete(wrapper);
        break;
      }
    }
  }

  emit(event: AnimationEvent, data?: unknown): void {
    const listeners = this._listeners.get(event);
    if (!listeners || listeners.size === 0) return;

    for (const wrapper of listeners) {
      if (wrapper.isActive) {
        try {
          wrapper.callback(data);
        } catch {
          // Silent fail to prevent breaking animation
        }
      }
    }

    // Periodic cleanup
    if (listeners.size > MAX_LISTENERS / 2) {
      this._cleanupInactive(event);
    }
  }

  clear(): void {
    this._listeners.clear();
    this._initializeListeners();
  }

  private _getListeners(event: AnimationEvent): Set<ListenerWrapper> {
    if (!this._listeners.has(event)) {
      this._listeners.set(event, new Set());
    }
    return this._listeners.get(event)!;
  }

  private _initializeListeners(): void {
    const events: AnimationEvent[] = ['start', 'finish', 'pause', 'resume', 'progress', 'error'];
    events.forEach((event) => {
      if (!this._listeners.has(event)) {
        this._listeners.set(event, new Set());
      }
    });
  }

  private _cleanupInactive(event: AnimationEvent): void {
    const listeners = this._listeners.get(event);
    if (!listeners) return;

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
}
