import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth, ADMIN_ACCOUNTS } from '../context/AuthContext';
import { CinematicLogo } from '../components/common/CinematicLogo';
import { ShieldAlert, Lock, Mail, ArrowRight, EyeOff, ShieldCheck, KeyRound } from 'lucide-react';

export const AdminLoginPage: React.FC = () => {
  const { adminLogin } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setErrorMsg('Please enter administrator email and security key.');
      return;
    }

    setErrorMsg('');
    setIsLoading(true);

    const result = await adminLogin(email, password);
    setIsLoading(false);

    if (result.success) {
      navigate('/admin');
    } else {
      setErrorMsg(result.error || 'Access denied. Invalid credentials.');
    }
  };

  const selectAdminAccount = (idx: number) => {
    const acc = ADMIN_ACCOUNTS[idx];
    if (acc) {
      setEmail(acc.email);
      setPassword(''); // Strict rule: passwords are never filled automatically; admin must enter manually
      setErrorMsg('');
    }
  };

  return (
    <div className="min-h-[88vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6 p-8 rounded-3xl bg-[#0f0709] border border-red-500/30 shadow-[0_0_50px_rgba(239,68,68,0.15)] relative overflow-hidden">
        
        {/* Glow ambient */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/15 blur-[90px] pointer-events-none rounded-full" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-amber-600/10 blur-[80px] pointer-events-none rounded-full" />

        {/* Security badge top */}
        <div className="flex items-center justify-center space-x-2 p-1.5 rounded-full bg-red-500/10 border border-red-500/30 text-[11px] font-mono text-red-300">
          <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
          <span>Restricted Portal • Authorized Administrators Only</span>
        </div>

        {/* Brand header */}
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <CinematicLogo size="lg" showText={false} />
          </div>
          <h2 className="text-2xl font-cinematic font-black text-white uppercase tracking-wider">
            Citadel Security Gateway
          </h2>
          <p className="text-xs text-gray-400 max-w-sm mx-auto">
            Platform governance and audit clearance. Enter administrator credentials to proceed.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-red-500/20 border border-red-500/40 text-xs text-red-200 font-mono leading-relaxed">
            ⚠️ {errorMsg}
          </div>
        )}

        {/* Credentials Form */}
        <form onSubmit={handleAdminSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
              Administrator Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-gray-400" />
              <input
                type="email"
                required
                placeholder="admin@cinevantaara.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/60 border border-red-500/30 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-red-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
              Security Key / Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-gray-400" />
              <input
                type="password"
                required
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/60 border border-red-500/30 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-red-400"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-xl font-cinematic font-bold text-xs uppercase tracking-wider bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white shadow-[0_0_20px_rgba(239,68,68,0.4)] transition-all flex items-center justify-center space-x-2"
          >
            <span>{isLoading ? 'Verifying Citadel Security...' : 'Authorize & Enter Citadel'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Quick Administrator Account Selection (For verified admins) */}
        <div className="pt-4 border-t border-white/10 space-y-2">
          <div className="text-[11px] font-mono text-gray-400 uppercase tracking-wider flex items-center justify-between">
            <span>Verified Admin Keyrings:</span>
            <span className="text-red-400 font-bold">Manual Key Entry Required</span>
          </div>
          <p className="text-[10px] text-gray-500">
            Click to fill email address. Passwords are never auto-populated and must be typed in manually.
          </p>
          <div className="grid grid-cols-2 gap-2">
            {ADMIN_ACCOUNTS.map((acc, idx) => (
              <button
                key={acc.email}
                type="button"
                onClick={() => selectAdminAccount(idx)}
                className="p-2 rounded-xl bg-black/40 border border-white/5 hover:border-red-500/40 text-left transition-all"
                title="Select email (password must be entered manually)"
              >
                <div className="text-[11px] font-bold text-white truncate">{acc.name}</div>
                <div className="text-[9px] text-gray-400 truncate">{acc.email}</div>
                <div className="text-[9px] text-red-300 font-mono mt-0.5">{acc.role.replace('_', ' ')}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Security Disclaimers */}
        <div className="p-3 rounded-2xl bg-black/40 border border-white/5 text-[10px] text-gray-400 space-y-1">
          <div className="flex items-center space-x-1.5 text-gray-300 font-bold">
            <EyeOff className="w-3.5 h-3.5 text-emerald-400" />
            <span>Chat Privacy Notice:</span>
          </div>
          <div>Admins have complete operational governance across opportunities, users, and audit logs, but zero access to creators' private client-side encrypted conversations.</div>
        </div>

        <div className="text-center text-xs text-gray-500 pt-2">
          Are you a creator or studio?{' '}
          <Link to="/login" className="text-amber-400 hover:underline">
            Filmmaker Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};
