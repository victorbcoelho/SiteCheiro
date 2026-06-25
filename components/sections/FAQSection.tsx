import FAQ, { FAQItem } from '@/components/ui/FAQ';

const items: FAQItem[] = [
  {
    question: 'O aparelho Sinesia toca músicas?',
    answer:
      'Sim. O Sinesia possui alto-falante integrado que reproduz playlists e frequências sonoras via app. Você controla volume e intensidade do aroma de forma independente.',
  },
  {
    question: 'Quanto tempo dura cada cartucho?',
    answer:
      'Cada cartucho dura entre 30 e 45 dias em uso moderado (8h/dia). O app monitora o nível e avisa antes de acabar.',
  },
  {
    question: 'Posso cancelar o plano quando quiser?',
    answer:
      'Sim, sem multa e sem burocracia. Cancele pelo app ou por e-mail com 1 clique.',
  },
  {
    question: 'O aparelho precisa de WiFi?',
    answer:
      'Sim para sincronizar o app e reconhecer novos cartuchos. Mas rotinas já programadas continuam funcionando offline.',
  },
  {
    question: 'E se eu não gostar de uma fragrância?',
    answer:
      'Troca garantida no próximo envio, sem custo adicional. Nossa equipe ajuda a escolher a essência certa para o seu ambiente.',
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
