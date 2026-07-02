'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { trackLeadCaptured, trackButtonClick } from '@/lib/analytics';
import { captureUtm } from '@/lib/utm';
import { RESERVATION_VALUE } from '@/lib/wizard';
import type { LeadType, WizardResponses } from '@/lib/types';

interface LeadModalProps {
  open: boolean;
  type: LeadType;
  wizardResponses: WizardResponses;
  onClose: () => void;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const COPY: Record<
  LeadType,
  { title: string; subtitle: string; bullets: string[] }
> = {
  waitlist: {
    title: 'Garanta seu acesso antecipado',
    subtitle:
      'Estamos em pré-lançamento. Entre na lista VIP e seja das primeiras a receber a Lûmance — sem compromisso.',
    bullets: [
      '30% de desconto exclusivo no lançamento',
      'Prioridade na fila de envio',
      'Conteúdo e protocolos de uso antes de todo mundo',
    ],
  },
  reservation: {
    title: 'Seu kit está quase pronto',
    subtitle:
      'Reserve o seu lugar de fundadora. Você garante prioridade máxima e o melhor preço de lançamento.',
    bullets: [
      '30% de desconto de fundadora, travado',
      'Primeiríssimo lote a ser enviado',
      'Garantia estendida e acompanhamento dedicado',
    ],
  },
};

export default function LeadModal({
  open,
  type,
  wizardResponses,
  onClose,
}: LeadModalProps) {
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');
  const [error, setError] = useState<string | null>(null);

  const copy = COPY[type];

  // Fecha no ESC e trava o scroll do body enquanto aberto.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  // Reseta o formulário sempre que reabre.
  useEffect(() => {
    if (open) {
      setStatus('idle');
      setError(null);
    }
  }, [open, type]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanEmail = email.trim().toLowerCase();
    if (!EMAIL_RE.test(cleanEmail)) {
      setError('Digite um e-mail válido.');
      return;
    }

    setStatus('loading');
    trackButtonClick('modal_lead_submitted');

    const utm = captureUtm();

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: cleanEmail,
          whatsapp: whatsapp.trim() || undefined,
          type,
          wizard_responses: wizardResponses,
          ...utm,
        }),
      });

      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(data.error ?? 'Falha ao enviar.');
      }

      trackLeadCaptured(cleanEmail, type);
      setStatus('success');
    } catch (err) {
      setStatus('idle');
      setError(
        err instanceof Error
          ? err.message
          : 'Não foi possível enviar agora. Tente novamente.',
      );
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-end justify-center p-0 sm:items-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div
            className="absolute inset-0 bg-ink/50 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="lead-modal-title"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ type: 'spring', damping: 26, stiffness: 260 }}
            className="relative z-10 w-full max-w-md rounded-t-3xl bg-offwhite p-8 shadow-2xl sm:rounded-3xl"
          >
            <button
              onClick={onClose}
              aria-label="Fechar"
              className="absolute right-5 top-5 text-ink/40 transition-colors hover:text-ink"
            >
              ✕
            </button>

            {status === 'success' ? (
              <div className="py-6 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gold/15 text-gold">
                  <svg viewBox="0 0 24 24" className="h-7 w-7">
                    <path
                      d="M5 12.5l4 4 10-11"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <h3 className="mt-6 font-serif text-2xl text-ink">
                  Pronto! Você está na lista.
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-ink/60">
                  Fique de olho no seu email — é por lá que enviaremos seu acesso
                  antecipado e o desconto de lançamento.
                </p>
                <button
                  onClick={onClose}
                  className="mt-8 w-full rounded-full bg-ink py-3 text-sm text-offwhite transition-transform hover:scale-[1.02]"
                >
                  Fechar
                </button>
              </div>
            ) : (
              <>
                <p className="text-xs uppercase tracking-[0.28em] text-gold">
                  {type === 'reservation' ? 'Reserva de fundadora' : 'Lista VIP'}
                </p>
                <h3
                  id="lead-modal-title"
                  className="mt-3 font-serif text-2xl leading-tight text-ink"
                >
                  {copy.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-ink/60">
                  {copy.subtitle}
                </p>

                <ul className="mt-5 space-y-2.5">
                  {copy.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-2.5 text-sm text-ink/75">
                      <span className="mt-1 text-gold">✓</span>
                      {b}
                    </li>
                  ))}
                </ul>

                {type === 'reservation' && (
                  <p className="mt-5 rounded-lg bg-gold/10 px-4 py-3 text-xs leading-relaxed text-ink/70">
                    Reserva de {RESERVATION_VALUE} totalmente reembolsável.
                    Nenhum valor é cobrado hoje.
                  </p>
                )}

                <form onSubmit={handleSubmit} className="mt-6 space-y-3">
                  <input
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Seu melhor e-mail"
                    className="w-full rounded-xl border border-ink/15 bg-white px-4 py-3 text-sm text-ink outline-none transition-colors focus:border-gold"
                  />
                  <input
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    placeholder="WhatsApp (opcional)"
                    className="w-full rounded-xl border border-ink/15 bg-white px-4 py-3 text-sm text-ink outline-none transition-colors focus:border-gold"
                  />

                  {error && (
                    <p className="text-sm text-red-600" role="alert">
                      {error}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="w-full rounded-full bg-ink py-3.5 text-sm font-medium text-offwhite transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {status === 'loading' ? 'Enviando…' : 'Confirmar'}
                  </button>
                </form>

                <p className="mt-4 text-center text-[11px] leading-relaxed text-ink/40">
                  Seus dados estão seguros. Sem spam — só o essencial sobre o
                  lançamento.
                </p>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
