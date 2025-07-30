'use client';

import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { motion } from 'framer-motion';
import { HelpCircle } from 'lucide-react';
import SectionChip from '@/components/ui/section-chip';
import { MessageCircle, ArrowRight, Plus, Minus } from 'lucide-react';

const faqs = [
  {
    question: 'What types of businesses do you work with?',
    answer: 'We work with entrepreneurs, startups, and venture capital firms across various industries who are looking to build organic content engines that drive growth and establish authority in their niche.'
  },
  {
    question: 'How long does it take to see results from your content strategy?',
    answer: 'While initial engagement improvements can be seen within the first month, meaningful organic growth typically begins after 2-3 months of consistent content distribution. Our strategies are designed for long-term sustainable growth rather than short-term spikes.'
  },
  {
    question: 'What platforms do you create content for?',
    answer: 'We create content optimized for all major platforms including YouTube, Instagram, TikTok, LinkedIn, Twitter, and podcast networks. Our approach is to repurpose core content across multiple platforms to maximize reach and engagement.'
  },
  {
    question: 'How much time will I need to invest in the content creation process?',
    answer: 'Our goal is to minimize your time investment while maximizing results. Typically, clients spend about 1-2 hours per month on strategy calls and providing initial content direction. Our team handles the rest of the production and distribution process.'
  },
  {
    question: 'What makes your approach different from other content agencies?',
    answer: 'Unlike traditional agencies that focus on one-off campaigns, we build systematic content engines that consistently produce results over time. We combine data-driven strategies, high-quality production, and multi-platform distribution to create sustainable organic growth.'
  },
  {
    question: 'How do you measure success and ROI?',
    answer: 'We track key metrics including engagement rates, audience growth, content performance, lead generation, and conversion rates. We provide regular reports that show the direct impact of our content strategy on your business goals and ROI.'
  }
];

const FAQ = () => {
  return (
    <section id="faq" className="py-20 px-4 md:px-0 relative overflow-hidden bg-black/30 backdrop-blur-sm border-t border-gold/20">
      {/* Background elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-40 left-20 w-72 h-72 rounded-full bg-primary/5 blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-20 right-20 w-64 h-64 rounded-full bg-gold/10 blur-3xl animate-pulse-slow"></div>
        <div className="absolute top-1/2 left-1/3 w-48 h-48 rounded-full bg-gold/5 blur-2xl"></div>
        <div className="absolute top-1/4 right-1/4 w-32 h-32 rounded-full bg-gold/10 blur-xl animate-float"></div>
        <div className="absolute bottom-1/3 left-1/4 w-24 h-24 rounded-full bg-gold/5 blur-lg animate-float-slow"></div>
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[url('/images/grid.svg')] bg-repeat opacity-5"></div>
      </div>
      
      <div className="container mx-auto relative z-10">
        <motion.div 
          className="text-center mb-16 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex justify-center mb-4">
            <SectionChip title="FAQ" icon={HelpCircle} />
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            <span className="relative inline-block mr-2">
              <span className="absolute inset-0 bg-gold/10 rounded-lg blur-sm"></span>
              <span className="relative">VidVerse</span>
            </span>
            <span className="relative">Frequently Asked</span> <span className="relative inline-block">
              <span className="absolute inset-0 bg-gradient-to-r from-gold to-amber-500 rounded-lg"></span>
              <span className="relative px-3 py-1 text-black">Questions</span>
            </span>
          </h2>
          <p className="text-xl text-muted-foreground">
            Get answers to common questions about our <span className="text-gold font-medium">content creation services</span> and approach.
            <span className="block mt-2 text-sm opacity-80">Can&apos;t find what you&apos;re looking for? <span className="text-gold underline cursor-pointer">Contact us directly</span></span>
          </p>
        </motion.div>

        <motion.div 
          className="max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 * index }}
              >
                <AccordionItem value={`item-${index}`} className="glass-effect border border-gold/20 rounded-xl overflow-hidden shadow-lg shadow-gold/5 hover:shadow-gold/10 transition-all duration-300 bg-black/20 hover:bg-black/30 group">
                  <AccordionTrigger 
                    className="px-6 py-5 text-left font-medium hover:text-gold transition-colors data-[state=open]:text-gold"
                  >
                    <div className="flex items-center">
                      <span className="inline-flex items-center justify-center w-6 h-6 bg-black/30 rounded-full mr-3 border border-gold/30 group-hover:border-gold/50 transition-all duration-300 group-hover:scale-110">
                        <Plus className="h-3 w-3 text-gold group-data-[state=open]:hidden" />
                        <Minus className="h-3 w-3 text-gold hidden group-data-[state=open]:block" />
                      </span>
                      <span className="group-hover:translate-x-1 transition-transform duration-300">{faq.question}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-6 pt-2 text-muted-foreground bg-black/10 border-t border-gold/10 data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up">
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="pt-2"
                    >
                      {faq.answer}
                    </motion.div>
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </motion.div>

        <motion.div 
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <div className="max-w-md mx-auto p-8 border border-gold/20 rounded-xl bg-black/30 backdrop-blur-sm shadow-lg shadow-gold/5 hover:shadow-gold/20 transition-all duration-300 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-gold/5 -z-10 group-hover:bg-gold/10 transition-colors duration-500 blur-xl"></div>
            <div className="absolute -bottom-20 -left-20 w-40 h-40 rounded-full bg-gold/5 -z-10 group-hover:bg-gold/10 transition-colors duration-500 blur-xl"></div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center border border-gold/30">
                <MessageCircle className="h-5 w-5 text-gold" />
              </div>
              <p className="text-xl font-medium">Still have questions?</p>
            </div>
            <p className="text-lg mb-6 text-muted-foreground">Our <span className="text-gold font-medium">VidVerse</span> team is ready to help you with any questions about our content creation services. We typically respond within 24 hours.</p>
            <motion.button 
              className="px-6 py-3 bg-gradient-to-r from-gold to-amber-500 text-black font-medium rounded-lg hover:bg-gold/90 transition-colors shadow-lg shadow-gold/20 border border-gold/30 flex items-center gap-2 group-hover:translate-y-[-2px] transition-transform duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              Contact us now <ArrowRight className="h-4 w-4" />
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQ;