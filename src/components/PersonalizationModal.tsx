import React, { useState } from 'react';
import { SurpriseData } from '../types/index.ts';
import {
  X,
  Save,
  RotateCcw,
  Download,
  Upload,
  Check,
  User,
  Heart,
  Calendar,
  Image as ImageIcon,
  BookOpen,
  Cake,
  FileText,
} from 'lucide-react';
import { exportConfiguration, importConfiguration } from '../utils/storage.ts';
import { compressImage } from '../utils/imageCompressor.ts';

interface PersonalizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: SurpriseData;
  onSave: (newData: SurpriseData) => void;
  onReset: () => void;
}

export const PersonalizationModal: React.FC<PersonalizationModalProps> = ({
  isOpen,
  onClose,
  data,
  onSave,
  onReset,
}) => {
  const [formData, setFormData] = useState<SurpriseData>({ ...data });
  const [activeTab, setActiveTab] = useState<'basics' | 'letter' | 'photos' | 'timeline' | 'reasons' | 'cake' | 'backup'>('basics');
  const [copied, setCopied] = useState(false);
  const [importJson, setImportJson] = useState('');
  const [importError, setImportError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  const handleExportCopy = () => {
    const json = exportConfiguration(formData);
    navigator.clipboard.writeText(json);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportDownload = () => {
    const json = exportConfiguration(formData);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `romantic-birthday-${formData.girlfriendName.toLowerCase() || 'surprise'}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportSubmit = () => {
    setImportError(null);
    const result = importConfiguration(importJson);
    if (result) {
      setFormData(result);
      onSave(result);
      alert('Configuration successfully loaded and saved!');
    } else {
      setImportError('Invalid JSON format. Please paste valid configuration data.');
    }
  };

  const handleResetConfirm = () => {
    if (window.confirm('Reset all text, timeline, reasons, and photos to original defaults? This cannot be undone.')) {
      onReset();
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative max-w-4xl w-full bg-[#160a20] border border-rose-900/60 rounded-3xl shadow-[0_20px_70px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col my-auto max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-rose-900/40 bg-[#12071a]">
          <div>
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
              <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
              <span>Personalize Her Birthday Surprise</span>
            </h3>
            <p className="text-xs text-rose-300/70 mt-0.5">
              Customize every heartfelt detail. Changes are saved directly in your browser.
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close settings"
            className="p-2 rounded-xl bg-rose-950/60 border border-rose-800/40 text-rose-300 hover:text-white hover:bg-rose-900/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 overflow-x-auto p-2 sm:px-6 bg-[#0f0516] border-b border-rose-900/30 text-xs scrollbar-none">
          {[
            { id: 'basics', label: 'Basics & Names', icon: User },
            { id: 'letter', label: 'Love Letter', icon: FileText },
            { id: 'photos', label: '5 Photos', icon: ImageIcon },
            { id: 'timeline', label: 'Our Story', icon: BookOpen },
            { id: 'reasons', label: 'Reasons', icon: Heart },
            { id: 'cake', label: 'Cake & Climax', icon: Cake },
            { id: 'backup', label: 'Backup & Reset', icon: Download },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl whitespace-nowrap font-medium transition-all ${
                  isActive
                    ? 'bg-rose-600/30 text-rose-200 border border-rose-500/40 shadow-sm'
                    : 'text-rose-400/70 hover:text-rose-200 hover:bg-rose-950/40'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1 text-sm text-rose-100">
          {/* TAB 1: BASICS */}
          {activeTab === 'basics' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-rose-300 mb-1">
                    Girlfriend's Name (e.g., Sophia)
                  </label>
                  <input
                    type="text"
                    value={formData.girlfriendName}
                    onChange={(e) => setFormData({ ...formData, girlfriendName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0d0414] border border-rose-900/50 text-white focus:outline-none focus:border-rose-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-rose-300 mb-1">
                    Her Pet Name / Nickname (e.g., My Sunshine)
                  </label>
                  <input
                    type="text"
                    value={formData.girlfriendNickname}
                    onChange={(e) => setFormData({ ...formData, girlfriendNickname: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0d0414] border border-rose-900/50 text-white focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-rose-300 mb-1">
                    Your Name / Signature (e.g., Liam)
                  </label>
                  <input
                    type="text"
                    value={formData.partnerName}
                    onChange={(e) => setFormData({ ...formData, partnerName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0d0414] border border-rose-900/50 text-white focus:outline-none focus:border-rose-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-rose-300 mb-1">
                    Birthday Date
                  </label>
                  <input
                    type="date"
                    value={formData.birthdayDate}
                    onChange={(e) => setFormData({ ...formData, birthdayDate: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0d0414] border border-rose-900/50 text-white focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-rose-300 mb-1">
                  Main Headline (Landing Page)
                </label>
                <input
                  type="text"
                  value={formData.heroHeading}
                  onChange={(e) => setFormData({ ...formData, heroHeading: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0d0414] border border-rose-900/50 text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-rose-300 mb-1">
                  Landing Subtitle
                </label>
                <textarea
                  rows={2}
                  value={formData.heroSubtitle}
                  onChange={(e) => setFormData({ ...formData, heroSubtitle: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0d0414] border border-rose-900/50 text-white focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>
          )}

          {/* TAB 2: LOVE LETTER */}
          {activeTab === 'letter' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-rose-300 mb-1">
                  Salutation
                </label>
                <input
                  type="text"
                  value={formData.loveLetter.salutation}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      loveLetter: { ...formData.loveLetter, salutation: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0d0414] border border-rose-900/50 text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              {formData.loveLetter.paragraphs.map((p, idx) => (
                <div key={idx}>
                  <label className="block text-xs font-semibold text-rose-300 mb-1">
                    Paragraph #{idx + 1}
                  </label>
                  <textarea
                    rows={3}
                    value={p}
                    onChange={(e) => {
                      const newParas = [...formData.loveLetter.paragraphs];
                      newParas[idx] = e.target.value;
                      setFormData({
                        ...formData,
                        loveLetter: { ...formData.loveLetter, paragraphs: newParas },
                      });
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0d0414] border border-rose-900/50 text-white focus:outline-none focus:border-rose-500"
                  />
                </div>
              ))}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-rose-300 mb-1">
                    Letter Sign-Off (Closing)
                  </label>
                  <input
                    type="text"
                    value={formData.loveLetter.closing}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        loveLetter: { ...formData.loveLetter, closing: e.target.value },
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0d0414] border border-rose-900/50 text-white focus:outline-none focus:border-rose-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-rose-300 mb-1">
                    Signature
                  </label>
                  <input
                    type="text"
                    value={formData.loveLetter.signature}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        loveLetter: { ...formData.loveLetter, signature: e.target.value },
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0d0414] border border-rose-900/50 text-white focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: 5 PHOTO SPACES */}
          {activeTab === 'photos' && (
            <div className="space-y-4">
              <p className="text-xs text-rose-300/80">
                Customize titles and subtitles for each of the 5 photo spaces. You can also upload photos directly here or on the main page.
              </p>

              {formData.photos.map((photo, idx) => (
                <div key={photo.id} className="p-4 rounded-2xl bg-[#0d0414] border border-rose-900/40 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-serif font-bold text-rose-300 text-sm">
                      Photo Space #{idx + 1}
                    </span>
                    <span className="text-xs text-rose-400/70">
                      {photo.imageUrl ? 'Photo Uploaded ✓' : 'Empty Placeholder'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-medium text-rose-300/90 mb-1">
                        Title
                      </label>
                      <input
                        type="text"
                        value={photo.title}
                        onChange={(e) => {
                          const updated = [...formData.photos];
                          updated[idx] = { ...photo, title: e.target.value };
                          setFormData({ ...formData, photos: updated });
                        }}
                        className="w-full px-3 py-2 rounded-lg bg-[#160a20] border border-rose-900/50 text-white text-xs focus:outline-none focus:border-rose-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-rose-300/90 mb-1">
                        Subtitle / Memory Note
                      </label>
                      <input
                        type="text"
                        value={photo.subtitle}
                        onChange={(e) => {
                          const updated = [...formData.photos];
                          updated[idx] = { ...photo, subtitle: e.target.value };
                          setFormData({ ...formData, photos: updated });
                        }}
                        className="w-full px-3 py-2 rounded-lg bg-[#160a20] border border-rose-900/50 text-white text-xs focus:outline-none focus:border-rose-500"
                      />
                    </div>
                  </div>

                  {/* Photo file upload or direct URL */}
                  <div className="pt-2 border-t border-rose-900/30 flex flex-col sm:flex-row items-start sm:items-center gap-3">
                    {photo.imageUrl ? (
                      <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-rose-500/40 shrink-0">
                        <img
                          src={photo.imageUrl}
                          alt={photo.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-16 h-16 rounded-xl border border-dashed border-rose-900/60 flex items-center justify-center text-rose-500/40 shrink-0 bg-[#160a20]">
                        <ImageIcon className="w-6 h-6" />
                      </div>
                    )}

                    <div className="flex-1 space-y-2 w-full">
                      <div className="flex items-center gap-2">
                        <label className="px-3 py-1.5 rounded-lg bg-rose-600/30 border border-rose-500/40 text-rose-200 text-xs hover:bg-rose-600 hover:text-white cursor-pointer transition-colors flex items-center gap-1.5">
                          <Upload className="w-3.5 h-3.5" />
                          <span>Choose File</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                try {
                                  const compressed = await compressImage(file);
                                  const updated = [...formData.photos];
                                  updated[idx] = { ...photo, imageUrl: compressed };
                                  setFormData({ ...formData, photos: updated });
                                } catch (err) {
                                  alert('Could not process image.');
                                }
                              }
                            }}
                          />
                        </label>

                        {photo.imageUrl && (
                          <button
                            type="button"
                            onClick={() => {
                              const updated = [...formData.photos];
                              updated[idx] = { ...photo, imageUrl: null };
                              setFormData({ ...formData, photos: updated });
                            }}
                            className="px-2.5 py-1.5 rounded-lg bg-red-950/40 border border-red-800/40 text-rose-300 hover:text-white text-xs"
                          >
                            Remove
                          </button>
                        )}
                      </div>

                      <div>
                        <input
                          type="url"
                          placeholder="Or paste image URL (https://...)"
                          value={photo.imageUrl && !photo.imageUrl.startsWith('data:') ? photo.imageUrl : ''}
                          onChange={(e) => {
                            const val = e.target.value.trim();
                            const updated = [...formData.photos];
                            updated[idx] = { ...photo, imageUrl: val || null };
                            setFormData({ ...formData, photos: updated });
                          }}
                          className="w-full px-3 py-1.5 rounded-lg bg-[#160a20] border border-rose-900/50 text-white text-xs"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 4: OUR STORY TIMELINE */}
          {activeTab === 'timeline' && (
            <div className="space-y-4">
              <p className="text-xs text-rose-300/80">
                Edit the 5 milestone stories that narrate your journey together.
              </p>

              {formData.timeline.map((item, idx) => (
                <div key={item.id} className="p-4 rounded-2xl bg-[#0d0414] border border-rose-900/40 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-medium text-rose-300/90 mb-1">
                        Date / Chapter
                      </label>
                      <input
                        type="text"
                        value={item.date}
                        onChange={(e) => {
                          const updated = [...formData.timeline];
                          updated[idx] = { ...item, date: e.target.value };
                          setFormData({ ...formData, timeline: updated });
                        }}
                        className="w-full px-3 py-2 rounded-lg bg-[#160a20] border border-rose-900/50 text-white text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-rose-300/90 mb-1">
                        Milestone Title
                      </label>
                      <input
                        type="text"
                        value={item.title}
                        onChange={(e) => {
                          const updated = [...formData.timeline];
                          updated[idx] = { ...item, title: e.target.value };
                          setFormData({ ...formData, timeline: updated });
                        }}
                        className="w-full px-3 py-2 rounded-lg bg-[#160a20] border border-rose-900/50 text-white text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-rose-300/90 mb-1">
                        Tag Badge
                      </label>
                      <input
                        type="text"
                        value={item.tag}
                        onChange={(e) => {
                          const updated = [...formData.timeline];
                          updated[idx] = { ...item, tag: e.target.value };
                          setFormData({ ...formData, timeline: updated });
                        }}
                        className="w-full px-3 py-2 rounded-lg bg-[#160a20] border border-rose-900/50 text-white text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-rose-300/90 mb-1">
                      Romantic Story
                    </label>
                    <textarea
                      rows={2}
                      value={item.story}
                      onChange={(e) => {
                        const updated = [...formData.timeline];
                        updated[idx] = { ...item, story: e.target.value };
                        setFormData({ ...formData, timeline: updated });
                      }}
                      className="w-full px-3 py-2 rounded-lg bg-[#160a20] border border-rose-900/50 text-white text-xs"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 5: LOVE REASONS */}
          {activeTab === 'reasons' && (
            <div className="space-y-4">
              <p className="text-xs text-rose-300/80">
                Personalize each of the 12 reasons why you adore her.
              </p>

              <div className="space-y-3">
                {formData.reasons.map((reason, idx) => (
                  <div key={reason.id} className="p-3 rounded-xl bg-[#0d0414] border border-rose-900/40 grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] text-rose-400 font-semibold mb-1">
                        Reason #{idx + 1} Title
                      </label>
                      <input
                        type="text"
                        value={reason.title}
                        onChange={(e) => {
                          const updated = [...formData.reasons];
                          updated[idx] = { ...reason, title: e.target.value };
                          setFormData({ ...formData, reasons: updated });
                        }}
                        className="w-full px-3 py-1.5 rounded-lg bg-[#160a20] border border-rose-900/50 text-white text-xs"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-[11px] text-rose-400 font-semibold mb-1">
                        Romantic Detail
                      </label>
                      <input
                        type="text"
                        value={reason.detail}
                        onChange={(e) => {
                          const updated = [...formData.reasons];
                          updated[idx] = { ...reason, detail: e.target.value };
                          setFormData({ ...formData, reasons: updated });
                        }}
                        className="w-full px-3 py-1.5 rounded-lg bg-[#160a20] border border-rose-900/50 text-white text-xs"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: CAKE & CLIMAX */}
          {activeTab === 'cake' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-rose-300 mb-1">
                  Cake Flavor Description
                </label>
                <input
                  type="text"
                  value={formData.cakeFlavor}
                  onChange={(e) => setFormData({ ...formData, cakeFlavor: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0d0414] border border-rose-900/50 text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-rose-300 mb-1">
                  Birthday Wish Message (Revealed after candles are blown)
                </label>
                <textarea
                  rows={3}
                  value={formData.cakeWishMessage}
                  onChange={(e) => setFormData({ ...formData, cakeWishMessage: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0d0414] border border-rose-900/50 text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-rose-300 mb-1">
                  Final Section Quote
                </label>
                <input
                  type="text"
                  value={formData.finalQuote}
                  onChange={(e) => setFormData({ ...formData, finalQuote: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0d0414] border border-rose-900/50 text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-rose-300 mb-1">
                  Final Romantic Surprise Declaration
                </label>
                <textarea
                  rows={4}
                  value={formData.finalMessage}
                  onChange={(e) => setFormData({ ...formData, finalMessage: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0d0414] border border-rose-900/50 text-white focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>
          )}

          {/* TAB 7: BACKUP & RESET */}
          {activeTab === 'backup' && (
            <div className="space-y-6">
              <div className="p-4 rounded-2xl bg-[#0d0414] border border-rose-900/40 space-y-3">
                <h4 className="font-serif font-bold text-rose-200 text-base flex items-center gap-2">
                  <Download className="w-4 h-4 text-rose-400" />
                  <span>Backup Configuration (Export)</span>
                </h4>
                <p className="text-xs text-rose-300/70">
                  Save your personalized messages and configuration so you can back it up or move to another device.
                </p>
                <div className="flex flex-wrap gap-3 pt-1">
                  <button
                    onClick={handleExportCopy}
                    className="px-4 py-2 rounded-xl bg-rose-600/30 border border-rose-500/40 text-rose-200 hover:bg-rose-600 hover:text-white text-xs font-medium flex items-center gap-1.5 transition-all"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Download className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied to Clipboard!' : 'Copy Config JSON'}</span>
                  </button>
                  <button
                    onClick={handleExportDownload}
                    className="px-4 py-2 rounded-xl bg-purple-600/30 border border-purple-500/40 text-purple-200 hover:bg-purple-600 hover:text-white text-xs font-medium flex items-center gap-1.5 transition-all"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download .JSON File</span>
                  </button>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#0d0414] border border-rose-900/40 space-y-3">
                <h4 className="font-serif font-bold text-rose-200 text-base flex items-center gap-2">
                  <Upload className="w-4 h-4 text-rose-400" />
                  <span>Restore Configuration (Import)</span>
                </h4>
                <p className="text-xs text-rose-300/70">
                  Paste previously exported JSON configuration to load it into the website.
                </p>
                <textarea
                  rows={3}
                  value={importJson}
                  onChange={(e) => setImportJson(e.target.value)}
                  placeholder="Paste JSON configuration here..."
                  className="w-full px-3 py-2 rounded-xl bg-[#160a20] border border-rose-900/50 text-white text-xs font-mono"
                />
                {importError && <p className="text-xs text-red-400">{importError}</p>}
                <button
                  onClick={handleImportSubmit}
                  disabled={!importJson.trim()}
                  className="px-4 py-2 rounded-xl bg-rose-600 text-white hover:bg-rose-500 disabled:opacity-40 text-xs font-medium transition-all"
                >
                  Apply Imported Configuration
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-red-950/20 border border-red-900/40 space-y-2">
                <h4 className="font-serif font-bold text-red-200 text-base flex items-center gap-2">
                  <RotateCcw className="w-4 h-4 text-red-400" />
                  <span>Reset All Content</span>
                </h4>
                <p className="text-xs text-red-300/70">
                  Reset everything back to the original sample text and empty photo placeholders.
                </p>
                <button
                  onClick={handleResetConfirm}
                  className="px-4 py-2 rounded-xl bg-red-900/40 border border-red-700/50 text-red-200 hover:bg-red-800 text-xs font-medium transition-all"
                >
                  Reset To Defaults
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 sm:p-6 border-t border-rose-900/40 bg-[#12071a] flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-rose-900/50 text-rose-300 hover:text-white hover:bg-rose-900/20 text-xs sm:text-sm transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-7 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-semibold text-xs sm:text-sm flex items-center gap-2 shadow-lg transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Save & Apply Changes</span>
          </button>
        </div>
      </div>
    </div>
  );
};
