'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { KIT_PRICE, RESERVATION_VALUE } from '@/lib/wizard';

const FAQS: { q: string; a: string }[] = [
  {
    q: 'Quando a Lûmance lança?',
    a: 'Estamos em pré-lançamento. A primeira leva será enviada para a lista VIP e as reservas de fundadora antes de qualquer venda pública. Ao entrar na lista, você recebe a data exata por email em primeira mão.',
  },
  {
    q: 'A reserva é cobrada agora?',
    a: `Não. A reserva de fundadora é de ${RESERVATION_VALUE}, totalmente reembolsável, e nenhum valor é cobrado hoje. Ela apenas garante sua prioridade e o preço de lançamento. Você confirma a compra quando o produto estiver pronto para envio.`,
  },
  {
    q: 'Como a máscara de luz funciona?',
    a: 'A Lûmance usa LED de três comprimentos de onda — vermelho para colágeno, âmbar para uniformidade e azul para oleosidade. Você escolhe o objetivo, veste a máscara por cerca de 10 minutos e ela cuida do resto, com as mãos livres.',
  },
  {
    q: 'Posso cancelar depois de reservar?',
    a: 'Sim. Como nenhum valor é cobrado na reserva, você pode desistir a qualquer momento antes do envio, sem custo e sem burocracia. Se optar por pagar a reserva reembolsável, o valor é devolvido integralmente caso não queira seguir.',
  },
  {
    q: 'Qual será o preço no lançamento?',
    a: `O kit Lûmance completo terá preço de referência de ${KIT_PRICE}. Quem está na lista VIP ou fez reserva de fundadora garante 30% de desconto travado sobre esse valor.`,
  },
  {
    q: 'É seguro usar em casa?',
    a: 'Sim. A terapia de luz LED é não invasiva, não gera calor relevante e não emite radiação UV. A Lûmance é feita de silicone médico flexível e conta com timer automático para uma sessão segura e confortável.',
  },
];

function Item({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-ink/10">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-4 py-5 text-left"
        aria-expanded={open}
      >
        <span className="font-serif text-lg text-ink">{q}</span>
        <span
          className={`shrink-0 text-xl text-ink/40 transition-transform duration-300 ${
            open ? 'rotate-45' : ''
          }`}
          aria-hidden="true"
        >
          +
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <p className="pb-5 pr-8 text-sm leading-relaxed text-ink/65">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQ() {
  return (
    <section id="faq" className="bg-offwhite py-24">
      <div className="mx-auto max-w-3xl px-6">
        <h2 className="text-center font-serif text-3xl font-medium text-ink sm:text-4xl">
          Perguntas frequentes
        </h2>
        <div className="mt-12">
          {FAQS.map((f) => (
            <Item key={f.q} q={f.q} a={f.a} />
          ))}
        </div>
      </div>
    </section>
  );
}
