'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { scents } from '@/lib/products';
import { trackClick } from '@/lib/analytics';

export default function ScentCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const amount = 304;
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -amount : amount,
      behavior: 'smooth',
    });
  };

  return (
    <section id="fragrancias" className="section-padding bg-offwhite overflow-hidden">
      <div className="container-page mb-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-6"
        >
          <div>
            <span className="inline-block rounded-full bg-rust/10 text-rust px-4 py-1.5 text-xs uppercase tracking-widest mb-4">
              Coleção
            </span>
            <h2 className="font-serif text-3xl md:text-5xl text-ink">
              8 Fragrâncias Sinestésicas
            </h2>
            <p className="text-ink/60 mt-3 max-w-md">
              Cada essência é composta para amplificar uma emoção diferente.
              Escolha a sua atmosfera.
            </p>
          </div>

          <div className="hidden md:flex gap-3">
            <button
              type="button"
              onClick={() => scroll('left')}
              aria-label="Anterior"
              className="h-11 w-11 rounded-full border border-sand flex items-center justify-center text-ink/60 hover:text-ink hover:border-ink transition-all duration-300"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => scroll('right')}
              aria-label="Próximo"
              className="h-11 w-11 rounded-full border border-sand flex items-center justify-center text-ink/60 hover:text-ink hover:border-ink transition-all duration-300"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 6l6 6-6 6" />
              </svg>
            </button>
          </div>
        </motion.div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-6 px-6 md:px-10
          scroll-smooth snap-x snap-mandatory
          [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        style={{ paddingLeft: 'max(1.5rem, calc((100vw - 80rem) / 2 + 1.5rem))' }}
      >
        {scents.map((scent, index) => (
          <motion.div
            key={scent.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5, delay: index * 0.06 }}
            className="snap-start shrink-0 w-[75vw] max-w-[280px] md:max-w-[300px] rounded-3xl overflow-hidden cursor-pointer"
            style={{ backgroundColor: scent.cardColor }}
            onClick={() => trackClick('fragancia_ver_detalhes', { section: 'fragrancias', fragancia: scent.id })}
          >
            <div className="relative h-[200px] overflow-hidden">
              {scent.image ? (
                <Image
                  src={scent.image}
                  alt={scent.name}
                  fill
                  className="object-contain object-center p-4 transition-transform duration-500 hover:scale-105"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center opacity-20">
                  <svg viewBox="0 0 64 64" className="h-20 w-20">
                    <path
                      d="M32 8c5 7 11 16 11 26a11 11 0 01-22 0c0-10 6-19 11-26z"
                      fill="white"
                    />
                  </svg>
                </div>
              )}
            </div>

            <div className="p-6">
              <p className="text-xs uppercase tracking-widest text-white/50 mb-1">
                {scent.family}
              </p>
              <h3 className="font-serif text-xl text-white mb-3">{scent.name}</h3>

              <div className="space-y-2 mb-4">
                <div>
                  <p className="text-xs text-white/40 uppercase tracking-wider">Notas</p>
                  <p className="text-sm text-white/80">{scent.notes}</p>
                </div>
                <div>
                  <p className="text-xs text-white/40 uppercase tracking-wider">Mood</p>
                  <p className="text-sm text-white/70">{scent.mood}</p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}

        <div className="shrink-0 w-6 md:w-10" aria-hidden />
      </div>
    </section>
  );
}
