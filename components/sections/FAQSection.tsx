import FAQ, { FAQItem } from '@/components/ui/FAQ';

const items: FAQItem[] = [
  {
    question: 'Posso cancelar quando quiser?',
    answer: 'Sim, sem multa, sem burocracia.',
  },
  {
    question: 'Como funciona o refil automático?',
    answer: 'Todo mês antes do seu acabar, enviamos o próximo.',
  },
  {
    question: 'Qual a duração de cada refil?',
    answer: 'Cada frasco dura ~30-45 dias em uso moderado.',
  },
  {
    question: 'O aparelho faz barulho?',
    answer: 'Não. É silencioso. Pode ficar no quarto sem incomodar.',
  },
  {
    question: 'Precisa de WiFi?',
    answer: 'Sim para o app. Mas funciona offline com programação já salva.',
  },
  {
    question: 'E se eu não gostar do aroma?',
    answer: 'Troca grátis no próximo refil. Sem custo.',
  },
];

export default function FAQSection() {
  return (
    <section id="faq" className="section-padding bg-white">
      <div className="container-page max-w-3xl">
        <h2 className="font-serif text-3xl md:text-5xl text-center mb-16">
          Perguntas frequentes
        </h2>
        <FAQ items={items} />
      </div>
    </section>
  );
}
