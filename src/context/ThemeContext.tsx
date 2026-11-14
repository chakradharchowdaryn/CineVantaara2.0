import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { ROLE_THEMES, RoleThemeConfig } from '../utils/roleThemes';
import { ProfessionalRole } from '../types';

export type ThemeMode = 'dark' | 'light';

export type GlobalSkinId =
  | 'IMAX_GOLD'
  | 'CYBER_NEON'
  | 'VINTAGE_NOIR'
  | 'ROYAL_VELVET'
  | 'EMERALD_STUDIO'
  | 'ANAMORPHIC_BLUE';

export interface GlobalSkinConfig {
  id: GlobalSkinId;
  name: string;
  tagline: string;
  cssClass: string;
  primary: string;
  secondary: string;
  accent: string;
  glow: string;
}

export const GLOBAL_SKINS: Record<GlobalSkinId, GlobalSkinConfig> = {
  IMAX_GOLD: {
    id: 'IMAX_GOLD',
    name: 'IMAX Gold & Obsidian',
    tagline: 'Hollywood Red Carpet & Champagne Gold',
    cssClass: 'skin-imax-gold',
    primary: '#F59E0B',
    secondary: '#D97706',
    accent: '#FDE68A',
    glow: 'rgba(245, 158, 11, 0.35)'
  },
  CYBER_NEON: {
    id: 'CYBER_NEON',
    name: 'Cyber-Cinema Neon',
    tagline: 'Electric Crimson & Laser Cyan',
    cssClass: 'skin-cyber-neon',
    primary: '#EF4444',
    secondary: '#06B6D4',
    accent: '#F43F5E',
    glow: 'rgba(239, 68, 68, 0.4)'
  },
  VINTAGE_NOIR: {
    id: 'VINTAGE_NOIR',
    name: 'Vintage 35mm Noir',
    tagline: 'Golden-Age Warm Sepia & Cream',
    cssClass: 'skin-vintage-noir',
    primary: '#FEF3C7',
    secondary: '#B45309',
    accent: '#7F1D1D',
    glow: 'rgba(217, 119, 6, 0.3)'
  },
  ROYAL_VELVET: {
    id: 'ROYAL_VELVET',
    name: 'Royal Velvet & Amethyst',
    tagline: 'Cannes & Festival Prestige Purple',
    cssClass: 'skin-royal-velvet',
    primary: '#9333EA',
    secondary: '#C084FC',
    accent: '#E2E8F0',
    glow: 'rgba(147, 51, 234, 0.4)'
  },
  EMERALD_STUDIO: {
    id: 'EMERALD_STUDIO',
    name: 'Emerald Studio & Gold',
    tagline: 'Executive Studio Greenlight & Escrow',
    cssClass: 'skin-emerald-studio',
    primary: '#10B981',
    secondary: '#EAB308',
    accent: '#34D399',
    glow: 'rgba(16, 185, 129, 0.4)'
  },
  ANAMORPHIC_BLUE: {
    id: 'ANAMORPHIC_BLUE',
    name: 'Anamorphic Prism Blue',
    tagline: 'ARRI 70mm & Panavision Lens Flare',
    cssClass: 'skin-anamorphic-blue',
    primary: '#0EA5E9',
    secondary: '#38BDF8',
    accent: '#F8FAFC',
    glow: 'rgba(14, 165, 233, 0.4)'
  }
};

interface ThemeContextType {
  theme: RoleThemeConfig;
  activeRole: ProfessionalRole;
  mode: ThemeMode;
  toggleThemeMode: () => void;
  setThemeMode: (mode: ThemeMode) => void;
  globalSkin: GlobalSkinId;
  setGlobalSkin: (skin: GlobalSkinId) => void;
  currentSkinConfig: GlobalSkinConfig;
}

