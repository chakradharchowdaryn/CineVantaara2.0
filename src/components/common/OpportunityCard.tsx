import React, { useState, useEffect } from 'react';
import { Opportunity } from '../../types';
import { ROLE_THEMES } from '../../utils/roleThemes';
import { Briefcase, Calendar, MapPin, DollarSign, Users, ArrowUpRight, Bookmark, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { isOpportunitySaved, toggleSaveOpportunity } from '../../services/savedItemsService';

interface OpportunityCardProps {
  opportunity: Opportunity;
  onApply: (opp: Opportunity) => void;
}

export const OpportunityCard: React.FC<OpportunityCardProps> = ({ opportunity, onApply }) => {
  const roleTheme = ROLE_THEMES[opportunity.requiredRole] || ROLE_THEMES.ACTOR;
  const [saved, setSaved] = useState(() => isOpportunitySaved(opportunity.id));

  useEffect(() => {
    setSaved(isOpportunitySaved(opportunity.id));
  }, [opportunity.id]);

  const handleToggleSave = () => {
    const newState = toggleSaveOpportunity(opportunity);
    setSaved(newState);
  };

  return (
    <motion.div
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className="rounded-3xl bg-[#111218]/90 border border-white/10 p-6 flex flex-col justify-between hover:border-amber-500/40 hover:shadow-2xl transition-all duration-300 group relative overflow-hidden"
    >
      <div className="space-y-4">
        {/* Top Badges */}
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full bg-white/5 border border-white/10 text-amber-300">
            {opportunity.filmCategory.replace('_', ' ')}
          </span>
          <div className="flex items-center space-x-2">
            <span
              className="text-[11px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full border role-tag-pill"
              style={{
                borderColor: `${roleTheme.primaryColor}80`,
                backgroundColor: `${roleTheme.primaryColor}20`,
                color: roleTheme.accentColor
              }}
            >
              Role: {roleTheme.title}
            </span>
            <button
              onClick={handleToggleSave}
              className={`p-1.5 rounded-lg border transition-colors ${
                saved
                  ? 'bg-amber-500 text-black border-amber-500 shadow-glow-gold'
                  : 'border-white/10 text-gray-400 hover:text-white hover:bg-white/5'
              }`}
              title={saved ? 'Opportunity Saved' : 'Bookmark Opportunity'}
            >
              {saved ? <Check className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Opportunity Title & Producer */}
        <div>
          <h3 className="text-lg font-cinematic font-bold text-white group-hover:text-amber-300 transition-colors leading-snug">
            {opportunity.title}
          </h3>
          <p className="text-xs text-gray-400 mt-1 flex items-center space-x-1.5">
            <span className="font-medium text-gray-300">{opportunity.producerName}</span>
            <span>•</span>
            <span className="text-amber-400/90">{opportunity.producerCompany || 'Independent Production'}</span>
          </p>
        </div>

        {/* Description */}
        <p className="text-xs text-gray-300 font-sans line-clamp-3 leading-relaxed">
          {opportunity.description}
        </p>

        {/* Meta Info Grid */}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/5 text-xs text-gray-400">
          <div className="flex items-center space-x-1.5">
            <MapPin className="w-3.5 h-3.5 text-gray-500" />
            <span className="truncate">{opportunity.location}</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <Calendar className="w-3.5 h-3.5 text-gray-500" />
            <span className="truncate">Deadline: {opportunity.deadline}</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <DollarSign className="w-3.5 h-3.5 text-amber-500" />
            <span className="truncate font-medium text-gray-300">{opportunity.compensationDetails || opportunity.compensationType}</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <Users className="w-3.5 h-3.5 text-gray-500" />
            <span>{opportunity.applicantsCount || 0} Applicants</span>
          </div>
        </div>

        {/* Required Skills Badges */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {opportunity.requiredSkills.map((skill, idx) => (
            <span
              key={idx}
              className="text-[10px] px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-gray-300"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-6 mt-2">
        <button
          onClick={() => onApply(opportunity)}
          className="w-full py-2.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black shadow-glow-gold transition-all flex items-center justify-center space-x-2"
        >
          <span>Submit Audition / Application</span>
          <ArrowUpRight className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
};
