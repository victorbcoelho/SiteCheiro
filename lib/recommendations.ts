import { scents, type Scent } from './products';

export interface MoodOption {
  id: string;
  label: string;
  scentIds: string[];
}

export const moodOptions: MoodOption[] = [
  {
    id: 'ar-puro',
    label: 'Ar puro',
    scentIds: ['brisa-do-mar', 'bambu-cha-branco', 'floresta-tropical'],
  },
  {
    id: 'frutas-tropicais',
    label: 'Frutas tropicais',
    scentIds: ['flor-de-laranjeira', 'brisa-do-mar', 'cafe-especiarias'],
  },
  {
    id: 'colecao-calma',
    label: 'Coleção calma',
    scentIds: ['lavanda-provence', 'bambu-cha-branco', 'flor-de-laranjeira'],
  },
  {
    id: 'baunilha-aconchegante',
    label: 'Baunilha aconchegante',
    scentIds: ['baunilha-ambar', 'cafe-especiarias', 'madeira-nobre'],
  },
  {
    id: 'escape-costeiro',
    label: 'Escape costeiro',
    scentIds: ['brisa-do-mar', 'bambu-cha-branco', 'flor-de-laranjeira'],
  },
  {
    id: 'suave-e-limpo',
    label: 'Suave e limpo',
    scentIds: ['bambu-cha-branco', 'lavanda-provence', 'flor-de-laranjeira'],
  },
  {
    id: 'relaxar',
    label: 'Relaxar e dormir melhor',
    scentIds: ['lavanda-provence', 'baunilha-ambar', 'flor-de-laranjeira'],
  },
  {
    id: 'energia',
    label: 'Energia e foco',
    scentIds: ['cafe-especiarias', 'floresta-tropical', 'brisa-do-mar'],
  },
  {
    id: 'aconchego',
    label: 'Aconchego',
    scentIds: ['baunilha-ambar', 'cafe-especiarias', 'madeira-nobre'],
  },
  {
    id: 'alegria',
    label: 'Alegria e bom humor',
    scentIds: ['flor-de-laranjeira', 'brisa-do-mar', 'bambu-cha-branco'],
  },
  {
    id: 'sofisticacao',
    label: 'Sofisticação e elegância',
    scentIds: ['madeira-nobre', 'bambu-cha-branco', 'lavanda-provence'],
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
  diffuserModel: 'room' | 'tower' | 'car';
}

export const roomOptions: RoomOption[] = [
  { id: 'sala-grande', label: 'Sala grande', sublabel: 'Acima de 20 m²', diffuserModel: 'tower' },
  { id: 'sala-pequena', label: 'Sala pequena', sublabel: 'Até 20 m²', diffuserModel: 'room' },
  { id: 'quarto', label: 'Quarto', sublabel: 'Dormitório', diffuserModel: 'room' },
  { id: 'banheiro', label: 'Banheiro', sublabel: 'Lavabo ou banheiro', diffuserModel: 'room' },
  { id: 'carro', label: 'Carro', sublabel: 'Versão veicular', diffuserModel: 'car' },
];
