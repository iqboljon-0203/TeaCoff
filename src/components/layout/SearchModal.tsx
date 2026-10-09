'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { Search, X, ArrowRight } from 'lucide-react';
import { SEED_PRODUCTS } from '@/lib/seed-data';
import { Product } from '@/types/database';
import { formatUZS } from '@/lib/utils';
import { Link } from '@/i18n/routing';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const t = useTranslations('catalog');
  const locale = useLocale();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(() => {
      const q = query.toLowerCase();
      const filtered = SEED_PRODUCTS.filter((p) => {
        const titleRu = p.title.ru.toLowerCase();
        const titleUz = p.title.uz.toLowerCase();
        const brand = p.brand.toLowerCase();
        const descRu = p.description.ru.toLowerCase();
        return (
          titleRu.includes(q) ||
          titleUz.includes(q) ||
          brand.includes(q) ||
          descRu.includes(q)
        );
      });
      setResults(filtered);
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-2xl bg-card border border-border rounded-2xl shadow-2xl overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-150">
        <div className="p-4 border-b border-border flex items-center space-x-3 bg-secondary/30">
          <Search className="w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Поиск кофемашин, капсул, зерен..."
            className="w-full bg-transparent border-none outline-none text-base text-foreground placeholder:text-muted-foreground"
          />
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-secondary text-muted-foreground hover:text-foreground"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-[60vh] overflow-y-auto p-4 divide-y divide-border/60">
          {query.trim() === '' ? (
            <div className="py-8 text-center text-sm text-muted-foreground">
              Попробуйте найти: <span className="text-brand-lime font-medium">Mini Me</span>, <span className="text-brand-lime font-medium">Carraro</span>, <span className="text-brand-lime font-medium">Lavazza</span>, <span className="text-brand-lime font-medium">Аренда</span>
            </div>
          ) : results.length === 0 ? (
            <div className="py-8 text-center text-sm text-muted-foreground">
              {t('empty')}
            </div>
          ) : (
            results.map((product) => {
              const title =
                product.title[locale as keyof typeof product.title] ||
                product.title.ru;
              return (
                <Link
                  key={product.id}
                  href={`/product/${product.slug}`}
                  onClick={onClose}
                  className="py-3 px-3 flex items-center justify-between hover:bg-secondary/50 rounded-xl transition-colors group"
                >
                  <div className="flex items-center space-x-3">
                    <div className="relative w-12 h-12 rounded-lg bg-secondary overflow-hidden shrink-0">
                      <Image
                        src={product.images[0]}
                        alt={title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-foreground group-hover:text-brand-lime transition-colors">
                        {title}
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        {product.brand} • {product.weight_volume}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-bold text-foreground">
                      {product.price === 0 ? '0 сум' : formatUZS(product.price, locale)}
                    </span>
                    <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-brand-lime group-hover:translate-x-0.5 transition-all" />
                  </div>
                </Link>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
