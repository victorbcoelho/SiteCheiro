import Hero from '@/components/sections/Hero';
import VideoCarousel from '@/components/sections/VideoCarousel';
import Problem from '@/components/sections/Problem';
import Solution from '@/components/sections/Solution';
import HowItWorks from '@/components/sections/HowItWorks';
import Plans from '@/components/sections/Plans';
import Scents from '@/components/sections/Scents';
import ProductBuilder from '@/components/sections/ProductBuilder';
import AppShowcase from '@/components/sections/AppShowcase';
import PresaleSection from '@/components/sections/PresaleSection';
import FAQSection from '@/components/sections/FAQSection';

export default function Home() {
  return (
    <>
      <Hero />
      <VideoCarousel />
      <Problem />
      <Solution />
      <HowItWorks />
      <Plans />
      <Scents />
      <ProductBuilder />
      <AppShowcase />
      <PresaleSection />
      <FAQSection />
    </>
  );
}
