import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  FlaskConical,
  CheckCircle2,
  Percent,
  Plus,
  ArrowRight,
  Sparkles,
  ExternalLink,
  Activity,
  Layers,
  GitCompare,
  Clock,
  ChevronRight,
  Database,
  Cpu
} from 'lucide-react';
import { StatCard } from '../components/common/StatCard';
import { StatusBadge } from '../components/common/StatusBadge';
import { useApp } from '../context/AppContext';
import { Paper } from '../types';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { papers, setCurrentPaper } = useApp();

  const handleSelectPaper = (paper: Paper) => {
    setCurrentPaper(paper);
    if (paper.status === 'Analysis Complete') {
      navigate('/experiment/config');
    } else if (paper.status === 'Running') {
      navigate('/experiment/running');
    } else {
      navigate('/results/comparison');
    }
  };

  const recentActivities = [
    {
      id: 'act-1',
      icon: CheckCircle2,
      iconColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
      title: 'Experiment completed',
      detail: '"ResNet CIFAR-10 reproduction finished"',
      meta: '8 minutes ago',
      badge: 'Acc: 94.0%',
      to: '/results/comparison'
    },
    {
      id: 'act-2',
      icon: Sparkles,
      iconColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
      title: 'AI analysis completed',
      detail: '"Transformer paper analyzed"',
      meta: '32 minutes ago',
      badge: 'WMT 2014',
      to: '/analysis'
    },
    {
      id: 'act-3',
      icon: FileText,
      iconColor: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30',
      title: 'Paper uploaded',
      detail: '"BERT research paper"',
      meta: '1 hour ago',
      badge: 'PDF 4.8MB',
      to: '/papers'
    }
  ];

  return (
    <div className="space-y-8 pb-10">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#10172B] via-[#0E1528] to-[#090D17] border border-[#233252] p-6 md:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-xs font-mono mb-4">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span>Kratos 0.1 Engine • Empirical AI Verification</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight">
            Reproduce. Verify.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400">
              Understand.
            </span>
          </h1>

          <p className="mt-4 text-base md:text-lg text-slate-300 leading-relaxed font-normal">
            Kratos 0.1 uses AI to extract experimental details from machine learning papers and helps you reproduce their reported results.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              onClick={() => navigate('/upload')}
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-sky-500 hover:from-cyan-300 hover:to-sky-400 text-black font-bold text-sm flex items-center gap-2 transition-all shadow-glow-cyan hover:shadow-cyan-400/50 hover:scale-[1.02]"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>+ Analyze New Paper</span>
            </button>

            <button
              onClick={() => navigate('/reports')}
              className="px-5 py-3 rounded-xl bg-[#151D33] hover:bg-[#1C2744] text-slate-200 hover:text-white border border-[#2B3C62] font-semibold text-sm flex items-center gap-2 transition-all"
            >
              <FileText className="w-4 h-4 text-cyan-400" />
              <span>View Reports</span>
            </button>

            <button
              onClick={() => {
                setCurrentPaper(papers[0]);
                navigate('/analysis');
              }}
              className="px-4 py-3 rounded-xl bg-transparent hover:bg-slate-800/40 text-cyan-400 font-mono text-xs flex items-center gap-1.5 transition-colors"
            >
              <span>Explore ResNet Demo</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Feature Pillar Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-xl bg-[#0F1424] border border-[#1E2942] hover:border-cyan-500/40 transition-colors">
          <div className="flex items-center justify-between mb-3">
            <span className="font-mono text-xs font-bold text-cyan-400">01</span>
            <div className="p-2 rounded-lg bg-cyan-950/60 border border-cyan-500/20 text-cyan-400">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200 font-mono">
            UNDERSTAND
          </h3>
          <p className="mt-1.5 text-xs text-slate-400 leading-relaxed">
            Extract datasets, models, methodology and hyperparameters from research papers.
          </p>
        </div>

        <div className="p-5 rounded-xl bg-[#0F1424] border border-[#1E2942] hover:border-indigo-500/40 transition-colors">
          <div className="flex items-center justify-between mb-3">
            <span className="font-mono text-xs font-bold text-indigo-400">02</span>
            <div className="p-2 rounded-lg bg-indigo-950/60 border border-indigo-500/20 text-indigo-400">
              <FlaskConical className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200 font-mono">
            REPRODUCE
          </h3>
          <p className="mt-1.5 text-xs text-slate-400 leading-relaxed">
            Create and configure an experiment based on the paper's methodology.
          </p>
        </div>

        <div className="p-5 rounded-xl bg-[#0F1424] border border-[#1E2942] hover:border-emerald-500/40 transition-colors">
          <div className="flex items-center justify-between mb-3">
            <span className="font-mono text-xs font-bold text-emerald-400">03</span>
            <div className="p-2 rounded-lg bg-emerald-950/60 border border-emerald-500/20 text-emerald-400">
              <GitCompare className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200 font-mono">
            COMPARE
          </h3>
          <p className="mt-1.5 text-xs text-slate-400 leading-relaxed">
            Compare reported results with reproduced results and identify potential differences.
          </p>
        </div>
      </div>

      {/* Statistics Section */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold flex items-center gap-2">
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
            <span>Platform Metrics</span>
          </h2>
          <span className="text-[11px] font-mono text-slate-400">
            Updated just now
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Papers Analyzed"
            value="12"
            subValue="papers"
            icon={FileText}
            accentColor="cyan"
            trend="+3 this week"
            trendType="positive"
          />
          <StatCard
            label="Experiments Run"
            value="8"
            subValue="runs"
            icon={FlaskConical}
            accentColor="indigo"
            trend="1 in progress"
            trendType="neutral"
          />
          <StatCard
            label="Successfully Reproduced"
            value="5"
            subValue="/ 8 (62.5%)"
            icon={CheckCircle2}
            accentColor="emerald"
            trend="Δ < 1.0%"
            trendType="positive"
          />
          <StatCard
            label="Average Result Difference"
            value="1.8%"
            subValue="mean drift"
            icon={Percent}
            accentColor="amber"
            trend="High fidelity"
            trendType="positive"
          />
        </div>
      </div>

      {/* Main Grid: Recent Papers & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Papers Table (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-white tracking-tight uppercase font-mono">
                Recent Papers
              </h2>
              <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-[#18233C] text-slate-400 border border-[#27385E]">
                {papers.length}
              </span>
            </div>
            <button
              onClick={() => navigate('/papers')}
              className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
            >
              <span>View all papers</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="rounded-xl bg-[#0F1424] border border-[#1E2942] overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#1E2942] bg-[#12192D] text-[11px] font-mono uppercase tracking-wider text-slate-400">
                    <th className="py-3 px-4">Paper</th>
                    <th className="py-3 px-4">Dataset</th>
                    <th className="py-3 px-4">Model</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Accuracy / Diff</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#182236] text-xs">
                  {papers.map((paper) => (
                    <tr
                      key={paper.id}
                      onClick={() => handleSelectPaper(paper)}
                      className="hover:bg-[#141C30] cursor-pointer transition-colors group"
                    >
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-100 group-hover:text-cyan-300 transition-colors line-clamp-1 max-w-[220px]">
                          {paper.title}
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                          {paper.authors[0]} et al. • {paper.year}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-300">
                        {paper.dataset}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-300">
                        <span className="px-2 py-0.5 rounded bg-[#172138] border border-[#28385C] text-slate-200">
                          {paper.model}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <StatusBadge status={paper.status} size="sm" />
                      </td>
                      <td className="py-3.5 px-4 font-mono">
                        {paper.reproducedResult !== undefined ? (
                          <div className="flex flex-col">
                            <span className="text-slate-200 font-medium">
                              Rep: {paper.reproducedResult}{paper.unit}
                            </span>
                            <span className="text-[11px] text-slate-400">
                              Paper: {paper.reportedResult}{paper.unit} ({paper.difference && paper.difference > 0 ? `+${paper.difference}` : paper.difference}%)
                            </span>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">Not Run</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <span className="inline-flex items-center gap-1 text-xs font-mono text-cyan-400 group-hover:text-cyan-300">
                          <span>Inspect</span>
                          <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Recent Activity Section (1 col) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white tracking-tight uppercase font-mono">
              Recent Activity
            </h2>
            <span className="text-xs font-mono text-slate-400">Live feed</span>
          </div>

          <div className="rounded-xl bg-[#0F1424] border border-[#1E2942] p-4 divide-y divide-[#1A243A]">
            {recentActivities.map((act) => {
              const Icon = act.icon;
              return (
                <div
                  key={act.id}
                  onClick={() => navigate(act.to)}
                  className="py-3 first:pt-0 last:pb-0 hover:bg-[#141C30] -mx-2 px-2 rounded-lg cursor-pointer transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg border ${act.iconColor} flex-shrink-0 mt-0.5`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-xs font-semibold text-slate-200 truncate">
                          {act.title}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400 flex-shrink-0">
                          {act.meta}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
                        {act.detail}
                      </p>
                      <div className="mt-1.5 flex items-center gap-2">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#17223A] border border-[#26375E] text-cyan-300">
                          {act.badge}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Hardware Environment specs box */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-[#12192D] to-[#0A0E1A] border border-[#1E2B46] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase text-slate-400 font-semibold flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                <span>Compute Infrastructure</span>
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                ACTIVE
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="p-2 rounded bg-[#0A0D17] border border-[#1A253D]">
                <div className="text-[10px] text-slate-400">ACCELERATOR</div>
                <div className="text-slate-200 font-medium">NVIDIA RTX 4090</div>
              </div>
              <div className="p-2 rounded bg-[#0A0D17] border border-[#1A253D]">
                <div className="text-[10px] text-slate-400">FRAMEWORK</div>
                <div className="text-slate-200 font-medium">PyTorch 2.2.1</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
