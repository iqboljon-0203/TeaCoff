import React from 'react';
import { notFound } from 'next/navigation';
import { SEED_CATEGORIES, SEED_PRODUCTS } from '@/lib/seed-data';
import { ProductCard } from '@/components/catalog/ProductCard';
import { Link } from '@/i18n/routing';
import { ArrowLeft } from 'lucide-react';

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ locale: string; category: string }>;
}) {
  const { locale, category: categorySlug } = await params;

  const currentCategory = SEED_CATEGORIES.find((c) => c.slug === categorySlug);
  if (!currentCategory) {
    notFound();
  }

  const products = SEED_PRODUCTS.filter((p) => p.category_slug === categorySlug);
  const title =
    currentCategory.title[locale as keyof typeof currentCategory.title] ||
    currentCategory.title.ru;
  const desc =
    currentCategory.description?.[locale as keyof typeof currentCategory.description] ||
    currentCategory.description?.ru;

  return (
    <div className="w-full min-h-screen bg-background py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Back Link */}
        <Link
          href="/catalog"
          className="inline-flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-brand-lime transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Все категории</span>
        </Link>

        {/* Category Header */}
        <div className="space-y-2 pb-6 border-b border-border">
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-foreground">
            {title}
          </h1>
          {desc && (
            <p className="text-sm text-muted-foreground max-w-2xl font-light">
              {desc}
            </p>
          )}
        </div>

        {/* Product Cards */}
        {products.length === 0 ? (
          <div className="py-20 text-center rounded-2xl bg-card border border-border p-8">
            <p className="text-sm text-muted-foreground">В этой категории пока нет товаров</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
