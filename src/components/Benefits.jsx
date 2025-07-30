'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';
import SectionChip from '@/components/ui/section-chip';
import ScrollStack, { ScrollStackItem } from '../blocks/Components/ScrollStack/ScrollStack';
import Image from 'next/image';

const benefitsData = [
  {
    id: 'card-1',
    imgSrc: '/images/lifestimeassets.gif',
    title: 'Lifetime Asset',
    description: 'Build a lifetime asset of organic distribution in just 1 hour a week.',
    number: '01',
  },
  {
    id: 'card-2',
    imgSrc: '/images/accountablity.gif',
    title: 'Accountability',
    description: 'We create content that builds trust on every video-based platform.',
    number: '02',
  },
  {
    id: 'card-3',
    imgSrc: '/images/sales.gif',
    title: 'Consistent Leads & Sales',
    description: 'Our backend systems not only get you views but consistent, organic leads.',
    number: '03',
  },
  {
    id: 'card-4',
    imgSrc: '/images/scaletrust.gif',
    title: 'Scale Trust',
    description: 'We create content that builds trust on every video-based platform.',
    number: '04',
  },
];

const Benefits = () => {
  return (
    <section id="benefits" className="relative bg-black text-white">
      {/* Header Section */}
      <div className="container mx-auto px-4 text-center py-24 md:py-32">
        <div className="flex justify-center mb-4">
          <SectionChip title="Benefits" icon={ShieldCheck} />
        </div>
        <h2 className="text-4xl md:text-5xl font-bold">
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
        <p className="text-neutral-300 text-lg md:text-xl mt-6 max-w-2xl mx-auto">
          Discover the powerful benefits that come with our comprehensive video content system
        </p>
      </div>

      {/* ScrollStack Implementation */}
      <div className="w-full h-screen">
        <ScrollStack
          className="bg-black"
          itemDistance={120}
          itemScale={0.05}
          itemStackDistance={40}
          stackPosition="25%"
          scaleEndPosition="15%"
          baseScale={0.9}
          rotationAmount={2}
          blurAmount={0.5}
          onStackComplete={() => {
            console.log('Stack animation completed');
          }}
        >
          {benefitsData.map((benefit, index) => (
            <ScrollStackItem
              key={benefit.id}
              itemClassName="bg-gradient-to-br from-neutral-900/90 to-neutral-800/90 border border-neutral-700/50 backdrop-blur-sm"
            >
              <div className="flex flex-col lg:flex-row items-center justify-between h-full gap-8 text-white">
                {/* Number and Content */}
                <div className="flex-1 flex flex-col justify-center">
                  <div className="text-6xl md:text-7xl font-black text-gold-DEFAULT/20 mb-4 leading-none">
                    {benefit.number}
                  </div>
                  <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-white leading-tight">
                    {benefit.title}
                  </h3>
                  <p className="text-lg md:text-xl text-neutral-300 max-w-lg leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
                
                {/* Image */}
                <div className="flex-shrink-0">
                  <div className="w-48 h-48 md:w-56 md:h-56 lg:w-64 lg:h-64">
                    <Image 
                      src={benefit.imgSrc} 
                      alt={benefit.title} 
                      width={256}
                      height={256}
                      unoptimized 
                      className="w-full h-full object-contain" 
                    />
                  </div>
                </div>
              </div>
            </ScrollStackItem>
          ))}
        </ScrollStack>
      </div>
    </section>
  );
};

export default Benefits;
