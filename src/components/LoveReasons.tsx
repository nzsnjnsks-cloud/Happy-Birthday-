import React, { useState } from 'react';
import { LoveReason } from '../types/index.ts';
import { Heart, Sparkles, Sun, Anchor, Smile, Flame, Gift, Star, Coffee, Feather, Shield, Infinity as InfinityIcon, CheckCircle2 } from 'lucide-react';
import { fireHeartConfetti } from '../utils/confetti.ts';

interface LoveReasonsProps {
  reasons: LoveReason[];
  girlfriendName: string;
  onOpenSettings: () => void;
}

export const LoveReasons: React.FC<LoveReasonsProps> = ({
  reasons,
  girlfriendName,
  onOpenSettings,
}) => {
  const [unlockedMap, setUnlockedMap] = useState<Record<string, boolean>>({
    'reason-1': true,
    'reason-2': true,
  });

  const unlockedCount = reasons.filter((r) => unlockedMap[r.id]).length;
  const isAllUnlocked = unlockedCount === reasons.length;

  const handleToggleReason = (id: string) => {
    const isNowUnlocked = !unlockedMap[id];
    setUnlockedMap((prev) => {
      const next = { ...prev, [id]: isNowUnlocked };
      if (isNowUnlocked) {
        // Fire mini burst
        fireHeartConfetti(0.5, 0.7);
      }
      return next;
    });
  };

  const unlockAll = () => {
    const all: Record<string, boolean> = {};
    reasons.forEach((r) => (all[r.id] = true));
    setUnlockedMap(all);
    fireHeartConfetti(0.5, 0.5);
  };

  const getReasonIcon = (iconType: string) => {
    switch (iconType) {
      case 'sun': return <Sun className="w-5 h-5 text-amber-400" />;
      case 'anchor': return <Anchor className="w-5 h-5 text-sky-400" />;
      case 'smile': return <Smile className="w-5 h-5 text-pink-400" />;
      case 'flame': return <Flame className="w-5 h-5 text-orange-400" />;
      case 'gift': return <Gift className="w-5 h-5 text-emerald-400" />;
      case 'star': return <Star className="w-5 h-5 text-yellow-300" />;
      case 'coffee': return <Coffee className="w-5 h-5 text-amber-200" />;
      case 'feather': return <Feather className="w-5 h-5 text-purple-300" />;
      case 'shield': return <Shield className="w-5 h-5 text-indigo-400" />;
      case 'infinity': return <InfinityIcon className="w-5 h-5 text-rose-400" />;
      default: return <Sparkles className="w-5 h-5 text-rose-400" />;
    }
  };

  return (
    <section id="reasons" className="relative py-20 px-4 sm:px-6 max-w-6xl mx-auto">
      {/* Section Header */}
      <div className="text-center space-y-3 mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-950/40 border border-rose-800/40 text-rose-300 text-xs">
          <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
          <span>Countless Little Things</span>
        </div>
        <h2 className="font-serif text-3xl sm:text-5xl font-bold text-white tracking-tight">
          Reasons Why I Love You
        </h2>
        <p className="text-rose-200/80 text-sm sm:text-base max-w-md mx-auto">
          Out of a million reasons why you make my heart beat faster, here are a few that I hold closest.
        </p>

        {/* Unlock progress indicator */}
        <div className="pt-4 max-w-sm mx-auto space-y-2">
          <div className="flex items-center justify-between text-xs text-rose-300">
            <span>Unlocked {unlockedCount} of {reasons.length} Reasons</span>
            <span>{Math.round((unlockedCount / reasons.length) * 100)}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-rose-950/60 border border-rose-900/30 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-rose-500 via-pink-500 to-amber-400 transition-all duration-500 rounded-full"
              style={{ width: `${(unlockedCount / reasons.length) * 100}%` }}
            />
          </div>

          <div className="flex items-center justify-center gap-4 text-xs pt-2">
            {!isAllUnlocked ? (
              <button
                onClick={unlockAll}
                className="text-rose-400 hover:text-rose-300 font-medium underline"
              >
                Reveal All Reasons ✨
              </button>
            ) : (
              <span className="text-emerald-400 flex items-center gap-1 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>All Reasons Unlocked for {girlfriendName}!</span>
              </span>
            )}
            <span className="text-rose-900">|</span>
            <button
              onClick={onOpenSettings}
              className="text-rose-400 hover:text-rose-300 underline"
            >
              Edit Reasons
            </button>
          </div>
        </div>
      </div>

      {/* Grid of Interactive Heart Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
        {reasons.map((reason, index) => {
          const isUnlocked = !!unlockedMap[reason.id];

          return (
            <button
              key={reason.id}
              type="button"
              onClick={() => handleToggleReason(reason.id)}
              aria-label={isUnlocked ? `Reason ${index + 1}: ${reason.title}` : `Unlock Secret Reason ${index + 1}`}
              className={`group relative text-left rounded-2xl p-6 cursor-pointer border transition-all duration-300 min-h-[170px] flex flex-col justify-between w-full ${
                isUnlocked
                  ? 'bg-gradient-to-br from-[#240e29] to-[#14061a] border-rose-500/40 shadow-[0_0_20px_rgba(244,63,94,0.18)] hover:scale-[1.02]'
                  : 'bg-[#15081b]/70 border-rose-900/30 hover:border-rose-700/50 hover:bg-[#1a0a22]'
              }`}
            >
              {/* Top Row: Index number & icon */}
              <div className="flex items-center justify-between w-full">
                <span className="text-xs font-serif font-bold text-rose-400/80">
                  Reason #{index + 1}
                </span>

                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                    isUnlocked
                      ? 'bg-rose-500/20 text-rose-300 shadow-sm'
                      : 'bg-rose-950/40 text-rose-500/40 group-hover:scale-110'
                  }`}
                >
                  {isUnlocked ? (
                    getReasonIcon(reason.iconType)
                  ) : (
                    <Heart className="w-4 h-4 fill-rose-500/20 text-rose-500/50" />
                  )}
                </div>
              </div>

              {/* Center Content */}
              {isUnlocked ? (
                <div className="my-2 space-y-1.5 animate-in fade-in duration-300">
                  <h3 className="font-serif text-lg font-bold text-rose-100 group-hover:text-white transition-colors">
                    {reason.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-rose-200/80 leading-relaxed font-light">
                    {reason.detail}
                  </p>
                </div>
              ) : (
                <div className="my-auto text-center py-4 space-y-1 w-full">
                  <p className="font-serif text-rose-300/80 text-sm font-semibold group-hover:text-rose-200">
                    Secret Reason #{index + 1}
                  </p>
                  <p className="text-[11px] text-rose-400/60">
                    Tap to open this heart 💌
                  </p>
                </div>
              )}

              {/* Bottom Row Tag */}
              <div className="pt-2 border-t border-rose-900/20 flex items-center justify-between text-[11px] text-rose-400/70 w-full">
                <span>{isUnlocked ? 'Unlocked with love' : 'Tap to reveal'}</span>
                <Heart className={`w-3 h-3 ${isUnlocked ? 'fill-rose-500 text-rose-500' : 'text-rose-800'}`} />
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
};
