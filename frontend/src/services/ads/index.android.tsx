// Real AdMob implementation for Android native builds.
// Metro resolves this file automatically when running Android.
// Never imported on iOS / web / Expo Go.

import React, { useEffect, useRef, useState } from 'react';
import { Platform, View } from 'react-native';
import mobileAds, {
  AdEventType,
  BannerAd,
  BannerAdSize,
  InterstitialAd,
  RewardedAd,
  RewardedAdEventType,
} from 'react-native-google-mobile-ads';
import { requestTrackingPermissionsAsync } from 'expo-tracking-transparency';

import { adUnitIDs } from '@/src/config/adConfig';

export const isAdsAvailable = true;

// One-time SDK initialization
let initialized = false;
export async function initializeAds(): Promise<void> {
  if (initialized) return;
  try {
    if (Platform.OS === 'ios') {
      await requestTrackingPermissionsAsync().catch(() => null);
    }
    await mobileAds().initialize();
    initialized = true;
  } catch {
    // If SDK init fails we silently no-op — ads simply won't render.
  }
}

// ---------------- Banner ----------------
interface BannerProps {
  style?: object;
}
export function RealBannerAd({ style }: BannerProps): React.ReactElement {
  return (
    <View style={style} testID="admob-banner-android">
      <BannerAd
        unitId={adUnitIDs.banner}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        requestOptions={{ requestNonPersonalizedAdsOnly: true }}
      />
    </View>
  );
}
export const REAL_BANNER_HEIGHT = 60;

// ---------------- Rewarded ----------------
export interface RewardedAdController {
  isReady: boolean;
  show: () => Promise<{ earned: boolean }>;
}

// One shared rewarded instance we reload after each show.
let rewardedInstance = RewardedAd.createForAdRequest(adUnitIDs.rewarded, {
  requestNonPersonalizedAdsOnly: true,
});

export function useRewardedAd(): RewardedAdController {
  const [isReady, setIsReady] = useState(false);
  const earnedRef = useRef(false);
  const resolveRef = useRef<((r: { earned: boolean }) => void) | null>(null);

  useEffect(() => {
    const offLoaded = rewardedInstance.addAdEventListener(
      RewardedAdEventType.LOADED,
      () => setIsReady(true),
    );
    const offEarned = rewardedInstance.addAdEventListener(
      RewardedAdEventType.EARNED_REWARD,
      () => {
        earnedRef.current = true;
      },
    );
    const offClosed = rewardedInstance.addAdEventListener(
      AdEventType.CLOSED,
      () => {
        const earned = earnedRef.current;
        earnedRef.current = false;
        resolveRef.current?.({ earned });
        resolveRef.current = null;
        // Reload for next viewing.
        setIsReady(false);
        rewardedInstance = RewardedAd.createForAdRequest(
          adUnitIDs.rewarded,
          { requestNonPersonalizedAdsOnly: true },
        );
        rewardedInstance.load();
      },
    );
    const offError = rewardedInstance.addAdEventListener(
      AdEventType.ERROR,
      () => {
        resolveRef.current?.({ earned: false });
        resolveRef.current = null;
        setIsReady(false);
      },
    );

    rewardedInstance.load();
    return () => {
      offLoaded();
      offEarned();
      offClosed();
      offError();
    };
  }, []);

  const show = async (): Promise<{ earned: boolean }> => {
    if (!isReady) return { earned: false };
    return new Promise((resolve) => {
      resolveRef.current = resolve;
      try {
        rewardedInstance.show();
      } catch {
        resolve({ earned: false });
        resolveRef.current = null;
      }
    });
  };

  return { isReady, show };
}

// ---------------- Interstitial ----------------
let interstitial = InterstitialAd.createForAdRequest(adUnitIDs.interstitial, {
  requestNonPersonalizedAdsOnly: true,
});
let interstitialReady = false;
interstitial.addAdEventListener(AdEventType.LOADED, () => {
  interstitialReady = true;
});
interstitial.addAdEventListener(AdEventType.CLOSED, () => {
  interstitialReady = false;
  interstitial = InterstitialAd.createForAdRequest(adUnitIDs.interstitial, {
    requestNonPersonalizedAdsOnly: true,
  });
  interstitial.load();
});
interstitial.load();

export async function showInterstitial(): Promise<void> {
  if (!interstitialReady) return;
  try {
    interstitial.show();
  } catch {
    // Best-effort — swallow if SDK not ready.
  }
}
