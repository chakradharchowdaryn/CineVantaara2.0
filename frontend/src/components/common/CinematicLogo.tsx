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
  TUSCAN_LINEN: {
    src: '/brand/logo-master.png',
    glow: 'rgba(166, 121, 56, 0.35)',
    aura: 'from-amber-700/25 via-amber-600/20 to-yellow-600/10',
    cineGradient: 'from-[#26211A] via-[#3D3228] to-[#26211A]',
    vantaaraGradient: 'from-[#B88B4A] via-[#A67938] to-[#8C6126]',
    mottoColor: 'text-[#665547]',
    mottoLine: 'bg-gradient-to-r from-transparent via-[#A67938]/40 to-transparent'
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
  const globalSkin = themeContext?.globalSkin || 'TUSCAN_LINEN';

  const isGuestMode = variant === 'guest' || (variant === undefined && isGuest);
  const themeStyle = THEME_LOGO_CONFIG[globalSkin] || THEME_LOGO_CONFIG.TUSCAN_LINEN;

  const sizeMap = {
    sm: { icon: 'w-9 h-9', text: 'text-base', sub: 'text-[9px]', star: 'w-2 h-2' },
    md: { icon: 'w-12 h-12', text: 'text-xl', sub: 'text-[10px]', star: 'w-2.5 h-2.5' },
    lg: { icon: 'w-16 h-16', text: 'text-2xl', sub: 'text-xs', star: 'w-3.5 h-3.5' },
    xl: { icon: 'w-24 h-24', text: 'text-4xl', sub: 'text-sm', star: 'w-4 h-4' }
  }[size];

  // Guest override style (deep crimson & ruby)
  const currentSrc = isGuestMode ? '/brand/logo-master.png' : themeStyle.src;
  const currentGlow = isGuestMode ? 'rgba(239, 68, 68, 0.45)' : themeStyle.glow;
  const currentAura = isGuestMode
    ? 'from-red-600/40 via-rose-500/30 to-red-400/20'
    : themeStyle.aura;

  return (
    <div className={`flex items-center space-x-3 group cursor-pointer select-none ${className}`}>
      {/* 3D Cinematic Emblem with Warm Tuscan Aura */}
      <div
        className={`relative ${sizeMap.icon} flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform duration-500`}
      >
        {/* Soft Ambient Theme Glow Halo */}
        <div
          className={`absolute -inset-1.5 rounded-2xl blur-md group-hover:blur-lg opacity-80 group-hover:opacity-100 transition-all duration-500 bg-gradient-to-tr ${currentAura}`}
          style={{ filter: `drop-shadow(0 0 10px ${currentGlow})` }}
        />

        {/* 3D Film Strip & Camera Silhouette Emblem */}
        <div className="relative w-full h-full rounded-2xl overflow-hidden border border-[#E8E2D8] p-0.5 bg-[#FAF8F5] shadow-md">
          <img
            src={currentSrc}
            alt="CineVantaara Emblem"
            className="w-full h-full object-cover rounded-[14px] transform group-hover:rotate-1 group-hover:scale-105 transition-transform duration-700 ease-out"
            loading="eager"
          />
          {/* Subtle Glass Gleam Reflection */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/40 to-transparent pointer-events-none rounded-[14px]" />
        </div>
      </div>

      {/* Brand Typography */}
      {showText && (
        <div className="flex flex-col">
          {/* Main Brand Title: "Cine" + "Vantaara" */}
          <div className={`font-cinematic font-black tracking-wider leading-none flex items-center ${sizeMap.text}`}>
            {/* "Cine" in Deep Espresso Bronze */}
            <span
              className={`bg-gradient-to-r ${
                isGuestMode
                  ? 'from-red-950 via-rose-900 to-red-800'
                  : themeStyle.cineGradient
              } bg-clip-text text-transparent drop-shadow-sm font-black`}
            >
              Cine
            </span>

            {/* "Vantaara" in Antique Ochre Amber */}
            <span
              className={`bg-gradient-to-r ${
                isGuestMode
                  ? 'from-red-600 via-rose-600 to-red-700'
                  : themeStyle.vantaaraGradient
              } bg-clip-text text-transparent font-black tracking-wide ml-0.5`}
            >
              Vantaara
            </span>

            {/* Guest Audience Mode Badge */}
            {isGuestMode && (
              <span className="ml-2 text-[9px] font-sans font-black tracking-wider uppercase px-2 py-0.5 rounded-full bg-red-100 text-red-700 border border-red-300 shadow-sm">
                GUEST
              </span>
            )}
          </div>

          {/* Subtitle / Proverb: "— where stories meet talent —" */}
          <div className="flex items-center space-x-1.5 mt-1">
            <span className={`h-[1px] w-4 ${themeStyle.mottoLine}`} />
            <span
              className={`font-sans tracking-[0.22em] uppercase font-semibold ${sizeMap.sub} ${
                isGuestMode ? 'text-red-700/80' : themeStyle.mottoColor
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
