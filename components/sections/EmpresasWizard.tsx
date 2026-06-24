'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { trackEvent } from '@/lib/analytics';
import { submitLead } from '@/lib/leads';

type Step = 'ambientes' | 'segmento' | 'objetivo' | 'contato' | 'done';

interface WizardState {
  ambientes: string | null;
  segmento: string | null;
  objetivo: string | null;
}

const ambientesOptions = [
  { id: '1', label: '1 ambiente', sub: 'Recepção, sala de espera ou sala principal' },
  { id: '2-3', label: '2 a 3 ambientes', sub: 'Ex: recepção + salas de reunião' },
  { id: '4+', label: '4 ou mais ambientes', sub: 'Multi-piso ou grande estabelecimento' },
];

const segmentoOptions = [
  { id: 'escritorio', label: '🏢 Escritório ou coworking' },
  { id: 'consultorio', label: '🩺 Consultório ou clínica' },
  { id: 'salao', label: '💇 Salão ou studio' },
  { id: 'comercio', label: '🛍️ Loja ou comércio' },
  { id: 'hotel', label: '🏨 Hotel ou pousada' },
  { id: 'outro', label: '✦ Outro tipo de negócio' },
];

const objetivoOptions = [
  { id: 'impressao', label: 'Causar boa primeira impressão', sub: 'Clientes e visitantes' },
  { id: 'bemestar', label: 'Bem-estar da equipe', sub: 'Foco e produtividade' },
  { id: 'diferencial', label: 'Diferencial da marca', sub: 'Identidade sensorial' },
  { id: 'tranquilidade', label: 'Tranquilidade para clientes', sub: 'Espera agradável' },
];

const STEPS: Step[] = ['ambientes', 'segmento', 'objetivo', 'contato'];

const WHATSAPP_BASE = 'https://wa.me/5500000000000?text=';

function buildWhatsappMsg(state: WizardState) {
  return encodeURIComponent(
    `Olá! Tenho interesse no Sinesia para empresas.\n` +
      `Ambientes: ${state.ambientes}\n` +
      `Segmento: ${state.segmento}\n` +
      `Objetivo: ${state.objetivo}`
  );
}

