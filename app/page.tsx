import Hero from '@/components/sections/Hero';
import HowToUse from '@/components/sections/HowToUse';
import SafetySection from '@/components/sections/SafetySection';
import FragranceGrid from '@/components/sections/FragranceGrid';
import TechFeatures from '@/components/sections/TechFeatures';
import FAQSection from '@/components/sections/FAQSection';

export default function Home() {
  return (
    <>
      <Hero />
      <HowToUse />
      <SafetySection />
      <FragranceGrid />
      <TechFeatures />
      <FAQSection />
    </>
  );
}
