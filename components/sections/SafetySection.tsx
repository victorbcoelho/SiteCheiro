'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

const badges = [
  'Seguro para uso diário quando usado conforme indicado',
  'Aprovado para espaços familiares compartilhados',
  'Livre de crueldade: sem testes em animais',
  'Desenvolvido para lares com gatos e cachorros',
];

export default function SafetySection() {
  return (
    <section className="bg-white py-12 md:py-16">
      <div className="container-page">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row items-start gap-8 max-w-3xl mx-auto"
        >
          {/* Shield + checkmark icon */}
          <div className="shrink-0 h-24 w-24 rounded-full bg-offwhite border-2 border-sand flex items-center justify-center mx-auto md:mx-0">
            <svg viewBox="0 0 64 64" fill="none" className="h-14 w-14" stroke="#2B2B2B" strokeWidth="1.5">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M32 8L12 17V34C12 44.5 21 53 32 57C43 53 52 44.5 52 34V17L32 8Z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M22 32L29 39L42 26"
              />
            </svg>
          </div>

          <div className="text-center md:text-left">
            <div className="inline-flex items-center gap-2 rounded-full bg-rust/10 text-rust px-4 py-1.5 text-xs uppercase tracking-widest mb-3">
              <span>✓</span> Seguro para toda a família
            </div>
            <h2 className="font-serif text-2xl md:text-3xl text-ink mb-3">
              Seguro e limpo — inclusive para seus pets
            </h2>
            <p className="text-sm text-ink/60 leading-relaxed mb-5">
              Nossas fragrâncias premium são formuladas sem parabenos, ftalatos
              ou compostos tóxicos. Testadas e certificadas para uso domiciliar.
            </p>
            <ul className="space-y-2 mb-6 text-left">
              {badges.map((badge) => (
                <li key={badge} className="flex items-center gap-2 text-sm text-ink/65">
                  <span className="text-rust shrink-0">✓</span>
                  {badge}
                </li>
              ))}
            </ul>
            <Link
              href="#fragrancias"
              className="inline-block border border-ink/20 text-ink/70 hover:border-rust hover:text-rust rounded-full px-6 py-2.5 text-sm font-medium transition-colors duration-300"
            >
              Conhecer mais
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
