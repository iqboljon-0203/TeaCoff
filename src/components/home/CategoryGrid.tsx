'use client';

import React from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { ArrowUpRight } from 'lucide-react';
import { SEED_CATEGORIES } from '@/lib/seed-data';
import { Link } from '@/i18n/routing';

export function CategoryGrid() {
  const t = useTranslations('categories');

  return (
    <section className="w-full bg-[#FAF9F5] dark:bg-[#08080A] py-16 lg:py-24 border-b border-[#EAE6DE] dark:border-white/5 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-12 space-y-2">
          <span className="text-[11px] font-mono tracking-[0.25em] uppercase text-[#7A7166] dark:text-brand-lime font-bold">
            {t('tag')}
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-black dark:text-white tracking-tight">
            {t('title')}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {SEED_CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              href={`/catalog/${cat.slug}`}
              className="group relative h-72 rounded-2xl overflow-hidden border border-white/5 hover:border-brand-lime/40 transition-all flex flex-col justify-end p-6"
            >
              <Image
                src={cat.image_url || 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?q=80&w=600'}
                alt={cat.title.ru}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-50 group-hover:brightness-60"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

              <div className="relative z-10 space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-lg font-bold text-white group-hover:text-brand-lime transition-colors">
                    {cat.title.ru}
                  </h3>
                  <div className="w-8 h-8 rounded-full bg-white/10 group-hover:bg-brand-lime text-white group-hover:text-black flex items-center justify-center transition-all">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-xs text-neutral-400 font-light line-clamp-2">
                  {cat.description?.ru}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
