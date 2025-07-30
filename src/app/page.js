import Hero from '@/components/Hero';
import Navbar from '@/components/Navbar';
import Newsletter from '@/components/Newsletter';
import ServicesFocus from '@/components/ServicesFocus';
import Benefits from '@/components/BenefitsNew'; // Updated to use new Benefits component
import WhatItTakes from '@/components/WhatItTakes';
import ProcessFloating from '@/components/ProcessFloating';
import ParticleBackground from "@/components/ParticleBackground";
import FirefliesBackground from "@/components/FirefliesBackground";
import OurSystem from '@/components/OurSystem';
import Portfolio from "@/components/Portfolio";
import Testimonials from '@/components/Testimonials';
import Stats from '@/components/Stats';
import DiscoveryCall from '@/components/DiscoveryCall';
import Footer from '@/components/Footer';
import IconOverlay from '@/components/IconOverlay';

export default function Home() {
  if (process.env.NODE_ENV === 'development') {
    console.log('[VidVerse Debug] Rendering Home page (page.js) - All Components Restored');
  }
  return (
    <main className="min-h-screen no-scrollbar relative"> {/* Ensure no conflicting background here */}
      {/* Global Fireflies Background - Covers all sections except footer */}
      <FirefliesBackground 
        count={25} 
        speed={0.3} 
        size={2.5} 
        opacity={0.8} 
        excludeFooter={true}
      />
      
      {/* Icon Overlay - Renders all saved icons on the website */}
      <IconOverlay />
      
      <Navbar />
      <div className="scroll-snap-start">
        <Hero />
      </div>
      <div className="scroll-snap-start">
        <Newsletter />
      </div>
      <div className="scroll-snap-start">
        <ServicesFocus />
      </div>
      <div className="scroll-snap-start">
        <Benefits />
      </div>
      <div className="scroll-snap-start">
        <WhatItTakes />
      </div>
      <div className="scroll-snap-start">
        <ProcessFloating />
      </div>
      <div className="scroll-snap-start">
        <OurSystem />
      </div>
      <div className="scroll-snap-start">
        <Portfolio />
      </div>
      <div className="scroll-snap-start">
        <Testimonials />
      </div>
      <div className="scroll-snap-start">
        <Stats />
      </div>
      <div className="scroll-snap-start">
        <DiscoveryCall />
      </div>
      <div className="scroll-snap-start">
        <Footer />
      </div>
    </main>
  );
}