const LIGHT_ACCENT_COLORS: Record<string, string> = {
  DIRECTOR: '#6B21A8',
  PRODUCER: '#047857',
  WRITER: '#9F1239',
  ACTOR: '#BE185D',
  CINEMATOGRAPHER: '#0369A1',
  EDITOR: '#0E7490',
  MUSIC_DIRECTOR: '#6B21A8',
  SOUND_ENGINEER: '#5B21B6',
  GAFFER: '#B45309',
  PRODUCTION_DESIGNER: '#92400E',
  COSTUME_DESIGNER: '#9D174D',
  VFX_ARTIST: '#0F766E',
  COLORIST: '#334155',
  STUNT_COORDINATOR: '#991B1B',
  MAKEUP_ARTIST: '#9F1239',
  SCRIPT_SUPERVISOR: '#3730A3',
  BOOM_OPERATOR: '#991B1B',
  ASSISTANT_DIRECTOR: '#854D0E',
  DRONE_OPERATOR: '#047857',
  VOICE_ACTOR: '#9D174D',
  LINE_PRODUCER: '#92400E',
  CASTING_DIRECTOR: '#0369A1',
  CHOREOGRAPHER: '#0E7490',
  LOCATION_MANAGER: '#9A3412',
  SUPER_ADMIN: '#B45309',
  PLATFORM_ADMIN: '#B45309',
  GUEST: '#DC2626'
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { activeRole } = useAuth();
  const rawTheme = ROLE_THEMES[activeRole] || ROLE_THEMES.DIRECTOR;

  const [mode, setMode] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('cv_theme_mode');
    return (saved === 'light' || saved === 'dark') ? saved : 'dark';
  });

  const [globalSkin, setGlobalSkinState] = useState<GlobalSkinId>(() => {
    const saved = localStorage.getItem('cv_global_skin') as GlobalSkinId;
    return (saved && GLOBAL_SKINS[saved]) ? saved : 'IMAX_GOLD';
  });

  const currentSkinConfig = GLOBAL_SKINS[globalSkin] || GLOBAL_SKINS.IMAX_GOLD;

  const setGlobalSkin = (newSkin: GlobalSkinId) => {
    setGlobalSkinState(newSkin);
    localStorage.setItem('cv_global_skin', newSkin);
  };

  // Sync global skins to document root and body
  useEffect(() => {
    Object.values(GLOBAL_SKINS).forEach(skin => {
      document.documentElement.classList.remove(skin.cssClass);
      document.body.classList.remove(skin.cssClass);
    });
    document.documentElement.classList.add(currentSkinConfig.cssClass);
    document.body.classList.add(currentSkinConfig.cssClass);
    document.documentElement.style.setProperty('--skin-primary', currentSkinConfig.primary);
    document.documentElement.style.setProperty('--skin-secondary', currentSkinConfig.secondary);
    document.documentElement.style.setProperty('--skin-accent', currentSkinConfig.accent);
    document.documentElement.style.setProperty('--skin-glow', currentSkinConfig.glow);

    // Dynamic browser tab favicon morphing according to current skin
    const faviconMap: Record<GlobalSkinId, string> = {
      IMAX_GOLD: '/brand/logo-imax-gold.png',
      CYBER_NEON: '/brand/logo-cyber-neon.png',
      VINTAGE_NOIR: '/brand/logo-vintage-noir.png',
      ROYAL_VELVET: '/brand/logo-royal-velvet.png',
      EMERALD_STUDIO: '/brand/logo-emerald-studio.png',
      ANAMORPHIC_BLUE: '/brand/logo-anamorphic-blue.png'
    };
    const targetFavicon = faviconMap[currentSkinConfig.id] || '/favicon.png';
    const linkIcon = document.querySelector("link[rel*='icon']") as HTMLLinkElement;
    if (linkIcon) {
      linkIcon.href = targetFavicon;
    }
  }, [currentSkinConfig]);

  const theme = React.useMemo(() => {
    if (mode === 'light') {
      const highContrastAccent = LIGHT_ACCENT_COLORS[activeRole] || '#B45309';
      return {
        ...rawTheme,
        accentColor: highContrastAccent
      };
    }
    return rawTheme;
  }, [rawTheme, mode, activeRole]);

  useEffect(() => {
    localStorage.setItem('cv_theme_mode', mode);
    if (mode === 'light') {
      document.documentElement.classList.add('theme-light');
      document.documentElement.classList.remove('theme-dark');
      document.documentElement.style.setProperty('--role-primary', theme.primaryColor);
      document.documentElement.style.setProperty('--role-secondary', theme.secondaryColor);
      document.documentElement.style.setProperty('--role-accent', theme.accentColor);
      document.documentElement.style.setProperty('--role-bg-tint', `${theme.primaryColor}14`);
      document.documentElement.style.setProperty('--role-border', `${theme.primaryColor}45`);
    } else {
      document.documentElement.classList.add('theme-dark');
      document.documentElement.classList.remove('theme-light');
      document.documentElement.style.removeProperty('--role-bg-tint');
      document.documentElement.style.removeProperty('--role-border');
    }
  }, [mode, theme]);

  const toggleThemeMode = () => {
    setMode(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const setThemeMode = (newMode: ThemeMode) => {
    setMode(newMode);
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        activeRole,
        mode,
        toggleThemeMode,
        setThemeMode,
        globalSkin,
        setGlobalSkin,
        currentSkinConfig
      }}
    >
      <div
        className={`${mode === 'light' ? 'theme-light' : 'theme-dark'} ${currentSkinConfig.cssClass}`}
        style={{
          // @ts-ignore
          '--role-primary': theme.primaryColor,
          '--role-secondary': theme.secondaryColor,
          '--role-accent': theme.accentColor,
          '--skin-primary': currentSkinConfig.primary,
          '--skin-secondary': currentSkinConfig.secondary,
          '--skin-accent': currentSkinConfig.accent,
          '--skin-glow': currentSkinConfig.glow
        }}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
