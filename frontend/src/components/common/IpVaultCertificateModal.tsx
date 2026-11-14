import React from 'react';
import { ShieldCheck, Download, Printer, X, Film, Lock, Award } from 'lucide-react';
import { CreativeWork } from '../../services/portfolioService';
import { QrCodeSvg } from './QrCodeSvg';

interface IpVaultCertificateModalProps {
  work: CreativeWork | null;
  isOpen: boolean;
  onClose: () => void;
}

export const IpVaultCertificateModal: React.FC<IpVaultCertificateModalProps> = ({
  work,
  isOpen,
  onClose
}) => {
  if (!isOpen || !work) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-2xl rounded-3xl bg-[#0e1017] border-2 border-amber-500/40 p-6 sm:p-10 shadow-[0_0_50px_rgba(245,158,11,0.25)] text-white space-y-6 animate-in fade-in duration-300">
        
        {/* Top actions */}
        <div className="flex items-center justify-between border-b border-amber-500/20 pb-4">
          <div className="flex items-center space-x-2 text-amber-400">
            <Award className="w-5 h-5" />
            <span className="text-xs uppercase font-mono tracking-widest font-bold">
              Official Intellectual Property Vault Certificate
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-gray-400 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Certificate Frame */}
        <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-b from-[#181a24] to-[#0c0d13] border border-amber-500/30 text-center space-y-5 relative overflow-hidden">
          {/* Watermark */}
          <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none">
            <Film className="w-96 h-96" />
          </div>

          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 p-0.5 shadow-glow-gold">
              <div className="w-full h-full bg-[#0e1017] rounded-2xl flex items-center justify-center text-amber-400">
                <ShieldCheck className="w-8 h-8" />
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl font-cinematic font-bold tracking-widest text-amber-300 uppercase">
              CineVantaara Creative IP Registry
            </h2>
            <p className="text-xs text-gray-400 uppercase tracking-widest font-mono mt-1">
              Decentralized Cryptographic Timestamp & Proof of Authorship
            </p>
          </div>

          <div className="py-2 border-y border-white/10 space-y-2 text-left text-xs">
            <div className="flex justify-between">
              <span className="text-gray-400">Title of Work:</span>
              <span className="font-bold text-white text-sm">{work.title}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Creator / Author:</span>
              <span className="font-bold text-amber-300">{work.userName} ({work.userRole})</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Craft Classification:</span>
              <span className="font-mono text-gray-200">{work.craftType}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Registration Timestamp:</span>
              <span className="font-mono text-emerald-400">{work.registeredAt}</span>
            </div>
          </div>

          {/* Cryptographic SHA-256 Hash */}
          <div className="p-3 rounded-xl bg-black/60 border border-white/10 text-left space-y-1">
            <div className="flex items-center space-x-1.5 text-[10px] uppercase font-mono text-gray-400">
              <Lock className="w-3 h-3 text-amber-400" />
              <span>Cryptographic Proof Hash (SHA-256 Digest)</span>
            </div>
            <div className="font-mono text-[11px] text-amber-200 break-all select-all">
              {work.sha256Hash}
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="text-left text-[11px] text-gray-400">
              <div>Protected by CineVantaara Zero-Backdoor Protocol</div>
              <div className="text-[10px] text-gray-500 font-mono">Certificate ID: {work.id}</div>
            </div>
            <div className="p-1 rounded-lg bg-white/10">
              <QrCodeSvg value={`CINEVANTAARA-IP-VAULT:${work.id}:${work.sha256Hash}`} size={64} />
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs text-gray-400 hover:text-white transition-colors"
          >
            Close
          </button>
          <button
            onClick={handlePrint}
            className="px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black flex items-center space-x-2 shadow-glow-gold"
          >
            <Printer className="w-4 h-4" />
            <span>Print / Save Certificate</span>
          </button>
        </div>

      </div>
    </div>
  );
};
