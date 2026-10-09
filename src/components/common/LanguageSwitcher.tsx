'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { ChevronDown, Check } from 'lucide-react';
import { usePathname, useRouter } from '@/i18n/routing';

const FLAG_ICONS = {
  ru: (
    <svg className="w-4 h-3 rounded-[2px] overflow-hidden shadow-xs shrink-0" viewBox="0 0 640 480" aria-hidden="true">
      <g fillRule="evenodd" strokeWidth="1pt">
        <path fill="#fff" d="M0 0h640v160H0z"/>
        <path fill="#0039a6" d="M0 160h640v160H0z"/>
        <path fill="#d52b1e" d="M0 320h640v160H0z"/>
      </g>
    </svg>
  ),
  uz: (
    <svg className="w-4 h-3 rounded-[2px] overflow-hidden shadow-xs shrink-0" viewBox="0 0 640 480" aria-hidden="true">
      <path fill="#1eb53a" d="M0 320h640v160H0z"/>
      <path fill="#0099b5" d="M0 0h640v160H0z"/>
      <path fill="#ce1126" d="M0 150h640v180H0z"/>
      <path fill="#fff" d="M0 160h640v160H0z"/>
      <circle cx="80" cy="80" r="45" fill="#fff"/>
      <circle cx="95" cy="80" r="40" fill="#0099b5"/>
    </svg>
  ),
  en: (
    <svg className="w-4 h-3 rounded-[2px] overflow-hidden shadow-xs shrink-0" viewBox="0 0 640 480" aria-hidden="true">
      <path fill="#012169" d="M0 0h640v480H0z"/>
      <path stroke="#fff" strokeWidth="60" d="m0 0 640 480M640 0 0 480"/>
      <path stroke="#c8102e" strokeWidth="40" d="m0 0 640 480M640 0 0 480"/>
      <path stroke="#fff" strokeWidth="100" d="M320 0v480M0 240h640"/>
      <path stroke="#c8102e" strokeWidth="60" d="M320 0v480M0 240h640"/>
    </svg>
  ),
};

const LANGUAGES = [
  { code: 'ru', label: 'Русский', short: 'RU' },
  { code: 'uz', label: "O'zbekcha", short: 'UZ' },
  { code: 'en', label: 'English', short: 'EN' },
] as const;

export function LanguageSwitcher({ className = '' }: { className?: string }) {
  const currentLocale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const activeLang = LANGUAGES.find((l) => l.code === currentLocale) || LANGUAGES[0];

  const handleLocaleChange = (newLocale: 'ru' | 'uz' | 'en') => {
    setIsOpen(false);
    if (newLocale === currentLocale) return;
    router.replace(pathname, { locale: newLocale });
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className={`relative inline-block text-left ${className}`}>
      {/* Trigger Button with Flag */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Select language"
        aria-expanded={isOpen}
        className="flex items-center space-x-2 py-1.5 px-3 rounded-full border border-border bg-card/70 hover:bg-secondary text-foreground hover:text-brand-lime transition-all duration-200 text-xs font-bold uppercase tracking-wider shadow-sm select-none"
      >
        {FLAG_ICONS[activeLang.code as keyof typeof FLAG_ICONS]}
        <span>{activeLang.short}</span>
        <ChevronDown
          className={`w-3.5 h-3.5 opacity-60 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-40 rounded-xl bg-card border border-border shadow-2xl p-1.5 z-50 animate-in fade-in zoom-in-95 backdrop-blur-md">
          {LANGUAGES.map((lang) => {
            const isActive = currentLocale === lang.code;
            return (
              <button
                key={lang.code}
                type="button"
                onClick={() => handleLocaleChange(lang.code)}
                className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-lg transition-colors text-left ${
                  isActive
                    ? 'bg-primary/15 text-foreground font-bold'
                    : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  {FLAG_ICONS[lang.code as keyof typeof FLAG_ICONS]}
                  <span>{lang.label}</span>
                </div>
                {isActive && <Check className="w-3.5 h-3.5 text-brand-lime stroke-[2.5]" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
