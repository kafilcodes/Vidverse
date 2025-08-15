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
    <footer className="relative bg-black border-t border-neutral-800/50 overflow-hidden">
      
      {/* Grain Background - Same as Newsletter */}
      <div className="absolute inset-0 z-[-1]">
        <Image
          src="/bg-icons/67417cccd10005101c0c23e5_grain.png"
          fill
          className="object-cover w-full h-full opacity-100"
          alt=""
          priority={false}
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 md:py-6 relative z-10">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 md:gap-6">
          {/* Logo and Tagline */}
          <div className="md:col-span-1 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start space-x-2 mb-1 sm:mb-2">
              <Image 
                src="/logo/vidverse.svg" 
                alt="VidVerse Logo" 
                width={32}
                height={32}
                className="w-5 h-5 sm:w-6 sm:h-6"
              />
              <h2 className="text-base sm:text-lg font-bold text-white">VidVerse</h2>
            </div>
            <p className="text-neutral-400 mt-1 text-xs max-w-xs mx-auto sm:mx-0 leading-tight">
              Scaling Trust for Visionary Brands with Video Content.
            </p>
          </div>

          {/* Navigation */}
          <div className="text-center sm:text-left">
            <h3 className="text-xs font-semibold text-neutral-300 tracking-wider uppercase flex items-center justify-center sm:justify-start gap-1 mb-1 sm:mb-2">
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
                <Navigation className="w-3 h-3" style={{ color: '#ffcc33' }} />
              </motion.div>
              Navigation
            </h3>
            <ul className="space-y-0.5">
              {footerNav.map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="text-neutral-400 hover:text-golden transition-colors duration-300 text-xs">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="text-center sm:text-left">
            <h3 className="text-xs font-semibold text-neutral-300 tracking-wider uppercase flex items-center justify-center sm:justify-start gap-1 mb-1 sm:mb-2">
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
                <Mail className="w-3 h-3" style={{ color: '#ffcc33' }} />
              </motion.div>
              Contact Us
            </h3>
            <ul className="space-y-0.5 text-neutral-400 text-xs">
              <li className="flex items-center justify-center sm:justify-start gap-1">
                <Mail className="w-3 h-3 flex-shrink-0" style={{ color: '#ffcc33' }} />
                <a href="mailto:contact@vidverse.com" className="hover:text-golden transition-colors duration-300 truncate">
                  contact@vidverse.com
                </a>
              </li>
              <li className="flex items-center justify-center sm:justify-start gap-1">
                <Phone className="w-3 h-3 flex-shrink-0" style={{ color: '#ffcc33' }} />
                <a href="tel:+1234567890" className="hover:text-golden transition-colors duration-300">
                  +91 6264555051
                </a>
              </li>
              <li className="flex items-start justify-center sm:justify-start gap-1">
                <MapPin className="w-3 h-3 mt-0.5 flex-shrink-0" style={{ color: '#ffcc33' }} />
                <span className="text-center sm:text-left text-xs leading-tight">
                  Raipur, Chhattisgarh
                </span>
              </li>
            </ul>
          </div>

          {/* Socials */}
          <div className="text-center sm:text-left">
            <h3 className="text-xs font-semibold text-neutral-300 tracking-wider uppercase mb-1 sm:mb-2">Follow Us</h3>
            <div className="flex justify-center sm:justify-start space-x-2">
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

        <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-neutral-800/50 flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
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