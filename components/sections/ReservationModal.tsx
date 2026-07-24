'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { submitLead } from '@/lib/leads';
import { trackEvent, trackCommerceEvent } from '@/lib/analytics';
import type { B2BContext } from './StarterKitWizard';

const RESERVA_VALOR = 28.9;

function fmtMMSS(total: number) {
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

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

interface ScentItem {
  name: string;
  qty: number;
  monthly: number;
  monthlyFull?: number;
  image?: string;
  cardColor?: string;
}

const brl = (v: number) => `R$${v.toFixed(2).replace('.', ',')}`;

export default function ReservationModal({
  cartSelection,
  diffuserId,
  diffuserName,
  diffuserPrice,
  diffuserFree = false,
  scentNames,
  scentItems = [],
  scentMonthlyTotal = 0,
  scentFullMonthly = 0,
  b2bContext,
  onClose,
}: {
  cartSelection: CartSelection;
  diffuserId: string;
  diffuserName: string;
  diffuserPrice: number;
  diffuserFree?: boolean;
  scentNames: string[];
  scentItems?: ScentItem[];
  scentMonthlyTotal?: number;
  scentFullMonthly?: number;
  b2bContext?: B2BContext;
  onClose: () => void;
}) {
  const economiaMes = Math.max(0, scentFullMonthly - scentMonthlyTotal);
  const descontoPct = scentFullMonthly > 0 ? Math.round((economiaMes / scentFullMonthly) * 100) : 0;
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState<'' | 'pix' | 'cartao'>('');
  const [error, setError] = useState('');
  const [view, setView] = useState<'form' | 'pix'>('form');
  const [pix, setPix] = useState<PixData | null>(null);
  const [copiado, setCopiado] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const expiresAtRef = useRef<number | null>(null);

  const origem = b2bContext ? 'empresas-wizard' : 'starter-kit-wizard';
  const expirado = view === 'pix' && secondsLeft <= 0;

  useEffect(() => () => { if (pollRef.current) clearInterval(pollRef.current); }, []);

  // Cronômetro de expiração do QR Pix
  useEffect(() => {
    if (view !== 'pix' || !expiresAtRef.current) return;
    const t = setInterval(() => {
      const left = Math.max(0, Math.floor((expiresAtRef.current! - Date.now()) / 1000));
      setSecondsLeft(left);
      if (left <= 0) {
        clearInterval(t);
        if (pollRef.current) clearInterval(pollRef.current);
      }
    }, 1000);
    return () => clearInterval(t);
  }, [view]);

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
      const res = await fetch(`/api/payment-status?id=${paymentId}&_=${Date.now()}`, { cache: 'no-store' });
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
    trackEvent('payment_method_selected', { metodo: 'pix', plano: cartSelection.planLabel, origem });
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
      expiresAtRef.current = data.expiration ? new Date(data.expiration).getTime() : Date.now() + 30 * 60 * 1000;
      setSecondsLeft(Math.max(0, Math.floor((expiresAtRef.current - Date.now()) / 1000)));
      setView('pix');
      setLoading('');
      trackEvent('pix_qr_shown', { plano: cartSelection.planLabel, origem });
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
    trackEvent('payment_method_selected', { metodo: 'cartao', plano: cartSelection.planLabel, origem });
    try {
      const reservaId = await criarReserva();
      const res = await fetch('/api/create-preference', {
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

            {/* Mini-carrinho itemizado: difusor (pagamento único) + essências (mensal) */}
            <div className="bg-sand/25 rounded-2xl p-3 mb-4">
              <p className="text-[10px] uppercase tracking-widest text-ink/40 mb-2">Seu kit reservado</p>

              {/* Difusor — pagamento único */}
              <div className="flex items-center gap-3 pb-3 mb-3 border-b border-sand/60">
                <div className="w-14 h-14 rounded-xl bg-white shrink-0 overflow-hidden border border-sand/50">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`/images/sinesia-${diffuserId}.jpg`}
                    alt={diffuserName}
                    className="w-full h-full object-contain p-1"
                    onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-ink truncate">{diffuserName}</p>
                  <p className="text-xs text-ink/50">
                    Difusor · {diffuserFree ? 'grátis na assinatura de 12 meses' : 'pagamento único'}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  {diffuserFree ? (
                    <>
                      <span className="block text-[10px] text-ink/35 line-through">{brl(diffuserPrice)}</span>
                      <span className="text-xs font-bold text-green-600">GRÁTIS</span>
                    </>
                  ) : (
                    <span className="text-sm font-semibold text-ink">{brl(diffuserPrice)}</span>
                  )}
                </div>
              </div>

              {/* Essências — assinatura mensal */}
              <p className="text-[10px] uppercase tracking-widest text-ink/40 mb-2">Essências · assinatura mensal</p>
              <div className="flex flex-col gap-2">
                {(scentItems.length > 0
                  ? scentItems
                  : scentNames.map((name) => ({ name, qty: 1, monthly: 0 } as ScentItem))
                ).map((s) => (
                  <div key={s.name} className="flex items-center gap-3">
                    <div
                      className="w-11 h-11 rounded-lg overflow-hidden border border-sand/40 relative shrink-0"
                      style={{ backgroundColor: s.cardColor ?? '#e5e0d6' }}
                    >
                      {s.image && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={s.image} alt={s.name} className="absolute inset-0 w-full h-full object-contain p-1" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-ink truncate">{s.qty}× {s.name}</p>
                      <p className="text-xs text-ink/45">por mês</p>
                    </div>
                    {s.monthly > 0 && (
                      <span className="shrink-0 text-right text-xs whitespace-nowrap">
                        {s.monthlyFull && s.monthlyFull > s.monthly && (
                          <span className="text-ink/35 line-through mr-1">{brl(s.monthlyFull)}</span>
                        )}
                        <span className="text-ink/70 font-medium">{brl(s.monthly)}/mês</span>
                      </span>
                    )}
                  </div>
                ))}
              </div>

              {scentMonthlyTotal > 0 && (
                <div className="flex justify-between items-center border-t border-sand/60 mt-2 pt-2">
                  <span className="text-xs text-ink/60">Total das essências</span>
                  <span className="flex items-center gap-1.5">
                    {descontoPct > 0 && (
                      <span className="text-xs text-ink/35 line-through">{brl(scentFullMonthly)}</span>
                    )}
                    <span className="text-sm font-semibold text-rust">{brl(scentMonthlyTotal)}/mês</span>
                    {descontoPct > 0 && (
                      <span className="text-[10px] font-bold bg-rust text-white rounded px-1">-{descontoPct}%</span>
                    )}
                  </span>
                </div>
              )}

              <p className="text-sm text-ink font-semibold border-t border-sand/60 mt-2 pt-2">
                Hoje você paga apenas a reserva de R$28,90.
              </p>
              {descontoPct > 0 && (
                <p className="text-[11px] text-rust font-semibold mt-1.5">
                  Preço mensal travado para sempre — isso mesmo, sem reajuste.
                </p>
              )}
              <p className="text-[11px] text-ink/45 mt-1 leading-relaxed">
                As essências só passam a ser cobradas quando o kit for enviado.
              </p>
            </div>

            <p className="text-ink/60 text-sm leading-relaxed mb-2">
              A Sinesia está em pré-lançamento. As primeiras unidades são limitadas.
            </p>
            <p className="text-ink/70 text-sm leading-relaxed mb-4">
              Garanta sua vaga no primeiro lote com uma reserva de <strong>R$28,90</strong> —
              que será integralmente abatida do seu primeiro pagamento.
            </p>

            <ul className="text-sm text-ink/70 space-y-1.5 mb-4">
              <li>✓ Reembolso 100% a qualquer momento</li>
              <li>✓ Nenhuma mensalidade é cobrada agora</li>
            </ul>

            <input
              type="email"
              placeholder="Seu e-mail"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(''); }}
              required
              className="border border-sand rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-rust transition-colors w-full mb-2"
            />

            {/* Selo de segurança logo abaixo do e-mail */}
            <div className="flex items-center justify-center gap-1.5 mb-3">
              <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 text-ink/55" stroke="currentColor" strokeWidth="2">
                <rect x="5" y="11" width="14" height="9" rx="2" />
                <path d="M8 11V8a4 4 0 018 0v3" strokeLinecap="round" />
              </svg>
              <span className="text-xs text-ink/55">Pagamento seguro via</span>
              <span className="text-xs font-bold" style={{ color: '#009EE3' }}>Mercado Pago</span>
            </div>

            {error && (
              <p className="text-xs text-red-500 text-center bg-red-50 rounded-lg py-2 px-3 mb-3">
                {error}
              </p>
            )}

            {/* Botões lado a lado */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handlePix}
                disabled={loading !== ''}
                className="flex-1 bg-rust hover:bg-rustDark disabled:opacity-60 text-white rounded-xl py-3.5 font-medium transition-colors duration-300 text-sm"
              >
                {loading === 'pix' ? 'Gerando...' : 'Pagar via Pix'}
              </button>
              <button
                type="button"
                onClick={handleCartao}
                disabled={loading !== ''}
                className="flex-1 bg-rust hover:bg-rustDark disabled:opacity-60 text-white rounded-xl py-3.5 font-medium transition-colors duration-300 text-sm"
              >
                {loading === 'cartao' ? '...' : 'Pagar via cartão'}
              </button>
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

            {expirado ? (
              <div className="mx-auto w-56 py-10">
                <p className="text-ink/50 text-sm mb-4">O QR Code expirou.</p>
                <button
                  type="button"
                  onClick={handlePix}
                  disabled={loading !== ''}
                  className="w-full bg-rust hover:bg-rustDark disabled:opacity-60 text-white rounded-xl py-3 font-medium transition-colors text-sm"
                >
                  {loading === 'pix' ? 'Gerando...' : 'Gerar novo QR Code'}
                </button>
              </div>
            ) : (
              <>
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
                <p className="text-xs text-ink/40 mt-1">Este código expira em {fmtMMSS(secondsLeft)}</p>
              </>
            )}

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
