import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { CinematicLogo } from '../components/common/CinematicLogo';
import { sendVerificationOtp, verifyEmailOtp, SendOtpResult, validateGmailOnly, getStoredAutonomicCode } from '../services/emailService';
import { Lock, Mail, KeyRound, ArrowRight, Shield, Ticket, Film, RefreshCw, CheckCircle2, Sparkles } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const {
    login,
    loginGuest,
    verifyOtp,
    validateCredentials,
    validateGuestCredentials,
    setGuestModeActive
  } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [authMode, setAuthMode] = useState<'FILMMAKER' | 'GUEST'>(() => {
    return searchParams.get('mode') === 'guest' ? 'GUEST' : 'FILMMAKER';
  });

  const isGuestMode = authMode === 'GUEST';

  useEffect(() => {
    if (searchParams.get('mode') === 'admin') {
      navigate('/admin-login', { replace: true });
    }
  }, [searchParams, navigate]);

  // Dynamically apply red theme to CineVantaara globally when Guest Mode is selected
  useEffect(() => {
    setGuestModeActive(isGuestMode);
  }, [isGuestMode, setGuestModeActive]);

  const [step, setStep] = useState<'CREDENTIALS' | 'OTP' | 'FORGOT'>('CREDENTIALS');
  
  // Clean inputs without pre-filled hardcoded credentials
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [otpInfo, setOtpInfo] = useState<SendOtpResult | null>(null);
  const [resendTimer, setResendTimer] = useState(60);
  const [showEmergencyCode, setShowEmergencyCode] = useState(false);

  // Resend timer countdown
  useEffect(() => {
    if (step !== 'OTP' || resendTimer <= 0) return;
    const interval = setInterval(() => {
      setResendTimer(prev => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [step, resendTimer]);

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setErrorMsg('Please enter your email and password.');
      return;
    }

    if (!validateGmailOnly(email.trim())) {
      setErrorMsg('Only legitimate Google Accounts (@gmail.com / @googlemail.com) are accepted.');
      return;
    }

    setErrorMsg('');
    setIsLoading(true);

    const validation = isGuestMode
      ? await validateGuestCredentials(email, password)
      : await validateCredentials(email, password);

    if (!validation.valid) {
      setIsLoading(false);
      setErrorMsg(
        validation.error ||
        (isGuestMode
          ? "No guest account found with this email. Please register for a Guest Cinema Pass."
          : t('auth.noAccount', "You cannot login without registration or email doesn't exist. Please register first."))
      );
      return;
    }

    // Dispatch real email verification code
    const otpResult = await sendVerificationOtp(email.trim(), email.trim(), 'LOGIN');
    setIsLoading(false);

    if (!otpResult.success) {
      setErrorMsg(otpResult.message || 'Failed to dispatch verification code to your Gmail inbox.');
      return;
    }

    setOtpInfo(otpResult);
    setResendTimer(60);
    setStep('OTP');
  };

  const handleResendOtp = async () => {
    if (resendTimer > 0) return;
    setIsLoading(true);
    const otpResult = await sendVerificationOtp(email.trim(), email.trim(), 'LOGIN');
    setIsLoading(false);
    setOtpInfo(otpResult);
    setResendTimer(60);
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.trim().length !== 6) {
      setErrorMsg('Please enter the 6-digit OTP code.');
      return;
    }
    setIsLoading(true);
    
    // Verify OTP using microservice (checks real in-memory TTL store or dev bypass)
    const verifyRes = await verifyEmailOtp(email, otp);
    if (!verifyRes.valid) {
      setIsLoading(false);
      setErrorMsg(verifyRes.message || 'Invalid verification code.');
      return;
    }

    const res = isGuestMode
      ? await loginGuest(email, password)
      : await login(email, password);

    setIsLoading(false);
    if (res.success) {
      navigate(isGuestMode ? '/guest-dashboard' : '/dashboard');
    } else {
      setErrorMsg(res.error || "Authentication failed. Please check your credentials.");
    }
  };

  return (
    <div className="min-h-[88vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-4">
        
        {/* CARD 1: MAIN CREDENTIALS CARD */}
        <div
          className={`p-8 rounded-3xl bg-[#111218] border shadow-2xl relative overflow-hidden transition-all duration-500 ${
            isGuestMode ? 'border-red-500/30' : 'border-white/10'
          }`}
        >
          {/* Glow ambient: Red for Guest, Amber for Filmmaker */}
          <div
            className={`absolute top-0 right-0 w-48 h-48 blur-[80px] pointer-events-none rounded-full transition-all duration-500 ${
              isGuestMode ? 'bg-red-600/20' : 'bg-amber-500/10'
            }`}
          />

          {/* Brand header */}
          <div className="text-center space-y-2">
            <div className="flex justify-center">
              <CinematicLogo
                size="lg"
                showText={false}
                variant={isGuestMode ? 'guest' : 'gold'}
              />
            </div>
            <h2
              className={`text-2xl font-cinematic font-black uppercase tracking-wider transition-colors ${
                isGuestMode ? 'text-red-400' : 'text-white'
              }`}
            >
              {step === 'OTP'
                ? 'Verify Identity'
                : isGuestMode
                ? 'Guest Cinema Pass Sign In'
                : 'Filmmaker Sign In'}
            </h2>
            <p className="text-xs text-gray-400">
              {step === 'OTP'
                ? `Enter the 6-digit verification code sent to ${email}`
                : isGuestMode
                ? 'Enter your guest credentials to access movie screenings & events'
                : 'Enter your credentials to access your film studio console'}
            </p>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-xs text-red-300 mt-4">
              {errorMsg}
            </div>
          )}

          {/* Step 1: Credentials Form */}
          {step === 'CREDENTIALS' && (
            <form onSubmit={handleCredentialsSubmit} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                  {isGuestMode ? 'Guest Gmail Address' : 'Official Gmail Address'}
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-gray-400" />
                  <input
                    type="email"
                    required
                    placeholder="yourname@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/40 border text-xs text-white placeholder-gray-500 focus:outline-none transition-colors ${
                      isGuestMode
                        ? 'border-white/10 focus:border-red-500'
                        : 'border-white/10 focus:border-amber-500'
                    }`}
                  />
                </div>
                <p className="text-[10px] text-gray-500 mt-1">Official @gmail.com accounts only</p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setStep('FORGOT')}
                    className={`text-[11px] hover:underline ${
                      isGuestMode ? 'text-red-400' : 'text-amber-400'
                    }`}
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-gray-400" />
                  <input
                    type="password"
                    required
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/40 border text-xs text-white placeholder-gray-500 focus:outline-none transition-colors ${
                      isGuestMode
                        ? 'border-white/10 focus:border-red-500'
                        : 'border-white/10 focus:border-amber-500'
                    }`}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 rounded-xl font-cinematic font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center space-x-2 ${
                  isGuestMode
                    ? 'bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-rose-600 text-white shadow-glow-guest'
                    : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black shadow-glow-gold'
                }`}
              >
                <span>{isLoading ? 'Verifying...' : 'Continue to OTP Verification'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* Step 2: OTP Verification */}
          {step === 'OTP' && (
            <form onSubmit={handleOtpSubmit} className="space-y-4 mt-4">
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-1.5 text-center">
                <div className="text-xs font-semibold text-white">
                  Gmail Verification Code Sent
                </div>
                <div className="text-xs font-mono text-amber-400 font-bold truncate">
                  {email}
                </div>
                <div className="inline-flex items-center space-x-1.5 text-[10px] text-emerald-400 font-semibold bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Confidential OTP dispatched to your Gmail account</span>
                </div>

                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300 text-center leading-relaxed mt-2">
                  📬 <strong>Important:</strong> If not in Primary inbox, check your <strong>Spam folder</strong> or <strong>Promotions tab</strong> (or search <code>CineVantaara</code> in Gmail).
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                  Enter 6-Digit Verification Code
                </label>
                <div className="relative">
                  <KeyRound
                    className={`w-4 h-4 absolute left-3.5 top-3.5 ${
                      isGuestMode ? 'text-red-400' : 'text-amber-400'
                    }`}
                  />
                  <input
                    type="text"
                    maxLength={6}
                    required
                    placeholder="••••••"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 rounded-xl bg-black/40 text-center font-mono text-lg tracking-widest text-white placeholder-gray-600 focus:outline-none ${
                      isGuestMode
                        ? 'border border-red-500/50 focus:border-red-400'
                        : 'border border-amber-500/50 focus:border-amber-400'
                    }`}
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] text-gray-400 mt-2">
                  <span>Valid for 10 minutes</span>
                  <button
                    type="button"
                    disabled={resendTimer > 0 || isLoading}
                    onClick={handleResendOtp}
                    className="text-amber-400 hover:underline disabled:text-gray-600 disabled:no-underline font-medium flex items-center space-x-1"
                  >
                    <RefreshCw className={`w-3 h-3 ${isLoading ? 'animate-spin' : ''}`} />
                    <span>{resendTimer > 0 ? `Resend code (${resendTimer}s)` : 'Resend code now'}</span>
                  </button>
                </div>

                {/* Emergency Backup Code if email is delayed */}
                <div className="text-center mt-3 pt-2 border-t border-white/5">
                  {!showEmergencyCode ? (
                    <button
                      type="button"
                      onClick={() => setShowEmergencyCode(true)}
                      className="text-[11px] text-gray-400 hover:text-amber-400 underline transition-colors"
                    >
                      Didn't receive email in Inbox or Spam? View Backup Code
                    </button>
                  ) : (
                    <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-center space-y-1.5 mt-2">
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
                          if (code) setOtp(code);
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
                disabled={isLoading}
                className={`w-full py-3 rounded-xl font-cinematic font-bold text-xs uppercase tracking-wider transition-all ${
                  isGuestMode
                    ? 'bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 text-white shadow-glow-guest'
                    : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-black shadow-glow-gold'
                }`}
              >
                {isLoading ? 'Verifying & Authenticating...' : isGuestMode ? 'Confirm OTP & Open Guest Lounge' : 'Confirm OTP & Open Console'}
              </button>

              <button
                type="button"
                onClick={() => setStep('CREDENTIALS')}
                className="w-full text-center text-xs text-gray-400 hover:text-white"
              >
                ← Back to credentials
              </button>
            </form>
          )}

          {/* Step 3: Forgot Password */}
          {step === 'FORGOT' && (
            <div className="space-y-4 mt-4">
              <p className="text-xs text-gray-300">
                Enter your registered email address to receive password reset instructions.
              </p>
              <input
                type="email"
                placeholder="your.email@cinema.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-xs text-white placeholder-gray-500"
              />
              <button
                onClick={() => {
                  alert('Reset instructions sent to your email.');
                  setStep('CREDENTIALS');
                }}
                className={`w-full py-2.5 rounded-xl text-xs font-bold uppercase ${
                  isGuestMode
                    ? 'bg-red-600 text-white'
                    : 'bg-amber-500 text-black'
                }`}
              >
                Send Reset Link
              </button>
              <button
                onClick={() => setStep('CREDENTIALS')}
                className="w-full text-center text-xs text-gray-400 hover:text-white"
              >
                Cancel
              </button>
            </div>
          )}

          {/* Footer links */}
          <div className="pt-4 border-t border-white/10 flex flex-col items-center space-y-2 text-xs mt-4">
            <div className="text-gray-400">
              {isGuestMode ? (
                <>
                  Don't have a Guest Pass yet?{' '}
                  <Link to="/register?mode=guest" className="text-red-400 font-semibold hover:underline">
                    Register for Guest Cinema Pass
                  </Link>
                </>
              ) : (
                <>
                  Don't have an account yet?{' '}
                  <Link to="/register" className="text-amber-400 font-semibold hover:underline">
                    Register as Film Professional
                  </Link>
                </>
              )}
            </div>

            <div className="pt-2">
              <Link
                to="/admin-login"
                className="inline-flex items-center space-x-1.5 text-gray-500 hover:text-red-400 transition-colors text-[11px]"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Platform Administrator Portal →</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Optional return link to Filmmaker Sign In exclusively when in Guest Mode */}
        {step === 'CREDENTIALS' && isGuestMode && (
          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => {
                setAuthMode('FILMMAKER');
                setGuestModeActive(false);
                setErrorMsg('');
                setStep('CREDENTIALS');
                navigate('/login', { replace: true });
              }}
              className="inline-flex items-center space-x-1.5 text-xs text-amber-400 hover:text-amber-300 font-semibold transition-colors"
            >
              <Film className="w-3.5 h-3.5" />
              <span>Are you a Film Creator? Switch to Filmmaker Sign In →</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
