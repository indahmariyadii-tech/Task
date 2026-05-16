'use client';

import React from 'react';
import { 
  LayoutDashboard, 
  Clock, 
  CheckSquare, 
  StickyNote, 
  Settings,
  Zap
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

const Sidebar = () => {
  const pathname = usePathname();

  const menuItems = [
    { icon: LayoutDashboard, path: '/', label: 'Overview' },
    { icon: Clock, path: '/timer', label: 'Focus' },
    { icon: CheckSquare, path: '/tasks', label: 'Backlog' },
    { icon: StickyNote, path: '/notes', label: 'Archive' },
  ];

  return (
    <aside className="fixed left-0 top-0 h-full w-20 hidden md:flex flex-col items-center py-10 bg-[#070B14]/50 backdrop-blur-3xl border-r border-white/5 z-[100]">
      <div className="mb-12">
        <motion.div
          whileHover={{ scale: 1.1, rotate: 5 }}
          className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(139,92,246,0.5)]"
        >
          <Zap size={24} fill="white" className="text-white" />
        </motion.div>
      </div>

      <nav className="flex flex-col gap-8">
        {menuItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link key={item.path} href={item.path}>
              <motion.div
                whileHover={{ scale: 1.1 }}
                className={`relative p-3 rounded-2xl transition-all duration-300 ${
                  isActive 
                    ? 'text-primary bg-primary/10' 
                    : 'text-text-secondary hover:text-white hover:bg-white/5'
                }`}
              >
                <item.icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                {isActive && (
                  <motion.div
                    layoutId="sidebar-indicator"
                    className="absolute -right-10 w-1.5 h-6 bg-primary rounded-full shadow-[0_0_15px_rgba(139,92,246,0.5)]"
                  />
                )}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto">
        <Link href="/settings">
          <motion.div
            whileHover={{ scale: 1.1 }}
            className={`p-3 rounded-2xl transition-all duration-300 ${
              pathname === '/settings' 
                ? 'text-primary bg-primary/10' 
                : 'text-text-secondary hover:text-white hover:bg-white/5'
            }`}
          >
            <Settings size={24} strokeWidth={pathname === '/settings' ? 2.5 : 2} />
          </motion.div>
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;
