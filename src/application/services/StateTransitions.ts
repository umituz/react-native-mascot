/**
 * State Transitions (80 lines)
 * Transition rules and validation
 */

import type { MascotAnimationState } from '../../domain/types/AnimationStateTypes';

export interface StateTransition {
  from: MascotAnimationState;
  to: MascotAnimationState;
  condition?: 'always' | 'on-success' | 'on-error' | 'on-complete';
  delay?: number;
}

export class StateTransitions {
  private readonly _transitions: Map<MascotAnimationState, StateTransition[]>;

  constructor() {
    this._transitions = new Map();
    this._initializeTransitions();
  }

  canTransitionTo(from: MascotAnimationState, to: MascotAnimationState): boolean {
    const transitions = this._transitions.get(from);
    if (!transitions) return false;
    return transitions.some((t) => t.to === to);
  }

  getAvailableTransitions(state: MascotAnimationState): StateTransition[] {
    return this._transitions.get(state) || [];
  }

  getTransitionDelay(from: MascotAnimationState, to: MascotAnimationState): number {
    const transitions = this._transitions.get(from);
    const transition = transitions?.find((t) => t.to === to);
    return transition?.delay || 0;
  }

  private _initializeTransitions(): void {
    // Idle transitions
    this._addTransition('idle', 'loading', 'always');
    this._addTransition('idle', 'empty', 'always');
    this._addTransition('idle', 'guide', 'always');

    // Loading transitions
    this._addTransition('loading', 'success', 'on-success');
    this._addTransition('loading', 'error', 'on-error');

    // Success transitions
    this._addTransition('success', 'idle', 'on-complete', 100);

    // Error transitions
    this._addTransition('error', 'idle', 'on-complete', 100);

    // Empty transitions
    this._addTransition('empty', 'idle', 'always');

    // Guide transitions
    this._addTransition('guide', 'idle', 'on-complete', 200);
  }

  private _addTransition(
    from: MascotAnimationState,
    to: MascotAnimationState,
    condition: StateTransition['condition'] = 'always',
    delay: number = 0
  ): void {
    if (!this._transitions.has(from)) {
      this._transitions.set(from, []);
    }
    this._transitions.get(from)!.push({ from, to, condition, delay });
  }
}
