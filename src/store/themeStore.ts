import { create } from 'zustand';

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeState {
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  themeMode: 'light',

  setThemeMode: (mode) => set({ themeMode: mode }),

  toggleTheme: () => {
    const current = get().themeMode;
    set({ themeMode: current === 'dark' ? 'light' : 'dark' });
  },
}));
