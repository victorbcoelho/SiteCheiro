import CounterBadge from '@/components/ui/CounterBadge';
import LeadForm from '@/components/LeadForm';

export default function PresaleSection() {
  return (
    <section id="pre-venda" className="section-padding bg-ink text-white">
      <div className="container-page grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div>
          <h2 className="font-serif text-3xl md:text-5xl mb-4">
            Pré-lançamento — Seja um dos primeiros
          </h2>
          <p className="text-white/70 mb-8 max-w-md">
            Estamos chegando. Garanta sua vaga na primeira leva com desconto de
            fundador.
          </p>
          <CounterBadge />
        </div>

        <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
          <LeadForm collection="leads" origem="home" dark />
        </div>
      </div>
    </section>
  );
}
