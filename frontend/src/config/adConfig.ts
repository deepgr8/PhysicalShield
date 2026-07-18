// AdMob configuration — Android-only integration.
// iOS keeps the styled fake ad slot per user preference.

import { Platform } from 'react-native';

// -------- Google-provided TEST ad unit IDs (never remove) --------
// Safe to click, never earn revenue, prevent AdMob account bans.
const TEST_IDS = {
  banner: 'ca-app-pub-3940256099942544/6300978111',
  interstitial: 'ca-app-pub-3940256099942544/1033173712',
  rewarded: 'ca-app-pub-3940256099942544/5224354917',
  native: 'ca-app-pub-3940256099942544/2247696110',
};

// -------- Live Android ad unit IDs --------
// Banner, Native, and Rewarded are the real production units from your
// AdMob console (publisher ca-app-pub-5626622356708517).
// Interstitial is not yet created in your console, so it falls back to
// Google's test ID — the app currently never triggers an interstitial
// anyway (no folder-open flow is implemented).
const PROD_ANDROID_IDS = {
  banner: 'ca-app-pub-5626622356708517/4259340010',
  interstitial: TEST_IDS.interstitial,
  rewarded: 'ca-app-pub-5626622356708517/3972253769',
  native: 'ca-app-pub-5626622356708517/8099201038',
};

// Development uses Google's test IDs. Production uses your real Android IDs.
// iOS never resolves to real IDs — the ad service short-circuits on iOS.
export const adUnitIDs = __DEV__
  ? TEST_IDS
  : Platform.OS === 'android'
  ? PROD_ANDROID_IDS
  : TEST_IDS;
