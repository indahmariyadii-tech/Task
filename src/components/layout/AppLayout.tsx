'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import AddTaskModal from '../tasks/AddTaskModal';

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [initialDate, setInitialDate] = useState<Date | undefined>(undefined);

  useEffect(() => {
    const handleOpenModal = (e: any) => {
      if (e.detail?.date) {
        setInitialDate(new Date(e.detail.date));
      } else {
        setInitialDate(undefined);
      }
      setIsModalOpen(true);
    };
    window.addEventListener('open-task-modal', handleOpenModal);
    return () => window.removeEventListener('open-task-modal', handleOpenModal);
  }, []);


  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <main className="main-content flex-1">
        {children}
      </main>
      
      <AddTaskModal 
        isOpen={isModalOpen} 
        initialDate={initialDate}
        onClose={() => setIsModalOpen(false)} 
        onTaskAdded={() => {
          window.dispatchEvent(new CustomEvent('task-added'));
        }} 
      />


      <style jsx>{`
        .min-h-screen { min-height: 100vh; }
        .flex { display: flex; }
        .flex-1 { flex: 1; }
      `}</style>
    </div>
  );
};

export default AppLayout;
