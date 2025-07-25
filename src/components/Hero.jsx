'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Youtube } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ClientImage = ({ src, alt, fallback }) => {
  // Initialize error state. If src is falsy (e.g., empty string), start with an error.
  const [error, setError] = useState(!src);

  useEffect(() => {
    // When the src prop changes, reset the error state.
    setError(!src);
  }, [src]);

  // If there's an error (either from initial bad src or from onError), render the fallback.
  if (error) {
    return fallback;
  }

  // Render the next/image component. It will correctly handle local paths starting with '/'.
  return (
    <Image
      src={src}
      alt={alt}
      width={48}
      height={48}
      className="w-full h-full object-cover"
      // If next/image fails to load the image (e.g., 404), set error to true.
      onError={() => setError(true)} 
    />
  );
};

const socialProofData = [
  {
    name: 'Insane Curiosity',
    followers: '592K+ Subscribers',
    href: 'https://www.youtube.com/@insanecuriosity',
    channelImage: '/images/Insane Curiosity.jpg',
  },
  {
    name: 'PBS Space Time',
    followers: '3.3M+ Subscribers',
    href: 'https://www.youtube.com/@pbsspacetime',
    channelImage: '/images/PBS Space Time.jpg',
  },
  {
    name: 'Finance With Sharan',
    followers: '3.53M+ Subscribers',
    href: 'https://www.youtube.com/@financewithsharan',
    channelImage: '/images/Finance With Sharan.jpg',
  },
  {
    name: 'Philipp Humm',
    followers: '111K+ Subscribers',
    href: 'https://www.youtube.com/@philipp-humm',
    channelImage: '/images/Philipp Humm.jpg',
  },
  {
    name: 'Kallaway',
    followers: '163K+ Subscribers',
    href: 'https://www.youtube.com/@kallawaymarketing',
    channelImage: '/images/Kallaway.jpg',
  },
];

const Hero = () => {
  const svg1Ref = useRef(null);
  const svg2Ref = useRef(null);
  const svg3Ref = useRef(null);
  const animationTimeoutRef = useRef(null);

  useEffect(() => {
    const heroSection = document.getElementById('hero-section');
    const svgs = [svg1Ref.current, svg2Ref.current, svg3Ref.current];

    const handleMouseMove = () => {
      if (animationTimeoutRef.current) {
        return;
      }

      svgs.forEach((svg, index) => {
        if (svg) {
          setTimeout(() => {
            svg.classList.add('is-animating');
          }, index * 50);
        }
      });

      animationTimeoutRef.current = setTimeout(() => {
        svgs.forEach(svg => {
          if (svg) {
            svg.classList.remove('is-animating');
          }
        });
        animationTimeoutRef.current = null;
      }, 800); // Match animation duration
    };

    const handleMouseLeave = () => {
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
        animationTimeoutRef.current = null;
      }
      svgs.forEach(svg => {
        if (svg) {
          svg.classList.remove('is-animating');
        }
      });
    };

    heroSection.addEventListener('mousemove', handleMouseMove);
    heroSection.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      heroSection.removeEventListener('mousemove', handleMouseMove);
      heroSection.removeEventListener('mouseleave', handleMouseLeave);
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
    };
  }, []);
  return (
    <section id="hero-section" className="min-h-screen flex flex-col items-center justify-center bg-transparent text-foreground">
      <div className="container mx-auto px-4">
        <div className="relative max-w-6xl mx-auto">
          {/* Decorative SVGs */}
          <img 
            src="https://cdn.prod.website-files.com/67416bf9ad9706da53302213/674fe125968e67a82f575da8_hero_cursors-01.svg" 
            alt="Decorative Cursor Top Left" 
            ref={svg1Ref}
            id="hero-svg-cursor-1" 
            className="absolute w-28 h-28 top-32 left-4 -translate-x-1/2 -translate-y-1/2 pointer-events-none lg:-translate-x-3/4" 
            style={{ zIndex: -1 }}
          />
          <div className="hidden md:block absolute top-4 right-4 -translate-y-1/2">
            <img 
              src="https://cdn.prod.website-files.com/67416bf9ad9706da53302213/674fe125e96249102a19409d_hero_cursors-03.svg" 
              alt="Decorative Cursor Top Right" 
              ref={svg2Ref}
              id="hero-svg-cursor-2" 
              className="pointer-events-none lg:translate-x-3/4 lg:-translate-y-1/4" 
              style={{ zIndex: -1 }}
            />
          </div>
          <img 
            src="https://cdn.prod.website-files.com/67416bf9ad9706da53302213/674fe12675d184828e638da2_hero_cursors-02.svg" 
            alt="Decorative Cursor Bottom Right" 
            ref={svg3Ref}
            id="hero-svg-cursor-3" 
            className="absolute w-28 h-28 bottom-16 right-4 translate-x-1/2 translate-y-1/2 pointer-events-none lg:translate-x-3/4" 
            style={{ zIndex: -1 }}
          />
          
          {/* Original Content Wrapper */}
          <div className="flex flex-col items-center text-center space-y-8">
          <div className="inline-flex items-center gap-x-2 bg-gold/20 text-gold text-xs font-semibold px-3 py-1.5 rounded-full uppercase tracking-wide border border-gold/50 shadow-sm">
            <div className="w-4 h-4 icon-gold" />
            <span>SCALE ORGANICALLY</span>
          </div>
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold tracking-tighter text-foreground text-center leading-tight">
            We build organic content engines<br />for <span className="text-gold-shimmer">Entrepreneurs &amp; VCs</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed mt-8">
            We help you build organic distribution, which predictably bring
            more leads and builds trust in your market segment.
          </p>
          <div>
            <Button 
              className="btn-hero-cta px-10 py-7 text-xl bg-transparent text-gold hover:text-text-on-accent border border-gold rounded-full font-bold tracking-wide relative overflow-hidden transition-all duration-300 ease-in-out group"
              onClick={() => {
                const section = document.getElementById('booking-form');
                if (section) {
                  section.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
              }}
            >
              Book a Call
            </Button>
          </div>
        </div>

          </div> {/* Closing tag for inner text content wrapper */}
        {/* Social Proof Section */}
        <div className="mt-12 md:mt-16">
          <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-4 md:gap-x-12">
            {socialProofData.map((client) => (
              <Link 
                href={client.href} 
                key={client.name} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="group bg-black/20 backdrop-blur-md border border-white/10 rounded-xl p-4 flex items-center space-x-4 hover:border-gold transition-all duration-300 ease-in-out w-full sm:w-auto max-w-[260px] sm:max-w-none hover:scale-105 hover:-translate-y-1 shadow-lg hover:shadow-gold/30"
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-black/30 backdrop-blur-sm flex items-center justify-center text-foreground font-semibold text-base group-hover:bg-gold/25 transition-colors duration-150 overflow-hidden">
                  <ClientImage 
                    src={client.channelImage} 
                    alt={client.name}
                    fallback={<Youtube className="w-6 h-6 text-muted-foreground group-hover:text-gold/80 transition-colors duration-150" />}
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-base font-semibold text-foreground group-hover:text-gold transition-colors duration-150">
                    {client.name}
                  </span>
                  <span className="text-sm text-muted-foreground group-hover:text-gold/80 transition-colors duration-150">
                    {client.followers}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
      

    </section>
  );
};

const VidVerseIcon = () => {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5 text-current"
    >
      <path
        d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M9 12l2 2 4-4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default Hero;