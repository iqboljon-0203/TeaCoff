'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Send, CheckCircle2, MessageCircle, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Product } from '@/types/database';
import { CAPSULE_FLAVORS } from './CapsulePicker';

interface RentalBookingFormProps {
  selectedMachine: Product;
  capsuleQuantities: Record<string, number>;
  minBoxesRequired: number;
}

const TASHKENT_DISTRICTS = [
  'Мирзо-Улугбекский район',
  'Чиланзарский район',
  'Юнусабадский район',
  'Яккасарайский район',
  'Мирабадский район',
  'Шайхантахурский район',
  'Яшнабадский район',
  'Алмазарский район',
  'Учтепинский район',
  'Сергелийский район',
  'Янгихаётский район',
  'Бектемирский район',
];

export function RentalBookingForm({
  selectedMachine,
  capsuleQuantities,
  minBoxesRequired,
}: RentalBookingFormProps) {
  const t = useTranslations('rental');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('+998 ');
  const [district, setDistrict] = useState(TASHKENT_DISTRICTS[0]);
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const totalBoxes = Object.values(capsuleQuantities).reduce((a, b) => a + b, 0);
  const isCapsulesValid = totalBoxes >= minBoxesRequired;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!isCapsulesValid) {
      setErrorMsg(t('validationError', { min: minBoxesRequired }));
      return;
    }

    if (!name.trim() || phone.trim().length < 13 || !address.trim()) {
      setErrorMsg('Пожалуйста, заполните имя, корректный номер телефона и адрес.');
      return;
    }

    setIsSubmitting(true);

    try {
      const selectedCapsulesList = Object.entries(capsuleQuantities)
        .filter(([_, qty]) => qty > 0)
        .map(([id, qty]) => {
          const flavor = CAPSULE_FLAVORS.find((f) => f.id === id);
          return {
            capsule_id: id,
            name: flavor?.name || id,
            boxes: qty,
          };
        });

      const response = await fetch('/api/rental', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_name: name,
          customer_phone: phone,
          machine_model: selectedMachine.title.ru,
          selected_capsules: selectedCapsulesList,
          min_boxes_required: minBoxesRequired,
          cups_per_day: Math.max(1, Math.round((totalBoxes * 16) / 30)),
          district,
          delivery_address: address,
        }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Failed to submit');
      }

      setIsSuccess(true);
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
      });
    } catch (err: any) {
      setErrorMsg(err.message || 'Ошибка отправки заявки');
    } finally {
      setIsSubmitting(false);
    }
  };

  const telegramLink = `https://t.me/TeaCoff_lux?text=${encodeURIComponent(
    `Здравствуйте! Хочу арендовать кофемашину ${selectedMachine.title.ru} за 0 сум. Мой телефон: ${phone}`
  )}`;

  if (isSuccess) {
    return (
      <div className="p-8 sm:p-12 rounded-2xl bg-[#121216] border border-brand-lime/40 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-brand-lime/20 text-brand-lime mx-auto flex items-center justify-center">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white">
            {t('successTitle')}
          </h3>
          <p className="text-sm text-neutral-300 max-w-md mx-auto">
            {t('successDesc')}
          </p>
        </div>
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href={telegramLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 px-6 py-3 rounded-lg bg-brand-lime text-black font-extrabold text-xs uppercase tracking-wider hover:brightness-110 transition-all"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Написать в Telegram @TeaCoff_lux</span>
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="font-serif text-xl sm:text-2xl font-bold text-white">
        {t('formTitle')}
      </h3>

      <form onSubmit={handleSubmit} className="p-6 sm:p-8 rounded-2xl bg-[#121216] border border-white/10 space-y-5">
        {errorMsg && (
          <div className="p-4 rounded-xl bg-red-950/40 border border-red-500/40 text-xs text-red-300 flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase text-neutral-300">
              {t('fullName')} *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Азиз Каримов"
              className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 focus:border-brand-lime text-white text-sm outline-none transition-colors"
            />
          </div>

          {/* Phone */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase text-neutral-300">
              {t('phone')} *
            </label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+998 90 123 45 67"
              className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 focus:border-brand-lime text-white text-sm outline-none transition-colors"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* District */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase text-neutral-300">
              {t('district')} *
            </label>
            <select
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 focus:border-brand-lime text-white text-sm outline-none transition-colors"
            >
              {TASHKENT_DISTRICTS.map((dist) => (
                <option key={dist} value={dist} className="bg-neutral-900 text-white">
                  {dist}
                </option>
              ))}
            </select>
          </div>

          {/* Address */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase text-neutral-300">
              {t('address')} *
            </label>
            <input
              type="text"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="ул. Мустакиллик, д. 45, кв. 12"
              className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 focus:border-brand-lime text-white text-sm outline-none transition-colors"
            />
          </div>
        </div>

        {/* Notes */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase text-neutral-300">
            {t('notes')}
          </label>
          <textarea
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Удобное время для доставки, этаж или код домофона..."
            className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 focus:border-brand-lime text-white text-sm outline-none transition-colors resize-none"
          />
        </div>

        {/* Buttons */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            type="submit"
            disabled={!isCapsulesValid || isSubmitting}
            className={`w-full sm:w-auto px-8 py-3.5 rounded-xl font-extrabold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 transition-all ${
              isCapsulesValid
                ? 'bg-brand-lime text-black hover:bg-[#c0eb00] shadow-lg shadow-brand-lime/20 cursor-pointer'
                : 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
            }`}
          >
            <Send className="w-4 h-4" />
            <span>{isSubmitting ? t('submitting') : t('submit')}</span>
          </button>

          <a
            href={telegramLink}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-semibold transition-all"
          >
            <MessageCircle className="w-4 h-4 text-brand-lime" />
            <span>Арендовать через Telegram</span>
          </a>
        </div>
      </form>
    </div>
  );
}
