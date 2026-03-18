# @umituz/react-native-mascot

Interactive mascot system for React Native apps - Customizable animated characters with Lottie and SVG support, mood system, and easy integration.

## Features

- ✅ **Pre-built Templates** - Ready-to-use mascot characters
- ✅ **Lottie Animations** - Professional JSON animations
- ✅ **SVG Rendering** - Custom vector graphics
- ✅ **Mood System** - Dynamic personality and emotions
- ✅ **Interactive** - Touch-enabled mascots
- ✅ **Animation Queue** - Sequence animations
- ✅ **Custom Accessories** - Add glasses, hats, etc.
- ✅ **Dynamic Colors** - Customize appearance
- ✅ **Type-Safe** - Full TypeScript support
- ✅ **DDD Architecture** - Domain-driven design

## Installation

```bash
npm install @umituz/react-native-mascot
```

### Dependencies

```bash
npm install lottie-react-native react-native-reanimated react-native-svg
```

## Quick Start

### Basic Usage

```tsx
import React from 'react';
import { View } from 'react-native';
import { useMascot, MascotView } from '@umituz/react-native-mascot';

function MyApp() {
  const mascot = useMascot({
    template: 'friendly-bot',
    autoInitialize: true
  });

  return (
    <View>
      <MascotView
        mascot={mascot.mascot}
        size={200}
        onPress={() => mascot.playAnimation('wave')}
      />
    </View>
  );
}
```

### Using Template

```tsx
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

```tsx
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

| Template | Style | Personality |
|----------|-------|-------------|
| `friendly-bot` | Cartoon | Happy & Friendly |
| `cute-pet` | Cartoon | Excited & Playful |
| `wise-owl` | Realistic | Thinking & Calm |
| `pixel-hero` | Pixel Art | Happy & Brave |

## API Reference

### useMascot Hook

```tsx
const mascot = useMascot({
  config?: MascotConfig,
  template?: string,
  autoInitialize?: boolean
});
```

**Returns:**

```tsx
{
  mascot: Mascot | null,
  isReady: boolean,
  isPlaying: boolean,
  currentAnimation: string | null,
  initialize: (config: MascotConfig) => void,
  initializeFromTemplate: (template: string) => void,
  setMood: (mood: MascotMood) => void,
  setEnergy: (energy: number) => void,
  playAnimation: (animationId: string) => Promise<void>,
  stopAnimation: () => void,
  updateAppearance: (appearance: Partial<MascotAppearance>) => void,
  setBaseColor: (color: string) => void,
  setAccentColor: (color: string) => void,
  addAccessory: (accessory) => void,
  removeAccessory: (accessoryId: string) => void,
  setVisible: (visible: boolean) => void,
  setPosition: (position: { x: number, y: number }) => void
}
```

### MascotView Component

```tsx
<MascotView
  mascot={mascot}
  animation={animation}
  size={200}
  style={style}
  onPress={() => {}}
  onLongPress={() => {}}
  onAnimationFinish={() => {}}
  resizeMode="contain"
/>
```

### MascotFactory

```tsx
// Create from template
const mascot = MascotFactory.createFromTemplate('friendly-bot', customizations);

// Create custom
const mascot = MascotFactory.createCustom(config);

// Create simple
const mascot = MascotFactory.createSimple({
  id: 'my-mascot',
  name: 'My Mascot',
  baseColor: '#FF6B6B'
});
```

## Mood System

```tsx
// Change mascot mood
mascot.setMood('excited');

// Available moods
type MascotMood =
  | 'happy'
  | 'sad'
  | 'excited'
  | 'thinking'
  | 'angry'
  | 'neutral'
  | 'surprised';
```

## Animation Control

```tsx
// Play animation
await mascot.playAnimation('jump');

// Built-in animations: 'idle', 'wave', 'jump', 'success', 'error', 'dance'

// Stop animation
mascot.stopAnimation();

// With options
await mascot.playAnimation('wave', {
  speed: 1.5,
  loop: false,
  onStart: () => console.log('Started'),
  onFinish: () => console.log('Finished')
});
```

## Customization

### Appearance

```tsx
// Update appearance
mascot.updateAppearance({
  baseColor: '#FF6B6B',
  accentColor: '#4ECDC4',
  scale: 1.2
});

// Set colors
mascot.setBaseColor('#FF6B6B');
mascot.setAccentColor('#4ECDC4');

// Add accessories
mascot.addAccessory({
  id: 'glasses',
  type: 'glasses',
  color: '#333',
  position: { x: 0, y: -10 }
});

// Remove accessory
mascot.removeAccessory('glasses');
```

### Personality

```tsx
// Set mood
mascot.setMood('happy');

// Set energy (0-1)
mascot.setEnergy(0.9);

// Set friendliness (0-1)
mascot.setFriendliness(1.0);

// Set playfulness (0-1)
mascot.setPlayfulness(0.8);
```

## Context Provider

```tsx
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
      <Button onPress={() => setMood('excited')} title="Get Excited" />
    </>
  );
}
```

## Examples

### Animated Mascot Response

```tsx
function SuccessScreen() {
  const mascot = useMascot({ template: 'friendly-bot' });

  const handleSuccess = async () => {
    mascot.setMood('happy');
    await mascot.playAnimation('success');
    await mascot.playAnimation('dance');
  };

  return (
    <View>
      <MascotView mascot={mascot.mascot} size={200} />
      <Button onPress={handleSuccess} title="Success!" />
    </View>
  );
}
```

### Interactive Mascot

```tsx
function InteractiveMascot() {
  const mascot = useMascot({ template: 'cute-pet' });

  return (
    <View>
      <MascotView
        mascot={mascot.mascot}
        size={250}
        onPress={() => mascot.playAnimation('jump')}
        onLongPress={() => mascot.setMood('excited')}
      />
    </View>
  );
}
```

### Custom Animated Mascot

```tsx
import { useMascotAnimation } from '@umituz/react-native-mascot';

function AnimatedMascot() {
  const mascot = useMascot({ template: 'pixel-hero' });
  const { play, queueAnimation, playSequence } = useMascotAnimation({
    mascot: mascot.mascot
  });

  const performSequence = async () => {
    await playSequence(['wave', 'jump', 'dance']);
  };

  return (
    <View>
      <MascotView mascot={mascot.mascot} />
      <Button onPress={performSequence} title="Perform Sequence" />
    </View>
  );
}
```

## Architecture

This package follows **Domain-Driven Design (DDD)** principles:

- **Domain Layer**: Entities, value objects, interfaces
- **Infrastructure Layer**: Repositories, controllers, managers
- **Presentation Layer**: Components, hooks, contexts

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT © Ümit UZ
