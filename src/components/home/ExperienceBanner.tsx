'use client';

import React from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { ArrowRight } from 'lucide-react';
import { Link } from '@/i18n/routing';

export function ExperienceBanner() {
  const t = useTranslations('banner');

  return (
    <section className="w-full bg-[#FAF9F5] dark:bg-[#0D0A08] border-b border-[#EAE6DE] dark:border-white/5 overflow-hidden transition-colors">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        {/* Left Side: Espresso Aesthetic with user-provided exact light & dark images */}
        <div className="relative min-h-[420px] lg:min-h-[480px] p-8 sm:p-14 flex flex-col justify-end overflow-hidden">
          {/* Dark Mode Espresso Image */}
          <Image
            src="/images/espresso-crema.jpg"
            alt="Espresso crema in dark ceramic cup"
            fill
            className="object-cover filter brightness-75 contrast-110 hidden dark:block"
          />
          {/* Light Mode Espresso Image */}
          <Image
            src="/images/espresso-crema-light.jpg"
            alt="Espresso crema on white marble with spoon"
            fill
            className="object-cover filter contrast-105 block dark:hidden"
          />

          {/* Gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-white/95 via-white/50 to-transparent/10 dark:from-black dark:via-black/50 dark:to-transparent" />

          <div className="relative z-10 space-y-4 max-w-md">
            <div className="flex items-center space-x-2 text-xs font-headline tracking-widest uppercase text-[#5C554E] dark:text-neutral-300">
              <span className="w-5 h-[1.5px] bg-black dark:bg-brand-lime" />
              <span>{t('taste')}</span>
            </div>

            <h3 className="font-headline text-2xl sm:text-3xl lg:text-4xl font-bold text-black dark:text-white leading-tight">
              {t('title')}
            </h3>

            <div className="pt-2">
              <Link
                href="/catalog/zernovoy-kofe"
                className="inline-flex items-center space-x-2 px-6 py-3 rounded-md bg-white hover:bg-neutral-50 text-black border border-black/20 hover:border-black dark:bg-transparent dark:text-white dark:border-white/40 dark:hover:border-brand-lime dark:hover:text-brand-lime text-xs font-bold uppercase tracking-wider shadow-sm transition-all group font-headline"
              >
                <span>{t('button')}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>

        {/* Right Side: Engraved TeaCoff Hardware with user-provided exact light & dark images */}
        <div className="relative min-h-[420px] lg:min-h-[480px] p-8 sm:p-12 flex flex-col justify-between overflow-hidden border-t lg:border-t-0 lg:border-l border-[#EAE6DE] dark:border-white/5">
          {/* Dark Mode Wood Engraving */}
          <Image
            src="/images/teacoff-wood.jpg"
            alt="TEACOFF engraved hardware spec"
            fill
            className="object-cover filter brightness-85 contrast-110 hidden dark:block"
          />
          {/* Light Mode Brushed Steel Engraving */}
          <Image
            src="/images/teacoff-metal-light.jpg"
            alt="TEACOFF brushed steel engraved plate"
            fill
            className="object-cover filter contrast-105 block dark:hidden"
          />

          {/* Gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20 dark:from-black/90 dark:via-black/40 dark:to-black/60" />

          {/* Top Tag matching mockup */}
          <div className="relative z-10 flex justify-between items-start">
            <span className="px-3 py-1 rounded bg-white/70 dark:bg-black/60 backdrop-blur-md border border-white/60 dark:border-white/10 text-[10px] font-mono tracking-[0.25em] uppercase text-black dark:text-neutral-300 font-bold shadow-sm">
              ORIGINAL HARDWARE SPEC
            </span>
            <span className="w-2.5 h-2.5 rounded-full bg-brand-lime shadow-sm shadow-brand-lime animate-pulse" />
          </div>

          {/* Empty spacer for image center */}
          <div className="relative z-10 py-6" />

          {/* Floating Frosted Card matching exact mockup */}
          <div className="relative z-10 self-end max-w-xs w-full bg-white/85 dark:bg-[#141210]/85 backdrop-blur-md p-5 rounded-xl border border-white/60 dark:border-white/10 shadow-xl space-y-1 text-right">
            <p className="font-serif text-sm font-black tracking-widest text-black dark:text-white uppercase">
              TEACOFF
            </p>
            <p className="text-xs font-headline font-bold text-[#4A453F] dark:text-neutral-300 uppercase tracking-wide">
              {t('service')}
            </p>
            <p className="text-[11px] font-mono font-medium text-[#7A7166] dark:text-brand-lime">
              24/7 ПОДДЕРЖКА
            </p>
            <div className="pt-1 border-t border-black/10 dark:border-white/10 text-[10px] font-mono tracking-widest uppercase text-[#8A8175] dark:text-neutral-400">
              {t('location')}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
