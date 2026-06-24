export interface Scent {
  id: string;
  name: string;
  family: string;
  notes: string;
  mood: string;
  cardColor: string;
  image?: string;
}

export const scents: Scent[] = [
  {
    id: 'brisa-do-mar',
    name: 'Brisa do Mar',
    family: 'Aquático / Fresco',
    notes: 'Oceano, Sal Marinho e Brisa Costeira',
    mood: 'Renovação, Frescor Universal e Amplitude',
    cardColor: '#1B263B',
    image: '/images/sinesia-brisa-do-mar.jpg',
  },
  {
    id: 'lavanda-provence',
    name: 'Lavanda Provence',
    family: 'Floral Relaxante',
    notes: 'Lavanda Pura e Toques de Camomila',
    mood: 'Relaxamento Profundo, Paz e Sono Reparador',
    cardColor: '#4A3B52',
    image: '/images/sinesia-lavanda-provence.jpg',
  },
  {
    id: 'baunilha-ambar',
    name: 'Baunilha & Âmbar',
    family: 'Oriental / Gourmand',
    notes: 'Baunilha Premium, Âmbar Quente e Canela de Ceilão',
    mood: 'Aconchego, Magnetismo e Conforto Intenso',
    cardColor: '#8C6239',
    image: '/images/sinesia-baunilha-ambar.jpg',
  },
  {
    id: 'floresta-tropical',
    name: 'Floresta Tropical',
    family: 'Verde / Fresco',
    notes: 'Folhas Verdes, Musgo de Carvalho e Madeira Úmida',
    mood: 'Conexão Vital, Equilíbrio e Pureza Orgânica',
    cardColor: '#1E352F',
    image: '/images/sinesia-floresta-tropical.jpg',
  },
  {
    id: 'madeira-nobre',
    name: 'Madeira Nobre',
    family: 'Amadeirado / Sofisticado',
    notes: 'Sândalo, Cedro e Patchouli',
    mood: 'Elegância de Hotel 5 Estrelas, Poder e Presença',
    cardColor: '#3D2E2B',
  },
  {
    id: 'flor-de-laranjeira',
    name: 'Flor de Laranjeira',
    family: 'Floral Cítrico',
    notes: 'Neroli, Flor de Laranjeira e Bergamota',
    mood: 'Leveza Brasileira, Claridade e Bem-estar Energético',
    cardColor: '#A65B47',
  },
  {
    id: 'cafe-especiarias',
    name: 'Café & Especiarias',
    family: 'Gourmand / Especiado',
    notes: 'Grãos de Café Tostados, Cardamomo e Caramelo',
    mood: 'Acolhimento Familiar, Despertar Focalizado e Presença',
    cardColor: '#2B1E1C',
  },
  {
    id: 'cha-branco',
    name: 'Chá Branco',
    family: 'Verde / Floral Suave',
    notes: 'Chá Branco, Jasmim e Musk Suave',
    mood: 'Foco Minimalista, Clareza Mental e Elegância Neutra',
    cardColor: '#5E6358',
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
    name: 'Sinesia Branco',
    description: 'Combina com decoração clara e minimalista.',
    bodyColor: '#FFFFFF',
    accentColor: '#B95C42',
  },
  {
    id: 'preto',
    name: 'Sinesia Preto',
    description: 'Presença discreta em ambientes com tons escuros.',
    bodyColor: '#2B2B2B',
    accentColor: '#B95C42',
  },
];
