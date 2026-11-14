import React, { useState, useEffect } from 'react';
import { Download, Smartphone, Monitor, CheckCircle, X, Share, PlusSquare, ArrowRight, Sparkles, HelpCircle } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export const usePWAInstall = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);

  useEffect(() => {
    // Check if running standalone already
    if (window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone) {
      setIsInstalled(true);
    }

    // Check device type
    const ua = window.navigator.userAgent.toLowerCase();
    setIsIOS(/iphone|ipad|ipod/.test(ua));
    setIsAndroid(/android/.test(ua));

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const triggerInstall = async () => {
    if (deferredPrompt) {
      try {
        await deferredPrompt.prompt();
        const choiceResult = await deferredPrompt.userChoice;
        if (choiceResult.outcome === 'accepted') {
          setIsInstalled(true);
        }
        setDeferredPrompt(null);
        return true;
      } catch (err) {
        console.error('PWA install prompt error:', err);
      }
    }
    return false;
  };

  return { deferredPrompt, isInstalled, isIOS, isAndroid, triggerInstall };
};

interface InstallModalProps {
  isOpen: boolean;
  onClose: () => void;
  triggerInstall: () => Promise<boolean>;
  isIOS: boolean;
  isInstalled: boolean;
}

export const InstallAppModal: React.FC<InstallModalProps> = ({
  isOpen,
  onClose,
  triggerInstall,
  isIOS,
  isInstalled
}) => {
  const [showChromeGuide, setShowChromeGuide] = useState(false);
  const [downloadStarted, setDownloadStarted] = useState(false);

  if (!isOpen) return null;

  const handleInstallClick = async () => {
    const success = await triggerInstall();
    if (!success) {
      // If browser doesn't support or hasn't fired beforeinstallprompt, show the manual 1-2 step guide
      setShowChromeGuide(true);
    } else {
      onClose();
    }
  };

  const handleApkDownload = () => {
    setDownloadStarted(true);
    // Programmatic click to ensure reliable download
    const link = document.createElement('a');
    link.href = '/CineVantaara.apk';
    link.download = 'CineVantaara.apk';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => setDownloadStarted(false), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-lg bg-[#0e0e14] border border-amber-500/50 rounded-3xl p-6 sm:p-7 shadow-2xl overflow-hidden text-gray-200">
        
        {/* Glow backdrop */}
        <div className="absolute -top-16 -right-16 w-44 h-44 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white rounded-full hover:bg-white/10 transition z-10"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* App Badge Header */}
        <div className="flex items-center space-x-3.5 mb-5">
          <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-700 p-0.5 shadow-lg shadow-amber-500/25">
            <div className="w-full h-full bg-[#0b0b0e] rounded-[14px] flex items-center justify-center p-1.5">
              <img src="/icon-192.png" alt="CineVantaara Logo" className="w-9 h-9 rounded-xl object-contain" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-cinematic font-bold text-xl text-white">CineVantaara App</h3>
              <span className="text-[10px] bg-amber-500/20 text-amber-300 font-mono font-bold px-2 py-0.5 rounded-full border border-amber-500/40">
                v2.4
              </span>
            </div>
            <p className="text-xs text-amber-400 font-mono mt-0.5">Works on Android, iPhone, Windows & Mac</p>
          </div>
        </div>

        {isInstalled ? (
          <div className="text-center py-6 space-y-3">
            <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto" />
            <h4 className="font-cinematic text-lg font-bold text-white">App is Installed!</h4>
            <p className="text-sm text-gray-400">
              CineVantaara is already running or installed on your device. Launch it anytime directly from your phone's home screen or applications menu!
            </p>
            <button
              onClick={onClose}
              className="mt-2 px-6 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs"
            >
              Continue Browsing
            </button>
          </div>
        ) : isIOS ? (
          /* iOS Safari Guide */
          <div className="space-y-4">
            <p className="text-xs text-gray-300 leading-relaxed">
              Install <span className="text-amber-400 font-bold">CineVantaara</span> on your iPhone or iPad in 3 simple steps:
            </p>
            <div className="space-y-3 bg-white/5 border border-white/10 rounded-2xl p-4 text-xs">
              <div className="flex items-center space-x-3">
                <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center shrink-0">1</span>
                <span>Tap the <strong className="text-white">Share button</strong> (<Share className="w-3.5 h-3.5 inline text-blue-400" />) at the bottom bar of Safari.</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center shrink-0">2</span>
                <span>Scroll down and tap <strong className="text-white">Add to Home Screen</strong> (<PlusSquare className="w-3.5 h-3.5 inline text-amber-400" />).</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center shrink-0">3</span>
                <span>Tap <strong className="text-emerald-400">Add</strong> in the top right. Done!</span>
              </div>
            </div>
            <p className="text-[11px] text-gray-400 text-center font-mono">
              Runs as a standalone full-screen iOS app without browser address bar!
            </p>
          </div>
        ) : (
          /* Android / Google Chrome / Windows / Mac */
          <div className="space-y-4">
            <p className="text-xs text-gray-300 leading-relaxed">
              Choose your preferred installation method for mobile or computer:
            </p>

            {/* Option 1: 1-Tap Browser PWA Install */}
            <div className="p-3.5 rounded-2xl bg-white/5 border border-amber-500/30 hover:border-amber-500/60 transition space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Smartphone className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-bold text-white uppercase font-cinematic tracking-wide">Method 1: Instant App (No Download Wait)</span>
                </div>
                <span className="text-[10px] text-emerald-400 font-mono font-bold">Recommended</span>
              </div>
              <p className="text-[11px] text-gray-300">
                Adds CineVantaara directly to your home screen or desktop with 1 tap. Instant load, zero storage lag.
              </p>
              <button
                onClick={handleInstallClick}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-cinematic font-bold tracking-wider uppercase text-xs shadow-lg shadow-amber-500/25 flex items-center justify-center space-x-2 transition"
              >
                <Download className="w-4 h-4" />
                <span>Tap to Install on This Device</span>
              </button>

              {/* In-Chrome 2-Step Fallback (Displayed when clicked or if prompt needs help) */}
              {showChromeGuide && (
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/40 text-xs space-y-1.5 animate-in fade-in">
                  <div className="font-bold text-amber-300 flex items-center space-x-1.5">
                    <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
                    <span>How to Install in Google Chrome:</span>
                  </div>
                  <ol className="list-decimal list-inside text-[11px] text-gray-200 space-y-1">
                    <li>Tap the <strong className="text-white">3 dots (⋮)</strong> at the top right of your browser.</li>
                    <li>Select <strong className="text-amber-400">"Install app"</strong> or <strong className="text-amber-400">"Add to Home screen"</strong>.</li>
                    <li>Tap <strong className="text-emerald-400">Install</strong>. It will be added immediately!</li>
                  </ol>
                </div>
              )}
            </div>

            {/* Option 2: Direct Android APK File Download */}
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 hover:border-emerald-500/40 transition space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Download className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-bold text-white uppercase font-cinematic tracking-wide">Method 2: Direct Android APK File</span>
                </div>
                <span className="text-[10px] text-amber-300 font-mono font-bold">.apk (24 KB)</span>
              </div>
              <p className="text-[11px] text-gray-300">
                Directly download the signed <code className="text-emerald-400">CineVantaara.apk</code> package to your Android phone's Downloads folder.
              </p>
              <button
                onClick={handleApkDownload}
                className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-emerald-500/20 text-emerald-300 hover:text-white border border-emerald-500/30 font-cinematic font-bold tracking-wider uppercase text-xs flex items-center justify-center space-x-2 transition"
              >
                <Download className="w-4 h-4 text-emerald-400" />
                <span>{downloadStarted ? 'Downloading CineVantaara.apk...' : 'Download Android APK File'}</span>
              </button>
            </div>
          </div>
        )}

        {/* Footer info */}
        <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[10px] text-gray-400 font-mono">
          <span>Supported on all Android & iOS devices</span>
          <span className="text-amber-400 font-bold">100% Free & Secure</span>
        </div>

      </div>
    </div>
  );
};
