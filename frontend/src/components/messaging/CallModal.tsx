import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Video, VideoOff, PhoneOff, Monitor, Maximize2, Sparkles, Volume2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface CallModalProps {
  isOpen: boolean;
  isVideoCall: boolean;
  participantName: string;
  participantAvatar?: string;
  onEndCall: () => void;
}

export const CallModal: React.FC<CallModalProps> = ({
  isOpen,
  isVideoCall,
  participantName,
  participantAvatar,
  onEndCall
}) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(!isVideoCall);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [callStatus, setCallStatus] = useState<'CONNECTING' | 'CONNECTED'>('CONNECTING');
  const localVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!isOpen) {
      setCallDuration(0);
      setCallStatus('CONNECTING');
      return;
    }

    // Connect handshake
    const connectTimer = setTimeout(() => {
      setCallStatus('CONNECTED');
    }, 1200);

    // Call duration timer
    const interval = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);

    // Try starting local camera preview if browser permits
    if (isVideoCall && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then(stream => {
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = stream;
          }
        })
        .catch(err => {
          console.log("WebRTC camera preview fallback active", err);
        });
    }

    return () => {
      clearTimeout(connectTimer);
      clearInterval(interval);
      if (localVideoRef.current && localVideoRef.current.srcObject) {
        const stream = localVideoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(t => t.stop());
      }
    };
  }, [isOpen, isVideoCall]);

  if (!isOpen) return null;

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl">
      <div className="relative w-full max-w-4xl h-[80vh] rounded-3xl bg-[#090a0f] border border-white/15 shadow-2xl flex flex-col justify-between overflow-hidden">
        
        {/* Top Bar */}
        <div className="p-4 sm:p-6 flex items-center justify-between z-10 bg-gradient-to-b from-black/80 to-transparent">
          <div className="flex items-center space-x-3">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <div>
              <div className="text-sm font-cinematic font-bold text-white flex items-center space-x-2">
                <span>{participantName}</span>
                <span className="text-xs text-amber-400 font-sans font-normal uppercase px-2 py-0.5 rounded-full bg-white/5 border border-white/10">
                  {callStatus === 'CONNECTED' ? 'WebRTC P2P Live' : 'Establishing Handshake...'}
                </span>
              </div>
              <div className="text-xs text-gray-400 font-mono">
                {callStatus === 'CONNECTED' ? formatTime(callDuration) : 'Signaling candidate...'}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
              E2E Encrypted WebRTC
            </span>
          </div>
        </div>

        {/* Center Stage: Video / Audio Stream */}
        <div className="flex-1 relative flex items-center justify-center overflow-hidden">
          {isVideoCall && !isVideoOff ? (
            <div className="w-full h-full relative bg-zinc-950">
              {/* Remote Stream Simulation (Hollywood Table Read / Casting Scene) */}
              <img
                src="https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1200&q=80"
                alt="Remote video feed"
                className="w-full h-full object-cover filter contrast-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

              {/* Local PiP Video Box */}
              <div className="absolute bottom-6 right-6 w-36 sm:w-48 h-24 sm:h-32 rounded-2xl bg-black border-2 border-amber-500/60 overflow-hidden shadow-2xl z-20">
                <video
                  ref={localVideoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover mirror"
                />
                <div className="absolute bottom-1 left-2 text-[9px] font-bold text-white/80 bg-black/60 px-1.5 py-0.5 rounded">
                  You (Local)
                </div>
              </div>
            </div>
          ) : (
            // Audio-only visualizer with sound waves
            <div className="flex flex-col items-center space-y-6">
              <div className="relative">
                <motion.div
                  animate={{ scale: [1, 1.15, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="w-32 h-32 rounded-full border border-amber-500/30 flex items-center justify-center bg-amber-500/10 shadow-glow-gold"
                >
                  <img
                    src={participantAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
                    alt={participantName}
                    className="w-24 h-24 rounded-full object-cover border-2 border-amber-400"
                  />
                </motion.div>
              </div>

              {/* Animated Sound Wave Bars */}
              <div className="flex items-center space-x-1.5 h-10">
                {[12, 24, 38, 20, 42, 16, 30, 48, 22, 14].map((h, i) => (
                  <motion.div
                    key={i}
                    animate={{ height: [h * 0.4, h, h * 0.4] }}
                    transition={{ repeat: Infinity, duration: 0.8 + (i % 3) * 0.2 }}
                    className="w-1.5 bg-gradient-to-t from-amber-500 to-amber-300 rounded-full"
                  />
                ))}
              </div>
              <p className="text-xs font-mono text-gray-400 tracking-wider">
                HD Audio Stream Active (Opus 48kHz)
              </p>
            </div>
          )}
        </div>

        {/* Bottom Control Dock */}
        <div className="p-6 bg-gradient-to-t from-black via-black/80 to-transparent flex items-center justify-center space-x-4 z-10">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className={`p-4 rounded-full border transition-all ${
              isMuted
                ? 'bg-red-500/20 text-red-400 border-red-500/40'
                : 'bg-white/10 text-white border-white/20 hover:bg-white/20'
            }`}
            title={isMuted ? 'Unmute Mic' : 'Mute Mic'}
          >
            {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          <button
            onClick={() => setIsVideoOff(!isVideoOff)}
            className={`p-4 rounded-full border transition-all ${
              isVideoOff
                ? 'bg-red-500/20 text-red-400 border-red-500/40'
                : 'bg-white/10 text-white border-white/20 hover:bg-white/20'
            }`}
            title={isVideoOff ? 'Enable Camera' : 'Disable Camera'}
          >
            {isVideoOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
          </button>

          <button
            onClick={() => setIsScreenSharing(!isScreenSharing)}
            className={`p-4 rounded-full border transition-all ${
              isScreenSharing
                ? 'bg-amber-500 text-black border-amber-500'
                : 'bg-white/10 text-white border-white/20 hover:bg-white/20'
            }`}
            title="Screen Share / Script Read"
          >
            <Monitor className="w-5 h-5" />
          </button>

          {/* End Call Button */}
          <button
            onClick={onEndCall}
            className="p-4 rounded-full bg-red-600 hover:bg-red-500 text-white shadow-lg transition-transform hover:scale-105"
            title="End Call"
          >
            <PhoneOff className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
