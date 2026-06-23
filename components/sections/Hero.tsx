'use client';

import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';
import { trackEvent } from '@/lib/analytics';

export default function Hero() {
  return (
    <section className="bg-white pt-28 pb-16 md:pt-36 md:pb-20">
      <div className="container-page">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-2xl mx-auto text-center"
        >
          <span className="inline-block rounded-full bg-rust/10 text-rust px-4 py-1.5 text-xs uppercase tracking-widest mb-6">
            Pré-lançamento — Vagas limitadas
          </span>

          <h1 className="font-serif text-4xl md:text-6xl leading-[1.1] mb-6 text-ink">
            Sua casa sempre cheirosa. Sem você lembrar de nada.
          </h1>

          <p className="text-lg md:text-xl text-ink/60 mb-10 max-w-xl mx-auto">
            O difusor inteligente que programa, alterna entre 2 aromas e repõe
            automaticamente. Tudo pelo app.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Button
              href="/pre-venda"
              size="lg"
              onClick={() => trackEvent('cta_clicked', { cta: 'hero_primary' })}
            >
              Garantir meu Sopre
            </Button>
            <Button href="/#como-funciona" variant="outline" size="lg">
              Como funciona
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
