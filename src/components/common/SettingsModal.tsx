import React, { useRef } from 'react';
import { useBgm } from '../../context/BgmContext';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage, SUPPORTED_LANGUAGES } from '../../context/LanguageContext';
import {
  Settings,
  Volume2,
  VolumeX,
  X,
  Music,
  Sun,
  Moon,
  Globe,
  Camera,
  Activity,
  Sliders,
  Sparkles
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const SettingsModal: React.FC = () => {
  const {
    isBgmEnabled,
    toggleBgm,
    volume,
    setVolume,
    reduceMotion,
    setReduceMotion,
    isSettingsOpen,
    closeSettings,
    currentTrack
  } = useBgm();

  const { currentUser, updateProfile } = useAuth();
  const { mode, toggleThemeMode } = useTheme();
  const { currentLanguage, setLanguage, t } = useLanguage();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isSettingsOpen) return null;

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          updateProfile({ avatarUrl: reader.result });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#111218] border border-white/15 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-cinematic font-bold text-white">
                {t('nav.settings', 'Studio & Platform Settings')}
              </h3>
              <p className="text-xs text-gray-400">
                Personalize theme, language, sound, and profile
              </p>
            </div>
          </div>
          <button
            onClick={closeSettings}
            className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 1. Profile Picture Quick Upload */}
        {currentUser && (
          <div className="p-4 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="relative group">
                <img
                  src={currentUser.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80'}
                  alt={currentUser.name}
                  className="w-12 h-12 rounded-2xl object-cover border border-amber-500/40 shadow-md"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute inset-0 bg-black/60 rounded-2xl opacity-0 group-hover:opacity-100 flex items-center justify-center text-amber-400 transition-opacity"
                  title="Upload profile image"
                >
                  <Camera className="w-4 h-4" />
                </button>
              </div>
              <div>
                <div className="text-xs font-bold text-white">{currentUser.name}</div>
                <div className="text-[11px] text-gray-400">{currentUser.email}</div>
                <div className="text-[10px] text-amber-400 font-mono mt-0.5">
                  Role: {currentUser.activeRole}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageFileChange}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-amber-500/15 border border-amber-500/30 text-amber-300 hover:bg-amber-500/25 transition-all flex items-center space-x-1"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Upload Image</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  closeSettings();
                  navigate('/profile');
                }}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-white/5 border border-white/10 text-gray-300 hover:text-white transition-all"
              >
                Edit Details
              </button>
            </div>
          </div>
        )}

        {/* 2. Theme Toggle (Dark Cinema vs Light Studio) */}
        <div className="p-4 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-xl ${mode === 'light' ? 'bg-amber-500/20 text-amber-400' : 'bg-purple-500/20 text-purple-400'}`}>
              {mode === 'light' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </div>
            <div>
              <div className="text-sm font-bold text-white">
                {mode === 'light' ? t('theme.light', 'Light Studio Theme') : t('theme.dark', 'Dark Cinema Theme')}
              </div>
              <div className="text-xs text-gray-400">
                {mode === 'light'
                  ? 'Crisp white surfaces with vibrant role color highlights'
                  : 'Deep atmospheric black cinema palette'}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={toggleThemeMode}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all ${
              mode === 'light'
                ? 'bg-amber-500 text-black border-amber-400 font-black shadow-md'
                : 'bg-white/10 text-white border-white/15 hover:bg-white/15'
            }`}
          >
            {mode === 'light' ? 'Switch to Dark' : 'Switch to Light'}
          </button>
        </div>

        {/* 3. Global & Indian Multilingual NLP Localization */}
        <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-3">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">
                Multilingual NLP Localization
              </div>
              <div className="text-xs text-gray-400">
                Translate entire platform into Indian and global languages
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 pt-1">
            {SUPPORTED_LANGUAGES.map(lang => (
              <button
                key={lang.code}
                onClick={() => setLanguage(lang.code)}
                className={`p-2 rounded-xl text-xs text-left transition-all border ${
                  currentLanguage === lang.code
                    ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 font-bold'
                    : 'bg-black/30 border-white/5 text-gray-400 hover:text-white hover:border-white/15'
                }`}
              >
                <div className="truncate font-medium">{lang.nativeName}</div>
                <div className="text-[10px] text-gray-500 truncate">{lang.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* 4. Anime BGM Soundtrack Control */}
        <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-xl ${isBgmEnabled ? 'bg-amber-500/20 text-amber-400' : 'bg-white/5 text-gray-500'}`}>
                {isBgmEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
              </div>
              <div>
                <div className="text-sm font-bold text-white">
                  Role Anime BGM Soundtrack
                </div>
                <div className="text-xs text-gray-400">
                  Unique anime soundtrack for your assigned cinema role
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => toggleBgm(!isBgmEnabled)}
              className={`relative inline-flex h-6 w-12 items-center rounded-full transition-colors ${
                isBgmEnabled ? 'bg-amber-500' : 'bg-gray-700'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-black transition-transform ${
                  isBgmEnabled ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Active Track Info */}
          <div className="pt-2 border-t border-white/5 text-xs flex items-center justify-between">
            <div>
              <span className="text-gray-500 uppercase font-mono text-[10px]">Current Theme:</span>
              <div className="font-bold text-amber-300 mt-0.5 flex items-center space-x-1.5">
                <Music className="w-3.5 h-3.5" />
                <span>{currentTrack.anime} — {currentTrack.title.split('—')[0]}</span>
              </div>
            </div>
            <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-full border ${
              isBgmEnabled
                ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                : 'bg-red-500/10 text-red-300 border-red-500/30'
            }`}>
              {isBgmEnabled ? 'Playing' : 'Muted'}
            </span>
          </div>

          {/* Volume Slider */}
          {isBgmEnabled && (
            <div className="space-y-1 pt-1">
              <div className="flex justify-between text-[11px] text-gray-400">
                <span>Soundtrack Volume</span>
                <span className="font-mono">{Math.round(volume * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                className="w-full h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
            </div>
          )}
        </div>

        {/* 5. Shaky Animation & Camera Motion Disable */}
        <div className="p-4 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-xl ${reduceMotion || !isBgmEnabled ? 'bg-amber-500/20 text-amber-400' : 'bg-white/5 text-gray-500'}`}>
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">
                Disable Shaky Animations & Motion
              </div>
              <div className="text-xs text-gray-400">
                Eliminates camera shake, pulse, and kinetic tremors (auto-stops when music is muted)
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setReduceMotion(!reduceMotion)}
            className={`relative inline-flex h-6 w-12 items-center rounded-full transition-colors ${
              reduceMotion || !isBgmEnabled ? 'bg-amber-500' : 'bg-gray-700'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-black transition-transform ${
                reduceMotion || !isBgmEnabled ? 'translate-x-7' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-2 border-t border-white/10">
          <button
            onClick={closeSettings}
            className="px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-amber-500 hover:bg-amber-400 text-black shadow-glow-gold transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
