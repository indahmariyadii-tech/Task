'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import AddTaskModal from '../tasks/AddTaskModal';

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const handleOpenModal = () => setIsModalOpen(true);
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
        onClose={() => setIsModalOpen(false)} 
        onTaskAdded={() => {
          // We can use a custom event or a shared state to refresh tasks
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
