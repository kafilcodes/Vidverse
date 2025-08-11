'use client';

import React from 'react';
import { motion } from 'framer-motion';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import Image from 'next/image';
import { Star, Quote, MessageSquare } from 'lucide-react';
import SectionChip from '@/components/ui/section-chip';
import { GlowingEffect } from '@/components/ui/glowing-effect';

const testimonialsData = [
  {
    name: 'Insane Curiosity',
    image: '/images/Insane Curiosity.jpg',
    quote: 'Fast Delivery & Good editing!',
  },
  {
    name: 'PBS Space Time',
    image: '/images/PBS Space Time.jpg',
    quote: 'The level of detail and creativity VidVerse brought to our content was phenomenal. They understood our niche and delivered high-quality and engaging videos',
  },
  {
    name: 'Finance With Sharan',
    image: '/images/Finance With Sharan.jpg',
    quote: 'As a creator in the finance space, trust is everything. My decision to use Vidverse, and Iwas thoroughly impressed with the results. Not only did it live up to its promises, but it exceeded my expectations.',
  },
  {
    name: 'Philipp Humm',
    image: '/images/Philipp Humm.jpg',
    quote: "Their editing team is excellent. It's great when you have a team that always looks to turn it right back around no questions asked.",
  },
  {
    name: 'Kallaway',
    image: '/images/Kallaway.jpg',
    quote: 'Vidverse is amazing! They totally nailed our brand story with their videos. Super creative, easy to work with, and the results were awesome—our traffic and sales went way up. Highly recommend them!',
  },
];

const trustedLogos = [
  { name: 'Insane Curiosity', image: '/images/Insane Curiosity.jpg' },
  { name: 'PBS Space Time', image: '/images/PBS Space Time.jpg' },
  { name: 'Finance With Sharan', image: '/images/Finance With Sharan.jpg' },
  { name: 'Philipp Humm', image: '/images/Philipp Humm.jpg' },
  { name: 'Kallaway', image: '/images/Kallaway.jpg' },
];

const Testimonials = () => {
  const [emblaRef] = useEmblaCarousel({ loop: true, align: 'start' }, [
    Autoplay({ delay: 4000, stopOnInteraction: false }),
  ]);

  return (
    <section id="testimonials" className="relative py-20 md:pt-28 md:pb-16 bg-transparent text-white overflow-hidden">
      {/* Background Icons Layer - Lowest z-index */}
      <div className="absolute inset-0 pointer-events-none z-[1] overflow-hidden">
        {/* BG ICONS TESTIMONIALS SECTION - Bottom Right */}
        <Image
          src="/bg-icons/675290c850a93f05b4716e44_system-shapes-02.svg"
          width={600}
          height={600}
          className="absolute -top-50 -left-50 opacity-30 "
          alt=""
          priority={false}
        />

        {/* BG ICONS TESTIMONIALS SECTION - Top Left */}
        <Image
          src="/bg-icons/675290c78101ac77f602fa40_system-shapes-01.svg"
          width={600}
          height={600}
          className="absolute -top-50 -right-50 opacity-30 "
          alt=""
          priority={false}
        />
      </div>
      
      {/* Black Background Layer - Middle z-index, allows icons to show through */}
      <div className="absolute inset-0 bg-black/90 z-[-1]"></div>
      <div className="absolute inset-0 z-0 opacity-20">
        <div className="absolute -top-1/4 left-1/4 w-[1000px] h-[1000px] bg-golden/5 blur-3xl rounded-full -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute top-3/4 right-0 w-[800px] h-[800px] bg-blue-500/5 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-4">
            <SectionChip title="Testimonials" icon={MessageSquare} />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-neutral-100 leading-relaxed">
            Hear From Creators Who&apos;ve <br />
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 bg-clip-text text-transparent font-bold">
                Transformed Their Brands
              </span>
              <motion.div
                className="absolute -bottom-2 left-0 h-1 bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 rounded-full"
                initial={{ width: 0 }}
                whileInView={{ width: '100%' }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </span>
          </h2>
          <p className="text-lg text-neutral-400 mt-6 max-w-2xl mx-auto">Over 100+ creators trust us to scale their vision. Don&apos;t just take our word for it—see what they have to say.</p>
        </div>

        <div className="embla" ref={emblaRef}>
          <div className="embla__container">
            {testimonialsData.map((testimonial, index) => (
              <div className="embla__slide" key={index}>
                <div className="relative h-auto min-h-[22rem] flex flex-col bg-neutral-900/20 backdrop-blur-xl border border-neutral-800/60 rounded-3xl p-8 shadow-lg transition-all duration-300 hover:border-golden/40 hover:shadow-2xl hover:shadow-golden/10">
                  <GlowingEffect
                    spread={40}
                    glow={false}
                    disabled={false}
                    proximity={64}
                    inactiveZone={0.01}
                    variant="default"
                    borderWidth={2}
                  />
                  <div className="relative z-10">
                    <div className="flex items-center mb-6">
                      <Image
                        src={testimonial.image}
                        alt={testimonial.name}
                        width={50}
                        height={50}
                        className="rounded-full border-2 border-golden/50 object-cover"
                      />
                      <div className="ml-4">
                        <h3 className="font-bold text-lg text-neutral-100">{testimonial.name}</h3>
                        <div className="flex text-golden mt-1">
                          {[...Array(5)].map((_, i) => (
                            <div key={i} className="relative">
                              <Star className="w-5 h-5 text-golden fill-current" />
                              <Star className="w-5 h-5 absolute top-0 left-0 text-golden fill-current star-shimmer" style={{ animationDelay: `${i * 0.1}s` }} />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="relative flex-grow mt-4">
                      <Quote className="absolute -top-2 -left-4 w-10 h-10 text-neutral-700/50" />
                      <p className="text-neutral-300 flex-grow overflow-y-auto pr-2 testimonial-quote text-[15px] leading-relaxed italic z-10 relative">{testimonial.quote}</p>
                      <Quote className="absolute -bottom-2 -right-2 w-10 h-10 text-neutral-700/50 transform scale-x-[-1] scale-y-[-1]" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center mt-20">
          <h3 className="text-2xl font-bold text-neutral-300 mb-8">Trusted by industry leaders</h3>
          <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-4 md:gap-x-12">
            {trustedLogos.map((logo, index) => (
              <div key={index} className="flex justify-center items-center">
                <Image
                  src={logo.image}
                  alt={logo.name}
                  width={80}
                  height={80}
                  className="rounded-full object-cover grayscale opacity-70 transition-all duration-300 hover:grayscale-0 hover:opacity-100 hover:scale-105"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;