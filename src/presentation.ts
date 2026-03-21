/**
 * Presentation Layer Exports
 * Components, hooks, and contexts
 */

// Presentation - Components
export { MascotView } from './presentation/components/MascotView';
export type { MascotViewProps } from './presentation/components/MascotView';

export { Mascot as MascotComponent } from './presentation/components/Mascot';
export type { MascotProps } from './presentation/components/Mascot';

export { LottieMascot } from './presentation/components/LottieMascot';
export type { LottieMascotProps } from './presentation/components/LottieMascot';

export { SVGMascot } from './presentation/components/SVGMascot';
export type { SVGMascotProps } from './presentation/components/SVGMascot';

// Presentation - Types
export type { MascotState, MascotSize, MascotTheme } from './presentation/components/types';

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

export { useMascotState } from './presentation/hooks/useMascotState';
export type {
  UseMascotStateOptions,
  UseMascotStateReturn,
} from './presentation/hooks/useMascotState';

// Presentation - Contexts
export { MascotProvider, useMascotContext } from './presentation/contexts/MascotContext';
export type { MascotProviderProps, MascotContextValue } from './presentation/contexts/MascotContext';
