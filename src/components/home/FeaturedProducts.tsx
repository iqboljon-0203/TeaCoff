'use client';

import React from 'react';
import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { SEED_PRODUCTS } from '@/lib/seed-data';
import { formatUZS } from '@/lib/utils';
import { useCartStore } from '@/store/useCartStore';
import { Link } from '@/i18n/routing';

export function FeaturedProducts() {
  const t = useTranslations('home');
  const locale = useLocale();
  const { addItem } = useCartStore();

  const featured = [
    SEED_PRODUCTS.find((p) => p.slug === 'dolce-gusto-mini-me') || SEED_PRODUCTS[0],
    SEED_PRODUCTS.find((p) => p.slug === 'dolce-gusto-genio-s') || SEED_PRODUCTS[1],
    SEED_PRODUCTS.find((p) => p.slug === 'capsules-carraro-crema') || SEED_PRODUCTS[2],
    SEED_PRODUCTS.find((p) => p.slug === 'lavazza-super-crema-beans') || SEED_PRODUCTS[3],
  ];

  return (
    <section className="w-full bg-[#FAF9F5] dark:bg-[#0D0A08] py-16 lg:py-24 border-b border-[#EAE6DE] dark:border-white/5 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header matching exact screenshot */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 pb-4 border-b border-[#EAE6DE] dark:border-white/5">
          <div className="space-y-2">
            <span className="text-[11px] font-headline tracking-[0.25em] uppercase text-[#7A7166] dark:text-brand-lime font-bold">
              {t('featuredTag')}
            </span>
            <h2 className="font-headline text-3xl sm:text-4xl font-bold text-black dark:text-white tracking-tight">
              {t('featuredTitle')}
            </h2>
          </div>
          <Link
            href="/catalog"
            className="mt-4 sm:mt-0 inline-flex items-center space-x-2 text-xs font-headline font-bold uppercase tracking-wider text-[#6B645C] hover:text-black dark:text-neutral-400 dark:hover:text-brand-lime transition-colors group"
          >
            <span>{t('viewAll')}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* 4 Product Cards Grid matching mockup */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featured.map((product) => {
            const title =
              product.title[locale as keyof typeof product.title] ||
              product.title.ru;
            const tasteNotes =
              product.taste_notes?.[locale as keyof typeof product.taste_notes] ||
              product.taste_notes?.ru;
            const isRental = product.is_rental_machine && product.price === 0;

            return (
              <div
                key={product.id}
                className="group relative rounded-xl bg-white dark:bg-[#141210] border border-[#EAE6DE] dark:border-white/5 hover:border-black/20 dark:hover:border-brand-lime/40 transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-sm hover:shadow-md"
              >
                {/* Image Container with Exact Product Photos */}
                <div className="relative aspect-square w-full bg-[#F5F2EB] dark:bg-[#181513] overflow-hidden">
                  <Image
                    src={product.images[0]}
                    alt={title}
                    fill
                    sizes="(max-width: 768px) 100vw, 25vw"
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-500 filter brightness-95"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent dark:from-[#141210] opacity-50" />

                  {/* Badges matching mockup */}
                  {product.badge && (
                    <div className="absolute top-3 left-3 z-10">
                      <span
                        className={`inline-block px-2.5 py-1 text-[10px] font-headline font-extrabold tracking-wider rounded-md uppercase ${
                          isRental
                            ? 'bg-brand-lime text-black shadow-sm'
                            : product.slug === 'dolce-gusto-genio-s'
                            ? 'bg-black text-white shadow-sm'
                            : 'bg-white/95 text-black border border-black/10 dark:bg-black/80 dark:text-[#E07A2A] dark:border-[#E07A2A]/40 backdrop-blur-sm'
                        }`}
                      >
                        {product.badge[locale as keyof typeof product.badge] || product.badge.ru}
                      </span>
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-1">
                    <Link
                      href={`/product/${product.slug}`}
                      className="font-headline text-lg font-bold text-black dark:text-white group-hover:text-brand-lime transition-colors line-clamp-1"
                    >
                      {title}
                    </Link>
                    <p className="text-xs text-[#6B645C] dark:text-neutral-400 font-light font-body line-clamp-1">
                      {tasteNotes || product.brand}
                    </p>
                  </div>

                  {/* Pricing and Action */}
                  <div className="pt-2 border-t border-[#EAE6DE] dark:border-white/5 flex items-end justify-between">
                    <div>
                      {isRental ? (
                        <div>
                          {product.old_price && (
                            <span className="text-[11px] line-through text-[#8A8175] dark:text-neutral-500 block font-mono">
                              {formatUZS(product.old_price, locale)}
                            </span>
                          )}
                          <div className="flex items-baseline space-x-1.5">
                            <span className="text-xl font-headline font-black text-black dark:text-brand-lime">
                              0 сум
                            </span>
                            <span className="text-[10px] text-[#7A7166] dark:text-neutral-400 font-body">
                              / Мин. {product.min_capsule_boxes} уп./мес
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <span className="text-[11px] text-[#7A7166] dark:text-neutral-400 block font-body">
                            {product.in_stock ? 'В наличии' : 'Под заказ'}
                          </span>
                          <span className="text-base font-headline font-bold text-black dark:text-white">
                            {product.slug === 'capsules-carraro-crema' ? 'от ' : ''}
                            {formatUZS(product.price, locale)}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Quick Add Bag button matching screenshot */}
                    <button
                      onClick={() => addItem(product, 1)}
                      title="Добавить в корзину"
                      aria-label="Добавить в корзину"
                      className="p-2.5 rounded-lg bg-[#F8F6F2] hover:bg-brand-lime text-[#2C2723] hover:text-black border border-[#EAE6DE] hover:border-brand-lime dark:bg-black/50 dark:hover:bg-brand-lime dark:text-neutral-300 dark:hover:text-black dark:border-white/10 transition-all duration-200"
                    >
                      <ShoppingBag className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
