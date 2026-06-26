'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { moodOptions, roomOptions, getRecommendedScents } from '@/lib/recommendations';
import { scents, diffuserModels, type DiffuserModelId } from '@/lib/products';
import { trackEvent } from '@/lib/analytics';
import { submitLead } from '@/lib/leads';

type Step = 'room' | 'mood' | 'scents' | 'summary';

interface WizardState {
  roomId: string | null;
  moodId: string | null;
  selectedScentIds: string[];
  diffuserModelId: DiffuserModelId;
}

export interface B2BContext {
  ambientes?: string;
  segmento?: string;
  objetivo?: string;
}

interface CartSelection {
  planLabel: string;
  planPrice: string;
  planMonthly?: string;
}

// Pricing constants
const SCENT_FULL = 49.90;
const SCENT_SUB = 39.90; // 20% off
const ANNUAL_BASE: Record<DiffuserModelId, number> = { room: 98, tower: 149, car: 99 };

function fmtBRL(val: number) {
  return val.toFixed(2).replace('.', ',');
}

// Simple SVG room illustrations
const RoomIcon = ({ roomId }: { roomId: string }) => {
  const icons: Record<string, React.ReactNode> = {
    'sala-grande': (
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-12 w-12 text-ink/40">
        <rect x="4" y="28" width="40" height="12" rx="2" />
        <path d="M8 28V22a4 4 0 014-4h24a4 4 0 014 4v6" />
        <path d="M4 34h4M40 34h4" />
        <rect x="18" y="20" width="12" height="8" />
      </svg>
    ),
    'sala-pequena': (
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-12 w-12 text-ink/40">
        <rect x="8" y="30" width="32" height="10" rx="2" />
        <path d="M12 30V26a3 3 0 013-3h18a3 3 0 013 3v4" />
        <path d="M8 36h4M36 36h4" />
      </svg>
    ),
    quarto: (
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-12 w-12 text-ink/40">
        <rect x="4" y="28" width="40" height="12" rx="2" />
        <path d="M4 34V22a2 2 0 012-2h36a2 2 0 012 2v12" />
        <path d="M4 28h40" />
        <rect x="14" y="22" width="8" height="6" rx="1" />
        <rect x="26" y="22" width="8" height="6" rx="1" />
        <circle cx="12" cy="18" r="3" />
        <circle cx="36" cy="18" r="3" />
      </svg>
    ),
    banheiro: (
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-12 w-12 text-ink/40">
        <path d="M10 32a6 6 0 0112 0v4H10v-4Z" />
        <rect x="10" y="36" width="12" height="4" rx="1" />
        <path d="M28 14v18" />
        <path d="M24 14h8v4l-2 1" />
        <path d="M28 20c2 0 4 1 4 4" strokeLinecap="round" />
        <path d="M32 24h4" strokeLinecap="round" />
      </svg>
    ),
    carro: (
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-12 w-12 text-ink/40">
        <path d="M8 28h32l-4-10H12L8 28Z" />
        <rect x="4" y="28" width="40" height="8" rx="2" />
        <circle cx="14" cy="38" r="4" />
        <circle cx="34" cy="38" r="4" />
        <path d="M14 22h20" strokeLinecap="round" />
      </svg>
    ),
  };
  return <>{icons[roomId] ?? null}</>;
};

