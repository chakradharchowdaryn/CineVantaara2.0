/**
 * CineVantaara Creative Works & Portfolio Vault Service (Phase 5: Item 25 & Phase 11: Item 67)
 * Handles scripts, showreels, audio stems, lookbooks, and cryptographic IP protection certificates.
 */

export interface CreativeWork {
  id: string;
  userId: string;
  userName: string;
  userRole: string;
  title: string;
  craftType: 'SCRIPT' | 'SHOWREEL' | 'AUDIO_DEMO' | 'LOOKBOOK' | 'STILLS';
  description: string;
  mediaUrl: string;
  fileSizeBytes?: number;
  fileName?: string;
  tags: string[];
  isProtected: boolean;
  sha256Hash: string;
  registeredAt: string;
}

const PORTFOLIO_STORAGE_KEY = 'cv_creative_works';

const INITIAL_DEMO_WORKS: CreativeWork[] = [
  {
    id: 'work-1',
    userId: 'user-demo-1',
    userName: 'Karthik Varma',
    userRole: 'CINEMATOGRAPHER',
    title: 'Anamorphic 35mm Showreel (2025-2026)',
    craftType: 'SHOWREEL',
    description: 'Compilation of dramatic narrative lighting, Alexa 35 footage, Cooke Anamorphic /i prime lenses.',
    mediaUrl: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=800&q=80',
    tags: ['Alexa 35', 'Cooke Anamorphic', 'Low Light', 'DCI-P3'],
    isProtected: true,
    sha256Hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    registeredAt: '2026-02-14 16:20:00 UTC'
  },
  {
    id: 'work-2',
    userId: 'user-demo-2',
    userName: 'Dr. Ananya Roy',
    userRole: 'WRITER',
    title: 'The Obsidian Room (Feature Screenplay Treatment)',
    craftType: 'SCRIPT',
    description: 'Award-winning 118-page psychological crime thriller exploring memory theft and identity manipulation.',
    mediaUrl: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=800&q=80',
    tags: ['Psychological Thriller', 'Noir', 'Feature Film', 'WGA Registered'],
    isProtected: true,
    sha256Hash: 'a7c8b912df0841289134bb81923058a9134dca98129034871239084123891456',
    registeredAt: '2026-01-20 09:30:00 UTC'
  },
  {
    id: 'work-3',
    userId: 'user-demo-3',
    userName: 'Meera Nambiar',
    userRole: 'MUSIC_DIRECTOR',
    title: 'Symphonic Cinema Theme: Echoes of Eternity',
    craftType: 'AUDIO_DEMO',
    description: 'Full 80-piece orchestral cue recorded with live strings and modular analog synthesizers.',
    mediaUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80',
    tags: ['Orchestral', 'Dolby Atmos', 'Analog Synth', 'Trailer Score'],
    isProtected: true,
    sha256Hash: '98a76d54c32b10fe876543210987654321098765432109876543210987654321',
    registeredAt: '2026-03-05 11:15:00 UTC'
  }
];

export function getStoredWorks(): CreativeWork[] {
  try {
    const raw = localStorage.getItem(PORTFOLIO_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  localStorage.setItem(PORTFOLIO_STORAGE_KEY, JSON.stringify(INITIAL_DEMO_WORKS));
  return INITIAL_DEMO_WORKS;
}

export function getUserWorks(userId: string): CreativeWork[] {
  const works = getStoredWorks();
  return works.filter(w => w.userId === userId);
}

export async function generateSha256(text: string): Promise<string> {
  if (window.crypto && window.crypto.subtle) {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

export async function addCreativeWork(workData: Omit<CreativeWork, 'id' | 'sha256Hash' | 'registeredAt'>): Promise<CreativeWork> {
  const hash = await generateSha256(`${workData.title}-${workData.userName}-${Date.now()}`);
  const newWork: CreativeWork = {
    ...workData,
    id: `work-${Date.now()}`,
    sha256Hash: hash,
    registeredAt: new Date().toISOString()
  };

  const current = getStoredWorks();
  const updated = [newWork, ...current];
  localStorage.setItem(PORTFOLIO_STORAGE_KEY, JSON.stringify(updated));
  return newWork;
}

export function deleteCreativeWork(id: string): void {
  const current = getStoredWorks();
  const updated = current.filter(w => w.id !== id);
  localStorage.setItem(PORTFOLIO_STORAGE_KEY, JSON.stringify(updated));
}
