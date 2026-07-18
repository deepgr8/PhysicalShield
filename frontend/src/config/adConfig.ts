// AdMob configuration.
// Real ads only display in a native build with react-native-google-mobile-ads
// installed and configured. In Expo Go / preview we render a styled fake ad
// slot in the same footprint so the layout matches production.
//
// >>> REPLACE THESE VALUES WITH YOUR REAL ADMOB IDS BEFORE PUBLISHING <<<

export const ADMOB_CONFIG = {
  // App ID (from AdMob → App settings)
  androidAppId: 'YOUR_ADMOB_ANDROID_APP_ID_HERE',
  iosAppId: 'YOUR_ADMOB_IOS_APP_ID_HERE',

  // Individual ad unit IDs
  bannerAndroid: 'YOUR_ADMOB_BANNER_ANDROID_ID_HERE',
  bannerIos: 'YOUR_ADMOB_BANNER_IOS_ID_HERE',
  interstitialAndroid: 'YOUR_ADMOB_INTERSTITIAL_ANDROID_ID_HERE',
  interstitialIos: 'YOUR_ADMOB_INTERSTITIAL_IOS_ID_HERE',
  rewardedAndroid: 'YOUR_ADMOB_REWARDED_ANDROID_ID_HERE',
  rewardedIos: 'YOUR_ADMOB_REWARDED_IOS_ID_HERE',

  // Google-provided test IDs (safe to use during development)
  testBanner: 'ca-app-pub-3940256099942544/6300978111',
  testInterstitial: 'ca-app-pub-3940256099942544/1033173712',
  testRewarded: 'ca-app-pub-3940256099942544/5224354917',
};

// When true (Expo Go / no native build) the FakeAdBanner component renders
// a styled visual placeholder rather than attempting to load native ads.
export const USE_FAKE_AD_SLOT = true;
