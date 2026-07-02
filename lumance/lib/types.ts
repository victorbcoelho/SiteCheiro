export type LeadType = 'waitlist' | 'reservation';

export interface WizardResponses {
  step1: string;
  step2: string;
}

export interface LeadPayload {
  email: string;
  whatsapp?: string;
  type: LeadType;
  wizard_responses: WizardResponses;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
}
