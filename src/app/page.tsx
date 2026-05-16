'use client';

import React, { useState, useEffect } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import StatsCard from '@/components/dashboard/StatsCard';
import AnalyticsChart from '@/components/dashboard/AnalyticsChart';
import { motion } from 'framer-motion';
import { 
  Clock, 
  Target, 
  Zap, 
  Flame, 
  ArrowRight,
  TrendingUp,
  History
} from 'lucide-react';
import Link from 'next/link';

import { formatDistanceToNow, isSameDay, subDays } from 'date-fns';

const Dashboard = () => {
  const [tasks, setTasks] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tasksRes, activitiesRes] = await Promise.all([
          fetch('/api/tasks'),
          fetch('/api/activities')
        ]);
        const tasksData = await tasksRes.json();
        const activitiesData = await activitiesRes.json();
        
        if (Array.isArray(tasksData)) setTasks(tasksData);
        if (Array.isArray(activitiesData)) setActivities(activitiesData);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // Calculate real stats
  const totalFocusMinutes = activities
    .filter(a => a.type === 'timer_session')
    .reduce((acc, curr) => acc + (curr.duration || 0), 0);
  const totalFocusHours = Math.round(totalFocusMinutes / 60);

  const completedTasks = tasks.filter(t => t.status === 'done').length;

  // Simple streak calculation (mocked for now but could be based on daily activity)
  const streak = 8; 

  const focusScore = 94; // Could be a complex calculation based on session quality

  return (
    <AppLayout>
      <div className="space-y-12">
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-primary font-black text-[10px] uppercase tracking-[0.3em] mb-2"
            >
              Overview Dashboard
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl font-display font-black tracking-tight text-white"
            >
              Welcome back, <span className="text-gradient-purple">Explorer</span>
            </motion.h1>
          </div>
          
          <Link href="/timer">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="premium-button"
            >
              Start Session
              <ArrowRight size={20} />
            </motion.button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <StatsCard 
            label="Total Focus" 
            value={`${totalFocusHours}h`} 
            icon={Clock} 
            trend="+12%" 
            delay={0.1}
          />
          <StatsCard 
            label="Tasks Done" 
            value={completedTasks.toString()} 
            icon={Target} 
            trend="+5" 
            delay={0.2}
          />
          <StatsCard 
            label="Current Streak" 
            value={`${streak} Days`} 
            icon={Flame} 
            trend="Active" 
            delay={0.3}
          />
          <StatsCard 
            label="Focus Score" 
            value={`${focusScore}%`} 
            icon={Zap} 
            trend="+2.4%" 
            delay={0.4}
          />
        </div>

        {/* Analytics & Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <AnalyticsChart />
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="glass-card p-8 flex flex-col gap-6"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <History size={20} className="text-primary" />
                History
              </h3>
              <Link href="/analytics">
                <button className="text-[10px] font-black uppercase tracking-widest text-text-secondary hover:text-white transition-colors">
                  View All
                </button>
              </Link>
            </div>

            <div className="space-y-6">
              {activities.length > 0 ? (
                activities.slice(0, 5).map((activity, i) => (
                  <div key={i} className="flex items-center justify-between group cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className={`w-1.5 h-8 rounded-full ${activity.type === 'timer_session' ? 'bg-primary' : 'bg-accent'}`} />
                      <div>
                        <div className="text-sm font-bold text-white group-hover:text-primary transition-colors">
                          {activity.type === 'timer_session' ? 'Focus Session' : 'Task Completed'}
                        </div>
                        <div className="text-[10px] text-text-secondary uppercase font-black tracking-widest">
                          {activity.duration ? `${activity.duration}m • ` : ''} 
                          {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                        </div>
                      </div>
                    </div>
                    <ArrowRight size={14} className="text-text-secondary opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-sm text-text-secondary">No activity yet</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
