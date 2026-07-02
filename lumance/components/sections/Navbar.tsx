'use client';

import { useEffect, useState } from 'react';
import { scrollToId } from '@/lib/scroll';
import { trackButtonClick } from '@/lib/analytics';

const LINKS = [
  { label: 'Produto', id: 'produto' },
  { label: 'A Ciência', id: 'ciencia' },
  { label: 'Sobre', id: 'manifesto' },
  { label: 'FAQ', id: 'faq' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const go = (id: string) => {
    setOpen(false);
    scrollToId(id);
  };

  const onCta = () => {
    trackButtonClick('header_cta');
    go('montar-kit');
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-colors duration-300 ${
        scrolled
          ? 'border-b border-ink/10 bg-offwhite/90 backdrop-blur'
          : 'border-b border-transparent bg-offwhite/70 backdrop-blur-sm'
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <button
          onClick={() => go('hero')}
          className="font-serif text-2xl font-semibold tracking-tight text-ink"
          aria-label="Lûmance — ir para o topo"
        >
          Lûmance
        </button>

        <ul className="hidden items-center gap-9 md:flex">
          {LINKS.map((l) => (
            <li key={l.id}>
              <button
                onClick={() => go(l.id)}
                className="text-sm text-ink/70 transition-colors hover:text-ink"
              >
                {l.label}
              </button>
            </li>
          ))}
        </ul>

        <div className="hidden md:block">
          <button
            onClick={onCta}
            className="rounded-full border border-ink px-5 py-2 text-sm text-ink transition-colors duration-300 hover:bg-ink hover:text-offwhite"
          >
            Montar Meu Kit
          </button>
        </div>

        <button
          className="flex h-10 w-10 items-center justify-center md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={open}
        >
          <div className="space-y-[5px]">
            <span
              className={`block h-[1.5px] w-6 bg-ink transition-transform duration-300 ${
                open ? 'translate-y-[6.5px] rotate-45' : ''
              }`}
            />
            <span
              className={`block h-[1.5px] w-6 bg-ink transition-opacity duration-300 ${
                open ? 'opacity-0' : ''
              }`}
            />
            <span
              className={`block h-[1.5px] w-6 bg-ink transition-transform duration-300 ${
                open ? '-translate-y-[6.5px] -rotate-45' : ''
              }`}
            />
          </div>
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-ink/10 bg-offwhite md:hidden">
          <ul className="mx-auto flex max-w-7xl flex-col px-6 py-4">
            {LINKS.map((l) => (
              <li key={l.id}>
                <button
                  onClick={() => go(l.id)}
                  className="w-full py-3 text-left text-base text-ink/80"
                >
                  {l.label}
                </button>
              </li>
            ))}
            <li className="pt-2">
              <button
                onClick={onCta}
                className="w-full rounded-full bg-ink py-3 text-center text-sm text-offwhite"
              >
                Montar Meu Kit
              </button>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
