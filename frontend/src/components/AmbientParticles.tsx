import React, { useEffect, useMemo } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { useTheme } from '@/src/theme/ThemeContext';

// Persistent ambient constellation for the launcher background.
// Produces the same premium vibe as Immersive mode without covering
// the icons. Density scales with the user's particle setting.

interface Dot {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
}

function densityToCount(d: 'low' | 'medium' | 'high'): number {
  return d === 'low' ? 24 : d === 'high' ? 60 : 40;
}

export function AmbientParticles() {
  const { skin, settings } = useTheme();
  const { width, height } = useWindowDimensions();

  const dots = useMemo<Dot[]>(() => {
    const count = densityToCount(settings.particleDensity);
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * width,
      y: Math.random() * height,
      size: 1 + Math.random() * 2.4,
      delay: Math.random() * 2200,
    }));
  }, [width, height, settings.particleDensity]);

  return (
    <View
      pointerEvents="none"
      style={StyleSheet.absoluteFillObject}
      testID="ambient-particles"
    >
      {dots.map((d) => (
        <DotView key={d.id} dot={d} color={skin.brand} />
      ))}
    </View>
  );
}

function DotView({ dot, color }: { dot: Dot; color: string }) {
  const opacity = useSharedValue(0.05);

  useEffect(() => {
    opacity.value = withDelay(
      dot.delay,
      withRepeat(
        withSequence(
          withTiming(0.55, {
            duration: 1600,
            easing: Easing.inOut(Easing.ease),
          }),
          withTiming(0.05, {
            duration: 1600,
            easing: Easing.inOut(Easing.ease),
          }),
        ),
        -1,
        true,
      ),
    );
  }, [dot.delay, opacity]);

  const animStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          left: dot.x,
          top: dot.y,
          width: dot.size,
          height: dot.size,
          borderRadius: dot.size / 2,
          backgroundColor: color,
          shadowColor: color,
          shadowOpacity: 0.85,
          shadowRadius: 5,
          shadowOffset: { width: 0, height: 0 },
        },
        animStyle,
      ]}
    />
  );
}
