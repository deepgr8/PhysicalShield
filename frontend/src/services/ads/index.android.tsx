// Real AdMob implementation for Android native builds.
// Metro resolves this file automatically when running Android.
// Never imported on iOS / web / Expo Go.

import React, { useEffect, useRef, useState } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import mobileAds, {
  AdEventType,
  BannerAd,
  BannerAdSize,
  InterstitialAd,
  NativeAd,
  NativeAdEventType,
  NativeAdView,
  NativeAsset,
  NativeAssetType,
  NativeMediaView,
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


// ---------------- Native Ad ----------------
// Renders a compact native ad card designed to blend into a dark glass
// interface. Placed inline in the notification shade.

interface NativeAdCardProps {
  style?: object;
  accent?: string;
  surface?: string;
  onSurface?: string;
  onSurfaceMuted?: string;
}

export function NativeAdCard({
  style,
  accent = '#00E5FF',
  surface = '#0D1220',
  onSurface = '#FFFFFF',
  onSurfaceMuted = '#8B92A5',
}: NativeAdCardProps): React.ReactElement | null {
  const [ad, setAd] = useState<NativeAd | null>(null);

  useEffect(() => {
    let disposed = false;
    NativeAd.createForAdRequest(adUnitIDs.native, {
      requestNonPersonalizedAdsOnly: true,
    })
      .then((loaded) => {
        if (disposed) {
          loaded.destroy();
        } else {
          setAd(loaded);
        }
      })
      .catch(() => {
        // Ad failed to load — render nothing.
      });

    return () => {
      disposed = true;
    };
  }, []);

  useEffect(() => {
    if (!ad) return;
    const off = ad.addAdEventListener(NativeAdEventType.CLICKED, () => {
      // Optional: log clicks / analytics
    });
    return () => {
      off();
      ad.destroy();
    };
  }, [ad]);

  if (!ad) return null;

  return (
    <NativeAdView
      nativeAd={ad}
      style={[
        nativeStyles.card,
        {
          backgroundColor: surface,
          borderColor: `${accent}30`,
        },
        style,
      ]}
      testID="admob-native-card"
    >
      <View style={nativeStyles.header}>
        <View style={[nativeStyles.dot, { backgroundColor: accent }]} />
        <NativeAsset assetType={NativeAssetType.HEADLINE}>
          <Text
            numberOfLines={1}
            style={[nativeStyles.headline, { color: onSurface }]}
          >
            {ad.headline}
          </Text>
        </NativeAsset>
        <Text
          style={[
            nativeStyles.sponsoredBadge,
            { color: accent, borderColor: `${accent}55` },
          ]}
        >
          AD
        </Text>
      </View>

      {ad.body ? (
        <NativeAsset assetType={NativeAssetType.BODY}>
          <Text
            numberOfLines={2}
            style={[nativeStyles.body, { color: onSurfaceMuted }]}
          >
            {ad.body}
          </Text>
        </NativeAsset>
      ) : null}

      {ad.images && ad.images.length > 0 ? (
        <NativeMediaView style={nativeStyles.media} />
      ) : null}

      {ad.callToAction ? (
        <NativeAsset assetType={NativeAssetType.CALL_TO_ACTION}>
          <View
            style={[
              nativeStyles.cta,
              { borderColor: accent, backgroundColor: `${accent}22` },
            ]}
          >
            <Text style={[nativeStyles.ctaText, { color: accent }]}>
              {ad.callToAction.toUpperCase()}
            </Text>
          </View>
        </NativeAsset>
      ) : null}
    </NativeAdView>
  );
}

const nativeStyles = StyleSheet.create({
  card: {
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    gap: 6,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dot: { width: 8, height: 8, borderRadius: 4 },
  headline: { fontSize: 13, fontWeight: '600', flex: 1 },
  sponsoredBadge: {
    fontSize: 9,
    letterSpacing: 1.2,
    fontWeight: '700',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
  },
  body: { fontSize: 11, letterSpacing: 0.2 },
  media: {
    height: 120,
    borderRadius: 10,
    marginTop: 4,
    overflow: 'hidden',
  },
  cta: {
    alignSelf: 'flex-start',
    marginTop: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
  },
  ctaText: { fontSize: 10, letterSpacing: 1.8, fontWeight: '700' },
});
