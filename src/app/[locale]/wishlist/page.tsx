'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { useWishlistStore } from '@/store/useWishlistStore';
import { useCartStore } from '@/store/useCartStore';
import { ProductCard } from '@/components/catalog/ProductCard';
import { Link } from '@/i18n/routing';

export default function WishlistPage() {
  const t = useTranslations('nav');
  const [mounted, setMounted] = useState(false);
  const { items, clearWishlist } = useWishlistStore();
  const { addItem } = useCartStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-brand-lime border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-background py-12 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header Title */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-border">
          <div>
            <div className="inline-flex items-center space-x-2 text-brand-lime font-mono text-xs font-bold uppercase tracking-widest mb-2">
              <Heart className="w-4 h-4 fill-brand-lime" />
              <span>ИЗБРАННЫЕ ТОВАРЫ</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold text-foreground">
              {t('favorites')} ({items.length})
            </h1>
          </div>

          {items.length > 0 && (
            <button
              onClick={clearWishlist}
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold text-muted-foreground hover:text-red-500 hover:bg-red-500/10 border border-border transition-colors self-start sm:self-auto cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
              <span>Очистить избранное</span>
            </button>
          )}
        </div>

        {/* Empty State */}
        {items.length === 0 ? (
          <div className="text-center py-20 px-4 space-y-6 max-w-md mx-auto">
            <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mx-auto text-muted-foreground">
              <Heart className="w-10 h-10" />
            </div>
            <div className="space-y-2">
              <h2 className="font-serif text-2xl font-bold text-foreground">
                Список избранного пуст
              </h2>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Добавляйте понравившиеся кофемашины, итальянский зерновой кофе и капсулы, чтобы не потерять их.
              </p>
            </div>
            <Link
              href="/catalog"
              className="inline-flex items-center space-x-2 px-8 py-3.5 rounded-xl bg-primary text-primary-foreground font-extrabold text-xs uppercase tracking-wider hover:brightness-110 shadow-lg glow-lime transition-all"
            >
              <span>Перейти в каталог</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          /* Wishlist Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {items.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
