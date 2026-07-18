// Fake app icons for the infinite launcher. Icons are decorative only —
// they never launch anything. Each app defines a display name, a vector
// icon glyph (Ionicons), and a two-color gradient used for the tile.

export interface FakeApp {
  id: string;
  name: string;
  icon: string;   // Ionicons name
  gradient: [string, string];
}

export const FAKE_APPS: FakeApp[] = [
  { id: 'mail',       name: 'Signal',     icon: 'mail',                 gradient: ['#00B4FF', '#005EFF'] },
  { id: 'camera',     name: 'Lens',       icon: 'camera',               gradient: ['#FF3D71', '#B02A5A'] },
  { id: 'vault',      name: 'Vault',      icon: 'lock-closed',          gradient: ['#00E5FF', '#0088AA'] },
  { id: 'terminal',   name: 'Shell',      icon: 'terminal',             gradient: ['#00FF66', '#00B347'] },
  { id: 'radar',      name: 'Pulse',      icon: 'radio',                gradient: ['#B026FF', '#5E00A8'] },
  { id: 'compass',    name: 'Vector',     icon: 'compass',              gradient: ['#FFB300', '#B27A00'] },
  { id: 'music',      name: 'Waveform',   icon: 'musical-notes',        gradient: ['#FF00A8', '#8A005A'] },
  { id: 'gallery',    name: 'Frames',     icon: 'images',               gradient: ['#5E5EFF', '#3232AA'] },
  { id: 'shield',     name: 'Shield',     icon: 'shield-checkmark',     gradient: ['#00E5FF', '#00A5C0'] },
  { id: 'network',    name: 'Mesh',       icon: 'globe-outline',        gradient: ['#00FFC8', '#00A88A'] },
  { id: 'analytics',  name: 'Trends',     icon: 'trending-up',          gradient: ['#FFD700', '#B29600'] },
  { id: 'files',      name: 'Archive',    icon: 'folder',               gradient: ['#3D8BFF', '#1A5FCC'] },
  { id: 'clock',      name: 'Chrono',     icon: 'time',                 gradient: ['#FF6D3D', '#B24A22'] },
  { id: 'notes',      name: 'Neural',     icon: 'document-text',        gradient: ['#B0B5C9', '#6B7080'] },
  { id: 'phone',      name: 'Line',       icon: 'call',                 gradient: ['#00FF66', '#00A040'] },
  { id: 'messages',   name: 'Threads',    icon: 'chatbubbles',          gradient: ['#00A2FF', '#0057B2'] },
  { id: 'contacts',   name: 'Roster',     icon: 'people',               gradient: ['#FF3D71', '#B02A55'] },
  { id: 'battery',    name: 'Cell',       icon: 'battery-charging',     gradient: ['#00FF66', '#00A040'] },
  { id: 'weather',    name: 'Cloud',      icon: 'partly-sunny',         gradient: ['#3DA5FF', '#1A6EC0'] },
  { id: 'settings',   name: 'System',     icon: 'settings',             gradient: ['#8B92A5', '#4A5060'] },
  { id: 'maps',       name: 'Grid',       icon: 'map',                  gradient: ['#00FF88', '#00A85A'] },
  { id: 'video',      name: 'Beam',       icon: 'videocam',             gradient: ['#FF3DFF', '#A020A8'] },
  { id: 'browser',    name: 'Portal',     icon: 'planet',               gradient: ['#00E5FF', '#0088AA'] },
  { id: 'calc',       name: 'Matrix',     icon: 'calculator',           gradient: ['#FFB300', '#B27A00'] },
  { id: 'wallet',     name: 'Ledger',     icon: 'card',                 gradient: ['#00FFC8', '#00A88A'] },
  { id: 'health',     name: 'Vitals',     icon: 'heart',                gradient: ['#FF003C', '#B00028'] },
  { id: 'fit',        name: 'Kinetic',    icon: 'barbell',              gradient: ['#FFD700', '#B29600'] },
  { id: 'stocks',     name: 'Signal-X',   icon: 'stats-chart',          gradient: ['#00FF66', '#00A040'] },
  { id: 'podcast',    name: 'Frequency',  icon: 'mic',                  gradient: ['#B026FF', '#5E00A8'] },
  { id: 'scanner',    name: 'Scan',       icon: 'scan',                 gradient: ['#00E5FF', '#0088AA'] },
];

export const FOLDERS = [
  {
    id: 'utilities',
    name: 'Utilities',
    apps: ['calc', 'clock', 'files', 'scanner'],
  },
  {
    id: 'creative',
    name: 'Creative',
    apps: ['camera', 'gallery', 'video', 'notes'],
  },
];
