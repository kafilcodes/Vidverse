'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Phone } from 'lucide-react';
import Image from 'next/image'; // 🎯 ADD THIS IMPORT FOR BACKGROUND ICONS
import BookingForm from './BookingForm';
import SectionChip from '@/components/ui/section-chip';

const DiscoveryCall = () => {
  return (
    <section id="booking-form" className="relative bg-transparent py-12 md:py-16 pb-8 md:pb-10 overflow-hidden" style={{ fontFamily: 'Manrope, sans-serif' }}>
      
      {/* Grain Background - Same as Newsletter */}
      <div className="absolute inset-0 z-[-3]">
        <Image
          src="/bg-icons/67417cccd10005101c0c23e5_grain.png"
          fill
          className="object-cover w-full h-full opacity-40"
          alt=""
          priority={false}
        />
      </div>

      {/* Background Icons Layer - Lowest z-index */}
      <div className="absolute inset-0 pointer-events-none z-[-1] overflow-hidden">
        {/* BG ICONS DISCOVERY CALL SECTION - Responsive positioning */}
        <Image
          src="/bg-icons/6741825e22e3b1a9fcca38cf_rectangle-on-white.svg"
          width={600}
          height={600}
          className="absolute bottom-16 -right-48 opacity-30 scale-75 sm:bottom-20 sm:-right-56 sm:opacity-40 sm:scale-90 md:bottom-30 md:-right-70 md:opacity-50 md:scale-100"
          alt=""
          priority={false}
        />

        {/* BG ICONS DISCOVERY CALL SECTION - Top Left */}
        <Image
          src="/bg-icons/6741825e22e3b1a9fcca38cf_rectangle-on-white.svg"
          width={600}
          height={600}
          className="absolute top-16 -left-48 opacity-30 scale-75 sm:top-20 sm:-left-56 sm:opacity-40 sm:scale-90 md:top-30 md:-left-70 md:opacity-50 md:scale-100"
          alt=""
          priority={false}
        />
      </div>

      {/* Black Background Layer - Middle z-index, allows icons to show through */}
      <div className="absolute inset-0 bg-black/88 z-[-1]"></div>
      <div className="container mx-auto px-4 relative z-10 max-w-5xl">
        {/* Section Header */}        <motion.div
          className="text-center mb-8 md:mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-block mb-4">
            <SectionChip title="Discovery Call" icon={Phone} />
          </div>

          {/* Main Title with Underline */}          <motion.h2
            className="text-3xl md:text-4xl lg:text-5xl font-medium leading-relaxed mb-6 text-white"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Let us understand your{' '}
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 bg-clip-text text-transparent">
                growth goals
              </span>
              <motion.div
                className="absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 rounded-full"
                initial={{ width: 0 }}
                whileInView={{ width: '100%' }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.6 }}
              />
            </span>
          </motion.h2>
        </motion.div>

        {/* Form Container */}
        <motion.div
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <BookingForm />
        </motion.div>
      </div>
    </section>
  );
};

export default DiscoveryCall;
