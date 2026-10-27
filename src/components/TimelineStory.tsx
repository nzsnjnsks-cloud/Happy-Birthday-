import React, { useState } from 'react';
import { TimelineMilestone } from '../types/index.ts';
import { Sparkles, ChevronDown, ChevronUp, Calendar, Heart, Edit3 } from 'lucide-react';

interface TimelineStoryProps {
  timeline: TimelineMilestone[];
  onOpenSettings: () => void;
}

export const TimelineStory: React.FC<TimelineStoryProps> = ({
  timeline,
  onOpenSettings,
}) => {
  // Track open cards; default opening the first two
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({
    'timeline-1': true,
    'timeline-2': true,
  });

  const toggleItem = (id: string) => {
    setOpenItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const expandAll = () => {
    const all: Record<string, boolean> = {};
    timeline.forEach((t) => (all[t.id] = true));
    setOpenItems(all);
  };

  const collapseAll = () => {
    setOpenItems({});
  };

  const isAllOpen = timeline.every((t) => openItems[t.id]);

  return (
    <section id="timeline" className="relative py-20 px-4 sm:px-6 max-w-5xl mx-auto">
      {/* Section Header */}
      <div className="text-center space-y-3 mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-950/40 border border-rose-800/40 text-rose-300 text-xs">
          <Sparkles className="w-3.5 h-3.5 text-rose-400" />
          <span>Our Love Story</span>
        </div>
        <h2 className="font-serif text-3xl sm:text-5xl font-bold text-white tracking-tight">
          How We Came To Be
        </h2>
        <p className="text-rose-200/80 text-sm sm:text-base max-w-md mx-auto">
          Every chapter with you has been a blessing. Here is the story of how my world changed forever.
        </p>

        {/* Expand/Collapse Toggle & Edit */}
        <div className="pt-2 flex items-center justify-center gap-4 text-xs">
          <button
            onClick={isAllOpen ? collapseAll : expandAll}
            className="text-rose-400 hover:text-rose-300 font-medium underline"
          >
            {isAllOpen ? 'Collapse All Chapters' : 'Expand All Chapters'}
          </button>
          <span className="text-rose-900">|</span>
          <button
            onClick={onOpenSettings}
            className="text-rose-400 hover:text-rose-300 flex items-center gap-1"
          >
            <Edit3 className="w-3 h-3" />
            <span>Edit Milestones</span>
          </button>
        </div>
      </div>

      {/* Vertical Interactive Timeline */}
      <div className="relative">
        {/* Glowing Center Line */}
        <div className="absolute left-4 sm:left-1/2 top-4 bottom-4 -translate-x-1/2 w-0.5 bg-gradient-to-b from-rose-500/80 via-pink-500/50 to-purple-500/20" />

        <div className="space-y-8 sm:space-y-12">
          {timeline.map((item, idx) => {
            const isOpen = !!openItems[item.id];
            const isEven = idx % 2 === 0;

            return (
              <div
                key={item.id}
                className={`relative flex flex-col sm:flex-row items-start ${
                  isEven ? 'sm:flex-row-reverse' : ''
                }`}
              >
                {/* Checkpoint Dot */}
                <div
                  onClick={() => toggleItem(item.id)}
                  className="absolute left-4 sm:left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-[#16081e] border-2 border-rose-400 shadow-[0_0_12px_rgba(244,63,94,0.6)] flex items-center justify-center cursor-pointer hover:scale-110 transition-transform z-10"
                >
                  <Heart className={`w-3.5 h-3.5 ${isOpen ? 'fill-rose-500 text-rose-500' : 'text-rose-300'}`} />
                </div>

                {/* Content Card */}
                <div
                  className={`ml-12 sm:ml-0 w-full sm:w-[calc(50%-2.5rem)] cursor-pointer group`}
                  onClick={() => toggleItem(item.id)}
                >
                  <div className="rounded-2xl p-5 sm:p-6 bg-gradient-to-br from-[#1c0c24] to-[#12071a] border border-rose-900/40 hover:border-rose-500/40 shadow-lg hover:shadow-[0_0_25px_rgba(244,63,94,0.15)] transition-all duration-300">
                    {/* Header info */}
                    <div className="flex items-center justify-between gap-2 mb-2 text-xs">
                      <div className="flex items-center gap-1.5 text-rose-400 font-medium">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{item.date}</span>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-rose-950/60 border border-rose-800/30 text-[11px] text-rose-300">
                        {item.tag}
                      </span>
                    </div>

                    {/* Title & Chevron */}
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-serif text-lg sm:text-xl font-bold text-rose-100 group-hover:text-white transition-colors">
                        {item.title}
                      </h3>
                      <button
                        type="button"
                        aria-label={isOpen ? 'Collapse story' : 'Read story'}
                        className="p-1 rounded-full text-rose-400 group-hover:bg-rose-900/30 transition-colors"
                      >
                        {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>

                    {/* Expandable Story Description */}
                    {isOpen && (
                      <div className="mt-3 pt-3 border-t border-rose-900/20 text-rose-200/90 text-sm leading-relaxed font-light">
                        <p>{item.story}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
