/**
 * Animation State Manager (OPTIMIZED)
 * State machine for managing mascot animation states with auto-transitions
 * Memory leak prevention and better timer management
 */

import type { MascotAnimationState, StateHistoryEntry } from '../../domain/types/AnimationStateTypes';
import { AnimationState } from '../../domain/value-objects/AnimationState';

// Maximum state history to prevent memory bloat
const MAX_STATE_HISTORY = 50;

// Circular buffer for state history (more memory efficient)
class CircularBuffer<T> {
  private buffer: T[];
  private capacity: number;
  private size: number = 0;
  private head: number = 0;
  private tail: number = 0;

  constructor(capacity: number) {
    this.capacity = capacity;
    this.buffer = new Array(capacity);
  }

  push(item: T): void {
    this.buffer[this.head] = item;
    this.head = (this.head + 1) % this.capacity;

    if (this.size < this.capacity) {
      this.size++;
    } else {
      // Buffer is full, move tail
      this.tail = (this.tail + 1) % this.capacity;
    }
  }

  toArray(): T[] {
    const result: T[] = [];
    let index = this.tail;

    for (let i = 0; i < this.size; i++) {
      result.push(this.buffer[index]);
      index = (index + 1) % this.capacity;
    }

    return result;
  }

  clear(): void {
    this.size = 0;
    this.head = 0;
    this.tail = 0;
  }

  get length(): number {
    return this.size;
  }
}

export interface StateManagerConfig {
  enableAutoTransition?: boolean;
  enableHistoryTracking?: boolean;
  maxHistorySize?: number;
  onStateChange?: (from: MascotAnimationState, to: MascotAnimationState) => void;
}

/**
 * Timer entry for better tracking
 */
interface TimerEntry {
  timeout: NodeJS.Timeout;
  targetState: MascotAnimationState;
  timestamp: number;
}

export class AnimationStateManager {
  private _currentState: AnimationState;
  private _previousState: AnimationState | null = null;
  private _stateHistory: CircularBuffer<StateHistoryEntry>;
  private _activeTimers: Map<MascotAnimationState, TimerEntry>;

  private readonly _config: Required<StateManagerConfig>;

  constructor(
    initialState: MascotAnimationState = 'idle',
    config: StateManagerConfig = {}
  ) {
    this._currentState = AnimationState.create(initialState);
    this._stateHistory = new CircularBuffer<StateHistoryEntry>(
      config.maxHistorySize || MAX_STATE_HISTORY
    );
    this._activeTimers = new Map();

    this._config = {
      enableAutoTransition: config.enableAutoTransition ?? true,
      enableHistoryTracking: config.enableHistoryTracking ?? true,
      maxHistorySize: config.maxHistorySize ?? MAX_STATE_HISTORY,
      onStateChange: config.onStateChange ?? (() => {}),
    };
  }

  /**
   * Get current animation state
   */
  get currentState(): AnimationState {
    return this._currentState;
  }

  /**
   * Get current state value
   */
  get currentStateValue(): MascotAnimationState {
    return this._currentState.value;
  }

  /**
   * Get previous state
   */
  get previousState(): AnimationState | null {
    return this._previousState;
  }

  /**
   * Get state history
   */
  get stateHistory(): StateHistoryEntry[] {
    return this._stateHistory.toArray();
  }

  /**
   * Get active timers count (for debugging)
   */
  get activeTimersCount(): number {
    return this._activeTimers.size;
  }

  /**
   * Transition to a new state
   */
  transitionTo(
    newState: MascotAnimationState,
    triggeredBy: StateHistoryEntry['triggeredBy'] = 'user'
  ): void {
    const targetState = AnimationState.create(newState);

    // Check if transition is allowed
    if (!this._currentState.canTransitionTo(newState)) {
      throw new Error(
        `Cannot transition from '${this._currentState.value}' to '${newState}'. ` +
        `Valid transitions: ${this._currentState.getAvailableTransitions().map(t => t.to).join(', ')}`
      );
    }

    // Clear any pending auto-transitions for current state
    this._clearTransitionTimeout(this._currentState.value);

    // Store previous state
    this._previousState = this._currentState;

    // Track state change
    if (this._config.enableHistoryTracking) {
      this._addToHistory(this._currentState.value, triggeredBy);
    }

    // Update current state
    const oldState = this._currentState.value;
    this._currentState = targetState;

    // Notify state change
    this._config.onStateChange(oldState, newState);

    // Schedule auto-transition if configured
    if (this._config.enableAutoTransition && !this._currentState.shouldLoop()) {
      const next = this._currentState.getNextState();
      if (next) {
        this._scheduleAutoTransition(next);
      }
    }
  }

