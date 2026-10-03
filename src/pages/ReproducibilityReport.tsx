import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Download,
  Printer,
  Share2,
  FileCheck,
  CheckCircle2,
  AlertTriangle,
  Info,
  Calendar,
  Layers,
  Database,
  Cpu,
  Sliders,
  Award,
  ArrowLeft,
  FileText,
  ExternalLink,
  Code
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { StatusBadge } from '../components/common/StatusBadge';
import { Modal } from '../components/common/Modal';
import { REPRODUCIBILITY_REPORT_DATA, RESNET_COMPARISON_METRICS } from '../data/mockData';

export const ReproducibilityReport: React.FC = () => {
  const navigate = useNavigate();
  const { currentPaper, addToast } = useApp();
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportFormat, setExportFormat] = useState<'pdf' | 'markdown' | 'json'>('pdf');

  const report = REPRODUCIBILITY_REPORT_DATA;

  const handleDownload = () => {
    setShowExportModal(true);
  };

  const handleConfirmExport = () => {
    setShowExportModal(false);

    if (exportFormat === 'markdown') {
      const mdContent = `# KRATOS 0.1 Reproducibility Report\n\n**Report ID:** ${report.reportId}\n**Date:** ${report.dateGenerated}\n**Paper:** ${currentPaper.title}\n**Status:** ${currentPaper.status}\n**Result Agreement:** 94.0% vs 94.2% (Diff: -0.2%)\n\n## 1. Paper Summary\n${currentPaper.abstract}\n\n## 2. Experimental Setup\nDataset: ${currentPaper.dataset}\nModel Architecture: ${currentPaper.model}\nFramework: ${currentPaper.framework}\nEpochs: ${currentPaper.hyperparameters.epochs}\nBatch Size: ${currentPaper.hyperparameters.batchSize}\nLearning Rate: ${currentPaper.hyperparameters.learningRate}\nOptimizer: ${currentPaper.hyperparameters.optimizer}\n\n## 3. Reported vs Reproduced Metrics\n${RESNET_COMPARISON_METRICS.map(m => `- ${m.name}: Reported ${m.paper} | Reproduced ${m.reproduced} | Delta ${m.difference}`).join('\n')}\n\n## 4. Possible Causes of Difference\n${report.sourcesOfDifference.map(s => `### ${s.title} (Impact: ${s.impact})\n${s.description}`).join('\n\n')}\n`;
      const blob = new Blob([mdContent], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Kratos_Report_${currentPaper.id}.md`;
      a.click();
      URL.revokeObjectURL(url);
      addToast({
        type: 'success',
        title: 'Markdown Exported',
        message: `Saved Kratos_Report_${currentPaper.id}.md`
      });
    } else if (exportFormat === 'json') {
      const jsonData = JSON.stringify({
        metadata: {
          platform: 'Kratos 0.1',
          reportId: report.reportId,
          timestamp: new Date().toISOString()
        },
        paper: currentPaper,
        benchmark: report
      }, null, 2);
      const blob = new Blob([jsonData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Kratos_Report_${currentPaper.id}.json`;
      a.click();
      URL.revokeObjectURL(url);
      addToast({
        type: 'success',
        title: 'JSON Telemetry Exported',
        message: `Saved Kratos_Report_${currentPaper.id}.json`
      });
    } else {
      addToast({
        type: 'success',
        title: 'Report Print/PDF Ready',
        message: 'Opening system print dialog. Select "Save as PDF" to preserve layout.'
      });
      setTimeout(() => {
        window.print();
      }, 500);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* Top action nav */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1C2842]">
        <button
          onClick={() => navigate('/results/comparison')}
          className="inline-flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-cyan-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Comparison</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="px-3.5 py-2 rounded-xl bg-[#12192D] hover:bg-[#18233C] border border-[#233150] text-slate-300 hover:text-white text-xs font-mono flex items-center gap-1.5 transition-colors"
          >
            <Printer className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Print</span>
          </button>
          <button
            onClick={handleDownload}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-400 to-sky-500 hover:from-cyan-300 hover:to-sky-400 text-black font-bold text-xs font-mono flex items-center gap-2 shadow-glow-cyan transition-all hover:scale-[1.02]"
          >
            <Download className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Download Report</span>
          </button>
        </div>
      </div>

      {/* Formal Paper / Report Document Header */}
      <div className="p-8 rounded-2xl bg-[#0D1222] border border-[#212E4A] shadow-2xl space-y-6">
        {/* Document Identifier Banner */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-[#1A253D] text-xs font-mono text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-sm bg-cyan-400"></span>
            <span className="font-bold text-white tracking-wider">KRATOS 0.1 AUDIT SUITE</span>
            <span>•</span>
            <span className="text-cyan-400">ID: {report.reportId}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>Generated: {report.dateGenerated}</span>
          </div>
        </div>

        {/* Title & Status */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase text-slate-400">
              Target Publication
            </span>
            <StatusBadge status="Partially Reproduced" size="sm" />
          </div>

          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            {currentPaper.title}
          </h1>

          <p className="text-xs font-mono text-cyan-300">
            Authors: {currentPaper.authors.join(', ')} • {currentPaper.venue} ({currentPaper.year})
          </p>
        </div>

        {/* Result Agreement Score Highlight Card */}
        <div className="p-5 rounded-xl bg-gradient-to-r from-[#121A2D] to-[#0F1424] border border-[#212F4C] space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[11px] font-mono uppercase text-slate-400 font-semibold">
                Result Agreement
              </span>
              <div className="text-2xl sm:text-3xl font-black text-white font-mono mt-0.5">
                94.0% <span className="text-slate-400 font-normal text-lg">vs</span> 94.2%
              </div>
              <p className="text-xs text-slate-300 font-mono mt-1">
                Difference: <span className="text-cyan-300 font-bold">0.2 percentage points</span> (-0.21% relative margin)
              </p>
            </div>

            <div className="text-right sm:border-l sm:border-[#212F4C] sm:pl-6">
              <span className="text-[10px] font-mono uppercase text-slate-400">Classification</span>
              <div className="text-lg font-bold text-amber-300 font-mono">
                PARTIALLY REPRODUCED
              </div>
              <span className="text-[11px] font-mono text-slate-400">Delta within ±0.5%</span>
            </div>
          </div>

          <div className="pt-2 border-t border-[#1C2842] text-[11px] font-mono text-slate-400 flex items-center gap-2">
            <Info className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
            <span>
              Agreement score reflects numerical convergence under specified test environment. Not an assertion of complete algorithmic equivalence.
            </span>
          </div>
        </div>

        {/* Structured 10 Report Sections */}
        <div className="space-y-6 pt-2 divide-y divide-[#1A253D] text-xs leading-relaxed">
          {/* Section 1: Paper Summary */}
          <section className="pt-6 space-y-2">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-200 font-mono flex items-center gap-2">
              <span className="text-cyan-400">1.</span>
              <span>Paper Summary</span>
            </h2>
            <p className="text-slate-300 bg-[#0A0D17] p-4 rounded-xl border border-[#182236]">
              {currentPaper.abstract}
            </p>
          </section>

          {/* Section 2: Experimental Setup */}
          <section className="pt-6 space-y-2">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-200 font-mono flex items-center gap-2">
              <span className="text-cyan-400">2.</span>
              <span>Experimental Setup</span>
            </h2>
            <p className="text-slate-300">
              The reproduction was executed inside an isolated Docker container with CUDA 12.2 and PyTorch 2.2.1.
              Training accelerated using deterministic algorithms with seed 42. CIFAR-10 raw dataset verified against official MD5 checksums.
            </p>
          </section>

          {/* Section 3 & 4: Dataset and Model */}
          <section className="pt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-200 font-mono flex items-center gap-2">
                <span className="text-cyan-400">3.</span>
                <span>Dataset</span>
              </h2>
              <div className="p-3.5 rounded-xl bg-[#0A0D17] border border-[#182236] font-mono space-y-1">
                <div className="text-slate-200 font-bold">{currentPaper.dataset}</div>
                <div className="text-slate-400 text-[11px]">Training Set: {currentPaper.datasetDetails.trainSamples}</div>
                <div className="text-slate-400 text-[11px]">Validation Set: {currentPaper.datasetDetails.testSamples}</div>
                <div className="text-slate-400 text-[11px]">Resolution: {currentPaper.datasetDetails.inputResolution}</div>
              </div>
            </div>

            <div className="space-y-2">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-200 font-mono flex items-center gap-2">
                <span className="text-cyan-400">4.</span>
                <span>Model Architecture</span>
              </h2>
              <div className="p-3.5 rounded-xl bg-[#0A0D17] border border-[#182236] font-mono space-y-1">
                <div className="text-slate-200 font-bold">{currentPaper.model}</div>
                <div className="text-slate-400 text-[11px]">Parameters: {currentPaper.modelDetails.parameters}</div>
                <div className="text-slate-400 text-[11px]">Architecture: {currentPaper.modelDetails.architecture}</div>
                <div className="text-slate-400 text-[11px]">Framework: {currentPaper.framework}</div>
              </div>
            </div>
          </section>

          {/* Section 5: Hyperparameters */}
          <section className="pt-6 space-y-2">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-200 font-mono flex items-center gap-2">
              <span className="text-cyan-400">5.</span>
              <span>Hyperparameters Extracted & Applied</span>
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-[11px]">
              <div className="p-2.5 rounded-lg bg-[#0A0D17] border border-[#182236]">
                <span className="text-slate-400 text-[10px]">LEARNING RATE</span>
                <p className="text-cyan-300 font-bold">{currentPaper.hyperparameters.learningRate}</p>
              </div>
              <div className="p-2.5 rounded-lg bg-[#0A0D17] border border-[#182236]">
                <span className="text-slate-400 text-[10px]">BATCH SIZE</span>
                <p className="text-slate-200 font-bold">{currentPaper.hyperparameters.batchSize}</p>
              </div>
              <div className="p-2.5 rounded-lg bg-[#0A0D17] border border-[#182236]">
                <span className="text-slate-400 text-[10px]">TOTAL EPOCHS</span>
                <p className="text-slate-200 font-bold">{currentPaper.hyperparameters.epochs}</p>
              </div>
              <div className="p-2.5 rounded-lg bg-[#0A0D17] border border-[#182236]">
                <span className="text-slate-400 text-[10px]">OPTIMIZER</span>
                <p className="text-slate-200 font-bold">{currentPaper.hyperparameters.optimizer}</p>
              </div>
            </div>
          </section>

          {/* Section 6 & 7 & 8: Reported vs Reproduced and Differences */}
          <section className="pt-6 space-y-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-200 font-mono flex items-center gap-2">
              <span className="text-cyan-400">6, 7, 8.</span>
              <span>Reported vs Reproduced Performance</span>
            </h2>
            <div className="rounded-xl border border-[#1C2842] overflow-hidden">
              <table className="w-full text-left font-mono">
                <thead>
                  <tr className="bg-[#12192D] border-b border-[#1C2842] text-[10px] uppercase text-slate-400">
                    <th className="py-2.5 px-3">Metric</th>
                    <th className="py-2.5 px-3">Reported (Paper)</th>
                    <th className="py-2.5 px-3">Reproduced</th>
                    <th className="py-2.5 px-3 text-right">Delta</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#182236] text-[11px]">
                  {RESNET_COMPARISON_METRICS.map((row, i) => (
                    <tr key={i}>
                      <td className="py-2.5 px-3 text-slate-200">{row.name}</td>
                      <td className="py-2.5 px-3 text-slate-400">{row.paper}</td>
                      <td className="py-2.5 px-3 text-cyan-300 font-bold">{row.reproduced}</td>
                      <td className="py-2.5 px-3 text-right text-emerald-400">{row.difference}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Section 9: Possible Causes of Discrepancy */}
          <section className="pt-6 space-y-2">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-200 font-mono flex items-center gap-2">
              <span className="text-cyan-400">9.</span>
              <span>Possible Causes of Discrepancy</span>
            </h2>
            <ul className="space-y-2 text-slate-300 font-mono list-disc list-inside">
              <li>
                <strong className="text-slate-100">Weight initialization variance:</strong> He Normal initialization seeds generate ±0.2% expected variance across CIFAR-10 runs.
              </li>
              <li>
                <strong className="text-slate-100">Framework translation:</strong> Paper benchmark was conducted in Caffe; reproduction leverages PyTorch cuDNN v8 primitives with TF32 enabled.
              </li>
              <li>
                <strong className="text-slate-100">Learning rate decay boundaries:</strong> Step decay at iteration 32k/48k approximated as epochs 80/120.
              </li>
            </ul>
          </section>

          {/* Section 10: Reproduction Notes */}
          <section className="pt-6 space-y-2">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-200 font-mono flex items-center gap-2">
              <span className="text-cyan-400">10.</span>
              <span>Reproduction Notes & Recommendations</span>
            </h2>
            <div className="p-4 rounded-xl bg-[#0A0D17] border border-[#182236] space-y-1.5 text-slate-400 font-mono text-[11px]">
              <p>• The authors' claim of 94.2% top-1 accuracy on CIFAR-10 is reproducible with high confidence.</p>
              <p>• Checkpoints for epoch 80, 120, and 200 preserved in local model registry.</p>
              <p>• Recommended next step: run multi-seed sweep (seeds 42, 100, 2024) to publish 95% confidence intervals.</p>
            </div>
          </section>
        </div>
      </div>

      {/* Export Modal */}
      <Modal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        title="Download Reproducibility Report"
        subtitle="Export standardized audit summary"
      >
        <div className="space-y-4 font-mono text-xs">
          <p className="text-slate-300">
            Select preferred format to export the full empirical audit report for "{currentPaper.title}":
          </p>

          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => setExportFormat('pdf')}
              className={`p-3 rounded-xl border text-center transition-all ${
                exportFormat === 'pdf'
                  ? 'bg-cyan-950 border-cyan-400 text-cyan-300 shadow-glow-cyan'
                  : 'bg-[#12192D] border-[#223150] text-slate-400 hover:text-white'
              }`}
            >
              <FileText className="w-5 h-5 mx-auto mb-1 text-cyan-400" />
              <div className="font-bold">PDF Format</div>
              <div className="text-[10px] text-slate-400 mt-0.5">Formal Publication</div>
            </button>

            <button
              onClick={() => setExportFormat('markdown')}
              className={`p-3 rounded-xl border text-center transition-all ${
                exportFormat === 'markdown'
                  ? 'bg-cyan-950 border-cyan-400 text-cyan-300 shadow-glow-cyan'
                  : 'bg-[#12192D] border-[#223150] text-slate-400 hover:text-white'
              }`}
            >
              <FileCheck className="w-5 h-5 mx-auto mb-1 text-indigo-400" />
              <div className="font-bold">Markdown</div>
              <div className="text-[10px] text-slate-400 mt-0.5">GitHub / Readme</div>
            </button>

            <button
              onClick={() => setExportFormat('json')}
              className={`p-3 rounded-xl border text-center transition-all ${
                exportFormat === 'json'
                  ? 'bg-cyan-950 border-cyan-400 text-cyan-300 shadow-glow-cyan'
                  : 'bg-[#12192D] border-[#223150] text-slate-400 hover:text-white'
              }`}
            >
              <Code className="w-5 h-5 mx-auto mb-1 text-emerald-400" />
              <div className="font-bold">JSON Data</div>
              <div className="text-[10px] text-slate-400 mt-0.5">Raw Telemetry</div>
            </button>
          </div>

          <div className="p-3 rounded-lg bg-[#0A0D17] border border-[#1A253D] text-[11px] text-slate-400">
            ✓ Report export prepared. Includes model weights checksums, hyperparameter spec, and telemetry curves.
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              onClick={() => setShowExportModal(false)}
              className="px-4 py-2 rounded-xl bg-[#141C30] hover:bg-[#1A253E] text-slate-300 text-xs transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmExport}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-400 to-sky-500 hover:from-cyan-300 hover:to-sky-400 text-black font-bold text-xs transition-all"
            >
              Download Export
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
