// AdMob configuration — Android-only integration.
// iOS keeps the styled fake ad slot per user preference.
//
// >>> ACTION REQUIRED BEFORE PUBLISHING <<<
//   Fill in your Android APP ID in app.json (plugins →
//   react-native-google-mobile-ads → androidAppId). Format:
//   `ca-app-pub-5626622356708517~XXXXXXXXXX`. Copy the "~XXXXXXXXXX"
//   suffix from AdMob → Apps → your Android app → "App ID".
//
// Without a valid App ID the Android build will crash on startup because
// the AdMob SDK requires it during initialization.

import { Platform } from 'react-native';

// -------- Google-provided TEST ad unit IDs (never remove) --------
// Safe to click, never earn revenue, prevent AdMob account bans.
const TEST_IDS = {
  banner: 'ca-app-pub-3940256099942544/6300978111',
  interstitial: 'ca-app-pub-3940256099942544/1033173712',
  rewarded: 'ca-app-pub-3940256099942544/5224354917',
  native: 'ca-app-pub-3940256099942544/2247696110',
};

// -------- Your production Android ad unit IDs --------
// Banner + Native are live in your AdMob console.
// Interstitial + Rewarded fall back to Google test IDs until you create
// those units in AdMob and paste their /XXXXXXXXXX slugs here.
const PROD_ANDROID_IDS = {
  banner: 'ca-app-pub-5626622356708517/4259340010',
  interstitial: TEST_IDS.interstitial, // TODO: replace when you create the unit
  rewarded: TEST_IDS.rewarded,         // TODO: replace when you create the unit
  native: 'ca-app-pub-5626622356708517/8099201038',
};

// Development uses Google's test IDs. Production uses your real Android IDs.
// iOS never resolves to real IDs — see FakeAdBanner / RewardedAd guards.
export const adUnitIDs = __DEV__
  ? TEST_IDS
  : Platform.OS === 'android'
  ? PROD_ANDROID_IDS
  : TEST_IDS;
