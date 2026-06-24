'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { moodOptions, roomOptions, getRecommendedScents } from '@/lib/recommendations';
import { scents, diffuserModels, type DiffuserModelId } from '@/lib/products';
import { trackEvent } from '@/lib/analytics';
import { submitLead } from '@/lib/leads';

type Step = 'room' | 'mood' | 'sound' | 'summary';

interface WizardState {
  roomId: string | null;
  moodId: string | null;
  selectedScentIds: string[];
  wantsSound: boolean | null;
  diffuserModelId: DiffuserModelId;
}

const ANNUAL_PRICE: Record<DiffuserModelId, number> = { round: 98, tower: 149 };

function LeadModal({ plan, onClose }: { plan: string; onClose: () => void }) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await submitLead('leads_b2c', { nome: name, email, plano: plan, origem: 'starter-kit-wizard' });
    trackEvent('lead_captured', { plan, origem: 'starter-kit-wizard' });
    setSubmitted(true);
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl"
      >
        {submitted ? (
          <div className="text-center py-4">
            <div className="text-5xl mb-4">🎉</div>
            <h3 className="font-serif text-2xl text-ink mb-2">Kit reservado!</h3>
            <p className="text-ink/60 text-sm mb-6">
              Entraremos em contato em breve com as instruções para finalizar seu pedido.
            </p>
            <button
              onClick={onClose}
              className="bg-rust hover:bg-rustDark text-white rounded-xl px-8 py-3 font-medium transition-colors duration-300"
            >
              Fechar
            </button>
          </div>
        ) : (
          <>
            <h3 className="font-serif text-2xl text-ink mb-1">Quase lá!</h3>
            <p className="text-ink/60 text-sm mb-6">
              Informe seus dados para reservar seu kit no plano{' '}
              <strong className="text-ink">{plan}</strong>.
            </p>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Seu nome"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="border border-sand rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-rust transition-colors"
              />
              <input
                type="email"
                placeholder="Seu melhor e-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="border border-sand rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-rust transition-colors"
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-rust hover:bg-rustDark disabled:opacity-60 text-white rounded-xl py-3.5 font-medium transition-colors duration-300"
              >
                {loading ? 'Reservando...' : 'Reservar meu kit'}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="text-xs text-ink/40 hover:text-ink/60 text-center transition-colors"
              >
                Cancelar
              </button>
            </form>
          </>
        )}
      </motion.div>
    </div>
  );
}

const STEPS: Step[] = ['room', 'mood', 'sound', 'summary'];

