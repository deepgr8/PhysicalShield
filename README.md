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

## AdMob (Android only)

`react-native-google-mobile-ads@16.4.0` is installed and Metro-split so the
native module **only loads on Android native builds**. iOS / Expo Go / web
render the styled fake ad slot in the same footprint — no crashes anywhere.

### Files
- `frontend/app.json` — `react-native-google-mobile-ads` config plugin with
  `androidAppId` (⚠️ **replace `REPLACE_WITH_ANDROID_APP_ID` before shipping**).
- `frontend/src/config/adConfig.ts` — Android ad unit IDs for banner /
  interstitial / rewarded. Publisher `ca-app-pub-5626622356708517` prefix is
  already baked in; replace the three `REPLACE_WITH_ANDROID_*_ID` suffixes.
- `frontend/src/services/ads/index.tsx` — safe no-op stubs used everywhere
  except Android.
- `frontend/src/services/ads/index.android.tsx` — real `mobileAds()`,
  `BannerAd`, `InterstitialAd`, `RewardedAd` wiring with preload + reload.

### Steps to go live (Android)
1. Create your Android app entry + Ad Units in the AdMob console:
   - Android App → note its `~XXXXXXXXXX` suffix.
   - Banner, Interstitial, Rewarded units → note each `/XXXXXXXXXX` suffix.
2. In `frontend/app.json`, replace `REPLACE_WITH_ANDROID_APP_ID` in the
   `androidAppId` field.
3. In `frontend/src/config/adConfig.ts`, replace the three suffixes in the
   `PROD_ANDROID_IDS` object.
4. Publish via Emergent's Publish button → generate the Android APK/AAB.
   Real ads only appear in this native build; the preview / Expo Go will
   keep showing the styled fake slot.

While `__DEV__` is true (including native dev-client builds) the Google
public test ad unit IDs are used automatically to prevent AdMob policy
violations. Never remove them.

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
