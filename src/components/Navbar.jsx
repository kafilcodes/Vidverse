'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';

const navLinks = [
  { name: 'Services', href: '#services' },
  { name: 'Benefits', href: '#benefits' },
  { name: 'Process', href: '#process' },
  { name: 'Testimonials', href: '#testimonials' },
];

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [isNavbarVisible, setIsNavbarVisible] = useState(true);
  const lastScrollY = useRef(0);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMobileMenuOpen && !event.target.closest('.mobile-menu-container')) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobileMenuOpen]);

  // Navbar visibility on scroll
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        setIsNavbarVisible(false);
      } else {
        setIsNavbarVisible(true);
      }
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Active section highlighting
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(`#${entry.target.id}`);
          }
        });
      },
      { rootMargin: '-50% 0px -50% 0px' }
    );

    const sections = navLinks.map((link) => document.querySelector(link.href));
    sections.forEach((section) => {
      if (section) observer.observe(section);
    });

    return () => {
      sections.forEach((section) => {
        if (section) observer.unobserve(section);
      });
    };
  }, []);

  const handleLinkClick = (e, href) => {
    e.preventDefault();
    const targetElement = document.querySelector(href);
    if (targetElement) {
      const navbarHeight = 80; // Approximate height of the navbar
      let offsetPosition;
      
      if (href === '#process') {
        // For process section, center it in the viewport
        const elementPosition = targetElement.getBoundingClientRect().top;
        const viewportHeight = window.innerHeight;
        const elementHeight = targetElement.offsetHeight;
        const centerOffset = (viewportHeight - elementHeight) / 2;
        offsetPosition = elementPosition + window.pageYOffset - centerOffset;
      } else {
        // For other sections, use normal offset
        const elementPosition = targetElement.getBoundingClientRect().top;
        offsetPosition = elementPosition + window.pageYOffset - navbarHeight;
      }
  
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 py-2 sm:py-3 md:py-4 px-3 sm:px-4 md:px-6 bg-transparent transition-transform duration-300 ease-in-out ${isNavbarVisible ? 'translate-y-0' : '-translate-y-full'}`}>
      <div className="container mx-auto">
        <div className="flex items-center justify-between bg-black/20 backdrop-blur-lg border border-white/10 hover:border-gold rounded-xl sm:rounded-2xl shadow-lg px-2 sm:px-3 py-1 sm:py-1.5 max-w-full sm:max-w-xl mx-auto transition-all duration-300">
          <div className="text-lg sm:text-xl md:text-2xl font-bold">
            <Link href="/" className="flex items-center">
              <Image src="/logo/vidverse.svg" alt="VidVerse Logo" width={32} height={32} className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 mr-1.5 sm:mr-2" />
              <span className="text-base sm:text-lg md:text-xl font-semibold text-shimmer">VidVerse</span>
            </Link>
          </div>

          <nav className="hidden md:flex items-center space-x-3">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleLinkClick(e, link.href)}
                className={`nav-link px-2 lg:px-3 py-1.5 text-xs lg:text-sm font-medium rounded-md transition-all duration-200 ease-in-out cursor-pointer ${activeSection === link.href ? 'text-golden bg-golden/20 font-semibold' : 'text-neutral-300 hover:text-golden'}`}>
                {link.name}
              </a>
            ))}
          </nav>

          {/* Mobile Menu */}
          <div className="md:hidden relative mobile-menu-container">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 sm:h-9 sm:w-9 bg-black/40 backdrop-blur-md border border-amber-400/20 hover:border-amber-400/40 hover:bg-black/60 transition-all duration-300 rounded-lg"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu className="h-4 w-4 sm:h-5 sm:w-5 text-amber-400" />
            </Button>
            
            {/* Animated Dropdown Menu */}
            <div className={`absolute right-0 top-full mt-2 w-48 bg-black/95 backdrop-blur-lg border border-white/20 rounded-xl shadow-xl overflow-hidden z-50 transition-all duration-300 ease-out ${
              isMobileMenuOpen 
                ? 'opacity-100 transform translate-y-0 scale-100' 
                : 'opacity-0 transform -translate-y-2 scale-95 pointer-events-none'
            }`}>
              <nav className="py-2">
                {navLinks.map((link, index) => (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={(e) => handleLinkClick(e, link.href)}
                    className={`block px-4 py-3 text-sm font-medium transition-all duration-200 hover:bg-golden/20 hover:pl-6 ${activeSection === link.href ? 'bg-golden/20 text-golden border-l-2 border-golden' : 'text-neutral-200 hover:text-golden'}`}
                    style={{
                      animationDelay: `${index * 50}ms`,
                      animation: isMobileMenuOpen ? 'slideInFromRight 0.3s ease-out forwards' : ''
                    }}
                  >
                    {link.name}
                  </a>
                ))}
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Animation Styles */}
      <style jsx>{`
        @keyframes slideInFromRight {
          0% {
            opacity: 0;
            transform: translateX(20px);
          }
          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </header>
  );
};

export default Navbar;