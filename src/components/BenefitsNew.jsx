'use client';

import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Award } from 'lucide-react';
import ScrollStack, { ScrollStackItem } from '../blocks/Components/ScrollStack/ScrollStack';
import SectionChip from '@/components/ui/section-chip';
import GlareHover from '@/blocks/Animations/GlareHover/GlareHover';

const benefitsData = [
  {
    id: 'card-1',
    title: 'Scale Trust',
    subtitle: 'We create content that builds trust on every video-based platform.',
    outcome: 'Authentic Authority Building',
    number: '1',
    icon: '/logo/scale trust.svg'
  },
  {
    id: 'card-2',
    title: 'Lifetime asset',
    subtitle: 'Build a lifetime asset of organic distribution in just 1 hour a week',
    outcome: 'Perpetual Growth Engine',
    number: '2',
    icon: '/logo/lifetime asset.svg'
  },
  {
    id: 'card-3',
    title: 'Accountability',
    subtitle: 'We create content that builds trust on every video-based platform.',
    outcome: 'Consistent Performance',
    number: '3',
    icon: '/logo/accountability.svg'
  },
  {
    id: 'card-4',
    title: 'Consistent leads & sales',
    subtitle: 'Our backend systems not only get you views but consistent organic leads',
    outcome: 'Predictable Revenue Stream',
    number: '4',
    icon: '/logo/growth-svgrepo-com.svg'
  }
];

const Benefits = () => {
  const benefitsSectionRef = useRef(null);

  return (
    <section id="benefits" className="relative" ref={benefitsSectionRef}>
      {/* Header Section - Normal Page Flow */}
      <div className="relative bg-black text-white py-12 md:py-16 pb-4 md:pb-6">
        <div className="absolute inset-0 bg-[url('/images/grain.png')] opacity-5"></div>
        
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center mb-4">
            <SectionChip title="Benefits" icon={Award} />
          </div>
          <h2 className="text-4xl md:text-6xl font-bold mb-4">
            What do you{' '}
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 bg-clip-text text-transparent font-bold">
                get?
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
          <p className="text-neutral-300 text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed mb-0">
            Discover the powerful benefits that come with our comprehensive video content system
          </p>
        </div>
      </div>

      {/* ScrollStack Section - Normal flow, no hijacking */}
      <div className="relative w-full bg-black pt-4 pb-8">
        <ScrollStack
          className="w-full bg-black"
          itemDistance={40}
          itemScale={0.05}
          itemStackDistance={30}
          stackPosition="50%"
          scaleEndPosition="30%"
          baseScale={0.95}
          rotationAmount={0}
          blurAmount={0}
        >
          {benefitsData.map((benefit) => (
            <ScrollStackItem
              key={benefit.id}
              itemClassName="relative overflow-hidden bg-transparent w-full max-w-4xl mx-auto p-6"
              style={{ height: '400px' }}
            >
              {/* Process-Style Solid Card with Gradients */}
              <div className="relative w-full h-full">
                <GlareHover
                  width="100%"
                  height="100%"
                  background="transparent"
                  borderRadius="1.5rem"
                  borderColor="transparent"
                  glareColor="#ffffff"
                  glareOpacity={0.2}
                  glareAngle={-35}
                  glareSize={350}
                  transitionDuration={700}
                  playOnce={false}
                  className="w-full h-full border-0"
                  style={{ border: 'none', background: 'transparent' }}
                >
                  <div className="w-full h-full rounded-3xl overflow-hidden shadow-2xl shadow-amber-400/10 border border-amber-400/30 bg-gradient-to-br from-neutral-900 to-black">
                    
                    {/* Background SVG Icon - Right Aligned, Pure Golden with Low Opacity */}
                    <div className="absolute inset-0 flex items-center justify-end pr-8 pointer-events-none overflow-hidden">
                      <div className="w-80 h-80 relative">
                        <Image 
                          src={benefit.icon} 
                          alt=""
                          width={320}
                          height={320}
                          className="w-full h-full object-contain"
                          style={{
                            filter: 'brightness(0) saturate(100%) invert(70%) sepia(80%) saturate(800%) hue-rotate(10deg) brightness(110%)',
                            transform: 'translateX(25%)',
                            WebkitMask: 'linear-gradient(to bottom, rgba(0,0,0,0.12) 0%, rgba(0,0,0,0.12) 45%, rgba(0,0,0,0.04) 65%, rgba(0,0,0,0) 100%)',
                            mask: 'linear-gradient(to bottom, rgba(0,0,0,0.12) 0%, rgba(0,0,0,0.12) 45%, rgba(0,0,0,0.04) 65%, rgba(0,0,0,0) 100%)'
                          }}
                        />
                      </div>
                    </div>
                    
                    {/* Card Content Grid - Number Left, Content Right */}
                    <div className="relative z-10 p-8 h-full flex items-center">
                      
                      {/* Left Side - Large Faded Number */}
                      <div className="flex-shrink-0 w-32 flex items-center justify-center">
                        <span className="text-8xl font-black font-grift bg-gradient-to-b from-amber-400 from-0% via-amber-400 via-45% via-amber-400/20 via-65% to-transparent to-100% bg-clip-text text-transparent">
                          {benefit.number}
                        </span>
                      </div>
                      
                      {/* Right Side - Content */}
                      <div className="flex-1 ml-8 space-y-6">
                        {/* Title - Crisp and Clear */}
                        <h3 className="text-2xl md:text-3xl font-black text-white font-grift tracking-tight leading-tight antialiased">
                          {benefit.title}
                        </h3>
                        
                        {/* Decorative Line */}
                        <div className="w-16 h-px bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400"></div>
                        
                        {/* Subtitle/Description - Crisp and Clear */}
                        <p className="text-white text-sm md:text-base leading-relaxed font-grift max-w-md antialiased">
                          {benefit.subtitle}
                        </p>
                        
                        {/* Output Badge - Crisp and Clear */}
                        <div className="inline-flex items-center px-5 py-2.5 rounded-full shadow-lg shadow-amber-400/10 border border-amber-400/40 bg-gradient-to-r from-black to-neutral-900">
                          <span className="text-amber-400 font-medium font-grift text-xs tracking-wide antialiased">Output: </span>
                          <span className="text-amber-400 font-bold ml-2 font-grift text-xs tracking-wide antialiased">
                            {benefit.outcome}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </GlareHover>
              </div>
            </ScrollStackItem>
          ))}
        </ScrollStack>
      </div>
    </section>
  );
};

export default Benefits;
