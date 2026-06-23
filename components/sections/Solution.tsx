'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';

const features = [
  {
    title: '2 aromas independentes',
    description: 'Manhã cítrica, noite relaxante. Você programa, o Sopre faz.',
  },
  {
    title: 'Controle pelo app',
    description: 'Ligue, desligue, programe horários. Do sofá ou de fora de casa.',
  },
  {
    title: 'Refil que chega antes de acabar',
    description: 'Assinatura automática. Sua casa nunca fica sem cheiro.',
  },
  {
    title: 'Silencioso e bonito',
    description: 'Fica à mostra. Não faz barulho. Não usa água.',
  },
];

export default function Solution() {
  return (
    <section className="section-padding bg-white">
      <div className="container-page grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative aspect-square rounded-3xl overflow-hidden bg-sand"
        >
          <Image
            src="https://images.unsplash.com/photo-1602910344008-22f323cc1817?auto=format&fit=crop&w=1200&q=80"
            alt="Difusor de aroma Sopre.me sobre mesa de madeira"
            fill
            className="object-cover"
          />
        </motion.div>

        <div>
          <h2 className="font-serif text-3xl md:text-5xl mb-4">Conheça o Sopre</h2>
          <p className="text-ink/60 mb-10 max-w-md">
            Um objeto de decoração que também cuida do cheiro da sua casa, em
            piloto automático.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-10">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
              >
                <h3 className="font-serif text-lg mb-2">{feature.title}</h3>
                <p className="text-sm text-ink/60 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>

          <Button href="/pre-venda" size="lg">
            Quero o meu
          </Button>
        </div>
      </div>
    </section>
  );
}
