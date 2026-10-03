import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  Bell,
  Menu,
  Plus,
  Cpu,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  Terminal,
  Activity,
  Compass,
  ArrowRight,
  Layers,
  FlaskConical,
  ShieldCheck,
  FileCheck
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Modal } from './Modal';

interface TopBarProps {
  onToggleSidebar: () => void;
  title?: string;
}

export const TopBar: React.FC<TopBarProps> = ({ onToggleSidebar, title }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isRunning, currentEpoch, totalEpochs, toasts } = useApp();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showTour, setShowTour] = useState(false);

  // Generate breadcrumb items from route
  const getBreadcrumbs = () => {
    const path = location.pathname;
    if (path === '/') return [{ label: 'Dashboard', to: '/' }];
    if (path === '/upload') return [{ label: 'Dashboard', to: '/' }, { label: 'Upload Paper', to: '/upload' }];
    if (path === '/analysis') return [{ label: 'Dashboard', to: '/' }, { label: 'Paper Analysis', to: '/analysis' }];
    if (path === '/experiment/config') return [{ label: 'Dashboard', to: '/' }, { label: 'Configure Reproduction', to: '/experiment/config' }];
    if (path === '/experiment/running') return [{ label: 'Dashboard', to: '/' }, { label: 'Live Experiment', to: '/experiment/running' }];
    if (path === '/results/comparison') return [{ label: 'Dashboard', to: '/' }, { label: 'Results Comparison', to: '/results/comparison' }];
    if (path === '/report') return [{ label: 'Dashboard', to: '/' }, { label: 'Reproducibility Report', to: '/report' }];
    if (path === '/papers') return [{ label: 'Dashboard', to: '/' }, { label: 'Paper Library', to: '/papers' }];
    if (path === '/experiments') return [{ label: 'Dashboard', to: '/' }, { label: 'Experiments', to: '/experiments' }];
    if (path === '/reports') return [{ label: 'Dashboard', to: '/' }, { label: 'Reports', to: '/reports' }];
    if (path === '/settings') return [{ label: 'Dashboard', to: '/' }, { label: 'Settings', to: '/settings' }];
    return [{ label: 'Dashboard', to: '/' }];
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <header className="h-16 bg-[#0B0F19]/90 backdrop-blur-md border-b border-[#1B253B] px-4 lg:px-8 flex items-center justify-between sticky top-0 z-30">
      {/* Left: Mobile trigger & Breadcrumbs */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-[#162035] focus:outline-none"
          aria-label="Toggle Navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex flex-col">
          {/* Breadcrumb nav */}
          <nav className="flex items-center gap-1.5 text-xs font-mono text-slate-400">
            {breadcrumbs.map((crumb, idx) => (
              <React.Fragment key={crumb.to}>
                {idx > 0 && <ChevronRight className="w-3 h-3 text-slate-400" />}
                {idx === breadcrumbs.length - 1 ? (
                  <span className="text-cyan-400 font-medium">{crumb.label}</span>
                ) : (
                  <Link to={crumb.to} className="hover:text-slate-200 transition-colors">
                    {crumb.label}
                  </Link>
                )}
              </React.Fragment>
            ))}
          </nav>
          {title && (
            <h1 className="text-sm font-semibold text-white tracking-tight hidden sm:block">
              {title}
            </h1>
          )}
        </div>
      </div>

      {/* Right: Actions, Compute status, Notifications, User */}
      <div className="flex items-center gap-3">
        {/* Hardware Status Tag */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#111728] border border-[#212E4A] text-xs font-mono">
          <div className="flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-slate-400">NODE:</span>
            <span className="text-slate-200 font-medium">RTX 4090</span>
          </div>
          <span className="text-slate-400">•</span>
          {isRunning ? (
            <div className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>RUNNING ({currentEpoch}/{totalEpochs})</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-slate-400">
              <span className="w-2 h-2 rounded-full bg-slate-500" />
              <span>IDLE</span>
            </div>
          )}
        </div>

        {/* Quick action button */}
        <button
          onClick={() => navigate('/upload')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-semibold text-xs transition-all shadow-glow-cyan hover:shadow-cyan-500/50"
        >
          <Plus className="w-3.5 h-3.5 stroke-[3]" />
          <span className="hidden sm:inline">Analyze Paper</span>
        </button>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-[#162035] relative focus:outline-none transition-colors"
            aria-label="View notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-cyan-400 shadow-glow-cyan"></span>
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 rounded-xl bg-[#111728] border border-[#23304A] shadow-2xl z-50 py-2">
              <div className="px-4 py-2 border-b border-[#23304A] flex items-center justify-between">
                <span className="text-xs font-mono font-semibold uppercase text-slate-400 tracking-wider">
                  Audit Feed
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
                  Live
                </span>
              </div>
              <div className="divide-y divide-[#1D273E] max-h-72 overflow-y-auto">
                <div className="p-3 hover:bg-[#151D33] transition-colors">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-medium text-slate-200">
                        ResNet-50 validation epoch completed
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Current Top-1: 94.0% (Paper baseline: 94.2%)
                      </p>
                      <span className="text-[10px] font-mono text-slate-400">
                        8 mins ago
                      </span>
                    </div>
                  </div>
                </div>
                <div className="p-3 hover:bg-[#151D33] transition-colors">
                  <div className="flex items-start gap-2">
                    <Activity className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-medium text-slate-200">
                        Methodology extracted from arXiv:1512.03385
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        3 empirical claims grounded to paper sections.
                      </p>
                      <span className="text-[10px] font-mono text-slate-400">
                        32 mins ago
                      </span>
                    </div>
                  </div>
                </div>
                <div className="p-3 hover:bg-[#151D33] transition-colors">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-medium text-slate-200">
                        Seed sensitivity warning
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Transformer BLEU varies ±0.4 depending on BPE tokenization.
                      </p>
                      <span className="text-[10px] font-mono text-slate-400">
                        1 hour ago
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-2 border-t border-[#23304A] text-center">
                <button
                  onClick={() => setShowNotifications(false)}
                  className="text-xs font-mono text-cyan-400 hover:text-cyan-300"
                >
                  Close feed
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Workflow Tour Button */}
        <button
          onClick={() => setShowTour(true)}
          className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-[#162035] transition-colors flex items-center gap-1.5 text-xs font-mono"
          title="Workflow Tour & Demo Guide"
        >
          <Compass className="w-4 h-4 text-cyan-400" />
          <span className="hidden xl:inline text-cyan-300">Tour</span>
        </button>

        {/* User Avatar */}
        <div className="flex items-center gap-2 pl-2 border-l border-[#1B253B]">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-600 to-indigo-600 flex items-center justify-center text-xs font-bold text-white ring-1 ring-cyan-500/40 cursor-pointer">
            PM
          </div>
        </div>
      </div>

      {/* Tour & Demo Guide Modal */}
      <Modal
        isOpen={showTour}
        onClose={() => setShowTour(false)}
        title="Kratos 0.1 Reproduction Workflow Guide"
        subtitle="End-to-End AI ML Paper Verification Pipeline"
        maxWidth="xl"
      >
        <div className="space-y-4 font-mono text-xs">
          <p className="text-slate-300 leading-relaxed font-sans">
            Kratos 0.1 automates empirical paper verification from raw publication to live evaluation and discrepancy diagnosis. Jump directly to any stage below:
          </p>

          <div className="space-y-2">
            {[
              {
                step: '01',
                title: 'Ingestion & Upload',
                desc: 'Drop research paper PDF or paste arXiv link to extract raw content.',
                route: '/upload',
                icon: Layers,
                color: 'text-cyan-400',
              },
              {
                step: '02',
                title: 'Paper Analysis',
                desc: '8-stage automated parsing of model, dataset, hyperparameters & evidence citations.',
                route: '/analysis',
                icon: Activity,
                color: 'text-indigo-400',
              },
              {
                step: '03',
                title: 'Configure Reproduction',
                desc: 'Inspect paper baseline vs replication parameters, seeds, and hardware.',
                route: '/experiment/config',
                icon: FlaskConical,
                color: 'text-sky-400',
              },
              {
                step: '04',
                title: 'Live Telemetry Execution',
                desc: 'Real-time accuracy & loss curves with terminal stdout stream & GPU monitor.',
                route: '/experiment/running',
                icon: Terminal,
                color: 'text-amber-400',
              },
              {
                step: '05',
                title: 'Results Comparison',
                desc: 'Reported vs observed delta breakdown with AI diagnostic interpretation.',
                route: '/results/comparison',
                icon: ShieldCheck,
                color: 'text-emerald-400',
              },
              {
                step: '06',
                title: 'Reproducibility Report',
                desc: 'Comprehensive 10-section audit document with PDF/Markdown/JSON export.',
                route: '/report',
                icon: FileCheck,
                color: 'text-cyan-400',
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.step}
                  onClick={() => {
                    setShowTour(false);
                    navigate(item.route);
                  }}
                  className="p-3 rounded-xl bg-[#12192D] border border-[#212E4A] hover:border-cyan-500/50 hover:bg-[#16213B] cursor-pointer flex items-center justify-between gap-3 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-slate-500 text-[11px]">
                      {item.step}
                    </span>
                    <Icon className={`w-4 h-4 ${item.color} flex-shrink-0`} />
                    <div>
                      <div className="font-bold text-slate-100 group-hover:text-cyan-300 transition-colors">
                        {item.title}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        {item.desc}
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-300 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                </div>
              );
            })}
          </div>

          <div className="pt-2 flex items-center justify-end">
            <button
              onClick={() => setShowTour(false)}
              className="px-4 py-2 rounded-xl bg-[#17223C] hover:bg-[#202E50] text-slate-200 text-xs transition-colors"
            >
              Close Guide
            </button>
          </div>
        </div>
      </Modal>
    </header>
  );
};
