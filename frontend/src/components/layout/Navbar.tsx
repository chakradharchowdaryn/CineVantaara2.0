import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
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
  const { currentLanguage, setLanguage, t } = useLanguage();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const { isBgmEnabled, toggleBgm, volume, setVolume, stopAnimation, toggleStopAnimation, currentTrack } = useBgm();
  
  // Single comprehensive menu drawer state
  const [drawerOpen, setDrawerOpen] = useState(false);
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
      : [activeRole];
    
    return rawRoles.slice(0, 3).map(r => ({
      role: r as ProfessionalRole,
      label: ROLE_PERSONA_INFO[r]?.label || r.replace('_', ' '),
      icon: ROLE_PERSONA_INFO[r]?.icon || '🎬'
    }));
  }, [currentUser?.roles, activeRole]);

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
      {/* Sleek Top Navigation Bar: Warm Tuscan Linen Frosted Aesthetic */}
      <nav className={`sticky top-0 z-40 w-full border-b backdrop-blur-2xl transition-colors duration-500 ${
        isGuest
          ? 'border-red-300/60 bg-[#FAF8F5]/95 text-[#26211A] shadow-xs'
          : 'border-[#E8E2D8]/80 bg-[#FAF8F5]/90 text-[#26211A] shadow-xs'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Brand Logo (Tuscan Linen / Guest Mode) */}
          <Link to="/" className="flex items-center">
            <CinematicLogo size="md" variant={isGuest ? 'guest' : 'gold'} />
          </Link>

          {/* Right Controls: Movies, Events, Install App, Chat, Menu */}
          <div className="flex items-center space-x-2">
            
            {/* Quick Links: Movies & Events */}
            <Link
              to="/movies"
              className="hidden lg:flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-cinematic font-bold uppercase tracking-wider text-[#665547] hover:text-[#26211A] hover:bg-[#A67938]/10 transition"
            >
              <Film className="w-4 h-4 text-[#A67938]" />
              <span>Movies</span>
            </Link>

            <Link
              to="/events"
              className="hidden lg:flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-cinematic font-bold uppercase tracking-wider text-[#665547] hover:text-[#26211A] hover:bg-[#A67938]/10 transition"
            >
              <Ticket className="w-4 h-4 text-[#B88B4A]" />
              <span>Galas & Tickets</span>
            </Link>

            {/* Install App Quick Button */}
            <button
              onClick={() => setInstallModalOpen(true)}
              className="flex items-center space-x-1.5 px-2.5 sm:px-3 py-2 rounded-2xl border transition-all text-xs font-mono font-bold bg-[#A67938]/12 hover:bg-[#A67938]/20 border-[#A67938]/35 text-[#8C6126] hover:text-[#26211A] shadow-xs"
              title="Install CineVantaara App or Download APK"
              aria-label="Install CineVantaara App"
            >
              <Smartphone className="w-4 h-4 text-[#A67938] shrink-0" />
              <span className="hidden sm:inline">{isInstalled ? 'App Ready' : 'Install App'}</span>
              <span className="sm:hidden font-bold uppercase text-[10px]">App</span>
            </button>

            {/* Chat Symbol Button beside the Three Lines Menu */}
            <Link
              to="/messages"
              className={`chat-nav-btn flex items-center space-x-2 px-3.5 py-2.5 rounded-2xl border transition-all shadow-xs group ${
                isGuest
                  ? 'bg-red-50 hover:bg-red-100/80 border-red-200 text-red-800'
                  : 'bg-white/80 hover:bg-white border-[#E8E2D8] text-[#8C6126] hover:text-[#26211A]'
              }`}
              title="Open Backlot Dispatch & Encrypted Chats"
              aria-label="Encrypted Chats"
            >
              <div className="relative">
                <MessageSquare className={`w-5 h-5 group-hover:scale-110 transition-transform ${
                  isGuest ? 'text-red-600' : 'text-[#A67938]'
                }`} />
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              </div>
              <span className="text-xs font-bold font-cinematic uppercase tracking-widest text-[#26211A] hidden sm:inline">
                Chat
              </span>
            </Link>

            {/* Three Horizontal Lines (☰ / Menu) */}
            <button
              onClick={() => setDrawerOpen(true)}
              className={`flex items-center space-x-2.5 px-4 py-2.5 rounded-2xl border transition-all shadow-xs group ${
                isGuest
                  ? 'bg-red-50 hover:bg-red-100/80 border-red-200 text-red-800'
                  : 'bg-white/80 hover:bg-white border-[#E8E2D8] text-[#8C6126] hover:text-[#26211A]'
              }`}
              aria-label="Open Studio Menu"
              title="Open Studio Menu & Controls"
            >
              <div className="relative">
                <Menu className={`w-6 h-6 group-hover:scale-110 transition-transform ${
                  isGuest ? 'text-red-600' : 'text-[#A67938]'
                }`} />
                {unreadCount > 0 && (
                  <span className={`absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full animate-pulse ${
                    isGuest ? 'bg-red-500' : 'bg-[#A67938]'
                  }`} />
                )}
              </div>
              <div className="flex flex-col text-left">
                <span className="text-xs font-bold font-cinematic uppercase tracking-widest text-[#26211A] leading-tight">
                  {t('nav.menu', 'Menu')}
                </span>
                <span className="text-[10px] text-[#665547] font-mono flex items-center space-x-1">
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
            className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
          />

          {/* Slide-over Panel */}
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
            <div className={`w-screen max-w-md sm:max-w-lg border-l shadow-2xl flex flex-col h-full bg-[#FAF8F5] border-[#E8E2D8] text-[#26211A] transition-colors`}>
              
              {/* Drawer Header */}
              <div className="px-6 py-5 border-b border-[#E8E2D8] flex items-center justify-between bg-[#F4EBE1]">
                <div className="flex items-center space-x-3">
                  <CinematicLogo size="sm" variant={isGuest ? 'guest' : 'gold'} />
                </div>
                <button
                  onClick={() => setDrawerOpen(false)}
                  className="p-2 rounded-xl text-[#665547] hover:text-[#26211A] hover:bg-[#E8E2D8]/60 transition-colors"
                  aria-label="Close Studio Menu"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* User Profile & Session Card */}
              <div className="p-5 border-b border-[#E8E2D8] bg-gradient-to-b from-[#F4EBE1]/60 to-transparent">
                {currentUser ? (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <img
                        src={currentUser.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80'}
                        alt={currentUser.name}
                        className={`w-12 h-12 rounded-2xl object-cover border-2 shadow-xs ${
                          isGuest ? 'border-red-400' : 'border-[#A67938]/60'
                        }`}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <h4 className="text-sm font-bold text-[#26211A] truncate font-cinematic">{currentUser.name}</h4>
                          {currentUser.isVerified && (
                            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                          )}
                        </div>
                        <div className={`text-xs font-mono truncate ${
                          isGuest ? 'text-red-700' : 'text-[#665547]'
                        }`}>
                          {currentUser.email}
                        </div>
                        <div className={`inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                          isGuest
                            ? 'bg-red-50 border-red-200 text-red-700'
                            : 'bg-[#A67938]/12 border-[#A67938]/30 text-[#8C6126]'
                        }`}>
                          {isGuest ? 'CinePass Guest Audience' : `${activeRole.replace('_', ' ')} Console`}
                        </div>
                      </div>
                    </div>

                    {/* Role Switcher (Hidden for guests) */}
                    {!isGuest && userRolesList.length > 1 && (
                      <div className="pt-2">
                        <div className="text-[11px] font-mono text-[#665547] uppercase tracking-wider mb-1.5 flex items-center space-x-1">
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
                                    ? 'bg-[#A67938] text-white font-bold shadow-xs'
                                    : 'bg-white/80 text-[#665547] hover:bg-white hover:text-[#26211A] border border-[#E8E2D8]'
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
                          className="flex-1 px-3 py-2 rounded-xl text-xs font-semibold bg-white/80 hover:bg-white text-[#26211A] border border-[#E8E2D8] flex items-center justify-center space-x-1.5 transition-colors shadow-xs"
                        >
                          <UserIcon className="w-3.5 h-3.5 text-[#A67938]" />
                          <span>{t('nav.profile', 'Profile Settings')}</span>
                        </button>
                      )}
                      <button
                        onClick={() => {
                          logout();
                          setDrawerOpen(false);
                          navigate('/');
                        }}
                        className="flex-1 px-3 py-2 rounded-xl text-xs font-semibold text-red-700 hover:text-red-800 bg-red-50 hover:bg-red-100 border border-red-200 flex items-center justify-center space-x-1.5 transition-colors"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>{t('nav.signOut', 'Sign Out')}</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="text-xs text-[#665547]">
                      Sign in or create a profile to experience CineVantaara.
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => {
                          setGuestModeActive(false);
                          navigateTo('/login');
                        }}
                        className="px-4 py-2.5 rounded-xl font-cinematic font-bold text-xs uppercase tracking-wider bg-white/80 hover:bg-white text-[#26211A] border border-[#E8E2D8] transition-all text-center shadow-xs"
                      >
                        {t('nav.signIn', 'Filmmaker Sign In')}
                      </button>
                      <button
                        onClick={() => {
                          setGuestModeActive(false);
                          navigateTo('/register');
                        }}
                        className="px-4 py-2.5 rounded-xl font-cinematic font-bold text-xs uppercase tracking-wider bg-gradient-to-r from-[#B88B4A] to-[#A67938] hover:from-[#A67938] hover:to-[#8C6126] text-white shadow-xs transition-all text-center"
                      >
                        {t('nav.register', 'Register')}
                      </button>
                    </div>

                    {/* Dedicated Guest Audience Option */}
                    <button
                      onClick={() => {
                        setGuestModeActive(true);
                        navigateTo('/login?mode=guest');
                      }}
                      className="w-full py-2.5 px-4 rounded-xl font-cinematic font-bold text-xs uppercase tracking-wider bg-white/80 hover:bg-white text-[#8C6126] hover:text-[#26211A] transition-all text-center flex items-center justify-center space-x-2 border border-[#E8E2D8] shadow-xs"
                    >
                      <Ticket className="w-4 h-4 text-[#A67938]" />
                      <span>Continue as Guest (CinePass)</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Navigation Sub-Tabs */}
              <div className="grid grid-cols-4 border-b border-[#E8E2D8] bg-[#F4EBE1] text-xs font-mono">
                <button
                  onClick={() => setActiveTab('NAVIGATION')}
                  className={`py-3 text-center border-b-2 font-bold transition-all ${
                    activeTab === 'NAVIGATION'
                      ? 'border-[#A67938] text-[#8C6126] bg-[#FAF8F5]'
                      : 'border-transparent text-[#665547] hover:text-[#26211A]'
                  }`}
                >
                  Routes
                </button>
                <button
                  onClick={() => setActiveTab('SETTINGS')}
                  className={`py-3 text-center border-b-2 font-bold transition-all ${
                    activeTab === 'SETTINGS'
                      ? 'border-[#A67938] text-[#8C6126] bg-[#FAF8F5]'
                      : 'border-transparent text-[#665547] hover:text-[#26211A]'
                  }`}
                >
                  Studio
                </button>
                <button
                  onClick={() => setActiveTab('LANGUAGES')}
                  className={`py-3 text-center border-b-2 font-bold transition-all ${
                    activeTab === 'LANGUAGES'
                      ? 'border-[#A67938] text-[#8C6126] bg-[#FAF8F5]'
                      : 'border-transparent text-[#665547] hover:text-[#26211A]'
                  }`}
                >
                  NLP (14)
                </button>
                <button
                  onClick={() => setActiveTab('NOTIFICATIONS')}
                  className={`py-3 text-center border-b-2 font-bold transition-all relative ${
                    activeTab === 'NOTIFICATIONS'
                      ? 'border-[#A67938] text-[#8C6126] bg-[#FAF8F5]'
                      : 'border-transparent text-[#665547] hover:text-[#26211A]'
                  }`}
                >
                  <span>Alerts</span>
                  {unreadCount > 0 && (
                    <span className="ml-1 px-1.5 py-0.2 rounded-full text-[9px] bg-[#A67938] text-white font-bold">
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
                      <div className="text-[11px] font-mono uppercase tracking-wider text-red-700 mb-2 flex items-center justify-between">
                        <span>CinePass Audience Lounge</span>
                        <span className="text-[10px] bg-red-100 text-red-800 px-2 py-0.5 rounded-full border border-red-200">
                          Active Pass
                        </span>
                      </div>

                      {[
                        { title: 'Movies & Screenings', desc: 'Watch trailers & screening cuts', hash: '#movies', icon: Film, color: 'text-red-700 bg-red-100' },
                        { title: 'Cinema Bookings', desc: 'Reserve theatrical seats & passes', hash: '#bookings', icon: Ticket, color: 'text-[#A67938] bg-[#A67938]/15' },
                        { title: 'Live Events & Q&A', desc: 'Live director broadcasts & red carpets', hash: '#events', icon: Radio, color: 'text-purple-700 bg-purple-100' },
                        { title: 'Studio Updates', desc: 'Official production logs & news', hash: '#updates', icon: Megaphone, color: 'text-sky-700 bg-sky-100' },
                        { title: 'Audience Alerts', desc: 'Premiere broadcasts & studio alerts', hash: '#alerts', icon: Bell, color: 'text-rose-700 bg-rose-100' },
                        { title: 'CinePass VIP Perks', desc: 'Exclusive merchandise & collectibles', hash: '#perks', icon: Sparkles, color: 'text-amber-700 bg-amber-100' },
                        { title: 'Behind-The-Scenes', desc: 'Uncut rehearsal footage & commentary', hash: '#bts', icon: Video, color: 'text-emerald-700 bg-emerald-100' }
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
                            className="w-full flex items-center justify-between p-3 rounded-2xl bg-white/80 hover:bg-white border border-[#E8E2D8] hover:border-red-300 text-left transition-all group shadow-xs"
                          >
                            <div className="flex items-center space-x-3">
                              <div className={`p-2.5 rounded-xl ${item.color}`}>
                                <Icon className="w-5 h-5" />
                              </div>
                              <div>
                                <div className="text-sm font-bold text-[#26211A] group-hover:text-red-700 font-cinematic">
                                  {item.title}
                                </div>
                                <div className="text-xs text-[#665547]">{item.desc}</div>
                              </div>
                            </div>
                            <span className="text-xs text-red-700 font-mono">View →</span>
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                  <div className="space-y-2">
                    <div className="text-[11px] font-mono uppercase tracking-wider text-[#665547] mb-2">
                      Platform Consoles & Tools
                    </div>

                    <button
                      onClick={() => navigateTo('/dashboard')}
                      className="w-full flex items-center justify-between p-3 rounded-2xl bg-white/80 hover:bg-white border border-[#E8E2D8] hover:border-[#A67938]/50 text-left transition-all group shadow-xs"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="p-2.5 rounded-xl bg-purple-100 text-purple-700">
                          <Layers className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-[#26211A] group-hover:text-[#8C6126] font-cinematic">
                            {t('nav.dashboard', 'Studio Dashboard')}
                          </div>
                          <div className="text-xs text-[#665547]">
                            {currentUser ? `${activeRole.replace('_', ' ')} Workspace` : 'Guest Console'}
                          </div>
                        </div>
                      </div>
                      <span className="text-xs text-[#A67938] font-mono">Open →</span>
                    </button>

                    <button
                      onClick={() => navigateTo('/dashboard#collaborations')}
                      className="w-full flex items-center justify-between p-3 rounded-2xl bg-white/80 hover:bg-white border border-[#E8E2D8] hover:border-[#A67938]/50 text-left transition-all group shadow-xs"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="p-2.5 rounded-xl bg-[#A67938]/15 text-[#8C6126]">
                          <Film className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-[#26211A] group-hover:text-[#8C6126] font-cinematic">
                            {t('nav.collaborations', 'Film Collaborations')}
                          </div>
                          <div className="text-xs text-[#665547]">Inbound inquiries & dispatched proposals</div>
                        </div>
                      </div>
                      <span className="text-xs text-[#A67938] font-mono">Open →</span>
                    </button>

                    <button
                      onClick={() => navigateTo('/talent')}
                      className="w-full flex items-center justify-between p-3 rounded-2xl bg-white/80 hover:bg-white border border-[#E8E2D8] hover:border-[#A67938]/50 text-left transition-all group shadow-xs"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="p-2.5 rounded-xl bg-blue-100 text-blue-700">
                          <Users className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-[#26211A] group-hover:text-[#8C6126] font-cinematic">
                            {t('nav.discover', 'Talent Directory')}
                          </div>
                          <div className="text-xs text-[#665547]">Explore 30 verified film industry crafts</div>
                        </div>
                      </div>
                      <span className="text-xs text-[#A67938] font-mono">Open →</span>
                    </button>

                    <button
                      onClick={() => navigateTo('/opportunities')}
                      className="w-full flex items-center justify-between p-3 rounded-2xl bg-white/80 hover:bg-white border border-[#E8E2D8] hover:border-[#A67938]/50 text-left transition-all group shadow-xs"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-700">
                          <Briefcase className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-[#26211A] group-hover:text-[#8C6126] font-cinematic">
                            {t('nav.opportunities', 'Production Calls & Castings')}
                          </div>
                          <div className="text-xs text-[#665547]">Live cast & crew notices from producers</div>
                        </div>
                      </div>
                      <span className="text-xs text-[#A67938] font-mono">Open →</span>
                    </button>

                    <button
                      onClick={() => navigateTo('/movies')}
                      className="w-full flex items-center justify-between p-3 rounded-2xl bg-white/80 hover:bg-white border border-[#E8E2D8] hover:border-[#A67938]/50 text-left transition-all group shadow-xs"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="p-2.5 rounded-xl bg-amber-100 text-amber-700">
                          <Film className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-[#26211A] group-hover:text-[#8C6126] font-cinematic">
                            Cinema Discovery & Box Office
                          </div>
                          <div className="text-xs text-[#665547]">Festival previews & theatrical releases</div>
                        </div>
                      </div>
                      <span className="text-xs text-[#A67938] font-mono">Open →</span>
                    </button>

                    <button
                      onClick={() => navigateTo('/events')}
                      className="w-full flex items-center justify-between p-3 rounded-2xl bg-white/80 hover:bg-white border border-[#E8E2D8] hover:border-[#A67938]/50 text-left transition-all group shadow-xs"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="p-2.5 rounded-xl bg-rose-100 text-rose-700">
                          <Ticket className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-[#26211A] group-hover:text-[#8C6126] font-cinematic">
                            Film Galas & Premiere Passes
                          </div>
                          <div className="text-xs text-[#665547]">Red carpets, festivals & private screenings</div>
                        </div>
                      </div>
                      <span className="text-xs text-[#A67938] font-mono">Open →</span>
                    </button>

                    <button
                      onClick={() => navigateTo('/escrow')}
                      className="w-full flex items-center justify-between p-3 rounded-2xl bg-white/80 hover:bg-white border border-[#E8E2D8] hover:border-[#A67938]/50 text-left transition-all group shadow-xs"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="p-2.5 rounded-xl bg-teal-100 text-teal-700">
                          <Shield className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-[#26211A] group-hover:text-[#8C6126] font-cinematic">
                            {t('nav.escrow', 'Production Escrow Vault')}
                          </div>
                          <div className="text-xs text-[#665547]">Secure milestones & transparent payouts</div>
                        </div>
                      </div>
                      <span className="text-xs text-[#A67938] font-mono">Open →</span>
                    </button>

                    {isAdmin && (
                      <button
                        onClick={() => navigateTo('/admin')}
                        className="w-full flex items-center justify-between p-3 rounded-2xl bg-red-50 hover:bg-red-100/80 border border-red-200 text-left transition-all group shadow-xs"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="p-2.5 rounded-xl bg-red-100 text-red-700">
                            <Shield className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="text-sm font-bold text-red-800 group-hover:text-red-900 font-cinematic">
                              {t('nav.citadel', 'Admin Citadel Console')}
                            </div>
                            <div className="text-xs text-red-600">Platform security, bans & audit logs</div>
                          </div>
                        </div>
                        <span className="text-xs text-red-700 font-mono">Admin →</span>
                      </button>
                    )}
                  </div>
                ))}

                {/* 2. STUDIO SETTINGS & AUDIO CONTROLS */}
                {activeTab === 'SETTINGS' && (
                  <div className="space-y-5">
                    {/* Shaking Animation Control */}
                    <div className="p-4 rounded-2xl bg-white/80 border border-[#E8E2D8] space-y-3 shadow-xs">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-xs font-bold text-[#26211A] font-cinematic uppercase tracking-wider">
                            {t('action.stopAnimation', 'Stop Shaking Animation')}
                          </div>
                          <div className="text-[11px] text-[#665547] mt-0.5">
                            Freezes camera shake and tremors (auto-stopped when music is muted)
                          </div>
                        </div>
                        <button
                          onClick={() => toggleStopAnimation(!stopAnimation)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            stopAnimation || !isBgmEnabled ? 'bg-[#A67938]' : 'bg-gray-300'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              stopAnimation || !isBgmEnabled ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                      <div className="text-[10px] font-mono p-2 rounded-lg border flex items-center space-x-2 bg-[#FAF8F5] border-[#E8E2D8]">
                        <span className={`w-2 h-2 rounded-full ${isBgmEnabled && !stopAnimation ? 'bg-emerald-500 animate-ping' : 'bg-gray-400'}`} />
                        <span className={isBgmEnabled && !stopAnimation ? 'text-emerald-700 font-medium' : 'text-[#665547]'}>
                          {!isBgmEnabled
                            ? 'Music muted: Shaking animation stopped.'
                            : stopAnimation
                              ? 'Animation paused manually.'
                              : 'Shaking animation active with anime soundtrack.'}
                        </span>
                      </div>
                    </div>

                    {/* Anime Background Music Audio Console */}
                    <div className="p-4 rounded-2xl bg-white/80 border border-[#E8E2D8] space-y-4 shadow-xs">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-xs font-bold text-[#26211A] font-cinematic uppercase tracking-wider flex items-center space-x-1.5">
                            <Radio className="w-4 h-4 text-[#A67938]" />
                            <span>Anime Role Soundtrack (BGM)</span>
                          </div>
                          <div className="text-[11px] text-[#8C6126] font-mono mt-0.5">
                            {currentTrack.anime}: {currentTrack.title}
                          </div>
                        </div>
                        <button
                          onClick={() => toggleBgm(!isBgmEnabled)}
                          className={`p-2 rounded-xl text-xs font-bold flex items-center space-x-1 border transition-all ${
                            isBgmEnabled
                              ? 'bg-[#A67938] text-white border-[#A67938]'
                              : 'bg-white text-[#665547] border-[#E8E2D8]'
                          }`}
                        >
                          {isBgmEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                          <span>{isBgmEnabled ? 'Active' : 'Muted'}</span>
                        </button>
                      </div>

                      {/* Volume Slider */}
                      <div className="space-y-1.5 pt-1">
                        <div className="flex justify-between text-[11px] font-mono text-[#665547]">
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
                          className="w-full accent-[#A67938] cursor-pointer"
                        />
                      </div>
                      <div className="text-[10px] text-[#8C6126] font-mono">
                        Theme vibe: {currentTrack.vibe}
                      </div>
                    </div>

                    {/* Install CineVantaara App Card */}
                    <div className="p-4 rounded-2xl bg-gradient-to-br from-[#A67938]/12 via-white/80 to-transparent border border-[#A67938]/30 space-y-2 shadow-xs">
                      <div className="flex items-center justify-between">
                        <div className="text-xs font-bold text-[#26211A] font-cinematic uppercase tracking-wider flex items-center space-x-1.5">
                          <Smartphone className="w-4 h-4 text-[#A67938]" />
                          <span>Install CineVantaara App</span>
                        </div>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#A67938]/15 text-[#8C6126] font-bold">
                          PWA / Mobile
                        </span>
                      </div>
                      <p className="text-[11px] text-[#665547]">
                        Install on your phone or desktop for instant full-screen cinema access, offline speed, and zero app-store download delays.
                      </p>
                      <button
                        onClick={() => setInstallModalOpen(true)}
                        className="w-full py-2.5 rounded-xl font-cinematic font-bold text-xs uppercase tracking-wider bg-gradient-to-r from-[#B88B4A] to-[#A67938] hover:from-[#A67938] hover:to-[#8C6126] text-white flex items-center justify-center space-x-2 transition shadow-xs"
                      >
                        <Smartphone className="w-4 h-4" />
                        <span>{isInstalled ? 'App Installed (Open)' : 'Install App to Device'}</span>
                      </button>
                    </div>

                    {/* Download Full Source Code ZIP */}
                    <div className="p-4 rounded-2xl bg-[#A67938]/10 border border-[#A67938]/30 space-y-2 shadow-xs">
                      <div className="text-xs font-bold text-[#8C6126] font-cinematic uppercase tracking-wider">
                        Complete Codebase Archive
                      </div>
                      <p className="text-[11px] text-[#665547]">
                        Download the comprehensive repository package including React 18, Spring Boot 3, FastAPI, and anime audio assets.
                      </p>
                      <a
                        href="/CineVantaara-Complete-Codebase.zip"
                        download="CineVantaara-Complete-Codebase.zip"
                        className="w-full py-2.5 rounded-xl font-cinematic font-bold text-xs uppercase tracking-wider bg-[#A67938] hover:bg-[#8C6126] text-white flex items-center justify-center space-x-2 transition-all shadow-xs"
                      >
                        <Download className="w-4 h-4" />
                        <span>Download Codebase ZIP</span>
                      </a>
                    </div>
                  </div>
                )}

                {/* 3. MULTILINGUAL NLP LANGUAGES TAB */}
                {activeTab === 'LANGUAGES' && (
                  <div className="space-y-4">
                    <div className="text-[11px] font-mono uppercase tracking-wider text-[#665547]">
                      Select Platform Language (NLP Translation)
                    </div>
                    <p className="text-xs text-[#665547]">
                      Instantly translates the entire platform including cinematic proverbs, mottos, and studio widgets. Nothing remains untranslated.
                    </p>

                    <div className="space-y-3">
                      <div className="text-[10px] uppercase font-mono font-bold text-[#8C6126] px-1">
                        Indian Regional Cinema Languages (First Priority)
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {SUPPORTED_LANGUAGES.filter(l => l.region === 'Indian').map(lang => (
                          <button
                            key={lang.code}
                            onClick={() => setLanguage(lang.code)}
                            className={`p-3 rounded-xl border text-left transition-all flex items-center justify-between ${
                              currentLanguage === lang.code
                                ? 'bg-[#A67938]/15 text-[#8C6126] border-[#A67938]/50 font-bold shadow-xs'
                                : 'bg-white/80 text-[#26211A] border-[#E8E2D8] hover:bg-white'
                            }`}
                          >
                            <div>
                              <div className="text-sm font-bold">{lang.nativeName}</div>
                              <div className="text-[10px] text-[#665547] uppercase font-mono">{lang.label}</div>
                            </div>
                            {currentLanguage === lang.code && (
                              <CheckCircle className="w-4 h-4 text-[#A67938]" />
                            )}
                          </button>
                        ))}
                      </div>

                      <div className="text-[10px] uppercase font-mono font-bold text-[#665547] px-1 pt-2">
                        Global Cinema Languages
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {SUPPORTED_LANGUAGES.filter(l => l.region === 'Global').map(lang => (
                          <button
                            key={lang.code}
                            onClick={() => setLanguage(lang.code)}
                            className={`p-3 rounded-xl border text-left transition-all flex items-center justify-between ${
                              currentLanguage === lang.code
                                ? 'bg-[#A67938]/15 text-[#8C6126] border-[#A67938]/50 font-bold shadow-xs'
                                : 'bg-white/80 text-[#26211A] border-[#E8E2D8] hover:bg-white'
                            }`}
                          >
                            <div>
                              <div className="text-sm font-bold">{lang.nativeName}</div>
                              <div className="text-[10px] text-[#665547] uppercase font-mono">{lang.label}</div>
                            </div>
                            {currentLanguage === lang.code && (
                              <CheckCircle className="w-4 h-4 text-[#A67938]" />
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
                    <div className="flex items-center justify-between pb-2 border-b border-[#E8E2D8]">
                      <div className="text-xs font-bold text-[#26211A] font-cinematic uppercase tracking-wider">
                        Production Alerts ({notifications.filter(n => (n.type === 'OPPORTUNITY_MATCH' || n.type === 'SYSTEM') && !n.isRead).length})
                      </div>
                      {notifications.some(n => !n.isRead) && (
                        <button
                          onClick={markAllAsRead}
                          className="text-xs text-[#8C6126] hover:underline font-mono"
                        >
                          Mark all as read
                        </button>
                      )}
                    </div>

                    <div className="space-y-2">
                      {notifications.filter(n => n.type === 'OPPORTUNITY_MATCH' || n.type === 'SYSTEM').length === 0 ? (
                        <div className="py-12 text-center text-xs text-[#665547] space-y-2">
                          <Bell className="w-8 h-8 mx-auto text-[#A67938]" />
                          <div className="font-semibold text-[#26211A]">No New Production Alerts</div>
                          <p className="text-[11px] text-[#665547] max-w-xs mx-auto">
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
                              className={`p-3.5 rounded-2xl border cursor-pointer transition-all alert-card-item shadow-xs ${
                                n.isRead
                                  ? 'bg-white/60 border-[#E8E2D8] opacity-75'
                                  : n.type === 'SYSTEM'
                                  ? 'bg-red-50 border-red-200'
                                  : 'bg-white border-[#A67938]/40'
                              }`}
                            >
                              <div className={`text-xs font-bold ${n.type === 'SYSTEM' ? 'text-red-700' : 'text-[#8C6126]'}`}>
                                {n.title}
                              </div>
                              <div className="text-xs text-[#665547] mt-1 leading-relaxed">{n.message}</div>
                              <div className="text-[10px] text-[#665547] mt-1 font-mono flex items-center justify-between">
                                <span>{n.timestamp}</span>
                                <span className="uppercase text-[9px] px-1.5 py-0.5 rounded bg-[#FAF8F5] border border-[#E8E2D8] font-bold">
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
              <div className="p-4 border-t border-[#E8E2D8] bg-[#F4EBE1] flex items-center justify-between text-xs text-[#665547] font-mono">
                <span>CineVantaara v2.4</span>
                <span>All 14 Languages Supported</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Floating App Bar */}
      {!isInstalled && (
        <div className="md:hidden fixed bottom-4 left-3 right-3 z-40 bg-[#FAF8F5]/95 border border-[#A67938]/40 backdrop-blur-xl p-2.5 rounded-2xl shadow-xl flex items-center justify-between">
          <div className="flex items-center space-x-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#B88B4A] to-[#A67938] p-0.5 shrink-0">
              <img src="/brand/logo-master.png" alt="CineVantaara" className="w-full h-full rounded-md object-contain bg-[#FAF8F5]" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-[#26211A] truncate font-cinematic">CineVantaara App</div>
              <div className="text-[10px] text-[#8C6126] font-mono truncate">Install to Phone / Download APK</div>
            </div>
          </div>
          <button
            onClick={() => setInstallModalOpen(true)}
            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#B88B4A] to-[#A67938] hover:from-[#A67938] hover:to-[#8C6126] text-white font-cinematic font-bold text-[11px] uppercase tracking-wider shrink-0 shadow-md transition active:scale-95"
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
