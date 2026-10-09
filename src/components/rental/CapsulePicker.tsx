'use client';

import React from 'react';
import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { Plus, Minus, AlertCircle, CheckCircle2, ShieldCheck } from 'lucide-react';
import { formatUZS } from '@/lib/utils';

export interface CapsuleFlavor {
  id: string;
  name: string;
  intensity: string;
  count: number;
  price: number;
  image: string;
  notes: string;
}

interface CapsulePickerProps {
  minBoxesRequired: number;
  capsuleQuantities: Record<string, number>;
  onUpdateQuantity: (capsuleId: string, delta: number) => void;
}

export const CAPSULE_FLAVORS: CapsuleFlavor[] = [
  {
    id: 'cap-crema',
    name: 'Carraro Crema (16 шт)',
    intensity: '9/10',
    count: 16,
    price: 95000,
    image: '/images/product-carraro.jpg',
    notes: 'Карамель, орех, густая крема',
  },
  {
    id: 'cap-arabica',
    name: 'Carraro 100% Arabica (16 шт)',
    intensity: '7/10',
    count: 16,
    price: 95000,
    image: '/images/product-carraro.jpg',
    notes: 'Цветочные ноты, мягкая кислинка',
  },
  {
    id: 'cap-intenso',
    name: 'Carraro Intenso (16 шт)',
    intensity: '10/10',
    count: 16,
    price: 95000,
    image: '/images/product-carraro.jpg',
    notes: 'Темный шоколад, пряности, крепкий',
  },
  {
    id: 'cap-decaf',
    name: 'Carraro Decaffeinato (16 шт)',
    intensity: '6/10',
    count: 16,
    price: 98000,
    image: '/images/product-carraro.jpg',
    notes: 'Без кофеина, нежный вкус',
  },
];

export function CapsulePicker({
  minBoxesRequired,
  capsuleQuantities,
  onUpdateQuantity,
}: CapsulePickerProps) {
  const t = useTranslations('rental');
  const locale = useLocale();

  const totalBoxes = Object.values(capsuleQuantities).reduce((a, b) => a + b, 0);
  const isValid = totalBoxes >= minBoxesRequired;

  const totalCost = Object.entries(capsuleQuantities).reduce((sum, [id, qty]) => {
    const flavor = CAPSULE_FLAVORS.find((f) => f.id === id);
    return sum + (flavor?.price || 95000) * qty;
  }, 0);

  return (
    <div className="space-y-6">
      {/* Title & Status Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-serif text-xl sm:text-2xl font-bold text-white">
            {t('pickCapsules')}
          </h3>
          <p className="text-xs text-neutral-400 mt-1">
            Скомбинируйте любые вкусы на ваш выбор.
          </p>
        </div>

        {/* Counter Badge */}
        <div
          className={`px-4 py-2 rounded-xl border flex items-center space-x-3 text-xs font-mono ${
            isValid
              ? 'bg-brand-surface border-brand-lime text-brand-lime'
              : 'bg-red-950/40 border-red-500/40 text-red-300'
          }`}
        >
          {isValid ? (
            <CheckCircle2 className="w-4 h-4 text-brand-lime" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-400" />
          )}
          <span>
            {t('totalBoxes')} <b className="text-sm font-sans">{totalBoxes}</b> / {t('minRequired')}{' '}
            <b className="text-sm font-sans">{minBoxesRequired}</b> уп.
          </span>
        </div>
      </div>

      {/* Validation Message if insufficient boxes */}
      {!isValid && (
        <div className="p-3.5 rounded-xl bg-red-950/30 border border-red-500/30 flex items-center space-x-3 text-xs text-red-300">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
          <span>{t('validationError', { min: minBoxesRequired })}</span>
        </div>
      )}

      {/* Flavors Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {CAPSULE_FLAVORS.map((flavor) => {
          const qty = capsuleQuantities[flavor.id] || 0;
          return (
            <div
              key={flavor.id}
              className="p-4 rounded-xl bg-[#111115] border border-white/5 hover:border-white/15 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="flex space-x-3 items-center">
                <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-black/40 shrink-0">
                  <Image
                    src={flavor.image}
                    alt={flavor.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="space-y-0.5">
                  <h4 className="text-xs font-bold text-white line-clamp-1">
                    {flavor.name}
                  </h4>
                  <p className="text-[11px] text-neutral-400 line-clamp-1">
                    {flavor.notes}
                  </p>
                  <span className="text-[10px] font-mono text-brand-lime font-bold">
                    Интенсивность: {flavor.intensity}
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                <span className="text-xs font-bold text-white">
                  {formatUZS(flavor.price, locale)}
                </span>

                {/* Counter buttons */}
                <div className="flex items-center space-x-1.5 border border-white/10 rounded-lg p-0.5 bg-black/40">
                  <button
                    type="button"
                    onClick={() => onUpdateQuantity(flavor.id, -1)}
                    disabled={qty === 0}
                    className="w-7 h-7 rounded hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent text-white flex items-center justify-center transition-colors"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-6 text-center text-xs font-bold text-white">
                    {qty}
                  </span>
                  <button
                    type="button"
                    onClick={() => onUpdateQuantity(flavor.id, 1)}
                    className="w-7 h-7 rounded hover:bg-white/10 text-white flex items-center justify-center transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary Total */}
      <div className="p-4 rounded-xl bg-[#15151A] border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center space-x-2 text-neutral-300">
          <ShieldCheck className="w-4 h-4 text-brand-lime" />
          <span>
            Итого к оплате при доставке: <b>{formatUZS(totalCost, locale)}</b> (Кофемашина во временное пользование: <b>0 сум</b>)
          </span>
        </div>
        <span className="text-[11px] text-brand-lime font-mono">
          ✓ Бесплатная доставка по Ташкенту включена
        </span>
      </div>
    </div>
  );
}
