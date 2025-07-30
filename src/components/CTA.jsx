'use client';

import React from 'react';
// Removed Button from here as we'll use a standard HTML button or a very basic one for now.
// If a specific UI button is needed later, it can be re-imported.

const CTA = () => {
  return (
    <section id="cta" className="py-16 md:py-24 bg-transparent">
      <div className="container mx-auto px-4 text-center">
        <div className="flex justify-center mb-4">
          <span className="px-3 py-1 text-xs font-semibold tracking-wider uppercase rounded-full bg-golden-gradient text-black">
            CTA
          </span>
        </div>
        <h2 
          className="text-3xl md:text-4xl font-semibold text-foreground mb-4 md:mb-6"
          data-editable="true"
          data-element-id="cta-heading"
        >
          Ready to get started?
        </h2>
        <p 
          className="text-lg md:text-xl text-secondary-foreground mb-8 md:mb-10 max-w-xl mx-auto"
          data-editable="true"
          data-element-id="cta-description"
        >
          Book a call with our team to learn more about how ContentFloww can help you achieve your content goals.
        </p>
        <button
          onClick={() => {
            const bookingSection = document.getElementById('booking-form');
            if (bookingSection) {
              bookingSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
              });
              // Focus on the first form input after scroll
              setTimeout(() => {
                const firstInput = bookingSection.querySelector('input, select, textarea');
                if (firstInput) {
                  firstInput.focus();
                }
              }, 1000);
            }
          }}
          className="bg-gradient-gold text-text-on-accent hover:brightness-110 font-semibold rounded-lg px-8 py-4 md:px-10 md:py-5 text-base md:text-lg shadow-md hover:shadow-lg transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-gold focus:ring-opacity-50"
        >
          Book a Call
        </button>
      </div>
    </section>
  );
};

export default CTA;