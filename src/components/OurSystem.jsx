'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

const OurSystem = () => {
  return (    <section className="relative py-24 md:py-40 overflow-hidden bg-black min-h-screen flex items-center justify-center">
      {/* AMOLED Black background with subtle golden glow effects */}
      <div className="absolute inset-0 bg-black">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-gold-light/5 to-gold-dark/5 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-l from-gold-DEFAULT/5 to-gold-light/5 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />
      </div>

      <div className="container mx-auto px-4 relative z-10 w-full">
        <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center justify-center min-h-[80vh]">
          {/* Left Content */}
          <div className="text-center md:text-left order-2 md:order-1">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-block mb-6">
                <span className="px-3 py-1 text-xs font-semibold tracking-wider uppercase rounded-full bg-golden-gradient text-black">
                  Our System
                </span>
              </div>              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
                Turn 1 Hour of Recording into a{' '}
                <span className="relative inline-block">
                  <span className="bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 bg-clip-text text-transparent font-extrabold">
                    Month's Worth
                  </span>
                  <motion.div
                    className="absolute -bottom-2 left-0 h-1 bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 rounded-full"
                    initial={{ width: 0 }}
                    whileInView={{ width: '100%' }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.5 }}
                  />
                </span>{' '}
                of Content!
              </h2>
              <motion.p 
                className="text-lg md:text-xl text-neutral-300 max-w-xl mx-auto md:mx-0 leading-relaxed"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                1 hour of video recording turns into{' '}
                <span className="text-gold-DEFAULT font-semibold">5-7 short-form videos</span>{' '}
                for Instagram, YT shorts, and LinkedIn, which can further translate into an{' '}
                <span className="text-gold-DEFAULT font-semibold">audio podcast</span> and a{' '}
                <span className="text-gold-DEFAULT font-semibold">weekly newsletter</span>.
              </motion.p>
            </motion.div>
          </div>

          {/* Right Visual - Orbital Solar System */}
          <div className="relative flex items-center justify-center h-[600px] md:h-[700px] order-1 md:order-2">
            {/* Background gradient circle */}
            <motion.div 
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            >
              <div className="relative w-[420px] h-[420px]">
                <Image
                  src="https://cdn.prod.website-files.com/67416bf9ad9706da53302213/674ea9799973eeed9e76a540_system-circle-gradient.svg"
                  alt="System gradient ring"
                  fill
                  className="object-contain opacity-80"
                  priority
                />
              </div>
            </motion.div>

            {/* Central content circle */}
            <motion.div 
              className="absolute inset-0 flex items-center justify-center z-10"
              initial={{ scale: 0, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
            >
              <div className="relative">
                {/* Soft glow effect around central circle */}
                <motion.div
                  className="absolute inset-0 w-72 h-72 bg-gradient-to-r from-gold-light/20 via-gold-DEFAULT/30 to-gold-dark/20 rounded-full blur-xl"
                  animate={{ 
                    scale: [1, 1.1, 1],
                    opacity: [0.5, 0.8, 0.5]
                  }}
                  transition={{ 
                    duration: 4, 
                    repeat: Infinity, 
                    ease: "easeInOut" 
                  }}
                />
                
                {/* Central content circle */}
                <div className="relative w-64 h-64 rounded-full bg-gradient-to-r from-gold-light via-gold-DEFAULT to-gold-dark p-1">
                  <div className="w-full h-full bg-black rounded-full flex flex-col items-center justify-center relative overflow-hidden">
                    {/* Inner gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-gold-light/10 via-transparent to-gold-dark/10 rounded-full" />
                      {/* Central text content */}
                    <motion.div
                      className="relative z-10 text-center"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: 0.5 }}
                    >                      <div className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 mb-1">
                        5-7
                      </div>
                      <div className="text-sm md:text-base text-neutral-300 font-medium leading-tight">
                        Short Videos
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>            {/* Three Concentric Orbits with 2 Icons Each */}
            <div className="absolute inset-0 flex items-center justify-center z-30">              {/* Outermost Orbit - Radius 210px - Instagram & TikTok (matching the visible 420px orbital ring) */}
              <motion.div
                className="absolute w-[420px] h-[420px]"
                animate={{ rotate: 360 }}
                transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
                style={{ transformOrigin: 'center center' }}
              >                {/* Instagram - Outermost Orbit Position 1 (Top) - Centered on orbital ring */}
                <motion.div
                  className="absolute"
                  style={{ 
                    top: '-20px',
                    left: '50%',
                    transform: 'translate(-50%, -50%)' 
                  }}
                  initial={{ scale: 0, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 1.5, ease: "easeOut" }}
                >
                  <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
                    className="relative"
                  >                    {/* Instagram icon with glow effect */}
                    <motion.div
                      className="relative w-10 h-10 filter drop-shadow-lg"
                      style={{ 
                        filter: 'drop-shadow(0 0 15px #E4405F60) drop-shadow(0 0 30px #E4405F40) brightness(1.1)',
                      }}
                      animate={{ 
                        filter: [
                          'drop-shadow(0 0 15px #E4405F60) drop-shadow(0 0 30px #E4405F40) brightness(1.1)',
                          'drop-shadow(0 0 25px #E4405F80) drop-shadow(0 0 50px #E4405F60) brightness(1.2)',
                          'drop-shadow(0 0 15px #E4405F60) drop-shadow(0 0 30px #E4405F40) brightness(1.1)'
                        ]
                      }}
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                      whileHover={{ 
                        scale: 1.3,
                        filter: 'drop-shadow(0 0 30px #E4405F90) drop-shadow(0 0 60px #E4405F70) brightness(1.3)'
                      }}
                    >
                      <Image 
                        src="https://cdn.prod.website-files.com/67416bf9ad9706da53302213/674d273e492320f3e4d835dd_instagram.svg" 
                        alt="Instagram" 
                        width={40} 
                        height={40} 
                        className="object-contain" 
                      />
                    </motion.div>
                  </motion.div>
                </motion.div>                {/* TikTok - Outermost Orbit Position 2 (Bottom) - Centered on orbital ring */}
                <motion.div
                  className="absolute"
                  style={{ 
                    bottom: '-20px',
                    left: '50%',
                    transform: 'translate(-50%, 50%)' 
                  }}
                  initial={{ scale: 0, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 1.6, ease: "easeOut" }}
                >
                  <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
                    className="relative"
                  >                    {/* TikTok icon with glow effect */}
                    <motion.div
                      className="relative w-10 h-10 filter drop-shadow-lg"
                      style={{ 
                        filter: 'drop-shadow(0 0 15px #69C9D060) drop-shadow(0 0 30px #69C9D040) brightness(1.1)',
                      }}
                      animate={{ 
                        filter: [
                          'drop-shadow(0 0 15px #69C9D060) drop-shadow(0 0 30px #69C9D040) brightness(1.1)',
                          'drop-shadow(0 0 25px #69C9D080) drop-shadow(0 0 50px #69C9D060) brightness(1.2)',
                          'drop-shadow(0 0 15px #69C9D060) drop-shadow(0 0 30px #69C9D040) brightness(1.1)'
                        ]
                      }}
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                      whileHover={{ 
                        scale: 1.3,
                        filter: 'drop-shadow(0 0 30px #69C9D090) drop-shadow(0 0 60px #69C9D070) brightness(1.3)'
                      }}
                    >
                      <Image 
                        src="https://cdn.prod.website-files.com/67416bf9ad9706da53302213/674d273e7de957e87e677640_tiktok.svg" 
                        alt="TikTok" 
                        width={40} 
                        height={40} 
                        className="object-contain" 
                      />
                    </motion.div>
                  </motion.div>
                </motion.div>
              </motion.div>              {/* Outer Orbit - Radius 200px - YouTube & LinkedIn */}
              <motion.div
                className="absolute w-[400px] h-[400px]"
                animate={{ rotate: 360 }}
                transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
                style={{ transformOrigin: 'center center' }}
              >                {/* YouTube - Outer Orbit Position 1 (Top) - Centered on 400px orbital ring */}
                <motion.div
                  className="absolute left-1/2"
                  style={{ 
                    top: '20px',
                    transform: 'translate(-50%, -50%)' 
                  }}
                  initial={{ scale: 0, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 1.7, ease: "easeOut" }}
                >
                  <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
                    className="relative"
                  >                    {/* YouTube icon with glow effect */}
                    <motion.div
                      className="relative w-10 h-10 filter drop-shadow-lg"
                      style={{ 
                        filter: 'drop-shadow(0 0 15px #FF000060) drop-shadow(0 0 30px #FF000040) brightness(1.1)',
                      }}
                      animate={{ 
                        filter: [
                          'drop-shadow(0 0 15px #FF000060) drop-shadow(0 0 30px #FF000040) brightness(1.1)',
                          'drop-shadow(0 0 25px #FF000080) drop-shadow(0 0 50px #FF000060) brightness(1.2)',
                          'drop-shadow(0 0 15px #FF000060) drop-shadow(0 0 30px #FF000040) brightness(1.1)'
                        ]
                      }}
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1.0 }}
                      whileHover={{ 
                        scale: 1.3,
                        filter: 'drop-shadow(0 0 30px #FF000090) drop-shadow(0 0 60px #FF000070) brightness(1.3)'
                      }}
                    >
                      <Image 
                        src="https://cdn.prod.website-files.com/67416bf9ad9706da53302213/6745db0a9aae899eee24e727_youtube.svg" 
                        alt="YouTube" 
                        width={40} 
                        height={40} 
                        className="object-contain" 
                      />
                    </motion.div>
                  </motion.div>
                </motion.div>                {/* LinkedIn - Outer Orbit Position 2 (Bottom) - Centered on 400px orbital ring */}
                <motion.div
                  className="absolute left-1/2"
                  style={{ 
                    bottom: '20px',
                    transform: 'translate(-50%, 50%)' 
                  }}
                  initial={{ scale: 0, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 1.8, ease: "easeOut" }}
                >
                  <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
                    className="relative"
                  >                    {/* LinkedIn icon with glow effect */}
                    <motion.div
                      className="relative w-10 h-10 filter drop-shadow-lg"
                      style={{ 
                        filter: 'drop-shadow(0 0 15px #0077B560) drop-shadow(0 0 30px #0077B540) brightness(1.1)',
                      }}
                      animate={{ 
                        filter: [
                          'drop-shadow(0 0 15px #0077B560) drop-shadow(0 0 30px #0077B540) brightness(1.1)',
                          'drop-shadow(0 0 25px #0077B580) drop-shadow(0 0 50px #0077B560) brightness(1.2)',
                          'drop-shadow(0 0 15px #0077B560) drop-shadow(0 0 30px #0077B540) brightness(1.1)'
                        ]
                      }}
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
                      whileHover={{ 
                        scale: 1.3,
                        filter: 'drop-shadow(0 0 30px #0077B590) drop-shadow(0 0 60px #0077B570) brightness(1.3)'
                      }}
                    >
                      <Image 
                        src="https://cdn.prod.website-files.com/67416bf9ad9706da53302213/674d273e937227cf14ad3000_linkedin.svg" 
                        alt="LinkedIn" 
                        width={40} 
                        height={40} 
                        className="object-contain" 
                      />
                    </motion.div>
                  </motion.div>
                </motion.div>
              </motion.div>

              {/* Middle Orbit - Radius 150px - Spotify & Apple Podcasts */}
              <motion.div
                className="absolute w-[300px] h-[300px]"
                animate={{ rotate: -360 }}
                transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                style={{ transformOrigin: 'center center' }}
              >                {/* Spotify - Middle Orbit Position 1 (Right) - Centered on 300px orbital ring */}
                <motion.div
                  className="absolute top-1/2 right-0"
                  style={{ transform: 'translate(50%, -50%)' }}
                  initial={{ scale: 0, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 1.7, ease: "easeOut" }}
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                    className="relative"
                  >                    {/* Spotify icon with glow effect */}
                    <motion.div
                      className="relative w-10 h-10 filter drop-shadow-lg"
                      style={{ 
                        filter: 'drop-shadow(0 0 15px #1DB95460) drop-shadow(0 0 30px #1DB95440) brightness(1.1)',
                      }}
                      animate={{ 
                        filter: [
                          'drop-shadow(0 0 15px #1DB95460) drop-shadow(0 0 30px #1DB95440) brightness(1.1)',
                          'drop-shadow(0 0 25px #1DB95480) drop-shadow(0 0 50px #1DB95460) brightness(1.2)',
                          'drop-shadow(0 0 15px #1DB95460) drop-shadow(0 0 30px #1DB95440) brightness(1.1)'
                        ]
                      }}
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1.0 }}
                      whileHover={{ 
                        scale: 1.3,
                        filter: 'drop-shadow(0 0 30px #1DB95490) drop-shadow(0 0 60px #1DB95470) brightness(1.3)'
                      }}
                    >
                      <Image 
                        src="https://cdn.prod.website-files.com/67416bf9ad9706da53302213/674fe6b4e710d3afc18a4dc5_spotify.svg" 
                        alt="Spotify" 
                        width={40} 
                        height={40} 
                        className="object-contain" 
                      />
                    </motion.div>
                  </motion.div>
                </motion.div>                {/* Apple Podcasts - Middle Orbit Position 2 (Left) - Centered on 300px orbital ring */}
                <motion.div
                  className="absolute top-1/2 left-0"
                  style={{ transform: 'translate(-50%, -50%)' }}
                  initial={{ scale: 0, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 1.8, ease: "easeOut" }}
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                    className="relative"
                  >                    {/* Apple Podcasts icon with glow effect */}
                    <motion.div
                      className="relative w-10 h-10 filter drop-shadow-lg"
                      style={{ 
                        filter: 'drop-shadow(0 0 15px #9933CC60) drop-shadow(0 0 30px #9933CC40) brightness(1.1)',
                      }}
                      animate={{ 
                        filter: [
                          'drop-shadow(0 0 15px #9933CC60) drop-shadow(0 0 30px #9933CC40) brightness(1.1)',
                          'drop-shadow(0 0 25px #9933CC80) drop-shadow(0 0 50px #9933CC60) brightness(1.2)',
                          'drop-shadow(0 0 15px #9933CC60) drop-shadow(0 0 30px #9933CC40) brightness(1.1)'
                        ]
                      }}
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
                      whileHover={{ 
                        scale: 1.3,
                        filter: 'drop-shadow(0 0 30px #9933CC90) drop-shadow(0 0 60px #9933CC70) brightness(1.3)'
                      }}
                    >
                      <Image 
                        src="https://cdn.prod.website-files.com/67416bf9ad9706da53302213/674fe6b4e5f27258b7e169d3_apple-podcasts.png" 
                        alt="Apple Podcasts" 
                        width={40} 
                        height={40} 
                        className="object-contain" 
                      />
                    </motion.div>
                  </motion.div>                </motion.div>
              </motion.div>
            </div>

            {/* Three Concentric Orbital Rings */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center pointer-events-none z-5"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 2, delay: 2.2 }}
            >
              {/* Outer orbital ring - 400px */}
              <motion.div 
                className="w-[420px] h-[420px] border border-gold-DEFAULT/10 rounded-full"
                animate={{ 
                  rotate: 360,
                  scale: [1, 1.01, 1]
                }}
                transition={{ 
                  rotate: { duration: 100, repeat: Infinity, ease: "linear" },
                  scale: { duration: 6, repeat: Infinity, ease: "easeInOut" }
                }}
              />
              
              {/* Middle orbital ring - 300px */}
              <motion.div 
                className="absolute w-[320px] h-[320px] border border-gold-DEFAULT/15 rounded-full"
                animate={{ 
                  rotate: -360,
                  opacity: [0.4, 0.7, 0.4]
                }}
                transition={{ 
                  rotate: { duration: 80, repeat: Infinity, ease: "linear" },
                  opacity: { duration: 5, repeat: Infinity, ease: "easeInOut" }
                }}
              />
              
              {/* Inner orbital ring - 200px */}
              <motion.div 
                className="absolute w-[220px] h-[220px] border border-gold-DEFAULT/8 rounded-full"
                animate={{ 
                  scale: [1, 1.03, 1],
                  opacity: [0.2, 0.4, 0.2]
                }}
                transition={{ 
                  duration: 7, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }}
              />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurSystem;
