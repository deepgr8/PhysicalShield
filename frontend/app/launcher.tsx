import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import {
  Gesture,
  GestureDetector,
} from 'react-native-gesture-handler';
import {
  runOnJS,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AmbientWallpaper } from '@/src/components/AmbientWallpaper';
import { ClockWeatherWidget } from '@/src/components/ClockWeatherWidget';
import { FakeAdBanner } from '@/src/components/FakeAdBanner';
import { FakeIcon } from '@/src/components/FakeIcon';
import { FocusMode } from '@/src/components/FocusMode';
import { MusicWidget } from '@/src/components/MusicWidget';
import { NotificationShade } from '@/src/components/NotificationShade';
import { QuickSettingsWidget } from '@/src/components/QuickSettingsWidget';
import { FAKE_APPS } from '@/src/data/fakeApps';
import { useTheme } from '@/src/theme/ThemeContext';
import { fireHaptic } from '@/src/utils/haptics';

interface PageConfig {
  id: string;
  widgets: 'clock+music' | 'quick' | 'none';
  appStart: number;
  appCount: number;
}

// 5 pages of decorative content — feels endless without an actual infinite loop.
const PAGES: PageConfig[] = [
  { id: 'p0', widgets: 'clock+music', appStart: 0,  appCount: 8 },
  { id: 'p1', widgets: 'quick',       appStart: 8,  appCount: 12 },
  { id: 'p2', widgets: 'none',        appStart: 20, appCount: 12 },
  { id: 'p3', widgets: 'quick',       appStart: 4,  appCount: 12 },
  { id: 'p4', widgets: 'clock+music', appStart: 12, appCount: 8 },
];

const DOCK_APPS = ['phone', 'messages', 'browser', 'camera'];

