'use client';

import React from 'react';
import { Chip } from '@material-tailwind/react';
import { motion } from 'framer-motion';

/**
 * SectionChip - A reusable chip component for section headers
 * Features:
 * - Golden gradient outline design
 * - AMOLED black theme compatible
 * - Icon support with Lucide React icons
 * - Smooth animations
 * - Material Tailwind integration
 */
const SectionChip = ({ 
  title, 
  icon: Icon, 
  className = "",
  animate = true,
  size = "sm" // Changed default to sm for smaller size
}) => {
  const chipContent = (
    <div className={`inline-block ${className}`}>
      {/* Filled Golden Gradient Design */}
      <div className="px-3 py-1 text-xs font-semibold tracking-wider uppercase rounded-full bg-golden-gradient text-black flex items-center gap-2">
        {Icon && (
          <Icon className="h-3 w-3 text-black" />
        )}
        <span className="text-black font-grift">
          {title}
        </span>
      </div>
    </div>
  );

  if (animate) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="inline-block"
      >
        {chipContent}
      </motion.div>
    );
  }

  return chipContent;
};

export default SectionChip;
