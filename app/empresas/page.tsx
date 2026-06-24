import type { Metadata } from 'next';
import Image from 'next/image';
import EmpresasWizard from '@/components/sections/EmpresasWizard';

export const metadata: Metadata = {
  title: 'Para Empresas — Sinesia',
  description:
    'Aromatização inteligente para escritórios, consultórios, salões e pequenos comércios. Sem equipamento caro, sem visita técnica.',
};

export default function EmpresasPage() {
  return (
    <>
      <section className="relative min-h-[60vh] flex items-center overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=2000&q=80"
          alt="Escritório moderno"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/80 via-ink/50 to-ink/20" />
        <div className="container-page relative z-10 py-24">
          <div className="max-w-2xl text-white">
            <span className="inline-block rounded-full bg-white/10 backdrop-blur px-4 py-1.5 text-xs uppercase tracking-widest mb-6">
              Sinesia para empresas
            </span>
            <h1 className="font-serif text-4xl md:text-6xl leading-[1.1] mb-6">
              O ambiente que seus clientes vão notar
            </h1>
            <p className="text-lg text-white/80 mb-10 max-w-xl">
              Aromatização inteligente para escritórios, consultórios, salões e pequenos
              comércios. Sem equipamento caro, sem visita técnica.
            </p>
          </div>
        </div>
      </section>

      <EmpresasWizard />
    </>
  );
}
