'use client';

import { motion } from 'framer-motion';

const problems = [
  {
    title: 'Varetinhas',
    description: 'Cheiro fraco. Esqueceu de molhar. Borrifou água por semana.',
  },
  {
    title: 'Spray',
    description: 'Dura 5 minutos. Você esquece de aplicar. A casa fica sem cheiro.',
  },
  {
    title: 'Ultrassônico',
    description: 'Barulhento. Quebra fácil. Precisa de água toda hora.',
  },
];

export default function Problem() {
  return (
    <section className="section-padding bg-offwhite">
      <div className="container-page">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-serif text-3xl md:text-5xl text-center mb-16"
        >
          Você já tentou de tudo, né?
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {problems.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="rounded-2xl bg-white border border-sand p-8"
            >
              <h3 className="font-serif text-xl mb-3">{item.title}</h3>
              <p className="text-ink/70 text-sm leading-relaxed">{item.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="text-center font-serif text-xl md:text-2xl mt-16 max-w-2xl mx-auto"
        >
          O problema nunca foi o produto. Foi o atrito de manter ele funcionando.
        </motion.p>
      </div>
    </section>
  );
}
