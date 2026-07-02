'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import LeadModal from './LeadModal';
import { trackWizardStep, trackButtonClick } from '@/lib/analytics';
import {
  WIZARD_STEPS,
  KIT_PRICE,
  labelForSelection,
} from '@/lib/wizard';
import type { LeadType, WizardResponses } from '@/lib/types';

type Selections = { step1: string; step2: string };

export default function Wizard() {
  const [stepIndex, setStepIndex] = useState(0); // 0,1 = escolhas · 2 = resumo
  const [selections, setSelections] = useState<Selections>({ step1: '', step2: '' });
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<LeadType>('reservation');

  const totalSteps = 3;

  const select = (stepKey: 'step1' | 'step2', value: string) => {
    setSelections((prev) => ({ ...prev, [stepKey]: value }));
    trackWizardStep(
      stepKey === 'step1' ? 'wizard_step1_selected' : 'wizard_step2_selected',
      value,
    );
  };

  const canAdvance =
    stepIndex === 0
      ? Boolean(selections.step1)
      : stepIndex === 1
        ? Boolean(selections.step2)
        : true;

  const openModal = (type: LeadType) => {
    setModalType(type);
    setModalOpen(true);
    trackButtonClick(
      type === 'waitlist' ? 'wizard_waitlist_cta' : 'wizard_reservation_cta',
    );
  };

  const wizardResponses: WizardResponses = {
    step1: selections.step1,
    step2: selections.step2,
  };

  return (
    <section id="montar-kit" className="bg-offwhite py-24">
      <div className="mx-auto max-w-3xl px-6">
        <div className="text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-gold">
            Monte seu kit
          </p>
          <h2 className="mt-4 font-serif text-3xl font-medium text-ink sm:text-4xl">
            Personalize a sua Lûmance
          </h2>
        </div>

        {/* Barra de progresso */}
        <div className="mx-auto mt-10 flex max-w-sm items-center gap-2">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div
              key={i}
              className="h-1 flex-1 overflow-hidden rounded-full bg-ink/10"
            >
              <motion.div
                className="h-full rounded-full bg-gold"
                initial={false}
                animate={{ width: i <= stepIndex ? '100%' : '0%' }}
                transition={{ duration: 0.4 }}
              />
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-3xl border border-ink/10 bg-white p-6 shadow-sm sm:p-10">
          <AnimatePresence mode="wait">
            {stepIndex < 2 ? (
              <motion.div
                key={stepIndex}
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.35 }}
              >
                <StepChooser
                  configIndex={stepIndex}
                  selected={
                    stepIndex === 0 ? selections.step1 : selections.step2
                  }
                  onSelect={select}
                />
              </motion.div>
            ) : (
              <motion.div
                key="summary"
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.35 }}
              >
                <Summary selections={selections} onReserve={openModal} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navegação */}
          {stepIndex < 2 && (
            <div className="mt-8 flex items-center justify-between">
              <button
                onClick={() => setStepIndex((i) => Math.max(0, i - 1))}
                disabled={stepIndex === 0}
                className="text-sm text-ink/50 transition-colors hover:text-ink disabled:invisible"
              >
                ← Voltar
              </button>
              <button
                onClick={() => canAdvance && setStepIndex((i) => i + 1)}
                disabled={!canAdvance}
                className="rounded-full bg-ink px-8 py-3 text-sm font-medium text-offwhite transition-transform hover:scale-[1.03] disabled:cursor-not-allowed disabled:opacity-40"
              >
                Próximo
              </button>
            </div>
          )}
        </div>
      </div>

      <LeadModal
        open={modalOpen}
        type={modalType}
        wizardResponses={wizardResponses}
        onClose={() => setModalOpen(false)}
      />
    </section>
  );
}

/* ── Passos 1 e 2: cards de escolha ─────────────────────────────────────── */
function StepChooser({
  configIndex,
  selected,
  onSelect,
}: {
  configIndex: number;
  selected: string;
  onSelect: (key: 'step1' | 'step2', value: string) => void;
}) {
  const config = WIZARD_STEPS[configIndex];

  return (
    <div>
      <p className="text-xs uppercase tracking-[0.24em] text-gold">
        {config.eyebrow}
      </p>
      <h3 className="mt-3 font-serif text-2xl text-ink">{config.title}</h3>
      <p className="mt-2 text-sm text-ink/55">{config.helper}</p>

      <div className="mt-7 grid gap-4 sm:grid-cols-3">
        {config.options.map((opt) => {
          const active = selected === opt.value;
          return (
            <button
              key={opt.value}
              onClick={() => onSelect(config.key, opt.value)}
              className={`group flex flex-col rounded-2xl border p-4 text-left transition-all ${
                active
                  ? 'border-gold bg-gold/[0.06] ring-1 ring-gold'
                  : 'border-ink/10 hover:border-ink/30'
              }`}
            >
              <span
                className="mb-4 h-16 w-full rounded-lg"
                style={{ backgroundColor: opt.swatch }}
                aria-hidden="true"
              />
              <span className="font-serif text-base text-ink">{opt.title}</span>
              <span className="mt-1 text-xs leading-relaxed text-ink/55">
                {opt.description}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ── Passo 3: resumo + preço + CTAs ─────────────────────────────────────── */
function Summary({
  selections,
  onReserve,
}: {
  selections: Selections;
  onReserve: (type: LeadType) => void;
}) {
  return (
    <div>
      <p className="text-xs uppercase tracking-[0.24em] text-gold">
        Passo 3 de 3
      </p>
      <h3 className="mt-3 font-serif text-2xl text-ink">Seu kit Lûmance</h3>

      <dl className="mt-6 divide-y divide-ink/10 rounded-2xl bg-cream/60 px-5">
        <div className="flex items-center justify-between py-4">
          <dt className="text-sm text-ink/55">Objetivo</dt>
          <dd className="text-sm font-medium text-ink">
            {selections.step1
              ? labelForSelection('step1', selections.step1)
              : '—'}
          </dd>
        </div>
        <div className="flex items-center justify-between py-4">
          <dt className="text-sm text-ink/55">Acabamento</dt>
          <dd className="text-sm font-medium text-ink">
            {selections.step2
              ? labelForSelection('step2', selections.step2)
              : '—'}
          </dd>
        </div>
        <div className="flex items-center justify-between py-4">
          <dt className="text-sm text-ink/55">Kit Lûmance completo</dt>
          <dd className="font-serif text-xl text-ink">{KIT_PRICE}</dd>
        </div>
      </dl>

      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        {/* CTA 1 — Lista VIP (grátis, menor destaque) */}
        <button
          onClick={() => onReserve('waitlist')}
          className="order-2 rounded-full border border-ink/25 py-3.5 text-sm font-medium text-ink transition-colors hover:border-ink sm:order-1"
        >
          Entrar na lista de espera
        </button>

        {/* CTA 2 — Reserva de fundadora (destaque principal) */}
        <button
          onClick={() => onReserve('reservation')}
          className="relative order-1 rounded-full bg-gold py-3.5 text-sm font-semibold text-white transition-transform hover:scale-[1.03] sm:order-2"
        >
          Garantir meu kit com prioridade
          <span className="absolute -top-2.5 right-4 rounded-full bg-ink px-2 py-0.5 text-[10px] uppercase tracking-wide text-offwhite">
            Recomendado
          </span>
        </button>
      </div>

      <p className="mt-5 text-center text-xs text-ink/45">
        Pré-lançamento · nenhum valor é cobrado agora.
      </p>
    </div>
  );
}
