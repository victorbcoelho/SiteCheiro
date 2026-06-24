'use client';

import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';
import { trackEvent } from '@/lib/analytics';

export default function Hero() {
  return (
    <section className="bg-offwhite pt-28 pb-16 md:pt-36 md:pb-24 overflow-hidden">
      <div className="container-page">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="order-2 lg:order-1 text-center lg:text-left"
          >
            <span className="inline-block rounded-full bg-rust/10 text-rust px-4 py-1.5 text-xs uppercase tracking-widest mb-6">
              Pré-lançamento — Unidades limitadas
            </span>

            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl leading-[1.1] mb-6 text-ink">
              Transforme sua casa em um santuário de luxo através dos sentidos.
            </h1>

            <p className="text-base md:text-lg text-ink/60 mb-10 max-w-lg mx-auto lg:mx-0">
              O primeiro sistema integrado de áudio e aroma do mundo. Encaixe
              seu cartucho magnético, dê o play no app e redesenhe a atmosfera
              do seu ambiente.
            </p>

            <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 mb-6">
              <Button
                href="/pre-venda"
                size="lg"
                onClick={() => trackEvent('cta_clicked', { cta: 'hero_primary' })}
              >
                Garantir Meu Starter Kit
              </Button>
            </div>

            <p className="text-xs text-ink/40 text-center lg:text-left">
              Aparelho incluso no plano&nbsp;&nbsp;•&nbsp;&nbsp;Cancele quando quiser&nbsp;&nbsp;•&nbsp;&nbsp;Frete grátis nos refis
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="order-1 lg:order-2 flex justify-center"
          >
            <div className="relative w-full max-w-sm aspect-square">
              <div className="absolute inset-0 rounded-full bg-rust/8 blur-3xl scale-110" />
              <div className="relative rounded-3xl bg-sand/30 border border-sand w-full h-full flex items-center justify-center">
                <div className="text-center px-8">
                  <div className="mx-auto mb-6 w-24 h-24 rounded-full bg-ink flex items-center justify-center">
                    <svg viewBox="0 0 64 64" className="h-12 w-12">
                      <path
                        d="M32 8c5 7 11 16 11 26a11 11 0 01-22 0c0-10 6-19 11-26z"
                        fill="#B95C42"
                      />
                      <rect x="20" y="44" width="24" height="4" rx="2" fill="#FBFBFA" opacity="0.5" />
                    </svg>
                  </div>
                  <p className="font-serif text-2xl text-ink mb-1">Sinesia</p>
                  <p className="text-xs text-ink/40 uppercase tracking-widest">Som + Aroma</p>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
