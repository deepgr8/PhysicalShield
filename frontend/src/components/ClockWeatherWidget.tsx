import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { GlassCard } from '@/src/components/GlassCard';
import { useTheme } from '@/src/theme/ThemeContext';

// A 4x2 glass widget block containing the large futuristic clock,
// date, and a compact weather summary. Time ticks live every 30s.
export function ClockWeatherWidget() {
  const { skin } = useTheme();
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 15000);
    return () => clearInterval(t);
  }, []);

  const hh = now.getHours().toString().padStart(2, '0');
  const mm = now.getMinutes().toString().padStart(2, '0');
  const dateStr = now.toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  return (
    <GlassCard glow style={styles.container} tintOpacity={0.08}>
      <View style={styles.row}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.time, { color: skin.onSurface, textShadowColor: skin.glow }]}>
            {hh}
            <Text style={{ color: skin.brand }}>:</Text>
            {mm}
          </Text>
          <Text style={[styles.date, { color: skin.onSurfaceMuted }]}>{dateStr}</Text>
        </View>
        <View style={styles.weatherCol}>
          <Ionicons name="partly-sunny" size={32} color={skin.brand} />
          <Text style={[styles.temp, { color: skin.onSurface }]}>21°</Text>
          <Text style={[styles.weatherLabel, { color: skin.onSurfaceMuted }]}>Clear · SF</Text>
        </View>
      </View>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  container: { minHeight: 132 },
  row: { flexDirection: 'row', alignItems: 'center' },
  time: {
    fontSize: 56,
    fontWeight: '300',
    letterSpacing: 2,
    textShadowRadius: 12,
    textShadowOffset: { width: 0, height: 0 },
  },
  date: { fontSize: 13, marginTop: 4, letterSpacing: 1 },
  weatherCol: { alignItems: 'center', paddingLeft: 12 },
  temp: { fontSize: 22, fontWeight: '600', marginTop: 4 },
  weatherLabel: { fontSize: 11, marginTop: 2, letterSpacing: 0.6 },
});
