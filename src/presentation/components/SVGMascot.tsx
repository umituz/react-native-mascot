/**
 * SVG Mascot Component (70 lines)
 * SVG-specific rendering with mood-based expressions
 */

import React, { memo } from 'react';
import { Svg } from 'react-native-svg';
import type { Mascot } from '../../domain/entities/Mascot';

export interface SVGMascotProps {
  mascot: Mascot;
  size: number;
}

const SVGMascotComponent = memo<SVGMascotProps>(({ mascot, size }) => {
  const { appearance } = mascot;

  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      {/* Base */}
      <circle cx="50" cy="50" r="40" fill={appearance.baseColor} />
      {/* Accent */}
      <circle cx="50" cy="50" r="35" fill={appearance.accentColor} opacity="0.3" />
      {/* Eyes */}
      <circle cx="35" cy="40" r="5" fill="#000" />
      <circle cx="65" cy="40" r="5" fill="#000" />
      {/* Mouth based on mood */}
      <MoodExpression mood={mascot.personality.mood} />
    </Svg>
  );
});

SVGMascotComponent.displayName = 'SVGMascot';

export const SVGMascot = SVGMascotComponent;

// Mood-based mouth component
interface MoodExpressionProps {
  mood: string;
}

const MoodExpressionComponent = memo<MoodExpressionProps>(({ mood }) => {
  switch (mood) {
    case 'happy':
    case 'excited':
      return <path d="M 35 60 Q 50 75 65 60" stroke="#000" strokeWidth="3" fill="none" />;
    case 'sad':
    case 'angry':
      return <path d="M 35 70 Q 50 55 65 70" stroke="#000" strokeWidth="3" fill="none" />;
    case 'surprised':
      return <circle cx="50" cy="65" r="8" fill="#000" />;
    case 'thinking':
      return <path d="M 40 65 L 60 65" stroke="#000" strokeWidth="3" fill="none" />;
    default:
      return <path d="M 40 65 L 60 65" stroke="#000" strokeWidth="3" fill="none" />;
  }
});

MoodExpressionComponent.displayName = 'MoodExpression';

const MoodExpression = memo(MoodExpressionComponent);
