import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Theme = 'dark' | 'light';

interface ThemeState {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: 'dark', // Dark mode is default to match mockup
      toggleTheme: () =>
        set((state) => {
          const newTheme = state.theme === 'dark' ? 'light' : 'dark';
          if (typeof document !== 'undefined') {
            document.documentElement.classList.remove('dark', 'light');
            document.documentElement.classList.add(newTheme);
          }
          return { theme: newTheme };
        }),
      setTheme: (theme) => {
        if (typeof document !== 'undefined') {
          document.documentElement.classList.remove('dark', 'light');
          document.documentElement.classList.add(theme);
        }
        set({ theme });
      },
    }),
    {
      name: 'teacoff-theme-storage',
    }
  )
);
