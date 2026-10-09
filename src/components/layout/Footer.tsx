'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Phone, Clock, MapPin, Send } from 'lucide-react';

export function Footer() {
  const t = useTranslations('footer');

  return (
    <footer className="w-full bg-white dark:bg-[#08080A] text-[#5C554E] dark:text-[#A0A0AA] border-t border-[#EAE6DE] dark:border-white/5 pt-16 pb-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-[#EAE6DE] dark:border-white/10">
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <Link href="/" className="inline-block">
              <span className="font-serif text-2xl font-black tracking-widest text-black dark:text-white hover:text-brand-lime transition-colors">
                TEACOFF
              </span>
            </Link>
            <p className="text-xs leading-relaxed text-[#6B645C] dark:text-neutral-400">
              {t('about')}
            </p>
            <div className="pt-2 flex flex-wrap gap-2">
              <a
                href="https://t.me/TeaCoff_lux"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-[#F5F2EB] hover:bg-brand-lime text-black hover:text-black border border-[#EAE6DE] dark:bg-white/5 dark:text-white dark:border-white/10 dark:hover:bg-brand-lime dark:hover:text-black text-xs font-semibold transition-all"
              >
                <Send className="w-3.5 h-3.5" />
                <span>@TeaCoff_lux</span>
              </a>
              <a
                href="https://instagram.com/teacoff.lux"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-[#F5F2EB] hover:bg-brand-lime text-black hover:text-black border border-[#EAE6DE] dark:bg-white/5 dark:text-white dark:border-white/10 dark:hover:bg-brand-lime dark:hover:text-black text-xs font-semibold transition-all"
              >
                <span>@teacoff.lux</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-black dark:text-white">
              {t('quickLinks')}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/arenda" className="hover:text-brand-lime transition-colors flex items-center space-x-1.5 text-black dark:text-neutral-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-lime" />
                  <span>Аренда 0 сум</span>
                </Link>
              </li>
              <li>
                <Link href="/catalog" className="hover:text-black dark:hover:text-white transition-colors">
                  Каталог товаров
                </Link>
              </li>
              <li>
                <Link href="/catalog/kofemashiny" className="hover:text-black dark:hover:text-white transition-colors">
                  Кофемашины
                </Link>
              </li>
              <li>
                <Link href="/catalog/kapsuly" className="hover:text-black dark:hover:text-white transition-colors">
                  Капсулы Carraro
                </Link>
              </li>
              <li>
                <Link href="/service" className="hover:text-black dark:hover:text-white transition-colors">
                  Сервис и ремонт
                </Link>
              </li>
            </ul>
          </div>

          {/* Contacts & Hours */}
          <div className="space-y-3 md:col-span-2">
            <h4 className="text-xs font-bold uppercase tracking-widest text-black dark:text-white">
              {t('contacts')}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-2">
                <div className="flex items-start space-x-2.5">
                  <MapPin className="w-4 h-4 text-brand-lime shrink-0 mt-0.5" />
                  <span>{t('address')}</span>
                </div>
                <div className="flex items-center space-x-2.5">
                  <Clock className="w-4 h-4 text-brand-lime shrink-0" />
                  <span>{t('hours')}</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2.5">
                  <Phone className="w-4 h-4 text-brand-lime shrink-0" />
                  <a href="tel:+998959028833" className="hover:text-black dark:hover:text-white font-medium text-black dark:text-white">
                    {t('phone')}
                  </a>
                </div>
                <p className="text-[11px] text-[#7A7166] dark:text-neutral-500">
                  Бесплатная доставка и сервисное обслуживание во всех районах Ташкента
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar matching mockup */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#7A7166] dark:text-neutral-500 space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-2">
            <span className="font-serif font-bold text-black dark:text-neutral-300">TEACOFF</span>
            <span>|</span>
            <span>{t('rights')}</span>
          </div>
          <div className="flex items-center space-x-6 uppercase tracking-wider text-[10px]">
            <a href="#" className="hover:text-black dark:hover:text-white transition-colors">
              {t('privacy')}
            </a>
            <a href="#" className="hover:text-black dark:hover:text-white transition-colors">
              {t('offer')}
            </a>
            <Link href="/contacts" className="hover:text-black dark:hover:text-white transition-colors">
              Контакты
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
