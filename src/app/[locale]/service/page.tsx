'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Wrench, ShieldCheck, Clock, CheckCircle2, Search, Send, AlertCircle, FileText } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function ServicePage() {
  const t = useTranslations('service');

  // Ticket Form state
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('+998 ');
  const [machineModel, setMachineModel] = useState('Dolce Gusto Mini Me');
  const [problem, setProblem] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdTicketNumber, setCreatedTicketNumber] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  // Status Lookup state
  const [lookupQuery, setLookupQuery] = useState('');
  const [lookupResult, setLookupResult] = useState<{
    number: number;
    model: string;
    status: string;
    statusLabel: string;
    date: string;
  } | null>(null);
  const [lookupNotFound, setLookupNotFound] = useState(false);

  const handleSubmitTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name.trim() || phone.trim().length < 13 || !problem.trim()) {
      setErrorMsg('Пожалуйста, заполните имя, контактный телефон и опишите проблему.');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/service', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_name: name,
          customer_phone: phone,
          machine_model: machineModel,
          issue_description: problem,
        }),
      });

      if (!res.ok) throw new Error('Ошибка при отправке заявки');
      const data = await res.json();
      setCreatedTicketNumber(data.ticket.ticket_number);
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
      });
    } catch (err: any) {
      setErrorMsg(err.message || 'Ошибка отправки');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    setLookupNotFound(false);
    const q = lookupQuery.trim();

    // Check mock ticket #89 or created ticket
    if (q === '89' || q.includes('555 12 34') || (createdTicketNumber && q === String(createdTicketNumber))) {
      setLookupResult({
        number: q === '89' ? 89 : (createdTicketNumber || 89),
        model: q === '89' ? 'Dolce Gusto Piccolo XS' : machineModel,
        status: q === '89' ? 'diagnostic' : 'new',
        statusLabel: q === '89' ? 'На диагностике' : 'Принята в обработку',
        date: 'Сегодня',
      });
    } else {
      setLookupNotFound(true);
      setLookupResult(null);
    }
  };

  return (
    <div className="w-full min-h-screen bg-background py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-surface border border-brand-lime/30 text-brand-lime text-xs font-mono font-bold uppercase tracking-wider">
            <Wrench className="w-3.5 h-3.5" />
            <span>ОФИЦИАЛЬНЫЙ СЕРВИСНЫЙ ЦЕНТР</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-foreground">
            {t('title')}
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground font-light">
            {t('subtitle')}
          </p>
        </div>

        {/* 3 Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-card border border-border space-y-2">
            <div className="w-10 h-10 rounded-xl bg-brand-surface border border-brand-lime/30 text-brand-lime flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-base font-bold text-foreground">Бесплатно для подписчиков</h3>
            <p className="text-xs text-muted-foreground font-light leading-relaxed">
              Клиенты с активной подпиской на капсулы получают 100% бесплатный ремонт, чистку от накипи и диагностику.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-card border border-border space-y-2">
            <div className="w-10 h-10 rounded-xl bg-brand-surface border border-brand-lime/30 text-brand-lime flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-base font-bold text-foreground">Замена за 24 часа</h3>
            <p className="text-xs text-muted-foreground font-light leading-relaxed">
              Если ремонт требует времени, мы незамедлительно привозим подменную кофемашину, чтобы вы не оставались без кофе.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-card border border-border space-y-2">
            <div className="w-10 h-10 rounded-xl bg-brand-surface border border-brand-lime/30 text-brand-lime flex items-center justify-center">
              <Wrench className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-base font-bold text-foreground">Оригинальные запчасти</h3>
            <p className="text-xs text-muted-foreground font-light leading-relaxed">
              Используем только заводские комплектующие Krups и De’Longhi для насосов, термоблоков и уплотнителей.
            </p>
          </div>
        </div>

        {/* Forms Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Submit Repair Ticket - 7 cols */}
          <div className="lg:col-span-7 space-y-6">
            <h2 className="font-serif text-2xl font-bold text-foreground">
              {t('ticketFormTitle')}
            </h2>

            {createdTicketNumber ? (
              <div className="p-8 rounded-2xl bg-card border border-brand-lime/40 text-center space-y-4">
                <CheckCircle2 className="w-12 h-12 text-brand-lime mx-auto" />
                <h3 className="font-serif text-2xl font-bold text-foreground">
                  Заявка принята!
                </h3>
                <p className="font-mono text-base font-bold text-brand-lime">
                  Номер заявки: #{createdTicketNumber}
                </p>
                <p className="text-xs text-muted-foreground max-w-md mx-auto">
                  Специалист сервисной службы свяжется с вами в течение 30 минут для согласования времени приезда мастера в Ташкенте.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitTicket} className="p-6 sm:p-8 rounded-2xl bg-card border border-border space-y-4">
                {errorMsg && (
                  <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-500/40 text-xs text-red-300 flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground uppercase">
                      Ваше имя *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Жасур Рахимов"
                      className="w-full px-4 py-2.5 rounded-xl bg-secondary/50 border border-border text-foreground text-xs outline-none focus:border-brand-lime"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground uppercase">
                      Телефон (+998) *
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

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground uppercase">
                    {t('machineModel')} *
                  </label>
                  <select
                    value={machineModel}
                    onChange={(e) => setMachineModel(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-secondary/50 border border-border text-foreground text-xs outline-none focus:border-brand-lime"
                  >
                    <option value="Dolce Gusto Mini Me">Dolce Gusto Mini Me - Krups</option>
                    <option value="Dolce Gusto Genio S">Dolce Gusto Genio S</option>
                    <option value="Dolce Gusto Piccolo XS">Dolce Gusto Piccolo XS</option>
                    <option value="Dolce Gusto Genio S Plus">Dolce Gusto Genio S Plus</option>
                    <option value="Dolce Gusto Genio S Touch">Dolce Gusto Genio S Touch</option>
                    <option value="Nespresso Inissia">Nespresso Inissia</option>
                    <option value="Другая модель">Другая кофемашина</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground uppercase">
                    {t('issueDesc')} *
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={problem}
                    onChange={(e) => setProblem(e.target.value)}
                    placeholder="Например: кофемашина не качает воду, мигает желтый индикатор, протекает поддон..."
                    className="w-full px-4 py-2.5 rounded-xl bg-secondary/50 border border-border text-foreground text-xs outline-none focus:border-brand-lime resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-xl bg-primary hover:brightness-110 text-primary-foreground font-extrabold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 shadow-lg glow-lime transition-all cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? 'Отправляем заявку...' : t('submitTicket')}</span>
                </button>
              </form>
            )}
          </div>

          {/* Ticket Tracker - 5 cols */}
          <div className="lg:col-span-5 space-y-6">
            <h2 className="font-serif text-2xl font-bold text-foreground">
              {t('trackTitle')}
            </h2>

            <div className="p-6 sm:p-8 rounded-2xl bg-card border border-border space-y-5">
              <form onSubmit={handleLookup} className="space-y-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground uppercase">
                    {t('trackInput')}
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={lookupQuery}
                      onChange={(e) => setLookupQuery(e.target.value)}
                      placeholder="Например: 89"
                      className="flex-1 px-4 py-2.5 rounded-xl bg-secondary/50 border border-border text-foreground text-xs outline-none focus:border-brand-lime"
                    />
                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-xl bg-secondary hover:bg-secondary/80 text-foreground font-bold text-xs uppercase"
                    >
                      <Search className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Подсказка для тестирования: введите тестовый номер <b className="text-brand-lime">89</b>
                </p>
              </form>

              {lookupNotFound && (
                <div className="p-4 rounded-xl bg-secondary/50 text-xs text-muted-foreground text-center">
                  Заявка с таким номером не найдена. Проверьте номер или позвоните в контакт-центр.
                </div>
              )}

              {lookupResult && (
                <div className="p-5 rounded-xl bg-secondary/40 border border-border space-y-3 animate-in fade-in">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-mono text-xs text-muted-foreground">Заявка #{lookupResult.number}</span>
                      <h4 className="font-bold text-sm text-foreground">{lookupResult.model}</h4>
                    </div>
                    <span className="px-2.5 py-1 rounded bg-brand-surface border border-brand-lime/30 text-brand-lime text-[11px] font-bold">
                      {lookupResult.statusLabel}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground pt-2 border-t border-border">
                    Дата создания: {lookupResult.date}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
