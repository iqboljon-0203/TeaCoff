'use client';

import React from 'react';
import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { Heart, ShoppingBag, Eye } from 'lucide-react';
import { Product } from '@/types/database';
import { formatUZS } from '@/lib/utils';
import { useCartStore } from '@/store/useCartStore';
import { useWishlistStore } from '@/store/useWishlistStore';
import { Link } from '@/i18n/routing';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const t = useTranslations('home');
  const locale = useLocale();
  const { addItem } = useCartStore();
  const { toggleWishlist, isInWishlist } = useWishlistStore();

  const isFavorited = isInWishlist(product.id);
  const isRental = product.is_rental_machine && product.price === 0;

  const title =
    product.title[locale as keyof typeof product.title] || product.title.ru;
  const tasteNotes =
    product.taste_notes?.[locale as keyof typeof product.taste_notes] ||
    product.taste_notes?.ru;

  return (
    <div className="group relative rounded-2xl bg-card border border-border hover:border-brand-lime/40 transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-sm hover:shadow-xl">
      {/* Image Area */}
      <div className="relative aspect-square w-full bg-secondary/50 overflow-hidden">
        <Image
          src={product.images[0] || 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?q=80&w=600'}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover object-center group-hover:scale-105 transition-transform duration-500 filter brightness-95"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
          {product.badge && (
            <span
              className={`px-2.5 py-1 text-[10px] font-extrabold tracking-wider rounded-md uppercase ${
                isRental
                  ? 'bg-brand-lime text-black shadow-sm'
                  : 'bg-black/80 text-[#D4A373] border border-[#D4A373]/30 backdrop-blur-sm'
              }`}
            >
              {product.badge[locale as keyof typeof product.badge] || product.badge.ru}
            </span>
          )}
          {product.old_price && !isRental && (
            <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-red-600 text-white uppercase">
              Скидка
            </span>
          )}
        </div>

        {/* Favorite Heart Button */}
        <button
          type="button"
          onClick={() => toggleWishlist(product)}
          aria-label="Wishlist"
          className="absolute top-3 right-3 z-10 p-2 rounded-full bg-card/70 hover:bg-card text-foreground backdrop-blur-sm transition-all shadow-md"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isFavorited
                ? 'fill-red-500 text-red-500'
                : 'text-muted-foreground hover:text-red-500'
            }`}
          />
        </button>
      </div>

      {/* Info Container */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-1.5">
          <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground block">
            {product.brand} • {product.weight_volume || 'Оригинал'}
          </span>
          <Link
            href={`/product/${product.slug}`}
            className="font-serif text-base sm:text-lg font-bold text-foreground group-hover:text-brand-lime transition-colors line-clamp-1"
          >
            {title}
          </Link>
          {tasteNotes && (
            <p className="text-xs text-muted-foreground font-light line-clamp-2">
              {tasteNotes}
            </p>
          )}
        </div>

        {/* Price & Cart CTA */}
        <div className="pt-3 border-t border-border flex items-end justify-between">
          <div>
            {isRental ? (
              <div>
                {product.old_price && (
                  <span className="text-[11px] line-through text-muted-foreground block">
                    {formatUZS(product.old_price, locale)}
                  </span>
                )}
                <div className="flex items-baseline space-x-1">
                  <span className="text-lg font-black text-brand-lime">0 сум</span>
                  <span className="text-[10px] text-muted-foreground">
                    / от {product.min_capsule_boxes} уп.
                  </span>
                </div>
              </div>
            ) : (
              <div>
                {product.old_price && (
                  <span className="text-[11px] line-through text-muted-foreground block">
                    {formatUZS(product.old_price, locale)}
                  </span>
                )}
                <span className="text-base font-bold text-foreground">
                  {formatUZS(product.price, locale)}
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Link
              href={`/product/${product.slug}`}
              title="Подробнее"
              className="p-2 rounded-lg bg-secondary hover:bg-secondary/80 text-foreground transition-colors"
            >
              <Eye className="w-4 h-4" />
            </Link>
            <button
              onClick={() => addItem(product, 1)}
              title={t('addToCart')}
              aria-label={t('addToCart')}
              className="p-2.5 rounded-lg bg-primary hover:brightness-110 text-primary-foreground font-bold transition-all shadow-sm"
            >
              <ShoppingBag className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
