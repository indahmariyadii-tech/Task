'use client';

import React, { useState, useEffect } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  MoreVertical, 
  CheckCircle2, 
  Circle, 
  Clock,
  Trash2,
  Edit2,
  Plus,
  ArrowUpDown,
  Tag
} from 'lucide-react';
import { ITask } from '@/models/Task';

const TasksPage = () => {
  const [tasks, setTasks] = useState<ITask[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'todo' | 'in-progress' | 'done'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchTasks = async () => {
    try {
      const response = await fetch('/api/tasks');
      const data = await response.json();
      if (Array.isArray(data)) setTasks(data);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
    const handleTaskAdded = () => fetchTasks();
    window.addEventListener('task-added', handleTaskAdded);
    return () => window.removeEventListener('task-added', handleTaskAdded);
  }, []);

  const toggleStatus = async (task: any) => {
    const isDone = task.status === 'done';
    const newStatus = isDone ? 'todo' : 'done';
    try {
      const response = await fetch(`/api/tasks/${task._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, completedAt: !isDone ? new Date() : null }),
      });
      if (response.ok) fetchTasks();
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  };

  const deleteTask = async (id: string) => {
    if (!confirm('Move this task to archive?')) return;
    try {
      const response = await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
      if (response.ok) fetchTasks();
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };

  const filteredTasks = tasks.filter(t => {
    const matchesFilter = filter === 'all' || t.status === filter;
    const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         t.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <AppLayout>
      <div className="flex flex-col gap-8">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl font-display font-bold tracking-tight text-white mb-2">Backlog</h1>
            <p className="text-text-dim font-medium">Manage your workload and prioritize what matters most.</p>
          </div>
          <button 
            onClick={() => window.dispatchEvent(new CustomEvent('open-task-modal'))}
            className="premium-button"
          >
            <Plus size={18} />
            <span>Add New Task</span>
          </button>
        </header>

        {/* Filters & Search */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between p-2 bg-white/5 rounded-3xl border border-border">
          <div className="flex items-center gap-1 overflow-x-auto w-full md:w-auto px-2">
            {['all', 'todo', 'in-progress', 'done'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f as any)}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                  filter === f 
                    ? 'bg-white text-black shadow-lg' 
                    : 'text-text-dim hover:text-white'
                }`}
              >
                {f.replace('-', ' ')}
              </button>
            ))}
          </div>
          
          <div className="relative w-full md:w-80 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-dim group-focus-within:text-primary transition-colors" size={16} />
            <input 
              type="text" 
              placeholder="Search tasks..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent border-0 pl-11 pr-4 py-2.5 text-sm outline-none placeholder:text-text-dim"
            />
          </div>
        </div>

        {/* Task List Table-ish */}
        <div className="flex flex-col gap-2">
          {/* List Header */}
          <div className="grid grid-cols-12 px-6 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-text-dim border-b border-border">
            <div className="col-span-7 flex items-center gap-2">
              <ArrowUpDown size={10} /> Title
            </div>
            <div className="col-span-2">Category</div>
            <div className="col-span-2">Priority</div>
            <div className="col-span-1 text-right">Actions</div>
          </div>

          <AnimatePresence mode="popLayout">
            {isLoading ? (
              <div className="py-20 text-center text-text-dim font-medium">Scanning backlog...</div>
            ) : filteredTasks.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-24 text-center glass-card border-dashed"
              >
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-border">
                  <CheckCircle2 size={32} className="text-text-dim" />
                </div>
                <h3 className="text-white font-bold text-xl mb-1">Clear Horizon</h3>
                <p className="text-text-dim">No tasks match your current view.</p>
              </motion.div>
            ) : (
              filteredTasks.map((task: any, i) => (
                <motion.div
                  key={task._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: i * 0.03 }}
                  className="group grid grid-cols-12 items-center px-6 py-4 rounded-2xl hover:bg-white/5 border border-transparent hover:border-border transition-all cursor-pointer"
                  onClick={() => toggleStatus(task)}
                >
                  <div className="col-span-7 flex items-center gap-4">
                    <button className={`transition-all ${task.status === 'done' ? 'text-secondary' : 'text-text-dim group-hover:text-primary'}`}>
                      {task.status === 'done' ? <CheckCircle2 size={22} fill="currentColor" className="text-secondary bg-background rounded-full" /> : <Circle size={22} />}
                    </button>
                    <span className={`font-semibold text-sm transition-all ${task.status === 'done' ? 'text-text-dim line-through opacity-50' : 'text-white'}`}>
                      {task.title}
                    </span>
                  </div>

                  <div className="col-span-2">
                    <span className="flex items-center gap-2 text-[10px] font-bold text-text-dim uppercase tracking-wider">
                      <Tag size={10} className="text-primary-light" />
                      {task.category}
                    </span>
                  </div>

                  <div className="col-span-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full ${
                        task.priority >= 4 ? 'bg-accent shadow-[0_0_8px_var(--color-accent)]' : 
                        task.priority >= 3 ? 'bg-primary shadow-[0_0_8px_var(--color-primary)]' : 
                        'bg-secondary shadow-[0_0_8px_var(--color-secondary)]'
                      }`} />
                      <span className="text-[10px] font-bold text-text-dim uppercase tracking-wider">
                        {task.priority >= 4 ? 'Urgent' : task.priority >= 3 ? 'High' : 'Normal'}
                      </span>
                    </div>
                  </div>

                  <div className="col-span-1 flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={(e) => { e.stopPropagation(); deleteTask(task._id); }}
                      className="p-2 hover:bg-red-500/10 rounded-xl text-text-dim hover:text-red-500 transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                    <button className="p-2 hover:bg-white/10 rounded-xl text-text-dim hover:text-white transition-all">
                      <MoreVertical size={16} />
                    </button>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>
    </AppLayout>
  );
};

export default TasksPage;

