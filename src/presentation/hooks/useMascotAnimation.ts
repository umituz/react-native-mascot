/**
 * useMascotAnimation Hook
 * Simplified - delegates to MascotService
 */

import { useCallback, useState } from 'react';
import type { AnimationSpeed, AnimationOptions } from '../../domain/types/MascotTypes';
import { DIContainer } from '../../infrastructure/di/Container';

export interface UseMascotAnimationOptions {
  speed?: AnimationSpeed;
}

export interface UseMascotAnimationReturn {
  isPlaying: boolean;
  currentAnimation: string | null;
  progress: number;
  queue: string[];
  play: (animationId: string, options?: AnimationOptions) => Promise<void>;
  pause: () => void;
  resume: () => void;
  stop: () => void;
  setSpeed: (speed: number) => void;
  setProgress: (progress: number) => void;
  queueAnimation: (animationId: string) => void;
  clearQueue: () => void;
  playSequence: (animationIds: string[]) => Promise<void>;
  processQueue: () => Promise<void>;
}

const SPEED_MULTIPLIERS: Record<AnimationSpeed, number> = {
  'very-slow': 0.25,
  'slow': 0.5,
  'normal': 1,
  'fast': 1.5,
  'very-fast': 2,
};

export function useMascotAnimation(
  options: UseMascotAnimationOptions = {}
): UseMascotAnimationReturn {
  const { speed = 'normal' } = options;
  const [queue, setQueue] = useState<string[]>([]);

  const container = DIContainer.getInstance();
  const service = container.getMascotService();

  const play = useCallback(
    async (animationId: string, options?: AnimationOptions) => {
      const speedMultiplier = SPEED_MULTIPLIERS[speed];
      const finalOptions: AnimationOptions = {
        ...options,
        speed: (options?.speed || 1) * speedMultiplier,
      };
      await service.playAnimation(animationId, finalOptions);
    },
    [service, speed]
  );

  const pause = useCallback(() => {
    service.pauseAnimation();
  }, [service]);

  const resume = useCallback(() => {
    service.resumeAnimation();
  }, [service]);

  const stop = useCallback(() => {
    service.stopAnimation();
  }, [service]);

  const setSpeed = useCallback((_speed: number) => {
    // Speed is handled via options in play() - this method is kept for API compatibility
    // but does nothing as speed should be passed to play() directly
  }, []);

  const setProgress = useCallback((_progress: number) => {
    // Progress tracking not yet implemented - would need AnimationController reference
  }, []);

  const queueAnimation = useCallback((animationId: string) => {
    setQueue((prev: string[]) => [...prev, animationId]);
  }, []);

  const clearQueue = useCallback(() => {
    setQueue([]);
  }, []);

  const playSequence = useCallback(
    async (animationIds: string[]) => {
      for (const animationId of animationIds) {
        await play(animationId);
      }
    },
    [play]
  );

  const processQueue = useCallback(async () => {
    while (queue.length > 0) {
      const nextAnimation = queue[0];
      setQueue((prev: string[]) => prev.slice(1));
      await play(nextAnimation);
    }
  }, [play, queue]);

  return {
    isPlaying: service.isPlaying,
    currentAnimation: service.currentAnimation,
    progress: 0, // Would need AnimationController reference
    queue,
    play,
    pause,
    resume,
    stop,
    setSpeed,
    setProgress,
    queueAnimation,
    clearQueue,
    playSequence,
    processQueue,
  };
}
