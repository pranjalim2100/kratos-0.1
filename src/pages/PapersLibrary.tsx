import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  Search,
  Filter,
  Plus,
  ArrowRight,
  ExternalLink,
  Sliders,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { StatusBadge } from '../components/common/StatusBadge';
import { Paper, ReproductionStatus } from '../types';

export const PapersLibrary: React.FC = () => {
  const navigate = useNavigate();
  const { papers, setCurrentPaper } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string>('All');

  const filterTabs = [
    'All',
    'Reproduced',
    'Partially Reproduced',
    'Analysis Complete',
    'Running',
    'Failed'
  ];

  const filteredPapers = papers.filter(paper => {
    const matchesSearch =
      paper.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      paper.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      paper.dataset.toLowerCase().includes(searchQuery.toLowerCase()) ||
      paper.authors.some(a => a.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;
    if (selectedFilter === 'All') return true;
    return paper.status === selectedFilter;
  });

  const handleAction = (paper: Paper) => {
    setCurrentPaper(paper);
    if (paper.status === 'Analysis Complete') {
      navigate('/experiment/config');
    } else if (paper.status === 'Running') {
      navigate('/experiment/running');
    } else {
      navigate('/results/comparison');
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
            Papers Library
          </h1>
          <p className="mt-1 text-sm text-slate-300">
            Repository of ML papers ingested, analyzed, and queued for reproduction.
          </p>
        </div>

        <button
          onClick={() => navigate('/upload')}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-sky-500 hover:from-cyan-300 hover:to-sky-400 text-black font-bold text-xs font-mono flex items-center justify-center gap-2 shadow-glow-cyan transition-all hover:scale-[1.02]"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Upload New Paper</span>
        </button>
      </div>

      {/* Search & Filter Controls */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by title, architecture, dataset, or author..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0F1424] border border-[#212E4A] text-xs font-mono text-slate-200 placeholder-slate-400 focus:outline-none focus:border-cyan-400 transition-colors"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {filterTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedFilter(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono whitespace-nowrap transition-colors ${
                selectedFilter === tab
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 font-semibold'
                  : 'bg-[#12192D] text-slate-400 border border-[#1E2942] hover:text-slate-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Papers Table */}
      <div className="rounded-2xl bg-[#0F1424] border border-[#1E2B46] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#1E2942] bg-[#12192D] text-[11px] font-mono uppercase tracking-wider text-slate-400">
                <th className="py-3 px-5">Paper</th>
                <th className="py-3 px-4">Dataset</th>
                <th className="py-3 px-4">Model</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Last Run</th>
                <th className="py-3 px-4">Result Difference</th>
                <th className="py-3 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#182236] text-xs">
              {filteredPapers.length > 0 ? (
                filteredPapers.map((paper) => (
                  <tr
                    key={paper.id}
                    onClick={() => handleAction(paper)}
                    className="hover:bg-[#141C30] cursor-pointer transition-colors group"
                  >
                    <td className="py-4 px-5">
                      <div className="font-semibold text-slate-100 group-hover:text-cyan-300 transition-colors line-clamp-1 max-w-xs">
                        {paper.title}
                      </div>
                      <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                        {paper.authors.slice(0, 2).join(', ')}{paper.authors.length > 2 ? ' et al.' : ''} • {paper.year} ({paper.venue})
                      </div>
                    </td>

                    <td className="py-4 px-4 font-mono text-slate-300">
                      {paper.dataset}
                    </td>

                    <td className="py-4 px-4 font-mono">
                      <span className="px-2 py-0.5 rounded bg-[#17223A] border border-[#26375E] text-slate-200">
                        {paper.model}
                      </span>
                    </td>

                    <td className="py-4 px-4">
                      <StatusBadge status={paper.status} size="sm" />
                    </td>

                    <td className="py-4 px-4 font-mono text-slate-400 text-[11px]">
                      {paper.lastRun || 'Never'}
                    </td>

                    <td className="py-4 px-4 font-mono">
                      {paper.difference !== undefined ? (
                        <span
                          className={`font-semibold ${
                            Math.abs(paper.difference) <= 0.5
                              ? 'text-emerald-400'
                              : 'text-amber-400'
                          }`}
                        >
                          {paper.difference > 0 ? `+${paper.difference}` : paper.difference}%
                        </span>
                      ) : (
                        <span className="text-slate-400 italic">Pending Run</span>
                      )}
                    </td>

                    <td className="py-4 px-5 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAction(paper);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-[#18233C] hover:bg-[#202E50] border border-[#28385E] text-cyan-400 hover:text-cyan-300 font-mono text-[11px] inline-flex items-center gap-1 transition-colors"
                      >
                        <span>Inspect</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400 font-mono text-xs">
                    No papers found matching query "{searchQuery}" with filter "{selectedFilter}".
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
