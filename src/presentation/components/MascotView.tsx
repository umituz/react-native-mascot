/**
 * MascotView Component (OPTIMIZED - 100 lines)
 * Main container with memoization
 */

import React, { memo, useMemo, useEffect, useCallback } from 'react';
import { StyleSheet, Animated, TouchableOpacity, ViewStyle } from 'react-native';
import type { Mascot } from '../../domain/entities/Mascot';
import type { MascotAnimation } from '../../domain/types/MascotTypes';
import { LottieMascot } from './LottieMascot';
import { SVGMascot } from './SVGMascot';

export interface MascotViewProps {
  mascot: Mascot | null;
  animation?: MascotAnimation | null;
  size?: number;
  style?: ViewStyle;
  testID?: string;
  onPress?: () => void;
  onLongPress?: () => void;
  onAnimationFinish?: () => void;
  resizeMode?: 'cover' | 'contain' | 'center';
}

function arePropsEqual(prevProps: MascotViewProps, nextProps: MascotViewProps): boolean {
  return (
    prevProps.mascot === nextProps.mascot &&
    prevProps.animation === nextProps.animation &&
    prevProps.size === nextProps.size &&
    prevProps.onPress === nextProps.onPress &&
    prevProps.onLongPress === nextProps.onLongPress
  );
}

const MascotViewComponent: React.FC<MascotViewProps> = ({
  mascot,
  animation,
  size = 200,
  style,
  testID = 'mascot-view',
  onPress,
  onLongPress,
  onAnimationFinish,
  resizeMode = 'contain',
}) => {
  // Create animated values once
  const animatedValues = useMemo(
    () => ({
      opacity: new Animated.Value(0),
      scale: new Animated.Value(0),
    }),
    []
  );

  const { opacity, scale } = animatedValues;

  // Animation
  useEffect(() => {
    if (mascot?.state.isVisible) {
      Animated.parallel([
        Animated.timing(opacity, { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.spring(scale, { toValue: 1, friction: 8, tension: 40, useNativeDriver: true }),
      ]).start();
    } else {
      Animated.timing(opacity, { toValue: 0, duration: 200, useNativeDriver: true }).start();
    }
  }, [mascot?.state.isVisible, opacity, scale]);

  // Memoized styles and handlers
  const animatedStyle = useMemo(() => ({ opacity, transform: [{ scale }] }), [opacity, scale]);
  const containerStyle = useMemo(() => [styles.container, { width: size, height: size }, style], [size, style]);
  const handlePress = useCallback(() => mascot?.touchEnabled && onPress?.(), [mascot?.touchEnabled, onPress]);
  const handleLongPress = useCallback(() => mascot?.touchEnabled && onLongPress?.(), [mascot?.touchEnabled, onLongPress]);

  if (!mascot || !mascot.state.isVisible) return null;

  return (
    <Animated.View style={animatedStyle} testID={testID}>
      <TouchableOpacity
        style={containerStyle}
        onPress={handlePress}
        onLongPress={handleLongPress}
        disabled={!mascot.touchEnabled}
        activeOpacity={0.8}
      >
        {mascot.type === 'lottie' ? (
          <LottieMascot mascot={mascot} animation={animation} resizeMode={resizeMode} onAnimationFinish={onAnimationFinish} />
        ) : (
          <SVGMascot mascot={mascot} size={size} />
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

MascotViewComponent.displayName = 'MascotView';

export const MascotView = memo(MascotViewComponent, arePropsEqual);

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
