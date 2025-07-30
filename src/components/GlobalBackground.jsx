'use client';

import React from 'react';
import FirefliesBackground from '@/components/FirefliesBackground';

/**
 * GlobalBackground - A comprehensive background system for all sections
 * Features:
 * - AMOLED black background
 * - Fireflies animation layer
 * - Future-ready for graphics/icons overlay
 * - Live editor compatible (won't interfere with editing tools)
 */
const GlobalBackground = ({ 
  children, 
  excludeFireflies = false,
  className = "",
  style = {},
  ...props 
}) => {
  return (
    <div 
      className={`relative min-h-screen bg-black ${className}`}
      style={style}
      {...props}
    >
      {/* AMOLED Black Base Background */}
      <div className="absolute inset-0 bg-black z-0" />
      
      {/* Fireflies Animation Layer (z-1) */}
      {!excludeFireflies && (
        <div className="absolute inset-0 z-[1] pointer-events-none">
          <FirefliesBackground 
            count={25} 
            speed={0.3} 
            size={2.5} 
            opacity={0.8}
            excludeFooter={false} // This is handled per-section now
          />
        </div>
      )}
      
      {/* Future Graphics/Icons Layer (z-2) */}
      <div className="absolute inset-0 z-[2] pointer-events-none" id="graphics-layer">
        {/* Reserved for future graphics and icons */}
      </div>
      
      {/* Content Layer (z-10) - Above all background layers */}
      <div className="relative z-10">
        {children}
      </div>
      
      {/* Live Editor Layer (z-50) - Highest priority, won't be affected by backgrounds */}
      <div className="relative z-50 pointer-events-none" id="live-editor-layer">
        {/* Reserved for live editor tools and overlays */}
      </div>
    </div>
  );
};

export default GlobalBackground;
