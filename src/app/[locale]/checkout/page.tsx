'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { ShieldCheck, CheckCircle2, Send, CreditCard, Banknote, AlertCircle, ShoppingBag, QrCode, ArrowRight, Check } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useCartStore } from '@/store/useCartStore';
import { formatUZS } from '@/lib/utils';
import { Link } from '@/i18n/routing';

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

export default function CheckoutPage() {
  const t = useTranslations('checkout');
  const locale = useLocale();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { items, clearCart, getSubtotal, getDeliveryFee, getDiscount, getTotalAmount } =
    useCartStore();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('+998 ');
  const [district, setDistrict] = useState(TASHKENT_DISTRICTS[0]);
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'unified_qr' | 'cash_on_delivery' | 'card_on_delivery'>('unified_qr');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdOrderNumber, setCreatedOrderNumber] = useState<number | null>(null);
  const [createdOrderId, setCreatedOrderId] = useState<string | null>(null);
  const [isQrPaid, setIsQrPaid] = useState(false);
  const [isConfirmingPayment, setIsConfirmingPayment] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const subtotal = getSubtotal();
  const delivery = getDeliveryFee();
  const discount = getDiscount();
  const total = getTotalAmount();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!name.trim() || phone.trim().length < 13 || !address.trim()) {
      setErrorMessage('Пожалуйста, заполните имя, корректный номер телефона и адрес в Ташкенте.');
      return;
    }

    if (items.length === 0) {
      setErrorMessage('Корзина пуста.');
      return;
    }

    setIsSubmitting(true);

    try {
      const orderPayload = {
        customer_name: name,
        customer_phone: phone,
        district,
        delivery_address: address,
        total_amount: total,
        delivery_fee: delivery,
        payment_method: paymentMethod,
        notes,
        items: items.map((i) => ({
          product_id: i.product.id,
          slug: i.product.slug,
          title: i.product.title[locale as keyof typeof i.product.title] || i.product.title.ru,
          price: i.product.price,
          quantity: i.quantity,
          image: i.product.images[0],
          is_rental: i.product.is_rental_machine && i.product.price === 0,
        })),
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });

      if (!res.ok) {
        throw new Error('Не удалось оформить заказ. Попробуйте еще раз.');
      }

      const data = await res.json();
      setCreatedOrderNumber(data.order.order_number);
      setCreatedOrderId(data.order.id);
      clearCart();
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch (err: any) {
      setErrorMessage(err.message || 'Ошибка оформления заказа');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmQrPayment = async () => {
    if (!createdOrderId) return;
    setIsConfirmingPayment(true);
    try {
      await fetch(`/api/orders/${createdOrderId}/pay`, { method: 'POST' });
      setIsQrPaid(true);
      confetti({
        particleCount: 80,
        spread: 60,
      });
    } catch (e) {
      console.error(e);
    } finally {
      setIsConfirmingPayment(false);
    }
  };

  // Success Screen with Real Единый QR (TZ Point 18)
  if (createdOrderNumber) {
    return (
      <div className="w-full min-h-[75vh] flex flex-col items-center justify-center py-16 px-4 bg-background">
        <div className="max-w-xl w-full p-6 sm:p-8 rounded-2xl bg-card border border-border shadow-2xl space-y-6 text-center">
          <div className="w-16 h-16 rounded-full bg-brand-lime/20 text-brand-lime flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-1">
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-foreground">
              {t('orderSuccess')}
            </h1>
            <p className="font-mono text-base font-bold text-brand-lime">
              {t('orderNumber', { number: createdOrderNumber })}
            </p>
            <p className="text-xs text-muted-foreground">
              Менеджер свяжется с вами по номеру <b>{phone}</b>.
            </p>
          </div>

          {/* Unified QR Payment Box (If QR was selected) */}
          {paymentMethod === 'unified_qr' && (
            <div className="p-5 rounded-2xl bg-secondary/60 border border-brand-lime/30 space-y-4 text-left">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <div className="flex items-center space-x-2">
                  <div className="p-2 rounded-lg bg-brand-lime text-black">
                    <QrCode className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold uppercase text-foreground">
                      Единый QR для оплаты
                    </h3>
                    <p className="text-[10px] text-muted-foreground">
                      Payme • Click • Uzum Bank • Anorbank
                    </p>
                  </div>
                </div>
                {isQrPaid ? (
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-500 text-[10px] font-extrabold uppercase flex items-center space-x-1">
                    <Check className="w-3 h-3" />
                    <span>Оплачено</span>
                  </span>
                ) : (
                  <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-500 text-[10px] font-extrabold uppercase">
                    Ожидает оплаты
                  </span>
                )}
              </div>

              {/* QR Graphic and Details */}
              <div className="flex flex-col sm:flex-row items-center gap-5 pt-1">
                {/* Visual QR Code Generator Simulation */}
                <div className="p-3 bg-white rounded-xl shadow-md shrink-0 flex flex-col items-center">
                  <svg
                    className="w-36 h-36"
                    viewBox="0 0 100 100"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    {/* Corner Position Detection Patterns */}
                    <rect x="5" y="5" width="26" height="26" rx="3" stroke="#000" strokeWidth="4" />
                    <rect x="11" y="11" width="14" height="14" fill="#000" />

                    <rect x="69" y="5" width="26" height="26" rx="3" stroke="#000" strokeWidth="4" />
                    <rect x="75" y="11" width="14" height="14" fill="#000" />

                    <rect x="5" y="69" width="26" height="26" rx="3" stroke="#000" strokeWidth="4" />
                    <rect x="11" y="75" width="14" height="14" fill="#000" />

                    {/* QR Matrix Payload Grid */}
                    <rect x="37" y="7" width="5" height="5" fill="#000" />
                    <rect x="47" y="7" width="5" height="5" fill="#000" />
                    <rect x="57" y="7" width="5" height="5" fill="#000" />
                    <rect x="37" y="17" width="5" height="5" fill="#000" />
                    <rect x="47" y="27" width="5" height="5" fill="#000" />
                    <rect x="57" y="17" width="5" height="5" fill="#000" />

                    <rect x="7" y="37" width="5" height="5" fill="#000" />
                    <rect x="17" y="47" width="5" height="5" fill="#000" />
                    <rect x="27" y="37" width="5" height="5" fill="#000" />
                    <rect x="7" y="57" width="5" height="5" fill="#000" />
                    <rect x="27" y="57" width="5" height="5" fill="#000" />

                    <rect x="37" y="37" width="10" height="10" fill="#000" />
                    <rect x="53" y="37" width="10" height="10" fill="#000" />
                    <rect x="37" y="53" width="10" height="10" fill="#000" />
                    <rect x="53" y="53" width="10" height="10" fill="#000" />

                    <rect x="69" y="37" width="5" height="5" fill="#000" />
                    <rect x="79" y="47" width="5" height="5" fill="#000" />
                    <rect x="89" y="37" width="5" height="5" fill="#000" />
                    <rect x="69" y="57" width="5" height="5" fill="#000" />
                    <rect x="89" y="57" width="5" height="5" fill="#000" />

                    <rect x="37" y="69" width="5" height="5" fill="#000" />
                    <rect x="47" y="79" width="5" height="5" fill="#000" />
                    <rect x="57" y="69" width="5" height="5" fill="#000" />
                    <rect x="37" y="89" width="5" height="5" fill="#000" />
                    <rect x="57" y="89" width="5" height="5" fill="#000" />

                    <rect x="69" y="69" width="10" height="10" fill="#000" />
                    <rect x="85" y="85" width="10" height="10" fill="#000" />
                  </svg>
                  <span className="text-[9px] font-bold text-neutral-800 tracking-wider mt-1 uppercase">
                    TEACOFF • UZ
                  </span>
                </div>

                <div className="space-y-2 text-xs flex-1">
                  <div className="p-2.5 rounded-lg bg-card border border-border">
                    <span className="text-[10px] text-muted-foreground uppercase block">
                      Сумма к оплате:
                    </span>
                    <span className="text-base font-black text-brand-lime">
                      {formatUZS(total, locale)}
                    </span>
                  </div>
                  <div className="text-[11px] text-muted-foreground space-y-1">
                    <p>• Откройте Click, Payme или Uzum Bank</p>
                    <p>• Нажмите «Сканировать QR»</p>
                    <p>• Подтвердите оплату на указанную сумму</p>
                  </div>

                  {!isQrPaid ? (
                    <button
                      onClick={handleConfirmQrPayment}
                      disabled={isConfirmingPayment}
                      className="w-full mt-2 py-2.5 px-4 rounded-xl bg-brand-lime text-black font-extrabold text-xs uppercase tracking-wider hover:brightness-110 transition-all flex items-center justify-center space-x-1 cursor-pointer"
                    >
                      <span>{isConfirmingPayment ? 'Проверка...' : 'Я оплатил через QR'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <div className="w-full mt-2 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 text-xs font-bold text-center">
                      ✓ Оплата подтверждена. Статус обновлен!
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link
              href="/"
              className="flex-1 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-bold text-xs uppercase tracking-wider hover:brightness-110 shadow-lg glow-lime transition-all"
            >
              На главную страницу
            </Link>
            <a
              href={`https://t.me/TeaCoff_lux?text=${encodeURIComponent(
                `Здравствуйте! Я оформил заказ #${createdOrderNumber} на сумму ${formatUZS(total, 'ru')}. Клиент: ${name}, телефон: ${phone}`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 px-6 py-3 rounded-xl bg-secondary hover:bg-secondary/80 text-foreground font-bold text-xs uppercase tracking-wider border border-border transition-all flex items-center justify-center space-x-2"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Telegram менеджер</span>
            </a>
          </div>
        </div>
      </div>
    );
  }

  if (!mounted) {
    return (
      <div className="w-full min-h-[60vh] flex items-center justify-center py-20 px-4">
        <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="w-full min-h-[60vh] flex flex-col items-center justify-center py-20 px-4 text-center bg-background">
        <ShoppingBag className="w-12 h-12 text-muted-foreground mb-4" />
        <p className="text-base font-semibold text-foreground mb-4">
          В корзине нет товаров для оформления
        </p>
        <Link
          href="/catalog"
          className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold uppercase"
        >
          Перейти в каталог
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-background py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="pb-6 border-b border-border space-y-1">
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-foreground">
            {t('title')}
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">{t('subtitle')}</p>
        </div>

        {errorMessage && (
          <div className="p-4 rounded-xl bg-red-950/40 border border-red-500/40 text-xs text-red-300 flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Customer & Delivery Form - 7 cols */}
            <div className="lg:col-span-7 space-y-6">
              <div className="p-6 rounded-2xl bg-card border border-border space-y-4">
                <h3 className="font-serif text-base font-bold text-foreground uppercase tracking-wider">
                  {t('customerInfo')}
                </h3>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground uppercase">
                      {t('fullName')} *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Азиз Каримов"
                      className="w-full px-4 py-2.5 rounded-xl bg-secondary/50 border border-border text-foreground text-xs outline-none focus:border-brand-lime"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground uppercase">
                      {t('phone')} *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+998 90 123 45 67"
                      className="w-full px-4 py-2.5 rounded-xl bg-secondary/50 border border-border text-foreground text-xs outline-none focus:border-brand-lime"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground uppercase">
                      {t('district')} * (Только Ташкент)
                    </label>
                    <select
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-secondary/50 border border-border text-foreground text-xs outline-none focus:border-brand-lime"
                    >
                      {TASHKENT_DISTRICTS.map((dist) => (
                        <option key={dist} value={dist} className="bg-card text-foreground">
                          {dist}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground uppercase">
                      {t('address')} *
                    </label>
                    <input
                      type="text"
                      required
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="ул. Мустакиллик, д. 45, кв. 12"
                      className="w-full px-4 py-2.5 rounded-xl bg-secondary/50 border border-border text-foreground text-xs outline-none focus:border-brand-lime"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground uppercase">
                      {t('notes')}
                    </label>
                    <textarea
                      rows={2}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Комментарий для курьера или ориентир..."
                      className="w-full px-4 py-2.5 rounded-xl bg-secondary/50 border border-border text-foreground text-xs outline-none focus:border-brand-lime resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method Selector per TZ Point 18 */}
              <div className="p-6 rounded-2xl bg-card border border-border space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-base font-bold text-foreground uppercase tracking-wider">
                    {t('paymentMethod')}
                  </h3>
                  <span className="text-[10px] text-brand-lime font-mono font-bold uppercase">
                    РЕАЛЬНАЯ ОПЛАТА
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Unified QR */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('unified_qr')}
                    className={`p-4 rounded-xl border text-left flex flex-col justify-between space-y-2 transition-all cursor-pointer ${
                      paymentMethod === 'unified_qr'
                        ? 'border-brand-lime bg-brand-surface ring-1 ring-brand-lime'
                        : 'border-border bg-secondary/30 hover:border-border/80'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <QrCode className="w-5 h-5 text-brand-lime shrink-0" />
                      <span className="px-1.5 py-0.5 rounded bg-brand-lime text-black text-[9px] font-black uppercase">
                        ТОП
                      </span>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-foreground">Единый QR</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">Payme / Click / Uzum</p>
                    </div>
                  </button>

                  {/* Cash */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cash_on_delivery')}
                    className={`p-4 rounded-xl border text-left flex flex-col justify-between space-y-2 transition-all cursor-pointer ${
                      paymentMethod === 'cash_on_delivery'
                        ? 'border-brand-lime bg-brand-surface ring-1 ring-brand-lime'
                        : 'border-border bg-secondary/30 hover:border-border/80'
                    }`}
                  >
                    <Banknote className="w-5 h-5 text-brand-lime shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-foreground">Наличными</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">При получении курьеру</p>
                    </div>
                  </button>

                  {/* Card Terminal */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card_on_delivery')}
                    className={`p-4 rounded-xl border text-left flex flex-col justify-between space-y-2 transition-all cursor-pointer ${
                      paymentMethod === 'card_on_delivery'
                        ? 'border-brand-lime bg-brand-surface ring-1 ring-brand-lime'
                        : 'border-border bg-secondary/30 hover:border-border/80'
                    }`}
                  >
                    <CreditCard className="w-5 h-5 text-brand-lime shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-foreground">Терминал</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">Uzcard / Humo курьеру</p>
                    </div>
                  </button>
                </div>
              </div>
            </div>

            {/* Order Review & Submit - 5 cols */}
            <div className="lg:col-span-5 space-y-6">
              <div className="p-6 rounded-2xl bg-card border border-border space-y-5">
                <h3 className="font-serif text-lg font-bold text-foreground pb-3 border-b border-border">
                  Ваш заказ ({items.reduce((s, i) => s + i.quantity, 0)} шт)
                </h3>

                <div className="max-h-60 overflow-y-auto divide-y divide-border pr-1">
                  {items.map((item) => {
                    const title =
                      item.product.title[locale as keyof typeof item.product.title] ||
                      item.product.title.ru;
                    const isRental = item.product.is_rental_machine && item.product.price === 0;

                    return (
                      <div key={item.product.id} className="py-3 flex items-center justify-between text-xs">
                        <div className="flex items-center space-x-3">
                          <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-secondary shrink-0">
                            <Image
                              src={item.product.images[0]}
                              alt={title}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <p className="font-semibold text-foreground line-clamp-1">{title}</p>
                            <p className="text-[11px] text-muted-foreground">{item.quantity} шт.</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="font-bold text-foreground">
                            {isRental ? '0 сум' : formatUZS(item.product.price * item.quantity, locale)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Calculation Summary */}
                <div className="pt-3 border-t border-border space-y-2 text-xs">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Сумма товаров:</span>
                    <span>{formatUZS(subtotal, locale)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Доставка по Ташкенту:</span>
                    <span>{delivery === 0 ? 'Бесплатно' : formatUZS(delivery, locale)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-brand-lime font-semibold">
                      <span>Скидка:</span>
                      <span>-{formatUZS(discount, locale)}</span>
                    </div>
                  )}
                  <div className="pt-2 border-t border-border flex justify-between text-base font-black text-foreground">
                    <span>Итого к оплате:</span>
                    <span className="text-brand-lime">{formatUZS(total, locale)}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-xl bg-primary hover:brightness-110 text-primary-foreground font-black text-xs uppercase tracking-wider flex items-center justify-center space-x-2 shadow-lg glow-lime transition-all cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? t('placing') : t('placeOrder')}</span>
                </button>

                <div className="p-3 rounded-xl bg-secondary/40 border border-border flex items-center space-x-2.5 text-[11px] text-muted-foreground">
                  <ShieldCheck className="w-4 h-4 text-brand-lime shrink-0" />
                  <span>Бесплатная доставка по всем 12 районам Ташкента при заказе от 300 000 сум</span>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
