// Default (non-Android) ad service stubs.
// Metro's platform extensions pick up `index.android.ts` in an Android
// native build; everywhere else we return safe no-ops so importing this
// module in Expo Go / web / iOS never crashes.

import React from 'react';

export const isAdsAvailable = false;

export async function initializeAds(): Promise<void> {
  /* no-op */
}

interface BannerProps { style?: object }
export function RealBannerAd(_props: BannerProps): React.ReactElement | null {
  return null;
}
export const REAL_BANNER_HEIGHT = 0;

export interface RewardedAdController {
  isReady: boolean;
  show: () => Promise<{ earned: boolean }>;
}

export function useRewardedAd(): RewardedAdController {
  return {
    isReady: false,
    show: async () => ({ earned: false }),
  };
}

export async function showInterstitial(): Promise<void> {
  /* no-op */
}

interface NativeAdCardProps { style?: object }
export function NativeAdCard(_props: NativeAdCardProps): React.ReactElement | null {
  return null;
}
