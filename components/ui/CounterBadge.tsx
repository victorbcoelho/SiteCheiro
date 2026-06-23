'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getLeadCount } from '@/lib/leads';

export default function CounterBadge({ className = '' }: { className?: string }) {
  const [count, setCount] = useState(47);

  useEffect(() => {
    let mounted = true;
    getLeadCount().then((value) => {
      if (mounted) setCount(value);
    });
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <motion.div
      key={count}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className={`inline-flex items-center gap-2 rounded-full bg-rust/15 text-rust px-4 py-2 text-sm font-medium ${className}`}
    >
      <span className="h-2 w-2 rounded-full bg-rust animate-pulse" />
      Já são {count} pessoas na lista
    </motion.div>
  );
}
