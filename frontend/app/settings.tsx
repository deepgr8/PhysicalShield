import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AmbientWallpaper } from '@/src/components/AmbientWallpaper';
import { GlassCard } from '@/src/components/GlassCard';
import { AppSettings, useTheme } from '@/src/theme/ThemeContext';
import { fireHaptic } from '@/src/utils/haptics';

type Option<T> = { value: T; label: string };

interface SegmentedProps<T extends string> {
  value: T;
  options: Option<T>[];
  onChange: (v: T) => void;
  testID?: string;
}

function Segmented<T extends string>({
  value,
  options,
  onChange,
  testID,
}: SegmentedProps<T>) {
  const { skin, settings } = useTheme();
  return (
    <View style={[styles.seg, { borderColor: skin.border }]} testID={testID}>
      {options.map((o) => {
        const on = o.value === value;
        return (
          <Pressable
            key={o.value}
            onPress={() => {
              fireHaptic('selection', settings);
              onChange(o.value);
            }}
            style={[
              styles.segOpt,
              {
                backgroundColor: on ? skin.brand : 'transparent',
                borderColor: on ? skin.brand : 'transparent',
              },
            ]}
            testID={`${testID}-${o.value}`}
          >
            <Text
              style={{
                color: on ? '#000' : skin.onSurfaceMuted,
                fontSize: 11,
                letterSpacing: 1,
                fontWeight: on ? '700' : '500',
              }}
            >
              {o.label.toUpperCase()}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

function ToggleRow({
  label,
  value,
  onChange,
  testID,
}: {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
  testID?: string;
}) {
  const { skin, settings } = useTheme();
  return (
    <View style={styles.row}>
      <Text style={[styles.rowLabel, { color: skin.onSurface }]}>{label}</Text>
      <Pressable
        onPress={() => {
          fireHaptic('selection', settings);
          onChange(!value);
        }}
        style={[
          styles.switch,
          {
            backgroundColor: value ? skin.brand : skin.surfaceTertiary,
            borderColor: value ? skin.brand : skin.border,
          },
        ]}
        testID={testID}
      >
        <View
          style={[
            styles.switchThumb,
            {
              backgroundColor: value ? '#000' : skin.onSurfaceMuted,
              transform: [{ translateX: value ? 18 : 0 }],
            },
          ]}
        />
      </Pressable>
    </View>
  );
}

export default function Settings() {
  const { skin, settings, updateSettings } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <View style={{ flex: 1, backgroundColor: '#000' }}>
      <AmbientWallpaper />
      <View
        style={{
          flex: 1,
          paddingTop: insets.top + 12,
          paddingBottom: insets.bottom,
        }}
      >
        {/* Header */}
        <View style={styles.header}>
          <Pressable
            onPress={() => router.back()}
            style={[styles.backBtn, { borderColor: skin.border }]}
            testID="settings-back-btn"
          >
            <Ionicons name="chevron-back" size={20} color={skin.brand} />
          </Pressable>
          <Text style={[styles.headerTitle, { color: skin.onSurface }]}>
            SETTINGS
          </Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView
          contentContainerStyle={{ padding: 16, paddingBottom: 40, gap: 16 }}
          showsVerticalScrollIndicator={false}
        >
          <GlassCard tintOpacity={0.05}>
            <Text style={[styles.sectionLabel, { color: skin.brand }]}>
              TACTILE
            </Text>
            <Text style={[styles.rowLabel, { color: skin.onSurface, marginTop: 12 }]}>
              Haptic intensity
            </Text>
            <Segmented<AppSettings['hapticIntensity']>
              value={settings.hapticIntensity}
              onChange={(v) => updateSettings({ hapticIntensity: v })}
              options={[
                { value: 'off', label: 'Off' },
                { value: 'light', label: 'Light' },
                { value: 'medium', label: 'Medium' },
                { value: 'strong', label: 'Strong' },
              ]}
              testID="seg-haptic"
            />
            <View style={{ height: 16 }} />
            <ToggleRow
              label="Vibration enabled"
              value={settings.vibrationEnabled}
              onChange={(v) => updateSettings({ vibrationEnabled: v })}
              testID="toggle-vibration"
            />
            <ToggleRow
              label="Sounds enabled"
              value={settings.soundsEnabled}
              onChange={(v) => updateSettings({ soundsEnabled: v })}
              testID="toggle-sounds"
            />
          </GlassCard>

          <GlassCard tintOpacity={0.05}>
            <Text style={[styles.sectionLabel, { color: skin.brand }]}>
              VISUAL
            </Text>
            <Text style={[styles.rowLabel, { color: skin.onSurface, marginTop: 12 }]}>
              Particle density
            </Text>
            <Segmented<AppSettings['particleDensity']>
              value={settings.particleDensity}
              onChange={(v) => updateSettings({ particleDensity: v })}
              options={[
                { value: 'low', label: 'Low' },
                { value: 'medium', label: 'Medium' },
                { value: 'high', label: 'High' },
              ]}
              testID="seg-particle"
            />
            <Text style={[styles.rowLabel, { color: skin.onSurface, marginTop: 16 }]}>
              Animation speed
            </Text>
            <Segmented<AppSettings['animationSpeed']>
              value={settings.animationSpeed}
              onChange={(v) => updateSettings({ animationSpeed: v })}
              options={[
                { value: 'slow', label: 'Slow' },
                { value: 'normal', label: 'Normal' },
                { value: 'fast', label: 'Fast' },
              ]}
              testID="seg-anim"
            />
          </GlassCard>

          <GlassCard tintOpacity={0.05}>
            <Text style={[styles.sectionLabel, { color: skin.brand }]}>
              PURCHASES
            </Text>
            <Pressable
              onPress={() => fireHaptic('medium', settings)}
              style={[styles.linkBtn, { borderColor: skin.border }]}
              testID="restore-purchases"
            >
              <Ionicons name="refresh" size={16} color={skin.brand} />
              <Text style={[styles.linkText, { color: skin.onSurface }]}>
                Restore purchases
              </Text>
            </Pressable>
          </GlassCard>

          <GlassCard tintOpacity={0.05}>
            <Text style={[styles.sectionLabel, { color: skin.brand }]}>ABOUT</Text>
            <View style={{ marginTop: 12, gap: 8 }}>
              <View style={styles.aboutRow}>
                <Text style={[styles.aboutLabel, { color: skin.onSurfaceMuted }]}>
                  App
                </Text>
                <Text style={[styles.aboutVal, { color: skin.onSurface }]}>
                  Digital Shield
                </Text>
              </View>
              <View style={styles.aboutRow}>
                <Text style={[styles.aboutLabel, { color: skin.onSurfaceMuted }]}>
                  Version
                </Text>
                <Text style={[styles.aboutVal, { color: skin.onSurface }]}>1.0.0</Text>
              </View>
              <View style={styles.aboutRow}>
                <Text style={[styles.aboutLabel, { color: skin.onSurfaceMuted }]}>
                  Purpose
                </Text>
                <Text
                  style={[styles.aboutVal, { color: skin.onSurface, flex: 1, textAlign: 'right' }]}
                  numberOfLines={2}
                >
                  Fake interaction simulator
                </Text>
              </View>
            </View>
            <View style={{ flexDirection: 'row', gap: 10, marginTop: 14 }}>
              <Pressable
                style={[styles.smallBtn, { borderColor: skin.border }]}
                onPress={() => fireHaptic('light', settings)}
                testID="btn-privacy"
              >
                <Text style={[styles.smallBtnText, { color: skin.brand }]}>Privacy</Text>
              </Pressable>
              <Pressable
                style={[styles.smallBtn, { borderColor: skin.border }]}
                onPress={() => fireHaptic('light', settings)}
                testID="btn-terms"
              >
                <Text style={[styles.smallBtnText, { color: skin.brand }]}>Terms</Text>
              </Pressable>
            </View>
          </GlassCard>
        </ScrollView>
      </View>
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
  sectionLabel: { fontSize: 10, letterSpacing: 3, fontWeight: '700' },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  rowLabel: { fontSize: 13, letterSpacing: 0.5 },
  seg: {
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 999,
    padding: 3,
    marginTop: 10,
    gap: 4,
  },
  segOpt: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
  },
  switch: {
    width: 44,
    height: 26,
    borderRadius: 13,
    borderWidth: 1,
    padding: 2,
    justifyContent: 'center',
  },
  switchThumb: { width: 18, height: 18, borderRadius: 9 },
  linkBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 12,
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  linkText: { fontSize: 13, letterSpacing: 0.4 },
  aboutRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  aboutLabel: { fontSize: 11, letterSpacing: 1 },
  aboutVal: { fontSize: 13, letterSpacing: 0.4, fontWeight: '600' },
  smallBtn: {
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
    flex: 1,
    alignItems: 'center',
  },
  smallBtnText: { fontSize: 11, letterSpacing: 2, fontWeight: '600' },
});
