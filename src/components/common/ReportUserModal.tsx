import React, { useState } from 'react';
import { AlertTriangle, ShieldAlert, X, Check, Ban } from 'lucide-react';
import { User } from '../../types';
import { submitUserReport, blockUser } from '../../services/moderationService';
import { useAuth } from '../../context/AuthContext';

interface ReportUserModalProps {
  targetUser: User | null;
  isOpen: boolean;
  onClose: () => void;
  onReported?: () => void;
}

export const ReportUserModal: React.FC<ReportUserModalProps> = ({
  targetUser,
  isOpen,
  onClose,
  onReported
}) => {
  const { currentUser } = useAuth();
  const [reason, setReason] = useState<'SPAM' | 'HARASSMENT' | 'COPYRIGHT_INFRINGEMENT' | 'IMPERSONATION' | 'UNPROFESSIONAL_BEHAVIOR'>('UNPROFESSIONAL_BEHAVIOR');
  const [details, setDetails] = useState('');
  const [shouldBlock, setShouldBlock] = useState(true);
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen || !targetUser) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    submitUserReport({
      reporterId: currentUser.id,
      reporterName: currentUser.name,
      reportedUserId: targetUser.id,
      reportedUserName: targetUser.name,
      reason,
      details: details.trim()
    });

    if (shouldBlock) {
      blockUser(targetUser.id);
    }

    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      onReported?.();
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-3xl bg-[#111218] border border-red-500/30 p-6 sm:p-8 shadow-2xl text-white space-y-5 animate-in fade-in duration-200">
        
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center space-x-2 text-red-400">
            <ShieldAlert className="w-5 h-5" />
            <h3 className="text-sm font-cinematic font-bold tracking-wider uppercase">
              Citadel Safety: Report Filmmaker
            </h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-full text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSubmitted ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
              <Check className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-white">Report Logged to Citadel Security</h4>
            <p className="text-xs text-gray-400">
              Our trust & safety team has received the incident report. The user has been muted from your feed.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <span className="text-gray-400">Reporting User:</span>
              <div className="font-bold text-white text-sm mt-0.5">{targetUser.name} ({targetUser.activeRole})</div>
            </div>

            <div className="space-y-1">
              <label className="text-gray-400 font-semibold">Violation Category</label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-white focus:outline-none focus:border-red-500"
              >
                <option value="UNPROFESSIONAL_BEHAVIOR">Unprofessional Behavior / Ghosting</option>
                <option value="COPYRIGHT_INFRINGEMENT">Plagiarism or Unauthorized Script Use</option>
                <option value="HARASSMENT">Harassment or Inappropriate Messages</option>
                <option value="SPAM">Commercial Spam / Fake Opportunities</option>
                <option value="IMPERSONATION">Impersonation of Industry Professional</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-gray-400 font-semibold">Incident Details</label>
              <textarea
                required
                rows={3}
                placeholder="Provide specific context or links to the message/project..."
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-white focus:outline-none focus:border-red-500"
              />
            </div>

            <label className="flex items-center space-x-2 p-2.5 rounded-xl bg-black/40 border border-white/5 cursor-pointer">
              <input
                type="checkbox"
                checked={shouldBlock}
                onChange={(e) => setShouldBlock(e.target.checked)}
                className="rounded border-white/20 text-red-500 focus:ring-red-500"
              />
              <span className="text-gray-300">
                Immediately block this user from contacting me and hide their profile
              </span>
            </label>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-gray-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl font-bold uppercase tracking-wider bg-red-600 hover:bg-red-500 text-white flex items-center space-x-1.5 shadow-md"
              >
                <Ban className="w-3.5 h-3.5" />
                <span>Submit & Report</span>
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
