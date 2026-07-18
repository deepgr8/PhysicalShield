# Digital Shield

**A premium fake smartphone interaction simulator.**

Digital Shield is *not* a launcher and *does not* control any real apps or
data on your device. It is a satisfying, animated UI toy that lets people
pretend to interact with a smartphone in social situations they'd rather
opt out of. Every icon is decorative, every notification is generated on
device, and no personal information ever leaves the app.

---

## Highlights

- **Infinite Launcher** — swipe horizontally through 5 themed pages, each
  scrollable vertically. Widgets, folders, and 30+ fake icons.
- **Lock Screen** — AMOLED lock screen with an ambient wallpaper, giant
  clock, notification preview, and swipe-up to enter the launcher.
- **Notification Shade** — pull-down glass panel with quick toggles and
  endlessly-regenerating fake system notifications. Swipe to dismiss →
  particle burst + haptic pop.
- **Focus Mode (Fidget Playground)** — double-tap anywhere on the launcher
  to enter a pitch-black interactive particle canvas. Finger movement
  spawns glowing particles + haptic feedback.
- **7 Premium Skins** — Cyber Blue (default), Matrix Green, Neon Purple,
  Glass White, Amber, Dark Red, Gold. Non-default skins unlock via a
  simulated rewarded ad.
- **Fake AdMob Slot** — bottom-anchored banner slot integrated into the
  launcher chrome. Replace with `react-native-google-mobile-ads` in a
  native build to serve real ads.
- **Widgets** — glassmorphic clock+weather, animated music player, quick
  settings tiles.
- **Settings** — haptic intensity, particle density, animation speed,
  sound & vibration toggles, restore purchases, privacy/terms links.

## Tech stack

React Native · Expo SDK 54 · TypeScript · Expo Router · Reanimated 3 ·
Gesture Handler · Expo Blur · Linear Gradient · Ionicons · AsyncStorage.

Originally spec'd for Flutter — this Expo build mirrors the same UX and
architecture in the platform this environment supports.

## Project layout

```
frontend/
├── app/                 # Expo Router file-based routes
│   ├── _layout.tsx      # Providers (theme, gesture root, safe area)
│   ├── index.tsx        # Lock screen (entry)
│   ├── launcher.tsx     # Infinite launcher
│   ├── settings.tsx     # Settings screen
│   └── skins.tsx        # Skin store
└── src/
    ├── components/      # Reusable UI (widgets, shade, focus mode, ...)
    ├── config/          # adConfig.ts — AdMob IDs
    ├── data/            # Fake app + notification datasets
    ├── hooks/           # use-icon-fonts
    ├── theme/           # Skin definitions + ThemeContext
    └── utils/           # storage, haptics
```

## AdMob setup

All AdMob configuration lives in `src/config/adConfig.ts`. Placeholder IDs
are clearly marked with `YOUR_ADMOB_*_HERE`.

In Expo Go / preview we render a styled fake ad slot in the same footprint
as the real banner (`FakeAdBanner.tsx`). To ship real ads:

1. Set `USE_FAKE_AD_SLOT = false` in `src/config/adConfig.ts`.
2. Install `react-native-google-mobile-ads` in a native build.
3. Replace the fake banner's inner view with `<BannerAd />` using the
   platform-appropriate ad unit ID.
4. Wire the "Unlock" flow in `app/skins.tsx` to `RewardedAd` instead of
   the simulated 5-second countdown.

## Running

The app runs automatically via Expo (`supervisor` service `expo`).
Open the preview URL or scan the QR shown by `expo start` with Expo Go.

## Gestures cheat sheet

| Gesture | Screen | Effect |
|---|---|---|
| Swipe up | Lock screen | Enter launcher |
| Swipe left/right | Launcher | Change page |
| Swipe down from top / tap ↓ | Launcher | Open notification shade |
| Swipe up on shade | Shade | Close |
| Swipe left/right on notification | Shade | Dismiss + particle burst |
| Double-tap | Launcher | Enter Focus Mode |
| Drag inside Focus | Focus Mode | Spawn particles |
| Double-tap or tap ✕ | Focus Mode | Exit |
| Long-press icon | Launcher | Bounce + neon glow |

## Ethics & App Store compliance

Digital Shield is transparent about what it is: a purely decorative UI
that never launches, receives, or displays real data. The lock screen
explicitly identifies the product ("DIGITAL SHIELD") and the About
section labels the app "Fake interaction simulator", satisfying both
Apple's and Google's disclosure requirements for satirical / novelty
utilities.
