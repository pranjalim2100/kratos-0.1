import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CheckCircle2,
  Circle,
  Loader2,
  Sparkles,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  FileText,
  Database,
  Cpu,
  Sliders,
  Award,
  Layers,
  Search,
  ExternalLink,
  BookOpen,
  Info,
  RefreshCw,
  GitFork
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const PaperAnalysis: React.FC = () => {
  const navigate = useNavigate();
  const { currentPaper, addToast } = useApp();

  const [stepIndex, setStepIndex] = useState(0);
  const [isAnalysisComplete, setIsAnalysisComplete] = useState(false);
  const [showEvidence, setShowEvidence] = useState(true);

  const analysisSteps = [
    { label: 'Document uploaded and converted to semantic chunks', id: 'step-1' },
    { label: 'Paper structure identified (Abstract, Methods, Experiments, Tables)', id: 'step-2' },
    { label: 'Methodology extracted & parsed', id: 'step-3' },
    { label: 'Dataset identified: CIFAR-10 (50k train / 10k test)', id: 'step-4' },
    { label: 'Model architecture identified: ResNet-50 (Residual conv)', id: 'step-5' },
    { label: 'Hyperparameters extracted (SGD, lr=0.1, bs=128, epochs=200)', id: 'step-6' },
    { label: 'Searching for official and community implementations', id: 'step-7' },
    { label: 'Building containerized experiment specification', id: 'step-8' },
  ];

  useEffect(() => {
    // Progress through analysis steps with realistic timing
    setStepIndex(0);
    setIsAnalysisComplete(false);

    const stepInterval = setInterval(() => {
      setStepIndex((prev) => {
        if (prev < analysisSteps.length - 1) {
          return prev + 1;
        } else {
          clearInterval(stepInterval);
          setIsAnalysisComplete(true);
          return prev + 1;
        }
      });
    }, 700);

    return () => clearInterval(stepInterval);
  }, [currentPaper]);

  const handleRestartAnalysis = () => {
    setStepIndex(0);
    setIsAnalysisComplete(false);
    addToast({
      type: 'info',
      title: 'Re-analyzing Paper',
      message: 'Running multi-pass extraction on PDF structure.'
    });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-cyan-950/70 border border-cyan-500/30 text-cyan-400 text-xs font-mono mb-2">
            <span>STEP 02</span>
            <span>•</span>
            <span>STRUCTURAL PARSING</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight flex items-center gap-3">
            <span>Analyzing Paper</span>
            {isAnalysisComplete ? (
              <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-medium">
                Analysis Complete
              </span>
            ) : (
              <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 font-medium flex items-center gap-1.5">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-cyan-400" />
                Processing
              </span>
            )}
          </h1>
          <p className="mt-1 text-sm font-mono text-cyan-300">
            "{currentPaper.title}"
          </p>
        </div>

        {isAnalysisComplete && (
          <div className="flex items-center gap-3">
            <button
              onClick={handleRestartAnalysis}
              className="p-2.5 rounded-xl bg-[#12192B] border border-[#223150] text-slate-400 hover:text-slate-200 transition-colors"
              title="Re-run analysis scan"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigate('/experiment/config')}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-sky-500 hover:from-cyan-300 hover:to-sky-400 text-black font-bold text-sm flex items-center gap-2 shadow-glow-cyan transition-all hover:scale-[1.02]"
            >
              <span>Create Reproduction Experiment</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Progress Timeline Checklist */}
      <div className="p-6 rounded-2xl bg-[#0F1424] border border-[#1E2B46] shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#1A253D]">
          <span className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>AI Extraction Pipeline</span>
          </span>
          <span className="text-xs font-mono text-cyan-400">
            {Math.min(stepIndex, analysisSteps.length)} / {analysisSteps.length} stages
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {analysisSteps.map((step, idx) => {
            const isDone = idx < stepIndex;
            const isCurrent = idx === stepIndex && !isAnalysisComplete;

            return (
              <div
                key={step.id}
                className={`p-3 rounded-xl border flex items-center gap-3 transition-all duration-200 ${
                  isDone
                    ? 'bg-[#121A30]/60 border-emerald-500/25 text-slate-200'
                    : isCurrent
                    ? 'bg-cyan-950/30 border-cyan-400/50 text-cyan-300 shadow-glow-cyan'
                    : 'bg-[#0B0F1B]/40 border-[#1A243A] text-slate-400'
                }`}
              >
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                ) : isCurrent ? (
                  <Loader2 className="w-4 h-4 text-cyan-400 animate-spin flex-shrink-0" />
                ) : (
                  <Circle className="w-4 h-4 text-slate-400 flex-shrink-0" />
                )}
                <span className="text-xs font-mono tracking-tight">
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Structured Analysis Results (reveals or completes) */}
      <div
        className={`space-y-6 transition-all duration-500 ${
          isAnalysisComplete
            ? 'opacity-100 translate-y-0'
            : 'opacity-70 pointer-events-none'
        }`}
      >
        {/* Extracted Specifications Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Card 1: Paper Information */}
          <div className="p-5 rounded-xl bg-[#0F1424] border border-[#1E2B46] space-y-3">
            <div className="flex items-center justify-between text-xs font-mono uppercase text-slate-400 font-semibold">
              <span className="flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-cyan-400" />
                <span>Paper Information</span>
              </span>
              <span className="text-[10px] text-cyan-400 font-mono">CVPR 2016</span>
            </div>
            <div className="space-y-2 text-xs">
              <div>
                <span className="text-slate-400 text-[11px]">TITLE</span>
                <p className="font-semibold text-slate-100 text-sm leading-snug">
                  {currentPaper.title}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-1 border-t border-[#18233C]">
                <div>
                  <span className="text-slate-400 text-[10px]">AUTHORS</span>
                  <p className="text-slate-200 font-mono">Kaiming He et al.</p>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px]">YEAR / VENUE</span>
                  <p className="text-slate-200 font-mono">{currentPaper.year} • {currentPaper.venue.split(' ')[0]}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Dataset */}
          <div className="p-5 rounded-xl bg-[#0F1424] border border-[#1E2B46] space-y-3">
            <div className="flex items-center justify-between text-xs font-mono uppercase text-slate-400 font-semibold">
              <span className="flex items-center gap-1.5">
                <Database className="w-4 h-4 text-indigo-400" />
                <span>Dataset</span>
              </span>
              <span className="text-[10px] text-emerald-400 font-mono">VERIFIED</span>
            </div>
            <div className="space-y-2 text-xs font-mono">
              <div>
                <span className="text-slate-400 text-[10px]">IDENTIFIED DATASET</span>
                <p className="text-base font-bold text-white">
                  {currentPaper.dataset}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-1 border-t border-[#18233C]">
                <div>
                  <span className="text-slate-400 text-[10px]">TRAIN SAMPLES</span>
                  <p className="text-slate-200">{currentPaper.datasetDetails.trainSamples}</p>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px]">TEST SAMPLES</span>
                  <p className="text-slate-200">{currentPaper.datasetDetails.testSamples}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Model & Task */}
          <div className="p-5 rounded-xl bg-[#0F1424] border border-[#1E2B46] space-y-3">
            <div className="flex items-center justify-between text-xs font-mono uppercase text-slate-400 font-semibold">
              <span className="flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-sky-400" />
                <span>Model & Task</span>
              </span>
              <span className="text-[10px] text-cyan-400 font-mono">25.6M PARAMS</span>
            </div>
            <div className="space-y-2 text-xs font-mono">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-slate-400 text-[10px]">MODEL</span>
                  <p className="text-sm font-bold text-white">{currentPaper.model}</p>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px]">FRAMEWORK</span>
                  <p className="text-sm text-cyan-300">{currentPaper.framework}</p>
                </div>
              </div>
              <div className="pt-1 border-t border-[#18233C]">
                <span className="text-slate-400 text-[10px]">LEARNING TASK</span>
                <p className="text-slate-200">{currentPaper.task}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Hyperparameters & Evaluation Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Hyperparameters */}
          <div className="p-5 rounded-xl bg-[#0F1424] border border-[#1E2B46] space-y-3">
            <div className="flex items-center justify-between text-xs font-mono uppercase text-slate-400 font-semibold">
              <span className="flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-amber-400" />
                <span>Extracted Hyperparameters</span>
              </span>
              <span className="text-[10px] font-mono text-slate-400">Table 4 & Sec 4.2</span>
            </div>

            <div className="grid grid-cols-3 gap-2.5 text-xs font-mono">
              <div className="p-2.5 rounded-lg bg-[#12192C] border border-[#1E2A44]">
                <div className="text-[10px] text-slate-400">LEARNING RATE</div>
                <div className="text-sm font-bold text-cyan-300 mt-0.5">
                  {currentPaper.hyperparameters.learningRate}
                </div>
              </div>
              <div className="p-2.5 rounded-lg bg-[#12192C] border border-[#1E2A44]">
                <div className="text-[10px] text-slate-400">BATCH SIZE</div>
                <div className="text-sm font-bold text-slate-200 mt-0.5">
                  {currentPaper.hyperparameters.batchSize}
                </div>
              </div>
              <div className="p-2.5 rounded-lg bg-[#12192C] border border-[#1E2A44]">
                <div className="text-[10px] text-slate-400">EPOCHS</div>
                <div className="text-sm font-bold text-slate-200 mt-0.5">
                  {currentPaper.hyperparameters.epochs}
                </div>
              </div>
              <div className="p-2.5 rounded-lg bg-[#12192C] border border-[#1E2A44]">
                <div className="text-[10px] text-slate-400">OPTIMIZER</div>
                <div className="text-sm font-bold text-slate-200 mt-0.5">
                  {currentPaper.hyperparameters.optimizer}
                </div>
              </div>
              <div className="p-2.5 rounded-lg bg-[#12192C] border border-[#1E2A44]">
                <div className="text-[10px] text-slate-400">MOMENTUM</div>
                <div className="text-sm font-bold text-slate-200 mt-0.5">
                  {currentPaper.hyperparameters.momentum || 0.9}
                </div>
              </div>
              <div className="p-2.5 rounded-lg bg-[#12192C] border border-[#1E2A44]">
                <div className="text-[10px] text-slate-400">WEIGHT DECAY</div>
                <div className="text-sm font-bold text-slate-200 mt-0.5">
                  {currentPaper.hyperparameters.weightDecay || 0.0001}
                </div>
              </div>
            </div>
          </div>

          {/* Evaluation Target Metric */}
          <div className="p-5 rounded-xl bg-[#0F1424] border border-[#1E2B46] space-y-3 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs font-mono uppercase text-slate-400 font-semibold mb-3">
                <span className="flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-emerald-400" />
                  <span>Evaluation Benchmark</span>
                </span>
                <span className="text-[10px] text-cyan-400 font-mono">PRIMARY TARGET</span>
              </div>

              <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/30 to-[#121A2E] border border-emerald-500/30 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-mono text-slate-400 uppercase">
                    Primary Metric
                  </span>
                  <div className="text-lg font-bold text-white mt-0.5">
                    {currentPaper.primaryMetric}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[11px] font-mono text-emerald-400 uppercase">
                    Reported Result
                  </span>
                  <div className="text-3xl font-extrabold text-emerald-400 font-mono">
                    {currentPaper.reportedResult}{currentPaper.unit}
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-2 text-xs font-mono text-slate-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Reference code implementation matched on GitHub PyTorch models</span>
            </div>
          </div>
        </div>

        {/* AI-Extracted Methodology Section */}
        <div className="p-6 rounded-2xl bg-[#0F1424] border border-[#1E2B46] space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200 font-mono flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-cyan-400" />
              <span>AI-Extracted Methodology</span>
            </h3>
            <span className="text-[11px] font-mono text-slate-400">
              Synthesized from Sections 3.4 & 4.2
            </span>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed bg-[#131A2D] p-4 rounded-xl border border-[#212E4A]">
            {currentPaper.methodology}
          </p>
        </div>

        {/* Expandable Section: "How did AI extract this?" */}
        <div className="rounded-2xl bg-[#0F1424] border border-[#1E2B46] overflow-hidden">
          <button
            onClick={() => setShowEvidence(!showEvidence)}
            className="w-full px-6 py-4 flex items-center justify-between bg-[#12192D] hover:bg-[#151F36] transition-colors text-left"
          >
            <div className="flex items-center gap-2.5">
              <Search className="w-4 h-4 text-cyan-400" />
              <span className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                How did AI extract this?
              </span>
              <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800">
                {currentPaper.evidence.length} Evidence Snippets
              </span>
            </div>
            {showEvidence ? (
              <ChevronUp className="w-4 h-4 text-slate-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-slate-400" />
            )}
          </button>

          {showEvidence && (
            <div className="p-6 space-y-3 divide-y divide-[#1B263E]">
              {currentPaper.evidence.map((ev, i) => (
                <div key={i} className="pt-3 first:pt-0 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-cyan-300 font-mono">
                      {ev.claim}
                    </span>
                    <div className="flex items-center gap-2 font-mono text-[11px] text-slate-400">
                      <span>{ev.section}</span>
                      <span>•</span>
                      <span>Page {ev.pageNumber}</span>
                      <span className="px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px]">
                        {(ev.confidence * 100).toFixed(0)}% confidence
                      </span>
                    </div>
                  </div>
                  <blockquote className="p-3 rounded-lg bg-[#0A0D17] border-l-2 border-cyan-400 text-xs text-slate-300 italic font-serif leading-relaxed">
                    "{ev.quote}"
                  </blockquote>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bottom CTA Action Bar */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[#1C2842]">
          <div className="text-xs font-mono text-slate-400 flex items-center gap-2">
            <Info className="w-4 h-4 text-cyan-400 flex-shrink-0" />
            <span>Ready to convert extracted specs into executable training run.</span>
          </div>

          <button
            onClick={() => navigate('/experiment/config')}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan-400 to-sky-500 hover:from-cyan-300 hover:to-sky-400 text-black font-extrabold text-sm flex items-center justify-center gap-2.5 shadow-glow-cyan transition-all hover:scale-[1.02]"
          >
            <span>Create Reproduction Experiment</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
