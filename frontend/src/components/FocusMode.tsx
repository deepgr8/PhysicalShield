import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Dimensions, Pressable, StyleSheet, Text, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { useTheme, AppSettings } from '@/src/theme/ThemeContext';
import { fireHaptic } from '@/src/utils/haptics';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

// Focus Mode is the flagship "fidget" playground.
// Interactive particle field driven by touch. Uses many small animated
// Views (RN's simplest primitive) for broad device compatibility.

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  life: number;
  born: number;
}

interface Props {
  visible: boolean;
  onExit: () => void;
}

function densityToCount(d: AppSettings['particleDensity']): number {
  return d === 'low' ? 60 : d === 'high' ? 180 : 110;
}

export function FocusMode({ visible, onExit }: Props) {
  const { skin, settings } = useTheme();
  const [particles, setParticles] = useState<Particle[]>([]);
  const nextIdRef = useRef(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withTiming(visible ? 1 : 0, { duration: 300 });
    if (visible) fireHaptic('strong', settings);
    if (!visible) setParticles([]);
  }, [visible, opacity, settings]);

  // Ambient constellation dots — steady, glow, breathe.
  const constellation = useMemo(() => {
    const count = Math.floor(densityToCount(settings.particleDensity) / 3);
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * SCREEN_W,
      y: Math.random() * SCREEN_H,
      size: 1 + Math.random() * 2.5,
      delay: Math.random() * 2000,
    }));
  }, [settings.particleDensity, visible]);

  const spawn = useCallback((x: number, y: number, count = 6) => {
    setParticles((prev) => {
      const next = [...prev];
      for (let i = 0; i < count; i++) {
        nextIdRef.current += 1;
        next.push({
          id: nextIdRef.current,
          x,
          y,
          vx: (Math.random() - 0.5) * 4,
          vy: (Math.random() - 0.5) * 4,
          size: 3 + Math.random() * 5,
          life: 900 + Math.random() * 700,
          born: Date.now(),
        });
      }
      // cap
      const max = densityToCount(settings.particleDensity);
      return next.length > max ? next.slice(-max) : next;
    });
  }, [settings.particleDensity]);

  // Animation tick: age particles + fade out; cull expired.
  useEffect(() => {
    if (!visible) return;
    const tickIntervalMs = 60;
    const t = setInterval(() => {
      const now = Date.now();
      setParticles((prev) =>
        prev
          .map((p) => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
          }))
          .filter((p) => now - p.born < p.life),
      );
    }, tickIntervalMs);
    return () => clearInterval(t);
  }, [visible]);

  const panGesture = Gesture.Pan()
    .minDistance(0)
    .onBegin((e) => {
      runOnJS(spawn)(e.x, e.y, 8);
      runOnJS(fireHaptic)('selection', settings);
    })
    .onUpdate((e) => {
      runOnJS(spawn)(e.x, e.y, 2);
    });

  const doubleTap = Gesture.Tap()
    .numberOfTaps(2)
    .maxDelay(280)
    .onEnd(() => {
      runOnJS(onExit)();
      runOnJS(fireHaptic)('strong', settings);
    });

  const composed = Gesture.Simultaneous(panGesture, doubleTap);

  const overlayStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  const now = Date.now();

  return (
    <Animated.View
      pointerEvents={visible ? 'auto' : 'none'}
      style={[
        StyleSheet.absoluteFillObject,
        { backgroundColor: '#000000', zIndex: 200 },
        overlayStyle,
      ]}
      testID="focus-mode"
    >
      <GestureDetector gesture={composed}>
        <View style={StyleSheet.absoluteFillObject}>
          {/* Constellation background */}
          {visible &&
            constellation.map((c) => (
              <ConstellationDot
                key={c.id}
                x={c.x}
                y={c.y}
                size={c.size}
                color={skin.brand}
                delay={c.delay}
              />
            ))}

          {/* Interactive particles */}
          {particles.map((p) => {
            const age = now - p.born;
            const fade = 1 - age / p.life;
            return (
              <View
                key={p.id}
                pointerEvents="none"
                style={{
                  position: 'absolute',
                  left: p.x - p.size / 2,
                  top: p.y - p.size / 2,
                  width: p.size,
                  height: p.size,
                  borderRadius: p.size / 2,
                  backgroundColor: skin.brand,
                  opacity: Math.max(0, fade),
                  shadowColor: skin.glow,
                  shadowOpacity: 0.9 * fade,
                  shadowRadius: 8,
                  shadowOffset: { width: 0, height: 0 },
                }}
              />
            );
          })}
        </View>
      </GestureDetector>

      {/* Hint + exit button */}
      <View pointerEvents="box-none" style={styles.hintWrap}>
        <Text style={[styles.hint, { color: `${skin.brand}90` }]}>
          FOCUS MODE · double-tap or press ✕ to exit
        </Text>
      </View>
      <Pressable
        onPress={onExit}
        style={[styles.exitBtn, { borderColor: skin.border, backgroundColor: '#00000066' }]}
        testID="focus-exit-btn"
      >
        <Ionicons name="close" size={20} color={skin.brand} />
      </Pressable>
    </Animated.View>
  );
}

function ConstellationDot({
  x,
  y,
  size,
  color,
  delay,
}: {
  x: number;
  y: number;
  size: number;
  color: string;
  delay: number;
}) {
  const opacity = useSharedValue(0.15);
  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.9, { duration: 1400 + delay, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.15, { duration: 1400 + delay, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      true,
    );
  }, [delay, opacity]);
  const style = useAnimatedStyle(() => ({ opacity: opacity.value }));
  return (
    <Animated.View
      pointerEvents="none"
      style={[
        {
          position: 'absolute',
          left: x,
          top: y,
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
          shadowColor: color,
          shadowOpacity: 0.8,
          shadowRadius: 6,
          shadowOffset: { width: 0, height: 0 },
        },
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  hintWrap: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  hint: { fontSize: 11, letterSpacing: 3, fontWeight: '600' },
  exitBtn: {
    position: 'absolute',
    top: 54,
    right: 20,
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
