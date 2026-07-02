import Reveal from '@/components/ui/Reveal';
import Placeholder from '@/components/ui/Placeholder';

export default function Manifesto() {
  return (
    <section id="manifesto" className="bg-cream py-24">
      <div className="mx-auto grid max-w-7xl items-center gap-14 px-6 md:grid-cols-[3fr_2fr]">
        <Reveal>
          <Placeholder ratio="editorial" label="editorial Lûmance" />
        </Reveal>

        <Reveal delay={0.1}>
          <p className="text-xs uppercase tracking-[0.3em] text-gold">
            Por que existimos
          </p>
          <h2 className="mt-4 font-serif text-3xl font-medium leading-tight text-ink sm:text-4xl">
            Cuidar da pele não deveria ser um luxo de agenda.
          </h2>
          <div className="mt-6 space-y-4 text-base leading-relaxed text-ink/70">
            <p>
              A terapia de luz existe há décadas em consultórios — mas ficou
              presa lá, entre horários difíceis e sessões caras. A gente achou
              que isso não fazia mais sentido.
            </p>
            <p>
              A Lûmance nasceu de uma ideia simples: a mesma tecnologia que a
              sua dermatologista usa cabe na sua casa, na sua luz baixa, no seu
              tempo. Um ritual curto, sensorial, que é só seu.
            </p>
            <p>
              Acreditamos em resultado sem pressa e em beleza sem ansiedade.
              Menos etapas, menos ruído — mais presença com você mesma.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
