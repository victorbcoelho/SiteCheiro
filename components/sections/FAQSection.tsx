import FAQ, { FAQItem } from '@/components/ui/FAQ';

const items: FAQItem[] = [
  {
    question: 'O aparelho Sinesia toca músicas?',
    answer:
      'Sim. Apenas o modelo Sinesia Tower possui alto-falante integrado que reproduz playlists de músicas e frequências sonoras relaxantes via app. Você controla o volume do som e a intensidade do aroma de forma independente.',
  },
  {
    question: 'Quanto tempo dura cada refil?',
    answer:
      'Cada refil dura 30 dias. Antes de acabar, você já recebe os próximos — assim seu ambiente fica sempre perfumado e aconchegante, sem interrupções.',
  },
  {
    question: 'Posso cancelar o plano quando quiser?',
    answer:
      'Sim, sem burocracia. Na promoção Difusor Grátis, caso o cancelamento ocorra antes dos 12 meses, será cobrado apenas o valor do difusor. Nos demais planos, o cancelamento é livre a qualquer momento, sem custo adicional.',
  },
  {
    question: 'O aparelho precisa de WiFi?',
    answer:
      'Não, os aparelhos funcionam sem WiFi. O modelo Sinesia Tower reproduz músicas via Bluetooth diretamente do seu celular.',
  },
  {
    question: 'E se eu não gostar de uma fragrância?',
    answer:
      'Troca garantida no próximo envio, sem custo adicional. Nossa equipe está sempre disponível para ajudar a encontrar a essência certa para o seu ambiente.',
  },
  {
    question: 'Posso trocar as essências todo mês?',
    answer:
      'Sim, você tem total liberdade para variar as fragrâncias a cada envio. Basta nos informar pelo WhatsApp ou e-mail quais essências deseja no próximo mês — sem custo adicional.',
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
