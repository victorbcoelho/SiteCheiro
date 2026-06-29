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
    <header className="sticky top-0 z-50 bg-cream border-b border-sand/50">
      <div className="container-page flex items-center justify-between h-20">
        <Link href="/" className="flex items-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/sinesia-logo.png"
            alt="Sinesia"
            className="h-16 w-auto mix-blend-multiply"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = 'none';
              const fallback = document.getElementById('logo-fallback');
              if (fallback) fallback.style.display = 'block';
            }}
          />
          <span id="logo-fallback" className="font-serif text-2xl tracking-tight text-rust hidden">Sinesia</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {/* Difusor grátis — destaque especial */}
          <Link
            href="/starter-kit"
            onClick={() => trackClick('header_difusor_gratis', { section: 'header' })}
            className="text-sm font-semibold text-rust hover:text-rustDark transition-colors duration-300"
          >
            Difusor grátis
          </Link>

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
          <Button href="/starter-kit" size="md" onClick={() => trackClick('header_montar_meu_kit', { section: 'header' })}>
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
        <div className="md:hidden container-page pb-6 flex flex-col gap-4 bg-cream">
          <Link
            href="/starter-kit"
            onClick={() => { setOpen(false); trackClick('header_difusor_gratis', { section: 'header_mobile' }); }}
            className="text-sm font-semibold text-rust"
          >
            Difusor grátis
          </Link>
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
