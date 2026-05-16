'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, RotateCcw, Settings, MoreHorizontal } from 'lucide-react';

interface ControlButtonsProps {
  isActive: boolean;
  onToggle: () => void;
  onReset: () => void;
}

const ControlButtons: React.FC<ControlButtonsProps> = ({ isActive, onToggle, onReset }) => {
  return (
    <div className="flex items-center gap-10">
      <motion.button
        whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.08)" }}
        whileTap={{ scale: 0.95 }}
        onClick={onReset}
        className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 text-text-secondary hover:text-white transition-all duration-300 group"
      >
        <RotateCcw size={22} className="group-hover:-rotate-45 transition-transform duration-500" />
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.05, boxShadow: "0 0 40px rgba(139, 92, 246, 0.4)" }}
        whileTap={{ scale: 0.95 }}
        onClick={onToggle}
        className="relative w-20 h-20 md:w-24 md:h-24 rounded-[32px] bg-primary flex items-center justify-center text-white shadow-glow-primary overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-50" />
        <div className="relative z-10">
          {isActive ? (
            <Pause size={36} fill="white" className="drop-shadow-lg" />
          ) : (
            <Play size={36} fill="white" className="ml-1 drop-shadow-lg" />
          )}
        </div>
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.08)" }}
        whileTap={{ scale: 0.95 }}
        className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 text-text-secondary hover:text-white transition-all duration-300"
      >
        <Settings size={22} />
      </motion.button>
    </div>
  );
};

export default ControlButtons;
