import PageInit from '@/components/PageInit';
import TopBar from '@/components/sections/TopBar';
import Navbar from '@/components/sections/Navbar';
import Hero from '@/components/sections/Hero';
import SocialProof from '@/components/sections/SocialProof';
import Product from '@/components/sections/Product';
import Manifesto from '@/components/sections/Manifesto';
import Testimonials from '@/components/sections/Testimonials';
import Compare from '@/components/sections/Compare';
import Wizard from '@/components/sections/Wizard';
import FAQ from '@/components/sections/FAQ';
import Footer from '@/components/sections/Footer';

export default function Home() {
  return (
    <>
      <PageInit />
      <TopBar />
      <Navbar />
      <main>
        <Hero />
        <SocialProof />
        <Product />
        <Manifesto />
        <Testimonials />
        <Compare />
        <Wizard />
        <FAQ />
      </main>
      <Footer />
    </>
  );
}
