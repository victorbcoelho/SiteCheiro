import type { Metadata } from 'next';
import Link from 'next/link';
import TopBar from '@/components/sections/TopBar';
import Navbar from '@/components/sections/Navbar';
import Footer from '@/components/sections/Footer';

export const metadata: Metadata = {
  title: 'Termos de Uso · Lûmance',
  description: 'Termos de uso do site e do programa de pré-lançamento da Lûmance.',
};

const SECTIONS: { title: string; body: string[] }[] = [
  {
    title: '1. Sobre estes termos',
    body: [
      'Estes Termos de Uso regulam o acesso e a utilização do site da Lûmance (“nós”, “nosso”) e a participação no programa de pré-lançamento, lista de espera e reservas de fundadora. Ao utilizar o site ou cadastrar seus dados, você declara ter lido e concordado com estes termos.',
    ],
  },
  {
    title: '2. Natureza do pré-lançamento',
    body: [
      'A Lûmance encontra-se em fase de pré-lançamento. O cadastro na lista de espera ou a realização de uma reserva de fundadora não constituem uma compra e não garantem, por si só, a entrega de qualquer produto. Trata-se de manifestação de interesse para acesso prioritário e condições especiais quando o produto for disponibilizado.',
      'Preços, prazos, especificações e disponibilidade apresentados no site são estimativas e podem ser alterados até o lançamento oficial.',
    ],
  },
  {
    title: '3. Reservas e valores',
    body: [
      'A reserva de fundadora, quando aplicável, é totalmente reembolsável. Nenhum valor de compra do produto é cobrado no momento do cadastro. A confirmação da compra ocorrerá em etapa posterior, mediante novo aceite, com informações claras sobre preço final, frete e prazo de entrega.',
      'Você pode solicitar o cancelamento da reserva e o reembolso a qualquer momento antes do envio, sem custo, pelo e-mail de contato indicado no site.',
    ],
  },
  {
    title: '4. Cadastro e dados',
    body: [
      'Ao informar e-mail e, opcionalmente, WhatsApp, você autoriza a Lûmance a entrar em contato sobre o lançamento, condições de compra e comunicações relacionadas. O tratamento de dados segue a nossa Política de Privacidade.',
      'Você é responsável pela veracidade das informações fornecidas e por manter seus dados de contato atualizados.',
    ],
  },
  {
    title: '5. Propriedade intelectual',
    body: [
      'Todo o conteúdo do site — marca, textos, imagens, layout e código — pertence à Lûmance ou a seus licenciadores e é protegido pela legislação aplicável. É vedada a reprodução sem autorização prévia por escrito.',
    ],
  },
  {
    title: '6. Limitação de responsabilidade',
    body: [
      'O site é fornecido “no estado em que se encontra”. Na máxima extensão permitida pela lei, a Lûmance não se responsabiliza por indisponibilidades temporárias, imprecisões de conteúdo em fase de pré-lançamento ou por decisões tomadas exclusivamente com base nas informações preliminares aqui apresentadas.',
    ],
  },
  {
    title: '7. Alterações e contato',
    body: [
      'Estes termos podem ser atualizados a qualquer momento; a versão vigente será sempre a publicada nesta página. Dúvidas podem ser enviadas para oi@lumance.com.br.',
    ],
  },
];

export default function TermosPage() {
  return (
    <>
      <TopBar />
      <Navbar />
      <main className="mx-auto max-w-3xl px-6 py-20">
        <p className="text-xs uppercase tracking-[0.3em] text-gold">Legal</p>
        <h1 className="mt-4 font-serif text-4xl font-medium text-ink">
          Termos de Uso
        </h1>
        <p className="mt-3 text-sm text-ink/45">Última atualização: julho de 2026.</p>

        <div className="mt-12 space-y-10">
          {SECTIONS.map((s) => (
            <section key={s.title}>
              <h2 className="font-serif text-xl text-ink">{s.title}</h2>
              <div className="mt-3 space-y-3 text-sm leading-relaxed text-ink/70">
                {s.body.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-14">
          <Link href="/" className="text-sm text-ink/60 hover:text-ink">
            ← Voltar para a home
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
