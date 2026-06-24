import Hero from '@/components/sections/Hero';
import StarterKit from '@/components/sections/StarterKit';
import TechFeatures from '@/components/sections/TechFeatures';
import ScentCarousel from '@/components/sections/ScentCarousel';
import PresaleSection from '@/components/sections/PresaleSection';
import FAQSection from '@/components/sections/FAQSection';

export default function Home() {
  return (
    <>
      <Hero />
      <StarterKit />
      <TechFeatures />
      <ScentCarousel />
      <PresaleSection />
      <FAQSection />
    </>
  );
}
