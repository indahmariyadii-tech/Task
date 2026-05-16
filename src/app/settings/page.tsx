'use client';

import React from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { motion } from 'framer-motion';
import { 
  User, 
  Palette, 
  Lock, 
  Bell, 
  Shield, 
  Smartphone,
  ChevronRight
} from 'lucide-react';

const SettingsPage = () => {
  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto">
        <header className="mb-12">
          <h1 className="text-4xl font-bold mb-2">Settings</h1>
            <p className="text-text-secondary text-sm font-medium">Elevate your focus with Flow.</p>
        </header>

        <div className="flex flex-col gap-8">
          <section className="card glass">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
              <User size={22} className="text-primary" />
              Profile Settings
            </h3>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-text-muted uppercase tracking-wider">Display Name</label>
                <input type="text" placeholder="Your Name" defaultValue="User" className="bg-white/5 border-white/10" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-text-muted uppercase tracking-wider">Email Address</label>
                <input type="email" placeholder="email@example.com" defaultValue="user@flow.io" className="bg-white/5 border-white/10" />
              </div>
            </div>
          </section>

          <section className="card glass">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
              <Palette size={22} className="text-secondary" />
              Appearance
            </h3>
            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                <div>
                  <h4 className="font-bold">Dark Mode</h4>
                  <p className="text-xs text-text-muted">Currently active by default</p>
                </div>
                <div className="w-12 h-6 bg-primary rounded-full relative">
                  <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
                </div>
              </div>
              <div className="flex flex-col gap-4">
                <label className="text-sm font-bold text-text-muted uppercase tracking-wider">Accent Color</label>
                <div className="flex gap-4">
                  {['#8b5cf6', '#06b6d4', '#f43f5e', '#10b981'].map(color => (
                    <div 
                      key={color} 
                      className={`w-10 h-10 rounded-xl cursor-pointer border-2 transition-all hover:scale-110 ${color === '#8b5cf6' ? 'border-white' : 'border-transparent'}`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="card glass border-red-500/10">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-3 text-red-400">
              <Lock size={22} />
              Account Security
            </h3>
            <div className="flex flex-col gap-3">
                <button className="btn-ghost w-full border-red-500/20 text-red-400 hover:bg-red-500/10 justify-between flex items-center">
                <span>Change Password</span>
                <ChevronRight size={18} />
                </button>
                <button className="btn-ghost w-full border-red-500/20 text-red-400 hover:bg-red-500/10 justify-between flex items-center">
                <span>Two-Factor Authentication</span>
                <ChevronRight size={18} />
                </button>
            </div>
          </section>

          <div className="text-center pt-8">
            <p className="text-xs text-text-muted mb-2">Flow v1.0.4 - Premium Edition</p>
            <p className="text-[10px] text-text-muted/30">Made with ❤️ for productivity</p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default SettingsPage;
