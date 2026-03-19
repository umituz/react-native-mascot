/**
 * Lottie Mascot Component (80 lines)
 * Lottie-specific rendering with auto-play and caching
 */

import React, { memo, useMemo, useRef, useEffect } from 'react';
import { View, ViewStyle } from 'react-native';
import LottieView from 'lottie-react-native';
import type { AnimationObject } from 'lottie-react-native';
import type { Mascot } from '../../domain/entities/Mascot';
import type { MascotAnimation } from '../../domain/types/MascotTypes';

type LottieAnimationSource = string | AnimationObject | { uri: string };

export interface LottieMascotProps {
  mascot: Mascot;
  animation?: MascotAnimation | null;
  resizeMode?: 'cover' | 'contain' | 'center';
  onAnimationFinish?: () => void;
}

const LottieMascotComponent: React.FC<LottieMascotProps> = memo(({
  mascot,
  animation,
  resizeMode = 'contain',
  onAnimationFinish,
}) => {
  const lottieRef = useRef<LottieView>(null);

  // Memoize source to prevent reloads
  const source = useMemo(() => {
    return animation?.source || mascot.animations.find((a: MascotAnimation) => a.type === 'idle')?.source;
  }, [animation?.source, mascot.animations]);

  // Play animation when source changes
  useEffect(() => {
    if (source && lottieRef.current) {
      lottieRef.current.play();
    }
  }, [source]);

  if (!source) {
    return (
      <FallbackMascot
        mascot={mascot}
        size={0}
        style={{ width: '100%', height: '100%', backgroundColor: mascot.appearance.baseColor }}
      />
    );
  }

  return (
    <LottieView
      ref={lottieRef}
      source={source as LottieAnimationSource}
      style={{ width: '100%', height: '100%' }}
      resizeMode={resizeMode}
      autoPlay={animation?.autoplay}
      loop={animation?.loop}
      onAnimationFinish={onAnimationFinish}
    />
  );
});

LottieMascotComponent.displayName = 'LottieMascot';

export const LottieMascot = LottieMascotComponent;

// Fallback component for when no source is available
interface FallbackMascotProps {
  mascot: Mascot;
  size?: number;
  style?: ViewStyle;
}

const FallbackMascotComponent: React.FC<FallbackMascotProps> = ({ mascot, style }) => (
  <View style={[{ backgroundColor: mascot.appearance.baseColor, borderRadius: 100, justifyContent: 'center', alignItems: 'center' }, style]}>
    <View style={{ width: 10, height: 10, backgroundColor: '#000', borderRadius: 5, top: '40%', position: 'absolute' }} />
    <View style={{ width: 10, height: 10, backgroundColor: '#000', borderRadius: 5, top: '40%', position: 'absolute' }} />
  </View>
);

FallbackMascotComponent.displayName = 'FallbackMascot';

export const FallbackMascot = memo(FallbackMascotComponent);
