import React, { createContext, useContext, useState, useEffect, useRef, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { ProfessionalRole } from '../types';

export interface AnimeTrack {
  role: ProfessionalRole;
  anime: string;
  title: string;
  vibe: string;
  notes: number[];
  bass: number[];
  tempoMs: number;
  mp3Fallback?: string;
}

export const ROLE_BGM_MAP: Record<ProfessionalRole, AnimeTrack> = {
  DIRECTOR: {
    role: 'DIRECTOR',
    anime: 'One Piece',
    title: 'Overtaken — Grand Line Fleet Command',
    vibe: 'Epic Grand Brass & Visionary Battle March',
    notes: [196.00, 233.08, 261.63, 293.66, 349.23, 293.66, 261.63, 233.08],
    bass: [98.00, 98.00, 116.54, 130.81],
    tempoMs: 280,
    mp3Fallback: '/audio/onepiece.mp3'
  },
  PRODUCER: {
    role: 'PRODUCER',
    anime: 'Naruto',
    title: 'The Rising Fighting Spirit — Executive Will',
    vibe: 'Driving Taiko, Shamisen & Executive Rock',
    notes: [293.66, 349.23, 392.00, 440.00, 523.25, 440.00, 392.00, 349.23],
    bass: [146.83, 146.83, 174.61, 196.00],
    tempoMs: 240,
    mp3Fallback: '/audio/naruto.mp3'
  },
  WRITER: {
    role: 'WRITER',
    anime: 'Death Note',
    title: "L's Theme — Shinobi Lore & Script",
    vibe: 'Hypnotic Piano Ostinato & Psychological Depth',
    notes: [440.00, 523.25, 493.88, 415.30, 440.00, 659.25, 587.33, 523.25],
    bass: [110.00, 130.81, 123.47, 103.83],
    tempoMs: 320,
    mp3Fallback: '/audio/deathnote.mp3'
  },
  ACTOR: {
    role: 'ACTOR',
    anime: 'Attack on Titan',
    title: 'Vogel im Käfig — Stardom Stage Vanguard',
    vibe: 'Grand Orchestral Crescendo & Choral Passion',
    notes: [329.63, 392.00, 493.88, 523.25, 493.88, 440.00, 392.00, 369.99],
    bass: [82.41, 98.00, 123.47, 130.81],
    tempoMs: 300,
    mp3Fallback: '/audio/aot.mp3'
  },
  CINEMATOGRAPHER: {
    role: 'CINEMATOGRAPHER',
    anime: 'Demon Slayer (Kimetsu no Yaiba)',
    title: 'Kamado Tanjiro no Uta — Breath of Light',
    vibe: 'Japanese Woodwinds, Harp & Panoramic Visuals',
    notes: [293.66, 349.23, 440.00, 392.00, 349.23, 329.63, 293.66, 261.63],
    bass: [146.83, 174.61, 220.00, 196.00],
    tempoMs: 340,
    mp3Fallback: '/audio/demonslayer.mp3'
  },
  EDITOR: {
    role: 'EDITOR',
    anime: 'Bleach',
    title: 'Number One — Bankai Precision Splice',
    vibe: 'Fast Rhythmic Cuts, Slap Bass & High Cadence',
    notes: [329.63, 392.00, 440.00, 466.16, 493.88, 587.33, 659.25, 493.88],
    bass: [82.41, 98.00, 110.00, 123.47],
    tempoMs: 220,
    mp3Fallback: '/audio/bleach.mp3'
  },
  MUSIC_DIRECTOR: {
    role: 'MUSIC_DIRECTOR',
    anime: 'Dragon Ball Super',
    title: 'Ultimate Battle — Clash of the Gods',
    vibe: 'Symphonic Rock Guitar & Maestro Ascendance',
    notes: [440.00, 523.25, 587.33, 622.25, 659.25, 783.99, 659.25, 880.00],
    bass: [110.00, 130.81, 146.83, 164.81],
    tempoMs: 230
  },
  VFX_ARTIST: {
    role: 'VFX_ARTIST',
    anime: 'Solo Leveling',
    title: 'Dark Aria — Limit Breaker FX Overdrive',
    vibe: 'Futuristic Hyper-Synth & Limitless Digital Energy',
    notes: [369.99, 440.00, 493.88, 554.37, 659.25, 587.33, 554.37, 493.88],
    bass: [92.50, 110.00, 123.47, 138.59],
    tempoMs: 210
  },
  ANIMATOR: {
    role: 'ANIMATOR',
    anime: 'Studio Ghibli (Spirited Away)',
    title: 'One Summer Day — Infinite Canvas Suite',
    vibe: 'Sparkling Cel Piano & Celestial Flow',
    notes: [261.63, 329.63, 392.00, 523.25, 493.88, 392.00, 329.63, 293.66],
    bass: [130.81, 164.81, 196.00, 146.83],
    tempoMs: 330
  },
  COLORIST: {
    role: 'COLORIST',
    anime: 'Weathering With You (Makoto Shinkai)',
    title: 'Grand Escape — Chromatic Grading Symphony',
    vibe: 'Prismatic Celestial Harmonics & Dynamic Range',
    notes: [392.00, 440.00, 523.25, 587.33, 659.25, 587.33, 523.25, 440.00],
    bass: [98.00, 110.00, 130.81, 146.83],
    tempoMs: 300
  },
  STUNT_COORDINATOR: {
    role: 'STUNT_COORDINATOR',
    anime: 'Dragon Ball Z',
    title: 'Cha-La Head-Cha-La — Kinetic Action Lead',
    vibe: 'Adrenaline High-Impact Action Beats',
    notes: [329.63, 392.00, 440.00, 493.88, 587.33, 493.88, 440.00, 392.00],
    bass: [82.41, 98.00, 110.00, 123.47],
    tempoMs: 230
  },
  GAFFER: {
    role: 'GAFFER',
    anime: 'Neon Genesis Evangelion',
    title: 'Angel Attack — High-Voltage Lumen Core',
    vibe: 'Tense Electric Percussion & Luminary Cadence',
    notes: [293.66, 349.23, 440.00, 349.23, 293.66, 261.63, 293.66, 349.23],
    bass: [146.83, 174.61, 220.00, 174.61],
    tempoMs: 250
  },
  LINE_PRODUCER: {
    role: 'LINE_PRODUCER',
    anime: 'Chainsaw Man',
    title: 'Kick Back — High-Stakes Production Pace',
    vibe: 'Fast Brass, Driving Drums & Budget Pacing',
    notes: [261.63, 277.18, 293.66, 311.13, 329.63, 349.23, 392.00, 440.00],
    bass: [130.81, 138.59, 146.83, 164.81],
    tempoMs: 220
  },
  CASTING_DIRECTOR: {
    role: 'CASTING_DIRECTOR',
    anime: 'Vinland Saga',
    title: 'Drown — Ensemble Discovery Horizon',
    vibe: 'Nordic Strings, Sweeping Depth & Character Call',
    notes: [220.00, 261.63, 329.63, 392.00, 440.00, 392.00, 329.63, 261.63],
    bass: [110.00, 130.81, 164.81, 196.00],
    tempoMs: 310
  },
  SCRIPT_SUPERVISOR: {
    role: 'SCRIPT_SUPERVISOR',
    anime: 'Steins;Gate',
    title: 'Gate of Steiner — Timeline & Continuity',
    vibe: 'Melancholic Piano & Clockwork Continuity',
    notes: [329.63, 349.23, 392.00, 440.00, 493.88, 440.00, 392.00, 349.23],
    bass: [82.41, 87.31, 98.00, 110.00],
    tempoMs: 320
  },
  DRONE_OPERATOR: {
    role: 'DRONE_OPERATOR',
    anime: 'Cyberpunk: Edgerunners',
    title: 'I Really Want to Stay At Your House — Aerial Run',
    vibe: 'Aerial Synthwave, Atmospheric Elevation & 8K Gimbal',
    notes: [349.23, 392.00, 440.00, 523.25, 587.33, 523.25, 440.00, 392.00],
    bass: [87.31, 98.00, 110.00, 130.81],
    tempoMs: 260
  },
  BOOM_OPERATOR: {
    role: 'BOOM_OPERATOR',
    anime: 'Mob Psycho 100',
    title: '99 — Sonic Spatial Focus',
    vibe: 'Tactile Bass Chugs & Hyper-Focused Dialogue Sync',
    notes: [196.00, 220.00, 246.94, 261.63, 293.66, 261.63, 246.94, 220.00],
    bass: [98.00, 110.00, 123.47, 130.81],
    tempoMs: 250
  },
  MAKEUP_ARTIST: {
    role: 'MAKEUP_ARTIST',
    anime: 'Your Name (Kimi no Na wa)',
    title: 'Sparkle — Celestial Aesthetic Elegance',
    vibe: 'Shimmering Piano & Graceful Transformation',
    notes: [493.88, 622.25, 739.99, 830.61, 739.99, 659.25, 622.25, 554.37],
    bass: [123.47, 155.56, 185.00, 164.81],
    tempoMs: 310
  },
  COSTUME_DESIGNER: {
    role: 'COSTUME_DESIGNER',
    anime: 'Jujutsu Kaisen',
    title: 'Remember — Shibuya Haute Couture Beats',
    vibe: 'Neo-Tokyo Lo-Fi Strings & Designer Rhythm',
    notes: [277.18, 329.63, 415.30, 493.88, 554.37, 493.88, 415.30, 329.63],
    bass: [138.59, 164.81, 103.83, 123.47],
    tempoMs: 290
  },
  ART_DIRECTOR: {
    role: 'ART_DIRECTOR',
    anime: "Howl's Moving Castle",
    title: 'Merry-Go-Round of Life — Studio Production Waltz',
    vibe: 'Sweeping 3/4 Classical Symphony & World Design',
    notes: [392.00, 466.16, 587.33, 523.25, 466.16, 440.00, 369.99, 392.00],
    bass: [98.00, 116.54, 146.83, 130.81],
    tempoMs: 350
  },
  SOUND_DESIGNER: {
    role: 'SOUND_DESIGNER',
    anime: 'Ghost in the Shell',
    title: 'Making of Cyborg — Spatial Sub-Bass Matrix',
    vibe: 'Acoustic Timpani, Spatial Reverb & Cyber Sub-Bass',
    notes: [261.63, 261.63, 311.13, 349.23, 392.00, 349.23, 311.13, 261.63],
    bass: [65.41, 65.41, 77.78, 87.31],
    tempoMs: 250
  },
  TECHNICIAN: {
    role: 'TECHNICIAN',
    anime: 'Fullmetal Alchemist: Brotherhood',
    title: 'Main Theme — Industrial Alchemical Rig',
    vibe: 'Robust Celtic-Industrial Orchestral Precision',
    notes: [293.66, 329.63, 349.23, 440.00, 392.00, 349.23, 329.63, 293.66],
    bass: [146.83, 164.81, 174.61, 220.00],
    tempoMs: 280
  },
  ASSISTANT_DIRECTOR: {
    role: 'ASSISTANT_DIRECTOR',
    anime: 'Hunter x Hunter',
    title: 'Departure! — Set Tactical Commander March',
    vibe: 'High-Energy Adventurous March & Floor Direction',
    notes: [233.08, 293.66, 349.23, 466.16, 440.00, 349.23, 293.66, 233.08],
    bass: [116.54, 146.83, 174.61, 116.54],
    tempoMs: 260
  },
  PRODUCTION_DESIGNER: {
    role: 'PRODUCTION_DESIGNER',
    anime: 'Akira',
    title: 'Kaneda Theme — Monumental World Build',
    vibe: 'Futuristic Gamelan & Colossal Scale',
    notes: [220.00, 261.63, 293.66, 329.63, 392.00, 329.63, 293.66, 261.63],
    bass: [55.00, 65.41, 73.42, 82.41],
    tempoMs: 270
  },
  CHOREOGRAPHER: {
    role: 'CHOREOGRAPHER',
    anime: "JoJo's Bizarre Adventure",
    title: "Il Vento D'oro — Golden Wind Kinetic Dance",
    vibe: 'Funky Brass Stabs, Driving Piano & Kinetic Stage Staging',
    notes: [293.66, 329.63, 369.99, 440.00, 523.25, 440.00, 369.99, 329.63],
    bass: [146.83, 164.81, 185.00, 220.00],
    tempoMs: 215
  },
  FOLEY_ARTIST: {
    role: 'FOLEY_ARTIST',
    anime: 'My Hero Academia',
    title: 'You Say Run — Organic Impact Resonance',
    vibe: 'Dynamic Orchestral Impact & Tactile Audio Textures',
    notes: [329.63, 392.00, 440.00, 493.88, 587.33, 493.88, 440.00, 392.00],
    bass: [82.41, 98.00, 110.00, 123.47],
    tempoMs: 240
  },
  LOCATION_MANAGER: {
    role: 'LOCATION_MANAGER',
    anime: 'Fate/Zero',
    title: 'Sword of Promised Victory — Topography Conquest',
    vibe: 'Epic Symphonic March & Majestic Horizons',
    notes: [261.63, 293.66, 329.63, 392.00, 523.25, 440.00, 392.00, 329.63],
    bass: [65.41, 73.42, 82.41, 98.00],
    tempoMs: 280
  },
  PRODUCTION_COORDINATOR: {
    role: 'PRODUCTION_COORDINATOR',
    anime: 'Haikyuu!!',
    title: 'Above — Synchronized Production Hub',
    vibe: 'Uplifting Horns, Synchronized Ensemble Logistics',
    notes: [349.23, 440.00, 523.25, 587.33, 659.25, 587.33, 523.25, 440.00],
    bass: [87.31, 110.00, 130.81, 146.83],
    tempoMs: 235
  },
  STORYBOARD_ARTIST: {
    role: 'STORYBOARD_ARTIST',
    anime: 'Cowboy Bebop',
    title: 'Tank! — Dynamic Beatboard Cadence',
    vibe: 'Bebop Big Band Horns & Kinetic Sequential Art',
    notes: [392.00, 466.16, 523.25, 554.37, 587.33, 698.46, 587.33, 523.25],
    bass: [98.00, 116.54, 130.81, 146.83],
    tempoMs: 195
  },
  DUBBING_ARTIST: {
    role: 'DUBBING_ARTIST',
    anime: 'Violet Evergarden',
    title: 'The Voice in My Heart — Theatrical Nuance',
    vibe: 'Expressive Strings, Solo Clarinet & Vocal Presence',
    notes: [329.63, 392.00, 440.00, 523.25, 493.88, 392.00, 329.63, 293.66],
    bass: [82.41, 98.00, 110.00, 123.47],
    tempoMs: 330
  },
  SUPER_ADMIN: {
    role: 'SUPER_ADMIN',
    anime: 'Code Geass',
    title: 'All Hail Britannia — Citadel Supreme Command',
    vibe: 'Imperial Solemn Orchestra & Sovereign Governance',
    notes: [261.63, 329.63, 392.00, 523.25, 659.25, 523.25, 392.00, 329.63],
    bass: [65.41, 82.41, 98.00, 130.81],
    tempoMs: 300
  },
  PLATFORM_ADMIN: {
    role: 'PLATFORM_ADMIN',
    anime: 'Code Geass',
    title: 'Continued Story — Platform Overseer Core',
    vibe: 'Sovereign Digital Choral Architecture',
    notes: [329.63, 392.00, 493.88, 587.33, 493.88, 392.00, 329.63, 293.66],
    bass: [82.41, 98.00, 123.47, 146.83],
    tempoMs: 310
  },
  MODERATOR: {
    role: 'MODERATOR',
    anime: 'Death Note',
    title: 'Kira Theme — Platform Arbiter',
    vibe: 'Gregorian Organ & Judicial Precision',
    notes: [261.63, 311.13, 392.00, 466.16, 392.00, 311.13, 261.63, 220.00],
    bass: [65.41, 77.78, 98.00, 110.00],
    tempoMs: 320
  },
  GUEST: {
    role: 'GUEST',
    anime: 'Your Name (Kimi no Na wa)',
    title: 'Sparkle & Katawaredoki — CinePass Theatrical Symphony',
    vibe: 'Celestial Orchestral Strings & Red Carpet Wonder',
    notes: [329.63, 392.00, 440.00, 493.88, 587.33, 493.88, 440.00, 392.00],
    bass: [164.81, 164.81, 196.00, 220.00],
    tempoMs: 300,
    mp3Fallback: '/audio/onepiece.mp3'
  }
};

export const HOME_BGM_TRACK: AnimeTrack = {
  role: 'DIRECTOR',
  anime: 'Your Name (Kimi no Na wa)',
  title: 'Dream Lantern & Mitsuha Theme — Cinema Dawn Overture',
  vibe: 'Celestial Orchestral Strings & Visionary Storytelling Melodies',
  notes: [261.63, 329.63, 392.00, 523.25, 493.88, 392.00, 329.63, 293.66],
  bass: [130.81, 164.81, 196.00, 146.83],
  tempoMs: 310,
  mp3Fallback: '/audio/onepiece.mp3'
};

export const ADMIN_BGM_TRACK: AnimeTrack = {
  role: 'SUPER_ADMIN',
  anime: 'Code Geass',
  title: 'All Hail Britannia — Citadel Supreme Command',
  vibe: 'Imperial Solemn Orchestra & Platform Governance',
  notes: [261.63, 329.63, 392.00, 523.25, 659.25, 523.25, 392.00, 329.63],
  bass: [65.41, 82.41, 98.00, 130.81],
  tempoMs: 300,
  mp3Fallback: '/audio/deathnote.mp3'
};

interface BgmContextType {
  isBgmEnabled: boolean;
  toggleBgm: (enabled: boolean) => void;
  volume: number;
  setVolume: (vol: number) => void;
  stopAnimation: boolean;
  toggleStopAnimation: (stop: boolean) => void;
  reduceMotion: boolean;
  setReduceMotion: (reduce: boolean) => void;
  isSettingsOpen: boolean;
  openSettings: () => void;
  closeSettings: () => void;
  currentTrack: AnimeTrack;
}

const BgmContext = createContext<BgmContextType | undefined>(undefined);

export const BgmProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, activeRole } = useAuth();
  const location = useLocation();
  
  const [isBgmEnabled, setIsBgmEnabled] = useState<boolean>(() => {
    return localStorage.getItem('cv_bgm_disabled') !== 'true';
  });

  const [volume, setVolumeState] = useState<number>(() => {
    return Number(localStorage.getItem('cv_bgm_vol') || 0.35);
  });

  // Dedicated Animation State: Shaking animation is ON as first (default: active unless explicitly stopped)
  const [stopAnimation, setStopAnimationState] = useState<boolean>(() => {
    return localStorage.getItem('cv_stop_animation_v2') === 'true';
  });

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const synthTimerRef = useRef<number | null>(null);
  const stepIndexRef = useRef(0);

  // Distinct anime theme automatically determined for:
  // 1. Home Page (/) -> Your Name: Cinema Dawn Overture
  // 2. Admin Citadel (/admin, /admin-login) -> Code Geass: All Hail Britannia
  // 3. Each specific Dashboard console -> Dedicated Anime Theme per role (Naruto, One Piece, Bleach, etc.)
  const currentTrack: AnimeTrack = useMemo(() => {
    const path = (location.pathname || '').toLowerCase();
    if (path.startsWith('/admin')) {
      return ADMIN_BGM_TRACK;
    }
    if (path === '/' && !currentUser) {
      return HOME_BGM_TRACK;
    }
    return ROLE_BGM_MAP[activeRole] || ROLE_BGM_MAP.DIRECTOR;
  }, [location.pathname, activeRole, currentUser]);

  // Synchronized shaking animation control:
  // "make shaking aniation as first and if i mute the music animation should be stopped as now"
  const isAnimationActive = isBgmEnabled && !stopAnimation;

  // Sync animation freeze to document root strictly based on music play and stop state
  useEffect(() => {
    if (!isAnimationActive) {
      document.documentElement.classList.add('no-animation', 'disable-shaky-animation');
    } else {
      document.documentElement.classList.remove('no-animation', 'disable-shaky-animation');
    }
  }, [isAnimationActive]);

  const toggleStopAnimation = (stop: boolean) => {
    setStopAnimationState(stop);
    localStorage.setItem('cv_stop_animation_v2', stop ? 'true' : 'false');
    localStorage.setItem('cv_reduce_motion', stop ? 'true' : 'false');
    if (stop || !isBgmEnabled) {
      document.documentElement.classList.add('no-animation', 'disable-shaky-animation');
    } else {
      document.documentElement.classList.remove('no-animation', 'disable-shaky-animation');
    }
  };

  const setReduceMotion = (reduce: boolean) => {
    toggleStopAnimation(reduce);
  };

  const setVolume = (vol: number) => {
    setVolumeState(vol);
    localStorage.setItem('cv_bgm_vol', String(vol));
    if (gainNodeRef.current && audioCtxRef.current) {
      gainNodeRef.current.gain.setValueAtTime(vol, audioCtxRef.current.currentTime);
    }
    if (audioRef.current) {
      audioRef.current.volume = vol;
    }
  };

  const toggleBgm = (enabled: boolean) => {
    setIsBgmEnabled(enabled);
    localStorage.setItem('cv_bgm_disabled', enabled ? 'false' : 'true');

    if (!enabled) {
      if (synthTimerRef.current) {
        clearInterval(synthTimerRef.current);
        synthTimerRef.current = null;
      }
      if (audioRef.current) {
        audioRef.current.pause();
      }
      // If user mutes music, animation stops completely immediately
      document.documentElement.classList.add('no-animation', 'disable-shaky-animation');
    } else {
      // If user un-mutes music, restore shaking animation as first
      if (!stopAnimation) {
        document.documentElement.classList.remove('no-animation', 'disable-shaky-animation');
      }
    }
  };

  const openSettings = () => setIsSettingsOpen(true);
  const closeSettings = () => setIsSettingsOpen(false);

  // Initialize Web Audio Synthesis for any anime track
  const initWebAudio = () => {
    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(isBgmEnabled ? volume : 0, ctx.currentTime);
      gain.connect(ctx.destination);
      audioCtxRef.current = ctx;
      gainNodeRef.current = gain;
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
  };

  const playSynthesizerStep = () => {
    if (!audioCtxRef.current || !gainNodeRef.current || !isBgmEnabled) return;

    const ctx = audioCtxRef.current;
    const now = ctx.currentTime;
    const noteFreq = currentTrack.notes[stepIndexRef.current % currentTrack.notes.length];
    const bassFreq = currentTrack.bass[Math.floor(stepIndexRef.current / 2) % currentTrack.bass.length];

    // Melody lead
    const oscLead = ctx.createOscillator();
    const leadGain = ctx.createGain();
    oscLead.type = (currentTrack.role === 'EDITOR' || currentTrack.role === 'VFX_ARTIST') ? 'sawtooth' : 'triangle';
    oscLead.frequency.setValueAtTime(noteFreq, now);

    leadGain.gain.setValueAtTime(volume * 0.45, now);
    leadGain.gain.exponentialRampToValueAtTime(0.001, now + (currentTrack.tempoMs / 1000) * 1.5);

    oscLead.connect(leadGain);
    leadGain.connect(gainNodeRef.current);
    oscLead.start(now);
    oscLead.stop(now + (currentTrack.tempoMs / 1000) * 1.6);

    // Warm Sub-bass
    if (stepIndexRef.current % 2 === 0) {
      const oscBass = ctx.createOscillator();
      const bassGain = ctx.createGain();
      oscBass.type = 'sine';
      oscBass.frequency.setValueAtTime(bassFreq, now);

      bassGain.gain.setValueAtTime(volume * 0.6, now);
      bassGain.gain.exponentialRampToValueAtTime(0.001, now + (currentTrack.tempoMs / 1000) * 2.0);

      oscBass.connect(bassGain);
      bassGain.connect(gainNodeRef.current);
      oscBass.start(now);
      oscBass.stop(now + (currentTrack.tempoMs / 1000) * 2.1);
    }

    stepIndexRef.current += 1;
  };

  // Dynamic BGM playback controller for all Dashboards, Home Page, and Admin Citadel
  useEffect(() => {
    if (!isBgmEnabled) {
      if (synthTimerRef.current) {
        clearInterval(synthTimerRef.current);
        synthTimerRef.current = null;
      }
      if (audioRef.current) {
        audioRef.current.pause();
      }
      return;
    }

    // Stop and reset prior audio before transitioning to the new theme
    if (synthTimerRef.current) {
      clearInterval(synthTimerRef.current);
      synthTimerRef.current = null;
    }
    if (audioRef.current) {
      audioRef.current.pause();
    }

    // Play HTML5 MP3 fallback if available, or procedural Web Audio Synthesizer
    if (currentTrack.mp3Fallback) {
      const audioFile = currentTrack.mp3Fallback;
      if (!audioRef.current) {
        audioRef.current = new Audio(audioFile);
      } else {
        audioRef.current.src = audioFile;
        audioRef.current.currentTime = 0;
      }
      const audio = audioRef.current;
      audio.loop = true;
      audio.volume = volume;
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Autoplay policy fallback: resume on user interaction
          const resumeOnFirstGesture = () => {
            if (audioRef.current && isBgmEnabled) {
              audioRef.current.play().catch(() => {});
            }
            window.removeEventListener('click', resumeOnFirstGesture);
            window.removeEventListener('keydown', resumeOnFirstGesture);
          };
          window.addEventListener('click', resumeOnFirstGesture);
          window.addEventListener('keydown', resumeOnFirstGesture);
        });
      }
    } else {
      // Use procedural Web Audio synthesizer for distinct role theme
      initWebAudio();
      stepIndexRef.current = 0;
      playSynthesizerStep();

      synthTimerRef.current = window.setInterval(() => {
        playSynthesizerStep();
      }, currentTrack.tempoMs);
    }

    return () => {
      if (synthTimerRef.current) {
        clearInterval(synthTimerRef.current);
        synthTimerRef.current = null;
      }
    };
  }, [activeRole, location.pathname, isBgmEnabled, currentTrack.title]);

  return (
    <BgmContext.Provider
      value={{
        isBgmEnabled,
        toggleBgm,
        volume,
        setVolume,
        stopAnimation,
        toggleStopAnimation,
        reduceMotion: stopAnimation,
        setReduceMotion,
        isSettingsOpen,
        openSettings,
        closeSettings,
        currentTrack
      }}
    >
      {children}
    </BgmContext.Provider>
  );
};

export const useBgm = () => {
  const context = useContext(BgmContext);
  if (!context) {
    throw new Error('useBgm must be used within a BgmProvider');
  }
  return context;
};
