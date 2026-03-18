/**
 * useMascotAnimation Hook
 * Advanced animation control with queue and sequencing
 */

import { useCallback, useRef, useState } from 'react';
import type { Mascot } from '../../domain/entities/Mascot';
import type { AnimationSpeed } from '../../domain/types/MascotTypes';
import { AnimationController } from '../../infrastructure/controllers/AnimationController';
import type { AnimationOptions } from '../../domain/interfaces/IAnimationController';

export interface UseMascotAnimationOptions {
  mascot: Mascot | null;
  autoplay?: boolean;
  queue?: boolean;
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
  options: UseMascotAnimationOptions
): UseMascotAnimationReturn {
  const { mascot, speed = 'normal' } = options;

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentAnimation, setCurrentAnimation] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [queue, setQueue] = useState<string[]>([]);

  const animationControllerRef = useRef<AnimationController | null>(null);
  const isProcessingQueueRef = useRef(false);

  // Initialize animation controller
  if (!animationControllerRef.current) {
    animationControllerRef.current = new AnimationController();
  }

  // Setup progress tracking
  const animationController = animationControllerRef.current;
  animationController.on('progress', (data: unknown) => {
    const { progress: newProgress } = data as { progress: number };
    setProgress(newProgress);
  });

  const play = useCallback(async (animationId: string, options?: AnimationOptions) => {
    if (!mascot) {
      console.warn('Mascot not initialized');
      return;
    }

    const animation = mascot.getAnimation(animationId);
    if (!animation) {
      console.warn(`Animation ${animationId} not found`);
      return;
    }

    setIsPlaying(true);
    setCurrentAnimation(animationId);

    const speedMultiplier = SPEED_MULTIPLIERS[speed];
    const finalOptions: AnimationOptions = {
      ...options,
      speed: (options?.speed || 1) * speedMultiplier,
    };

    await animationController.play(animation, finalOptions);

    setIsPlaying(false);
    setCurrentAnimation(null);
    setProgress(0);
  }, [mascot, speed, animationController]);

  const pause = useCallback(() => {
    animationController.pause();
  }, [animationController]);

  const resume = useCallback(() => {
    animationController.resume();
  }, [animationController]);

  const stop = useCallback(() => {
    animationController.stop();
    setIsPlaying(false);
    setCurrentAnimation(null);
    setProgress(0);
  }, [animationController]);

  const setSpeed = useCallback((newSpeed: number) => {
    animationController.setSpeed(newSpeed);
  }, [animationController]);

  const setProgressValue = useCallback((newProgress: number) => {
    animationController.setProgress(newProgress);
    setProgress(newProgress);
  }, [animationController]);

  const queueAnimation = useCallback((animationId: string) => {
    setQueue((prev) => [...prev, animationId]);
  }, []);

  const clearQueue = useCallback(() => {
    setQueue([]);
  }, []);

  const playSequence = useCallback(async (animationIds: string[]) => {
    for (const animationId of animationIds) {
      await play(animationId);
    }
  }, [play]);

  // Process queue automatically
  const processQueue = useCallback(async () => {
    if (isProcessingQueueRef.current || queue.length === 0 || !mascot) {
      return;
    }

    isProcessingQueueRef.current = true;

    while (queue.length > 0) {
      const nextAnimation = queue[0];
      setQueue((prev) => prev.slice(1));
      await play(nextAnimation);
    }

    isProcessingQueueRef.current = false;
  }, [queue, mascot, play]);

  return {
    isPlaying,
    currentAnimation,
    progress,
    queue,
    play,
    pause,
    resume,
    stop,
    setSpeed,
    setProgress: setProgressValue,
    queueAnimation,
    clearQueue,
    playSequence,
    processQueue,
  };
}
