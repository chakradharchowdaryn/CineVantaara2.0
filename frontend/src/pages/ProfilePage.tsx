import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Review, ProfessionalRole, User } from '../types';
import {
  Star,
  MapPin,
  Film,
  Award,
  Video,
  ShieldCheck,
  Plus,
  Briefcase,
  Calendar,
  Sparkles,
  Trash2,
  Edit3,
  LogOut,
  X,
  Check,
  Globe,
  Sliders,
  LogIn,
  Settings,
  Camera,
  Upload,
  Image as ImageIcon,
  FileText,
  Music,
  Lock,
  Shield
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useBgm } from '../context/BgmContext';
import { CreativeWork, getStoredWorks, addCreativeWork, deleteCreativeWork } from '../services/portfolioService';
import { validateFileUpload } from '../utils/fileValidation';
import { IpVaultCertificateModal } from '../components/common/IpVaultCertificateModal';

interface UserCredit {
  id: string;
  title: string;
  role: string;
  year: string;
  notes?: string;
}

const ALL_ROLES_OPTIONS: { role: ProfessionalRole; label: string }[] = [
  { role: 'DIRECTOR', label: 'Director' },
  { role: 'PRODUCER', label: 'Producer' },
  { role: 'WRITER', label: 'Writer / Screenwriter' },
  { role: 'ACTOR', label: 'Actor / Performer' },
  { role: 'CINEMATOGRAPHER', label: 'Cinematographer (DOP)' },
  { role: 'EDITOR', label: 'Film Editor' },
  { role: 'MUSIC_DIRECTOR', label: 'Composer / Music Director' },
  { role: 'VFX_ARTIST', label: 'VFX & CGI Supervisor' },
  { role: 'ANIMATOR', label: 'Animator (2D/3D)' },
  { role: 'COLORIST', label: 'Colorist (DI)' },
  { role: 'STUNT_COORDINATOR', label: 'Stunt Coordinator' },
  { role: 'GAFFER', label: 'Chief Lighting (Gaffer)' },
  { role: 'LINE_PRODUCER', label: 'Line Producer / UPM' },
  { role: 'CASTING_DIRECTOR', label: 'Casting Director' },
  { role: 'SCRIPT_SUPERVISOR', label: 'Script Supervisor' },
  { role: 'DRONE_OPERATOR', label: 'Drone Operator / Pilot' },
  { role: 'BOOM_OPERATOR', label: 'Boom Operator' },
  { role: 'MAKEUP_ARTIST', label: 'Makeup / SFX Artist' },
  { role: 'COSTUME_DESIGNER', label: 'Costume Designer' },
  { role: 'ART_DIRECTOR', label: 'Art Director' },
  { role: 'SOUND_DESIGNER', label: 'Sound Designer' },
  { role: 'TECHNICIAN', label: 'Technician / Grip' },
  { role: 'ASSISTANT_DIRECTOR', label: 'Assistant Director' },
  { role: 'PRODUCTION_DESIGNER', label: 'Production Designer' },
  { role: 'CHOREOGRAPHER', label: 'Choreographer' },
  { role: 'FOLEY_ARTIST', label: 'Foley Artist' },
  { role: 'LOCATION_MANAGER', label: 'Location Manager' },
  { role: 'PRODUCTION_COORDINATOR', label: 'Production Coordinator' },
  { role: 'STORYBOARD_ARTIST', label: 'Storyboard Artist' },
  { role: 'DUBBING_ARTIST', label: 'Dubbing Artist / Voice' }
];

