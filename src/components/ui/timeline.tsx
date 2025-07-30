"use client";
import {
  useMotionValueEvent,
  useScroll,
  useTransform,
  motion,
} from "framer-motion";
import React, { useEffect, useRef, useState } from "react";

interface TimelineEntry {
  title: string;
  content: React.ReactNode;
  icon?: React.ComponentType<any>;
}

export const Timeline = ({ data }: { data: TimelineEntry[] }) => {
  const ref = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setWidth(rect.width);
    }
  }, [ref]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 10%", "end 50%"],
  });

  const widthTransform = useTransform(scrollYProgress, [0, 1], [0, width]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

  return (
    <div
      className="w-full bg-black font-sans"
      ref={containerRef}
    >
      <div ref={ref} className="relative max-w-7xl mx-auto pb-20">
        {/* Horizontal Timeline Container */}
        <div className="flex justify-between items-start relative">
          {/* Horizontal Line */}
          <div className="absolute top-8 left-12 right-12 h-0.5 bg-neutral-800 rounded-full z-10"></div>
          
          {/* Animated Progress Line */}
          <motion.div
            style={{
              width: widthTransform,
              opacity: opacityTransform,
            }}
            className="absolute top-8 left-12 h-0.5 bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 rounded-full origin-left z-20"
          />

          {/* Timeline Items */}
          {data.map((item, index) => (
            <motion.div
              key={index}
              className="flex flex-col items-center relative z-30"
              initial={{ opacity: 0, y: 20, scale: 0.8 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ 
                duration: 0.5, 
                delay: 0.2 + index * 0.3, 
                type: "spring", 
                stiffness: 200 
              }}
            >
              {/* Icon Circle */}
              <motion.div
                className="w-12 h-12 border-2 border-amber-400/50 bg-neutral-900/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg shadow-amber-400/20 relative z-40"
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
                  delay: 0.5 + index * 0.3
                }}
              >
                {item.icon && <item.icon className="w-6 h-6 text-amber-400" strokeWidth={2} />}
              </motion.div>

              {/* Title Badge */}
              <div className="border border-amber-400/30 bg-neutral-900/60 backdrop-blur-sm text-amber-400 px-3 py-1 rounded-full font-medium text-xs whitespace-nowrap shadow-sm mt-4 z-30">
                {item.title}
              </div>

              {/* Content */}
              <div className="text-neutral-500 text-xs mt-3 text-center max-w-32 leading-relaxed">
                {item.content}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
