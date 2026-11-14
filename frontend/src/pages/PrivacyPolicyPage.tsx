import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { Shield, Lock, EyeOff, Trash2, ArrowLeft, KeyRound } from 'lucide-react';
import { Link } from 'react-router-dom';

export const PrivacyPolicyPage: React.FC = () => {
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
              PHASE 11 • CONFIDENTIALITY CHARTER
            </span>
            <span className="text-xs text-gray-400 font-mono">Zero Backdoor E2EE</span>
          </div>
          <h1 className="text-3xl font-black font-cinematic uppercase tracking-wide text-white">
            Privacy Policy & Zero-Knowledge Architecture
          </h1>
          <p className="text-xs text-gray-400">
            Last updated: November 2026 • Cryptographic Web Crypto API Standard
          </p>
        </div>

        <div className="space-y-6 text-xs sm:text-sm text-gray-300 leading-relaxed border-t border-white/10 pt-6">
          <section className="space-y-2">
            <h2 className="text-base font-bold text-white font-cinematic uppercase flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-amber-400" />
              <span>1. Client-Side End-to-End Encryption (E2EE)</span>
            </h2>
            <p>
              Private communications between directors, actors, screenwriters, and producers are encrypted client-side using the native Web Crypto API (<code className="text-amber-300">window.crypto.subtle</code> AES-GCM 256-bit). Private conversation keys remain exclusively on creator devices. No platform administrator or database administrator can decrypt conversation contents.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-white font-cinematic uppercase flex items-center gap-2">
              <EyeOff className="w-4 h-4 text-emerald-400" />
              <span>2. Salted Password Vault</span>
            </h2>
            <p>
              User authentication employs cryptographic salted SHA-256 password hashing. Plaintext passwords are never transmitted across the network or stored in databases.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-white font-cinematic uppercase flex items-center gap-2">
              <Shield className="w-4 h-4 text-sky-400" />
              <span>3. Email Verification Confidentiality</span>
            </h2>
            <p>
              6-digit OTP verification codes dispatched for Gmail authentication are verified server-side and never returned in API payloads or client-side telemetry logs.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-white font-cinematic uppercase flex items-center gap-2">
              <Trash2 className="w-4 h-4 text-rose-400" />
              <span>4. Right to Erasure & Account Deletion</span>
            </h2>
            <p>
              Users retain full autonomy to permanently delete their portfolio, messages, and account credentials through profile settings. Citadel Super Administrators also offer permanent telemetry purging upon creator request.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
