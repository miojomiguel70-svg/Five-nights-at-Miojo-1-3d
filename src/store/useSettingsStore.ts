import { create } from 'zustand';
import { Language } from '../translations';

export type Platform = 'pc' | 'mobile';

interface SettingsStore {
  language: Language;
  platform: Platform;
  setLanguage: (lang: Language) => void;
  setPlatform: (platform: Platform) => void;
  isSettingsOpen: boolean;
  setSettingsOpen: (open: boolean) => void;
  saveSettings: () => void;
}

const STORAGE_KEY = 'miojo_settings_v1';

const getInitialSettings = () => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error('Failed to parse settings', e);
    }
  }
  return {
    language: 'en' as Language,
    platform: 'mobile' as Platform,
  };
};

const initial = getInitialSettings();

export const useSettingsStore = create<SettingsStore>((set, get) => ({
  language: initial.language,
  platform: initial.platform,
  setLanguage: (lang) => set({ language: lang }),
  setPlatform: (platform) => set({ platform }),
  isSettingsOpen: false,
  setSettingsOpen: (open) => set({ isSettingsOpen: open }),
  saveSettings: () => {
    const { language, platform } = get();
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ language, platform }));
  },
}));
