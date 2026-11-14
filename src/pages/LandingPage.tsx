import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { SpotlightEffect } from '../components/common/SpotlightEffect';
import { CinematicLogo } from '../components/common/CinematicLogo';
import { useLanguage } from '../context/LanguageContext';
import { useBgm } from '../context/BgmContext';
import { useAuth } from '../context/AuthContext';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Video,
  Users,
  Briefcase,
  Film,
  Camera,
  Scissors,
  Music,
  Feather,
  Wand2,
  CheckCircle2,
  Star,
  Award,
  Layers,
  Ticket
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { t, translateText } = useLanguage();
  const { stopAnimation } = useBgm();
  const { currentUser, setGuestModeActive } = useAuth();

  // Guarantee that CineVantaara remains 100% in its original cinematic gold color unless a guest is logged in
  useEffect(() => {
    if (!currentUser || (!currentUser.isGuest && currentUser.activeRole !== 'GUEST')) {
      setGuestModeActive(false);
    }
  }, [currentUser, setGuestModeActive]);

  return (
    <div className="relative min-h-screen bg-[#070709] text-gray-100 overflow-hidden">
      
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[92vh] flex items-center justify-center pt-16 pb-28 px-4 sm:px-6 lg:px-8 overflow-hidden landing-hero">
        {/* Spotlight & Atmospheric Lighting */}
        <SpotlightEffect className="-top-40 left-0 md:left-60 md:-top-20" fill="#E5A93C" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-amber-500/10 blur-[140px] pointer-events-none rounded-full" />
        
        {/* Background Film Visuals */}
        <div className="absolute inset-0 opacity-25 z-0 pointer-events-none">
          <img
            src="https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=2000&q=80"
            alt="Cinematic production stage"
            className="w-full h-full object-cover filter contrast-125"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#070709] via-[#070709]/75 to-[#070709]/40" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto text-center space-y-8">
          
          {/* Hallmark Logo Emblem */}
          <div className="flex justify-center">
            <CinematicLogo size="xl" showText={false} />
          </div>

          {/* Tagline Badge */}
          <div className="inline-flex items-center space-x-2.5 px-4 py-1.5 rounded-full border border-amber-500/40 bg-amber-500/10 backdrop-blur-md shadow-glow-gold">
            <Sparkles className={`w-4 h-4 text-amber-400 ${stopAnimation ? '' : 'animate-spin'}`} style={{ animationDuration: '6s' }} />
            <span className="text-xs font-bold uppercase tracking-widest text-amber-200">
              {t('proverb.tagline', 'Where Stories Meet Talent')}
            </span>
          </div>

          {/* Heading with text reveal */}
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-cinematic font-black tracking-wider text-white uppercase leading-tight">
              {t('proverb.tagline', 'Where Stories Meet Talent')}
            </h1>
            <p className="text-base sm:text-xl text-gray-300 font-sans max-w-3xl mx-auto leading-relaxed">
              {t('proverb.subtext', 'CineVantaara is the international cinema collaboration ecosystem connecting visionary directors, producers, screenwriters, actors, and verified craftspeople worldwide.')}
            </p>
          </div>

          {/* CTA Buttons: 4 Cohesive, Beautifully Styled Matching Boxes */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 flex-wrap">
            {/* Box 1: Studio Dashboard */}
            <Link
              to="/dashboard"
              onClick={() => setGuestModeActive(false)}
              className="w-full sm:w-auto px-7 py-4 rounded-2xl font-cinematic font-bold text-sm uppercase tracking-wider bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black shadow-glow-gold hover:brightness-110 transition-all duration-300 flex items-center justify-center space-x-2 border border-amber-400/40"
            >
              <span>{t('nav.dashboard', 'Studio Dashboard')}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            {/* Box 2: Filmmaker Sign In (Matching Box) */}
            <Link
              to="/login"
              onClick={() => setGuestModeActive(false)}
              className="w-full sm:w-auto px-7 py-4 rounded-2xl font-cinematic font-bold text-sm uppercase tracking-wider bg-white/10 hover:bg-white/15 text-amber-300 hover:text-white border border-amber-500/40 backdrop-blur-md shadow-lg shadow-black/40 hover:border-amber-400 hover:shadow-amber-500/10 transition-all duration-300 flex items-center justify-center space-x-2"
            >
              <Film className="w-4 h-4 text-amber-400" />
              <span>{t('nav.filmmakerSignIn', 'Filmmaker Sign In')}</span>
            </Link>

            {/* Box 3: Explore Talent (Matching Box) */}
            <Link
              to="/talent"
              onClick={() => setGuestModeActive(false)}
              className="w-full sm:w-auto px-7 py-4 rounded-2xl font-cinematic font-bold text-sm uppercase tracking-wider bg-white/5 hover:bg-white/10 text-white border border-white/15 backdrop-blur-md hover:brightness-110 transition-all duration-300 flex items-center justify-center space-x-2"
            >
              <Users className="w-4 h-4 text-amber-400" />
              <span>{t('nav.discover', 'Explore Talent')}</span>
            </Link>

            {/* Box 4: Continue as Guest (CinePass) - Switches theme to Red on click */}
            <Link
              to="/login?mode=guest"
              onClick={() => setGuestModeActive(true)}
              className="w-full sm:w-auto px-7 py-4 rounded-2xl font-cinematic font-bold text-sm uppercase tracking-wider bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 text-white shadow-glow-guest transition-all duration-300 flex items-center justify-center space-x-2 border border-red-500/40"
            >
              <Ticket className="w-4 h-4" />
              <span>Continue as Guest (CinePass)</span>
            </Link>
          </div>

          {/* Film Perforation ribbon */}
          <div className="pt-10 flex items-center justify-center space-x-8 text-xs font-mono text-gray-400 uppercase tracking-widest border-t border-white/10">
            <span className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span>{t('proverb.cinema', 'Cinema Weaves Dreams Into Reality')}</span>
            </span>
          </div>
        </div>
      </section>

      {/* 2. ABOUT CINEVANTAARA */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 border-t border-white/10 bg-[#090a0f]">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
              The Creative Paradigm
            </span>
            <h2 className="text-3xl sm:text-4xl font-cinematic font-bold text-white leading-snug">
              {t('proverb.light_shadow', 'Stories written in light, shadows sculpted in sound.')}
            </h2>
            <p className="text-sm sm:text-base text-gray-300 leading-relaxed font-sans">
              {t('proverb.subtext', 'Traditional casting calls and production staffing are fragmented across agencies and email chains. CineVantaara transforms production packaging into a frictionless, visually intoxicating platform where scripts discover visionary directors, producers greenlight validated teams, and crew members secure verified credits.')}
            </p>
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                <div className="text-2xl font-cinematic font-bold text-amber-400">100%</div>
                <div className="text-xs text-gray-400 uppercase font-semibold mt-1">Verified Credits</div>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                <div className="text-2xl font-cinematic font-bold text-emerald-400">0%</div>
                <div className="text-xs text-gray-400 uppercase font-semibold mt-1">Admin E2EE Backdoors</div>
              </div>
            </div>
          </div>

          <div className="relative rounded-3xl overflow-hidden border border-white/15 shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?auto=format&fit=crop&w=1000&q=80"
              alt="Film set director collaboration"
              className="w-full h-80 sm:h-96 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-black/60 backdrop-blur-md border border-white/10">
              <div className="text-xs font-bold text-amber-300 font-cinematic uppercase">
                Director & DP Collaboration on Set
              </div>
              <div className="text-xs text-gray-300">
                Seamless real-time synchronization between pre-production, table reads, and principal photography.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. EXPLORE FILM PROFESSIONALS & UNIQUE ROLES */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 border-t border-white/10">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
              24 Distinct Cinematic Personas
            </span>
            <h2 className="text-3xl sm:text-5xl font-cinematic font-bold text-white">
              Every Profession Deserves Its Own Visual Universe
            </h2>
            <p className="text-sm sm:text-base text-gray-400 max-w-2xl mx-auto">
              No generic dashboards. When you enter as a Director, Producer, or VFX Artist, the palette, tools, and workflows automatically adapt to your craft.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[
              { role: 'DIRECTOR', title: 'Director', color: '#9333EA', desc: 'Shotlists, slates & creative crew orchestration' },
              { role: 'PRODUCER', title: 'Producer', color: '#10B981', desc: 'Opportunity greenlighting & budget escrow' },
              { role: 'WRITER', title: 'Screenwriter', color: '#BE123C', desc: 'Screenplay vault & treatment pitching' },
              { role: 'ACTOR', title: 'Actor / Performer', color: '#F43F5E', desc: 'Spotlight reels & audition callbacks' },
              { role: 'CINEMATOGRAPHER', title: 'Cinematographer', color: '#0284C7', desc: 'Large format optical packages & LUTs' },
              { role: 'EDITOR', title: 'Film Editor', color: '#06B6D4', desc: 'Rough cuts & timeline assemblies' },
              { role: 'MUSIC_DIRECTOR', title: 'Composer', color: '#8B5CF6', desc: 'Orchestral scores & 7.1.4 Atmos stems' },
              { role: 'VFX_ARTIST', title: 'VFX & CGI Supervisor', color: '#14B8A6', desc: 'Unreal Engine 5 ICVFX volume stages' }
            ].map((item, i) => (
              <Link
                key={i}
                to="/dashboard"
                className="p-5 rounded-2xl bg-[#111218] border border-white/10 hover:border-amber-500/40 transition-all group flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm"
                    style={{ backgroundColor: `${item.color}25`, color: item.color }}
                  >
                    🎬
                  </div>
                  <div>
                    <h3 className="font-cinematic font-bold text-white group-hover:text-amber-300 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs text-gray-400 mt-1 line-clamp-2">{item.desc}</p>
                  </div>
                </div>
                <div className="pt-4 flex items-center text-xs font-semibold text-gray-400 group-hover:text-amber-400">
                  <span>{t('nav.dashboard', 'Enter Console')}</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 4. PROFESSIONAL FOOTER */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-white/10 bg-[#050507] text-gray-400 text-xs">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <CinematicLogo size="sm" />

          <div className="flex items-center space-x-6 text-gray-300">
            <Link to="/talent" className="hover:text-amber-400 transition-colors">{t('nav.discover', 'Talent Directory')}</Link>
            <Link to="/opportunities" className="hover:text-amber-400 transition-colors">{t('nav.opportunities', 'Opportunities')}</Link>
            <Link to="/ai-match" className="hover:text-amber-400 transition-colors">{t('nav.aiMatch', 'AI Match Engine')}</Link>
          </div>

          <div className="text-gray-500 text-center md:text-right font-mono">
            © 2026 CineVantaara Inc. All rights reserved. Hollywood, Mumbai & London.
          </div>
        </div>
      </footer>
    </div>
  );
};
