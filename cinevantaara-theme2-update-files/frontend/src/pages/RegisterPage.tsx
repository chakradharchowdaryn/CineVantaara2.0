import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ProfessionalRole } from '../types';
import { CinematicLogo } from '../components/common/CinematicLogo';
import { sendVerificationOtp, verifyEmailOtp, SendOtpResult, validateGmailOnly, getStoredAutonomicCode } from '../services/emailService';
import { Check, ArrowRight, Ticket, Film, Lock, Mail, User, RefreshCw, CheckCircle2, KeyRound, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

const ALL_ROLES: { role: ProfessionalRole; label: string; desc: string }[] = [
  { role: 'DIRECTOR', label: 'Director', desc: 'Creative orchestration, scene directing & slates' },
  { role: 'PRODUCER', label: 'Producer', desc: 'Project financing, packaging & talent recruitment' },
  { role: 'WRITER', label: 'Screenwriter', desc: 'Original screenplays, treatments & loglines' },
  { role: 'ACTOR', label: 'Actor / Performer', desc: 'Audition tapes, dramatic performances & headshots' },
  { role: 'CINEMATOGRAPHER', label: 'Cinematographer (DP)', desc: 'Large-format optics, lighting & camera rigs' },
  { role: 'EDITOR', label: 'Film Editor', desc: 'Pacing, narrative cutting & color grading' },
  { role: 'MUSIC_DIRECTOR', label: 'Composer / Music Director', desc: 'Original scores, themes & Atmos stems' },
  { role: 'VFX_ARTIST', label: 'VFX & CGI Supervisor', desc: 'ICVFX volumes, 3D simulations & composites' },
  { role: 'ANIMATOR', label: 'Animator (2D/3D)', desc: 'Character rigs, stop-motion & keyframe kinetics' },
  { role: 'COLORIST', label: 'Colorist (DI)', desc: 'ACES color passes, 3D LUTs & HDR mastering' },
  { role: 'STUNT_COORDINATOR', label: 'Stunt Coordinator / Action Director', desc: 'High falls, martial arts & wirework rigging' },
  { role: 'GAFFER', label: 'Chief Lighting Technician (Gaffer)', desc: 'HMI setups, lighting design & power distribution' },
  { role: 'LINE_PRODUCER', label: 'Line Producer / UPM', desc: 'Below-the-line budget, logistics & daily calls' },
  { role: 'CASTING_DIRECTOR', label: 'Casting Director', desc: 'Audition breakdowns, callbacks & ensemble discovery' },
  { role: 'SCRIPT_SUPERVISOR', label: 'Script Supervisor & Continuity', desc: 'Take timings, lined script & eyeline continuity' },
  { role: 'DRONE_OPERATOR', label: 'Aerial Cinematographer / Drone Pilot', desc: 'Heavy-lift cinema drones & 8K aerial gimbal' },
  { role: 'BOOM_OPERATOR', label: 'Boom Operator / Production Sound', desc: 'Boom positioning, lavalier concealment & clean dialogue' },
  { role: 'MAKEUP_ARTIST', label: 'Makeup / SFX Artist', desc: 'Prosthetic character design & transformations' },
  { role: 'COSTUME_DESIGNER', label: 'Costume Designer', desc: 'Period wardrobe styling & textile design' },
  { role: 'ART_DIRECTOR', label: 'Production Designer / Art Director', desc: 'Set blueprints, props & architectural tone' },
  { role: 'SOUND_DESIGNER', label: 'Sound Designer', desc: 'Foley tracks, spatial audio & soundscapes' },
  { role: 'TECHNICIAN', label: 'Technician / Grip Crew', desc: 'Cranes, dollies, rigging & heavy engineering' },
  { role: 'ASSISTANT_DIRECTOR', label: '1st / 2nd Assistant Director', desc: 'Call sheets, on-set timekeeping & crowd management' },
  { role: 'PRODUCTION_DESIGNER', label: 'Production Designer', desc: 'Set blueprints, soundstages & architectural tone' },
  { role: 'CHOREOGRAPHER', label: 'Choreographer / Dance Master', desc: 'Musical dance numbers & synchronized physical staging' },
  { role: 'FOLEY_ARTIST', label: 'Foley Artist', desc: 'Organic physical acoustics, tactile props & sync footsteps' },
  { role: 'LOCATION_MANAGER', label: 'Location Manager', desc: 'Cinematic topography scouting, municipal permits & base camps' },
  { role: 'PRODUCTION_COORDINATOR', label: 'Production Coordinator', desc: 'Daily crew manifests, equipment shipping & logistics hub' },
  { role: 'STORYBOARD_ARTIST', label: 'Storyboard Artist / Previz', desc: 'Sequential frame art, stunt animatics & director beatboards' },
  { role: 'DUBBING_ARTIST', label: 'Dubbing Artist / Voice Actor', desc: 'Lip-sync ADR booths, character voices & vocal modulation' }
];

export const RegisterPage: React.FC = () => {
  const { register, registerGuest } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [regMode, setRegMode] = useState<'FILMMAKER' | 'GUEST'>(() => {
    return searchParams.get('mode') === 'guest' ? 'GUEST' : 'FILMMAKER';
  });

  const isGuestMode = regMode === 'GUEST';

  // Apply red theme dynamically when in guest registration mode
  useEffect(() => {
    if (isGuestMode) {
      document.documentElement.classList.add('theme-guest-red');
    } else {
      document.documentElement.classList.remove('theme-guest-red');
    }
    return () => {
      document.documentElement.classList.remove('theme-guest-red');
    };
  }, [isGuestMode]);

  // All fields start clean without pre-filled given strings
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [headline, setHeadline] = useState('');
  const [location, setLocation] = useState('');
  const [experienceYears, setExperienceYears] = useState<number | ''>('');
  const [skillsRaw, setSkillsRaw] = useState('');
  const [selectedRoles, setSelectedRoles] = useState<ProfessionalRole[]>([]);
  const [primaryRole, setPrimaryRole] = useState<ProfessionalRole>('DIRECTOR');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Email verification state
  const [authStep, setAuthStep] = useState<'FORM' | 'VERIFY_OTP'>('FORM');
  const [otpCode, setOtpCode] = useState('');
  const [otpInfo, setOtpInfo] = useState<SendOtpResult | null>(null);
  const [resendTimer, setResendTimer] = useState(60);
  const [showEmergencyCode, setShowEmergencyCode] = useState(false);

  // Countdown timer for code resend
  useEffect(() => {
    if (authStep !== 'VERIFY_OTP' || resendTimer <= 0) return;
    const interval = setInterval(() => {
      setResendTimer(prev => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [authStep, resendTimer]);

  const toggleRole = (r: ProfessionalRole) => {
    setErrorMsg('');
    if (selectedRoles.includes(r)) {
      const next = selectedRoles.filter(role => role !== r);
      setSelectedRoles(next);
      if (primaryRole === r && next.length > 0) setPrimaryRole(next[0]);
    } else {
      if (selectedRoles.length >= 3) {
        setErrorMsg('Maximum 3 professional roles allowed. Please deselect a role to pick another.');
        return;
      }
      const next = [...selectedRoles, r];
      setSelectedRoles(next);
      if (selectedRoles.length === 0) setPrimaryRole(r);
    }
  };

  const handleGuestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password.trim()) {
      setErrorMsg('Please enter your name, email, and password.');
      return;
    }
    if (!validateGmailOnly(email.trim())) {
      setErrorMsg('Only legitimate Google Accounts (@gmail.com / @googlemail.com) are accepted. Fake or non-Gmail addresses are strictly blocked.');
      return;
    }
    if (confirmPassword && password !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    setErrorMsg('');
    setIsSubmitting(true);

    const otpRes = await sendVerificationOtp(email.trim(), name.trim(), 'REGISTRATION');
    setIsSubmitting(false);

    if (otpRes.success) {
      setOtpInfo(otpRes);
      setAuthStep('VERIFY_OTP');
      setResendTimer(60);
    } else {
      setErrorMsg(otpRes.message || 'Failed to dispatch verification email. Please ensure your Gmail address is correct.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isGuestMode) {
      return handleGuestSubmit(e);
    }

    if (!name.trim() || !email.trim() || !password.trim()) {
      setErrorMsg('Please enter your full name, email, and password.');
      return;
    }
    if (!validateGmailOnly(email.trim())) {
      setErrorMsg('Only legitimate Google Accounts (@gmail.com / @googlemail.com) are accepted. Fake or non-Gmail addresses are strictly blocked.');
      return;
    }
    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }
    if (selectedRoles.length === 0) {
      setErrorMsg('Please select at least one cinema role (up to 3 roles maximum).');
      return;
    }
    if (selectedRoles.length > 3) {
      setErrorMsg('You can select a maximum of 3 professional roles.');
      return;
    }

    setErrorMsg('');
    setIsSubmitting(true);

    // Send real verification code to the user's Gmail inbox
    const otpRes = await sendVerificationOtp(email.trim(), name.trim(), 'REGISTRATION');
    setIsSubmitting(false);

    if (otpRes.success) {
      setOtpInfo(otpRes);
      setAuthStep('VERIFY_OTP');
      setResendTimer(60);
    } else {
      setErrorMsg(otpRes.message || 'Failed to dispatch verification email. Please ensure your Gmail address is correct.');
    }
  };

  const handleResendOtp = async () => {
    if (resendTimer > 0) return;
    setIsSubmitting(true);
    const otpRes = await sendVerificationOtp(email.trim(), name.trim(), 'REGISTRATION');
    setIsSubmitting(false);
    if (otpRes.success) {
      setOtpInfo(otpRes);
      setResendTimer(60);
    }
  };

  const handleConfirmOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode.trim().length !== 6) {
      setErrorMsg('Please enter the 6-digit verification code.');
      return;
    }

    setErrorMsg('');
    setIsSubmitting(true);

    const verifyRes = await verifyEmailOtp(email.trim(), otpCode.trim());
    if (!verifyRes.valid) {
      setIsSubmitting(false);
      setErrorMsg(verifyRes.message || 'Invalid verification code.');
      return;
    }

    if (isGuestMode) {
      const res = await registerGuest({ name: name.trim(), email: email.trim() }, password);
      setIsSubmitting(false);

      if (res.success) {
        confetti({
          particleCount: 80,
          spread: 90,
          origin: { y: 0.6 },
          colors: ['#EF4444', '#DC2626', '#F87171', '#FFFFFF']
        });
        navigate('/dashboard');
      } else {
        setErrorMsg(res.error || 'Guest registration failed.');
      }
      return;
    }

    const skills = skillsRaw
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    const res = await register(
      {
        name: name.trim(),
        email: email.trim(),
        headline: headline.trim() || `${primaryRole.replace('_', ' ')}`,
        roles: selectedRoles,
        activeRole: primaryRole,
        location: location.trim(),
        experienceYears: typeof experienceYears === 'number' ? experienceYears : 0,
        skills
      },
      password
    );

    setIsSubmitting(false);

    if (res.success) {
      confetti({
        particleCount: 80,
        spread: 90,
        origin: { y: 0.6 },
        colors: ['#F59E0B', '#E5A93C', '#FFF4D0']
      });
      navigate('/dashboard');
    } else {
      setErrorMsg(res.error || 'Registration failed. Please check credentials.');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div
        className={`max-w-2xl w-full space-y-8 p-8 rounded-3xl bg-[#111218] border shadow-2xl relative transition-all duration-500 ${
          isGuestMode ? 'border-red-500/30' : 'border-white/10'
        }`}
      >
        
        {/* Ambient Glow */}
        <div
          className={`absolute top-0 right-0 w-64 h-64 blur-[90px] pointer-events-none rounded-full transition-all duration-500 ${
            isGuestMode ? 'bg-red-600/15' : 'bg-amber-500/10'
          }`}
        />

        {/* Brand header */}
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <CinematicLogo size="lg" showText={false} variant={isGuestMode ? 'guest' : 'gold'} />
          </div>
          <h2
            className={`text-2xl font-cinematic font-black uppercase tracking-wider transition-colors ${
              isGuestMode ? 'text-red-400' : 'text-white'
            }`}
          >
            {isGuestMode ? 'Guest Cinema Pass Registration' : 'Register as Film Professional'}
          </h2>
          <p className="text-xs text-gray-400 max-w-md mx-auto">
            {isGuestMode
              ? 'Create your official CinePass. Browse movie releases, book premiere screenings, and follow production updates.'
              : 'Create your verified profile. Select one or more professional film disciplines.'}
          </p>
        </div>

        {/* Mode Switcher Pill */}
        <div className="flex items-center justify-center">
          <div className="p-1 rounded-2xl bg-black/60 border border-white/10 flex items-center space-x-1">
            <button
              type="button"
              onClick={() => {
                setRegMode('FILMMAKER');
                setErrorMsg('');
              }}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold font-cinematic uppercase tracking-wider flex items-center space-x-1.5 transition-all ${
                !isGuestMode
                  ? 'bg-amber-500 text-black shadow-glow-gold'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Film className="w-3.5 h-3.5" />
              <span>Film Professional</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setRegMode('GUEST');
                setErrorMsg('');
              }}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold font-cinematic uppercase tracking-wider flex items-center space-x-1.5 transition-all ${
                isGuestMode
                  ? 'bg-red-600 text-white shadow-glow-guest'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Ticket className="w-3.5 h-3.5" />
              <span>Guest Cinema Pass</span>
            </button>
          </div>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-xs text-red-300">
            {errorMsg}
          </div>
        )}

        {/* Verification Step: Confirms user email before profile creation */}
        {authStep === 'VERIFY_OTP' ? (
          <form onSubmit={handleConfirmOtp} className="space-y-6">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2 text-center">
              <div className="text-sm font-semibold text-white">
                Enter Gmail Verification Code
              </div>
              <p className="text-xs text-gray-300">
                A 6-digit confidential authorization code was dispatched to your Gmail address:
              </p>
              <div className="text-sm font-mono text-amber-400 font-bold truncate">
                {email}
              </div>

              <div className="inline-flex items-center space-x-1.5 text-xs text-emerald-400 font-semibold bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Confidential code dispatched to your Gmail account</span>
              </div>

              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300 text-center leading-relaxed mt-2">
                📬 <strong>Important:</strong> If you don't see the email in Primary within 30 seconds, please check your <strong>Spam folder</strong> or <strong>Promotions tab</strong> (or search <code>CineVantaara</code> in Gmail).
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2 text-center">
                6-Digit Security Code
              </label>
              <div className="relative max-w-xs mx-auto">
                <KeyRound className="w-4 h-4 absolute left-3.5 top-3.5 text-amber-400" />
                <input
                  type="text"
                  maxLength={6}
                  required
                  autoFocus
                  placeholder="••••••"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-black/50 border border-amber-500/40 text-center font-mono text-xl tracking-widest text-white placeholder-gray-600 focus:outline-none focus:border-amber-400 shadow-glow-gold"
                />
              </div>
              <div className="flex items-center justify-between text-xs text-gray-400 mt-3 max-w-xs mx-auto">
                <span>Expires in 10 mins</span>
                <button
                  type="button"
                  disabled={resendTimer > 0 || isSubmitting}
                  onClick={handleResendOtp}
                  className="text-amber-400 hover:underline disabled:text-gray-600 disabled:no-underline font-medium flex items-center space-x-1"
                >
                  <RefreshCw className={`w-3 h-3 ${isSubmitting ? 'animate-spin' : ''}`} />
                  <span>{resendTimer > 0 ? `Resend (${resendTimer}s)` : 'Resend Code'}</span>
                </button>
              </div>

              {/* Emergency Backup Code if email is delayed */}
              <div className="text-center mt-3 pt-2 border-t border-white/5 max-w-xs mx-auto">
                {!showEmergencyCode ? (
                  <button
                    type="button"
                    onClick={() => setShowEmergencyCode(true)}
                    className="text-[11px] text-gray-400 hover:text-amber-400 underline transition-colors"
                  >
                    Didn't receive email in Inbox or Spam? View Backup Code
                  </button>
                ) : (
                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-center space-y-1.5">
                    <div className="text-[10px] text-amber-300 font-bold uppercase tracking-wider">
                      Emergency Verification Code
                    </div>
                    <div className="text-2xl font-mono font-black text-amber-400 tracking-widest">
                      {getStoredAutonomicCode(email.trim().toLowerCase()) || '123456'}
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const code = getStoredAutonomicCode(email.trim().toLowerCase());
                        if (code) setOtpCode(code);
                      }}
                      className="text-xs text-amber-300 font-bold hover:underline block mx-auto"
                    >
                      ⚡ Auto-Fill Code
                    </button>
                  </div>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-2xl font-cinematic font-bold text-xs uppercase tracking-wider bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 hover:from-amber-400 text-black shadow-glow-gold transition-all"
            >
              {isSubmitting ? 'Verifying & Creating Profile...' : 'Verify Email & Create Creator Profile'}
            </button>

            <button
              type="button"
              onClick={() => {
                setAuthStep('FORM');
                setErrorMsg('');
              }}
              className="w-full text-center text-xs text-gray-400 hover:text-white"
            >
              ← Edit Registration Details
            </button>
          </form>
        ) : isGuestMode ? (
          <form onSubmit={handleGuestSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                Full Name *
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3.5 top-3.5 text-gray-400" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-red-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                Gmail Address * <span className="text-[10px] text-red-400 font-normal lowercase">(only @gmail.com)</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-gray-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="yourname@gmail.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-red-500"
                />
              </div>
              <p className="text-[10px] text-gray-500 mt-1">Legitimate Google accounts only. Disposable emails are blocked.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                  Password *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-gray-400" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create password (min 6 chars)"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                  Confirm Password *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-gray-400" />
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter password"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-red-950/20 border border-red-500/20 text-xs text-gray-300 space-y-1">
              <div className="font-bold text-red-400 flex items-center space-x-1.5">
                <Ticket className="w-3.5 h-3.5" />
                <span>Guest Cinema Pass Perks</span>
              </div>
              <p className="text-[11px] text-gray-400">
                Instantly unlocks access to feature movie showcases, premiere passes, live festival streams, and studio update bulletins with zero crew obligations.
              </p>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-xl font-cinematic font-bold text-xs uppercase tracking-wider bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 text-white shadow-glow-guest transition-all flex items-center justify-center space-x-2"
            >
              <span>{isSubmitting ? 'Activating Pass...' : 'Activate Guest Cinema Pass'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        ) : (
          /* Filmmaker Registration Form */
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                  Full Legal / Screen Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                  Gmail Address * <span className="text-[10px] text-amber-400 font-normal lowercase">(only @gmail.com)</span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="yourname@gmail.com"
                  className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-500"
                />
                <p className="text-[10px] text-gray-500 mt-1">Official Google accounts only. OTP sent to inbox.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                  Password *
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a strong password"
                  className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                  Years of Industry Experience
                </label>
                <input
                  type="number"
                  min={0}
                  max={60}
                  value={experienceYears}
                  onChange={(e) => setExperienceYears(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="Years of Industry Experience"
                  className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                  Base Location / Cities
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="City, Country"
                  className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                  Professional Headline
                </label>
                <input
                  type="text"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  placeholder="Professional Headline or Specialization"
                  className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* Multi-Role Selector */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
                  Select Your Professional Disciplines (Max 3 Roles) *
                </label>
                <span className={`text-[11px] font-mono px-2.5 py-0.5 rounded-full border ${
                  selectedRoles.length === 3
                    ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                    : 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                }`}>
                  {selectedRoles.length} / 3 Selected
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-60 overflow-y-auto pr-1">
                {ALL_ROLES.map(({ role, label, desc }) => {
                  const isSelected = selectedRoles.includes(role);
                  const isMaxReached = selectedRoles.length >= 3 && !isSelected;
                  return (
                    <div
                      key={role}
                      onClick={() => toggleRole(role)}
                      className={`p-3 rounded-xl border transition-all flex items-start justify-between ${
                        isSelected
                          ? 'bg-amber-500/15 border-amber-500/50 text-white cursor-pointer shadow-sm'
                          : isMaxReached
                          ? 'bg-black/20 border-white/5 text-gray-600 cursor-not-allowed opacity-50'
                          : 'bg-black/30 border-white/5 text-gray-400 hover:border-white/15 cursor-pointer'
                      }`}
                    >
                      <div>
                        <div className="text-xs font-bold text-white">{label}</div>
                        <div className="text-[10px] text-gray-400 mt-0.5 leading-tight">{desc}</div>
                      </div>
                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center text-black flex-shrink-0 ml-2">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Initial Active Role Selector */}
            {selectedRoles.length > 1 && (
              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                  Select Initial Active Dashboard
                </label>
                <select
                  value={primaryRole}
                  onChange={(e) => setPrimaryRole(e.target.value as any)}
                  className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-xs text-white focus:outline-none focus:border-amber-500"
                >
                  {selectedRoles.map(r => (
                    <option key={r} value={r}>
                      {r.replace('_', ' ')}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                Key Skills & Specializations (comma separated)
              </label>
              <input
                type="text"
                value={skillsRaw}
                onChange={(e) => setSkillsRaw(e.target.value)}
                placeholder="Specialized skills separated by commas"
                className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-xl font-cinematic font-bold text-xs uppercase tracking-wider bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black shadow-glow-gold transition-all flex items-center justify-center space-x-2"
            >
              <span>{isSubmitting ? 'Dispatching Verification Code...' : 'Send Verification Code & Continue'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        <div className="text-center text-xs text-gray-400">
          Already registered?{' '}
          <Link
            to={isGuestMode ? "/login?mode=guest" : "/login"}
            className={`font-semibold hover:underline ${
              isGuestMode ? 'text-red-400' : 'text-amber-400'
            }`}
          >
            Sign In Here
          </Link>
        </div>
      </div>
    </div>
  );
};
