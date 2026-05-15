'use client';

import React from 'react';
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
import { TrendingUp, Target, Award, Activity } from 'lucide-react';

const data = [
  { name: 'Mon', tasks: 4, hours: 2 },
  { name: 'Tue', tasks: 7, hours: 5 },
  { name: 'Wed', tasks: 5, hours: 3 },
  { name: 'Thu', tasks: 8, hours: 6 },
  { name: 'Fri', tasks: 6, hours: 4 },
  { name: 'Sat', tasks: 3, hours: 1 },
  { name: 'Sun', tasks: 2, hours: 1 },
];

const categoryData = [
  { name: 'Work', value: 45, color: 'var(--primary)' },
  { name: 'Health', value: 25, color: 'var(--secondary)' },
  { name: 'Personal', value: 20, color: 'var(--accent)' },
  { name: 'Other', value: 10, color: '#4ade80' },
];

const AnalyticsPage = () => {
  return (
    <AppLayout>
      <div className="mb-10">
        <h1 className="text-4xl font-bold mb-2">Analytics</h1>
        <p className="text-text-muted">Insights into your productivity and habits</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {[
          { label: 'Weekly Tasks', value: '35', icon: Target, color: 'text-primary' },
          { label: 'Avg. Focus', value: '4.2h', icon: TrendingUp, color: 'text-secondary' },
          { label: 'Completion', value: '88%', icon: Award, color: 'text-accent' },
          { label: 'Activity Score', value: '92', icon: Activity, color: 'text-green-400' },
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
          <h2 className="text-xl font-bold mb-8">Weekly Performance</h2>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorTasks" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" stroke="#a0a0a0" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#a0a0a0" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--glass-border)', borderRadius: '12px' }}
                  itemStyle={{ color: 'white' }}
                />
                <Area type="monotone" dataKey="tasks" stroke="var(--primary)" fillOpacity={1} fill="url(#colorTasks)" strokeWidth={3} />
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
            <div className="flex flex-col gap-4 ml-4">
              {categoryData.map((cat, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                  <span className="text-sm text-text-muted">{cat.name}</span>
                  <span className="text-sm font-bold">{cat.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card glass p-8"
      >
        <h2 className="text-xl font-bold mb-8">Efficiency Overview</h2>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
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
