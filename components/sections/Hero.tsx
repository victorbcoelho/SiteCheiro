'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';
import { trackEvent, trackClick } from '@/lib/analytics';

export default function Hero() {
  return (
    <section className="relative min-h-[90vh] md:min-h-[85vh] flex items-center overflow-hidden bg-ink">
      <motion.div
        initial={{ scale: 1.06 }}
        animate={{ scale: 1 }}
        transition={{ duration: 10, ease: 'easeOut' }}
        className="absolute inset-0"
      >
        <Image
          src="https://images.unsplash.com/photo-1616627561950-9f746e330187?auto=format&fit=crop&w=2000&q=80"
          alt="Ambiente aconchegante Sinesia"
          fill
          priority
          className="object-cover opacity-50"
        />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-b from-ink/60 via-ink/40 to-ink/80" />

      <div className="container-page relative z-10 py-24">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl text-white"
        >
          <h1 className="font-serif text-2xl md:text-4xl lg:text-5xl leading-[1.05] mb-6">
            Sua casa com cheiro de praia. Ou de floresta. Ou de hotel 5 estrelas. Você escolhe.
          </h1>

          <p className="text-lg md:text-xl text-white/75 mb-10 max-w-xl">
            Sua casa sempre cheirosa, sem você precisar pensar nisso. Os refis chegam antes de acabar, com frete grátis.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              href="/starter-kit"
              size="lg"
              onClick={() => trackClick('hero_garantir_kit', { section: 'hero' })}
            >
              Descubra seu aroma ideal
            </Button>
            <Button href="#como-funciona" variant="outline" size="lg" onClick={() => trackClick('hero_como_funciona', { section: 'hero' })}>
              Como funciona
            </Button>
          </div>

          <p className="text-xs text-white/40 mt-6">
            Aparelho incluso no plano&nbsp;&nbsp;•&nbsp;&nbsp;Cancele quando quiser&nbsp;&nbsp;•&nbsp;&nbsp;Frete grátis nos refis
          </p>
        </motion.div>
      </div>
    </section>
  );
}
