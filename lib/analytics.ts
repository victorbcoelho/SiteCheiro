import { logEvent } from 'firebase/analytics';
import { getAnalyticsInstance } from './firebase';

type AnalyticsEvent = 'lead_captured' | 'cta_clicked' | 'page_viewed';

export async function trackEvent(
  eventName: AnalyticsEvent,
  params: Record<string, unknown> = {}
) {
  const analytics = await getAnalyticsInstance();
  if (analytics) {
    logEvent(analytics, eventName, params);
  }

  if (typeof window !== 'undefined' && (window as any).fbq) {
    if (eventName === 'lead_captured') {
      (window as any).fbq('track', 'Lead', params);
    }
  }
}
