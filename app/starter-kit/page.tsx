import type { Metadata } from 'next';
import StarterKitWizard from '@/components/sections/StarterKitWizard';

export const metadata: Metadata = {
  title: 'Monte seu Starter Kit — Sinesia',
  description:
    'Monte o kit Sinesia ideal para o seu ambiente em menos de 2 minutos. Escolha o difusor, as fragrâncias e o plano que faz sentido pra você.',
};

export default function StarterKitPage() {
  return <StarterKitWizard />;
}
