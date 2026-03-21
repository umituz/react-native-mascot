/**
 * useMascotState Hook
 * State-based mascot hook with auto-transitions (OPTIMIZED)
 * Inspired by AIStylistMascot implementation
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
 * Get size in pixels from size variant (memoized)
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

  // Memoize size to avoid recalculation
  const size = useMemo(() => getSizePixels(sizeVariant), [sizeVariant]);

  // Memoize animation state to avoid unnecessary recreations
  const animationState = useMemo(
    () => AnimationState.create(state),
    [state]
  );

  // Stable refs for callbacks to prevent unnecessary re-renders
  const onStateChangeRef = useRef(onStateChange);
  const onAnimationCompleteRef = useRef(onAnimationComplete);

  // Update refs without causing re-renders
  useEffect(() => {
    onStateChangeRef.current = onStateChange;
    onAnimationCompleteRef.current = onAnimationComplete;
  });

  const stateManagerRef = useRef<AnimationStateManager | null>(null);
  const cleanupTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize state manager (only once)
  useEffect(() => {
    const manager = new AnimationStateManager(initialState, {
      enableAutoTransition,
      onStateChange: (from, to) => {
        setState(to);
        onStateChangeRef.current?.(from, to);
      },
    });

    stateManagerRef.current = manager;

    return () => {
      // Clear any pending cleanup timeout
      const cleanupTimeout = cleanupTimeoutRef.current;
      if (cleanupTimeout) {
        clearTimeout(cleanupTimeout);
        cleanupTimeoutRef.current = null;
      }
      // Destroy state manager and clear all timers
      manager.destroy();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Optimized animation completion handler with proper cleanup
  useEffect(() => {
    if (!animationState.shouldLoop()) {
      const duration = animationState.getDuration();

      const timeout = setTimeout(() => {
        onAnimationCompleteRef.current?.(state);
      }, duration);

      return () => {
        clearTimeout(timeout);
      };
    }
    return undefined;
  }, [state, animationState]);

  // Memoized callbacks to prevent unnecessary re-renders
  const setStateCallback = useCallback((newState: MascotAnimationState) => {
    const manager = stateManagerRef.current;
    if (!manager) {
      setState(newState);
      onStateChangeRef.current?.(state, newState);
      return;
    }

    try {
      manager.transitionTo(newState);
    } catch (error) {
      // Invalid state transition - allow the transition anyway for flexibility
      setState(newState);
      onStateChangeRef.current?.(state, newState);
    }
  }, [state]);

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
