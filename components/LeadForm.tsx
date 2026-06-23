'use client';

import { FormEvent, useState } from 'react';
import { motion } from 'framer-motion';
import Button from './ui/Button';
import { submitLead, LeadCollection } from '@/lib/leads';
import { trackEvent } from '@/lib/analytics';

interface LeadFormProps {
  collection: LeadCollection;
  origem: string;
  variant?: 'b2c' | 'b2b';
  dark?: boolean;
}

const planOptions = ['Starter', 'Duo', 'Escritório'];
const segmentOptions = [
  'Escritório / Coworking',
  'Consultório / Clínica',
  'Salão / Estúdio',
  'Comércio / Loja',
  'Outro',
];

export default function LeadForm({
  collection,
  origem,
  variant = 'b2c',
  dark = false,
}: LeadFormProps) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>(
    'idle'
  );
  const [form, setForm] = useState({
    nome: '',
    email: '',
    whatsapp: '',
    plano: planOptions[1],
    empresa: '',
    segmento: segmentOptions[0],
    pontos: '',
  });

  const update = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      if (variant === 'b2b') {
        await submitLead(collection, {
          nome: form.nome,
          empresa: form.empresa,
          segmento: form.segmento,
          pontos: form.pontos,
          whatsapp: form.whatsapp,
          email: form.email,
          origem,
        });
      } else {
        await submitLead(collection, {
          nome: form.nome,
          email: form.email,
          whatsapp: form.whatsapp,
          plano: form.plano,
          origem,
        });
      }
      await trackEvent('lead_captured', { origem, variant });
      setStatus('success');
    } catch (err) {
      setStatus('error');
    }
  };

  const inputClasses = `w-full rounded-xl border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rust transition-colors ${
    dark
      ? 'bg-white/10 border-white/20 text-white placeholder:text-white/50'
      : 'bg-white border-sand text-ink placeholder:text-ink/40'
  }`;

  if (status === 'success') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className={`rounded-2xl p-8 text-center ${
          dark ? 'bg-white/10 text-white' : 'bg-rust/10 text-ink'
        }`}
      >
        <p className="font-serif text-2xl mb-2">Perfeito! Você está na lista.</p>
        <p className={dark ? 'text-white/70' : 'text-ink/70'}>
          {variant === 'b2b'
            ? 'Ótimo! Nossa equipe vai entrar em contato em até 24h.'
            : 'Entraremos em contato com prioridade no lançamento.'}
        </p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          required
          placeholder="Nome"
          className={inputClasses}
          value={form.nome}
          onChange={update('nome')}
        />
        {variant === 'b2b' ? (
          <input
            required
            placeholder="Empresa"
            className={inputClasses}
            value={form.empresa}
            onChange={update('empresa')}
          />
        ) : (
          <input
            required
            type="email"
            placeholder="Email"
            className={inputClasses}
            value={form.email}
            onChange={update('email')}
          />
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          required
          placeholder="WhatsApp"
          className={inputClasses}
          value={form.whatsapp}
          onChange={update('whatsapp')}
        />
        {variant === 'b2b' ? (
          <select
            className={inputClasses}
            value={form.segmento}
            onChange={update('segmento')}
          >
            {segmentOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        ) : (
          <select className={inputClasses} value={form.plano} onChange={update('plano')}>
            {planOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        )}
      </div>

      {variant === 'b2b' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            required
            placeholder="Quantos pontos precisam"
            className={inputClasses}
            value={form.pontos}
            onChange={update('pontos')}
          />
          <input
            required
            type="email"
            placeholder="Email"
            className={inputClasses}
            value={form.email}
            onChange={update('email')}
          />
        </div>
      )}

      <Button
        type="submit"
        disabled={status === 'loading'}
        variant={dark ? 'secondary' : 'primary'}
        className="w-full"
      >
        {status === 'loading'
          ? 'Enviando...'
          : variant === 'b2b'
          ? 'Falar com consultor'
          : 'Garantir minha vaga'}
      </Button>

      {status === 'error' && (
        <p className="text-sm text-red-600">
          Algo deu errado. Tente novamente em instantes.
        </p>
      )}
    </form>
  );
}
