'use client';

import React from 'react';

const SectionBoundary = ({ 
  sectionName, 
  children, 
  className = '',
  style = {} 
}) => {
  return (
    <section 
      className={`relative w-full ${className}`}
      style={{
        width: '100%',
        position: 'relative',
        ...style
      }}
      data-section={sectionName}
    >
      {/* Section Content */}
      <div className="relative w-full" style={{ zIndex: 1 }}>
        {children}
      </div>
    </section>
  );
};

export default SectionBoundary;
