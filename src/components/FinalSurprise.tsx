import React, { useState } from 'react';
import { Gift, Heart, X, PartyPopper } from 'lucide-react';
import { fireCelebrationFireworks, fireHeartConfetti, firePetalShower } from '../utils/confetti.ts';

interface FinalSurpriseProps {
  finalQuote: string;
  finalMessage: string;
  girlfriendName: string;
  partnerName: string;
  onOpenSettings: () => void;
}

export const FinalSurprise: React.FC<FinalSurpriseProps> = ({
  finalQuote,
  finalMessage,
  girlfriendName,
  partnerName,
}) => {
  const [modalOpen, setModalOpen] = useState(false);

  const handleOpenFinalSurprise = () => {
    setModalOpen(true);
    fireCelebrationFireworks();
    fireHeartConfetti(0.5, 0.5);
    firePetalShower();
  };

  const handleFireMore = () => {
    fireCelebrationFireworks();
    fireHeartConfetti(0.5, 0.4);
  };

  return (
    <section id="surprise" className="relative py-24 px-4 sm:px-6 max-w-4xl mx-auto text-center">
      {/* Background radial highlight */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-rose-950/40 via-purple-950/20 to-transparent pointer-events-none" />

      {/* Quote Banner */}
      <div className="relative z-10 space-y-6 max-w-3xl mx-auto">
        <div className="w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/30 mx-auto flex items-center justify-center text-rose-400">
          <Heart className="w-6 h-6 fill-rose-500 animate-pulse" />
        </div>

        <blockquote className="font-serif text-2xl sm:text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-200 via-pink-100 to-amber-200 leading-snug">
          “{finalQuote || 'Out of all the people in this world, my heart will always choose you. Happy Birthday, My Love! ❤️'}”
        </blockquote>

        <p className="text-sm sm:text-base text-rose-300/70 italic">
          Forever dedicated to {girlfriendName || 'My Love'} — from {partnerName || 'Your Love'}
        </p>

        {/* Animated "One Last Surprise 💝" Button */}
        <div className="pt-6">
          <button
            onClick={handleOpenFinalSurprise}
            aria-label="Open One Last Surprise"
            className="group relative inline-flex items-center gap-3 px-8 sm:px-12 py-4 sm:py-5 rounded-full bg-gradient-to-r from-rose-600 via-pink-600 to-amber-500 text-white font-bold text-base sm:text-lg shadow-[0_0_35px_rgba(244,63,94,0.4)] hover:shadow-[0_0_50px_rgba(244,63,94,0.7)] hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer"
          >
            <span className="absolute -inset-1 rounded-full bg-gradient-to-r from-rose-400 via-amber-300 to-pink-500 opacity-30 group-hover:opacity-80 blur-md transition-opacity" />
            <Gift className="relative w-6 h-6 text-amber-200 animate-bounce" />
            <span className="relative tracking-wide">One Last Surprise 💝</span>
          </button>
        </div>
      </div>

      {/* Full-Screen Romantic Message Modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="relative max-w-2xl w-full bg-gradient-to-b from-[#240c26] via-[#16071d] to-[#0c0410] border-2 border-rose-500/40 rounded-3xl p-6 sm:p-10 shadow-[0_0_80px_rgba(244,63,94,0.5)] text-center my-8 overflow-hidden animate-in fade-in zoom-in-95 duration-500"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Ambient decorative glowing light behind */}
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full bg-rose-500/20 blur-[90px] pointer-events-none" />

            {/* Close Button */}
            <button
              onClick={() => setModalOpen(false)}
              aria-label="Close surprise message"
              className="absolute top-4 right-4 p-2 rounded-full bg-rose-950/60 border border-rose-800/40 text-rose-300 hover:text-white hover:bg-rose-900/60 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Giant Glowing Heart Icon */}
            <div className="relative inline-flex items-center justify-center mb-6">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-rose-600 via-pink-500 to-amber-400 p-0.5 shadow-[0_0_35px_rgba(244,63,94,0.6)]">
                <div className="w-full h-full rounded-full bg-[#16071d] flex items-center justify-center">
                  <Heart className="w-10 h-10 sm:w-12 sm:h-12 fill-rose-500 text-rose-500 animate-pulse" />
                </div>
              </div>
            </div>

            {/* Title */}
            <h3 className="font-serif text-3xl sm:text-5xl font-bold text-white tracking-tight mb-2">
              To My Whole World ❤️
            </h3>

            <p className="font-serif italic text-rose-300 text-lg mb-6">
              Happy Birthday, {girlfriendName || 'My Angel'}
            </p>

            {/* Love declaration message */}
            <div className="bg-rose-950/30 border border-rose-900/40 rounded-2xl p-6 text-left text-sm sm:text-base leading-relaxed text-rose-100/90 font-light space-y-4">
              <p>
                {finalMessage ||
                  'You are my favorite hello and my hardest goodbye. You are the poetry in my ordinary days, the peace in my restless thoughts, and the love I had always dreamed of finding.'}
              </p>
              <p className="text-right font-serif text-rose-300 font-bold text-lg pt-2 border-t border-rose-900/30">
                Forever Yours, {partnerName || 'Your Love'}
              </p>
            </div>

            {/* Modal Actions */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={handleFireMore}
                className="px-6 py-3 rounded-full bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-semibold text-xs sm:text-sm flex items-center gap-2 shadow-lg transition-all cursor-pointer"
              >
                <PartyPopper className="w-4 h-4 text-amber-200" />
                <span>Celebrate Again! 🎆</span>
              </button>

              <button
                onClick={() => setModalOpen(false)}
                className="px-6 py-3 rounded-full bg-rose-950/60 border border-rose-800/40 hover:bg-rose-900/60 text-rose-200 text-xs sm:text-sm transition-colors cursor-pointer"
              >
                Back To Our Journey
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
