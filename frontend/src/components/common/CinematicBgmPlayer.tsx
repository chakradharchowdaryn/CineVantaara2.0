import React from 'react';
import { useBgm } from '../../context/BgmContext';
import { Volume2, VolumeX, Music, Settings } from 'lucide-react';

export const CinematicBgmPlayer: React.FC = () => {
  const { isBgmEnabled, toggleBgm, openSettings, currentTrack } = useBgm();

  return (
    <div className="fixed bottom-4 left-4 z-40 flex items-center space-x-2">
      <div className="flex items-center space-x-2 px-3 py-1.5 rounded-2xl bg-black/80 backdrop-blur-md border border-white/10 shadow-2xl text-xs">
        <div className="w-6 h-6 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
          <Music className={`w-3.5 h-3.5 ${isBgmEnabled ? 'text-amber-400' : 'text-gray-500'}`} />
        </div>

        <div className="truncate max-w-[170px] sm:max-w-[240px]">
          <div className="text-[10px] font-mono text-amber-300 font-bold truncate">
            {currentTrack.anime}
          </div>
          <div className="text-[11px] text-gray-300 truncate">
            {currentTrack.title.split('—')[0]}
          </div>
        </div>

        <button
          onClick={() => toggleBgm(!isBgmEnabled)}
          title={isBgmEnabled ? 'Mute Soundtrack' : 'Unmute Soundtrack'}
          className={`p-1.5 rounded-lg border transition-all ${
            isBgmEnabled
              ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
              : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
          }`}
        >
          {isBgmEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
        </button>

        <button
          onClick={openSettings}
          title="Audio & Motion Settings"
          className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white transition-all"
        >
          <Settings className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
