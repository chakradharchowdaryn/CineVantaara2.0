import React, { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, ProfessionalRole } from '../types';
import { TalentCard } from '../components/common/TalentCard';
import { CollaborationModal } from '../components/common/CollaborationModal';
import { Search, Filter, SlidersHorizontal, Users, Sparkles, MapPin, Trash2, RotateCcw } from 'lucide-react';

const FILTER_ROLES: { role: ProfessionalRole | 'ALL'; label: string }[] = [
  { role: 'ALL', label: 'All Disciplines' },
  { role: 'DIRECTOR', label: 'Directors' },
  { role: 'PRODUCER', label: 'Producers' },
  { role: 'WRITER', label: 'Screenwriters' },
  { role: 'ACTOR', label: 'Actors' },
  { role: 'CINEMATOGRAPHER', label: 'Cinematographers (DP)' },
  { role: 'EDITOR', label: 'Editors' },
  { role: 'MUSIC_DIRECTOR', label: 'Composers' },
  { role: 'VFX_ARTIST', label: 'VFX Supervisors' },
  { role: 'ANIMATOR', label: 'Animators' },
  { role: 'COLORIST', label: 'Colorists (DI)' },
  { role: 'STUNT_COORDINATOR', label: 'Stunt Coordinators' },
  { role: 'GAFFER', label: 'Gaffers' },
  { role: 'LINE_PRODUCER', label: 'Line Producers / UPM' },
  { role: 'CASTING_DIRECTOR', label: 'Casting Directors' },
  { role: 'SCRIPT_SUPERVISOR', label: 'Script Supervisors' },
  { role: 'DRONE_OPERATOR', label: 'Aerial Drone Pilots' },
  { role: 'BOOM_OPERATOR', label: 'Boom Operators' },
  { role: 'MAKEUP_ARTIST', label: 'Makeup / SFX' },
  { role: 'COSTUME_DESIGNER', label: 'Costume Designers' },
  { role: 'ART_DIRECTOR', label: 'Production Designers' },
  { role: 'SOUND_DESIGNER', label: 'Sound Designers' },
  { role: 'TECHNICIAN', label: 'Grip & Technical Crew' },
  { role: 'ASSISTANT_DIRECTOR', label: 'Assistant Directors' }
];

export const TalentDiscoveryPage: React.FC = () => {
  const { currentUser } = useAuth();
  const [usersList, setUsersList] = useState<User[]>(() => {
    try {
      const saved = localStorage.getItem('cv_registered_users');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [];
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState<ProfessionalRole | 'ALL'>('ALL');
  const [minExp, setMinExp] = useState(0);
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [selectedTalentForCollab, setSelectedTalentForCollab] = useState<User | null>(null);

  const filteredTalents = useMemo(() => {
    return usersList.filter(user => {
      // Exclude platform administrators and Kiran from the public creator directory
      if (
        user.isAdmin ||
        user.roles.includes('SUPER_ADMIN') ||
        user.roles.includes('PLATFORM_ADMIN') ||
        user.roles.includes('MODERATOR') ||
        user.name?.toLowerCase().trim() === 'kiran' ||
        user.email?.toLowerCase().trim() === 'kirans3792@gmail.com'
      ) {
        return false;
      }

      // STRICT USER REQUIREMENT: The searching user MUST NOT see their own account in the talent directory!
      if (currentUser && (user.id === currentUser.id || user.email.toLowerCase() === currentUser.email.toLowerCase())) {
        return false;
      }

      // Role filter
      if (selectedRole !== 'ALL' && !user.roles.includes(selectedRole)) {
        return false;
      }
      // Experience filter
      if ((user.experienceYears || 0) < minExp) {
        return false;
      }
      // Availability filter
      if (onlyAvailable && !user.isAvailable) {
        return false;
      }
      // Search query (name, skills, bio, location)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = user.name.toLowerCase().includes(q);
        const matchesSkill = user.skills.some(s => s.toLowerCase().includes(q));
        const matchesBio = (user.bio || '').toLowerCase().includes(q);
        const matchesLoc = (user.location || '').toLowerCase().includes(q);
        if (!matchesName && !matchesSkill && !matchesBio && !matchesLoc) {
          return false;
        }
      }
      return true;
    });
  }, [usersList, searchQuery, selectedRole, minExp, onlyAvailable]);

  return (
    <div className="min-h-screen pb-20 pt-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      
      {/* Page Title & Search Bar */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-cinematic font-black text-white">
              Talent Directory & Film Roster
            </h1>
            <p className="text-xs sm:text-sm text-gray-400 mt-1">
              Discover verified film professionals across 12+ creative and technical disciplines
            </p>
          </div>

          <div className="flex items-center space-x-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-80">
              <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, skill, camera, DAW..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#111218] border border-white/10 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Role Filter Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
          {FILTER_ROLES.map(({ role, label }) => {
            const isSelected = selectedRole === role;
            return (
              <button
                key={role}
                onClick={() => setSelectedRole(role)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-amber-500 text-black shadow-glow-gold font-bold'
                    : 'bg-[#111218] text-gray-300 border border-white/10 hover:border-white/20'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="p-4 rounded-2xl bg-[#111218]/80 border border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <span className="text-gray-400 font-medium">Min Experience:</span>
            <input
              type="range"
              min={0}
              max={20}
              value={minExp}
              onChange={(e) => setMinExp(Number(e.target.value))}
              className="accent-amber-500 w-24 sm:w-32 cursor-pointer"
            />
            <span className="font-mono text-amber-400 font-bold">{minExp}+ Years</span>
          </div>

          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={onlyAvailable}
              onChange={(e) => setOnlyAvailable(e.target.checked)}
              className="rounded bg-black/40 border-white/20 text-amber-500 focus:ring-0"
            />
            <span className="text-gray-300">Only Available for Production</span>
          </label>
        </div>

        <div className="text-gray-400 font-mono">
          Showing <span className="text-amber-400 font-bold">{filteredTalents.length}</span> Artists
        </div>
      </div>

      {/* Talent Cards Grid */}
      {filteredTalents.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTalents.map(talent => (
            <TalentCard
              key={talent.id}
              user={talent}
              onCollaborate={(t) => setSelectedTalentForCollab(t)}
            />
          ))}
        </div>
      ) : (
        <div className="p-12 text-center rounded-3xl bg-[#111218]/50 border border-white/10 space-y-3">
          <Users className="w-12 h-12 text-gray-500 mx-auto" />
          <h3 className="text-base font-cinematic font-bold text-white">No film crew profiles found</h3>
          <p className="text-xs text-gray-400">Zero fake records. When film professionals register or update their disciplines, they will appear here in the directory.</p>
        </div>
      )}

      {/* Direct Collaboration Modal */}
      <CollaborationModal
        recipient={selectedTalentForCollab}
        isOpen={!!selectedTalentForCollab}
        onClose={() => setSelectedTalentForCollab(null)}
      />
    </div>
  );
};
