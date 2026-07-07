'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import EmpresasWizard from './EmpresasWizard';
import { trackClick } from '@/lib/analytics';

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
    text: 'O olfato é o sentido mais ligado à memória e à emoção. O aroma do seu negócio se torna parte de como o cliente lembra da sua marca.',
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
  {
    number: '04',
    title: 'Cheiro o dia todo, não só no começo',
    text: 'Diferente de varetas e sprays, que somem em minutos, o difusor mantém o ambiente perfumado do abrir ao fechar. Todo dia, com a mesma intensidade.',
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
              O cheiro que faz seu cliente voltar
            </h1>
            <p className="text-base text-white/80 mb-8 max-w-md">
              Aromatização profissional para quem não quer pagar caro nem depender de técnico. Seu ambiente perfumado o tempo todo — não só nos primeiros minutos, como acontece com varetas e sprays.
            </p>
            <button
              onClick={() => { trackClick('Montar plano para minha empresa', { section: 'empresas' }); setShowWizard(true); }}
              className="inline-block bg-rust hover:bg-rustDark text-white rounded-full px-8 py-4 font-medium transition-colors duration-300"
            >
              Montar plano para minha empresa
            </button>
            <p className="text-white/40 text-xs mt-4">Sem contrato · Sem taxa de instalação · Manutenção inclusa</p>
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

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center text-ink/50 text-sm mt-10 leading-relaxed"
          >
            Ideal também para: Academias · Showrooms · Imobiliárias · Hotéis e pousadas · Restaurantes e cafés · Clínicas de estética · Coworkings · Pet shops · Óticas · Concessionárias
          </motion.p>
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

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
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

      {/* Tabela comparativa */}
      <section className="section-padding bg-offwhite">
        <div className="container-page">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-10"
          >
            <h2 className="font-serif text-3xl md:text-4xl text-ink mb-3">Como a Sinesia se compara</h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="overflow-x-auto"
          >
            <table className="w-full min-w-[600px] text-sm border-separate border-spacing-0">
              <thead>
                <tr>
                  <th className="text-left text-ink/50 text-xs uppercase tracking-widest font-medium px-5 py-4 bg-transparent w-[34%]" />
                  <th className="text-center px-5 py-4 bg-sand/40 rounded-tl-2xl text-ink/60 font-medium text-sm">Varetas e Sprays</th>
                  <th className="text-center px-5 py-4 bg-sand/40 text-ink/60 font-medium text-sm">Marketing olfativo tradicional</th>
                  <th className="text-center px-5 py-4 bg-rust text-white font-semibold text-sm rounded-tr-2xl">Sinesia ✦</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Cheiro o dia todo',       false, true,  true ],
                  ['Preço acessível',          true,  false, true ],
                  ['Sem contrato de fidelidade', true, false, true],
                  ['Sem visita técnica',       true,  null,  true ],
                  ['Manutenção inclusa',       false, null,  true ],
                  ['Resultado profissional',   false, true,  true ],
                ].map(([label, spray, grandes, sinesia], i) => (
                  <tr key={label as string} className={i % 2 === 0 ? 'bg-white' : 'bg-sand/20'}>
                    <td className={`px-5 py-3.5 font-medium text-ink ${i === 5 ? 'rounded-bl-2xl' : ''}`}>{label as string}</td>
                    <td className="px-5 py-3.5 text-center">
                      {spray === true ? <span className="text-green-600 font-bold text-base">✓</span> : spray === false ? <span className="text-ink/25 font-bold text-base">✕</span> : <span className="text-ink/40 text-xs">parcial</span>}
                    </td>
                    <td className="px-5 py-3.5 text-center bg-sand/40">
                      {grandes === true ? <span className="text-green-600 font-bold text-base">✓</span> : grandes === false ? <span className="text-ink/25 font-bold text-base">✕</span> : <span className="text-ink/40 text-xs">parcial</span>}
                    </td>
                    <td className={`px-5 py-3.5 text-center bg-rust/8 border-x border-rust/20 ${i === 5 ? 'rounded-br-2xl border-b border-rust/20' : ''}`}>
                      {sinesia === true ? <span className="text-rust font-bold text-base">✓</span> : <span className="text-ink/25 font-bold text-base">✕</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
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
                onClick={() => { trackClick('Montar plano para minha empresa', { section: 'empresas' }); setShowWizard(true); }}
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
