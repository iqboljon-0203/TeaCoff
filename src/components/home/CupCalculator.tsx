'use client';

import React, { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Coffee, Sparkles, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { formatUZS } from '@/lib/utils';
import { Link } from '@/i18n/routing';

export function CupCalculator() {
  const t = useTranslations('calculator');
  const locale = useLocale();
  const [cupsPerDay, setCupsPerDay] = useState(4);

  const monthlyCups = cupsPerDay * 30;
  const recommendedBoxes = Math.max(4, Math.ceil(monthlyCups / 16));
  const estimatedCapsulePrice = 95000;
  const monthlyCost = recommendedBoxes * estimatedCapsulePrice;
  const hardwareSavings = 1475000;

  return (
    <section className="w-full bg-white dark:bg-[#0D0A08] py-16 lg:py-24 border-b border-[#EAE6DE] dark:border-white/5 relative overflow-hidden transition-colors">
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-brand-lime/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#F5F2EB] dark:bg-[#181513] border border-[#EAE6DE] dark:border-brand-lime/30 text-[#2C2723] dark:text-brand-lime text-xs font-mono font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t('tag')}</span>
          </div>
          <h2 className="font-headline text-3xl sm:text-4xl lg:text-5xl font-bold text-black dark:text-white tracking-tight">
            {t('title')}
          </h2>
          <p className="text-xs sm:text-sm text-[#6B645C] dark:text-neutral-400 font-light font-body">
            {t('subtitle')}
          </p>
        </div>

        <div className="p-6 sm:p-10 rounded-2xl bg-[#FAF9F5] dark:bg-[#141210] border border-[#EAE6DE] dark:border-white/10 shadow-sm backdrop-blur-md">
          <div className="space-y-6 pb-8 border-b border-[#EAE6DE] dark:border-white/10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <label className="text-sm sm:text-base font-semibold text-black dark:text-white flex items-center space-x-2 font-headline">
                <Coffee className="w-5 h-5 text-brand-lime" />
                <span>{t('sliderLabel')}</span>
              </label>
              <div className="flex items-baseline space-x-1.5 self-start sm:self-auto">
                <span className="font-headline text-3xl font-black text-black dark:text-brand-lime">
                  {cupsPerDay}
                </span>
                <span className="text-xs text-[#7A7166] dark:text-neutral-400 font-medium font-body">
                  {t('cups')}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <input
                type="range"
                min="1"
                max="12"
                step="1"
                value={cupsPerDay}
                onChange={(e) => setCupsPerDay(Number(e.target.value))}
                className="w-full h-2.5 bg-[#E5E0D6] dark:bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-brand-lime"
              />
              <div className="flex justify-between text-[11px] font-mono text-[#8A8175] dark:text-neutral-500">
                <span>1 чашка</span>
                <span>4 чашки (Оптимально)</span>
                <span>8 чашек</span>
                <span>12+ чашек (Офис)</span>
              </div>
            </div>
          </div>

          <div className="py-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="p-5 rounded-xl bg-white dark:bg-black/50 border border-[#EAE6DE] dark:border-white/5 space-y-2">
              <span className="text-[11px] text-[#7A7166] dark:text-neutral-400 uppercase tracking-wider block font-body">
                {t('recommendedBoxes')}
              </span>
              <p className="font-headline text-2xl font-bold text-black dark:text-white">
                {recommendedBoxes} уп./мес
              </p>
              <p className="text-[11px] text-[#8A8175] dark:text-neutral-500 font-mono">
                ~{recommendedBoxes * 16} свежих чашек кофе
              </p>
            </div>

            <div className="p-5 rounded-xl bg-white dark:bg-black/50 border border-[#EAE6DE] dark:border-white/5 space-y-2">
              <span className="text-[11px] text-[#7A7166] dark:text-neutral-400 uppercase tracking-wider block font-body">
                {t('monthlyCost')}
              </span>
              <p className="font-headline text-2xl font-extrabold text-black dark:text-brand-lime">
                {formatUZS(monthlyCost, locale)}
              </p>
              <p className="text-[11px] text-[#7A7166] dark:text-neutral-400 flex items-center space-x-1 font-body">
                <CheckCircle2 className="w-3.5 h-3.5 text-brand-lime" />
                <span>Доставка по Ташкенту 0 сум</span>
              </p>
            </div>

            <div className="p-5 rounded-xl bg-white dark:bg-[#1C1814] border border-[#EAE6DE] dark:border-brand-lime/30 space-y-2">
              <span className="text-[11px] text-[#2C2723] dark:text-brand-lime uppercase tracking-wider font-semibold block font-headline">
                {t('savedCost')}
              </span>
              <p className="font-headline text-2xl font-black text-black dark:text-white">
                {formatUZS(hardwareSavings, locale)}
              </p>
              <div className="inline-block px-2 py-0.5 rounded bg-brand-lime text-black text-[10px] font-extrabold uppercase font-headline">
                {t('zeroRent')}
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-[#EAE6DE] dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-3 text-xs text-[#6B645C] dark:text-neutral-400 font-body">
              <ShieldCheck className="w-5 h-5 text-brand-lime shrink-0" />
              <span>
                Без залога • Бесплатная замена оборудования за 24 часа • Сервис 100% за счет TeaCoff
              </span>
            </div>

            <Link
              href={`/arenda?cups=${cupsPerDay}`}
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-8 py-3.5 rounded-lg bg-brand-lime text-black font-extrabold text-xs uppercase tracking-wider hover:bg-[#c0eb00] shadow-lg shadow-brand-lime/20 transition-all shrink-0 font-headline"
            >
              <span>{t('cta')}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
