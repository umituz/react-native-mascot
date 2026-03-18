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

  // ✅ Initialize service once
  if (!serviceRef.current) {
    const container = DIContainer.getInstance();
    serviceRef.current = container.getMascotService();

    // Subscribe to service changes
    serviceRef.current.subscribe(() => {
      const service = serviceRef.current!;
      setState({
        mascot: service.mascot,
        isReady: service.isReady,
        isPlaying: service.isPlaying,
        currentAnimation: service.currentAnimation,
      });
    });
  }

  const service = serviceRef.current;

  // ✅ Auto-initialize
  useEffect(() => {
    if (autoInitialize && initialConfig) {
      service.initialize(initialConfig);
    } else if (autoInitialize && initialTemplate) {
      service.fromTemplate(initialTemplate);
    }
  }, [autoInitialize, initialConfig, initialTemplate]);

  // ✅ All methods delegate to service - NO business logic!
  return {
    ...state,
    initialize: useCallback((config: MascotConfig) => service.initialize(config), [service]),
    fromTemplate: useCallback(
      (template: MascotTemplate, customizations?: Partial<MascotConfig>) =>
        service.fromTemplate(template, customizations),
      [service]
    ),
    setMood: useCallback((mood: MascotMood) => service.setMood(mood), [service]),
    setEnergy: useCallback((energy: number) => service.setEnergy(energy), [service]),
    setFriendliness: useCallback((friendliness: number) => service.setFriendliness(friendliness), [service]),
    setPlayfulness: useCallback((playfulness: number) => service.setPlayfulness(playfulness), [service]),
    cheerUp: useCallback(() => service.cheerUp(), [service]),
    boostEnergy: useCallback((amount: number) => service.boostEnergy(amount), [service]),
    playAnimation: useCallback(
      (animationId: string, opts?: AnimationOptions) => service.playAnimation(animationId, opts),
      [service]
    ),
    stopAnimation: useCallback(() => service.stopAnimation(), [service]),
    pauseAnimation: useCallback(() => service.pauseAnimation(), [service]),
    resumeAnimation: useCallback(() => service.resumeAnimation(), [service]),
    updateAppearance: useCallback((appearance: Partial<MascotAppearance>) => service.updateAppearance(appearance), [service]),
    setBaseColor: useCallback((color: string) => service.setBaseColor(color), [service]),
    setAccentColor: useCallback((color: string) => service.setAccentColor(color), [service]),
    addAccessory: useCallback(
      (accessory: { id: string; type: string; color?: string; position?: { x: number; y: number } }) =>
        service.addAccessory(accessory),
      [service]
    ),
    removeAccessory: useCallback((accessoryId: string) => service.removeAccessory(accessoryId), [service]),
    setVisible: useCallback((visible: boolean) => service.setVisible(visible), [service]),
    setPosition: useCallback((position: { x: number; y: number }) => service.setPosition(position), [service]),
  };
}
