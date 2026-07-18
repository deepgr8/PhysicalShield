// Endless fake system-style notification generator.
// Each generated notification looks like a benign, satisfying system message.

export interface FakeNotification {
  id: string;
  app: string;
  icon: string;      // Ionicons name
  color: string;     // accent tint for the app dot
  title: string;
  body: string;
  time: string;      // display string like "now", "2m", "5m ago"
}

const TEMPLATES: Omit<FakeNotification, 'id' | 'time'>[] = [
  { app: 'System',   icon: 'checkmark-circle',   color: '#00FF66', title: 'System Optimized',       body: 'Background services trimmed. Memory 32% freed.' },
  { app: 'Memory',   icon: 'hardware-chip',      color: '#00E5FF', title: 'Memory Stable',          body: 'RAM allocation balanced across cores.' },
  { app: 'Battery',  icon: 'battery-charging',   color: '#00FF66', title: 'Battery Healthy',        body: '98% capacity retained after 214 cycles.' },
  { app: 'Vault',    icon: 'lock-closed',        color: '#B026FF', title: 'Files Synced',           body: 'Encrypted archive uploaded to secure node.' },
  { app: 'Mesh',     icon: 'wifi',               color: '#00E5FF', title: 'Network Stable',         body: 'Ping 12ms · Uplink 480 Mbps.' },
  { app: 'Shield',   icon: 'shield-checkmark',   color: '#00E5FF', title: 'Security Updated',       body: 'Signatures refreshed. No threats detected.' },
  { app: 'Archive',  icon: 'cloud-done',         color: '#00E5FF', title: 'Backup Complete',        body: '2.4 GB encrypted and mirrored.' },
  { app: 'Chrono',   icon: 'time',               color: '#FFB300', title: 'Focus Streak',           body: 'You maintained calm for 24 minutes.' },
  { app: 'Vitals',   icon: 'heart',              color: '#FF003C', title: 'Vitals Nominal',         body: 'Resting rhythm within personal baseline.' },
  { app: 'Cell',     icon: 'flash',              color: '#FFD700', title: 'Fast Charge Ready',      body: 'Adapter negotiated at 45W.' },
  { app: 'Neural',   icon: 'sparkles',           color: '#B026FF', title: 'Insight Available',      body: 'Two low-priority recommendations queued.' },
  { app: 'Signal',   icon: 'mail',               color: '#00B4FF', title: 'Inbox Cleared',          body: 'Zero pending messages. Quiet zone active.' },
  { app: 'Pulse',    icon: 'radio',              color: '#B026FF', title: 'Radio Silence',          body: 'No incoming broadcasts. All frequencies calm.' },
  { app: 'Kinetic',  icon: 'walk',               color: '#00FF66', title: 'Movement Logged',        body: '3,240 steps accounted for today.' },
  { app: 'Cloud',    icon: 'partly-sunny',       color: '#3DA5FF', title: 'Weather Steady',         body: 'Conditions unchanged in your area.' },
  { app: 'Trends',   icon: 'trending-up',        color: '#FFD700', title: 'Metrics Improving',      body: 'Efficiency up 8% since last cycle.' },
  { app: 'System',   icon: 'moon',               color: '#00E5FF', title: 'Do Not Disturb Active',  body: 'Filtering low-priority interruptions.' },
  { app: 'Ledger',   icon: 'card',               color: '#00FFC8', title: 'Transaction Cleared',    body: 'Routine ledger entry acknowledged.' },
];

const TIME_TAGS = ['now', '1m', '2m', '4m', '7m', '12m', '18m', '25m', '32m'];

let counter = 0;
export function makeNotification(): FakeNotification {
  const t = TEMPLATES[Math.floor(Math.random() * TEMPLATES.length)];
  counter += 1;
  return {
    ...t,
    id: `notif-${Date.now()}-${counter}`,
    time: TIME_TAGS[Math.floor(Math.random() * TIME_TAGS.length)],
  };
}

export function makeNotifications(count: number): FakeNotification[] {
  return Array.from({ length: count }, () => makeNotification());
}
