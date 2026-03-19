/**
 * MascotView Component (OPTIMIZED with React.memo)
 * Main component for rendering mascots with performance optimizations
 */

import React, { memo, useMemo, useRef, useEffect, useCallback } from 'react';
import { View, StyleSheet, Animated, TouchableOpacity, ViewStyle } from 'react-native';
import LottieView from 'lottie-react-native';
import type { AnimationObject } from 'lottie-react-native';
import { Svg } from 'react-native-svg';
import type { Mascot } from '../../domain/entities/Mascot';
import type { MascotAnimation } from '../../domain/types/MascotTypes';

type LottieAnimationSource = string | AnimationObject | { uri: string };

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

/**
 * Memoized comparison function for props
 * Only re-render if props actually change
 */
function arePropsEqual(prevProps: MascotViewProps, nextProps: MascotViewProps): boolean {
  return (
    prevProps.mascot === nextProps.mascot &&
    prevProps.animation === nextProps.animation &&
    prevProps.size === nextProps.size &&
    prevProps.testID === nextProps.testID &&
    prevProps.resizeMode === nextProps.resizeMode &&
    prevProps.onPress === nextProps.onPress &&
    prevProps.onLongPress === nextProps.onLongPress &&
    prevProps.onAnimationFinish === nextProps.onAnimationFinish
    // Note: style is not compared as it could be a new object each time
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
  // Create animated values once with useMemo (not on every render)
  // Must be before early return
  const animatedValues = useMemo(() => ({
    opacity: new Animated.Value(0),
    scale: new Animated.Value(0),
  }), []);

  const { opacity, scale } = animatedValues;

  // Animation setup
  useEffect(() => {
    if (mascot?.state.isVisible) {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(scale, {
          toValue: 1,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.timing(opacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [mascot?.state.isVisible, opacity, scale]);

  // Memoize styles to prevent recreation
  const animatedStyle = useMemo(() => ({
    opacity,
    transform: [{ scale }],
  }), [opacity, scale]);

  const containerStyle = useMemo(() => [
    styles.container,
    { width: size, height: size },
    style,
  ], [size, style]);

  // Memoize handlers to prevent unnecessary re-renders
  const handlePress = useCallback(() => {
    if (mascot?.touchEnabled && onPress) {
      onPress();
    }
  }, [mascot?.touchEnabled, onPress]);

  const handleLongPress = useCallback(() => {
    if (mascot?.touchEnabled && onLongPress) {
      onLongPress();
    }
  }, [mascot?.touchEnabled, onLongPress]);

  // Early return if not visible (after hooks)
  if (!mascot || !mascot.state.isVisible) {
    return null;
  }

  return (
    <Animated.View
      style={animatedStyle}
      testID={testID}
    >
      <TouchableOpacity
        style={containerStyle}
        onPress={handlePress}
        onLongPress={handleLongPress}
        disabled={!mascot.touchEnabled}
        activeOpacity={0.8}
      >
        {mascot.type === 'lottie' ? (
          <LottieMascot
            mascot={mascot}
            animation={animation}
            resizeMode={resizeMode}
            onAnimationFinish={onAnimationFinish}
          />
        ) : (
          <SVGMascot
            mascot={mascot}
            size={size}
          />
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

// Set display name for debugging
MascotViewComponent.displayName = 'MascotView';

export const MascotView = memo(MascotViewComponent, arePropsEqual);

// Lottie Mascot Component
interface LottieMascotProps {
  mascot: Mascot;
  animation?: MascotAnimation | null;
  resizeMode?: 'cover' | 'contain' | 'center';
  onAnimationFinish?: () => void;
}

const LottieMascotComponent: React.FC<LottieMascotProps> = ({
  mascot,
  animation,
  resizeMode = 'contain',
  onAnimationFinish,
}) => {
  const lottieRef = useRef<LottieView>(null);

  // Memoize animation source to prevent reloads
  const source = useMemo(() => {
    return animation?.source || mascot.animations.find((a: MascotAnimation) => a.type === 'idle')?.source;
  }, [animation?.source, mascot.animations]);

  // Play animation when source changes
  useEffect(() => {
    if (source && lottieRef.current) {
      lottieRef.current.play();
    }
  }, [source]);

  // Early return if no source (after hooks)
  if (!source) {
    return <FallbackMascot mascot={mascot} />;
  }

  return (
    <LottieView
      ref={lottieRef}
      source={source as LottieAnimationSource}
      style={styles.lottie}
      resizeMode={resizeMode}
      autoPlay={animation?.autoplay}
      loop={animation?.loop}
      onAnimationFinish={onAnimationFinish}
    />
  );
};

LottieMascotComponent.displayName = 'LottieMascot';

const LottieMascot = memo(LottieMascotComponent);

// SVG Mascot Component
interface SVGMascotProps {
  mascot: Mascot;
  size: number;
}

const SVGMascotComponent: React.FC<SVGMascotProps> = ({ mascot, size }) => {
  const { appearance } = mascot;

  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      {/* Base shape */}
      <circle
        cx="50"
        cy="50"
        r="40"
        fill={appearance.baseColor}
      />
      {/* Accent */}
      <circle
        cx="50"
        cy="50"
        r="35"
        fill={appearance.accentColor}
        opacity="0.3"
      />
      {/* Face */}
      <circle cx="35" cy="40" r="5" fill="#000" />
      <circle cx="65" cy="40" r="5" fill="#000" />
      {/* Mouth based on mood */}
      <MoodMood mood={mascot.personality.mood} />
    </Svg>
  );
};

SVGMascotComponent.displayName = 'SVGMascot';

const SVGMascot = memo(SVGMascotComponent);

// Mood-based mouth
interface MoodMoodProps {
  mood: string;
}

const MoodMoodComponent: React.FC<MoodMoodProps> = ({ mood }) => {
  switch (mood) {
    case 'happy':
    case 'excited':
      return (
        <path
          d="M 35 60 Q 50 75 65 60"
          stroke="#000"
          strokeWidth="3"
          fill="none"
        />
      );
    case 'sad':
    case 'angry':
      return (
        <path
          d="M 35 70 Q 50 55 65 70"
          stroke="#000"
          strokeWidth="3"
          fill="none"
        />
      );
    case 'surprised':
      return (
        <circle
          cx="50"
          cy="65"
          r="8"
          fill="#000"
        />
      );
    case 'thinking':
      return (
        <path
          d="M 40 65 L 60 65"
          stroke="#000"
          strokeWidth="3"
          fill="none"
        />
      );
    default:
      return (
        <path
          d="M 40 65 L 60 65"
          stroke="#000"
          strokeWidth="3"
          fill="none"
        />
      );
  }
};

MoodMoodComponent.displayName = 'MoodMood';

const MoodMood = memo(MoodMoodComponent);

// Fallback Mascot
interface FallbackMascotProps {
  mascot: Mascot;
}

const FallbackMascotComponent: React.FC<FallbackMascotProps> = ({ mascot }) => {
  const { appearance } = mascot;

  return (
    <View style={[styles.fallback, { backgroundColor: appearance.baseColor }]}>
      <View style={[styles.eye, { left: '30%' }]} />
      <View style={[styles.eye, { right: '30%' }]} />
    </View>
  );
};

FallbackMascotComponent.displayName = 'FallbackMascot';

const FallbackMascot = memo(FallbackMascotComponent);

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  lottie: {
    width: '100%',
    height: '100%',
  },
  fallback: {
    width: '100%',
    height: '100%',
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  eye: {
    position: 'absolute',
    width: 10,
    height: 10,
    backgroundColor: '#000',
    borderRadius: 5,
    top: '40%',
  },
});
