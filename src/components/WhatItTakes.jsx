'use client';

import React, { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Target, Palette, RefreshCw } from 'lucide-react';

const WhatItTakes = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { threshold: 0.3, margin: "-100px" });
  const [beamProgress, setBeamProgress] = useState(0);

  // Animated beam that passes through checkpoints
  useEffect(() => {
    if (isInView) {
      const timer = setTimeout(() => {
        setBeamProgress(100);
      }, 800);
      return () => clearTimeout(timer);
    } else {
      setBeamProgress(0);
    }
  }, [isInView]);

  const milestones = [
    {
      icon: Target,
      title: "Foundation & Strategy",
      description: "Deep dive into your brand goals and content direction"
    },
    {
      icon: Palette,
      title: "Research & Design", 
      description: "Custom visual identity and content framework"
    },
    {
      icon: RefreshCw,
      title: "Weekly Maintenance",
      description: "Ongoing content creation and optimization"
    }
  ];  return (
    <section ref={sectionRef} className="relative bg-black py-20 md:py-24 min-h-screen overflow-hidden" style={{ fontFamily: 'Manrope, sans-serif' }}>
      <div className="container mx-auto px-4 relative z-10 max-w-5xl">
        {/* Header */}
        <motion.div 
          className="text-center mb-8 md:mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >          <div className="inline-block mb-4">
            <span className="px-3 py-1 text-xs font-semibold tracking-wider uppercase rounded-full bg-golden-gradient text-black">
              What it Takes
            </span>
          </div>
          
          {/* Main Title with Underline */}
          <motion.h2 
            className="text-3xl md:text-4xl lg:text-5xl font-medium leading-tight mb-8 text-white"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            What{' '}
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 bg-clip-text text-transparent">
                it takes
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

        {/* Timeline Section */}
        <motion.div 
          className="max-w-4xl mx-auto mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {/* Top Labels */}
          <div className="flex justify-between items-center mb-8 px-4">
            <div className="text-left">
              <h3 className="text-lg md:text-xl font-medium text-neutral-300">
                <span className="text-amber-400">14 Days</span> to launch
              </h3>
            </div>
            <div className="text-right">
              <h3 className="text-lg md:text-xl font-medium text-neutral-300">
                <span className="text-amber-400">60 mins</span> per week
              </h3>
            </div>
          </div>

          {/* Timeline Container */}
          <div className="relative px-8">
            {/* Background Timeline Line */}
            <div className="absolute top-8 left-12 right-12 h-0.5 bg-neutral-800 rounded-full"></div>
            
            {/* Animated Beam Line - Passes through checkpoints */}
            <motion.div 
              className="absolute top-8 left-12 right-12 h-0.5 bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 rounded-full origin-left"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: beamProgress / 100 }}
              transition={{ duration: 2, ease: "easeOut", delay: 0.5 }}
            />
            
            {/* Glowing Moving Beam Effect */}
            <motion.div 
              className="absolute top-8 left-12 h-0.5 w-6 bg-gradient-to-r from-transparent via-amber-300 to-transparent rounded-full blur-[1px] opacity-70"
              initial={{ x: 0, opacity: 0 }}
              animate={{ 
                x: beamProgress > 0 ? 'calc(400% - 1.5rem)' : 0,
                opacity: beamProgress > 0 ? [0, 1, 1, 0] : 0
              }}
              transition={{ 
                duration: 2.5, 
                ease: "easeInOut", 
                delay: 0.8,
                repeat: beamProgress > 0 ? Infinity : 0,
                repeatDelay: 1
              }}
            />            {/* Timeline Items */}
            <div className="relative flex justify-between items-start">
              {milestones.map((milestone, index) => (
                <motion.div 
                  key={index}
                  className="flex flex-col items-center relative"
                  initial={{ opacity: 0, y: 15, scale: 0.8 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 1.2 + index * 0.2, type: "spring", stiffness: 200 }}
                >
                  {/* Modern Icon Circle - PERFECTLY centered on the beam line */}
                  <motion.div 
                    className="w-12 h-12 border-2 border-amber-400/50 bg-neutral-900/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg shadow-amber-400/20 relative z-20"
                    animate={{ 
                      borderColor: ['rgba(245, 158, 11, 0.5)', 'rgba(245, 158, 11, 0.8)', 'rgba(245, 158, 11, 0.5)'],
                      boxShadow: [
                        '0 0 0 0 rgba(245, 158, 11, 0.3)',
                        '0 0 0 6px rgba(245, 158, 11, 0)',
                        '0 0 0 0 rgba(245, 158, 11, 0.3)'
                      ]
                    }}
                    transition={{ 
                      duration: 2, 
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 1.5 + index * 0.3
                    }}
                  >
                    <milestone.icon className="w-6 h-6 text-amber-400" strokeWidth={2} />
                  </motion.div>
                  
                  {/* Modern Badge - positioned below the icon */}
                  <div className="border border-amber-400/30 bg-neutral-900/60 backdrop-blur-sm text-amber-400 px-3 py-1 rounded-full font-medium text-xs whitespace-nowrap shadow-sm mt-4 z-10">
                    {milestone.title}
                  </div>
                  
                  {/* Description positioned below the badge */}
                  <p className="text-neutral-500 text-xs mt-3 text-center max-w-32 leading-relaxed">
                    {milestone.description}
                  </p>
                </motion.div>
              ))}
            </div>
              {/* Add proper spacing for the content below to prevent CTA overlap */}
            <div className="h-24"></div>
          </div>
        </motion.div>

        {/* CTA Section - Smaller Design */}
        <motion.div 
          className="text-center max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <motion.h3 
            className="text-xl md:text-2xl font-medium text-white mb-3"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            Ready to get started?
          </motion.h3>
          
          <motion.p 
            className="text-sm md:text-base text-neutral-400 mb-6"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            Book a call with our team to learn more
          </motion.p>          <motion.button
            onClick={() => {
              console.log('Book Discovery Call button clicked');
              const discoverySection = document.getElementById('booking-form');
              console.log('Found booking form element:', discoverySection);
              
              if (discoverySection) {
                discoverySection.scrollIntoView({ 
                  behavior: 'smooth', 
                  block: 'start' 
                });
                // Focus on the first form input after scroll
                setTimeout(() => {
                  const firstInput = discoverySection.querySelector('input, select, textarea');
                  console.log('Found first input:', firstInput);
                  if (firstInput) {
                    firstInput.focus();
                  }
                }, 1500); // Increased timeout for better timing
              } else {
                console.error('Booking form element not found! Looking for alternatives...');
                // Fallback: try to find any section with booking in its class or id
                const alternativeBooking = document.querySelector('[id*="booking"], [class*="booking"], section:has([class*="form"])')
                console.log('Alternative booking element:', alternativeBooking);
                if (alternativeBooking) {
                  alternativeBooking.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'start' 
                  });
                }
              }
            }}
            className="group relative inline-flex items-center justify-center px-6 py-3 text-sm font-medium text-white bg-neutral-900 border border-amber-400/30 rounded-full overflow-hidden transition-all duration-300 hover:border-amber-400/60 hover:shadow-md hover:shadow-amber-400/20 focus:outline-none focus:ring-2 focus:ring-amber-400/50"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 1, type: "spring", stiffness: 200 }}
            whileHover={{ 
              scale: 1.02,
              transition: { duration: 0.2 }
            }}
            whileTap={{ scale: 0.98 }}
          >
            {/* Gradient Background Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-amber-400/10 via-amber-300/10 to-yellow-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            {/* Button Text */}
            <span className="relative z-10 bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 bg-clip-text text-transparent group-hover:from-white group-hover:via-white group-hover:to-white transition-all duration-300">
              Book Discovery Call
            </span>
            
            {/* Arrow Icon */}
            <motion.div
              className="relative z-10 ml-2 w-4 h-4"
              animate={{ x: [0, 3, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <svg 
                viewBox="0 0 20 20" 
                fill="currentColor" 
                className="w-4 h-4 text-amber-400 group-hover:text-white transition-colors duration-300"
              >
                <path 
                  fillRule="evenodd" 
                  d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" 
                  clipRule="evenodd" 
                />
              </svg>
            </motion.div>
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default WhatItTakes;
