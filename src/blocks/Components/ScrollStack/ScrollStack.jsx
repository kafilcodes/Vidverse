/*
	Modified ScrollStack for normal page scroll integration
*/

import { useLayoutEffect, useRef, useCallback } from "react";

export const ScrollStackItem = ({ children, itemClassName = "", style = {} }) => (
  <div
    className={`scroll-stack-card relative w-full my-4 p-6 rounded-2xl shadow-[0_0_20px_rgba(0,0,0,0.1)] box-border origin-top will-change-transform ${itemClassName}`.trim()}
    style={{
      height: '400px',
      backfaceVisibility: 'hidden',
      transformStyle: 'preserve-3d',
      ...style
    }}
  >
    {children}
  </div>
);

const ScrollStack = ({
  children,
  className = "",
  itemDistance = 100,
  itemScale = 0.03,
  itemStackDistance = 30,
  stackPosition = "20%",
  scaleEndPosition = "10%",
  baseScale = 0.85,
  rotationAmount = 0,
  blurAmount = 0,
  onStackComplete,
}) => {
  const containerRef = useRef(null);
  const cardsRef = useRef([]);
  const lastTransformsRef = useRef(new Map());
  const isUpdatingRef = useRef(false);

  const calculateProgress = useCallback((scrollTop, start, end) => {
    if (scrollTop < start) return 0;
    if (scrollTop > end) return 1;
    return (scrollTop - start) / (end - start);
  }, []);

  const parsePercentage = useCallback((value, containerHeight) => {
    if (typeof value === 'string' && value.includes('%')) {
      return (parseFloat(value) / 100) * containerHeight;
    }
    return parseFloat(value);
  }, []);

  const updateCardTransforms = useCallback(() => {
    const container = containerRef.current;
    if (!container || !cardsRef.current.length || isUpdatingRef.current) return;

    isUpdatingRef.current = true;

    // Use window scroll with smooth calculations
    const scrollTop = window.pageYOffset;
    const windowHeight = window.innerHeight;
    const containerRect = container.getBoundingClientRect();
    const containerTop = containerRect.top + scrollTop;
    
    const stackPositionPx = parsePercentage(stackPosition, windowHeight);
    const scaleEndPositionPx = parsePercentage(scaleEndPosition, windowHeight);

    cardsRef.current.forEach((card, i) => {
      if (!card) return;

      const cardRect = card.getBoundingClientRect();
      const cardTop = cardRect.top + scrollTop;
      
      const triggerStart = cardTop - windowHeight + stackPositionPx + (itemStackDistance * i);
      const triggerEnd = cardTop - scaleEndPositionPx;
      const pinStart = cardTop - windowHeight + stackPositionPx + (itemStackDistance * i);
      const pinEnd = containerTop + container.offsetHeight - windowHeight / 2;

      // Smooth progress calculation with easing
      const rawProgress = calculateProgress(scrollTop, triggerStart, triggerEnd);
      const scaleProgress = rawProgress; // Linear for smoothness
      const targetScale = baseScale + (i * itemScale);
      const scale = 1 - scaleProgress * (1 - targetScale);
      
      // Smooth blur calculation
      let blur = 0;
      if (blurAmount && i > 0) {
        const blurProgress = Math.max(0, Math.min(1, (scrollTop - triggerStart) / (triggerEnd - triggerStart)));
        blur = blurProgress * blurAmount * (i * 0.5);
      }

      let translateY = 0;
      const isPinned = scrollTop >= pinStart && scrollTop <= pinEnd;
      
      if (isPinned) {
        translateY = scrollTop - cardTop + windowHeight - stackPositionPx - (itemStackDistance * i);
      } else if (scrollTop > pinEnd) {
        translateY = pinEnd - cardTop + windowHeight - stackPositionPx - (itemStackDistance * i);
      }

      // Smooth transform application
      const newTransform = {
        translateY: Math.round(translateY * 100) / 100,
        scale: Math.round(scale * 1000) / 1000,
        rotation: 0,
        blur: Math.round(blur * 100) / 100
      };

      const lastTransform = lastTransformsRef.current.get(i);
      const hasChanged = !lastTransform || 
        Math.abs(lastTransform.translateY - newTransform.translateY) > 0.5 ||
        Math.abs(lastTransform.scale - newTransform.scale) > 0.002 ||
        Math.abs(lastTransform.blur - newTransform.blur) > 0.05;

      if (hasChanged) {
        const transform = `translate3d(0, ${newTransform.translateY}px, 0) scale(${newTransform.scale})`;
        const filter = newTransform.blur > 0 ? `blur(${newTransform.blur}px)` : '';

        // Apply smooth transitions
        card.style.transition = 'transform 0.1s ease-out, filter 0.1s ease-out';
        card.style.transform = transform;
        card.style.filter = filter;
        
        lastTransformsRef.current.set(i, newTransform);
      }
    });

    isUpdatingRef.current = false;
  }, [
    itemScale,
    itemStackDistance,
    stackPosition,
    scaleEndPosition,
    baseScale,
    blurAmount,
    calculateProgress,
    parsePercentage,
  ]);

  const handleScroll = useCallback(() => {
    updateCardTransforms();
  }, [updateCardTransforms]);

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const cards = Array.from(container.querySelectorAll(".scroll-stack-card"));
    cardsRef.current = cards;

    cards.forEach((card, i) => {
      if (i < cards.length - 1) {
        card.style.marginBottom = `${itemDistance}px`;
      }
      card.style.willChange = 'transform, filter';
      card.style.transformOrigin = 'top center';
      card.style.backfaceVisibility = 'hidden';
      card.style.transform = 'translateZ(0) rotate(0deg)';
      card.style.perspective = '1000px';
    });

    // Listen to window scroll instead of container scroll
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', updateCardTransforms, { passive: true });

    updateCardTransforms();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', updateCardTransforms);
      cardsRef.current = [];
      lastTransformsRef.current.clear();
      isUpdatingRef.current = false;
    };
  }, [
    itemDistance,
    itemScale,
    itemStackDistance,
    stackPosition,
    scaleEndPosition,
    baseScale,
    rotationAmount,
    blurAmount,
    handleScroll,
    updateCardTransforms,
  ]);

  return (
    <div
      className={`relative w-full ${className}`.trim()}
      ref={containerRef}
      style={{ 
        minHeight: '200vh',
        paddingTop: '15vh',
        paddingBottom: '15vh'
      }}
    >
      <div className="scroll-stack-inner px-8">
        {children}
      </div>
    </div>
  );
};

export default ScrollStack;