/**
 * useMascot Hook
 * Main hook for mascot management
 */

import { useCallback, useEffect, useState, useRef } from 'react';
import { Mascot } from '../../domain/entities/Mascot';
import type {
  MascotConfig,
  MascotMood,
  MascotAppearance,
} from '../../domain/types/MascotTypes';
import { MascotFactory } from '../../infrastructure/managers/MascotFactory';
import { AnimationController } from '../../infrastructure/controllers/AnimationController';
import type { AnimationOptions } from '../../domain/interfaces/IAnimationController';

export interface UseMascotOptions {
  config?: MascotConfig;
  template?: string;
  autoInitialize?: boolean;
}

export interface UseMascotReturn {
  mascot: Mascot | null;
  isReady: boolean;
  isPlaying: boolean;
  currentAnimation: string | null;
  initialize: (config: MascotConfig) => void;
  initializeFromTemplate: (template: string, customizations?: Partial<MascotConfig>) => void;
  setMood: (mood: MascotMood) => void;
  setEnergy: (energy: number) => void;
  playAnimation: (animationId: string, options?: AnimationOptions) => Promise<void>;
  stopAnimation: () => void;
  updateAppearance: (appearance: Partial<MascotAppearance>) => void;
  setBaseColor: (color: string) => void;
  setAccentColor: (color: string) => void;
  addAccessory: (accessory: {
    id: string;
    type: string;
    color?: string;
    position?: { x: number; y: number };
  }) => void;
  removeAccessory: (accessoryId: string) => void;
  setVisible: (visible: boolean) => void;
  setPosition: (position: { x: number; y: number }) => void;
}

export function useMascot(options: UseMascotOptions = {}): UseMascotReturn {
  const {
    config: initialConfig,
    template: initialTemplate,
    autoInitialize = true,
  } = options;

  const [mascot, setMascot] = useState<Mascot | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentAnimation, setCurrentAnimation] = useState<string | null>(null);

  const animationControllerRef = useRef<AnimationController | null>(null);

  // Initialize mascot
  const initialize = useCallback((config: MascotConfig) => {
    const newMascot = new Mascot(config);
    setMascot(newMascot);
    setIsReady(true);
    if (!animationControllerRef.current) {
      animationControllerRef.current = new AnimationController();
    }
  }, []);

  const initializeFromTemplate = useCallback((
    template: string,
    customizations?: Partial<MascotConfig>
  ) => {
    const newMascot = MascotFactory.createFromTemplate(
      template as 'friendly-bot' | 'cute-pet' | 'wise-owl' | 'pixel-hero',
      customizations
    );
    setMascot(newMascot);
    setIsReady(true);
    if (!animationControllerRef.current) {
      animationControllerRef.current = new AnimationController();
    }
  }, []);

  // Mood management
  const setMood = useCallback((mood: MascotMood) => {
    setMascot((prev) => {
      if (!prev) return null;
      prev.setMood(mood);
      return prev.clone();
    });
  }, []);

  const setEnergy = useCallback((energy: number) => {
    setMascot((prev) => {
      if (!prev) return null;
      prev.setEnergy(energy);
      return prev.clone();
    });
  }, []);

  // Animation management
  const playAnimation = useCallback(async (animationId: string, options?: AnimationOptions) => {
    if (!mascot || !animationControllerRef.current) return;

    const animation = mascot.getAnimation(animationId);
    if (!animation) {
      console.warn(`Animation ${animationId} not found`);
      return;
    }

    setIsPlaying(true);
    setCurrentAnimation(animationId);

    if (animationControllerRef.current) {
      await animationControllerRef.current.play(animation, options);
    }

    setIsPlaying(false);
    setCurrentAnimation(null);
  }, [mascot]);

  const stopAnimation = useCallback(() => {
    if (animationControllerRef.current) {
      animationControllerRef.current.stop();
    }
    setIsPlaying(false);
    setCurrentAnimation(null);
  }, []);

  // Appearance management
  const updateAppearance = useCallback((appearance: Partial<MascotAppearance>) => {
    setMascot((prev) => {
      if (!prev) return null;
      prev.updateAppearance(appearance);
      return prev.clone();
    });
  }, []);

  const setBaseColor = useCallback((color: string) => {
    setMascot((prev) => {
      if (!prev) return null;
      prev.setBaseColor(color);
      return prev.clone();
    });
  }, []);

  const setAccentColor = useCallback((color: string) => {
    setMascot((prev) => {
      if (!prev) return null;
      prev.setAccentColor(color);
      return prev.clone();
    });
  }, []);

  const addAccessory = useCallback((accessory: {
    id: string;
    type: string;
    color?: string;
    position?: { x: number; y: number };
  }) => {
    setMascot((prev) => {
      if (!prev) return null;
      prev.addAccessory(accessory);
      return prev.clone();
    });
  }, []);

  const removeAccessory = useCallback((accessoryId: string) => {
    setMascot((prev) => {
      if (!prev) return null;
      prev.removeAccessory(accessoryId);
      return prev.clone();
    });
  }, []);

  // Visibility and position
  const setVisible = useCallback((visible: boolean) => {
    setMascot((prev) => {
      if (!prev) return null;
      prev.setVisible(visible);
      return prev.clone();
    });
  }, []);

  const setPosition = useCallback((position: { x: number; y: number }) => {
    setMascot((prev) => {
      if (!prev) return null;
      prev.setPosition(position);
      return prev.clone();
    });
  }, []);

  // Auto-initialize
  useEffect(() => {
    if (autoInitialize && initialConfig) {
      initialize(initialConfig);
    } else if (autoInitialize && initialTemplate) {
      initializeFromTemplate(initialTemplate);
    }
  }, [autoInitialize, initialConfig, initialTemplate, initialize, initializeFromTemplate]);

  return {
    mascot,
    isReady,
    isPlaying,
    currentAnimation,
    initialize,
    initializeFromTemplate,
    setMood,
    setEnergy,
    playAnimation,
    stopAnimation,
    updateAppearance,
    setBaseColor,
    setAccentColor,
    addAccessory,
    removeAccessory,
    setVisible,
    setPosition,
  };
}
