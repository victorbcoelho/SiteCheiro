export interface Scent {
  id: string;
  name: string;
  family: string;
  description: string;
}

export const scents: Scent[] = [
  {
    id: 'brisa-citrica',
    name: 'Brisa Cítrica',
    family: 'Cítrico / Energizante',
    description: 'Notas de laranja e limão siciliano para começar o dia desperto.',
  },
  {
    id: 'madeira-nobre',
    name: 'Madeira Nobre',
    family: 'Amadeirado / Sofisticado',
    description: 'Cedro e sândalo em equilíbrio. Presença discreta e elegante.',
  },
  {
    id: 'lavanda-suave',
    name: 'Lavanda Suave',
    family: 'Floral / Relaxante',
    description: 'Clássico calmante, perfeito para o quarto à noite.',
  },
  {
    id: 'cha-verde',
    name: 'Chá Verde',
    family: 'Verde / Refrescante',
    description: 'Leveza e frescor para ambientes de trabalho e estudo.',
  },
  {
    id: 'baunilha-ambar',
    name: 'Baunilha & Âmbar',
    family: 'Oriental / Acolhedor',
    description: 'Quentinho e envolvente, como uma casa que recebe bem.',
  },
  {
    id: 'hotel-5-estrelas',
    name: 'Hotel 5 Estrelas',
    family: 'Chypre / Sofisticado',
    description: 'O aroma de recepção de hotel de luxo, agora na sua sala.',
  },
];

export interface DiffuserType {
  id: string;
  name: string;
  description: string;
  bodyColor: string;
  accentColor: string;
}

export const diffuserTypes: DiffuserType[] = [
  {
    id: 'branco',
    name: 'Sopre Branco',
    description: 'Combina com decoração clara e minimalista.',
    bodyColor: '#FFFFFF',
    accentColor: '#B95C42',
  },
  {
    id: 'preto',
    name: 'Sopre Preto',
    description: 'Presença discreta em ambientes com tons escuros.',
    bodyColor: '#1A1A1A',
    accentColor: '#B95C42',
  },
];
