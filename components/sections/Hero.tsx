'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';
import { trackEvent } from '@/lib/analytics';

export default function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      <Image
        src="https://images.unsplash.com/photo-1616627561950-9f746e330187?auto=format&fit=crop&w=2000&q=80"
        alt="Sala de estar aconchegante com luz suave"
        fill
        priority
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-ink/70 via-ink/40 to-ink/10" />

      <div className="container-page relative z-10 py-24">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-2xl text-white"
        >
          <span className="inline-block rounded-full bg-white/15 backdrop-blur px-4 py-1.5 text-xs uppercase tracking-widest mb-6">
            Pré-lançamento — Vagas limitadas
          </span>

          <h1 className="font-serif text-4xl md:text-6xl leading-[1.1] mb-6">
            Sua casa sempre cheirosa. Sem você lembrar de nada.
          </h1>

          <p className="text-lg md:text-xl text-white/85 mb-10 max-w-xl">
            O difusor inteligente que programa, alterna entre 2 aromas e repõe
            automaticamente. Tudo pelo app.
          </p>

          <div className="flex flex-wrap gap-4">
            <Button
              href="/pre-venda"
              size="lg"
              onClick={() => trackEvent('cta_clicked', { cta: 'hero_primary' })}
            >
              Garantir meu Sopre
            </Button>
            <Button
              href="/#como-funciona"
              variant="outline"
              size="lg"
              className="!text-white !border-white hover:!bg-white hover:!text-ink"
            >
              Como funciona
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
