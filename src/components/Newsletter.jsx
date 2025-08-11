'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, CheckCircle, AlertCircle, Loader, AlertTriangle } from 'lucide-react';
import { db } from '@/firebase/config';
import { ref, set, push, query, orderByChild, equalTo, get } from 'firebase/database';
import SectionChip from '@/components/ui/section-chip';
import LightRays from '@/blocks/Backgrounds/LightRays/LightRays';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle, loading, success, error, info
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setStatus('error');
      setMessage('Please enter a valid email address.');
      setTimeout(() => setStatus('idle'), 3000);
      return;
    }

    setStatus('loading');
    setMessage('');

    // Check if Firebase is properly configured
    if (!db) {
      setStatus('error');
      setMessage('Newsletter service is temporarily unavailable. Please try again later.');
      setTimeout(() => setStatus('idle'), 4000);
      return;
    }

    try {
      // 1. Check if email already exists
      const subscribersRef = ref(db, 'subscribers');
      const emailQuery = query(subscribersRef, orderByChild('email'), equalTo(email));
      const snapshot = await get(emailQuery);

      if (snapshot.exists()) {
        setStatus('info');
        setMessage('You are already on the list! 😉');
        setTimeout(() => setStatus('idle'), 4000);
        return;
      }

      // 2. If not, add the new subscriber
      const newSubscriberRef = push(subscribersRef);
      await set(newSubscriberRef, {
        email: email,
        subscribedAt: new Date().toISOString(),
      });

      setStatus('success');
      setMessage('Thank you for subscribing! You are on the list.');
      setEmail('');
    } catch (error) {
      console.error('Firebase Error:', error);
      setStatus('error');
      setMessage('Something went wrong. Please try again later.');
    }

    setTimeout(() => {
      setStatus('idle');
      setMessage('');
    }, 4000);
  };

  return (
    <section id="newsletter" className="relative py-16 md:py-24 bg-transparent overflow-hidden">

      {/* Background Image */}
      <div className="absolute inset-0 z-[-3]">
        <Image
          src="/bg-icons/image.png"
          fill
          className="object-cover w-full h-full"
          alt=""
          priority={false}
        />
      </div>

      {/* Clean section - you can add bg icons manually here later */}

      <div className="absolute inset-0 pointer-events-none z-[-1]">

        {/* BG ICONS HERO SECTION - Large SVG */}
        <Image
          src="/bg-icons/674182bc8e24b82a86a39cf5_elipse-on-white.svg"
          width={700}
          height={700}

          className="absolute center-50 -left-95 opacity-50 scale-130 hidden md:block"
          alt=""
          priority={false}
        />
        <Image
          src="/bg-icons/6741825e22e3b1a9fcca38cf_rectangle-on-white.svg"
          width={700}
          height={700}

          className="absolute center-50 -right-95 opacity-50 scale-130 hidden md:block"
          alt=""
          priority={false}
        />
      </div>
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="relative max-w-3xl mx-auto newsletter-premium rounded-2xl p-8 md:p-12 text-center overflow-hidden"
        >
          {/* LightRays Background */}
          <div className="absolute inset-0 opacity-40">
            <LightRays
              raysOrigin="top-center"
              raysColor="#F4D03F"
              raysSpeed={3}
              lightSpread={2}
              rayLength={3}
              followMouse={true}
              mouseInfluence={0.5}
              noiseAmount={0.5}
              distortion={0.03}
              pulsating={false}
              fadeDistance={2}
              saturation={1.0}
              className="w-full h-full"
            />
          </div>

          {/* Content */}
          <div className="relative z-10">
            <div className="inline-block mb-4">
              <SectionChip title="Newsletter" icon={Mail} />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Want to know{' '}
              <span className="relative inline-block">
                <span className="bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 bg-clip-text text-transparent">
                  how we do it?
                </span>
                <motion.div
                  className="absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 rounded-full"
                  initial={{ width: 0 }}
                  whileInView={{ width: '100%' }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 0.5 }}
                />
              </span>
            </h2>
            <p className="text-neutral-400 mb-8 max-w-md mx-auto">
              Join our free list of guides, templates & insights. No spam, just value.
            </p>

            <form onSubmit={handleSubmit} className="max-w-md mx-auto">
              <div className="relative flex items-center">
                <Mail className="absolute left-4 w-5 h-5 text-neutral-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@company.com"
                  className="w-full pl-12 pr-32 py-3 bg-neutral-950/50 border border-neutral-700 rounded-full text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-amber-400/50 transition-shadow duration-300"
                  disabled={status === 'loading'}
                />
                <button
                  type="submit"
                  className="absolute right-1 top-1 bottom-1 px-6 bg-golden-gradient text-black font-semibold rounded-full hover:shadow-lg hover:shadow-amber-500/20 transition-shadow duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={status === 'loading'}
                >
                  {status === 'loading' ? (
                    <Loader className="animate-spin w-5 h-5" />
                  ) : (
                    'Subscribe'
                  )}
                </button>
              </div>
            </form>

            {status !== 'idle' && message && (
              <motion.div
                key={status}
                initial={{ opacity: 0, y: 20, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.9 }}
                transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                className={`mt-6 flex items-center justify-center gap-3 px-4 py-3 rounded-xl bg-transparent backdrop-blur-sm border border-white/10
                  ${status === 'success' ? 'text-green-400' : ''}
                  ${status === 'error' ? 'text-red-400' : ''}
                  ${status === 'info' ? 'text-amber-400' : ''}
                `}
              >
                <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 400, damping: 15, delay: 0.1 }}>
                  {status === 'success' && <CheckCircle className="w-7 h-7" />}
                  {status === 'error' && <AlertTriangle className="w-7 h-7" />}
                  {status === 'info' && <CheckCircle className="w-7 h-7" />}
                </motion.div>
                <span className="text-base md:text-lg font-semibold tracking-tight">{message}</span>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Newsletter;
