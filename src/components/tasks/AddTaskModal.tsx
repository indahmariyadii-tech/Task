'use client';

import React, { useState, useEffect } from 'react';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Calendar, Flag, Clock } from 'lucide-react';

interface AddTaskModalProps {
  isOpen: boolean;
  initialDate?: Date;
  onClose: () => void;
  onTaskAdded: () => void;
}

const AddTaskModal: React.FC<AddTaskModalProps> = ({ isOpen, initialDate, onClose, onTaskAdded }) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('General');
  const [priority, setPriority] = useState(3);
  const [dueDate, setDueDate] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen && initialDate) {
      setDueDate(initialDate.toISOString().split('T')[0]);
    } else {
      setDueDate('');
    }
  }, [isOpen, initialDate]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          category,
          priority,
          dueDate: dueDate || undefined,
          status: 'todo',
        }),

      });

      if (response.ok) {
        setTitle('');
        setCategory('General');
        setPriority(3);
        onTaskAdded();
        onClose();
      }
    } catch (error) {
      console.error('Failed to add task:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[1000]"
        />
      )}
      {isOpen && (
        <motion.div
          key="modal"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-[1001] px-4"
        >

            <div className="card glass p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">New Task</h2>
                <button 
                  onClick={onClose}
                  className="p-2 hover:bg-glass-bg rounded-lg text-text-muted transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-text-muted">Task Title</label>
                  <input
                    type="text"
                    placeholder="What needs to be done?"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    autoFocus
                    className="w-full"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-text-muted">Category</label>
                    <select 
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full"
                    >
                      <option value="General">General</option>
                      <option value="Work">Work</option>
                      <option value="Personal">Personal</option>
                      <option value="Health">Health</option>
                      <option value="Finance">Finance</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-text-muted">Priority</label>
                    <select 
                      value={priority}
                      onChange={(e) => setPriority(Number(e.target.value))}
                      className="w-full"
                    >
                      <option value={1}>Low</option>
                      <option value={3}>Medium</option>
                      <option value={5}>High</option>
                    </select>
                  </div>
                </div>



                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-text-muted">Due Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
                    <input
                      type="date"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      className="pl-10 w-full"
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={isSubmitting || !title.trim()}
                  className="btn-primary w-full justify-center mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Creating...' : (
                    <>
                      <Plus size={20} />
                      Create Task
                    </>
                  )}
                </button>
              </form>
            </div>
          </motion.div>
      )}


      <style jsx>{`
        .fixed { position: fixed; }
        .inset-0 { top: 0; right: 0; bottom: 0; left: 0; }
        .z-\[1000\] { z-index: 1000; }
        .z-\[1001\] { z-index: 1001; }
        .bg-black\/60 { background-color: rgba(0, 0, 0, 0.6); }
        .backdrop-blur-sm { backdrop-filter: blur(4px); }
        .left-1\/2 { left: 50%; }
        .top-1\/2 { top: 50%; }
        .-translate-x-1\/2 { transform: translateX(-50%); }
        .-translate-y-1\/2 { transform: translateY(-50%); }
        .max-w-md { max-width: 28rem; }
      `}</style>
    </AnimatePresence>
  );
};

export default AddTaskModal;
