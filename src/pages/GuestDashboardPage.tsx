import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
  Film,
  Ticket,
  Radio,
  Megaphone,
  Bell,
  Sparkles,
  Video,
  ShieldAlert,
  Lock,
  ArrowLeft,
  Info,
  Calendar,
  Clock,
  Award,
  Layers,
  Heart,
  Eye,
  AlertTriangle,
  CheckCircle2,
  Share2,
  ChevronRight
} from 'lucide-react';

interface BlockDefinition {
  id: string;
  title: string;
  shortDesc: string;
  badge: string;
  badgeColor: string;
  authority: string;
  authorityColor: string;
  icon: React.ElementType;
  darkCardGradient: string;
  lightCardBg: string;
  accentColor: string;
  glowColor: string;
}

const GUEST_BLOCKS: BlockDefinition[] = [
  {
    id: 'movies',
    title: 'Movies & Screenings',
    shortDesc: 'Full-length theatrical releases, festival contest films, and exclusive screening cuts.',
    badge: '0 Titles',
    badgeColor: 'bg-red-500/20 text-red-300 border-red-500/40',
    authority: 'Director & Producer Upload Only',
    authorityColor: 'text-red-400 bg-red-950/40 border-red-500/30',
    icon: Film,
    darkCardGradient: 'from-red-950/50 via-[#180608] to-[#0c0305] border-red-500/40',
    lightCardBg: 'bg-white border-red-200 hover:border-red-400',
    accentColor: 'text-red-400',
    glowColor: 'shadow-glow-guest'
  },
  {
    id: 'bookings',
    title: 'Cinema Bookings',
    shortDesc: 'Reserve virtual auditorium seats, premiere gala tickets, and festival day passes.',
    badge: '0 Active Passes',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    authority: 'Admin & Studio Partners Controlled',
    authorityColor: 'text-amber-400 bg-amber-950/40 border-amber-500/30',
    icon: Ticket,
    darkCardGradient: 'from-amber-950/40 via-[#180f05] to-[#0c0803] border-amber-500/40',
    lightCardBg: 'bg-white border-amber-200 hover:border-amber-400',
    accentColor: 'text-amber-400',
    glowColor: 'shadow-glow-gold'
  },
  {
    id: 'events',
    title: 'Live Events & Q&A',
    shortDesc: 'Interactive director panels, festival red carpet live streams, and fan Q&A sessions.',
    badge: '0 Scheduled',
    badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
    authority: 'Managed by Admin & Studio Partners',
    authorityColor: 'text-purple-400 bg-purple-950/40 border-purple-500/30',
    icon: Radio,
    darkCardGradient: 'from-purple-950/50 via-[#13071c] to-[#0a030f] border-purple-500/40',
    lightCardBg: 'bg-white border-purple-200 hover:border-purple-400',
    accentColor: 'text-purple-400',
    glowColor: 'shadow-md'
  },
  {
    id: 'updates',
    title: 'Studio Updates & Bulletins',
    shortDesc: 'Production diaries, principal photography wraps, casting announcements, and teasers.',
    badge: '0 Bulletins',
    badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
    authority: 'Director, Producer & Admin Only',
    authorityColor: 'text-cyan-400 bg-cyan-950/40 border-cyan-500/30',
    icon: Megaphone,
    darkCardGradient: 'from-cyan-950/40 via-[#061417] to-[#030a0c] border-cyan-500/40',
    lightCardBg: 'bg-white border-cyan-200 hover:border-cyan-400',
    accentColor: 'text-cyan-400',
    glowColor: 'shadow-md'
  },
  {
    id: 'alerts',
    title: 'Audience Alerts & Broadcasts',
    shortDesc: 'Critical premiere schedule shifts, studio advisories, and network bulletins.',
    badge: '0 Active Alerts',
    badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
    authority: 'Director, Producer & Admin Dispatched',
    authorityColor: 'text-rose-400 bg-rose-950/40 border-rose-500/30',
    icon: Bell,
    darkCardGradient: 'from-rose-950/50 via-[#18060a] to-[#0c0305] border-rose-500/40',
    lightCardBg: 'bg-white border-rose-200 hover:border-rose-400',
    accentColor: 'text-rose-400',
    glowColor: 'shadow-md'
  },
  {
    id: 'perks',
    title: 'CinePass VIP Perks & Fan Club',
    shortDesc: 'Earn CinePoints, autographed digital memorabilia, early merchandise, and meet & greets.',
    badge: 'VIP Level 1',
    badgeColor: 'bg-pink-500/20 text-pink-300 border-pink-500/40',
    authority: 'Audience Loyalty Rewards',
    authorityColor: 'text-pink-400 bg-pink-950/40 border-pink-500/30',
    icon: Sparkles,
    darkCardGradient: 'from-pink-950/40 via-[#190612] to-[#0a030b] border-pink-500/40',
    lightCardBg: 'bg-white border-pink-200 hover:border-pink-400',
    accentColor: 'text-pink-400',
    glowColor: 'shadow-md'
  },
  {
    id: 'bts',
    title: 'Behind-The-Scenes (BTS) Vault',
    shortDesc: 'Uncut rehearsal reels, optical camera tests, stunts breakdown, and director audio tracks.',
    badge: 'Vault: Locked',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    authority: 'Studio Production House Exclusives',
    authorityColor: 'text-emerald-400 bg-emerald-950/40 border-emerald-500/30',
    icon: Video,
    darkCardGradient: 'from-emerald-950/40 via-[#06150e] to-[#030c08] border-emerald-500/40',
    lightCardBg: 'bg-white border-emerald-200 hover:border-emerald-400',
    accentColor: 'text-emerald-400',
    glowColor: 'shadow-md'
  }
];

