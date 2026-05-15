'use client';

import React from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  Lightbulb,
  ArrowRight,
  Plus
} from 'lucide-react';
import { ITask } from '@/models/Task';

const Dashboard = () => {
  const [tasks, setTasks] = React.useState<ITask[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

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

  React.useEffect(() => {
    fetchTasks();

    const handleTaskAdded = () => {
      fetchTasks();
    };

    window.addEventListener('task-added', handleTaskAdded);
    return () => window.removeEventListener('task-added', handleTaskAdded);
  }, []);

  const completedTasks = tasks.filter(t => t.status === 'done').length;
  const totalTasks = tasks.length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const highPriorityTasks = tasks.filter(t => t.priority >= 4 && t.status !== 'done').length;

  return (
    <AppLayout>
      <header className="mb-12">
        <h2 className="text-sm text-primary uppercase tracking-widest font-bold mb-2">Welcome Back</h2>
        <h1 className="text-4xl font-bold">Your Day at a Glance</h1>
      </header>

      <div className="grid-dashboard">
        {/* Stats Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card glass flex flex-col gap-4"
        >
          <div className="flex justify-between items-start">
            <div className="p-3 rounded-xl bg-primary/10 text-primary">
              <TrendingUp size={24} />
            </div>
            <span className="badge badge-work">Busy</span>
          </div>
          <div>
            <h3 className="text-text-muted text-sm font-medium mb-1">Busyness Level</h3>
            <div className="text-3xl font-bold">{completionRate < 100 ? '85%' : 'Done'}</div>
          </div>
          <div className="w-full bg-glass-border h-2 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: '85%' }}
              className="h-full bg-gradient-to-r from-primary to-secondary"
            />
          </div>
          <p className="text-xs text-text-muted">You have {highPriorityTasks} high priority tasks today.</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card glass flex flex-col gap-4"
        >
          <div className="flex justify-between items-start">
            <div className="p-3 rounded-xl bg-secondary/10 text-secondary">
              <Clock size={24} />
            </div>
          </div>
          <div>
            <h3 className="text-text-muted text-sm font-medium mb-1">Focus Time</h3>
            <div className="text-3xl font-bold">4h 12m</div>
          </div>
          <p className="text-xs text-text-muted">+12% from yesterday</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card glass flex flex-col gap-4"
        >
          <div className="flex justify-between items-start">
            <div className="p-3 rounded-xl bg-accent/10 text-accent">
              <CheckCircle2 size={24} />
            </div>
          </div>
          <div>
            <h3 className="text-text-muted text-sm font-medium mb-1">Tasks Completed</h3>
            <div className="text-3xl font-bold">{completedTasks}/{totalTasks}</div>
          </div>
          <p className="text-xs text-text-muted">
            {completionRate === 100 ? "All caught up! Great job." : "Keep it up! You're almost there."}
          </p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">
        {/* Suggestion Section */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Recent Tasks</h2>
            <button className="btn-ghost flex items-center gap-2 text-sm">
              View All <ArrowRight size={16} />
            </button>
          </div>
          
          <div className="flex flex-col gap-4">
            {isLoading ? (
              <div className="text-text-muted">Loading tasks...</div>
            ) : tasks.length === 0 ? (
              <div className="text-text-muted">No tasks yet. Create one to get started!</div>
            ) : (
              tasks.slice(0, 3).map((task, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + (i * 0.1) }}
                  className="card flex items-center justify-between p-4 bg-glass-bg border-glass-border hover:border-primary cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-2 h-2 rounded-full ${task.priority >= 4 ? 'bg-accent' : task.priority >= 3 ? 'bg-primary' : 'bg-secondary'}`} />
                    <div>
                      <h4 className={`font-semibold ${task.status === 'done' ? 'line-through text-text-muted' : ''}`}>{task.title}</h4>
                      <span className="text-xs text-text-muted">{task.category}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded bg-glass-border ${
                      task.status === 'done' ? 'text-secondary' : 'text-primary'
                    }`}>
                      {task.status}
                    </span>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>

        {/* AI Insight */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Daily Insight</h2>
          <div className="card bg-gradient-to-br from-primary/20 to-secondary/20 border-primary/30 p-6">
            <div className="flex items-center gap-3 mb-4">
              <Lightbulb className="text-secondary" size={24} />
              <h3 className="font-bold">Productivity Tip</h3>
            </div>
            <p className="text-sm leading-relaxed mb-6">
              You are most productive between 10:00 AM and 12:00 PM. We suggest scheduling your high-focus tasks during this window.
            </p>
            <button className="btn-primary w-full text-sm">Analyze Schedule</button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .text-primary { color: var(--primary); }
        .text-secondary { color: var(--secondary); }
        .text-accent { color: var(--accent); }
        .text-text-muted { color: var(--text-muted); }
        .bg-primary\/10 { background-color: rgba(124, 77, 255, 0.1); }
        .bg-secondary\/10 { background-color: rgba(0, 229, 255, 0.1); }
        .bg-accent\/10 { background-color: rgba(255, 64, 129, 0.1); }
        .bg-glass-bg { background-color: var(--glass-bg); }
        .border-glass-border { border-color: var(--glass-border); }
        .text-sm { font-size: 0.875rem; }
        .text-xs { font-size: 0.75rem; }
        .text-2xl { font-size: 1.5rem; }
        .text-3xl { font-size: 1.875rem; }
        .text-4xl { font-size: 2.25rem; }
        .uppercase { text-transform: uppercase; }
        .tracking-widest { letter-spacing: 0.1em; }
        .mb-2 { margin-bottom: 0.5rem; }
        .mb-4 { margin-bottom: 1rem; }
        .mb-6 { margin-bottom: 1.5rem; }
        .mb-12 { margin-bottom: 3rem; }
        .mt-12 { margin-top: 3rem; }
        .p-2 { padding: 0.5rem; }
        .p-3 { padding: 0.75rem; }
        .p-4 { padding: 1rem; }
        .p-6 { padding: 1.5rem; }
        .rounded-lg { border-radius: 0.5rem; }
        .rounded-xl { border-radius: 0.75rem; }
        .rounded-full { border-radius: 9999px; }
        .font-bold { font-weight: 700; }
        .font-semibold { font-weight: 600; }
        .font-medium { font-weight: 500; }
        .flex { display: flex; }
        .flex-col { flex-direction: column; }
        .items-center { align-items: center; }
        .items-start { align-items: flex-start; }
        .justify-between { justify-content: space-between; }
        .gap-2 { gap: 0.5rem; }
        .gap-3 { gap: 0.75rem; }
        .gap-4 { gap: 1rem; }
        .gap-8 { gap: 2rem; }
        .grid { display: grid; }
        .grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)); }
        .lg\:grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
        .lg\:col-span-2 { grid-column: span 2 / span 2; }
        .w-2 { width: 0.5rem; }
        .h-2 { height: 0.5rem; }
        .w-full { width: 100%; }
        .h-full { height: 100%; }
        .h-2 { height: 0.5rem; }
        .overflow-hidden { overflow: hidden; }
        .leading-relaxed { line-height: 1.625; }
      `}</style>
    </AppLayout>
  );
};

export default Dashboard;
