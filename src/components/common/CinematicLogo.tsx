import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

interface CinematicLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
  variant?: 'gold' | 'guest';
}

interface ThemeLogoStyle {
  src: string;
  glow: string;
  aura: string;
  cineGradient: string;
  vantaaraGradient: string;
  mottoColor: string;
  mottoLine: string;
}

const THEME_LOGO_CONFIG: Record<string, ThemeLogoStyle> = {
  IMAX_GOLD: {
    src: '/brand/logo-imax-gold.png',
    glow: 'rgba(245, 158, 11, 0.5)',
    aura: 'from-amber-500/35 via-yellow-400/25 to-amber-600/20',
    cineGradient: 'from-slate-100 via-sky-200 to-slate-200',
    vantaaraGradient: 'from-amber-300 via-amber-400 to-yellow-600',
    mottoColor: 'text-amber-300/90',
    mottoLine: 'bg-gradient-to-r from-transparent via-amber-400/60 to-transparent'
  },
  CYBER_NEON: {
    src: '/brand/logo-cyber-neon.png',
    glow: 'rgba(0, 240, 255, 0.65)',
    aura: 'from-cyan-500/40 via-fuchsia-500/30 to-blue-500/20',
    cineGradient: 'from-white via-cyan-200 to-sky-300',
    vantaaraGradient: 'from-cyan-300 via-pink-400 to-fuchsia-500',
    mottoColor: 'text-cyan-300/90',
    mottoLine: 'bg-gradient-to-r from-transparent via-cyan-400/70 to-transparent'
  },
  VINTAGE_NOIR: {
    src: '/brand/logo-vintage-noir.png',
    glow: 'rgba(212, 175, 55, 0.45)',
    aura: 'from-amber-700/35 via-yellow-600/25 to-amber-900/20',
    cineGradient: 'from-amber-100 via-orange-100 to-amber-200',
    vantaaraGradient: 'from-yellow-200 via-amber-400 to-yellow-700',
    mottoColor: 'text-amber-200/90',
    mottoLine: 'bg-gradient-to-r from-transparent via-amber-300/60 to-transparent'
  },
  ROYAL_VELVET: {
    src: '/brand/logo-royal-velvet.png',
    glow: 'rgba(168, 85, 247, 0.6)',
    aura: 'from-purple-600/40 via-violet-400/30 to-fuchsia-500/20',
    cineGradient: 'from-white via-purple-100 to-violet-200',
    vantaaraGradient: 'from-purple-300 via-violet-400 to-purple-600',
    mottoColor: 'text-violet-300/90',
    mottoLine: 'bg-gradient-to-r from-transparent via-purple-400/70 to-transparent'
  },
  EMERALD_STUDIO: {
    src: '/brand/logo-emerald-studio.png',
    glow: 'rgba(16, 185, 129, 0.6)',
    aura: 'from-emerald-500/40 via-teal-400/30 to-green-600/20',
    cineGradient: 'from-white via-emerald-100 to-teal-200',
    vantaaraGradient: 'from-emerald-300 via-teal-400 to-emerald-600',
    mottoColor: 'text-emerald-300/90',
    mottoLine: 'bg-gradient-to-r from-transparent via-emerald-400/70 to-transparent'
  },
  ANAMORPHIC_BLUE: {
    src: '/brand/logo-anamorphic-blue.png',
    glow: 'rgba(14, 165, 233, 0.65)',
    aura: 'from-sky-500/45 via-blue-500/30 to-cyan-400/25',
    cineGradient: 'from-white via-sky-100 to-blue-200',
    vantaaraGradient: 'from-sky-300 via-blue-400 to-cyan-500',
    mottoColor: 'text-sky-300/90',
    mottoLine: 'bg-gradient-to-r from-transparent via-sky-400/70 to-transparent'
  }
};

