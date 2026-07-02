'use client';

import { motion } from 'framer-motion';
import { scrollToId } from '@/lib/scroll';
import { trackButtonClick } from '@/lib/analytics';

export default function Hero() {
  const onCta = () => {
    trackButtonClick('hero_cta');
    scrollToId('montar-kit');
  };

  return (
    <section id="hero" className="relative isolate overflow-hidden">
      {/* Fundo: vídeo autoplay em loop (muted). Fallback via poster/gradiente
          caso o arquivo /hero.mp4 ainda não exista em produção. */}
      <video
        className="absolute inset-0 -z-20 h-full w-full object-cover"
        autoPlay
        loop
        muted
        playsInline
        poster="/hero-poster.svg"
        aria-hidden="true"
      >
        <source src="/hero.mp4" type="video/mp4" />
      </video>
      {/* Gradiente de base caso o vídeo não carregue. */}
      <div className="absolute inset-0 -z-30 bg-gradient-to-br from-[#2a2320] via-[#3a2d28] to-[#1a1512]" />
      {/* Sobreposição escura sutil para legibilidade. */}
      <div className="absolute inset-0 -z-10 bg-black/45" />

      <div className="mx-auto flex min-h-[88vh] max-w-7xl flex-col items-start justify-center px-6 py-28">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-5 text-xs uppercase tracking-[0.35em] text-offwhite/80"
        >
          Terapia de luz LED · em casa
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.05 }}
          className="max-w-3xl font-serif text-4xl font-medium leading-[1.08] text-offwhite sm:text-5xl md:text-6xl"
        >
          A luz que os dermatologistas usam, agora nas suas mãos.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="mt-6 max-w-xl text-lg leading-relaxed text-offwhite/85"
        >
          A Lûmance leva a terapia de luz de nível clínico para os seus 10 minutos
          de silêncio. Mais colágeno, menos manchas, uma pele mais tranquila —
          sem consultório, sem pressa.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="mt-10"
        >
          <button
            onClick={onCta}
            className="group inline-flex items-center gap-3 rounded-full bg-offwhite px-8 py-4 text-sm font-medium text-ink transition-transform duration-300 hover:scale-[1.03] hover:shadow-xl"
          >
            Iniciar configuração personalizada
            <span className="transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </button>
        </motion.div>
      </div>
    </section>
  );
}
