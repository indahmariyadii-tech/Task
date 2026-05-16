'use client';

import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import { eachDayOfInterval, format, isSameDay, subDays } from 'date-fns';

const AnalyticsChart = () => {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const res = await fetch('/api/activities');
        const activities = await res.json();
        
        if (Array.isArray(activities)) {
          const last7Days = eachDayOfInterval({
            start: subDays(new Date(), 6),
            end: new Date(),
          });

          const chartData = last7Days.map(day => {
            const focusMinutes = activities
              .filter(a => a.type === 'timer_session' && isSameDay(new Date(a.timestamp), day))
              .reduce((acc, curr) => acc + (curr.duration || 0), 0);
            
            return {
              name: format(day, 'EEE'),
              value: parseFloat((focusMinutes / 60).toFixed(1)),
            };
          });

          setData(chartData);
        }
      } catch (err) {
        console.error('Failed to fetch chart data:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchActivities();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="glass-card p-8 min-h-[350px] flex flex-col gap-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-white">Focus Analytics</h3>
          <p className="text-text-secondary text-sm">Deep work distribution over the last 7 days</p>
        </div>
        <div className="flex gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-xl text-[10px] font-bold text-white uppercase tracking-wider">
            {isLoading ? 'Loading...' : 'Weekly'}
          </div>
        </div>
      </div>

      <div className="h-[250px] w-full relative">
        {isLoading ? (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#94A3B8', fontSize: 10, fontWeight: 700 }}
                dy={10}
              />
              <YAxis hide />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#0A0D14', 
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '16px',
                  fontSize: '12px',
                  fontWeight: 700,
                  color: '#fff'
                }}
                itemStyle={{ color: '#8B5CF6' }}
              />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke="#8B5CF6" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorValue)" 
                animationDuration={1500}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </motion.div>
  );
};

export default AnalyticsChart;