export const CinematicLogo: React.FC<CinematicLogoProps> = ({
  size = 'md',
  showText = true,
  className = '',
  variant
}) => {
  const { isGuest } = useAuth();
  const themeContext = useTheme();
  const globalSkin = themeContext?.globalSkin || 'IMAX_GOLD';

  const isGuestMode = variant === 'guest' || (variant === undefined && isGuest);
  const themeStyle = THEME_LOGO_CONFIG[globalSkin] || THEME_LOGO_CONFIG.IMAX_GOLD;

  const sizeMap = {
    sm: { icon: 'w-9 h-9', text: 'text-base', sub: 'text-[9px]', star: 'w-2 h-2' },
    md: { icon: 'w-12 h-12', text: 'text-xl', sub: 'text-[10px]', star: 'w-2.5 h-2.5' },
    lg: { icon: 'w-16 h-16', text: 'text-2xl', sub: 'text-xs', star: 'w-3.5 h-3.5' },
    xl: { icon: 'w-24 h-24', text: 'text-4xl', sub: 'text-sm', star: 'w-4 h-4' }
  }[size];

  // Guest override style (deep crimson & ruby)
  const currentSrc = isGuestMode ? '/brand/logo-master.png' : themeStyle.src;
  const currentGlow = isGuestMode ? 'rgba(239, 68, 68, 0.65)' : themeStyle.glow;
  const currentAura = isGuestMode
    ? 'from-red-600/50 via-rose-500/40 to-red-400/20'
    : themeStyle.aura;

  return (
    <div className={`flex items-center space-x-3 group cursor-pointer select-none ${className}`}>
      {/* 3D Cinematic Emblem with Dynamic Theme Aura */}
      <div
        className={`relative ${sizeMap.icon} flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform duration-500`}
      >
        {/* Soft Ambient Theme Glow Halo */}
        <div
          className={`absolute -inset-1.5 rounded-2xl blur-md group-hover:blur-lg opacity-80 group-hover:opacity-100 transition-all duration-500 bg-gradient-to-tr ${currentAura}`}
          style={{ filter: `drop-shadow(0 0 12px ${currentGlow})` }}
        />

        {/* 3D Film Strip & Camera Silhouette Emblem */}
        <div className="relative w-full h-full rounded-2xl overflow-hidden border border-white/20 p-0.5 bg-[#050608] shadow-2xl">
          <img
            src={currentSrc}
            alt="CineVantaara Emblem"
            className="w-full h-full object-cover rounded-[14px] transform group-hover:rotate-1 group-hover:scale-105 transition-transform duration-700 ease-out"
            loading="eager"
          />
          {/* Subtle Glass Gleam Reflection */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none rounded-[14px]" />
        </div>
      </div>

      {/* Brand Typography */}
      {showText && (
        <div className="flex flex-col">
          {/* Main Brand Title: "Cine" + "Vantaara" */}
          <div className={`font-cinematic font-black tracking-wider leading-none flex items-center ${sizeMap.text}`}>
            {/* "Cine" in Platinum Chrome with Theme Tint */}
            <span
              className={`bg-gradient-to-r ${
                isGuestMode
                  ? 'from-white via-rose-200 to-red-300'
                  : themeStyle.cineGradient
              } bg-clip-text text-transparent drop-shadow-sm font-black`}
            >
              Cine
            </span>

            {/* "Vantaara" in Luminous Theme 3D Gradient */}
            <span
              className={`bg-gradient-to-r ${
                isGuestMode
                  ? 'from-red-300 via-rose-400 to-red-600'
                  : themeStyle.vantaaraGradient
              } bg-clip-text text-transparent font-black tracking-wide ml-0.5 drop-shadow-[0_2px_8px_${currentGlow}]`}
            >
              Vantaara
            </span>

            {/* Guest Audience Mode Badge */}
            {isGuestMode && (
              <span className="ml-2 text-[9px] font-sans font-black tracking-wider uppercase px-2 py-0.5 rounded-full bg-red-600/30 text-red-300 border border-red-500/50 shadow-sm shadow-red-500/30">
                GUEST
              </span>
            )}
          </div>

          {/* Subtitle / Proverb: "— where stories meet talent —" */}
          <div className="flex items-center space-x-1.5 mt-1">
            <span className={`h-[1px] w-4 ${themeStyle.mottoLine}`} />
            <span
              className={`font-sans tracking-[0.22em] uppercase font-semibold ${sizeMap.sub} ${
                isGuestMode ? 'text-red-300/80' : themeStyle.mottoColor
              }`}
            >
              where stories meet talent
            </span>
            <span className={`h-[1px] w-4 ${themeStyle.mottoLine}`} />
          </div>
        </div>
      )}
    </div>
  );
};
