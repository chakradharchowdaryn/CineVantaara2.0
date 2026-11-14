import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme, GLOBAL_SKINS, GlobalSkinId } from '../../context/ThemeContext';
import { useNotifications } from '../../context/NotificationContext';
import { useBgm } from '../../context/BgmContext';
import { useLanguage, SUPPORTED_LANGUAGES } from '../../context/LanguageContext';
import { ProfessionalRole } from '../../types';
import { CinematicLogo } from '../common/CinematicLogo';
import {
  Bell,
  MessageSquare,
  Sparkles,
  Users,
  Briefcase,
  ChevronDown,
  LogOut,
  Shield,
  Layers,
  CheckCircle,
  Menu,
  X,
  Film,
  Settings,
  Download,
  Sun,
  Moon,
  Globe,
  Volume2,
  VolumeX,
  Sliders,
  User as UserIcon,
  Video,
  Radio,
  FileText,
  Ticket,
  Megaphone,
  Palette,
  QrCode,
  Check,
  Smartphone
} from 'lucide-react';
import { InstallAppModal, usePWAInstall } from '../common/InstallAppModal';

const ROLE_PERSONA_INFO: Record<string, { label: string; icon: string }> = {
  DIRECTOR: { label: 'Director', icon: '🎬' },
  PRODUCER: { label: 'Producer', icon: '💼' },
  WRITER: { label: 'Screenwriter', icon: '✍️' },
  ACTOR: { label: 'Actor', icon: '✨' },
  CINEMATOGRAPHER: { label: 'Cinematographer', icon: '🎥' },
  EDITOR: { label: 'Editor', icon: '✂️' },
  MUSIC_DIRECTOR: { label: 'Composer', icon: '🎵' },
  VFX_ARTIST: { label: 'VFX', icon: '🪄' },
  ANIMATOR: { label: 'Animator', icon: '🎨' },
  COLORIST: { label: 'Colorist', icon: '🌈' },
  STUNT_COORDINATOR: { label: 'Stunts', icon: '⚡' },
  GAFFER: { label: 'Gaffer', icon: '💡' },
  LINE_PRODUCER: { label: 'Line Producer', icon: '📊' },
  CASTING_DIRECTOR: { label: 'Casting', icon: '👥' },
  SCRIPT_SUPERVISOR: { label: 'Script Sup', icon: '📖' },
  DRONE_OPERATOR: { label: 'Drone Pilot', icon: '🚁' },
  BOOM_OPERATOR: { label: 'Boom Sound', icon: '🎙️' },
  MAKEUP_ARTIST: { label: 'Makeup', icon: '💄' },
  COSTUME_DESIGNER: { label: 'Costume', icon: '👗' },
  ART_DIRECTOR: { label: 'Art Director', icon: '🏛️' },
  SOUND_DESIGNER: { label: 'Sound', icon: '🔊' },
  TECHNICIAN: { label: 'Technician', icon: '🔧' },
  ASSISTANT_DIRECTOR: { label: '1st AD', icon: '📋' },
  PRODUCTION_DESIGNER: { label: 'Production Designer', icon: '🏛️' },
  CHOREOGRAPHER: { label: 'Choreographer', icon: '💃' },
  FOLEY_ARTIST: { label: 'Foley Artist', icon: '👟' },
  LOCATION_MANAGER: { label: 'Location Manager', icon: '📍' },
  PRODUCTION_COORDINATOR: { label: 'Coordinator', icon: '📋' },
  VOICE_ACTOR: { label: 'Voice Actor', icon: '🎙️' },
  SUPER_ADMIN: { label: 'Citadel Admin', icon: '🛡️' },
  PLATFORM_ADMIN: { label: 'Citadel Admin', icon: '🛡️' }
};

