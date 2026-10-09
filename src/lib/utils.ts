import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format currency amount to Uzbek Sum (UZS) standard representation
 * Example: 95000 -> "95 000 сум" or "95 000 so'm"
 */
export function formatUZS(amount: number, locale: string = 'ru'): string {
  const formatted = new Intl.NumberFormat('ru-RU', {
    maximumFractionDigits: 0,
  }).format(amount).replace(/,/g, ' ');

  if (locale === 'uz') {
    return `${formatted} so'm`;
  }
  if (locale === 'en') {
    return `${formatted} UZS`;
  }
  return `${formatted} сум`;
}

/**
 * Format phone number display
 */
export function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 12 && cleaned.startsWith('998')) {
    return `+998 (${cleaned.slice(3, 5)}) ${cleaned.slice(5, 8)}-${cleaned.slice(8, 10)}-${cleaned.slice(10, 12)}`;
  }
  return phone;
}
