import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sliders,
  Cpu,
  ArrowRight,
  ArrowLeft,
  Save,
  Play,
  RotateCcw,
  Sparkles,
  Info,
  CheckCircle2,
  HardDrive,
  Clock,
  Settings2,
  Lock,
  Layers
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ExperimentConfig: React.FC = () => {
  const navigate = useNavigate();
  const { currentPaper, config, updateConfig, startExperiment, addToast } = useApp();

  const [formData, setFormData] = useState({
    pythonVersion: config.pythonVersion,
    torchVersion: config.torchVersion,
    batchSize: config.batchSize,
    learningRate: config.learningRate,
    epochs: config.epochs,
    optimizer: config.optimizer,
    seed: config.seed,
    hardware: config.hardware,
    usePaperHyperparams: config.usePaperHyperparams,
    useFixedSeed: config.useFixedSeed,
    enableDataAug: config.enableDataAug,
    saveCheckpoints: config.saveCheckpoints,
  });

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    updateConfig(formData);
    addToast({
      type: 'success',
      title: 'Configuration Saved',
      message: 'Experiment specification committed to local pipeline.'
    });
  };

  const handleRun = () => {
    updateConfig(formData);
    startExperiment();
    navigate('/experiment/running');
  };

  const handleResetDefaults = () => {
    setFormData({
      pythonVersion: '3.10',
      torchVersion: '2.2.1+cu121',
      batchSize: 128,
      learningRate: 0.1,
      epochs: 200,
      optimizer: 'SGD',
      seed: 42,
      hardware: 'NVIDIA RTX 4090 (24GB VRAM)',
      usePaperHyperparams: true,
      useFixedSeed: true,
      enableDataAug: true,
      saveCheckpoints: true,
    });
    addToast({
      type: 'info',
      title: 'Defaults Restored',
      message: 'Restored original paper baseline hyperparameters.'
    });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-cyan-950/70 border border-cyan-500/30 text-cyan-400 text-xs font-mono mb-2">
          <span>STEP 03</span>
          <span>•</span>
          <span>EXECUTION SETUP</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
          Configure Reproduction
        </h1>
        <p className="mt-1 text-sm md:text-base text-slate-300">
          Verify extracted paper parameters and tune replication environment hyperparameters before execution.
        </p>
      </div>

      {/* Two Column Layout: Left = Paper extracted, Right = Configurable experiment */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LEFT COLUMN: Paper Configuration (Ground Truth Reference) */}
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-[#0D1220] border border-[#1C263E] flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-mono uppercase text-slate-400 font-semibold">
              <Lock className="w-3.5 h-3.5 text-cyan-400" />
              <span>Paper Reference Baseline</span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
              GROUND TRUTH
            </span>
          </div>

          <div className="p-6 rounded-2xl bg-[#0F1424] border border-[#1E2B46] space-y-5">
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase text-slate-400">Target Paper</span>
              <p className="text-sm font-bold text-white leading-snug">
                {currentPaper.title}
              </p>
              <p className="text-xs font-mono text-cyan-400">
                {currentPaper.authors[0]} et al. ({currentPaper.year})
              </p>
            </div>

            <div className="divide-y divide-[#1A253D] text-xs font-mono">
              <div className="py-2.5 flex items-center justify-between">
                <span className="text-slate-400">Dataset</span>
                <span className="text-slate-200 font-bold">{currentPaper.dataset}</span>
              </div>
              <div className="py-2.5 flex items-center justify-between">
                <span className="text-slate-400">Model Architecture</span>
                <span className="text-slate-200 font-bold">{currentPaper.model}</span>
              </div>
              <div className="py-2.5 flex items-center justify-between">
                <span className="text-slate-400">Reference Framework</span>
                <span className="text-slate-200">{currentPaper.framework}</span>
              </div>
              <div className="py-2.5 flex items-center justify-between">
                <span className="text-slate-400">Batch Size</span>
                <span className="text-slate-200 font-bold">{currentPaper.hyperparameters.batchSize}</span>
              </div>
              <div className="py-2.5 flex items-center justify-between">
                <span className="text-slate-400">Learning Rate</span>
                <span className="text-cyan-300 font-bold">{currentPaper.hyperparameters.learningRate}</span>
              </div>
              <div className="py-2.5 flex items-center justify-between">
                <span className="text-slate-400">Total Epochs</span>
                <span className="text-slate-200 font-bold">{currentPaper.hyperparameters.epochs}</span>
              </div>
              <div className="py-2.5 flex items-center justify-between">
                <span className="text-slate-400">Optimizer</span>
                <span className="text-slate-200">{currentPaper.hyperparameters.optimizer}</span>
              </div>
              <div className="py-2.5 flex items-center justify-between">
                <span className="text-slate-400">Reported Benchmark Result</span>
                <span className="text-emerald-400 font-bold">
                  {currentPaper.reportedResult}{currentPaper.unit} ({currentPaper.primaryMetric})
                </span>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-[#0A0D17] border border-[#1A253D] text-[11px] font-mono text-slate-400 leading-relaxed">
              <span className="text-cyan-400 font-semibold">Note:</span> Original training ran with batch normalization, momentum SGD, and step learning rate reductions at epoch 80 and 120.
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Experiment Configuration (User Editable) */}
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-[#0D1220] border border-[#1C263E] flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-mono uppercase text-slate-400 font-semibold">
              <Settings2 className="w-3.5 h-3.5 text-indigo-400" />
              <span>Reproduction Pipeline Config</span>
            </div>
            <button
              onClick={handleResetDefaults}
              className="text-[10px] font-mono text-slate-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>

          <div className="p-6 rounded-2xl bg-[#0F1424] border border-[#1E2B46] space-y-4">
            {/* Input grid */}
            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div>
                <label className="block text-[10px] uppercase text-slate-400 mb-1">
                  Python Version
                </label>
                <input
                  type="text"
                  value={formData.pythonVersion}
                  onChange={(e) => handleChange('pythonVersion', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#12192D] border border-[#233150] text-slate-200 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase text-slate-400 mb-1">
                  PyTorch Version
                </label>
                <input
                  type="text"
                  value={formData.torchVersion}
                  onChange={(e) => handleChange('torchVersion', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#12192D] border border-[#233150] text-slate-200 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase text-slate-400 mb-1">
                  Batch Size
                </label>
                <input
                  type="number"
                  value={formData.batchSize}
                  onChange={(e) => handleChange('batchSize', Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg bg-[#12192D] border border-[#233150] text-slate-200 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase text-slate-400 mb-1">
                  Learning Rate
                </label>
                <input
                  type="number"
                  step="0.001"
                  value={formData.learningRate}
                  onChange={(e) => handleChange('learningRate', Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg bg-[#12192D] border border-[#233150] text-slate-200 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase text-slate-400 mb-1">
                  Epochs
                </label>
                <input
                  type="number"
                  value={formData.epochs}
                  onChange={(e) => handleChange('epochs', Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg bg-[#12192D] border border-[#233150] text-slate-200 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase text-slate-400 mb-1">
                  Optimizer
                </label>
                <select
                  value={formData.optimizer}
                  onChange={(e) => handleChange('optimizer', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#12192D] border border-[#233150] text-slate-200 focus:outline-none focus:border-cyan-400"
                >
                  <option value="SGD">SGD (Momentum=0.9)</option>
                  <option value="Adam">Adam</option>
                  <option value="AdamW">AdamW</option>
                  <option value="RMSprop">RMSprop</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] uppercase text-slate-400 mb-1">
                  Random Seed
                </label>
                <input
                  type="number"
                  value={formData.seed}
                  onChange={(e) => handleChange('seed', Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg bg-[#12192D] border border-[#233150] text-slate-200 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase text-slate-400 mb-1">
                  Target Hardware
                </label>
                <input
                  type="text"
                  value={formData.hardware}
                  onChange={(e) => handleChange('hardware', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#12192D] border border-[#233150] text-slate-200 focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            {/* Checkbox Toggles */}
            <div className="pt-2 border-t border-[#1C2842] space-y-2 text-xs font-mono">
              <label className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#131B2E] cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={formData.usePaperHyperparams}
                  onChange={(e) => handleChange('usePaperHyperparams', e.target.checked)}
                  className="w-4 h-4 rounded bg-[#151E33] border-[#293A60] text-cyan-500 focus:ring-0 focus:ring-offset-0"
                />
                <span className="text-slate-200">Use paper hyperparameters</span>
              </label>

              <label className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#131B2E] cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={formData.useFixedSeed}
                  onChange={(e) => handleChange('useFixedSeed', e.target.checked)}
                  className="w-4 h-4 rounded bg-[#151E33] border-[#293A60] text-cyan-500 focus:ring-0 focus:ring-offset-0"
                />
                <span className="text-slate-200">Use fixed random seed (42)</span>
              </label>

              <label className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#131B2E] cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={formData.enableDataAug}
                  onChange={(e) => handleChange('enableDataAug', e.target.checked)}
                  className="w-4 h-4 rounded bg-[#151E33] border-[#293A60] text-cyan-500 focus:ring-0 focus:ring-offset-0"
                />
                <span className="text-slate-200">Enable data augmentation (crop + flip)</span>
              </label>

              <label className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#131B2E] cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={formData.saveCheckpoints}
                  onChange={(e) => handleChange('saveCheckpoints', e.target.checked)}
                  className="w-4 h-4 rounded bg-[#151E33] border-[#293A60] text-cyan-500 focus:ring-0 focus:ring-offset-0"
                />
                <span className="text-slate-200">Save checkpoints every 10 epochs</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Estimates Panel */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-gradient-to-r from-[#111A30] to-[#0E1528] border border-[#213050] flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-lg bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase text-slate-400">
              Estimated Runtime
            </span>
            <div className="text-xl font-bold font-mono text-white">
              ~42 minutes
            </div>
            <span className="text-[11px] text-slate-400 font-mono">
              Accelerated simulation enabled for demo
            </span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-gradient-to-r from-[#111A30] to-[#0E1528] border border-[#213050] flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-lg bg-indigo-950/80 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
            <HardDrive className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase text-slate-400">
              Estimated GPU Memory
            </span>
            <div className="text-xl font-bold font-mono text-white">
              7.4 GB
            </div>
            <span className="text-[11px] text-slate-400 font-mono">
              Fits well within RTX 4090 24GB VRAM
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Buttons */}
      <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[#1C2842]">
        <button
          onClick={() => navigate('/analysis')}
          className="w-full sm:w-auto px-5 py-3 rounded-xl bg-[#12192D] hover:bg-[#18233E] border border-[#243454] text-slate-300 hover:text-white font-mono text-xs flex items-center justify-center gap-2 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Analysis</span>
        </button>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={handleSave}
            className="flex-1 sm:flex-none px-5 py-3 rounded-xl bg-[#151E33] hover:bg-[#1C2845] border border-[#2B3B60] text-slate-200 hover:text-white font-semibold text-xs flex items-center justify-center gap-2 font-mono transition-colors"
          >
            <Save className="w-4 h-4 text-cyan-400" />
            <span>Save Configuration</span>
          </button>

          <button
            onClick={handleRun}
            className="flex-1 sm:flex-none px-7 py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-sky-500 hover:from-cyan-300 hover:to-sky-400 text-black font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-glow-cyan transition-all hover:scale-[1.02]"
          >
            <Play className="w-4 h-4 fill-black" />
            <span>Run Experiment</span>
          </button>
        </div>
      </div>
    </div>
  );
};