// Pre-launch modal
function PreLaunchModal({
  cartSelection,
  diffuserName,
  scentNames,
  b2bContext,
  onClose,
}: {
  cartSelection: CartSelection;
  diffuserName: string;
  scentNames: string[];
  b2bContext?: B2BContext;
  onClose: () => void;
}) {
  const [email, setEmail] = useState('');
  const [nome, setNome] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await submitLead('leads_b2c', {
      nome,
      email,
      plano: cartSelection.planLabel,
      difusor: diffuserName,
      fragrancias: scentNames.join(', '),
      origem: b2bContext ? 'empresas-wizard' : 'starter-kit-wizard',
      ...b2bContext,
    });
    trackEvent('lead_captured', {
      plano: cartSelection.planLabel,
      origem: b2bContext ? 'empresas-wizard' : 'starter-kit-wizard',
    });
    setSubmitted(true);
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/70 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl"
      >
        {submitted ? (
          <div className="text-center py-4">
            <div className="text-5xl mb-4">🎉</div>
            <h3 className="font-serif text-2xl text-ink mb-3">Você está na lista!</h3>
            <p className="text-ink/60 text-sm leading-relaxed mb-6">
              Quando começarmos a operação, você será um dos primeiros a saber — com{' '}
              <strong className="text-rust">30% de desconto</strong> garantido no seu kit.
            </p>
            <button
              onClick={onClose}
              className="bg-rust hover:bg-rustDark text-white rounded-xl px-8 py-3 font-medium transition-colors duration-300 text-sm"
            >
              Entendido!
            </button>
          </div>
        ) : (
          <>
            <div className="inline-block bg-rust/10 text-rust text-xs uppercase tracking-widest rounded-full px-3 py-1 mb-4">
              Pré-lançamento
            </div>
            <h3 className="font-serif text-2xl text-ink mb-2">Nada será cobrado agora.</h3>
            <p className="text-ink/60 text-sm leading-relaxed mb-5">
              Estamos em fase de pré-lançamento. Deixe seu e-mail e avisaremos assim que abrirmos —
              com <strong className="text-ink">30% de desconto</strong> garantido no seu kit.
            </p>
            <div className="bg-sand/30 rounded-xl p-4 mb-5 text-sm">
              <p className="text-ink/40 text-xs uppercase tracking-wider mb-2">Seu kit reservado</p>
              <p className="text-ink font-medium">{cartSelection.planLabel}</p>
              <p className="text-ink/60 text-xs">{diffuserName} + {scentNames.join(' + ')}</p>
              <p className="text-rust font-serif text-xl mt-1">{cartSelection.planPrice}</p>
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <input
                type="text"
                placeholder="Seu nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
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
                className="bg-rust hover:bg-rustDark disabled:opacity-60 text-white rounded-xl py-3.5 font-medium transition-colors duration-300 text-sm"
              >
                {loading ? 'Salvando...' : 'Garantir meu desconto de 30%'}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="text-xs text-ink/35 hover:text-ink/55 text-center transition-colors py-1"
              >
                Fechar
              </button>
            </form>
          </>
        )}
      </motion.div>
    </div>
  );
}

// Cart modal
function CartModal({
  diffuserName,
  scentNames,
  planLabel,
  planPrice,
  planMonthly,
  onCheckout,
  onClose,
}: {
  diffuserName: string;
  scentNames: string[];
  planLabel: string;
  planPrice: string;
  planMonthly?: string;
  onCheckout: () => void;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-ink/60 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 40 }}
        className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-serif text-xl text-ink">Seu carrinho</h3>
          <button
            onClick={onClose}
            className="text-ink/30 hover:text-ink/60 text-2xl transition-colors leading-none"
            aria-label="Fechar"
          >
            ×
          </button>
        </div>
        <div className="border border-sand rounded-2xl p-4 mb-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-ink">{diffuserName}</span>
          </div>
          <div className="flex flex-wrap gap-2 mb-4">
            {scentNames.map((name) => (
              <span key={name} className="text-xs bg-sand/50 text-ink/70 rounded-full px-3 py-1">
                {name}
              </span>
            ))}
          </div>
          <div className="border-t border-sand pt-3">
            <p className="text-xs text-ink/40 uppercase tracking-wider mb-1">{planLabel}</p>
            <p className="font-serif text-2xl text-rust">{planPrice}</p>
            {planMonthly && (
              <p className="text-xs text-ink/40 mt-0.5">{planMonthly}</p>
            )}
          </div>
        </div>
        <button
          onClick={onCheckout}
          className="w-full bg-rust hover:bg-rustDark text-white rounded-xl py-4 font-medium transition-colors duration-300 text-sm"
        >
          Fazer pagamento
        </button>
        <button
          onClick={onClose}
          className="w-full text-xs text-ink/35 hover:text-ink/55 mt-3 py-1 transition-colors"
        >
          Continuar escolhendo
        </button>
      </motion.div>
    </div>
  );
}

