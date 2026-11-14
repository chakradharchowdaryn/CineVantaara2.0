import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { ROLE_THEMES, RoleThemeConfig } from '../utils/roleThemes';
import { ProfessionalRole } from '../types';

export type ThemeMode = 'light' | 'dark';

export type GlobalSkinId = 'TUSCAN_LINEN';

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
  TUSCAN_LINEN: {
    id: 'TUSCAN_LINEN',
    name: 'Smoked Ochre & Tuscan Linen',
    tagline: 'Warm Sandstone, Antique Ochre & Frosted Cashmere',
    cssClass: 'skin-tuscan-linen',
    primary: '#A67938',
    secondary: '#B88B4A',
    accent: '#D9C3A0',
    glow: 'rgba(166, 121, 56, 0.25)'
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
  DIRECTOR: '#A67938',
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
  SUPER_ADMIN: '#A67938',
  PLATFORM_ADMIN: '#A67938',
  GUEST: '#DC2626'
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { activeRole } = useAuth();
  const rawTheme = ROLE_THEMES[activeRole] || ROLE_THEMES.DIRECTOR;

  // CineVantaara is permanently themed in Tuscan Linen (warm, non-white light aesthetic)
  const [mode, setMode] = useState<ThemeMode>(() => {
    localStorage.setItem('cv_theme_mode', 'light');
    return 'light';
  });

  const [globalSkin, setGlobalSkinState] = useState<GlobalSkinId>(() => {
    // Purge old dark theme settings and migrate to Tuscan Linen
    localStorage.removeItem('cv_theme_v2_applied');
    localStorage.setItem('cv_global_skin', 'TUSCAN_LINEN');
    localStorage.setItem('cv_tuscan_applied', 'true');
    return 'TUSCAN_LINEN';
  });

  const currentSkinConfig = GLOBAL_SKINS.TUSCAN_LINEN;

  const setGlobalSkin = (_newSkin: GlobalSkinId) => {
    setGlobalSkinState('TUSCAN_LINEN');
    localStorage.setItem('cv_global_skin', 'TUSCAN_LINEN');
  };

  // Sync global skin to document root and body
  useEffect(() => {
    // Purge legacy skin classes
    const legacyClasses = [
      'skin-imax-gold',
      'skin-cyber-neon',
      'skin-vintage-noir',
      'skin-royal-velvet',
      'skin-emerald-studio',
      'skin-anamorphic-blue',
      'theme-dark',
      'dark'
    ];
    legacyClasses.forEach(cls => {
      document.documentElement.classList.remove(cls);
      document.body.classList.remove(cls);
    });

    document.documentElement.classList.add('skin-tuscan-linen', 'theme-light', 'light');
    document.body.classList.add('skin-tuscan-linen', 'theme-light', 'light');

    document.documentElement.style.setProperty('--skin-primary', currentSkinConfig.primary);
    document.documentElement.style.setProperty('--skin-secondary', currentSkinConfig.secondary);
    document.documentElement.style.setProperty('--skin-accent', currentSkinConfig.accent);
    document.documentElement.style.setProperty('--skin-glow', currentSkinConfig.glow);

    const linkIcon = document.querySelector("link[rel*='icon']") as HTMLLinkElement;
    if (linkIcon) {
      linkIcon.href = '/brand/logo-master.png';
    }
  }, [currentSkinConfig]);

  const theme = React.useMemo(() => {
    const highContrastAccent = LIGHT_ACCENT_COLORS[activeRole] || '#A67938';
    return {
      ...rawTheme,
      accentColor: highContrastAccent
    };
  }, [rawTheme, activeRole]);

  useEffect(() => {
    document.documentElement.classList.add('theme-light', 'light');
    document.documentElement.classList.remove('theme-dark', 'dark');
    document.documentElement.style.setProperty('--role-primary', theme.primaryColor);
    document.documentElement.style.setProperty('--role-secondary', theme.secondaryColor);
    document.documentElement.style.setProperty('--role-accent', theme.accentColor);
    document.documentElement.style.setProperty('--role-bg-tint', `${theme.primaryColor}14`);
    document.documentElement.style.setProperty('--role-border', `${theme.primaryColor}45`);
  }, [mode, theme]);

  const toggleThemeMode = () => {
    // Permanent light Tuscan Linen aesthetic
    setMode('light');
    localStorage.setItem('cv_theme_mode', 'light');
  };

  const setThemeMode = (_newMode: ThemeMode) => {
    setMode('light');
    localStorage.setItem('cv_theme_mode', 'light');
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
        className="theme-light skin-tuscan-linen min-h-screen"
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
