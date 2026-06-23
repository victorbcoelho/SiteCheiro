'use client';

import { motion } from 'framer-motion';
import Button from './Button';

export interface Plan {
  name: string;
  tagline: string;
  devicePrice: string;
  subscriptionPrice: string;
  features: string[];
  ctaLabel: string;
  highlighted?: boolean;
}

export default function PlanCard({ plan }: { plan: Plan }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5 }}
      className={`relative flex flex-col rounded-3xl p-8 md:p-10 border ${
        plan.highlighted
          ? 'bg-ink text-white border-ink shadow-xl md:scale-105'
          : 'bg-white text-ink border-sand'
      }`}
    >
      {plan.highlighted && (
        <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-sage text-white text-xs uppercase tracking-widest px-4 py-1.5 rounded-full">
          Mais popular
        </span>
      )}
      <h3 className="font-serif text-2xl md:text-3xl mb-1">{plan.name}</h3>
      <p
        className={`text-sm mb-6 ${
          plan.highlighted ? 'text-white/70' : 'text-ink/60'
        }`}
      >
        {plan.tagline}
      </p>

      <div className="mb-6">
        <p className="text-sm mb-1 opacity-70">Aparelho: {plan.devicePrice}</p>
        <p className="font-serif text-3xl md:text-4xl">
          {plan.subscriptionPrice}
          <span className="text-base font-sans opacity-60">/mês</span>
        </p>
      </div>

      <ul className="space-y-3 mb-8 flex-1">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-start gap-3 text-sm">
            <span
              className={`mt-1 h-1.5 w-1.5 rounded-full shrink-0 ${
                plan.highlighted ? 'bg-sage' : 'bg-sage'
              }`}
            />
            <span className={plan.highlighted ? 'text-white/85' : 'text-ink/80'}>
              {feature}
            </span>
          </li>
        ))}
      </ul>

      <Button
        href="/pre-venda"
        variant={plan.highlighted ? 'secondary' : 'primary'}
        className="w-full"
      >
        {plan.ctaLabel}
      </Button>
    </motion.div>
  );
}
