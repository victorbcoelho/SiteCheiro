import FAQ, { FAQItem } from '@/components/ui/FAQ';

const items: FAQItem[] = [
  {
    question: 'O aparelho Sinesia toca músicas?',
    answer:
      'Sim. Apenas o modelo Sinesia Tower possui alto-falante integrado, que reproduz playlists e frequências sonoras via app.',
  },
  {
    question: 'Quanto tempo dura cada refil?',
    answer:
      'Cada refil que você recebe mensalmente dura 30 dias. Antes de as essências acabarem, você recebe os próximos, mantendo seu ambiente sempre perfumado e aconchegante.',
  },
  {
    question: 'Posso cancelar o plano quando quiser?',
    answer:
      'Sim, sem multa e sem burocracia. Na promoção do difusor grátis, se o cancelamento for feito antes dos 12 meses, será cobrado apenas o valor do difusor.',
  },
  {
    question: 'O aparelho precisa de WiFi?',
    answer:
      'Não, os aparelhos funcionam offline. O modelo Sinesia Tower toca músicas através do bluetooth do seu celular.',
  },
  {
    question: 'E se eu não gostar de uma fragrância?',
    answer:
      'Troca garantida no próximo envio, sem custo adicional. Nossa equipe ajuda a escolher a essência certa para o seu ambiente.',
  },
  {
    question: 'Posso variar as essências e não ficar preso às mesmas todos os meses?',
    answer:
      'Se preferir, fique à vontade para trocar as essências todos os meses. É só nos informar, via WhatsApp ou e-mail, quais essências gostaria de alterar no próximo mês, sem custo adicional.',
  },
];

export default function FAQSection() {
  return (
    <section id="faq" className="section-padding bg-white">
      <div className="container-page max-w-3xl">
        <h2 className="font-serif text-3xl md:text-5xl text-center mb-16 text-ink">
          Perguntas frequentes
        </h2>
        <FAQ items={items} />
      </div>
    </section>
  );
}
