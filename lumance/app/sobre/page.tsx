import type { Metadata } from 'next';
import Link from 'next/link';
import TopBar from '@/components/sections/TopBar';
import Navbar from '@/components/sections/Navbar';
import Footer from '@/components/sections/Footer';
import Placeholder from '@/components/ui/Placeholder';

export const metadata: Metadata = {
  title: 'Sobre · Lûmance',
  description:
    'A história da Lûmance — por que trouxemos a terapia de luz de nível clínico para o seu ritual em casa.',
};

export default function SobrePage() {
  return (
    <>
      <TopBar />
      <Navbar />
      <main className="mx-auto max-w-4xl px-6 py-20">
        <p className="text-xs uppercase tracking-[0.3em] text-gold">Sobre</p>
        <h1 className="mt-4 font-serif text-4xl font-medium leading-tight text-ink sm:text-5xl">
          Nascemos de uma pausa.
        </h1>

        <div className="mt-10">
          <Placeholder ratio="editorial" label="editorial Lûmance" />
        </div>

        <div className="mt-12 space-y-5 text-lg leading-relaxed text-ink/70">
          <p>
            A Lûmance começou com uma inquietação simples: por que a tecnologia
            de cuidado com a pele mais respeitada pelos dermatologistas — a
            terapia de luz — continuava presa a consultórios, agendas apertadas e
            sessões caras?
          </p>
          <p>
            Passamos meses estudando protocolos clínicos, testando LEDs e
            materiais, conversando com esteticistas e dermatologistas. Queríamos
            algo que fosse ao mesmo tempo sério na tecnologia e leve na
            experiência — um objeto bonito, confortável, que você tivesse
            vontade de usar todos os dias.
          </p>
          <p>
            O resultado é uma máscara de luz de silicone médico flexível, com
            três comprimentos de onda e um ritual de dez minutos. Não é sobre
            mais uma etapa na rotina. É sobre transformar esses dez minutos num
            momento de silêncio que é só seu — e que, semana após semana, aparece
            no espelho.
          </p>
          <p>
            Estamos em pré-lançamento, construindo isso junto com as primeiras
            pessoas que acreditaram. Se você chegou até aqui, essa história também
            é sua.
          </p>
        </div>

        <div className="mt-14">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-ink px-6 py-3 text-sm text-ink transition-colors hover:bg-ink hover:text-offwhite"
          >
            ← Voltar para a home
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
