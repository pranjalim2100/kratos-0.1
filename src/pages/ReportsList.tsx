import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileCheck,
  Search,
  Calendar,
  ArrowRight,
  Download,
  CheckCircle2,
  FileText,
  Sliders,
  Sparkles
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { StatusBadge } from '../components/common/StatusBadge';
import { Paper } from '../types';

export const ReportsList: React.FC = () => {
  const navigate = useNavigate();
  const { papers, setCurrentPaper, addToast } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('All');

  const reportItems = [
    {
      id: 'KRT-2026-0892',
      paperId: 'resnet-2015',
      paperTitle: 'Deep Residual Learning for Image Recognition',
      model: 'ResNet-50',
      dataset: 'CIFAR-10',
      date: 'March 2026',
      status: 'Partially Reproduced' as const,
      agreement: '99.8%',
      reportedVal: '94.2%',
      reproducedVal: '94.0%',
      diff: '-0.2%',
      author: 'Kaiming He et al.',
      venue: 'CVPR 2016'
    },
    {
      id: 'KRT-2026-0887',
      paperId: 'attention-2017',
      paperTitle: 'Attention Is All You Need',
      model: 'Transformer',
      dataset: 'WMT 2014 En-De',
      date: 'February 2026',
      status: 'Partially Reproduced' as const,
      agreement: '98.2%',
      reportedVal: '28.4 BLEU',
      reproducedVal: '27.9 BLEU',
      diff: '-0.5 BLEU',
      author: 'Vaswani et al.',
      venue: 'NeurIPS 2017'
    },
    {
      id: 'KRT-2026-0873',
      paperId: 'gan-2014',
      paperTitle: 'Generative Adversarial Nets',
      model: 'MLP GAN',
      dataset: 'MNIST',
      date: 'January 2026',
      status: 'Reproduced' as const,
      agreement: '99.4%',
      reportedVal: '225.0 nats',
      reproducedVal: '226.4 nats',
      diff: '+1.4 nats',
      author: 'Goodfellow et al.',
      venue: 'NeurIPS 2014'
    }
  ];

  const filteredReports = reportItems.filter(r => {
    const matchesSearch =
      r.paperTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.id.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (filterStatus === 'All') return true;
    return r.status === filterStatus;
  });

  const handleOpenReport = (report: typeof reportItems[0]) => {
    const paper = papers.find(p => p.id === report.paperId) || papers[0];
    setCurrentPaper(paper);
    navigate('/report');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
          Reproducibility Reports
        </h1>
        <p className="mt-1 text-sm text-slate-300">
          Synthesized audit reports documenting model reproduction fidelity and experimental deltas.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search reports by ID or paper title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0F1424] border border-[#212E4A] text-xs font-mono text-slate-200 placeholder-slate-400 focus:outline-none focus:border-cyan-400 transition-colors"
          />
        </div>

        <div className="flex items-center gap-1.5">
          {['All', 'Reproduced', 'Partially Reproduced'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors ${
                filterStatus === st
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 font-semibold'
                  : 'bg-[#12192D] text-slate-400 border border-[#1E2942] hover:text-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Reports Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredReports.map((report) => (
          <div
            key={report.id}
            className="p-6 rounded-2xl bg-[#0F1424] border border-[#1E2B46] hover:border-cyan-500/40 transition-all duration-200 flex flex-col justify-between group shadow-xl"
          >
            <div className="space-y-4">
              {/* Top metadata */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-cyan-400">
                  {report.id}
                </span>
                <StatusBadge status={report.status} size="sm" />
              </div>

              {/* Title & Author */}
              <div>
                <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-2 leading-snug">
                  {report.paperTitle}
                </h3>
                <p className="text-xs text-slate-400 font-mono mt-1">
                  {report.author} • {report.venue}
                </p>
              </div>

              {/* Parity Metric Pill Box */}
              <div className="p-3.5 rounded-xl bg-[#12192D] border border-[#1E2A44] space-y-2 font-mono text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-[11px]">RESULT AGREEMENT</span>
                  <span className="text-emerald-400 font-bold text-sm">
                    {report.agreement}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] pt-1.5 border-t border-[#19243C]">
                  <span className="text-slate-400">Reported vs Rep:</span>
                  <span className="text-slate-200">
                    {report.reportedVal} vs <strong className="text-cyan-300">{report.reproducedVal}</strong>
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">Difference:</span>
                  <span className="text-cyan-400 font-bold">{report.diff}</span>
                </div>
              </div>

              {/* Date */}
              <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
                <Calendar className="w-3.5 h-3.5" />
                <span>Published {report.date}</span>
              </div>
            </div>

            {/* Bottom Action */}
            <div className="pt-5 mt-4 border-t border-[#1A253D] flex items-center justify-between">
              <span className="text-[11px] font-mono text-slate-400">
                Audit complete
              </span>
              <button
                onClick={() => handleOpenReport(report)}
                className="px-4 py-2 rounded-xl bg-[#162138] hover:bg-[#1E2D4C] text-cyan-400 hover:text-cyan-300 border border-[#27385E] text-xs font-mono font-semibold flex items-center gap-1.5 transition-colors"
              >
                <span>View Full Report</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
