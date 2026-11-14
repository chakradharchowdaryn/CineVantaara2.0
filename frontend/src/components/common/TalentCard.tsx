import React, { useState, useEffect } from 'react';
import { User, ProfessionalRole } from '../../types';
import { ROLE_THEMES } from '../../utils/roleThemes';
import { Star, MapPin, Film, Sparkles, Send, Check, ShieldAlert } from 'lucide-react';
import { motion } from 'framer-motion';
import { isTalentSaved, toggleSaveTalent } from '../../services/savedItemsService';
import { ReportUserModal } from './ReportUserModal';

interface TalentCardProps {
  user: User;
  onCollaborate: (user: User) => void;
  onViewProfile?: (user: User) => void;
}

export const TalentCard: React.FC<TalentCardProps> = ({ user, onCollaborate, onViewProfile }) => {
  const roleTheme = ROLE_THEMES[user.activeRole] || ROLE_THEMES.DIRECTOR;
  const [saved, setSaved] = useState(() => isTalentSaved(user.id));
  const [isReportOpen, setIsReportOpen] = useState(false);

  useEffect(() => {
    setSaved(isTalentSaved(user.id));
  }, [user.id]);

  const handleToggleSave = () => {
    const newState = toggleSaveTalent(user);
    setSaved(newState);
  };

  return (
    <>
      <motion.div
        whileHover={{ y: -6, transition: { duration: 0.25 } }}
        className="rounded-3xl bg-[#111218]/90 border border-white/10 overflow-hidden flex flex-col justify-between hover:border-amber-500/40 hover:shadow-2xl transition-all duration-300 group"
      >
        <div>
          {/* Card Header & Avatar */}
          <div className="relative h-48 overflow-hidden bg-gradient-to-t from-black to-zinc-900">
            <img
              src={user.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
              alt={user.name}
              className="w-full h-full object-cover object-center filter brightness-90 group-hover:scale-105 group-hover:brightness-100 transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#111218] via-transparent to-transparent" />
            
            {/* Active Role Tag */}
            <div className="absolute top-3 left-3">
              <span
                className="px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase backdrop-blur-md border shadow-md role-tag-pill"
                style={{
                  backgroundColor: `${roleTheme.primaryColor}30`,
                  borderColor: `${roleTheme.primaryColor}80`,
                  color: roleTheme.accentColor
                }}
              >
                {roleTheme.title}
              </span>
            </div>

            {/* Rating Badge & Report */}
            <div className="absolute top-3 right-3 flex items-center space-x-1.5">
              <div className="flex items-center space-x-1 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-xs font-bold text-amber-400">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{user.rating || 5.0}</span>
                <span className="text-[10px] text-gray-400 font-normal">({user.reviewCount || 12})</span>
              </div>
              <button
                onClick={() => setIsReportOpen(true)}
                className="p-1 rounded-full bg-black/60 hover:bg-red-500/30 text-gray-400 hover:text-red-400 transition-colors"
                title="Report User to Citadel"
              >
                <ShieldAlert className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Content Body */}
          <div className="p-5 space-y-3">
            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-cinematic font-bold text-white group-hover:text-amber-300 transition-colors">
                  {user.name}
                </h3>
                {user.isAvailable && (
                  <span className="inline-flex items-center text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full font-medium">
                    Available
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-400 line-clamp-1 mt-0.5">
                {user.headline || `${user.experienceYears || 5}+ years industry experience`}
              </p>
            </div>

            {/* Location & Experience */}
            <div className="flex items-center space-x-4 text-xs text-gray-400 pt-1 border-t border-white/5">
              <div className="flex items-center space-x-1">
                <MapPin className="w-3.5 h-3.5 text-gray-500" />
                <span>{user.location || 'Global'}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Film className="w-3.5 h-3.5 text-gray-500" />
                <span>{user.experienceYears || 5} Years Exp</span>
              </div>
            </div>

            {/* Bio Snippet */}
            <p className="text-xs text-gray-300 font-sans line-clamp-2 leading-relaxed">
              {user.bio}
            </p>

            {/* Skills Badges */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {user.skills.slice(0, 3).map((skill, idx) => (
                <span
                  key={idx}
                  className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-gray-300"
                >
                  {skill}
                </span>
              ))}
              {user.skills.length > 3 && (
                <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-md bg-white/5 text-gray-400">
                  +{user.skills.length - 3}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Card Footer Actions */}
        <div className="p-5 pt-0 flex items-center space-x-2">
          <button
            onClick={() => onCollaborate(user)}
            className="flex-1 py-2.5 px-3 rounded-xl text-xs font-bold uppercase tracking-wider bg-amber-500/15 hover:bg-amber-500 hover:text-black text-amber-300 border border-amber-500/30 transition-all flex items-center justify-center space-x-1.5 shadow-sm"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Collaborate</span>
          </button>

          <button
            onClick={handleToggleSave}
            className={`p-2.5 rounded-xl border transition-colors ${
              saved
                ? 'bg-amber-500 text-black border-amber-500 shadow-glow-gold'
                : 'border-white/10 text-gray-400 hover:text-white hover:bg-white/5'
            }`}
            title={saved ? 'Saved in Roster' : 'Save Creator'}
          >
            {saved ? <Check className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
          </button>
        </div>
      </motion.div>

      <ReportUserModal
        targetUser={user}
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
      />
    </>
  );
};
