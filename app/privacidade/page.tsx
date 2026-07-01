import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Política de Privacidade — Sinesia',
  description: 'Saiba como a Sinesia coleta, usa e protege seus dados pessoais.',
};

const LAST_UPDATE = '01 de julho de 2025';

export default function PrivacidadePage() {
  return (
    <main className="bg-offwhite min-h-screen">
      <div className="container-page py-20 max-w-2xl">
        <Link
          href="/"
          className="text-xs uppercase tracking-widest text-ink/40 hover:text-ink transition-colors duration-300 mb-10 inline-block"
        >
          ← Voltar
        </Link>

        <h1 className="font-serif text-4xl text-ink mb-2">Política de Privacidade</h1>
        <p className="text-xs text-ink/40 mb-10">Última atualização: {LAST_UPDATE}</p>

        <div className="space-y-8 text-ink/70 leading-relaxed text-sm">

          <section>
            <h2 className="font-serif text-xl text-ink mb-2">1. Quem somos</h2>
            <p>
              Sinesia Tecnologia Ltda., inscrita no CNPJ 47.784.039/0001-00, com e-mail de contato{' '}
              <a href="mailto:oi@sinesia.com.br" className="text-rust hover:underline">oi@sinesia.com.br</a>.
              Esta Política descreve como coletamos, usamos e protegemos seus dados pessoais em conformidade com a
              Lei Geral de Proteção de Dados (Lei nº 13.709/2018 — LGPD).
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-ink mb-2">2. Dados que coletamos</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Dados de cadastro:</strong> nome e e-mail fornecidos voluntariamente no formulário de pré-lançamento.</li>
              <li><strong>Dados de navegação:</strong> páginas visitadas, tempo de permanência e cliques, coletados de forma anônima por Google Analytics 4.</li>
              <li><strong>Dados de desempenho de anúncios:</strong> eventos de conversão enviados ao Meta Pixel e TikTok Pixel, com e-mail hasheado (SHA-256) quando aplicável, para mensuração de campanhas.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-xl text-ink mb-2">3. Como usamos seus dados</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Enviar o convite de acesso antecipado ao produto.</li>
              <li>Comunicar novidades, lançamentos e ofertas exclusivas (você pode cancelar a qualquer momento).</li>
              <li>Medir e melhorar o desempenho do nosso site e campanhas de marketing.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-xl text-ink mb-2">4. Base legal</h2>
            <p>
              O tratamento dos seus dados é realizado com base no seu <strong>consentimento</strong> (ao preencher o formulário) e no
              nosso <strong>legítimo interesse</strong> de mensurar e otimizar as ações de marketing, sempre de forma proporcional e
              respeitando seus direitos.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-ink mb-2">5. Compartilhamento de dados</h2>
            <p>
              Não vendemos seus dados. Podemos compartilhá-los somente com plataformas de tecnologia que nos auxiliam na
              prestação dos serviços (Firebase/Google, Meta, TikTok), sempre em conformidade com as políticas de privacidade
              dessas plataformas e com a LGPD.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-ink mb-2">6. Cookies e rastreadores</h2>
            <p>
              Utilizamos cookies de análise (Google Analytics) e de publicidade (Meta Pixel, TikTok Pixel) para entender como
              os visitantes interagem com o site e mensurar a efetividade das nossas campanhas. Você pode desativar cookies
              nas configurações do seu navegador, o que pode afetar algumas funcionalidades.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-ink mb-2">7. Retenção de dados</h2>
            <p>
              Mantemos seus dados pelo tempo necessário para as finalidades descritas nesta Política, ou pelo prazo
              exigido por lei. Após esse período, os dados são excluídos de forma segura.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-ink mb-2">8. Seus direitos</h2>
            <p>Conforme a LGPD, você tem direito a:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>Confirmar se tratamos seus dados.</li>
              <li>Acessar, corrigir ou excluir seus dados.</li>
              <li>Revogar o consentimento a qualquer momento.</li>
              <li>Solicitar a portabilidade dos dados.</li>
            </ul>
            <p className="mt-2">
              Para exercer qualquer direito, entre em contato pelo e-mail{' '}
              <a href="mailto:oi@sinesia.com.br" className="text-rust hover:underline">oi@sinesia.com.br</a>.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-ink mb-2">9. Segurança</h2>
            <p>
              Adotamos medidas técnicas e organizacionais adequadas para proteger seus dados contra acesso não autorizado,
              perda ou divulgação indevida.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-ink mb-2">10. Alterações nesta Política</h2>
            <p>
              Podemos atualizar esta Política periodicamente. A data da última atualização sempre estará indicada no topo
              desta página. Recomendamos que você a consulte regularmente.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl text-ink mb-2">11. Contato</h2>
            <p>
              Em caso de dúvidas sobre esta Política ou sobre o tratamento dos seus dados, entre em contato:{' '}
              <a href="mailto:oi@sinesia.com.br" className="text-rust hover:underline">oi@sinesia.com.br</a>.
            </p>
          </section>

        </div>
      </div>
    </main>
  );
}
