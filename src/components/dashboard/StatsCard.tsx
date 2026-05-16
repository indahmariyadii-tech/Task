'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  delay?: number;
}

const StatsCard: React.FC<StatsCardProps> = ({ label, value, icon: Icon, trend, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
      className="glass-card p-7 group relative overflow-hidden"
    >
      {/* Dynamic Background Pattern */}
      <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500 pointer-events-none">
        <Icon size={120} strokeWidth={1} />
      </div>

      <div className="flex justify-between items-start mb-6">
        <div className="relative">
          <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full scale-150 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 text-primary group-hover:text-primary-light transition-colors shadow-inner">
            <Icon size={22} />
          </div>
        </div>
        {trend && (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.03] border border-white/5 shadow-inner">
            <div className="w-1 h-1 rounded-full bg-primary-light animate-pulse" />
            <span className="text-[10px] font-black text-text-secondary uppercase tracking-[0.1em]">
              {trend}
            </span>
          </div>
        )}
      </div>

      <div>
        <div className="text-text-dim text-[11px] font-black uppercase tracking-[0.25em] mb-2">{label}</div>
        <div className="text-4xl font-display font-black text-white tracking-tight group-hover:text-gradient-purple transition-all duration-500">
          {value}
        </div>
      </div>
    </motion.div>
  );
};

export default StatsCard;
