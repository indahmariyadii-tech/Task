'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  CheckSquare, 
  Calendar, 
  Clock, 
  FileText, 
  BarChart3, 
  Settings
} from 'lucide-react';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/' },
  { icon: CheckSquare, label: 'Tasks', href: '/tasks' },
  { icon: Clock, label: 'Timer', href: '/timer' },
  { icon: BarChart3, label: 'Analysis', href: '/analytics' },
  { icon: FileText, label: 'Notes', href: '/notes' },
  { icon: Calendar, label: 'Schedule', href: '/calendar' },
];

const Sidebar = () => {
  const pathname = usePathname();

  return (
    <aside className="sidebar glass">
      <div className="flex items-center gap-4 mb-12 px-2">
        <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/30">
          <span className="text-white font-black text-xl italic">V</span>
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tighter text-white">TaskVibe</h1>
          <div className="h-1 w-8 bg-primary/40 rounded-full mt-1" />
        </div>
      </div>


      <nav className="sidebar-nav">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href} className={`sidebar-link ${isActive ? 'active' : ''}`}>
              <span className="icon-container">
                <item.icon size={20} />
              </span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto pt-8 border-t border-border">
        <Link href="/settings" className="sidebar-link">
          <span className="icon-container">
            <Settings size={20} />
          </span>
          <span>Settings</span>
        </Link>
      </div>

    </aside>
  );
};

export default Sidebar;
