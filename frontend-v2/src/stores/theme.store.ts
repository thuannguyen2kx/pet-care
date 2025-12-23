import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { STORAGE_KEYS } from '@/shared/constant';
import type { TTheme } from '@/shared/types';

interface ThemeState {
  theme: TTheme;
  isDark: boolean;
  setTheme: (theme: TTheme) => void;
  toggleDarkMode: () => void;
  setDarkMode: (isDark: boolean) => void;
}

const _html = document.documentElement;

const applyTheme = (theme: TTheme, isDark: boolean) => {
  _html.dataset.theme = theme;
  _html.classList.toggle('dark', isDark);
};

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: 'customer',
      isDark: false,

      setTheme: (theme) => {
        const { isDark } = get();
        applyTheme(theme, isDark);
        set({ theme });
      },

      toggleDarkMode: () => {
        const { theme, isDark } = get();
        const newIsDark = !isDark;
        applyTheme(theme, newIsDark);
        set({ isDark: newIsDark });
      },

      setDarkMode: (isDark) => {
        const { theme } = get();
        applyTheme(theme, isDark);
        set({ isDark });
      },
    }),
    {
      name: STORAGE_KEYS.THEME_SETTINGS,
      onRehydrateStorage: () => (state) => {
        if (state) {
          applyTheme(state.theme, state.isDark);
        }
      },
    },
  ),
);
