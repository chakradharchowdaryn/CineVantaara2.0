import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { FileText, ShieldCheck, Scale, Award, Lock, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export const TermsPage: React.FC = () => {
  const { currentSkinConfig } = useTheme();

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8 text-gray-200">
      <Link
        to="/"
        className="inline-flex items-center space-x-2 text-xs font-mono text-gray-400 hover:text-white transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Studio</span>
      </Link>

      <div className="p-8 rounded-3xl bg-[#0e0f14] border border-white/10 space-y-6 shadow-2xl relative overflow-hidden">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <span
              className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase text-black"
              style={{ backgroundColor: currentSkinConfig.primary }}
            >
              PHASE 11 • LEGAL GOVERNANCE
            </span>
            <span className="text-xs text-gray-400 font-mono">Platform Version 2026.1</span>
          </div>
          <h1 className="text-3xl font-black font-cinematic uppercase tracking-wide text-white">
            Terms of Service & IP Protection
          </h1>
          <p className="text-xs text-gray-400">
            Last updated: November 2026 • Governed by the Citadel Administrative Charter
          </p>
        </div>

        <div className="space-y-6 text-xs sm:text-sm text-gray-300 leading-relaxed border-t border-white/10 pt-6">
          <section className="space-y-2">
            <h2 className="text-base font-bold text-white font-cinematic uppercase flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" />
              <span>1. Intellectual Property & Screenplay Ownership</span>
            </h2>
            <p>
              CineVantaara adheres strictly to a <strong>Creator-First IP Model</strong>. All original screenplays, loglines, treatments, film treatments, camera LUT packages, and musical score stems uploaded by verified creators remain 100% the exclusive intellectual property of the author. CineVantaara claims zero ownership, licensing, or commercial distribution rights over user-created works.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-white font-cinematic uppercase flex items-center gap-2">
              <Scale className="w-4 h-4 text-emerald-400" />
              <span>2. Producer Escrow & Opportunity Contracts</span>
            </h2>
            <p>
              Producers posting production casting calls, crew requirements, and festival auditions agree to maintain transparent recruitment pipelines. The platform enforces a 5-stage application status cycle. Discriminatory practices, undisclosed non-union rates, or unauthorized use of audition reels are strictly prohibited and result in immediate Citadel administrative sanctions.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-white font-cinematic uppercase flex items-center gap-2">
              <Lock className="w-4 h-4 text-sky-400" />
              <span>3. Event Ticketing, Passes & Refund Policy</span>
            </h2>
            <p>
              Pre-release event passes and gala tickets issued through CineVantaara are validated via cryptographic QR tokens. Attendees may request full cancellation and refunds through their Cinema Pass Wallet up to 24 hours prior to the scheduled event curtain call.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-white font-cinematic uppercase flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-purple-400" />
              <span>4. Zero Tolerance for Copyright Infringement</span>
            </h2>
            <p>
              Uploading copyrighted reels, uncredited footage, or pirated motion pictures results in permanent account forfeiture under Citadel Administrative governance.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
