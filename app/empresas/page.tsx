import type { Metadata } from 'next';
import Image from 'next/image';
import EmpresasPage from '@/components/sections/EmpresasPage';

export const metadata: Metadata = {
  title: 'Para Empresas — Sinesia',
  description:
    'Aromatização inteligente para escritórios, consultórios, salões e pequenos comércios. Sem mensalidade cara, sem visita técnica.',
};

export default function EmpresasRoute() {
  return <EmpresasPage />;
}
