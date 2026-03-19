/**
 * State Machine (120 lines)
 * Core state transition logic with validation
 */

import type { MascotAnimationState } from '../../domain/types/AnimationStateTypes';
import { AnimationState } from '../../domain/value-objects/AnimationState';
import { StateTransitions } from './StateTransitions';
import { StateHistory } from './StateHistory';

export interface StateMachineConfig {
  enableAutoTransition?: boolean;
  enableHistoryTracking?: boolean;
  maxHistorySize?: number;
  onStateChange?: (from: MascotAnimationState, to: MascotAnimationState) => void;
}

export class StateMachine {
  private _currentState: AnimationState;
  private _previousState: AnimationState | null = null;
  private readonly _transitions: StateTransitions;
  private readonly _history: StateHistory;
  private readonly _config: Required<StateMachineConfig>;

  constructor(
    initialState: MascotAnimationState = 'idle',
    config: StateMachineConfig = {}
  ) {
    this._currentState = AnimationState.create(initialState);
    this._transitions = new StateTransitions();
    this._history = new StateHistory(config.maxHistorySize || 50);
    this._config = {
      enableAutoTransition: config.enableAutoTransition ?? true,
      enableHistoryTracking: config.enableHistoryTracking ?? true,
      maxHistorySize: config.maxHistorySize ?? 50,
      onStateChange: config.onStateChange ?? (() => {}),
    };
  }

  get currentState(): AnimationState {
    return this._currentState;
  }

  get currentStateValue(): MascotAnimationState {
    return this._currentState.value;
  }

  get previousState(): AnimationState | null {
    return this._previousState;
  }

  get history(): MascotAnimationState[] {
    return this._history.getStates();
  }

  transitionTo(
    newState: MascotAnimationState,
    triggeredBy: 'user' | 'system' | 'auto-transition' = 'user'
  ): void {
    // Validate transition
    if (!this._transitions.canTransitionTo(this.currentStateValue, newState)) {
      const validTransitions = this._transitions
        .getAvailableTransitions(this.currentStateValue)
        .map((t) => t.to);
      throw new Error(
        `Cannot transition from '${this.currentStateValue}' to '${newState}'. ` +
        `Valid transitions: ${validTransitions.join(', ')}`
      );
    }

    // Store previous state
    this._previousState = this._currentState;

    // Track history
    if (this._config.enableHistoryTracking) {
      this._history.add(this.currentStateValue, triggeredBy);
    }

    // Update state
    const oldState = this.currentStateValue;
    this._currentState = AnimationState.create(newState);

    // Notify
    this._config.onStateChange(oldState, newState);

    // Schedule auto-transition
    if (this._config.enableAutoTransition && !this._currentState.shouldLoop()) {
      const next = this._currentState.getNextState();
      if (next) {
        this._scheduleAutoTransition(next);
      }
    }
  }

  // Shortcut methods
  triggerSuccess(): void {
    this.transitionTo('success', 'system');
  }

  triggerError(): void {
    this.transitionTo('error', 'system');
  }

  startLoading(): void {
    this.transitionTo('loading', 'system');
  }

  stopLoading(success: boolean): void {
    if (this.currentStateValue === 'loading') {
      this.transitionTo(success ? 'success' : 'error', 'system');
    }
  }

  reset(): void {
    this.transitionTo('idle', 'system');
  }

  // State queries
  isLooping(): boolean {
    return this._currentState.shouldLoop();
  }

  isIdle(): boolean {
    return this.currentStateValue === 'idle';
  }

  isLoading(): boolean {
    return this.currentStateValue === 'loading';
  }

  // Auto-transition scheduling
  private _autoTransitionTimer: NodeJS.Timeout | null = null;

  private _scheduleAutoTransition(targetState: MascotAnimationState): void {
    const duration = this._currentState.getDuration();
    const delay = this._currentState.getTransitionDelay(targetState);

    this._autoTransitionTimer = setTimeout(() => {
      try {
        this.transitionTo(targetState, 'auto-transition');
      } catch (error) {
        console.warn('Auto-transition failed:', error);
      }
    }, duration + delay);
  }

  destroy(): void {
    if (this._autoTransitionTimer) {
      clearTimeout(this._autoTransitionTimer);
    }
    this._history.clear();
    this._config.onStateChange = () => {};
  }
}
