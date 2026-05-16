'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TimerCircleProps {
  timeLeft: number;
  totalTime: number;
  isActive: boolean;
  label: string;
}

const TimerCircle: React.FC<TimerCircleProps> = ({ timeLeft, totalTime, isActive, label }) => {
  const progress = (timeLeft / totalTime) * 100;
  const radius = 170;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="relative flex items-center justify-center w-[340px] h-[340px] md:w-[440px] md:h-[440px]">
      {/* Dynamic Depth Shadows */}
      <motion.div 
        animate={{ 
          scale: isActive ? [1, 1.02, 1] : 1,
          opacity: isActive ? [0.1, 0.2, 0.1] : 0.05
        }}
        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
        className="absolute inset-0 bg-primary rounded-full blur-[100px]"
      />

      {/* Main Container SVG */}
      <svg className="w-full h-full transform -rotate-90 drop-shadow-[0_0_30px_rgba(139,92,246,0.2)]">
        {/* Under-ring for depth */}
        <circle
          cx="50%"
          cy="50%"
          r={radius}
          fill="transparent"
          stroke="rgba(255, 255, 255, 0.02)"
          strokeWidth="16"
        />
        
        {/* Outer Ring Track */}
        <circle
          cx="50%"
          cy="50%"
          r={radius}
          fill="transparent"
          stroke="rgba(139, 92, 246, 0.05)"
          strokeWidth="8"
        />

        {/* Liquid Progress Path */}
        <motion.circle
          cx="50%"
          cy="50%"
          r={radius}
          fill="transparent"
          stroke="url(#timer-gradient-pro)"
          strokeWidth="8"
          strokeDasharray={circumference}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: [0.23, 1, 0.32, 1] }}
          strokeLinecap="round"
          className="relative z-10"
        />
        
        <defs>
          <linearGradient id="timer-gradient-pro" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#A78BFA" />
            <stop offset="100%" stopColor="#8B5CF6" />
          </linearGradient>
          {/* Subtle Glow Filter */}
          <filter id="glow">
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      </svg>

      {/* Orbit Indicator - Premium Pearl */}
      <motion.div
        className="absolute w-5 h-5 bg-white rounded-full shadow-[0_0_20px_#fff,0_0_40px_rgba(139,92,246,0.6)] z-20"
        animate={{
          rotate: (360 * (1 - progress / 100))
        }}
        transition={{ duration: 1, ease: [0.23, 1, 0.32, 1] }}
        style={{
          top: '50%',
          left: '50%',
          marginTop: '-10px',
          marginLeft: '-10px',
          transformOrigin: `0 ${radius}px`,
          transform: `translateY(-${radius}px)`
        }}
      >
        <div className="absolute inset-0.5 rounded-full bg-gradient-to-tr from-primary to-white opacity-80" />
      </motion.div>

      {/* Glass Inner Hub */}
      <div className="absolute inset-[40px] rounded-full bg-white/[0.01] border border-white/[0.05] backdrop-blur-md flex flex-col items-center justify-center text-center shadow-inner">
        <motion.span 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.4em] text-text-secondary mb-4"
        >
          {label}
        </motion.span>
        
        <div className="timer-display text-7xl md:text-8xl font-bold tracking-tighter text-white drop-shadow-2xl">
          {formatTime(timeLeft)}
        </div>

        <AnimatePresence mode="wait">
          <motion.div 
            key={isActive ? 'active' : 'paused'}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className={`mt-6 flex items-center gap-3 px-4 py-1.5 rounded-full border transition-all duration-500 ${
              isActive 
                ? 'bg-primary/10 border-primary/20 text-primary-light shadow-[0_0_20px_rgba(139,92,246,0.1)]' 
                : 'bg-white/5 border-white/10 text-text-dim'
            }`}
          >
            <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-primary animate-pulse' : 'bg-text-dim'}`} />
            <span className="text-[11px] font-bold uppercase tracking-widest">
              {isActive ? 'Flowing' : 'Idle'}
            </span>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TimerCircle;
