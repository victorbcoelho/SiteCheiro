'use client';

import StarterKitWizard from '@/components/sections/StarterKitWizard';
import { useScrollDepth } from '@/lib/useScrollTracking';

export default function StarterKitPage() {
  useScrollDepth('starter_kit');
  return <StarterKitWizard />;
}