export const Navbar: React.FC = () => {
  const { currentUser, activeRole, switchActiveRole, logout, isAdmin, isGuest, setGuestModeActive } = useAuth();
  const { theme, mode, toggleThemeMode, globalSkin, setGlobalSkin, currentSkinConfig } = useTheme();
  const { currentLanguage, setLanguage, t } = useLanguage();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const { isBgmEnabled, toggleBgm, volume, setVolume, stopAnimation, toggleStopAnimation, currentTrack } = useBgm();
  
  // Single comprehensive menu drawer state
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [skinMenuOpen, setSkinMenuOpen] = useState(false);
  const [installModalOpen, setInstallModalOpen] = useState(false);
  const { isIOS, isInstalled, triggerInstall } = usePWAInstall();
  const [activeTab, setActiveTab] = useState<'NAVIGATION' | 'SETTINGS' | 'LANGUAGES' | 'NOTIFICATIONS'>('NAVIGATION');
  const navigate = useNavigate();

  const handleRoleSelect = (role: ProfessionalRole) => {
    switchActiveRole(role);
  };

  // Strictly display ONLY the roles the current user actually selected (strictly max 3 roles)
  const userRolesList = React.useMemo(() => {
    const rawRoles = (currentUser?.roles && currentUser.roles.length > 0)
      ? currentUser.roles
      : (currentUser?.activeRole ? [currentUser.activeRole] : ['DIRECTOR']);
    
    // Deduplicate and strictly cap at maximum 3 selected roles
    const uniqueRoles = Array.from(new Set(rawRoles)).slice(0, 3);

    return uniqueRoles.map(r => ({
      role: r as ProfessionalRole,
      label: ROLE_PERSONA_INFO[r]?.label || r.replace(/_/g, ' '),
      icon: ROLE_PERSONA_INFO[r]?.icon || '🎬'
    }));
  }, [currentUser?.roles, currentUser?.activeRole]);

  const navigateTo = (path: string) => {
    setDrawerOpen(false);
    if (path.includes('#collaborations')) {
      if (window.location.pathname === '/dashboard') {
        const el = document.getElementById('collaborations');
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        navigate('/dashboard#collaborations');
        setTimeout(() => {
          const el = document.getElementById('collaborations');
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 350);
      }
    } else {
      navigate(path);
    }
  };

  return (
    <>
      {/* Sleek Top Navigation Bar: Strictly Brand Logo on the Left and Single Hamburger Menu on the Right */}
      <nav className={`sticky top-0 z-40 w-full border-b backdrop-blur-2xl transition-colors duration-500 ${
        isGuest ? 'border-red-500/20 bg-[#0d0406]/95' : 'border-white/10 bg-[#070709]/95'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Brand Logo (Adaptive Gold vs CineRed) */}
          <Link to="/" className="flex items-center">
            <CinematicLogo size="md" variant={isGuest ? 'guest' : 'gold'} />
          </Link>

          {/* Right Controls: Movies, Events, Theme Switcher, Chat, Menu */}
          <div className="flex items-center space-x-2">
            
            {/* Quick Links: Movies & Events */}
            <Link
              to="/movies"
              className="hidden lg:flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-cinematic font-bold uppercase tracking-wider text-gray-300 hover:text-white hover:bg-white/5 transition"
            >
              <Film className="w-4 h-4 text-amber-400" />
              <span>Movies</span>
            </Link>

            <Link
              to="/events"
              className="hidden lg:flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-cinematic font-bold uppercase tracking-wider text-gray-300 hover:text-white hover:bg-white/5 transition"
            >
              <Ticket className="w-4 h-4 text-rose-400" />
              <span>Galas & Tickets</span>
            </Link>

            {/* 6 Theme Skins Switcher Pill */}
            <div className="relative">
              <button
                onClick={() => setSkinMenuOpen(!skinMenuOpen)}
                className="flex items-center space-x-1.5 px-3 py-2 rounded-2xl border transition-all text-xs font-mono font-bold shadow-sm"
                style={{
                  backgroundColor: `${currentSkinConfig.primary}18`,
                  borderColor: `${currentSkinConfig.primary}50`,
                  color: currentSkinConfig.primary
                }}
                title="Switch Platform Visual Theme (6 Skins)"
              >
                <Palette className="w-4 h-4" />
                <span className="hidden sm:inline">{currentSkinConfig.name.split(' ')[0]}</span>
                <span className="text-[9px] bg-black/50 px-1 py-0.2 rounded font-mono">Theme</span>
              </button>

              {skinMenuOpen && (
                <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-[#0c0d12] border border-white/20 p-2 space-y-1 shadow-2xl z-50 backdrop-blur-xl animate-in fade-in">
                  <div className="text-[10px] font-mono text-gray-400 uppercase tracking-wider px-2 py-1.5 border-b border-white/10 flex items-center justify-between">
                    <span>6 Platform Visual Skins</span>
                    <span className="text-amber-400 font-bold">1-Click Morph</span>
                  </div>
                  {Object.values(GLOBAL_SKINS).map(skin => (
                    <button
                      key={skin.id}
                      onClick={() => {
                        setGlobalSkin(skin.id);
                        setSkinMenuOpen(false);
                      }}
                      className={`w-full text-left p-2 rounded-xl text-xs flex items-center justify-between transition ${
                        globalSkin === skin.id
                          ? 'bg-white/15 font-bold text-white border border-white/25 shadow-sm'
                          : 'text-gray-300 hover:bg-white/5'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-white/20 shrink-0"
                          style={{ backgroundColor: skin.primary }}
                        />
                        <div className="min-w-0">
                          <div className="text-xs font-bold truncate text-white">{skin.name}</div>
                          <div className="text-[9px] text-gray-400 truncate">{skin.tagline}</div>
                        </div>
                      </div>
                      {globalSkin === skin.id && <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Install App Quick Button (Visible on Every Mobile & Desktop Device) */}
            <button
              onClick={() => setInstallModalOpen(true)}
              className="flex items-center space-x-1.5 px-2.5 sm:px-3 py-2 rounded-2xl border transition-all text-xs font-mono font-bold bg-amber-500/15 hover:bg-amber-500/25 border-amber-500/40 text-amber-300 hover:text-white shadow-sm"
              title="Install CineVantaara App or Download APK"
              aria-label="Install CineVantaara App"
            >
              <Smartphone className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="hidden sm:inline">{isInstalled ? 'App Ready' : 'Install App'}</span>
              <span className="sm:hidden font-bold uppercase text-[10px]">App</span>
            </button>

            {/* Chat Symbol Button beside the Three Lines Menu (Left of Menu) */}
            <Link
              to="/messages"
              className={`chat-nav-btn flex items-center space-x-2 px-3.5 py-2.5 rounded-2xl border transition-all shadow-md group ${
                isGuest
                  ? 'bg-red-950/20 hover:bg-red-950/40 border-red-500/30 text-red-300 hover:text-white'
                  : 'bg-white/5 hover:bg-white/10 border-white/15 text-amber-300 hover:text-white'
              }`}
              title="Open Backlot Dispatch & Encrypted Chats"
              aria-label="Encrypted Chats"
            >
              <div className="relative">
                <MessageSquare className={`w-5 h-5 group-hover:scale-110 transition-transform ${
                  isGuest ? 'text-red-400' : 'text-amber-400'
                }`} />
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              </div>
              <span className="text-xs font-bold font-cinematic uppercase tracking-widest text-white hidden sm:inline">
                Chat
              </span>
            </Link>

            {/* Three Horizontal Lines (☰ / Menu) */}
            <button
              onClick={() => setDrawerOpen(true)}
              className={`flex items-center space-x-2.5 px-4 py-2.5 rounded-2xl border transition-all shadow-md group ${
                isGuest
                  ? 'bg-red-950/20 hover:bg-red-950/40 border-red-500/30 text-red-300 hover:text-white'
                  : 'bg-white/5 hover:bg-white/10 border-white/15 text-amber-300 hover:text-white'
              }`}
              aria-label="Open Studio Menu"
              title="Open Studio Menu & Controls"
            >
              <div className="relative">
                <Menu className={`w-6 h-6 group-hover:scale-110 transition-transform ${
                  isGuest ? 'text-red-400' : 'text-amber-400'
                }`} />
                {unreadCount > 0 && (
                  <span className={`absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full animate-pulse ${
                    isGuest ? 'bg-red-500' : 'bg-amber-500'
                  }`} />
                )}
              </div>
              <div className="flex flex-col text-left">
                <span className="text-xs font-bold font-cinematic uppercase tracking-widest text-white leading-tight">
                  {t('nav.menu', 'Menu')}
                </span>
                <span className="text-[10px] text-gray-400 font-mono flex items-center space-x-1">
                  <span>{currentLanguage.toUpperCase()}</span>
                  <span>•</span>
                  <span>{isGuest ? 'CinePass' : currentUser ? activeRole.split('_')[0] : 'Guest'}</span>
                </span>
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* Comprehensive Studio Command Center Drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <div
            onClick={() => setDrawerOpen(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
          />

          {/* Slide-over Panel */}
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
            <div className={`w-screen max-w-md sm:max-w-lg border-l shadow-2xl flex flex-col h-full text-gray-200 transition-colors ${
              isGuest ? 'bg-[#0f0406] border-red-500/20' : 'bg-[#0e0f14] border-white/15'
            }`}>
              
              {/* Drawer Header */}
              <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between bg-[#070709]">
                <div className="flex items-center space-x-3">
                  <CinematicLogo size="sm" variant={isGuest ? 'guest' : 'gold'} />
                </div>
                <button
                  onClick={() => setDrawerOpen(false)}
                  className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                  aria-label="Close Studio Menu"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* User Profile & Session Card */}
              <div className="p-5 border-b border-white/10 bg-gradient-to-b from-white/5 to-transparent">
                {currentUser ? (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <img
                        src={currentUser.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80'}
                        alt={currentUser.name}
                        className={`w-12 h-12 rounded-2xl object-cover border-2 shadow-md ${
                          isGuest ? 'border-red-500/60' : 'border-amber-500/50'
                        }`}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <h4 className="text-sm font-bold text-white truncate font-cinematic">{currentUser.name}</h4>
                          {currentUser.isVerified && (
                            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                          )}
                        </div>
                        <div className={`text-xs font-mono truncate ${
                          isGuest ? 'text-red-300' : 'text-amber-300'
                        }`}>
                          {currentUser.email}
                        </div>
                        <div className={`inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                          isGuest
                            ? 'bg-red-500/15 border-red-500/40 text-red-300'
                            : 'bg-amber-500/15 border-amber-500/30 text-amber-300'
                        }`}>
                          {isGuest ? 'CinePass Guest Audience' : `${activeRole.replace('_', ' ')} Console`}
                        </div>
                      </div>
                    </div>

                    {/* Role Switcher (Hidden for guests) */}
                    {!isGuest && userRolesList.length > 1 && (
                      <div className="pt-2">
                        <div className="text-[11px] font-mono text-gray-400 uppercase tracking-wider mb-1.5 flex items-center space-x-1">
                          <span>Switch Active Console ({userRolesList.length} Roles)</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {userRolesList.map(({ role, label, icon }) => {
                            const isSelected = activeRole === role;
                            return (
                              <button
                                key={role}
                                onClick={() => handleRoleSelect(role)}
                                className={`px-2.5 py-1 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-all ${
                                  isSelected
                                    ? 'bg-amber-500 text-black font-bold shadow-glow-gold'
                                    : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10'
                                }`}
                              >
                                <span>{icon}</span>
                                <span>{label.split(' ')[0]}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* User Action Buttons */}
                    <div className="flex items-center space-x-2 pt-1">
                      {!isGuest && (
                        <button
                          onClick={() => navigateTo('/profile')}
                          className="flex-1 px-3 py-2 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 text-white border border-white/10 flex items-center justify-center space-x-1.5 transition-colors"
                        >
                          <UserIcon className="w-3.5 h-3.5 text-amber-400" />
                          <span>{t('nav.profile', 'Profile Settings')}</span>
                        </button>
                      )}
                      <button
                        onClick={() => {
                          logout();
                          setDrawerOpen(false);
                          navigate('/');
                        }}
                        className="flex-1 px-3 py-2 rounded-xl text-xs font-semibold text-red-400 hover:text-red-300 bg-red-950/20 hover:bg-red-950/40 border border-red-500/20 flex items-center justify-center space-x-1.5 transition-colors"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>{t('nav.signOut', 'Sign Out')}</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="text-xs text-gray-400">
                      Sign in or create a profile to experience CineVantaara.
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => {
                          setGuestModeActive(false);
                          navigateTo('/login');
                        }}
                        className="px-4 py-2.5 rounded-xl font-cinematic font-bold text-xs uppercase tracking-wider bg-white/10 hover:bg-white/20 text-white border border-white/15 transition-all text-center"
                      >
                        {t('nav.signIn', 'Filmmaker Sign In')}
                      </button>
                      <button
                        onClick={() => {
                          setGuestModeActive(false);
                          navigateTo('/register');
                        }}
                        className="px-4 py-2.5 rounded-xl font-cinematic font-bold text-xs uppercase tracking-wider bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black shadow-glow-gold transition-all text-center"
                      >
                        {t('nav.register', 'Register')}
                      </button>
                    </div>

                    {/* Dedicated Guest Audience Option (Clearly Outside & Below Filmmaker Sign In) */}
                    <button
                      onClick={() => {
                        setGuestModeActive(true);
                        navigateTo('/login?mode=guest');
                      }}
                      className="w-full py-2.5 px-4 rounded-xl font-cinematic font-bold text-xs uppercase tracking-wider bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 text-white shadow-glow-guest transition-all text-center flex items-center justify-center space-x-2 border border-red-500/40"
                    >
                      <Ticket className="w-4 h-4 text-white" />
                      <span>Continue as Guest (CinePass)</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Navigation Sub-Tabs */}
              <div className="grid grid-cols-4 border-b border-white/10 bg-[#070709] text-xs font-mono">
                <button
                  onClick={() => setActiveTab('NAVIGATION')}
                  className={`py-3 text-center border-b-2 font-bold transition-all ${
                    activeTab === 'NAVIGATION'
                      ? 'border-amber-400 text-amber-400 bg-white/5'
                      : 'border-transparent text-gray-400 hover:text-white'
                  }`}
                >
                  Routes
                </button>
                <button
                  onClick={() => setActiveTab('SETTINGS')}
                  className={`py-3 text-center border-b-2 font-bold transition-all ${
                    activeTab === 'SETTINGS'
                      ? 'border-amber-400 text-amber-400 bg-white/5'
                      : 'border-transparent text-gray-400 hover:text-white'
                  }`}
                >
                  Studio
                </button>
                <button
                  onClick={() => setActiveTab('LANGUAGES')}
                  className={`py-3 text-center border-b-2 font-bold transition-all ${
                    activeTab === 'LANGUAGES'
                      ? 'border-amber-400 text-amber-400 bg-white/5'
                      : 'border-transparent text-gray-400 hover:text-white'
                  }`}
                >
                  NLP (14)
                </button>
                <button
                  onClick={() => setActiveTab('NOTIFICATIONS')}
                  className={`py-3 text-center border-b-2 font-bold transition-all relative ${
                    activeTab === 'NOTIFICATIONS'
                      ? 'border-amber-400 text-amber-400 bg-white/5'
                      : 'border-transparent text-gray-400 hover:text-white'
                  }`}
                >
                  <span>Alerts</span>
                  {unreadCount > 0 && (
                    <span className="ml-1 px-1.5 py-0.2 rounded-full text-[9px] bg-amber-500 text-black font-bold">
                      {unreadCount}
                    </span>
                  )}
                </button>
              </div>

              {/* Tab Content Body */}
              <div className="flex-1 overflow-y-auto p-5 space-y-6">

                {/* 1. ROUTES TAB */}
                {activeTab === 'NAVIGATION' && (
                  isGuest ? (
                    <div className="space-y-2">
                      <div className="text-[11px] font-mono uppercase tracking-wider text-red-400 mb-2 flex items-center justify-between">
                        <span>CinePass Audience Lounge</span>
                        <span className="text-[10px] bg-red-600/20 text-red-300 px-2 py-0.5 rounded-full border border-red-500/30">
                          Active Pass
                        </span>
                      </div>

                      {[
                        { title: 'Movies & Screenings', desc: 'Watch trailers & screening cuts', hash: '#movies', icon: Film, color: 'text-red-400 bg-red-500/20' },
                        { title: 'Cinema Bookings', desc: 'Reserve theatrical seats & passes', hash: '#bookings', icon: Ticket, color: 'text-amber-400 bg-amber-500/20' },
                        { title: 'Live Events & Q&A', desc: 'Live director broadcasts & red carpets', hash: '#events', icon: Radio, color: 'text-purple-400 bg-purple-500/20' },
                        { title: 'Studio Updates', desc: 'Official production logs & news', hash: '#updates', icon: Megaphone, color: 'text-cyan-400 bg-cyan-500/20' },
                        { title: 'Audience Alerts', desc: 'Premiere broadcasts & studio alerts', hash: '#alerts', icon: Bell, color: 'text-rose-400 bg-rose-500/20' },
                        { title: 'CinePass VIP Perks', desc: 'Exclusive merchandise & collectibles', hash: '#perks', icon: Sparkles, color: 'text-pink-400 bg-pink-500/20' },
                        { title: 'Behind-The-Scenes', desc: 'Uncut rehearsal footage & commentary', hash: '#bts', icon: Video, color: 'text-emerald-400 bg-emerald-500/20' }
                      ].map(item => {
                        const Icon = item.icon;
                        return (
                          <button
                            key={item.title}
                            onClick={() => {
                              navigateTo(`/guest-dashboard${item.hash}`);
                              setTimeout(() => {
                                const el = document.querySelector(item.hash);
                                if (el) el.scrollIntoView({ behavior: 'smooth' });
                              }, 200);
                            }}
                            className="w-full flex items-center justify-between p-3 rounded-2xl bg-black/40 hover:bg-red-950/20 border border-red-500/20 hover:border-red-500/40 text-left transition-all group"
                          >
                            <div className="flex items-center space-x-3">
                              <div className={`p-2.5 rounded-xl ${item.color}`}>
                                <Icon className="w-5 h-5" />
                              </div>
                              <div>
                                <div className="text-sm font-bold text-white group-hover:text-red-400 font-cinematic">
                                  {item.title}
                                </div>
                                <div className="text-xs text-gray-400">{item.desc}</div>
                              </div>
                            </div>
                            <span className="text-xs text-red-400 font-mono">View →</span>
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                  <div className="space-y-2">
                    <div className="text-[11px] font-mono uppercase tracking-wider text-gray-500 mb-2">
                      Platform Consoles & Tools
                    </div>

                    <button
                      onClick={() => navigateTo('/dashboard')}
                      className="w-full flex items-center justify-between p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-left transition-all group"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-400">
                          <Layers className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-white group-hover:text-amber-300 font-cinematic">
                            {t('nav.dashboard', 'Studio Dashboard')}
                          </div>
                          <div className="text-xs text-gray-400">
                            {currentUser ? `${activeRole.replace('_', ' ')} Workspace` : 'Guest Console'}
                          </div>
                        </div>
                      </div>
                      <span className="text-xs text-amber-400 font-mono">Open →</span>
                    </button>

                    <button
                      onClick={() => navigateTo('/dashboard#collaborations')}
                      className="w-full flex items-center justify-between p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-left transition-all group"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400">
                          <Film className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-white group-hover:text-amber-300 font-cinematic">
                            {t('nav.collaborations', 'Film Collaborations')}
                          </div>
                          <div className="text-xs text-gray-400">Inbound inquiries & dispatched proposals</div>
                        </div>
                      </div>
                      <span className="text-xs text-amber-400 font-mono">Open →</span>
                    </button>

                    <button
                      onClick={() => navigateTo('/talent')}
                      className="w-full flex items-center justify-between p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-left transition-all group"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="p-2.5 rounded-xl bg-blue-500/20 text-blue-400">
                          <Users className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-white group-hover:text-amber-300 font-cinematic">
                            {t('nav.discover', 'Talent Directory')}
                          </div>
                          <div className="text-xs text-gray-400">Discover verified film crew and cast</div>
                        </div>
                      </div>
                      <span className="text-xs text-amber-400 font-mono">Open →</span>
                    </button>

                    <button
                      onClick={() => navigateTo('/opportunities')}
                      className="w-full flex items-center justify-between p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-left transition-all group"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400">
                          <Briefcase className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-white group-hover:text-amber-300 font-cinematic">
                            {t('nav.opportunities', 'Opportunities')}
                          </div>
                          <div className="text-xs text-gray-400">Production casting calls & crew requisitions</div>
                        </div>
                      </div>
                      <span className="text-xs text-amber-400 font-mono">Open →</span>
                    </button>

                    {/* Phase 8: Movie Discovery */}
                    <button
                      onClick={() => navigateTo('/movies')}
                      className="w-full flex items-center justify-between p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-left transition-all group"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400">
                          <Film className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-white group-hover:text-amber-300 font-cinematic">
                            Cinema Discovery Showcase
                          </div>
                          <div className="text-xs text-gray-400">Theatrical trailers, festival picks & film reels</div>
                        </div>
                      </div>
                      <span className="text-xs text-amber-400 font-mono">Watch →</span>
                    </button>

                    {/* Phase 9: Pre-Release Galas & Passes */}
                    <button
                      onClick={() => navigateTo('/events')}
                      className="w-full flex items-center justify-between p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-left transition-all group"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="p-2.5 rounded-xl bg-rose-500/20 text-rose-400">
                          <Ticket className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-white group-hover:text-rose-300 font-cinematic">
                            Pre-Release Galas & Passes
                          </div>
                          <div className="text-xs text-gray-400">Audio launches, premieres & fan screenings</div>
                        </div>
                      </div>
                      <span className="text-xs text-rose-400 font-mono">Passes →</span>
                    </button>

                    {/* Phase 9: My Cinema Passes Wallet */}
                    <button
                      onClick={() => navigateTo('/my-tickets')}
                      className="w-full flex items-center justify-between p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-left transition-all group"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="p-2.5 rounded-xl bg-sky-500/20 text-sky-400">
                          <QrCode className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-white group-hover:text-sky-300 font-cinematic">
                            My Cinema Passes Wallet
                          </div>
                          <div className="text-xs text-gray-400">Digital QR passes, downloads & instant refunds</div>
                        </div>
                      </div>
                      <span className="text-xs text-sky-400 font-mono">Wallet →</span>
                    </button>

                    <button
                      onClick={() => navigateTo('/ai-match')}
                      className="w-full flex items-center justify-between p-3 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-left transition-all group shadow-sm"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400">
                          <Sparkles className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-amber-300 group-hover:text-amber-200 font-cinematic">
                            {t('nav.aiMatch', 'AI Match & Work Scorer')}
                          </div>
                          <div className="text-xs text-gray-400">Script, treatment & reel quality evaluation</div>
                        </div>
                      </div>
                      <span className="text-xs text-amber-400 font-mono">AI →</span>
                    </button>

                    {/* Phase 8: Movie Discovery */}
                    <button
                      onClick={() => navigateTo('/movies')}
                      className="w-full flex items-center justify-between p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-left transition-all group"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400">
                          <Film className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-white group-hover:text-amber-300 font-cinematic">
                            Cinema Discovery Showcase
                          </div>
                          <div className="text-xs text-gray-400">Theatrical trailers, festival picks & film reels</div>
                        </div>
                      </div>
                      <span className="text-xs text-amber-400 font-mono">Watch →</span>
                    </button>

                    {/* Phase 9: Pre-Release Galas & Passes */}
                    <button
                      onClick={() => navigateTo('/events')}
                      className="w-full flex items-center justify-between p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-left transition-all group"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="p-2.5 rounded-xl bg-rose-500/20 text-rose-400">
                          <Ticket className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-white group-hover:text-rose-300 font-cinematic">
                            Pre-Release Galas & Passes
                          </div>
                          <div className="text-xs text-gray-400">Audio launches, premieres & fan screenings</div>
                        </div>
                      </div>
                      <span className="text-xs text-rose-400 font-mono">Passes →</span>
                    </button>

                    {/* Phase 9: My Cinema Passes Wallet */}
                    <button
                      onClick={() => navigateTo('/my-tickets')}
                      className="w-full flex items-center justify-between p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-left transition-all group"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="p-2.5 rounded-xl bg-sky-500/20 text-sky-400">
                          <QrCode className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-white group-hover:text-sky-300 font-cinematic">
                            My Cinema Passes Wallet
                          </div>
                          <div className="text-xs text-gray-400">Digital QR passes, downloads & instant refunds</div>
                        </div>
                      </div>
                      <span className="text-xs text-sky-400 font-mono">Wallet →</span>
                    </button>

                    <button
                      onClick={() => navigateTo('/ai-match')}
                      className="w-full flex items-center justify-between p-3 rounded-2xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-left transition-all group shadow-sm"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="p-2.5 rounded-xl bg-rose-500/20 text-rose-400">
                          <Video className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-rose-300 group-hover:text-rose-200 font-cinematic">
                            {t('nav.aiVideo', 'AI Video & Deepfake Detector')}
                          </div>
                          <div className="text-xs text-gray-400">Synthetic media forensic analysis & audit</div>
                        </div>
                      </div>
                      <span className="text-xs text-rose-400 font-mono">Scan →</span>
                    </button>

                    {!isAdmin && (
                      <button
                        onClick={() => navigateTo('/messages')}
                        className="w-full flex items-center justify-between p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-left transition-all group"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="p-2.5 rounded-xl bg-teal-500/20 text-teal-400">
                            <MessageSquare className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="text-sm font-bold text-white group-hover:text-amber-300 font-cinematic">
                              {t('nav.messages', 'Encrypted Creator Chat')}
                            </div>
                            <div className="text-xs text-gray-400">Direct creator-to-creator messaging</div>
                          </div>
                        </div>
                        <span className="text-xs text-amber-400 font-mono">Chat →</span>
                      </button>
                    )}

                    {isAdmin && (
                      <button
                        onClick={() => navigateTo('/admin')}
                        className="w-full flex items-center justify-between p-3 rounded-2xl bg-red-950/30 hover:bg-red-900/40 border border-red-500/40 text-left transition-all group"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="p-2.5 rounded-xl bg-red-500/20 text-red-400">
                            <Shield className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="text-sm font-bold text-red-300 group-hover:text-red-200 font-cinematic">
                              {t('nav.citadel', 'Admin Citadel Console')}
                            </div>
                            <div className="text-xs text-gray-400">Platform security, bans & audit logs</div>
                          </div>
                        </div>
                        <span className="text-xs text-red-400 font-mono">Admin →</span>
                      </button>
                    )}
                  </div>
                )
              )}

                {/* 2. STUDIO SETTINGS & AUDIO CONTROLS */}
                {activeTab === 'SETTINGS' && (
                  <div className="space-y-5">
                    {/* Theme Mode Switcher */}
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                      <div className="text-xs font-bold text-white font-cinematic uppercase tracking-wider flex items-center justify-between">
                        <span>Studio Color Appearance</span>
                        <span className="text-[10px] font-mono text-amber-400 uppercase">{mode} theme</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => { if (mode !== 'dark') toggleThemeMode(); }}
                          className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center space-x-2 transition-all ${
                            mode === 'dark'
                              ? 'bg-amber-500 text-black border-amber-400 shadow-glow-gold'
                              : 'bg-black/50 text-gray-300 border-white/10 hover:bg-white/10'
                          }`}
                        >
                          <Moon className="w-4 h-4" />
                          <span>Dark Cinema</span>
                        </button>
                        <button
                          onClick={() => { if (mode !== 'light') toggleThemeMode(); }}
                          className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center space-x-2 transition-all ${
                            mode === 'light'
                              ? 'bg-amber-500 text-black border-amber-400 shadow-glow-gold'
                              : 'bg-black/50 text-gray-300 border-white/10 hover:bg-white/10'
                          }`}
                        >
                          <Sun className="w-4 h-4" />
                          <span>Light Studio</span>
                        </button>
                      </div>
                      <p className="text-[11px] text-gray-400">
                        In Light Studio mode, pure black transforms to clean white while all vibrant role accents remain intact.
                      </p>
                    </div>

                    {/* Shaking Animation Control: Active as first, auto-stops when music is muted */}
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-xs font-bold text-white font-cinematic uppercase tracking-wider">
                            {t('action.stopAnimation', 'Stop Shaking Animation')}
                          </div>
                          <div className="text-[11px] text-gray-400 mt-0.5">
                            Freezes camera shake and tremors (auto-stopped when music is muted)
                          </div>
                        </div>
                        <button
                          onClick={() => toggleStopAnimation(!stopAnimation)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            stopAnimation || !isBgmEnabled ? 'bg-amber-500' : 'bg-gray-700'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              stopAnimation || !isBgmEnabled ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                      <div className="text-[10px] font-mono p-2 rounded-lg border flex items-center space-x-2 bg-black/40 border-white/10">
                        <span className={`w-2 h-2 rounded-full ${isBgmEnabled && !stopAnimation ? 'bg-emerald-400 animate-ping' : 'bg-gray-500'}`} />
                        <span className={isBgmEnabled && !stopAnimation ? 'text-emerald-300' : 'text-gray-400'}>
                          {!isBgmEnabled
                            ? 'Music muted: Shaking animation stopped.'
                            : stopAnimation
                              ? 'Animation paused manually.'
                              : 'Shaking animation active with anime soundtrack.'}
                        </span>
                      </div>
                    </div>

                    {/* Anime Background Music Audio Console */}
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-xs font-bold text-white font-cinematic uppercase tracking-wider flex items-center space-x-1.5">
                            <Radio className="w-4 h-4 text-amber-400" />
                            <span>Anime Role Soundtrack (BGM)</span>
                          </div>
                          <div className="text-[11px] text-amber-300 font-mono mt-0.5">
                            {currentTrack.anime}: {currentTrack.title}
                          </div>
                        </div>
                        <button
                          onClick={() => toggleBgm(!isBgmEnabled)}
                          className={`p-2 rounded-xl text-xs font-bold flex items-center space-x-1 border transition-all ${
                            isBgmEnabled
                              ? 'bg-amber-500 text-black border-amber-400'
                              : 'bg-white/5 text-gray-400 border-white/10'
                          }`}
                        >
                          {isBgmEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                          <span>{isBgmEnabled ? 'Active' : 'Muted'}</span>
                        </button>
                      </div>

                      {/* Volume Slider */}
                      <div className="space-y-1.5 pt-1">
                        <div className="flex justify-between text-[11px] font-mono text-gray-400">
                          <span>Volume Master</span>
                          <span>{Math.round(volume * 100)}%</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.05"
                          value={volume}
                          onChange={(e) => setVolume(parseFloat(e.target.value))}
                          className="w-full accent-amber-500 cursor-pointer"
                        />
                      </div>
                      <div className="text-[10px] text-gray-500 font-mono">
                        Theme vibe: {currentTrack.vibe}
                      </div>
                    </div>

                    {/* Install CineVantaara App Card */}
                    <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/15 via-white/5 to-transparent border border-amber-500/30 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="text-xs font-bold text-white font-cinematic uppercase tracking-wider flex items-center space-x-1.5">
                          <Smartphone className="w-4 h-4 text-amber-400" />
                          <span>Install CineVantaara App</span>
                        </div>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold">
                          PWA / Mobile
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-300">
                        Install on your phone or desktop for instant full-screen cinema access, offline speed, and zero app-store download delays.
                      </p>
                      <button
                        onClick={() => setInstallModalOpen(true)}
                        className="w-full py-2.5 rounded-xl font-cinematic font-bold text-xs uppercase tracking-wider bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black flex items-center justify-center space-x-2 transition shadow-glow-gold"
                      >
                        <Smartphone className="w-4 h-4" />
                        <span>{isInstalled ? 'App Installed (Open)' : 'Install App to Device'}</span>
                      </button>
                    </div>

                    {/* Download Full Source Code ZIP */}
                    <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-2">
                      <div className="text-xs font-bold text-amber-300 font-cinematic uppercase tracking-wider">
                        Complete Codebase Archive
                      </div>
                      <p className="text-[11px] text-gray-300">
                        Download the comprehensive repository package including React 18, Spring Boot 3, FastAPI, and anime audio assets.
                      </p>
                      <a
                        href="/CineVantaara-Complete-Codebase.zip"
                        download="CineVantaara-Complete-Codebase.zip"
                        className="w-full py-2.5 rounded-xl font-cinematic font-bold text-xs uppercase tracking-wider bg-amber-500 hover:bg-amber-400 text-black flex items-center justify-center space-x-2 transition-all shadow-glow-gold"
                      >
                        <Download className="w-4 h-4" />
                        <span>Download Codebase ZIP (2.73 MB)</span>
                      </a>
                    </div>
                  </div>
                )}

                {/* 3. MULTILINGUAL NLP LANGUAGES TAB */}
                {activeTab === 'LANGUAGES' && (
                  <div className="space-y-4">
                    <div className="text-[11px] font-mono uppercase tracking-wider text-gray-400">
                      Select Platform Language (NLP Translation)
                    </div>
                    <p className="text-xs text-gray-400">
                      Instantly translates the entire platform including cinematic proverbs, mottos, and studio widgets. Nothing remains untranslated.
                    </p>

                    <div className="space-y-3">
                      <div className="text-[10px] uppercase font-mono font-bold text-amber-400 px-1">
                        Indian Regional Cinema Languages (First Priority)
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {SUPPORTED_LANGUAGES.filter(l => l.region === 'Indian').map(lang => (
                          <button
                            key={lang.code}
                            onClick={() => setLanguage(lang.code)}
                            className={`p-3 rounded-xl border text-left transition-all flex items-center justify-between ${
                              currentLanguage === lang.code
                                ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 font-bold shadow-sm'
                                : 'bg-white/5 text-gray-300 border-white/10 hover:bg-white/10'
                            }`}
                          >
                            <div>
                              <div className="text-sm font-bold">{lang.nativeName}</div>
                              <div className="text-[10px] text-gray-400 uppercase font-mono">{lang.label}</div>
                            </div>
                            {currentLanguage === lang.code && (
                              <CheckCircle className="w-4 h-4 text-amber-400" />
                            )}
                          </button>
                        ))}
                      </div>

                      <div className="text-[10px] uppercase font-mono font-bold text-gray-400 px-1 pt-2">
                        Global Cinema Languages
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {SUPPORTED_LANGUAGES.filter(l => l.region === 'Global').map(lang => (
                          <button
                            key={lang.code}
                            onClick={() => setLanguage(lang.code)}
                            className={`p-3 rounded-xl border text-left transition-all flex items-center justify-between ${
                              currentLanguage === lang.code
                                ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 font-bold shadow-sm'
                                : 'bg-white/5 text-gray-300 border-white/10 hover:bg-white/10'
                            }`}
                          >
                            <div>
                              <div className="text-sm font-bold">{lang.nativeName}</div>
                              <div className="text-[10px] text-gray-400 uppercase font-mono">{lang.label}</div>
                            </div>
                            {currentLanguage === lang.code && (
                              <CheckCircle className="w-4 h-4 text-amber-400" />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* 4. NOTIFICATIONS / PRODUCTION ALERTS TAB */}
                {activeTab === 'NOTIFICATIONS' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between pb-2 border-b border-white/10">
                      <div className="text-xs font-bold text-white font-cinematic uppercase tracking-wider">
                        Production Alerts ({notifications.filter(n => (n.type === 'OPPORTUNITY_MATCH' || n.type === 'SYSTEM') && !n.isRead).length})
                      </div>
                      {notifications.some(n => !n.isRead) && (
                        <button
                          onClick={markAllAsRead}
                          className="text-xs text-amber-400 hover:underline font-mono"
                        >
                          Mark all as read
                        </button>
                      )}
                    </div>

                    <div className="space-y-2">
                      {notifications.filter(n => n.type === 'OPPORTUNITY_MATCH' || n.type === 'SYSTEM').length === 0 ? (
                        <div className="py-12 text-center text-xs text-gray-500 space-y-2">
                          <Bell className="w-8 h-8 mx-auto text-gray-600" />
                          <div className="font-semibold text-gray-300">No New Production Alerts</div>
                          <p className="text-[11px] text-gray-500 max-w-xs mx-auto">
                            Only opportunities created by Directors or Producers and important Administrator broadcasts are delivered here.
                          </p>
                        </div>
                      ) : (
                        notifications
                          .filter(n => n.type === 'OPPORTUNITY_MATCH' || n.type === 'SYSTEM')
                          .map(n => (
                            <div
                              key={n.id}
                              onClick={() => {
                                markAsRead(n.id);
                                if (n.linkUrl) navigateTo(n.linkUrl);
                              }}
                              className={`p-3.5 rounded-2xl border cursor-pointer transition-all alert-card-item ${
                                n.isRead
                                  ? 'bg-white/5 border-white/5 opacity-70'
                                  : n.type === 'SYSTEM'
                                  ? 'bg-red-500/10 border-red-500/30 shadow-sm'
                                  : 'bg-amber-500/10 border-amber-500/30'
                              }`}
                            >
                              <div className={`text-xs font-bold ${n.type === 'SYSTEM' ? 'text-red-400' : 'text-amber-300'}`}>
                                {n.title}
                              </div>
                              <div className="text-xs text-gray-300 mt-1 leading-relaxed">{n.message}</div>
                              <div className="text-[10px] text-gray-500 mt-1 font-mono flex items-center justify-between">
                                <span>{n.timestamp}</span>
                                <span className="uppercase text-[9px] px-1.5 py-0.5 rounded bg-black/40 border border-white/10 font-bold">
                                  {n.type === 'SYSTEM' ? 'Admin Notice' : 'Film Opportunity'}
                                </span>
                              </div>
                            </div>
                          ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Drawer Footer */}
              <div className="p-4 border-t border-white/10 bg-[#070709] flex items-center justify-between text-xs text-gray-500 font-mono">
                <span>CineVantaara v2.4</span>
                <span>All 14 Languages Supported</span>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Mobile Floating App Bar (Prominent on all mobile devices) */}
      {!isInstalled && (
        <div className="md:hidden fixed bottom-4 left-3 right-3 z-40 bg-[#0e0e14]/95 border border-amber-500/50 backdrop-blur-xl p-2.5 rounded-2xl shadow-2xl flex items-center justify-between">
          <div className="flex items-center space-x-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-amber-700 p-0.5 shrink-0">
              <img src="/icon-192.png" alt="CineVantaara" className="w-full h-full rounded-md object-contain bg-[#070709]" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-white truncate font-cinematic">CineVantaara App</div>
              <div className="text-[10px] text-amber-400 font-mono truncate">Install to Phone / Download APK</div>
            </div>
          </div>
          <button
            onClick={() => setInstallModalOpen(true)}
            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-cinematic font-bold text-[11px] uppercase tracking-wider shrink-0 shadow-md shadow-amber-500/25 transition active:scale-95"
          >
            Get App
          </button>
        </div>
      )}

      {/* Install CineVantaara App Modal */}
      <InstallAppModal
        isOpen={installModalOpen}
        onClose={() => setInstallModalOpen(false)}
        triggerInstall={triggerInstall}
        isIOS={isIOS}
        isInstalled={isInstalled}
      />
    </>
  );
};
