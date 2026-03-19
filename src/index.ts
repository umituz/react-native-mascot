/**
 * @umituz/react-native-mascot
 *
 * Interactive mascot system for React Native apps with DDD architecture
 */

import type { MascotMood, AnimationSpeed } from './domain/types/MascotTypes';

// Domain - Entities
export { Mascot } from './domain/entities/Mascot';

// Domain - Value Objects
export { Mood } from './domain/value-objects/Mood';
export { EnergyLevel } from './domain/value-objects/EnergyLevel';
export { FriendlinessLevel } from './domain/value-objects/FriendlinessLevel';
export { PlayfulnessLevel } from './domain/value-objects/PlayfulnessLevel';
export { AnimationState } from './domain/value-objects/AnimationState';

// Domain - Types - Animation States
export type {
  MascotAnimationState,
  MascotStateConfig,
  StateTransition,
  StateHistoryEntry,
  MascotSize,
  MascotSizeConfig,
} from './domain/types/AnimationStateTypes';
export {
  DEFAULT_STATE_CONFIGS,
  DEFAULT_SIZE_CONFIG,
  STATE_TRANSITIONS,
} from './domain/types/AnimationStateTypes';

// Application - Services
export { AnimationStateManager } from './application/services/AnimationStateManager';
export type { StateManagerConfig } from './application/services/AnimationStateManager';

// Infrastructure - Utils
export { LRUCache } from './infrastructure/utils/LRUCache';

// Domain - Types
export type {
  MascotType,
  MascotStyle,
  MascotAnimationType,
  MascotAppearance,
  MascotAccessory,
  MascotPersonality,
  MascotAnimation,
  MascotConfig,
  MascotState,
  MascotInteraction,
  MascotMood,
  AnimationSpeed,
} from './domain/types/MascotTypes';

// Domain - Interfaces
export type {
  IAnimationController,
  AnimationEvent,
  AnimationOptions,
} from './domain/interfaces/IAnimationController';

export type {
  IAssetManager,
  AssetCache,
} from './domain/interfaces/IAssetManager';

export type {
  IMascotRepository,
} from './domain/interfaces/IMascotRepository';

// Application - Services
export { MascotService } from './application/services/MascotService';
export type { MascotTemplate } from './application/services/MascotService';

// Application - Errors
export {
  MascotError,
  MascotNotInitializedError,
  AnimationNotFoundError,
  InvalidEnergyLevelError,
  InvalidFriendlinessLevelError,
  InvalidPlayfulnessLevelError,
  InvalidMoodTransitionError,
  MascotNotFoundError,
  TemplateNotFoundError,
} from './application/errors/MascotErrors';

// Application - DTOs
export type {
  MascotDTO,
  AnimationStateDTO,
  MascotInitOptionsDTO,
  AnimationPlaybackOptionsDTO,
  MascotUpdateOptionsDTO,
} from './application/dto/MascotDTO';

// Infrastructure - DI
export { DIContainer } from './infrastructure/di/Container';

// Infrastructure - Repositories
export { MascotRepository } from './infrastructure/repositories/MascotRepository';

// Infrastructure - Controllers
export { AnimationController } from './infrastructure/controllers/AnimationController';

// Infrastructure - Managers
export { AssetManager } from './infrastructure/managers/AssetManager';
export { MascotFactory, type MascotTemplate as FactoryMascotTemplate } from './infrastructure/managers/MascotFactory';

// Presentation - Components
export { MascotView } from './presentation/components/MascotView';
export type { MascotViewProps } from './presentation/components/MascotView';

// Presentation - Hooks
export { useMascot } from './presentation/hooks/useMascot';
export type {
  UseMascotOptions,
  UseMascotReturn,
} from './presentation/hooks/useMascot';

export { useMascotAnimation } from './presentation/hooks/useMascotAnimation';
export type {
  UseMascotAnimationOptions,
  UseMascotAnimationReturn,
} from './presentation/hooks/useMascotAnimation';

// Presentation - Contexts
export { MascotProvider, useMascotContext } from './presentation/contexts/MascotContext';
export type { MascotProviderProps, MascotContextValue } from './presentation/contexts/MascotContext';

// Constants
export const MASCOT_TEMPLATES = [
  'friendly-bot',
  'cute-pet',
  'wise-owl',
  'pixel-hero',
] as const;

export const DEFAULT_MASCOT_MOODS: MascotMood[] = [
  'happy',
  'sad',
  'excited',
  'thinking',
  'angry',
  'neutral',
  'surprised',
];

export const DEFAULT_ANIMATION_SPEEDS: AnimationSpeed[] = [
  'very-slow',
  'slow',
  'normal',
  'fast',
  'very-fast',
];

// Convenience export - get service instance
export const getMascotService = () => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { DIContainer } = require('./infrastructure/di/Container');
  return DIContainer.getInstance().getMascotService();
};
