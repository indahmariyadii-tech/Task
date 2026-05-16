'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Target, Search, Check, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ITask } from '@/models/Task';

interface TaskSelectorProps {
  onSelect: (task: ITask | null) => void;
  selectedTask: ITask | null;
}

const TaskSelector: React.FC<TaskSelectorProps> = ({ onSelect, selectedTask }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [tasks, setTasks] = useState<ITask[]>([]);
  const [search, setSearch] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await fetch('/api/tasks');
        const data = await res.json();
        if (Array.isArray(data)) {
          setTasks(data.filter(t => t.status === 'todo'));
        }
      } catch (err) {
        console.error('Failed to fetch tasks for selector:', err);
      }
    };
    fetchTasks();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredTasks = tasks.filter(t => 
    t.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="relative w-full max-w-md" ref={dropdownRef}>
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        onClick={() => setIsOpen(!isOpen)}
        className="relative group cursor-pointer"
      >
        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-text-secondary group-focus-within:text-primary transition-colors">
          <Target size={20} />
        </div>
        <div className="input-premium pl-14 pr-12 flex items-center h-[56px] text-sm font-medium">
          {selectedTask ? (
            <span className="text-white truncate">{selectedTask.title}</span>
          ) : (
            <span className="text-text-dim">Select your focus task...</span>
          )}
        </div>
        <div className="absolute right-6 top-1/2 -translate-y-1/2 text-text-dim group-hover:text-white transition-colors">
          <ChevronDown size={18} className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute top-full left-0 right-0 mt-4 glass-card border-white/10 shadow-2xl z-[100] overflow-hidden"
          >
            <div className="p-4 border-b border-white/5">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-dim" size={14} />
                <input 
                  type="text"
                  placeholder="Filter objectives..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  className="w-full bg-white/5 border border-white/5 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder:text-text-dim focus:outline-none focus:border-primary/30"
                />
              </div>
            </div>
            
            <div className="max-h-[240px] overflow-y-auto premium-scrollbar">
              {filteredTasks.length > 0 ? (
                filteredTasks.map((task) => (
                  <button
                    key={task._id}
                    onClick={() => {
                      onSelect(task);
                      setIsOpen(false);
                    }}
                    className="w-full flex items-center justify-between px-6 py-4 hover:bg-white/5 transition-colors text-left"
                  >
                    <div className="flex flex-col gap-0.5">
                      <span className="text-sm font-bold text-white">{task.title}</span>
                      <span className="text-[10px] font-black uppercase tracking-widest text-text-secondary">{task.category}</span>
                    </div>
                    {selectedTask?._id === task._id && (
                      <Check size={16} className="text-primary" />
                    )}
                  </button>
                ))
              ) : (
                <div className="px-6 py-8 text-center">
                  <p className="text-xs text-text-secondary">No matching tasks found</p>
                </div>
              )}
            </div>
            
            <div className="p-4 bg-white/[0.02] border-t border-white/5">
              <p className="text-[10px] font-black uppercase tracking-widest text-text-dim text-center">
                Press <span className="text-white">⌘K</span> to search globally
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TaskSelector;
