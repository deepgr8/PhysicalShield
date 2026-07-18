import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { GlassCard } from '@/src/components/GlassCard';
import { useTheme } from '@/src/theme/ThemeContext';
import { fireHaptic } from '@/src/utils/haptics';

const TOGGLES = [
  { id: 'wifi',       icon: 'wifi',            label: 'Mesh',     initial: true },
  { id: 'bluetooth',  icon: 'bluetooth',       label: 'Link',     initial: true },
  { id: 'dnd',        icon: 'moon',            label: 'Focus',    initial: false },
  { id: 'torch',      icon: 'flashlight',      label: 'Beam',     initial: false },
  { id: 'airplane',   icon: 'airplane',        label: 'Sky',      initial: false },
  { id: 'battery',    icon: 'battery-charging',label: 'Cell',     initial: true },
] as const;

export function QuickSettingsWidget() {
  const { skin, settings } = useTheme();
  const [states, setStates] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(TOGGLES.map((t) => [t.id, t.initial])),
  );

  const toggle = (id: string) => {
    fireHaptic('selection', settings);
    setStates((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <GlassCard tintOpacity={0.06} style={styles.card}>
      <Text style={[styles.header, { color: skin.onSurfaceMuted }]}>QUICK CONTROLS</Text>
      <View style={styles.grid}>
        {TOGGLES.map((t) => {
          const on = states[t.id];
          return (
            <Pressable
              key={t.id}
              onPress={() => toggle(t.id)}
              style={[
                styles.tile,
                {
                  backgroundColor: on ? skin.brand : skin.surfaceTertiary,
                  borderColor: on ? skin.brand : skin.border,
                  shadowColor: skin.glow,
                  shadowOpacity: on ? 0.7 : 0,
                  shadowRadius: on ? 10 : 0,
                  shadowOffset: { width: 0, height: 0 },
                },
              ]}
              testID={`quick-toggle-${t.id}`}
            >
              <Ionicons
                name={t.icon as any}
                size={20}
                color={on ? '#000' : skin.onSurface}
              />
            </Pressable>
          );
        })}
      </View>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  card: {},
  header: { fontSize: 10, letterSpacing: 2, marginBottom: 12 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  tile: {
    width: 46,
    height: 46,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
