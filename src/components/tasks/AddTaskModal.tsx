'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Calendar, Flag, Tag, AlertCircle } from 'lucide-react';

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
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-background/80 backdrop-blur-md z-[1000]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-xl z-[1001] px-4"
          >
            <div className="glass-card p-8 border-white/10 shadow-2xl">
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-primary/10 text-primary">
                    <Plus size={20} />
                  </div>
                  <h2 className="text-2xl font-display font-bold tracking-tight text-white">Create New Task</h2>
                </div>
                <button 
                  onClick={onClose}
                  className="p-2 hover:bg-white/5 rounded-xl text-text-dim hover:text-white transition-all"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-dim ml-1">Objective</label>
                  <input
                    type="text"
                    placeholder="Capture your next breakthrough..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    autoFocus
                    className="input-premium py-4 text-lg font-medium"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-dim ml-1">Classification</label>
                    <div className="relative">
                      <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-text-dim" size={16} />
                      <select 
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="input-premium pl-12 appearance-none cursor-pointer"
                      >
                        {['General', 'Work', 'Personal', 'Health', 'Finance', 'Study'].map(cat => (
                          <option key={cat} value={cat} className="bg-card text-white">{cat}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-dim ml-1">Impact Level</label>
                    <div className="relative">
                      <Flag className="absolute left-4 top-1/2 -translate-y-1/2 text-text-dim" size={16} />
                      <select 
                        value={priority}
                        onChange={(e) => setPriority(Number(e.target.value))}
                        className="input-premium pl-12 appearance-none cursor-pointer"
                      >
                        <option value={1} className="bg-card text-white">Low - Minor</option>
                        <option value={3} className="bg-card text-white">Medium - Standard</option>
                        <option value={5} className="bg-card text-white">High - Critical</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-dim ml-1">Target Completion</label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-text-dim" size={16} />
                    <input
                      type="date"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      className="input-premium pl-12"
                    />
                  </div>
                </div>

                <div className="pt-4 flex gap-4">
                  <button 
                    type="button"
                    onClick={onClose}
                    className="premium-button-ghost flex-1 justify-center"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    disabled={isSubmitting || !title.trim()}
                    className="premium-button flex-1 justify-center disabled:opacity-50 disabled:cursor-not-allowed group"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}><Plus size={18} /></motion.div>
                        Optimizing...
                      </span>
                    ) : (
                      <>
                        <Plus size={20} className="group-hover:rotate-90 transition-transform" />
                        <span>Initialize Task</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AddTaskModal;
