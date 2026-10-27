export interface PhotoCard {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string | null;
  date?: string;
  note?: string;
}

export interface TimelineMilestone {
  id: string;
  date: string;
  title: string;
  story: string;
  tag: string;
}

export interface LoveReason {
  id: string;
  title: string;
  detail: string;
  iconType: string;
}

export interface SurpriseData {
  girlfriendName: string;
  girlfriendNickname: string;
  partnerName: string;
  birthdayDate: string;
  heroHeading: string;
  heroSubtitle: string;
  photos: PhotoCard[];
  loveLetter: {
    salutation: string;
    paragraphs: string[];
    closing: string;
    signature: string;
  };
  timeline: TimelineMilestone[];
  cakeWishMessage: string;
  cakeFlavor: string;
  reasons: LoveReason[];
  finalQuote: string;
  finalMessage: string;
  selectedMusicPreset: 'piano' | 'acoustic' | 'ambient' | 'custom';
  customAudioName?: string;
}
