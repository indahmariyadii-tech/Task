'use client';

import React, { useState, useEffect } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  Lightbulb,
  ArrowRight,
  Plus,
  Calendar as CalendarIcon,
  ChevronRight
} from 'lucide-react';

import { ITask } from '@/models/Task';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const Dashboard = () => {
  const router = useRouter();
  const [tasks, setTasks] = useState<ITask[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [mounted, setMounted] = useState(false);

  const fetchTasks = async () => {
    try {
      const response = await fetch('/api/tasks');
      const data = await response.json();
      if (Array.isArray(data)) {
        setTasks(data);
      }
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    }
  };

  const fetchActivities = async () => {
    try {
      const response = await fetch('/api/activities');
      const data = await response.json();
      if (Array.isArray(data)) {
        setActivities(data);
      }
    } catch (error) {
      console.error('Failed to fetch activities:', error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await Promise.all([fetchTasks(), fetchActivities()]);
      setIsLoading(false);
      setMounted(true);
    };

    
    loadData();

    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    
    const handleTaskAdded = () => fetchTasks();
    window.addEventListener('task-added', handleTaskAdded);
    
    return () => {
      clearInterval(timer);
      window.removeEventListener('task-added', handleTaskAdded);
    };
  }, []);

  // Calculate total focus time in minutes for today
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const todayActivities = activities.filter(a => {
    const activityDate = new Date(a.timestamp);
    return activityDate >= today && a.type === 'timer_session';
  });

  const totalFocusMinutes = todayActivities.reduce((acc, curr) => acc + (curr.duration || 0), 0);
  const focusHours = Math.floor(totalFocusMinutes / 60);
  const focusMins = totalFocusMinutes % 60;
  const focusTimeString = `${focusHours}h ${focusMins}m`;

  const completedTasks = tasks.filter(t => t.status === 'done').length;

  const totalTasks = tasks.length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const activeTasks = tasks.filter(t => t.status !== 'done');
  const highPriorityTasks = activeTasks.filter(t => t.priority >= 4).length;
  
  // Busyness level based on active tasks vs total
  const busynessLevel = totalTasks > 0 ? Math.round((activeTasks.length / totalTasks) * 100) : 0;

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' });
  };

  return (
    <AppLayout>
      <header className="mb-12 flex justify-between items-end">
        <div>
          <h2 className="text-sm text-primary uppercase tracking-widest font-bold mb-2">
            {mounted ? formatDate(currentTime) : 'Loading...'}
          </h2>
          <h1 className="text-5xl font-bold">
            {mounted 
              ? `Good ${currentTime.getHours() < 12 ? 'Morning' : currentTime.getHours() < 18 ? 'Afternoon' : 'Evening'}`
              : 'Welcome'}
          </h1>
        </div>
        <div className="text-right">
          <div className="text-4xl font-bold font-mono text-white/90">
            {mounted ? formatTime(currentTime) : '--:--'}
          </div>
          <p className="text-text-muted text-sm flex items-center gap-2 justify-end mt-1">
            <CalendarIcon size={14} /> Schedule is clear
          </p>
        </div>
      </header>


      <div className="grid-dashboard">
        {/* Busyness Stats */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card glass flex flex-col gap-6 relative overflow-hidden"
        >
          <div className="flex justify-between items-start z-10">
            <div className="p-4 rounded-2xl bg-primary/10 text-primary border border-primary/20 shadow-[0_0_20px_rgba(139,92,246,0.1)]">
              <TrendingUp size={24} />
            </div>
            <span className={`px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-widest ${busynessLevel > 70 ? 'bg-accent/20 text-accent border border-accent/30' : 'bg-primary/20 text-primary border border-primary/30'}`}>
              {busynessLevel > 70 ? 'High' : busynessLevel > 30 ? 'Normal' : 'Chill'}
            </span>
          </div>
          <div className="z-10">
            <h3 className="text-text-muted text-xs font-bold uppercase tracking-widest mb-1 opacity-70">Busyness Level</h3>
            <div className="text-4xl font-bold">{busynessLevel}%</div>
          </div>
          <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden z-10 border border-white/5">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${busynessLevel}%` }}
              className="h-full bg-gradient-to-r from-primary via-secondary to-primary bg-[length:200%_100%]"
              style={{ animation: 'shimmer 2s linear infinite' }}
            />
          </div>
          <p className="text-xs text-text-muted z-10 font-medium">
            {highPriorityTasks > 0 
              ? `You have ${highPriorityTasks} urgent items to address.` 
              : "No urgent tasks right now. Great!"}
          </p>
          
          <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-primary/10 rounded-full blur-[60px]" />
        </motion.div>


        {/* Focus Stats */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card glass flex flex-col gap-6 relative overflow-hidden"
        >
          <div className="flex justify-between items-start z-10">
            <div className="p-4 rounded-2xl bg-secondary/10 text-secondary border border-secondary/20 shadow-[0_0_20px_rgba(6,182,212,0.1)]">
              <Clock size={24} />
            </div>
            <div className="bg-secondary/10 text-secondary px-3 py-1 rounded-lg text-[10px] font-bold border border-secondary/20">LIVE</div>
          </div>
          <div className="z-10">
            <h3 className="text-text-muted text-xs font-bold uppercase tracking-widest mb-1 opacity-70">Focus Time</h3>
            <div className="text-4xl font-bold">{focusTimeString}</div>
          </div>

          <p className="text-xs text-text-muted flex items-center gap-1 z-10">
            <TrendingUp size={12} className="text-secondary" />
            <span className="text-secondary font-bold">+12%</span> vs yesterday
          </p>
          <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-secondary/10 rounded-full blur-[60px]" />
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card glass flex flex-col gap-6 relative overflow-hidden"
        >
          <div className="flex justify-between items-start z-10">
            <div className="p-4 rounded-2xl bg-accent/10 text-accent border border-accent/20 shadow-[0_0_20px_rgba(244,63,94,0.1)]">
              <CheckCircle2 size={24} />
            </div>
            <div className="text-3xl font-bold text-accent opacity-20">{completionRate}%</div>
          </div>
          <div className="z-10">
            <h3 className="text-text-muted text-xs font-bold uppercase tracking-widest mb-1 opacity-70">Tasks Completed</h3>
            <div className="text-4xl font-bold">{completedTasks}<span className="text-xl text-text-muted font-medium opacity-40">/{totalTasks}</span></div>
          </div>
          <p className="text-xs text-text-muted z-10 font-medium">
            {completionRate === 100 && totalTasks > 0 
              ? "Victory! All tasks done." 
              : totalTasks === 0 
              ? "Start by adding a task." 
              : "Keep pushing to 100%!"}
          </p>
          <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-accent/10 rounded-full blur-[60px]" />
        </motion.div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">
        {/* Recent Tasks */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Recent Tasks</h2>
            <Link href="/tasks" className="btn-ghost flex items-center gap-2 text-sm py-2">
              View All <ArrowRight size={16} />
            </Link>
          </div>
          
          <div className="flex flex-col gap-3">
            {isLoading ? (
              <div className="text-text-muted py-10">Loading your tasks...</div>
            ) : tasks.length === 0 ? (
              <div className="card glass text-center py-10 text-text-muted">
                <p className="mb-4">No tasks yet. Ready to be productive?</p>
                <button 
                  onClick={() => window.dispatchEvent(new CustomEvent('open-task-modal'))}
                  className="btn-primary text-sm"
                >
                  Create Your First Task
                </button>
              </div>
            ) : (
              tasks.slice(0, 4).map((task, i) => (
                <motion.div 
                  key={task._id || i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + (i * 0.05) }}
                  className="card flex items-center justify-between p-4 bg-white/5 border-white/5 hover:border-primary/50 cursor-pointer group"
                  onClick={() => router.push('/tasks')}
                >

                  <div className="flex items-center gap-4">
                    <div className={`w-3 h-3 rounded-full shadow-[0_0_8px_rgba(0,0,0,0.5)] ${
                      task.priority >= 4 ? 'bg-accent' : task.priority >= 3 ? 'bg-primary' : 'bg-secondary'
                    }`} />
                    <div>
                      <h4 className={`font-semibold transition-all ${task.status === 'done' ? 'line-through text-text-muted opacity-50' : 'group-hover:text-primary'}`}>
                        {task.title}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] text-text-muted uppercase tracking-wider font-bold">{task.category}</span>
                        {task.status === 'done' && (
                          <span className="text-[10px] text-secondary font-bold flex items-center gap-1">
                            <CheckCircle2 size={10} /> COMPLETED
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <ChevronRight size={18} className="text-text-muted opacity-0 group-hover:opacity-100 transition-all" />
                </motion.div>
              ))
            )}
            
            {tasks.length > 0 && (
              <button 
                onClick={() => window.dispatchEvent(new CustomEvent('open-task-modal'))}
                className="mt-2 flex items-center gap-2 text-primary font-bold text-sm hover:gap-3 transition-all ml-1"
              >
                <Plus size={18} /> Quick Add Task
              </button>
            )}
          </div>
        </div>

        {/* Quick Actions & Quick Note */}
        <div className="flex flex-col gap-8">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="card glass p-8"
          >
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Plus size={20} className="text-primary" />
              Quick Actions
            </h2>
            <div className="flex flex-col gap-4">
              <button 
                onClick={() => window.dispatchEvent(new CustomEvent('open-task-modal'))}
                className="btn-ghost w-full justify-start gap-3 hover:border-primary/50 text-sm"
              >
                <Plus size={18} /> Add New Task
              </button>
              <button 
                onClick={() => router.push('/timer')}
                className="btn-ghost w-full justify-start gap-3 hover:border-secondary/50 text-sm"
              >
                <Clock size={18} /> Start Focus Session
              </button>
              <button 
                onClick={() => router.push('/analytics')}
                className="btn-ghost w-full justify-start gap-3 hover:border-accent/50 text-sm"
              >
                <TrendingUp size={18} /> View Analytics
              </button>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="card glass p-8"
          >
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Lightbulb size={20} className="text-accent" />
              Quick Note
            </h2>
            <textarea 
              placeholder="Captured a thought? Type it here..."
              className="w-full bg-white/5 border border-white/5 rounded-xl p-4 text-sm mb-4 min-h-[120px] focus:border-accent outline-none"
              id="quick-note-input"
            ></textarea>
            <button 
              onClick={async () => {
                const input = document.getElementById('quick-note-input') as HTMLTextAreaElement;
                if (!input.value.trim()) return;
                try {
                  const res = await fetch('/api/notes', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      title: 'Quick Note',
                      content: input.value,
                      tags: ['quick']
                    })
                  });
                  if (res.ok) {
                    input.value = '';
                    alert('Note saved!');
                  }
                } catch (err) {
                  console.error(err);
                }
              }}
              className="btn-primary w-full justify-center bg-accent hover:bg-accent/80 shadow-accent/20"
            >
              Save Note
            </button>
          </motion.div>
        </div>

      </div>

      <style jsx>{`
        .font-mono { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace; }
        .text-5xl { font-size: 3rem; }
        .text-4xl { font-size: 2.25rem; }
        .blur-3xl { filter: blur(64px); }
        .blur-2xl { filter: blur(40px); }
      `}</style>
    </AppLayout>
  );
};

export default Dashboard;

