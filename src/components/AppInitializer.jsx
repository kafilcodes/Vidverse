'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { AnimatePresence } from 'framer-motion';
import LoadingScreen from '@/components/LoadingScreen';

export default function AppInitializer({ children }) {
  const pathname = usePathname();
  const [loading, setLoading] = useState(pathname === '/');

  useEffect(() => {
    if (loading) {
      const timer = setTimeout(() => {
        setLoading(false);
      }, 2000); // Show loading for 2 seconds
      return () => clearTimeout(timer);
    }
  }, [loading]);

  return (
    <>
      <AnimatePresence>
        {loading && <LoadingScreen />}
      </AnimatePresence>
      {!loading && children}
    </>
  );
}
