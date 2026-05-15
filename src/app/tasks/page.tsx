'use client';

import React, { useState, useEffect } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { motion } from 'framer-motion';
import { 
  Search, 
  Filter, 
  MoreVertical, 
  CheckCircle2, 
  Circle, 
  Clock,
  Trash2,
  Edit2
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
      if (Array.isArray(data)) {
        setTasks(data);
      }
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
    const newStatus = task.status === 'done' ? 'todo' : 'done';
    try {
      const response = await fetch(`/api/tasks/${task._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (response.ok) {
        fetchTasks();
      }
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  };

  const deleteTask = async (id: string) => {
    if (!confirm('Are you sure you want to delete this task?')) return;
    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        fetchTasks();
      }
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
      <div className="page-header">
        <div>
          <h1 className="page-title">My Tasks</h1>
          <p className="page-subtitle">Organize your day, achieve your goals.</p>
        </div>
        <button 
          onClick={() => window.dispatchEvent(new CustomEvent('open-task-modal'))}
          className="btn-primary"
        >
          <span className="text-lg leading-none mb-[2px]">+</span> Add Task
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-6 mb-8 items-start md:items-center justify-between">
        <div className="task-filters !mb-0 !pb-0">
          {['all', 'todo', 'in-progress', 'done'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f as any)}
              className={`filter-btn ${filter === f ? 'active' : 'inactive'}`}
            >
              {f.replace('-', ' ')}
            </button>
          ))}
        </div>
        
        <div className="relative w-full max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
          <input 
            type="text" 
            placeholder="Search tasks or categories..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 w-full bg-glass-bg border-glass-border focus:border-primary"
          />
        </div>
      </div>


      <div className="task-list">
        {isLoading ? (
          <div className="py-10 text-white font-medium">Loading tasks...</div>
        ) : filteredTasks.length === 0 ? (
          <div className="card glass text-center py-20 text-text-muted">
            No tasks found. Time to relax or create a new one!
          </div>
        ) : (
            filteredTasks.map((task: any, i) => (
              <motion.div
                key={task._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="task-item group hover:shadow-2xl hover:shadow-primary/5"
              >
                <div className="task-content">
                  <button 
                    onClick={() => toggleStatus(task)}
                    className={`status-btn transition-transform hover:scale-110 ${task.status === 'done' ? 'text-secondary' : 'text-white/20 hover:text-primary'}`}
                  >
                    {task.status === 'done' ? <CheckCircle2 size={26} /> : <Circle size={26} />}
                  </button>
                  <div className="flex-1">
                    <h3 className={`task-title text-lg font-bold transition-all ${task.status === 'done' ? 'line-through text-text-muted/50' : 'group-hover:text-primary'}`}>
                      {task.title}
                    </h3>
                    <div className="task-meta mt-2">
                      <span className="flex items-center gap-2 bg-white/5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider text-text-muted border border-white/5 group-hover:border-primary/20 transition-colors">
                        <div className={`w-2 h-2 rounded-full ${
                          task.priority >= 4 ? 'bg-accent shadow-[0_0_8px_var(--accent)]' : 
                          task.priority >= 3 ? 'bg-primary shadow-[0_0_8px_var(--primary)]' : 
                          'bg-secondary shadow-[0_0_8px_var(--secondary)]'
                        }`} />
                        {task.category}
                      </span>
                      {task.dueDate && (
                        <span className="flex items-center gap-2 bg-white/5 px-3 py-1 rounded-full text-[11px] font-bold text-text-muted border border-white/5">
                          <Clock size={12} className="text-secondary" />
                          {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="task-actions opacity-0 group-hover:opacity-100 flex items-center gap-2 transition-all transform translate-x-4 group-hover:translate-x-0">
                  <button className="p-2 hover:bg-white/5 rounded-xl text-text-muted hover:text-white transition-colors">
                    <Edit2 size={18} />
                  </button>
                  <button 
                    onClick={() => deleteTask(task._id)}
                    className="p-2 hover:bg-red-500/10 rounded-xl text-text-muted hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                  <button className="p-2 hover:bg-white/5 rounded-xl text-text-muted hover:text-white transition-colors">
                    <MoreVertical size={18} />
                  </button>
                </div>
              </motion.div>
            ))

        )}
      </div>
    </AppLayout>
  );
};

export default TasksPage;
