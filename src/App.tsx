/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { SurpriseData } from './types/index.ts';
import { DEFAULT_SURPRISE_DATA } from './utils/defaults.ts';
import { loadSurpriseData, saveSurpriseData, resetToDefaults } from './utils/storage.ts';
import { musicPlayer } from './utils/audioSynth.ts';
import { Navigation } from './components/Navigation.tsx';
import { RomanticLanding } from './components/RomanticLanding.tsx';
import { MemoryGallery } from './components/MemoryGallery.tsx';
import { LoveLetter } from './components/LoveLetter.tsx';
import { TimelineStory } from './components/TimelineStory.tsx';
import { BirthdayCake } from './components/BirthdayCake.tsx';
import { LoveReasons } from './components/LoveReasons.tsx';
import { FinalSurprise } from './components/FinalSurprise.tsx';
import { MusicPlayer } from './components/MusicPlayer.tsx';
import { PersonalizationModal } from './components/PersonalizationModal.tsx';
import { SharingGuideModal } from './components/SharingGuideModal.tsx';
import { HeartRainCanvas } from './components/HeartRainCanvas.tsx';
import { Heart, Sliders } from 'lucide-react';

/**
 * RevealSection component uses IntersectionObserver to smoothly fade in
 * and float up each section as the user scrolls into view.
 */
function RevealSection({
  children,
  className = '',
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (!('IntersectionObserver' in window)) {
      setIsVisible(true);
      return;
    }

    const currentEl = elementRef.current;
    if (!currentEl) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
      }
    );

    observer.observe(currentEl);

    return () => {
      if (currentEl) {
        observer.unobserve(currentEl);
      }
      observer.disconnect();
    };
  }, []);

  return (
    <div
      ref={elementRef}
      style={{
        transitionDelay: `${delay}ms`,
      }}
      className={`transition-all duration-1000 ease-out transform will-change-transform ${
        isVisible
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-12 motion-reduce:opacity-100 motion-reduce:translate-y-0'
      } ${className}`}
    >
      {children}
    </div>
  );
}

