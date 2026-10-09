'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Truck, ShieldCheck, Sun, Coffee } from 'lucide-react';

export function ValueProps() {
  const t = useTranslations('valueProps');

  const items = [
    {
      icon: Truck,
      title: t('deliveryTitle'),
      desc: t('deliveryDesc'),
    },
    {
      icon: ShieldCheck,
      title: t('serviceTitle'),
      desc: t('serviceDesc'),
    },
    {
      icon: Sun,
      title: t('capsulesTitle'),
      desc: t('capsulesDesc'),
    },
    {
      icon: Coffee,
      title: t('noPurchaseTitle'),
      desc: t('noPurchaseDesc'),
    },
  ];

  return (
    <section className="w-full bg-white dark:bg-[#0D0A08] py-8 border-b border-[#EAE6DE] dark:border-white/5 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {items.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-5 rounded-xl bg-white dark:bg-[#141210] border border-[#EAE6DE] dark:border-white/5 hover:border-black/20 dark:hover:border-brand-lime/30 shadow-sm transition-all flex items-start space-x-4 group"
              >
                <div className="p-2.5 rounded-lg bg-[#F8F6F2] dark:bg-black/60 border border-[#EAE6DE] dark:border-white/5 text-[#2C2723] dark:text-brand-lime shrink-0 group-hover:bg-brand-lime group-hover:text-black transition-colors">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs sm:text-sm font-bold text-black dark:text-white tracking-wide font-headline">
                    {item.title}
                  </h4>
                  <p className="text-xs text-[#6B645C] dark:text-neutral-400 font-light font-body leading-relaxed">
                    {item.desc}
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
