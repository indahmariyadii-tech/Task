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
import { TrendingUp, Target, Award, Activity as ActivityIcon } from 'lucide-react';
import { ITask } from '@/models/Task';
import { startOfWeek, endOfWeek, eachDayOfInterval, format, isSameDay, subDays } from 'date-fns';

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
    const colors = ['var(--primary)', 'var(--secondary)', 'var(--accent)', '#4ade80', '#fbbf24', '#8b5cf6'];
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
        <div className="flex items-center justify-center h-full">
          <p className="text-text-muted">Loading analytics...</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="mb-10">
        <h1 className="text-4xl font-bold mb-2">Analytics</h1>
        <p className="text-text-muted">Insights into your productivity and habits over the last 7 days</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {[
          { label: 'Weekly Tasks', value: weeklyTasks.toString(), icon: Target, color: 'text-primary' },
          { label: 'Avg. Focus', value: `${avgFocusHours}h`, icon: TrendingUp, color: 'text-secondary' },
          { label: 'Completion', value: `${completionRate}%`, icon: Award, color: 'text-accent' },
          { label: 'Activity Score', value: activityScore.toString(), icon: ActivityIcon, color: 'text-green-400' },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="card glass flex items-center gap-4"
          >
            <div className={`p-3 rounded-xl bg-white/5 ${stat.color}`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-sm text-text-muted">{stat.label}</p>
              <h3 className="text-2xl font-bold">{stat.value}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="card glass p-8 min-h-[400px]"
        >
          <h2 className="text-xl font-bold mb-8">Weekly Performance (Tasks)</h2>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={performanceData}>
                <defs>
                  <linearGradient id="colorTasks" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.6}/>
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} dx={-10} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(24, 24, 27, 0.9)', 
                    border: '1px solid var(--glass-border)', 
                    borderRadius: '16px',
                    backdropFilter: 'blur(10px)',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
                  }}
                  itemStyle={{ color: 'white', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="tasks" stroke="var(--primary)" fillOpacity={1} fill="url(#colorTasks)" strokeWidth={4} />

              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="card glass p-8 min-h-[400px]"
        >
          <h2 className="text-xl font-bold mb-8">Task Distribution</h2>
          <div className="h-[300px] w-full flex items-center justify-center">
            {categoryData.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--glass-border)', borderRadius: '12px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex flex-col gap-4 ml-4 min-w-[120px]">
                  {categoryData.map((cat, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                      <span className="text-sm text-text-muted truncate max-w-[80px]">{cat.name}</span>
                      <span className="text-sm font-bold">{cat.value}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p className="text-text-muted">No data available</p>
            )}
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card glass p-8"
      >
        <h2 className="text-xl font-bold mb-8">Focus Hours Overview</h2>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="name" stroke="#a0a0a0" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#a0a0a0" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--glass-border)', borderRadius: '12px' }}
              />
              <Bar dataKey="hours" fill="var(--secondary)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      <style jsx>{`
        .min-h-\[400px\] { min-height: 400px; }
        .h-\[300px\] { height: 300px; }
        .text-green-400 { color: #4ade80; }
      `}</style>
    </AppLayout>
  );
};

export default AnalyticsPage;

