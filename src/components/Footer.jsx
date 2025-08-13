'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Instagram, Twitter, Linkedin, Navigation, Mail, Phone, MapPin, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

const Footer = () => {
  const socialLinks = [
    { name: 'Instagram', icon: Instagram, href: '#' },
    { name: 'Twitter', icon: Twitter, href: '#' },
    { name: 'Linkedin', icon: Linkedin, href: '#' },
  ];

  const footerNav = [
    { name: 'Services', href: '#services' },
    { name: 'Benefits', href: '#benefits' },
    { name: 'Process', href: '#process' },
    { name: 'Testimonials', href: '#testimonials' },
  ];

  return (
    <footer className="bg-black border-t border-neutral-800/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
          {/* Logo and Tagline */}
          <div className="md:col-span-1 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start space-x-2 mb-2">
              <Image 
                src="/logo/vidverse.svg" 
                alt="VidVerse Logo" 
                width={32}
                height={32}
                className="w-6 h-6 sm:w-7 sm:h-7"
              />
              <h2 className="text-lg sm:text-xl font-bold text-white">VidVerse</h2>
            </div>
            <p className="text-neutral-400 mt-1 text-xs sm:text-sm max-w-xs mx-auto sm:mx-0 leading-relaxed">
              Scaling Trust for Visionary Brands with Video Content.
            </p>
          </div>

          {/* Navigation */}
          <div className="text-center sm:text-left">
            <h3 className="text-xs sm:text-sm font-semibold text-neutral-300 tracking-wider uppercase flex items-center justify-center sm:justify-start gap-2 mb-2 sm:mb-3">
              <motion.div
                animate={{ 
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              >
                <Navigation className="w-3 h-3 sm:w-4 sm:h-4" style={{ color: '#ffcc33' }} />
              </motion.div>
              Navigation
            </h3>
            <ul className="space-y-1">
              {footerNav.map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="text-neutral-400 hover:text-golden transition-colors duration-300 text-xs sm:text-sm">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="text-center sm:text-left">
            <h3 className="text-xs sm:text-sm font-semibold text-neutral-300 tracking-wider uppercase flex items-center justify-center sm:justify-start gap-2 mb-2 sm:mb-3">
              <motion.div
                animate={{ 
                  y: [0, -5, 0],
                  scale: [1, 1.2, 1]
                }}
                transition={{ 
                  duration: 2.5,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              >
                <Mail className="w-3 h-3 sm:w-4 sm:h-4" style={{ color: '#ffcc33' }} />
              </motion.div>
              Contact Us
            </h3>
            <ul className="space-y-1 text-neutral-400 text-xs sm:text-sm">
              <li className="flex items-center justify-center sm:justify-start gap-2">
                <Mail className="w-3 h-3 flex-shrink-0" style={{ color: '#ffcc33' }} />
                <a href="mailto:contact@vidverse.com" className="hover:text-golden transition-colors duration-300 truncate">
                  contact@vidverse.com
                </a>
              </li>
              <li className="flex items-center justify-center sm:justify-start gap-2">
                <Phone className="w-3 h-3 flex-shrink-0" style={{ color: '#ffcc33' }} />
                <a href="tel:+1234567890" className="hover:text-golden transition-colors duration-300">
                  +91 6264555051
                </a>
              </li>
              <li className="pt-1 flex items-start justify-center sm:justify-start gap-2">
                <MapPin className="w-3 h-3 mt-0.5 flex-shrink-0" style={{ color: '#ffcc33' }} />
                <span className="text-center sm:text-left text-xs leading-tight">
                  Raipur, Chhattisgarh, 493773
                </span>
              </li>
            </ul>
          </div>

          {/* Socials */}
          <div className="text-center sm:text-left">
            <h3 className="text-xs sm:text-sm font-semibold text-neutral-300 tracking-wider uppercase mb-2 sm:mb-3">Follow Us</h3>
            <div className="flex justify-center sm:justify-start space-x-3">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={social.name}
                  href={social.href}
                  className="transition-all duration-300"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ 
                    scale: 1.2,
                    rotate: 360
                  }}
                  animate={{
                    y: [0, -5, 0]
                  }}
                  transition={{
                    y: {
                      duration: 2,
                      repeat: Infinity,
                      delay: index * 0.5
                    },
                    hover: {
                      duration: 0.3
                    }
                  }}
                  style={{ color: '#ffcc33' }}
                >
                  <span className="sr-only">{social.name}</span>
                  <social.icon className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
                </motion.a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-neutral-800/50 flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
          <p className="text-xs text-neutral-500 text-center sm:text-left">&copy; {new Date().getFullYear()} VidVerse. All rights reserved.</p>
          <div className="flex flex-col sm:flex-row items-center space-y-1 sm:space-y-0 sm:space-x-4">
             <div className="text-xs text-neutral-500 text-center">
               <span>Built with 💖 by </span>
               <a 
                 href="https://github.com/kafilcodes" 
                 target="_blank" 
                 rel="noopener noreferrer" 
                 className="text-golden hover:text-white transition-colors duration-300 font-semibold"
               >
                 Kafilcodes
               </a>
             </div>
             <div className="text-xs">
               <Link href="/admin" className="text-neutral-600 hover:text-neutral-400 transition-opacity duration-300 flex items-center gap-1">
                 <Shield className="w-3 h-3 text-neutral-700" />
                 Admin
               </Link>
             </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;