'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useLocale } from 'next-intl';
import {
  Coffee,
  ShoppingBag,
  Sparkles,
  CheckCircle2,
  Plus,
  Minus,
  Check,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Truck,
  RotateCcw,
} from 'lucide-react';
import { Product, OrderItem, Contract } from '@/types/database';
import { getProducts, getAllContracts } from '@/lib/supabase';
import { formatUZS } from '@/lib/utils';
import confetti from 'canvas-confetti';

declare global {
  interface Window {
    Telegram?: {
      WebApp?: {
        ready: () => void;
        expand: () => void;
        close: () => void;
        initDataUnsafe?: {
          user?: {
            id: number;
            first_name: string;
            last_name?: string;
            username?: string;
          };
        };
        HapticFeedback?: {
          impactOccurred: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => void;
          notificationOccurred: (type: 'error' | 'success' | 'warning') => void;
        };
      };
    };
  }
}

export default function TelegramMiniAppPage() {
  const locale = useLocale() as 'ru' | 'uz' | 'en';
  const isRu = locale === 'ru';

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<{ [productId: string]: number }>({});
  const [filter, setFilter] = useState<'all' | 'intense' | 'arabica'>('all');
  const [tgUser, setTgUser] = useState<{ id?: number; name?: string }>({});
  const [contract, setContract] = useState<Contract | null>(null);

  // Checkout modal
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [createdOrderNumber, setCreatedOrderNumber] = useState<number | null>(null);

  // Initialize Telegram WebApp
  useEffect(() => {
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.ready();
      tg.expand();

      const user = tg.initDataUnsafe?.user;
      if (user) {
        setTgUser({ id: user.id, name: user.first_name });
        setCustomerName(user.first_name + (user.last_name ? ' ' + user.last_name : ''));
      }
    }
  }, []);

  // Fetch live products & contract matching
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [allProds, allContracts] = await Promise.all([
          getProducts(),
          getAllContracts(),
        ]);

        // Filter capsule products or coffee for the machine
        const capsules = allProds.filter(
          (p) => p.category_slug === 'kapsuly' || p.category_slug === 'kofe-v-zernax' || !p.is_rental_machine
        );
        setProducts(capsules);

        // Pre-fill contract if matching Telegram ID exists
        if (tgUser.id) {
          const match = allContracts.find((c) => c.telegram_chat_id === tgUser.id);
          if (match) {
            setContract(match);
            setCustomerName(match.customer_name);
            setCustomerPhone(match.customer_phone);
          }
        }
      } catch (err) {
        console.error('Failed to load TMA products:', err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [tgUser.id]);

  // Haptic feedback helper
  const triggerHaptic = (style: 'light' | 'medium' | 'heavy' = 'light') => {
    if (typeof window !== 'undefined' && window.Telegram?.WebApp?.HapticFeedback) {
      window.Telegram.WebApp.HapticFeedback.impactOccurred(style);
    }
  };

  // Quantity updates
  const updateQuantity = (productId: string, delta: number) => {
    triggerHaptic('medium');
    setCart((prev) => {
      const current = prev[productId] || 0;
      const next = Math.max(0, current + delta);
      if (next === 0) {
        const copy = { ...prev };
        delete copy[productId];
        return copy;
      }
      return { ...prev, [productId]: next };
    });
  };

  // Calculations
  const totalBoxes = Object.values(cart).reduce((sum, count) => sum + count, 0);
  const minRequiredBoxes = contract?.min_capsule_boxes || 4;
  const isQuotaMet = totalBoxes >= minRequiredBoxes;

  const totalAmount = Object.entries(cart).reduce((sum, [pId, qty]) => {
    const prod = products.find((p) => p.id === pId);
    return sum + (prod ? prod.price * qty : 0);
  }, 0);

  // Filter products
  const filteredProducts = products.filter((p) => {
    if (filter === 'intense') {
      const note = p.taste_notes?.ru || '';
      return note.toLowerCase().includes('шоколад') || (p.specs?.intensity && parseInt(p.specs.intensity) >= 8);
    }
    if (filter === 'arabica') {
      const title = p.title?.ru || '';
      return title.toLowerCase().includes('arabica') || title.toLowerCase().includes('арабика');
    }
    return true;
  });

  // Handle Checkout submission
  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isQuotaMet) return;

    setIsSubmitting(true);
    triggerHaptic('heavy');

    const orderItems: OrderItem[] = Object.entries(cart).map(([pId, qty]) => {
      const prod = products.find((p) => p.id === pId)!;
      return {
        product_id: prod.id,
        slug: prod.slug,
        title: prod.title[locale] || prod.title.ru,
        price: prod.price,
        quantity: qty,
        image: prod.images[0] || '',
      };
    });

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_name: customerName || 'Клиент Telegram',
          customer_phone: customerPhone || '+998 90 000 00 00',
          district: 'Ташкент',
          delivery_address: deliveryAddress || 'Уточняется менеджером',
          items: orderItems,
          total_amount: totalAmount,
          delivery_fee: 0,
          payment_method: 'cash_on_delivery',
          contract_id: contract?.id,
          telegram_chat_id: tgUser.id,
          notes: `Заказ из Telegram Mini App (TMA). Договор: ${contract?.contract_number || 'н/д'}`,
        }),
      });

      const data = await res.json();
      if (data.success && data.order) {
        setCreatedOrderNumber(data.order.order_number);
        setIsSuccess(true);
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });

        if (window.Telegram?.WebApp?.HapticFeedback) {
          window.Telegram.WebApp.HapticFeedback.notificationOccurred('success');
        }
      }
    } catch (err) {
      console.error('Order submission failed:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#0d0f11] text-white flex flex-col font-sans pb-32">
      {/* 1. App Header */}
      <header className="sticky top-0 z-30 bg-[#16191d]/90 backdrop-blur-md border-b border-white/5 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="relative w-9 h-9 rounded-xl overflow-hidden shadow-sm flex-shrink-0 border border-white/10 bg-brand-lime">
            <Image
              src="/images/teacoff-logo.png"
              alt="TeaCoff"
              fill
              sizes="36px"
              className="object-cover"
              priority
            />
          </div>
          <div>
            <h1 className="font-bold text-sm tracking-tight text-white flex items-center space-x-1.5">
              <span>TeaCoff Kapsulalar</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-brand-lime/15 text-brand-lime font-mono font-bold">
                0 SO'M IJARA
              </span>
            </h1>
            <p className="text-[11px] text-gray-400">
              {contract
                ? `Shartnoma №${contract.contract_number} • ${contract.machine_model}`
                : isRu
                ? 'Официальный заказ капсул'
                : 'Rasmiy kapsulalar buyurtmasi'}
            </p>
          </div>
        </div>

        {/* User Info Badge */}
        {tgUser.name && (
          <span className="text-[11px] px-2.5 py-1 rounded-full bg-white/5 text-gray-300 font-medium">
            👋 {tgUser.name}
          </span>
        )}
      </header>

      {/* 2. Top Banner / Quota Progress Indicator */}
      <div className="p-4">
        <div className="p-4 rounded-2xl bg-gradient-to-r from-[#1c2128] to-[#161a20] border border-white/5 space-y-2.5 shadow-lg">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-gray-300 flex items-center space-x-1.5">
              <ShieldCheck className="w-4 h-4 text-brand-lime" />
              <span>{isRu ? 'Минимальный объем заказа:' : 'Minimal oylik buyurtma:'}</span>
            </span>
            <span className="font-bold font-mono text-sm text-brand-lime">
              {totalBoxes} / {minRequiredBoxes} {isRu ? 'коробок' : 'quti'}
            </span>
          </div>

          {/* Progress bar */}
          <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden relative">
            <div
              className={`h-full transition-all duration-300 rounded-full ${
                isQuotaMet ? 'bg-brand-lime glow-lime' : 'bg-amber-400'
              }`}
              style={{ width: `${Math.min(100, (totalBoxes / minRequiredBoxes) * 100)}%` }}
            />
          </div>

          <p className="text-[11px] text-gray-400">
            {isQuotaMet
              ? isRu
                ? '✅ Условие бесплатной аренды выполнено! Можно оформлять заказ.'
                : '✅ Bepul ijara sharti bajarildi! Buyurtma berishingiz mumkin.'
              : isRu
              ? `💡 Добавьте еще ${minRequiredBoxes - totalBoxes} кор. для сохранения аренды за 0 сум.`
              : `💡 Bepul 0 so'm ijara saqlanishi uchun yana ${minRequiredBoxes - totalBoxes} quti qo'shing.`}
          </p>
        </div>
      </div>

      {/* 3. Filter Chips */}
      <div className="px-4 flex space-x-2 overflow-x-auto pb-1 text-xs">
        <button
          onClick={() => {
            triggerHaptic('light');
            setFilter('all');
          }}
          className={`px-3 py-1.5 rounded-xl font-medium transition-colors shrink-0 ${
            filter === 'all'
              ? 'bg-brand-lime text-black font-bold shadow'
              : 'bg-[#1a1f26] text-gray-300 hover:bg-[#252b35]'
          }`}
        >
          {isRu ? '☕ Все капсулы' : '☕ Barcha kapsulalar'}
        </button>
        <button
          onClick={() => {
            triggerHaptic('light');
            setFilter('intense');
          }}
          className={`px-3 py-1.5 rounded-xl font-medium transition-colors shrink-0 ${
            filter === 'intense'
              ? 'bg-brand-lime text-black font-bold shadow'
              : 'bg-[#1a1f26] text-gray-300 hover:bg-[#252b35]'
          }`}
        >
          {isRu ? '🔥 Крепкие (Crema)' : '🔥 To\'yingan (Crema)'}
        </button>
        <button
          onClick={() => {
            triggerHaptic('light');
            setFilter('arabica');
          }}
          className={`px-3 py-1.5 rounded-xl font-medium transition-colors shrink-0 ${
            filter === 'arabica'
              ? 'bg-brand-lime text-black font-bold shadow'
              : 'bg-[#1a1f26] text-gray-300 hover:bg-[#252b35]'
          }`}
        >
          {isRu ? '🌿 100% Арабика' : '🌿 100% Arabika'}
        </button>
      </div>

      {/* 4. Products Grid */}
      <main className="p-4 space-y-3 flex-1">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-3 text-gray-400">
            <div className="w-8 h-8 border-2 border-brand-lime border-t-transparent rounded-full animate-spin" />
            <span className="text-xs">{isRu ? 'Загрузка капсул...' : 'Kapsulalar yuklanmoqda...'}</span>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-12 text-gray-400 text-xs">
            {isRu ? 'Капсулы не найдены' : 'Kapsulalar topilmadi'}
          </div>
        ) : (
          filteredProducts.map((prod) => {
            const count = cart[prod.id] || 0;
            return (
              <div
                key={prod.id}
                className="p-3.5 rounded-2xl bg-[#161a20] border border-white/5 flex items-center justify-between gap-3 shadow-sm hover:border-brand-lime/30 transition-all"
              >
                {/* Product Image */}
                <div className="w-20 h-20 rounded-xl bg-black/40 relative overflow-hidden shrink-0 border border-white/5">
                  <Image
                    src={prod.images[0] || 'https://images.unsplash.com/photo-1559496417-e7f25cb247f3?q=80&w=900'}
                    alt={prod.title[locale] || prod.title.ru}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                  {prod.badge && (
                    <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded text-[8px] font-extrabold bg-brand-lime text-black uppercase">
                      {prod.badge[locale] || prod.badge.ru}
                    </span>
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0 space-y-1">
                  <h3 className="font-bold text-xs text-white leading-snug line-clamp-2">
                    {prod.title[locale] || prod.title.ru}
                  </h3>
                  <p className="text-[10px] text-gray-400 line-clamp-1">
                    {prod.taste_notes?.[locale] || prod.taste_notes?.ru || 'Итальянский бленд'}
                  </p>
                  <div className="flex items-center space-x-2 pt-0.5">
                    <span className="font-bold text-sm text-brand-lime font-mono">
                      {formatUZS(prod.price)}
                    </span>
                    <span className="text-[10px] text-gray-500">
                      /{prod.weight_volume || '16 шт'}
                    </span>
                  </div>
                </div>

                {/* Stepper Buttons */}
                <div className="shrink-0 flex items-center space-x-2 bg-[#0e1115] p-1 rounded-xl border border-white/5">
                  {count > 0 && (
                    <>
                      <button
                        onClick={() => updateQuantity(prod.id, -1)}
                        className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 text-white flex items-center justify-center transition-colors active:scale-95"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="font-bold text-xs w-4 text-center text-brand-lime font-mono">
                        {count}
                      </span>
                    </>
                  )}
                  <button
                    onClick={() => updateQuantity(prod.id, 1)}
                    className="w-7 h-7 rounded-lg bg-brand-lime hover:brightness-110 text-black flex items-center justify-center transition-transform active:scale-95 font-bold shadow"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </main>

      {/* 5. Floating Bottom Bar */}
      {totalBoxes > 0 && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-[#121519]/95 backdrop-blur-lg border-t border-white/10 z-40 space-y-2 max-w-md mx-auto">
          <div className="flex items-center justify-between text-xs px-1">
            <span className="text-gray-400">
              {isRu ? 'Всего к оплате:' : 'Jami to\'lov:'}
            </span>
            <span className="font-bold text-base text-brand-lime font-mono">
              {formatUZS(totalAmount)}
            </span>
          </div>

          <button
            onClick={() => {
              if (isQuotaMet) {
                triggerHaptic('heavy');
                setIsCheckoutOpen(true);
              } else {
                triggerHaptic('light');
              }
            }}
            disabled={!isQuotaMet}
            className={`w-full py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-lg ${
              isQuotaMet
                ? 'bg-brand-lime text-black glow-lime hover:brightness-110 active:scale-[0.98]'
                : 'bg-white/10 text-gray-400 cursor-not-allowed opacity-80'
            }`}
          >
            <span>
              {isQuotaMet
                ? isRu
                  ? `🚀 Оформить заказ (${totalBoxes} кор.)`
                  : `🚀 Buyurtma berish (${totalBoxes} quti)`
                : isRu
                ? `Добавьте еще ${minRequiredBoxes - totalBoxes} кор.`
                : `Yana ${minRequiredBoxes - totalBoxes} quti qo'shing`}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 6. Checkout Drawer Modal */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in">
          <div className="w-full max-w-md bg-[#161a20] rounded-t-3xl sm:rounded-2xl border border-white/10 p-6 space-y-5 animate-in slide-in-from-bottom">
            {isSuccess ? (
              <div className="text-center py-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-brand-lime/20 text-brand-lime flex items-center justify-center mx-auto">
                  <Check className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold text-lg text-white">
                    {isRu ? `Заказ #${createdOrderNumber} принят!` : `Buyurtma #${createdOrderNumber} qabul qilindi!`}
                  </h3>
                  <p className="text-xs text-gray-400 max-w-xs mx-auto">
                    {isRu
                      ? 'Мы передали заказ на сборку. Вы получите уведомление в Telegram, когда курьер выедет!'
                      : 'Buyurtma yig\'ishga berildi. Kuryer yo\'lga chiqqanida botga xabar keladi!'}
                  </p>
                </div>

                <button
                  onClick={() => {
                    if (window.Telegram?.WebApp) {
                      window.Telegram.WebApp.close();
                    } else {
                      setIsCheckoutOpen(false);
                      setIsSuccess(false);
                      setCart({});
                    }
                  }}
                  className="w-full py-3.5 rounded-xl bg-brand-lime text-black font-bold text-xs uppercase tracking-wider"
                >
                  {isRu ? 'Вернуться в чат' : 'Telegram chatga qaytish'}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmitOrder} className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-white/5">
                  <h3 className="font-bold text-sm text-white">
                    {isRu ? 'Подтверждение заказа' : 'Buyurtmani tasdiqlash'}
                  </h3>
                  <button
                    type="button"
                    onClick={() => setIsCheckoutOpen(false)}
                    className="text-gray-400 hover:text-white text-xs font-bold"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="text-[11px] font-semibold text-gray-300 block mb-1">
                      {isRu ? 'Имя клиента' : 'Mijoz ismi'}
                    </label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Азиз Каримов"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#0e1115] border border-white/10 text-white outline-none focus:border-brand-lime"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-gray-300 block mb-1">
                      {isRu ? 'Телефон для связи' : 'Telefon raqam'}
                    </label>
                    <input
                      type="tel"
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="+998 90 123 45 67"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#0e1115] border border-white/10 text-white outline-none focus:border-brand-lime"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-gray-300 block mb-1">
                      {isRu ? 'Адрес доставки в Ташкенте' : 'Toshkentdagi yetkazib berish manzili'}
                    </label>
                    <input
                      type="text"
                      required
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      placeholder="Юнусабад, ул. Амира Темура, 108"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#0e1115] border border-white/10 text-white outline-none focus:border-brand-lime"
                    />
                  </div>
                </div>

                {/* Summary mini card */}
                <div className="p-3 rounded-xl bg-[#0e1115] border border-white/5 space-y-1 text-xs">
                  <div className="flex justify-between text-gray-400">
                    <span>{isRu ? 'Количество капсул:' : 'Kapsulalar:'}</span>
                    <span className="font-bold text-white">{totalBoxes} {isRu ? 'коробок' : 'quti'}</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>{isRu ? 'Доставка по Ташкенту:' : 'Yetkazib berish:'}</span>
                    <span className="text-brand-lime font-bold">{isRu ? 'Бесплатно' : 'Bepul'}</span>
                  </div>
                  <div className="flex justify-between text-white font-bold pt-1 border-t border-white/5">
                    <span>{isRu ? 'Итого:' : 'Jami:'}</span>
                    <span className="text-brand-lime font-mono">{formatUZS(totalAmount)}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-xl bg-brand-lime text-black font-bold text-xs uppercase tracking-wider glow-lime hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50"
                >
                  {isSubmitting
                    ? isRu ? 'Оформление...' : 'Yuborilmoqda...'
                    : isRu ? 'Подтвердить и заказать' : 'Tasdiqlash va buyurtma berish'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
