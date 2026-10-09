import type { Metadata } from 'next';
import { Space_Grotesk, Manrope, Cormorant_Garamond } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { TopAnnouncement } from '@/components/layout/TopAnnouncement';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CartDrawer } from '@/components/layout/CartDrawer';
import '@/app/globals.css';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-headline',
  display: 'swap',
});

const manrope = Manrope({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-body',
  display: 'swap',
});

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-serif',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'TeaCoff — Аренда капсульных кофемашин за 0 сум в Ташкенте | teacoff.uz',
  description:
    'Премиальные капсульные кофемашины Dolce Gusto и Nespresso во временное пользование бесплатно при покупке от 4 коробок итальянского кофе в месяц. Доставка по Ташкенту.',
  keywords: [
    'аренда кофемашин ташкент',
    'кофемашина 0 сум',
    'Dolce Gusto Ташкент',
    'Nespresso Ташкент',
    'капсулы Carraro',
    'кофе в офис Ташкент',
  ],
  authors: [{ name: 'TeaCoff Uzbekistan' }],
  icons: {
    icon: '/favicon.ico',
  },
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className={`dark ${spaceGrotesk.variable} ${manrope.variable} ${cormorant.variable}`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var stored = localStorage.getItem('teacoff-theme-storage');
                if (stored) {
                  var parsed = JSON.parse(stored);
                  if (parsed && parsed.state && parsed.state.theme === 'light') {
                    document.documentElement.classList.remove('dark');
                    document.documentElement.classList.add('light');
                  }
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-background text-foreground antialiased selection:bg-brand-lime selection:text-black font-body">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <TopAnnouncement />
          <Header />
          <main className="flex-1 w-full">{children}</main>
          <Footer />
          <CartDrawer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
