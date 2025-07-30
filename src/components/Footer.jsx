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
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Tagline */}
          <div className="md:col-span-1">
            <div className="flex items-center space-x-3 mb-3">
              <Image 
                src="/logo/vidverse-icon.png" 
                alt="VidVerse Logo" 
                width={32}
                height={32}
                className="w-8 h-8"
              />
              <h2 className="text-2xl font-bold text-white">VidVerse</h2>
            </div>
            <p className="text-neutral-400 mt-2 text-sm max-w-xs">
              Scaling Trust for Visionary Brands with Video Content.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-sm font-semibold text-neutral-300 tracking-wider uppercase flex items-center gap-2">
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
                <Navigation className="w-4 h-4" style={{ color: '#ffcc33' }} />
              </motion.div>
              Navigation
            </h3>
            <ul className="mt-4 space-y-2">
              {footerNav.map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="text-neutral-400 hover:text-golden transition-colors duration-300">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold text-neutral-300 tracking-wider uppercase flex items-center gap-2">
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
                <Mail className="w-4 h-4" style={{ color: '#ffcc33' }} />
              </motion.div>
              Contact Us
            </h3>
            <ul className="mt-4 space-y-2 text-neutral-400">
              <li className="flex items-center gap-2">
                <Mail className="w-3 h-3" style={{ color: '#ffcc33' }} />
                <a href="mailto:contact@vidverse.com" className="hover:text-golden transition-colors duration-300">
                  contact@vidverse.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-3 h-3" style={{ color: '#ffcc33' }} />
                <a href="tel:+1234567890" className="hover:text-golden transition-colors duration-300">
                  +1 (234) 567-890
                </a>
              </li>
              <li className="pt-2 flex items-start gap-2">
                <MapPin className="w-3 h-3 mt-1" style={{ color: '#ffcc33' }} />
                <span>
                  123 Visionary Lane, <br />
                  Creative City, 10001
                </span>
              </li>
            </ul>
          </div>

          {/* Socials */}
          <div>
            <h3 className="text-sm font-semibold text-neutral-300 tracking-wider uppercase">Follow Us</h3>
            <div className="flex mt-4 space-x-4">
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
                  <social.icon className="h-6 w-6" aria-hidden="true" />
                </motion.a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-neutral-800/50 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-sm text-neutral-500">&copy; {new Date().getFullYear()} VidVerse. All rights reserved.</p>
          <div className="flex items-center space-x-4 mt-4 sm:mt-0">
             <div className="text-sm text-neutral-500">
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
             <div className="text-sm">
               <Link href="/admin" className="text-neutral-600 hover:text-neutral-400 transition-opacity duration-300 flex items-center gap-1">
                 <Shield className="w-4 h-4 text-neutral-700" />
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