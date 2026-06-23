import { create } from 'zustand';

interface AppState {
  availablePages: string[];
  setAvailablePages: (pages: string[]) => void;
  
  globalFilterUrl: string;
  setGlobalFilterUrl: (url: string) => void;
  
  sessionFilterUrl: string;
  setSessionFilterUrl: (url: string) => void;
  
  eventFilterType: string;
  setEventFilterType: (type: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  availablePages: [],
  setAvailablePages: (pages) => set({ availablePages: pages }),
  
  globalFilterUrl: 'all',
  setGlobalFilterUrl: (url) => set({ globalFilterUrl: url }),
  
  sessionFilterUrl: 'all',
  setSessionFilterUrl: (url) => set({ sessionFilterUrl: url }),
  
  eventFilterType: 'all',
  setEventFilterType: (type) => set({ eventFilterType: type }),
}));
