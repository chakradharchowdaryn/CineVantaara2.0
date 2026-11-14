import React, { useState, useMemo, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useBgm } from '../context/BgmContext';
import { useLanguage } from '../context/LanguageContext';
import { RoleWelcomeBanner } from '../components/layout/RoleWelcomeBanner';
import { RoleSpecializedWidget } from '../components/dashboard/RoleSpecializedWidget';
import { TalentCard } from '../components/common/TalentCard';
import { OpportunityCard } from '../components/common/OpportunityCard';
import { CollaborationModal } from '../components/common/CollaborationModal';
import { CreateOpportunityModal } from '../components/common/CreateOpportunityModal';
import { ApplicationModal } from '../components/common/ApplicationModal';
import {
  INITIAL_OPPORTUNITIES,
  INITIAL_COLLAB_REQUESTS,
  INITIAL_REVIEWS,
  calculateRealRoleMetrics
} from '../services/mockData';
import { User, Opportunity, Application, CollaborationRequest, ProfessionalRole } from '../types';
import { Sparkles, Users, Briefcase, Film, ArrowRight, Check, X, PlusCircle, Trash2, RotateCcw, MessageSquare, Send, Inbox, Radio, Bookmark } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useNotifications } from '../context/NotificationContext';
import { getSavedTalents, getSavedOpportunities, getSavedMovies, toggleSaveTalent, toggleSaveOpportunity, toggleSaveMovie } from '../services/savedItemsService';
import { Movie } from '../services/movieService';

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

