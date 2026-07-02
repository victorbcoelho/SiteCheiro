import type { Metadata } from 'next';
import Link from 'next/link';
import TopBar from '@/components/sections/TopBar';
import Navbar from '@/components/sections/Navbar';
import Footer from '@/components/sections/Footer';

export const metadata: Metadata = {
  title: 'Política de Privacidade · Lûmance',
  description:
    'Como a Lûmance coleta, usa e protege seus dados pessoais, em conformidade com a LGPD.',
};

const SECTIONS: { title: string; body: string[] }[] = [
  {
    title: '1. Quem somos',
    body: [
      'Esta Política de Privacidade descreve como a Lûmance (Lûmance Cosméticos Ltda., CNPJ 00.000.000/0001-00) trata dados pessoais coletados por meio deste site, em conformidade com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018 — LGPD).',
    ],
  },
  {
    title: '2. Dados que coletamos',
    body: [
      'Coletamos os dados que você nos fornece diretamente: endereço de e-mail e, opcionalmente, número de WhatsApp, além das escolhas feitas no configurador do produto (objetivo de pele e acabamento preferido).',
      'Coletamos também dados de navegação e de origem, como parâmetros de campanha (utm_source, utm_medium, utm_campaign), páginas visitadas e interações, por meio de cookies e ferramentas de analytics.',
    ],
  },
  {
    title: '3. Como usamos seus dados',
    body: [
      'Utilizamos seus dados para: (i) comunicar sobre o lançamento, condições de compra e novidades da Lûmance; (ii) gerenciar sua posição na lista de espera ou reserva; (iii) entender de quais canais vêm nossos interessados e melhorar nossas campanhas; e (iv) cumprir obrigações legais.',
    ],
  },
  {
    title: '4. Cookies e analytics',
    body: [
      'Usamos cookies e tecnologias semelhantes por meio de Google Analytics 4, Meta Pixel e TikTok Pixel para medir o desempenho do site e das campanhas. Esses serviços podem coletar identificadores anônimos de navegação. Você pode gerenciar cookies nas configurações do seu navegador.',
    ],
  },
  {
    title: '5. Compartilhamento',
    body: [
      'Não vendemos seus dados. Podemos compartilhá-los com operadores que nos apoiam (por exemplo, provedores de e-mail, hospedagem e analytics), sempre limitados à finalidade descrita e com as devidas salvaguardas contratuais.',
    ],
  },
  {
    title: '6. Seus direitos (LGPD)',
    body: [
      'Você pode, a qualquer momento, solicitar acesso, correção, portabilidade ou exclusão dos seus dados, bem como revogar consentimentos e se descadastrar das nossas comunicações. Para exercer esses direitos, escreva para oi@lumance.com.br.',
    ],
  },
  {
    title: '7. Retenção e segurança',
    body: [
      'Mantemos seus dados apenas pelo tempo necessário às finalidades informadas ou conforme exigido por lei. Adotamos medidas técnicas e organizacionais razoáveis para proteger seus dados contra acesso não autorizado, perda ou alteração.',
    ],
  },
  {
    title: '8. Contato',
    body: [
      'Dúvidas sobre esta política ou sobre o tratamento dos seus dados podem ser enviadas para oi@lumance.com.br.',
    ],
  },
];

export default function PrivacidadePage() {
  return (
    <>
      <TopBar />
      <Navbar />
      <main className="mx-auto max-w-3xl px-6 py-20">
        <p className="text-xs uppercase tracking-[0.3em] text-gold">Legal</p>
        <h1 className="mt-4 font-serif text-4xl font-medium text-ink">
          Política de Privacidade
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
