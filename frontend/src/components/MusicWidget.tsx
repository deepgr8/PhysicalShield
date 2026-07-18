import { Ionicons } from '@expo/vector-icons';
import React, { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { GlassCard } from '@/src/components/GlassCard';
import { useTheme } from '@/src/theme/ThemeContext';
import { fireHaptic } from '@/src/utils/haptics';

// A 2x2 fake music player widget with animated ring + play toggle.
export function MusicWidget() {
  const { skin, settings } = useTheme();
  const [playing, setPlaying] = React.useState(true);
  const rotation = useSharedValue(0);

  useEffect(() => {
    if (playing) {
      rotation.value = withRepeat(
        withTiming(360, { duration: 6000, easing: Easing.linear }),
        -1,
        false,
      );
    } else {
      cancelAnimation(rotation);
    }
    return () => cancelAnimation(rotation);
  }, [playing, rotation]);

  const ringStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  const toggle = () => {
    fireHaptic('medium', settings);
    setPlaying((p) => !p);
  };

  return (
    <GlassCard glow tintOpacity={0.07} style={styles.card}>
      <Text style={[styles.label, { color: skin.onSurfaceMuted }]}>NOW PLAYING</Text>
      <View style={styles.row}>
        <View style={styles.discWrap}>
          <Animated.View
            style={[
              styles.disc,
              { borderColor: skin.brand, shadowColor: skin.glow },
              ringStyle,
            ]}
          >
            <View style={[styles.discInner, { backgroundColor: skin.brand }]} />
          </Animated.View>
        </View>
        <View style={{ flex: 1, marginLeft: 14 }}>
          <Text numberOfLines={1} style={[styles.title, { color: skin.onSurface }]}>
            Digital Rain
          </Text>
          <Text numberOfLines={1} style={[styles.artist, { color: skin.onSurfaceMuted }]}>
            Ambient · Loop 7
          </Text>
          <Pressable onPress={toggle} style={styles.playBtn} testID="music-widget-play">
            <Ionicons
              name={playing ? 'pause' : 'play'}
              size={22}
              color={skin.brand}
            />
          </Pressable>
        </View>
      </View>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  card: { minHeight: 132 },
  label: { fontSize: 10, letterSpacing: 2, marginBottom: 8 },
  row: { flexDirection: 'row', alignItems: 'center' },
  discWrap: { width: 68, height: 68, alignItems: 'center', justifyContent: 'center' },
  disc: {
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOpacity: 0.6,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 0 },
  },
  discInner: { width: 12, height: 12, borderRadius: 6 },
  title: { fontSize: 15, fontWeight: '600', letterSpacing: 0.4 },
  artist: { fontSize: 11, marginTop: 2, letterSpacing: 0.6 },
  playBtn: { marginTop: 6, alignSelf: 'flex-start' },
});
