/**
 * Animation State Value Object
 * Encapsulates animation state logic and validation
 */

import type {
  MascotAnimationState,
  MascotStateConfig,
  StateTransition,
} from '../types/AnimationStateTypes';
import { DEFAULT_STATE_CONFIGS, STATE_TRANSITIONS } from '../types/AnimationStateTypes';

export class AnimationState {
  private constructor(
    public readonly value: MascotAnimationState,
    private readonly _config: MascotStateConfig
  ) {}

  static create(state: MascotAnimationState, config?: Partial<MascotStateConfig>): AnimationState {
    const defaultConfig = DEFAULT_STATE_CONFIGS[state];
    const finalConfig = { ...defaultConfig, ...config, state };
    return new AnimationState(state, finalConfig);
  }

  /**
   * Check if state should loop
   */
  shouldLoop(): boolean {
    return this._config.loop;
  }

  /**
   * Get animation duration
   */
  getDuration(): number {
    return this._config.duration || 3000;
  }

  /**
   * Check if animation should auto-play
   */
  shouldAutoPlay(): boolean {
    return this._config.autoPlay ?? true;
  }

  /**
   * Get animation speed
   */
  getSpeed(): number {
    return this._config.speed || 1;
  }

  /**
   * Get next state after completion (for auto-transition)
   */
  getNextState(): MascotAnimationState | null {
    return this._config.transitionTo || null;
  }

  /**
   * Get available transitions from current state
   */
  getAvailableTransitions(): StateTransition[] {
    return STATE_TRANSITIONS[this.value] || [];
  }

  /**
   * Check if transition to target state is allowed
   */
  canTransitionTo(targetState: MascotAnimationState): boolean {
    const transitions = this.getAvailableTransitions();
    return transitions.some(t => t.to === targetState);
  }

  /**
   * Get transition delay to target state
   */
  getTransitionDelay(targetState: MascotAnimationState): number {
    const transitions = this.getAvailableTransitions();
    const transition = transitions.find(t => t.to === targetState);
    return transition?.delay || 0;
  }

  /**
   * Get completion callback
   */
  getOnComplete(): (() => void) | undefined {
    return this._config.onComplete;
  }

  /**
   * Check if state is a success state
   */
  isSuccessState(): boolean {
    return this.value === 'success';
  }

  /**
   * Check if state is an error state
   */
  isErrorState(): boolean {
    return this.value === 'error';
  }

  /**
   * Check if state is a loading state
   */
  isLoadingState(): boolean {
    return this.value === 'loading';
  }

  /**
   * Check if state is an idle state
   */
  isIdleState(): boolean {
    return this.value === 'idle';
  }

  equals(other: AnimationState): boolean {
    return this.value === other.value;
  }

  toJSON(): MascotStateConfig {
    return { ...this._config };
  }
}
