'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import ImagePlaceholder from '@/components/ui/ImagePlaceholder';
import { diffuserModels } from '@/lib/products';

const appFeatures = [
  {
    number: '01',
    title: 'Ajuste Dinâmico',
    description:
      'Controle a intensidade do aroma e o volume do som de forma independente pelo celular. Cada sentido no seu ritmo.',
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
      'Programe rotinas para o seu dia. Acorde com energia e foco, relaxe às 20h com jazz e notas calmantes.',
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
      'O app reconhece instantaneamente a essência conectada pelo clique magnético do cartucho. Zero configuração manual.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-7 w-7">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18" />
      </svg>
    ),
  },
];

export default function TechFeatures() {
  return (
    <section id="tecnologia" className="section-padding bg-offwhite">
      <div className="container-page">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="inline-block rounded-full bg-rust/10 text-rust px-4 py-1.5 text-xs uppercase tracking-widest mb-4">
            Tecnologia
          </span>
          <h2 className="font-serif text-3xl md:text-5xl text-ink mb-4">
            Escolha o modelo certo
          </h2>
          <p className="text-ink/60 max-w-xl mx-auto text-sm">
            Dois difusores feitos para ambientes diferentes. Um app para controlar tudo.
          </p>
        </motion.div>

        {/* Diffuser models */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-20">
          {diffuserModels.map((model, index) => (
            <motion.div
              key={model.id}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: index * 0.1 }}
              className="rounded-3xl bg-white border border-sand overflow-hidden"
            >
              <div className="aspect-[4/3] w-full">
                <ImagePlaceholder
                  className="w-full h-full"
                  label={`foto ${model.name}`}
                />
              </div>
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-serif text-2xl text-ink">{model.name}</h3>
                    <p className="text-ink/50 text-sm">{model.subtitle}</p>
                  </div>
                  {model.hasSound && (
                    <span className="text-xs bg-rust/10 text-rust rounded-full px-3 py-1 shrink-0 ml-2">
                      Com som
                    </span>
                  )}
                </div>
                <p className="font-serif text-3xl text-rust mb-1">R${model.price}</p>
                <p className="text-xs text-ink/40 mb-5">ou incluso no plano anual</p>
                <p className="text-xs text-ink/50 mb-4 leading-relaxed">{model.idealFor}</p>
                <ul className="space-y-2 mb-6">
                  {model.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-ink/65">
                      <span className="text-rust text-xs">✓</span> {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/starter-kit"
                  className="block text-center bg-rust hover:bg-rustDark text-white rounded-xl py-3 text-sm font-medium transition-colors duration-300"
                >
                  Montar kit com {model.name.split(' ')[1]}
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {/* App features */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h3 className="font-serif text-2xl md:text-3xl text-ink">
            Controlado pelo app Sinesia
          </h3>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {appFeatures.map((feature, index) => (
            <motion.div
              key={feature.number}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: index * 0.12 }}
              className="rounded-2xl border border-sand bg-white p-7 flex flex-col gap-5"
            >
              <div className="flex items-start justify-between">
                <div className="h-13 w-13 rounded-xl bg-rust/8 text-rust flex items-center justify-center p-3">
                  {feature.icon}
                </div>
                <span className="font-serif text-3xl text-sand">{feature.number}</span>
              </div>
              <div>
                <h4 className="font-serif text-lg text-ink mb-2">{feature.title}</h4>
                <p className="text-sm text-ink/60 leading-relaxed">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
