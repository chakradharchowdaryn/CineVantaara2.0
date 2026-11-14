import React, { useState } from 'react';
import { User, CollaborationRequest } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { X, Send, Film, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface CollaborationModalProps {
  recipient: User | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (request: CollaborationRequest) => void;
}

export const CollaborationModal: React.FC<CollaborationModalProps> = ({
  recipient,
  isOpen,
  onClose,
  onSuccess
}) => {
  const { currentUser, activeRole } = useAuth();
  const { addNotification } = useNotifications();
  const [projectTitle, setProjectTitle] = useState('');
  const [roleProposed, setRoleProposed] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !recipient || recipient.name?.toLowerCase().trim() === 'kiran' || recipient.email?.toLowerCase().trim() === 'kirans3792@gmail.com') return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectTitle || !roleProposed || !message) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const newRequest: CollaborationRequest = {
        id: `collab-${Date.now()}`,
        senderId: currentUser?.id || 'current-user',
        senderName: currentUser?.name || 'Film Collaborator',
        senderRole: activeRole,
        senderAvatar: currentUser?.avatarUrl,
        receiverId: recipient.id,
        receiverName: recipient.name,
        projectTitle,
        roleProposed,
        message,
        status: 'PENDING',
        createdAt: new Date().toISOString().split('T')[0]
      };

      // Persist to central collaborations storage
      try {
        const existingRaw = localStorage.getItem('cv_collab_requests');
        const existing: CollaborationRequest[] = existingRaw ? JSON.parse(existingRaw) : [];
        const filtered = existing.filter(c => c.id !== newRequest.id);
        filtered.unshift(newRequest);
        localStorage.setItem('cv_collab_requests', JSON.stringify(filtered));
      } catch (e) {}

      // Trigger celebratory confetti
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 }
      });

      addNotification({
        userId: currentUser?.id || '',
        title: 'Collaboration Invitation Sent',
        message: `Your collaboration request for "${projectTitle}" was dispatched to ${recipient.name}.`,
        type: 'COLLAB_REQUEST'
      });

      if (onSuccess) onSuccess(newRequest);
      setIsSubmitting(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-lg rounded-3xl bg-[#111218] border border-white/15 shadow-2xl p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Film className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-cinematic font-bold text-white">
                Initiate Creative Collaboration
              </h2>
              <p className="text-xs text-gray-400">
                Invite <span className="text-amber-300 font-semibold">{recipient.name}</span> to your production
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 pt-5">
          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
              Film Project Title *
            </label>
            <input
              type="text"
              required
              placeholder="Enter film or production title"
              value={projectTitle}
              onChange={(e) => setProjectTitle(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
              Role Proposed to Candidate *
            </label>
            <input
              type="text"
              required
              placeholder={`Proposed role for candidate`}
              value={roleProposed}
              onChange={(e) => setRoleProposed(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
              Personalized Creative Note *
            </label>
            <textarea
              required
              rows={4}
              placeholder="Describe your vision, logline, schedule, or why you want to collaborate with this talent..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 transition-colors"
            />
          </div>

          <div className="pt-2 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black shadow-glow-gold transition-all flex items-center space-x-2"
            >
              <Send className="w-4 h-4" />
              <span>{isSubmitting ? 'Transmitting...' : 'Dispatch Request'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
