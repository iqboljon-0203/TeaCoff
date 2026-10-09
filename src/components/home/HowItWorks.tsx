'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Layers, Coffee, Truck, HeartHandshake } from 'lucide-react';

export function HowItWorks() {
  const t = useTranslations('howItWorks');

  const steps = [
    {
      num: '01',
      icon: Layers,
      title: t('step1Title'),
      desc: t('step1Desc'),
    },
    {
      num: '02',
      icon: Coffee,
      title: t('step2Title'),
      desc: t('step2Desc'),
    },
    {
      num: '03',
      icon: Truck,
      title: t('step3Title'),
      desc: t('step3Desc'),
    },
    {
      num: '04',
      icon: HeartHandshake,
      title: t('step4Title'),
      desc: t('step4Desc'),
    },
  ];

  return (
    <section className="w-full bg-white dark:bg-[#0B0B0E] py-16 lg:py-24 border-b border-[#EAE6DE] dark:border-white/5 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
          <span className="text-[11px] font-mono tracking-[0.25em] uppercase text-[#7A7166] dark:text-brand-lime font-bold">
            {t('tag')}
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-black dark:text-white tracking-tight">
            {t('title')}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="relative p-6 rounded-2xl bg-[#FAF9F5] dark:bg-[#131317] border border-[#EAE6DE] dark:border-white/5 hover:border-black/20 dark:hover:border-brand-lime/30 shadow-sm transition-all space-y-4 group"
              >
                {/* Step Number Tag */}
                <div className="flex justify-between items-start">
                  <div className="p-3 rounded-xl bg-white dark:bg-black/60 border border-[#EAE6DE] dark:border-white/10 text-[#2C2723] dark:text-brand-lime group-hover:bg-brand-lime group-hover:text-black transition-colors">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="font-mono text-2xl font-black text-black/15 dark:text-white/10 group-hover:text-brand-lime transition-colors">
                    {step.num}
                  </span>
                </div>

                <div className="space-y-2 pt-2">
                  <h3 className="font-serif text-lg font-bold text-black dark:text-white tracking-wide">
                    {step.title}
                  </h3>
                  <p className="text-xs text-[#6B645C] dark:text-neutral-400 font-light leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
