import ScentCard from '@/components/ui/ScentCard';
import { scents } from '@/lib/products';

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
