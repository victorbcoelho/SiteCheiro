'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { submitLead } from '@/lib/leads';
import { trackEvent, trackCommerceEvent } from '@/lib/analytics';
import type { B2BContext } from './StarterKitWizard';

const RESERVA_VALOR = 28.9;

interface CartSelection {
  planLabel: string;
  planPrice: string;
  valueNumeric: number;
}

export default function ReservationModal({
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const origem = b2bContext ? 'empresas-wizard' : 'starter-kit-wizard';

  const handleReservar = async () => {
    setError('');
    setLoading(true);

    try {
      // 1. Cria a reserva no Firebase (status pendente, SEM endereço — vem depois)
      const reservaId = await submitLead('reservas', {
        plano: cartSelection.planLabel,
        difusor: diffuserName,
        fragrancias: scentNames.join(', '),
        valorReserva: RESERVA_VALOR,
        status: 'pendente',
        origem,
        ...b2bContext,
      });

      const ref = reservaId || `reserva_${Date.now()}`;

      // 2. Analytics (antes do redirecionamento)
      trackEvent('lead_captured', { plano: cartSelection.planLabel, origem });
      trackCommerceEvent('AddPaymentInfo', {
        contents: [{ contentId: diffuserId, contentType: 'product', contentName: diffuserName }],
        value: RESERVA_VALOR,
      });

      // 3. Cria a cobrança no Mercado Pago (serverless) — guest checkout puro
      const res = await fetch('/api/create-preference', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reservaId: ref,
          plano: cartSelection.planLabel,
          difusor: diffuserName,
          fragrancias: scentNames.join(', '),
          origin: window.location.origin,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.init_point) {
        throw new Error(data?.error || 'Não foi possível iniciar o pagamento.');
      }

      // 4. Redireciona direto para o checkout do Mercado Pago
      window.location.href = data.init_point;
    } catch (err) {
      console.error('[Sinesia Reserva] erro:', err);
      setError(err instanceof Error ? err.message : 'Erro ao processar. Tente novamente.');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/70 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl max-h-[92vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="inline-block bg-rust/10 text-rust text-xs uppercase tracking-widest rounded-full px-3 py-1">
            Reserva de pré-lançamento
          </div>
          <button
            onClick={onClose}
            className="text-ink/30 hover:text-ink/60 text-2xl leading-none transition-colors"
            aria-label="Fechar"
          >
            ×
          </button>
        </div>

        <h3 className="font-serif text-2xl text-ink mb-0.5">
          Você escolheu o {diffuserName}
        </h3>
        <p className="text-rust font-medium text-sm mb-4">{cartSelection.planPrice}</p>

        <p className="text-ink/60 text-sm leading-relaxed mb-2">
          A Sinesia está em pré-lançamento. As primeiras unidades são limitadas.
        </p>
        <p className="text-ink/70 text-sm leading-relaxed mb-4">
          Garanta sua vaga no primeiro lote com uma reserva de <strong>R$28,90</strong> —
          que será integralmente abatida do seu primeiro pagamento.
        </p>

        <ul className="text-sm text-ink/70 space-y-1.5 mb-5">
          <li>✓ Preço de fundador travado</li>
          <li>✓ Primeiro lote garantido</li>
          <li>✓ Reembolso 100% a qualquer momento</li>
          <li>✓ Nenhuma mensalidade é cobrada agora</li>
        </ul>

        {error && (
          <p className="text-xs text-red-500 text-center bg-red-50 rounded-lg py-2 px-3 mb-3">
            {error}
          </p>
        )}

        <button
          type="button"
          onClick={handleReservar}
          disabled={loading}
          className="w-full bg-rust hover:bg-rustDark disabled:opacity-60 text-white rounded-xl py-4 font-medium transition-colors duration-300 text-sm"
        >
          {loading ? 'Redirecionando...' : 'Reservar minha vaga — R$28,90'}
        </button>

        {/* Selo de confiança */}
        <div className="mt-3 flex items-center justify-center gap-2 bg-sand/40 rounded-xl py-2.5 px-3">
          <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 text-ink/70" stroke="currentColor" strokeWidth="2">
            <rect x="5" y="11" width="14" height="9" rx="2" />
            <path d="M8 11V8a4 4 0 018 0v3" strokeLinecap="round" />
          </svg>
          <span className="text-xs font-medium text-ink/70">Pagamento seguro · Pix ou cartão</span>
          <span className="text-xs font-bold" style={{ color: '#009EE3' }}>Mercado Pago</span>
        </div>

        <p className="text-[11px] text-ink/45 text-center leading-relaxed mt-3">
          Envio previsto em até 60 dias · Reembolso total a qualquer momento.
        </p>
      </motion.div>
    </div>
  );
}
