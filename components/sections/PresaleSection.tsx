import CounterBadge from '@/components/ui/CounterBadge';
import LeadForm from '@/components/LeadForm';

export default function PresaleSection() {
  return (
    <section id="pre-venda" className="section-padding bg-ink text-white">
      <div className="container-page grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div>
          <h2 className="font-serif text-3xl md:text-5xl mb-4">
            Primeira leva — Seja um dos fundadores
          </h2>
          <p className="text-white/70 mb-8 max-w-md">
            Garanta o Starter Kit com desconto de fundador. Sem cobrança agora.
            Aparelho incluso para quem entrar antes do lançamento.
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
