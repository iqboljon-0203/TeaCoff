'use client';

import React, { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { useThemeStore } from '@/store/useThemeStore';

export function ThemeToggle({ className = '' }: { className?: string }) {
  const { theme, toggleTheme } = useThemeStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Apply persisted theme class to html root
    document.documentElement.classList.remove('dark', 'light');
    document.documentElement.classList.add(theme);
  }, [theme]);

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className={`relative p-2 rounded-full border border-border bg-card/60 hover:bg-secondary transition-all duration-200 text-foreground hover:text-brand-lime flex items-center justify-center ${className}`}
    >
      {mounted ? (
        theme === 'dark' ? (
          <Sun className="w-4 h-4 text-brand-lime transition-transform hover:rotate-45" />
        ) : (
          <Moon className="w-4 h-4 text-foreground transition-transform hover:-rotate-12" />
        )
      ) : (
        <span className="w-4 h-4" />
      )}
    </button>
  );
}
