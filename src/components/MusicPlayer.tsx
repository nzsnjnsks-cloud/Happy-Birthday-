import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX, Music, Upload, ChevronUp, ChevronDown, Disc } from 'lucide-react';
import { musicPlayer, ROMANTIC_SONG_PRESETS } from '../utils/audioSynth.ts';

interface MusicPlayerProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
  customTrackName?: string;
  onSetCustomTrackName?: (name: string) => void;
}

export const MusicPlayer: React.FC<MusicPlayerProps> = ({
  isPlaying,
  onTogglePlay,
  customTrackName,
  onSetCustomTrackName,
}) => {
  const [volume, setVolume] = useState(0.65);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(240);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activePresetId, setActivePresetId] = useState(ROMANTIC_SONG_PRESETS[0].id);
  const audioInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    musicPlayer.setListener((state) => {
      setCurrentTime(state.currentTime);
      setDuration(state.duration);
      setActivePresetId(state.presetId);
    });
  }, []);

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    setIsMuted(val === 0);
    musicPlayer.setVolume(val);
  };

  const handleToggleMute = () => {
    if (isMuted) {
      setIsMuted(false);
      musicPlayer.setVolume(volume || 0.65);
    } else {
      setIsMuted(true);
      musicPlayer.setVolume(0);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setCurrentTime(val);
    musicPlayer.seek(val);
  };

  const handleSelectPreset = (presetId: string) => {
    musicPlayer.setPreset(presetId);
    setActivePresetId(presetId);
    if (onSetCustomTrackName) {
      const preset = ROMANTIC_SONG_PRESETS.find((p) => p.id === presetId);
      if (preset) {
        onSetCustomTrackName(preset.name);
      }
    }
  };

  const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      musicPlayer.loadCustomAudio(file);
      const name = file.name.replace(/\.[^/.]+$/, '');
      if (onSetCustomTrackName) {
        onSetCustomTrackName(name);
      }
      musicPlayer.play();
      if (!isPlaying) {
        onTogglePlay();
      }
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const currentSongName =
    customTrackName ||
    ROMANTIC_SONG_PRESETS.find((p) => p.id === activePresetId)?.name ||
    'Golden Hour Romance (Piano & Strings)';

  return (
    <div className="fixed bottom-4 right-4 z-40 max-w-sm w-[calc(100vw-2rem)] sm:w-88">
      <input
        type="file"
        ref={audioInputRef}
        onChange={handleAudioUpload}
        accept="audio/*"
        className="hidden"
        aria-label="Upload custom romantic audio file"
      />

      <div className="rounded-2xl bg-[#14081c]/95 backdrop-blur-md border border-rose-900/50 p-3.5 shadow-[0_10px_35px_rgba(0,0,0,0.7)] text-rose-100 transition-all duration-300">
        {/* Header / Collapse Toggle */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2.5 overflow-hidden">
            {/* Spinning Vinyl / Music Icon */}
            <div
              className={`p-2 rounded-xl transition-all ${
                isPlaying
                  ? 'bg-gradient-to-tr from-rose-600 to-pink-500 text-white shadow-[0_0_12px_rgba(244,63,94,0.5)]'
                  : 'bg-rose-950/40 text-rose-500/50'
              }`}
            >
              <Disc className={`w-4 h-4 ${isPlaying ? 'animate-spin' : ''}`} style={{ animationDuration: '4s' }} />
            </div>

            <div className="overflow-hidden">
              <p className="text-xs font-semibold text-rose-100 truncate">
                {currentSongName}
              </p>
              {/* Equalizer animation bars */}
              <div className="flex items-center gap-1 mt-0.5">
                {isPlaying ? (
                  <div className="flex items-end gap-0.5 h-2.5">
                    <span className="w-0.5 bg-rose-400 rounded-full animate-pulse h-2" style={{ animationDuration: '0.6s' }} />
                    <span className="w-0.5 bg-pink-400 rounded-full animate-pulse h-3" style={{ animationDuration: '0.4s' }} />
                    <span className="w-0.5 bg-amber-400 rounded-full animate-pulse h-1.5" style={{ animationDuration: '0.7s' }} />
                    <span className="w-0.5 bg-rose-300 rounded-full animate-pulse h-2.5" style={{ animationDuration: '0.5s' }} />
                    <span className="text-[10px] text-rose-300 ml-1">Fluent Romance Playing</span>
                  </div>
                ) : (
                  <p className="text-[10px] text-rose-400/70 truncate">
                    Paused · Tap play to hear the song
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => audioInputRef.current?.click()}
              aria-label="Upload our song"
              className="p-1.5 rounded-lg text-rose-400 hover:text-rose-200 hover:bg-rose-900/30 transition-colors"
              title="Upload your own song MP3"
            >
              <Upload className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              aria-label={isCollapsed ? 'Expand music player' : 'Collapse music player'}
              className="p-1.5 rounded-lg text-rose-400 hover:text-rose-200 hover:bg-rose-900/30 transition-colors"
            >
              {isCollapsed ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Expanded Controls */}
        {!isCollapsed && (
          <div className="space-y-2.5 pt-1.5 border-t border-rose-900/30">
            {/* Song Track Preset Selector */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-none">
              {ROMANTIC_SONG_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => handleSelectPreset(preset.id)}
                  className={`px-2 py-1 rounded-md text-[10px] whitespace-nowrap font-medium transition-all ${
                    activePresetId === preset.id
                      ? 'bg-rose-600/30 border border-rose-500/50 text-rose-200 shadow-sm'
                      : 'bg-rose-950/30 border border-rose-900/30 text-rose-400/70 hover:text-rose-200'
                  }`}
                >
                  {preset.name.split(' (')[0]}
                </button>
              ))}
            </div>

            {/* Progress Bar & Timestamps */}
            <div>
              <input
                type="range"
                min="0"
                max={duration || 240}
                value={currentTime}
                onChange={handleSeek}
                className="w-full h-1 bg-rose-950 rounded-lg appearance-none cursor-pointer accent-rose-500"
                aria-label="Audio playback seek bar"
              />
              <div className="flex justify-between text-[10px] text-rose-400/60 mt-0.5">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Play/Pause & Volume Row */}
            <div className="flex items-center justify-between gap-3 pt-0.5">
              <button
                onClick={onTogglePlay}
                aria-label={isPlaying ? 'Pause music' : 'Play music'}
                className="w-9 h-9 rounded-full bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white flex items-center justify-center shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer shrink-0"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
              </button>

              {/* Volume Slider */}
              <div className="flex items-center gap-1.5 flex-1 max-w-[130px]">
                <button
                  onClick={handleToggleMute}
                  aria-label={isMuted ? 'Unmute' : 'Mute'}
                  className="text-rose-400 hover:text-rose-200"
                >
                  {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-full h-1 bg-rose-950 rounded-lg appearance-none cursor-pointer accent-rose-500"
                  aria-label="Volume slider"
                />
              </div>

              {/* Upload Custom Audio File */}
              <button
                onClick={() => audioInputRef.current?.click()}
                className="text-[11px] text-rose-300 underline hover:text-white shrink-0 flex items-center gap-1"
              >
                <Upload className="w-3 h-3" />
                <span>Upload Song</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
