import React, { useState } from 'react';
import { Opportunity, ProfessionalRole } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { X, PlusCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

interface CreateOpportunityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (opportunity: Opportunity) => void;
}

const AVAILABLE_ROLES: ProfessionalRole[] = [
  'ACTOR',
  'CINEMATOGRAPHER',
  'WRITER',
  'EDITOR',
  'MUSIC_DIRECTOR',
  'VFX_ARTIST',
  'MAKEUP_ARTIST',
  'COSTUME_DESIGNER',
  'ART_DIRECTOR',
  'SOUND_DESIGNER',
  'TECHNICIAN',
  'ASSISTANT_DIRECTOR'
];

export const CreateOpportunityModal: React.FC<CreateOpportunityModalProps> = ({
  isOpen,
  onClose,
  onCreate
}) => {
  const { currentUser } = useAuth();
  const { addNotification } = useNotifications();

  // All fields start clean without hardcoded strings
  const [title, setTitle] = useState('');
  const [filmCategory, setFilmCategory] = useState<Opportunity['filmCategory']>('FEATURE_FILM');
  const [requiredRole, setRequiredRole] = useState<ProfessionalRole>('ACTOR');
  const [description, setDescription] = useState('');
  const [skillsRaw, setSkillsRaw] = useState('');
  const [minExp, setMinExp] = useState<number | ''>('');
  const [location, setLocation] = useState('');
  const [isRemoteAllowed, setIsRemoteAllowed] = useState(false);
  const [compensationType, setCompensationType] = useState<Opportunity['compensationType']>('PAID');
  const [compensationDetails, setCompensationDetails] = useState('');
  const [deadline, setDeadline] = useState('');
  const [duration, setDuration] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    const skills = skillsRaw
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    const newOpp: Opportunity = {
      id: `opp-${Date.now()}`,
      producerId: currentUser?.id || `user-${Date.now()}`,
      producerName: currentUser?.name || 'Film Producer',
      producerEmail: currentUser?.email || '',
      producerCompany: currentUser?.headline || 'Studio Production',
      title: title.trim(),
      filmCategory,
      description: description.trim(),
      requiredRole,
      requiredSkills: skills,
      minExperienceYears: typeof minExp === 'number' ? minExp : 0,
      location: location.trim() || 'Worldwide',
      isRemoteAllowed,
      languages: ['English'],
      compensationType,
      compensationDetails: compensationDetails.trim() || compensationType,
      deadline: deadline || 'Open Call',
      projectDuration: duration.trim() || 'Production Schedule',
      createdAt: new Date().toISOString().split('T')[0],
      status: 'OPEN',
      applicantsCount: 0
    };

    onCreate(newOpp);

    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.6 }
    });

    addNotification({
      userId: 'ALL',
      creatorId: currentUser?.id || '',
      creatorEmail: currentUser?.email || '',
      creatorName: currentUser?.name || '',
      title: `🎬 New ${currentUser?.activeRole === 'DIRECTOR' ? 'Director' : 'Producer'} Opportunity: "${title}"`,
      message: `${currentUser?.name || 'Studio'} published a new casting/crew call for ${requiredRole.replace('_', ' ')}.`,
      type: 'OPPORTUNITY_MATCH',
      linkUrl: '/opportunities'
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-3xl bg-[#111218] border border-white/15 shadow-2xl p-6 sm:p-8 my-8 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 sticky top-0 bg-[#111218] z-10">
          <div>
            <h2 className="text-xl font-cinematic font-bold text-white">
              Publish Film Opportunity / Casting Call
            </h2>
            <p className="text-xs text-gray-400">
              Recruit verified actors, crew, and craftspeople worldwide
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
              Production Title *
            </label>
            <input
              type="text"
              required
              placeholder="Production Opportunity Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                Film Category *
              </label>
              <select
                value={filmCategory}
                onChange={(e) => setFilmCategory(e.target.value as any)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#0a0a0d] border border-white/10 text-xs text-white focus:outline-none focus:border-amber-500"
              >
                <option value="FEATURE_FILM">Feature Film</option>
                <option value="SHORT_FILM">Short Film</option>
                <option value="OTT_SERIES">OTT / Episodic Series</option>
                <option value="DOCUMENTARY">Documentary</option>
                <option value="AD_COMMERCIAL">Commercial / Brand</option>
                <option value="MUSIC_VIDEO">Music Video</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                Required Role *
              </label>
              <select
                value={requiredRole}
                onChange={(e) => setRequiredRole(e.target.value as any)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#0a0a0d] border border-white/10 text-xs text-white focus:outline-none focus:border-amber-500"
              >
                {AVAILABLE_ROLES.map((r) => (
                  <option key={r} value={r}>
                    {r.replace('_', ' ')}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
              Project Description & Character Brief *
            </label>
            <textarea
              required
              rows={4}
              placeholder="Outline the synopsis, character arc, shoot conditions, and creative requirements..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
              Required Skills (comma separated)
            </label>
            <input
              type="text"
              placeholder="Required skills separated by comma"
              value={skillsRaw}
              onChange={(e) => setSkillsRaw(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                Min Exp (Years)
              </label>
              <input
                type="number"
                min={0}
                max={40}
                placeholder="Minimum Years"
                value={minExp}
                onChange={(e) => setMinExp(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                Compensation Type
              </label>
              <select
                value={compensationType}
                onChange={(e) => setCompensationType(e.target.value as any)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#0a0a0d] border border-white/10 text-xs text-white focus:outline-none focus:border-amber-500"
              >
                <option value="PAID">Paid (Tier Scale)</option>
                <option value="UNION_SCALE">SAG / Equity Union Scale</option>
                <option value="PROFIT_SHARE">Profit Share / Points</option>
                <option value="NEGOTIABLE">Negotiable</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                Application Deadline
              </label>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                Shoot Location
              </label>
              <input
                type="text"
                placeholder="Production City, Country"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                Duration / Schedule
              </label>
              <input
                type="text"
                placeholder="Duration & Principal Photography Schedule"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2 pt-2">
            <input
              type="checkbox"
              id="remoteCheck"
              checked={isRemoteAllowed}
              onChange={(e) => setIsRemoteAllowed(e.target.checked)}
              className="rounded bg-black/40 border-white/20 text-amber-500 focus:ring-0"
            />
            <label htmlFor="remoteCheck" className="text-xs text-gray-300">
              Remote work acceptable (Post-Production, Scoring, Screenwriting)
            </label>
          </div>

          <div className="pt-4 flex items-center justify-end space-x-3 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-gray-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black shadow-glow-gold flex items-center space-x-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Greenlight Opportunity</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
