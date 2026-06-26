'use client';

import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';
import { trackClick } from '@/lib/analytics';

const inclusions = [
  {
    label: '1× Dispositivo Inteligente Sinesia',
    value: 'Valor de tabela: R$ 399',
    highlight: 'GRÁTIS no plano',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-6 w-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2 3 5 7 5 11a5 5 0 01-10 0c0-4 3-8 5-11z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 19h8" />
      </svg>
    ),
  },
  {
    label: '2× Cartuchos de Essências Exclusivas',
    value: 'À escolha após o checkout',
    highlight: 'Inclusos',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-6 w-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 9h6M9 12h6M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    label: 'Acesso ao App Sinesia',
    value: 'iOS e Android',
    highlight: 'Gratuito',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-6 w-6">
        <rect x="5" y="2" width="14" height="20" rx="2" strokeLinecap="round" strokeLinejoin="round" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01" />
      </svg>
    ),
  },
];

export default function StarterKit() {
  return (
    <section id="starter-kit" className="section-padding bg-offwhite">
      <div className="container-page">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-serif text-3xl md:text-5xl text-ink mb-4">
            O Ecossistema Sinesia na Sua Rotina
          </h2>
          <p className="text-ink/60 max-w-xl mx-auto">
            Um único plano. Tudo que você precisa para transformar cada ambiente
            da sua casa em uma experiência multissensorial.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center max-w-5xl mx-auto">

          <div className="space-y-5">
            {inclusions.map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex items-start gap-5 rounded-2xl bg-white border border-sand p-6"
              >
                <div className="shrink-0 h-12 w-12 rounded-xl bg-rust/10 text-rust flex items-center justify-center">
                  {item.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-ink mb-0.5">{item.label}</p>
                  <p className="text-sm text-ink/50">{item.value}</p>
                </div>
                <span className="shrink-0 rounded-full bg-rust/10 text-rust text-xs font-medium px-3 py-1">
                  {item.highlight}
                </span>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="rounded-3xl bg-ink text-white p-10 text-center"
          >
            <p className="text-sm uppercase tracking-widest text-white/50 mb-3">
              Plano Anual Recorrente
            </p>
            <p className="font-serif text-6xl mb-1">
              R$&nbsp;98
            </p>
            <p className="text-white/50 text-sm mb-8">por mês · cobrança anual</p>

            <ul className="text-sm text-white/70 space-y-3 mb-10 text-left">
              <li className="flex items-center gap-3">
                <span className="h-1.5 w-1.5 rounded-full bg-rust shrink-0" />
                Aparelho Sinesia incluso (valor R$ 399)
              </li>
              <li className="flex items-center gap-3">
                <span className="h-1.5 w-1.5 rounded-full bg-rust shrink-0" />
                2 refis de essência por mês
              </li>
              <li className="flex items-center gap-3">
                <span className="h-1.5 w-1.5 rounded-full bg-rust shrink-0" />
                Frete grátis em todos os envios
              </li>
              <li className="flex items-center gap-3">
                <span className="h-1.5 w-1.5 rounded-full bg-rust shrink-0" />
                Cancele quando quiser, sem multa
              </li>
            </ul>

            <Button
              href="/pre-venda"
              variant="secondary"
              size="lg"
              className="w-full"
              onClick={() => trackClick('secao_starter_kit_assinar', { section: 'starter_kit' })}
            >
              Assinar o Starter Kit
            </Button>

            <p className="text-xs text-white/30 mt-4">
              Sem cobrança agora. Garanta sua vaga primeiro.
            </p>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
