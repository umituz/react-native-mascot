/**
 * Animation State Manager
 * State machine for managing mascot animation states with auto-transitions
 */

import type { MascotAnimationState, StateHistoryEntry } from '../../domain/types/AnimationStateTypes';
import { AnimationState } from '../../domain/value-objects/AnimationState';

export interface StateManagerConfig {
  enableAutoTransition?: boolean;
  enableHistoryTracking?: boolean;
  maxHistorySize?: number;
  onStateChange?: (from: MascotAnimationState, to: MascotAnimationState) => void;
}

export class AnimationStateManager {
  private _currentState: AnimationState;
  private _previousState: AnimationState | null = null;
  private _stateHistory: StateHistoryEntry[] = [];
  private _transitionTimeouts: Map<MascotAnimationState, NodeJS.Timeout> = new Map();

  private readonly _config: Required<StateManagerConfig>;

  constructor(
    initialState: MascotAnimationState = 'idle',
    config: StateManagerConfig = {}
  ) {
    this._currentState = AnimationState.create(initialState);
    this._config = {
      enableAutoTransition: config.enableAutoTransition ?? true,
      enableHistoryTracking: config.enableHistoryTracking ?? true,
      maxHistorySize: config.maxHistorySize ?? 50,
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
    return [...this._stateHistory];
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

    // Store previous state
    this._previousState = this._currentState;

    // Clear any pending auto-transitions
    this._clearTransitionTimeout(this._currentState.value);

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
      const nextState = this._currentState.getNextState();
      if (nextState) {
        this._scheduleAutoTransition(nextState);
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
   * Clear all pending transitions
   */
  private _clearAllTransitionTimeouts(): void {
    this._transitionTimeouts.forEach(timeout => clearTimeout(timeout));
    this._transitionTimeouts.clear();
  }

  /**
   * Clear specific transition timeout
   */
  private _clearTransitionTimeout(state: MascotAnimationState): void {
    const timeout = this._transitionTimeouts.get(state);
    if (timeout) {
      clearTimeout(timeout);
      this._transitionTimeouts.delete(state);
    }
  }

  /**
   * Schedule auto-transition after current state completes
   */
  private _scheduleAutoTransition(targetState: MascotAnimationState): void {
    const duration = this._currentState.getDuration();
    const delay = this._currentState.getTransitionDelay(targetState);

    const timeout = setTimeout(() => {
      this.transitionTo(targetState, 'auto-transition');
    }, duration + delay);

    this._transitionTimeouts.set(this._currentState.value, timeout);
  }

  /**
   * Add state to history
   */
  private _addToHistory(state: MascotAnimationState, triggeredBy: StateHistoryEntry['triggeredBy']): void {
    const entry: StateHistoryEntry = {
      state,
      timestamp: Date.now(),
      triggeredBy,
    };

    this._stateHistory.push(entry);

    // Trim history if it exceeds max size
    if (this._stateHistory.length > this._config.maxHistorySize) {
      this._stateHistory = this._stateHistory.slice(-this._config.maxHistorySize);
    }
  }

  /**
   * Cleanup method (call when unmounting)
   */
  destroy(): void {
    this._clearAllTransitionTimeouts();
  }
}
