import React, { useState } from 'react';
import { INITIAL_OPPORTUNITIES, INITIAL_APPLICATIONS } from '../services/mockData';
import { Opportunity, Application } from '../types';
import { useAuth } from '../context/AuthContext';
import { OpportunityCard } from '../components/common/OpportunityCard';
import { CreateOpportunityModal } from '../components/common/CreateOpportunityModal';
import { ApplicationModal } from '../components/common/ApplicationModal';
import { PlusCircle, Search, Trash2, RotateCcw } from 'lucide-react';

export const OpportunitiesPage: React.FC = () => {
  const { currentUser, activeRole } = useAuth();
  
  const [opportunities, setOpportunities] = useState<Opportunity[]>(() => {
    try {
      const saved = localStorage.getItem('cv_opportunities');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return INITIAL_OPPORTUNITIES;
  });

  const [applications, setApplications] = useState<Application[]>(() => {
    try {
      const saved = localStorage.getItem('cv_applications');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return INITIAL_APPLICATIONS;
  });

  const [activeTab, setActiveTab] = useState<'BROWSE' | 'MY_APPLICATIONS' | 'STUDIO_MANAGE'>('BROWSE');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedOppForApply, setSelectedOppForApply] = useState<Opportunity | null>(null);

  const canPost = activeRole === 'PRODUCER' || activeRole === 'DIRECTOR';

  const isOwnOpportunity = (opp: Opportunity) => {
    if (!currentUser) return false;
    if (opp.producerId && (opp.producerId === currentUser.id || opp.producerId === currentUser.email)) return true;
    if (opp.producerEmail && currentUser.email && opp.producerEmail.toLowerCase() === currentUser.email.toLowerCase()) return true;
    if (opp.producerName && currentUser.name && opp.producerName.toLowerCase().trim() === currentUser.name.toLowerCase().trim()) return true;
    return false;
  };

  // The creator himself must NOT see his own opportunity in the browse/apply pool; only all other users see it!
  const browseOpportunities = opportunities.filter(opp => !isOwnOpportunity(opp));
  const myPostedOpportunities = opportunities.filter(opp => isOwnOpportunity(opp));

  const handleUpdateAppStatus = (appId: string, status: Application['status']) => {
    const updated = applications.map(a => (a.id === appId ? { ...a, status } : a));
    setApplications(updated);
    try {
      localStorage.setItem('cv_applications', JSON.stringify(updated));
    } catch (e) {}
  };

  const handleDeleteOpportunity = (oppId: string) => {
    const updated = opportunities.filter(o => o.id !== oppId);
    setOpportunities(updated);
    try {
      localStorage.setItem('cv_opportunities', JSON.stringify(updated));
    } catch (e) {}
  };

  const filteredOpportunities = browseOpportunities.filter(opp => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      opp.title.toLowerCase().includes(q) ||
      opp.description.toLowerCase().includes(q) ||
      opp.requiredRole.toLowerCase().includes(q) ||
      opp.location.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen pb-20 pt-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-cinematic font-black text-white">
            Film Opportunities & Casting Calls
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            Browse open casting calls or publish new verified production requisitions
          </p>
        </div>

        <div className="flex items-center space-x-3 self-start md:self-auto">
          {canPost && (
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="px-6 py-3 rounded-2xl text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black shadow-glow-gold flex items-center space-x-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Post New Opportunity</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center space-x-3 border-b border-white/10 pb-2">
        <button
          onClick={() => setActiveTab('BROWSE')}
          className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
            activeTab === 'BROWSE'
              ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Browse Opportunities ({browseOpportunities.length})
        </button>

        <button
          onClick={() => setActiveTab('MY_APPLICATIONS')}
          className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
            activeTab === 'MY_APPLICATIONS'
              ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          My Submissions ({applications.length})
        </button>

        {canPost && (
          <button
            onClick={() => setActiveTab('STUDIO_MANAGE')}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
              activeTab === 'STUDIO_MANAGE'
                ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Studio Pipeline & My Requisitions ({myPostedOpportunities.length})
          </button>
        )}
      </div>

      {/* TAB 1: BROWSE */}
      {activeTab === 'BROWSE' && (
        <div className="space-y-6">
          <div className="relative max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by role, film title, location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#111218] border border-white/10 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 transition-colors"
            />
          </div>

          {filteredOpportunities.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredOpportunities.map(opp => (
                <OpportunityCard
                  key={opp.id}
                  opportunity={opp}
                  onApply={(o) => setSelectedOppForApply(o)}
                />
              ))}
            </div>
          ) : (
            <div className="p-12 text-center rounded-3xl bg-[#111218]/50 border border-white/10 space-y-3">
              <h3 className="text-base font-cinematic font-bold text-white">No External Opportunities Available</h3>
              <p className="text-xs text-gray-400 max-w-md mx-auto">
                {myPostedOpportunities.length > 0
                  ? `You have created ${myPostedOpportunities.length} opportunity(ies). As the author, your postings are visible to all other creative talent across the network and can be managed in your Studio Pipeline tab.`
                  : "Opportunities and casting calls posted by other directors and producers will appear here for you to apply."}
              </p>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: MY SUBMISSIONS */}
      {activeTab === 'MY_APPLICATIONS' && (
        <div className="space-y-4">
          {applications.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {applications.map(app => (
                <div
                  key={app.id}
                  className="p-6 rounded-3xl bg-[#111218] border border-white/10 space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h3 className="text-base font-cinematic font-bold text-white">
                        {app.opportunityTitle}
                      </h3>
                      <div className="text-xs text-gray-400 mt-0.5">
                        Submitted on {app.appliedAt} • Pitch: {app.pitchNote}
                      </div>
                    </div>

                    <span
                      className={`self-start sm:self-auto text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${
                        app.status === 'SHORTLISTED'
                          ? 'bg-amber-500/15 text-amber-300 border-amber-500/40'
                          : app.status === 'ACCEPTED'
                          ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40'
                          : app.status === 'REJECTED'
                          ? 'bg-red-500/15 text-red-300 border-red-500/40'
                          : 'bg-white/5 text-gray-300 border-white/10'
                      }`}
                    >
                      Status: {app.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center rounded-3xl bg-[#111218]/50 border border-white/10 space-y-3">
              <h3 className="text-base font-cinematic font-bold text-white">No Submissions Yet</h3>
              <p className="text-xs text-gray-400">Browse open opportunities and submit audition tapes or pitch proposals.</p>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: STUDIO MANAGE (For Producers / Directors) */}
      {activeTab === 'STUDIO_MANAGE' && (
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-800/30 text-xs text-emerald-300">
            Producer & Director Selection Deck: Manage your posted casting requisitions and review candidate pitch notes & audition reels.
          </div>

          {/* 1. Creator's Posted Requisitions */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-sm font-bold font-cinematic text-white uppercase tracking-wider">
                Your Active Production Requisitions ({myPostedOpportunities.length})
              </div>
              <span className="text-[11px] text-gray-400 font-mono">
                Broadcasting to all other film creators across the platform
              </span>
            </div>

            {myPostedOpportunities.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {myPostedOpportunities.map(opp => (
                  <div key={opp.id} className="p-5 rounded-2xl bg-[#111218] border border-white/10 space-y-3 relative">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="text-base font-bold text-white font-cinematic">{opp.title}</div>
                        <div className="text-xs text-amber-400 font-mono mt-0.5">
                          Role: {opp.requiredRole.replace(/_/g, ' ')} • {opp.filmCategory.replace(/_/g, ' ')}
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteOpportunity(opp.id)}
                        className="p-2 rounded-xl bg-red-600/20 hover:bg-red-600/40 text-red-400 border border-red-500/30 transition-colors"
                        title="Withdraw Requisition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-xs text-gray-300 line-clamp-2">{opp.description}</p>
                    <div className="flex items-center justify-between text-[11px] text-gray-400 font-mono pt-2 border-t border-white/5">
                      <span>{opp.compensationType}: {opp.compensationDetails}</span>
                      <span className="text-emerald-400 font-bold">
                        {opp.applicantsCount || 0} Candidates Applied
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center rounded-2xl bg-black/30 border border-white/5 text-xs text-gray-400">
                You haven't posted any requisitions yet. Use the "Post New Opportunity" button to invite auditions and technical crew.
              </div>
            )}
          </div>

          {/* 2. Candidate Audition Submissions */}
          <div className="space-y-3 pt-4 border-t border-white/10">
            <div className="text-sm font-bold font-cinematic text-white uppercase tracking-wider">
              Audition & Application Pipeline ({applications.length})
            </div>

            {applications.length > 0 ? (
              <div className="space-y-4">
            {applications.map(app => (
              <div
                key={app.id}
                className="p-6 rounded-3xl bg-[#111218] border border-white/10 space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center space-x-3">
                    <img
                      src={app.applicantAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                      alt={app.applicantName}
                      className="w-12 h-12 rounded-full object-cover border border-amber-500/40"
                    />
                    <div>
                      <div className="text-sm font-bold text-white flex items-center space-x-2">
                        <span>{app.applicantName}</span>
                        <span className="text-[10px] text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full font-mono uppercase">
                          {app.applicantRole}
                        </span>
                      </div>
                      <div className="text-xs text-gray-400">
                        {app.applicantExperience} Years Exp • Applied for: <span className="text-gray-300 font-medium">{app.opportunityTitle}</span>
                      </div>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <span className="self-start sm:self-auto text-xs font-mono font-bold px-3 py-1 rounded-full bg-black/60 border border-white/10 text-amber-300">
                    {app.status}
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-black/40 text-xs text-gray-300 space-y-2">
                  <div className="font-semibold text-gray-400 uppercase tracking-wider">Candidate Pitch Note:</div>
                  <p className="font-sans leading-relaxed">"{app.pitchNote}"</p>
                  {app.showreelUrl && (
                    <div className="pt-1">
                      <a
                        href={app.showreelUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-amber-400 hover:underline font-mono"
                      >
                        ▶ Watch Showreel / Audition Tape
                      </a>
                    </div>
                  )}
                </div>

                {/* Status action buttons */}
                <div className="flex items-center justify-end space-x-2 pt-1 border-t border-white/5">
                  <button
                    onClick={() => handleUpdateAppStatus(app.id, 'REJECTED')}
                    className="px-3 py-1.5 rounded-xl text-xs font-medium text-red-400 hover:bg-red-500/10 transition-colors"
                  >
                    Decline
                  </button>
                  <button
                    onClick={() => handleUpdateAppStatus(app.id, 'UNDER_REVIEW')}
                    className="px-3 py-1.5 rounded-xl text-xs font-medium text-gray-300 hover:bg-white/5 transition-colors"
                  >
                    Mark Review
                  </button>
                  <button
                    onClick={() => handleUpdateAppStatus(app.id, 'SHORTLISTED')}
                    className="px-4 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500 hover:text-black transition-colors"
                  >
                    Shortlist
                  </button>
                  <button
                    onClick={() => handleUpdateAppStatus(app.id, 'ACCEPTED')}
                    className="px-4 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-emerald-500 hover:bg-emerald-400 text-black transition-colors"
                  >
                    Accept & Cast
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center rounded-2xl bg-black/30 border border-white/5 text-xs text-gray-400">
            No candidate submissions yet. When artists apply for your requisitions, their audition tapes and pitch notes will arrive here.
          </div>
        )}
      </div>
    </div>
  )}

      {/* Modals */}
      <CreateOpportunityModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={(newOpp) => {
          const updated = [newOpp, ...opportunities];
          setOpportunities(updated);
          try {
            localStorage.setItem('cv_opportunities', JSON.stringify(updated));
          } catch (e) {}
        }}
      />

      <ApplicationModal
        opportunity={selectedOppForApply}
        isOpen={!!selectedOppForApply}
        onClose={() => setSelectedOppForApply(null)}
        onSubmit={(newApp) => {
          const updated = [newApp, ...applications];
          setApplications(updated);
          try {
            localStorage.setItem('cv_applications', JSON.stringify(updated));
          } catch (e) {}
        }}
      />
    </div>
  );
};
