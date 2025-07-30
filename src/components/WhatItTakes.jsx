'use client';

import React, { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Target, Palette, RefreshCw, Clock, Phone, Zap, Sparkles, Rocket } from 'lucide-react';
import SectionChip from '@/components/ui/section-chip';

// Custom Glass Icon Component for Timeline
const TimelineGlassIcon = ({ icon: Icon, index, activeStep }) => {
  const getBackgroundStyle = () => {
    return { 
      background: "linear-gradient(hsl(43, 80%, 45%), hsl(28, 80%, 45%))", // Golden gradient with reduced brightness
      opacity: 0.6 // Reduced opacity
    };
  };

  return (
    <div
      className="relative bg-transparent outline-none w-20 h-20 [perspective:24em] [transform-style:preserve-3d] [-webkit-tap-highlight-color:transparent] group"
    >
      <motion.span
        className="absolute top-0 left-0 w-full h-full rounded-2xl block transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.83,0,0.17,1)] origin-[100%_100%] rotate-[15deg]"
        style={{
          ...getBackgroundStyle(),
          boxShadow: "0.5em -0.5em 0.75em hsla(223, 10%, 10%, 0.15)",
        }}
        animate={{
          transform: activeStep > index 
            ? "rotate(25deg) translate3d(-0.5em, -0.5em, 0.5em)" 
            : "rotate(15deg) translate3d(0, 0, 0)"
        }}
        transition={{ 
          delay: index * 1 + 0.8, 
          duration: 0.4, 
          ease: "easeOut" 
        }}
      />

      <motion.span
        className="absolute top-0 left-0 w-full h-full rounded-2xl bg-[hsla(0,0%,100%,0.15)] transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.83,0,0.17,1)] origin-[80%_50%] flex backdrop-blur-[0.75em] [-webkit-backdrop-filter:blur(0.75em)]"
        style={{
          boxShadow: "0 0 0 0.1em hsla(0, 0%, 100%, 0.3) inset",
        }}
        animate={{
          transform: activeStep > index 
            ? "translateZ(2em) scale(1.1)" 
            : "translateZ(0) scale(1)",
          boxShadow: activeStep > index 
            ? "0 25px 50px -12px rgba(251, 191, 36, 0.4), 0 0 0 0.1em hsla(0, 0%, 100%, 0.3) inset" 
            : "0 25px 50px -12px rgba(251, 191, 36, 0.15), 0 0 0 0.1em hsla(0, 0%, 100%, 0.3) inset"
        }}
        transition={{ 
          delay: index * 1 + 0.8, 
          duration: 0.4, 
          ease: "easeOut" 
        }}
      >
        <span className="m-auto w-9 h-9 flex items-center justify-center" aria-hidden="true">
          <Icon className="w-9 h-9 text-black" strokeWidth={2.5} />
        </span>
      </motion.span>

      {/* Step Number Label - appears on hover */}
      <span className="absolute top-full left-0 right-0 text-center whitespace-nowrap leading-[2] text-sm text-amber-400 font-medium opacity-0 transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.83,0,0.17,1)] translate-y-0 group-hover:opacity-100 group-hover:[transform:translateY(20%)]">
        Step {index + 1}
      </span>
    </div>
  );
};

