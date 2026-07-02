// Barra "Visto em" com logos fictícios em escala de cinza, em marquee infinito.
// Em produção, substituir pelos veículos reais.
const OUTLETS = [
  'VOGUE',
  'ELLE',
  'HARPER’S',
  'GLAMOUR',
  'MARIE CLAIRE',
  'ESTILO',
];

function Row() {
  return (
    <div className="flex shrink-0 items-center">
      {OUTLETS.map((name) => (
        <span
          key={name}
          className="mx-10 font-serif text-xl tracking-[0.15em] text-ink/35 sm:text-2xl"
        >
          {name}
        </span>
      ))}
    </div>
  );
}

export default function SocialProof() {
  return (
    <section className="border-y border-ink/10 bg-offwhite py-10">
      <p className="mb-7 text-center text-[11px] uppercase tracking-[0.3em] text-ink/40">
        Visto em
      </p>
      <div className="relative overflow-hidden">
        {/* Máscaras laterais para fade suave. */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-offwhite to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-offwhite to-transparent" />
        <div className="marquee-track">
          {/* Duplicado para loop contínuo. */}
          <Row />
          <Row />
        </div>
      </div>
    </section>
  );
}
