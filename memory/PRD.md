# Digital Shield — Product Requirements

## Product summary
Digital Shield is a fake smartphone interaction simulator built as a
React Native / Expo app. The user pretends to use their phone by
interacting with a premium, animated OS-like interface. Nothing in the
app affects the device or its real applications.

## Goals
1. Provide a socially graceful way to "look busy" on a phone.
2. Deliver highly satisfying, tactile micro-interactions.
3. Look and feel like a premium futuristic OS, not a Material Design app.

## Non-goals
- Real launcher replacement.
- Real communications, calendar, or system control.
- Data collection beyond local device preferences.

## Core features (v1 — shipped)
- **Lock Screen** with clock, ambient wallpaper, swipe-up unlock.
- **Infinite Launcher** with 5 pages of fake apps, widgets, dock, and
  page indicators.
- **Notification Shade** with endlessly regenerating fake notifications
  and swipe-to-dismiss + particle explosion.
- **Focus Mode** — double-tap → interactive particle field driven by
  finger movement.
- **Skin Store** with 7 premium themes; non-default themes unlock via a
  simulated rewarded ad flow.
- **Settings** for haptics, particle density, animation speed, sound &
  vibration, purchases, privacy/terms/about.
- **Fake AdMob slot** in the launcher chrome; drop-in replaceable with
  `react-native-google-mobile-ads`.

## Future iterations (not in v1)
- Real AdMob integration (requires native build).
- Additional widgets (calendar, stocks, fitness rings).
- Interactive live wallpapers with react-native-skia shaders.
- Cloud-synced skin unlocks.

## Success metrics
- ≥ 30-second average session length.
- ≥ 3 skins unlocked per active user (rewarded ad engagement).
- Zero crashes in the interactive Focus Mode path.

## Compliance
Digital Shield is transparent about being a novelty utility, both on the
lock screen ("DIGITAL SHIELD" tag) and in the About panel. No permissions
are requested beyond storage for local preferences.
