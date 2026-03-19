/**
 * useMascot Hook
 * Thin wrapper that delegates to MascotService
 */

import { useCallback, useEffect, useState, useRef } from 'react';
import type { Mascot } from '../../domain/entities/Mascot';
import type {
  MascotConfig,
  MascotMood,
  MascotAppearance,
} from '../../domain/types/MascotTypes';
import type { AnimationOptions } from '../../domain/interfaces/IAnimationController';
import type { MascotService } from '../../application/services/MascotService';
import { DIContainer } from '../../infrastructure/di/Container';
import type { MascotTemplate } from '../../application/services/MascotService';

export interface UseMascotOptions {
  config?: MascotConfig;
  template?: MascotTemplate;
  autoInitialize?: boolean;
}

export interface UseMascotReturn {
  mascot: Mascot | null;
  isReady: boolean;
  isPlaying: boolean;
  currentAnimation: string | null;
  initialize: (config: MascotConfig) => Promise<void>;
  fromTemplate: (template: MascotTemplate, customizations?: Partial<MascotConfig>) => Promise<void>;
  setMood: (mood: MascotMood) => void;
  setEnergy: (energy: number) => void;
  setFriendliness: (friendliness: number) => void;
  setPlayfulness: (playfulness: number) => void;
  cheerUp: () => void;
  boostEnergy: (amount: number) => void;
  playAnimation: (animationId: string, options?: AnimationOptions) => Promise<void>;
  stopAnimation: () => void;
  pauseAnimation: () => void;
  resumeAnimation: () => void;
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
  const { config: initialConfig, template: initialTemplate, autoInitialize = true } = options;

  const [state, setState] = useState(() => ({
    mascot: null as Mascot | null,
    isReady: false,
    isPlaying: false,
    currentAnimation: null as string | null,
  }));

  const serviceRef = useRef<MascotService | null>(null);

  // ✅ Initialize service once and subscribe to changes
  useEffect(() => {
    if (serviceRef.current == null) {
      const container = DIContainer.getInstance();
      const service = container.getMascotService();
      serviceRef.current = service;

      // Subscribe to service changes
      const unsubscribe = service.subscribe(() => {
        setState({
          mascot: service.mascot,
          isReady: service.isReady,
          isPlaying: service.isPlaying,
          currentAnimation: service.currentAnimation,
        });
      });

      return unsubscribe;
    }
    return undefined;
  }, []);

  // ✅ Auto-initialize
  useEffect(() => {
    const service = serviceRef.current;
    if (!service) return;
    if (autoInitialize && initialConfig) {
      service.initialize(initialConfig);
    } else if (autoInitialize && initialTemplate) {
      service.fromTemplate(initialTemplate);
    }
  }, [autoInitialize, initialConfig, initialTemplate]);

  // ✅ All methods delegate to service - NO business logic!
  return {
    ...state,
    initialize: useCallback((config: MascotConfig) => {
      const service = serviceRef.current;
      if (!service) throw new Error('Service not initialized');
      return service.initialize(config);
    }, []),
    fromTemplate: useCallback(
      (template: MascotTemplate, customizations?: Partial<MascotConfig>) => {
        const service = serviceRef.current;
        if (!service) throw new Error('Service not initialized');
        return service.fromTemplate(template, customizations);
      },
      []
    ),
    setMood: useCallback((mood: MascotMood) => {
      const service = serviceRef.current;
      if (!service) throw new Error('Service not initialized');
      service.setMood(mood);
    }, []),
    setEnergy: useCallback((energy: number) => {
      const service = serviceRef.current;
      if (!service) throw new Error('Service not initialized');
      service.setEnergy(energy);
    }, []),
    setFriendliness: useCallback((friendliness: number) => {
      const service = serviceRef.current;
      if (!service) throw new Error('Service not initialized');
      service.setFriendliness(friendliness);
    }, []),
    setPlayfulness: useCallback((playfulness: number) => {
      const service = serviceRef.current;
      if (!service) throw new Error('Service not initialized');
      service.setPlayfulness(playfulness);
    }, []),
    cheerUp: useCallback(() => {
      const service = serviceRef.current;
      if (!service) throw new Error('Service not initialized');
      service.cheerUp();
    }, []),
    boostEnergy: useCallback((amount: number) => {
      const service = serviceRef.current;
      if (!service) throw new Error('Service not initialized');
      service.boostEnergy(amount);
    }, []),
    playAnimation: useCallback(
      (animationId: string, opts?: AnimationOptions) => {
        const service = serviceRef.current;
        if (!service) throw new Error('Service not initialized');
        return service.playAnimation(animationId, opts);
      },
      []
    ),
    stopAnimation: useCallback(() => {
      const service = serviceRef.current;
      if (!service) throw new Error('Service not initialized');
      service.stopAnimation();
    }, []),
    pauseAnimation: useCallback(() => {
      const service = serviceRef.current;
      if (!service) throw new Error('Service not initialized');
      service.pauseAnimation();
    }, []),
    resumeAnimation: useCallback(() => {
      const service = serviceRef.current;
      if (!service) throw new Error('Service not initialized');
      service.resumeAnimation();
    }, []),
    updateAppearance: useCallback((appearance: Partial<MascotAppearance>) => {
      const service = serviceRef.current;
      if (!service) throw new Error('Service not initialized');
      service.updateAppearance(appearance);
    }, []),
    setBaseColor: useCallback((color: string) => {
      const service = serviceRef.current;
      if (!service) throw new Error('Service not initialized');
      service.setBaseColor(color);
    }, []),
    setAccentColor: useCallback((color: string) => {
      const service = serviceRef.current;
      if (!service) throw new Error('Service not initialized');
      service.setAccentColor(color);
    }, []),
    addAccessory: useCallback(
      (accessory: { id: string; type: string; color?: string; position?: { x: number; y: number } }) => {
        const service = serviceRef.current;
        if (!service) throw new Error('Service not initialized');
        service.addAccessory(accessory);
      },
      []
    ),
    removeAccessory: useCallback((accessoryId: string) => {
      const service = serviceRef.current;
      if (!service) throw new Error('Service not initialized');
      service.removeAccessory(accessoryId);
    }, []),
    setVisible: useCallback((visible: boolean) => {
      const service = serviceRef.current;
      if (!service) throw new Error('Service not initialized');
      service.setVisible(visible);
    }, []),
    setPosition: useCallback((position: { x: number; y: number }) => {
      const service = serviceRef.current;
      if (!service) throw new Error('Service not initialized');
      service.setPosition(position);
    }, []),
  };
}
