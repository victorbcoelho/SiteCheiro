import type { Metadata } from 'next';
import Link from 'next/link';
import CounterBadge from '@/components/ui/CounterBadge';
import LeadForm from '@/components/LeadForm';

export const metadata: Metadata = {
  title: 'Pré-venda',
  description:
    'Garanta sua vaga na primeira leva do Sopre.me com desconto de fundador. Sem cobrança agora.',
};

const guarantees = [
  'Nenhuma cobrança agora',
  'Cancelamento com 1 clique',
  'Reembolso garantido se atrasarmos',
];

const testimonials = [
  {
    name: 'Marina A.',
    quote: 'Entrei na lista assim que vi. Cansei de varetinha que não funciona.',
  },
  {
    name: 'Diego R.',
    quote: 'Se for parecido com o Pura americano, já é um sucesso aqui em casa.',
  },
  {
    name: 'Camila S.',
    quote: 'Amei a ideia de programar pelo app. Esperando ansiosa o lançamento.',
  },
];

export default function PreVendaPage() {
  return (
    <main className="min-h-screen bg-offwhite">
      <div className="container-page py-8">
        <Link href="/" className="font-serif text-2xl tracking-tight">
          sopre.me
        </Link>
      </div>

      <section className="container-page pb-20">
        <div className="max-w-2xl mx-auto text-center mb-12">
          <h1 className="font-serif text-4xl md:text-5xl mb-4">
            Você está garantindo sua vaga
          </h1>
          <p className="text-ink/60 mb-6">
            Primeira leva limitada. Desconto de fundador. Entrega prevista para
            outubro de 2026.
          </p>
          <div className="flex justify-center">
            <CounterBadge />
          </div>
        </div>

        <div className="max-w-xl mx-auto bg-white border border-sand rounded-3xl p-8 md:p-10 mb-12">
          <LeadForm collection="leads" origem="pre-venda" />
        </div>

        <div className="flex flex-wrap justify-center gap-4 mb-20">
          {guarantees.map((item) => (
            <span
              key={item}
              className="inline-flex items-center gap-2 rounded-full bg-rust/10 text-rust px-4 py-2 text-xs font-medium"
            >
              {item}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {testimonials.map((t) => (
            <div key={t.name} className="rounded-2xl bg-white border border-sand p-6">
              <div className="h-10 w-10 rounded-full bg-sand mb-4" />
              <p className="text-sm text-ink/70 mb-4">&ldquo;{t.quote}&rdquo;</p>
              <p className="text-xs font-medium text-ink/50">{t.name}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
