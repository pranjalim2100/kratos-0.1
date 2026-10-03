import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  FlaskConical,
  FileCheck,
  Settings,
  Cpu,
  ChevronRight,
  ShieldCheck,
  Layers,
  Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { isRunning, currentPaper } = useApp();

  const navItems = [
    {
      to: '/',
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      to: '/papers',
      label: 'Papers',
      icon: FileText,
      badge: '4',
    },
    {
      to: '/experiments',
      label: 'Experiments',
      icon: FlaskConical,
      badge: isRunning ? 'RUNNING' : null,
      badgeColor: isRunning ? 'bg-sky-500/20 text-sky-400 border-sky-500/40 animate-pulse' : undefined,
    },
    {
      to: '/reports',
      label: 'Reports',
      icon: FileCheck,
      badge: null,
    },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-[#0A0D16] border-r border-[#1B253B] flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand / Logo */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-[#1B253B] bg-[#0C101B]/80">
          <NavLink to="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-cyan-600 via-sky-500 to-indigo-500 p-0.5 shadow-glow-cyan flex items-center justify-center transition-transform group-hover:scale-105">
              <div className="w-full h-full bg-[#0B0F19] rounded-[7px] flex items-center justify-center">
                <Cpu className="w-5 h-5 text-kratos-cyan" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold tracking-wider text-base text-white group-hover:text-kratos-cyan transition-colors">
                  KRATOS
                </span>
                <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/40 text-kratos-cyan">
                  0.1
                </span>
              </div>
              <p className="text-[10px] font-mono tracking-tight text-slate-400">
                REPRODUCIBILITY ENG
              </p>
            </div>
          </NavLink>
        </div>

        {/* Live Target Paper banner */}
        <div className="px-4 pt-4 pb-2">
          <div className="p-2.5 rounded-lg bg-[#111728] border border-[#212E4A] flex items-center justify-between">
            <div className="overflow-hidden">
              <div className="flex items-center gap-1 text-[10px] uppercase font-mono text-cyan-400 font-semibold">
                <Sparkles className="w-3 h-3" />
                <span>Active Target</span>
              </div>
              <p className="text-xs font-medium text-slate-200 truncate mt-0.5">
                {currentPaper.model} / {currentPaper.dataset}
              </p>
            </div>
            {isRunning && (
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping ml-2 flex-shrink-0" />
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <div className="px-3 pb-2 text-[10px] font-mono uppercase tracking-wider text-slate-400">
            Platform
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all group ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-950/70 to-slate-900/60 text-cyan-300 border border-cyan-500/30 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-[#131B2D]'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className="flex items-center gap-3">
                      <Icon
                        className={`w-4 h-4 transition-colors ${
                          isActive
                            ? 'text-kratos-cyan'
                            : 'text-slate-400 group-hover:text-slate-300'
                        }`}
                      />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                          item.badgeColor ||
                          'bg-[#19233A] text-slate-400 border-[#273859]'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            );
          })}

          <div className="pt-6 px-3 pb-2 text-[10px] font-mono uppercase tracking-wider text-slate-400">
            Workflows
          </div>

          <NavLink
            to="/upload"
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? 'bg-cyan-950/70 text-cyan-300 border border-cyan-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-[#131B2D]'
              }`
            }
          >
            <Layers className="w-4 h-4 text-cyan-400" />
            <span>Upload Paper</span>
          </NavLink>

          <NavLink
            to="/experiment/running"
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? 'bg-cyan-950/70 text-cyan-300 border border-cyan-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-[#131B2D]'
              }`
            }
          >
            <FlaskConical className="w-4 h-4 text-indigo-400" />
            <span>Live Experiment</span>
          </NavLink>

          <NavLink
            to="/results/comparison"
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? 'bg-cyan-950/70 text-cyan-300 border border-cyan-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-[#131B2D]'
              }`
            }
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Results Comparison</span>
          </NavLink>
        </nav>

        {/* Bottom Section */}
        <div className="p-3 border-t border-[#1B253B] space-y-2 bg-[#090D17]">
          <NavLink
            to="/settings"
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-cyan-950/70 text-cyan-300 border border-cyan-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-[#131B2D]'
              }`
            }
          >
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </NavLink>

          {/* User profile card */}
          <div className="p-2.5 rounded-lg bg-[#111728] border border-[#212E4A] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center text-xs font-bold text-white shadow-inner">
                  PM
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-[#111728] rounded-full"></span>
              </div>
              <div className="overflow-hidden">
                <div className="text-xs font-semibold text-slate-200 truncate">
                  Pranjali More
                </div>
                <div className="text-[10px] font-mono text-cyan-400 truncate">
                  Lead ML Researcher
                </div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </div>
        </div>
      </aside>
    </>
  );
};
