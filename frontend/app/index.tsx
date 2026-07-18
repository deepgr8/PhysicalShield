import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AmbientWallpaper } from '@/src/components/AmbientWallpaper';
import { useTheme } from '@/src/theme/ThemeContext';
import { fireHaptic } from '@/src/utils/haptics';

const { height: SCREEN_H } = Dimensions.get('window');

// Lock Screen / AOD simulator. Swipe up to enter the launcher.
export default function LockScreen() {
  const { skin, settings, isReady } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const translateY = useSharedValue(0);
  const chevronOpacity = useSharedValue(0.4);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 15000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    chevronOpacity.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1200, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.3, { duration: 1200, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      true,
    );
  }, [chevronOpacity]);

  const goToLauncher = () => {
    router.replace('/launcher');
  };

  const gesture = Gesture.Pan()
    .onUpdate((e) => {
      if (e.translationY < 0) {
        translateY.value = e.translationY;
      }
    })
    .onEnd((e) => {
      if (e.translationY < -120 || e.velocityY < -600) {
        translateY.value = withTiming(-SCREEN_H, { duration: 300 }, () => {
          runOnJS(goToLauncher)();
        });
        runOnJS(fireHaptic)('strong', settings);
      } else {
        translateY.value = withSpring(0, { damping: 20, stiffness: 180 });
      }
    });

  const containerStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const chevronStyle = useAnimatedStyle(() => ({
    opacity: chevronOpacity.value,
  }));

  if (!isReady) {
    return <View style={{ flex: 1, backgroundColor: '#000' }} />;
  }

  const hh = now.getHours().toString().padStart(2, '0');
  const mm = now.getMinutes().toString().padStart(2, '0');
  const dateStr = now.toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={[styles.container, containerStyle]}>
        <AmbientWallpaper />

        <View
          style={[
            styles.content,
            { paddingTop: insets.top + 60, paddingBottom: insets.bottom + 40 },
          ]}
        >
          {/* Top status */}
          <View style={styles.statusRow}>
            <Text style={[styles.statusText, { color: skin.brand }]}>
              DIGITAL SHIELD
            </Text>
            <View style={styles.statusRight}>
              <Ionicons name="wifi" size={12} color={skin.onSurfaceMuted} />
              <Ionicons name="cellular" size={12} color={skin.onSurfaceMuted} />
              <Ionicons name="battery-full" size={14} color={skin.onSurfaceMuted} />
            </View>
          </View>

          {/* Clock */}
          <View style={styles.clockWrap}>
            <Text
              style={[
                styles.clock,
                {
                  color: skin.onSurface,
                  textShadowColor: skin.glow,
                },
              ]}
              testID="lock-clock"
            >
              {hh}
              <Text style={{ color: skin.brand }}>:</Text>
              {mm}
            </Text>
            <Text style={[styles.date, { color: skin.onSurfaceMuted }]}>
              {dateStr}
            </Text>
          </View>

          {/* Notification blurb */}
          <View
            style={[
              styles.notifCard,
              { backgroundColor: skin.surfaceSecondary + 'BB', borderColor: skin.border },
            ]}
          >
            <View
              style={[styles.notifDot, { backgroundColor: skin.brand, shadowColor: skin.glow }]}
            />
            <View style={{ flex: 1 }}>
              <Text style={[styles.notifTitle, { color: skin.onSurface }]}>
                System Ready
              </Text>
              <Text style={[styles.notifBody, { color: skin.onSurfaceMuted }]}>
                Swipe up to enter Digital Shield
              </Text>
            </View>
          </View>

          {/* Swipe-up affordance */}
          <Pressable
            onPress={goToLauncher}
            style={styles.swipeHint}
            testID="lock-unlock-btn"
          >
            <Animated.View style={chevronStyle}>
              <Ionicons name="chevron-up" size={30} color={skin.brand} />
              <Text style={[styles.swipeText, { color: skin.brand }]}>UNLOCK</Text>
            </Animated.View>
          </Pressable>

          {/* Corner shortcuts */}
          <View style={styles.cornerRow}>
            <View style={[styles.shortcut, { borderColor: skin.border }]}>
              <Ionicons name="flashlight" size={18} color={skin.onSurface} />
            </View>
            <View style={[styles.shortcut, { borderColor: skin.border }]}>
              <Ionicons name="camera" size={18} color={skin.onSurface} />
            </View>
          </View>
        </View>
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000000' },
  content: { flex: 1, paddingHorizontal: 24, justifyContent: 'space-between' },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusText: { fontSize: 10, letterSpacing: 3, fontWeight: '700' },
  statusRight: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  clockWrap: { alignItems: 'center', marginTop: 40 },
  clock: {
    fontSize: 92,
    fontWeight: '200',
    letterSpacing: 3,
    textShadowRadius: 22,
    textShadowOffset: { width: 0, height: 0 },
  },
  date: { fontSize: 15, marginTop: 4, letterSpacing: 2 },
  notifCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    gap: 12,
    marginTop: 40,
  },
  notifDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    shadowOpacity: 0.9,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 0 },
  },
  notifTitle: { fontSize: 13, fontWeight: '600' },
  notifBody: { fontSize: 12, marginTop: 2, letterSpacing: 0.4 },
  swipeHint: {
    alignSelf: 'center',
    alignItems: 'center',
    padding: 12,
  },
  swipeText: { fontSize: 10, letterSpacing: 3, fontWeight: '700', marginTop: 4 },
  cornerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  shortcut: {
    width: 46,
    height: 46,
    borderRadius: 23,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#00000044',
  },
});
