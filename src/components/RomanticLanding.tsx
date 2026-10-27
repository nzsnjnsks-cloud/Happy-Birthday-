import React, { useCallback } from 'react';
import { Gift, ChevronDown, Sparkles, Heart } from 'lucide-react';
import { fireHeartConfetti, firePetalShower } from '../utils/confetti.ts';

interface RomanticLandingProps {
  heading: string;
  subtitle: string;
  girlfriendName: string;
  partnerName: string;
  birthdayDate: string;
  onOpenSurprise: () => void;
  onToggleMusic: () => void;
  isPlayingMusic: boolean;
}

export const RomanticLanding: React.FC<RomanticLandingProps> = ({
  heading,
  subtitle,
  girlfriendName,
  partnerName,
  birthdayDate,
  onOpenSurprise,
  onToggleMusic,
  isPlayingMusic,
}) => {
  const triggerHeartBurst = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    window.dispatchEvent(
      new CustomEvent('trigger-heart-rain', {
        detail: { x, y, count: 20 },
      })
    );
  }, []);

  const handleOpenClick = () => {
    fireHeartConfetti();
    firePetalShower();
    window.dispatchEvent(
      new CustomEvent('trigger-heart-rain', {
        detail: { x: window.innerWidth / 2, y: window.innerHeight / 2, count: 35 },
      })
    );
    if (!isPlayingMusic) {
      onToggleMusic();
    }
    onOpenSurprise();
  };

  // Format date nicely without timezone offset shift
  const formattedDate = React.useMemo(() => {
    try {
      if (!birthdayDate) return 'October 28';
      const parts = birthdayDate.split('-');
      if (parts.length === 3) {
        const year = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1;
        const day = parseInt(parts[2], 10);
        const d = new Date(year, month, day);
        return d.toLocaleDateString(undefined, {
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        });
      }
      const d = new Date(birthdayDate);
      if (isNaN(d.getTime())) return birthdayDate;
      return d.toLocaleDateString(undefined, {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return birthdayDate;
    }
  }, [birthdayDate]);

  return (
    <section
      id="top"
      className="relative min-h-[92vh] sm:min-h-screen flex items-center justify-center overflow-hidden px-4 py-16 cursor-default"
    >
      {/* Dynamic Romantic Gradient Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#3a0d24] via-[#1a0826] to-[#0a0410] opacity-95" />

      {/* Subtle glowing ambient orbs */}
      <div className="absolute top-1/4 left-1/4 w-72 sm:w-96 h-72 sm:h-96 rounded-full bg-rose-600/15 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 sm:w-[30rem] h-80 sm:h-[30rem] rounded-full bg-purple-600/15 blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 right-1/3 w-64 h-64 rounded-full bg-amber-500/10 blur-[80px] pointer-events-none" />

      {/* Content Container */}
      <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6 sm:space-y-8">
        {/* Editorial Date & Dedication Kicker */}
        <div
          onMouseEnter={triggerHeartBurst}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-950/50 border border-rose-500/30 text-rose-300 text-xs sm:text-sm shadow-[0_0_15px_rgba(244,63,94,0.15)] backdrop-blur-sm hover:scale-105 hover:border-rose-400/60 transition-transform duration-300 cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" style={{ animationDuration: '6s' }} />
          <span>A secret celebration for {girlfriendName}</span>
          <span className="text-rose-500/60">·</span>
          <span>{formattedDate}</span>
        </div>

        {/* Dynamic Heading with hover heart rain burst */}
        <h1
          onMouseEnter={triggerHeartBurst}
          className="group font-serif text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white leading-[1.1] max-w-3xl mx-auto drop-shadow-sm cursor-pointer select-none transition-transform duration-300 hover:scale-[1.01]"
        >
          <span className="bg-gradient-to-r from-rose-200 via-pink-100 to-amber-100 bg-clip-text text-transparent group-hover:from-rose-100 group-hover:to-pink-200 transition-colors">
            {heading || 'Happy Birthday, My Love ❤️'}
          </span>
        </h1>

        {/* Dynamic Subtitle */}
        <p
          onMouseEnter={triggerHeartBurst}
          className="text-base sm:text-xl md:text-2xl text-rose-200/90 max-w-2xl mx-auto font-light leading-relaxed hover:text-white transition-colors duration-300 cursor-pointer"
        >
          {subtitle || 'Today is all about the most beautiful person in my world.'}
        </p>

        {/* Dedicated Message to Her */}
        <p className="text-sm sm:text-base text-rose-300/70 italic max-w-lg mx-auto">
          Crafted with endless love, exclusively for you, by {partnerName || 'Your Love'}.
        </p>

        {/* Romantic Heart Rain Interactive Cue */}
        <div className="flex items-center justify-center gap-2 text-xs text-rose-400/80">
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-rose-950/40 border border-rose-800/30 backdrop-blur-sm">
            <Heart className="w-3 h-3 fill-rose-500 text-rose-500 animate-pulse" />
            <span>Hover anywhere to trigger romantic heart rain</span>
          </span>
        </div>

        {/* Animated Open Your Surprise Button */}
        <div className="pt-2 sm:pt-4 flex flex-col items-center gap-4">
          <button
            onClick={handleOpenClick}
            onMouseEnter={triggerHeartBurst}
            aria-label="Open Your Surprise"
            className="group relative inline-flex items-center gap-3 px-8 sm:px-10 py-4 sm:py-5 rounded-full bg-gradient-to-r from-rose-600 via-pink-600 to-rose-700 text-white font-semibold text-base sm:text-lg shadow-[0_0_30px_rgba(244,63,94,0.45)] hover:shadow-[0_0_45px_rgba(244,63,94,0.7)] hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer"
          >
            <span className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-amber-400 via-pink-500 to-rose-500 opacity-30 group-hover:opacity-75 blur-sm transition-opacity" />
            <Gift className="relative w-5 h-5 sm:w-6 sm:h-6 text-amber-200 animate-bounce" />
            <span className="relative tracking-wide">Open Your Surprise 🎁</span>
          </button>

          <span className="text-xs text-rose-300/60 flex items-center gap-1 mt-2">
            <span>Scroll down or tap to unfold the magic</span>
          </span>
        </div>

        {/* Scroll indicator */}
        <div className="pt-8 opacity-70 hover:opacity-100 transition-opacity">
          <a
            href="#memories"
            aria-label="Scroll to memories section"
            className="inline-flex flex-col items-center text-xs text-rose-300/70 hover:text-rose-200 transition-colors"
          >
            <span className="mb-1 text-[11px] tracking-widest uppercase">Begin The Journey</span>
            <ChevronDown className="w-4 h-4 animate-bounce text-rose-400" />
          </a>
        </div>
      </div>
    </section>
  );
};

