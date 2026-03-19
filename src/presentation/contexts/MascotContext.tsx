/**
 * MascotContext
 * Thin wrapper that provides MascotService to components
 */

import React, { createContext, useContext, ReactNode } from 'react';
import type { Mascot } from '../../domain/entities/Mascot';
import type { MascotConfig } from '../../domain/types/MascotTypes';
import type { MascotService, MascotTemplate } from '../../application/services/MascotService';
import { DIContainer } from '../../infrastructure/di/Container';

export interface MascotContextValue {
  mascot: Mascot | null;
  isPlaying: boolean;
  currentAnimation: string | null;
  service: MascotService;
}

const MascotContext = createContext<MascotContextValue | undefined>(undefined);

export interface MascotProviderProps {
  children: ReactNode;
  initialConfig?: MascotConfig;
  template?: MascotTemplate;
}

export const MascotProvider: React.FC<MascotProviderProps> = ({
  children,
  initialConfig,
  template,
}: MascotProviderProps) => {
  const container = DIContainer.getInstance();
  const service = container.getMascotService();

  // Auto-initialize if config or template provided
  if (initialConfig) {
    service.initialize(initialConfig);
  } else if (template) {
    service.fromTemplate(template);
  }

  const value: MascotContextValue = {
    mascot: service.mascot,
    isPlaying: service.isPlaying,
    currentAnimation: service.currentAnimation,
    service,
  };

  return <MascotContext.Provider value={value}>{children}</MascotContext.Provider>;
};

export const useMascotContext = (): MascotContextValue => {
  const context = useContext(MascotContext);
  if (!context) {
    throw new Error('useMascotContext must be used within a MascotProvider');
  }
  return context;
};
