'use client';

import { motion } from 'framer-motion';

const features = [
  {
    number: '01',
    title: 'Ajuste Dinâmico',
    description:
      'Controle a intensidade do aroma e o volume do som de forma independente diretamente pelo celular. Cada sentido no seu ritmo.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-7 w-7">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v3m0 12v3M3 12h3m12 0h3" />
        <circle cx="12" cy="12" r="4" strokeLinecap="round" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.34 6.34l2.12 2.12m7.08 7.08l2.12 2.12M6.34 17.66l2.12-2.12m7.08-7.08l2.12-2.12" />
      </svg>
    ),
  },
  {
    number: '02',
    title: 'Agendamento Inteligente',
    description:
      'Programe rotinas para o seu dia. Acorde com frequências de foco e cheiro de energia. Relaxe às 20h com jazz e notas calmantes.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-7 w-7">
        <circle cx="12" cy="12" r="9" strokeLinecap="round" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 7v5l3 3" />
      </svg>
    ),
  },
  {
    number: '03',
    title: 'Reconhecimento Magnético',
    description:
      'O aplicativo reconhece instantaneamente a essência que você conectou através do clique magnético do cartucho. Zero configuração manual.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-7 w-7">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18" />
      </svg>
    ),
  },
];

export default function TechFeatures() {
  return (
    <section id="como-funciona" className="section-padding bg-white">
      <div className="container-page">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block rounded-full bg-rust/10 text-rust px-4 py-1.5 text-xs uppercase tracking-widest mb-4">
            Tecnologia
          </span>
          <h2 className="font-serif text-3xl md:text-5xl text-ink">
            O Poder do Controle Total
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.number}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: index * 0.12 }}
              className="rounded-2xl border border-sand p-8 flex flex-col gap-5"
            >
              <div className="flex items-start justify-between">
                <div className="h-14 w-14 rounded-xl bg-rust/8 text-rust flex items-center justify-center">
                  {feature.icon}
                </div>
                <span className="font-serif text-3xl text-sand">{feature.number}</span>
              </div>
              <div>
                <h3 className="font-serif text-xl text-ink mb-3">{feature.title}</h3>
                <p className="text-sm text-ink/60 leading-relaxed">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
