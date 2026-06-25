'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { scents } from '@/lib/products';

export default function FragranceGrid() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <section id="fragrancias" className="section-padding bg-white">
      <div className="container-page">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="inline-block rounded-full bg-rust/10 text-rust px-4 py-1.5 text-xs uppercase tracking-widest mb-4">
            Fragrâncias
          </span>
          <h2 className="font-serif text-3xl md:text-5xl text-ink mb-4">
            8 essências premium
          </h2>
          <p className="text-ink/60 max-w-xl mx-auto text-sm">
            Cada fragrância foi desenvolvida para amplificar um estado emocional específico.
            Toque em qualquer essência para ver os benefícios de aromaterapia.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {scents.map((scent, index) => (
            <motion.div
              key={scent.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="flex flex-col"
            >
              <button
                className="rounded-2xl overflow-hidden cursor-pointer text-left w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-rust"
                onClick={() => setExpandedId(expandedId === scent.id ? null : scent.id)}
                aria-expanded={expandedId === scent.id}
              >
                {/* Compact image area */}
                <div
                  className="relative aspect-[4/3] w-full flex flex-col justify-end p-2"
                  style={{ backgroundColor: scent.cardColor }}
                >
                  {scent.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={scent.image}
                      alt={scent.name}
                      className="absolute inset-0 w-full h-full object-contain p-2"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <svg
                        viewBox="0 0 40 40"
                        className="h-10 w-10 text-white/15"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      >
                        <rect x="2" y="2" width="36" height="36" rx="4" />
                        <path d="M8 8l24 24M32 8L8 32" />
                      </svg>
                    </div>
                  )}
                  <div className="relative z-10">
                    <p className="text-white/60 text-[10px] uppercase tracking-wide leading-none mb-0.5">
                      {scent.family}
                    </p>
                  </div>
                </div>

                {/* Card bottom */}
                <div className="bg-white border border-sand border-t-0 rounded-b-2xl px-3 py-3 text-left">
                  <h3 className="font-serif text-base text-ink leading-tight mb-1">{scent.name}</h3>
                  <p className="text-xs text-ink/50 leading-snug mb-2">{scent.mood}</p>
                  <span className="inline-flex items-center gap-1 text-xs text-rust font-semibold">
                    Benefícios
                    <motion.span
                      animate={{ rotate: expandedId === scent.id ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="inline-block"
                    >
                      ↓
                    </motion.span>
                  </span>
                </div>
              </button>

              {/* Expandable aromatherapy */}
              <AnimatePresence>
                {expandedId === scent.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <div className="bg-sand/25 rounded-2xl mt-2 p-4 border border-sand/50">
                      <p className="text-[10px] uppercase tracking-widest text-rust mb-2 font-semibold">
                        Benefícios de aromaterapia
                      </p>
                      <p className="text-sm text-ink/70 leading-relaxed">{scent.aromatherapy}</p>
                      <p className="text-[10px] text-ink/35 mt-3 italic leading-snug">
                        Notas: {scent.notes}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-center mt-12"
        >
          <Link
            href="/starter-kit"
            className="inline-block bg-rust hover:bg-rustDark text-white rounded-full px-8 py-3.5 text-sm font-medium transition-colors duration-300"
          >
            Escolher minhas essências
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
