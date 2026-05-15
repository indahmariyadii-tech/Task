'use client';

import React, { useState, useEffect, useRef } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, Coffee, Zap, Brain, Target } from 'lucide-react';
import { ITask } from '@/models/Task';

const TimerPage = () => {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<'work' | 'break'>('work');
  const [tasks, setTasks] = useState<ITask[]>([]);
  const [selectedTaskId, setSelectedTaskId] = useState<string>('');
  const [activities, setActivities] = useState<any[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const fetchData = async () => {
    try {
      const [tasksRes, activitiesRes] = await Promise.all([
        fetch('/api/tasks'),
        fetch('/api/activities')
      ]);
      const tasksData = await tasksRes.json();
      const activitiesData = await activitiesRes.json();
      if (Array.isArray(tasksData)) setTasks(tasksData.filter(t => t.status !== 'done'));
      if (Array.isArray(activitiesData)) setActivities(activitiesData);
    } catch (error) {
      console.error('Failed to fetch timer data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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
      
      if (mode === 'work') {
        fetch('/api/activities', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'timer_session',
            duration: 25,
            taskId: selectedTaskId || undefined,
            timestamp: new Date()
          })
        }).then(() => fetchData()).catch(err => console.error('Failed to save session:', err));
      }

      alert(mode === 'work' ? 'Time for a break!' : 'Back to work!');
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, timeLeft, mode, selectedTaskId]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = mode === 'work' 
    ? (1 - timeLeft / (25 * 60)) * 100 
    : (1 - timeLeft / (5 * 60)) * 100;

  // Stats calculation
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todaySessions = activities.filter(a => new Date(a.timestamp) >= today && a.type === 'timer_session');
  const totalFocusMinutes = todaySessions.reduce((acc, curr) => acc + (curr.duration || 0), 0);
  const sessionsCount = todaySessions.length;
  
  const focusHours = Math.floor(totalFocusMinutes / 60);
  const focusMins = totalFocusMinutes % 60;

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto text-center mt-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-5xl font-bold mb-4 tracking-tighter">Focus Timer</h1>
          <p className="text-text-muted mb-12">Stay productive using the Pomodoro technique</p>
        </motion.div>

        {mode === 'work' && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-12 flex justify-center"
          >
            <div className="relative w-full max-w-lg">
              <Target className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" size={20} />
              <select 
                value={selectedTaskId}
                onChange={(e) => setSelectedTaskId(e.target.value)}
                className="w-full bg-glass-bg border border-glass-border rounded-2xl pl-12 pr-4 py-4 text-sm font-semibold focus:border-primary outline-none appearance-none cursor-pointer shadow-xl transition-all"
              >
                <option value="">-- Choose a task to focus on --</option>
                {tasks.map(task => (
                  <option key={task._id} value={task._id} className="bg-zinc-900">{task.title}</option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-text-muted">
                <RotateCcw size={14} className="rotate-90" />
              </div>
            </div>
          </motion.div>
        )}

        <div className="flex justify-center gap-6 mb-16">
          <button 
            onClick={() => switchMode('work')}
            className={`px-10 py-4 rounded-2xl font-bold transition-all flex items-center gap-3 shadow-lg border-0 cursor-pointer ${
              mode === 'work' 
                ? 'bg-primary text-white scale-105' 
                : 'bg-white/5 text-text-muted hover:text-white hover:bg-white/10'
            }`}
          >
            <Zap size={22} fill={mode === 'work' ? 'white' : 'transparent'} />
            Focus Session
          </button>
          <button 
            onClick={() => switchMode('break')}
            className={`px-10 py-4 rounded-2xl font-bold transition-all flex items-center gap-3 shadow-lg border-0 cursor-pointer ${
              mode === 'break' 
                ? 'bg-secondary text-white scale-105' 
                : 'bg-white/5 text-text-muted hover:text-white hover:bg-white/10'
            }`}
          >
            <Coffee size={22} fill={mode === 'break' ? 'white' : 'transparent'} />
            Short Break
          </button>
        </div>

        <div className="flex flex-col items-center">
          <div className="relative w-72 h-72 mb-16">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 208 208">
              <circle
                cx="104"
                cy="104"
                r="100"
                fill="none"
                stroke="rgba(255,255,255,0.03)"
                strokeWidth="6"
              />
              <motion.circle
                cx="104"
                cy="104"
                r="100"
                fill="none"
                stroke={mode === 'work' ? 'var(--primary)' : 'var(--secondary)'}
                strokeWidth="8"
                strokeDasharray="628"
                initial={{ strokeDashoffset: 628 }}
                animate={{ strokeDashoffset: 628 - (628 * progress) / 100 }}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-linear"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-6xl font-black tracking-tighter text-white">
                {formatTime(timeLeft)}
              </span>
              <span className="text-[10px] text-text-muted uppercase tracking-[0.3em] font-bold mt-2 opacity-70">
                {mode === 'work' ? 'Deep Work' : 'Refuel'}
              </span>
            </div>
          </div>

          <div className="flex gap-6 items-center">
            <button 
              onClick={resetTimer}
              className="p-4 rounded-xl bg-white/5 text-text-muted hover:text-white hover:bg-white/10 transition-all border border-white/5 cursor-pointer shadow-lg"
            >
              <RotateCcw size={24} />
            </button>
            <button 
              onClick={toggleTimer}
              className={`p-7 rounded-[2rem] transition-all scale-105 shadow-2xl border-0 cursor-pointer ${
                isActive 
                  ? 'bg-accent rotate-180' 
                  : 'bg-primary'
              }`}
            >
              {isActive ? <Pause size={32} className="text-white" /> : <Play size={32} className="text-white ml-1" />}
            </button>
            <button className="p-4 rounded-xl bg-white/5 text-text-muted hover:text-white hover:bg-white/10 transition-all border border-white/5 cursor-pointer shadow-lg">
              <Brain size={24} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20">
          <div className="card glass p-6 group">
            <h3 className="text-text-muted text-[10px] font-bold uppercase tracking-widest mb-3 opacity-60">Daily Focus</h3>
            <div className="text-2xl font-black group-hover:text-primary transition-colors">{focusHours}h {focusMins}m</div>
            <div className="mt-4 h-1 w-8 bg-primary/20 rounded-full group-hover:w-full transition-all duration-500" />
          </div>
          <div className="card glass p-6 group">
            <h3 className="text-text-muted text-[10px] font-bold uppercase tracking-widest mb-3 opacity-60">Sessions</h3>
            <div className="text-2xl font-black group-hover:text-secondary transition-colors">{sessionsCount}</div>
            <div className="mt-4 h-1 w-8 bg-secondary/20 rounded-full group-hover:w-full transition-all duration-500" />
          </div>
          <div className="card glass p-6 group">
            <h3 className="text-text-muted text-[10px] font-bold uppercase tracking-widest mb-3 opacity-60">Efficiency</h3>
            <div className="text-2xl font-black group-hover:text-accent transition-colors">{sessionsCount > 4 ? '92%' : sessionsCount > 0 ? '75%' : '0%'}</div>
            <div className="mt-4 h-1 w-8 bg-accent/20 rounded-full group-hover:w-full transition-all duration-500" />
          </div>
        </div>


      </div>
    </AppLayout>
  );
};

export default TimerPage;
