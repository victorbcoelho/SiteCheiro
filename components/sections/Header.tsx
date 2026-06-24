'use client';

import { useState } from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button';

const navLinks = [
  { label: 'Starter Kit', href: '/#starter-kit' },
  { label: 'Tecnologia', href: '/#como-funciona' },
  { label: 'Fragrâncias', href: '/#fragrancias' },
  { label: 'Para Empresas', href: '/empresas' },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-offwhite/90 backdrop-blur border-b border-sand/60">
      <div className="container-page flex items-center justify-between h-20">
        <Link href="/" className="font-serif text-2xl tracking-tight text-ink">
          Sinesia
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-ink/70 hover:text-ink transition-colors duration-300"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:block">
          <Button href="/pre-venda" size="md">
            Garantir Starter Kit
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
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="text-sm text-ink/70"
            >
              {link.label}
            </Link>
          ))}
          <Button href="/pre-venda" size="md" className="w-full">
            Garantir Starter Kit
          </Button>
        </div>
      )}
    </header>
  );
}