export default function EmpresasWizard() {
  const [step, setStep] = useState<Step>('ambientes');
  const [state, setState] = useState<WizardState>({
    ambientes: null,
    segmento: null,
    objetivo: null,
  });
  const [form, setForm] = useState({ nome: '', email: '', empresa: '' });
  const [loading, setLoading] = useState(false);

  const stepIndex = STEPS.indexOf(step);

  const goBack = () => {
    const prev = STEPS[stepIndex - 1];
    if (prev) setStep(prev);
  };

  const handleAmbientes = (id: string) => {
    setState((s) => ({ ...s, ambientes: id }));
    setStep('segmento');
    trackEvent('wizard_step', { step: 'empresas_ambientes', id });
  };

  const handleSegmento = (id: string) => {
    setState((s) => ({ ...s, segmento: id }));
    setStep('objetivo');
    trackEvent('wizard_step', { step: 'empresas_segmento', id });
  };

  const handleObjetivo = (id: string) => {
    setState((s) => ({ ...s, objetivo: id }));
    setStep('contato');
    trackEvent('wizard_step', { step: 'empresas_objetivo', id });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await submitLead('leads_b2b', {
      nome: form.nome,
      email: form.email,
      empresa: form.empresa,
      segmento: state.segmento ?? '',
      pontos: state.ambientes ?? '',
      origem: 'empresas-wizard',
      objetivo: state.objetivo,
    });
    trackEvent('lead_captured', { origem: 'empresas-wizard', segmento: state.segmento });
    setStep('done');
    setLoading(false);
  };

  return (
    <section className="section-padding bg-offwhite">
      <div className="container-page max-w-xl mx-auto">
        {step !== 'done' && (
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              {stepIndex > 0 && (
                <button
                  onClick={goBack}
                  className="text-sm text-ink/50 hover:text-ink transition-colors"
                >
                  ← Voltar
                </button>
              )}
              <div className="flex-1 flex gap-1.5">
                {STEPS.map((s, i) => (
                  <div
                    key={s}
                    className={`h-1 flex-1 rounded-full transition-all duration-500 ${
                      i <= stepIndex ? 'bg-rust' : 'bg-sand'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        <AnimatePresence mode="wait">
          {step === 'ambientes' && (
            <motion.div
              key="ambientes"
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="font-serif text-3xl md:text-4xl text-ink mb-2">
                Quantos ambientes você quer aromatizar?
              </h2>
              <p className="text-ink/50 text-sm mb-8">
                Isso vai nos ajudar a indicar o plano certo para o seu negócio.
              </p>
              <div className="flex flex-col gap-3">
                {ambientesOptions.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => handleAmbientes(opt.id)}
                    className="flex items-center justify-between w-full rounded-2xl border border-sand bg-white hover:border-rust hover:shadow-sm p-5 text-left transition-all duration-200 group"
                  >
                    <div>
                      <p className="font-medium text-ink">{opt.label}</p>
                      <p className="text-xs text-ink/40 mt-0.5">{opt.sub}</p>
                    </div>
                    <span className="text-ink/20 group-hover:text-rust transition-colors text-lg">→</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 'segmento' && (
            <motion.div
              key="segmento"
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="font-serif text-3xl md:text-4xl text-ink mb-2">
                Qual é o seu tipo de negócio?
              </h2>
              <p className="text-ink/50 text-sm mb-8">
                Cada segmento tem fragrâncias e intensidades ideais.
              </p>
              <div className="grid grid-cols-2 gap-3">
                {segmentoOptions.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => handleSegmento(opt.id)}
                    className="rounded-2xl border border-sand bg-white hover:border-rust hover:shadow-sm p-4 text-left text-sm font-medium text-ink transition-all duration-200"
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 'objetivo' && (
            <motion.div
              key="objetivo"
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="font-serif text-3xl md:text-4xl text-ink mb-2">
                Qual seu principal objetivo?
              </h2>
              <p className="text-ink/50 text-sm mb-8">
                Vamos personalizar a proposta com base no que mais importa pra você.
              </p>
              <div className="flex flex-col gap-3">
                {objetivoOptions.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => handleObjetivo(opt.id)}
                    className="flex items-center justify-between w-full rounded-2xl border border-sand bg-white hover:border-rust hover:shadow-sm p-5 text-left transition-all duration-200 group"
                  >
                    <div>
                      <p className="font-medium text-ink">{opt.label}</p>
                      <p className="text-xs text-ink/40 mt-0.5">{opt.sub}</p>
                    </div>
                    <span className="text-ink/20 group-hover:text-rust transition-colors text-lg">→</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 'contato' && (
            <motion.div
              key="contato"
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="font-serif text-3xl md:text-4xl text-ink mb-2">
                Perfeito! Agende uma conversa
              </h2>
              <p className="text-ink/50 text-sm mb-8">
                Deixe seus dados e entraremos em contato em até 24h para apresentar a proposta
                personalizada para o seu negócio.
              </p>
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input
                  type="text"
                  placeholder="Seu nome"
                  value={form.nome}
                  onChange={(e) => setForm((f) => ({ ...f, nome: e.target.value }))}
                  required
                  className="border border-sand rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:border-rust transition-colors"
                />
                <input
                  type="text"
                  placeholder="Nome da empresa"
                  value={form.empresa}
                  onChange={(e) => setForm((f) => ({ ...f, empresa: e.target.value }))}
                  required
                  className="border border-sand rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:border-rust transition-colors"
                />
                <input
                  type="email"
                  placeholder="E-mail profissional"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  required
                  className="border border-sand rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:border-rust transition-colors"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-rust hover:bg-rustDark disabled:opacity-60 text-white rounded-xl py-3.5 font-medium transition-colors duration-300"
                >
                  {loading ? 'Enviando...' : 'Agendar conversa online'}
                </button>
                <a
                  href={WHATSAPP_BASE + buildWhatsappMsg(state)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border border-sand text-ink/60 hover:border-rust hover:text-rust rounded-xl py-3.5 font-medium transition-colors duration-300 text-center text-sm"
                >
                  Ou falar agora pelo WhatsApp →
                </a>
              </form>
            </motion.div>
          )}

          {step === 'done' && (
            <motion.div
              key="done"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="text-center py-8"
            >
              <div className="text-5xl mb-6">✓</div>
              <h2 className="font-serif text-3xl text-ink mb-3">Recebemos seu contato!</h2>
              <p className="text-ink/60 text-sm max-w-sm mx-auto mb-8">
                Nossa equipe vai analisar seu perfil e entrar em contato em até 24h com uma proposta
                personalizada para o seu negócio.
              </p>
              <a
                href={WHATSAPP_BASE + buildWhatsappMsg(state)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-rust hover:bg-rustDark text-white rounded-xl px-8 py-3.5 font-medium transition-colors duration-300 text-sm"
              >
                Falar pelo WhatsApp agora
              </a>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
