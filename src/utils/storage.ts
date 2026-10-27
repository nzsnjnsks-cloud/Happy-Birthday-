import { SurpriseData } from '../types/index.ts';
import { DEFAULT_SURPRISE_DATA } from './defaults.ts';

const LOCAL_STORAGE_KEY = 'romantic_birthday_surprise_data_v1';
const DB_NAME = 'RomanticBirthdayDB';
const DB_VERSION = 1;
const STORE_NAME = 'photos';

// Open IndexedDB safely with fallback
function openDB(): Promise<IDBDatabase | null> {
  if (typeof window === 'undefined' || !window.indexedDB) {
    return Promise.resolve(null);
  }
  return new Promise((resolve) => {
    try {
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      request.onerror = () => resolve(null);
      request.onsuccess = () => resolve(request.result);
      request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        }
      };
    } catch {
      resolve(null);
    }
  });
}

// Store a large photo in IndexedDB (so images don't exceed localStorage 5MB limit)
export async function savePhotoToStorage(id: string, dataUrl: string): Promise<void> {
  const db = await openDB();
  if (db) {
    return new Promise((resolve) => {
      try {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        store.put({ id, dataUrl, updatedAt: Date.now() });
        tx.oncomplete = () => resolve();
        tx.onerror = () => resolve();
      } catch {
        resolve();
      }
    });
  }
  // Fallback to localStorage if IndexedDB is unavailable
  try {
    localStorage.setItem(`photo_${id}`, dataUrl);
  } catch {
    console.warn('Storage quota exceeded');
  }
}

export async function getPhotoFromStorage(id: string): Promise<string | null> {
  const db = await openDB();
  if (db) {
    return new Promise((resolve) => {
      try {
        const tx = db.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const req = store.get(id);
        req.onsuccess = () => {
          resolve(req.result ? req.result.dataUrl : null);
        };
        req.onerror = () => resolve(null);
      } catch {
        resolve(null);
      }
    });
  }
  try {
    return localStorage.getItem(`photo_${id}`);
  } catch {
    return null;
  }
}

export async function removePhotoFromStorage(id: string): Promise<void> {
  const db = await openDB();
  if (db) {
    return new Promise((resolve) => {
      try {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        store.delete(id);
        tx.oncomplete = () => resolve();
        tx.onerror = () => resolve();
      } catch {
        resolve();
      }
    });
  }
  try {
    localStorage.removeItem(`photo_${id}`);
  } catch {
    // Ignore
  }
}

// Load Surprise Data, merging with IndexedDB photos
export async function loadSurpriseData(): Promise<SurpriseData> {
  let baseData = DEFAULT_SURPRISE_DATA;

  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        const birthdayDate = parsed.birthdayDate === '2026-10-27' ? '2026-10-28' : (parsed.birthdayDate || DEFAULT_SURPRISE_DATA.birthdayDate);
        baseData = {
          ...DEFAULT_SURPRISE_DATA,
          ...parsed,
          birthdayDate,
          photos: DEFAULT_SURPRISE_DATA.photos.map((defaultPhoto, idx) => {
            const savedPhoto = parsed.photos?.[idx] || parsed.photos?.find((p: { id: string }) => p.id === defaultPhoto.id);
            return savedPhoto ? { ...defaultPhoto, ...savedPhoto } : defaultPhoto;
          }),
        };
      }
    } catch {
      // Use defaults if parse fails
    }
  }

  // Hydrate photo URLs from storage
  const hydratedPhotos = await Promise.all(
    baseData.photos.map(async (photo) => {
      let photoUrl =
        photo.imageUrl &&
        photo.imageUrl !== 'STORED_IN_IDB' &&
        photo.imageUrl !== 'STORED_IN_STORAGE'
          ? photo.imageUrl
          : null;
      if (!photoUrl) {
        photoUrl = await getPhotoFromStorage(photo.id);
      }
      if (!photoUrl && typeof window !== 'undefined') {
        try {
          photoUrl = localStorage.getItem(`photo_${photo.id}`);
        } catch {
          // Ignore
        }
      }
      return {
        ...photo,
        imageUrl: photoUrl || null,
      };
    })
  );

  return {
    ...baseData,
    photos: hydratedPhotos,
  };
}

// Save text configuration to LocalStorage and photos to IndexedDB
export async function saveSurpriseData(data: SurpriseData): Promise<void> {
  if (typeof window === 'undefined') return;

  // Save each photo to IndexedDB and localStorage
  await Promise.all(
    data.photos.map(async (photo) => {
      if (photo.imageUrl) {
        await savePhotoToStorage(photo.id, photo.imageUrl);
        try {
          localStorage.setItem(`photo_${photo.id}`, photo.imageUrl);
        } catch {
          // Ignore quota if any
        }
      } else {
        await removePhotoFromStorage(photo.id);
        try {
          localStorage.removeItem(`photo_${photo.id}`);
        } catch {
          // Ignore
        }
      }
    })
  );

  // To protect localStorage from hitting the 5MB browser quota limit:
  // If an image is a data URL (base64), store it in IndexedDB and in its own item `photo_${id}`,
  // but in LOCAL_STORAGE_KEY store 'STORED_IN_STORAGE' (or preserve direct https URLs).
  const sanitizedPhotosForLocalStorage = data.photos.map((p) => ({
    ...p,
    imageUrl: p.imageUrl
      ? (p.imageUrl.startsWith('data:') ? 'STORED_IN_STORAGE' : p.imageUrl)
      : null,
  }));

  try {
    localStorage.setItem(
      LOCAL_STORAGE_KEY,
      JSON.stringify({ ...data, photos: sanitizedPhotosForLocalStorage })
    );
  } catch (err) {
    console.warn('LocalStorage save failed:', err);
  }
}

// Export configuration as a readable JSON string
export function exportConfiguration(data: SurpriseData): string {
  return JSON.stringify(data, null, 2);
}

// Validate & Import configuration
export function importConfiguration(jsonStr: string): SurpriseData | null {
  try {
    const parsed = JSON.parse(jsonStr);
    if (!parsed || typeof parsed !== 'object') return null;
    return {
      ...DEFAULT_SURPRISE_DATA,
      ...parsed,
    };
  } catch {
    return null;
  }
}

// Reset everything to default
export async function resetToDefaults(): Promise<SurpriseData> {
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      for (const photo of DEFAULT_SURPRISE_DATA.photos) {
        await removePhotoFromStorage(photo.id);
      }
    } catch {
      // Ignore
    }
  }
  return { ...DEFAULT_SURPRISE_DATA };
}
