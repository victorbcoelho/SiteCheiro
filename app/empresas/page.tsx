import type { Metadata } from 'next';
import Image from 'next/image';
import Button from '@/components/ui/Button';
import CompareTable from '@/components/ui/CompareTable';
import LeadForm from '@/components/LeadForm';

export const metadata: Metadata = {
  title: 'Para Empresas',
  description:
    'Aromatização inteligente para escritórios, consultórios, salões e pequenos comércios. Sem equipamento caro, sem visita técnica, sem contrato longo.',
};

const targets = [
  { title: 'Escritórios e coworkings', text: 'A primeira impressão de quem entra na sua sede.' },
  { title: 'Consultórios e clínicas', text: 'Ambiente calmo e profissional para seus pacientes.' },
  { title: 'Salões e estúdios', text: 'A experiência sensorial completa do seu atendimento.' },
  { title: 'Pequenos comércios e lojas', text: 'O cheiro que faz o cliente voltar.' },
];

const benefits = [
  {
    title: 'Primeira impressão',
    text: 'O cheiro que o cliente sente ao entrar define a experiência.',
  },
  {
    title: 'Bem-estar da equipe',
    text: 'Ambiente agradável aumenta foco e satisfação no trabalho.',
  },
  {
    title: 'Sem complicação',
    text: 'Plugou, programou no app, esqueceu. Refil chega todo mês.',
  },
];

const whatsappHref =
  'https://wa.me/5500000000000?text=' +
  encodeURIComponent('Olá! Tenho interesse no plano Sopre.me para empresas.');

export default function EmpresasPage() {
  return (
    <>
      <section className="relative min-h-[70vh] flex items-center overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=2000&q=80"
          alt="Escritório moderno com sala de reunião"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/75 via-ink/50 to-ink/20" />

        <div className="container-page relative z-10 py-24">
          <div className="max-w-2xl text-white">
            <h1 className="font-serif text-4xl md:text-6xl leading-[1.1] mb-6">
              O ambiente que seus clientes e equipe vão notar
            </h1>
            <p className="text-lg md:text-xl text-white/85 mb-10 max-w-xl">
              Aromatização inteligente para escritórios, consultórios, salões e
              pequenos comércios. Sem equipamento caro, sem visita técnica, sem
              contrato longo.
            </p>
            <Button href="#contato" size="lg">
              Quero para minha empresa
            </Button>
          </div>
        </div>
      </section>

      <section className="section-padding bg-offwhite">
        <div className="container-page">
          <h2 className="font-serif text-3xl md:text-5xl text-center mb-16">
            Para quem é
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {targets.map((target) => (
              <div key={target.title} className="rounded-2xl bg-white border border-sand p-6">
                <h3 className="font-serif text-lg mb-2">{target.title}</h3>
                <p className="text-sm text-ink/60">{target.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-page grid grid-cols-1 md:grid-cols-3 gap-10">
          {benefits.map((benefit) => (
            <div key={benefit.title}>
              <h3 className="font-serif text-xl mb-3">{benefit.title}</h3>
              <p className="text-ink/60 text-sm leading-relaxed">{benefit.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-page">
          <h2 className="font-serif text-3xl md:text-5xl text-center mb-12">
            Sopre.me vs. empresas tradicionais
          </h2>
          <CompareTable />
        </div>
      </section>

      <section className="section-padding bg-offwhite">
        <div className="container-page max-w-xl mx-auto">
          <div className="rounded-3xl bg-ink text-white p-10 text-center">
            <h2 className="font-serif text-2xl md:text-3xl mb-2">Plano Escritório</h2>
            <p className="text-white/70 mb-6">Aparelho + 2 aromas/mês</p>
            <p className="font-serif text-4xl mb-1">
              R$89,90<span className="text-base font-sans opacity-60">/mês por ponto</span>
            </p>
            <ul className="text-sm text-white/80 my-8 space-y-2">
              <li>App de controle</li>
              <li>Refil mensal automático</li>
              <li>Suporte por WhatsApp</li>
              <li>Nota fiscal</li>
            </ul>
            <Button
              href={whatsappHref}
              variant="secondary"
              size="lg"
              className="w-full"
            >
              Falar com consultor
            </Button>
          </div>
        </div>
      </section>

      <section id="contato" className="section-padding bg-white">
        <div className="container-page max-w-xl mx-auto">
          <h2 className="font-serif text-3xl md:text-4xl text-center mb-10">
            Fale com a gente
          </h2>
          <LeadForm collection="leads_b2b" origem="empresas" variant="b2b" />
        </div>
      </section>
    </>
  );
}
