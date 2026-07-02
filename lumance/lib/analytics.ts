// Sistema de analytics centralizado para GA4, Meta Pixel e TikTok Pixel.
// Todas as funções são seguras para SSR — verificam `window` antes de disparar.

import type { LeadType } from './types';

type GtagFn = (...args: unknown[]) => void;
type FbqFn = (...args: unknown[]) => void;
type TtqObj = { track: (event: string, params?: Record<string, unknown>) => void };

declare global {
  interface Window {
    gtag?: GtagFn;
    fbq?: FbqFn;
    ttq?: TtqObj;
  }
}

function hasWindow(): boolean {
  return typeof window !== 'undefined';
}

/**
 * Conversão principal: lead capturado (waitlist ou reservation).
 * GA4 → evento `lead_captured` · Meta → `Lead` · TikTok → `CompleteRegistration`.
 */
export function trackLeadCaptured(email: string, type: LeadType): void {
  if (!hasWindow()) return;

  window.gtag?.('event', 'lead_captured', {
    type,
    // Não enviamos o email em claro para o GA4; apenas sinalizamos que houve email.
    has_email: Boolean(email),
  });

  window.fbq?.('track', 'Lead', { content_category: type });

  window.ttq?.track('CompleteRegistration', { content_type: type });
}

/**
 * Clique em qualquer CTA do site. `label` identifica a origem do clique
 * (header_cta, hero_cta, wizard_waitlist_cta, wizard_reservation_cta, etc.).
 */
export function trackButtonClick(label: string): void {
  if (!hasWindow()) return;
  window.gtag?.('event', 'cta_click', { label });
}

/**
 * Progresso dentro do wizard. Permite medir o funil:
 * quantos iniciam vs. quantos chegam ao resumo.
 */
export function trackWizardStep(stepName: string, selection: string): void {
  if (!hasWindow()) return;
  window.gtag?.('event', 'wizard_progress', {
    step_name: stepName,
    selection,
  });
}

/** Pageview padrão do GA4. */
export function trackPageView(page: string): void {
  if (!hasWindow()) return;
  window.gtag?.('event', 'page_view', { page_path: page });
}
