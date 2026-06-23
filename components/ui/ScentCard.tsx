'use client';

import { motion } from 'framer-motion';

export interface Scent {
  name: string;
  family: string;
  description: string;
}

export default function ScentCard({ scent }: { scent: Scent }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5 }}
      className="group rounded-2xl bg-white border border-sand/70 p-8 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
    >
      <div className="mb-4 h-12 w-12 rounded-full bg-sand flex items-center justify-center text-sage group-hover:bg-sage group-hover:text-white transition-colors">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="h-6 w-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 2c1.5 2 3 4.5 3 7a3 3 0 11-6 0c0-2.5 1.5-5 3-7z"
          />
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13h14l-1.5 8h-11L5 13z" />
        </svg>
      </div>
      <p className="text-xs uppercase tracking-widest text-sage font-medium mb-2">
        {scent.family}
      </p>
      <h3 className="font-serif text-xl mb-2">{scent.name}</h3>
      <p className="text-sm text-ink/70 leading-relaxed">{scent.description}</p>
    </motion.div>
  );
}
