/**
 * MascotView Component
 * Main component for rendering mascots
 */

import React, { useRef, useEffect, useState } from 'react';
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

export const MascotView: React.FC<MascotViewProps> = ({
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
  const [opacity] = useState(new Animated.Value(0));
  const [scale] = useState(new Animated.Value(0));

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

  const handlePress = () => {
    if (mascot?.touchEnabled && onPress) {
      onPress();
    }
  };

  const handleLongPress = () => {
    if (mascot?.touchEnabled && onLongPress) {
      onLongPress();
    }
  };

  if (!mascot || !mascot.state.isVisible) {
    return null;
  }

  const animatedStyle = {
    opacity,
    transform: [{ scale }],
  };

  const containerStyle = [
    styles.container,
    { width: size, height: size },
    style,
  ];

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

// Lottie Mascot Component
interface LottieMascotProps {
  mascot: Mascot;
  animation?: MascotAnimation | null;
  resizeMode?: 'cover' | 'contain' | 'center';
  onAnimationFinish?: () => void;
}

const LottieMascot: React.FC<LottieMascotProps> = ({
  mascot,
  animation,
  resizeMode = 'contain',
  onAnimationFinish,
}) => {
  const lottieRef = useRef<LottieView>(null);

  useEffect(() => {
    if (animation && lottieRef.current) {
      lottieRef.current.play();
    }
  }, [animation]);

  const source = animation?.source || mascot.animations.find((a) => a.type === 'idle')?.source;

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

// SVG Mascot Component
interface SVGMascotProps {
  mascot: Mascot;
  size: number;
}

const SVGMascot: React.FC<SVGMascotProps> = ({ mascot, size }) => {
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

// Mood-based mouth
interface MoodMoodProps {
  mood: string;
}

const MoodMood: React.FC<MoodMoodProps> = ({ mood }) => {
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

// Fallback Mascot
interface FallbackMascotProps {
  mascot: Mascot;
}

const FallbackMascot: React.FC<FallbackMascotProps> = ({ mascot }) => {
  const { appearance } = mascot;

  return (
    <View style={[styles.fallback, { backgroundColor: appearance.baseColor }]}>
      <View style={[styles.eye, { left: '30%' }]} />
      <View style={[styles.eye, { right: '30%' }]} />
    </View>
  );
};

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
