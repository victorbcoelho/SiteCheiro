type AnalyticsEvent =
  | 'lead_captured'
  | 'button_click'
  | 'wizard_started'
  | 'wizard_step'
  | 'wizard_summary_viewed'
  | 'wizard_plan_selected'
  | 'scroll_depth'
  | 'section_view'
  | 'cart_opened';

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    gtag_report_conversion?: (url?: string) => boolean;
    fbq?: (...args: unknown[]) => void;
    ttq?: {
      track: (...args: unknown[]) => void;
      identify: (...args: unknown[]) => void;
    };
    pintrk?: (...args: unknown[]) => void;
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

  if (eventName === 'lead_captured') {
    window.fbq?.('track', 'Lead', params);
  }
}

export function trackClick(label: string, extra: Record<string, unknown> = {}) {
  trackEvent('button_click', {
    label,
    url: typeof window !== 'undefined' ? window.location.pathname : '',
    ...extra,
  });
}

// SHA-256 hash via Web Crypto API — TikTok requires PII hashed client-side before ttq.identify()
async function sha256Hex(value: string): Promise<string> {
  const normalized = value.trim().toLowerCase();
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(normalized));
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

// Identifies the visitor to TikTok ahead of conversion events, improving match rate.
// Call this before trackCommerceEvent on pages with known PII (e.g. after lead capture).
export async function identifyUser(params: { email?: string; phone?: string; externalId?: string }) {
  if (typeof window === 'undefined' || !window.ttq) return;

  const [email, phoneNumber, externalId] = await Promise.all([
    params.email ? sha256Hex(params.email) : undefined,
    params.phone ? sha256Hex(params.phone) : undefined,
    params.externalId ? sha256Hex(params.externalId) : undefined,
  ]);

  window.ttq.identify({
    ...(email && { email }),
    ...(phoneNumber && { phone_number: phoneNumber }),
    ...(externalId && { external_id: externalId }),
  });
  console.log('[Sinesia TikTok] ttq.identify() disparado (e-mail hasheado, sem PII em texto puro)');
}

export type CommerceEventName =
  | 'ViewContent'
  | 'AddToCart'
  | 'AddToWishlist'
  | 'Search'
  | 'AddPaymentInfo'
  | 'InitiateCheckout'
  | 'PlaceAnOrder'
  | 'CompleteRegistration'
  | 'Purchase';

interface CommerceContent {
  contentId: string;
  contentType?: 'product' | 'product_group';
  contentName: string;
}

interface CommerceParams {
  contents: CommerceContent[];
  value: number;
  currency?: string;
}

// Fires the standard e-commerce event schema TikTok (and Meta, for the overlapping events)
// expect: contents[], value, currency. Use alongside trackEvent for the GA4-shaped event.
export function trackCommerceEvent(
  eventName: CommerceEventName,
  { contents, value, currency = 'BRL' }: CommerceParams,
  opts?: { eventId?: string }
) {
  if (typeof window === 'undefined') return;

  const payload = {
    contents: contents.map((c) => ({
      content_id: c.contentId,
      content_type: c.contentType ?? 'product',
      content_name: c.contentName,
    })),
    value,
    currency,
  };

  // event_id permite deduplicar com o evento server-side (Conversions API)
  window.ttq?.track(eventName, payload, opts?.eventId ? { event_id: opts.eventId } : undefined);
  console.log(`[Sinesia TikTok] ttq.track('${eventName}')`, payload, window.ttq ? '✅ enviado' : '❌ ttq indisponível');

  const fbqMappable: CommerceEventName[] = ['ViewContent', 'AddToCart', 'AddToWishlist', 'Search', 'AddPaymentInfo', 'InitiateCheckout', 'CompleteRegistration', 'Purchase'];
  if (fbqMappable.includes(eventName)) {
    window.fbq?.('track', eventName, payload, opts?.eventId ? { eventID: opts.eventId } : undefined);
  }
}
