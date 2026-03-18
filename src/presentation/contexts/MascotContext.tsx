/**
 * Mascot Context
 * Provides mascot state and functionality to components
 */

import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { Mascot } from '../../domain/entities/Mascot';
import type { MascotConfig, MascotMood } from '../../domain/types/MascotTypes';
import { MascotFactory } from '../../infrastructure/managers/MascotFactory';
import { AnimationController } from '../../infrastructure/controllers/AnimationController';
import type { AnimationOptions } from '../../domain/interfaces/IAnimationController';

export interface MascotContextValue {
  mascot: Mascot | null;
  isPlaying: boolean;
  currentAnimation: string | null;
  initializeMascot: (config: MascotConfig) => void;
  initializeFromTemplate: (template: string, customizations?: Partial<MascotConfig>) => void;
  setMood: (mood: MascotMood) => void;
  playAnimation: (animationId: string, options?: AnimationOptions) => Promise<void>;
  stopAnimation: () => void;
  updateAppearance: (appearance: Partial<MascotConfig['appearance']>) => void;
  setVisible: (visible: boolean) => void;
}

const MascotContext = createContext<MascotContextValue | undefined>(undefined);

export interface MascotProviderProps extends React.PropsWithChildren {
  initialConfig?: MascotConfig;
  template?: string;
}

export const MascotProvider: React.FC<MascotProviderProps> = ({
  children,
  initialConfig: _initialConfig,
  template: _template,
}) => {
  const [mascot, setMascot] = useState<Mascot | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentAnimation, setCurrentAnimation] = useState<string | null>(null);
  const animationControllerRef = useRef<AnimationController | null>(null);

  const initializeMascot = useCallback((config: MascotConfig) => {
    const newMascot = new Mascot(config);
    setMascot(newMascot);
    if (!animationControllerRef.current) {
      animationControllerRef.current = new AnimationController();
    }
  }, []);

  const initializeFromTemplate = useCallback((
    templateName: string,
    customizations?: Partial<MascotConfig>
  ) => {
    const template = templateName as 'friendly-bot' | 'cute-pet' | 'wise-owl' | 'pixel-hero';
    const newMascot = MascotFactory.createFromTemplate(template, customizations);
    setMascot(newMascot);
    if (!animationControllerRef.current) {
      animationControllerRef.current = new AnimationController();
    }
  }, []);

  const setMood = useCallback((mood: MascotMood) => {
    setMascot((prev) => {
      if (!prev) return null;
      prev.setMood(mood);
      return prev.clone();
    });
  }, []);

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

  const updateAppearance = useCallback((appearance: Partial<MascotConfig['appearance']>) => {
    setMascot((prev) => {
      if (!prev) return null;
      prev.updateAppearance(appearance);
      return prev.clone();
    });
  }, []);

  const setVisible = useCallback((visible: boolean) => {
    setMascot((prev) => {
      if (!prev) return null;
      prev.setVisible(visible);
      return prev.clone();
    });
  }, []);

  const value: MascotContextValue = {
    mascot,
    isPlaying,
    currentAnimation,
    initializeMascot,
    initializeFromTemplate,
    setMood,
    playAnimation,
    stopAnimation,
    updateAppearance,
    setVisible,
  };

  return (
    <MascotContext.Provider value={value}>
      {children}
    </MascotContext.Provider>
  );
};

export const useMascotContext = (): MascotContextValue => {
  const context = useContext(MascotContext);
  if (!context) {
    throw new Error('useMascotContext must be used within a MascotProvider');
  }
  return context;
};
