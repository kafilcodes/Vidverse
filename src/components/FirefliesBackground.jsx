'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

const FirefliesBackground = ({ 
  count = 35, // Increased count for better coverage
  speed = 0.2, // Slower speed for more realistic motion
  size = 3.5, // Bigger size for better visibility
  glowColor = 'hsl(var(--gold-DEFAULT))',
  opacity = 0.9 // Higher opacity for better visibility
}) => {
  const containerRef = useRef(null);
  const [isMounted, setIsMounted] = useState(false);
  const [fireflies, setFireflies] = useState([]);

  useEffect(() => {
    // Generate firefly data only on client side
    const generatedFireflies = Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      initialDelay: Math.random() * 10,
      duration: 12 + Math.random() * 8, // Slower: 12-20 seconds per cycle
      size: size + Math.random() * 1.5,
      opacity: 0.4 + Math.random() * 0.3,
    }));
    
    setFireflies(generatedFireflies);
    setIsMounted(true);
  }, [count, size]);

  if (!isMounted) {
    return null; // Prevent SSR rendering
  }

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      style={{ background: 'transparent' }}
    >
      {fireflies.map((firefly) => (
        <motion.div
          key={firefly.id}
          className="absolute rounded-full"
          style={{
            width: firefly.size,
            height: firefly.size,
            background: glowColor,
            filter: `blur(0.5px)`,
            boxShadow: `0 0 ${firefly.size * 3}px ${glowColor}`,
          }}
          initial={{
            x: `${firefly.x}vw`,
            y: `${firefly.y}vh`,
            opacity: 0,
            scale: 0,
          }}
          animate={{            x: [
              `${firefly.x}vw`,
              `${(firefly.x + 15 + Math.random() * 30) % 100}vw`, // Increased movement range
              `${(firefly.x + 8 + Math.random() * 25) % 100}vw`,
              `${firefly.x}vw`,
            ],
            y: [
              `${firefly.y}vh`,
              `${(firefly.y + 12 + Math.random() * 25) % 100}vh`, // Increased movement range
              `${(firefly.y + 18 + Math.random() * 30) % 100}vh`,
              `${firefly.y}vh`,
            ],
            opacity: [0, firefly.opacity * opacity, firefly.opacity * opacity, 0],
            scale: [0, 1, 1.2, 0],
          }}
          transition={{
            duration: firefly.duration * speed,
            repeat: Infinity,
            delay: firefly.initialDelay,
            ease: "easeInOut",
          }}
        />
      ))}
      
      {/* Additional larger, slower fireflies for depth */}
      {Array.from({ length: Math.floor(count / 3) }, (_, i) => {
        const firefly = {
          id: `large-${i}`,
          x: Math.random() * 100,
          y: Math.random() * 100,
          initialDelay: Math.random() * 15,
          duration: 15 + Math.random() * 10, // Slower, larger fireflies
          size: size * 1.5 + Math.random() * 2,
          opacity: 0.2 + Math.random() * 0.3,
        };
        
        return (
          <motion.div
            key={firefly.id}
            className="absolute rounded-full"
            style={{
              width: firefly.size,
              height: firefly.size,
              background: `radial-gradient(circle, ${glowColor} 0%, transparent 70%)`,
              filter: `blur(1px)`,
            }}
            initial={{
              x: `${firefly.x}vw`,
              y: `${firefly.y}vh`,
              opacity: 0,
              scale: 0,
            }}
            animate={{
              x: [
                `${firefly.x}vw`,
                `${(firefly.x + 15 + Math.random() * 25) % 100}vw`,
                `${(firefly.x + 8 + Math.random() * 20) % 100}vw`,
                `${firefly.x}vw`,
              ],
              y: [
                `${firefly.y}vh`,
                `${(firefly.y + 12 + Math.random() * 20) % 100}vh`,
                `${(firefly.y + 18 + Math.random() * 25) % 100}vh`,
                `${firefly.y}vh`,
              ],
              opacity: [0, firefly.opacity * opacity, firefly.opacity * opacity, 0],
              scale: [0, 1, 1.3, 0],
            }}
            transition={{
              duration: firefly.duration * speed,
              repeat: Infinity,
              delay: firefly.initialDelay,
              ease: "easeInOut",
            }}
          />
        );
      })}
    </div>
  );
};

export default FirefliesBackground;
