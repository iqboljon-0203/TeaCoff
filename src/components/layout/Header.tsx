'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { ShoppingBag, User, Menu, X, ChevronDown } from 'lucide-react';
import { Link, usePathname } from '@/i18n/routing';
import { useCartStore } from '@/store/useCartStore';
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher';
import { ThemeToggle } from '@/components/common/ThemeToggle';

export function Header() {
  const t = useTranslations('nav');
  const pathname = usePathname();
  const { openCart, getTotalItems } = useCartStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const totalItems = mounted ? getTotalItems() : 0;

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-background/80 backdrop-blur-md border-b border-border transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo matching mockup */}
          <Link href="/" className="flex flex-col group select-none">
            <span className="font-serif text-2xl sm:text-3xl font-black tracking-widest text-foreground group-hover:text-brand-lime transition-colors">
              TEACOFF
            </span>
            <span className="text-[9px] uppercase tracking-[0.25em] text-muted-foreground font-mono">
              TASHKENT • ESPRESSO LAB
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-7 text-xs font-bold uppercase tracking-wider">
            {/* Catalog Dropdown / Link */}
            <div className="relative group py-2">
              <Link
                href="/catalog"
                className={`flex items-center space-x-1 hover:text-brand-lime transition-colors ${
                  pathname.startsWith('/catalog') ? 'text-brand-lime' : 'text-foreground'
                }`}
              >
                <span>{t('catalog')}</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-60 group-hover:rotate-180 transition-transform" />
              </Link>
              {/* Simple hover dropdown for categories */}
              <div className="absolute top-full left-0 w-52 bg-card border border-border rounded-xl shadow-xl p-2 hidden group-hover:block animate-in fade-in zoom-in-95">
                <Link
                  href="/catalog/kofemashiny"
                  className="block px-3 py-2 text-xs rounded-lg hover:bg-secondary text-foreground hover:text-brand-lime"
                >
                  Кофемашины
                </Link>
                <Link
                  href="/catalog/kapsuly"
                  className="block px-3 py-2 text-xs rounded-lg hover:bg-secondary text-foreground hover:text-brand-lime"
                >
                  Капсульный кофе
                </Link>
                <Link
                  href="/catalog/zernovoy-kofe"
                  className="block px-3 py-2 text-xs rounded-lg hover:bg-secondary text-foreground hover:text-brand-lime"
                >
                  Зерновой кофе
                </Link>
                <Link
                  href="/catalog/chay"
                  className="block px-3 py-2 text-xs rounded-lg hover:bg-secondary text-foreground hover:text-brand-lime"
                >
                  Итальянский чай
                </Link>
              </div>
            </div>

            {/* Rental 0 UZS Spotlight - Highlighted with Neon Dot */}
            <Link
              href="/arenda"
              className={`flex items-center space-x-1.5 py-1 px-3 rounded-full transition-all ${
                pathname === '/arenda'
                  ? 'bg-brand-lime/20 text-brand-lime border border-brand-lime/50'
                  : 'bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/15 text-black dark:text-white border border-brand-lime/40 hover:border-brand-lime'
              }`}
            >
              <span className="font-bold tracking-wider">{t('rental')}</span>
              <span className="w-2 h-2 rounded-full bg-brand-lime shadow-sm shadow-brand-lime animate-pulse" />
            </Link>

            <Link
              href="/catalog/kofemashiny"
              className="hover:text-brand-lime transition-colors text-foreground"
            >
              {t('machines')}
            </Link>

            <Link
              href="/service"
              className={`hover:text-brand-lime transition-colors ${
                pathname === '/service' ? 'text-brand-lime' : 'text-foreground'
              }`}
            >
              {t('service')}
            </Link>

            <Link
              href="/about"
              className={`hover:text-brand-lime transition-colors ${
                pathname === '/about' ? 'text-brand-lime' : 'text-foreground'
              }`}
            >
              {t('about')}
            </Link>

            <Link
              href="/contacts"
              className={`hover:text-brand-lime transition-colors ${
                pathname === '/contacts' ? 'text-brand-lime' : 'text-foreground'
              }`}
            >
              {t('contacts')}
            </Link>
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            {/* Language Switcher */}
            <div className="hidden sm:block">
              <LanguageSwitcher />
            </div>

            {/* Theme Toggle (Dark / Light) */}
            <ThemeToggle />

            {/* User / Admin Portal */}
            <Link
              href="/admin"
              aria-label="Admin panel"
              className="p-2 rounded-full hover:bg-secondary text-foreground hover:text-brand-lime transition-colors"
            >
              <User className="w-5 h-5" />
            </Link>

            {/* Shopping Cart Drawer Trigger with Neon Badge */}
            <button
              onClick={openCart}
              aria-label="Cart"
              className="relative p-2 rounded-full hover:bg-secondary text-foreground hover:text-brand-lime transition-colors"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary text-primary-foreground text-[10px] font-black flex items-center justify-center shadow-md animate-scale">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
              className="lg:hidden p-2 rounded-lg hover:bg-secondary text-foreground"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-border bg-card px-4 pt-3 pb-6 space-y-4 animate-in slide-in-from-top-4">
            <div className="flex justify-between items-center pb-2 border-b border-border">
              <span className="text-xs uppercase font-mono text-muted-foreground">Язык сайта:</span>
              <LanguageSwitcher />
            </div>
            <div className="flex flex-col space-y-2 text-sm font-semibold uppercase tracking-wider">
              <Link
                href="/arenda"
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-2 px-3 rounded-lg bg-black/5 dark:bg-white/10 border border-brand-lime/40 text-black dark:text-white font-bold flex items-center justify-between"
              >
                <span>{t('rental')}</span>
                <span className="w-2 h-2 rounded-full bg-brand-lime animate-pulse" />
              </Link>
              <Link
                href="/catalog"
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-2 px-3 rounded-lg hover:bg-secondary text-foreground"
              >
                {t('catalog')}
              </Link>
              <Link
                href="/catalog/kofemashiny"
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-2 px-3 rounded-lg hover:bg-secondary text-foreground"
              >
                {t('machines')}
              </Link>
              <Link
                href="/service"
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-2 px-3 rounded-lg hover:bg-secondary text-foreground"
              >
                {t('service')}
              </Link>
              <Link
                href="/about"
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-2 px-3 rounded-lg hover:bg-secondary text-foreground"
              >
                {t('about')}
              </Link>
              <Link
                href="/contacts"
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-2 px-3 rounded-lg hover:bg-secondary text-foreground"
              >
                {t('contacts')}
              </Link>
              <Link
                href="/admin"
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-2 px-3 rounded-lg hover:bg-secondary text-foreground text-xs text-muted-foreground"
              >
                {t('admin')}
              </Link>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
