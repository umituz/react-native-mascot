/**
 * Animation State Manager (Main - 60 lines)
 * Public API for state management
 */

import { StateMachine } from './StateMachine';
import type { MascotAnimationState } from '../../domain/types/AnimationStateTypes';

export interface AnimationStateManagerConfig {
  enableAutoTransition?: boolean;
  enableHistoryTracking?: boolean;
  maxHistorySize?: number;
  onStateChange?: (from: MascotAnimationState, to: MascotAnimationState) => void;
}

export class AnimationStateManager {
  private readonly _stateMachine: StateMachine;

  constructor(
    initialState: MascotAnimationState = 'idle',
    config: AnimationStateManagerConfig = {}
  ) {
    this._stateMachine = new StateMachine(initialState, config);
  }

  get currentState(): MascotAnimationState {
    return this._stateMachine.currentStateValue;
  }

  get previousState(): MascotAnimationState | null {
    return this._stateMachine.previousState?.value || null;
  }

  get stateHistory(): MascotAnimationState[] {
    return this._stateMachine.history;
  }

  transitionTo(newState: MascotAnimationState): void {
    this._stateMachine.transitionTo(newState);
  }

  triggerSuccess(): void {
    this._stateMachine.triggerSuccess();
  }

  triggerError(): void {
    this._stateMachine.triggerError();
  }

  startLoading(): void {
    this._stateMachine.startLoading();
  }

  stopLoading(success: boolean): void {
    this._stateMachine.stopLoading(success);
  }

  reset(): void {
    this._stateMachine.reset();
  }

  isLooping(): boolean {
    return this._stateMachine.isLooping();
  }

  destroy(): void {
    this._stateMachine.destroy();
  }
}
