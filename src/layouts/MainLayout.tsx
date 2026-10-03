import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/common/Sidebar';
import { TopBar } from '../components/common/TopBar';
import { ToastContainer } from '../components/common/ToastContainer';

export const MainLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-[#080B12] text-slate-100 font-sans">
      {/* Persistent Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        <TopBar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl w-full mx-auto animate-in fade-in duration-200">
          <Outlet />
        </main>

        {/* Global Footer info bar */}
        <footer className="py-4 px-6 border-t border-[#182236] bg-[#0A0D16] text-xs font-mono text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
            <span>KRATOS 0.1 PLATFORM • AI ML REPRODUCIBILITY ENGINE</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>ENV: CUDA 12.2 / TORCH 2.2</span>
            <span>BUILD: v0.1.4-PROTOTYPE</span>
          </div>
        </footer>
      </div>

      {/* Floating interactive toasts */}
      <ToastContainer />
    </div>
  );
};
