'use client';

import React, { useState, useEffect } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { motion } from 'framer-motion';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon,
  Clock,
  Circle
} from 'lucide-react';
import { format } from 'date-fns/format';
import { addMonths } from 'date-fns/addMonths';
import { subMonths } from 'date-fns/subMonths';
import { startOfMonth } from 'date-fns/startOfMonth';
import { endOfMonth } from 'date-fns/endOfMonth';
import { startOfWeek } from 'date-fns/startOfWeek';
import { endOfWeek } from 'date-fns/endOfWeek';
import { isSameMonth } from 'date-fns/isSameMonth';
import { isSameDay } from 'date-fns/isSameDay';
import { addDays } from 'date-fns/addDays';
import { eachDayOfInterval } from 'date-fns/eachDayOfInterval';

interface Task {
  _id: string;
  title: string;
  dueDate: string;
  status: string;
  priority: number;
}

const CalendarPage = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
  }, []);

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const days = eachDayOfInterval({ start: startDate, end: endDate });

  const getTasksForDay = (day: Date) => {
    return tasks.filter(task => task.dueDate && isSameDay(new Date(task.dueDate), day));
  };

  return (
    <AppLayout>
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-4xl font-bold mb-2">Calendar</h1>
          <p className="text-text-muted">Schedule and manage your upcoming tasks</p>
        </div>
        <div className="flex items-center gap-4 bg-glass-bg p-2 rounded-2xl border border-glass-border">
          <button 
            onClick={prevMonth}
            className="p-2 hover:bg-glass-bg rounded-xl text-text-muted hover:text-white transition-all"
          >
            <ChevronLeft size={24} />
          </button>
          <span className="text-xl font-bold px-4 min-w-[200px] text-center">
            {format(currentDate, 'MMMM yyyy')}
          </span>
          <button 
            onClick={nextMonth}
            className="p-2 hover:bg-glass-bg rounded-xl text-text-muted hover:text-white transition-all"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>

      <div className="card glass p-0 overflow-hidden">
        <div className="grid grid-cols-7 bg-glass-bg border-b border-glass-border">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="py-4 text-center text-sm font-bold text-text-muted uppercase tracking-widest">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 grid-rows-6 h-[720px]">
          {days.map((day, i) => {
            const dayTasks = getTasksForDay(day);
            const isToday = isSameDay(day, new Date());
            const isCurrentMonth = isSameMonth(day, monthStart);

            return (
              <div 
                key={i} 
                className={`p-4 border-r border-b border-glass-border relative transition-all hover:bg-glass-bg/50 ${
                  !isCurrentMonth ? 'opacity-20' : ''
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className={`text-sm font-bold w-8 h-8 flex items-center justify-center rounded-full ${
                    isToday ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'text-text-muted'
                  }`}>
                    {format(day, 'd')}
                  </span>
                </div>

                <div className="flex flex-col gap-2 overflow-y-auto max-h-[80px] custom-scrollbar">
                  {dayTasks.map((task) => (
                    <motion.div 
                      key={task._id}
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="text-[10px] p-1.5 rounded-lg bg-primary/10 border border-primary/20 text-white truncate flex items-center gap-1"
                    >
                      <Circle size={8} className={task.priority >= 4 ? 'fill-accent text-accent' : 'fill-primary text-primary'} />
                      {task.title}
                    </motion.div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-bold mb-6">Upcoming Events</h2>
          <div className="flex flex-col gap-4">
            {tasks.filter(t => t.dueDate && new Date(t.dueDate) >= new Date()).slice(0, 3).map((task) => (
              <div key={task._id} className="card glass p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-primary/10 text-primary">
                    <CalendarIcon size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold">{task.title}</h4>
                    <span className="text-xs text-text-muted">
                      {format(new Date(task.dueDate), 'PPP')} at {format(new Date(task.dueDate), 'p')}
                    </span>
                  </div>
                </div>
                <button className="btn-ghost text-xs">View Details</button>
              </div>
            ))}
          </div>
        </div>

        <div className="card glass bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20 p-8">
          <div className="flex items-center gap-3 mb-4">
            <Clock className="text-primary" size={24} />
            <h3 className="font-bold">Next Deadline</h3>
          </div>
          <p className="text-sm text-text-muted mb-6">
            Your next major task is due in 2 days. Make sure to stay on track!
          </p>
          <button className="btn-primary w-full">Set Reminder</button>
        </div>
      </div>

      <style jsx>{`
        .h-\[720px\] { height: 720px; }
        .custom-scrollbar::-webkit-scrollbar {
          width: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: var(--glass-border);
          border-radius: 2px;
        }
      `}</style>
    </AppLayout>
  );
};

export default CalendarPage;
