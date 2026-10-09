'use client';

import React, { useState } from 'react';
import { X, Send, CheckCircle2, Phone, User, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Product } from '@/types/database';
import { formatUZS } from '@/lib/utils';

interface OneClickOrderModalProps {
  product: Product;
  quantity: number;
  isOpen: boolean;
  onClose: () => void;
}

export function OneClickOrderModal({
  product,
  quantity,
  isOpen,
  onClose,
}: OneClickOrderModalProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('+998 ');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const total = product.price * quantity;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name.trim() || phone.trim().length < 13) {
      setErrorMsg('Пожалуйста, введите ваше имя и корректный номер телефона.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_name: name,
          customer_phone: phone,
          district: 'Ташкент (Быстрый заказ)',
          delivery_address: 'Уточняется менеджером по телефону',
          items: [
            {
              product_id: product.id,
              slug: product.slug,
              title: product.title.ru,
              price: product.price,
              quantity,
              image: product.images[0],
              is_rental: product.is_rental_machine && product.price === 0,
            },
          ],
          total_amount: total,
          delivery_fee: 0,
          payment_method: 'cash_on_delivery',
          notes: 'Купить в 1 клик',
        }),
      });

      if (!response.ok) {
        throw new Error('Не удалось оформить заказ');
      }

      setIsSuccess(true);
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
      });
    } catch (err: any) {
      setErrorMsg(err.message || 'Ошибка оформления');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-md"
      />

      <div className="relative w-full max-w-md bg-card border border-border rounded-2xl shadow-2xl p-6 sm:p-8 z-10 animate-in fade-in zoom-in-95">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-secondary text-muted-foreground hover:text-foreground"
        >
          <X className="w-5 h-5" />
        </button>

        {isSuccess ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-14 h-14 rounded-full bg-brand-lime/20 text-brand-lime mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="font-serif text-2xl font-bold text-foreground">
              Заказ успешно принят!
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Наш менеджер перезвонит на <b>{phone}</b> в течение 10 минут для подтверждения адреса доставки в Ташкенте.
            </p>
            <button
              onClick={onClose}
              className="mt-4 px-6 py-2.5 rounded-lg bg-primary text-primary-foreground font-bold text-xs uppercase tracking-wider hover:brightness-110"
            >
              Закрыть
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1">
              <h3 className="font-serif text-xl font-bold text-foreground">
                Купить в 1 клик
              </h3>
              <p className="text-xs text-muted-foreground">
                {product.title.ru} • {quantity} шт. ({formatUZS(total)})
              </p>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-lg bg-red-950/40 border border-red-500/40 text-xs text-red-300 flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground uppercase">
                  Ваше имя
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Азиз Каримов"
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-secondary/50 border border-border text-foreground text-xs outline-none focus:border-brand-lime"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground uppercase">
                  Номер телефона (+998)
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+998 90 123 45 67"
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-secondary/50 border border-border text-foreground text-xs outline-none focus:border-brand-lime"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-xl bg-primary hover:brightness-110 text-primary-foreground font-extrabold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 shadow-lg glow-lime transition-all"
            >
              <Send className="w-4 h-4" />
              <span>{isSubmitting ? 'Отправляем заказ...' : 'Подтвердить заказ'}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