export const DashboardPage: React.FC = () => {
  const { currentUser, activeRole, switchActiveRole, isAdmin } = useAuth();
  const { theme } = useTheme();
  const { t } = useLanguage();
  const { isBgmEnabled, stopAnimation } = useBgm();
  const navigate = useNavigate();
  const location = useLocation();
  const { addNotification } = useNotifications();

  // Animation is active by default with anime soundtrack, and freezes when music is muted
  const isAnimationActive = isBgmEnabled && !stopAnimation;

  const [collabTab, setCollabTab] = useState<'RECEIVED' | 'SENT'>('RECEIVED');
  const [dashboardView, setDashboardView] = useState<'WORKSPACE' | 'BOOKMARKS'>('WORKSPACE');
  const [savedTalents, setSavedTalents] = useState<User[]>(() => getSavedTalents());
  const [savedOpps, setSavedOpps] = useState<Opportunity[]>(() => getSavedOpportunities());
  const [savedMovies, setSavedMovies] = useState<Movie[]>(() => getSavedMovies());

  const refreshSavedItems = () => {
    setSavedTalents(getSavedTalents());
    setSavedOpps(getSavedOpportunities());
    setSavedMovies(getSavedMovies());
  };

  // Smooth scroll to collaborations if hash is present
  useEffect(() => {
    if (location.hash === '#collaborations' || window.location.hash === '#collaborations') {
      const timer = setTimeout(() => {
        const el = document.getElementById('collaborations');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [location]);

  // Strict rule: Strictly display ONLY the roles the user selected (strictly capped at maximum 3 roles)!
  // Never show all 30+ roles under any circumstance.
  const userPersonas = useMemo(() => {
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

  // State management for talent, opportunities, and requests loaded from storage
  const [talents, setTalents] = useState<User[]>(() => {
    try {
      const saved = localStorage.getItem('cv_registered_users');
      if (saved) {
        const parsed: User[] = JSON.parse(saved);
        return parsed.filter(u =>
          u.id !== currentUser?.id &&
          u.email?.toLowerCase() !== currentUser?.email?.toLowerCase() &&
          !u.isAdmin &&
          !u.roles.includes('SUPER_ADMIN') &&
          !u.roles.includes('PLATFORM_ADMIN') &&
          u.name?.toLowerCase().trim() !== 'kiran' &&
          u.email?.toLowerCase().trim() !== 'kirans3792@gmail.com'
        );
      }
    } catch (e) {}
    return [];
  });

  const [opportunities, setOpportunities] = useState<Opportunity[]>(() => {
    try {
      const saved = localStorage.getItem('cv_opportunities');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return INITIAL_OPPORTUNITIES;
  });

  const [collabRequests, setCollabRequests] = useState<CollaborationRequest[]>(() => {
    try {
      const saved = localStorage.getItem('cv_collab_requests');
      if (saved) {
        const parsed: CollaborationRequest[] = JSON.parse(saved);
        // Strictly purge any collaboration request involving Kiran or admin emails
        const clean = parsed.filter(c =>
          c.senderName?.toLowerCase().trim() !== 'kiran' &&
          c.receiverName?.toLowerCase().trim() !== 'kiran' &&
          c.senderEmail?.toLowerCase().trim() !== 'kirans3792@gmail.com' &&
          c.receiverEmail?.toLowerCase().trim() !== 'kirans3792@gmail.com' &&
          !c.senderId?.toLowerCase().includes('kiran') &&
          !c.receiverId?.toLowerCase().includes('kiran')
        );
        if (clean.length !== parsed.length) {
          localStorage.setItem('cv_collab_requests', JSON.stringify(clean));
        }
        return clean;
      }
    } catch (e) {}
    return INITIAL_COLLAB_REQUESTS;
  });

  const [reviews, setReviews] = useState(INITIAL_REVIEWS);

  // Modals
  const [selectedTalentForCollab, setSelectedTalentForCollab] = useState<User | null>(null);
  const [selectedOppForApply, setSelectedOppForApply] = useState<Opportunity | null>(null);
  const [isCreateOppOpen, setIsCreateOppOpen] = useState(false);

  // Filtered collaboration requests: strictly separates inbound inquiries from outbound sent proposals
  const currentUserId = currentUser?.id || '';
  const currentUserName = currentUser?.name || '';

  const receivedCollabs = useMemo(() => {
    return collabRequests.filter(c => {
      // Strictly exclude any rogue Kiran or admin requests
      if (
        c.senderName?.toLowerCase().trim() === 'kiran' ||
        c.receiverName?.toLowerCase().trim() === 'kiran' ||
        c.senderEmail?.toLowerCase().trim() === 'kirans3792@gmail.com' ||
        c.receiverEmail?.toLowerCase().trim() === 'kirans3792@gmail.com' ||
        c.senderId?.toLowerCase().includes('kiran') ||
        c.receiverId?.toLowerCase().includes('kiran')
      ) {
        return false;
      }
      return (
        c.receiverId === currentUserId ||
        (currentUserName && c.receiverName?.toLowerCase() === currentUserName.toLowerCase())
      );
    });
  }, [collabRequests, currentUserId, currentUserName]);

  const sentCollabs = useMemo(() => {
    return collabRequests.filter(c => {
      if (
        c.senderName?.toLowerCase().trim() === 'kiran' ||
        c.receiverName?.toLowerCase().trim() === 'kiran' ||
        c.senderEmail?.toLowerCase().trim() === 'kirans3792@gmail.com' ||
        c.receiverEmail?.toLowerCase().trim() === 'kirans3792@gmail.com' ||
        c.senderId?.toLowerCase().includes('kiran') ||
        c.receiverId?.toLowerCase().includes('kiran')
      ) {
        return false;
      }
      return (
        c.senderId === currentUserId ||
        (currentUserName && c.senderName?.toLowerCase() === currentUserName.toLowerCase())
      );
    });
  }, [collabRequests, currentUserId, currentUserName]);

  // Real Calculated Metrics (Dynamically computed from actual state)
  const realMetrics = useMemo(() => {
    return calculateRealRoleMetrics(
      activeRole,
      currentUser,
      opportunities,
      [],
      collabRequests,
      reviews
    );
  }, [activeRole, currentUser, opportunities, collabRequests, reviews]);

  const isOwnOpportunity = (opp: Opportunity) => {
    if (!currentUser) return false;
    if (opp.producerId && (opp.producerId === currentUser.id || opp.producerId === currentUser.email)) return true;
    if (opp.producerEmail && currentUser.email && opp.producerEmail.toLowerCase() === currentUser.email.toLowerCase()) return true;
    if (opp.producerName && currentUser.name && opp.producerName.toLowerCase().trim() === currentUser.name.toLowerCase().trim()) return true;
    return false;
  };

  // The creator himself must NOT see his own opportunity in open opportunities; only all other users see it!
  const openOpportunities = useMemo(() => {
    return opportunities.filter(opp => !isOwnOpportunity(opp));
  }, [opportunities, currentUser]);

  const handleAcceptCollab = (id: string) => {
    const target = collabRequests.find(c => c.id === id);
    const updated = collabRequests.map(c => (c.id === id ? { ...c, status: 'ACCEPTED' as const } : c));
    setCollabRequests(updated);
    try {
      localStorage.setItem('cv_collab_requests', JSON.stringify(updated));
    } catch (e) {}

    if (target) {
      addNotification({
        userId: currentUser?.id || 'me',
        title: 'Collaboration Offer Accepted',
        message: `You accepted "${target.projectTitle}" with ${target.senderName}. Private encrypted channel unlocked.`,
        type: 'COLLAB_REQUEST',
        linkUrl: `/messages?userName=${encodeURIComponent(target.senderName)}`
      });
    }
  };

  const handleDeclineCollab = (id: string) => {
    const updated = collabRequests.map(c => (c.id === id ? { ...c, status: 'REJECTED' as const } : c));
    setCollabRequests(updated);
    try {
      localStorage.setItem('cv_collab_requests', JSON.stringify(updated));
    } catch (e) {}
  };

  const handleCreateOpportunity = (newOpp: Opportunity) => {
    const updated = [newOpp, ...opportunities];
    setOpportunities(updated);
    try {
      localStorage.setItem('cv_opportunities', JSON.stringify(updated));
    } catch (e) {}
  };

  const handleApplicationSubmitted = (newApp: Application) => {
    setOpportunities(prev =>
      prev.map(o =>
        o.id === newApp.opportunityId ? { ...o, applicantsCount: (o.applicantsCount || 0) + 1 } : o
      )
    );
  };

  return (
    <div className="min-h-screen pb-20 pt-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
      
      {/* 1. Dynamic Hollywood Role Welcome Banner with Real Computed Metrics */}
      <RoleWelcomeBanner
        onOpenCreateModal={() => setIsCreateOppOpen(true)}
        metrics={realMetrics}
      />

      {/* Film Crew Persona Ribbon: Displays strictly the user's selected dashboards (up to 3) */}
      {userPersonas.length > 1 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs px-1">
            <div className="flex items-center space-x-2 text-gray-400">
              <span className={`w-2 h-2 rounded-full ${isAnimationActive ? 'animate-ping' : ''}`} style={{ backgroundColor: theme.primaryColor }} />
              <span className="font-cinematic font-bold uppercase tracking-wider text-white">Your Active Dashboards</span>
              <span className="text-gray-500">({userPersonas.length} Selected Roles)</span>
            </div>
            <span className="text-[11px] font-mono text-gray-400 hidden sm:inline">Click to switch console workspace & tools</span>
          </div>

          <div className="flex items-center space-x-2.5 overflow-x-auto pb-3 pt-1 scrollbar-none">
            {userPersonas.map(p => {
              const isActive = activeRole === p.role;
              return (
                <button
                  key={p.role}
                  onClick={() => switchActiveRole(p.role)}
                  className={`px-4 py-2.5 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all flex items-center space-x-2 shadow-sm ${
                    isActive
                      ? 'text-white border shadow-lg font-bold'
                      : 'bg-black/50 text-gray-400 hover:text-white border border-white/10 hover:border-white/20'
                  }`}
                  style={
                    isActive
                      ? {
                          backgroundColor: `${theme.primaryColor}30`,
                          borderColor: theme.primaryColor,
                          boxShadow: `0 0 15px ${theme.primaryColor}40`
                        }
                      : {}
                  }
                >
                  <span>{p.icon}</span>
                  <span className={isActive ? 'font-bold text-white' : ''}>{p.label} Dashboard</span>
                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: theme.accentColor }} />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Hollywood Studio Telemetry Specs Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 p-3.5 rounded-2xl bg-black/50 border border-white/10 text-xs backdrop-blur-md">
        <div className="flex flex-col px-2">
          <span className="text-[10px] uppercase font-mono text-gray-500">Timecode</span>
          <span className="font-mono font-bold text-amber-400 text-xs">01:48:22:18 (24 FPS)</span>
        </div>
        <div className="flex flex-col px-2">
          <span className="text-[10px] uppercase font-mono text-gray-500">Aspect Ratio</span>
          <span className="font-semibold text-gray-300 text-xs">2.39:1 Anamorphic</span>
        </div>
        <div className="flex flex-col px-2">
          <span className="text-[10px] uppercase font-mono text-gray-500">Color Pipeline</span>
          <span className="font-semibold text-gray-300 text-xs">ACEScc / DCI-P3 D65</span>
        </div>
        <div className="flex flex-col px-2">
          <span className="text-[10px] uppercase font-mono text-gray-500">Sound Master</span>
          <span className="font-semibold text-gray-300 text-xs">Dolby Atmos 7.1.4</span>
        </div>
        <div className="flex flex-col px-2">
          <span className="text-[10px] uppercase font-mono text-gray-500">Cryptographic E2EE</span>
          <span className="font-semibold text-emerald-400 text-xs">AES-GCM 256-Bit</span>
        </div>
        <div className="flex items-center justify-end px-2">
          <button
            onClick={() => setIsCreateOppOpen(true)}
            className="w-full sm:w-auto px-3.5 py-1.5 rounded-xl font-bold uppercase tracking-wider text-[11px] bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black shadow-glow-gold flex items-center justify-center space-x-1.5 transition-all"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Post Opp</span>
          </button>
        </div>
      </div>

      {/* Platform View Switcher: Studio Workspace vs Saved Bookmarks */}
      <div className="flex items-center justify-between pb-2 border-b border-white/10">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setDashboardView('WORKSPACE')}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center space-x-2 transition-all ${
              dashboardView === 'WORKSPACE'
                ? 'bg-amber-500 text-black shadow-glow-gold'
                : 'bg-black/40 text-gray-400 hover:text-white border border-white/10'
            }`}
          >
            <Film className="w-4 h-4" />
            <span>Studio Workspace</span>
          </button>

          <button
            onClick={() => {
              refreshSavedItems();
              setDashboardView('BOOKMARKS');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center space-x-2 transition-all ${
              dashboardView === 'BOOKMARKS'
                ? 'bg-amber-500 text-black shadow-glow-gold'
                : 'bg-black/40 text-gray-400 hover:text-white border border-white/10'
            }`}
          >
            <Bookmark className="w-4 h-4" />
            <span>Saved Bookmarks ({savedTalents.length + savedOpps.length + savedMovies.length})</span>
          </button>
        </div>
      </div>

      {/* SAVED BOOKMARKS HUB (Phase 5: Item 30) */}
      {dashboardView === 'BOOKMARKS' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          <div className="p-6 rounded-3xl bg-[#111218] border border-amber-500/20 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-cinematic font-bold text-white flex items-center space-x-2">
                  <Bookmark className="w-5 h-5 text-amber-400" />
                  <span>My Saved Studio Bookmarks</span>
                </h2>
                <p className="text-xs text-gray-400 mt-1">
                  Access bookmarked creators, saved casting calls, and short-listed movies in one place.
                </p>
              </div>
              <button
                onClick={refreshSavedItems}
                className="px-3 py-1.5 rounded-xl text-xs bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 flex items-center space-x-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Refresh</span>
              </button>
            </div>
          </div>

          {/* 1. Saved Film Professionals */}
          <div className="space-y-3">
            <h3 className="text-base font-cinematic font-bold text-white flex items-center space-x-2">
              <Users className="w-4 h-4 text-amber-400" />
              <span>Saved Film Professionals ({savedTalents.length})</span>
            </h3>
            {savedTalents.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedTalents.map(t => (
                  <TalentCard
                    key={t.id}
                    user={t}
                    onCollaborate={(talent) => setSelectedTalentForCollab(talent)}
                  />
                ))}
              </div>
            ) : (
              <div className="p-6 rounded-2xl bg-black/30 border border-white/5 text-center text-xs text-gray-400">
                No film professionals bookmarked yet. Click the star/sparkle icon on any creator card to save them.
              </div>
            )}
          </div>

          {/* 2. Saved Opportunities */}
          <div className="space-y-3">
            <h3 className="text-base font-cinematic font-bold text-white flex items-center space-x-2">
              <Briefcase className="w-4 h-4 text-amber-400" />
              <span>Saved Production Opportunities ({savedOpps.length})</span>
            </h3>
            {savedOpps.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {savedOpps.map(opp => (
                  <OpportunityCard
                    key={opp.id}
                    opportunity={opp}
                    onApply={(o) => setSelectedOppForApply(o)}
                  />
                ))}
              </div>
            ) : (
              <div className="p-6 rounded-2xl bg-black/30 border border-white/5 text-center text-xs text-gray-400">
                No casting calls or opportunities bookmarked yet.
              </div>
            )}
          </div>

          {/* 3. Saved Movies */}
          <div className="space-y-3">
            <h3 className="text-base font-cinematic font-bold text-white flex items-center space-x-2">
              <Film className="w-4 h-4 text-amber-400" />
              <span>Saved Films & Premieres ({savedMovies.length})</span>
            </h3>
            {savedMovies.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {savedMovies.map(movie => (
                  <div key={movie.id} className="p-4 rounded-2xl bg-black/50 border border-white/10 space-y-2">
                    <img src={movie.posterUrl} alt={movie.title} className="w-full h-44 object-cover rounded-xl" />
                    <h4 className="text-sm font-bold text-white truncate">{movie.title}</h4>
                    <p className="text-xs text-amber-300 font-mono">
                      {(movie.genres || []).slice(0, 2).join(', ')} • {movie.releaseDate?.split('-')[0] || '2026'}
                    </p>
                    <div className="flex items-center justify-between pt-2">
                      <Link to="/movies" className="text-xs text-amber-400 hover:underline">View in Cinema</Link>
                      <button
                        onClick={() => {
                          toggleSaveMovie(movie);
                          refreshSavedItems();
                        }}
                        className="text-xs text-red-400 hover:text-red-300"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 rounded-2xl bg-black/30 border border-white/5 text-center text-xs text-gray-400">
                No movies bookmarked yet. Browse the Movie Discovery Hub (`/movies`) and save your favorite releases.
              </div>
            )}
          </div>
        </div>
      )}

      {/* STANDARD WORKSPACE (Shown when dashboardView === 'WORKSPACE') */}
      {dashboardView === 'WORKSPACE' && (
        <div className="space-y-10">

      {/* 2. Specialized Interactive Role Workbench */}
      <RoleSpecializedWidget
        role={activeRole}
        onActionClick={(action) => {
          if (action === 'CREATE_OPP') setIsCreateOppOpen(true);
        }}
      />

      {/* 3. Creative Collaborations (Separated by Inbound Received vs Outbound Sent) */}
      <div id="collaborations" className="rounded-3xl bg-[#111218]/90 border border-white/10 p-6 sm:p-8 space-y-6 shadow-2xl scroll-mt-24">
        
        {/* Header & Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/10 gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Film className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-cinematic font-bold text-white">
                {t('nav.collaborations', 'Creative Collaborations & Inquiries')}
              </h2>
              <p className="text-xs text-gray-400">
                Direct in-app project proposals routed between creators
              </p>
            </div>
          </div>

          {/* Received vs Sent Tab Switcher */}
          <div className="flex items-center p-1 rounded-2xl bg-black/60 border border-white/10 text-xs">
            <button
              onClick={() => setCollabTab('RECEIVED')}
              className={`px-3.5 py-1.5 rounded-xl font-bold flex items-center space-x-1.5 transition-all ${
                collabTab === 'RECEIVED'
                  ? 'bg-amber-500 text-black shadow-glow-gold'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Inbox className="w-3.5 h-3.5" />
              <span>Inbound Inquiries ({receivedCollabs.length})</span>
            </button>

            <button
              onClick={() => setCollabTab('SENT')}
              className={`px-3.5 py-1.5 rounded-xl font-bold flex items-center space-x-1.5 transition-all ${
                collabTab === 'SENT'
                  ? 'bg-amber-500 text-black shadow-glow-gold'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Send className="w-3.5 h-3.5" />
              <span>Dispatched Proposals ({sentCollabs.length})</span>
            </button>
          </div>
        </div>

        {/* ================= INBOUND RECEIVED TAB ================= */}
        {collabTab === 'RECEIVED' && (
          <div>
            {receivedCollabs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {receivedCollabs.map(collab => (
                  <div
                    key={collab.id}
                    className="p-5 rounded-2xl bg-black/40 border border-white/5 space-y-3 hover:border-amber-500/30 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <img
                          src={collab.senderAvatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80'}
                          alt={collab.senderName}
                          className="w-10 h-10 rounded-full object-cover border border-amber-500/40"
                        />
                        <div>
                          <div className="text-sm font-bold text-white">{collab.senderName}</div>
                          <div className="text-xs text-amber-300 font-medium">Proposed: {collab.roleProposed}</div>
                        </div>
                      </div>
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${
                          collab.status === 'ACCEPTED'
                            ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                            : collab.status === 'REJECTED'
                            ? 'bg-red-500/10 text-red-300 border-red-500/30'
                            : 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                        }`}
                      >
                        {collab.status}
                      </span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-white/5 text-xs text-gray-300 font-sans leading-relaxed">
                      <div className="font-semibold text-amber-200/90 mb-1">Project: "{collab.projectTitle}"</div>
                      "{collab.message}"
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <button
                        onClick={() => navigate(`/messages?userId=${collab.senderId}&userName=${encodeURIComponent(collab.senderName)}`)}
                        className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-amber-300 hover:bg-amber-500/10 border border-amber-500/20 flex items-center space-x-1.5 transition-colors"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Reply in Chat</span>
                      </button>

                      {collab.status === 'PENDING' && (
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleDeclineCollab(collab.id)}
                            className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-gray-400 hover:text-red-400 hover:bg-white/5 transition-colors flex items-center space-x-1"
                          >
                            <X className="w-3.5 h-3.5" />
                            <span>Pass</span>
                          </button>
                          <button
                            onClick={() => handleAcceptCollab(collab.id)}
                            className="px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider bg-emerald-500 hover:bg-emerald-400 text-black transition-colors flex items-center space-x-1 shadow-sm"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Accept Offer</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center rounded-2xl bg-black/30 border border-white/5 space-y-2">
                <Inbox className="w-8 h-8 text-gray-500 mx-auto" />
                <div className="text-sm font-bold text-gray-300">No Inbound Collaboration Inquiries</div>
                <p className="text-xs text-gray-500">
                  When other film professionals discover your profile and send you a project proposal, it will appear here for your review.
                </p>
              </div>
            )}
          </div>
        )}

        {/* ================= OUTBOUND SENT TAB ================= */}
        {collabTab === 'SENT' && (
          <div>
            {sentCollabs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {sentCollabs.map(collab => (
                  <div
                    key={collab.id}
                    className="p-5 rounded-2xl bg-black/40 border border-white/5 space-y-3 hover:border-amber-500/30 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-[10px] text-gray-500 uppercase tracking-wider font-mono">Dispatched to</div>
                        <div className="text-sm font-bold text-white">{collab.receiverName || 'Film Artist'}</div>
                        <div className="text-xs text-amber-300/80 font-medium mt-0.5">Role: {collab.roleProposed}</div>
                      </div>
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${
                          collab.status === 'ACCEPTED'
                            ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                            : collab.status === 'REJECTED'
                            ? 'bg-red-500/10 text-red-300 border-red-500/30'
                            : 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                        }`}
                      >
                        {collab.status}
                      </span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-white/5 text-xs text-gray-300 font-sans leading-relaxed">
                      <div className="font-semibold text-amber-200/90 mb-1">Project: "{collab.projectTitle}"</div>
                      "{collab.message}"
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <span className="text-[11px] text-gray-500 font-mono">
                        Sent on {collab.createdAt || 'Recent'}
                      </span>
                      <button
                        onClick={() => navigate(`/messages?userId=${collab.receiverId}&userName=${encodeURIComponent(collab.receiverName || '')}`)}
                        className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-amber-300 hover:bg-amber-500/10 border border-amber-500/20 flex items-center space-x-1.5 transition-colors"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Message Artist</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center rounded-2xl bg-black/30 border border-white/5 space-y-2">
                <Send className="w-8 h-8 text-gray-500 mx-auto" />
                <div className="text-sm font-bold text-gray-300">No Dispatched Proposals</div>
                <p className="text-xs text-gray-500">
                  You haven't sent any collaboration requests yet. Explore the Talent Directory below to invite collaborators to your film!
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 4. Film Talent Directory Spotlight */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h2 className="text-xl font-cinematic font-bold text-white">
              {t('nav.discover', 'Film Professionals & Collaborators')} ({talents.length})
            </h2>
          </div>
          <Link
            to="/talent"
            className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center space-x-1"
          >
            <span>View All Roster</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {talents.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {talents.slice(0, 6).map(talent => (
              <TalentCard
                key={talent.id}
                user={talent}
                onCollaborate={(t) => setSelectedTalentForCollab(t)}
              />
            ))}
          </div>
        ) : (
          <div className="p-8 text-center rounded-2xl bg-black/30 border border-white/5 space-y-2">
            <Users className="w-8 h-8 text-gray-600 mx-auto" />
            <div className="text-sm font-bold text-gray-300">Clean Talent Directory Ready</div>
            <p className="text-xs text-gray-500 max-w-sm mx-auto">
              Zero dummy accounts. When other filmmakers register on the platform, their profiles will appear here for discovery and collaboration.
            </p>
          </div>
        )}
      </div>

      {/* 5. Production Opportunities & Casting Calls */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Briefcase className="w-5 h-5 text-amber-400" />
            <h2 className="text-xl font-cinematic font-bold text-white">
              {t('nav.opportunities', 'Open Film Opportunities & Casting Calls')} ({openOpportunities.length})
            </h2>
          </div>
          <Link
            to="/opportunities"
            className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center space-x-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {openOpportunities.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {openOpportunities.map(opp => (
              <OpportunityCard
                key={opp.id}
                opportunity={opp}
                onApply={(o) => setSelectedOppForApply(o)}
              />
            ))}
          </div>
        ) : (
          <div className="p-10 text-center rounded-3xl bg-[#111218]/50 border border-white/10 space-y-3">
            <Briefcase className="w-10 h-10 text-gray-500 mx-auto" />
            <h3 className="text-base font-cinematic font-bold text-white">No External Open Opportunities</h3>
            <p className="text-xs text-gray-400">
              Open casting calls and crew requisitions posted by other directors and producers across the backlot will appear here for you to collaborate on.
            </p>
          </div>
        )}
      </div>
      </div>
      )}

      {/* Modals */}
      <CollaborationModal
        recipient={selectedTalentForCollab}
        isOpen={!!selectedTalentForCollab}
        onClose={() => setSelectedTalentForCollab(null)}
        onSuccess={(req) => setCollabRequests(prev => [req, ...prev])}
      />

      <CreateOpportunityModal
        isOpen={isCreateOppOpen}
        onClose={() => setIsCreateOppOpen(false)}
        onCreate={handleCreateOpportunity}
      />

      <ApplicationModal
        opportunity={selectedOppForApply}
        isOpen={!!selectedOppForApply}
        onClose={() => setSelectedOppForApply(null)}
        onSubmit={handleApplicationSubmitted}
      />
    </div>
  );
};
