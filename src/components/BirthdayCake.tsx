import React, { useState } from 'react';
import { Sparkles, Flame, RotateCcw } from 'lucide-react';
import { fireCelebrationFireworks, fireHeartConfetti } from '../utils/confetti.ts';

interface BirthdayCakeProps {
  wishMessage: string;
  cakeFlavor: string;
  girlfriendName: string;
  onOpenSettings: () => void;
}

export const BirthdayCake: React.FC<BirthdayCakeProps> = ({
  wishMessage,
  cakeFlavor,
  girlfriendName,
  onOpenSettings,
}) => {
  const [candlesBlown, setCandlesBlown] = useState(false);
  const [wishCount, setWishCount] = useState(0);

  const handleMakeWish = () => {
    if (candlesBlown) return;
    setCandlesBlown(true);
    setWishCount((prev) => prev + 1);

    // Fire fireworks and heart confetti
    fireCelebrationFireworks();
    fireHeartConfetti(0.5, 0.4);
  };

  const handleRelight = () => {
    setCandlesBlown(false);
  };

  return (
    <section id="cake" className="relative py-20 px-4 sm:px-6 max-w-4xl mx-auto text-center">
      {/* Section Header */}
      <div className="space-y-3 mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-950/40 border border-rose-800/40 text-rose-300 text-xs">
          <Sparkles className="w-3.5 h-3.5 text-rose-400" />
          <span>Birthday Ritual</span>
        </div>
        <h2 className="font-serif text-3xl sm:text-5xl font-bold text-white tracking-tight">
          Make A Birthday Wish
        </h2>
        <p className="text-rose-200/80 text-sm sm:text-base max-w-md mx-auto">
          Close your eyes, think of your deepest heart's wish, and blow out the candles, my love.
        </p>
      </div>

      {/* Birthday Cake Illustration & Interactive Candles */}
      <div className="relative inline-flex flex-col items-center justify-center p-8 sm:p-12 rounded-3xl bg-gradient-to-b from-[#200c2a]/80 via-[#15071d]/90 to-[#0c0412] border border-rose-900/40 shadow-[0_0_50px_rgba(244,63,94,0.15)] max-w-lg w-full mx-auto">
        {/* Subtle glow aura */}
        <div
          className={`absolute inset-0 rounded-3xl transition-opacity duration-1000 pointer-events-none ${
            candlesBlown
              ? 'opacity-20 bg-rose-900/10'
              : 'opacity-100 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-500/10 via-rose-500/10 to-transparent'
          }`}
        />

        {/* Candles Group */}
        <div className="relative z-10 flex items-end justify-center gap-4 sm:gap-6 mb-2">
          {[0, 1, 2, 3, 4].map((i) => {
            const candleHeight = i === 2 ? 'h-16' : i % 2 === 1 ? 'h-14' : 'h-12';
            return (
              <div key={i} className="flex flex-col items-center">
                {/* Flame */}
                <div
                  className={`relative flex items-center justify-center transition-all duration-500 ${
                    candlesBlown
                      ? 'scale-0 opacity-0 translate-y-2'
                      : 'scale-100 opacity-100 animate-flame'
                  }`}
                  style={{ animationDelay: `${i * 0.2}s` }}
                >
                  <div className="w-4 h-6 rounded-full bg-gradient-to-t from-orange-500 via-amber-300 to-yellow-100 shadow-[0_0_15px_#f59e0b] filter blur-[0.2px]" />
                  <div className="absolute w-2 h-3 rounded-full bg-white opacity-80" />
                </div>

                {/* Extinguished Smoke puff */}
                {candlesBlown && (
                  <div className="w-2 h-4 text-xs opacity-60 text-stone-400 animate-pulse">
                    ~
                  </div>
                )}

                {/* Candle wick */}
                <div className="w-0.5 h-2 bg-stone-700" />

                {/* Candle Body (striped gold & blush pink) */}
                <div
                  className={`w-3.5 sm:w-4 ${candleHeight} rounded-t-sm shadow-md bg-gradient-to-b from-rose-200 via-amber-200 to-rose-300 border-x border-t border-rose-300/40 relative overflow-hidden`}
                >
                  <div className="absolute inset-0 opacity-40 bg-[repeating-linear-gradient(45deg,transparent,transparent_4px,#e11d48_4px,#e11d48_8px)]" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Cake Tier 1 (Top) */}
        <div className="relative z-10 w-44 sm:w-56 h-14 rounded-t-2xl bg-gradient-to-r from-rose-200 via-pink-100 to-rose-200 shadow-md border-t border-x border-pink-300/60 flex items-center justify-center overflow-hidden">
          {/* Frosting dripping scallops */}
          <div className="absolute -bottom-2 inset-x-0 h-4 flex justify-between px-1">
            {Array.from({ length: 8 }).map((_, idx) => (
              <div key={idx} className="w-5 h-4 rounded-b-full bg-rose-200" />
            ))}
          </div>
          <span className="font-serif text-xs sm:text-sm font-bold text-rose-900 tracking-wider">
            {girlfriendName}'s Day
          </span>
        </div>

        {/* Cake Tier 2 (Middle) */}
        <div className="relative z-10 w-60 sm:w-72 h-16 bg-gradient-to-r from-[#801736] via-[#9e1c44] to-[#801736] border-x border-rose-400/30 flex items-center justify-center shadow-lg">
          <div className="text-amber-200 text-xs font-serif tracking-widest uppercase">
            ❤️ Only You ❤️
          </div>
        </div>

        {/* Cake Tier 3 (Base) */}
        <div className="relative z-10 w-72 sm:w-88 h-18 rounded-b-2xl bg-gradient-to-r from-[#380f24] via-[#521535] to-[#380f24] border-x border-b border-rose-500/30 shadow-2xl flex items-center justify-center overflow-hidden">
          <div className="flex gap-2">
            {Array.from({ length: 9 }).map((_, idx) => (
              <span key={idx} className="text-amber-300/70 text-xs">✨</span>
            ))}
          </div>
        </div>

        {/* Cake Stand Plate */}
        <div className="relative z-10 w-80 sm:w-96 h-3 rounded-full bg-gradient-to-r from-amber-400 via-amber-200 to-amber-500 shadow-[0_10px_25px_rgba(0,0,0,0.8)] mt-1 border-t border-amber-100" />
        <div className="relative z-10 w-24 h-4 bg-gradient-to-b from-amber-300 to-amber-600 rounded-b-lg shadow-md" />

        {/* Flavor subtitle */}
        <p className="relative z-10 mt-6 text-xs text-rose-300/60 italic">
          {cakeFlavor || 'Red Velvet with Strawberries & Cream'}
        </p>

        {/* Action Button: Make a Wish / Relight */}
        <div className="relative z-10 mt-6 flex flex-wrap items-center justify-center gap-3">
          {!candlesBlown ? (
            <button
              onClick={handleMakeWish}
              aria-label="Make a Wish"
              className="px-8 py-3.5 rounded-full bg-gradient-to-r from-amber-500 via-rose-500 to-pink-500 hover:from-amber-400 hover:to-rose-500 text-white font-semibold text-sm sm:text-base shadow-[0_0_25px_rgba(251,191,36,0.5)] hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-amber-200 animate-spin" style={{ animationDuration: '4s' }} />
              <span>Make a Wish ✨</span>
            </button>
          ) : (
            <div className="flex items-center gap-3">
              <button
                onClick={handleRelight}
                aria-label="Relight Candles"
                className="px-6 py-2.5 rounded-full bg-rose-950/60 border border-rose-600/40 hover:bg-rose-900/40 text-rose-200 text-xs sm:text-sm font-medium flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                <span>Relight Candles 🕯️</span>
              </button>
              <button
                onClick={handleMakeWish}
                aria-label="Wish Again"
                className="px-5 py-2.5 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-200 hover:bg-amber-500/30 text-xs sm:text-sm font-medium flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Wish Again ({wishCount})</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Revealed Birthday Wish Message */}
      {candlesBlown && (
        <div className="mt-8 max-w-xl mx-auto p-6 sm:p-8 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-rose-950/60 via-purple-950/50 to-rose-950/60 border border-rose-500/40 shadow-[0_0_35px_rgba(244,63,94,0.25)] animate-in fade-in zoom-in-95 duration-500 space-y-3">
          <div className="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/30 mx-auto flex items-center justify-center text-amber-300">
            <Sparkles className="w-5 h-5" />
          </div>
          <h3 className="font-serif text-xl sm:text-2xl font-bold text-amber-200">
            Your Wish Is Sealed In The Stars ✨
          </h3>
          <p className="text-sm sm:text-base text-rose-100/90 leading-relaxed font-light">
            {wishMessage}
          </p>
          <div className="pt-2">
            <button
              onClick={onOpenSettings}
              className="text-xs text-rose-400 hover:text-rose-300 underline"
            >
              Edit Birthday Wish Message
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
