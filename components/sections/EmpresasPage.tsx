'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import EmpresasWizard from './EmpresasWizard';

const segments = [
  {
    icon: (
      <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-7 w-7">
        <rect x="3" y="8" width="26" height="20" rx="2" />
        <path d="M3 14h26" />
        <path d="M10 8V5a2 2 0 012-2h8a2 2 0 012 2v3" />
        <rect x="13" y="18" width="6" height="6" rx="1" />
      </svg>
    ),
    title: 'Escritórios e coworkings',
    text: 'A primeira impressão de quem entra na sua sede. Um ambiente que inspira produtividade e bem-estar.',
  },
  {
    icon: (
      <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-7 w-7">
        <path d="M16 4a6 6 0 100 12 6 6 0 000-12Z" />
        <path strokeLinecap="round" d="M8 28c0-4.4 3.6-8 8-8s8 3.6 8 8" />
        <path d="M22 14l3 3-3 3" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M25 17h-5" strokeLinecap="round" />
      </svg>
    ),
    title: 'Consultórios e clínicas',
    text: 'Ambiente calmo e profissional para seus pacientes. Reduza a ansiedade e melhore a experiência de espera.',
  },
  {
    icon: (
      <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-7 w-7">
        <path d="M6 26V10l10-6 10 6v16" />
        <rect x="12" y="18" width="8" height="8" rx="1" />
        <path d="M10 14h12" strokeLinecap="round" />
      </svg>
    ),
    title: 'Salões e estúdios',
    text: 'A experiência sensorial completa do seu atendimento. Cheiro que ficará na memória do cliente.',
  },
  {
    icon: (
      <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-7 w-7">
        <rect x="3" y="6" width="26" height="20" rx="2" />
        <path d="M3 12h26" />
        <path d="M10 18h3M10 22h8" strokeLinecap="round" />
        <circle cx="22" cy="20" r="3" />
      </svg>
    ),
    title: 'Lojas e comércios',
    text: 'O cheiro que faz o cliente voltar. Identidade olfativa da sua marca, presente em cada visita.',
  },
];

const benefits = [
  {
    number: '01',
    title: 'Primeira impressão marcante',
    text: 'Estudos mostram que 75% das emoções do dia são influenciadas pelo olfato. O aroma do seu negócio é sua identidade mais poderosa.',
  },
  {
    number: '02',
    title: 'Plug & play, sem técnico',
    text: 'Plugou, programou no app, esqueceu. Sem instalação especial, sem visita técnica. O refil chega todo mês na sua porta.',
  },
  {
    number: '03',
    title: 'Controle total pelo app',
    text: 'Intensidade, horário, troca de fragrância — tudo pelo app Sinesia. Funciona de qualquer lugar.',
  },
];

