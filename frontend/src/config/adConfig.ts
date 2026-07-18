// AdMob configuration — Android-only integration.
// iOS keeps the styled fake ad slot per user preference.
//
// >>> ACTION REQUIRED BEFORE PUBLISHING <<<
//   1. Create the Android app entry + Ad Units in the AdMob console
//      (https://apps.admob.com) under publisher ca-app-pub-5626622356708517.
//   2. Paste the resulting numeric suffixes into the *_ANDROID_* constants
//      below AND into app.json → plugins → react-native-google-mobile-ads
//      → androidAppId.
//   3. Keep TEST_IDS.* intact — they are Google's public test IDs and are
//      used automatically while __DEV__ is true.

import { Platform } from 'react-native';

// -------- Google-provided TEST ad unit IDs (never remove) --------
// Safe to click, never earn revenue, prevent AdMob account bans.
const TEST_IDS = {
  banner: 'ca-app-pub-3940256099942544/6300978111',
  interstitial: 'ca-app-pub-3940256099942544/1033173712',
  rewarded: 'ca-app-pub-3940256099942544/5224354917',
};

// -------- YOUR production Android ad unit IDs --------
// Replace the "REPLACE_WITH_*" suffixes with the 10-digit slug shown in
// the AdMob console for each ad unit.
const PROD_ANDROID_IDS = {
  banner: 'ca-app-pub-5626622356708517/REPLACE_WITH_ANDROID_BANNER_ID',
  interstitial: 'ca-app-pub-5626622356708517/REPLACE_WITH_ANDROID_INTERSTITIAL_ID',
  rewarded: 'ca-app-pub-5626622356708517/REPLACE_WITH_ANDROID_REWARDED_ID',
};

// Development uses Google's test IDs. Production uses your real Android IDs.
// iOS never resolves to real IDs — see FakeAdBanner / RewardedAd guards.
export const adUnitIDs = __DEV__
  ? TEST_IDS
  : Platform.OS === 'android'
  ? PROD_ANDROID_IDS
  : TEST_IDS; // iOS never actually calls into ads today
