import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
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
import { useTheme } from '@/src/theme/ThemeContext';
import { fireHaptic } from '@/src/utils/haptics';

const { height: SCREEN_H, width: SCREEN_W } = Dimensions.get('window');

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
  const translateY = useSharedValue(-SCREEN_H);
  const [items, setItems] = useState<FakeNotification[]>(() => makeNotifications(6));

  useEffect(() => {
    translateY.value = withSpring(open ? 0 : -SCREEN_H, {
      damping: 22,
      stiffness: 180,
    });
    if (open) fireHaptic('strong', settings);
  }, [open, translateY, settings]);

  const overlayStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const dismissItem = useCallback(
    (id: string) => {
      fireHaptic('success', settings);
      setItems((prev) => {
        const next = prev.filter((n) => n.id !== id);
        // auto-regenerate to keep the panel feeling endless
        return [...next, makeNotification()];
      });
    },
    [settings],
  );

  const clearAll = useCallback(() => {
    fireHaptic('medium', settings);
    setItems(makeNotifications(6));
  }, [settings]);

  // Pull-to-close on the top handle
  const closeGesture = Gesture.Pan()
    .onUpdate((e) => {
      if (e.translationY < 0) {
        translateY.value = Math.max(-SCREEN_H, e.translationY);
      }
    })
    .onEnd((e) => {
      if (e.translationY < -80 || e.velocityY < -400) {
        translateY.value = withTiming(-SCREEN_H, { duration: 220 }, () => {
          runOnJS(onClose)();
        });
      } else {
        translateY.value = withSpring(0, { damping: 22, stiffness: 180 });
      }
    });

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

  const shadeContent = useMemo(
    () => (
      <>
        <View style={styles.header}>
          <View>
            <Text style={[styles.time, { color: skin.onSurface }]}>{timeStr}</Text>
            <Text style={[styles.date, { color: skin.onSurfaceMuted }]}>{dateStr}</Text>
          </View>
          <Pressable
            onPress={clearAll}
            style={[styles.clearBtn, { borderColor: skin.border }]}
            testID="notif-clear-all"
          >
            <Text style={[styles.clearText, { color: skin.brand }]}>CLEAR</Text>
          </Pressable>
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

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 60 }}
        >
          {items.map((n) => (
            <NotificationRow
              key={n.id}
              notif={n}
              onDismiss={() => dismissItem(n.id)}
            />
          ))}
        </ScrollView>
      </>
    ),
    [items, skin, timeStr, dateStr, clearAll, dismissItem],
  );

  return (
    <Animated.View
      pointerEvents={open ? 'auto' : 'none'}
      style={[
        StyleSheet.absoluteFillObject,
        { zIndex: 100 },
        overlayStyle,
      ]}
    >
      {Platform.OS !== 'web' ? (
        <BlurView intensity={70} tint="dark" style={StyleSheet.absoluteFillObject} />
      ) : (
        <View
          style={[
            StyleSheet.absoluteFillObject,
            { backgroundColor: 'rgba(5,5,10,0.92)' },
          ]}
        />
      )}
      <View
        style={[
          StyleSheet.absoluteFillObject,
          { backgroundColor: `${skin.brand}0A` },
        ]}
      />
      <View style={[styles.container]}>{shadeContent}</View>

      <GestureDetector gesture={closeGesture}>
        <View style={styles.handleZone}>
          <View style={[styles.handle, { backgroundColor: skin.borderStrong }]} />
        </View>
      </GestureDetector>

      <Pressable
        onPress={onClose}
        style={styles.backdropTap}
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
  const tx = useSharedValue(0);
  const opacity = useSharedValue(1);
  const [particles, setParticles] = useState<{ x: number; y: number }[]>([]);

  const emitParticles = () => {
    const bursts = Array.from({ length: 10 }, () => ({
      x: (Math.random() - 0.5) * 200,
      y: (Math.random() - 0.5) * 80,
    }));
    setParticles(bursts);
    setTimeout(() => setParticles([]), 500);
  };

  const gesture = Gesture.Pan()
    .onUpdate((e) => {
      tx.value = e.translationX;
    })
    .onEnd((e) => {
      if (Math.abs(e.translationX) > SCREEN_W * 0.35) {
        tx.value = withTiming(e.translationX > 0 ? SCREEN_W : -SCREEN_W, {
          duration: 180,
        });
        opacity.value = withTiming(0, { duration: 180 }, () => {
          runOnJS(onDismiss)();
        });
        runOnJS(emitParticles)();
        runOnJS(fireHaptic)('success', settings);
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
          <View
            style={[
              styles.notifIcon,
              {
                backgroundColor: `${notif.color}20`,
                borderColor: `${notif.color}80`,
              },
            ]}
          >
            <Ionicons name={notif.icon as any} size={18} color={notif.color} />
          </View>
          <View style={{ flex: 1 }}>
            <View style={styles.notifTitleRow}>
              <Text style={[styles.notifApp, { color: notif.color }]}>{notif.app}</Text>
              <Text style={[styles.notifTime, { color: skin.onSurfaceMuted }]}>
                {notif.time}
              </Text>
            </View>
            <Text style={[styles.notifTitle, { color: skin.onSurface }]}>
              {notif.title}
            </Text>
            <Text
              style={[styles.notifBody, { color: skin.onSurfaceMuted }]}
              numberOfLines={2}
            >
              {notif.body}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 20,
  },
  time: { fontSize: 44, fontWeight: '300', letterSpacing: 1 },
  date: { fontSize: 13, letterSpacing: 1, marginTop: 2 },
  clearBtn: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
  },
  clearText: { fontSize: 10, letterSpacing: 2, fontWeight: '600' },
  quickRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 22,
  },
  quickTile: {
    width: 46,
    height: 46,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 0 },
  },
  sectionLabel: { fontSize: 10, letterSpacing: 2, marginBottom: 10 },
  rowWrap: {
    position: 'relative',
    marginBottom: 10,
    alignItems: 'center',
  },
  notifRow: {
    flexDirection: 'row',
    padding: 14,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'flex-start',
    gap: 12,
    width: '100%',
  },
  notifIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notifTitleRow: { flexDirection: 'row', justifyContent: 'space-between' },
  notifApp: { fontSize: 11, fontWeight: '600', letterSpacing: 1.2 },
  notifTime: { fontSize: 11, letterSpacing: 0.6 },
  notifTitle: { fontSize: 14, fontWeight: '600', marginTop: 2 },
  notifBody: { fontSize: 12, marginTop: 3, letterSpacing: 0.3 },
  particle: {
    position: 'absolute',
    width: 4,
    height: 4,
    borderRadius: 2,
    top: '50%',
    left: '50%',
  },
  handleZone: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 44,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 8,
  },
  handle: {
    width: 60,
    height: 4,
    borderRadius: 2,
    opacity: 0.6,
  },
  backdropTap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 40,
  },
});
