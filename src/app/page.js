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
import SectionBoundary from '@/components/SectionBoundary';
import ClientPageWrapper from '@/components/ClientPageWrapper';

export default function Home() {
  return (
    <ClientPageWrapper>
      <main className="min-h-screen no-scrollbar relative"> {/* Ensure no conflicting background here */}
        {/* Global Fireflies Background - Covers all sections except footer */}
        <FirefliesBackground 
          count={25} 
          speed={0.3} 
          size={2.5} 
          opacity={0.8} 
          excludeFooter={true}
        />
        
        <Navbar />
        <SectionBoundary sectionName="hero" className="scroll-snap-start">
          <Hero />
        </SectionBoundary>
        <SectionBoundary sectionName="newsletter" className="scroll-snap-start">
          <Newsletter />
        </SectionBoundary>
        <SectionBoundary sectionName="services" className="scroll-snap-start">
          <ServicesFocus />
        </SectionBoundary>
        <SectionBoundary sectionName="benefits" className="scroll-snap-start">
          <Benefits />
        </SectionBoundary>
        <SectionBoundary sectionName="whatittakes" className="scroll-snap-start">
          <WhatItTakes />
        </SectionBoundary>
        <SectionBoundary sectionName="process" className="scroll-snap-start">
          <ProcessFloating />
        </SectionBoundary>
        <SectionBoundary sectionName="system" className="scroll-snap-start">
          <OurSystem />
        </SectionBoundary>
        <SectionBoundary sectionName="portfolio" className="scroll-snap-start">
          <Portfolio />
        </SectionBoundary>
        <SectionBoundary sectionName="testimonials" className="scroll-snap-start">
          <Testimonials />
        </SectionBoundary>
        <SectionBoundary sectionName="stats" className="scroll-snap-start">
          <Stats />
        </SectionBoundary>
        <SectionBoundary sectionName="discovery" className="scroll-snap-start">
          <DiscoveryCall />
        </SectionBoundary>
        <SectionBoundary sectionName="footer" className="scroll-snap-start">
          <Footer />
        </SectionBoundary>
      </main>
    </ClientPageWrapper>
  );
}
