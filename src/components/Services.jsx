'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Lottie from 'lottie-react';
import { Lightbulb, Users, TrendingUp } from 'lucide-react';

const serviceData = [
  {
    lottieAnimation: {
      src: "https://cdn.prod.website-files.com/67416bf9ad9706da53302213/674ee342eb71924c1a4d04a7_Bulb.json",
      loop: true,
      autoplay: true
    },
    icon: (
      <motion.div
        animate={{ 
          rotate: [0, 10, -10, 0],
          scale: [1, 1.1, 1]
        }}
        transition={{ 
          duration: 2, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
        className="p-4 rounded-2xl bg-gradient-to-br from-amber-400/20 to-yellow-400/20 border border-amber-400/30"
      >
        <Lightbulb className="w-10 h-10 text-amber-400" />
      </motion.div>
    ),
    imgSrc: '/images/ideation&strategy.gif',
    title: 'Ideation & Strategy',
    description: 'We help you find your unique angle and build a content strategy that resonates with your target audience.',
  },
  {
    lottieAnimation: {
      src: "https://cdn.prod.website-files.com/67416bf9ad9706da53302213/674ee33f4c5314cf16e99ff2_Mobile%20(1)%20(1).json",
      loop: true,
      autoplay: true
    },
    icon: (
      <motion.div
        animate={{ 
          y: [0, -5, 0],
          scale: [1, 1.05, 1]
        }}
        transition={{ 
          duration: 2.5, 
          repeat: Infinity, 
          ease: "easeInOut",
          delay: 0.3
        }}
        className="p-4 rounded-2xl bg-gradient-to-br from-amber-400/20 to-yellow-400/20 border border-amber-400/30"
      >
        <Users className="w-10 h-10 text-amber-400" />
      </motion.div>
    ),
    imgSrc: '/images/audiencegrowth.gif',
    title: 'Audience Growth',
    description: 'Get your content in front of more people in ways they like to consume it, turning viewers into community.',
  },
  {
    lottieAnimation: {
      src: "https://cdn.prod.website-files.com/67416bf9ad9706da53302213/674ee3462354569669929ac7_Brand.json",
      loop: true,
      autoplay: true
    },
    icon: (
      <motion.div
        animate={{ 
          rotate: [0, 5, -5, 0],
          y: [0, -3, 0]
        }}
        transition={{ 
          duration: 3, 
          repeat: Infinity, 
          ease: "easeInOut",
          delay: 0.6
        }}
        className="p-4 rounded-2xl bg-gradient-to-br from-amber-400/20 to-yellow-400/20 border border-amber-400/30"
      >
        <TrendingUp className="w-10 h-10 text-amber-400" />
      </motion.div>
    ),
    imgSrc: '/images/brand&revenue.gif',
    title: 'Brand & Revenue',
    description: 'Strengthen your brand and build organic, predictable growth that translates to real business results.',
  },
];

// A component to handle local GIFs first, then Lottie animations with fallback to icon
const ServiceVisual = ({ lottieAnimation, imgSrc, alt, fallback }) => {
  const [imageError, setImageError] = useState(false);
  const [lottieError, setLottieError] = useState(false);

  // Always try local GIF first
  if (!imageError) {
    return (
      <div className="flex justify-center items-center h-20 w-20 md:h-24 md:w-24 mx-auto">
        <Image
          src={imgSrc}
          alt={alt}
          width={96}
          height={96}
          unoptimized
          className="h-20 w-20 md:h-24 md:w-24 object-contain"
          onError={() => setImageError(true)}
        />
      </div>
    );
  }

  // If local GIF fails, try Lottie animation
  if (!lottieError) {
    return (
      <div className="flex justify-center items-center h-20 w-20 md:h-24 md:w-24 mx-auto">
        <Lottie
          animationData={null}
          path={lottieAnimation.src}
          loop={lottieAnimation.loop}
          autoplay={lottieAnimation.autoplay}
          style={{ height: 96, width: 96 }}
          onError={() => setLottieError(true)}
        />
      </div>
    );
  }

  // If both fail, show the fallback icon
  return (
    <div className="flex justify-center items-center h-20 w-20 md:h-24 md:w-24 mx-auto">
      {fallback}
    </div>
  );
};

const Services = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  };

  return (
    <section id="services" className="py-20 md:py-32 bg-black overflow-hidden relative">
      {/* Background Graphics */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-10 w-96 h-96 bg-gradient-to-r from-amber-400/5 to-yellow-400/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-l from-amber-300/4 to-amber-500/4 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-amber-400/3 to-transparent rounded-full blur-2xl"></div>
      </div>

      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="text-center mb-16 md:mb-24"
        >
          <div className="inline-block mb-6">
            <span className="px-3 py-1 text-xs font-semibold tracking-wider uppercase rounded-full bg-golden-gradient text-black">
              What we do
            </span>
          </div>
          <h2 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 bg-clip-text text-transparent">
                Influence
              </span>
              <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 rounded-full"></div>
            </span>
            {' '}your audience, on{' '}
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 bg-clip-text text-transparent">
                every platform
              </span>
              <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 rounded-full"></div>
            </span>
          </h2>
          <p className="max-w-3xl mx-auto text-neutral-400 text-lg md:text-xl leading-relaxed">
            We build content engines fueled by long-form videos (Podcasts, interviews, YouTube videos, etc.), 
            so you can spend less time marketing and more time innovating.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6"
        >
          {serviceData.map((service, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="group relative"
            >
              <div className="h-full p-8 md:p-6 text-center flex flex-col items-center bg-gradient-to-br from-neutral-900/15 to-neutral-800/8 rounded-2xl border border-neutral-800/30 backdrop-blur-md hover:border-amber-400/40 transition-all duration-500 hover:bg-gradient-to-br hover:from-neutral-900/20 hover:to-neutral-800/12 hover:backdrop-blur-lg hover:transform hover:scale-[1.02] min-h-[320px]">
                <div className="mb-6 flex justify-center items-center">
                  <ServiceVisual 
                    lottieAnimation={service.lottieAnimation}
                    imgSrc={service.imgSrc} 
                    alt={service.title} 
                    fallback={service.icon} 
                  />
                </div>
                <div className="flex-grow flex flex-col justify-center">
                  <h3 className="text-xl md:text-2xl font-bold tracking-tight mb-4 group-hover:text-amber-400 transition-colors duration-300">
                    {service.title}
                  </h3>
                  <p className="text-neutral-400 text-sm md:text-base leading-relaxed group-hover:text-neutral-300 transition-colors duration-300">
                    {service.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Services;