export const ProfilePage: React.FC = () => {
  const { currentUser, activeRole, updateProfile, logout } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const { openSettings } = useBgm();

  // Producer rule check
  const isProducer = activeRole === 'PRODUCER';

  // Dynamic state: Zero fake reviews, zero fake credits
  const [reviews, setReviews] = useState<Review[]>([]);
  const [credits, setCredits] = useState<UserCredit[]>(() => {
    const saved = localStorage.getItem(`cv_credits_${currentUser?.id}`);
    return saved ? JSON.parse(saved) : [];
  });

  // Creative Works & Portfolio Vault State (Phase 5: Item 25 & Phase 11: Item 67)
  const [works, setWorks] = useState<CreativeWork[]>(() => {
    const all = getStoredWorks();
    return all.filter(w => w.userId === currentUser?.id || currentUser?.isAdmin);
  });
  const [isAddingWork, setIsAddingWork] = useState(false);
  const [workTitle, setWorkTitle] = useState('');
  const [workCraftType, setWorkCraftType] = useState<'SCRIPT' | 'SHOWREEL' | 'AUDIO_DEMO' | 'LOOKBOOK' | 'STILLS'>('SHOWREEL');
  const [workDesc, setWorkDesc] = useState('');
  const [workUrl, setWorkUrl] = useState('');
  const [workTags, setWorkTags] = useState('');
  const [workUploadError, setWorkUploadError] = useState('');
  const [selectedCertificateWork, setSelectedCertificateWork] = useState<CreativeWork | null>(null);

  const reloadWorks = () => {
    const all = getStoredWorks();
    setWorks(all.filter(w => w.userId === currentUser?.id || currentUser?.isAdmin));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWorkUploadError('');
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validateFileUpload(file);
    if (!validation.isValid) {
      setWorkUploadError(validation.error || 'Invalid file.');
      return;
    }

    // Convert file to local preview URL / Base64
    const reader = new FileReader();
    reader.onload = () => {
      setWorkUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleCreateWork = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !workTitle.trim()) return;

    const tagArray = workTags.split(',').map(t => t.trim()).filter(Boolean);
    const media = workUrl.trim() || 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=800&q=80';

    await addCreativeWork({
      userId: currentUser.id,
      userName: currentUser.name,
      userRole: activeRole,
      title: workTitle.trim(),
      craftType: workCraftType,
      description: workDesc.trim(),
      mediaUrl: media,
      tags: tagArray.length > 0 ? tagArray : ['Studio Verified', activeRole],
      isProtected: true
    });

    setWorkTitle('');
    setWorkDesc('');
    setWorkUrl('');
    setWorkTags('');
    setIsAddingWork(false);
    reloadWorks();
  };

  const handleDeleteWork = (id: string) => {
    deleteCreativeWork(id);
    reloadWorks();
  };

  const [isAddingCredit, setIsAddingCredit] = useState(false);
  const [newCreditTitle, setNewCreditTitle] = useState('');
  const [newCreditRole, setNewCreditRole] = useState('');
  const [newCreditYear, setNewCreditYear] = useState('');
  const [newCreditNotes, setNewCreditNotes] = useState('');

  const [newReviewText, setNewReviewText] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [isAddingReview, setIsAddingReview] = useState(false);

  // Edit Profile Modal State
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [editName, setEditName] = useState(currentUser?.name || '');
  const [editHeadline, setEditHeadline] = useState(currentUser?.headline || '');
  const [editBio, setEditBio] = useState(currentUser?.bio || '');
  const [editLocation, setEditLocation] = useState(currentUser?.location || '');
  const [editExp, setEditExp] = useState(currentUser?.experienceYears || 0);
  const [editAvatar, setEditAvatar] = useState(currentUser?.avatarUrl || '');
  const [editSkills, setEditSkills] = useState((currentUser?.skills || []).join(', '));
  const [editLanguages, setEditLanguages] = useState((currentUser?.languages || []).join(', '));
  const [editRoles, setEditRoles] = useState<ProfessionalRole[]>(currentUser?.roles || ['DIRECTOR']);

  const openEditModal = () => {
    if (!currentUser) return;
    setEditName(currentUser.name);
    setEditHeadline(currentUser.headline || '');
    setEditBio(currentUser.bio || '');
    setEditLocation(currentUser.location || '');
    setEditExp(currentUser.experienceYears || 0);
    setEditAvatar(currentUser.avatarUrl || '');
    setEditSkills((currentUser.skills || []).join(', '));
    setEditLanguages((currentUser.languages || []).join(', '));
    setEditRoles(currentUser.roles || ['DIRECTOR']);
    setIsEditProfileOpen(true);
  };

  const handleToggleEditRole = (role: ProfessionalRole) => {
    if (editRoles.includes(role)) {
      if (editRoles.length > 1) {
        setEditRoles(editRoles.filter(r => r !== role));
      }
    } else {
      if (editRoles.length < 3) {
        setEditRoles([...editRoles, role]);
      }
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    const parsedSkills = editSkills
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    const parsedLanguages = editLanguages
      .split(',')
      .map(l => l.trim())
      .filter(Boolean);

    const updatedRoles = editRoles.slice(0, 3);
    const updatedActiveRole = updatedRoles.includes(currentUser.activeRole)
      ? currentUser.activeRole
      : updatedRoles[0];

    updateProfile({
      name: editName.trim() || currentUser.name,
      headline: editHeadline.trim(),
      bio: editBio.trim(),
      location: editLocation.trim(),
      experienceYears: Number(editExp) || 0,
      avatarUrl: editAvatar.trim() || currentUser.avatarUrl,
      skills: parsedSkills,
      languages: parsedLanguages,
      roles: updatedRoles,
      activeRole: updatedActiveRole
    });

    setIsEditProfileOpen(false);
  };

  const handleAddCredit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCreditTitle.trim()) return;

    const newCred: UserCredit = {
      id: `cred-${Date.now()}`,
      title: newCreditTitle.trim(),
      role: newCreditRole.trim() || activeRole.replace('_', ' '),
      year: newCreditYear.trim() || new Date().getFullYear().toString(),
      notes: newCreditNotes.trim()
    };

    const updated = [newCred, ...credits];
    setCredits(updated);
    if (currentUser?.id) {
      localStorage.setItem(`cv_credits_${currentUser.id}`, JSON.stringify(updated));
    }

    setNewCreditTitle('');
    setNewCreditRole('');
    setNewCreditYear('');
    setNewCreditNotes('');
    setIsAddingCredit(false);
  };

  const handleDeleteCredit = (id: string) => {
    const updated = credits.filter(c => c.id !== id);
    setCredits(updated);
    if (currentUser?.id) {
      localStorage.setItem(`cv_credits_${currentUser.id}`, JSON.stringify(updated));
    }
  };

  const handlePostReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewText.trim()) return;

    const newRev: Review = {
      id: `rev-${Date.now()}`,
      authorId: currentUser?.id || 'reviewer-1',
      authorName: currentUser?.name || 'Verified Film Colleague',
      authorRole: activeRole,
      authorAvatar: currentUser?.avatarUrl,
      targetUserId: currentUser?.id || 'user-1',
      projectTitle: 'Production Collaboration',
      rating: newRating,
      feedback: newReviewText,
      createdAt: 'Just now'
    };

    setReviews(prev => [newRev, ...prev]);
    setNewReviewText('');
    setIsAddingReview(false);
  };

  if (!currentUser) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center p-6">
        <div className="max-w-md w-full p-8 rounded-3xl bg-[#111218] border border-white/10 text-center space-y-4 shadow-2xl">
          <Film className="w-12 h-12 text-amber-400 mx-auto" />
          <h2 className="text-xl font-cinematic font-bold text-white uppercase tracking-wider">
            Sign In to View & Edit Profile
          </h2>
          <p className="text-xs text-gray-400">
            You must be logged into your verified CineVantaara studio account to manage credits, showcase showreels, and edit creative credentials.
          </p>
          <div className="flex justify-center space-x-3 pt-2">
            <Link
              to="/login"
              className="px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-amber-500 hover:bg-amber-400 text-black transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-white/5 hover:bg-white/10 text-white border border-white/10 transition-colors"
            >
              Register Account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20 pt-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      
      {/* Profile Header Card */}
      <div className="relative rounded-3xl bg-[#111218] border border-white/10 overflow-hidden shadow-2xl">
        <div className="h-44 sm:h-56 w-full relative">
          <img
            src={theme.bannerImage}
            alt="Cover"
            className="w-full h-full object-cover filter brightness-[0.35] contrast-125"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#111218] via-transparent to-transparent" />
        </div>

        <div className="p-6 sm:p-8 pt-0 relative -mt-16 sm:-mt-20 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-end space-y-4 sm:space-y-0 sm:space-x-6 text-center sm:text-left">
            <div className="relative group cursor-pointer" onClick={openEditModal}>
              <img
                src={currentUser?.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80'}
                alt={currentUser?.name || 'User'}
                className="w-28 sm:w-36 h-28 sm:h-36 rounded-3xl object-cover border-4 border-[#111218] shadow-2xl transition-all group-hover:brightness-75"
              />
              <div className="absolute inset-0 rounded-3xl bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-amber-400 transition-opacity">
                <Camera className="w-6 h-6" />
                <span className="text-[10px] font-mono font-bold mt-1 text-white uppercase tracking-wider">Edit Photo</span>
              </div>
              {currentUser?.isVerified && (
                <span className="absolute bottom-2 right-2 p-1.5 rounded-full bg-emerald-500 text-black shadow-md z-10" title="Verified Creator">
                  <ShieldCheck className="w-4 h-4" />
                </span>
              )}
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h1 className="text-2xl sm:text-3xl font-cinematic font-bold text-white">
                  {currentUser?.name || 'Film Professional'}
                </h1>
                <span
                  className="px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider border role-tag-pill"
                  style={{
                    borderColor: `${theme.primaryColor}80`,
                    backgroundColor: `${theme.primaryColor}20`,
                    color: theme.accentColor
                  }}
                >
                  {theme.title}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-gray-300 max-w-xl font-sans">
                {currentUser?.headline || 'Cinema Industry Practitioner'}
              </p>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-gray-400 pt-1 font-mono">
                {currentUser?.location && (
                  <span className="flex items-center space-x-1">
                    <MapPin className="w-3.5 h-3.5 text-gray-500" />
                    <span>{currentUser.location}</span>
                  </span>
                )}
                {typeof currentUser?.experienceYears === 'number' && currentUser.experienceYears > 0 && (
                  <span className="flex items-center space-x-1">
                    <Film className="w-3.5 h-3.5 text-gray-500" />
                    <span>{currentUser.experienceYears} Years Exp</span>
                  </span>
                )}
                <span className="flex items-center space-x-1 text-amber-400">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span>{reviews.length > 0 ? `${currentUser?.rating || 5.0} (${reviews.length} Verified Reviews)` : 'Verified Profile'}</span>
                </span>
              </div>

              {/* Roles Badge List (Strictly up to 3) */}
              <div className="flex flex-wrap gap-1.5 pt-1.5 justify-center sm:justify-start">
                {currentUser.roles.map(r => (
                  <span key={r} className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[10px] uppercase font-mono text-gray-300">
                    {r.replace('_', ' ')}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={openEditModal}
              className="px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-amber-500 hover:bg-amber-400 text-black transition-colors flex items-center space-x-2 shadow-glow-gold"
            >
              <Edit3 className="w-4 h-4" />
              <span>Edit Profile</span>
            </button>

            <button
              onClick={() => setIsAddingReview(!isAddingReview)}
              className="px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-white/5 hover:bg-white/10 text-white border border-white/10 transition-colors flex items-center space-x-2"
            >
              <Star className="w-4 h-4 text-amber-400" />
              <span>Leave Endorsement</span>
            </button>

            <button
              onClick={openSettings}
              className="px-3.5 py-2.5 rounded-xl text-xs font-semibold text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors flex items-center space-x-1.5"
              title="Studio & BGM Settings"
            >
              <Settings className="w-4 h-4 text-amber-400" />
              <span>Settings</span>
            </button>

            <button
              onClick={() => {
                logout();
                navigate('/login');
              }}
              className="px-3.5 py-2.5 rounded-xl text-xs font-semibold text-gray-400 hover:text-red-400 hover:bg-white/5 border border-white/10 transition-colors flex items-center space-x-1.5"
              title="Sign Out of Studio"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bio & Skills Summary */}
      {(currentUser.bio || (currentUser.skills && currentUser.skills.length > 0)) && (
        <div className="p-6 rounded-3xl bg-[#111218] border border-white/10 space-y-4">
          {currentUser.bio && (
            <div>
              <div className="text-xs font-cinematic font-bold text-gray-400 uppercase tracking-wider mb-1">
                Creative Biography
              </div>
              <p className="text-xs sm:text-sm text-gray-200 leading-relaxed font-sans">
                {currentUser.bio}
              </p>
            </div>
          )}

          {currentUser.skills && currentUser.skills.length > 0 && (
            <div>
              <div className="text-xs font-cinematic font-bold text-gray-400 uppercase tracking-wider mb-2">
                Specialized Craft Skills
              </div>
              <div className="flex flex-wrap gap-2">
                {currentUser.skills.map((s, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg bg-black/40 border border-white/10 text-xs text-amber-300 font-mono"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Add Review Panel */}
      {isAddingReview && (
        <form onSubmit={handlePostReview} className="p-6 rounded-3xl bg-[#111218] border border-amber-500/30 space-y-4 animate-in fade-in duration-200">
          <h3 className="text-sm font-cinematic font-bold text-white">
            Write Verified Post-Collaboration Review
          </h3>
          <div className="flex items-center space-x-2">
            {[1, 2, 3, 4, 5].map(star => (
              <button
                type="button"
                key={star}
                onClick={() => setNewRating(star)}
                className="text-amber-400"
              >
                <Star className={`w-5 h-5 ${star <= newRating ? 'fill-amber-400' : 'text-gray-600'}`} />
              </button>
            ))}
            <span className="text-xs text-gray-400 ml-2">{newRating} Stars</span>
          </div>
          <textarea
            required
            rows={3}
            placeholder="Describe your collaborative experience on set, professional reliability, and creative impact..."
            value={newReviewText}
            onChange={(e) => setNewReviewText(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-xs text-white focus:outline-none focus:border-amber-500"
          />
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => setIsAddingReview(false)}
              className="px-3 py-1.5 text-xs text-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-bold uppercase bg-amber-500 text-black shadow-glow-gold"
            >
              Submit Review
            </button>
          </div>
        </form>
      )}

      {/* PRODUCER POLICY NOTICE or PORTFOLIO SECTION */}
      {isProducer ? (
        // PRODUCER EXCLUSIVE WORKSPACE (Rule: No portfolio upload for producers)
        <div className="p-8 rounded-3xl bg-emerald-950/20 border border-emerald-800/30 space-y-3">
          <div className="flex items-center space-x-3">
            <Briefcase className="w-6 h-6 text-emerald-400" />
            <div>
              <h2 className="text-base font-cinematic font-bold text-white">
                Producer Executive Profile: Opportunities & Recruitment
              </h2>
              <p className="text-xs text-emerald-300">
                In accordance with CineVantaara studio standards, producers recruit talent and manage opportunities rather than submitting personal craft portfolios.
              </p>
            </div>
          </div>
        </div>
      ) : (
        // CRAFT & TALENT PORTFOLIO
        <div className="rounded-3xl bg-[#111218] border border-white/10 p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/10 gap-3">
            <div className="flex items-center space-x-3">
              <Film className="w-5 h-5 text-amber-400" />
              <h2 className="text-lg font-cinematic font-bold text-white">
                Verified Film Credits & Portfolio
              </h2>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => setIsAddingCredit(!isAddingCredit)}
                className="px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center space-x-1.5 hover:bg-amber-500 hover:text-black transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Film Credit</span>
              </button>
            </div>
          </div>

          {/* Add Credit Form */}
          {isAddingCredit && (
            <form onSubmit={handleAddCredit} className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-3 animate-in fade-in duration-200">
              <div className="text-xs font-cinematic font-bold text-amber-300 uppercase tracking-wider">
                Add Verified Production Credit
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="text"
                  required
                  placeholder="Production Title"
                  value={newCreditTitle}
                  onChange={(e) => setNewCreditTitle(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-500"
                />
                <input
                  type="text"
                  placeholder="Credited Role"
                  value={newCreditRole}
                  onChange={(e) => setNewCreditRole(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-500"
                />
                <input
                  type="text"
                  placeholder="Release Year"
                  value={newCreditYear}
                  onChange={(e) => setNewCreditYear(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-500"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsAddingCredit(false)}
                  className="px-3 py-1.5 text-xs text-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl text-xs font-bold uppercase bg-amber-500 text-black shadow-glow-gold"
                >
                  Save Credit
                </button>
              </div>
            </form>
          )}

          {/* Credits List or Clean Empty State */}
          {credits.length > 0 ? (
            <div className="space-y-3">
              {credits.map(c => (
                <div key={c.id} className="p-4 rounded-2xl bg-black/40 border border-white/5 flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-white">{c.title}</h4>
                    <div className="text-xs text-amber-300/80 mt-0.5">
                      {c.role} ({c.year}) {c.notes && `• ${c.notes}`}
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteCredit(c.id)}
                    className="p-1.5 text-gray-500 hover:text-red-400 transition-colors"
                    title="Remove credit"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center rounded-2xl bg-black/30 border border-white/5 space-y-2">
              <Film className="w-8 h-8 text-gray-600 mx-auto" />
              <div className="text-sm font-bold text-gray-300">No Film Credits Logged</div>
              <p className="text-xs text-gray-500">
                Click "Add Film Credit" above to record your production credentials.
              </p>
            </div>
          )}

          {/* CREATIVE WORKS & MEDIA VAULT (Phase 5: Item 25 & Phase 11: Item 67) */}
          <div className="pt-6 border-t border-white/10 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-cinematic font-bold text-white flex items-center space-x-2">
                  <ShieldCheck className="w-5 h-5 text-amber-400" />
                  <span>Creative Craft Works & IP Vault ({works.length})</span>
                </h3>
                <p className="text-xs text-gray-400">
                  Showcase screenplays, video reels, audio cues, and concept lookbooks stamped with cryptographic proof of authorship.
                </p>
              </div>

              <button
                onClick={() => setIsAddingWork(!isAddingWork)}
                className="px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-black shadow-glow-gold flex items-center space-x-1.5"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Craft Work</span>
              </button>
            </div>

            {/* Upload Work Form */}
            {isAddingWork && (
              <form onSubmit={handleCreateWork} className="p-5 rounded-2xl bg-black/60 border border-amber-500/30 space-y-4 animate-in fade-in duration-200">
                <div className="text-xs font-cinematic font-bold text-amber-300 uppercase tracking-wider flex items-center space-x-1.5">
                  <Lock className="w-3.5 h-3.5" />
                  <span>Register & Timestamp Creative Work</span>
                </div>

                {workUploadError && (
                  <div className="p-3 rounded-xl bg-red-900/30 border border-red-500/40 text-red-300 text-xs">
                    {workUploadError}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] text-gray-400 font-semibold block mb-1">Title of Work</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Chrono Syndicate (Screenplay) or 2026 Showreel"
                      value={workTitle}
                      onChange={(e) => setWorkTitle(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-gray-400 font-semibold block mb-1">Craft Discipline Classification</label>
                    <select
                      value={workCraftType}
                      onChange={(e) => setWorkCraftType(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white focus:outline-none focus:border-amber-500"
                    >
                      <option value="SHOWREEL">Video Reel / Cinematography Showreel</option>
                      <option value="SCRIPT">Screenplay / Script Treatment (PDF)</option>
                      <option value="AUDIO_DEMO">Music Composition / Sound Design Stem</option>
                      <option value="LOOKBOOK">Art Direction Lookbook / Concept Art</option>
                      <option value="STILLS">Production Photography / Stills</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] text-gray-400 font-semibold block mb-1">Description & Creative Logline</label>
                  <textarea
                    rows={2}
                    placeholder="Brief synopsis, camera package details, or musical instrumentation..."
                    value={workDesc}
                    onChange={(e) => setWorkDesc(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] text-gray-400 font-semibold block mb-1">Secure File Upload (Max 25MB)</label>
                    <input
                      type="file"
                      onChange={handleFileUpload}
                      className="w-full text-xs text-gray-400 file:mr-2 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-amber-500/20 file:text-amber-300 hover:file:bg-amber-500/30"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-gray-400 font-semibold block mb-1">Or Media / Stream URL</label>
                    <input
                      type="url"
                      placeholder="https://vimeo.com/... or image link"
                      value={workUrl}
                      onChange={(e) => setWorkUrl(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] text-gray-400 font-semibold block mb-1">Tags (Comma-separated)</label>
                  <input
                    type="text"
                    placeholder="Alexa 35, Anamorphic, Feature Film, Sci-Fi"
                    value={workTags}
                    onChange={(e) => setWorkTags(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="flex justify-end space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAddingWork(false)}
                    className="px-4 py-2 text-xs text-gray-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-amber-500 hover:bg-amber-400 text-black shadow-glow-gold"
                  >
                    Register & Protect Work
                  </button>
                </div>
              </form>
            )}

            {/* Works List */}
            {works.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {works.map(work => (
                  <div key={work.id} className="p-4 rounded-2xl bg-black/50 border border-white/10 space-y-3 flex flex-col justify-between hover:border-amber-500/30 transition-all">
                    <div>
                      <div className="relative h-36 rounded-xl overflow-hidden bg-black/80 mb-2">
                        <img src={work.mediaUrl} alt={work.title} className="w-full h-full object-cover" />
                        <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-black/70 text-amber-300 border border-amber-500/30">
                          {work.craftType}
                        </span>
                        <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-mono text-emerald-300 bg-black/70 border border-emerald-500/30 flex items-center space-x-1">
                          <Lock className="w-2.5 h-2.5" />
                          <span>SHA-256</span>
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-white leading-snug">{work.title}</h4>
                      <p className="text-xs text-gray-400 line-clamp-2 mt-1">{work.description}</p>

                      <div className="flex flex-wrap gap-1 mt-2">
                        {work.tags.slice(0, 3).map((tag, i) => (
                          <span key={i} className="text-[10px] px-2 py-0.5 rounded-md bg-white/5 text-gray-300">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-white/5 text-xs">
                      <button
                        onClick={() => setSelectedCertificateWork(work)}
                        className="text-amber-400 hover:text-amber-300 font-semibold flex items-center space-x-1"
                      >
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>IP Certificate</span>
                      </button>

                      <button
                        onClick={() => handleDeleteWork(work.id)}
                        className="p-1 text-gray-500 hover:text-red-400 transition-colors"
                        title="Delete work"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 rounded-2xl bg-black/30 border border-white/5 text-center text-xs text-gray-400">
                No creative craft works uploaded yet. Upload your scripts, reels, or audio demos above to showcase your talent.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Reviews & Endorsements Section */}
      <div className="rounded-3xl bg-[#111218] border border-white/10 p-6 sm:p-8 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <h2 className="text-lg font-cinematic font-bold text-white">
            Industry Ratings & Peer Endorsements ({reviews.length})
          </h2>
          {reviews.length > 0 && (
            <div className="flex items-center space-x-1 text-amber-400 text-sm font-bold">
              <Star className="w-4 h-4 fill-amber-400" />
              <span>Verified Peer Reviews</span>
            </div>
          )}
        </div>

        {reviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reviews.map(rev => (
              <div key={rev.id} className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold text-white">{rev.authorName}</div>
                  <div className="flex items-center space-x-1 text-amber-400">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span className="text-xs font-bold">{rev.rating}.0</span>
                  </div>
                </div>
                <p className="text-xs text-gray-300 font-sans leading-relaxed">
                  "{rev.feedback}"
                </p>
                <div className="text-[10px] text-gray-500 pt-1">
                  {rev.createdAt}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center rounded-2xl bg-black/30 border border-white/5 space-y-1">
            <div className="text-xs text-gray-400">No peer reviews submitted yet.</div>
            <div className="text-[11px] text-gray-500">Collaborators can endorse your work after completing a film project.</div>
          </div>
        )}
      </div>

      {/* ================= EDIT PROFILE MODAL ================= */}
      {isEditProfileOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-[#111218] border border-white/15 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl">
            
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center space-x-2">
                <Edit3 className="w-5 h-5 text-amber-400" />
                <h3 className="text-lg font-cinematic font-bold text-white">
                  Edit Creator Studio Profile
                </h3>
              </div>
              <button
                onClick={() => setIsEditProfileOpen(false)}
                className="p-1 rounded-full text-gray-400 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    placeholder="City, Country"
                    value={editLocation}
                    onChange={(e) => setEditLocation(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                  Creative Headline / Logline
                </label>
                <input
                  type="text"
                  placeholder="Professional Creative Headline"
                  value={editHeadline}
                  onChange={(e) => setEditHeadline(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                  Professional Biography
                </label>
                <textarea
                  rows={3}
                  placeholder="Tell directors, producers, and crew about your cinema background and vision..."
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                    Industry Experience (Years)
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={50}
                    value={editExp}
                    onChange={(e) => setEditExp(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                    Profile Image / Headshot
                  </label>
                  <div className="flex items-center space-x-3">
                    <img
                      src={editAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80'}
                      alt="Avatar Preview"
                      className="w-12 h-12 rounded-2xl object-cover border border-amber-500/50 shadow-md flex-shrink-0"
                    />
                    <div className="flex-1 space-y-1.5">
                      <label className="cursor-pointer inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 hover:bg-amber-500/25 text-xs font-semibold transition-all">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload Image File</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = () => {
                                if (typeof reader.result === 'string') {
                                  setEditAvatar(reader.result);
                                }
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </label>
                      <input
                        type="url"
                        placeholder="Or paste headshot image URL (https://...)"
                        value={editAvatar.startsWith('data:') ? '' : editAvatar}
                        onChange={(e) => setEditAvatar(e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-xl bg-black/40 border border-white/10 text-[11px] text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>

                  {/* Preset Quick Avatars */}
                  <div className="mt-2 space-y-1">
                    <span className="text-[10px] text-gray-500 uppercase font-mono">Or pick cinematic avatar:</span>
                    <div className="flex items-center space-x-2 overflow-x-auto py-1">
                      {[
                        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
                        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
                        'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80',
                        'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80',
                        'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=150&q=80',
                        'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80'
                      ].map((url, i) => (
                        <button
                          type="button"
                          key={i}
                          onClick={() => setEditAvatar(url)}
                          className={`w-8 h-8 rounded-xl overflow-hidden border transition-all flex-shrink-0 ${
                            editAvatar === url ? 'border-amber-400 scale-110 shadow-glow-gold' : 'border-white/10 hover:border-white/30'
                          }`}
                        >
                          <img src={url} alt={`Preset ${i}`} className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                  Specialized Skills (Comma-separated)
                </label>
                <input
                  type="text"
                  placeholder="Specialized craft skills separated by commas"
                  value={editSkills}
                  onChange={(e) => setEditSkills(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                  Working Languages (Comma-separated)
                </label>
                <input
                  type="text"
                  placeholder="Languages separated by commas"
                  value={editLanguages}
                  onChange={(e) => setEditLanguages(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Roles Selection (Strictly capped at max 3) */}
              <div className="space-y-2 pt-2 border-t border-white/10">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Select Your Professional Roles
                  </label>
                  <span className={`text-xs font-mono font-bold ${
                    editRoles.length === 3 ? 'text-amber-400' : 'text-gray-400'
                  }`}>
                    ({editRoles.length} / 3 Selected)
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {ALL_ROLES_OPTIONS.map(({ role, label }) => {
                    const isSelected = editRoles.includes(role);
                    const isDisabled = !isSelected && editRoles.length >= 3;
                    return (
                      <button
                        type="button"
                        key={role}
                        disabled={isDisabled}
                        onClick={() => handleToggleEditRole(role)}
                        className={`p-2 rounded-xl text-left text-xs transition-all border flex items-center justify-between ${
                          isSelected
                            ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 font-bold'
                            : isDisabled
                            ? 'opacity-40 border-white/5 text-gray-500 cursor-not-allowed'
                            : 'bg-black/30 border-white/10 text-gray-400 hover:text-white hover:border-white/20'
                        }`}
                      >
                        <span className="truncate">{label}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsEditProfileOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-amber-500 hover:bg-amber-400 text-black shadow-glow-gold transition-colors"
                >
                  Save Profile Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* IP Vault Official Certificate Modal */}
      <IpVaultCertificateModal
        work={selectedCertificateWork}
        isOpen={!!selectedCertificateWork}
        onClose={() => setSelectedCertificateWork(null)}
      />
    </div>
  );
};
