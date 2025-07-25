'use client';

import React from 'react';
import { motion } from 'framer-motion';
import SlotCounter from 'react-slot-counter';
import { Zap, Clapperboard, Users, TrendingUp } from 'lucide-react';

const statsData = [
  { 
    value: 50, 
    suffix: '+', 
    label: 'Projects Completed', 
    icon: (
      <motion.div
        animate={{ 
          rotateY: [0, 360],
          scale: [1, 1.1, 1]
        }}
        transition={{ 
          duration: 3, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
      >
        <Clapperboard className="w-8 h-8 mb-4 text-golden" />
      </motion.div>
    )
  },
  { 
    value: 10, 
    suffix: 'K+', 
    label: 'Hours of Content', 
    icon: (
      <motion.div
        animate={{ 
          rotate: [0, 15, -15, 0],
          y: [0, -3, 0]
        }}
        transition={{ 
          duration: 2.5, 
          repeat: Infinity, 
          ease: "easeInOut",
          delay: 0.5
        }}
      >
        <Zap className="w-8 h-8 mb-4 text-golden" />
      </motion.div>
    )
  },
  { 
    value: 1, 
    suffix: 'M+', 
    label: 'People Reached', 
    icon: (
      <motion.div
        animate={{ 
          scale: [1, 1.15, 1],
          rotate: [0, 5, -5, 0]
        }}
        transition={{ 
          duration: 2.8, 
          repeat: Infinity, 
          ease: "easeInOut",
          delay: 1
        }}
      >
        <Users className="w-8 h-8 mb-4 text-golden" />
      </motion.div>
    )
  },
  { 
    value: 10, 
    suffix: 'M+', 
    label: 'Client Content Views', 
    icon: (
      <motion.div
        animate={{ 
          y: [0, -5, 0],
          rotateZ: [0, 10, -10, 0]
        }}
        transition={{ 
          duration: 3.2, 
          repeat: Infinity, 
          ease: "easeInOut",
          delay: 1.5
        }}
      >
        <TrendingUp className="w-8 h-8 mb-4 text-golden" />
      </motion.div>
    )
  },
];

const Stats = () => {
  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
    },
  };

  return (
    <section className="relative bg-black py-20 md:py-28 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/2 left-1/2 w-[800px] h-[800px] bg-golden/5 blur-3xl rounded-full -translate-x-1/2 -translate-y-1/2 opacity-30"></div>
      </div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12 md:mb-16">
          <div className="flex justify-center mb-4">
            <span className="px-3 py-1 text-xs font-semibold tracking-wider uppercase rounded-full bg-golden-gradient text-black">
              Stats
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white">
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
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {statsData.map((stat, index) => (
            <motion.div 
              key={index} 
              className="bg-black/20 backdrop-blur-md border border-gold-DEFAULT/10 rounded-2xl p-6 text-center transition-all duration-300 hover:bg-black/30 hover:border-golden/50 hover:shadow-2xl hover:shadow-golden/10"
              variants={itemVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.5 }}
            >
              {stat.icon}
              <div className="text-5xl md:text-6xl font-bold flex items-baseline justify-center tabular-nums">
                <SlotCounter 
                  value={stat.value} 
                  animateOnVisible={{ triggerOnce: true, rootMargin: '0px 0px -100px 0px' }}
                  className="bg-gradient-to-r from-gold-light via-gold-DEFAULT to-gold-dark bg-clip-text text-transparent"
                />
                {stat.suffix && (
                  <span className="text-4xl md:text-5xl font-bold ml-1 text-gold-DEFAULT">
                    {stat.suffix}
                  </span>
                )}
              </div>
              <p className="text-neutral-300 mt-3 text-base font-medium">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
