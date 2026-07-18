// Environment gate for AdMob native modules.
// react-native-google-mobile-ads throws "NativeModule not found" when imported
// under Expo Go or on Web — this helper prevents that.
//
// Additionally, per current product decision we ship ads on Android only;
// iOS falls back to the styled fake slot.

import { Platform } from 'react-native';
import Constants, { ExecutionEnvironment } from 'expo-constants';

export const isWeb = Platform.OS === 'web';
export const isExpoGo =
  Constants.executionEnvironment === ExecutionEnvironment.StoreClient;

// Only render / initialize AdMob in an Android native (dev or prod) build.
export const canRenderAds =
  !isWeb && !isExpoGo && Platform.OS === 'android';
