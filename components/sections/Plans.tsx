import PlanCard, { Plan } from '@/components/ui/PlanCard';

const plans: Plan[] = [
  {
    name: 'Starter',
    tagline: 'Aparelho + 1 aroma por mês',
    devicePrice: 'R$279 (ou R$0 com assinatura anual)',
    subscriptionPrice: 'R$49,90',
    features: [
      '1 refil por mês',
      'Frete grátis',
      'Controle pelo app',
      'Garantia enquanto assinar',
    ],
    ctaLabel: 'Começar com Starter',
  },
  {
    name: 'Duo',
    tagline: 'Aparelho + 2 aromas alternados por mês',
    devicePrice: 'R$279 (ou R$0 com assinatura anual)',
    subscriptionPrice: 'R$79,90',
    features: [
      '2 refis por mês',
      'Frete grátis',
      'App com programação de horário',
      'Alternância entre aromas',
      'Garantia vitalícia enquanto assinar',
    ],
    ctaLabel: 'Quero o Duo',
    highlighted: true,
  },
];

export default function Plans() {
  return (
    <section id="planos" className="section-padding bg-offwhite">
      <div className="container-page">
        <h2 className="font-serif text-3xl md:text-5xl text-center mb-16">
          Escolha seu plano
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan) => (
            <PlanCard key={plan.name} plan={plan} />
          ))}
        </div>

        <p className="text-center text-sm text-ink/50 mt-10">
          Cancele quando quiser. Sem fidelidade forçada. Sem pegadinha.
        </p>
      </div>
    </section>
  );
}
