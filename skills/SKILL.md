# react-native-mascot

## Overview
Interactive mascot system for React Native apps - Customizable animated characters with Lottie and SVG support, mood system, and easy integration.

## Installation

```bash
npm install @umituz/react-native-mascot
# or
yarn add @umituz/react-native-mascot
```

## Dependencies
```bash
npm install lottie-react-native react-native-reanimated react-native-svg
```

## Quick Start

### Basic Usage

```typescript
import { useMascot, MascotView } from '@umituz/react-native-mascot';

function MyApp() {
  const mascot = useMascot({
    template: 'friendly-bot',
    autoInitialize: true
  });

  return (
    <MascotView
      mascot={mascot.mascot}
      animation={mascot.currentAnimation}
      size={200}
      onPress={() => mascot.playAnimation('wave')}
    />
  );
}
```

### Using Template

```typescript
import { MascotFactory, MascotView } from '@umituz/react-native-mascot';

function MyScreen() {
  const mascot = MascotFactory.createFromTemplate('cute-pet', {
    appearance: {
      baseColor: '#FFB6C1',
      accentColor: '#FF69B4'
    }
  });

  return <MascotView mascot={mascot} size={150} />;
}
```

### Custom Mascot

```typescript
import { Mascot, MascotView } from '@umituz/react-native-mascot';

function CustomMascotScreen() {
  const mascot = new Mascot({
    id: 'my-mascot',
    name: 'My Mascot',
    type: 'svg',
    personality: {
      mood: 'happy',
      energy: 0.8,
      friendliness: 0.9,
      playfulness: 0.7
    },
    appearance: {
      baseColor: '#4A90E2',
      accentColor: '#50E3C2',
      accessories: [],
      style: 'cartoon',
      scale: 1
    },
    animations: [],
    interactive: true,
    touchEnabled: true
  });

  return <MascotView mascot={mascot} />;
}
```

## Available Templates

- `friendly-bot` - Friendly robot mascot
- `cute-pet` - Adorable pet character
- `wise-owl` - Wise owl mentor
- `pixel-hero` - Pixel art style hero

## Mood System

```typescript
// Change mascot mood
mascot.setMood('excited');

// Available moods: 'happy', 'sad', 'excited', 'thinking', 'angry', 'neutral', 'surprised'
```

## Animation Control

```typescript
// Play animation
await mascot.playAnimation('jump');

// Stop animation
mascot.stopAnimation();

// Built-in animations: 'idle', 'wave', 'jump', 'success', 'error', 'dance'
```

## Customization

### Appearance

```typescript
mascot.updateAppearance({
  baseColor: '#FF6B6B',
  accentColor: '#4ECDC4'
});

// Add accessories
mascot.addAccessory({
  id: 'glasses',
  type: 'glasses',
  color: '#333'
});

// Remove accessory
mascot.removeAccessory('glasses');
```

### Personality

```typescript
mascot.setEnergy(0.9);
mascot.setFriendliness(1.0);
```

## Context Provider

```typescript
import { MascotProvider, useMascotContext } from '@umituz/react-native-mascot';

function App() {
  return (
    <MascotProvider template="friendly-bot">
      <MyScreen />
    </MascotProvider>
  );
}

function MyScreen() {
  const { mascot, playAnimation, setMood } = useMascotContext();

  return (
    <>
      <MascotView mascot={mascot} />
      <Button onPress={() => playAnimation('wave')} title="Wave" />
    </>
  );
}
```

## Features

✅ Pre-built mascot templates
✅ Lottie animation support
✅ SVG rendering
✅ Mood and personality system
✅ Interactive touch support
✅ Animation queuing
✅ Custom accessories
✅ Dynamic color customization
✅ Type-safe TypeScript
✅ DDD architecture

## License

MIT