const WhatItTakes = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { threshold: 0.3, margin: "-100px" });
  const [isHovered, setIsHovered] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  // Sequential milestone animation
  useEffect(() => {
    if (isInView) {
      const timer = setTimeout(() => {
        setActiveStep(1);
      }, 1000);
      
      const timer2 = setTimeout(() => {
        setActiveStep(2);
      }, 2000);
      
      const timer3 = setTimeout(() => {
        setActiveStep(3);
      }, 3000);

      return () => {
        clearTimeout(timer);
        clearTimeout(timer2);
        clearTimeout(timer3);
      };
    } else {
      setActiveStep(0);
    }
  }, [isInView]);

  const milestones = [
    {
      icon: Zap,
      title: "Foundation & Strategy",
      content: "Deep dive into your brand goals and content direction"
    },
    {
      icon: Sparkles,
      title: "Research & Design", 
      content: "Custom visual identity and content framework"
    },
    {
      icon: Rocket,
      title: "Weekly Maintenance",
      content: "Ongoing content creation and optimization"
    }
  ];  return (
    <section ref={sectionRef} className="relative bg-black py-20 md:py-24 min-h-screen overflow-hidden" style={{ fontFamily: 'Manrope, sans-serif' }}>
      <div className="container mx-auto px-4 relative z-10 max-w-5xl">
        {/* Header */}
        <motion.div 
          className="text-center mb-16 md:mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-block mb-4">
            <SectionChip title="What it Takes" icon={Clock} />
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
          className="max-w-6xl mx-auto mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {/* Top Labels */}
          <div className="flex justify-between items-center mb-12 px-4">
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

          {/* Professional Icon-Based Timeline */}
          <div className="relative">
            {/* Main Timeline Container */}
            <div className="relative flex justify-between items-center px-8">
              
              {/* Background Connection Line - Full Width */}
              <div className="hidden md:block absolute top-1/2 transform -translate-y-1/2 left-8 right-2 h-0.5 bg-gradient-to-r from-transparent via-neutral-700 via-neutral-700 to-transparent z-0"></div>
              
              {/* Animated Progress Line Segments */}
              <motion.div 
                className="hidden md:block absolute top-1/2 transform -translate-y-1/2 h-0.5 bg-gradient-to-r from-amber-400 to-amber-300 z-0"
                style={{ left: '8rem', width: '0%' }}
                initial={{ width: 0 }}
                animate={{ 
                  width: activeStep >= 1 ? 'calc(50% - 8rem)' : '0%'
                }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 1 }}
              />
              
              <motion.div 
                className="hidden md:block absolute top-1/2 transform -translate-y-1/2 h-0.5 bg-gradient-to-r from-amber-300 to-amber-400 z-0"
                style={{ left: '50%', width: '0%' }}
                initial={{ width: 0 }}
                animate={{ 
                  width: activeStep >= 2 ? 'calc(50% - 4rem)' : '0%'
                }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 2 }}
              />
              
              <motion.div 
                className="hidden md:block absolute top-1/2 transform -translate-y-1/2 h-0.5 bg-gradient-to-r from-amber-400 to-amber-300 z-0"
                style={{ right: '4rem', width: '0%' }}
                initial={{ width: 0 }}
                animate={{ 
                  width: activeStep >= 3 ? 'calc(50% - 4rem)' : '0%'
                }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 3 }}
              />

              {milestones.map((milestone, index) => (
                <motion.div
                  key={index}
                  className="relative flex flex-col items-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ 
                    opacity: activeStep > index ? 1 : 0.5,
                    y: 0
                  }}
                  transition={{ 
                    duration: 0.6, 
                    delay: index * 1,
                    ease: "easeOut"
                  }}
                >
                  {/* Icon Container - Centered on Timeline Beam */}
                  <div className="relative group flex items-center justify-center">
                    {/* Glass Icon positioned to align with the beam center */}
                    <TimelineGlassIcon 
                      icon={milestone.icon} 
                      index={index} 
                      activeStep={activeStep}
                    />
                  </div>

                  {/* Content Below Icon */}
                  <div className="text-center mt-16">
                    <motion.h3 
                      className="text-xl font-semibold mb-4 transition-colors duration-300"
                      initial={{ opacity: 0 }}
                      animate={{ 
                        opacity: activeStep > index ? 1 : 0.6,
                        color: activeStep > index ? '#fbbf24' : '#ffffff'
                      }}
                      transition={{ 
                        opacity: { delay: index * 1 + 0.4 },
                        color: { delay: index * 1 + 0.8, duration: 0.4, ease: "easeOut" }
                      }}
                    >
                      {milestone.title}
                    </motion.h3>
                    
                    <motion.p 
                      className="text-neutral-400 text-base leading-relaxed group-hover:text-neutral-300 transition-colors duration-300 max-w-sm mx-auto"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: activeStep > index ? 1 : 0.5 }}
                      transition={{ delay: index * 1 + 0.5 }}
                    >
                      {milestone.content}
                    </motion.p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          
          {/* Add proper spacing for the content below to prevent CTA overlap */}
          <div className="h-16 md:h-20"></div>
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
          </motion.p>          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 1, type: "spring", stiffness: 200 }}
          >
            <motion.button
              className="group relative inline-flex items-center justify-center text-sm font-medium text-white transition-all duration-300 hover:shadow-md hover:shadow-amber-400/20 focus:outline-none bg-black/90 backdrop-blur-sm border border-amber-400/30 overflow-hidden"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
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
              style={{
                borderRadius: '12px',
                padding: '12px 24px',
              }}
              whileHover={{ 
                scale: 1.02,
                transition: { duration: 0.2 }
              }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Text Content - slides out on hover */}
              <motion.div
                className="flex items-center justify-center"
                animate={{
                  x: isHovered ? -120 : 0,
                  opacity: isHovered ? 0 : 1
                }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <span className="bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 bg-clip-text text-transparent">
                  Book Discovery Call
                </span>
                
                <motion.div
                  className="ml-2 w-4 h-4"
                  animate={{ x: [0, 3, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                >
                  <svg 
                    viewBox="0 0 20 20" 
                    fill="currentColor" 
                    className="w-4 h-4 text-amber-400"
                  >
                    <path 
                      fillRule="evenodd" 
                      d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" 
                      clipRule="evenodd" 
                    />
                  </svg>
                </motion.div>
              </motion.div>

              {/* Call Icon - slides in on hover */}
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                animate={{
                  x: isHovered ? 0 : 120,
                  opacity: isHovered ? 1 : 0
                }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <Phone className="w-5 h-5 text-amber-400" />
              </motion.div>
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default WhatItTakes;
