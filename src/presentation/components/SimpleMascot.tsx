/**
 * SimpleMascot Component
 *
 * A simplified, configurable mascot component that works across different apps.
 * Uses Reanimated animations and accepts dynamic theme colors and image sources.
 *
 * @example
 * ```tsx
 * import { SimpleMascot } from '@umituz/react-native-mascot';
 *
 * <SimpleMascot
 *   source={require('../assets/mascot.png')}
 *   state="thinking"
 *   size="large"
 *   theme={{
 *     primary: '#FF6B6B',
 *     glow: 'rgba(255, 107, 107, 0.15)',
 *   }}
 * />
 * ```
 */

import React, { useEffect, memo } from 'react';
import { View, Image, StyleSheet, ViewStyle, ImageSource } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  Easing,
} from '@umituz/react-native-animation';

import type { MascotState } from './types';

export interface SimpleMascotProps {
  /** Image source for the mascot (require() or URI) */
  source: ImageSource;

  /** Animation state */
  state?: MascotState;

  /** Size preset or custom size */
  size?: number | 'small' | 'medium' | 'large';

  /** Theme colors */
  theme?: {
    /** Primary glow color */
    primary?: string;
    /** Glow effect color (with alpha) */
    glow?: string;
    /** Message background color */
    background?: string;
    /** Message text color */
    text?: string;
  };

  /** Optional message to display */
  message?: string;

  /** Enable/disable animations */
  animate?: boolean;

  /** Additional styles */
  style?: ViewStyle;

  /** Test ID for testing */
  testID?: string;
}

const SIZE_PRESETS: Record<string, number> = {
  small: 60,
  medium: 100,
  large: 140,
};

function SimpleMascotComponent({
  source,
  state = 'idle',
  size = 'medium',
  theme = {},
  message,
  animate = true,
  style,
  testID = 'simple-mascot',
}: SimpleMascotProps) {
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);
  const rotate = useSharedValue(0);

  // Resolve size
  const imageSize = typeof size === 'number' ? size : SIZE_PRESETS[size] || SIZE_PRESETS.medium;

  // Resolve theme colors with defaults
  const primaryColor = theme.primary || '#FF6B6B';
  const glowColor = theme.glow || `${primaryColor}26`; // 15% opacity
  const backgroundColor = theme.background || 'rgba(30, 30, 30, 0.9)';
  const textColor = theme.text || '#FFFFFF';

  useEffect(() => {
    // Reset animations
    // eslint-disable-next-line react-hooks/exhaustive-deps -- Reanimated shared values are designed to be mutable
    translateY.value = 0;
    // eslint-disable-next-line react-hooks/exhaustive-deps
    scale.value = 1;
    // eslint-disable-next-line react-hooks/exhaustive-deps
    rotate.value = 0;

    if (!animate) return;

    switch (state) {
      case 'idle':
        // Gentle floating animation
        translateY.value = withRepeat(
          withSequence(
            withTiming(-6, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
            withTiming(0, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
          ),
          -1,
          true,
        );
        scale.value = withRepeat(
          withSequence(
            withTiming(1.03, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
            withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
          ),
          -1,
          true,
        );
        break;

      case 'thinking':
        // Wiggle/twitch animation
        rotate.value = withRepeat(
          withSequence(
            withTiming(-5, { duration: 200, easing: Easing.inOut(Easing.ease) }),
            withTiming(5, { duration: 200, easing: Easing.inOut(Easing.ease) }),
            withTiming(-5, { duration: 200, easing: Easing.inOut(Easing.ease) }),
            withTiming(0, { duration: 200, easing: Easing.inOut(Easing.ease) }),
          ),
          -1,
          false,
        );
        break;

      case 'reacting':
        // Quick pulse + rotation
        scale.value = withSequence(
          withTiming(1.15, { duration: 150, easing: Easing.out(Easing.ease) }),
          withTiming(1, { duration: 150, easing: Easing.inOut(Easing.ease) }),
        );
        rotate.value = withSequence(
          withTiming(-10, { duration: 100, easing: Easing.out(Easing.ease) }),
          withTiming(10, { duration: 100, easing: Easing.out(Easing.ease) }),
          withTiming(0, { duration: 100, easing: Easing.inOut(Easing.ease) }),
        );
        break;

      case 'excited':
        // Bouncy jump animation
        translateY.value = withRepeat(
          withSequence(
            withTiming(-15, { duration: 400, easing: Easing.out(Easing.ease) }),
            withTiming(0, { duration: 300, easing: Easing.in(Easing.ease) }),
            withTiming(-10, { duration: 300, easing: Easing.out(Easing.ease) }),
            withTiming(0, { duration: 200, easing: Easing.in(Easing.ease) }),
          ),
          -1,
          false,
        );
        scale.value = withRepeat(
          withSequence(
            withTiming(1.08, { duration: 400, easing: Easing.out(Easing.ease) }),
            withTiming(1, { duration: 300, easing: Easing.in(Easing.ease) }),
          ),
          -1,
          false,
        );
        break;

      case 'speaking':
        // Subtle breathing animation
        scale.value = withRepeat(
          withSequence(
            withTiming(1.04, { duration: 800, easing: Easing.inOut(Easing.ease) }),
            withTiming(1, { duration: 800, easing: Easing.inOut(Easing.ease) }),
          ),
          -1,
          true,
        );
        translateY.value = withRepeat(
          withSequence(
            withTiming(-3, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
            withTiming(0, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
          ),
          -1,
          true,
        );
        break;

      default:
        break;
    }
  }, [animate, state, translateY, scale, rotate]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { scale: scale.value },
      { rotate: `${rotate.value}deg` },
    ],
  }));

  return (
    <View style={[styles.container, style]} testID={testID}>
      <Animated.View style={animatedStyle}>
        <View
          style={[
            styles.glowContainer,
            { width: imageSize + 20, height: imageSize + 20 },
          ]}
        >
          <View
            style={[
              styles.glow,
              { width: imageSize + 20, height: imageSize + 20, backgroundColor: glowColor },
            ]}
          />
          <Image
            source={source}
            style={[
              styles.mascotImage,
              { width: imageSize, height: imageSize },
            ]}
            resizeMode="contain"
          />
        </View>
      </Animated.View>
      {message ? (
        <View style={[styles.messageContainer, { backgroundColor }]}>
          <SimpleMascotText style={{ color: textColor }}>{message}</SimpleMascotText>
        </View>
      ) : null}
    </View>
  );
}

SimpleMascotComponent.displayName = 'SimpleMascot';

const SimpleMascotText = memo(({ style, children }: { style: any; children: React.ReactNode }) => (
  <View>
    {typeof children === 'string' ? (
      <Animated.Text style={style}>{children}</Animated.Text>
    ) : (
      children
    )}
  </View>
));

export const SimpleMascot = memo(SimpleMascotComponent);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  glow: {
    borderRadius: 9999, // Circular
    position: 'absolute',
  },
  glowContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  mascotImage: {
    borderRadius: 9999, // Circular
  },
  messageContainer: {
    borderRadius: 12,
    marginTop: 12,
    maxWidth: 280,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
});
