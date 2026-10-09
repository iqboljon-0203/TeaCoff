'use client';

import React from 'react';
import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, ShieldCheck } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { formatUZS } from '@/lib/utils';
import { Link } from '@/i18n/routing';

export function CartDrawer() {
  const t = useTranslations('cart');
  const locale = useLocale();
  const {
    items,
    isOpen,
    closeCart,
    updateQuantity,
    removeItem,
    getSubtotal,
    getDeliveryFee,
    getTotalAmount,
    getTotalCapsuleBoxes,
  } = useCartStore();

  const subtotal = getSubtotal();
  const delivery = getDeliveryFee();
  const total = getTotalAmount();
  const capsuleBoxes = getTotalCapsuleBoxes();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={closeCart}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-card border-l border-border shadow-2xl flex flex-col justify-between">
          {/* Header */}
          <div className="px-6 py-5 border-b border-border flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="w-5 h-5 text-brand-lime" />
              <h2 className="text-lg font-bold tracking-tight text-foreground uppercase">
                {t('title')} ({items.reduce((acc, i) => acc + i.quantity, 0)})
              </h2>
            </div>
            <button
              onClick={closeCart}
              className="p-1.5 rounded-full hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12 space-y-4">
                <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center text-muted-foreground">
                  <ShoppingBag className="w-8 h-8 stroke-1" />
                </div>
                <div className="space-y-1">
                  <p className="text-base font-medium text-foreground">{t('empty')}</p>
                  <p className="text-xs text-muted-foreground">
                    Добавьте капсулы или выберите кофемашину в каталоге
                  </p>
                </div>
                <Link
                  href="/catalog"
                  onClick={closeCart}
                  className="px-6 py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:brightness-110 transition-all"
                >
                  {t('startShopping')}
                </Link>
              </div>
            ) : (
              <>
                {/* Capsule Rental Indicator */}
                {capsuleBoxes > 0 && (
                  <div className="p-3 rounded-lg bg-brand-surface border border-brand-lime/20 flex items-start space-x-3 text-xs">
                    <ShieldCheck className="w-4 h-4 text-brand-lime shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-foreground">
                        Выбрано коробок капсул: {capsuleBoxes} шт.
                      </p>
                      <p className="text-muted-foreground text-[11px]">
                        {capsuleBoxes >= 4
                          ? '✓ Выполнено условие бесплатной доставки и аренды за 0 сум!'
                          : `Добавьте еще ${4 - capsuleBoxes} уп. для бесплатной доставки в Ташкенте`}
                      </p>
                    </div>
                  </div>
                )}

                {/* Items List */}
                <div className="divide-y divide-border">
                  {items.map((item) => {
                    const title =
                      item.product.title[locale as keyof typeof item.product.title] ||
                      item.product.title.ru;
                    const isRental = item.product.is_rental_machine && item.product.price === 0;

                    return (
                      <div key={item.product.id} className="py-4 flex space-x-4">
                        <div className="relative w-16 h-16 rounded-lg bg-secondary/40 border border-border overflow-hidden shrink-0">
                          <Image
                            src={item.product.images[0] || 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?q=80&w=400'}
                            alt={title}
                            fill
                            className="object-cover"
                          />
                        </div>

                        <div className="flex-1 flex flex-col justify-between">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="text-sm font-medium text-foreground line-clamp-1">
                                {title}
                              </h3>
                              <p className="text-xs text-muted-foreground mt-0.5">
                                {item.product.weight_volume || item.product.brand}
                              </p>
                            </div>
                            <button
                              onClick={() => removeItem(item.product.id)}
                              className="text-muted-foreground hover:text-destructive p-1 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="flex justify-between items-center mt-3">
                            {/* Counter */}
                            <div className="flex items-center border border-border rounded-md bg-secondary/50">
                              <button
                                onClick={() =>
                                  updateQuantity(item.product.id, item.quantity - 1)
                                }
                                className="p-1 hover:bg-secondary text-muted-foreground hover:text-foreground"
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </button>
                              <span className="px-3 text-xs font-semibold text-foreground">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() =>
                                  updateQuantity(item.product.id, item.quantity + 1)
                                }
                                className="p-1 hover:bg-secondary text-muted-foreground hover:text-foreground"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            <div className="text-right">
                              {isRental ? (
                                <span className="text-xs font-bold text-brand-lime">
                                  0 сум (Аренда)
                                </span>
                              ) : (
                                <span className="text-sm font-semibold text-foreground">
                                  {formatUZS(item.product.price * item.quantity, locale)}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>

          {/* Footer with totals & checkout */}
          {items.length > 0 && (
            <div className="p-6 border-t border-border bg-card/90 backdrop-blur-sm space-y-3">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-muted-foreground">
                  <span>{t('subtotal')}</span>
                  <span className="text-foreground font-medium">{formatUZS(subtotal, locale)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>{t('delivery')}</span>
                  <span className={delivery === 0 ? 'text-brand-lime font-medium' : 'text-foreground font-medium'}>
                    {delivery === 0 ? t('freeDelivery') : formatUZS(delivery, locale)}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold pt-2 border-t border-border text-foreground">
                  <span>{t('total')}</span>
                  <span className="text-base text-brand-lime font-extrabold">
                    {formatUZS(total, locale)}
                  </span>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className="w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-lg bg-primary text-primary-foreground font-bold text-sm tracking-wide uppercase hover:brightness-110 shadow-lg glow-lime transition-all"
                >
                  <span>{t('checkout')}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
