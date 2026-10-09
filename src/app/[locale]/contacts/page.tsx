'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { MapPin, Phone, Clock, Send, MessageCircle, Mail, CheckCircle2, Instagram, Navigation } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function ContactsPage() {
  const t = useTranslations('footer');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('+998 ');
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSuccess(true);
    confetti({
      particleCount: 50,
      spread: 60,
    });
  };

  return (
    <div className="w-full min-h-screen bg-background py-12 lg:py-20 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="max-w-2xl space-y-2">
          <span className="text-[10px] font-mono tracking-[0.25em] uppercase text-brand-lime font-bold">
            СВЯЗЬ С НАМИ
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-foreground">
            Контакты и офис в Ташкенте
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground font-light">
            Официальный представитель и сервисный центр капсульных кофемашин TeaCoff в Ташкенте.
          </p>
        </div>

        {/* 4 Quick Action Buttons per TZ Point 25 */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <a
            href="tel:+998959028833"
            className="p-4 rounded-2xl bg-card border border-border hover:border-brand-lime hover:bg-secondary/50 transition-all flex flex-col items-center justify-center text-center space-y-2 group shadow-sm"
          >
            <div className="p-3 rounded-xl bg-brand-lime/10 text-brand-lime group-hover:bg-brand-lime group-hover:text-black transition-colors">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-foreground">Позвонить</p>
              <p className="text-[11px] text-muted-foreground">+998 95 902 88 33</p>
            </div>
          </a>

          <a
            href="https://t.me/TeaCoff_lux"
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 rounded-2xl bg-card border border-border hover:border-brand-lime hover:bg-secondary/50 transition-all flex flex-col items-center justify-center text-center space-y-2 group shadow-sm"
          >
            <div className="p-3 rounded-xl bg-sky-500/10 text-sky-500 group-hover:bg-sky-500 group-hover:text-white transition-colors">
              <Send className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-foreground">Telegram</p>
              <p className="text-[11px] text-muted-foreground">@TeaCoff_lux</p>
            </div>
          </a>

          <a
            href="https://instagram.com/teacoff.lux"
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 rounded-2xl bg-card border border-border hover:border-brand-lime hover:bg-secondary/50 transition-all flex flex-col items-center justify-center text-center space-y-2 group shadow-sm"
          >
            <div className="p-3 rounded-xl bg-pink-500/10 text-pink-500 group-hover:bg-pink-500 group-hover:text-white transition-colors">
              <Instagram className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-foreground">Instagram</p>
              <p className="text-[11px] text-muted-foreground">@teacoff.lux</p>
            </div>
          </a>

          <a
            href="mailto:teacoff2025@gmail.com"
            className="p-4 rounded-2xl bg-card border border-border hover:border-brand-lime hover:bg-secondary/50 transition-all flex flex-col items-center justify-center text-center space-y-2 group shadow-sm"
          >
            <div className="p-3 rounded-xl bg-amber-500/10 text-amber-500 group-hover:bg-amber-500 group-hover:text-white transition-colors">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-foreground">Email</p>
              <p className="text-[11px] text-muted-foreground">teacoff2025@gmail.com</p>
            </div>
          </a>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Contact Details - 5 cols */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 rounded-2xl bg-card border border-border space-y-6 shadow-sm">
              <div className="flex items-start space-x-4">
                <div className="p-3 rounded-xl bg-secondary text-brand-lime shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">
                    Адрес и локация
                  </h4>
                  <p className="text-sm text-foreground font-semibold mt-1">
                    г. Ташкент, Мирзо-Улугбекский район
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Доставка кофемашин и капсул по всему Ташкенту — бесплатно при аренде.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="p-3 rounded-xl bg-secondary text-brand-lime shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">
                    Время работы
                  </h4>
                  <p className="text-sm font-semibold text-foreground mt-1">10:00 – 19:00</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Ежедневно, без выходных</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="p-3 rounded-xl bg-secondary text-brand-lime shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">
                    Горячая линия
                  </h4>
                  <a
                    href="tel:+998959028833"
                    className="text-sm font-bold text-brand-lime hover:underline mt-1 block"
                  >
                    +998 95 902 88 33
                  </a>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="p-3 rounded-xl bg-secondary text-brand-lime shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">
                    Электронная почта
                  </h4>
                  <a
                    href="mailto:teacoff2025@gmail.com"
                    className="text-sm font-semibold text-foreground hover:text-brand-lime mt-1 block"
                  >
                    teacoff2025@gmail.com
                  </a>
                </div>
              </div>
            </div>

            {/* Embedded Interactive Map Card */}
            <div className="p-6 rounded-2xl bg-card border border-border space-y-3 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-xs font-bold text-foreground uppercase">
                  <Navigation className="w-4 h-4 text-brand-lime" />
                  <span>Карта Ташкента</span>
                </div>
                <span className="text-[10px] text-muted-foreground">Мирзо-Улугбекский р-н</span>
              </div>
              <div className="w-full h-48 rounded-xl overflow-hidden border border-border relative">
                <iframe
                  title="Tashkent Mirzo-Ulugbek location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d47936.75730311222!2d69.29051515!3d41.3323067!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38aef4e1387d7b3b%3A0x6b44a305f63d0c9f!2z0JzQuNGA0LfQvi3Qo9C70YPQs9Cx0LXQutGB0LrQuNC5INGA0LDQudC-0L0sINCi0LDRiNC60LXQvdGCLCDQo9C30LHQtdC60LjRgdGC0LDQvQ!5e0!3m2!1sru!2s!4v1710000000000!5m2!1sru!2s"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="filter contrast-95"
                />
              </div>
            </div>
          </div>

          {/* Interactive Form - 7 cols */}
          <div className="lg:col-span-7">
            <div className="p-6 sm:p-8 rounded-2xl bg-card border border-border space-y-6 shadow-sm">
              <h3 className="font-serif text-xl font-bold text-foreground">
                Напишите нам сообщение
              </h3>

              {isSuccess ? (
                <div className="text-center py-10 space-y-3">
                  <CheckCircle2 className="w-12 h-12 text-brand-lime mx-auto" />
                  <h4 className="font-bold text-lg text-foreground">Сообщение отправлено!</h4>
                  <p className="text-xs text-muted-foreground">
                    Менеджер TeaCoff ответит вам в течение 15 минут.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-foreground uppercase">
                        Ваше имя *
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
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-foreground uppercase">
                        Телефон *
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
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-foreground uppercase">
                      Ваш вопрос или сообщение
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Интересует аренда кофемашины для офиса, дегустация капсул или сервисный вопрос..."
                      className="w-full px-4 py-2.5 rounded-xl bg-secondary/50 border border-border text-foreground text-xs outline-none focus:border-brand-lime resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full sm:w-auto px-8 py-3 rounded-xl bg-primary hover:brightness-110 text-primary-foreground font-extrabold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 shadow-lg glow-lime transition-all cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>Отправить сообщение</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
