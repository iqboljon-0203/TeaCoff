'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { ShieldCheck, Truck, Wrench, RefreshCw, Sparkles, AlertCircle, CheckCircle } from 'lucide-react';
import { SEED_PRODUCTS } from '@/lib/seed-data';
import { Product } from '@/types/database';
import { MachineSelector } from '@/components/rental/MachineSelector';
import { CapsulePicker } from '@/components/rental/CapsulePicker';
import { RentalBookingForm } from '@/components/rental/RentalBookingForm';

export default function RentalPage() {
  const t = useTranslations('rental');

  // Filter rental machines
  const rentalMachines = SEED_PRODUCTS.filter((p) => p.is_rental_machine);

  const [selectedMachine, setSelectedMachine] = useState<Product>(
    rentalMachines[0]
  );

  // Capsule flavor quantities state
  const [capsuleQuantities, setCapsuleQuantities] = useState<Record<string, number>>({
    'cap-crema': 2,
    'cap-arabica': 2,
  });

  const handleUpdateQuantity = (capsuleId: string, delta: number) => {
    setCapsuleQuantities((prev) => {
      const current = prev[capsuleId] || 0;
      const next = Math.max(0, current + delta);
      return { ...prev, [capsuleId]: next };
    });
  };

  const minBoxesRequired = selectedMachine.min_capsule_boxes || 4;

  const terms = [
    {
      icon: ShieldCheck,
      title: 'Без залога (0 сум)',
      desc: 'Никаких залоговых депозитов или скрытых платежей при оформлении договора.',
    },
    {
      icon: Truck,
      title: 'Бесплатная доставка',
      desc: 'Доставка кофемашины по Ташкенту осуществляется полностью за счет компании.',
    },
    {
      icon: Wrench,
      title: 'Официальный сервис',
      desc: 'Диагностика, техническое обслуживание и чистка покрываются компанией TeaCoff.',
    },
    {
      icon: RefreshCw,
      title: 'Быстрая замена 24ч',
      desc: 'При возникновении технической неисправности заменим кофемашину на новую за 24 часа.',
    },
  ];

  return (
    <div className="w-full min-h-screen bg-background py-12 lg:py-20 text-foreground transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Header Hero */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-surface border border-brand-lime/30 text-brand-lime text-xs font-mono font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>0 СУМ ВО ВРЕМЕННОЕ ПОЛЬЗОВАНИЕ</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-tight">
            {t('pageTitle')}
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground font-light leading-relaxed">
            {t('pageSubtitle')}
          </p>
        </div>

        {/* 4 Terms Cards */}
        <div className="p-8 rounded-2xl bg-card border border-border space-y-6">
          <h3 className="font-serif text-xl font-bold text-foreground tracking-wide">
            {t('termsTitle')}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {terms.map((term, idx) => {
              const Icon = term.icon;
              return (
                <div key={idx} className="space-y-2">
                  <div className="flex items-center space-x-2 text-brand-lime">
                    <Icon className="w-5 h-5 shrink-0" />
                    <h4 className="text-xs sm:text-sm font-bold text-foreground">
                      {term.title}
                    </h4>
                  </div>
                  <p className="text-xs text-muted-foreground font-light leading-relaxed">
                    {term.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Step 1: Model Selector */}
        <MachineSelector
          machines={rentalMachines}
          selectedMachineId={selectedMachine.id}
          onSelectMachine={setSelectedMachine}
        />

        {/* Step 2: Capsule Picker with Validation */}
        <CapsulePicker
          minBoxesRequired={minBoxesRequired}
          capsuleQuantities={capsuleQuantities}
          onUpdateQuantity={handleUpdateQuantity}
        />

        {/* Step 3: Booking Form */}
        <RentalBookingForm
          selectedMachine={selectedMachine}
          capsuleQuantities={capsuleQuantities}
          minBoxesRequired={minBoxesRequired}
        />

        {/* Section: Repair Rules & Responsibility (TZ Point 10) */}
        <div className="p-8 rounded-2xl bg-card border border-border space-y-6">
          <div className="max-w-2xl space-y-2">
            <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-brand-lime font-bold">
              ПРАВИЛА И ГАРАНТИЯ
            </span>
            <h3 className="font-serif text-2xl font-bold text-foreground">
              Ремонт и ответственность сторон
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Мы строим прозрачные и доверительные отношения с клиентами, поэтому правила обслуживания закреплены в договоре аренды.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            {/* Technical malfunction */}
            <div className="p-6 rounded-xl bg-secondary/40 border border-border space-y-3">
              <div className="flex items-center space-x-2.5 text-brand-lime">
                <CheckCircle className="w-5 h-5 shrink-0" />
                <h4 className="font-bold text-sm text-foreground">
                  Техническая неисправность кофемашины
                </h4>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Если кофемашина перестала работать из-за заводского брака, естественного износа помпы или программного сбоя, компания TeaCoff проводит бесплатную диагностику, ремонт или замену оборудования за 24 часа. Все расходы берет на себя компания.
              </p>
            </div>

            {/* Damage caused by renter */}
            <div className="p-6 rounded-xl bg-secondary/40 border border-border space-y-3">
              <div className="flex items-center space-x-2.5 text-amber-500">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <h4 className="font-bold text-sm text-foreground">
                  Повреждения по вине арендатора
                </h4>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Если при технической экспертизе установлено, что оборудование было умышленно повреждено, подверглось падению, залитию посторонними жидкостями или эксплуатировалось с нарушением инструкции, расходы на восстановление оплачивает арендатор.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
