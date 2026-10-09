'use client';

import React, { useState, use } from 'react';
import { notFound } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { ShoppingBag, Zap, ShieldCheck, Truck, Plus, Minus, ArrowLeft, Heart } from 'lucide-react';
import { SEED_PRODUCTS } from '@/lib/seed-data';
import { formatUZS } from '@/lib/utils';
import { useCartStore } from '@/store/useCartStore';
import { useWishlistStore } from '@/store/useWishlistStore';
import { ProductGallery } from '@/components/product/ProductGallery';
import { OneClickOrderModal } from '@/components/product/OneClickOrderModal';
import { Link } from '@/i18n/routing';

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = use(params);
  const t = useTranslations('product');
  const { addItem } = useCartStore();
  const { toggleWishlist, isInWishlist } = useWishlistStore();

  const [quantity, setQuantity] = useState(1);
  const [isOneClickOpen, setIsOneClickOpen] = useState(false);

  const product = SEED_PRODUCTS.find((p) => p.slug === slug);
  if (!product) {
    notFound();
  }

  const isFavorited = isInWishlist(product.id);
  const isRental = product.is_rental_machine && product.price === 0;

  const title =
    product.title[locale as keyof typeof product.title] || product.title.ru;
  const description =
    product.description[locale as keyof typeof product.description] ||
    product.description.ru;
  const tasteNotes =
    product.taste_notes?.[locale as keyof typeof product.taste_notes] ||
    product.taste_notes?.ru;

  return (
    <div className="w-full min-h-screen bg-background py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Breadcrumb */}
        <Link
          href="/catalog"
          className="inline-flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-brand-lime transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Назад в каталог</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Gallery - 6 cols */}
          <div className="lg:col-span-6">
            <ProductGallery images={product.images} title={title} />
          </div>

          {/* Details - 6 cols */}
          <div className="lg:col-span-6 space-y-6">
            {/* Title & Brand */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-brand-lime">
                  {product.brand}
                </span>
                <span className="text-muted-foreground text-xs">•</span>
                <span className="text-xs text-muted-foreground">
                  {product.in_stock ? 'В наличии' : 'Под заказ'}
                </span>
              </div>

              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-foreground">
                {title}
              </h1>

              {tasteNotes && (
                <div className="inline-block px-3 py-1 rounded-full bg-secondary text-foreground text-xs font-medium">
                  {tasteNotes}
                </div>
              )}
            </div>

            {/* Price Box */}
            <div className="p-5 rounded-2xl bg-card border border-border space-y-2">
              <div className="flex items-baseline space-x-3">
                {isRental ? (
                  <div>
                    {product.old_price && (
                      <span className="text-xs line-through text-muted-foreground block">
                        {formatUZS(product.old_price, locale)}
                      </span>
                    )}
                    <span className="text-3xl font-black text-brand-lime">0 сум</span>
                    <span className="text-xs text-muted-foreground ml-2">
                      / Аренда при заказе от {product.min_capsule_boxes} коробок в месяц
                    </span>
                  </div>
                ) : (
                  <div>
                    {product.old_price && (
                      <span className="text-xs line-through text-muted-foreground block">
                        {formatUZS(product.old_price, locale)}
                      </span>
                    )}
                    <span className="text-3xl font-extrabold text-foreground">
                      {formatUZS(product.price, locale)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Quantity & CTA Buttons */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center space-x-4">
                <div className="flex items-center border border-border rounded-xl bg-secondary/50 p-1">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 rounded-lg hover:bg-secondary flex items-center justify-center text-foreground"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-10 text-center font-bold text-sm text-foreground">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-8 h-8 rounded-lg hover:bg-secondary flex items-center justify-center text-foreground"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => addItem(product, quantity)}
                  className="flex-1 py-3.5 px-6 rounded-xl bg-primary hover:brightness-110 text-primary-foreground font-extrabold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 shadow-lg glow-lime transition-all"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>В корзину</span>
                </button>

                <button
                  type="button"
                  onClick={() => toggleWishlist(product)}
                  aria-label="Wishlist"
                  className="p-3.5 rounded-xl border border-border hover:border-brand-lime text-foreground hover:text-red-500 transition-colors"
                >
                  <Heart
                    className={`w-5 h-5 ${
                      isFavorited ? 'fill-red-500 text-red-500' : ''
                    }`}
                  />
                </button>
              </div>

              {/* 1-Click Buy button */}
              <button
                type="button"
                onClick={() => setIsOneClickOpen(true)}
                className="w-full py-3.5 px-6 rounded-xl bg-secondary hover:bg-secondary/80 border border-border text-foreground font-bold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 transition-all"
              >
                <Zap className="w-4 h-4 text-brand-lime" />
                <span>{t('quickOrder')}</span>
              </button>
            </div>

            {/* Description */}
            <div className="space-y-2 pt-4 border-t border-border">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Описание
              </h3>
              <p className="text-sm text-foreground font-light leading-relaxed">
                {description}
              </p>
            </div>

            {/* Specs Table */}
            {product.specs && Object.keys(product.specs).length > 0 && (
              <div className="space-y-3 pt-4 border-t border-border">
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  {t('specs')}
                </h3>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {Object.entries(product.specs).map(([key, val]) => (
                    <div
                      key={key}
                      className="p-3 rounded-lg bg-secondary/40 border border-border flex flex-col justify-between"
                    >
                      <span className="text-[11px] text-muted-foreground uppercase font-mono">
                        {key === 'pressure' ? 'Давление' : key === 'water_tank' ? 'Объем воды' : key === 'system' ? 'Система' : key === 'origin' ? 'Производство' : key}
                      </span>
                      <span className="font-semibold text-foreground mt-0.5">{val}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Badges Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-border text-xs">
              <div className="p-3 rounded-xl bg-secondary/30 flex items-center space-x-2.5 text-muted-foreground">
                <Truck className="w-4 h-4 text-brand-lime shrink-0" />
                <span>{t('delivery')}</span>
              </div>
              <div className="p-3 rounded-xl bg-secondary/30 flex items-center space-x-2.5 text-muted-foreground">
                <ShieldCheck className="w-4 h-4 text-brand-lime shrink-0" />
                <span>{t('warranty')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 1-Click Order Modal */}
      <OneClickOrderModal
        product={product}
        quantity={quantity}
        isOpen={isOneClickOpen}
        onClose={() => setIsOneClickOpen(false)}
      />
    </div>
  );
}
