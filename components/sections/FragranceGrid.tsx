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
            Cada fragrância foi desenvolvida para amplificar um estado emocional específico. Expanda
            para ler os benefícios de aromaterapia.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
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
                {/* Image / color card */}
                <div
                  className="relative aspect-[3/4] w-full flex flex-col justify-end p-3"
                  style={{ backgroundColor: scent.cardColor }}
                >
                  {scent.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={scent.image}
                      alt={scent.name}
                      className="absolute inset-0 w-full h-full object-contain p-4"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <svg
                        viewBox="0 0 40 40"
                        className="h-14 w-14 text-white/15"
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
                    <h3 className="font-serif text-white text-sm leading-tight">{scent.name}</h3>
                  </div>
                </div>

                {/* Card bottom */}
                <div className="bg-white border border-sand border-t-0 rounded-b-2xl px-3 py-2.5 text-left">
                  <p className="text-[11px] text-ink/50 line-clamp-2 leading-snug">{scent.mood}</p>
                  <span className="inline-flex items-center gap-1 text-[11px] text-rust font-medium mt-1.5">
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
                    <div className="bg-sand/25 rounded-2xl mt-2 p-4 border border-sand/60">
                      <p className="text-[10px] uppercase tracking-widest text-rust/70 mb-2">
                        Aromaterapia
                      </p>
                      <p className="text-xs text-ink/65 leading-relaxed">{scent.aromatherapy}</p>
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
            Escolher minhas fragrâncias
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
