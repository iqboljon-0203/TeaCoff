import { Link } from '@/i18n/routing';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] bg-[#0D0A08] text-white flex flex-col items-center justify-center p-4 text-center">
      <h1 className="font-headline text-6xl font-black text-brand-lime mb-4">404</h1>
      <h2 className="font-headline text-xl font-bold mb-2">Страница не найдена</h2>
      <p className="text-neutral-400 text-xs mb-6 max-w-sm font-body">
        Возможно, страница была перемещена или адрес введен неверно.
      </p>
      <Link
        href="/"
        className="px-6 py-2.5 rounded-xl bg-brand-lime text-black font-extrabold text-xs uppercase tracking-wider hover:brightness-110 font-headline"
      >
        На главную
      </Link>
    </div>
  );
}
