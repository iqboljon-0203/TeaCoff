'use client';

import React from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Award, ShieldCheck, Heart, Coffee, CheckCircle2, FileCheck, Sparkles, Wrench, PackageCheck } from 'lucide-react';
import { Link } from '@/i18n/routing';

export default function AboutPage() {
  const t = useTranslations('nav');

  const directions = [
    {
      title: 'Аренда кофемашин',
      desc: 'Премиальное капсульное оборудование во временное пользование при заказе капсул от 4 коробок.',
    },
    {
      title: 'Капсульный кофе',
      desc: 'Оригинальные капсулы Carraro 1927 и Dolce Gusto прямого импорта из Италии.',
    },
    {
      title: 'Зерновой кофе',
      desc: 'Свежеобжаренные итальянские смеси Lavazza и Carraro для эспрессо и капучино.',
    },
    {
      title: 'Итальянский чай',
      desc: 'Коллекция натуральных листовых и капсульных чаев без кофеина и с бергамотом.',
    },
    {
      title: 'Сервисный центр',
      desc: 'Диагностика, ремонт и профилактика кофемашин в Ташкенте с гарантией.',
    },
  ];

  return (
    <div className="w-full min-h-screen bg-background py-12 lg:py-20 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Hero Section */}
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-surface border border-brand-lime/30 text-brand-lime text-xs font-mono font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>РАБОТАЕМ С 2025 ГОДА • ТАШКЕНТ</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-foreground leading-tight">
            О компании TeaCoff
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground font-light leading-relaxed">
            TeaCoff — компания, работающая с 2025 года в Ташкенте. Мы специализируемся на аренде капсульных кофемашин, продаже кофемашин, зернового и капсульного кофе, отборного итальянского чая и профессиональном техническом обслуживании оборудования.
          </p>
        </div>

        {/* Feature Split Image */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-secondary border border-border shadow-lg">
            <Image
              src="/images/hero-barista.jpg"
              alt="TeaCoff showroom in Tashkent"
              fill
              className="object-cover filter brightness-95"
            />
          </div>

          <div className="space-y-6">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground">
              Прямое партнерство и сертификаты качества
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed font-light">
              Компания TeaCoff напрямую сотрудничает с официальными поставщиками и дилерами оборудования Dolce Gusto, Krups, De&apos;Longhi и Nespresso, а также итальянскими обжарщиками Carraro 1927 и Lavazza. Вся продукция сертифицирована и имеет официальные паспорта качества.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
              <div className="p-3.5 rounded-xl bg-secondary/50 border border-border flex items-start space-x-2.5">
                <FileCheck className="w-4 h-4 text-brand-lime shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-foreground">Сертификаты</p>
                  <p className="text-[11px] text-muted-foreground">На 100% реализуемой продукции</p>
                </div>
              </div>
              <div className="p-3.5 rounded-xl bg-secondary/50 border border-border flex items-start space-x-2.5">
                <ShieldCheck className="w-4 h-4 text-brand-lime shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-foreground">Гарантия</p>
                  <p className="text-[11px] text-muted-foreground">Официальная гарантия и сервис</p>
                </div>
              </div>
              <div className="p-3.5 rounded-xl bg-secondary/50 border border-border flex items-start space-x-2.5">
                <Wrench className="w-4 h-4 text-brand-lime shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-foreground">Свой сервис</p>
                  <p className="text-[11px] text-muted-foreground">Мастерская в Мирзо-Улугбекском р-не</p>
                </div>
              </div>
              <div className="p-3.5 rounded-xl bg-secondary/50 border border-border flex items-start space-x-2.5">
                <PackageCheck className="w-4 h-4 text-brand-lime shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-foreground">Оригинал</p>
                  <p className="text-[11px] text-muted-foreground">Только оригинальная продукция</p>
                </div>
              </div>
            </div>
            <div className="pt-2">
              <Link
                href="/arenda"
                className="inline-flex px-8 py-3.5 rounded-xl bg-primary text-primary-foreground font-black text-xs uppercase tracking-wider hover:brightness-110 shadow-lg glow-lime transition-all"
              >
                Арендовать кофемашину
              </Link>
            </div>
          </div>
        </div>

        {/* 5 Business Directions Grid */}
        <div className="p-8 rounded-2xl bg-card border border-border space-y-6">
          <h3 className="font-serif text-2xl font-bold text-foreground">
            Ключевые направления деятельности TeaCoff
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {directions.map((dir, idx) => (
              <div key={idx} className="p-5 rounded-xl bg-secondary/40 border border-border space-y-2">
                <div className="flex items-center space-x-2 text-brand-lime font-mono text-xs font-bold uppercase">
                  <span>0{idx + 1}</span>
                  <span>•</span>
                  <span>{dir.title}</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {dir.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
