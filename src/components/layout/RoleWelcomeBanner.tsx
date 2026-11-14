import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useBgm } from '../../context/BgmContext';
import { useLanguage } from '../../context/LanguageContext';
import { Sparkles, ArrowRight, Film, PlusCircle, Video, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';

interface MetricItem {
  label: string;
  value: string;
}

interface RoleWelcomeBannerProps {
  onOpenCreateModal?: () => void;
  metrics: MetricItem[];
}

export const RoleWelcomeBanner: React.FC<RoleWelcomeBannerProps> = ({ onOpenCreateModal, metrics }) => {
  const { currentUser, activeRole } = useAuth();
  const { theme } = useTheme();
  const { isBgmEnabled, stopAnimation } = useBgm();
  const { t, translateText } = useLanguage();

  // Animation is active by default with anime soundtrack, and freezes when music is muted
  const isAnimationActive = isBgmEnabled && !stopAnimation;

  // Fully translated role welcome message
  const welcomeHeading = t(`welcome.${activeRole}`, theme.welcomeHeading);
  const welcomeSubtitle = t('proverb.light_shadow', theme.welcomeSubtitle);

  return (
    <div className={`relative overflow-hidden rounded-3xl border border-white/10 shadow-2xl mb-8 group role-welcome-banner ${isAnimationActive ? 'camera-shake' : ''}`}>
      {/* Background Cinematic Image with dynamic overlay and smooth zoom */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img
          src={theme.bannerImage}
          alt={theme.title}
          className="w-full h-full object-cover object-center filter brightness-[0.32] contrast-125 banner-bg-img"
        />
        <div className={`absolute inset-0 bg-gradient-to-r ${theme.bgGradient} opacity-90 mix-blend-multiply banner-bg-grad`} />
        
        {/* Animated Lens Flare / Spotlight beam (active with music, frozen when muted) */}
        <div
          className={`absolute -top-24 left-1/4 w-96 h-96 rounded-full blur-[120px] pointer-events-none opacity-40 banner-lens-flare ${
            isAnimationActive ? 'animate-pulse' : ''
          }`}
          style={{ backgroundColor: theme.primaryColor }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#070709] via-transparent to-transparent banner-bg-fade" />

        {/* Film Strip Border Accents along the top */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-transparent via-amber-500/30 to-transparent flex items-center justify-around opacity-40">
          {[...Array(24)].map((_, i) => (
            <div key={i} className="w-1.5 h-1 bg-white/40 rounded-sm" />
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 p-6 sm:p-10 lg:p-12">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
          
          {/* Headline & Description */}
          <div className="max-w-3xl space-y-4">
            <div
              className="inline-flex items-center space-x-2.5 px-3.5 py-1 rounded-full text-xs font-bold tracking-wider uppercase border shadow-lg banner-role-pill"
              style={{
                borderColor: `${theme.primaryColor}90`,
                backgroundColor: `${theme.primaryColor}25`,
                color: theme.accentColor
              }}
            >
              <span
                className={`w-2 h-2 rounded-full ${isAnimationActive ? 'animate-ping' : ''}`}
                style={{ backgroundColor: theme.accentColor }}
              />
              <span>{theme.title} Studio Control</span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-cinematic font-black tracking-wider text-white leading-tight">
              {welcomeHeading}
            </h1>

            <p className="text-sm sm:text-base text-gray-300 font-sans leading-relaxed max-w-2xl">
              {welcomeSubtitle}
            </p>

            {/* Visual Tags */}
            <div className="flex flex-wrap gap-2 pt-1">
              {theme.visualKeywords.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-lg text-[11px] font-semibold bg-white/5 border border-white/10 text-gray-300 backdrop-blur-sm banner-visual-tag"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Real-time Cinematic Equalizer / Audio-Visual Frequency Bars */}
            <div className="flex items-center space-x-1 pt-3">
              {[12, 24, 18, 30, 22, 28, 16, 32, 20, 26, 14, 22].map((h, i) => (
                <div
                  key={i}
                  className={`w-1 rounded-full opacity-70 transition-all ${isAnimationActive ? 'animate-pulse' : ''}`}
                  style={{
                    backgroundColor: theme.accentColor,
                    height: isAnimationActive ? `${h * 0.75}px` : `${h * 0.45}px`,
                    animationDuration: `${0.35 + (i % 5) * 0.2}s`
                  }}
                />
              ))}
              <span className="text-[10px] font-mono text-gray-400 pl-2 uppercase tracking-widest banner-monitoring-text">
                24 FPS MASTER MONITORING ACTIVE
              </span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 min-w-[220px]">
            {activeRole === 'PRODUCER' || activeRole === 'DIRECTOR' ? (
              <button
                onClick={onOpenCreateModal}
                className="px-5 py-3.5 rounded-2xl font-bold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 shadow-xl transition-all hover:brightness-110 active:scale-95"
                style={{
                  backgroundColor: theme.primaryColor,
                  color: '#ffffff'
                }}
              >
                <PlusCircle className="w-4 h-4" />
                <span>{t('nav.opportunities', 'Post Opportunity')}</span>
              </button>
            ) : (
              <Link
                to="/opportunities"
                className="px-5 py-3.5 rounded-2xl font-bold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 shadow-xl transition-all hover:brightness-110 active:scale-95 text-white"
                style={{
                  backgroundColor: theme.primaryColor
                }}
              >
                <Film className="w-4 h-4" />
                <span>{t('nav.opportunities', 'Browse Auditions & Roles')}</span>
              </Link>
            )}

            <Link
              to="/talent"
              className="px-5 py-3.5 rounded-2xl font-bold text-xs uppercase tracking-wider bg-white/10 hover:bg-white/15 text-white border border-white/15 backdrop-blur-md flex items-center justify-center space-x-2 transition-all hover:brightness-110 banner-explore-btn"
            >
              <span>{t('nav.discover', 'Explore Talent')}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Real Dynamic Metrics: Calculated from active state */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-6 border-t border-white/10 banner-metrics-grid">
          {metrics.map((stat, i) => (
            <div
              key={i}
              className="p-4 rounded-2xl bg-black/50 backdrop-blur-md border border-white/5 hover:border-white/20 transition-colors banner-metric-card"
            >
              <div
                className="text-2xl sm:text-3xl font-cinematic font-black tracking-wide banner-metric-value"
                style={{ color: theme.accentColor }}
              >
                {stat.value}
              </div>
              <div className="text-[11px] text-gray-400 uppercase tracking-wider font-semibold mt-1 banner-metric-label">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
