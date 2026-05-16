'use client';

import React, { useState, useEffect } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { motion } from 'framer-motion';
import { TrendingUp, Target, Award, Activity as ActivityIcon, ArrowLeft } from 'lucide-react';
import { ITask } from '@/models/Task';
import { eachDayOfInterval, format, isSameDay, subDays } from 'date-fns';
import Link from 'next/link';

const AnalyticsPage = () => {
  const [tasks, setTasks] = useState<ITask[]>([]);
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
        console.error('Failed to fetch analytics data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // Calculate Weekly Performance (Tasks completed per day)
  const last7Days = eachDayOfInterval({
    start: subDays(new Date(), 6),
    end: new Date(),
  });

  const performanceData = last7Days.map(day => {
    const tasksCount = tasks.filter(t => 
      t.status === 'done' && t.updatedAt && isSameDay(new Date(t.updatedAt), day)
    ).length;
    
    const focusMinutes = activities.filter(a => 
      a.type === 'timer_session' && isSameDay(new Date(a.timestamp), day)
    ).reduce((acc, curr) => acc + (curr.duration || 0), 0);

    return {
      name: format(day, 'EEE'),
      tasks: tasksCount,
      hours: parseFloat((focusMinutes / 60).toFixed(1)),
    };
  });

  // Calculate Category Distribution
  const categories = Array.from(new Set(tasks.map(t => t.category)));
  const categoryData = categories.map((cat, i) => {
    const count = tasks.filter(t => t.category === cat).length;
    const colors = ['#8B5CF6', '#6366F1', '#C084FC', '#22D3EE', '#F472B6', '#FB923C'];
    return {
      name: cat,
      value: count,
      color: colors[i % colors.length]
    };
  }).filter(c => c.value > 0);

  // Total stats
  const weeklyTasks = tasks.filter(t => 
    t.status === 'done' && t.updatedAt && new Date(t.updatedAt) >= subDays(new Date(), 7)
  ).length;

  const totalFocusMinutes = activities
    .filter(a => a.type === 'timer_session' && new Date(a.timestamp) >= subDays(new Date(), 7))
    .reduce((acc, curr) => acc + (curr.duration || 0), 0);
  const avgFocusHours = (totalFocusMinutes / 7 / 60).toFixed(1);

  const completionRate = tasks.length > 0 
    ? Math.round((tasks.filter(t => t.status === 'done').length / tasks.length) * 100) 
    : 0;

  const activityScore = Math.min(100, Math.round((weeklyTasks * 10) + (totalFocusMinutes / 30)));

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
            <p className="text-text-secondary font-medium animate-pulse text-sm uppercase tracking-widest">Gathering Insights...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="mb-12">
        <Link href="/">
          <motion.button 
            whileHover={{ x: -4 }}
            className="flex items-center gap-2 text-text-secondary hover:text-white transition-colors mb-6 group"
          >
            <ArrowLeft size={16} />
            <span className="text-[10px] font-black uppercase tracking-widest">Back to Dashboard</span>
          </motion.button>
        </Link>
        <h1 className="text-4xl md:text-5xl font-display font-black tracking-tight text-white mb-2">
          Performance <span className="text-primary">Analytics</span>
        </h1>
        <p className="text-text-secondary font-medium">Detailed insights into your deep work patterns and habits.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-12">
        {[
          { label: 'Weekly Tasks', value: weeklyTasks.toString(), icon: Target, color: 'text-primary' },
          { label: 'Avg. Focus', value: `${avgFocusHours}h`, icon: TrendingUp, color: 'text-secondary' },
          { label: 'Completion', value: `${completionRate}%`, icon: Award, color: 'text-accent' },
          { label: 'Activity Score', value: activityScore.toString(), icon: ActivityIcon, color: 'text-emerald-400' },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-6 flex flex-col gap-4"
          >
            <div className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center ${stat.color}`}>
              <stat.icon size={20} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-text-secondary mb-1">{stat.label}</p>
              <h3 className="text-2xl font-display font-black text-white">{stat.value}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card p-8 min-h-[450px] flex flex-col"
        >
          <div className="mb-8">
            <h2 className="text-xl font-bold text-white">Weekly Focus Velocity</h2>
            <p className="text-sm text-text-secondary">Tasks completed per day over the last week</p>
          </div>
          <div className="h-[300px] w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={performanceData}>
                <defs>
                  <linearGradient id="colorTasks" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  stroke="#94A3B8" 
                  fontSize={10} 
                  fontWeight={700}
                  tickLine={false} 
                  axisLine={false} 
                  dy={10} 
                />
                <YAxis 
                  stroke="#94A3B8" 
                  fontSize={10} 
                  fontWeight={700}
                  tickLine={false} 
                  axisLine={false} 
                  dx={-10} 
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#0A0D14', 
                    border: '1px solid rgba(255,255,255,0.1)', 
                    borderRadius: '16px',
                    fontSize: '12px',
                    fontWeight: 700,
                  }}
                  itemStyle={{ color: '#8B5CF6' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="tasks" 
                  stroke="#8B5CF6" 
                  fillOpacity={1} 
                  fill="url(#colorTasks)" 
                  strokeWidth={3} 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-8 min-h-[450px] flex flex-col"
        >
          <div className="mb-8">
            <h2 className="text-xl font-bold text-white">Resource Allocation</h2>
            <p className="text-sm text-text-secondary">Distribution of effort across categories</p>
          </div>
          <div className="h-[300px] w-full relative flex flex-col md:flex-row items-center justify-center gap-8">
            {categoryData.length > 0 ? (
              <>
                <div className="flex-1 h-[250px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={8}
                        dataKey="value"
                        stroke="none"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#0A0D14', 
                          border: '1px solid rgba(255,255,255,0.1)', 
                          borderRadius: '16px' 
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex flex-col gap-3 min-w-[150px]">
                  {categoryData.map((cat, i) => (
                    <div key={i} className="flex items-center justify-between gap-4 p-2 rounded-xl bg-white/[0.02] border border-white/5">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }} />
                        <span className="text-[10px] font-black uppercase tracking-widest text-text-secondary">{cat.name}</span>
                      </div>
                      <span className="text-sm font-bold text-white">{cat.value}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-text-secondary text-sm italic">Initialize tasks to see distribution</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card p-8"
      >
        <div className="mb-8">
          <h2 className="text-xl font-bold text-white">Flow State Chronology</h2>
          <p className="text-sm text-text-secondary">Deep work hours logged per day</p>
        </div>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis 
                dataKey="name" 
                stroke="#94A3B8" 
                fontSize={10} 
                fontWeight={700}
                tickLine={false} 
                axisLine={false} 
                dy={10}
              />
              <YAxis 
                stroke="#94A3B8" 
                fontSize={10} 
                fontWeight={700}
                tickLine={false} 
                axisLine={false} 
                dx={-10}
              />
              <Tooltip 
                cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                contentStyle={{ 
                  backgroundColor: '#0A0D14', 
                  border: '1px solid rgba(255,255,255,0.1)', 
                  borderRadius: '16px' 
                }}
              />
              <Bar dataKey="hours" fill="#6366F1" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </AppLayout>
  );
};

export default AnalyticsPage;
