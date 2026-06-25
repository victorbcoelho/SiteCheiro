type AnalyticsEvent =
  | 'lead_captured'
  | 'cta_clicked'
  | 'page_viewed'
  | 'wizard_step'
  | 'button_click';

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

export function trackEvent(
  eventName: AnalyticsEvent,
  params: Record<string, unknown> = {}
) {
  if (typeof window === 'undefined') return;

  if (window.gtag) {
    window.gtag('event', eventName, params);
  }

  if (window.fbq && eventName === 'lead_captured') {
    window.fbq('track', 'Lead', params);
  }
}

export function trackClick(label: string, extra: Record<string, unknown> = {}) {
  trackEvent('button_click', { label, url: typeof window !== 'undefined' ? window.location.pathname : '', ...extra });
}
