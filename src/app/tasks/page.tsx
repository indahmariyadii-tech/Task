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

  const filteredTasks = tasks.filter(t => filter === 'all' || t.status === filter);

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

      <div className="task-filters">
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
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="task-item"
            >
              <div className="task-content">
                <button 
                  onClick={() => toggleStatus(task)}
                  className={`status-btn ${task.status === 'done' ? 'done' : 'todo'}`}
                >
                  {task.status === 'done' ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                </button>
                <div>
                  <h3 className={`task-title ${task.status === 'done' ? 'done' : ''}`}>
                    {task.title}
                  </h3>
                  <div className="task-meta">
                    <span className="task-badge">
                      <div className={`priority-dot ${
                        task.priority >= 4 ? 'priority-high' : task.priority >= 3 ? 'priority-medium' : 'priority-low'
                      }`} />
                      {task.category}
                    </span>
                    {task.dueDate && (
                      <span className="task-badge">
                        <Clock size={12} />
                        {new Date(task.dueDate).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="task-actions">
                <button className="icon-btn">
                  <Edit2 size={18} />
                </button>
                <button 
                  onClick={() => deleteTask(task._id)}
                  className="icon-btn danger"
                >
                  <Trash2 size={18} />
                </button>
                <button className="icon-btn">
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
