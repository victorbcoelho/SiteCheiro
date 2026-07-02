// Configuração do wizard de personalização da máscara de luz LED Lûmance.
// Passo 1 = objetivo de pele (define o protocolo de luz).
// Passo 2 = acabamento da máscara (variante estética).

export interface WizardOption {
  value: string;
  title: string;
  description: string;
  // Cor usada no placeholder visual do card.
  swatch: string;
}

export interface WizardStepConfig {
  key: 'step1' | 'step2';
  eyebrow: string;
  title: string;
  helper: string;
  options: WizardOption[];
}

export const WIZARD_STEPS: WizardStepConfig[] = [
  {
    key: 'step1',
    eyebrow: 'Passo 1 de 3',
    title: 'Qual é o seu principal objetivo?',
    helper: 'Definimos o protocolo de luz ideal para o seu resultado.',
    options: [
      {
        value: 'firmeza',
        title: 'Firmeza & colágeno',
        description: 'Luz vermelha 630nm para estimular colágeno e reduzir linhas finas.',
        swatch: '#C0554E',
      },
      {
        value: 'manchas',
        title: 'Manchas & uniformidade',
        description: 'Luz âmbar 590nm para uniformizar o tom e suavizar manchas.',
        swatch: '#D89A4E',
      },
      {
        value: 'acne',
        title: 'Acne & oleosidade',
        description: 'Luz azul 465nm para controlar a oleosidade e acalmar a pele.',
        swatch: '#4E77C0',
      },
    ],
  },
  {
    key: 'step2',
    eyebrow: 'Passo 2 de 3',
    title: 'Escolha o acabamento da sua máscara',
    helper: 'A tecnologia é a mesma — o acabamento é seu.',
    options: [
      {
        value: 'perola',
        title: 'Pérola Branca',
        description: 'Silicone médico em branco perolado. Clássico e discreto.',
        swatch: '#EFE9E1',
      },
      {
        value: 'rose',
        title: 'Rosé Gold',
        description: 'Acabamento rosé quente com detalhes dourados.',
        swatch: '#D8A9A0',
      },
      {
        value: 'grafite',
        title: 'Grafite Fosco',
        description: 'Cinza-grafite fosco, para um visual mais sóbrio.',
        swatch: '#4A4A4E',
      },
    ],
  },
];

export const KIT_PRICE = 'R$ 890';
export const RESERVATION_VALUE = 'R$ 50';

// Recupera o rótulo legível de uma opção a partir do valor salvo.
export function labelForSelection(stepKey: 'step1' | 'step2', value: string): string {
  const step = WIZARD_STEPS.find((s) => s.key === stepKey);
  const option = step?.options.find((o) => o.value === value);
  return option?.title ?? value;
}
