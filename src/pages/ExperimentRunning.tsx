import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  Area,
  AreaChart
} from 'recharts';
import {
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Terminal,
  Cpu,
  Activity,
  Zap,
  ArrowRight,
  AlertTriangle,
  Copy,
  Download,
  Flame,
  FastForward,
  Filter,
  Check
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Modal } from '../components/common/Modal';

export const ExperimentRunning: React.FC = () => {
  const navigate = useNavigate();
  const {
    currentPaper,
    isRunning,
    progress,
    currentEpoch,
    totalEpochs,
    currentAccuracy,
    bestAccuracy,
    trainLoss,
    valLoss,
    gpuUtil,
    timeRemaining,
    trainingHistory,
    logs,
    startExperiment,
    stopExperiment,
    addToast
  } = useApp();

  const [activeChartTab, setActiveChartTab] = useState<'accuracy' | 'loss'>('accuracy');
  const [showStopModal, setShowStopModal] = useState(false);
  const [logFilter, setLogFilter] = useState<'all' | 'metric' | 'info' | 'warn'>('all');
  const [simSpeed, setSimSpeed] = useState<number>(1);
  const logContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll terminal log
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  // Trigger celebration confetti when reaching 100%
  useEffect(() => {
    if (progress >= 100 || currentEpoch >= 200) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#00E5FF', '#10B981', '#38BDF8', '#6366F1']
      });
    }
  }, [progress, currentEpoch]);

  const handleCopyLogs = () => {
    const text = logs.map(l => `[${l.timestamp}] ${l.message}`).join('\n');
    navigator.clipboard.writeText(text);
    addToast({
      type: 'info',
      title: 'Logs Copied',
      message: 'Terminal logs copied to clipboard.'
    });
  };

  const handleDownloadLogs = () => {
    const text = logs.map(l => `[${l.timestamp}] ${l.message}`).join('\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kratos_run_${currentPaper.id}_logs.txt`;
    a.click();
    URL.revokeObjectURL(url);
    addToast({
      type: 'success',
      title: 'Logs Exported',
      message: 'Saved training session log file.'
    });
  };

  const handleFastForward = () => {
    navigate('/results/comparison');
    addToast({
      type: 'success',
      title: 'Reproduction Complete',
      message: 'Target 200 epochs completed. Moving to Results Comparison.'
    });
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-[#0F1424] border border-[#1E2B46] shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center flex-shrink-0">
            {isRunning ? (
              <Activity className="w-6 h-6 text-cyan-400 animate-pulse" />
            ) : progress >= 100 ? (
              <CheckCircle2 className="w-6 h-6 text-emerald-400" />
            ) : (
              <Pause className="w-6 h-6 text-amber-400" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase text-slate-400 font-semibold">
                Experiment Execution
              </span>
              {isRunning ? (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-sky-500/15 text-sky-400 border border-sky-500/30 flex items-center gap-1.5 animate-pulse">
                  <span className="w-2 h-2 rounded-full bg-sky-400 animate-ping" />
                  ● RUNNING
                </span>
              ) : progress >= 100 ? (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  ✓ COMPLETED
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">
                  ❚❚ PAUSED
                </span>
              )}
            </div>
            <h1 className="text-xl md:text-2xl font-black text-white tracking-tight mt-0.5">
              {currentPaper.model} / {currentPaper.dataset}
            </h1>
            <p className="text-xs font-mono text-slate-400">
              Target Baseline: {currentPaper.reportedResult}{currentPaper.unit} ({currentPaper.primaryMetric})
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          {isRunning ? (
            <button
              onClick={() => setShowStopModal(true)}
              className="px-4 py-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 font-mono text-xs font-semibold flex items-center gap-2 transition-colors"
            >
              <Pause className="w-3.5 h-3.5" />
              <span>Pause</span>
            </button>
          ) : (
            <button
              onClick={startExperiment}
              className="px-4 py-2.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-mono text-xs font-semibold flex items-center gap-2 transition-colors"
            >
              <Play className="w-3.5 h-3.5 fill-cyan-400 text-cyan-400" />
              <span>Resume Run</span>
            </button>
          )}

          {currentEpoch < 200 && (
            <button
              onClick={() => {
                // Instantly complete for smooth demonstration
                confetti({
                  particleCount: 100,
                  spread: 80,
                  origin: { y: 0.6 }
                });
                handleFastForward();
              }}
              className="px-3.5 py-2.5 rounded-xl bg-indigo-500/15 hover:bg-indigo-500/25 text-indigo-300 border border-indigo-500/30 font-mono text-xs font-semibold flex items-center gap-1.5 transition-colors"
              title="Skip straight to 200 epochs"
            >
              <FastForward className="w-3.5 h-3.5 text-indigo-400" />
              <span>Instant Complete</span>
            </button>
          )}

          <button
            onClick={handleFastForward}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-sky-500 hover:from-cyan-300 hover:to-sky-400 text-black font-bold text-xs flex items-center gap-1.5 shadow-glow-cyan transition-all hover:scale-[1.02]"
          >
            <span>View Comparison</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Progress & Live Metric Summary */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {/* Metric 1 */}
        <div className="p-4 rounded-xl bg-[#0F1424] border border-[#1E2B46]">
          <span className="text-[10px] font-mono uppercase text-slate-400">Current Accuracy</span>
          <div className="text-2xl font-black text-cyan-400 font-mono mt-1">
            {currentAccuracy.toFixed(1)}%
          </div>
          <span className="text-[11px] font-mono text-slate-400">Top-1 Val</span>
        </div>

        {/* Metric 2 */}
        <div className="p-4 rounded-xl bg-[#0F1424] border border-[#1E2B46]">
          <span className="text-[10px] font-mono uppercase text-slate-400">Best Accuracy</span>
          <div className="text-2xl font-black text-emerald-400 font-mono mt-1">
            {bestAccuracy.toFixed(1)}%
          </div>
          <span className="text-[11px] font-mono text-slate-400">Paper: 94.2%</span>
        </div>

        {/* Metric 3 */}
        <div className="p-4 rounded-xl bg-[#0F1424] border border-[#1E2B46]">
          <span className="text-[10px] font-mono uppercase text-slate-400">Training Loss</span>
          <div className="text-2xl font-black text-white font-mono mt-1">
            {trainLoss.toFixed(3)}
          </div>
          <span className="text-[11px] font-mono text-slate-400">Cross-Entropy</span>
        </div>

        {/* Metric 4 */}
        <div className="p-4 rounded-xl bg-[#0F1424] border border-[#1E2B46]">
          <span className="text-[10px] font-mono uppercase text-slate-400">Validation Loss</span>
          <div className="text-2xl font-black text-white font-mono mt-1">
            {valLoss.toFixed(3)}
          </div>
          <span className="text-[11px] font-mono text-slate-400">Eval Set</span>
        </div>

        {/* Metric 5 */}
        <div className="col-span-2 md:col-span-1 p-4 rounded-xl bg-[#0F1424] border border-[#1E2B46]">
          <div className="flex items-center justify-between text-[10px] font-mono uppercase text-slate-400">
            <span>GPU Utilization</span>
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-indigo-400 font-mono mt-1">
            {gpuUtil}%
          </div>
          <span className="text-[11px] font-mono text-slate-400">RTX 4090 • 7.4GB</span>
        </div>
      </div>

      {/* Progress Bar Strip */}
      <div className="p-4 rounded-xl bg-[#0F1424] border border-[#1E2B46] space-y-2">
        <div className="flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 uppercase">Training Epochs:</span>
            <span className="text-white font-bold">{currentEpoch} / {totalEpochs}</span>
            <span className="text-cyan-400 font-semibold">({progress}%)</span>
          </div>
          <div className="text-slate-400">
            <span>Est. Remaining: </span>
            <span className="text-slate-200 font-medium">{timeRemaining}</span>
          </div>
        </div>
        <div className="w-full h-2.5 rounded-full bg-[#18233C] overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 via-sky-400 to-indigo-500 transition-all duration-300 shadow-glow-cyan"
            style={{ width: `${Math.min(100, progress)}%` }}
          />
        </div>
      </div>

      {/* Live Training Chart */}
      <div className="p-6 rounded-2xl bg-[#0F1424] border border-[#1E2B46] shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#1A253D]">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-400" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-white font-mono">
              Live Telemetry Curves
            </h2>
          </div>

          {/* Chart Toggle */}
          <div className="flex items-center gap-1.5 p-1 rounded-lg bg-[#141C30] border border-[#212E4A]">
            <button
              onClick={() => setActiveChartTab('accuracy')}
              className={`px-3 py-1 rounded text-xs font-mono font-medium transition-colors ${
                activeChartTab === 'accuracy'
                  ? 'bg-cyan-500 text-black font-bold shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Validation Accuracy
            </button>
            <button
              onClick={() => setActiveChartTab('loss')}
              className={`px-3 py-1 rounded text-xs font-mono font-medium transition-colors ${
                activeChartTab === 'loss'
                  ? 'bg-cyan-500 text-black font-bold shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Training vs Val Loss
            </button>
          </div>
        </div>

        {/* Recharts Container */}
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            {activeChartTab === 'accuracy' ? (
              <AreaChart data={trainingHistory} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="accGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00E5FF" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#00E5FF" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1D2A42" />
                <XAxis
                  dataKey="epoch"
                  stroke="#627D98"
                  fontSize={11}
                  tickLine={false}
                  label={{ value: 'Epoch', position: 'insideBottomRight', offset: -5, fill: '#627D98', fontSize: 10 }}
                />
                <YAxis
                  stroke="#627D98"
                  domain={[20, 100]}
                  fontSize={11}
                  tickLine={false}
                  unit="%"
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0F1626',
                    borderColor: '#26385C',
                    borderRadius: '8px',
                    fontFamily: 'monospace',
                    fontSize: '12px'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="valAccuracy"
                  name="Val Accuracy"
                  stroke="#00E5FF"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#accGrad)"
                  dot={false}
                />
              </AreaChart>
            ) : (
              <LineChart data={trainingHistory} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1D2A42" />
                <XAxis
                  dataKey="epoch"
                  stroke="#627D98"
                  fontSize={11}
                  tickLine={false}
                />
                <YAxis
                  stroke="#627D98"
                  domain={[0, 2.5]}
                  fontSize={11}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0F1626',
                    borderColor: '#26385C',
                    borderRadius: '8px',
                    fontFamily: 'monospace',
                    fontSize: '12px'
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', fontFamily: 'monospace' }} />
                <Line
                  type="monotone"
                  dataKey="trainLoss"
                  name="Train Loss"
                  stroke="#38BDF8"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="valLoss"
                  name="Val Loss"
                  stroke="#F59E0B"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {/* Terminal-Style Log Panel */}
      <div className="rounded-2xl bg-[#0B0F19] border border-[#1E2B46] overflow-hidden shadow-2xl">
        <div className="px-5 py-3 bg-[#111728] border-b border-[#1E2B46] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
                STDOUT / STDERR STREAM
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
                tty:0
              </span>
            </div>

            {/* Filter buttons */}
            <div className="flex items-center gap-1 bg-[#0A0E18] p-0.5 rounded-lg border border-[#1C2842]">
              {(['all', 'metric', 'info', 'warn'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setLogFilter(filter)}
                  className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase transition-colors ${
                    logFilter === filter
                      ? 'bg-cyan-500 text-black font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyLogs}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#19243C] transition-colors"
              title="Copy logs"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleDownloadLogs}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#19243C] transition-colors"
              title="Download log file"
            >
              <Download className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div
          ref={logContainerRef}
          className="p-4 h-64 overflow-y-auto font-mono text-xs space-y-1.5 bg-[#090D15] terminal-scroll selection:bg-cyan-500 selection:text-black"
        >
          {logs
            .filter((log) => logFilter === 'all' || log.level === logFilter)
            .map((log, index) => {
              const levelColors = {
                info: 'text-slate-400',
                warn: 'text-amber-400',
                metric: 'text-cyan-300 font-semibold',
                success: 'text-emerald-400 font-semibold',
              };

              return (
                <div key={index} className="flex items-start gap-2.5 leading-relaxed">
                  <span className="text-slate-400 select-none flex-shrink-0">
                    [{log.timestamp}]
                  </span>
                  <span className={levelColors[log.level]}>
                    {log.message}
                  </span>
                </div>
              );
            })}
        </div>
      </div>

      {/* Stop Experiment Confirmation Modal */}
      <Modal
        isOpen={showStopModal}
        onClose={() => setShowStopModal(false)}
        title="Stop Active Reproduction?"
        subtitle="Process ID: 89412 • Container: kratos-resnet50"
      >
        <div className="space-y-4">
          <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs leading-relaxed flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>
              Halting will create a snapshot checkpoint at Epoch {currentEpoch}/200. You can resume later or analyze results with current metrics.
            </span>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              onClick={() => setShowStopModal(false)}
              className="px-4 py-2 rounded-xl bg-[#17223C] hover:bg-[#202E50] text-slate-300 text-xs font-mono transition-colors"
            >
              Cancel & Continue
            </button>
            <button
              onClick={() => {
                stopExperiment();
                setShowStopModal(false);
              }}
              className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-black font-bold text-xs font-mono transition-colors"
            >
              Confirm Stop
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
