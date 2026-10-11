'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { TopAnnouncement } from './TopAnnouncement';
import { Header } from './Header';
import { Footer } from './Footer';
import { CartDrawer } from './CartDrawer';

export function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isTma = pathname?.includes('/tma');

  // Telegram Mini App (TMA) mode: Clean standalone view without website header/footer
  if (isTma) {
    return <div className="min-h-screen w-full bg-background text-foreground antialiased">{children}</div>;
  }

  // Standard Website mode: Full navigation, announcements, and footer
  return (
    <>
      <TopAnnouncement />
      <Header />
      <main className="flex-1 w-full">{children}</main>
      <Footer />
      <CartDrawer />
    </>
  );
}
