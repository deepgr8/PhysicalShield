import React from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@/src/theme/ThemeContext';
import { USE_FAKE_AD_SLOT } from '@/src/config/adConfig';

// Bottom-anchored fake AdMob banner slot.
// In a native build, replace the inner <View> with the <BannerAd/> from
// react-native-google-mobile-ads using the IDs in src/config/adConfig.ts.
export function FakeAdBanner({ height = 56 }: { height?: number }) {
  const { skin } = useTheme();

  if (!USE_FAKE_AD_SLOT) {
    // In native build this branch should be swapped with <BannerAd />
    return null;
  }

  return (
    <View
      testID="fake-ad-banner"
      style={[
        styles.banner,
        {
          height,
          borderColor: skin.border,
          backgroundColor: skin.surfaceSecondary,
        },
      ]}
    >
      <View style={[styles.dot, { backgroundColor: skin.brand }]} />
      <View style={{ flex: 1 }}>
        <Text style={[styles.title, { color: skin.onSurface }]}>Ad · Sponsored</Text>
        <Text style={[styles.sub, { color: skin.onSurfaceMuted }]} numberOfLines={1}>
          Your AdMob banner will render here on native builds
        </Text>
      </View>
      <Text style={[styles.badge, { color: skin.brand, borderColor: skin.border }]}>
        {Platform.OS.toUpperCase()}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    paddingHorizontal: 12,
    gap: 10,
  },
  dot: { width: 8, height: 8, borderRadius: 4 },
  title: { fontSize: 13, fontWeight: '600', letterSpacing: 0.3 },
  sub: { fontSize: 10, marginTop: 1, letterSpacing: 0.5 },
  badge: {
    fontSize: 9,
    letterSpacing: 1.4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderWidth: 1,
    borderRadius: 8,
  },
});
