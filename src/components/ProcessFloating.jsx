'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import CardSwap, { Card } from '../blocks/Components/CardSwap/CardSwap';
import DecryptedText from '../blocks/TextAnimations/DecryptedText/DecryptedText';
import ShinyText from '../blocks/TextAnimations/ShinyText/ShinyText';

const ProcessFloating = () => {  const [frontCardIndex, setFrontCardIndex] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const [progressKey, setProgressKey] = useState(0);
  const sectionRef = useRef(null);
  const cardSwapRef = useRef(null);

  // Define processSteps at the top to avoid reference errors
  const processSteps = [
    {
      id: 1,
      step: "01",
      heading: "Strategy and Foundation",
      description: "The process begins by getting out what's in your head, out of your head. We give you 100% clarity after taking short interviews, researching your ICP, building a brand story and other assets, helping you gain crystal clarity about your brand's content direction.",
      output: "Strategy, brand story, and trust profile",
      image: "/images/1.png"
    },
    {
      id: 2,
      step: "02", 
      heading: "Content Design",
      description: "Consistency means trust and with a solid foundation we will design the visual guidelines for editing your content. This builds authority and trust already warranted by your expertise. Already have a brand? We will build a complimentary visual identity specific to videos.",
      output: "Visual identity",
      image: "/images/2.png"
    },
    {
      id: 3,
      step: "03",
      heading: "Pre-Production", 
      description: "This is where you invest 1 hour a week and record a podcast with an industry expert, interview with our team, or record long-form videos from the scripts we send. No overthinking, no confusion - Always create with confidence.",
      output: "Systematic scheduling process",
      image: "/images/3.png"
    },
    {
      id: 4,
      step: "04",
      heading: "Post-Production",
      description: "We take all the raw content and our team turns it into authority-driven content that builds trust for your brand at scale. We create and post 20 videos a month on every platform mainly - Instagram, YouTube, and Linkedin.",
      output: "5 videos every week",
      image: "/images/4.png"
    },
    {
      id: 5,
      step: "05",
      heading: "Backend Automation",
      description: "If you sell info-products we set automation and backend systems to predictably convert your followers into paying customers.",
      output: "Consistent organic leads",
      image: "/images/5.png"
    }
  ];  // Handle card swap callback from CardSwap component
  const handleCardSwap = (newFrontCardIndex) => {
    console.log('CardSwap callback - newFrontCardIndex:', newFrontCardIndex);
    // Ensure the index is valid
    if (newFrontCardIndex >= 0 && newFrontCardIndex < processSteps.length) {
      setFrontCardIndex(newFrontCardIndex);
      setProgressKey(prev => prev + 1);
    }
  };  // Simple viewport detection - only start when in view, let it run normally
  useEffect(() => {
    const observer = new IntersectionObserver(      (entries) => {
        entries.forEach((entry) => {
          const isVisible = entry.isIntersecting;
          
          console.log('Viewport status:', isVisible ? 'visible' : 'hidden');
          
          // Only start once when first coming into view
          if (isVisible && !hasStarted) {
            console.log('Section in view - starting animation');
            setHasStarted(true);
          }
          
          // Simple pause/resume - don't reset, just pause/resume
          if (!isVisible && hasStarted) {
            console.log('Section out of view - pausing');
            if (cardSwapRef.current && cardSwapRef.current.stopSwapping) {
              cardSwapRef.current.stopSwapping();
            }
          } else if (isVisible && hasStarted) {
            console.log('Section back in view - resuming');
            if (cardSwapRef.current && cardSwapRef.current.startSwapping) {
              cardSwapRef.current.startSwapping();
            }
          }
        });
      },
      {
        threshold: 0.3, // 30% visibility to trigger
        rootMargin: '50px' // Give some margin
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, [hasStarted]);
  // Remove the problematic progress bar reset effect that was causing issues
  // The progress bar will reset naturally with the progressKey increment  // Debug effect to track state changes - remove in production
  useEffect(() => {
    console.log('ProcessFloating state - frontCardIndex:', frontCardIndex, 'hasStarted:', hasStarted);
  }, [frontCardIndex, hasStarted]);

  return (    <section 
      ref={sectionRef}
      id="process" 
      className="relative py-6 md:py-10 overflow-visible bg-black min-h-screen"
    >
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <motion.div 
          className="text-center mb-1"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >          <span className="px-3 py-1 text-xs font-semibold tracking-wider uppercase rounded-full bg-golden-gradient text-black mb-3 inline-block">
            Our Process
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-3 font-grift">
            Simple{' '}
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 bg-clip-text text-transparent font-bold">
                5-step process
              </span>
              <motion.div
                className="absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 rounded-full"
                initial={{ width: 0 }}
                whileInView={{ width: '100%' }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </span>{' '}
            to make your brand{' '}
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 bg-clip-text text-transparent font-bold">
                Go Big!
              </span>
              <motion.div
                className="absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 rounded-full"
                initial={{ width: 0 }}
                whileInView={{ width: '100%' }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.8 }}
              />
            </span>
          </h2>        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-7 items-center min-h-[76vh]">
          
          {/* Left Side - Dynamic Text Content */}
          <motion.div 
            className="space-y-8 font-grift max-w-2xl"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >            {/* Step Number and Progress Bar */}
            <div className="flex items-center space-x-6 mb-8">
              <div className="w-20 h-20 rounded-full bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 flex items-center justify-center flex-shrink-0">
                <span className="text-3xl font-bold text-black font-grift">
                  {processSteps[frontCardIndex]?.step || processSteps[0]?.step || "01"}
                </span>
              </div>
              
              <div className="flex-1 relative">
                <div className="h-0.5 bg-gradient-to-r from-amber-400/30 via-amber-300/30 to-yellow-400/30 rounded-full"></div>                <motion.div 
                  key={`progress-${progressKey}-${frontCardIndex}`}
                  className="absolute top-0 left-0 h-0.5 bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: hasStarted ? '100%' : 0 }}
                  transition={{ 
                    duration: hasStarted ? (frontCardIndex === 0 ? 8 : 7) : 0, // 8s for first step, 7s for others
                    ease: "linear",
                    delay: 0
                  }}
                />
              </div>
            </div>            {/* Heading with Decrypted Text Animation */}
            <div className="mb-8">
              <h3 className="text-3xl md:text-4xl font-bold text-white leading-tight tracking-wide font-grift">
                <DecryptedText
                  key={`heading-${frontCardIndex}`}
                  text={processSteps[frontCardIndex]?.heading || processSteps[0]?.heading || "Loading..."}
                  animateOn="view"
                  speed={80}
                  maxIterations={1}
                  sequential={true}
                  useOriginalCharsOnly={true}
                  revealDirection="start"
                  className="text-white"
                  encryptedClassName="text-amber-400/30"
                />
              </h3>
            </div>            {/* Description with ShinyText */}
            <div className="mb-8">
              <div className="text-lg md:text-xl text-neutral-300 leading-loose tracking-wide font-grift max-w-none">
                <ShinyText
                  key={`description-${frontCardIndex}`}
                  text={processSteps[frontCardIndex]?.description || processSteps[0]?.description || "Loading..."}
                  disabled={false}
                  speed={3}
                  className="text-neutral-300"
                />
              </div>
            </div>            {/* Output Badge */}
            <div className="inline-flex items-center px-8 py-4 rounded-full bg-gradient-to-r from-black/80 to-neutral-900/80 border border-amber-400/50 backdrop-blur-sm shadow-lg shadow-amber-400/10">
              <span className="text-amber-400 font-medium font-grift text-base tracking-wide">Output: </span>
              <span className="text-amber-400 font-bold ml-3 font-grift text-base tracking-wide">
                <ShinyText
                  key={`output-${frontCardIndex}`}
                  text={processSteps[frontCardIndex]?.output || processSteps[0]?.output || "Loading..."}
                  disabled={false}
                  speed={3}
                  className="text-amber-400 font-bold"
                />
              </span>
            </div>
          </motion.div>          {/* Right Side - CardSwap Component */}
          <motion.div 
            className="relative h-[79vh] flex items-center justify-center"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <CardSwap
              ref={cardSwapRef}
              width={460}
              height={560}
              cardDistance={50}
              verticalDistance={60}
              delay={7000}
              firstSwapDelay={8000} // Give Step 1 full 8 seconds
              autoStart={hasStarted}
              onSwap={handleCardSwap}
              pauseOnHover={false}
              skewAmount={4}
              easing="power1.inOut"
            >
              {processSteps.map((step, index) => (
                <Card
                  key={step.id}
                  className="bg-gradient-to-br from-neutral-900 to-black border-amber-400/30 backdrop-blur-xl cursor-pointer hover:border-amber-400/60 transition-all duration-500"
                  customClass="shadow-2xl shadow-amber-400/10"
                >                  <div className="p-6 h-full flex flex-col justify-between">                    {/* Card Header */}
                    <div className="text-center mb-6">
                      <div className="relative w-32 h-32 mx-auto mb-5 flex items-center justify-center">
                        <span className="text-8xl font-black font-grift relative z-10 bg-gradient-to-b from-amber-400 from-0% via-amber-400 via-45% via-amber-400/20 via-65% to-transparent to-100% bg-clip-text text-transparent">
                          {step.step}
                        </span>
                      </div>
                      <h4 className="text-3xl font-black text-white mb-4 font-grift tracking-tight leading-tight">
                        {step.heading}
                      </h4>
                      <div className="w-24 h-px bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 mx-auto"></div>
                    </div>

                    {/* Card Content - Image */}
                    <div className="flex-1 flex flex-col justify-center items-center">
                      <div className="relative w-48 h-48 flex items-center justify-center">
                        <Image
                          src={step.image}
                          alt={step.heading}
                          width={192}
                          height={192}
                          className="object-contain w-full h-full opacity-90"
                          style={{
                            filter: 'brightness(0) saturate(100%) invert(64%) sepia(100%) saturate(1200%) hue-rotate(25deg) brightness(130%) drop-shadow(0 0 20px rgba(251, 191, 36, 0.8))'
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </CardSwap>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ProcessFloating;
