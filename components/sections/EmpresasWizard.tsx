'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { trackEvent } from '@/lib/analytics';
import StarterKitWizard from './StarterKitWizard';

type B2BStep = 'ambientes' | 'segmento' | 'objetivo' | 'consumer-flow';

const ambientesOptions = [
  { id: '1', label: '1 ambiente', sub: 'Recepção, sala de espera ou sala principal', qty: 1 },
  { id: '2-3', label: '2 a 3 ambientes', sub: 'Ex: recepção + salas de reunião', qty: 2 },
  { id: '4+', label: '4 ou mais ambientes', sub: 'Multi-piso ou grande estabelecimento', qty: 4 },
];

const segmentoOptions = [
  { id: 'escritorio', label: 'Escritório / Coworking', scents: ['bambu-cha-branco', 'cafe-especiarias', 'floresta-tropical'] },
  { id: 'consultorio', label: 'Consultório / Clínica', scents: ['lavanda-provence', 'bambu-cha-branco', 'flor-de-laranjeira'] },
  { id: 'salao', label: 'Salão de beleza / Estúdio', scents: ['flor-de-laranjeira', 'bambu-cha-branco', 'baunilha-ambar'] },
  { id: 'loja', label: 'Loja / Varejo', scents: ['madeira-nobre', 'bambu-cha-branco', 'baunilha-ambar'] },
  { id: 'restaurante', label: 'Restaurante / Café', scents: ['cafe-especiarias', 'baunilha-ambar', 'flor-de-laranjeira'] },
  { id: 'hotel', label: 'Hotel / Pousada / Airbnb', scents: ['madeira-nobre', 'bambu-cha-branco', 'lavanda-provence'] },
  { id: 'academia', label: 'Academia / Estúdio fitness', scents: ['floresta-tropical', 'brisa-do-mar', 'cafe-especiarias'] },
];

const objetivoOptions = [
  { id: 'impressionar', label: 'Impressionar clientes na recepção', sub: 'Primeira impressão marcante', scents: ['madeira-nobre', 'bambu-cha-branco', 'flor-de-laranjeira'] },
  { id: 'bemestar', label: 'Melhorar o bem-estar dos colaboradores', sub: 'Ambiente mais humano', scents: ['lavanda-provence', 'floresta-tropical', 'bambu-cha-branco'] },
  { id: 'foco', label: 'Aumentar o foco e a produtividade', sub: 'Equipe mais eficiente', scents: ['cafe-especiarias', 'floresta-tropical', 'brisa-do-mar'] },
  { id: 'identidade', label: 'Criar identidade olfativa da marca', sub: 'Diferencial sensorial', scents: ['bambu-cha-branco', 'madeira-nobre', 'baunilha-ambar'] },
  { id: 'estresse', label: 'Reduzir estresse no ambiente', sub: 'Clima mais leve', scents: ['lavanda-provence', 'flor-de-laranjeira', 'bambu-cha-branco'] },
  { id: 'cheiroso', label: 'Manter o ambiente sempre cheiroso', sub: 'Sem esforço, automático', scents: ['bambu-cha-branco', 'brisa-do-mar', 'flor-de-laranjeira'] },
];

// Compute recommended scents: intersection of segmento + objetivo, fallback to segmento
function getB2BRecommendedScents(segmentoId: string, objetivoId: string): string[] {
  const seg = segmentoOptions.find((s) => s.id === segmentoId);
  const obj = objetivoOptions.find((o) => o.id === objetivoId);
  if (!seg || !obj) return ['bambu-cha-branco', 'lavanda-provence', 'flor-de-laranjeira'];

  const intersection = seg.scents.filter((s) => obj.scents.includes(s));
  if (intersection.length >= 2) return intersection;

  // Not enough in intersection — merge lists keeping order, remove duplicates
  const merged = [...intersection, ...obj.scents, ...seg.scents].filter(
    (v, i, a) => a.indexOf(v) === i
  );
  return merged.slice(0, 3);
}

const B2B_STEPS: B2BStep[] = ['ambientes', 'segmento', 'objetivo'];

export default function EmpresasWizard() {
  const [step, setStep] = useState<B2BStep>('ambientes');
  const [b2bState, setB2bState] = useState({ ambientes: '', segmento: '', objetivo: '' });
  const [qty, setQty] = useState(1);
  const [recommendedScents, setRecommendedScents] = useState<string[]>([]);

  const stepIndex = B2B_STEPS.indexOf(step as Exclude<B2BStep, 'consumer-flow'>);

  const goBack = () => {
    const prev = B2B_STEPS[stepIndex - 1];
    if (prev) setStep(prev);
  };

  const handleAmbientes = (opt: typeof ambientesOptions[number]) => {
    setB2bState((s) => ({ ...s, ambientes: opt.id }));
    setQty(opt.qty);
    setStep('segmento');
    trackEvent('wizard_step', { step: 'empresas_ambientes', id: opt.id });
  };

  const handleSegmento = (id: string) => {
    setB2bState((s) => ({ ...s, segmento: id }));
    setStep('objetivo');
    trackEvent('wizard_step', { step: 'empresas_segmento', id });
  };

  const handleObjetivo = (id: string) => {
    const newState = { ...b2bState, objetivo: id };
    setB2bState(newState);
    setRecommendedScents(getB2BRecommendedScents(newState.segmento, id));
    setStep('consumer-flow');
    trackEvent('wizard_step', { step: 'empresas_objetivo', id });
  };

  if (step === 'consumer-flow') {
    return (
      <StarterKitWizard
        b2bContext={b2bState}
        b2bQty={qty}
        b2bRecommendedScentIds={recommendedScents}
        onB2BComplete={() => setStep('ambientes')}
      />
    );
  }

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-offwhite py-10">
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
                Cada ambiente recebe 1 difusor e 2 fragrâncias.
              </p>
              <div className="flex flex-col gap-3">
                {ambientesOptions.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => handleAmbientes(opt)}
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
                Vamos indicar as fragrâncias mais adequadas para o seu negócio.
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
    </div>
  );
}
