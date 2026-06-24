'use client';

import { motion } from 'framer-motion';

export default function SafetySection() {
  return (
    <section className="bg-white py-12 md:py-16">
      <div className="container-page">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row items-center gap-8 max-w-3xl mx-auto text-center md:text-left"
        >
          <div className="shrink-0 h-24 w-24 rounded-full bg-offwhite border-2 border-sand flex items-center justify-center">
            <svg viewBox="0 0 64 64" fill="none" className="h-14 w-14" stroke="#2B2B2B" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M32 8C20 8 12 18 12 18s-4 12 0 20c4 8 12 14 20 18 8-4 16-10 20-18 4-8 0-20 0-20S44 8 32 8z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M22 34c2-4 6-6 10-6s8 2 10 6" />
              <circle cx="25" cy="27" r="2" fill="#2B2B2B" stroke="none" />
              <circle cx="39" cy="27" r="2" fill="#2B2B2B" stroke="none" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M26 42c2 2 5 3 6 3s4-1 6-3" />
            </svg>
          </div>

          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-rust/10 text-rust px-4 py-1.5 text-xs uppercase tracking-widest mb-3">
              <span>✓</span> Seguro para toda a família
            </div>
            <h2 className="font-serif text-2xl md:text-3xl text-ink mb-3">
              Seguro e limpo — inclusive para seus pets
            </h2>
            <p className="text-sm text-ink/60 leading-relaxed">
              Nossas fragrâncias premium são formuladas sem parabenos, ftalatos
              ou compostos tóxicos. Testadas e certificadas para uso domiciliar
              seguro — incluindo crianças e animais de estimação.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
