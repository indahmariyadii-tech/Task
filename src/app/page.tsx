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

const Dashboard = () => {
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
            value="142h" 
            icon={Clock} 
            trend="+12%" 
            delay={0.1}
          />
          <StatsCard 
            label="Tasks Done" 
            value="24" 
            icon={Target} 
            trend="+5" 
            delay={0.2}
          />
          <StatsCard 
            label="Current Streak" 
            value="8 Days" 
            icon={Flame} 
            trend="Active" 
            delay={0.3}
          />
          <StatsCard 
            label="Focus Score" 
            value="94%" 
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
              <button className="text-[10px] font-black uppercase tracking-widest text-text-secondary hover:text-white transition-colors">
                View All
              </button>
            </div>

            <div className="space-y-6">
              {[
                { task: 'UI Redesign', time: '50m', date: '2h ago', status: 'Completed' },
                { task: 'API Integration', time: '25m', date: '4h ago', status: 'Completed' },
                { task: 'Database Optimization', time: '25m', date: 'Yesterday', status: 'Interrupted' },
                { task: 'Product Meeting', time: '45m', date: 'Yesterday', status: 'Completed' },
              ].map((session, i) => (
                <div key={i} className="flex items-center justify-between group cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className={`w-1.5 h-8 rounded-full ${session.status === 'Completed' ? 'bg-primary' : 'bg-red-500/50'}`} />
                    <div>
                      <div className="text-sm font-bold text-white group-hover:text-primary transition-colors">{session.task}</div>
                      <div className="text-[10px] text-text-secondary uppercase font-black tracking-widest">{session.time} • {session.date}</div>
                    </div>
                  </div>
                  <ArrowRight size={14} className="text-text-secondary opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
