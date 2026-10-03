import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FlaskConical,
  Search,
  Play,
  RotateCcw,
  Clock,
  Cpu,
  ChevronRight,
  ExternalLink,
  Plus
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { StatusBadge } from '../components/common/StatusBadge';

export const ExperimentsList: React.FC = () => {
  const navigate = useNavigate();
  const { currentPaper, setCurrentPaper, isRunning, papers } = useApp();

  const [searchQuery, setSearchQuery] = useState('');

  const experiments = [
    {
      id: 'EXP-1049',
      name: 'ResNet-50 CIFAR-10 Full 200 Epochs (PyTorch 2.2)',
      paperId: 'resnet-2015',
      paperTitle: 'Deep Residual Learning for Image Recognition',
      model: 'ResNet-50',
      dataset: 'CIFAR-10',
      status: isRunning ? ('Running' as const) : ('Partially Reproduced' as const),
      started: 'Today 14:32',
      duration: '42m 18s',
      accuracy: '94.0%',
      targetAccuracy: '94.2%',
    },
    {
      id: 'EXP-1048',
      name: 'ResNet-50 Learning Rate Sensitivity Ablation (lr=0.01)',
      paperId: 'resnet-2015',
      paperTitle: 'Deep Residual Learning for Image Recognition',
      model: 'ResNet-50',
      dataset: 'CIFAR-10',
      status: 'Partially Reproduced' as const,
      started: 'Yesterday 18:10',
      duration: '41m 55s',
      accuracy: '92.4%',
      targetAccuracy: '94.2%',
    },
    {
      id: 'EXP-1045',
      name: 'Transformer Base WMT14 100 Epochs (Fairseq)',
      paperId: 'attention-2017',
      paperTitle: 'Attention Is All You Need',
      model: 'Transformer',
      dataset: 'WMT 2014 En-De',
      status: 'Partially Reproduced' as const,
      started: '2 days ago',
      duration: '3h 14m',
      accuracy: '27.9 BLEU',
      targetAccuracy: '28.4 BLEU',
    },
    {
      id: 'EXP-1041',
      name: 'GAN Minimax MNIST Synthetic Digits (Torch)',
      paperId: 'gan-2014',
      paperTitle: 'Generative Adversarial Nets',
      model: 'MLP GAN',
      dataset: 'MNIST',
      status: 'Reproduced' as const,
      started: '4 days ago',
      duration: '18m 04s',
      accuracy: '226.4 nats',
      targetAccuracy: '225.0 nats',
    },
  ];

  const filteredExperiments = experiments.filter(e =>
    e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.paperTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.model.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenExperiment = (exp: typeof experiments[0]) => {
    const matchedPaper = papers.find(p => p.id === exp.paperId) || papers[0];
    setCurrentPaper(matchedPaper);
    if (exp.status === 'Running' || isRunning) {
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
            Experiments
          </h1>
          <p className="mt-1 text-sm text-slate-300">
            Execution history of empirical runs, training sessions, and ablations.
          </p>
        </div>

        <button
          onClick={() => navigate('/experiment/config')}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-sky-500 hover:from-cyan-300 hover:to-sky-400 text-black font-bold text-xs font-mono flex items-center justify-center gap-2 shadow-glow-cyan transition-all hover:scale-[1.02]"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>New Experiment Run</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Filter experiments by ID, model, or paper..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0F1424] border border-[#212E4A] text-xs font-mono text-slate-200 placeholder-slate-400 focus:outline-none focus:border-cyan-400 transition-colors"
        />
      </div>

      {/* Experiments Table */}
      <div className="rounded-2xl bg-[#0F1424] border border-[#1E2B46] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#1E2942] bg-[#12192D] text-[11px] font-mono uppercase tracking-wider text-slate-400">
                <th className="py-3 px-5">Experiment</th>
                <th className="py-3 px-4">Target Paper</th>
                <th className="py-3 px-4">Model</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Started / Duration</th>
                <th className="py-3 px-4">Observed / Target</th>
                <th className="py-3 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#182236] text-xs">
              {filteredExperiments.map((exp) => (
                <tr
                  key={exp.id}
                  onClick={() => handleOpenExperiment(exp)}
                  className="hover:bg-[#141C30] cursor-pointer transition-colors group"
                >
                  <td className="py-4 px-5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-cyan-400">
                        {exp.id}
                      </span>
                    </div>
                    <div className="font-medium text-slate-200 group-hover:text-cyan-300 transition-colors line-clamp-1 mt-0.5">
                      {exp.name}
                    </div>
                  </td>

                  <td className="py-4 px-4 font-mono text-slate-300">
                    <span className="line-clamp-1 max-w-[180px]">
                      {exp.paperTitle}
                    </span>
                  </td>

                  <td className="py-4 px-4 font-mono">
                    <span className="px-2 py-0.5 rounded bg-[#17223A] border border-[#26375E] text-slate-200">
                      {exp.model}
                    </span>
                  </td>

                  <td className="py-4 px-4">
                    <StatusBadge status={exp.status} size="sm" />
                  </td>

                  <td className="py-4 px-4 font-mono text-[11px]">
                    <div className="text-slate-300">{exp.started}</div>
                    <div className="text-slate-400">{exp.duration}</div>
                  </td>

                  <td className="py-4 px-4 font-mono text-[11px]">
                    <div className="text-cyan-300 font-bold">{exp.accuracy}</div>
                    <div className="text-slate-400">Ref: {exp.targetAccuracy}</div>
                  </td>

                  <td className="py-4 px-5 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenExperiment(exp);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-[#18233C] hover:bg-[#202E50] border border-[#28385E] text-cyan-400 hover:text-cyan-300 font-mono text-[11px] inline-flex items-center gap-1 transition-colors"
                    >
                      <span>{exp.status === 'Running' ? 'Live Telemetry' : 'Results'}</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
