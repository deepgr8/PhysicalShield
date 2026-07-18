import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { DEFAULT_SKIN, getSkin, Skin, SkinId, SKINS } from './skins';

const STORAGE_KEYS = {
  activeSkin: '@ds/active-skin',
  unlockedSkins: '@ds/unlocked-skins',
  settings: '@ds/settings',
};

export interface AppSettings {
  hapticIntensity: 'off' | 'light' | 'medium' | 'strong';
  particleDensity: 'low' | 'medium' | 'high';
  animationSpeed: 'slow' | 'normal' | 'fast';
  soundsEnabled: boolean;
  vibrationEnabled: boolean;
}

const DEFAULT_SETTINGS: AppSettings = {
  hapticIntensity: 'medium',
  particleDensity: 'medium',
  animationSpeed: 'normal',
  soundsEnabled: true,
  vibrationEnabled: true,
};

interface ThemeContextValue {
  skin: Skin;
  activeSkinId: SkinId;
  unlockedSkins: SkinId[];
  settings: AppSettings;
  setSkin: (id: SkinId) => void;
  unlockSkin: (id: SkinId) => void;
  updateSettings: (patch: Partial<AppSettings>) => void;
  isReady: boolean;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [activeSkinId, setActiveSkinId] = useState<SkinId>(DEFAULT_SKIN);
  const [unlockedSkins, setUnlockedSkins] = useState<SkinId[]>([DEFAULT_SKIN]);
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const [savedSkin, savedUnlocked, savedSettings] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEYS.activeSkin),
          AsyncStorage.getItem(STORAGE_KEYS.unlockedSkins),
          AsyncStorage.getItem(STORAGE_KEYS.settings),
        ]);
        if (savedSkin) setActiveSkinId(savedSkin as SkinId);
        if (savedUnlocked) {
          const parsed = JSON.parse(savedUnlocked) as SkinId[];
          setUnlockedSkins(
            Array.from(new Set([DEFAULT_SKIN, ...parsed])),
          );
        }
        if (savedSettings) {
          setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(savedSettings) });
        }
      } catch {
        // ignore, fall back to defaults
      } finally {
        setIsReady(true);
      }
    })();
  }, []);

  const setSkin = useCallback((id: SkinId) => {
    setActiveSkinId(id);
    AsyncStorage.setItem(STORAGE_KEYS.activeSkin, id).catch(() => {});
  }, []);

  const unlockSkin = useCallback((id: SkinId) => {
    setUnlockedSkins((prev) => {
      if (prev.includes(id)) return prev;
      const next = [...prev, id];
      AsyncStorage.setItem(
        STORAGE_KEYS.unlockedSkins,
        JSON.stringify(next),
      ).catch(() => {});
      return next;
    });
  }, []);

  const updateSettings = useCallback((patch: Partial<AppSettings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...patch };
      AsyncStorage.setItem(
        STORAGE_KEYS.settings,
        JSON.stringify(next),
      ).catch(() => {});
      return next;
    });
  }, []);

  const value = useMemo<ThemeContextValue>(
    () => ({
      skin: getSkin(activeSkinId),
      activeSkinId,
      unlockedSkins,
      settings,
      setSkin,
      unlockSkin,
      updateSettings,
      isReady,
    }),
    [activeSkinId, unlockedSkins, settings, setSkin, unlockSkin, updateSettings, isReady],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}

export { SKINS };
