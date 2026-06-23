import ScentCard, { Scent } from '@/components/ui/ScentCard';

const scents: Scent[] = [
  {
    name: 'Brisa Cítrica',
    family: 'Cítrico / Energizante',
    description: 'Notas de laranja e limão siciliano para começar o dia desperto.',
  },
  {
    name: 'Madeira Nobre',
    family: 'Amadeirado / Sofisticado',
    description: 'Cedro e sândalo em equilíbrio. Presença discreta e elegante.',
  },
  {
    name: 'Lavanda Suave',
    family: 'Floral / Relaxante',
    description: 'Clássico calmante, perfeito para o quarto à noite.',
  },
  {
    name: 'Chá Verde',
    family: 'Verde / Refrescante',
    description: 'Leveza e frescor para ambientes de trabalho e estudo.',
  },
  {
    name: 'Baunilha & Âmbar',
    family: 'Oriental / Acolhedor',
    description: 'Quentinho e envolvente, como uma casa que recebe bem.',
  },
  {
    name: 'Hotel 5 Estrelas',
    family: 'Chypre / Sofisticado',
    description: 'O aroma de recepção de hotel de luxo, agora na sua sala.',
  },
];

export default function Scents() {
  return (
    <section id="fragrancias" className="section-padding bg-white">
      <div className="container-page">
        <h2 className="font-serif text-3xl md:text-5xl text-center mb-4">
          Aromas criados para a sua casa
        </h2>
        <p className="text-center text-ink/60 mb-16 max-w-xl mx-auto">
          Curadoria própria, feita por perfumistas que entendem o que combina
          com o seu dia.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {scents.map((scent) => (
            <ScentCard key={scent.name} scent={scent} />
          ))}
        </div>

        <p className="text-center text-sm text-ink/50 mt-12">
          Novos aromas todo trimestre. Assinantes escolhem primeiro.
        </p>
      </div>
    </section>
  );
}
