'use client';

import { useEffect, useRef } from 'react';
import { trackEvent } from './analytics';

// Fires scroll_depth events at 25, 50, 75, 90% of page height
export function useScrollDepth(page: string) {
  const firedRef = useRef<Set<number>>(new Set());

  useEffect(() => {
    const thresholds = [25, 50, 75, 90];

    const onScroll = () => {
      const scrolled = window.scrollY + window.innerHeight;
      const total = document.documentElement.scrollHeight;
      const pct = Math.round((scrolled / total) * 100);

      for (const t of thresholds) {
        if (pct >= t && !firedRef.current.has(t)) {
          firedRef.current.add(t);
          trackEvent('scroll_depth', { page, depth: t });
        }
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [page]);
}

// Fires section_view when a section enters the viewport (once per section)
export function useSectionView(sectionId: string, page: string) {
  const ref = useRef<HTMLElement | null>(null);
  const fired = useRef(false);

  useEffect(() => {
    const el = document.getElementById(sectionId);
    if (!el) return;
    ref.current = el;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !fired.current) {
          fired.current = true;
          trackEvent('section_view', { section: sectionId, page });
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [sectionId, page]);
}
