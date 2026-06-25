'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { trackClick } from '@/lib/analytics';

const steps = [
  {
    number: '01',
    title: 'Escolha um difusor',
    description:
      'Leve em conta o tamanho do ambiente. O Sinesia Room cobre até 20 m². O Sinesia Tower cobre até 40 m².',
    cta: { label: 'Ver modelos', href: '#tecnologia' },
    bg: 'bg-sand/20',
    image: '/images/sinesia-howto-difusor.jpg',
    icon: (
      <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-20 w-20 text-rust/40">
        <rect x="12" y="24" width="40" height="24" rx="4" />
        <path d="M20 24v-4a12 12 0 0124 0v4" strokeLinecap="round" />
        <circle cx="32" cy="36" r="4" />
        <path d="M32 40v4" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    number: '02',
    title: 'Escolha as fragrâncias',
    description:
      'Ache sua favorita entre as 8 essências premium — cada uma criada para amplificar uma emoção diferente no seu ambiente.',
    cta: { label: 'Ver fragrâncias', href: '#fragrancias' },
    bg: 'bg-rust/5',
    image: '/images/sinesia-howto-fragrancias.jpg',
    icon: (
      <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-20 w-20 text-rust/40">
        <path d="M24 48V28c0-4.4 3.6-8 8-8s8 3.6 8 8v20" strokeLinecap="round" />
        <path d="M20 48h24" strokeLinecap="round" />
        <path d="M32 20v-8" strokeLinecap="round" />
        <path d="M26 14c0-3.3 2.7-6 6-6s6 2.7 6 6" strokeLinecap="round" />
        <ellipse cx="32" cy="48" rx="12" ry="3" />
      </svg>
    ),
  },
  {
    number: '03',
    title: 'Controle pelo app',
    description:
      'Ajuste a intensidade do aroma, programe horários e alterne fragrâncias automaticamente. Tudo na palma da mão.',
    cta: { label: 'Montar meu kit', href: '/starter-kit' },
    bg: 'bg-ink/5',
    image: '/images/sinesia-howto-app.jpg',
    icon: (
      <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-20 w-20 text-rust/40">
        <rect x="20" y="8" width="24" height="40" rx="4" />
        <path d="M28 44h8" strokeLinecap="round" />
        <path d="M26 18h12M26 24h8M26 30h10" strokeLinecap="round" />
      </svg>
    ),
  },
];

export default function HowToUse() {
  return (
    <section id="como-funciona" className="section-padding bg-offwhite">
      <div className="container-page">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-serif text-3xl md:text-5xl text-ink mb-4">
            Do que você precisa
          </h2>
          <p className="text-ink/60 max-w-xl mx-auto">
            Três passos simples para transformar qualquer ambiente em uma
            experiência multissensorial.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: index * 0.12 }}
              className="flex flex-col gap-5"
            >
              <div className={`aspect-[4/3] w-full rounded-2xl overflow-hidden flex items-center justify-center ${step.bg}`}>
                {step.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={step.image}
                    alt={step.title}
                    className="w-3/4 h-3/4 object-contain"
                    onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                  />
                ) : step.icon}
              </div>

              <div>
                <p className="font-serif text-4xl text-rust/30 mb-2">{step.number}</p>
                <h3 className="font-serif text-xl text-ink mb-2">{step.title}</h3>
                <p className="text-sm text-ink/60 leading-relaxed mb-4">{step.description}</p>
                <Link
                  href={step.cta.href}
                  onClick={() => trackClick(step.cta.label, { section: 'how_to_use', step: step.number })}
                  className="text-sm font-medium text-rust hover:text-rustDark underline underline-offset-4 transition-colors duration-300"
                >
                  {step.cta.label} →
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center mt-14"
        >
          <Link
            href="/starter-kit"
            onClick={() => trackClick('Quero começar', { section: 'how_to_use' })}
            className="inline-block bg-rust hover:bg-rustDark text-white rounded-full px-10 py-4 text-sm font-medium transition-colors duration-300"
          >
            Quero começar
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
