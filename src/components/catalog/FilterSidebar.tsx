'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Filter, RotateCcw } from 'lucide-react';
import { formatUZS } from '@/lib/utils';

export interface FilterState {
  category: string;
  brand: string;
  maxPrice: number;
  inStockOnly: boolean;
}

interface FilterSidebarProps {
  filters: FilterState;
  onChangeFilters: (filters: FilterState) => void;
  onReset: () => void;
  categories: { slug: string; name: string }[];
  brands: string[];
}

export function FilterSidebar({
  filters,
  onChangeFilters,
  onReset,
  categories,
  brands,
}: FilterSidebarProps) {
  const t = useTranslations('catalog');

  return (
    <aside className="w-full lg:w-64 space-y-6 p-6 rounded-2xl bg-card border border-border shrink-0">
      <div className="flex items-center justify-between pb-4 border-b border-border">
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-brand-lime" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">
            Фильтры
          </h3>
        </div>
        <button
          onClick={onReset}
          className="text-xs text-muted-foreground hover:text-brand-lime flex items-center space-x-1 transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          <span>{t('clearFilters')}</span>
        </button>
      </div>

      {/* Category Filter */}
      <div className="space-y-3">
        <label className="text-xs font-bold uppercase tracking-wider text-foreground block">
          {t('filterCategory')}
        </label>
        <div className="space-y-1.5">
          <button
            onClick={() => onChangeFilters({ ...filters, category: 'all' })}
            className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filters.category === 'all'
                ? 'bg-primary text-primary-foreground font-bold'
                : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
            }`}
          >
            Все категории
          </button>
          {categories.map((c) => (
            <button
              key={c.slug}
              onClick={() => onChangeFilters({ ...filters, category: c.slug })}
              className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                filters.category === c.slug
                  ? 'bg-primary text-primary-foreground font-bold'
                  : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {/* Brand Filter */}
      <div className="space-y-3 pt-3 border-t border-border">
        <label className="text-xs font-bold uppercase tracking-wider text-foreground block">
          {t('filterBrand')}
        </label>
        <div className="space-y-1.5">
          <button
            onClick={() => onChangeFilters({ ...filters, brand: 'all' })}
            className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filters.brand === 'all'
                ? 'bg-primary text-primary-foreground font-bold'
                : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
            }`}
          >
            Все бренды
          </button>
          {brands.map((b) => (
            <button
              key={b}
              onClick={() => onChangeFilters({ ...filters, brand: b })}
              className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                filters.brand === b
                  ? 'bg-primary text-primary-foreground font-bold'
                  : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
              }`}
            >
              {b}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="space-y-3 pt-3 border-t border-border">
        <div className="flex justify-between items-center text-xs">
          <label className="font-bold uppercase tracking-wider text-foreground">
            {t('filterPrice')}
          </label>
          <span className="font-mono text-brand-lime font-bold">
            до {formatUZS(filters.maxPrice)}
          </span>
        </div>
        <input
          type="range"
          min="100000"
          max="3000000"
          step="50000"
          value={filters.maxPrice}
          onChange={(e) =>
            onChangeFilters({ ...filters, maxPrice: Number(e.target.value) })
          }
          className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-brand-lime"
        />
      </div>

      {/* In Stock Only Checkbox */}
      <div className="pt-3 border-t border-border flex items-center space-x-2">
        <input
          type="checkbox"
          id="inStock"
          checked={filters.inStockOnly}
          onChange={(e) =>
            onChangeFilters({ ...filters, inStockOnly: e.target.checked })
          }
          className="w-4 h-4 rounded border-border text-primary focus:ring-primary accent-brand-lime cursor-pointer"
        />
        <label
          htmlFor="inStock"
          className="text-xs text-foreground cursor-pointer select-none"
        >
          {t('inStockOnly')}
        </label>
      </div>
    </aside>
  );
}
