import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Sobre — Sinesia',
  description:
    'A Sinesia nasceu de uma pergunta simples: por que é tão difícil ter uma casa que cheira bem o tempo todo?',
};

export default function SobrePage() {
  return (
    <main className="bg-offwhite min-h-screen">
      <div className="container-page py-20 max-w-2xl">
        <Link
          href="/"
          className="text-xs uppercase tracking-widest text-ink/40 hover:text-ink transition-colors duration-300 mb-10 inline-block"
        >
          ← Voltar
        </Link>

        <h1 className="font-serif text-4xl md:text-5xl text-ink mb-4 leading-tight">
          Nascemos de um cheiro de casa.
        </h1>

        <div className="w-10 h-0.5 bg-rust mb-10" />

        <div className="space-y-5 text-ink/70 leading-relaxed text-[1.05rem]">
          <p>
            A Sinesia começou com uma pergunta simples: por que é tão difícil ter uma casa que cheira bem o tempo todo?
          </p>
          <p>
            Velas apagam. Sprays somem em minutos. Aromatizadores de prateleira enjoam rápido ou nem preenchem o ambiente. A gente queria algo diferente — um aroma constante, sutil e sofisticado, que fizesse da casa um lugar ainda mais nosso.
          </p>
          <p>
            Foi disso que nasceu a Sinesia: a união entre tecnologia e sensorialidade para transformar qualquer ambiente numa experiência. Um difusor inteligente, controlado pelo app, com fragrâncias autorais desenvolvidas para acolher sem cansar.
          </p>
          <p>
            Acreditamos que bem-estar mora nos detalhes. No aroma que recebe as visitas, no cheiro que embala o fim do dia, na atmosfera que faz o seu espaço ser inconfundivelmente seu. Mais que perfumar um ambiente, queremos criar memória, aconchego e identidade.
          </p>
          <p>
            Estamos em pré-lançamento, construindo cada detalhe com cuidado para entregar uma experiência à altura da sua casa. E convidamos você a fazer parte dessa história desde o começo.
          </p>
          <p className="font-serif text-xl text-ink pt-4">
            Bem-vindo à Sinesia. Bem-estar que se respira.
          </p>
        </div>

        <div className="mt-14 pt-8 border-t border-ink/10">
          <p className="text-sm text-ink/40">
            Dúvidas?{' '}
            <a href="mailto:oi@sinesia.com.br" className="text-rust hover:underline">
              oi@sinesia.com.br
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}
