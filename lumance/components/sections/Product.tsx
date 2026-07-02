import Reveal from '@/components/ui/Reveal';
import Placeholder from '@/components/ui/Placeholder';

interface Benefit {
  icon: React.ReactNode;
  title: string;
  text: string;
}

const stroke = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.4,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

const BENEFITS: Benefit[] = [
  {
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6">
        <circle cx="12" cy="12" r="4" {...stroke} />
        <path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2" {...stroke} />
      </svg>
    ),
    title: 'Mais colágeno',
    text: 'A luz vermelha estimula a produção natural de colágeno e elastina.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6">
        <path d="M4 18c3-6 13-6 16 0" {...stroke} />
        <circle cx="9" cy="9" r="1.3" {...stroke} />
        <circle cx="15" cy="8" r="1" {...stroke} />
      </svg>
    ),
    title: 'Menos manchas',
    text: 'A luz âmbar uniformiza o tom e suaviza marcas ao longo das semanas.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6">
        <path d="M12 3c3 4 5 6 5 9a5 5 0 0 1-10 0c0-3 2-5 5-9Z" {...stroke} />
      </svg>
    ),
    title: 'Menos acne',
    text: 'A luz azul ajuda a controlar a oleosidade e a acalmar a pele.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6">
        <circle cx="12" cy="12" r="8" {...stroke} />
        <path d="M12 8v4l2.5 1.5" {...stroke} />
      </svg>
    ),
    title: 'Zero esforço',
    text: '10 minutos, mãos livres. Encaixa em qualquer rotina, todo dia.',
  },
];

export default function Product() {
  return (
    <section id="produto" className="bg-offwhite py-24">
      <div className="mx-auto grid max-w-7xl items-center gap-14 px-6 md:grid-cols-2">
        <Reveal>
          <Placeholder ratio="portrait" label="máscara de luz Lûmance" />
        </Reveal>

        <div>
          <Reveal>
            <p className="text-xs uppercase tracking-[0.3em] text-gold">
              Como funciona
            </p>
            <h2 className="mt-4 max-w-md font-serif text-3xl font-medium leading-tight text-ink sm:text-4xl">
              Uma máscara. Três comprimentos de luz. Um ritual só seu.
            </h2>
            <p className="mt-5 max-w-md text-base leading-relaxed text-ink/65">
              A Lûmance combina luz vermelha, âmbar e azul de nível profissional
              num silicone médico flexível que se adapta ao seu rosto. Você
              escolhe o objetivo — a máscara faz o resto.
            </p>
          </Reveal>

          <div className="mt-10 grid gap-x-8 gap-y-9 sm:grid-cols-2">
            {BENEFITS.map((b, i) => (
              <Reveal key={b.title} delay={i * 0.06}>
                <div className="flex gap-4">
                  <div className="mt-0.5 text-gold">{b.icon}</div>
                  <div>
                    <h3 className="font-serif text-lg text-ink">{b.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-ink/60">
                      {b.text}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
