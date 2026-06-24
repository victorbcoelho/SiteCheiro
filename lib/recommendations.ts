import { scents, type Scent } from './products';

export interface MoodOption {
  id: string;
  label: string;
  emoji: string;
  scentIds: string[];
}

export const moodOptions: MoodOption[] = [
  {
    id: 'relaxar',
    label: 'Relaxar e dormir melhor',
    emoji: '🌙',
    scentIds: ['lavanda-provence', 'baunilha-ambar', 'flor-de-laranjeira'],
  },
  {
    id: 'energia',
    label: 'Energia e foco',
    emoji: '⚡',
    scentIds: ['cafe-especiarias', 'floresta-tropical', 'brisa-do-mar'],
  },
  {
    id: 'aconchego',
    label: 'Aconchego e conforto',
    emoji: '🏡',
    scentIds: ['baunilha-ambar', 'cafe-especiarias', 'madeira-nobre'],
  },
  {
    id: 'alegria',
    label: 'Alegria e bom humor',
    emoji: '☀️',
    scentIds: ['flor-de-laranjeira', 'brisa-do-mar', 'bambu-cha-branco'],
  },
  {
    id: 'sofisticacao',
    label: 'Sofisticação e elegância',
    emoji: '✨',
    scentIds: ['madeira-nobre', 'bambu-cha-branco', 'lavanda-provence'],
  },
  {
    id: 'frescor',
    label: 'Frescor e leveza',
    emoji: '🌿',
    scentIds: ['brisa-do-mar', 'bambu-cha-branco', 'floresta-tropical'],
  },
  {
    id: 'limpa',
    label: 'Casa sempre limpa e cheirosa',
    emoji: '🧼',
    scentIds: ['bambu-cha-branco', 'brisa-do-mar', 'flor-de-laranjeira'],
  },
  {
    id: 'tropical',
    label: 'Tropical fruits',
    emoji: '🍊',
    scentIds: ['flor-de-laranjeira', 'brisa-do-mar', 'cafe-especiarias'],
  },
  {
    id: 'cozy-vanilla',
    label: 'Cozy vanilla',
    emoji: '🍦',
    scentIds: ['baunilha-ambar', 'cafe-especiarias', 'madeira-nobre'],
  },
  {
    id: 'coastal',
    label: 'Coastal escape',
    emoji: '🌊',
    scentIds: ['brisa-do-mar', 'bambu-cha-branco', 'flor-de-laranjeira'],
  },
  {
    id: 'soft-clean',
    label: 'Soft and clean',
    emoji: '🤍',
    scentIds: ['bambu-cha-branco', 'lavanda-provence', 'flor-de-laranjeira'],
  },
  {
    id: 'respirar',
    label: 'Respirar melhor',
    emoji: '🫁',
    scentIds: ['floresta-tropical', 'brisa-do-mar', 'lavanda-provence'],
  },
];

export function getRecommendedScents(moodId: string): Scent[] {
  const mood = moodOptions.find((m) => m.id === moodId);
  if (!mood) return [];
  return mood.scentIds
    .map((id) => scents.find((s) => s.id === id))
    .filter(Boolean) as Scent[];
}

export interface RoomOption {
  id: string;
  label: string;
  sublabel: string;
  diffuserModel: 'round' | 'tower';
}

export const roomOptions: RoomOption[] = [
  { id: 'sala-grande', label: 'Sala grande', sublabel: 'Acima de 25 m²', diffuserModel: 'tower' },
  { id: 'sala-pequena', label: 'Sala pequena', sublabel: 'Até 25 m²', diffuserModel: 'round' },
  { id: 'quarto', label: 'Quarto', sublabel: 'Dormitório', diffuserModel: 'round' },
  { id: 'banheiro', label: 'Banheiro', sublabel: 'Lavabo ou banheiro', diffuserModel: 'round' },
  { id: 'carro', label: 'Carro', sublabel: 'Versão veicular', diffuserModel: 'round' },
];
