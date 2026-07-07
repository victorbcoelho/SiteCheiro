'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { moodOptions, roomOptions, getRecommendedScents } from '@/lib/recommendations';
import { scents, diffuserModels, type DiffuserModelId } from '@/lib/products';
import { trackEvent, trackClick, trackCommerceEvent, identifyUser } from '@/lib/analytics';
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
  valueNumeric: number;
}

// Pricing constants
const SCENT_FULL = 59.90;
const SCENT_SUB = 47.92; // 20% off
// Max scents per diffuser model (Tower supports 3 cartridges, others 2)
const MAX_SCENTS: Record<DiffuserModelId, number> = { room: 2, tower: 3, car: 2 };

function fmtBRL(val: number) {
  return val.toFixed(2).replace('.', ',');
}

// Returns per-scent bottle quantities based on diffuser model capacity
function getScentQtys(
  selectedIds: string[],
  modelId: DiffuserModelId,
  multiplier: number
): { id: string; qty: number }[] {
  const max = MAX_SCENTS[modelId];
  const count = selectedIds.length;
  if (count === 0) return [];
  if (count === 1) return [{ id: selectedIds[0], qty: max * multiplier }];
  if (count === 2) {
    if (max === 3) {
      // Tower with 2 scents: 2 of first, 1 of second
      return [
        { id: selectedIds[0], qty: 2 * multiplier },
        { id: selectedIds[1], qty: 1 * multiplier },
      ];
    }
    // Room/Car with 2 scents: 1 of each
    return selectedIds.map((id) => ({ id, qty: 1 * multiplier }));
  }
  // 3 scents (Tower only): 1 of each
  return selectedIds.map((id) => ({ id, qty: 1 * multiplier }));
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

// Diffuser selector modal (used from summary "modificar")
function DiffuserSelectorModal({
  currentId,
  onSelect,
  onClose,
}: {
  currentId: DiffuserModelId;
  onSelect: (id: DiffuserModelId) => void;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-ink/60 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 40 }}
        className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl"
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-serif text-xl text-ink">Escolha o difusor</h3>
          <button onClick={onClose} className="text-ink/30 hover:text-ink/60 text-2xl leading-none transition-colors">×</button>
        </div>

        <div className="flex flex-col gap-3">
          {diffuserModels.map((model) => {
            const isSelected = model.id === currentId;
            return (
              <button
                key={model.id}
                onClick={() => onSelect(model.id)}
                className={`flex items-start gap-4 rounded-2xl border-2 p-4 text-left transition-all duration-200 ${
                  isSelected ? 'border-ink bg-ink/[0.02]' : 'border-sand hover:border-rust/50'
                }`}
              >
                {/* Image placeholder */}
                <div className="w-14 h-14 rounded-xl bg-sand/30 shrink-0 overflow-hidden border border-sand/40">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`/images/sinesia-${model.id}.jpg`}
                    alt={model.name}
                    className="w-full h-full object-contain p-1"
                    onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-0.5">
                    <p className="font-medium text-sm text-ink">{model.name}</p>
                    {model.hasSound ? (
                      <span className="text-[9px] uppercase tracking-wide bg-rust text-white rounded-full px-2 py-0.5 font-semibold">
                        Som + Aroma
                      </span>
                    ) : (
                      <span className="text-[9px] uppercase tracking-wide bg-sand text-ink/50 rounded-full px-2 py-0.5">
                        Só Aroma
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-ink/50 mb-1">{model.subtitle}</p>
                  <p className="text-xs text-ink/40 leading-snug">{model.idealFor}</p>
                  <p className="text-xs text-rust font-semibold mt-1">R${fmtBRL(model.price)}</p>
                </div>

                {/* Checkmark */}
                <div className={`shrink-0 mt-0.5 h-5 w-5 rounded-full border-2 flex items-center justify-center transition-all ${
                  isSelected ? 'bg-ink border-ink' : 'border-sand'
                }`}>
                  {isSelected && (
                    <svg viewBox="0 0 12 12" fill="none" className="h-3 w-3">
                      <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        <p className="text-[11px] text-ink/35 text-center mt-4">
          A seleção de fragrâncias pode ser ajustada após trocar o modelo.
        </p>
      </motion.div>
    </div>
  );
}

// Pre-launch modal
function PreLaunchModal({
  cartSelection,
  diffuserId,
  diffuserName,
  scentNames,
  b2bContext,
  onClose,
}: {
  cartSelection: CartSelection;
  diffuserId: string;
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
    await identifyUser({ email });
    trackCommerceEvent('CompleteRegistration', {
      contents: [{ contentId: diffuserId, contentType: 'product', contentName: diffuserName }],
      value: cartSelection.valueNumeric,
    });
    if (typeof window !== 'undefined' && typeof window.gtag_report_conversion === 'function') {
      window.gtag_report_conversion();
    }
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
              Assim que abrirmos as vagas, você será o primeiro a saber —{' '}
              com <strong className="text-rust">50% de desconto</strong> garantido no seu kit.
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
              Pré-lançamento · vagas limitadas
            </div>
            <h3 className="font-serif text-2xl text-ink mb-3">Garanta seu acesso antecipado</h3>
            <p className="text-ink/60 text-sm leading-relaxed mb-4">
              Seu kit está configurado. Estamos em pré-lançamento e as primeiras vagas serão limitadas.
              Deixe seu e-mail para receber o convite de abertura em primeira mão.
            </p>

            {/* Big 50% highlight */}
            <div className="bg-rust text-white rounded-2xl px-5 py-4 mb-4 text-center">
              <p className="text-white/70 text-xs uppercase tracking-widest mb-0.5">Desconto exclusivo de acesso antecipado</p>
              <p className="font-serif text-5xl font-bold leading-none">50% off</p>
              <p className="text-white/80 text-xs mt-1">no seu primeiro kit · exclusivo para quem entrar agora</p>
            </div>

            <div className="bg-sand/30 rounded-xl p-4 mb-4 text-sm">
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
                {loading ? 'Salvando...' : 'Garantir meu 50% de desconto'}
              </button>
              <p className="text-[11px] text-ink/35 text-center">
                Nenhum valor será cobrado hoje.
              </p>
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
  const [showAllScents, setShowAllScents] = useState(false);
  const [showDiffuserModal, setShowDiffuserModal] = useState(false);

  useEffect(() => {
    if (!isB2B) trackEvent('wizard_started', { origem: 'starter-kit-wizard' });
  }, [isB2B]);

  useEffect(() => {
    if (step === 'summary') {
      trackEvent('wizard_summary_viewed', {
        difusor: state.diffuserModelId,
        fragrancias: state.selectedScentIds,
      });
      trackCommerceEvent('ViewContent', {
        contents: [{ contentId: state.diffuserModelId, contentType: 'product', contentName: state.diffuserModelId }],
        value: 0,
      });
    }
  }, [step, state.diffuserModelId, state.selectedScentIds]);

  const activeSteps = isB2B ? B2B_STEPS : STEPS;
  const stepIndex = activeSteps.indexOf(step);
  const recommendedScents = isB2B
    ? scents.filter((s) => b2bRecommendedScentIds.includes(s.id))
    : state.moodId ? getRecommendedScents(state.moodId) : [];
  const selectedDiffuser = diffuserModels.find((d) => d.id === state.diffuserModelId)!;
  const deviceTotal = selectedDiffuser.price * b2bQty;
  const diffuserMaxScents = MAX_SCENTS[state.diffuserModelId];
  const scentQtys = getScentQtys(state.selectedScentIds, state.diffuserModelId, isB2B ? b2bQty : 1);
  const numScentBottles = scentQtys.reduce((sum, s) => sum + s.qty, 0) || diffuserMaxScents;

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

  const maxScents = MAX_SCENTS[state.diffuserModelId];

  const toggleScent = (scentId: string) => {
    setState((s) => {
      const max = MAX_SCENTS[s.diffuserModelId];
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

  const openCart = (planLabel: string, planPrice: string, planMonthly: string | undefined, valueNumeric: number) => {
    setCart({ planLabel, planPrice, planMonthly, valueNumeric });
    const slug = planLabel.toLowerCase().includes('promo') ? 'plano_promocao'
      : planLabel.toLowerCase().includes('assine') ? 'plano_assinatura'
      : 'plano_compra_unica';
    trackEvent('wizard_plan_selected', { plano: planLabel, slug, valor: planPrice });
    trackEvent('cart_opened', { plano: planLabel, slug, valor: planPrice });
    trackCommerceEvent('InitiateCheckout', {
      contents: [{ contentId: selectedDiffuser.id, contentType: 'product', contentName: selectedDiffuser.name }],
      value: valueNumeric,
    });
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

              {(() => {
                const displayScents = showAllScents
                  ? scents
                  : [...recommendedScents.slice(0, 4), ...scents.filter(s => !recommendedScents.slice(0, 4).find(r => r.id === s.id) && state.selectedScentIds.includes(s.id))];
                return (
                  <div className="flex flex-col gap-3 mb-4">
                    {displayScents.map((scent) => {
                      const isSelected = state.selectedScentIds.includes(scent.id);
                      const isRecommended = recommendedScents.slice(0, 4).some(r => r.id === scent.id);
                      return (
                        <div
                          key={scent.id}
                          className={`flex items-center gap-4 rounded-2xl border-2 p-4 transition-all duration-200 ${
                            isSelected ? 'border-ink bg-ink/[0.02]' : 'border-sand bg-white'
                          }`}
                        >
                          <button
                            onClick={() => toggleScent(scent.id)}
                            className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 flex items-center justify-center"
                            style={{ backgroundColor: scent.cardColor }}
                            aria-label={`Selecionar ${scent.name}`}
                          >
                            {scent.image ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={scent.image} alt={scent.name} className="absolute inset-0 w-full h-full object-contain p-1" />
                            ) : (
                              <svg viewBox="0 0 40 40" className="h-8 w-8 text-white/20" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <rect x="2" y="2" width="36" height="36" rx="4" />
                                <path d="M8 8l24 24M32 8L8 32" />
                              </svg>
                            )}
                          </button>

                          <button onClick={() => toggleScent(scent.id)} className="flex-1 min-w-0 text-left" aria-label={`Selecionar ${scent.name}`}>
                            <div className="flex items-center gap-1.5">
                              <p className="font-medium text-ink">{scent.name}</p>
                              {isRecommended && !showAllScents && (
                                <span className="text-[9px] uppercase tracking-wide bg-rust/10 text-rust rounded-full px-1.5 py-0.5">recomendada</span>
                              )}
                            </div>
                            <p className="text-xs text-ink/50 mt-0.5">{scent.family}</p>
                            <p className="text-xs text-ink/40 mt-0.5 truncate">{scent.mood}</p>
                          </button>

                          <button
                            onClick={() => setDetailScentId(scent.id)}
                            className="text-xs text-rust/70 hover:text-rust border border-rust/30 hover:border-rust rounded-full px-2.5 py-1 transition-colors shrink-0"
                          >
                            detalhes
                          </button>

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

                    {/* Ver todas / Ver menos */}
                    <button
                      onClick={() => setShowAllScents(v => !v)}
                      className="w-full border border-sand rounded-2xl py-3 text-sm text-ink/60 hover:border-rust hover:text-rust transition-all duration-200"
                    >
                      {showAllScents ? '↑ Ver apenas as recomendadas' : `Ver todas as 8 fragrâncias →`}
                    </button>
                  </div>
                );
              })()}

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
                  <h2 className="font-serif text-2xl md:text-3xl text-ink mb-1">
                    Sua combinação está pronta
                  </h2>
                  <p className="text-ink/50 text-sm mb-5">
                    {isB2B && b2bQty > 1 ? `${b2bQty} ambientes · ${numScentBottles} frascos/mês` : `${numScentBottles} frasco${numScentBottles > 1 ? 's' : ''}/mês · kit personalizado`}
                  </p>

                  {/* Diffuser */}
                  <div className="flex items-center justify-between mb-1.5">
                    <p className="text-[10px] uppercase tracking-widest text-ink/35">Difusor</p>
                    {!isB2B && (
                      <button
                        onClick={() => setShowDiffuserModal(true)}
                        className="text-[10px] text-rust/70 hover:text-rust underline underline-offset-2 transition-colors"
                      >
                        modificar
                      </button>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mb-4 p-3 rounded-2xl bg-sand/20">
                    <div className="w-14 h-14 rounded-xl bg-white overflow-hidden shrink-0 border border-sand/50">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={`/images/sinesia-${selectedDiffuser.id}.jpg`}
                        alt={selectedDiffuser.name}
                        className="w-full h-full object-contain p-1"
                        onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                      />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm text-ink">
                        {b2bQty > 1 ? `${b2bQty}× ` : ''}{selectedDiffuser.name}
                      </p>
                      <p className="text-xs text-ink/50">{selectedDiffuser.subtitle}</p>
                      <p className="text-xs text-rust font-medium mt-0.5">R${fmtBRL(deviceTotal)}</p>
                    </div>
                  </div>

                  {/* Scents */}
                  <div className="flex items-center justify-between mb-1.5">
                    <p className="text-[10px] uppercase tracking-widest text-ink/35">Fragrâncias ({numScentBottles} frascos/mês)</p>
                    <button
                      onClick={() => setStep('scents')}
                      className="text-[10px] text-rust/70 hover:text-rust underline underline-offset-2 transition-colors"
                    >
                      modificar
                    </button>
                  </div>
                  <div className="flex flex-col gap-2 mb-4">
                    {scentQtys.map(({ id, qty }) => {
                      const scent = scents.find((s) => s.id === id);
                      if (!scent) return null;
                      return (
                        <div key={id} className="flex items-center gap-3 p-3 rounded-xl bg-sand/10">
                          <div
                            className="w-12 h-12 rounded-xl shrink-0 relative overflow-hidden border border-sand/40"
                            style={{ backgroundColor: scent.cardColor }}
                          >
                            {scent.image && (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={scent.image} alt={scent.name} className="absolute inset-0 w-full h-full object-contain p-0.5" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-ink truncate">{scent.name}</p>
                            <p className="text-xs text-ink/40">{scent.family}</p>
                          </div>
                          <div className="shrink-0 text-right">
                            <p className="text-sm font-semibold text-ink">{qty}×</p>
                            <p className="text-[10px] text-ink/35">frasco{qty > 1 ? 's' : ''}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Discount callout */}
                  <div className="rounded-xl bg-rust/8 border border-rust/20 px-3 py-2.5 flex items-center gap-2">
                    <span className="text-rust text-base">🏷️</span>
                    <p className="text-xs text-rust font-medium">
                      Assinantes economizam <strong>20% off</strong> nos frascos todo mês
                    </p>
                  </div>
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
                    <h3 className="font-serif text-xl mb-1">Difusor de graça</h3>

                    {/* Highlight: device free */}
                    <div className="inline-flex items-center gap-1.5 bg-rust/25 border border-rust/40 rounded-lg px-2.5 py-1 mb-3">
                      <span className="text-xs">🎁</span>
                      <span className="text-xs text-white font-semibold">
                        Difusor R${fmtBRL(deviceTotal)} incluso <span className="line-through opacity-60">pago</span> de graça
                      </span>
                    </div>

                    <div className="flex items-baseline gap-1 mb-0.5">
                      <span className="font-serif text-3xl">R${fmtBRL(scentSubTotal)}</span>
                      <span className="text-white/40 text-xs">/mês</span>
                    </div>
                    <p className="text-white/45 text-xs mb-3">
                      {numScentBottles} frasco{numScentBottles > 1 ? 's' : ''}/mês · 12 meses
                    </p>

                    {/* Highlight: 20% off */}
                    <div className="inline-flex items-center gap-1.5 bg-white/10 rounded-lg px-2.5 py-1 mb-4">
                      <span className="text-xs font-bold text-white bg-rust rounded px-1">-20%</span>
                      <span className="text-xs text-white/80">
                        nas essências todo mês · você economiza R${fmtBRL(numScentBottles * (SCENT_FULL - SCENT_SUB) * 12)}/ano
                      </span>
                    </div>

                    <ul className="text-xs text-white/65 space-y-1.5 mb-4">
                      <li>✓ {b2bQty > 1 ? `${b2bQty}× ` : ''}{selectedDiffuser.name} <strong className="text-white">sem custo</strong></li>
                      <li>✓ Frete grátis nos refis</li>
                      <li>✓ Garantia vitalícia do aparelho</li>
                      <li>✓ Troque fragrâncias a qualquer mês</li>
                    </ul>
                    <button
                      onClick={() =>
                        openCart(
                          'Promoção — Difusor de Graça',
                          `R$${fmtBRL(scentSubTotal)}/mês`,
                          `12 meses · difusor R$${fmtBRL(deviceTotal)} incluso grátis`,
                          scentSubTotal
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
                    <h3 className="font-serif text-xl text-ink mb-3">Assine e economize</h3>

                    <div className="flex items-baseline gap-1 mb-0.5">
                      <span className="font-serif text-2xl text-ink">R${fmtBRL(deviceTotal)}</span>
                      <span className="text-ink/40 text-xs">difusor · 1× pagamento único</span>
                    </div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="font-serif text-xl text-ink">R${fmtBRL(scentSubTotal)}</span>
                      <span className="text-ink/40 text-xs">/mês</span>
                      {/* Highlight: 20% off badge */}
                      <span className="ml-1 inline-flex items-center bg-rust text-white text-[10px] font-bold rounded-md px-1.5 py-0.5 uppercase tracking-wide">
                        -20% off
                      </span>
                    </div>
                    <p className="text-xs text-rust font-medium mb-4">
                      Você paga R${fmtBRL(scentFullTotal)}/mês sem assinatura — aqui economiza R${fmtBRL(numScentBottles * (SCENT_FULL - SCENT_SUB))}/mês
                    </p>

                    <ul className="text-xs text-ink/60 space-y-1.5 mb-4">
                      <li>✓ Difusor pago uma única vez</li>
                      <li>✓ <strong>20% de desconto</strong> nas essências todo mês</li>
                      <li>✓ Troque as fragrâncias a cada pedido</li>
                      <li>✓ Cancele quando quiser, sem taxa</li>
                    </ul>
                    <button
                      onClick={() =>
                        openCart(
                          'Assine e Economize',
                          `R$${fmtBRL(deviceTotal)} + R$${fmtBRL(scentSubTotal)}/mês`,
                          `Difusor: pagamento único · Essências: 20% off/mês`,
                          deviceTotal + scentSubTotal
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
                    <h3 className="font-serif text-xl text-ink mb-3">Sem compromisso</h3>

                    <div className="flex items-baseline gap-1 mb-0.5">
                      <span className="font-serif text-2xl text-ink">R${fmtBRL(deviceTotal)}</span>
                      <span className="text-ink/40 text-xs">difusor · pagamento único</span>
                    </div>
                    <div className="flex items-baseline gap-1 mb-4">
                      <span className="font-serif text-xl text-ink">R${fmtBRL(scentFullTotal)}</span>
                      <span className="text-ink/40 text-xs">/mês em essências · preço cheio</span>
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
                          'Difusor + essências · preço cheio · sem assinatura',
                          deviceTotal + scentFullTotal
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
          diffuserId={selectedDiffuser.id}
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

      {/* Diffuser selector modal */}
      <AnimatePresence>
        {showDiffuserModal && (
          <DiffuserSelectorModal
            currentId={state.diffuserModelId}
            onSelect={(id) => {
              setState((s) => {
                const newMax = MAX_SCENTS[id];
                // Trim selected scents if new model supports fewer
                const trimmed = s.selectedScentIds.slice(0, newMax);
                const selected = trimmed.length > 0 ? trimmed : s.selectedScentIds.slice(0, 1);
                return { ...s, diffuserModelId: id, selectedScentIds: selected };
              });
              setShowDiffuserModal(false);
            }}
            onClose={() => setShowDiffuserModal(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
