'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

interface Testimonial {
  quote: React.ReactNode;
  name: string;
  credential: string;
}

// Itálico parcial nas palavras-chave, estilo San Lueur.
const TESTIMONIALS: Testimonial[] = [
  {
    quote: (
      <>
        Recomendo terapia de luz há anos. Ter um aparelho{' '}
        <em className="italic">sério</em> para uso em casa muda a aderência das
        minhas pacientes — elas finalmente <em className="italic">mantêm</em> a
        rotina.
      </>
    ),
    name: 'Dra. Helena Vasconcelos',
    credential: 'Dermatologista · CRM verificado',
  },
  {
    quote: (
      <>
        Em seis semanas minha pele ficou visivelmente mais{' '}
        <em className="italic">firme</em>. E o melhor: virou o meu momento de{' '}
        <em className="italic">pausa</em> no fim do dia.
      </>
    ),
    name: 'Marina L.',
    credential: 'Lista de espera · São Paulo',
  },
  {
    quote: (
      <>
        Eu tinha medo de ser mais um <em className="italic">gadget</em> de
        gaveta. Não é. É bem-feito, confortável e eu realmente{' '}
        <em className="italic">uso</em> todos os dias.
      </>
    ),
    name: 'Camila R.',
    credential: 'Testadora do protótipo',
  },
  {
    quote: (
      <>
        As manchas de sol que me incomodavam há anos estão{' '}
        <em className="italic">clareando</em>. Faço enquanto respondo mensagens —{' '}
        <em className="italic">zero</em> esforço.
      </>
    ),
    name: 'Patrícia M.',
    credential: 'Lista de espera · Rio de Janeiro',
  },
  {
    quote: (
      <>
        Como esteticista, testei vários. A qualidade do LED e do silicone da
        Lûmance está <em className="italic">acima</em> do que vejo no mercado de
        consumo.
      </>
    ),
    name: 'Juliana Prado',
    credential: 'Esteticista · Verificado',
  },
];

export default function Testimonials() {
  const [index, setIndex] = useState(0);
  const total = TESTIMONIALS.length;
  const go = (i: number) => setIndex((i + total) % total);
  const t = TESTIMONIALS[index];

  return (
    <section className="bg-offwhite py-24">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-gold">
          Quem já testou
        </p>

        <div className="relative mt-10 min-h-[220px]">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -top-6 left-1/2 -translate-x-1/2 font-serif text-8xl leading-none text-gold/25"
          >
            &ldquo;
          </span>

          <AnimatePresence mode="wait">
            <motion.blockquote
              key={index}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.4 }}
              className="relative px-2"
            >
              <p className="font-serif text-2xl leading-relaxed text-ink sm:text-[28px]">
                {t.quote}
              </p>
              <footer className="mt-8">
                <p className="text-base font-medium text-ink">{t.name}</p>
                <p className="mt-1 text-sm text-ink/50">{t.credential}</p>
              </footer>
            </motion.blockquote>
          </AnimatePresence>
        </div>

        <div className="mt-10 flex items-center justify-center gap-6">
          <button
            onClick={() => go(index - 1)}
            aria-label="Depoimento anterior"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-ink/20 text-ink/60 transition-colors hover:border-ink hover:text-ink"
          >
            ←
          </button>

          <div className="flex items-center gap-2">
            {TESTIMONIALS.map((_, i) => (
              <button
                key={i}
                onClick={() => go(i)}
                aria-label={`Ir para depoimento ${i + 1}`}
                className={`h-2 rounded-full transition-all ${
                  i === index ? 'w-6 bg-gold' : 'w-2 bg-ink/20'
                }`}
              />
            ))}
          </div>

          <button
            onClick={() => go(index + 1)}
            aria-label="Próximo depoimento"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-ink/20 text-ink/60 transition-colors hover:border-ink hover:text-ink"
          >
            →
          </button>
        </div>
      </div>
    </section>
  );
}
