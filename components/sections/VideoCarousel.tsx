'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '@/components/ui/Button';
import { trackEvent } from '@/lib/analytics';

type Slide = {
  id: string;
  video: string;
  poster: string;
  title: string;
  caption: string;
};

const slides: Slide[] = [
  {
    id: 'sala',
    video: '/videos/sopre-sala.mp4',
    poster:
      'https://images.unsplash.com/photo-1616627561950-9f746e330187?auto=format&fit=crop&w=1600&q=80',
    title: 'Sala de estar',
    caption: 'O primeiro cheiro que seus convidados notam ao entrar.',
  },
  {
    id: 'quarto',
    video: '/videos/sopre-quarto.mp4',
    poster:
      'https://images.unsplash.com/photo-1602910344008-22f323cc1817?auto=format&fit=crop&w=1600&q=80',
    title: 'Quarto',
    caption: 'Durma em um ambiente perfumado a noite inteira.',
  },
  {
    id: 'escritorio',
    video: '/videos/sopre-escritorio.mp4',
    poster:
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1600&q=80',
    title: 'Home office',
    caption: 'Foco e bem-estar em cada respiração, do início ao fim do dia.',
  },
];

const AUTO_ADVANCE_MS = 6000;

export default function VideoCarousel() {
  const [active, setActive] = useState(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const goTo = useCallback((index: number) => {
    setActive((index + slides.length) % slides.length);
  }, []);

  useEffect(() => {
    timeoutRef.current = setTimeout(() => {
      setActive((current) => (current + 1) % slides.length);
    }, AUTO_ADVANCE_MS);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [active]);

  const current = slides[active];

  return (
    <section className="relative h-[85vh] min-h-[560px] w-full overflow-hidden bg-ink">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-out ${
            index === active ? 'opacity-100 z-[1]' : 'opacity-0 z-0'
          }`}
        >
          <Image
            src={slide.poster}
            alt={slide.title}
            fill
            priority={index === 0}
            className="object-cover"
          />
          <video
            className="absolute inset-0 h-full w-full object-cover"
            src={slide.video}
            poster={slide.poster}
            autoPlay={index === active}
            muted
            loop
            playsInline
            onError={(event) => {
              (event.currentTarget as HTMLVideoElement).style.opacity = '0';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/20 to-ink/10" />
        </div>
      ))}

      <button
        type="button"
        aria-label="Vídeo anterior"
        onClick={() => goTo(active - 1)}
        className="hidden md:flex absolute left-4 top-1/2 z-10 h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 text-white transition-colors hover:bg-white/15"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <button
        type="button"
        aria-label="Próximo vídeo"
        onClick={() => goTo(active + 1)}
        className="hidden md:flex absolute right-4 top-1/2 z-10 h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 text-white transition-colors hover:bg-white/15"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <div className="relative z-10 flex h-full flex-col justify-end">
        <div className="container-page pb-16 md:pb-20">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.5 }}
              className="max-w-xl text-white mb-8"
            >
              <h2 className="font-serif text-3xl md:text-5xl mb-3">{current.title}</h2>
              <p className="text-white/80 text-base md:text-lg">{current.caption}</p>
            </motion.div>
          </AnimatePresence>

          <div className="flex flex-wrap items-center justify-between gap-6">
            <div className="flex gap-3">
              {slides.map((slide, index) => (
                <button
                  key={slide.id}
                  type="button"
                  onClick={() => {
                    goTo(index);
                    trackEvent('cta_clicked', { cta: `carousel_dot_${slide.id}` });
                  }}
                  aria-label={`Ver ${slide.title}`}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    index === active ? 'w-10 bg-rust' : 'w-5 bg-white/40 hover:bg-white/70'
                  }`}
                />
              ))}
            </div>

            <Button
              href="/pre-venda"
              variant="secondary"
              size="lg"
              onClick={() => trackEvent('cta_clicked', { cta: 'carousel_cta' })}
            >
              Garantir meu Sopre
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
