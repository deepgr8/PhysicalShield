// Skin/Theme definitions for Digital Shield.
// Every skin is dark AMOLED with a distinctive neon accent color.
// Users unlock skins via rewarded ads (mocked in Expo Go).

export type SkinId =
  | 'cyber-blue'
  | 'matrix-green'
  | 'neon-purple'
  | 'glass-white'
  | 'amber'
  | 'dark-red'
  | 'gold';

export interface Skin {
  id: SkinId;
  name: string;
  tagline: string;
  brand: string;         // primary neon
  brandSecondary: string;
  borderStrong: string;  // 50% alpha of brand
  border: string;        // 20% alpha of brand
  glow: string;          // used as shadowColor
  surface: string;
  surfaceSecondary: string;
  surfaceTertiary: string;
  onSurface: string;
  onSurfaceMuted: string;
  wallpaperGradient: readonly [string, string, string];
  locked: boolean;
}

export const SKINS: Skin[] = [
  {
    id: 'cyber-blue',
    name: 'Cyber Blue',
    tagline: 'The signature neural interface',
    brand: '#00E5FF',
    brandSecondary: '#0091EA',
    borderStrong: '#00E5FF80',
    border: '#00E5FF30',
    glow: '#00E5FF',
    surface: '#05050A',
    surfaceSecondary: '#0D1220',
    surfaceTertiary: '#141B2E',
    onSurface: '#FFFFFF',
    onSurfaceMuted: '#8B92A5',
    wallpaperGradient: ['#000010', '#001a2e', '#000010'] as const,
    locked: false,
  },
  {
    id: 'matrix-green',
    name: 'Matrix Green',
    tagline: 'The code beneath reality',
    brand: '#00FF66',
    brandSecondary: '#00C853',
    borderStrong: '#00FF6680',
    border: '#00FF6630',
    glow: '#00FF66',
    surface: '#03080A',
    surfaceSecondary: '#0A1A12',
    surfaceTertiary: '#0F2418',
    onSurface: '#E0FFEA',
    onSurfaceMuted: '#7FA890',
    wallpaperGradient: ['#000000', '#001a0a', '#000000'] as const,
    locked: true,
  },
  {
    id: 'neon-purple',
    name: 'Neon Purple',
    tagline: 'Ultraviolet dreamstate',
    brand: '#B026FF',
    brandSecondary: '#7C4DFF',
    borderStrong: '#B026FF80',
    border: '#B026FF30',
    glow: '#B026FF',
    surface: '#080410',
    surfaceSecondary: '#180B24',
    surfaceTertiary: '#221030',
    onSurface: '#F4E0FF',
    onSurfaceMuted: '#9A7FB5',
    wallpaperGradient: ['#0a0014', '#1a002e', '#0a0014'] as const,
    locked: true,
  },
  {
    id: 'glass-white',
    name: 'Glass White',
    tagline: 'Pure minimal light',
    brand: '#F0F5FF',
    brandSecondary: '#C7D2FF',
    borderStrong: '#F0F5FF80',
    border: '#F0F5FF30',
    glow: '#FFFFFF',
    surface: '#0A0A0F',
    surfaceSecondary: '#141420',
    surfaceTertiary: '#1E1E2E',
    onSurface: '#FFFFFF',
    onSurfaceMuted: '#B0B5C9',
    wallpaperGradient: ['#050508', '#101020', '#050508'] as const,
    locked: true,
  },
  {
    id: 'amber',
    name: 'Amber',
    tagline: 'Sunlit vintage terminal',
    brand: '#FFB300',
    brandSecondary: '#FF8F00',
    borderStrong: '#FFB30080',
    border: '#FFB30030',
    glow: '#FFB300',
    surface: '#0A0705',
    surfaceSecondary: '#1A130A',
    surfaceTertiary: '#241A10',
    onSurface: '#FFF2E0',
    onSurfaceMuted: '#B59A7F',
    wallpaperGradient: ['#0a0500', '#1f1200', '#0a0500'] as const,
    locked: true,
  },
  {
    id: 'dark-red',
    name: 'Dark Red',
    tagline: 'Sovereign crimson protocol',
    brand: '#FF003C',
    brandSecondary: '#C40027',
    borderStrong: '#FF003C80',
    border: '#FF003C30',
    glow: '#FF003C',
    surface: '#0A0305',
    surfaceSecondary: '#1A0810',
    surfaceTertiary: '#240F18',
    onSurface: '#FFE0E5',
    onSurfaceMuted: '#B57F8A',
    wallpaperGradient: ['#0a0005', '#1f0010', '#0a0005'] as const,
    locked: true,
  },
  {
    id: 'gold',
    name: 'Gold',
    tagline: 'Alloy of the elite tier',
    brand: '#FFD700',
    brandSecondary: '#FFA000',
    borderStrong: '#FFD70080',
    border: '#FFD70030',
    glow: '#FFD700',
    surface: '#0A0805',
    surfaceSecondary: '#1A140A',
    surfaceTertiary: '#241C10',
    onSurface: '#FFFBE0',
    onSurfaceMuted: '#B5A87F',
    wallpaperGradient: ['#0a0700', '#1f1500', '#0a0700'] as const,
    locked: true,
  },
];

export const DEFAULT_SKIN: SkinId = 'cyber-blue';

export const getSkin = (id: SkinId): Skin =>
  SKINS.find((s) => s.id === id) ?? SKINS[0];
