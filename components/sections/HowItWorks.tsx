'use client';

import { motion } from 'framer-motion';

const steps = [
  {
    number: '01',
    title: 'Escolha seus aromas',
    description: 'Curadoria de fragrâncias criadas por perfumistas.',
  },
  {
    number: '02',
    title: 'Plugue na tomada',
    description: 'O Sopre fica à vista como um objeto decorativo.',
  },
  {
    number: '03',
    title: 'Esqueça',
    description: 'O app controla tudo. O refil chega antes de acabar.',
  },
];

export default function HowItWorks() {
  return (
    <section id="como-funciona" className="section-padding bg-white">
      <div className="container-page">
        <h2 className="font-serif text-3xl md:text-5xl text-center mb-16">
          Simples assim
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.12 }}
              className="text-center"
            >
              <p className="font-serif text-5xl text-rust mb-4">{step.number}</p>
              <h3 className="font-serif text-xl mb-3">{step.title}</h3>
              <p className="text-sm text-ink/60 max-w-xs mx-auto leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
