'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';

const SectionBoundaryOverlay = ({ isVisible }) => {
  const [sections, setSections] = useState([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isVisible || !mounted) return;

    const detectSections = () => {
      const sectionElements = document.querySelectorAll('[data-section]');
      const detectedSections = [];

      sectionElements.forEach((element) => {
        const rect = element.getBoundingClientRect();
        const sectionName = element.getAttribute('data-section');
        
        if (rect.height > 0) { // Only include visible sections
          detectedSections.push({
            name: sectionName,
            top: rect.top + window.scrollY,
            left: 0, // Force full width from left edge
            width: window.innerWidth, // Use full viewport width
            height: rect.height,
            rect: rect
          });
        }
      });

      setSections(detectedSections);
    };

    // Initial detection
    detectSections();

    // Re-detect on scroll and resize
    const handleUpdate = () => detectSections();
    
    window.addEventListener('scroll', handleUpdate);
    window.addEventListener('resize', handleUpdate);

    return () => {
      window.removeEventListener('scroll', handleUpdate);
      window.removeEventListener('resize', handleUpdate);
    };
  }, [isVisible, mounted]);

  if (!isVisible || !mounted) return null;

  // Use portal to render at body level to escape container constraints
  return createPortal(
    <AnimatePresence>
      {isVisible && (
        <div 
          className="fixed inset-0 pointer-events-none"
          style={{ 
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            zIndex: 999999
          }}
        >
          {sections.map((section, index) => (
            <motion.div
              key={`${section.name}-${index}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute"
              style={{
                top: section.top,
                left: 0, // Full width from edge
                width: '100vw', // Full viewport width
                height: section.height,
                borderTop: '2px dashed rgba(0, 255, 255, 0.8)', // KEEP horizontal top boundary
                borderBottom: '2px dashed rgba(0, 255, 255, 0.8)', // KEEP horizontal bottom boundary
                // REMOVED: borderLeft and borderRight (vertical boundaries)
                backgroundColor: 'rgba(0, 255, 255, 0.03)', // Very light background
                boxShadow: 'inset 0 2px 0 rgba(0, 255, 255, 0.3), inset 0 -2px 0 rgba(0, 255, 255, 0.3)', // Only horizontal shadows
              }}
            >
              {/* Section Label */}
              <div
                className="absolute top-2 left-4 px-3 py-1 text-sm font-bold text-black bg-cyan-400/90 backdrop-blur-sm rounded border border-cyan-500"
                style={{
                  fontFamily: 'monospace',
                  textShadow: '0 1px 2px rgba(0,0,0,0.5)'
                }}
              >
                {section.name.toUpperCase()}
              </div>

              {/* Only horizontal boundary indicators */}
              <div className="absolute top-0 left-1/2 w-12 h-6 border-t-4 border-cyan-400 bg-cyan-400/20 -translate-x-1/2" />
              <div className="absolute bottom-0 left-1/2 w-12 h-6 border-b-4 border-cyan-400 bg-cyan-400/20 -translate-x-1/2" />
            </motion.div>
          ))}
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default SectionBoundaryOverlay;
