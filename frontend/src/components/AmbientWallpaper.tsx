import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';

import { useTheme } from '@/src/theme/ThemeContext';

interface Props {
  style?: ViewStyle | ViewStyle[];
}

// Animated ambient wallpaper — a layered radial-esque gradient using
// LinearGradient stacks. Cheap and always renders (no native module deps).
export function AmbientWallpaper({ style }: Props) {
  const { skin } = useTheme();
  return (
    <View style={[StyleSheet.absoluteFillObject, { backgroundColor: skin.surface }, style]}>
      <LinearGradient
        colors={skin.wallpaperGradient}
        start={{ x: 0.1, y: 0 }}
        end={{ x: 0.9, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />
      {/* soft top-left neon glow */}
      <LinearGradient
        colors={[`${skin.brand}22`, 'transparent']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0.8, y: 0.8 }}
        style={StyleSheet.absoluteFillObject}
      />
      {/* soft bottom-right secondary tint */}
      <LinearGradient
        colors={['transparent', `${skin.brandSecondary}22`]}
        start={{ x: 0.2, y: 0.2 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />
    </View>
  );
}
