/**
 * Core Domain Exports (80 lines)
 * Domain entities, value objects, and types
 */

// Domain - Entities
export { Mascot as MascotEntity } from './domain/entities/Mascot';

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

// Domain - Types - Mascot
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
