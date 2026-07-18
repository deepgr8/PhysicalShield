import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AmbientWallpaper } from '@/src/components/AmbientWallpaper';
import { GlassCard } from '@/src/components/GlassCard';
import { isAdsAvailable, useRewardedAd } from '@/src/services/ads';
import { SKINS, useTheme } from '@/src/theme/ThemeContext';
import { SkinId } from '@/src/theme/skins';
import { fireHaptic } from '@/src/utils/haptics';

// The Skin Store. Users unlock skins via a rewarded ad.
// - Android native build → real AdMob RewardedAd fires and, on reward
//   earned, we unlock + apply the target skin.
// - Elsewhere (iOS / Expo Go / web) → a simulated 5-second countdown modal
//   still lets users try the flow without native modules.
export default function Skins() {
  const {
    skin,
    activeSkinId,
    unlockedSkins,
    setSkin,
    unlockSkin,
    settings,
  } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const rewarded = useRewardedAd();
  const [adState, setAdState] = useState<
    | { open: false }
    | { open: true; target: SkinId; countdown: number }
  >({ open: false });

  const grantSkin = (target: SkinId) => {
    unlockSkin(target);
    setSkin(target);
    fireHaptic('success', settings);
  };

  const startRewardedAd = async (target: SkinId) => {
    fireHaptic('medium', settings);

    // Real AdMob path (Android native build with a ready-loaded ad).
    if (isAdsAvailable && rewarded.isReady) {
      const { earned } = await rewarded.show();
      if (earned) grantSkin(target);
      return;
    }

    // Fallback simulated flow — used on iOS / Expo Go / web, and also if
    // the real rewarded ad hasn't loaded in time.
    setAdState({ open: true, target, countdown: 5 });
    const startedAt = Date.now();
    const tick = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startedAt) / 1000);
      const remaining = 5 - elapsed;
      if (remaining <= 0) {
        clearInterval(tick);
        grantSkin(target);
        setAdState({ open: false });
      } else {
        setAdState({ open: true, target, countdown: remaining });
      }
    }, 250);
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#000' }}>
      <AmbientWallpaper />
      <View style={{ flex: 1, paddingTop: insets.top + 12, paddingBottom: insets.bottom }}>
        <View style={styles.header}>
          <Pressable
            onPress={() => router.back()}
            style={[styles.backBtn, { borderColor: skin.border }]}
            testID="skins-back-btn"
          >
            <Ionicons name="chevron-back" size={20} color={skin.brand} />
          </Pressable>
          <Text style={[styles.headerTitle, { color: skin.onSurface }]}>
            SKINS
          </Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView
          contentContainerStyle={{ padding: 16, gap: 14, paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
        >
          {SKINS.map((s) => {
            const isUnlocked = unlockedSkins.includes(s.id);
            const isActive = s.id === activeSkinId;
            return (
              <GlassCard
                key={s.id}
                tintOpacity={0.04}
                glow={isActive}
                style={styles.card}
              >
                <LinearGradient
                  colors={s.wallpaperGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.preview}
                >
                  <View
                    style={[
                      styles.previewOrb,
                      {
                        backgroundColor: s.brand,
                        shadowColor: s.brand,
                      },
                    ]}
                  />
                  <View
                    style={[
                      styles.previewOrbSmall,
                      {
                        backgroundColor: s.brandSecondary,
                        shadowColor: s.brandSecondary,
                      },
                    ]}
                  />
                </LinearGradient>

                <View style={styles.body}>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.name, { color: skin.onSurface }]}>
                      {s.name}
                    </Text>
                    <Text style={[styles.tag, { color: skin.onSurfaceMuted }]}>
                      {s.tagline}
                    </Text>
                  </View>

                  {!isUnlocked ? (
                    <Pressable
                      onPress={() => startRewardedAd(s.id)}
                      style={[styles.pill, { borderColor: s.brand, backgroundColor: s.brand + '22' }]}
                      testID={`unlock-${s.id}`}
                    >
                      <Ionicons name="play" size={12} color={s.brand} />
                      <Text style={[styles.pillText, { color: s.brand }]}>
                        UNLOCK
                      </Text>
                    </Pressable>
                  ) : isActive ? (
                    <View
                      style={[
                        styles.pill,
                        { borderColor: s.brand, backgroundColor: s.brand },
                      ]}
                      testID={`active-${s.id}`}
                    >
                      <Ionicons name="checkmark" size={12} color="#000" />
                      <Text style={[styles.pillText, { color: '#000' }]}>
                        ACTIVE
                      </Text>
                    </View>
                  ) : (
                    <Pressable
                      onPress={() => {
                        fireHaptic('medium', settings);
                        setSkin(s.id);
                      }}
                      style={[
                        styles.pill,
                        { borderColor: s.brand, backgroundColor: 'transparent' },
                      ]}
                      testID={`apply-${s.id}`}
                    >
                      <Text style={[styles.pillText, { color: s.brand }]}>
                        APPLY
                      </Text>
                    </Pressable>
                  )}
                </View>
              </GlassCard>
            );
          })}

          <Text style={[styles.footer, { color: skin.onSurfaceMuted }]}>
            Skins unlock via rewarded ads. In native builds this simulation
            hooks into your AdMob rewarded ad unit.
          </Text>
        </ScrollView>
      </View>

      {/* Rewarded Ad simulator modal */}
      <Modal visible={adState.open} transparent animationType="fade">
        <View style={styles.adBackdrop}>
          <View style={[styles.adBox, { borderColor: skin.border, backgroundColor: skin.surfaceSecondary }]}>
            <Text style={[styles.adTag, { color: skin.brand }]}>REWARDED AD</Text>
            <Text style={[styles.adTitle, { color: skin.onSurface }]}>
              Watch to unlock skin
            </Text>
            <View
              style={[
                styles.adPreview,
                { borderColor: skin.border, backgroundColor: '#000' },
              ]}
            >
              <Ionicons name="film" size={40} color={skin.brand} />
              <Text style={[styles.adPreviewText, { color: skin.onSurfaceMuted }]}>
                AdMob rewarded video · sample
              </Text>
            </View>
            <Text style={[styles.adCountdown, { color: skin.brand }]}>
              Reward in {adState.open ? adState.countdown : 0}s
            </Text>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 8,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: { fontSize: 12, letterSpacing: 4, fontWeight: '700' },
  card: { padding: 0, overflow: 'hidden' },
  preview: {
    height: 110,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 20,
  },
  previewOrb: {
    width: 60,
    height: 60,
    borderRadius: 30,
    shadowOpacity: 0.9,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 0 },
  },
  previewOrbSmall: {
    width: 32,
    height: 32,
    borderRadius: 16,
    shadowOpacity: 0.8,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 0 },
  },
  body: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  name: { fontSize: 17, fontWeight: '600', letterSpacing: 0.6 },
  tag: { fontSize: 11, marginTop: 3, letterSpacing: 0.5 },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  pillText: { fontSize: 10, letterSpacing: 1.5, fontWeight: '700' },
  footer: {
    fontSize: 11,
    textAlign: 'center',
    letterSpacing: 0.4,
    marginTop: 6,
    paddingHorizontal: 12,
  },
  adBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  adBox: {
    width: '100%',
    borderRadius: 20,
    borderWidth: 1,
    padding: 22,
    alignItems: 'center',
    gap: 12,
  },
  adTag: { fontSize: 10, letterSpacing: 3, fontWeight: '700' },
  adTitle: { fontSize: 18, fontWeight: '600' },
  adPreview: {
    width: '100%',
    height: 160,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  adPreviewText: { fontSize: 11, letterSpacing: 0.6 },
  adCountdown: { fontSize: 13, fontWeight: '700', letterSpacing: 1.5 },
});
