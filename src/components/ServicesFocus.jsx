'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Lottie from 'lottie-react';
import { Lightbulb, Users, TrendingUp, Video } from 'lucide-react';
import { cn } from '@/lib/utils';
import SectionChip from '@/components/ui/section-chip';

const serviceData = [
  {
    lottieAnimation: {
      src: "/lottie/674ee342eb71924c1a4d04a7_Bulb.json",
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
    imgSrc: '/logo/ideation&strategy.svg',
    title: 'Ideation & Strategy',
    description: 'You can spend less time marketing and more time innovating.',
  },
  {
    lottieAnimation: {
      src: "/lottie/674ee33f4c5314cf16e99ff2_Mobile%20(1)%20(1).json",
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
    imgSrc: '/logo/audiencegrowth.svg',
    title: 'Audience Growth',
    description: 'Get your content in front of more people in ways they like to consume it.',
  },
  {
    lottieAnimation: {
      src: "/lottie/674ee3462354569669929ac7_Brand.json",
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
    imgSrc: '/logo/brand&revenue.svg',
    title: 'Brand & Revenue',
    description: 'Strengthen your brand, and grab bigger opportunities.',
  },
];

// A component to handle local GIFs first, then Lottie animations with fallback to icon
const ServiceVisual = ({ lottieAnimation, imgSrc, alt, fallback }) => {
  const [imageError, setImageError] = useState(false);
  const [lottieError, setLottieError] = useState(false);

  // Always try local GIF first
  if (!imageError) {
    return (
      <div className="flex justify-center items-center h-24 w-24 sm:h-28 sm:w-28 md:h-32 md:w-32 lg:h-36 lg:w-36 mx-auto pt-4 pb-0">
        <Image
          src={imgSrc}
          alt={alt}
          width={128}
          height={128}
          unoptimized
          className="h-28 w-28 sm:h-32 sm:w-32 md:h-36 md:w-36 lg:h-40 lg:w-40 object-contain"
          onError={() => setImageError(true)}
        />
      </div>
    );
  }

  // If local GIF fails, try Lottie animation
  if (!lottieError) {
    return (
      <div className="flex justify-center items-center h-24 w-24 sm:h-28 sm:w-28 md:h-32 md:w-32 lg:h-36 lg:w-36 mx-auto pt-4 pb-0">
        <Lottie
          animationData={null}
          path={lottieAnimation.src}
          loop={lottieAnimation.loop}
          autoplay={lottieAnimation.autoplay}
          style={{ height: 128, width: 128 }}
          onError={() => setLottieError(true)}
        />
      </div>
    );
  }

  // If both fail, show the fallback icon
  return (
    <div className="flex justify-center items-center h-16 w-16 sm:h-18 sm:w-18 md:h-20 md:w-20 lg:h-24 lg:w-24 mx-auto">
      {fallback}
    </div>
  );
};

// Focus Card component that maintains the original design
const ServiceCard = React.memo(({ service, index, hovered, setHovered }) => {
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <motion.div
      key={index}
      variants={itemVariants}
      className="group relative"
      onMouseEnter={() => setHovered(index)}
      onMouseLeave={() => setHovered(null)}
    >
      <div        className={cn(
          "h-full p-6 sm:p-7 md:p-8 lg:p-6 text-center flex flex-col items-center bg-gradient-to-br from-neutral-900/15 to-neutral-800/8 rounded-xl sm:rounded-2xl border border-neutral-800/30 backdrop-blur-md transition-all duration-300 ease-out min-h-[280px] sm:min-h-[300px] md:min-h-[320px]",
          "hover:border-amber-400/40 hover:bg-gradient-to-br hover:from-neutral-900/20 hover:to-neutral-800/12 hover:backdrop-blur-lg hover:transform hover:scale-[1.02]",
          hovered === index && "shadow-2xl shadow-amber-400/20 border-amber-400/50",
          hovered !== null && hovered !== index && "blur-[2px] scale-[0.96] opacity-60"
        )}
      >
        <div className="mb-4 sm:mb-5 md:mb-6 flex justify-center items-center">
          <ServiceVisual 
            lottieAnimation={service.lottieAnimation}
            imgSrc={service.imgSrc} 
            alt={service.title} 
            fallback={service.icon} 
          />
        </div>
        <div className="flex-grow flex flex-col justify-center">
          <h3 className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight mb-3 sm:mb-4 group-hover:text-amber-400 transition-colors duration-300">
            {service.title}
          </h3>
          <p className="text-neutral-400 text-sm sm:text-base leading-relaxed
          
group-hover:text-neutral-300 transition-colors duration-300">
            {service.description}
          </p>
        </div>
      </div>
    </motion.div>
  );
});

ServiceCard.displayName = "ServiceCard";

const Services = () => {
  const [hovered, setHovered] = useState(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.2 },
    },
  };

  return (
    <section id="services" className="relative bg-black py-16 sm:py-18 md:py-20 lg:py-24" style={{ fontFamily: 'Manrope, sans-serif' }}>
      {/* Background Graphics */}
      
      
      

      <div className="container mx-auto px-4 sm:px-6 relative z-10 max-w-7xl">
        <div className="absolute inset-0 pointer-events-none z-[-1]">
        
                {/* BG ICONS HERO SECTION - Large SVG */}
                <Image
                  src="/bg-icons/674183bd7a9afd8a5f4419f7_elipse-dark.svg"
                  width={500}
                  height={500}
        
                  className="absolute top-70 -left-145 opacity-50 scale-130 hidden md:block"
                  alt=""
                  priority={false}
                />
                <Image
                  src="/bg-icons/674183bd7eb1543409d0f095_polygon-dark.svg"
                  width={500}
                  height={500}
        
                  className="absolute top-10 -right-125 opacity-50 scale-130 hidden md:block"
                  alt=""
                  priority={false}
                />
              </div>
        <motion.div 
          className="text-center mb-12 sm:mb-14 md:mb-16 lg:mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-block mb-4 sm:mb-5 md:mb-6">
            <SectionChip title="What we do" icon={Video} />
          </div>          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4 sm:mb-5 md:mb-6 text-white px-4 sm:px-0">
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 bg-clip-text text-transparent">
                Engage
              </span>
              <motion.div
                className="absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 rounded-full"
                initial={{ width: 0 }}
                whileInView={{ width: '100%' }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.3 }}
              />
            </span> your audience, on<br className="hidden sm:block" />

            <span className="relative inline-block">
    
              <span className="bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 bg-clip-text text-transparent">
                every platform
              </span>
              <motion.div
                className="absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 rounded-full"
                initial={{ width: 0 }}
                whileInView={{ width: '100%' }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </span>
          </h2>
          <p className="max-w-xs sm:max-w-md md:max-w-lg lg:max-w-2xl xl:max-w-3xl mx-auto text-neutral-400 text-base sm:text-lg md:text-xl leading-relaxed px-4 sm:px-0">
            We turn your content into growth engines for (Podcasts, Interviews, YouTube videos etc), 
            so you can spend less time marketing and more time innovating.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-7 md:gap-8 lg:gap-6"
        >
          {serviceData.map((service, index) => (
            <ServiceCard
              key={index}
              service={service}
              index={index}
              hovered={hovered}
              setHovered={setHovered}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Services;
