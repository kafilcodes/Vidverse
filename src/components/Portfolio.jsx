'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Loader, VolumeX, Volume2, Folder } from 'lucide-react';
import SectionChip from '@/components/ui/section-chip';

// Component to load Wistia external script
const WistiaScriptLoader = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://fast.wistia.net/assets/external/E-v1.js';
    script.async = true;
    script.charset = 'ISO-8859-1';
    
    if (!document.querySelector('script[src="https://fast.wistia.net/assets/external/E-v1.js"]')) {
      document.head.appendChild(script);
    }
    
    return () => {
      // Clean up script if component unmounts
      const existingScript = document.querySelector('script[src="https://fast.wistia.net/assets/external/E-v1.js"]');
      if (existingScript && existingScript.remove) {
        existingScript.remove();
      }
    };
  }, []);
  
  return null;
};

const portfolioItems = [
  { id: 1, videoSrc: 'https://mohsinkhanworking.wistia.com/medias/sfjjtmk2ue', videoId: 'sfjjtmk2ue', title: 'Short-Form Content 1', description: 'Professional video content creation', type: 'shorts' },
  { id: 2, videoSrc: 'https://mohsinkhanworking.wistia.com/medias/m6pnnn60yv', videoId: 'm6pnnn60yv', title: 'Short-Form Content 2', description: 'Engaging short-form content', type: 'shorts' },
  { id: 3, videoSrc: 'https://mohsinkhanworking.wistia.com/medias/s58cvsw5n3', videoId: 's58cvsw5n3', title: 'Short-Form Content 3', description: 'Creative video storytelling', type: 'shorts' },
  { id: 4, videoSrc: 'https://mohsinkhanworking.wistia.com/medias/k9rwkzbzik', videoId: 'k9rwkzbzik', title: 'Short-Form Content 4', description: 'Dynamic content creation', type: 'shorts' },
  { id: 5, videoSrc: 'https://mohsinkhanworking.wistia.com/medias/v6p7ic79r8', videoId: 'v6p7ic79r8', title: 'Long-form Content', description: 'In-depth video analysis', type: 'long' },
];

