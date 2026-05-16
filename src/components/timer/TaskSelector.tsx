'use client';

import React from 'react';
import { Target, Search } from 'lucide-react';
import { motion } from 'framer-motion';

const TaskSelector = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="relative w-full max-w-md group"
    >
      <div className="absolute left-6 top-1/2 -translate-y-1/2 text-text-secondary group-focus-within:text-primary transition-colors">
        <Target size={20} />
      </div>
      <input 
        type="text" 
        placeholder="Select your focus task..."
        className="input-premium pl-14 pr-6"
      />
      <div className="absolute right-6 top-1/2 -translate-y-1/2">
        <div className="px-2 py-1 rounded-md bg-white/5 border border-white/10 text-[10px] font-black text-text-secondary uppercase tracking-widest">
          ⌘K
        </div>
      </div>
    </motion.div>
  );
};

export default TaskSelector;
