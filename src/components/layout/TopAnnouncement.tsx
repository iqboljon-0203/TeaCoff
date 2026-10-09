'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export function TopAnnouncement() {
  const t = useTranslations('announcement');

  return (
    <aside
      aria-label="Announcement"
      className="w-full bg-[#F6F4EE] dark:bg-[#0E0E10] text-[#4A453F] dark:text-[#9A9AA2] text-[11px] sm:text-xs py-2 px-4 border-b border-black/5 dark:border-white/5 tracking-wider uppercase font-medium transition-colors"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <button aria-label="Previous announcement" className="opacity-50 hover:opacity-100 transition-opacity p-0.5">
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>
        <span className="text-center px-4 truncate font-mono">
          {t('text')}
        </span>
        <button aria-label="Next announcement" className="opacity-50 hover:opacity-100 transition-opacity p-0.5">
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </aside>
  );
}