// Scent detail panel
function ScentDetail({ scentId, onClose }: { scentId: string; onClose: () => void }) {
  const scent = scents.find((s) => s.id === scentId);
  if (!scent) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-ink/60 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 30 }}
        className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl"
      >
        <div className="flex items-center justify-between mb-4">
          <div
            className="h-10 w-10 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: scent.cardColor }}
          >
            {scent.image && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={scent.image} alt={scent.name} className="w-full h-full object-contain p-1" />
            )}
          </div>
          <button
            onClick={onClose}
            className="text-ink/30 hover:text-ink/60 text-2xl leading-none transition-colors"
          >
            ×
          </button>
        </div>
        <h3 className="font-serif text-xl text-ink mb-0.5">{scent.name}</h3>
        <p className="text-xs text-ink/40 mb-3">{scent.family}</p>
        <p className="text-xs text-rust/80 uppercase tracking-widest font-semibold mb-2">
          Benefícios de aromaterapia
        </p>
        <p className="text-sm text-ink/70 leading-relaxed mb-3">{scent.aromatherapy}</p>
        <p className="text-xs text-ink/35 italic">Notas: {scent.notes}</p>
      </motion.div>
    </div>
  );
}

const STEPS: Step[] = ['room', 'mood', 'scents', 'summary'];
const B2B_STEPS: Step[] = ['scents', 'summary'];

interface StarterKitWizardProps {
  b2bContext?: B2BContext;
  b2bQty?: number;
  b2bRecommendedScentIds?: string[];
  onB2BComplete?: () => void;
}

