'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { trackEvent } from '@/lib/analytics';
import StarterKitWizard from './StarterKitWizard';

type B2BStep = 'ambientes' | 'segmento' | 'objetivo' | 'consumer-flow';

const ambientesOptions = [
  { id: '1', label: '1 ambiente', sub: 'Recepção, sala de espera ou sala principal' },
  { id: '2-3', label: '2 a 3 ambientes', sub: 'Ex: recepção + salas de reunião' },
  { id: '4+', label: '4 ou mais ambientes', sub: 'Multi-piso ou grande estabelecimento' },
];

const segmentoOptions = [
  { id: 'escritorio', label: 'Escritório ou coworking' },
  { id: 'consultorio', label: 'Consultório ou clínica' },
  { id: 'salao', label: 'Salão ou studio' },
  { id: 'comercio', label: 'Loja ou comércio' },
  { id: 'hotel', label: 'Hotel ou pousada' },
  { id: 'outro', label: 'Outro tipo de negócio' },
];

const objetivoOptions = [
  { id: 'impressao', label: 'Causar boa primeira impressão', sub: 'Clientes e visitantes' },
  { id: 'bemestar', label: 'Bem-estar da equipe', sub: 'Foco e produtividade' },
  { id: 'diferencial', label: 'Diferencial da marca', sub: 'Identidade sensorial' },
  { id: 'tranquilidade', label: 'Tranquilidade para clientes', sub: 'Espera agradável' },
];

const B2B_STEPS: B2BStep[] = ['ambientes', 'segmento', 'objetivo'];

export default function EmpresasWizard() {
  const [step, setStep] = useState<B2BStep>('ambientes');
  const [b2bState, setB2bState] = useState({
    ambientes: '',
    segmento: '',
    objetivo: '',
  });

  const stepIndex = B2B_STEPS.indexOf(step as Exclude<B2BStep, 'consumer-flow'>);

  const goBack = () => {
    const prev = B2B_STEPS[stepIndex - 1];
    if (prev) setStep(prev);
  };

  const handleAmbientes = (id: string) => {
    setB2bState((s) => ({ ...s, ambientes: id }));
    setStep('segmento');
    trackEvent('wizard_step', { step: 'empresas_ambientes', id });
  };

  const handleSegmento = (id: string) => {
    setB2bState((s) => ({ ...s, segmento: id }));
    setStep('objetivo');
    trackEvent('wizard_step', { step: 'empresas_segmento', id });
  };

  const handleObjetivo = (id: string) => {
    setB2bState((s) => ({ ...s, objetivo: id }));
    setStep('consumer-flow');
    trackEvent('wizard_step', { step: 'empresas_objetivo', id });
  };

  // After b2b steps, render the same consumer wizard with b2b context
  if (step === 'consumer-flow') {
    return (
      <StarterKitWizard
        b2bContext={b2bState}
        onB2BComplete={() => setStep('ambientes')}
      />
    );
  }

  return (
    <section className="min-h-[calc(100vh-5rem)] bg-offwhite py-10">
      <div className="container-page max-w-xl mx-auto">
        {/* Progress */}
        <div className="mb-8 flex items-center gap-3">
          {stepIndex > 0 && (
            <button
              onClick={goBack}
              className="text-sm text-ink/50 hover:text-ink transition-colors shrink-0"
            >
              ← Voltar
            </button>
          )}
          <div className="flex-1 flex gap-1.5">
            {B2B_STEPS.map((s, i) => (
              <div
                key={s}
                className={`h-1 flex-1 rounded-full transition-all duration-500 ${
                  i <= stepIndex ? 'bg-rust' : 'bg-sand'
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-ink/40 shrink-0">
            {stepIndex + 1} / {B2B_STEPS.length}
          </span>
        </div>

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
                Vamos personalizar a proposta com base no que mais importa para o seu negócio.
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
        </AnimatePresence>
      </div>
    </section>
  );
}
