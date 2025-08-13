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
    subtitle: 'Build a lifetime organic distribution system that keeps working for you',
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
    icon: '/logo/Consistent leads & sales.svg'
  }
];

const Benefits = () => {
  const benefitsSectionRef = useRef(null);

  return (
    <section id="benefits" className="relative overflow-hidden" ref={benefitsSectionRef}>

       <div className="absolute inset-0 pointer-events-none z-[-1]">
      
              {/* BG ICONS BENEFITS SECTION - Large SVG */}
              <Image
                src="/bg-icons/6745d59d7487a3832bc141de_element-on-benefits.svg"
                width={700}
                height={700}
                className="absolute -bottom-50  -left-50 opacity-70 scale-130 hidden md:block"
                alt=""
                priority={false}
              />
                 {/* BG ICONS BENEFITS SECTION - Large SVG */}
              <Image
                src="/bg-icons/6745d59d7487a3832bc141de_element-on-benefits.svg"
                width={700}
                height={700}
                className="absolute -top-50  -right-50 opacity-70 scale-130 hidden md:block"
                alt=""
                priority={false}
              />

              </div>
      
   
      
      
      <div className="relative bg-transparent text-white py-10 sm:py-12 md:py-14 lg:py-16 pb-3 sm:pb-4 md:pb-5 lg:pb-6">
        
        
        
       
        
        <div className="container mx-auto px-4 sm:px-6 text-center">
          
          
          <div className="flex justify-center mb-3 sm:mb-4">
            
            <SectionChip title="Benefits" icon={Award} />
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4 leading-tight px-4 sm:px-0">
            
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
          <p className="text-neutral-300 text-lg sm:text-xl md:text-2xl max-w-xs sm:max-w-md md:max-w-lg lg:max-w-2xl xl:max-w-3xl mx-auto leading-relaxed mb-0 px-4 sm:px-0">
            Discover the powerful benefits that come with our comprehensive video content system
          </p>
          
        </div>
      </div>

      {/* ScrollStack Section - Normal flow, no hijacking */}
      <div className="relative w-full bg-transparent pt-3 sm:pt-4 pb-6 sm:pb-7 md:pb-8">
        <ScrollStack
          className="w-full bg-transparent"z
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
              itemClassName="relative overflow-hidden bg-transparent w-full max-w-xs sm:max-w-sm md:max-w-2xl lg:max-w-3xl xl:max-w-4xl mx-auto p-4 sm:p-5 md:p-6"
              style={{ height: '320px' }}
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
                  <div className="w-full h-full rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl shadow-amber-400/10 border border-amber-400/30 bg-gradient-to-br from-neutral-900 to-black">
                    
                    {/* Background SVG Icon - Right Aligned with Fade Effect */}
                    <div className="absolute inset-0 flex items-center justify-end pr-0 sm:pr-1 md:pr-2 pointer-events-none overflow-hidden">
                      <div className="w-56 h-56 sm:w-72 sm:h-72 md:w-80 md:h-80 lg:w-96 lg:h-96 relative transform translate-x-20 sm:translate-x-24 md:translate-x-28 lg:translate-x-32">
                        <div className="relative w-full h-full">
                          <Image 
                            src={benefit.icon} 
                            alt=""
                            width={400}
                            height={400}
                            className="w-full h-full object-contain opacity-30"
                          />
                          {/* Right to left fade overlay */}
                          <div 
                            className="absolute inset-0 bg-gradient-to-l from-black via-black/50 to-transparent"
                            style={{
                              background: 'linear-gradient(to left, rgba(0,0,0,1) 0%, rgba(0,0,0,0.7) 40%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)'
                            }}
                          />
                        </div>
                      </div>
                    </div>
                    
                    {/* Card Content Grid - Number Left, Content Right */}
                    <div className="relative z-10 p-4 sm:p-6 md:p-8 h-full flex items-center">
                      
                      {/* Left Side - Large Faded Number */}
                      <div className="flex-shrink-0 w-20 sm:w-24 md:w-28 lg:w-32 flex items-center justify-center">
                        <span className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black font-grift bg-gradient-to-b from-amber-400 from-0% via-amber-400 via-45% via-amber-400/20 via-65% to-transparent to-100% bg-clip-text text-transparent">
                          {benefit.number}
                        </span>
                      </div>
                      
                      {/* Right Side - Content */}
                      <div className="flex-1 ml-4 sm:ml-6 md:ml-8 space-y-3 sm:space-y-4 md:space-y-5 lg:space-y-6">
                        {/* Title - Crisp and Clear */}
                        <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-white font-grift tracking-tight leading-tight antialiased">
                          {benefit.title}
                        </h3>
                        
                        {/* Decorative Line */}
                        <div className="w-12 sm:w-14 md:w-16 h-px bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400"></div>
                        
                        {/* Subtitle/Description - Crisp and Clear */}
                        <p className="text-white text-xs sm:text-sm md:text-base leading-relaxed font-grift max-w-xs sm:max-w-sm md:max-w-md antialiased">
                          {benefit.subtitle}
                        </p>
                        
                        {/* Output Badge - Crisp and Clear */}
                        <div className="inline-flex items-center px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 rounded-full shadow-lg shadow-amber-400/10 border border-amber-400/40 bg-gradient-to-r from-black to-neutral-900">
                          <span className="text-amber-400 font-medium font-grift text-xs tracking-wide antialiased">Output: </span>
                          <span className="text-amber-400 font-bold ml-1 sm:ml-2 font-grift text-xs tracking-wide antialiased">
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