export default function StarterKitWizard({ b2bContext, b2bQty = 1, b2bRecommendedScentIds = [], onB2BComplete }: StarterKitWizardProps) {
  const isB2B = Boolean(b2bContext);
  const initialScents = isB2B ? b2bRecommendedScentIds.slice(0, 2) : [];
  const [step, setStep] = useState<Step>(isB2B ? 'scents' : 'room');
  const [state, setState] = useState<WizardState>({
    roomId: null,
    moodId: null,
    selectedScentIds: initialScents,
    diffuserModelId: 'room',
  });
  const [cart, setCart] = useState<CartSelection | null>(null);
  const [showPreLaunch, setShowPreLaunch] = useState(false);
  const [detailScentId, setDetailScentId] = useState<string | null>(null);

  const activeSteps = isB2B ? B2B_STEPS : STEPS;
  const stepIndex = activeSteps.indexOf(step);
  const recommendedScents = isB2B
    ? scents.filter((s) => b2bRecommendedScentIds.includes(s.id))
    : state.moodId ? getRecommendedScents(state.moodId) : [];
  const selectedDiffuser = diffuserModels.find((d) => d.id === state.diffuserModelId)!;
  const annualBase = ANNUAL_BASE[state.diffuserModelId];
  const annualTotal = annualBase * b2bQty;
  const deviceTotal = selectedDiffuser.price * b2bQty;
  // B2B: each diffuser uses 2 scent types, total bottles = qty × 2 per scent type
  const numScentBottles = isB2B
    ? state.selectedScentIds.length * b2bQty  // e.g. 2 scents × 3 ambientes = 6 bottles
    : (state.selectedScentIds.length || 2);

  const scentSubTotal = numScentBottles * SCENT_SUB;
  const scentFullTotal = numScentBottles * SCENT_FULL;

  const selectedScentNames = state.selectedScentIds
    .map((id) => scents.find((s) => s.id === id)?.name)
    .filter(Boolean) as string[];

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
    setStep('scents');
    trackEvent('wizard_step', { step: 'mood', moodId });
  };

  const maxScents = state.diffuserModelId === 'tower' ? 3 : state.diffuserModelId === 'car' ? 1 : 2;

  const toggleScent = (scentId: string) => {
    setState((s) => {
      const max = s.diffuserModelId === 'tower' ? 3 : s.diffuserModelId === 'car' ? 1 : 2;
      const has = s.selectedScentIds.includes(scentId);
      if (has && s.selectedScentIds.length <= 1) return s;
      if (!has && s.selectedScentIds.length >= max) {
        return { ...s, selectedScentIds: [...s.selectedScentIds.slice(0, max - 1), scentId] };
      }
      return {
        ...s,
        selectedScentIds: has
          ? s.selectedScentIds.filter((id) => id !== scentId)
          : [...s.selectedScentIds, scentId],
      };
    });
  };

  const goBack = () => {
    const prev = activeSteps[stepIndex - 1];
    if (prev) setStep(prev);
    else if (isB2B && onB2BComplete) onB2BComplete();
  };

  const openCart = (planLabel: string, planPrice: string, planMonthly?: string) => {
    setCart({ planLabel, planPrice, planMonthly });
    trackEvent('cta_clicked', { cta: 'wizard_add_to_cart', plan: planLabel });
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-offwhite">
      {/* Progress bar */}
      <div className="sticky top-20 z-40 bg-offwhite/95 backdrop-blur border-b border-sand/40">
        <div className="container-page py-3 flex items-center gap-4 max-w-5xl mx-auto">
          {stepIndex > 0 && (
            <button
              onClick={goBack}
              className="text-sm text-ink/50 hover:text-ink transition-colors shrink-0"
            >
              ← Voltar
            </button>
          )}
          <div className="flex-1 flex gap-1.5">
            {activeSteps.map((s, i) => (
              <div
                key={s}
                className={`h-1 flex-1 rounded-full transition-all duration-500 ${
                  i <= stepIndex ? 'bg-rust' : 'bg-sand'
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-ink/40 shrink-0">
            {stepIndex + 1} / {activeSteps.length}
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
                    className="flex items-center gap-4 w-full rounded-2xl border border-sand bg-white hover:border-rust hover:shadow-sm p-4 text-left transition-all duration-200 group"
                  >
                    <div className="flex items-center justify-center w-16 h-16 rounded-xl bg-sand/30 shrink-0 group-hover:bg-rust/5 transition-colors">
                      <RoomIcon roomId={room.id} />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-ink">{room.label}</p>
                      <p className="text-xs text-ink/40 mt-0.5">{room.sublabel}</p>
                    </div>
                    <span className="text-ink/20 group-hover:text-rust transition-colors text-lg shrink-0">→</span>
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
                    className="rounded-2xl border border-sand bg-white hover:border-rust hover:shadow-sm p-4 text-left transition-all duration-200"
                  >
                    <span className="text-sm font-medium text-ink leading-tight">{mood.label}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* SCENTS */}
          {step === 'scents' && (
            <motion.div
              key="scents"
              initial={{ opacity: 0, x: 32 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -32 }}
              transition={{ duration: 0.3 }}
            >
              <h1 className="font-serif text-3xl md:text-4xl text-ink mb-2">
                Fragrâncias recomendadas para você
              </h1>
              <p className="text-ink/50 text-sm mb-8">
                As 2 primeiras já estão selecionadas. Toque para trocar. Use &ldquo;detalhes&rdquo; para saber mais sobre cada essência.
              </p>

              <div className="flex flex-col gap-3 mb-8">
                {recommendedScents.map((scent) => {
                  const isSelected = state.selectedScentIds.includes(scent.id);
                  return (
                    <div
                      key={scent.id}
                      className={`flex items-center gap-4 rounded-2xl border-2 p-4 transition-all duration-200 ${
                        isSelected ? 'border-ink bg-ink/[0.02]' : 'border-sand bg-white'
                      }`}
                    >
                      {/* Scent image or color swatch */}
                      <button
                        onClick={() => toggleScent(scent.id)}
                        className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 flex items-center justify-center"
                        style={{ backgroundColor: scent.cardColor }}
                        aria-label={`Selecionar ${scent.name}`}
                      >
                        {scent.image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={scent.image}
                            alt={scent.name}
                            className="absolute inset-0 w-full h-full object-contain p-1"
                          />
                        ) : (
                          <svg viewBox="0 0 40 40" className="h-8 w-8 text-white/20" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <rect x="2" y="2" width="36" height="36" rx="4" />
                            <path d="M8 8l24 24M32 8L8 32" />
                          </svg>
                        )}
                      </button>

                      <button
                        onClick={() => toggleScent(scent.id)}
                        className="flex-1 min-w-0 text-left"
                        aria-label={`Selecionar ${scent.name}`}
                      >
                        <p className="font-medium text-ink">{scent.name}</p>
                        <p className="text-xs text-ink/50 mt-0.5">{scent.family}</p>
                        <p className="text-xs text-ink/40 mt-0.5 truncate">{scent.mood}</p>
                      </button>

                      {/* Details button */}
                      <button
                        onClick={() => setDetailScentId(scent.id)}
                        className="text-xs text-rust/70 hover:text-rust border border-rust/30 hover:border-rust rounded-full px-2.5 py-1 transition-colors shrink-0"
                      >
                        detalhes
                      </button>

                      {/* Black checkmark */}
                      <button
                        onClick={() => toggleScent(scent.id)}
                        className={`shrink-0 h-6 w-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                          isSelected ? 'bg-ink border-ink' : 'border-sand hover:border-ink/30'
                        }`}
                        aria-label={isSelected ? 'Remover' : 'Selecionar'}
                      >
                        {isSelected && (
                          <svg viewBox="0 0 12 12" fill="none" className="h-3 w-3">
                            <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>

              <p className="text-xs text-ink/40 mb-6 text-center">
                {state.selectedScentIds.length} de {maxScents} fragrâncias selecionadas
              </p>

              <button
                onClick={() => {
                  setStep('summary');
                  trackEvent('wizard_step', { step: 'scents', scents: state.selectedScentIds });
                }}
                disabled={state.selectedScentIds.length === 0}
                className="w-full bg-rust hover:bg-rustDark disabled:opacity-40 text-white rounded-xl py-4 font-medium transition-colors duration-300 text-sm"
              >
                Próximo →
              </button>
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
              className="max-w-5xl mx-auto"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                {/* LEFT: Cart */}
                <div className="rounded-3xl bg-white border border-sand p-6">
                  <h2 className="font-serif text-2xl md:text-3xl text-ink mb-3">
                    Sua combinação está pronta</h2>
                  <p className="text-ink/50 text-sm mb-4">
                    {isB2B && b2bQty > 1 ? `${b2bQty} ambientes · ${state.selectedScentIds.length * b2bQty} frascos` : 'Seu kit personalizado'}
                  </p>

                  {/* Diffuser */}
                  <div className="flex items-center gap-3 mb-3 p-3 rounded-2xl bg-sand/20">
                    <div className="w-12 h-12 rounded-xl bg-white overflow-hidden shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={`/images/sinesia-${selectedDiffuser.id}.jpg`}
                        alt={selectedDiffuser.name}
                        className="w-full h-full object-cover"
                        onError={(e) => { (e.currentTarget as HTMLImageElement).src = ''; }}
                      />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm text-ink">
                        {b2bQty > 1 ? `${b2bQty}× ` : ''}{selectedDiffuser.name}
                      </p>
                      <p className="text-xs text-ink/50">{selectedDiffuser.subtitle}</p>
                    </div>
                    <p className="ml-auto font-serif text-sm text-rust shrink-0">
                      R${fmtBRL(selectedDiffuser.price * b2bQty)}
                    </p>
                  </div>

                  {/* Scents */}
                  <div className="flex flex-col gap-2">
                    {state.selectedScentIds.map((id) => {
                      const scent = scents.find((s) => s.id === id);
                      if (!scent) return null;
                      const bottleQty = isB2B ? b2bQty : 1;
                      return (
                        <div key={id} className="flex items-center gap-3 p-3 rounded-xl bg-sand/10">
                          <div
                            className="w-9 h-9 rounded-lg shrink-0 relative overflow-hidden"
                            style={{ backgroundColor: scent.cardColor }}
                          >
                            {scent.image && (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={scent.image} alt={scent.name} className="absolute inset-0 w-full h-full object-contain p-0.5" />
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-ink">
                              {bottleQty > 1 ? `${bottleQty}× ` : ''}{scent.name}
                            </p>
                            <p className="text-xs text-ink/40">{scent.family}</p>
                          </div>
                          <p className="ml-auto text-xs text-ink/40 shrink-0">R${fmtBRL(49.90 * bottleQty)}</p>
                        </div>
                      );
                    })}
                  </div>

                  {state.selectedScentIds.length > 0 && (
                    <p className="text-xs text-rust mt-3 text-right">
                      Assinantes recebem 20% off nas essências
                    </p>
                  )}
                </div>

                {/* RIGHT: Plan cards */}
                <div className="flex flex-col gap-3">
                  <h2 className="font-serif text-2xl md:text-3xl text-ink mb-1">Escolha seu plano</h2>

                  {/* 1. Promoção — device free with 12-month commitment */}
                  <div className="rounded-2xl bg-ink text-white p-5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 bg-rust text-white text-[10px] px-3 py-1.5 rounded-bl-xl font-medium uppercase tracking-wide">
                      Promoção
                    </div>
                    <p className="text-white/50 text-xs uppercase tracking-widest mb-1">Compromisso de 12 meses</p>
                    <h3 className="font-serif text-xl mb-0.5">Difusor de graça</h3>
                    <p className="text-white/45 text-xs mb-3">
                      Aparelho incluso + 20% off nas essências todo mês
                    </p>
                    <div className="flex items-baseline gap-1 mb-0.5">
                      <span className="font-serif text-3xl">R${fmtBRL(annualTotal)}</span>
                      <span className="text-white/40 text-xs">/mês</span>
                    </div>
                    <p className="text-white/35 text-xs mb-4">
                      Difusor incluso sem custo extra · Renova automaticamente
                    </p>
                    <ul className="text-xs text-white/65 space-y-1.5 mb-4">
                      <li>✓ {b2bQty > 1 ? `${b2bQty}× ` : ''}{selectedDiffuser.name} <strong>incluso sem custo</strong></li>
                      <li>✓ {numScentBottles} frasco{numScentBottles > 1 ? 's' : ''}/mês com <strong>20% de desconto</strong></li>
                      <li>✓ Frete grátis nos refis</li>
                      <li>✓ Garantia vitalícia do aparelho</li>
                      <li>✓ Troque fragrâncias a qualquer mês</li>
                    </ul>
                    <button
                      onClick={() =>
                        openCart(
                          'Promoção — Difusor de Graça',
                          `R$${fmtBRL(annualTotal)}/mês`,
                          `Compromisso de 12 meses · difusor incluso`
                        )
                      }
                      className="w-full bg-rust hover:bg-rustDark text-white rounded-xl py-2.5 text-sm font-medium transition-colors duration-300"
                    >
                      Quero essa promoção
                    </button>
                  </div>

                  {/* 2. Mais popular — Subscribe & save */}
                  <div className="rounded-2xl bg-white border-2 border-ink p-5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 bg-ink text-white text-[10px] px-3 py-1.5 rounded-bl-xl font-medium uppercase tracking-wide">
                      Mais popular
                    </div>
                    <p className="text-ink/40 text-xs uppercase tracking-widest mb-1">Assinatura mensal</p>
                    <h3 className="font-serif text-xl text-ink mb-0.5">Assine e economize</h3>
                    <p className="text-ink/50 text-xs mb-3">20% off nas essências · cancele quando quiser</p>
                    <div className="flex items-baseline gap-1 mb-0.5 mt-2">
                      <span className="font-serif text-2xl text-ink">R${fmtBRL(deviceTotal)}</span>
                      <span className="text-ink/40 text-xs">difusor · 1× pagamento único</span>
                    </div>
                    <div className="flex items-baseline gap-1 mb-4">
                      <span className="font-serif text-xl text-ink">R${fmtBRL(scentSubTotal)}</span>
                      <span className="text-ink/40 text-xs">/mês em essências ({numScentBottles}× com 20% off)</span>
                    </div>
                    <ul className="text-xs text-ink/60 space-y-1.5 mb-4">
                      <li>✓ Difusor pago uma única vez</li>
                      <li>✓ Essências com <strong>20% de desconto</strong> todo mês</li>
                      <li>✓ Troque as fragrâncias a cada pedido</li>
                      <li>✓ Frete grátis em 2+ frascos por pedido</li>
                      <li>✓ Cancele quando quiser, sem taxa</li>
                    </ul>
                    <button
                      onClick={() =>
                        openCart(
                          'Assine e Economize',
                          `R$${fmtBRL(deviceTotal)} + R$${fmtBRL(scentSubTotal)}/mês`,
                          `Difusor: pagamento único · Essências: 20% off/mês`
                        )
                      }
                      className="w-full bg-ink hover:bg-ink/85 text-white rounded-xl py-2.5 text-sm font-medium transition-colors duration-300"
                    >
                      Assinar agora
                    </button>
                  </div>

                  {/* 3. Compra única — sem compromisso */}
                  <div className="rounded-2xl bg-offwhite border border-sand p-5">
                    <p className="text-ink/40 text-xs uppercase tracking-widest mb-1">Compra única</p>
                    <h3 className="font-serif text-xl text-ink mb-0.5">Sem compromisso</h3>
                    <p className="text-ink/50 text-xs mb-3">Pague uma vez, sem assinatura</p>
                    <div className="flex items-baseline gap-1 mb-0.5 mt-2">
                      <span className="font-serif text-2xl text-ink">R${fmtBRL(deviceTotal)}</span>
                      <span className="text-ink/40 text-xs">difusor · pagamento único</span>
                    </div>
                    <div className="flex items-baseline gap-1 mb-4">
                      <span className="font-serif text-xl text-ink">R${fmtBRL(scentFullTotal)}</span>
                      <span className="text-ink/40 text-xs">essências ({numScentBottles}× R$49,90 · preço cheio)</span>
                    </div>
                    <ul className="text-xs text-ink/55 space-y-1.5 mb-4">
                      <li>✓ Sem assinatura, sem compromisso</li>
                      <li>✓ Reabastece quando quiser</li>
                      <li>✗ Sem desconto nas essências</li>
                    </ul>
                    <button
                      onClick={() =>
                        openCart(
                          'Compra Única — Sem Compromisso',
                          `R$${fmtBRL(deviceTotal + scentFullTotal)}`,
                          'Difusor + essências · preço cheio · sem assinatura'
                        )
                      }
                      className="w-full border border-sand text-ink/60 hover:border-rust hover:text-rust rounded-xl py-2.5 text-sm font-medium transition-colors duration-300"
                    >
                      Comprar avulso
                    </button>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  setState({ roomId: null, moodId: null, selectedScentIds: [], diffuserModelId: 'room' });
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

      {/* Cart modal */}
      <AnimatePresence>
        {cart && !showPreLaunch && (
          <CartModal
            diffuserName={b2bQty > 1 ? `${b2bQty}× ${selectedDiffuser.name}` : selectedDiffuser.name}
            scentNames={selectedScentNames}
            planLabel={cart.planLabel}
            planPrice={cart.planPrice}
            planMonthly={cart.planMonthly}
            onCheckout={() => setShowPreLaunch(true)}
            onClose={() => setCart(null)}
          />
        )}
      </AnimatePresence>

      {/* Pre-launch modal */}
      {cart && showPreLaunch && (
        <PreLaunchModal
          cartSelection={cart}
          diffuserName={selectedDiffuser.name}
          scentNames={selectedScentNames}
          b2bContext={b2bContext}
          onClose={() => {
            setShowPreLaunch(false);
            setCart(null);
            if (onB2BComplete) onB2BComplete();
          }}
        />
      )}

      {/* Scent detail panel */}
      <AnimatePresence>
        {detailScentId && (
          <ScentDetail scentId={detailScentId} onClose={() => setDetailScentId(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