const VideoCard = ({ item, isVisible, position, hoveredCard, setHoveredCard, cardIndex }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const iframeRef = useRef(null);

  useEffect(() => {
    // Reset loading state when visibility changes
    if (!isVisible) {
      setIsLoading(false);
    }
  }, [isVisible, position]);

  const getCardStyle = () => {
    switch (position) {
      case 'left':
        return { transform: 'rotate(0deg) scale(0.95)', zIndex: 1 }; // Removed tilt
      case 'right':
        return { transform: 'rotate(0deg) scale(0.95)', zIndex: 1 }; // Removed tilt
      case 'center':
      default:
        return { transform: 'rotate(0deg) scale(1)', zIndex: 2 }; // Already straight
    }
  };

  const aspectRatio = item.type === 'shorts' ? '9/16' : '16/9';
  const cardWidth = item.type === 'shorts' ? '322.65px' : '720px'; // Keep width as is
  const cardHeight = item.type === 'shorts' ? '530.23px' : '405px'; // Use proper 16:9 ratio height for long videos (720/16*9 = 405px)

  // Enhanced Wistia embed URL with maximum quality parameters, full coverage (fitStrategy=cover ensures video fills entire container)
  const wistiaEmbedUrl = `https://fast.wistia.net/embed/iframe/${item.videoId}?seo=true&videoFoam=true&playerColor=ffcc33&silentAutoPlay=false&autoPlay=false&muted=true&qualityControl=true&volume=1&controlsVisibleOnLoad=true&fullscreenButton=true&settingsControl=true&volumeControl=true&qualityMin=720&qualityMax=4K&playbackRateControl=true&fitStrategy=${item.type === 'long' ? 'fill' : 'cover'}&wmode=transparent&plugin[socialbar-v1][on]=false&plugin[captions-v1][on]=false`;
  
  const iframeId = `wistia-${item.videoId}-${cardIndex}`;

  const handleLoad = () => {
    setIsLoading(false);
    
    // Initialize Wistia Player API event listeners
    if (typeof window !== 'undefined') {
      window._wq = window._wq || [];
      window._wq.push({ 
        id: item.videoId, 
        onReady: function(video) {
          // Sync mute state with actual video mute state
          video.bind('mutechange', function(isMutedState) {
            setIsMuted(isMutedState);
          });
          
          // Set initial mute state to true (muted by default)
          setIsMuted(true);
          video.mute(); // Ensure video starts muted
        }
      });
    }
  };

  // Hover play/pause functionality
  const handleMouseEnter = () => {
    if (typeof window !== 'undefined' && window.Wistia) {
      const video = window.Wistia.api(item.videoId);
      if (video && video.ready()) {
        video.play();
      } else {
        // Fallback: Wait for video to be ready
        window._wq = window._wq || [];
        window._wq.push({ 
          id: item.videoId, 
          onReady: function(video) {
            video.mute(); // Ensure video starts muted
            video.play();
          }
        });
      }
    }
  };

  const handleMouseLeave = () => {
    if (typeof window !== 'undefined' && window.Wistia) {
      const video = window.Wistia.api(item.videoId);
      if (video && video.ready()) {
        video.pause();
      } else {
        // Fallback: Wait for video to be ready
        window._wq = window._wq || [];
        window._wq.push({ 
          id: item.videoId, 
          onReady: function(video) {
            video.mute(); // Ensure video starts muted
            video.pause();
          }
        });
      }
    }
  };

  const toggleMute = () => {
    // Use Wistia Player API for non-destructive mute/unmute
    if (typeof window !== 'undefined' && window.Wistia) {
      const video = window.Wistia.api(item.videoId);
      if (video) {
        if (isMuted) {
          video.unmute();
          setIsMuted(false);
        } else {
          video.mute();
          setIsMuted(true);
        }
      } else {
        // Fallback: Wait for video to be ready and try again
        window._wq = window._wq || [];
        window._wq.push({ 
          id: item.videoId, 
          onReady: function(video) {
            video.mute(); // Ensure video starts muted
            if (isMuted) {
              video.unmute();
              setIsMuted(false);
            } else {
              video.mute();
              setIsMuted(true);
            }
          }
        });
      }
    }
  };

  return (
    <motion.div 
      className={`relative rounded-2xl overflow-hidden group transition-all duration-700 ease-out mx-2 border hover:border-golden/40 ${
        hoveredCard !== null && hoveredCard !== cardIndex ? 'blur-sm scale-[0.96] opacity-60' : ''
      }`}
      style={{ 
        ...getCardStyle(), 
        width: cardWidth,
        height: cardHeight,
        flexShrink: 0,
        backdropFilter: 'blur(16px)',
        background: `
          linear-gradient(135deg, 
            rgba(24, 24, 27, 0.4) 0%, 
            rgba(39, 39, 42, 0.3) 50%, 
            rgba(24, 24, 27, 0.5) 100%
          ),
          radial-gradient(circle at 30% 20%, 
            rgba(217, 165, 32, 0.08) 0%, 
            transparent 60%
          )
        `,
        borderColor: 'rgba(113, 113, 122, 0.5)',
        boxShadow: `
          0 25px 60px -12px rgba(0, 0, 0, 0.3),
          0 8px 25px -8px rgba(0, 0, 0, 0.2),
          inset 0 1px 0 rgba(255, 255, 255, 0.1)
        `,
      }}
      whileHover={{ 
        rotate: 0,
        boxShadow: `
          0 32px 80px -12px rgba(0, 0, 0, 0.4),
          0 12px 32px -8px rgba(217, 165, 32, 0.15),
          inset 0 1px 0 rgba(255, 255, 255, 0.15)
        `,
      }}
      onMouseEnter={() => {
        setHoveredCard(cardIndex);
        handleMouseEnter();
      }}
      onMouseLeave={() => {
        setHoveredCard(null);
        handleMouseLeave();
      }}
    >
      {/* Enhanced Wistia Responsive Wrapper */}
      <div className="relative w-full h-full">
        {item.type === 'shorts' ? (
          // For shorts (vertical videos) - use absolute positioning for better control
          <iframe
            ref={iframeRef}
            id={iframeId}
            src={wistiaEmbedUrl}
            title={item.title}
            allow="autoplay; fullscreen; picture-in-picture; encrypted-media; gyroscope; accelerometer"
            allowtransparency="true"
            frameBorder="0"
            scrolling="no"
            className="wistia_embed"
            name="wistia_embed"
            width="100%"
            height="100%"
            style={{ 
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%', 
              height: '100%', 
              border: 'none',
              borderRadius: '1rem',
              filter: 'contrast(1.05) brightness(1.02) saturate(1.1)'
            }}
            onLoad={handleLoad}
            loading="lazy"
          />
        ) : (
          // For long-form videos - use proper dimensions to match video ratio
          <iframe
            ref={iframeRef}
            id={iframeId}
            src={wistiaEmbedUrl}
            title={item.title}
            allow="autoplay; fullscreen; picture-in-picture; encrypted-media; gyroscope; accelerometer"
            allowtransparency="true"
            frameBorder="0"
            scrolling="no"
            className="wistia_embed"
            name="wistia_embed"
            width="100%"
            height="100%"
            style={{ 
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%', 
              height: '100%', 
              border: 'none',
              borderRadius: '1rem',
              filter: 'contrast(1.05) brightness(1.02) saturate(1.1)'
            }}
            onLoad={handleLoad}
            loading="lazy"
          />
        )}
      </div>
      
      {/* Premium overlay effects */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10 pointer-events-none"></div>
      
      {/* Custom Mute Button - Modern and Subtle */}
      <motion.button
        onClick={toggleMute}
        className="absolute top-4 right-4 z-20 bg-black/20 hover:bg-black/40 backdrop-blur-md rounded-full p-2.5 transition-all duration-500 hover:scale-105 border border-white/10 hover:border-white/20 flex items-center justify-center"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        style={{
          backdropFilter: 'blur(12px) saturate(180%)',
          background: 'rgba(0, 0, 0, 0.15)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
          width: '40px',
          height: '40px'
        }}
      >
        {isMuted ? (
          <VolumeX className="w-4 h-4 text-white/80 hover:text-white transition-colors duration-300" />
        ) : (
          <Volume2 className="w-4 h-4 text-white/80 hover:text-white transition-colors duration-300" />
        )}
      </motion.button>
      
      {/* Golden accent border on hover */}
      <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-golden/30 transition-all duration-700 pointer-events-none" 
           style={{
             background: 'linear-gradient(135deg, transparent, rgba(217, 165, 32, 0.1), transparent)',
             opacity: 0,
           }}
           onMouseEnter={(e) => e.target.style.opacity = '1'}
           onMouseLeave={(e) => e.target.style.opacity = '0'}
      ></div>
      
      <AnimatePresence>
        {isLoading && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="absolute inset-0 flex items-center justify-center z-10"
            style={{
              background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.7), rgba(39, 39, 42, 0.8))',
              backdropFilter: 'blur(8px)',
            }}
          >
            <div className="flex flex-col items-center space-y-4">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-12 h-12 border-4 border-golden/30 border-t-golden rounded-full"
              />
              <p className="text-white text-sm font-medium tracking-wide">Loading Premium Content...</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const Portfolio = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [hoveredCard, setHoveredCard] = useState(null);
  const carouselRef = useRef(null);
  
  // Create unified slides structure
  const slides = [
    {
      id: 'slide-1',
      title: 'Short-Form Content Collection',
      items: portfolioItems.slice(0, 3) // First 3 short videos
    },
    {
      id: 'slide-2', 
      title: 'Mixed Content Collection',
      items: portfolioItems.slice(3) // Remaining content (1 short + 1 long video)
    }
  ];

  const handlePrev = () => {
    setCurrentSlide((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentSlide((prev) => Math.min(slides.length - 1, prev + 1));
  };

  // Add keyboard navigation and touch support
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'ArrowLeft') {
        handlePrev();
      } else if (event.key === 'ArrowRight') {
        handleNext();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Touch/swipe support
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      handleNext();
    } else if (isRightSwipe) {
      handlePrev();
    }
  };

  const getVisibleItems = (slideItems) => {
    return slideItems;
  };

  return (
    <section id="portfolio" className="bg-black text-white py-24 md:py-32">
      <WistiaScriptLoader />
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <div className="flex justify-center mb-4">
            <SectionChip title="Portfolio" icon={Folder} />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-neutral-100 leading-tight">
            Videos that make your brand spread like{' '}
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 bg-clip-text text-transparent font-bold">
                wildfire
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

        {/* Unified Carousel */}
        <div className="relative max-w-7xl mx-auto px-8">
          {/* Slide Indicator */}
          <div className="flex justify-center mb-8 gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  currentSlide === index 
                    ? 'bg-gold-DEFAULT scale-125' 
                    : 'bg-neutral-600 hover:bg-neutral-500'
                }`}
              />
            ))}
          </div>

          {/* Current Slide Title */}
          <h3 className="text-2xl md:text-3xl font-bold text-center mb-8 text-gold-DEFAULT">
            {slides[currentSlide]?.title}
          </h3>

          <div 
            className="overflow-hidden" 
            ref={carouselRef}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            <AnimatePresence initial={false} mode="wait">
              <motion.div
                key={`slide-${currentSlide}`}
                className={`flex items-center gap-4 md:gap-8 ${
                  // For long video slide, align to right with more spacing
                  slides[currentSlide]?.items?.[0]?.type === 'long' 
                    ? 'justify-end pr-8' 
                    : 'justify-center'
                }`}
                initial={{ x: 300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -300, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 200, damping: 25 }}
              >
                {getVisibleItems(slides[currentSlide]?.items || []).map((item, index) => {
                  const itemCount = slides[currentSlide]?.items?.length || 0;
                  let position = 'center';
                  
                  if (itemCount === 3) {
                    position = index === 0 ? 'left' : index === 1 ? 'center' : 'right';
                  } else if (itemCount === 2) {
                    position = index === 0 ? 'left' : 'right';
                  }
                  
                  return (
                    <div key={item.id} className="flex-shrink-0">
                      <VideoCard 
                        item={item} 
                        isVisible={true} 
                        position={position}
                        hoveredCard={hoveredCard}
                        setHoveredCard={setHoveredCard}
                        cardIndex={currentSlide * 10 + index} // Unique index across slides
                      />
                    </div>
                  );
                })}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Buttons */}
          <button 
            onClick={handlePrev} 
            disabled={currentSlide === 0}
            className="absolute top-1/2 -left-4 md:-left-8 transform -translate-y-1/2 bg-neutral-800/80 hover:bg-golden-gradient text-white hover:text-black p-3 rounded-full disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 backdrop-blur-sm z-10"
          >
            <ChevronLeft size={24} />
          </button>
          <button 
            onClick={handleNext} 
            disabled={currentSlide >= slides.length - 1}
            className="absolute top-1/2 -right-4 md:-right-8 transform -translate-y-1/2 bg-neutral-800/80 hover:bg-golden-gradient text-white hover:text-black p-3 rounded-full disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 backdrop-blur-sm z-10"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Portfolio;
