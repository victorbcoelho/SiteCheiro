'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

const features = [
  'Programe horários (manhã/tarde/noite)',
  'Alterne entre 2 aromas automaticamente',
  'Monitore o nível do refil em tempo real',
  'Receba o refil novo antes de acabar',
];

export default function AppShowcase() {
  return (
    <section className="section-padding bg-white">
      <div className="container-page grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative mx-auto w-full max-w-xs aspect-[9/19] rounded-[2.5rem] overflow-hidden border-8 border-ink shadow-2xl"
        >
          <Image
            src="https://images.unsplash.com/photo-1551650975-87deedd944c3?auto=format&fit=crop&w=800&q=80"
            alt="Mockup do app Sopre.me no celular"
            fill
            className="object-cover"
          />
        </motion.div>

        <div>
          <h2 className="font-serif text-3xl md:text-5xl mb-8">
            Tudo na palma da sua mão
          </h2>
          <ul className="space-y-5">
            {features.map((feature, index) => (
              <motion.li
                key={feature}
                initial={{ opacity: 0, x: 16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="flex items-start gap-4"
              >
                <span className="mt-1 h-7 w-7 rounded-full bg-rust text-white flex items-center justify-center text-xs shrink-0">
                  {index + 1}
                </span>
                <span className="text-ink/80">{feature}</span>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
