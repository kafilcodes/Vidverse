"use client";

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

// Professional Trend Line Component
export const ProfessionalTrendLine = ({ data, index }) => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), index * 300);
    return () => clearTimeout(timer);
  }, [index]);

  const maxValue = Math.max(...data);
  const minValue = Math.min(...data);
  const range = maxValue - minValue;
  
  const points = data.map((value, i) => {
    const x = (i / (data.length - 1)) * 180 + 20;
    const y = 60 - ((value - minValue) / range) * 40;
    return `${x},${y}`;
  }).join(' ');

  const pathData = `M ${points.split(' ').join(' L ')}`;

  return (
    <div className="w-full h-24 flex items-center justify-center">
      <svg width="220" height="80" viewBox="0 0 220 80" className="overflow-visible">
        <defs>
          <linearGradient id={`trendGradient-${index}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.8"/>
            <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.9"/>
          </linearGradient>
          <filter id={`glow-${index}`}>
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Grid lines for professional look */}
        <g stroke="#374151" strokeWidth="0.5" opacity="0.3">
          <line x1="20" y1="20" x2="200" y2="20" />
          <line x1="20" y1="40" x2="200" y2="40" />
          <line x1="20" y1="60" x2="200" y2="60" />
        </g>
        
        {/* Professional trend line with glow */}
        <motion.path
          d={pathData}
          fill="none"
          stroke="url(#trendGradient-${index})"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter={`url(#glow-${index})`}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: isVisible ? 1 : 0 }}
          transition={{ duration: 2, ease: "easeInOut" }}
        />
        
        {/* Data points */}
        {data.map((value, i) => {
          const x = (i / (data.length - 1)) * 180 + 20;
          const y = 60 - ((value - minValue) / range) * 40;
          return (
            <motion.circle
              key={i}
              cx={x}
              cy={y}
              r="3"
              fill="#fbbf24"
              stroke="#ffffff"
              strokeWidth="1"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: isVisible ? 1 : 0, opacity: isVisible ? 1 : 0 }}
              transition={{ duration: 0.6, delay: i * 0.1 + 1.5 }}
            />
          );
        })}
      </svg>
    </div>
  );
};

// Professional Progress Bar Component
export const ProfessionalProgress = ({ data, index }) => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), index * 300);
    return () => clearTimeout(timer);
  }, [index]);

  const maxValue = Math.max(...data);
  const progress = (data[data.length - 1] / maxValue) * 100;

  return (
    <div className="w-full h-24 flex flex-col justify-center px-4">
      {/* Main progress bar */}
      <div className="relative h-3 bg-neutral-800/50 rounded-full mb-4 overflow-hidden">
        <motion.div
          className="absolute left-0 top-0 h-full bg-gradient-to-r from-amber-400 to-golden rounded-full"
          initial={{ width: 0 }}
          animate={{ width: isVisible ? `${progress}%` : 0 }}
          transition={{ duration: 2, ease: "easeOut" }}
          style={{
            boxShadow: '0 0 10px rgba(251, 191, 36, 0.5)'
          }}
        />
      </div>
      
      {/* Mini bars showing progression */}
      <div className="flex justify-between items-end h-8">
        {data.map((value, i) => {
          const height = (value / maxValue) * 20 + 4;
          return (
            <motion.div
              key={i}
              className="w-2 bg-gradient-to-t from-amber-600 to-amber-400 rounded-sm"
              style={{ height: `${height}px` }}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: isVisible ? `${height}px` : 0, opacity: isVisible ? 1 : 0 }}
              transition={{ duration: 1, delay: i * 0.2 + 0.5 }}
            />
          );
        })}
      </div>
    </div>
  );
};

// Professional Circular Progress Component
export const ProfessionalCircular = ({ data, index }) => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), index * 300);
    return () => clearTimeout(timer);
  }, [index]);

  const maxValue = Math.max(...data);
  const progress = (data[data.length - 1] / maxValue) * 100;
  const radius = 35;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="w-full h-24 flex justify-center items-center">
      <div className="relative">
        <svg width="90" height="90" viewBox="0 0 90 90" className="transform -rotate-90">
          <defs>
            <linearGradient id={`circularGrad-${index}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#fbbf24"/>
              <stop offset="100%" stopColor="#f59e0b"/>
            </linearGradient>
          </defs>
          
          {/* Background circle */}
          <circle
            cx="45"
            cy="45"
            r={radius}
            stroke="#374151"
            strokeWidth="4"
            fill="transparent"
            opacity="0.3"
          />
          
          {/* Progress circle */}
          <motion.circle
            cx="45"
            cy="45"
            r={radius}
            stroke="url(#circularGrad-${index})"
            strokeWidth="4"
            fill="transparent"
            strokeLinecap="round"
            strokeDasharray={strokeDasharray}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: isVisible ? strokeDashoffset : circumference }}
            transition={{ duration: 2, ease: "easeOut" }}
            style={{
              filter: 'drop-shadow(0 0 6px rgba(251, 191, 36, 0.6))'
            }}
          />
        </svg>
        
        {/* Center percentage */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.span
            className="text-xs font-bold text-golden"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: isVisible ? 1 : 0, scale: isVisible ? 1 : 0 }}
            transition={{ duration: 0.5, delay: 1.5 }}
          >
            {Math.round(progress)}%
          </motion.span>
        </div>
      </div>
    </div>
  );
};

// Professional Bar Chart Component
export const ProfessionalBars = ({ data, index }) => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), index * 300);
    return () => clearTimeout(timer);
  }, [index]);

  const maxValue = Math.max(...data);

  return (
    <div className="w-full h-24 flex items-end justify-center px-6 pb-2">
      <div className="flex items-end space-x-3 h-16">
        {data.map((value, i) => {
          const height = (value / maxValue) * 50 + 8;
          const opacity = 0.4 + (value / maxValue) * 0.6;
          return (
            <motion.div
              key={i}
              className="w-4 bg-gradient-to-t from-amber-600 to-amber-400 rounded-t-sm"
              style={{ 
                height: `${height}px`,
                opacity: opacity,
                boxShadow: '0 0 8px rgba(251, 191, 36, 0.3)'
              }}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: isVisible ? `${height}px` : 0, opacity: isVisible ? opacity : 0 }}
              transition={{ duration: 1.2, delay: i * 0.15 + 0.5, ease: "easeOut" }}
            />
          );
        })}
      </div>
    </div>
  );
};

// Component selector with professional versions
export const ModernTrendIndicator = ({ type, data, index }) => {
  switch (type) {
    case 'line':
      return <ProfessionalTrendLine data={data} index={index} />;
    case 'progress':
      return <ProfessionalProgress data={data} index={index} />;
    case 'circular':
      return <ProfessionalCircular data={data} index={index} />;
    case 'area':
      return <ProfessionalBars data={data} index={index} />;
    default:
      return <ProfessionalTrendLine data={data} index={index} />;
  }
};
