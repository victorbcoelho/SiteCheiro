'use client';

import { useState } from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import { trackClick } from '@/lib/analytics';

const navLinks = [
  { label: 'Kit para iniciar', href: '/starter-kit' },
  { label: 'Tecnologia', href: '/#tecnologia' },
  { label: 'Fragrâncias', href: '/#fragrancias' },
  { label: 'Para Empresas', href: '/empresas' },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-offwhite/90 backdrop-blur border-b border-sand/60">
      <div className="container-page flex items-center justify-between h-20">
        <Link href="/" className="flex items-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/sinesia-logo.png"
            alt="Sinesia"
            className="h-12 w-auto"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = 'none';
              const fallback = document.getElementById('logo-fallback');
              if (fallback) fallback.style.display = 'block';
            }}
          />
          <span id="logo-fallback" className="font-serif text-2xl tracking-tight text-rust hidden">Sinesia</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-sm text-ink/70 hover:text-ink transition-colors duration-300"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:block">
          <Button href="/starter-kit" size="md" onClick={() => trackClick('Montar meu kit', { section: 'header' })}>
            Montar meu kit
          </Button>
        </div>

        <button
          className="md:hidden flex flex-col gap-1.5"
          onClick={() => setOpen(!open)}
          aria-label="Abrir menu"
        >
          <span className="h-0.5 w-6 bg-ink" />
          <span className="h-0.5 w-6 bg-ink" />
          <span className="h-0.5 w-4 bg-ink" />
        </button>
      </div>

      {open && (
        <div className="md:hidden container-page pb-6 flex flex-col gap-4 bg-offwhite">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setOpen(false)}
              className="text-sm text-ink/70"
            >
              {link.label}
            </Link>
          ))}
          <Button href="/starter-kit" size="md" className="w-full">
            Montar meu kit
          </Button>
        </div>
      )}
    </header>
  );
}
