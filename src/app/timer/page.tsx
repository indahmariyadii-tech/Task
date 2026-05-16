'use client';

import React, { useState, useEffect } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import TimerCircle from '@/components/timer/TimerCircle';
import ControlButtons from '@/components/timer/ControlButtons';
import TaskSelector from '@/components/timer/TaskSelector';
import { motion } from 'framer-motion';
import { Brain, Zap, Target } from 'lucide-react';

const FocusPage = () => {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [totalTime, setTotalTime] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [sessionCount, setSessionCount] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      setSessionCount(prev => prev + 1);
      // Play sound notification if possible
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(25 * 60);
    setTotalTime(25 * 60);
  };

  return (
    <AppLayout>
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] gap-12 md:gap-16">
        {/* Top Header Section */}
        <div className="text-center space-y-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.2em]"
          >
            <Zap size={14} fill="currentColor" />
            Optimizing Performance
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-display font-black tracking-tight text-white"
          >
            Focus <span className="text-primary">State</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-text-secondary font-medium max-w-sm mx-auto"
          >
            Enter your flow state and achieve maximum output with a focused Pomodoro session.
          </motion.p>
        </div>

        {/* Task Selector */}
        <TaskSelector />

        {/* Main Timer Component */}
        <TimerCircle 
          timeLeft={timeLeft} 
          totalTime={totalTime} 
          isActive={isActive} 
          label="Focus Session" 
        />

        {/* Control Buttons */}
        <ControlButtons 
          isActive={isActive} 
          onToggle={toggleTimer} 
          onReset={resetTimer} 
        />

        {/* Bottom Session Stats */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex items-center gap-12 text-text-secondary"
        >
          <div className="flex flex-col items-center gap-1">
            <span className="text-[10px] font-black uppercase tracking-widest opacity-50">Sessions Today</span>
            <span className="text-2xl font-display font-black text-white">{sessionCount} / 8</span>
          </div>
          <div className="w-px h-8 bg-white/10" />
          <div className="flex flex-col items-center gap-1">
            <span className="text-[10px] font-black uppercase tracking-widest opacity-50">Current Streak</span>
            <span className="text-2xl font-display font-black text-primary">3</span>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default FocusPage;
