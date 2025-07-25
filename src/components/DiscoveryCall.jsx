'use client';

import React from 'react';
import { motion } from 'framer-motion';
import BookingForm from './BookingForm';

const DiscoveryCall = () => {
  return (
    <section id="booking-form" className="relative bg-black py-12 md:py-16 pb-8 md:pb-10 overflow-hidden" style={{ fontFamily: 'Manrope, sans-serif' }}>
      <div className="container mx-auto px-4 relative z-10 max-w-5xl">
        {/* Section Header */}        <motion.div 
          className="text-center mb-8 md:mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >          <div className="inline-block mb-4">
            <span className="px-3 py-1 text-xs font-semibold tracking-wider uppercase rounded-full bg-golden-gradient text-black">
              Discovery Call
            </span>
          </div>
          
          {/* Main Title with Underline */}          <motion.h2 
            className="text-3xl md:text-4xl lg:text-5xl font-medium leading-tight mb-6 text-white"
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