export default function App() {
  const [data, setData] = useState<SurpriseData>(DEFAULT_SURPRISE_DATA);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isPersonalizationOpen, setIsPersonalizationOpen] = useState(false);
  const [isSharingGuideOpen, setIsSharingGuideOpen] = useState(false);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [isHeartRainActive, setIsHeartRainActive] = useState(true);

  // Load saved preferences & photos from IndexedDB / LocalStorage on mount
  useEffect(() => {
    loadSurpriseData().then((loaded) => {
      setData(loaded);
      setIsLoaded(true);
    });

    musicPlayer.setListener((state) => {
      setIsPlayingMusic(state.isPlaying);
    });

    return () => {
      musicPlayer.destroy();
    };
  }, []);

  const handleToggleMusic = () => {
    musicPlayer.toggle();
  };

  const handleToggleHeartRain = () => {
    setIsHeartRainActive((prev) => !prev);
  };

  const handleSaveData = (newData: SurpriseData) => {
    setData(newData);
    saveSurpriseData(newData);
  };

  const handleUpdatePhoto = (photoId: string, imageUrl: string | null) => {
    const updatedPhotos = data.photos.map((p) =>
      p.id === photoId ? { ...p, imageUrl } : p
    );
    const updatedData = { ...data, photos: updatedPhotos };
    setData(updatedData);
    saveSurpriseData(updatedData);
  };

  const handleReset = async () => {
    const resetData = await resetToDefaults();
    setData(resetData);
  };

  const handleOpenSurprise = () => {
    const memoriesEl = document.getElementById('memories');
    if (memoriesEl) {
      memoriesEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-[#0b0612] flex items-center justify-center text-rose-300">
        <div className="flex flex-col items-center gap-3">
          <Heart className="w-8 h-8 fill-rose-500 text-rose-500 animate-pulse" />
          <p className="font-serif text-sm tracking-wide">Unfolding the magic...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0612] text-[#f8edeb] relative selection:bg-rose-500/30 selection:text-rose-200">
      {/* Global Interactive Heart Rain Canvas */}
      <HeartRainCanvas global={true} enabled={isHeartRainActive} />

      {/* Top Navigation */}
      <Navigation
        girlfriendName={data.girlfriendName}
        onOpenSettings={() => setIsPersonalizationOpen(true)}
        onOpenSharingGuide={() => setIsSharingGuideOpen(true)}
        isPlayingMusic={isPlayingMusic}
        onToggleMusic={handleToggleMusic}
        isHeartRainActive={isHeartRainActive}
        onToggleHeartRain={handleToggleHeartRain}
      />

      <main>
        {/* 1. Romantic Landing Page */}
        <RomanticLanding
          heading={data.heroHeading}
          subtitle={data.heroSubtitle}
          girlfriendName={data.girlfriendName}
          partnerName={data.partnerName}
          birthdayDate={data.birthdayDate}
          onOpenSurprise={handleOpenSurprise}
          onToggleMusic={handleToggleMusic}
          isPlayingMusic={isPlayingMusic}
        />

        {/* 2. Our Beautiful Memories — 5 Photo Spaces */}
        <RevealSection>
          <MemoryGallery
            photos={data.photos}
            onUpdatePhoto={handleUpdatePhoto}
            onOpenSettings={() => setIsPersonalizationOpen(true)}
          />
        </RevealSection>

        {/* 3. Interactive Love Letter */}
        <RevealSection>
          <LoveLetter
            salutation={data.loveLetter.salutation}
            paragraphs={data.loveLetter.paragraphs}
            closing={data.loveLetter.closing}
            signature={data.loveLetter.signature}
            partnerName={data.partnerName}
            onOpenSettings={() => setIsPersonalizationOpen(true)}
          />
        </RevealSection>

        {/* 4. Our Love Story Timeline */}
        <RevealSection>
          <TimelineStory
            timeline={data.timeline}
            onOpenSettings={() => setIsPersonalizationOpen(true)}
          />
        </RevealSection>

        {/* 5. Birthday Cake Surprise */}
        <RevealSection>
          <BirthdayCake
            wishMessage={data.cakeWishMessage}
            cakeFlavor={data.cakeFlavor}
            girlfriendName={data.girlfriendName}
            onOpenSettings={() => setIsPersonalizationOpen(true)}
          />
        </RevealSection>

        {/* 7. The Reasons I Love You */}
        <RevealSection>
          <LoveReasons
            reasons={data.reasons}
            girlfriendName={data.girlfriendName}
            onOpenSettings={() => setIsPersonalizationOpen(true)}
          />
        </RevealSection>

        {/* 8. Final Surprise Section */}
        <RevealSection>
          <FinalSurprise
            finalQuote={data.finalQuote}
            finalMessage={data.finalMessage}
            girlfriendName={data.girlfriendName}
            partnerName={data.partnerName}
            onOpenSettings={() => setIsPersonalizationOpen(true)}
          />
        </RevealSection>
      </main>

      {/* Floating Romantic Music Player */}
      <MusicPlayer
        isPlaying={isPlayingMusic}
        onTogglePlay={handleToggleMusic}
        customTrackName={data.customAudioName}
        onSetCustomTrackName={(name) => {
          const updated = { ...data, customAudioName: name };
          setData(updated);
          saveSurpriseData(updated);
        }}
      />

      {/* Floating Personalization Button (Quick Mobile Access) */}
      <div className="fixed bottom-4 left-4 z-30 sm:hidden">
        <button
          onClick={() => setIsPersonalizationOpen(true)}
          aria-label="Open Personalization"
          className="p-3 rounded-full bg-rose-600/90 text-white shadow-lg border border-rose-400/40"
        >
          <Sliders className="w-4 h-4" />
        </button>
      </div>

      {/* Footer */}
      <footer className="border-t border-rose-950/60 py-12 px-4 text-center text-xs text-rose-300/60 space-y-3 bg-[#08030e]">
        <div className="flex items-center justify-center gap-2">
          <span>Made with endless love for {data.girlfriendName}</span>
          <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
          <span>from {data.partnerName}</span>
        </div>
        <p className="text-[11px] text-rose-400/40">
          Happy Birthday, My Love · Forever & Always
        </p>
        <div className="pt-2 flex items-center justify-center gap-4">
          <button
            onClick={() => setIsPersonalizationOpen(true)}
            className="text-rose-400 hover:text-rose-300 underline"
          >
            Personalize Surprise
          </button>
          <span>·</span>
          <button
            onClick={() => setIsSharingGuideOpen(true)}
            className="text-rose-400 hover:text-rose-300 underline"
          >
            Sharing & Deployment Guide
          </button>
        </div>
      </footer>

      {/* Modals */}
      <PersonalizationModal
        isOpen={isPersonalizationOpen}
        onClose={() => setIsPersonalizationOpen(false)}
        data={data}
        onSave={handleSaveData}
        onReset={handleReset}
      />

      <SharingGuideModal
        isOpen={isSharingGuideOpen}
        onClose={() => setIsSharingGuideOpen(false)}
        girlfriendName={data.girlfriendName}
      />
    </div>
  );
}
