import { BlurView } from 'expo-blur';
import React from 'react';
import { Platform, StyleSheet, View, ViewStyle } from 'react-native';

import { useTheme } from '@/src/theme/ThemeContext';

interface Props {
  children: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
  intensity?: number;
  tintOpacity?: number;    // 0-1, brand tint over blur
  border?: boolean;
  glow?: boolean;
  radius?: number;
}

// A reusable glassmorphic panel. On web/older Android where BlurView is
// unreliable, we fall back to a solid translucent surface.
export function GlassCard({
  children,
  style,
  intensity = 40,
  tintOpacity = 0.06,
  border = true,
  glow = false,
  radius = 20,
}: Props) {
  const { skin } = useTheme();
  const canBlur = Platform.OS !== 'web';

  const borderStyle: ViewStyle | undefined = border
    ? { borderWidth: 1, borderColor: skin.border }
    : undefined;

  const glowStyle: ViewStyle | undefined = glow
    ? {
        shadowColor: skin.glow,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.55,
        shadowRadius: 18,
        elevation: 10,
      }
    : undefined;

  const content = (
    <View
      style={[
        {
          backgroundColor: `${skin.brand}${Math.round(tintOpacity * 255).toString(16).padStart(2, '0')}`,
          padding: 16,
        },
      ]}
    >
      {children}
    </View>
  );

  return (
    <View
      style={[
        {
          borderRadius: radius,
          overflow: 'hidden',
          backgroundColor: canBlur ? 'transparent' : skin.surfaceSecondary,
        },
        borderStyle,
        glowStyle,
        style,
      ]}
    >
      {canBlur ? (
        <BlurView intensity={intensity} tint="dark" style={StyleSheet.absoluteFillObject} />
      ) : null}
      {content}
    </View>
  );
}
