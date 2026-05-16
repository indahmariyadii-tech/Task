'use client';

import React from 'react';
import { Search, Bell, User, SearchIcon } from 'lucide-react';
import { motion } from 'framer-motion';

const Header = () => {
  return (
    <header className="h-20 flex items-center justify-between px-4 md:px-8 bg-transparent relative z-50">
      <div className="flex items-center gap-4">
        {/* Search Bar - Command Style */}
        <div className="relative group hidden md:block">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary group-focus-within:text-primary transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Command palette..." 
            className="w-80 bg-white/5 border border-white/5 rounded-full pl-12 pr-6 py-2.5 text-sm text-white placeholder:text-text-secondary focus:bg-white/[0.08] focus:border-primary/30 focus:ring-4 focus:ring-primary/10 transition-all outline-none"
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-text-secondary uppercase tracking-widest opacity-40">
            ⌘P
          </div>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative p-2.5 rounded-xl bg-white/5 border border-white/5 text-text-secondary hover:text-white transition-all"
        >
          <Bell size={20} />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-primary rounded-full shadow-[0_0_10px_rgba(139,92,246,1)]" />
        </motion.button>

        <div className="flex items-center gap-4 pl-6 border-l border-white/10">
          <div className="text-right hidden sm:block">
            <div className="text-sm font-bold text-white">John Doe</div>
            <div className="text-[10px] font-black text-primary uppercase tracking-widest">Pro Member</div>
          </div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="w-10 h-10 rounded-full border-2 border-primary/20 p-0.5 bg-gradient-to-br from-primary to-secondary"
          >
            <div className="w-full h-full rounded-full bg-surface flex items-center justify-center">
              <User size={20} className="text-white" />
            </div>
          </motion.div>
        </div>
      </div>
    </header>
  );
};

export default Header;