export default function Launcher() {
  const { skin, settings } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { width: SCREEN_W } = useWindowDimensions();
  const [pageIndex, setPageIndex] = useState(0);
  const [shadeOpen, setShadeOpen] = useState(false);
  const [focusOpen, setFocusOpen] = useState(false);
  const listRef = useRef<FlatList<PageConfig>>(null);

  const onScroll = useCallback((e: any) => {
    const idx = Math.round(e.nativeEvent.contentOffset.x / SCREEN_W);
    if (idx !== pageIndex) {
      setPageIndex(idx);
      fireHaptic('light', settings);
    }
  }, [pageIndex, settings, SCREEN_W]);

  // top-edge pull → open shade
  const shadePull = useSharedValue(0);
  const topPullGesture = Gesture.Pan()
    .activeOffsetY([-10, 30])
    .onUpdate((e) => {
      if (e.translationY > 0) shadePull.value = e.translationY;
    })
    .onEnd((e) => {
      if (e.translationY > 90 || e.velocityY > 500) {
        runOnJS(setShadeOpen)(true);
      }
      shadePull.value = withSpring(0, { damping: 20 });
    });

  // double-tap on background → focus mode
  const doubleTap = Gesture.Tap()
    .numberOfTaps(2)
    .maxDelay(280)
    .onEnd(() => {
      runOnJS(setFocusOpen)(true);
    });

  const rootGesture = Gesture.Simultaneous(topPullGesture, doubleTap);

  const dockApps = useMemo(
    () => DOCK_APPS.map((id) => FAKE_APPS.find((a) => a.id === id)!).filter(Boolean),
    [],
  );

  const renderPage = useCallback(({ item }: { item: PageConfig }) => {
    const pageApps = FAKE_APPS.slice(
      item.appStart,
      item.appStart + item.appCount,
    );
    return (
      <View style={{ width: SCREEN_W, paddingHorizontal: 16 }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20, paddingTop: 8 }}
        >
          {item.widgets === 'clock+music' && (
            <View style={{ gap: 12, marginBottom: 20 }}>
              <ClockWeatherWidget />
              <MusicWidget />
            </View>
          )}
          {item.widgets === 'quick' && (
            <View style={{ marginBottom: 20 }}>
              <QuickSettingsWidget />
            </View>
          )}
          <View style={styles.iconGrid}>
            {pageApps.map((a) => (
              <FakeIcon key={a.id} app={a} testID={`app-${a.id}`} />
            ))}
          </View>
        </ScrollView>
      </View>
    );
  }, [SCREEN_W]);

  return (
    <View style={{ flex: 1, backgroundColor: '#000' }}>
      <AmbientWallpaper />

      <GestureDetector gesture={rootGesture}>
        <View style={{ flex: 1, paddingTop: insets.top }}>
          {/* Top status bar */}
          <View style={styles.topBar}>
            <Text style={[styles.topBarText, { color: skin.brand }]}>
              DIGITAL SHIELD
            </Text>
            <View style={styles.topBarRight}>
              <Pressable
                onPress={() => setShadeOpen(true)}
                style={styles.topPullBtn}
                testID="open-shade-btn"
              >
                <Ionicons name="chevron-down" size={16} color={skin.onSurfaceMuted} />
              </Pressable>
              <Pressable
                onPress={() => router.push('/skins')}
                testID="open-skins-btn"
                style={[styles.topIconBtn, { borderColor: skin.border }]}
              >
                <Ionicons name="color-palette" size={16} color={skin.brand} />
              </Pressable>
              <Pressable
                onPress={() => router.push('/settings')}
                testID="open-settings-btn"
                style={[styles.topIconBtn, { borderColor: skin.border }]}
              >
                <Ionicons name="settings-outline" size={16} color={skin.brand} />
              </Pressable>
            </View>
          </View>

          {/* Pager */}
          <FlatList
            ref={listRef}
            data={PAGES}
            renderItem={renderPage}
            keyExtractor={(item) => item.id}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={onScroll}
            style={{ flex: 1 }}
            windowSize={3}
          />

          {/* Page indicator */}
          <View style={styles.indicatorRow}>
            {PAGES.map((_, i) => (
              <View
                key={i}
                style={[
                  styles.indicatorDot,
                  {
                    backgroundColor:
                      i === pageIndex ? skin.brand : skin.onSurfaceMuted,
                    width: i === pageIndex ? 18 : 6,
                    shadowColor: skin.glow,
                    shadowOpacity: i === pageIndex ? 0.8 : 0,
                    shadowRadius: 6,
                    shadowOffset: { width: 0, height: 0 },
                  },
                ]}
              />
            ))}
          </View>

          {/* Dock */}
          <View
            style={[
              styles.dock,
              {
                backgroundColor: skin.surfaceSecondary + 'CC',
                borderColor: skin.border,
                marginHorizontal: 12,
                marginBottom: 6,
              },
            ]}
          >
            {dockApps.map((a) => (
              <FakeIcon
                key={a.id}
                app={a}
                size={54}
                fixedWidth={false}
                testID={`dock-${a.id}`}
              />
            ))}
          </View>

          {/* Fake ad slot */}
          <View style={{ paddingBottom: insets.bottom }}>
            <FakeAdBanner />
          </View>

          {/* Focus mode hint */}
          <View pointerEvents="none" style={styles.focusHint}>
            <Text style={[styles.focusHintText, { color: skin.onSurfaceMuted }]}>
              double-tap anywhere for focus mode
            </Text>
          </View>
        </View>
      </GestureDetector>

      <NotificationShade open={shadeOpen} onClose={() => setShadeOpen(false)} />
      <FocusMode visible={focusOpen} onExit={() => setFocusOpen(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  topBarText: { fontSize: 10, letterSpacing: 3, fontWeight: '700' },
  topBarRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  topPullBtn: { padding: 4 },
  topIconBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    rowGap: 16,
  },
  indicatorRow: {
    flexDirection: 'row',
    alignSelf: 'center',
    gap: 6,
    paddingVertical: 6,
  },
  indicatorDot: {
    height: 6,
    borderRadius: 3,
  },
  dock: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 12,
    borderRadius: 26,
    borderWidth: 1,
  },
  focusHint: {
    position: 'absolute',
    top: 44,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  focusHintText: {
    fontSize: 9,
    letterSpacing: 2,
    opacity: 0.7,
  },
});
