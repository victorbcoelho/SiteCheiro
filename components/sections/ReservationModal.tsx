'use client';

import { useEffect, useRef, useState } from 'react';
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

interface PixData {
  paymentId: number;
  qrCode?: string;
  qrCodeBase64?: string;
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
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState<'' | 'pix' | 'cartao'>('');
  const [error, setError] = useState('');
  const [view, setView] = useState<'form' | 'pix'>('form');
  const [pix, setPix] = useState<PixData | null>(null);
  const [copiado, setCopiado] = useState(false);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const origem = b2bContext ? 'empresas-wizard' : 'starter-kit-wizard';

  useEffect(() => () => { if (pollRef.current) clearInterval(pollRef.current); }, []);

  const emailValido = /\S+@\S+\.\S+/.test(email);

  const criarReserva = async () => {
    const reservaId = await submitLead('reservas', {
      email,
      plano: cartSelection.planLabel,
      difusor: diffuserName,
      fragrancias: scentNames.join(', '),
      valorReserva: RESERVA_VALOR,
      status: 'pendente',
      origem,
      ...b2bContext,
    });
    trackEvent('lead_captured', { plano: cartSelection.planLabel, origem });
    trackCommerceEvent('AddPaymentInfo', {
      contents: [{ contentId: diffuserId, contentType: 'product', contentName: diffuserName }],
      value: RESERVA_VALOR,
    });
    return reservaId || `reserva_${Date.now()}`;
  };

  const checkStatus = async (paymentId: number, reservaId: string) => {
    try {
      const res = await fetch(`/api/payment-status?id=${paymentId}`);
      const data = await res.json();
      if (data.status === 'approved') {
        if (pollRef.current) clearInterval(pollRef.current);
        window.location.href = `/reserva-confirmada?ref=${encodeURIComponent(reservaId)}&status=approved&payment_id=${paymentId}`;
      } else if (data.status === 'rejected' || data.status === 'cancelled') {
        if (pollRef.current) clearInterval(pollRef.current);
        setError('Pagamento não concluído. Tente novamente.');
        setView('form');
        setPix(null);
      }
    } catch {
      /* silencioso — tenta de novo no próximo ciclo */
    }
  };

  const handlePix = async () => {
    if (!emailValido) { setError('Informe um e-mail válido.'); return; }
    setError('');
    setLoading('pix');
    try {
      const reservaId = await criarReserva();
      const res = await fetch('/api/create-pix', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reservaId,
          email,
          plano: cartSelection.planLabel,
          difusor: diffuserName,
          fragrancias: scentNames.join(', '),
          origin: window.location.origin,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.qrCodeBase64) {
        throw new Error(data?.error || 'Não foi possível gerar o Pix.');
      }
      setPix({ paymentId: data.paymentId, qrCode: data.qrCode, qrCodeBase64: data.qrCodeBase64 });
      setView('pix');
      setLoading('');
      pollRef.current = setInterval(() => checkStatus(data.paymentId, reservaId), 4000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao gerar o Pix.');
      setLoading('');
    }
  };

  const handleCartao = async () => {
    if (!emailValido) { setError('Informe um e-mail válido.'); return; }
    setError('');
    setLoading('cartao');
    try {
      const reservaId = await criarReserva();
      const res = await fetch('/api/create-preference', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reservaId,
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
      window.location.href = data.init_point;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao processar. Tente novamente.');
      setLoading('');
    }
  };

  const copiar = () => {
    if (!pix?.qrCode) return;
    navigator.clipboard.writeText(pix.qrCode);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  const voltarParaForm = () => {
    if (pollRef.current) clearInterval(pollRef.current);
    setView('form');
    setPix(null);
    setError('');
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

        {view === 'form' && (
          <>
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

            <input
              type="email"
              placeholder="Seu e-mail"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(''); }}
              required
              className="border border-sand rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-rust transition-colors w-full mb-3"
            />

            {error && (
              <p className="text-xs text-red-500 text-center bg-red-50 rounded-lg py-2 px-3 mb-3">
                {error}
              </p>
            )}

            <button
              type="button"
              onClick={handlePix}
              disabled={loading !== ''}
              className="w-full bg-rust hover:bg-rustDark disabled:opacity-60 text-white rounded-xl py-4 font-medium transition-colors duration-300 text-sm"
            >
              {loading === 'pix' ? 'Gerando Pix...' : 'Reservar com Pix — R$28,90'}
            </button>

            <button
              type="button"
              onClick={handleCartao}
              disabled={loading !== ''}
              className="w-full mt-2 border border-sand hover:border-rust text-ink/70 hover:text-rust disabled:opacity-60 rounded-xl py-3 font-medium transition-colors duration-300 text-sm"
            >
              {loading === 'cartao' ? 'Redirecionando...' : 'Pagar com cartão'}
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
          </>
        )}

        {view === 'pix' && pix && (
          <div className="text-center">
            <h3 className="font-serif text-2xl text-ink mb-1">Pague com Pix para reservar</h3>
            <p className="text-rust font-serif text-3xl font-bold mb-1">R$28,90</p>
            <p className="text-ink/55 text-sm mb-4">
              Escaneie o QR Code no app do seu banco. Assim que o pagamento for
              confirmado, avançamos <strong>automaticamente</strong> — não feche esta tela.
            </p>

            {pix.qrCodeBase64 && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={`data:image/png;base64,${pix.qrCodeBase64}`}
                alt="QR Code Pix"
                className="mx-auto w-56 h-56 rounded-2xl border border-sand p-2"
              />
            )}

            <button
              type="button"
              onClick={copiar}
              className="mt-4 w-full border border-sand hover:border-rust text-ink/70 hover:text-rust rounded-xl py-3 font-medium transition-colors text-sm"
            >
              {copiado ? '✓ Código copiado!' : 'Copiar código Pix (copia e cola)'}
            </button>

            <div className="mt-4 flex items-center justify-center gap-2 text-ink/50 text-sm">
              <span className="inline-block h-2 w-2 rounded-full bg-rust animate-pulse" />
              Aguardando pagamento...
            </div>

            <p className="text-[11px] text-ink/40 mt-4 leading-relaxed">
              Reserva de R$28,90 · 100% abatível · reembolso total a qualquer momento.
            </p>

            <button
              type="button"
              onClick={voltarParaForm}
              className="text-xs text-ink/40 hover:text-ink/70 mt-3 transition-colors"
            >
              ← Escolher outro meio de pagamento
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
