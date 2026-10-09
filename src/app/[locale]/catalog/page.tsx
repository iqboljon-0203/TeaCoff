'use client';

import React, { useState, useMemo } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Search, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import { SEED_PRODUCTS, SEED_CATEGORIES } from '@/lib/seed-data';
import { ProductCard } from '@/components/catalog/ProductCard';
import { FilterSidebar, FilterState } from '@/components/catalog/FilterSidebar';

export default function CatalogPage() {
  const t = useTranslations('catalog');
  const locale = useLocale();

  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'popular' | 'price_asc' | 'price_desc' | 'newest'>('popular');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const [filters, setFilters] = useState<FilterState>({
    category: 'all',
    brand: 'all',
    maxPrice: 3000000,
    inStockOnly: false,
  });

  const categories = SEED_CATEGORIES.map((c) => ({
    slug: c.slug,
    name: c.title[locale as keyof typeof c.title] || c.title.ru,
  }));

  const brands = useMemo(() => {
    return Array.from(new Set(SEED_PRODUCTS.map((p) => p.brand)));
  }, []);

  const filteredProducts = useMemo(() => {
    return SEED_PRODUCTS.filter((product) => {
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const title = (product.title[locale as keyof typeof product.title] || product.title.ru).toLowerCase();
        const brand = product.brand.toLowerCase();
        if (!title.includes(q) && !brand.includes(q)) return false;
      }

      // Category
      if (filters.category !== 'all' && product.category_slug !== filters.category) {
        return false;
      }

      // Brand
      if (filters.brand !== 'all' && product.brand !== filters.brand) {
        return false;
      }

      // Price
      if (product.price > filters.maxPrice) {
        return false;
      }

      // In Stock
      if (filters.inStockOnly && !product.in_stock) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price_asc') return a.price - b.price;
      if (sortBy === 'price_desc') return b.price - a.price;
      return 0;
    });
  }, [searchQuery, filters, sortBy, locale]);

  const handleResetFilters = () => {
    setFilters({
      category: 'all',
      brand: 'all',
      maxPrice: 3000000,
      inStockOnly: false,
    });
    setSearchQuery('');
  };

  return (
    <div className="w-full min-h-screen bg-background py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-border">
          <div className="space-y-1">
            <span className="text-[10px] font-mono tracking-widest uppercase text-brand-lime font-bold">
              TEACOFF COLLECTION
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-foreground">
              {t('title')}
            </h1>
            <p className="text-xs text-muted-foreground">
              {t('itemsCount', { count: filteredProducts.length })}
            </p>
          </div>

          {/* Search & Sort Controls */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Live Search input */}
            <div className="relative min-w-[220px]">
              <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Поиск по названию..."
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-card border border-border text-xs text-foreground placeholder:text-muted-foreground outline-none focus:border-brand-lime transition-colors"
              />
            </div>

            {/* Sort Dropdown */}
            <div className="relative flex items-center">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                aria-label="Сортировка"
                className="pl-3 pr-8 py-2 rounded-xl bg-card border border-border text-xs text-foreground outline-none focus:border-brand-lime transition-colors cursor-pointer"
              >
                <option value="popular">{t('sortPopular')}</option>
                <option value="price_asc">{t('sortPriceAsc')}</option>
                <option value="price_desc">{t('sortPriceDesc')}</option>
                <option value="newest">{t('sortNewest')}</option>
              </select>
            </div>

            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="lg:hidden p-2 rounded-xl bg-card border border-border text-foreground hover:border-brand-lime"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Layout */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Desktop Filter Sidebar */}
          <div className="hidden lg:block">
            <FilterSidebar
              filters={filters}
              onChangeFilters={setFilters}
              onReset={handleResetFilters}
              categories={categories}
              brands={brands}
            />
          </div>

          {/* Mobile Filter Drawer */}
          {showMobileFilters && (
            <div className="lg:hidden w-full">
              <FilterSidebar
                filters={filters}
                onChangeFilters={setFilters}
                onReset={handleResetFilters}
                categories={categories}
                brands={brands}
              />
            </div>
          )}

          {/* Product Grid */}
          <div className="flex-1 w-full">
            {filteredProducts.length === 0 ? (
              <div className="py-24 text-center space-y-4 rounded-2xl bg-card border border-border p-8">
                <p className="text-base font-semibold text-foreground">{t('empty')}</p>
                <button
                  onClick={handleResetFilters}
                  className="px-6 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-bold uppercase tracking-wider hover:brightness-110 transition-all"
                >
                  {t('clearFilters')}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
