export interface Scent {
  id: string;
  name: string;
  family: string;
  notes: string;
  mood: string;
  cardColor: string;
  aromatherapy: string;
  image?: string;
}

export const scents: Scent[] = [
  {
    id: 'brisa-do-mar',
    name: 'Brisa do Mar',
    family: 'Aquático / Fresco',
    notes: 'Sal marinho, brisa oceânica, algas, madeira flutuante, musk branco',
    mood: 'Renovação, Frescor Universal e Amplitude',
    cardColor: '#FFFFFF',
    image: '/images/sinesia-brisa-do-mar.jpg',
    aromatherapy:
      'Aromas marinhos e salinos estimulam a produção de serotonina e reduzem o cortisol. Estudos associam a exposição a ambientes costeiros a redução de estresse e melhora do humor. O íon negativo presente no ar marinho promove sensação de frescor mental e clareza. Indicado para ambientes de trabalho e salas de estar — energiza sem agitar.',
  },
  {
    id: 'lavanda-provence',
    name: 'Lavanda Provence',
    family: 'Floral Relaxante',
    notes: 'Lavanda francesa pura, alfazema, toque sutil de camomila',
    mood: 'Relaxamento Profundo, Paz e Sono Reparador',
    cardColor: '#FFFFFF',
    image: '/images/sinesia-lavanda-provence.jpg',
    aromatherapy:
      'A fragrância com mais evidência científica de todas. Meta-análises confirmam que a lavanda reduz significativamente os níveis de cortisol e ativa o sistema nervoso parassimpático, diminuindo ansiedade e melhorando a qualidade do sono. Estudos do NIH indicam eficácia comparável a ansiolíticos leves. Ideal para quartos e momentos de descanso.',
  },
  {
    id: 'baunilha-ambar',
    name: 'Baunilha & Âmbar',
    family: 'Oriental / Gourmand',
    notes: 'Baunilha de Madagascar, âmbar quente, toque de canela e musk',
    mood: 'Aconchego, Magnetismo e Conforto Intenso',
    cardColor: '#FFFFFF',
    image: '/images/sinesia-baunilha-ambar.jpg',
    aromatherapy:
      'A vanilina age nos receptores vaniloides do organismo, reduzindo a percepção de dor e promovendo relaxamento profundo. Na psicoaromaterapia, a baunilha é usada em momentos de solidão ou carência emocional — promove acolhimento e nutrição afetiva. O âmbar complementa com sensação de calor e segurança. Ideal para noites frias e momentos de autocuidado.',
  },
  {
    id: 'floresta-tropical',
    name: 'Floresta Tropical',
    family: 'Verde / Fresco',
    notes: 'Folhas verdes, eucalipto suave, musgo, madeira úmida, terra após chuva',
    mood: 'Conexão Vital, Equilíbrio e Pureza Orgânica',
    cardColor: '#FFFFFF',
    image: '/images/sinesia-floresta-tropical.jpg',
    aromatherapy:
      'O eucalipto (1,8-cineol) tem propriedades broncodilatadoras comprovadas em estudos clínicos e ajuda a limpar as vias aéreas. As notas verdes e terrosas reduzem a fadiga mental e aumentam a criatividade. O eucalipto também ajuda a afastar a tristeza e os sentimentos de solidão. Ideal para home office, salas e ambientes de estudo.',
  },
  {
    id: 'madeira-nobre',
    name: 'Madeira Nobre',
    family: 'Amadeirado / Sofisticado',
    notes: 'Sândalo, cedro, patchouli, vetiver, toque de couro',
    mood: 'Elegância de Hotel 5 Estrelas, Poder e Presença',
    cardColor: '#FFFFFF',
    image: '/images/sinesia-madeira-nobre.jpg',
    aromatherapy:
      'O óleo essencial de sândalo reduz ansiedade, melhora a qualidade do sono e auxilia na meditação profunda. Promove equilíbrio emocional e estimula autoconhecimento e paz interior. O cedro complementa com sensação de estabilidade e confiança — aroma de "ancoragem" que ajuda a centrar a mente. Ideal para salas de estar, escritórios e recepções.',
  },
  {
    id: 'flor-de-laranjeira',
    name: 'Flor de Laranjeira',
    family: 'Floral Cítrico',
    notes: 'Neroli, flor de laranjeira, bergamota, petit grain, jasmim suave',
    mood: 'Leveza Brasileira, Claridade e Bem-estar Energético',
    cardColor: '#FFFFFF',
    image: '/images/sinesia-flor-de-laranjeira.jpg',
    aromatherapy:
      'O neroli transmite alegria de viver e melhora o descanso, sendo eficaz no tratamento de insônia. É um dos óleos mais utilizados em aromaterapia clínica para equilíbrio emocional e redução da pressão arterial. A bergamota adiciona um efeito energizante leve. É a fragrância mais versátil e universalmente agradável — ideal para qualquer ambiente.',
  },
  {
    id: 'cafe-especiarias',
    name: 'Café & Especiarias',
    family: 'Gourmand / Especiado',
    notes: 'Grãos de café arábica tostados, cardamomo, caramelo, toque de noz-moscada',
    mood: 'Acolhimento Familiar, Despertar Focalizado e Presença',
    cardColor: '#FFFFFF',
    image: '/images/sinesia-cafe-especiarias.jpg',
    aromatherapy:
      'Estudos mostram que o aroma de café aumenta o estado de alerta e a performance cognitiva sem os efeitos colaterais da cafeína ingerida. A canela estimula a circulação sanguínea e melhora o foco. O cardamomo alivia fadiga mental e dores de cabeça. A combinação é energizante mas acolhedora — ativa sem agitar. Ideal para manhãs e home office.',
  },
  {
    id: 'bambu-cha-branco',
    name: 'Bambu & Chá Branco',
    family: 'Herbal / Floral Suave',
    notes: 'Lima, bergamota, flor de bambu, jasmim, flor de lótus, âmbar, musk branco, cedro',
    mood: 'Foco Minimalista, Clareza Mental e Elegância Neutra',
    cardColor: '#FFFFFF',
    image: '/images/sinesia-bambu-cha-branco.jpg',
    aromatherapy:
      'O bambu é associado a serenidade, harmonia e resiliência. Seu aroma fresco e levemente floral proporciona efeito calmante sem induzir sono. O jasmim tem propriedades antidepressivas e estimula otimismo. O chá branco adiciona clareza mental. É a fragrância mais unissex e a mais associada a "casa limpa e sofisticada" no Brasil — referência do aroma MMartan. Ideal para qualquer cômodo.',
  },
];

