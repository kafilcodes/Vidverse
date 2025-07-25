'use client';

import React from 'react';
import { motion } from 'framer-motion';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import Image from 'next/image';
import { Star, Quote } from 'lucide-react';

const testimonialsData = [
  {
    name: 'Insane Curiosity',
    image: '/images/Insane Curiosity.jpg',
    quote: 'Working with VidVerse was a game-changer. Their strategic approach to content not only boosted our views by 300% but also built a stronger, more engaged community around our channel.',
  },
  {
    name: 'PBS Space Time',
    image: '/images/PBS Space Time.jpg',
    quote: 'The level of detail and creativity VidVerse brought to our content engine was phenomenal. They understood our niche and delivered a system that consistently produces high-quality, engaging videos.',
  },
  {
    name: 'Finance With Sharan',
    image: '/images/Finance With Sharan.jpg',
    quote: 'As a creator in the finance space, trust is everything. VidVerse helped us build a content machine that not only educates but also builds deep trust with our audience, leading to a significant increase in leads.',
  },
  {
    name: 'Philipp Humm',
    image: '/images/Philipp Humm.jpg',
    quote: 'VidVerse transformed our content strategy completely. Their innovative approach helped us reach audiences we never thought possible, resulting in exponential growth across all our platforms.',
  },
  {
    name: 'Kallaway',
    image: '/images/Kallaway.jpg',
    quote: 'The strategic content framework VidVerse created for us was a masterpiece. They didn\'t just create content—they built a sustainable system that continues to drive engagement and conversions.',
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
    <section id="testimonials" className="relative py-20 md:py-28 bg-black text-white overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-20">
        <div className="absolute -top-1/4 left-1/4 w-[1000px] h-[1000px] bg-golden/5 blur-3xl rounded-full -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute top-3/4 right-0 w-[800px] h-[800px] bg-blue-500/5 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-4">
            <span className="px-3 py-1 text-xs font-semibold tracking-wider uppercase rounded-full bg-golden-gradient text-black">
              Testimonials
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-neutral-100 leading-tight">
            Hear From Creators Who've <br /> 
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
          <p className="text-lg text-neutral-400 mt-6 max-w-2xl mx-auto">Over 100+ creators trust us to scale their vision. Don't just take our word for it—see what they have to say.</p>
        </div>

        <div className="embla" ref={emblaRef}>
          <div className="embla__container">
            {testimonialsData.map((testimonial, index) => (
              <div className="embla__slide" key={index}>
                <div className="testimonial-card-premium h-auto min-h-[22rem] flex flex-col bg-neutral-900/20 backdrop-blur-xl border border-neutral-800/60 rounded-3xl p-8 shadow-lg transition-all duration-300 hover:border-golden/40 hover:shadow-2xl hover:shadow-golden/10">
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
                            <Star className="w-5 h-5 absolute top-0 left-0 text-golden fill-current star-shimmer" style={{ animationDelay: `${i * 0.1}s` }}/>
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