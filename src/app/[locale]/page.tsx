import React from 'react';
import { HeroSection } from '@/components/home/HeroSection';
import { ValueProps } from '@/components/home/ValueProps';
import { FeaturedProducts } from '@/components/home/FeaturedProducts';
import { CupCalculator } from '@/components/home/CupCalculator';
import { HowItWorks } from '@/components/home/HowItWorks';
import { CategoryGrid } from '@/components/home/CategoryGrid';
import { ExperienceBanner } from '@/components/home/ExperienceBanner';

export default function HomePage() {
  return (
    <div className="w-full min-h-screen bg-background">
      <HeroSection />
      <ValueProps />
      <FeaturedProducts />
      <CupCalculator />
      <HowItWorks />
      <CategoryGrid />
      <ExperienceBanner />
    </div>
  );
}