export default function StarterKitWizard() {
  const [step, setStep] = useState<Step>('room');
  const [state, setState] = useState<WizardState>({
    roomId: null,
    moodId: null,
    selectedScentIds: [],
    wantsSound: null,
    diffuserModelId: 'round',
  });
  const [modalPlan, setModalPlan] = useState<string | null>(null);

  const stepIndex = STEPS.indexOf(step);
  const recommendedScents = state.moodId ? getRecommendedScents(state.moodId) : [];
  const selectedDiffuser = diffuserModels.find((d) => d.id === state.diffuserModelId)!;
  const annualPrice = ANNUAL_PRICE[state.diffuserModelId];

  const handleRoom = (roomId: string) => {
    const room = roomOptions.find((r) => r.id === roomId)!;
    setState((s) => ({ ...s, roomId, diffuserModelId: room.diffuserModel }));
    setStep('mood');
    trackEvent('wizard_step', { step: 'room', roomId });
  };

  const handleMood = (moodId: string) => {
    const moodScents = getRecommendedScents(moodId);
    const preSelected = moodScents.slice(0, 2).map((s) => s.id);
    setState((s) => ({ ...s, moodId, selectedScentIds: preSelected }));
    setStep('sound');
    trackEvent('wizard_step', { step: 'mood', moodId });
  };

  const toggleScent = (scentId: string) => {
    setState((s) => {
      const has = s.selectedScentIds.includes(scentId);
      if (has && s.selectedScentIds.length <= 1) return s;
      if (!has && s.selectedScentIds.length >= 2) {
        return { ...s, selectedScentIds: [s.selectedScentIds[0], scentId] };
      }
      return {
        ...s,
        selectedScentIds: has
          ? s.selectedScentIds.filter((id) => id !== scentId)
          : [...s.selectedScentIds, scentId],
      };
    });
  };

  const handleSound = (wantsSound: boolean) => {
    setState((s) => ({
      ...s,
      wantsSound,
      diffuserModelId: wantsSound ? 'tower' : s.diffuserModelId,
    }));
    setStep('summary');
    trackEvent('wizard_step', { step: 'sound', wantsSound });
  };

  const goBack = () => {
    const prev = STEPS[stepIndex - 1];
    if (prev) setStep(prev);
  };

  const kitDescription = [
    selectedDiffuser?.name,
    ...state.selectedScentIds.map((id) => scents.find((s) => s.id === id)?.name).filter(Boolean),
  ]
    .filter(Boolean)
    .join(' + ');

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-offwhite">
      {/* Progress */}
      <div className="sticky top-20 z-40 bg-offwhite/95 backdrop-blur border-b border-sand/40">
        <div className="container-page py-3 flex items-center gap-4 max-w-2xl mx-auto">
          {stepIndex > 0 && (
            <button
              onClick={goBack}
              className="text-sm text-ink/50 hover:text-ink transition-colors shrink-0"
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
          <span className="text-xs text-ink/40 shrink-0">
            {stepIndex + 1} / {STEPS.length}
          </span>
        </div>
      </div>

      <div className="container-page py-10 max-w-2xl mx-auto">
        <AnimatePresence mode="wait">
          {/* ROOM */}
          {step === 'room' && (
            <motion.div
              key="room"
              initial={{ opacity: 0, x: 32 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -32 }}
              transition={{ duration: 0.3 }}
            >
              <h1 className="font-serif text-3xl md:text-4xl text-ink mb-2">
                Onde seu Sinesia vai ficar?
              </h1>
              <p className="text-ink/50 text-sm mb-8">
                Escolha o ambiente principal — vamos indicar o modelo ideal.
              </p>
              <div className="flex flex-col gap-3">
                {roomOptions.map((room) => (
                  <button
                    key={room.id}
                    onClick={() => handleRoom(room.id)}
                    className="flex items-center justify-between w-full rounded-2xl border border-sand bg-white hover:border-rust hover:shadow-sm p-5 text-left transition-all duration-200 group"
                  >
                    <div>
                      <p className="font-medium text-ink">{room.label}</p>
                      <p className="text-xs text-ink/40 mt-0.5">{room.sublabel}</p>
                    </div>
                    <span className="text-ink/20 group-hover:text-rust transition-colors text-lg">
                      →
                    </span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* MOOD */}
          {step === 'mood' && (
            <motion.div
              key="mood"
              initial={{ opacity: 0, x: 32 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -32 }}
              transition={{ duration: 0.3 }}
            >
              <h1 className="font-serif text-3xl md:text-4xl text-ink mb-2">
                Que sensação você quer criar?
              </h1>
              <p className="text-ink/50 text-sm mb-8">
                Escolha um estado de espírito para o ambiente.
              </p>
              <div className="grid grid-cols-2 gap-3">
                {moodOptions.map((mood) => (
                  <button
                    key={mood.id}
                    onClick={() => handleMood(mood.id)}
                    className="flex items-center gap-3 rounded-2xl border border-sand bg-white hover:border-rust hover:shadow-sm p-4 text-left transition-all duration-200"
                  >
                    <span className="text-2xl leading-none">{mood.emoji}</span>
                    <span className="text-sm font-medium text-ink leading-tight">{mood.label}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* SOUND */}
          {step === 'sound' && (
            <motion.div
              key="sound"
              initial={{ opacity: 0, x: 32 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -32 }}
              transition={{ duration: 0.3 }}
            >
              {recommendedScents.length > 0 && (
                <div className="mb-10">
                  <p className="text-xs uppercase tracking-widest text-rust mb-4">
                    Fragrâncias recomendadas para você
                  </p>
                  <div className="grid grid-cols-3 gap-3">
                    {recommendedScents.map((scent) => {
                      const isSelected = state.selectedScentIds.includes(scent.id);
                      return (
                        <button
                          key={scent.id}
                          onClick={() => toggleScent(scent.id)}
                          className={`rounded-2xl p-3 text-left border-2 transition-all duration-200 ${
                            isSelected
                              ? 'border-rust bg-rust/5 shadow-sm'
                              : 'border-sand bg-white hover:border-rust/40'
                          }`}
                        >
                          <div
                            className="h-10 w-10 rounded-full mb-2 flex items-center justify-center text-white text-sm font-medium"
                            style={{ backgroundColor: scent.cardColor }}
                          >
                            {isSelected ? '✓' : ''}
                          </div>
                          <p className="text-xs font-medium text-ink leading-tight">{scent.name}</p>
                          <p className="text-xs text-ink/40 mt-0.5">{scent.family}</p>
                        </button>
                      );
                    })}
                  </div>
                  <p className="text-xs text-ink/40 mt-2">
                    {state.selectedScentIds.length === 2
                      ? 'As 2 primeiras estão selecionadas — toque para trocar.'
                      : 'Selecione até 2 fragrâncias.'}
                  </p>
                </div>
              )}

              <h2 className="font-serif text-2xl md:text-3xl text-ink mb-2">
                Quer som sincronizado com o aroma?
              </h2>
              <p className="text-ink/50 text-sm mb-6">
                O Sinesia Tower toca músicas que amplificam a sensação da sua fragrância escolhida.
              </p>

              <div className="flex flex-col gap-4">
                <button
                  onClick={() => handleSound(true)}
                  className="rounded-2xl border-2 border-sand bg-white hover:border-rust hover:shadow-sm p-5 text-left transition-all duration-200 group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-serif text-lg text-ink">Sim, quero o Sinesia Tower</p>
                    <span className="text-xs bg-rust text-white rounded-full px-3 py-1 shrink-0 ml-2">
                      Completo
                    </span>
                  </div>
                  <p className="text-sm text-ink/50">
                    Aroma + som sincrônico — cobre até 60 m². R$499 ou incluso no plano anual.
                  </p>
                </button>

                <button
                  onClick={() => handleSound(false)}
                  className="rounded-2xl border-2 border-sand bg-white hover:border-rust hover:shadow-sm p-5 text-left transition-all duration-200"
                >
                  <p className="font-serif text-lg text-ink mb-2">Não, só aroma por enquanto</p>
                  <p className="text-sm text-ink/50">
                    Sinesia Home compacto e silencioso — cobre até 30 m². R$299 ou incluso no plano.
                  </p>
                </button>
              </div>
            </motion.div>
          )}

          {/* SUMMARY */}
          {step === 'summary' && (
            <motion.div
              key="summary"
              initial={{ opacity: 0, x: 32 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -32 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-center mb-8">
                <span className="inline-block rounded-full bg-rust/10 text-rust px-4 py-1.5 text-xs uppercase tracking-widest mb-4">
                  Seu kit está pronto
                </span>
                <h1 className="font-serif text-3xl md:text-4xl text-ink mb-2">
                  Escolha como levar
                </h1>
                <p className="text-ink/50 text-sm">{kitDescription}</p>
              </div>

              <div className="flex flex-col gap-4">
                {/* Card 1: Annual — most popular */}
                <div className="rounded-3xl bg-ink text-white p-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 bg-rust text-white text-xs px-4 py-2 rounded-bl-2xl font-medium">
                    Mais popular
                  </div>
                  <p className="text-white/50 text-xs uppercase tracking-widest mb-2">
                    Plano anual
                  </p>
                  <h3 className="font-serif text-2xl mb-1">Difusor de graça</h3>
                  <p className="text-white/60 text-sm mb-5">
                    Aparelho incluso + 2 fragrâncias/mês
                  </p>
                  <div className="flex items-baseline gap-1 mb-0.5">
                    <span className="font-serif text-5xl">R${annualPrice}</span>
                    <span className="text-white/50 text-sm">/mês</span>
                  </div>
                  <p className="text-white/35 text-xs mb-6">
                    Compromisso de 12 meses&nbsp;&nbsp;•&nbsp;&nbsp;Cancele depois
                  </p>
                  <ul className="text-sm text-white/75 space-y-1.5 mb-6">
                    <li>✓ {selectedDiffuser.name} incluso</li>
                    <li>✓ 2 fragrâncias/mês</li>
                    <li>✓ App Sinesia completo</li>
                    <li>✓ Frete grátis nos refis</li>
                  </ul>
                  <button
                    onClick={() => {
                      trackEvent('cta_clicked', { cta: 'wizard_plan_annual', model: state.diffuserModelId });
                      setModalPlan(`Plano Anual — ${selectedDiffuser.name}`);
                    }}
                    className="w-full bg-rust hover:bg-rustDark text-white rounded-xl py-3.5 font-medium transition-colors duration-300"
                  >
                    Garantir meu kit
                  </button>
                </div>

                {/* Card 2: Flex */}
                <div className="rounded-3xl bg-white border-2 border-sand p-6">
                  <p className="text-ink/40 text-xs uppercase tracking-widest mb-2">Flexível</p>
                  <h3 className="font-serif text-2xl text-ink mb-1">Sem compromisso</h3>
                  <p className="text-ink/50 text-sm mb-5">Compre o aparelho e assine mês a mês</p>
                  <div className="flex items-baseline gap-1 mb-0.5">
                    <span className="font-serif text-4xl text-ink">
                      R${selectedDiffuser.price}
                    </span>
                    <span className="text-ink/40 text-sm">aparelho</span>
                  </div>
                  <p className="text-ink/40 text-xs mb-5">
                    + R$39,90/fragrância/mês&nbsp;&nbsp;•&nbsp;&nbsp;Cancele quando quiser
                  </p>
                  <ul className="text-sm text-ink/60 space-y-1.5 mb-6">
                    <li>✓ {selectedDiffuser.name}</li>
                    <li>✓ Fragrâncias a escolher</li>
                    <li>✓ App Sinesia completo</li>
                    <li className="text-ink/35">× Frete nos refis não incluso</li>
                  </ul>
                  <button
                    onClick={() => {
                      trackEvent('cta_clicked', { cta: 'wizard_plan_flex', model: state.diffuserModelId });
                      setModalPlan(`Plano Flex — ${selectedDiffuser.name}`);
                    }}
                    className="w-full border-2 border-rust text-rust hover:bg-rust hover:text-white rounded-xl py-3.5 font-medium transition-colors duration-300"
                  >
                    Quero este plano
                  </button>
                </div>

                {/* Card 3: One-time */}
                <div className="rounded-3xl bg-offwhite border border-sand p-6">
                  <p className="text-ink/40 text-xs uppercase tracking-widest mb-2">Compra única</p>
                  <h3 className="font-serif text-2xl text-ink mb-1">Avulso</h3>
                  <p className="text-ink/50 text-sm mb-5">Sem assinatura</p>
                  <div className="flex items-baseline gap-1 mb-0.5">
                    <span className="font-serif text-4xl text-ink">
                      R${selectedDiffuser.price}
                    </span>
                    <span className="text-ink/40 text-sm">aparelho</span>
                  </div>
                  <p className="text-ink/40 text-xs mb-5">+ R$49,90/fragrância</p>
                  <ul className="text-sm text-ink/60 space-y-1.5 mb-6">
                    <li>✓ {selectedDiffuser.name}</li>
                    <li>✓ Fragrâncias unitárias</li>
                    <li>✓ App Sinesia completo</li>
                    <li className="text-ink/35">× Sem refil automático</li>
                  </ul>
                  <button
                    onClick={() => {
                      trackEvent('cta_clicked', { cta: 'wizard_plan_avulso', model: state.diffuserModelId });
                      setModalPlan(`Compra Avulsa — ${selectedDiffuser.name}`);
                    }}
                    className="w-full border border-sand text-ink/60 hover:border-rust hover:text-rust rounded-xl py-3.5 font-medium transition-colors duration-300"
                  >
                    Comprar avulso
                  </button>
                </div>
              </div>

              <button
                onClick={() => {
                  setState({
                    roomId: null,
                    moodId: null,
                    selectedScentIds: [],
                    wantsSound: null,
                    diffuserModelId: 'round',
                  });
                  setStep('room');
                }}
                className="w-full text-center text-xs text-ink/30 hover:text-ink/50 mt-8 transition-colors"
              >
                ↺ Recomeçar o quiz
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {modalPlan && <LeadModal plan={modalPlan} onClose={() => setModalPlan(null)} />}
    </div>
  );
}
