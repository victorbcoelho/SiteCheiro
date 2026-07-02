import Reveal from '@/components/ui/Reveal';

interface Row {
  aspect: string;
  lumance: string;
  others: string;
}

const ROWS: Row[] = [
  {
    aspect: 'Tecnologia',
    lumance: 'LED tri-comprimento (vermelho, âmbar e azul)',
    others: 'Uma cor genérica, sem protocolo',
  },
  {
    aspect: 'Materiais',
    lumance: 'Silicone médico flexível que se adapta ao rosto',
    others: 'Plástico rígido, encaixe único',
  },
  {
    aspect: 'Resultado',
    lumance: 'Protocolo por objetivo, baseado em evidência',
    others: 'Uso sem orientação, resultado incerto',
  },
  {
    aspect: 'Experiência',
    lumance: 'Timer automático e mãos livres em 10 min',
    others: 'Segurar o aparelho, cronometrar sozinha',
  },
  {
    aspect: 'Suporte',
    lumance: 'Acompanhamento e garantia estendida',
    others: 'Sem suporte após a compra',
  },
];

function Check() {
  return (
    <svg viewBox="0 0 20 20" className="h-5 w-5 shrink-0 text-gold" aria-hidden="true">
      <path
        d="M4 10.5l4 4 8-9"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Dash() {
  return (
    <svg viewBox="0 0 20 20" className="h-5 w-5 shrink-0 text-ink/25" aria-hidden="true">
      <path d="M5 10h10" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export default function Compare() {
  return (
    <section id="ciencia" className="bg-cream py-24">
      <div className="mx-auto max-w-5xl px-6">
        <Reveal>
          <div className="text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-gold">
              A diferença
            </p>
            <h2 className="mt-4 font-serif text-3xl font-medium text-ink sm:text-4xl">
              Por que Lûmance é diferente
            </h2>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mt-14 overflow-hidden rounded-2xl border border-ink/10 bg-offwhite">
            {/* Cabeçalho */}
            <div className="grid grid-cols-[1.2fr_1.4fr_1.4fr] border-b border-ink/10 bg-ink/[0.02]">
              <div className="px-5 py-5 sm:px-8" />
              <div className="px-5 py-5 text-center sm:px-8">
                <span className="font-serif text-lg text-ink">Lûmance</span>
              </div>
              <div className="px-5 py-5 text-center sm:px-8">
                <span className="text-sm text-ink/45">
                  Alternativas comuns
                </span>
              </div>
            </div>

            {ROWS.map((row, i) => (
              <div
                key={row.aspect}
                className={`grid grid-cols-[1.2fr_1.4fr_1.4fr] items-center ${
                  i !== ROWS.length - 1 ? 'border-b border-ink/[0.07]' : ''
                }`}
              >
                <div className="px-5 py-6 sm:px-8">
                  <span className="text-sm font-medium uppercase tracking-wide text-ink/50">
                    {row.aspect}
                  </span>
                </div>
                <div className="flex items-start gap-3 px-5 py-6 sm:px-8">
                  <Check />
                  <span className="text-sm leading-relaxed text-ink">
                    {row.lumance}
                  </span>
                </div>
                <div className="flex items-start gap-3 px-5 py-6 sm:px-8">
                  <Dash />
                  <span className="text-sm leading-relaxed text-ink/45">
                    {row.others}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