export type DiffuserModelId = 'room' | 'tower' | 'car';

export interface DiffuserModel {
  id: DiffuserModelId;
  name: string;
  subtitle: string;
  price: number;
  hasSound: boolean;
  idealFor: string;
  features: string[];
}

export const diffuserModels: DiffuserModel[] = [
  {
    id: 'room',
    name: 'Sinesia Room',
    subtitle: 'Difusor compacto',
    price: 198,
    hasSound: false,
    idealFor: 'Quartos, banheiros, home office, cozinhas, corredores e espaços pequenos',
    features: [
      'Cobre até 20 m²',
      'Basta ligar na tomada — funciona na hora',
      'Silencioso',
      'Sem água, sem vazamento',
      'Não deixa resíduo em móveis nem superfícies',
      'Design compacto e discreto',
      'Luz led embutida',
      'Garantia enquanto sua assinatura estiver ativa',
    ],
  },
  {
    id: 'tower',
    name: 'Sinesia Tower',
    subtitle: 'Difusor com caixa de som integrada',
    price: 348,
    hasSound: true,
    idealFor: 'Salas grandes, ambientes com grande vão',
    features: [
      'Cobre até 40 m² — o dobro do Room',
      'Basta ligar, funciona na tomada e bateria',
      'Silencioso',
      'Controle de intensidade',
      'Sem água, sem vazamento',
      'Luz de led embutida',
      'Garantia enquanto sua assinatura estiver ativa',
    ],
  },
  {
    id: 'car',
    name: 'Sinesia Car',
    subtitle: 'Difusor veicular',
    price: 198,
    hasSound: false,
    idealFor: 'Para aromatização em movimento',
    features: [
      'Liga e desliga automaticamente',
      'Bateria recarregável',
      'Controle manual e pelo app',
      'Ajuste de intensidade pelo app',
      'Rastreamento de uso de essência',
    ],
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
