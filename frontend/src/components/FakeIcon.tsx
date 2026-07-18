import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useCallback } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import type { FakeApp } from '@/src/data/fakeApps';
import { useTheme } from '@/src/theme/ThemeContext';
import { fireHaptic } from '@/src/utils/haptics';

interface Props {
  app: FakeApp;
  size?: number;
  onLongPress?: () => void;
  testID?: string;
  fixedWidth?: boolean;   // true = fill 25% of parent (grid); false = intrinsic (dock)
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// A single decorative fake app icon. Long-press produces a bounce + glow.
export function FakeIcon({ app, size = 62, onLongPress, testID, fixedWidth = true }: Props) {
  const { skin, settings } = useTheme();
  const scale = useSharedValue(1);
  const glow = useSharedValue(0);

  const handlePressIn = useCallback(() => {
    scale.value = withSpring(0.92, { damping: 12, stiffness: 220 });
  }, [scale]);

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, { damping: 12, stiffness: 220 });
  }, [scale]);

  const handleLongPress = useCallback(() => {
    fireHaptic('medium', settings);
    glow.value = withTiming(1, { duration: 180 });
    scale.value = withSpring(1.08, { damping: 8, stiffness: 180 });
    setTimeout(() => {
      glow.value = withTiming(0, { duration: 600 });
      scale.value = withSpring(1, { damping: 12, stiffness: 220 });
    }, 300);
    onLongPress?.();
  }, [settings, scale, glow, onLongPress]);

  const handlePress = useCallback(() => {
    fireHaptic('light', settings);
  }, [settings]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glow.value,
  }));

  return (
    <View
      style={{
        alignItems: 'center',
        ...(fixedWidth
          ? { width: '25%', paddingHorizontal: 2 }
          : { width: size + 16 }),
      }}
    >
      <AnimatedPressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handlePress}
        onLongPress={handleLongPress}
        delayLongPress={280}
        testID={testID}
        style={[
          {
            width: size,
            height: size,
            borderRadius: size * 0.28,
            overflow: 'hidden',
          },
          animatedStyle,
        ]}
      >
        <LinearGradient
          colors={app.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFillObject}
        />
        <View style={styles.iconInner}>
          <Ionicons name={app.icon as any} size={size * 0.42} color="#FFFFFF" />
        </View>
        <Animated.View
          pointerEvents="none"
          style={[
            StyleSheet.absoluteFillObject,
            {
              borderRadius: size * 0.28,
              borderWidth: 2,
              borderColor: skin.brand,
              shadowColor: skin.brand,
              shadowOpacity: 0.9,
              shadowRadius: 14,
              shadowOffset: { width: 0, height: 0 },
            },
            glowStyle,
          ]}
        />
      </AnimatedPressable>
      <Text
        numberOfLines={1}
        style={{
          color: skin.onSurface,
          fontSize: 11,
          marginTop: 6,
          maxWidth: size + 12,
          textAlign: 'center',
          fontWeight: '500',
          letterSpacing: 0.4,
        }}
      >
        {app.name}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  iconInner: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
