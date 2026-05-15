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
import { ITask } from '@/models/Task';

const CalendarPage = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [tasks, setTasks] = useState<ITask[]>([]);

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
        <div className="grid grid-cols-7 bg-white/5 border-b border-white/5">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="py-5 text-center text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 grid-rows-6 h-700">
          {days.map((day, i) => {
            const dayTasks = getTasksForDay(day);
            const isToday = isSameDay(day, new Date());
            const isCurrentMonth = isSameMonth(day, monthStart);

            return (
              <div 
                key={i} 
                onClick={() => {
                  if (isCurrentMonth) {
                    window.dispatchEvent(new CustomEvent('open-task-modal', { 
                      detail: { date: day } 
                    }));
                  }
                }}
                className={`p-3 border-r border-b border-white/5 relative transition-all hover:bg-white/[0.02] cursor-pointer flex flex-col ${
                  !isCurrentMonth ? 'opacity-20 pointer-events-none' : ''
                }`}
              >
                <div className="flex justify-center mb-2">
                  <span className={`text-xs font-black w-7 h-7 flex items-center justify-center rounded-lg transition-all ${
                    isToday ? 'bg-primary text-white shadow-lg shadow-primary/30 scale-110' : 'text-text-muted/60'
                  }`}>
                    {format(day, 'd')}
                  </span>
                </div>

                <div className="flex flex-col gap-1.5 mt-2">
                  {dayTasks.slice(0, 3).map((task: any) => (
                    <div 
                      key={task._id} 
                      className={`text-[10px] p-1.5 rounded-lg border flex items-center gap-1.5 transition-all hover:scale-[1.02] ${
                        task.status === 'done' 
                          ? 'bg-white/5 border-white/5 text-text-muted/50 line-through' 
                          : 'bg-white/5 border-white/10 text-white shadow-sm'
                      }`}
                    >
                      <div className={`w-1 h-3 rounded-full ${
                        task.priority >= 4 ? 'bg-accent' : task.priority >= 3 ? 'bg-primary' : 'bg-secondary'
                      }`} />
                      <span className="truncate font-semibold">{task.title}</span>
                    </div>
                  ))}
                  {dayTasks.length > 3 && (
                    <div className="text-[10px] text-text-muted font-bold pl-1.5">
                      + {dayTasks.length - 3} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <CalendarIcon className="text-primary" size={24} />
            Upcoming Events
          </h2>
          <div className="flex flex-col gap-4">
            {tasks.filter(t => t.dueDate && new Date(t.dueDate) >= new Date()).length === 0 ? (
              <div className="card glass p-8 text-center text-text-muted">
                No upcoming events scheduled.
              </div>
            ) : (
              tasks.filter(t => t.dueDate && new Date(t.dueDate) >= new Date()).slice(0, 3).map((task) => (
                <div key={task._id} className="card glass p-5 flex items-center justify-between group hover:border-primary/30 transition-all">
                  <div className="flex items-center gap-5">
                    <div className="p-4 rounded-2xl bg-primary/10 text-primary border border-primary/20 group-hover:bg-primary group-hover:text-white transition-all">
                      <CalendarIcon size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg group-hover:text-primary transition-colors">{task.title}</h4>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-text-muted flex items-center gap-1.5 font-medium">
                          <Clock size={12} className="text-secondary" />
                          {task.dueDate ? format(new Date(task.dueDate), 'PPP') : 'No due date'}
                        </span>
                        <span className="text-[10px] bg-white/5 px-2 py-0.5 rounded-full border border-white/5 text-text-muted font-bold uppercase tracking-wider">
                          {task.category}
                        </span>

                      </div>
                    </div>
                  </div>
                  <button className="btn-ghost text-xs px-6 py-2.5 rounded-xl hover:bg-primary hover:text-white border-0">Details</button>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <h2 className="text-2xl font-bold mb-0 opacity-0 invisible">Sidebar</h2>
          <div className="card glass bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20 p-8 relative overflow-hidden group">
            <div className="absolute -right-8 -top-8 w-24 h-24 bg-primary/20 rounded-full blur-3xl group-hover:bg-primary/30 transition-all" />
            <div className="flex items-center gap-4 mb-6 relative z-10">
              <div className="p-3 rounded-xl bg-white/10 text-white border border-white/20">
                <Clock size={24} />
              </div>
              <h3 className="font-bold text-xl">Next Deadline</h3>
            </div>
            <p className="text-sm text-text-muted mb-8 leading-relaxed relative z-10">
              Your next major task is due in <span className="text-white font-bold">2 days</span>. Make sure to stay on track!
            </p>
            <button className="btn-primary w-full shadow-lg shadow-primary/20 py-4 relative z-10">Set Reminder</button>
          </div>
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
