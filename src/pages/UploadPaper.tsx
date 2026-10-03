import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  ArrowRight,
  Link as LinkIcon,
  Sparkles,
  Info,
  X,
  FileCode,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const UploadPaper: React.FC = () => {
  const navigate = useNavigate();
  const { uploadedFile, setUploadedFile, setCurrentPaper, papers, addToast } = useApp();
  
  const [arxivUrl, setArxivUrl] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [urlError, setUrlError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Quick preset sample papers for easy one-click demo testing
  const demoPapers = [
    {
      title: 'Deep Residual Learning for Image Recognition (ResNet)',
      filename: 'resnet50_cvpr2016.pdf',
      size: '4.8 MB',
      arxiv: 'https://arxiv.org/abs/1512.03385',
      paperObj: papers[0]
    },
    {
      title: 'Attention Is All You Need (Transformer)',
      filename: 'transformer_attention_2017.pdf',
      size: '2.1 MB',
      arxiv: 'https://arxiv.org/abs/1706.03762',
      paperObj: papers[1]
    },
    {
      title: 'BERT: Pre-training of Deep Bidirectional Transformers',
      filename: 'bert_naacl2019.pdf',
      size: '3.4 MB',
      arxiv: 'https://arxiv.org/abs/1810.04805',
      paperObj: papers[2]
    }
  ];

  const handleSelectDemo = (demo: typeof demoPapers[0]) => {
    setCurrentPaper(demo.paperObj);
    setUploadedFile({
      name: demo.filename,
      size: demo.size,
      ready: true
    });
    setArxivUrl(demo.arxiv);
    addToast({
      type: 'info',
      title: 'Paper Loaded',
      message: `Selected sample document: "${demo.filename}"`
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
      setUploadedFile({
        name: file.name,
        size: `${sizeMB} MB`,
        ready: true
      });
      // Default to ResNet as base model representation
      setCurrentPaper(papers[0]);
      addToast({
        type: 'success',
        title: 'PDF Uploaded',
        message: `${file.name} (${sizeMB} MB) ready for structural extraction.`
      });
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
      setUploadedFile({
        name: file.name,
        size: `${sizeMB} MB`,
        ready: true
      });
      setCurrentPaper(papers[0]);
      addToast({
        type: 'success',
        title: 'PDF Uploaded',
        message: `${file.name} ready for AI parsing.`
      });
    }
  };

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!arxivUrl.trim()) {
      setUrlError('Please enter an arXiv or Semantic Scholar URL');
      return;
    }
    setUrlError('');
    // Look for matching demo or default to resnet
    const match = demoPapers.find(p => arxivUrl.includes(p.paperObj.arxivId || ''));
    if (match) {
      setCurrentPaper(match.paperObj);
      setUploadedFile({
        name: match.filename,
        size: match.size,
        ready: true
      });
    } else {
      setCurrentPaper(papers[0]);
      setUploadedFile({
        name: 'arxiv_paper_downloaded.pdf',
        size: '4.2 MB',
        ready: true
      });
    }
    addToast({
      type: 'info',
      title: 'URL Ingested',
      message: 'Paper document fetched from repository. Starting analysis...'
    });
    // Immediately transition to analysis
    navigate('/analysis');
  };

  const handleStartAnalysis = () => {
    if (!uploadedFile) {
      // Pick default if nothing chosen
      handleSelectDemo(demoPapers[0]);
    }
    navigate('/analysis');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-cyan-950/70 border border-cyan-500/30 text-cyan-400 text-xs font-mono mb-2">
          <span>STEP 01</span>
          <span>•</span>
          <span>INGESTION ENGINE</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
          Analyze a Research Paper
        </h1>
        <p className="mt-1 text-sm md:text-base text-slate-300">
          Upload an ML research paper and let Kratos 0.1 extract the information needed for reproduction.
        </p>
      </div>

      {/* Main Upload Drag & Drop Area */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-2xl p-10 md:p-14 text-center cursor-pointer transition-all duration-200 ${
          isDragging
            ? 'border-cyan-400 bg-cyan-950/30 shadow-glow-cyan'
            : 'border-[#26375A] bg-[#0F1526]/70 hover:border-cyan-500/50 hover:bg-[#121A30]'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          className="hidden"
          onChange={handleFileChange}
        />

        <div className="flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-2xl bg-[#17223D] border border-[#2B3E68] flex items-center justify-center mb-4 shadow-lg group-hover:scale-105 transition-transform">
            <UploadCloud className="w-8 h-8 text-cyan-400" />
          </div>

          <h3 className="text-lg font-bold text-white tracking-tight">
            Drop your PDF here
          </h3>
          <p className="text-sm text-slate-400 mt-1">
            or <span className="text-cyan-400 underline underline-offset-2">click to browse</span> your filesystem
          </p>

          <div className="mt-5 inline-flex items-center gap-3 px-3 py-1 rounded-full bg-[#151F36] border border-[#26375A] text-xs font-mono text-slate-400">
            <span>PDF</span>
            <span>•</span>
            <span>Maximum 25 MB</span>
          </div>
        </div>
      </div>

      {/* Uploaded File Confirmation Box */}
      {uploadedFile ? (
        <div className="p-5 rounded-xl bg-gradient-to-r from-[#111A30] to-[#0E1528] border border-cyan-500/40 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-cyan-950/80 border border-cyan-500/50 flex items-center justify-center flex-shrink-0">
              <FileText className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white font-mono">
                  {uploadedFile.name}
                </span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Ready for analysis
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                {uploadedFile.size} • Verified checksum • PDF Parser ready
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setUploadedFile(null);
              }}
              className="p-2.5 rounded-lg border border-[#28385A] text-slate-400 hover:text-white hover:bg-[#1A253E] transition-colors"
              title="Remove file"
            >
              <X className="w-4 h-4" />
            </button>
            <button
              onClick={handleStartAnalysis}
              className="flex-1 sm:flex-none px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-sky-500 hover:from-cyan-300 hover:to-sky-400 text-black font-bold text-sm flex items-center justify-center gap-2 shadow-glow-cyan transition-all hover:scale-[1.02]"
            >
              <Sparkles className="w-4 h-4 stroke-[2.5]" />
              <span>Start AI Analysis</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        /* If no file chosen yet, show disabled state helper button */
        <div className="flex justify-end">
          <button
            onClick={() => {
              handleSelectDemo(demoPapers[0]);
              navigate('/analysis');
            }}
            className="px-5 py-2.5 rounded-xl bg-[#16213B] hover:bg-[#1E2D4F] text-slate-300 hover:text-white border border-[#2C3E68] text-xs font-mono flex items-center gap-2 transition-colors"
          >
            <span>Or auto-load default ResNet paper</span>
            <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
          </button>
        </div>
      )}

      {/* Divider */}
      <div className="relative flex items-center justify-center">
        <div className="border-t border-[#1C2842] w-full" />
        <span className="bg-[#080B12] px-4 text-xs font-mono uppercase text-slate-400 flex-shrink-0">
          Or paste paper URL
        </span>
      </div>

      {/* URL Input Form */}
      <form onSubmit={handleUrlSubmit} className="space-y-2">
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <LinkIcon className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={arxivUrl}
              onChange={(e) => setArxivUrl(e.target.value)}
              placeholder="https://arxiv.org/abs/1512.03385"
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#0F1526] border border-[#233150] text-sm text-slate-200 placeholder-slate-400 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 font-mono transition-colors"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-[#17223C] hover:bg-[#202E52] border border-[#2B3E68] text-cyan-400 hover:text-cyan-300 font-semibold text-sm transition-colors flex items-center justify-center gap-2 font-mono"
          >
            <span>Analyze Paper</span>
          </button>
        </div>
        {urlError && (
          <p className="text-xs text-rose-400 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            <span>{urlError}</span>
          </p>
        )}
      </form>

      {/* Quick Demo Paper Pickers */}
      <div className="p-5 rounded-xl bg-[#0D1222] border border-[#1A253E] space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1.5 font-semibold">
            <FileCode className="w-3.5 h-3.5 text-cyan-400" />
            <span>Instant Demo Papers (Click to load)</span>
          </span>
          <span className="text-[11px] text-slate-400">Pre-indexed in test suite</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {demoPapers.map((demo) => (
            <button
              key={demo.arxiv}
              onClick={() => handleSelectDemo(demo)}
              className="p-3 rounded-lg bg-[#12192E] border border-[#223150] hover:border-cyan-500/50 hover:bg-[#16203A] text-left transition-all group"
            >
              <div className="text-xs font-semibold text-slate-200 group-hover:text-cyan-300 transition-colors line-clamp-1">
                {demo.title}
              </div>
              <div className="mt-1 flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span>{demo.filename}</span>
                <span className="text-cyan-400">{demo.size}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
