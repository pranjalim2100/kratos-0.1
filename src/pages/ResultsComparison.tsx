import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid
} from 'recharts';
import {
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  FileText,
  ShieldCheck,
  TrendingDown,
  Info,
  ChevronDown,
  ChevronUp,
  Scale,
  Sparkles,
  ArrowRight,
  Database,
  Cpu,
  Layers
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { RESNET_COMPARISON_METRICS, REPRODUCIBILITY_REPORT_DATA } from '../data/mockData';

export const ResultsComparison: React.FC = () => {
  const navigate = useNavigate();
  const { currentPaper, startExperiment, addToast } = useApp();

  const [expandedSources, setExpandedSources] = useState<number[]>([0]);

  useEffect(() => {
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.5 },
      colors: ['#00E5FF', '#10B981', '#38BDF8']
    });
  }, []);

  const toggleSource = (idx: number) => {
    setExpandedSources(prev =>
      prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
    );
  };

  const chartData = [
    { name: 'Top-1 Acc (%)', Paper: 94.2, Reproduced: 94.0 },
    { name: 'Top-5 Acc (%)', Paper: 99.1, Reproduced: 99.0 },
    { name: 'F1 Macro (%)', Paper: 93.7, Reproduced: 93.5 },
  ];

  const handleRunAgain = () => {
    navigate('/experiment/config');
    addToast({
      type: 'info',
      title: 'Configuring New Run',
      message: 'Modify seeds, learning rate schedules, or hardware settings.'
    });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-cyan-950/70 border border-cyan-500/30 text-cyan-400 text-xs font-mono mb-2">
          <span>STEP 04</span>
          <span>•</span>
          <span>SYNTHESIS & VERIFICATION</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
          Experiment Complete
        </h1>
        <p className="mt-1 text-sm md:text-base text-slate-300">
          Cross-evaluating empirical run against reported publication metrics.
        </p>
      </div>

      {/* Large Status Card */}
      <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-r from-[#0E1E28] via-[#0E1628] to-[#121A30] border border-emerald-500/40 shadow-glow-emerald relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-xs font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Reproduction Successful</span>
            </div>

            <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
              The reproduced result is within 1% of the reported paper result.
            </h2>

            <p className="text-sm text-slate-300 max-w-2xl font-mono">
              Target: <span className="text-white font-bold">{currentPaper.reportedResult}{currentPaper.unit}</span> |
              Observed: <span className="text-emerald-400 font-bold"> 94.0%</span> |
              Absolute Delta: <span className="text-cyan-300 font-bold">-0.2%</span>
            </p>
          </div>

          <div className="flex-shrink-0 text-center p-4 rounded-xl bg-[#09111C]/80 border border-emerald-500/30">
            <span className="text-[10px] font-mono uppercase text-slate-400">Result Agreement</span>
            <div className="text-3xl font-extrabold text-emerald-400 font-mono">
              99.8%
            </div>
            <span className="text-[10px] font-mono text-slate-400">High Confidence</span>
          </div>
        </div>

        {/* Prototype Disclaimer Banner */}
        <div className="mt-5 p-3 rounded-lg bg-[#0B101D] border border-[#1E2B46] text-xs font-mono text-slate-400 flex items-center gap-2.5">
          <Info className="w-4 h-4 text-cyan-400 flex-shrink-0" />
          <span>
            DISCLAIMER: This prototype displays simulated benchmarking data for demonstration purposes. Not a peer-reviewed scientific conclusion.
          </span>
        </div>
      </div>

      {/* Numerical Metrics Comparison Table & Bar Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Table: 2 cols */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold flex items-center gap-2">
              <Scale className="w-3.5 h-3.5 text-cyan-400" />
              <span>Reported vs Reproduced Metric Delta</span>
            </h3>
            <span className="text-[11px] font-mono text-slate-400">6 comparative features</span>
          </div>

          <div className="rounded-xl bg-[#0F1424] border border-[#1E2B46] overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#1E2942] bg-[#12192D] text-[11px] font-mono uppercase tracking-wider text-slate-400">
                    <th className="py-3 px-4">Metric</th>
                    <th className="py-3 px-4 text-center">Paper Reported</th>
                    <th className="py-3 px-4 text-center">Reproduced</th>
                    <th className="py-3 px-4 text-right">Difference</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#182236] text-xs font-mono">
                  {RESNET_COMPARISON_METRICS.map((row, i) => (
                    <tr key={i} className="hover:bg-[#141C30] transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-slate-200">
                        {row.name}
                      </td>
                      <td className="py-3.5 px-4 text-center text-slate-300">
                        {row.paper}
                      </td>
                      <td className="py-3.5 px-4 text-center font-bold text-cyan-300">
                        {row.reproduced}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold border ${
                            row.status === 'match'
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                              : 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30'
                          }`}
                        >
                          {row.difference}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Bar Chart: 1 col */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold">
              Performance Parity
            </h3>
            <span className="text-[11px] font-mono text-slate-400">Normalized %</span>
          </div>

          <div className="p-4 rounded-xl bg-[#0F1424] border border-[#1E2B46] h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 15, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1D2A42" />
                <XAxis dataKey="name" stroke="#627D98" fontSize={10} tickLine={false} />
                <YAxis domain={[90, 100]} stroke="#627D98" fontSize={10} tickLine={false} unit="%" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0F1626',
                    borderColor: '#26385C',
                    borderRadius: '8px',
                    fontFamily: 'monospace',
                    fontSize: '11px'
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '10px', fontFamily: 'monospace' }} />
                <Bar dataKey="Paper" fill="#38BDF8" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Reproduced" fill="#00E5FF" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Result Interpretation Card */}
      <div className="p-6 rounded-2xl bg-[#0F1424] border border-[#1E2B46] space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-wider text-white font-mono flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>AI Result Interpretation</span>
          </h3>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
            Automated Synthesis
          </span>
        </div>

        <p className="text-sm text-slate-300 leading-relaxed bg-[#131A2D] p-4 rounded-xl border border-[#212E4A]">
          "Your reproduced accuracy is 0.2 percentage points below the reported result (94.0% vs 94.2%). The implementation appears broadly consistent with the reported experiment. The small discrepancy is statistically insignificant given standard stochastic variance across random initializations and learning rate scheduling discretization."
        </p>

        <p className="text-[11px] font-mono text-slate-400">
          Generated via Kratos Automated Verification Engine • Confidence: High
        </p>
      </div>

      {/* Possible Sources of Difference (Expandable Accordion) */}
      <div className="p-6 rounded-2xl bg-[#0F1424] border border-[#1E2B46] space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-[#1A253D]">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white font-mono flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>Possible Sources of Difference</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Empirical factors contributing to metric drift between publication and reproduction
            </p>
          </div>
          <span className="text-xs font-mono text-slate-400">
            5 Diagnostic Points
          </span>
        </div>

        <div className="space-y-3">
          {REPRODUCIBILITY_REPORT_DATA.sourcesOfDifference.map((source, idx) => {
            const isOpen = expandedSources.includes(idx);
            const impactColors = {
              Low: 'text-cyan-400 bg-cyan-950/60 border-cyan-800',
              Medium: 'text-amber-400 bg-amber-950/60 border-amber-800',
              High: 'text-rose-400 bg-rose-950/60 border-rose-800',
            };

            return (
              <div
                key={idx}
                className="rounded-xl border border-[#1E2A42] bg-[#12192D] overflow-hidden transition-colors"
              >
                <button
                  onClick={() => toggleSource(idx)}
                  className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-[#16213B] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono font-bold text-slate-400">
                      0{idx + 1}
                    </span>
                    <span className="text-xs font-bold font-mono text-slate-200">
                      {source.title}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                        impactColors[source.impact]
                      }`}
                    >
                      Impact: {source.impact}
                    </span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                </button>

                {isOpen && (
                  <div className="px-4 pb-3.5 pt-1 text-xs text-slate-300 font-mono leading-relaxed border-t border-[#19243C] bg-[#0E1424]">
                    {source.description}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Action Buttons */}
      <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[#1C2842]">
        <button
          onClick={handleRunAgain}
          className="w-full sm:w-auto px-5 py-3 rounded-xl bg-[#12192D] hover:bg-[#18233E] border border-[#243454] text-slate-300 hover:text-white font-mono text-xs flex items-center justify-center gap-2 transition-colors"
        >
          <RotateCcw className="w-4 h-4 text-cyan-400" />
          <span>Run Again with Modified Config</span>
        </button>

        <button
          onClick={() => navigate('/report')}
          className="w-full sm:w-auto px-7 py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-sky-500 hover:from-cyan-300 hover:to-sky-400 text-black font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-glow-cyan transition-all hover:scale-[1.02]"
        >
          <FileText className="w-4 h-4 fill-black" />
          <span>Generate Full Report</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
