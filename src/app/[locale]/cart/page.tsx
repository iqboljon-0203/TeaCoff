'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { Plus, Minus, Trash2, ArrowRight, ShoppingBag, ShieldCheck, Tag } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { formatUZS } from '@/lib/utils';
import { Link } from '@/i18n/routing';

export default function CartPage() {
  const t = useTranslations('cart');
  const locale = useLocale();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const {
    items,
    updateQuantity,
    removeItem,
    clearCart,
    getSubtotal,
    getDeliveryFee,
    getDiscount,
    getTotalAmount,
    appliedPromo,
    applyPromo,
    removePromo,
    getTotalCapsuleBoxes,
  } = useCartStore();

  const [promoInput, setPromoInput] = useState('');
  const [promoMessage, setPromoMessage] = useState<{ text: string; isError: boolean } | null>(null);

  const subtotal = getSubtotal();
  const delivery = getDeliveryFee();
  const discount = getDiscount();
  const total = getTotalAmount();
  const capsuleBoxes = getTotalCapsuleBoxes();

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    const res = applyPromo(promoInput);
    setPromoMessage({ text: res.message, isError: !res.success });
    if (res.success) setPromoInput('');
  };

  if (!mounted) {
    return (
      <div className="w-full min-h-[70vh] flex items-center justify-center py-20 px-4">
        <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="w-full min-h-[70vh] flex flex-col items-center justify-center py-20 px-4 text-center bg-background">
        <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center text-muted-foreground mb-4">
          <ShoppingBag className="w-10 h-10 stroke-1" />
        </div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-foreground mb-2">
          {t('empty')}
        </h1>
        <p className="text-xs text-muted-foreground mb-6 max-w-sm">
          В вашей корзине пока нет товаров. Добавьте понравившийся кофе или кофемашину из каталога.
        </p>
        <Link
          href="/catalog"
          className="px-8 py-3.5 rounded-xl bg-primary text-primary-foreground font-extrabold text-xs uppercase tracking-wider hover:brightness-110 shadow-lg glow-lime transition-all"
        >
          {t('startShopping')}
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-background py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex justify-between items-end pb-6 border-b border-border">
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-foreground">
            {t('title')}
          </h1>
          <button
            onClick={clearCart}
            className="text-xs text-muted-foreground hover:text-destructive transition-colors flex items-center space-x-1"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{t('clearCart')}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Items list - 8 cols */}
          <div className="lg:col-span-8 space-y-4">
            {capsuleBoxes > 0 && (
              <div className="p-4 rounded-xl bg-card border border-brand-lime/30 flex items-center space-x-3 text-xs">
                <ShieldCheck className="w-5 h-5 text-brand-lime shrink-0" />
                <div>
                  <p className="font-bold text-foreground">
                    Капсул в корзине: {capsuleBoxes} упаковок
                  </p>
                  <p className="text-muted-foreground text-[11px]">
                    {capsuleBoxes >= 4
                      ? '✓ Доставка по Ташкенту бесплатная!'
                      : `Добавьте еще ${4 - capsuleBoxes} уп. для бесплатной доставки.`}
                  </p>
                </div>
              </div>
            )}

            <div className="rounded-2xl bg-card border border-border divide-y divide-border overflow-hidden">
              {items.map((item) => {
                const title =
                  item.product.title[locale as keyof typeof item.product.title] ||
                  item.product.title.ru;
                const isRental = item.product.is_rental_machine && item.product.price === 0;

                return (
                  <div key={item.product.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center space-x-4">
                      <div className="relative w-16 h-16 rounded-xl bg-secondary/50 border border-border overflow-hidden shrink-0">
                        <Image
                          src={item.product.images[0]}
                          alt={title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="space-y-1">
                        <Link
                          href={`/product/${item.product.slug}`}
                          className="text-sm font-bold text-foreground hover:text-brand-lime transition-colors"
                        >
                          {title}
                        </Link>
                        <p className="text-xs text-muted-foreground">
                          {item.product.brand} • {item.product.weight_volume}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end space-x-6">
                      {/* Counter */}
                      <div className="flex items-center border border-border rounded-lg bg-secondary/40 p-1">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="w-7 h-7 rounded hover:bg-secondary flex items-center justify-center text-foreground"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-8 text-center text-xs font-bold text-foreground">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="w-7 h-7 rounded hover:bg-secondary flex items-center justify-center text-foreground"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Price */}
                      <div className="text-right min-w-[100px]">
                        {isRental ? (
                          <span className="text-xs font-bold text-brand-lime">
                            0 сум (Аренда)
                          </span>
                        ) : (
                          <span className="text-sm font-bold text-foreground">
                            {formatUZS(item.product.price * item.quantity, locale)}
                          </span>
                        )}
                      </div>

                      {/* Trash */}
                      <button
                        onClick={() => removeItem(item.product.id)}
                        className="text-muted-foreground hover:text-destructive p-1 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Summary Sidebar - 4 cols */}
          <div className="lg:col-span-4 space-y-4">
            <div className="p-6 rounded-2xl bg-card border border-border space-y-5">
              <h3 className="font-serif text-lg font-bold text-foreground pb-3 border-b border-border">
                {t('summary')}
              </h3>

              {/* Promo Code Input */}
              <form onSubmit={handleApplyPromo} className="space-y-2">
                <div className="flex space-x-2">
                  <div className="relative flex-1">
                    <Tag className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value)}
                      placeholder={t('promoCode')}
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-secondary/50 border border-border text-xs text-foreground outline-none focus:border-brand-lime uppercase font-mono"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-secondary hover:bg-secondary/80 text-foreground font-bold text-xs uppercase"
                  >
                    {t('applyPromo')}
                  </button>
                </div>
                {promoMessage && (
                  <p
                    className={`text-[11px] ${
                      promoMessage.isError ? 'text-red-400' : 'text-brand-lime'
                    }`}
                  >
                    {promoMessage.text}
                  </p>
                )}
                {appliedPromo && (
                  <div className="flex items-center justify-between text-xs text-brand-lime font-mono pt-1">
                    <span>Промокод {appliedPromo.code} активен</span>
                    <button
                      type="button"
                      onClick={removePromo}
                      className="text-muted-foreground hover:text-destructive underline text-[10px]"
                    >
                      Удалить
                    </button>
                  </div>
                )}
              </form>

              {/* Cost Breakdown */}
              <div className="space-y-2 pt-3 border-t border-border text-xs">
                <div className="flex justify-between text-muted-foreground">
                  <span>{t('subtotal')}</span>
                  <span className="font-medium text-foreground">{formatUZS(subtotal, locale)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-brand-lime">
                    <span>{t('promoDiscount')}</span>
                    <span className="font-medium">-{formatUZS(discount, locale)}</span>
                  </div>
                )}
                <div className="flex justify-between text-muted-foreground">
                  <span>{t('delivery')}</span>
                  <span className={delivery === 0 ? 'text-brand-lime font-medium' : 'text-foreground font-medium'}>
                    {delivery === 0 ? t('freeDelivery') : formatUZS(delivery, locale)}
                  </span>
                </div>
                <div className="flex justify-between text-base font-bold pt-3 border-t border-border text-foreground">
                  <span>{t('total')}</span>
                  <span className="font-extrabold text-brand-lime">
                    {formatUZS(total, locale)}
                  </span>
                </div>
              </div>

              {/* Checkout CTA */}
              <Link
                href="/checkout"
                className="w-full py-3.5 px-4 rounded-xl bg-primary hover:brightness-110 text-primary-foreground font-extrabold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 shadow-lg glow-lime transition-all"
              >
                <span>{t('checkout')}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
