'use client';

import React, { useState, useEffect, useRef } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, Coffee, Zap, Brain } from 'lucide-react';

const TimerPage = () => {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<'work' | 'break'>('work');
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(mode === 'work' ? 25 * 60 : 5 * 60);
  };

  const switchMode = (newMode: 'work' | 'break') => {
    setMode(newMode);
    setIsActive(false);
    setTimeLeft(newMode === 'work' ? 25 * 60 : 5 * 60);
  };

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      // Play sound or show notification
      alert(mode === 'work' ? 'Time for a break!' : 'Back to work!');
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, timeLeft, mode]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = mode === 'work' 
    ? (1 - timeLeft / (25 * 60)) * 100 
    : (1 - timeLeft / (5 * 60)) * 100;

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto text-center mt-10">
        <h1 className="text-4xl font-bold mb-4">Focus Timer</h1>
        <p className="text-text-muted mb-12">Stay productive using the Pomodoro technique</p>

        <div className="flex justify-center gap-4 mb-12">
          <button 
            onClick={() => switchMode('work')}
            className={`px-8 py-3 rounded-2xl font-bold transition-all flex items-center gap-2 ${
              mode === 'work' ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'bg-glass-bg text-text-muted'
            }`}
          >
            <Zap size={20} />
            Focus Session
          </button>
          <button 
            onClick={() => switchMode('break')}
            className={`px-8 py-3 rounded-2xl font-bold transition-all flex items-center gap-2 ${
              mode === 'break' ? 'bg-secondary text-white shadow-lg shadow-secondary/30' : 'bg-glass-bg text-text-muted'
            }`}
          >
            <Coffee size={20} />
            Short Break
          </button>
        </div>

        <div className="flex flex-col items-center">
          <div className="timer-ring mb-12">
            <svg className="timer-progress" viewBox="0 0 208 208">
              <circle
                cx="104"
                cy="104"
                r="100"
                fill="none"
                stroke={mode === 'work' ? 'var(--primary)' : 'var(--secondary)'}
                strokeWidth="8"
                strokeDasharray="628"
                strokeDashoffset={628 - (628 * progress) / 100}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-linear"
              />
            </svg>
            <div className="flex flex-col items-center">
              <span className="text-5xl font-bold">{formatTime(timeLeft)}</span>
              <span className="text-sm text-text-muted uppercase tracking-widest mt-2">{mode}</span>
            </div>
          </div>

          <div className="flex gap-6">
            <button 
              onClick={resetTimer}
              className="p-4 rounded-full bg-glass-bg text-text-muted hover:text-white transition-all"
            >
              <RotateCcw size={28} />
            </button>
            <button 
              onClick={toggleTimer}
              className={`p-6 rounded-full transition-all scale-110 ${
                isActive ? 'bg-accent shadow-lg shadow-accent/30' : 'bg-primary shadow-lg shadow-primary/30'
              }`}
            >
              {isActive ? <Pause size={32} className="text-white" /> : <Play size={32} className="text-white ml-1" />}
            </button>
            <button className="p-4 rounded-full bg-glass-bg text-text-muted hover:text-white transition-all">
              <Brain size={28} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-8 mt-20">
          <div className="card glass p-6">
            <h3 className="text-text-muted text-sm font-medium mb-2">Daily Focus</h3>
            <div className="text-2xl font-bold">4h 12m</div>
          </div>
          <div className="card glass p-6">
            <h3 className="text-text-muted text-sm font-medium mb-2">Sessions</h3>
            <div className="text-2xl font-bold">8</div>
          </div>
          <div className="card glass p-6">
            <h3 className="text-text-muted text-sm font-medium mb-2">Efficiency</h3>
            <div className="text-2xl font-bold">92%</div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .timer-progress {
          transform: rotate(-90deg);
        }
        .text-5xl { font-size: 3rem; }
        .mx-auto { margin-left: auto; margin-right: auto; }
        .max-w-4xl { max-width: 56rem; }
      `}</style>
    </AppLayout>
  );
};

export default TimerPage;
