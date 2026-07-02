'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { trackPageView } from '@/lib/analytics';
import { captureUtm } from '@/lib/utm';

// Dispara pageview no GA4 e captura/persiste os UTM params ao carregar a rota.
export default function PageInit() {
  const pathname = usePathname();

  useEffect(() => {
    captureUtm();
    trackPageView(pathname);
  }, [pathname]);

  return null;
}
