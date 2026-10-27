import React, { useState, useRef } from 'react';
import { PhotoCard } from '../types/index.ts';
import { Upload, X, Eye, Image as ImageIcon, Sparkles, Heart, Link as LinkIcon } from 'lucide-react';
import { compressImage } from '../utils/imageCompressor.ts';

interface MemoryGalleryProps {
  photos: PhotoCard[];
  onUpdatePhoto: (id: string, imageUrl: string | null) => void;
  onOpenSettings: () => void;
}

export const MemoryGallery: React.FC<MemoryGalleryProps> = ({
  photos,
  onUpdatePhoto,
  onOpenSettings,
}) => {
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoCard | null>(null);
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [urlModalPhotoId, setUrlModalPhotoId] = useState<string | null>(null);
  const [imageUrlInput, setImageUrlInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [activeUploadTarget, setActiveUploadTarget] = useState<string | null>(null);

  const handleTriggerUpload = (photoId: string) => {
    setActiveUploadTarget(photoId);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activeUploadTarget) return;

    setUploadingId(activeUploadTarget);
    try {
      // Compress to high-quality lightweight JPEG so it fits reliably in storage
      const compressedDataUrl = await compressImage(file, 1280, 1280, 0.85);
      onUpdatePhoto(activeUploadTarget, compressedDataUrl);
    } catch {
      // Fallback to FileReader if canvas compression fails
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          onUpdatePhoto(activeUploadTarget, reader.result);
        }
      };
      reader.readAsDataURL(file);
    } finally {
      setUploadingId(null);
      setActiveUploadTarget(null);
    }
  };

  const handleApplyUrl = () => {
    if (urlModalPhotoId && imageUrlInput.trim()) {
      onUpdatePhoto(urlModalPhotoId, imageUrlInput.trim());
      setUrlModalPhotoId(null);
      setImageUrlInput('');
    }
  };

  const handleRemovePhoto = (photoId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Remove this photo? You can upload a new one anytime.')) {
      onUpdatePhoto(photoId, null);
    }
  };

  return (
    <section id="memories" className="relative py-20 px-4 sm:px-6 max-w-6xl mx-auto">
      {/* Hidden file input for handling native uploads */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
        aria-label="Upload photo"
      />

      {/* Section Header */}
      <div className="text-center space-y-3 mb-14">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-950/40 border border-rose-800/40 text-rose-300 text-xs">
          <Sparkles className="w-3.5 h-3.5 text-rose-400" />
          <span>Our Beautiful Memories</span>
        </div>
        <h2 className="font-serif text-3xl sm:text-5xl font-bold text-white tracking-tight">
          Captured In Time
        </h2>
        <p className="text-rose-200/80 text-sm sm:text-base max-w-xl mx-auto">
          Every picture holds a thousand unsaid words and memories that make my life infinitely brighter.
        </p>
      </div>

      {/* 5 Photo Cards Bento/Grid Layout */}
      {/* 2 large featured cards on top row, 3 cards on bottom row for beautiful rhythm */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-6 sm:gap-8">
        {photos.map((photo, index) => {
          const isLarge = index === 0 || index === 1;
          const colSpanClass = isLarge ? 'md:col-span-3' : 'md:col-span-2';

          return (
            <div
              key={photo.id}
              className={`group relative rounded-2xl sm:rounded-3xl overflow-hidden border border-rose-900/40 bg-gradient-to-b from-[#1c0c24] to-[#12071a] p-4 flex flex-col justify-between transition-all duration-300 hover:border-rose-500/50 hover:shadow-[0_0_30px_rgba(244,63,94,0.2)] ${colSpanClass}`}
            >
              {/* Photo Display Frame */}
              <div
                onClick={() => photo.imageUrl && setSelectedPhoto(photo)}
                className={`relative w-full rounded-xl sm:rounded-2xl overflow-hidden bg-[#0d0514] border border-rose-900/30 flex items-center justify-center transition-transform duration-300 group-hover:scale-[1.01] ${
                  isLarge ? 'aspect-[4/3] sm:aspect-[16/10]' : 'aspect-square'
                } ${photo.imageUrl ? 'cursor-pointer' : ''}`}
              >
                {photo.imageUrl ? (
                  <>
                    <img
                      src={photo.imageUrl}
                      alt={photo.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedPhoto(photo);
                        }}
                        aria-label={`View ${photo.title} full screen`}
                        className="p-2.5 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white/30 transition-colors"
                        title="View Fullscreen"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleTriggerUpload(photo.id);
                        }}
                        aria-label={`Replace ${photo.title}`}
                        className="p-2.5 rounded-full bg-rose-600/80 backdrop-blur-md text-white hover:bg-rose-500 transition-colors text-xs font-medium flex items-center gap-1"
                        title="Replace Photo"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Replace</span>
                      </button>
                      <button
                        onClick={(e) => handleRemovePhoto(photo.id, e)}
                        aria-label={`Remove photo ${photo.title}`}
                        className="p-2.5 rounded-full bg-red-950/80 backdrop-blur-md text-rose-300 hover:bg-red-800 transition-colors"
                        title="Remove Photo"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </>
                ) : (
                  // Elegant Placeholder with direct Upload action (Never fake photos)
                  <div className="w-full h-full p-6 flex flex-col items-center justify-center text-center space-y-3 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-rose-950/30 to-[#0e0616]">
                    <div className="w-14 h-14 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 group-hover:scale-110 group-hover:bg-rose-500/20 transition-all">
                      <ImageIcon className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-serif text-rose-200 text-sm font-semibold">
                        Photo Space #{index + 1}
                      </p>
                      <p className="text-xs text-rose-300/60 mt-1 max-w-xs">
                        {photo.note || 'Upload your favorite photo here'}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                      <button
                        onClick={() => handleTriggerUpload(photo.id)}
                        disabled={uploadingId === photo.id}
                        className="px-4 py-2 rounded-full bg-rose-600/40 border border-rose-500/50 text-rose-200 hover:bg-rose-600 hover:text-white text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>{uploadingId === photo.id ? 'Optimizing...' : 'Upload Photo'}</span>
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setUrlModalPhotoId(photo.id);
                          setImageUrlInput(photo.imageUrl || '');
                        }}
                        className="px-3 py-2 rounded-full bg-rose-950/50 border border-rose-800/40 text-rose-300 hover:text-white hover:bg-rose-900/50 text-xs font-medium flex items-center gap-1 transition-all"
                        title="Or paste an image URL directly"
                      >
                        <LinkIcon className="w-3 h-3 text-rose-400" />
                        <span>Link</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Index badge */}
                <span className="absolute top-3 left-3 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-[11px] text-rose-200 font-medium">
                  {index + 1} of 5
                </span>
              </div>

              {/* Card Title & Romantic Subtitle */}
              <div className="mt-4 pt-1 space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-rose-100 flex items-center gap-1.5">
                    <span>{photo.title}</span>
                  </h3>
                  {photo.imageUrl && (
                    <span className="text-[11px] text-emerald-400/90 font-medium flex items-center gap-1">
                      <Heart className="w-3 h-3 fill-rose-500 text-rose-500" />
                    </span>
                  )}
                </div>
                <p className="text-xs sm:text-sm text-rose-300/70 leading-relaxed">
                  {photo.subtitle}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Customize Notice */}
      <div className="mt-8 text-center">
        <p className="text-xs text-rose-300/60 inline-flex items-center gap-1.5">
          <span>You can upload and replace photos anytime. They will stay saved on this device.</span>
          <button
            onClick={onOpenSettings}
            className="text-rose-400 underline hover:text-rose-300 font-medium ml-1"
          >
            Manage Titles & Notes
          </button>
        </p>
      </div>

      {/* Fullscreen Lightbox Modal */}
      {selectedPhoto && selectedPhoto.imageUrl && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <div
            className="relative max-w-4xl max-h-[90vh] w-full bg-[#12071a] border border-rose-900/50 rounded-2xl overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b border-rose-900/30">
              <h4 className="font-serif text-lg font-bold text-rose-100">
                {selectedPhoto.title}
              </h4>
              <button
                onClick={() => setSelectedPhoto(null)}
                aria-label="Close photo preview"
                className="p-1.5 rounded-lg bg-rose-950/40 text-rose-300 hover:text-white hover:bg-rose-900/40"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 flex items-center justify-center bg-black/60 p-2 overflow-hidden">
              <img
                src={selectedPhoto.imageUrl}
                alt={selectedPhoto.title}
                className="max-h-[70vh] w-auto max-w-full object-contain rounded-lg"
              />
            </div>
            <div className="p-4 bg-[#160a20] border-t border-rose-900/30 flex items-center justify-between">
              <p className="text-xs text-rose-300/80">{selectedPhoto.subtitle}</p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setSelectedPhoto(null);
                    handleTriggerUpload(selectedPhoto.id);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-rose-600/30 border border-rose-500/40 text-rose-200 text-xs hover:bg-rose-600 hover:text-white flex items-center gap-1.5"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Replace File</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Paste Image URL Modal */}
      {urlModalPhotoId && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setUrlModalPhotoId(null)}
        >
          <div
            className="relative max-w-md w-full bg-[#160a20] border border-rose-800/60 rounded-2xl p-5 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h4 className="font-serif font-bold text-rose-100 text-base flex items-center gap-2">
                <LinkIcon className="w-4 h-4 text-rose-400" />
                <span>Paste Photo Link</span>
              </h4>
              <button
                onClick={() => setUrlModalPhotoId(null)}
                className="p-1 rounded text-rose-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-rose-300/80">
              Paste any online image URL (e.g., from Imgur, Google Photos, or Cloudinary) for this photo space:
            </p>
            <input
              type="url"
              value={imageUrlInput}
              onChange={(e) => setImageUrlInput(e.target.value)}
              placeholder="https://example.com/photo.jpg"
              className="w-full px-3 py-2 rounded-xl bg-[#0d0414] border border-rose-900/50 text-white text-xs focus:outline-none focus:border-rose-500"
              autoFocus
            />
            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                onClick={() => setUrlModalPhotoId(null)}
                className="px-3 py-1.5 rounded-lg border border-rose-900/40 text-rose-300 text-xs hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleApplyUrl}
                disabled={!imageUrlInput.trim()}
                className="px-4 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 disabled:opacity-40 text-white font-medium text-xs transition-colors"
              >
                Apply Photo
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
