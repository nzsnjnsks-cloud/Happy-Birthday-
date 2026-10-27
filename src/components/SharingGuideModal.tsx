import React, { useState } from 'react';
import { X, Sparkles, Heart, Globe, Terminal, Gift, Check, Copy, Download, ExternalLink, ShieldCheck } from 'lucide-react';

interface SharingGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  girlfriendName: string;
}

export const SharingGuideModal: React.FC<SharingGuideModalProps> = ({
  isOpen,
  onClose,
  girlfriendName,
}) => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative max-w-2xl w-full bg-[#160a20] border border-rose-900/60 rounded-3xl shadow-[0_20px_70px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col my-auto max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-rose-900/40 bg-[#12071a]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
              <Globe className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif text-xl font-bold text-white">
                How To Share Publicly With {girlfriendName || 'Her'}
              </h3>
              <p className="text-xs text-rose-300/70">
                Choose the easiest option below so anyone on any phone can open it
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close guide"
            className="p-1.5 rounded-lg bg-rose-950/60 text-rose-300 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-rose-100">
          {/* OPTION 1: 30-Second Free Netlify Link (Most Recommended for WhatsApp/iMessage) */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-rose-950/50 via-[#1c0a24] to-[#120518] border border-rose-500/40 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-rose-600/30 border border-rose-500/40 text-rose-300 text-xs font-semibold">
                ⭐ Option 1 (Fastest & 100% Free Public Link)
              </span>
              <span className="text-[11px] text-emerald-400 font-medium">No account required</span>
            </div>

            <h4 className="font-serif font-bold text-white text-base">
              Publish to Netlify Drop (Instant Public HTTPS Link)
            </h4>
            <p className="text-xs text-rose-200/80 leading-relaxed">
              Anyone worldwide can open this link on their iPhone, Android, or laptop without needing a Google account.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <a
                href="/birthday-website.zip"
                download="birthday-website.zip"
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-medium text-xs flex items-center gap-1.5 shadow-md transition-all"
              >
                <Download className="w-3.5 h-3.5" />
                <span>1. Download Website ZIP</span>
              </a>

              <a
                href="https://app.netlify.com/drop"
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 rounded-xl bg-rose-950/60 border border-rose-700/50 hover:bg-rose-900/60 text-rose-200 text-xs flex items-center gap-1.5 transition-all"
              >
                <span>2. Open Netlify Drop</span>
                <ExternalLink className="w-3 h-3 text-rose-400" />
              </a>
            </div>

            <p className="text-[11px] text-rose-300/70 pt-1">
              👉 Just drag the downloaded <code>birthday-website.zip</code> onto Netlify Drop. You will immediately get a public link like <code>https://your-name.netlify.app</code> to text her!
            </p>
          </div>

          {/* OPTION 2: Make the AI Studio Link Public */}
          <div className="space-y-2 p-4 rounded-2xl bg-[#0e0516] border border-rose-900/40">
            <h4 className="font-serif font-bold text-rose-300 text-base flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-300" />
              <span>Option 2: Make Your AI Studio Link Public</span>
            </h4>
            <p className="text-xs text-rose-200/80 leading-relaxed">
              If someone tries to open the <code>ais-pre-...</code> link right now and sees a login screen, it's because AI Studio projects start as <strong>private</strong> to your Google email.
            </p>
            <div className="text-xs text-rose-200/90 space-y-1.5 pl-2 border-l-2 border-rose-500/30">
              <p>1. Look at the top-right corner of your Google AI Studio window.</p>
              <p>2. Click the <strong>Share</strong> button (next to the title bar).</p>
              <p>3. Under Link Access, select <strong>"Anyone with the link"</strong>.</p>
              <p>4. Now anyone who clicks the link can open and see your website!</p>
            </div>
          </div>

          {/* OPTION 3: Vercel Free Deployment */}
          <div className="space-y-2 p-4 rounded-2xl bg-[#0e0516] border border-rose-900/40">
            <h4 className="font-serif font-bold text-rose-300 text-base flex items-center gap-2">
              <Terminal className="w-4 h-4 text-purple-400" />
              <span>Option 3: Deploy with Vercel</span>
            </h4>
            <p className="text-xs text-rose-200/80 leading-relaxed">
              If you have GitHub and Vercel:
            </p>
            <ul className="list-disc list-inside text-xs text-rose-200/80 space-y-1 pl-1">
              <li>Push your code to GitHub.</li>
              <li>Go to <a href="https://vercel.com" target="_blank" rel="noreferrer" className="text-rose-400 underline">vercel.com</a>, import the repo, and click <strong>Deploy</strong>.</li>
              <li>You can set a custom domain like <code>happy-birthday-sophia.vercel.app</code>.</li>
            </ul>
          </div>

          {/* Romantic Tip */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-rose-950/40 to-pink-950/40 border border-rose-500/30 space-y-1.5">
            <div className="flex items-center gap-2 text-rose-300 font-serif font-bold text-sm">
              <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
              <span>Midnight Surprise Tip</span>
            </div>
            <p className="text-xs text-rose-200/90 leading-relaxed">
              Text her the public link right at midnight with headphones recommended so she hears the romantic piano song when she taps the music player!
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-rose-900/40 bg-[#12071a] flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-medium text-xs sm:text-sm transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