export const GuestDashboardPage: React.FC = () => {
  const { currentUser } = useAuth();
  const { mode } = useTheme();
  const isLight = mode === 'light';

  // Non-scrollable state: When null, renders the compact interactive blocks grid. When set, renders the respective dashboard.
  const [activeBlock, setActiveBlock] = useState<string | null>(null);

  const selectedBlockDef = GUEST_BLOCKS.find(b => b.id === activeBlock);

  return (
    <div className={`min-h-screen pb-20 pt-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6 theme-guest-red ${
      isLight ? 'text-slate-900' : 'text-white'
    }`}>
      
      {/* 1. TOP HEADER / PASS BANNER */}
      <div className={`relative overflow-hidden p-6 sm:p-8 rounded-3xl border shadow-xl transition-all duration-300 ${
        isLight
          ? 'bg-gradient-to-r from-red-50 via-white to-red-100/60 border-red-200 text-slate-900 shadow-md'
          : 'bg-gradient-to-r from-red-950/60 via-[#1a0608] to-[#080304] border-red-500/40 text-white shadow-2xl'
      }`}>
        {/* Glow Aura */}
        <div className={`absolute top-0 right-0 w-80 h-80 blur-[80px] pointer-events-none rounded-full ${
          isLight ? 'bg-red-200/40' : 'bg-red-600/20'
        }`} />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 relative z-10">
          <div className="space-y-2">
            <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-mono font-bold tracking-wider uppercase border ${
              isLight
                ? 'bg-red-100 border-red-300 text-red-700'
                : 'bg-red-600/25 border-red-500/40 text-red-300'
            }`}>
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span>Official CinePass • Guest Audience Lounge</span>
            </div>

            <h1 className={`text-2xl sm:text-3xl lg:text-4xl font-cinematic font-black tracking-wide ${
              isLight ? 'text-slate-900' : 'text-white'
            }`}>
              Welcome, <span className="text-red-500 font-extrabold">{currentUser?.name || 'Film Enthusiast'}</span>
            </h1>

            <p className={`text-xs sm:text-sm max-w-2xl leading-relaxed ${
              isLight ? 'text-slate-600 font-medium' : 'text-gray-300'
            }`}>
              Your official digital audience pass to CineVantaara. Select an entertainment terminal below to access screenings, bookings, live director broadcasts, and studio updates.
            </p>
          </div>

          {/* Digital CinePass Ticket Card */}
          <div className={`flex-shrink-0 p-4 rounded-2xl border shadow-md space-y-2.5 min-w-[260px] ${
            isLight
              ? 'bg-white border-red-200 shadow-sm'
              : 'bg-black/60 border-red-500/40'
          }`}>
            <div className="flex items-center justify-between">
              <span className={`text-[10px] font-mono uppercase tracking-widest ${
                isLight ? 'text-slate-500 font-bold' : 'text-gray-400'
              }`}>
                Cinema Pass ID
              </span>
              <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-red-500/20 text-red-600 dark:text-red-300 border border-red-500/40">
                ACTIVE
              </span>
            </div>
            <div className={`font-mono text-base font-bold tracking-widest ${
              isLight ? 'text-slate-900' : 'text-white'
            }`}>
              {currentUser?.id || 'GUEST-2026-VIP'}
            </div>
            <div className={`pt-2 border-t flex items-center justify-between text-xs font-mono ${
              isLight ? 'border-slate-200 text-slate-500' : 'border-white/10 text-gray-400'
            }`}>
              <span>Audience Tier: VIP</span>
              <span className="text-red-500 font-bold">CineRed</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. MAIN VIEW: COMPACT NON-SCROLLABLE BLOCKS GRID */}
      {activeBlock === null ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-1 border-b border-red-500/20">
            <div>
              <h2 className={`text-base sm:text-lg font-cinematic font-bold tracking-wider uppercase flex items-center space-x-2 ${
                isLight ? 'text-slate-900' : 'text-white'
              }`}>
                <Layers className="w-5 h-5 text-red-500" />
                <span>Audience Entertainment Terminals</span>
              </h2>
              <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>
                Click any block below to open its dedicated dashboard terminal.
              </p>
            </div>
            <span className={`text-xs font-mono ${isLight ? 'text-slate-500' : 'text-gray-400'}`}>
              7 Terminals Active
            </span>
          </div>

          {/* Interactive Grid of Blocks (Non-scrollable) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {GUEST_BLOCKS.map(block => {
              const Icon = block.icon;
              return (
                <div
                  key={block.id}
                  onClick={() => setActiveBlock(block.id)}
                  className={`p-5 rounded-3xl border transition-all duration-300 cursor-pointer flex flex-col justify-between group hover:scale-[1.02] shadow-lg ${
                    isLight
                      ? `${block.lightCardBg} shadow-slate-200/50`
                      : `bg-gradient-to-br ${block.darkCardGradient}`
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all group-hover:scale-110 ${
                        isLight
                          ? 'bg-red-50 border border-red-200'
                          : 'bg-black/50 border border-white/10'
                      }`}>
                        <Icon className={`w-6 h-6 ${block.accentColor}`} />
                      </div>

                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${block.badgeColor}`}>
                        {block.badge}
                      </span>
                    </div>

                    <div>
                      <h3 className={`text-base font-cinematic font-bold transition-colors group-hover:text-red-500 ${
                        isLight ? 'text-slate-900' : 'text-white'
                      }`}>
                        {block.title}
                      </h3>
                      <p className={`text-xs line-clamp-2 mt-1 leading-relaxed ${
                        isLight ? 'text-slate-600' : 'text-gray-400'
                      }`}>
                        {block.shortDesc}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-red-500/15 mt-4 space-y-2">
                    <div className={`text-[10px] font-mono px-2 py-1 rounded-lg border truncate flex items-center space-x-1 ${
                      isLight
                        ? 'bg-slate-50 border-slate-200 text-slate-700'
                        : block.authorityColor
                    }`}>
                      <Lock className="w-3 h-3 flex-shrink-0" />
                      <span className="truncate">{block.authority}</span>
                    </div>

                    <button
                      type="button"
                      className={`w-full py-2 px-3 rounded-xl text-xs font-bold font-cinematic uppercase tracking-wider flex items-center justify-center space-x-1.5 transition-all ${
                        isLight
                          ? 'bg-red-600 hover:bg-red-500 text-white shadow-sm'
                          : 'bg-white/10 hover:bg-red-600 text-white group-hover:bg-red-600'
                      }`}
                    >
                      <span>Open Dashboard</span>
                      <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* 3. DEDICATED BLOCK DASHBOARD VIEW (WHEN CLICKED) */
        <div className="space-y-6 animate-fadeIn">
          
          {/* Top Bar: Back to Hub + Quick Switcher */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-red-500/20">
            <button
              onClick={() => setActiveBlock(null)}
              className={`px-4 py-2 rounded-2xl border font-bold text-xs uppercase tracking-wider font-cinematic flex items-center space-x-2 transition-all self-start ${
                isLight
                  ? 'bg-white hover:bg-red-50 border-red-300 text-red-600 shadow-sm'
                  : 'bg-black/60 hover:bg-white/10 border-red-500/40 text-red-300 hover:text-white'
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>← Back to Guest Hub</span>
            </button>

            {/* Quick Terminal Switcher Pills */}
            <div className="flex flex-wrap items-center gap-1.5">
              {GUEST_BLOCKS.map(b => (
                <button
                  key={b.id}
                  onClick={() => setActiveBlock(b.id)}
                  className={`px-2.5 py-1 rounded-xl text-[11px] font-semibold transition-all flex items-center space-x-1 ${
                    activeBlock === b.id
                      ? isLight
                        ? 'bg-red-600 text-white font-bold shadow-sm'
                        : 'bg-red-600 text-white font-bold shadow-glow-guest'
                      : isLight
                      ? 'bg-white hover:bg-red-50 text-slate-700 border border-slate-200'
                      : 'bg-black/40 hover:bg-white/10 text-gray-400 border border-white/5'
                  }`}
                >
                  <span>{b.title.split(' ')[0]}</span>
                </button>
              ))}
            </div>
          </div>

          {/* DEDICATED DASHBOARD CONTENT FOR THE SELECTED BLOCK */}
          {activeBlock === 'movies' && (
            <div className={`p-6 sm:p-8 rounded-3xl border shadow-xl space-y-6 ${
              isLight
                ? 'bg-white border-red-200 shadow-slate-200/50'
                : 'bg-gradient-to-br from-red-950/50 via-[#180608] to-[#0c0305] border-red-500/40 shadow-2xl'
            }`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-red-500/20">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-2xl bg-red-600/20 text-red-500 border border-red-500/40 flex items-center justify-center">
                    <Film className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className={`text-xl sm:text-2xl font-cinematic font-black flex items-center space-x-2 ${
                      isLight ? 'text-slate-900' : 'text-white'
                    }`}>
                      <span>Feature Movies & Screenings Console</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-red-500/20 text-red-500 border border-red-500/30">
                        0 Titles Available
                      </span>
                    </h2>
                    <p className={`text-xs ${isLight ? 'text-slate-600' : 'text-gray-400'}`}>
                      Full-length theatrical releases, festival contest films, and exclusive screening cuts.
                    </p>
                  </div>
                </div>

                <span className={`text-[11px] font-mono px-3 py-1 rounded-full border flex items-center space-x-1.5 self-start sm:self-auto ${
                  isLight
                    ? 'bg-red-50 border-red-200 text-red-700 font-bold'
                    : 'bg-red-950/50 border-red-500/30 text-red-300'
                }`}>
                  <Lock className="w-3.5 h-3.5 text-red-500" />
                  <span>Director & Producer Upload Only</span>
                </span>
              </div>

              {/* Empty State Card */}
              <div className={`p-12 rounded-2xl border text-center space-y-3 ${
                isLight
                  ? 'bg-slate-50/70 border-slate-200 text-slate-900'
                  : 'bg-black/40 border-red-500/20 text-white'
              }`}>
                <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto text-red-500">
                  <Film className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-cinematic font-bold">
                  No Movies Uploaded Yet
                </h3>
                <p className={`text-xs max-w-md mx-auto leading-relaxed ${
                  isLight ? 'text-slate-600' : 'text-gray-400'
                }`}>
                  The digital cinema screening vault is completely empty. Feature films, trailers, and official festival screening cuts will appear here as soon as verified filmmakers publish their masters.
                </p>
              </div>

              {/* Upload Restriction Notice */}
              <div className={`p-4 rounded-2xl border flex items-start space-x-3 text-xs ${
                isLight
                  ? 'bg-red-50 border-red-200 text-slate-800'
                  : 'bg-red-950/30 border-red-500/30 text-red-200'
              }`}>
                <ShieldAlert className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <div className={`font-bold font-cinematic uppercase tracking-wider ${
                    isLight ? 'text-red-700' : 'text-red-300'
                  }`}>
                    Upload Restrictions & Platform Governance
                  </div>
                  <p className={`text-[11px] leading-relaxed ${
                    isLight ? 'text-slate-700 font-medium' : 'text-gray-300'
                  }`}>
                    Feature films, teasers, and screening masters can <strong>only be uploaded by verified Film Directors, Producers, and Platform Administrators</strong>. Guest profiles possess view-only audience privileges with zero publishing rights.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeBlock === 'bookings' && (
            <div className={`p-6 sm:p-8 rounded-3xl border-2 border-dashed shadow-xl space-y-6 ${
              isLight
                ? 'bg-white border-amber-300 shadow-slate-200/50'
                : 'bg-gradient-to-br from-amber-950/40 via-[#180f05] to-[#0c0803] border-amber-500/40 shadow-2xl'
            }`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-amber-500/20">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-500 border border-amber-500/40 flex items-center justify-center">
                    <Ticket className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className={`text-xl sm:text-2xl font-cinematic font-black flex items-center space-x-2 ${
                      isLight ? 'text-slate-900' : 'text-white'
                    }`}>
                      <span>Cinema Bookings & Premiere Passes</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-300 border border-amber-500/30">
                        0 Active Passes
                      </span>
                    </h2>
                    <p className={`text-xs ${isLight ? 'text-slate-600' : 'text-gray-400'}`}>
                      Reserve virtual auditorium seats, premiere gala tickets, and festival day passes.
                    </p>
                  </div>
                </div>

                <span className={`text-[11px] font-mono px-3 py-1 rounded-full border flex items-center space-x-1.5 self-start sm:self-auto ${
                  isLight
                    ? 'bg-amber-50 border-amber-200 text-amber-800 font-bold'
                    : 'bg-amber-950/50 border-amber-500/30 text-amber-300'
                }`}>
                  <Lock className="w-3.5 h-3.5 text-amber-500" />
                  <span>Controlled by Admin & Studio Partners</span>
                </span>
              </div>

              {/* Empty State Card */}
              <div className={`p-12 rounded-2xl border text-center space-y-3 ${
                isLight
                  ? 'bg-amber-50/40 border-amber-200 text-slate-900'
                  : 'bg-black/40 border-amber-500/20 text-white'
              }`}>
                <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-500">
                  <Ticket className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-cinematic font-bold">
                  No Active Cinema Bookings Available
                </h3>
                <p className={`text-xs max-w-md mx-auto leading-relaxed ${
                  isLight ? 'text-slate-600' : 'text-gray-400'
                }`}>
                  There are currently zero open booking allocations. Theatrical screenings and digital premiere passes will be scheduled here ahead of official release dates.
                </p>
              </div>

              <div className={`p-4 rounded-2xl border flex items-start space-x-3 text-xs ${
                isLight
                  ? 'bg-amber-50 border-amber-200 text-slate-800'
                  : 'bg-amber-950/30 border-amber-500/30 text-amber-200'
              }`}>
                <Info className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <div className={`font-bold font-cinematic uppercase tracking-wider ${
                    isLight ? 'text-amber-800' : 'text-amber-300'
                  }`}>
                    Booking Management & Partner Scheduling
                  </div>
                  <p className={`text-[11px] leading-relaxed ${
                    isLight ? 'text-slate-700 font-medium' : 'text-gray-300'
                  }`}>
                    Ticket allocations, virtual theatre seating maps, and premiere access passes are managed and scheduled exclusively by <strong>Platform Administrators and Verified External Studio Partners</strong>.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeBlock === 'events' && (
            <div className={`p-6 sm:p-8 rounded-3xl border shadow-xl space-y-6 ${
              isLight
                ? 'bg-white border-purple-200 shadow-slate-200/50'
                : 'bg-gradient-to-br from-purple-950/50 via-[#13071c] to-[#0a030f] border-purple-500/40 shadow-2xl'
            }`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-purple-500/20">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-2xl bg-purple-600/20 text-purple-500 border border-purple-500/40 flex items-center justify-center">
                    <Radio className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className={`text-xl sm:text-2xl font-cinematic font-black flex items-center space-x-2 ${
                      isLight ? 'text-slate-900' : 'text-white'
                    }`}>
                      <span>Live Events & Red Carpet Q&A Console</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-600 dark:text-purple-300 border border-purple-500/30">
                        0 Scheduled
                      </span>
                    </h2>
                    <p className={`text-xs ${isLight ? 'text-slate-600' : 'text-gray-400'}`}>
                      Interactive director panels, festival red carpet live streams, and fan Q&A sessions.
                    </p>
                  </div>
                </div>

                <span className={`text-[11px] font-mono px-3 py-1 rounded-full border flex items-center space-x-1.5 self-start sm:self-auto ${
                  isLight
                    ? 'bg-purple-50 border-purple-200 text-purple-800 font-bold'
                    : 'bg-purple-950/50 border-purple-500/30 text-purple-300'
                }`}>
                  <Lock className="w-3.5 h-3.5 text-purple-500" />
                  <span>Managed by Admin & Studio Partners</span>
                </span>
              </div>

              {/* Empty State Card */}
              <div className={`p-12 rounded-2xl border text-center space-y-3 ${
                isLight
                  ? 'bg-purple-50/40 border-purple-200 text-slate-900'
                  : 'bg-black/40 border-purple-500/20 text-white'
              }`}>
                <div className="w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center mx-auto text-purple-500">
                  <Radio className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-cinematic font-bold">
                  No Upcoming Live Events Scheduled
                </h3>
                <p className={`text-xs max-w-md mx-auto leading-relaxed ${
                  isLight ? 'text-slate-600' : 'text-gray-400'
                }`}>
                  No live stages or red carpet events are currently broadcasting. Check back during scheduled film festival windows and studio launch days.
                </p>
              </div>

              <div className={`p-4 rounded-2xl border flex items-start space-x-3 text-xs ${
                isLight
                  ? 'bg-purple-50 border-purple-200 text-slate-800'
                  : 'bg-purple-950/30 border-purple-500/30 text-purple-200'
              }`}>
                <Info className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <div className={`font-bold font-cinematic uppercase tracking-wider ${
                    isLight ? 'text-purple-800' : 'text-purple-300'
                  }`}>
                    Live Broadcast Production Authority
                  </div>
                  <p className={`text-[11px] leading-relaxed ${
                    isLight ? 'text-slate-700 font-medium' : 'text-gray-300'
                  }`}>
                    Live streaming links, stage hosting, and audience interaction queues are created and broadcasted exclusively by <strong>Platform Administrators and Official Studio Partners</strong>.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeBlock === 'updates' && (
            <div className={`p-6 sm:p-8 rounded-3xl border shadow-xl space-y-6 ${
              isLight
                ? 'bg-white border-cyan-200 shadow-slate-200/50'
                : 'bg-gradient-to-br from-cyan-950/40 via-[#061417] to-[#030a0c] border-cyan-500/40 shadow-2xl'
            }`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-cyan-500/20">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-2xl bg-cyan-600/20 text-cyan-500 border border-cyan-500/40 flex items-center justify-center">
                    <Megaphone className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className={`text-xl sm:text-2xl font-cinematic font-black flex items-center space-x-2 ${
                      isLight ? 'text-slate-900' : 'text-white'
                    }`}>
                      <span>Studio Updates & Production Bulletins</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-600 dark:text-cyan-300 border border-cyan-500/30">
                        0 Bulletins
                      </span>
                    </h2>
                    <p className={`text-xs ${isLight ? 'text-slate-600' : 'text-gray-400'}`}>
                      Production diaries, principal photography wraps, casting announcements, and teasers.
                    </p>
                  </div>
                </div>

                <span className={`text-[11px] font-mono px-3 py-1 rounded-full border flex items-center space-x-1.5 self-start sm:self-auto ${
                  isLight
                    ? 'bg-cyan-50 border-cyan-200 text-cyan-800 font-bold'
                    : 'bg-cyan-950/50 border-cyan-500/30 text-cyan-300'
                }`}>
                  <Lock className="w-3.5 h-3.5 text-cyan-500" />
                  <span>Director, Producer & Admin Only</span>
                </span>
              </div>

              {/* Empty State Card */}
              <div className={`p-12 rounded-2xl border text-center space-y-3 font-mono ${
                isLight
                  ? 'bg-cyan-50/40 border-cyan-200 text-slate-900'
                  : 'bg-black/40 border-cyan-500/20 text-white'
              }`}>
                <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mx-auto text-cyan-500">
                  <Megaphone className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-cinematic font-bold">
                  No Studio Updates Posted Yet
                </h3>
                <p className={`text-xs max-w-md mx-auto leading-relaxed ${
                  isLight ? 'text-slate-600' : 'text-gray-400'
                }`}>
                  Official film production journals and studio announcements will appear here as directors and producers log milestones from active film sets.
                </p>
              </div>

              <div className={`p-4 rounded-2xl border flex items-start space-x-3 text-xs ${
                isLight
                  ? 'bg-cyan-50 border-cyan-200 text-slate-800'
                  : 'bg-cyan-950/30 border-cyan-500/30 text-cyan-200'
              }`}>
                <Info className="w-5 h-5 text-cyan-500 flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <div className={`font-bold font-cinematic uppercase tracking-wider ${
                    isLight ? 'text-cyan-800' : 'text-cyan-300'
                  }`}>
                    Production Journal Authorization
                  </div>
                  <p className={`text-[11px] leading-relaxed ${
                    isLight ? 'text-slate-700 font-medium' : 'text-gray-300'
                  }`}>
                    Official bulletins, casting releases, and teaser logs can only be authored by <strong>verified Film Directors, Film Producers, and Platform Administrators</strong>.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeBlock === 'alerts' && (
            <div className={`p-6 sm:p-8 rounded-3xl border shadow-xl space-y-6 ${
              isLight
                ? 'bg-white border-rose-200 shadow-slate-200/50'
                : 'bg-gradient-to-br from-rose-950/50 via-[#18060a] to-[#0c0305] border-rose-500/40 shadow-2xl'
            }`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-rose-500/20">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-2xl bg-rose-600/20 text-rose-500 border border-rose-500/40 flex items-center justify-center">
                    <Bell className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className={`text-xl sm:text-2xl font-cinematic font-black flex items-center space-x-2 ${
                      isLight ? 'text-slate-900' : 'text-white'
                    }`}>
                      <span>Audience Alerts & Broadcasts Console</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-600 dark:text-rose-300 border border-rose-500/30">
                        0 Active Alerts
                      </span>
                    </h2>
                    <p className={`text-xs ${isLight ? 'text-slate-600' : 'text-gray-400'}`}>
                      Critical premiere schedule shifts, studio advisories, and network bulletins.
                    </p>
                  </div>
                </div>

                <span className={`text-[11px] font-mono px-3 py-1 rounded-full border flex items-center space-x-1.5 self-start sm:self-auto ${
                  isLight
                    ? 'bg-rose-50 border-rose-200 text-rose-800 font-bold'
                    : 'bg-rose-950/50 border-rose-500/30 text-rose-300'
                }`}>
                  <Lock className="w-3.5 h-3.5 text-rose-500" />
                  <span>Director, Producer & Admin Dispatched</span>
                </span>
              </div>

              {/* Empty State Card */}
              <div className={`p-12 rounded-2xl border text-center space-y-3 ${
                isLight
                  ? 'bg-rose-50/40 border-rose-200 text-slate-900'
                  : 'bg-black/40 border-rose-500/20 text-white'
              }`}>
                <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center mx-auto text-rose-500">
                  <Bell className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-cinematic font-bold">
                  No Guest Alerts Currently Active
                </h3>
                <p className={`text-xs max-w-md mx-auto leading-relaxed ${
                  isLight ? 'text-slate-600' : 'text-gray-400'
                }`}>
                  Your inbox is completely clear. Important studio dispatches, screening start times, and emergency platform notices will appear here automatically.
                </p>
              </div>

              <div className={`p-4 rounded-2xl border flex items-start space-x-3 text-xs ${
                isLight
                  ? 'bg-rose-50 border-rose-200 text-slate-800'
                  : 'bg-rose-950/30 border-rose-500/30 text-rose-200'
              }`}>
                <AlertTriangle className="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <div className={`font-bold font-cinematic uppercase tracking-wider ${
                    isLight ? 'text-rose-800' : 'text-rose-300'
                  }`}>
                    Studio Alert Dispatch Rules
                  </div>
                  <p className={`text-[11px] leading-relaxed ${
                    isLight ? 'text-slate-700 font-medium' : 'text-gray-300'
                  }`}>
                    Only <strong>Film Directors, Film Producers, and Platform Administrators</strong> can trigger broadcast alerts to guest audience inboxes.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeBlock === 'perks' && (
            <div className={`p-6 sm:p-8 rounded-3xl border shadow-xl space-y-6 ${
              isLight
                ? 'bg-white border-pink-200 shadow-slate-200/50'
                : 'bg-gradient-to-br from-pink-950/40 via-[#190612] to-[#0a030b] border-pink-500/40 shadow-2xl'
            }`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-pink-500/20">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-2xl bg-pink-600/20 text-pink-500 border border-pink-500/40 flex items-center justify-center">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className={`text-xl sm:text-2xl font-cinematic font-black flex items-center space-x-2 ${
                      isLight ? 'text-slate-900' : 'text-white'
                    }`}>
                      <span>CinePass VIP Perks & Collectibles</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-600 dark:text-pink-300 border border-pink-500/30">
                        VIP Level 1
                      </span>
                    </h2>
                    <p className={`text-xs ${isLight ? 'text-slate-600' : 'text-gray-400'}`}>
                      Earn CinePoints, autographed digital memorabilia, early-bird merchandise, and meet-and-greet passes.
                    </p>
                  </div>
                </div>

                <span className={`text-[11px] font-mono px-3 py-1 rounded-full border flex items-center space-x-1.5 self-start sm:self-auto ${
                  isLight
                    ? 'bg-pink-50 border-pink-200 text-pink-800 font-bold'
                    : 'bg-pink-950/50 border-pink-500/30 text-pink-300'
                }`}>
                  <Award className="w-3.5 h-3.5 text-pink-500" />
                  <span>Audience Loyalty Rewards</span>
                </span>
              </div>

              {/* Empty State Card */}
              <div className={`p-12 rounded-2xl border text-center space-y-3 ${
                isLight
                  ? 'bg-pink-50/40 border-pink-200 text-slate-900'
                  : 'bg-black/40 border-pink-500/20 text-white'
              }`}>
                <div className="w-16 h-16 rounded-2xl bg-pink-500/10 border border-pink-500/30 flex items-center justify-center mx-auto text-pink-500">
                  <Sparkles className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-cinematic font-bold">
                  No VIP Perks or Collectibles Unlocked Yet
                </h3>
                <p className={`text-xs max-w-md mx-auto leading-relaxed ${
                  isLight ? 'text-slate-600' : 'text-gray-400'
                }`}>
                  Attend virtual film screenings and rate festival showcases to unlock exclusive director commentaries, signed digital posters, and premiere gala badges.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className={`p-4 rounded-2xl border space-y-1 ${
                  isLight ? 'bg-slate-50 border-slate-200' : 'bg-black/30 border-pink-500/20'
                }`}>
                  <div className="text-xs font-bold text-pink-500 flex items-center space-x-1.5">
                    <Ticket className="w-4 h-4 text-pink-500" />
                    <span>Early-Bird Booking</span>
                  </div>
                  <p className={`text-[11px] ${isLight ? 'text-slate-600' : 'text-gray-400'}`}>
                    48-hour advance access to premier festival screenings and limited auditoriums.
                  </p>
                </div>

                <div className={`p-4 rounded-2xl border space-y-1 ${
                  isLight ? 'bg-slate-50 border-slate-200' : 'bg-black/30 border-pink-500/20'
                }`}>
                  <div className="text-xs font-bold text-pink-500 flex items-center space-x-1.5">
                    <Award className="w-4 h-4 text-pink-500" />
                    <span>Signed Memorabilia</span>
                  </div>
                  <p className={`text-[11px] ${isLight ? 'text-slate-600' : 'text-gray-400'}`}>
                    Official digital certificates and cast-autographed cinema art cards.
                  </p>
                </div>

                <div className={`p-4 rounded-2xl border space-y-1 ${
                  isLight ? 'bg-slate-50 border-slate-200' : 'bg-black/30 border-pink-500/20'
                }`}>
                  <div className="text-xs font-bold text-pink-500 flex items-center space-x-1.5">
                    <Heart className="w-4 h-4 text-pink-500" />
                    <span>Director Lounges</span>
                  </div>
                  <p className={`text-[11px] ${isLight ? 'text-slate-600' : 'text-gray-400'}`}>
                    VIP front-row access in virtual post-screening interactive Q&A stages.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeBlock === 'bts' && (
            <div className={`p-6 sm:p-8 rounded-3xl border shadow-xl space-y-6 ${
              isLight
                ? 'bg-white border-emerald-200 shadow-slate-200/50'
                : 'bg-gradient-to-br from-emerald-950/40 via-[#06150e] to-[#030c08] border-emerald-500/40 shadow-2xl'
            }`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-emerald-500/20">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-600/20 text-emerald-500 border border-emerald-500/40 flex items-center justify-center">
                    <Video className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className={`text-xl sm:text-2xl font-cinematic font-black flex items-center space-x-2 ${
                      isLight ? 'text-slate-900' : 'text-white'
                    }`}>
                      <span>Behind-The-Scenes (BTS) Vault</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 border border-emerald-500/30">
                        Vault: Locked
                      </span>
                    </h2>
                    <p className={`text-xs ${isLight ? 'text-slate-600' : 'text-gray-400'}`}>
                      Uncut rehearsal reels, optical camera tests, stunts breakdown, and director audio tracks.
                    </p>
                  </div>
                </div>

                <span className={`text-[11px] font-mono px-3 py-1 rounded-full border flex items-center space-x-1.5 self-start sm:self-auto ${
                  isLight
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-800 font-bold'
                    : 'bg-emerald-950/50 border-emerald-500/30 text-emerald-300'
                }`}>
                  <Lock className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Studio Production House Exclusives</span>
                </span>
              </div>

              {/* Empty State Card */}
              <div className={`p-12 rounded-2xl border text-center space-y-3 ${
                isLight
                  ? 'bg-emerald-50/40 border-emerald-200 text-slate-900'
                  : 'bg-black/40 border-emerald-500/20 text-white'
              }`}>
                <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-500">
                  <Video className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-cinematic font-bold">
                  Behind-The-Scenes Vault Is Currently Locked
                </h3>
                <p className={`text-xs max-w-md mx-auto leading-relaxed ${
                  isLight ? 'text-slate-600' : 'text-gray-400'
                }`}>
                  Production houses have not yet published archival rehearsal footage or stunt animatics. Once a movie wraps post-production, its exclusive BTS reels will unlock here.
                </p>
              </div>

              <div className={`p-4 rounded-2xl border flex items-start space-x-3 text-xs ${
                isLight
                  ? 'bg-emerald-50 border-emerald-200 text-slate-800'
                  : 'bg-emerald-950/30 border-emerald-500/30 text-emerald-200'
              }`}>
                <Info className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <div className={`font-bold font-cinematic uppercase tracking-wider ${
                    isLight ? 'text-emerald-800' : 'text-emerald-300'
                  }`}>
                    Archival Content Distribution
                  </div>
                  <p className={`text-[11px] leading-relaxed ${
                    isLight ? 'text-slate-700 font-medium' : 'text-gray-300'
                  }`}>
                    Behind-the-scenes master footage and audio commentaries are uploaded directly by <strong>verified Production Houses and Directors</strong> following theatrical releases.
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
};
