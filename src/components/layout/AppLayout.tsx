'use client';

import React from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import { motion, AnimatePresence } from 'framer-motion';

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background">
      {/* Ultra-Premium Ambient Layers */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        <div className="ambient-blob blob-purple -top-48 -left-48" style={{ animationDelay: '0s' }} />
        <div className="ambient-blob blob-indigo top-1/2 -right-48" style={{ animationDelay: '-5s' }} />
        <div className="ambient-blob bg-accent/10 w-[300px] h-[300px] bottom-0 left-1/4 filter blur-[120px]" style={{ animationDelay: '-10s' }} />
        <div className="noise-texture" />
        
        {/* Fine Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
          style={{ backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }} 
        />
      </div>

      <Sidebar />
      
      <div className="md:pl-20 relative z-10 flex flex-col min-h-screen">
        <Header />
        
        <main className="flex-1 max-w-7xl w-full mx-auto px-6 md:px-12 py-12 md:py-20">
          <AnimatePresence mode="wait">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 1, ease: [0.23, 1, 0.32, 1] }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
        
        {/* Subtle Footer or Indicator */}
        <footer className="py-8 px-12 border-t border-white/[0.02] flex justify-between items-center opacity-40">
          <div className="text-[10px] font-black uppercase tracking-[0.3em] text-text-dim">TaskVibe Pro • Phase 01</div>
          <div className="flex gap-4">
             <div className="w-1 h-1 rounded-full bg-primary animate-pulse" />
             <div className="w-1 h-1 rounded-full bg-white/20" />
             <div className="w-1 h-1 rounded-full bg-white/20" />
          </div>
        </footer>
      </div>
    </div>
  );
};

export default AppLayout;
