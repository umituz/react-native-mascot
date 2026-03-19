/**
 * useMascotState Hook
 * State-based mascot hook with auto-transitions
 * Inspired by AIStylistMascot implementation
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import type { MascotAnimationState, MascotSize } from '../../domain/types/AnimationStateTypes';
import { DEFAULT_SIZE_CONFIG } from '../../domain/types/AnimationStateTypes';
import { AnimationStateManager } from '../../application/services/AnimationStateManager';
import { AnimationState } from '../../domain/value-objects/AnimationState';

export interface UseMascotStateOptions {
  initialState?: MascotAnimationState;
  size?: MascotSize;
  enableAutoTransition?: boolean;
  onStateChange?: (from: MascotAnimationState, to: MascotAnimationState) => void;
  onAnimationComplete?: (state: MascotAnimationState) => void;
}

export interface UseMascotStateReturn {
  // State
  state: MascotAnimationState;
  size: number;
  isLooping: boolean;
  duration: number;
  speed: number;

  // Actions
  setState: (state: MascotAnimationState) => void;
  triggerSuccess: () => void;
  triggerError: () => void;
  startLoading: () => void;
  stopLoading: (success?: boolean) => void;
  reset: () => void;

  // State queries
  isIdle: () => boolean;
  isLoading: () => boolean;
  isSuccess: () => boolean;
  isError: () => boolean;
}

/**
 * Get size in pixels from size variant
 */
function getSizePixels(size: MascotSize): number {
  if (typeof size === 'number') {
    return size;
  }
  return DEFAULT_SIZE_CONFIG[size];
}

export function useMascotState(options: UseMascotStateOptions = {}): UseMascotStateReturn {
  const {
    initialState = 'idle',
    size: sizeVariant = 'medium',
    enableAutoTransition = true,
    onStateChange,
    onAnimationComplete,
  } = options;

  const [state, setState] = useState<MascotAnimationState>(initialState);
  const [animationState, setAnimationState] = useState<AnimationState>(() =>
    AnimationState.create(initialState)
  );

  const size = getSizePixels(sizeVariant);
  const stateManagerRef = useRef<AnimationStateManager | null>(null);

  // Initialize state manager
  useEffect(() => {
    const manager = new AnimationStateManager(initialState, {
      enableAutoTransition,
      onStateChange: (from, to) => {
        setState(to);
        setAnimationState(AnimationState.create(to));
        onStateChange?.(from, to);
      },
    });

    stateManagerRef.current = manager;

    return () => {
      manager.destroy();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update animation state when state changes externally
  useEffect(() => {
    setAnimationState(AnimationState.create(state));
  }, [state]);

  // Handle animation completion
  useEffect(() => {
    if (!animationState.shouldLoop()) {
      const duration = animationState.getDuration();
      const timeout = setTimeout(() => {
        onAnimationComplete?.(state);
      }, duration);

      return () => clearTimeout(timeout);
    }
    return undefined;
  }, [state, animationState, onAnimationComplete]);

  const setStateCallback = useCallback((newState: MascotAnimationState) => {
    const manager = stateManagerRef.current;
    if (!manager) {
      setState(newState);
      onStateChange?.(state, newState);
      return;
    }

    try {
      manager.transitionTo(newState, 'user');
    } catch (error) {
      console.warn('Invalid state transition:', error);
      setState(newState);
      onStateChange?.(state, newState);
    }
  }, [state, onStateChange]);

  const triggerSuccess = useCallback(() => {
    const manager = stateManagerRef.current;
    if (manager) {
      manager.triggerSuccess();
    } else {
      setStateCallback('success');
    }
  }, [setStateCallback]);

  const triggerError = useCallback(() => {
    const manager = stateManagerRef.current;
    if (manager) {
      manager.triggerError();
    } else {
      setStateCallback('error');
    }
  }, [setStateCallback]);

  const startLoading = useCallback(() => {
    const manager = stateManagerRef.current;
    if (manager) {
      manager.startLoading();
    } else {
      setStateCallback('loading');
    }
  }, [setStateCallback]);

  const stopLoading = useCallback((success = true) => {
    const manager = stateManagerRef.current;
    if (manager) {
      manager.stopLoading(success);
    } else {
      setStateCallback(success ? 'success' : 'error');
    }
  }, [setStateCallback]);

  const reset = useCallback(() => {
    const manager = stateManagerRef.current;
    if (manager) {
      manager.reset();
    } else {
      setStateCallback('idle');
    }
  }, [setStateCallback]);

  const isIdle = useCallback(() => state === 'idle', [state]);
  const isLoading = useCallback(() => state === 'loading', [state]);
  const isSuccess = useCallback(() => state === 'success', [state]);
  const isError = useCallback(() => state === 'error', [state]);

  return {
    state,
    size,
    isLooping: animationState.shouldLoop(),
    duration: animationState.getDuration(),
    speed: animationState.getSpeed(),
    setState: setStateCallback,
    triggerSuccess,
    triggerError,
    startLoading,
    stopLoading,
    reset,
    isIdle,
    isLoading,
    isSuccess,
    isError,
  };
}
