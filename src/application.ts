/**
 * Application Layer Exports (60 lines)
 * Services, use cases, and DTOs
 */

// Application - Services
export { AnimationStateManager } from './application/services/AnimationStateManager';
export type { AnimationStateManagerConfig } from './application/services/AnimationStateManager';

export { MascotService } from './application/services/MascotService';
export type { MascotTemplate } from './application/services/MascotService';

export { PersonalityManagement } from './application/services/PersonalityManagement';
export { AppearanceManagement } from './application/services/AppearanceManagement';

export { StateMachine } from './application/services/StateMachine';
export { StateTransitions } from './application/services/StateTransitions';
export { StateHistory } from './application/services/StateHistory';

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
