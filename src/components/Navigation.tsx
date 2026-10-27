import React, { useState } from 'react';
import { Heart, Music, Sliders, Menu, X, Sparkles } from 'lucide-react';

interface NavigationProps {
  girlfriendName: string;
  onOpenSettings: () => void;
  onOpenSharingGuide: () => void;
  isPlayingMusic: boolean;
  onToggleMusic: () => void;
  isHeartRainActive?: boolean;
  onToggleHeartRain?: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  girlfriendName,
  onOpenSettings,
  onOpenSharingGuide,
  isPlayingMusic,
  onToggleMusic,
  isHeartRainActive = true,
  onToggleHeartRain,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Memories', href: '#memories' },
    { label: 'Love Letter', href: '#letter' },
    { label: 'Our Story', href: '#timeline' },
    { label: 'Birthday Cake', href: '#cake' },
    { label: 'Reasons', href: '#reasons' },
    { label: 'Surprise', href: '#surprise' },
  ];

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-[#0d0718]/80 border-b border-rose-900/20 transition-all duration-300">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4 md:gap-8">
        {/* Zone 1: Brand wordmark */}
        <a
          href="#top"
          className="flex items-center gap-2 group whitespace-nowrap shrink-0 text-decoration-none"
        >
          <span className="p-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 group-hover:bg-rose-500/20 transition-colors">
            <Heart className="w-4 h-4 fill-rose-500 text-rose-500 animate-pulse" />
          </span>
          <span className="font-serif text-lg sm:text-xl font-bold tracking-wide text-rose-100 group-hover:text-white transition-colors">
            For {girlfriendName || 'My Love'}
          </span>
        </a>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-rose-200/80">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="hover:text-rose-300 transition-colors whitespace-nowrap shrink-0 relative py-1 after:absolute after:bottom-0 after:left-0 after:w-0 hover:after:w-full after:h-[1px] after:bg-rose-400 after:transition-all after:duration-200"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Zone 3: Primary Actions */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Heart Rain Toggle Button */}
          {onToggleHeartRain && (
            <button
              onClick={onToggleHeartRain}
              aria-label={isHeartRainActive ? 'Disable Heart Rain' : 'Enable Heart Rain'}
              className={`p-2 rounded-lg border text-xs flex items-center gap-1.5 transition-all ${
                isHeartRainActive
                  ? 'bg-rose-500/20 border-rose-500/40 text-rose-200 shadow-[0_0_12px_rgba(244,63,94,0.3)]'
                  : 'bg-rose-950/30 border-rose-900/30 text-rose-300/60 hover:bg-rose-900/30'
              }`}
              title={isHeartRainActive ? 'Heart Rain Active (Click to toggle)' : 'Turn on Heart Rain'}
            >
              <Heart
                className={`w-4 h-4 ${
                  isHeartRainActive ? 'fill-rose-500 text-rose-500 animate-pulse' : 'text-rose-400/60'
                }`}
              />
              <span className="hidden xl:inline font-sans text-xs">
                {isHeartRainActive ? 'Rain: On' : 'Rain: Off'}
              </span>
            </button>
          )}

          {/* Music Quick Toggle */}
          <button
            onClick={onToggleMusic}
            aria-label={isPlayingMusic ? 'Pause romantic music' : 'Play romantic music'}
            className={`p-2 rounded-lg border text-xs flex items-center gap-1.5 transition-all ${
              isPlayingMusic
                ? 'bg-rose-500/20 border-rose-500/40 text-rose-200 shadow-[0_0_12px_rgba(244,63,94,0.3)]'
                : 'bg-rose-950/30 border-rose-900/30 text-rose-300/80 hover:bg-rose-900/30'
            }`}
            title={isPlayingMusic ? 'Music Playing' : 'Play Romantic Music'}
          >
            <Music className={`w-4 h-4 ${isPlayingMusic ? 'animate-bounce text-rose-400' : ''}`} />
            <span className="hidden sm:inline font-sans text-xs">
              {isPlayingMusic ? 'Playing' : 'Music'}
            </span>
          </button>

          {/* Personalize Button */}
          <button
            onClick={onOpenSettings}
            aria-label="Open Personalization Settings"
            className="px-3 py-2 rounded-lg bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-medium text-xs sm:text-sm flex items-center gap-1.5 shadow-sm transition-all whitespace-nowrap shrink-0"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Personalize</span>
          </button>

          {/* Guide Button */}
          <button
            onClick={onOpenSharingGuide}
            aria-label="How to Share & Deploy"
            className="hidden sm:flex px-2.5 py-2 rounded-lg bg-rose-950/40 border border-rose-800/40 hover:bg-rose-900/40 text-rose-200 text-xs items-center gap-1 transition-colors whitespace-nowrap shrink-0"
            title="How to publish and send to your girlfriend"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Share Guide</span>
          </button>

          {/* Direct Download ZIP for Netlify */}
          <a
            href="./birthday-website.zip"
            download="birthday-website.zip"
            className="hidden lg:flex px-2.5 py-2 rounded-lg bg-amber-500/15 border border-amber-500/30 hover:bg-amber-500/25 text-amber-200 text-xs items-center gap-1 transition-colors whitespace-nowrap shrink-0"
            title="Download ZIP to drag & drop on Netlify"
          >
            <span>Download for Netlify</span>
          </a>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle mobile menu"
            className="md:hidden p-2 rounded-lg bg-rose-950/40 border border-rose-900/30 text-rose-200 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-rose-900/30 bg-[#120a1f] px-4 py-4 space-y-3">
          <div className="grid grid-cols-2 gap-2 text-sm">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg bg-rose-950/20 border border-rose-900/20 text-rose-200 hover:bg-rose-900/30"
              >
                {link.label}
              </a>
            ))}
          </div>

          {onToggleHeartRain && (
            <button
              onClick={() => {
                onToggleHeartRain();
              }}
              className="w-full py-2 px-3 rounded-lg bg-rose-950/40 border border-rose-800/40 text-rose-200 text-xs flex items-center justify-center gap-1.5"
            >
              <Heart className={`w-3.5 h-3.5 ${isHeartRainActive ? 'fill-rose-500 text-rose-500' : ''}`} />
              <span>{isHeartRainActive ? 'Heart Rain: Enabled ✨' : 'Heart Rain: Disabled'}</span>
            </button>
          )}

          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenSharingGuide();
            }}
            className="w-full py-2 px-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-200 text-xs flex items-center justify-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>How to publish & share with girlfriend</span>
          </button>
        </div>
      )}
    </header>
  );
};