  /**
   * Trigger success state (shortcut method)
   */
  triggerSuccess(): void {
    this.transitionTo('success', 'system');
  }

  /**
   * Trigger error state (shortcut method)
   */
  triggerError(): void {
    this.transitionTo('error', 'system');
  }

  /**
   * Start loading state (shortcut method)
   */
  startLoading(): void {
    this.transitionTo('loading', 'system');
  }

  /**
   * Stop loading and transition to success/error (shortcut method)
   */
  stopLoading(success: boolean = true): void {
    if (this._currentState.isLoadingState()) {
      this.transitionTo(success ? 'success' : 'error', 'system');
    }
  }

  /**
   * Reset to idle state
   */
  reset(): void {
    this.transitionTo('idle', 'system');
  }

  /**
   * Check if current state loops
   */
  isLooping(): boolean {
    return this._currentState.shouldLoop();
  }

  /**
   * Get current animation duration
   */
  getCurrentDuration(): number {
    return this._currentState.getDuration();
  }

  /**
   * Get current animation speed
   */
  getCurrentSpeed(): number {
    return this._currentState.getSpeed();
  }

  /**
   * Clear all active timers
   */
  private _clearAllTimers(): void {
    for (const entry of this._activeTimers.values()) {
      clearTimeout(entry.timeout);
    }
    this._activeTimers.clear();
  }

  /**
   * Clear specific transition timeout
   */
  private _clearTransitionTimeout(state: MascotAnimationState): void {
    const entry = this._activeTimers.get(state);
    if (entry) {
      clearTimeout(entry.timeout);
      this._activeTimers.delete(state);
    }
  }

  /**
   * Schedule auto-transition after current state completes
   */
  private _scheduleAutoTransition(targetState: MascotAnimationState): void {
    // Clear any existing timer for this state
    this._clearTransitionTimeout(this._currentState.value);

    const duration = this._currentState.getDuration();
    const delay = this._currentState.getTransitionDelay(targetState);

    const timeout = setTimeout(() => {
      // Remove from active timers
      this._activeTimers.delete(this._currentState.value);

      // Transition to target state
      try {
        this.transitionTo(targetState, 'auto-transition');
      } catch (error) {
        console.warn('Auto-transition failed:', error);
      }
    }, duration + delay);

    // Store timer entry
    this._activeTimers.set(this._currentState.value, {
      timeout,
      targetState,
      timestamp: Date.now(),
    });
  }

  /**
   * Add state to history (using circular buffer)
   */
  private _addToHistory(state: MascotAnimationState, triggeredBy: StateHistoryEntry['triggeredBy']): void {
    const entry: StateHistoryEntry = {
      state,
      timestamp: Date.now(),
      triggeredBy,
    };

    this._stateHistory.push(entry);
  }

  /**
   * Cleanup method (call when unmounting)
   */
  destroy(): void {
    // Clear all timers
    this._clearAllTimers();

    // Clear history
    this._stateHistory.clear();

    // Clear state change callback
    this._config.onStateChange = () => {};
  }

  /**
   * Get debug information
   */
  getDebugInfo(): {
    currentState: MascotAnimationState;
    previousState: MascotAnimationState | null;
    activeTimers: number;
    historySize: number;
    isLooping: boolean;
    autoTransitionEnabled: boolean;
  } {
    return {
      currentState: this._currentState.value,
      previousState: this._previousState?.value || null,
      activeTimers: this._activeTimers.size,
      historySize: this._stateHistory.length,
      isLooping: this.isLooping(),
      autoTransitionEnabled: this._config.enableAutoTransition,
    };
  }
}
