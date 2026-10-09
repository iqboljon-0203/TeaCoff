import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        card: {
          DEFAULT: 'var(--card)',
          foreground: 'var(--card-foreground)',
        },
        popover: {
          DEFAULT: 'var(--popover)',
          foreground: 'var(--popover-foreground)',
        },
        primary: {
          DEFAULT: 'var(--primary)',
          foreground: 'var(--primary-foreground)',
        },
        secondary: {
          DEFAULT: 'var(--secondary)',
          foreground: 'var(--secondary-foreground)',
        },
        muted: {
          DEFAULT: 'var(--muted)',
          foreground: 'var(--muted-foreground)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          foreground: 'var(--accent-foreground)',
        },
        destructive: {
          DEFAULT: 'var(--destructive)',
          foreground: 'var(--destructive-foreground)',
        },
        border: 'var(--border)',
        input: 'var(--input)',
        ring: 'var(--ring)',
        // Exact TeaCoff Design Guide Tokens from uploaded style guide
        brand: {
          primary: '#D2FF32',
          lime: '#D2FF32',
          'lime-hover': '#C0EB00',
          secondary: '#A8A29E',
          tertiary: '#E07A2A',
          neutral: '#0D0A08',
          dark: '#0D0A08',
          surface: '#141210',
          card: '#181513',
          border: 'rgba(255, 255, 255, 0.08)',
          gold: '#E07A2A',
          crema: '#E6C280',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      fontFamily: {
        headline: ['var(--font-headline)', 'Space Grotesk', 'sans-serif'],
        body: ['var(--font-body)', 'Manrope', 'sans-serif'],
        serif: ['var(--font-serif)', 'Playfair Display', 'Georgia', 'serif'],
        sans: ['var(--font-body)', 'Manrope', 'sans-serif'],
      },
      boxShadow: {
        'glow-lime': '0 0 35px -5px rgba(210, 255, 50, 0.4)',
        'glow-tertiary': '0 0 35px -5px rgba(224, 122, 42, 0.3)',
      },
    },
  },
  plugins: [],
};

export default config;
