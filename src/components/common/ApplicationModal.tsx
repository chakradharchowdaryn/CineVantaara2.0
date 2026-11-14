import React, { useState } from 'react';
import { Opportunity, Application } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { X, Send, Film, Award } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ApplicationModalProps {
  opportunity: Opportunity | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (app: Application) => void;
}

export const ApplicationModal: React.FC<ApplicationModalProps> = ({
  opportunity,
  isOpen,
  onClose,
  onSubmit
}) => {
  const { currentUser, activeRole } = useAuth();
  const { addNotification } = useNotifications();
  const [pitchNote, setPitchNote] = useState('');
  const [showreelUrl, setShowreelUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !opportunity) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pitchNote) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const newApp: Application = {
        id: `app-${Date.now()}`,
        opportunityId: opportunity.id,
        opportunityTitle: opportunity.title,
        applicantId: currentUser?.id || 'applicant-1',
        applicantName: currentUser?.name || 'Talented Creator',
        applicantRole: activeRole,
        applicantAvatar: currentUser?.avatarUrl,
        applicantExperience: currentUser?.experienceYears || 5,
        pitchNote,
        showreelUrl: showreelUrl || '',
        status: 'PENDING',
        appliedAt: new Date().toISOString().split('T')[0]
      };

      onSubmit(newApp);

      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 }
      });

      addNotification({
        userId: currentUser?.id || '',
        title: 'Application Transmitted',
        message: `Your audition/application for "${opportunity.title}" was submitted to ${opportunity.producerName}.`,
        type: 'APPLICATION_UPDATE'
      });

      setIsSubmitting(false);
      onClose();
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-lg rounded-3xl bg-[#111218] border border-white/15 shadow-2xl p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div>
            <h2 className="text-lg font-cinematic font-bold text-white">
              Submit Film Application / Tape
            </h2>
            <p className="text-xs text-gray-400">
              For: <span className="text-amber-300">{opportunity.title}</span>
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
              Your Pitch & Approach to the Role *
            </label>
            <textarea
              required
              rows={4}
              placeholder="State your preparation, character interpretation, previous related work, or why you are right for this production..."
              value={pitchNote}
              onChange={(e) => setPitchNote(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-sm text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
              Showreel / Audition Tape Link (Vimeo, YouTube, Drive)
            </label>
            <input
              type="url"
              placeholder="Enter portfolio or video showreel URL"
              value={showreelUrl}
              onChange={(e) => setShowreelUrl(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-sm text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200/90 flex items-start space-x-2">
            <Award className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
            <span>
              Your CineVantaara verified credits, profile rating, and verified skills will be automatically attached to this submission.
            </span>
          </div>

          <div className="pt-2 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-gray-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black shadow-glow-gold flex items-center space-x-2"
            >
              <Send className="w-4 h-4" />
              <span>{isSubmitting ? 'Transmitting...' : 'Transmit Audition'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
