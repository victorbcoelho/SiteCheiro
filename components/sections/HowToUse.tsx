'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import ImagePlaceholder from '@/components/ui/ImagePlaceholder';

const steps = [
  {
    number: '01',
    title: 'Escolha um difusor',
    description:
      'Leve em conta o tamanho do ambiente. O Sinesia Home cobre até 30 m². O Sinesia Tower cobre até 60 m² e ainda é uma caixa de som.',
    cta: { label: 'Ver modelos', href: '#tecnologia' },
    visual: <ImagePlaceholder className="w-full h-full rounded-2xl" label="foto do difusor" />,
  },
  {
    number: '02',
    title: 'Escolha as fragrâncias',
    description:
      'Ache sua favorita entre as 8 essências premium — cada uma criada para amplificar uma emoção diferente no seu ambiente.',
    cta: { label: 'Ver fragrâncias', href: '#fragrancias' },
    visual: (
      <div className="w-full h-full rounded-2xl bg-sand/30 flex items-center justify-center gap-4 p-4">
        {['/images/sinesia-brisa-do-mar.jpg', '/images/sinesia-lavanda-provence.jpg'].map((src, i) => (
          <div key={i} className="relative flex-1 h-full rounded-xl overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt="" className="w-full h-full object-contain" />
          </div>
        ))}
      </div>
    ),
  },
  {
    number: '03',
    title: 'Baixe o app',
    description:
      'Customize a intensidade do aroma, o volume do áudio e alterne entre 2 fragrâncias automaticamente. Tudo na palma da mão.',
    cta: { label: 'Montar meu kit', href: '/starter-kit' },
    visual: <ImagePlaceholder className="w-full h-full rounded-2xl" label="foto do app" />,
  },
];

export default function HowToUse() {
  return (
    <section id="como-funciona" className="section-padding bg-offwhite">
      <div className="container-page">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-serif text-3xl md:text-5xl text-ink mb-4">
            Do que você precisa
          </h2>
          <p className="text-ink/60 max-w-xl mx-auto">
            Três passos simples para transformar qualquer ambiente em uma
            experiência multissensorial.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: index * 0.12 }}
              className="flex flex-col gap-5"
            >
              <div className="aspect-[4/3] w-full">{step.visual}</div>

              <div>
                <p className="font-serif text-4xl text-rust/30 mb-2">{step.number}</p>
                <h3 className="font-serif text-xl text-ink mb-2">{step.title}</h3>
                <p className="text-sm text-ink/60 leading-relaxed mb-4">{step.description}</p>
                <Link
                  href={step.cta.href}
                  className="text-sm font-medium text-rust hover:text-rustDark underline underline-offset-4 transition-colors duration-300"
                >
                  {step.cta.label} →
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
