'use client';

import React from 'react';
import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { Check, ShieldCheck, Zap } from 'lucide-react';
import { Product } from '@/types/database';
import { formatUZS } from '@/lib/utils';

interface MachineSelectorProps {
  machines: Product[];
  selectedMachineId: string;
  onSelectMachine: (machine: Product) => void;
}

export function MachineSelector({
  machines,
  selectedMachineId,
  onSelectMachine,
}: MachineSelectorProps) {
  const t = useTranslations('rental');
  const locale = useLocale();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-serif text-xl sm:text-2xl font-bold text-black dark:text-white flex items-center space-x-2">
          <span>{t('pickMachine')}</span>
        </h3>
        <span className="text-xs font-mono text-[#4A453F] dark:text-brand-lime font-bold">
          Всего доступно {machines.length} моделей
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {machines.map((machine) => {
          const isSelected = machine.id === selectedMachineId;
          const title =
            machine.title[locale as keyof typeof machine.title] ||
            machine.title.ru;
          const desc =
            machine.description[locale as keyof typeof machine.description] ||
            machine.description.ru;

          return (
            <div
              key={machine.id}
              onClick={() => onSelectMachine(machine)}
              className={`cursor-pointer rounded-2xl border transition-all duration-300 p-6 flex flex-col justify-between relative overflow-hidden ${
                isSelected
                  ? 'bg-white dark:bg-[#15151A] border-brand-lime shadow-xl shadow-brand-lime/10 ring-2 ring-brand-lime'
                  : 'bg-[#FAF9F5] dark:bg-[#111115] border-[#EAE6DE] dark:border-white/10 hover:border-black/30 dark:hover:border-white/20'
              }`}
            >
              {/* Selected indicator */}
              {isSelected && (
                <div className="absolute top-4 right-4 z-10 w-7 h-7 rounded-full bg-brand-lime text-black flex items-center justify-center font-bold shadow-md">
                  <Check className="w-4 h-4 stroke-[3]" />
                </div>
              )}

              {/* Machine Image */}
              <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden bg-[#F5F2EB] dark:bg-black/40 mb-4">
                <Image
                  src={machine.images[0]}
                  alt={title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover object-center filter brightness-95"
                />
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 rounded bg-black/80 backdrop-blur-sm text-brand-lime text-[10px] font-extrabold uppercase tracking-wider border border-brand-lime/30">
                    {machine.specs.pressure || '15 bar'} • {machine.specs.system || 'Dolce Gusto'}
                  </span>
                </div>
              </div>

              {/* Info */}
              <div className="space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="font-serif text-lg font-bold text-black dark:text-white tracking-wide">
                    {title}
                  </h4>
                  <p className="text-xs text-[#6B645C] dark:text-neutral-400 font-light mt-1 line-clamp-2">
                    {desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#EAE6DE] dark:border-white/5 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-[#7A7166] dark:text-neutral-400">Стоимость аренды:</span>
                    <span className="font-extrabold text-black dark:text-brand-lime text-sm">
                      0 сум / месяц
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-[#7A7166] dark:text-neutral-400">Условие:</span>
                    <span className="font-semibold text-black dark:text-white">
                      от {machine.min_capsule_boxes} коробок/мес
                    </span>
                  </div>
                  {machine.old_price && (
                    <div className="flex justify-between items-center text-[11px] text-[#8A8175] dark:text-neutral-500">
                      <span>Экономия на покупке:</span>
                      <span className="line-through">{formatUZS(machine.old_price, locale)}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
