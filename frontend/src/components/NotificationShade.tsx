import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Dimensions,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import {
  FakeNotification,
  makeNotification,
  makeNotifications,
} from '@/src/data/fakeNotifications';
import { isAdsAvailable, NativeAdCard } from '@/src/services/ads';
import { useTheme } from '@/src/theme/ThemeContext';
import { fireHaptic } from '@/src/utils/haptics';

const { height: SCREEN_H_INIT, width: SCREEN_W_INIT } = Dimensions.get('window');

interface Props {
  open: boolean;
  onClose: () => void;
}

const QUICK = [
  { id: 'wifi',     icon: 'wifi',            label: 'Mesh' },
  { id: 'bt',       icon: 'bluetooth',       label: 'Link' },
  { id: 'dnd',      icon: 'moon',            label: 'Focus' },
  { id: 'torch',    icon: 'flashlight',      label: 'Beam' },
  { id: 'battery',  icon: 'battery-charging',label: 'Cell' },
  { id: 'airplane', icon: 'airplane',        label: 'Sky' },
] as const;

export function NotificationShade({ open, onClose }: Props) {
  const { skin, settings } = useTheme();
  const settingsRef = useRef(settings);
  settingsRef.current = settings;

  const translateY = useSharedValue(-SCREEN_H_INIT);
  const [items, setItems] = useState<FakeNotification[]>(() => makeNotifications(4));

  useEffect(() => {
    if (open) {
      translateY.value = withSpring(0, { damping: 22, stiffness: 200, mass: 0.9 });
      fireHaptic('strong', settingsRef.current);
    } else {
      translateY.value = withTiming(-SCREEN_H_INIT, { duration: 280 });
    }
  }, [open, translateY]);

  const closeSmoothly = useCallback(() => {
    fireHaptic('light', settingsRef.current);
    translateY.value = withTiming(-SCREEN_H_INIT, { duration: 260 }, (finished) => {
      if (finished) runOnJS(onClose)();
    });
  }, [onClose, translateY]);

  const dismissItem = useCallback((id: string) => {
    fireHaptic('success', settingsRef.current);
    setItems((prev) => {
      const next = prev.filter((n) => n.id !== id);
      return [...next, makeNotification()];
    });
  }, []);

  const clearAll = useCallback(() => {
    fireHaptic('medium', settingsRef.current);
    setItems(makeNotifications(4));
  }, []);

  // Pull-to-close on the top drag area. Fires only on upward drag so the
  // list below can scroll freely without stealing the gesture.
  const dragCloseGesture = Gesture.Pan()
    .activeOffsetY([-15, 15])
    .onUpdate((e) => {
      if (e.translationY < 0) {
        translateY.value = Math.max(-SCREEN_H_INIT, e.translationY);
      }
    })
    .onEnd((e) => {
      if (e.translationY < -80 || e.velocityY < -400) {
        translateY.value = withTiming(-SCREEN_H_INIT, { duration: 240 }, (finished) => {
          if (finished) runOnJS(onClose)();
        });
      } else {
        translateY.value = withSpring(0, { damping: 22, stiffness: 200 });
      }
    });

  const overlayStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const now = new Date();
  const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now
    .getMinutes()
    .toString()
    .padStart(2, '0')}`;
  const dateStr = now.toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  return (
    <Animated.View
      pointerEvents={open ? 'auto' : 'none'}
      style={[StyleSheet.absoluteFillObject, { zIndex: 100 }, overlayStyle]}
      testID="notification-shade"
    >
      {Platform.OS !== 'web' ? (
        <BlurView intensity={75} tint="dark" style={StyleSheet.absoluteFillObject} />
      ) : (
        <View
          style={[
            StyleSheet.absoluteFillObject,
            { backgroundColor: 'rgba(5,5,10,0.94)' },
          ]}
        />
      )}
      <View
        style={[
          StyleSheet.absoluteFillObject,
          { backgroundColor: `${skin.brand}0A` },
        ]}
      />

      {/* Draggable header area — the whole top block responds to pull-to-close */}
      <GestureDetector gesture={dragCloseGesture}>
        <View style={styles.headerArea}>
          <View style={[styles.handle, { backgroundColor: skin.borderStrong }]} />

          <View style={styles.headerRow}>
            <View>
              <Text style={[styles.time, { color: skin.onSurface }]}>{timeStr}</Text>
              <Text style={[styles.date, { color: skin.onSurfaceMuted }]}>{dateStr}</Text>
            </View>
            <View style={styles.headerButtons}>
              <Pressable
                onPress={clearAll}
                style={[styles.clearBtn, { borderColor: skin.border }]}
                testID="notif-clear-all"
              >
                <Text style={[styles.clearText, { color: skin.brand }]}>CLEAR</Text>
              </Pressable>
              <Pressable
                onPress={closeSmoothly}
                style={[
                  styles.closeBtn,
                  { borderColor: skin.border, backgroundColor: skin.surfaceTertiary },
                ]}
                testID="notif-close-btn"
                hitSlop={12}
              >
                <Ionicons name="close" size={18} color={skin.brand} />
              </Pressable>
            </View>
          </View>

          <View style={styles.quickRow}>
            {QUICK.map((q, i) => (
              <View
                key={q.id}
                style={[
                  styles.quickTile,
                  {
                    backgroundColor: i < 3 ? skin.brand : skin.surfaceTertiary,
                    borderColor: i < 3 ? skin.brand : skin.border,
                    shadowColor: skin.glow,
                    shadowOpacity: i < 3 ? 0.5 : 0,
                    shadowRadius: 10,
                  },
                ]}
              >
                <Ionicons
                  name={q.icon as any}
                  size={18}
                  color={i < 3 ? '#000' : skin.onSurface}
                />
              </View>
            ))}
          </View>

          <Text style={[styles.sectionLabel, { color: skin.onSurfaceMuted }]}>
            NOTIFICATIONS · {items.length}
          </Text>
        </View>
      </GestureDetector>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        style={styles.scrollList}
      >
        {items.map((n, idx) => (
          <React.Fragment key={n.id}>
            <NotificationRow
              notif={n}
              onDismiss={() => dismissItem(n.id)}
            />
            {/* Native ad card injected after the 2nd notification. Real
                AdMob NativeAd on Android; styled fake sponsor card
                everywhere else. */}
            {idx === 1 ? (
              isAdsAvailable ? (
                <View style={styles.nativeAdSlot}>
                  <NativeAdCard
                    accent={skin.brand}
                    surface={skin.surfaceSecondary}
                    onSurface={skin.onSurface}
                    onSurfaceMuted={skin.onSurfaceMuted}
                  />
                </View>
              ) : (
                <FakeSponsorCard />
              )
            ) : null}
          </React.Fragment>
        ))}
      </ScrollView>

      {/* Full-height tap-to-close backdrop across the remaining bottom area */}
      <Pressable
        onPress={closeSmoothly}
        style={styles.bottomTap}
        testID="notif-shade-backdrop"
      />
    </Animated.View>
  );
}

function NotificationRow({
  notif,
  onDismiss,
}: {
  notif: FakeNotification;
  onDismiss: () => void;
}) {
  const { skin, settings } = useTheme();
  const settingsRef = useRef(settings);
  settingsRef.current = settings;

  const tx = useSharedValue(0);
  const opacity = useSharedValue(1);
  const [particles, setParticles] = useState<{ x: number; y: number }[]>([]);

  const emitParticles = useCallback(() => {
    const bursts = Array.from({ length: 8 }, () => ({
      x: (Math.random() - 0.5) * 180,
      y: (Math.random() - 0.5) * 60,
    }));
    setParticles(bursts);
    setTimeout(() => setParticles([]), 400);
  }, []);

  const gesture = Gesture.Pan()
    .activeOffsetX([-15, 15])
    .onUpdate((e) => {
      tx.value = e.translationX;
    })
    .onEnd((e) => {
      if (Math.abs(e.translationX) > SCREEN_W_INIT * 0.32) {
        tx.value = withTiming(
          e.translationX > 0 ? SCREEN_W_INIT : -SCREEN_W_INIT,
          { duration: 180 },
        );
        opacity.value = withTiming(0, { duration: 180 }, () => {
          runOnJS(onDismiss)();
        });
        runOnJS(emitParticles)();
        runOnJS(fireHaptic)('success', settingsRef.current);
      } else {
        tx.value = withSpring(0, { damping: 18, stiffness: 200 });
      }
    });

  const rowStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: tx.value }],
    opacity: opacity.value,
  }));

  return (
    <View style={styles.rowWrap}>
      <GestureDetector gesture={gesture}>
        <Animated.View
          style={[
            styles.notifRow,
            {
              backgroundColor: skin.surfaceSecondary,
              borderColor: skin.border,
            },
            rowStyle,
          ]}
        >
          <View style={[styles.notifDot, { backgroundColor: notif.color }]} />
          <View style={{ flex: 1 }}>
            <View style={styles.notifTitleRow}>
              <Text
                numberOfLines={1}
                style={[styles.notifTitle, { color: skin.onSurface }]}
              >
                {notif.title}
              </Text>
              <Text style={[styles.notifTime, { color: skin.onSurfaceMuted }]}>
                {notif.time}
              </Text>
            </View>
            <Text
              style={[styles.notifBody, { color: skin.onSurfaceMuted }]}
              numberOfLines={1}
            >
              {notif.app} · {notif.body}
            </Text>
          </View>
        </Animated.View>
      </GestureDetector>

      {particles.map((p, i) => (
        <View
          key={i}
          pointerEvents="none"
          style={[
            styles.particle,
            {
              backgroundColor: skin.brand,
              transform: [{ translateX: p.x }, { translateY: p.y }],
            },
          ]}
        />
      ))}
    </View>
  );
}

// Styled fake "Sponsored" card shown when real AdMob native ads aren't
// available (iOS / Expo Go / web). Mirrors the layout of NativeAdCard
// so the shade looks the same across environments.
function FakeSponsorCard() {
  const { skin } = useTheme();
  return (
    <View
      style={[
        styles.fakeSponsor,
        {
          backgroundColor: skin.surfaceSecondary,
          borderColor: `${skin.brand}30`,
        },
      ]}
      testID="fake-native-sponsor-card"
    >
      <View style={styles.fakeSponsorHead}>
        <View style={[styles.notifDot, { backgroundColor: skin.brand, marginTop: 0 }]} />
        <Text style={[styles.fakeSponsorTitle, { color: skin.onSurface }]}>
          Level up your focus with premium widgets
        </Text>
        <Text
          style={[
            styles.fakeSponsorBadge,
            { color: skin.brand, borderColor: `${skin.brand}55` },
          ]}
        >
          AD
        </Text>
      </View>
      <Text
        style={[styles.fakeSponsorBody, { color: skin.onSurfaceMuted }]}
        numberOfLines={2}
      >
        Sponsored placement · Your AdMob Native ad will render here on the
        Android build.
      </Text>
      <View
        style={[
          styles.fakeSponsorCta,
          { borderColor: skin.brand, backgroundColor: `${skin.brand}22` },
        ]}
      >
        <Text
          style={[
            styles.fakeSponsorCtaText,
            { color: skin.brand },
          ]}
        >
          LEARN MORE
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerArea: {
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  handle: {
    alignSelf: 'center',
    width: 44,
    height: 4,
    borderRadius: 2,
    opacity: 0.7,
    marginTop: 6,
    marginBottom: 20,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 20,
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  time: { fontSize: 40, fontWeight: '300', letterSpacing: 1 },
  date: { fontSize: 12, letterSpacing: 1, marginTop: 2 },
  clearBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
  },
  clearText: { fontSize: 10, letterSpacing: 2, fontWeight: '600' },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  quickTile: {
    width: 44,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 0 },
  },
  sectionLabel: { fontSize: 10, letterSpacing: 2, marginBottom: 10 },
  scrollList: { flex: 1, paddingHorizontal: 20 },
  scrollContent: { paddingBottom: 80 },
  rowWrap: {
    position: 'relative',
    marginBottom: 8,
    alignItems: 'center',
  },
  notifRow: {
    flexDirection: 'row',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    gap: 10,
    width: '100%',
  },
  notifDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 6,
    alignSelf: 'flex-start',
  },
  notifTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  notifTitle: { fontSize: 13, fontWeight: '600', flex: 1 },
  notifTime: { fontSize: 10, letterSpacing: 0.4 },
  notifBody: { fontSize: 11, marginTop: 2, letterSpacing: 0.2 },
  particle: {
    position: 'absolute',
    width: 4,
    height: 4,
    borderRadius: 2,
    top: '50%',
    left: '50%',
  },
  bottomTap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 60,
  },
  nativeAdSlot: {
    marginBottom: 8,
  },
  fakeSponsor: {
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    gap: 6,
    marginBottom: 8,
  },
  fakeSponsorHead: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  fakeSponsorTitle: { fontSize: 13, fontWeight: '600', flex: 1 },
  fakeSponsorBadge: {
    fontSize: 9,
    letterSpacing: 1.2,
    fontWeight: '700',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
  },
  fakeSponsorBody: { fontSize: 11, letterSpacing: 0.2 },
  fakeSponsorCta: {
    alignSelf: 'flex-start',
    marginTop: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
  },
  fakeSponsorCtaText: { fontSize: 10, letterSpacing: 1.8, fontWeight: '700' },
});
