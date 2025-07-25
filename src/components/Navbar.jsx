'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, X } from 'lucide-react';

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
    <header className={`fixed top-0 left-0 right-0 z-50 py-4 px-4 md:px-6 bg-transparent transition-transform duration-300 ease-in-out ${isNavbarVisible ? 'translate-y-0' : '-translate-y-full'}`}>
      <div className="container mx-auto">
        <div className="flex items-center justify-between bg-black/20 backdrop-blur-lg border border-white/10 hover:border-gold rounded-2xl shadow-lg px-3 py-1.5 max-w-xl mx-auto transition-all duration-300">
          <div className="text-2xl font-bold">
            <Link href="/" className="flex items-center">
              <Image src="/logo/vidverse-icon.png" alt="VidVerse Logo" width={32} height={32} className="h-8 w-8 mr-2" />
              <span className="text-xl font-semibold text-shimmer">VidVerse</span>
            </Link>
          </div>

          <nav className="hidden md:flex items-center space-x-3">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleLinkClick(e, link.href)}
                className={`nav-link px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200 ease-in-out cursor-pointer ${activeSection === link.href ? 'text-golden bg-golden/20 font-semibold' : 'text-neutral-300 hover:text-golden'}`}>
                {link.name}
              </a>
            ))}
          </nav>

          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="hover:bg-muted/20">
                <Menu className="h-6 w-6 text-secondary-foreground" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full max-w-xs bg-card p-6">
              <div className="flex flex-col h-full">
                <div className="flex justify-between items-center mb-8">
                  <div className="text-2xl font-bold">
                    <div className="flex items-center">
                      <Image src="/logo/vidverse-icon.png" alt="VidVerse Logo" width={32} height={32} className="h-8 w-8 mr-2" />
                      <span className="text-xl font-semibold text-shimmer">VidVerse</span>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)}>
                    <X className="h-6 w-6" />
                  </Button>
                </div>
                
                <nav className="flex flex-col space-y-4">
                  {navLinks.map((link) => (
                    <a
                      key={link.name}
                      href={link.href}
                      onClick={(e) => handleLinkClick(e, link.href)}
                      className={`block w-full text-left px-4 py-3 rounded-lg text-lg font-medium transition-colors duration-200 ${activeSection === link.href ? 'bg-golden/20 text-golden' : 'text-neutral-200 hover:bg-neutral-700/50'}`}>
                      {link.name}
                    </a>
                  ))}
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Navbar;