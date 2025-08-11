'use client';

import React from 'react';
import { motion } from 'framer-motion';
import SlotCounter from 'react-slot-counter';
import { BarChart3 } from 'lucide-react';
import SectionChip from '@/components/ui/section-chip';
import { StatsGlowingEffect } from '@/components/ui/stats-glowing-effect';
import Image from 'next/image';

const statsData = [
  { 
    value: 50, 
    suffix: '+', 
    label: 'Projects Completed',
    icon: '/logo/projectcompleted.png',
    trendData: [20, 35, 42, 50],
    chartType: 'line'
  },
  { 
    value: 10, 
    suffix: 'K+', 
    label: 'Hours of Content',
    icon: '/logo/hoursofcontent.png',
    trendData: [2, 5, 8, 10],
    chartType: 'progress'
  },
  { 
    value: 1, 
    suffix: 'M+', 
    label: 'People Reached',
    icon: '/logo/peoplereached.png',
    trendData: [0.2, 0.5, 0.8, 1],
    chartType: 'circular'
  },
  { 
    value: 10, 
    suffix: 'M+', 
    label: 'Client Content Views',
    icon: '/logo/clientcontentviews.png',
    trendData: [1, 3, 6, 10],
    chartType: 'area'
  },
];

const Stats = () => {
  const itemVariants = {
    hidden: { opacity: 0, y: 80, scale: 0.8 },
    visible: (index) => ({ 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: { 
        duration: 0.8, 
        ease: [0.22, 1, 0.36, 1],
        delay: index * 0.2
      }
    }),
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  return (
    <section className="relative bg-transparent py-16 md:py-20 overflow-hidden">
      {/* Background Icons Layer - Lowest z-index */}
            <div className="absolute inset-0 pointer-events-none z-[-1] overflow-hidden">
              {/* BG ICONS PORTFOLIO SECTION - Bottom Right - Using working icon from Benefits */}
              <Image
                src="/bg-icons/6741825e22e3b1a9fcca38cf_rectangle-on-white.svg"
                width={600}
                height={600}
                className="absolute bottom-30 -right-70 opacity-50 "
                alt=""
                priority={false}
              />
              
              {/* BG ICONS PORTFOLIO SECTION - Top Left - Using working icon from Benefits */}
              <Image
                src="/bg-icons/674183bd7eb1543409d0f095_polygon-dark.svg"
                width={600}
                height={600}
                className="absolute top-30 -left-70 opacity-50 "
                alt=""
                priority={false}
              />
            </div>
      
      
      {/* Black Background Layer - Middle z-index, allows icons to show through */}
      <div className="absolute inset-0 bg-black/85 z-[-1]"></div>
      {/* Fireflies background effect */}
      <div className="absolute inset-0 z-0">
        {[...Array(25)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-golden/40 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.2, 1, 0.2],
              scale: [0.5, 1.2, 0.5],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          className="text-center mb-12 md:mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="flex justify-center mb-4">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              whileInView={{ scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            >
              <SectionChip title="Stats" icon={BarChart3} />
            </motion.div>
          </div>
          <motion.h2 
            className="text-4xl md:text-5xl font-bold text-white leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Numbers That{' '}
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 bg-clip-text text-transparent font-bold">
                Matter
              </span>
              <motion.div
                className="absolute -bottom-2 left-0 h-1 bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 rounded-full"
                initial={{ width: 0 }}
                whileInView={{ width: '100%' }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </span>
          </motion.h2>
        </motion.div>
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          {statsData.map((stat, index) => (
            <motion.div 
              key={index} 
              className="group relative bg-black/30 backdrop-blur-md border border-neutral-800/40 rounded-xl p-6 transition-all duration-300 hover:bg-black/40 hover:border-golden/30 hover:shadow-xl hover:shadow-golden/10"
              variants={itemVariants}
              custom={index}
              whileHover={{ 
                y: -3,
                transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] }
              }}
              style={{ zIndex: 10 }}
            >
              <StatsGlowingEffect
                proximity={80}
                spread={35}
                borderWidth={1.5}
                disabled={false}
                variant="stats"
                className="z-0"
              />
              
              {/* Custom Icon with Golden Gradient Overlay - Takes most space */}
              <div className="flex-1 min-h-[120px] mb-4 flex items-center justify-center">
                <motion.div
                  className="relative w-20 h-20 md:w-24 md:h-24"
                  initial={{ opacity: 0, scale: 0.5, rotate: -180 }}
                  whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                  viewport={{ once: true }}
                  transition={{ 
                    duration: 0.8, 
                    delay: 0.3 + index * 0.2, 
                    ease: "backOut",
                    type: "spring",
                    stiffness: 100
                  }}
                  whileHover={{ 
                    scale: 1.1, 
                    rotate: 5,
                    transition: { duration: 0.3 }
                  }}
                >
                  {/* Icon with clean amber gradient overlay */}
                  <div className="relative w-full h-full">
                    <Image
                      src={stat.icon}
                      alt={stat.label}
                      width={96}
                      height={96}
                      className="w-full h-full object-contain filter brightness-0 invert"
                    />
                    {/* Amber gradient overlay */}
                    <div 
                      className="absolute inset-0 bg-gradient-to-br from-amber-300 via-amber-400 to-amber-400 opacity-90 mix-blend-multiply"
                      style={{
                        maskImage: `url(${stat.icon})`,
                        WebkitMaskImage: `url(${stat.icon})`,
                        maskSize: 'contain',
                        maskRepeat: 'no-repeat',
                        maskPosition: 'center',
                        WebkitMaskSize: 'contain',
                        WebkitMaskRepeat: 'no-repeat',
                        WebkitMaskPosition: 'center'
                      }}
                    />
                  </div>
                  
                  {/* Animated particles around icon */}
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-1 h-1 bg-amber-400/60 rounded-full"
                      style={{
                        left: `${20 + i * 30}%`,
                        top: `${15 + i * 20}%`,
                      }}
                      animate={{
                        y: [0, -10, 0],
                        opacity: [0.3, 1, 0.3],
                        scale: [0.5, 1, 0.5],
                      }}
                      transition={{
                        duration: 2 + i * 0.5,
                        repeat: Infinity,
                        delay: i * 0.3 + index * 0.2,
                        ease: "easeInOut"
                      }}
                    />
                  ))}
                </motion.div>
              </div>

              {/* Numbers and Label at Bottom */}
              <div className="space-y-2">
                {/* Numbers Section */}
                <div className="flex items-baseline justify-center">
                  <motion.span
                    className="text-2xl md:text-3xl font-bold text-white tabular-nums"
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.5 + index * 0.1, ease: "backOut" }}
                  >
                    {stat.value}
                  </motion.span>
                  {stat.suffix && (
                    <motion.span 
                      className="text-xl md:text-2xl font-bold ml-1 bg-gradient-to-br from-amber-400 to-golden bg-clip-text text-transparent"
                      initial={{ opacity: 0, x: -5 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
                    >
                      {stat.suffix}
                    </motion.span>
                  )}
                </div>

                {/* Label */}
                <motion.p 
                  className="text-neutral-400 text-sm font-medium text-center group-hover:text-neutral-300 transition-colors duration-300"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                >
                  {stat.label}
                </motion.p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Stats;
