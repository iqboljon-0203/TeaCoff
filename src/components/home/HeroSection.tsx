'use client';

import React from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { ArrowRight } from 'lucide-react';
import { Link } from '@/i18n/routing';

export function HeroSection() {
  const t = useTranslations('hero');

  return (
    <section className="relative w-full min-h-[620px] lg:min-h-[700px] bg-[#FAF9F6] dark:bg-[#0D0A08] overflow-hidden flex items-center border-b border-[#EAE6DE] dark:border-white/5 transition-colors">
      {/* Background Hero Image with Dark Gradient Overlay - Using exact user-provided hero image */}
      {/* Hero Background Images (Dynamic Dark & Light) */}
      <div className="absolute inset-0 z-0">
        {/* Dark Mode Hero Image */}
        <Image
          src="/images/hero-barista.jpg"
          alt="Barista preparing espresso with La Marzocco machine"
          fill
          priority
          className="object-cover object-right md:object-center opacity-40 filter contrast-125 hidden dark:block"
        />
        {/* Light Mode Hero Image matching user mockup */}
        <Image
          src="/images/hero-barista-light.jpg"
          alt="Barista in bright kitchen with premium espresso machine"
          fill
          priority
          className="object-cover object-right md:object-center opacity-90 filter contrast-105 block dark:hidden"
        />

        {/* Cinematic Vignette & Gradients matching mockups */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#FAF9F6] via-[#FAF9F6]/85 to-transparent dark:from-[#0D0A08] dark:via-[#0D0A08]/85 dark:to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#FAF9F6] via-transparent to-[#FAF9F6]/30 dark:from-[#0D0A08] dark:via-transparent dark:to-[#0D0A08]/60" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Hero Copy matching exact mockup */}
          <div className="lg:col-span-8 space-y-6 max-w-2xl">
            {/* Tag / Category Subtitle */}
            <div className="flex items-center space-x-3">
              <span className="w-8 h-[2px] bg-black dark:bg-brand-lime inline-block" />
              <span className="text-xs uppercase tracking-[0.25em] font-semibold text-[#4B453E] dark:text-neutral-300 font-headline">
                {t('tag')}
              </span>
            </div>

            {/* Massive Luxury Headline with Neon Lime Accent */}
            <h1 className="font-headline text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-black dark:text-white leading-[1.08]">
              {t('titlePrefix')} <br />
              {t('titleMiddle')}{' '}
              <span className="bg-brand-lime text-black px-3 py-0.5 rounded-sm inline-block font-black shadow-sm">
                {t('titleHighlight')}
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base text-[#5C554E] dark:text-neutral-300 leading-relaxed max-w-xl font-light font-body">
              {t('subtitle')}
            </p>

            {/* Actions matching mockup */}
            <div className="pt-4 flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Link
                href="/arenda"
                className="inline-flex items-center justify-center space-x-3 px-8 py-4 rounded-md bg-brand-lime text-black font-extrabold text-xs uppercase tracking-wider hover:bg-[#c0eb00] shadow-lg shadow-brand-lime/20 hover:shadow-brand-lime/40 transition-all group font-headline"
              >
                <span>{t('cta')}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <div className="flex items-center space-x-2 text-[11px] font-mono tracking-wider uppercase text-[#6B645C] dark:text-neutral-400">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-lime/80" />
                <span>{t('badge')}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Floating Luxury Typography matching user image */}
          <div className="hidden lg:flex lg:col-span-4 flex-col items-end justify-center text-right pr-4 xl:pr-8">
            <div className="text-right flex flex-col items-end select-none drop-shadow-[0_2px_8px_rgba(255,255,255,0.7)] dark:drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
              <div className="font-serif text-[#2C2723] dark:text-[#F2E6D6] text-sm md:text-base font-normal tracking-[0.28em] uppercase leading-relaxed space-y-1 text-right">
                <div>PREMIUM</div>
                <div>ESPRESSO</div>
                <div>EXPERIENCE</div>
                <div>TASHKENT</div>
              </div>
              <div className="w-16 h-[1px] bg-[#8A8175]/50 dark:bg-neutral-400/60 my-3.5 ml-auto" />
              <div className="font-serif text-[#5C554E] dark:text-[#E5D5C0] text-xs font-light tracking-[0.32em] uppercase text-right">
                EST. 2024
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
