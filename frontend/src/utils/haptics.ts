import { Platform } from 'react-native';
import * as Haptics from 'expo-haptics';

import { AppSettings } from '@/src/theme/ThemeContext';

type HapticKind = 'light' | 'medium' | 'strong' | 'success' | 'warning' | 'error' | 'selection';

// Central haptic dispatcher — respects the user's intensity setting and
// gracefully no-ops on platforms without haptics.
export function fireHaptic(kind: HapticKind, settings: AppSettings) {
  if (!settings.vibrationEnabled) return;
  if (settings.hapticIntensity === 'off') return;

  // Scale down "strong" requests when user chose "light".
  const intensity = settings.hapticIntensity;
  const scaled: HapticKind =
    intensity === 'light' && (kind === 'medium' || kind === 'strong')
      ? 'light'
      : intensity === 'medium' && kind === 'strong'
      ? 'medium'
      : kind;

  try {
    if (Platform.OS === 'web') return;
    switch (scaled) {
      case 'light':
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        break;
      case 'medium':
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        break;
      case 'strong':
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        break;
      case 'success':
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        break;
      case 'warning':
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        break;
      case 'error':
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        break;
      case 'selection':
        Haptics.selectionAsync();
        break;
    }
  } catch {
    // swallow — haptics are best-effort
  }
}
