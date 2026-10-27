import React, { useState, useEffect } from 'react';
import { Mail, RotateCcw, Heart, Edit3, Sparkles } from 'lucide-react';
import { fireHeartConfetti } from '../utils/confetti.ts';

interface LoveLetterProps {
  salutation: string;
  paragraphs: string[];
  closing: string;
  signature: string;
  partnerName: string;
  onOpenSettings: () => void;
}

export const LoveLetter: React.FC<LoveLetterProps> = ({
  salutation,
  paragraphs,
  closing,
  signature,
  partnerName,
  onOpenSettings,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [revealedParagraphs, setRevealedParagraphs] = useState<number>(0);
  const [isTypingDone, setIsTypingDone] = useState(false);
  const [floatingHearts, setFloatingHearts] = useState<{ id: number; left: number }[]>([]);

  // Open the envelope
  const handleOpenEnvelope = () => {
    if (isOpen) return;
    setIsOpen(true);
    fireHeartConfetti(0.5, 0.5);

    // Spawn floating mini hearts
    const hearts = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      left: 20 + Math.random() * 60,
    }));
    setFloatingHearts(hearts);

    // Reveal paragraphs with staggered timing
    setRevealedParagraphs(0);
    setIsTypingDone(false);
  };

  useEffect(() => {
    if (!isOpen) return;

    const timers: ReturnType<typeof setTimeout>[] = [];
    paragraphs.forEach((_, idx) => {
      const timer = setTimeout(() => {
        setRevealedParagraphs((prev) => Math.max(prev, idx + 1));
        if (idx === paragraphs.length - 1) {
          setIsTypingDone(true);
        }
      }, 500 + idx * 900);
      timers.push(timer);
    });

    return () => {
      timers.forEach(clearTimeout);
    };
  }, [isOpen, paragraphs]);

  // Read again reset
  const handleReadAgain = () => {
    setRevealedParagraphs(0);
    setIsTypingDone(false);
    setTimeout(() => {
      paragraphs.forEach((_, idx) => {
        setTimeout(() => {
          setRevealedParagraphs((prev) => Math.max(prev, idx + 1));
          if (idx === paragraphs.length - 1) {
            setIsTypingDone(true);
          }
        }, idx * 800);
      });
    }, 150);
  };

  return (
    <section id="letter" className="relative py-20 px-4 sm:px-6 max-w-4xl mx-auto">
      {/* Section Header */}
      <div className="text-center space-y-3 mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-950/40 border border-rose-800/40 text-rose-300 text-xs">
          <Sparkles className="w-3.5 h-3.5 text-rose-400" />
          <span>A Love Letter For You</span>
        </div>
        <h2 className="font-serif text-3xl sm:text-5xl font-bold text-white tracking-tight">
          Words Straight From My Heart
        </h2>
        <p className="text-rose-200/80 text-sm sm:text-base max-w-md mx-auto">
          Some feelings are too deep to speak aloud, so I wrote them down for you to keep forever.
        </p>
      </div>

      {/* Envelope Container */}
      <div className="relative flex flex-col items-center">
        {!isOpen ? (
          // Sealed Envelope
          <button
            type="button"
            onClick={handleOpenEnvelope}
            aria-label="Open sealed love letter"
            className="group relative w-full max-w-md sm:max-w-lg aspect-[16/11] cursor-pointer rounded-2xl bg-gradient-to-br from-[#2a0e20] via-[#1c0818] to-[#140612] border-2 border-rose-500/30 p-6 sm:p-8 flex flex-col items-center justify-center text-center shadow-[0_10px_40px_rgba(244,63,94,0.25)] hover:shadow-[0_15px_50px_rgba(244,63,94,0.4)] hover:scale-[1.02] active:scale-[0.99] transition-all duration-300"
          >
            {/* Realistic Envelope Flap Lines */}
            <div className="absolute top-0 inset-x-0 h-1/2 border-b border-rose-500/20 bg-gradient-to-b from-rose-900/30 to-transparent pointer-events-none rounded-t-2xl" />

            {/* Glowing Golden Wax Seal */}
            <div className="relative z-10 w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-amber-600 via-amber-400 to-yellow-200 border-2 border-amber-300 shadow-[0_0_25px_rgba(251,191,36,0.5)] flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border border-amber-800/40 flex items-center justify-center bg-amber-500/20">
                <Heart className="w-8 h-8 sm:w-10 sm:h-10 fill-amber-950 text-amber-950 drop-shadow-sm" />
              </div>
            </div>

            {/* Tap prompt */}
            <div className="relative z-10 mt-6 space-y-1">
              <p className="font-serif text-xl sm:text-2xl font-bold text-rose-100 group-hover:text-white transition-colors">
                Sealed With Love
              </p>
              <p className="text-xs sm:text-sm text-rose-300/80 flex items-center justify-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-rose-400" />
                <span>Tap to break the wax seal & open</span>
              </p>
            </div>
          </button>
        ) : (
          // Opened Letter Card
          <div className="relative w-full max-w-2xl bg-gradient-to-b from-[#fdfbf7] to-[#f7f2ea] text-[#2c1810] rounded-2xl sm:rounded-3xl p-6 sm:p-10 shadow-[0_20px_60px_rgba(0,0,0,0.6)] border border-amber-200/60 transition-all duration-500">
            {/* Floating Hearts Animation overlay */}
            {floatingHearts.map((h) => (
              <div
                key={h.id}
                style={{
                  left: `${h.left}%`,
                  bottom: '10px',
                  animation: `floatUp ${2.5 + (h.id % 3) * 0.5}s ease-out forwards`,
                  animationDelay: `${h.id * 0.15}s`,
                }}
                className="absolute pointer-events-none text-rose-400 text-lg opacity-80"
              >
                ❤️
              </div>
            ))}

            {/* Letter Header */}
            <div className="flex items-center justify-between border-b border-amber-900/15 pb-4 mb-6">
              <span className="font-serif text-sm tracking-wider uppercase text-amber-900/60 font-semibold">
                Personal Birthday Note
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={onOpenSettings}
                  className="p-1.5 rounded-lg text-amber-900/60 hover:text-amber-900 hover:bg-amber-900/10 text-xs flex items-center gap-1 transition-colors"
                  title="Edit Letter Text"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Edit</span>
                </button>
              </div>
            </div>

            {/* Salutation */}
            <p className="font-serif text-2xl sm:text-3xl font-bold text-[#3d1a24] mb-6">
              {salutation || 'To the love of my life,'}
            </p>

            {/* Paragraphs with typing/revealing effect */}
            <div className="space-y-4 text-sm sm:text-base md:text-lg leading-relaxed text-[#4a2e2b] font-light">
              {paragraphs.map((p, idx) => {
                const isRevealed = revealedParagraphs > idx;
                return (
                  <p
                    key={idx}
                    className={`transition-all duration-700 ${
                      isRevealed
                        ? 'opacity-100 translate-y-0'
                        : 'opacity-0 translate-y-4 pointer-events-none'
                    }`}
                  >
                    {p}
                  </p>
                );
              })}
            </div>

            {/* Closing & Signature */}
            <div
              className={`mt-8 pt-6 border-t border-amber-900/10 space-y-1 transition-all duration-700 ${
                isTypingDone ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
              }`}
            >
              <p className="font-serif italic text-base text-amber-900/70">
                {closing || 'Forever and always yours,'}
              </p>
              <p className="font-serif text-xl sm:text-2xl font-bold text-[#4a1220]">
                {signature || partnerName || 'With all my heart ❤️'}
              </p>
            </div>

            {/* Letter Action Buttons */}
            <div className="mt-8 pt-4 flex flex-wrap items-center justify-between gap-3 border-t border-amber-900/10">
              <button
                onClick={handleReadAgain}
                className="px-4 py-2 rounded-full bg-amber-900/10 hover:bg-amber-900/20 text-[#3d1a24] font-medium text-xs sm:text-sm flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5 text-rose-600" />
                <span>Read Again ❤️</span>
              </button>

              <button
                onClick={onOpenSettings}
                className="px-4 py-2 rounded-full border border-amber-900/20 hover:border-amber-900/40 text-amber-900/80 hover:text-amber-900 text-xs sm:text-sm flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Personalize Letter</span>
              </button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes floatUp {
          0% {
            transform: translateY(0) scale(0.6);
            opacity: 0.9;
          }
          100% {
            transform: translateY(-240px) scale(1.2);
            opacity: 0;
          }
        }
      `}</style>
    </section>
  );
};
