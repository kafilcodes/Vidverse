'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
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
    <section id="hero-section" className="relative min-h-screen flex flex-col items-center justify-center bg-transparent text-foreground overflow-hidden">

      <div className="absolute inset-0 pointer-events-none z-[-1] overflow-hidden">

        {/* BG ICONS HERO SECTION - Large SVG */}
        <Image
          src="/bg-icons/6741920c46039eebb45b5b76_elipse-hero-left.svg"
          width={700}
          height={700}

          className="absolute -top-50 -left-60 opacity-100 scale-110 hidden md:block"
          alt=""
          priority={false}
        />
        <Image
          src="/bg-icons/6741920c019ec243876fef54_elipse-hero-right.svg"
          width={700}
          height={700}

          className="absolute -bottom-50 -right-60 opacity-100 scale-110 hidden md:block"
          alt=""
          priority={false}
        />
        <Image
          src="/bg-icons/674fe125b28eb4eb17b40d25_hero-shapes-01.svg"
          width={32}
          height={32}
          className="absolute top-30 left-90 scale-110 hidden md:block"
          alt=""
          priority={false}
          style={{
            animation: 'fadeInOut 3s ease-in-out infinite',
            animationDelay: '0s'
          }}
        />
        <Image
          src="/bg-icons/674fe125c81340ba38928817_hero-shapes-02.svg"
          width={32}
          height={32}
          className="absolute top-55 right-45 scale-110 hidden md:block"
          alt=""
          priority={false}
          style={{
            animation: 'fadeInOut 3.5s ease-in-out infinite',
            animationDelay: '0.8s'
          }}
        />

        <Image
          src="/bg-icons/674fe126c81340ba3892882b_hero-shapes-03.svg"
          width={32}
          height={32}
          className="absolute bottom-58 right-115 scale-110 hidden md:block"
          alt=""
          priority={false}
          style={{
            animation: 'fadeInOut 4s ease-in-out infinite',
          }}
        />

        <Image
          src="/bg-icons/674fe126e96249102a1940a1_hero-shapes-04.svg"
          width={32}
          height={32}
          className="absolute bottom-69 left-135 scale-110 hidden md:block"
          alt=""
          priority={false}
          style={{
            animation: 'fadeInOut 3.2s ease-in-out infinite',
            animationDelay: '2.4s'
          }}
        />

      </div>

      <div className="container mx-auto px-4 sm:px-6">
        <div className="relative max-w-6xl mx-auto">
          {/* Decorative SVGs */}
          <Image
            src="/logo/674fe125968e67a82f575da8_hero_cursors-01.svg"
            alt="Content Creator Cursor"
            width={60}
            height={60}
            ref={svg1Ref}
            id="hero-svg-cursor-1"
            className="absolute w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 top-32 sm:top-40 md:top-52 lg:top-62 -left-8 sm:-left-10 md:-left-12 lg:-left-15 -translate-x-1/2 -translate-y-1/2 pointer-events-none lg:-translate-x-3/4"
            style={{ zIndex: -1 }}
            priority={true}
          />
          <div className="hidden md:block absolute top-4 right-4 -translate-y-1/2">
            <Image
              src="/logo/674fe125e96249102a19409d_hero_cursors-03.svg"
              alt="Podcast Host Cursor"
              width={60}
              height={60}
              ref={svg2Ref}
              id="hero-svg-cursor-2"
              className="w-20 h-20 md:w-28 md:h-28 lg:w-32 lg:h-32 pointer-events-none lg:translate-x-3/4 lg:-translate-y-1/4"
              style={{ zIndex: -1 }}
              priority={true}
            />
          </div>
          <Image
            src="/logo/674fe12675d184828e638da2_hero_cursors-02.svg"
            alt="Entrepreneur Cursor"
            width={60}
            height={60}
            ref={svg3Ref}
            id="hero-svg-cursor-3"
            className="absolute w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 bottom-8 sm:bottom-12 md:bottom-16 right-2 sm:right-3 md:right-4 translate-x-1/2 translate-y-1/2 pointer-events-none lg:translate-x-3/4"
            style={{ zIndex: -1 }}
            priority={true}
          />

          {/* Original Content Wrapper */}
          <div className="flex flex-col items-center text-center space-y-6 sm:space-y-8 md:space-y-10 lg:space-y-12">
            <div className="inline-flex items-center gap-x-2 bg-gold/20 text-gold text-xs font-semibold px-3 py-1.5 rounded-full uppercase tracking-wide border border-gold/50 shadow-sm">
              <div className="w-4 h-4 icon-gold" />
              <span>SCALE ORGANICALLY</span>
            </div>
            <h1 className="text-4xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tighter text-foreground text-center leading-tight max-w-7xl mx-auto">
              We build organic content engines for<br className="hidden sm:block" />
              <span className="relative inline-block">
                <span className="text-4xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-gold-shimmer block mt-2 sm:mt-3 md:mt-4">
                  Entrepreneurs &amp; VCs
                </span>
                <motion.div
                  className="absolute -bottom-1 left-0 h-1 bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 rounded-full"
                  initial={{ width: 0 }}
                  whileInView={{ width: '100%' }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 0.5 }}
                />
              </span>
            </h1>
            <p className="text-base sm:text-lg font-bold text-muted-foreground max-w-xs sm:max-w-md md:max-w-lg lg:max-w-2xl mx-auto leading-relaxed mt-4 sm:mt-5 md:mt-6 text-shimmer px-4 sm:px-0">
              We help you build organic distribution that predictably brings 
              more engagement and leads, and builds trust in your market segment.
            </p>
            <div className="mt-6 sm:mt-7 md:mt-8">
              <Button
                className="btn-hero-cta px-6 sm:px-8 md:px-10 py-4 sm:py-5 md:py-6 lg:py-7 text-base sm:text-lg md:text-xl bg-transparent text-gold hover:text-text-on-accent border border-gold rounded-full font-bold tracking-wide relative overflow-hidden transition-all duration-300 ease-in-out group"
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
        <div className="mt-12 sm:mt-16 md:mt-20 lg:mt-24">
          <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-3 sm:gap-x-6 sm:gap-y-4 md:gap-x-8 lg:gap-x-12">
            {socialProofData.map((client) => (
              <Link
                href={client.href}
                key={client.name}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-white/5 backdrop-blur-xl border border-white/20 rounded-lg sm:rounded-xl p-3 sm:p-4 flex items-center space-x-3 sm:space-x-4 hover:border-gold transition-all duration-300 ease-in-out w-full sm:w-auto max-w-[280px] sm:max-w-[260px] md:max-w-none hover:scale-105 hover:-translate-y-1 shadow-lg hover:shadow-gold/30 hover:bg-white/10"
              >
                <div className="flex-shrink-0 w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-md sm:rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center text-foreground font-semibold text-sm sm:text-base group-hover:bg-gold/25 transition-colors duration-150 overflow-hidden">
                  <ClientImage
                    src={client.channelImage}
                    alt={client.name}
                    fallback={<Youtube className="w-5 h-5 sm:w-6 sm:h-6 text-muted-foreground group-hover:text-gold/80 transition-colors duration-150" />}
                  />
                </div>
                <div className="flex flex-col min-w-0 flex-1">
                  <span className="text-sm sm:text-base font-semibold text-foreground group-hover:text-gold transition-colors duration-150 truncate">
                    {client.name}
                  </span>
                  <span className="text-xs sm:text-sm text-muted-foreground group-hover:text-gold/80 transition-colors duration-150 truncate">
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