'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { submitLead } from '@/lib/leads';
import { trackEvent, trackCommerceEvent, identifyUser } from '@/lib/analytics';
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
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [cep, setCep] = useState('');
  const [endereco, setEndereco] = useState('');
  const [numero, setNumero] = useState('');
  const [complemento, setComplemento] = useState('');
  const [bairro, setBairro] = useState('');
  const [cidade, setCidade] = useState('');
  const [estado, setEstado] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const origem = b2bContext ? 'empresas-wizard' : 'starter-kit-wizard';

  // Autocompleta endereço pelo CEP (ViaCEP)
  const handleCepBlur = async () => {
    const clean = cep.replace(/\D/g, '');
    if (clean.length !== 8) return;
    try {
      const res = await fetch(`https://viacep.com.br/ws/${clean}/json/`);
      const data = await res.json();
      if (!data.erro) {
        setEndereco(data.logradouro || '');
        setBairro(data.bairro || '');
        setCidade(data.localidade || '');
        setEstado(data.uf || '');
      }
    } catch {
      /* silencioso — usuário preenche manualmente */
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // 1. Salva a reserva no Firebase (status pendente)
      const reservaId = await submitLead('reservas', {
        nome,
        email,
        telefone,
        endereco,
        numero,
        complemento,
        bairro,
        cidade,
        estado,
        cep,
        plano: cartSelection.planLabel,
        difusor: diffuserName,
        fragrancias: scentNames.join(', '),
        valorReserva: RESERVA_VALOR,
        status: 'pendente',
        origem,
        ...b2bContext,
      });

      const ref = reservaId || `reserva_${Date.now()}`;

      // 2. Analytics
      trackEvent('lead_captured', { plano: cartSelection.planLabel, origem });
      await identifyUser({ email });
      trackCommerceEvent('AddPaymentInfo', {
        contents: [{ contentId: diffuserId, contentType: 'product', contentName: diffuserName }],
        value: RESERVA_VALOR,
      });

      // 3. Cria a cobrança no Mercado Pago (serverless)
      const res = await fetch('/api/create-preference', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome,
          email,
          reservaId: ref,
          origin: window.location.origin,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.init_point) {
        throw new Error(data?.error || 'Não foi possível iniciar o pagamento.');
      }

      // 4. Redireciona para o checkout do Mercado Pago
      window.location.href = data.init_point;
    } catch (err) {
      console.error('[Sinesia Reserva] erro:', err);
      setError(err instanceof Error ? err.message : 'Erro ao processar. Tente novamente.');
      setLoading(false);
    }
  };

  const inputClass =
    'border border-sand rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-rust transition-colors w-full';

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

        <h3 className="font-serif text-2xl text-ink mb-2">Garanta seu Sinesia</h3>

        {/* Valor da reserva */}
        <div className="bg-rust text-white rounded-2xl px-5 py-4 mb-4 text-center">
          <p className="text-white/70 text-xs uppercase tracking-widest mb-0.5">
            Reserva com valor 100% abatível
          </p>
          <p className="font-serif text-4xl font-bold leading-none">R$28,90</p>
          <p className="text-white/80 text-xs mt-1">
            descontado integralmente do valor final do seu pedido
          </p>
        </div>

        {/* Kit reservado */}
        <div className="bg-sand/30 rounded-xl p-3 mb-4 text-sm">
          <p className="text-ink/40 text-xs uppercase tracking-wider mb-1">Seu kit</p>
          <p className="text-ink font-medium">{cartSelection.planLabel}</p>
          <p className="text-ink/60 text-xs">
            {diffuserName} + {scentNames.join(' + ')}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <p className="text-xs text-ink/45 uppercase tracking-wider">Seus dados</p>
          <input
            type="text"
            placeholder="Nome completo"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
            className={inputClass}
          />
          <input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={inputClass}
          />
          <input
            type="tel"
            placeholder="WhatsApp / telefone"
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
            required
            className={inputClass}
          />

          <p className="text-xs text-ink/45 uppercase tracking-wider mt-2">
            Endereço de entrega
          </p>
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="CEP"
              value={cep}
              onChange={(e) => setCep(e.target.value)}
              onBlur={handleCepBlur}
              required
              className={`${inputClass} max-w-[140px]`}
            />
            <input
              type="text"
              placeholder="Cidade"
              value={cidade}
              onChange={(e) => setCidade(e.target.value)}
              required
              className={inputClass}
            />
            <input
              type="text"
              placeholder="UF"
              value={estado}
              onChange={(e) => setEstado(e.target.value)}
              required
              className={`${inputClass} max-w-[80px]`}
              maxLength={2}
            />
          </div>
          <input
            type="text"
            placeholder="Rua / logradouro"
            value={endereco}
            onChange={(e) => setEndereco(e.target.value)}
            required
            className={inputClass}
          />
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Número"
              value={numero}
              onChange={(e) => setNumero(e.target.value)}
              required
              className={`${inputClass} max-w-[120px]`}
            />
            <input
              type="text"
              placeholder="Complemento (opcional)"
              value={complemento}
              onChange={(e) => setComplemento(e.target.value)}
              className={inputClass}
            />
          </div>
          <input
            type="text"
            placeholder="Bairro"
            value={bairro}
            onChange={(e) => setBairro(e.target.value)}
            required
            className={inputClass}
          />

          {error && (
            <p className="text-xs text-red-500 text-center bg-red-50 rounded-lg py-2 px-3">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="bg-rust hover:bg-rustDark disabled:opacity-60 text-white rounded-xl py-4 font-medium transition-colors duration-300 text-sm mt-2"
          >
            {loading ? 'Redirecionando...' : 'Pagar R$28,90 e reservar'}
          </button>
          <p className="text-[11px] text-ink/40 text-center leading-relaxed">
            Pagamento seguro via Mercado Pago (Pix ou cartão). Reembolso total em até 60 dias.
          </p>
        </form>
      </motion.div>
    </div>
  );
}