export default function EmpresasPage() {
  const [showWizard, setShowWizard] = useState(false);

  if (showWizard) {
    return <EmpresasWizard />;
  }

  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[65vh] flex items-center overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=2000&q=80"
          alt="Escritório moderno"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/85 via-ink/55 to-ink/15" />
        <div className="container-page relative z-10 py-24">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-xl text-white"
          >
            <span className="inline-block rounded-full bg-white/10 backdrop-blur px-4 py-1.5 text-xs uppercase tracking-widest mb-6">
              Sinesia para empresas
            </span>
            <h1 className="font-serif text-4xl md:text-5xl leading-[1.1] mb-5">
              O ambiente que seus clientes vão notar
            </h1>
            <p className="text-base text-white/80 mb-8 max-w-md">
              Aromatização inteligente para escritórios, consultórios, salões e
              pequenos comércios. Sem mensalidade cara, sem visita técnica.
            </p>
            <button
              onClick={() => setShowWizard(true)}
              className="inline-block bg-rust hover:bg-rustDark text-white rounded-full px-8 py-4 font-medium transition-colors duration-300"
            >
              Montar plano para minha empresa
            </button>
          </motion.div>
        </div>
      </section>

      {/* Para quem é */}
      <section className="section-padding bg-offwhite">
        <div className="container-page">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="font-serif text-3xl md:text-4xl text-ink mb-3">Para quem é</h2>
            <p className="text-ink/60 text-sm max-w-lg mx-auto">
              Sinesia foi pensado para negócios que entendem que a experiência do cliente começa
              antes mesmo de qualquer palavra.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {segments.map((seg, i) => (
              <motion.div
                key={seg.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="rounded-2xl bg-white border border-sand p-6"
              >
                <div className="h-12 w-12 rounded-xl bg-rust/8 text-rust flex items-center justify-center mb-4">
                  {seg.icon}
                </div>
                <h3 className="font-serif text-base text-ink mb-2">{seg.title}</h3>
                <p className="text-sm text-ink/55 leading-relaxed">{seg.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Como funciona */}
      <section className="section-padding bg-white">
        <div className="container-page">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-14"
          >
            <h2 className="font-serif text-3xl md:text-4xl text-ink mb-3">
              Simples do início ao fim
            </h2>
            <p className="text-ink/60 text-sm max-w-md mx-auto">
              Sem instalação técnica, sem contrato longo, sem complicação.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {benefits.map((b, i) => (
              <motion.div
                key={b.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                <p className="font-serif text-4xl text-rust/20 mb-3">{b.number}</p>
                <h3 className="font-serif text-xl text-ink mb-3">{b.title}</h3>
                <p className="text-sm text-ink/55 leading-relaxed">{b.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Sinesia for business */}
      <section className="section-padding bg-ink text-white">
        <div className="container-page">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block rounded-full bg-white/10 px-4 py-1.5 text-xs uppercase tracking-widest mb-5">
                Por que Sinesia
              </span>
              <h2 className="font-serif text-3xl md:text-4xl mb-6">
                Diferente das soluções tradicionais de aromatização
              </h2>
              <ul className="space-y-4">
                {[
                  ['Sem mensalidade cara', 'Planos a partir de R$98/mês com difusor incluso'],
                  ['Sem técnico', 'Você mesmo instala em menos de 2 minutos'],
                  ['Sem contrato longo', 'Cancele quando quiser, sem multa'],
                  ['Com app de controle', 'Ajuste intensidade e horário de qualquer lugar'],
                  ['Garantia vitalícia', 'Para assinantes, cobrimos qualquer defeito'],
                ].map(([title, sub]) => (
                  <li key={title} className="flex items-start gap-3">
                    <span className="text-rust mt-0.5">✓</span>
                    <div>
                      <p className="font-medium text-sm">{title}</p>
                      <p className="text-white/50 text-xs">{sub}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="rounded-3xl bg-white/5 border border-white/10 p-8"
            >
              <h3 className="font-serif text-xl mb-6">Pronto para começar?</h3>
              <p className="text-white/60 text-sm mb-6 leading-relaxed">
                Responda 3 perguntas rápidas e monte o plano ideal para o seu negócio.
                Depois você escolhe as fragrâncias, a quantidade de difusores e o plano.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2 text-sm text-white/70">
                  <span className="text-rust">→</span> Quantos ambientes quer aromatizar
                </li>
                <li className="flex items-center gap-2 text-sm text-white/70">
                  <span className="text-rust">→</span> Qual o segmento do seu negócio
                </li>
                <li className="flex items-center gap-2 text-sm text-white/70">
                  <span className="text-rust">→</span> Qual seu principal objetivo
                </li>
              </ul>
              <button
                onClick={() => setShowWizard(true)}
                className="w-full bg-rust hover:bg-rustDark text-white rounded-xl py-3.5 font-medium transition-colors duration-300 text-sm"
              >
                Montar plano para minha empresa
              </button>
              <p className="text-white/30 text-xs text-center mt-3">
                Pré-lançamento · Sem cobrança agora
              </p>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}
