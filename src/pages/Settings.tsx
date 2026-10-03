import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  Cpu,
  Brain,
  Key,
  Shield,
  Bell,
  Save,
  CheckCircle2,
  Sliders,
  HardDrive
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Settings: React.FC = () => {
  const { addToast } = useApp();

  const [computeTarget, setComputeTarget] = useState('local');
  const [modelExtractor, setModelExtractor] = useState('gemini-1.5-pro');
  const [tolerance, setTolerance] = useState(1.0);
  const [hfToken, setHfToken] = useState('hf_••••••••••••••••••••••••••••');
  const [autoSaveCheckpoints, setAutoSaveCheckpoints] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(false);

  const handleSaveSettings = () => {
    addToast({
      type: 'success',
      title: 'Settings Saved',
      message: 'Platform configuration updated successfully.'
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12 font-mono">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight font-sans">
          Settings & Infrastructure
        </h1>
        <p className="mt-1 text-sm text-slate-300 font-sans">
          Manage hardware accelerators, AI extraction models, and verification tolerances.
        </p>
      </div>

      <div className="space-y-6">
        {/* Section 1: Compute */}
        <div className="p-6 rounded-2xl bg-[#0F1424] border border-[#1E2B46] space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#1A253D]">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-white">
              Execution Hardware & Acceleration
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <label
              onClick={() => setComputeTarget('local')}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                computeTarget === 'local'
                  ? 'bg-cyan-950/40 border-cyan-400 text-white shadow-glow-cyan'
                  : 'bg-[#12192D] border-[#223150] text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold">Local Workstation</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
              </div>
              <div className="text-[11px] text-slate-300">NVIDIA RTX 4090 (24GB)</div>
              <div className="text-[10px] text-cyan-400 mt-1">CUDA 12.2 • cuDNN 8.9</div>
            </label>

            <label
              onClick={() => setComputeTarget('cloud-a100')}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                computeTarget === 'cloud-a100'
                  ? 'bg-cyan-950/40 border-cyan-400 text-white shadow-glow-cyan'
                  : 'bg-[#12192D] border-[#223150] text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold">Cloud Cluster (A100)</span>
                <span className="w-2 h-2 rounded-full bg-slate-500" />
              </div>
              <div className="text-[11px] text-slate-300">4x NVIDIA A100 (80GB SXM4)</div>
              <div className="text-[10px] text-slate-400 mt-1">GCP us-central1</div>
            </label>

            <label
              onClick={() => setComputeTarget('serverless')}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                computeTarget === 'serverless'
                  ? 'bg-cyan-950/40 border-cyan-400 text-white shadow-glow-cyan'
                  : 'bg-[#12192D] border-[#223150] text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold">Serverless RunPod</span>
                <span className="w-2 h-2 rounded-full bg-slate-500" />
              </div>
              <div className="text-[11px] text-slate-300">On-demand spot container</div>
              <div className="text-[10px] text-slate-400 mt-1">Automated spin-down</div>
            </label>
          </div>
        </div>

        {/* Section 2: AI Extraction Model */}
        <div className="p-6 rounded-2xl bg-[#0F1424] border border-[#1E2B46] space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#1A253D]">
            <Brain className="w-4 h-4 text-indigo-400" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-white">
              AI Paper Analysis Engine
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-400 uppercase text-[10px] mb-1.5">
                Foundation Model for Extraction
              </label>
              <select
                value={modelExtractor}
                onChange={(e) => setModelExtractor(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-[#12192D] border border-[#233150] text-slate-200 focus:outline-none focus:border-cyan-400"
              >
                <option value="gemini-1.5-pro">Google Gemini 1.5 Pro (2M Context window)</option>
                <option value="claude-3-5-sonnet">Anthropic Claude 3.5 Sonnet</option>
                <option value="gpt-4o">OpenAI GPT-4o Multi-Modal</option>
                <option value="llama-3-70b">Meta Llama 3 70B (Self-hosted)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 uppercase text-[10px] mb-1.5">
                Reproduction Delta Threshold (Tolerance %)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="0.1"
                  max="5.0"
                  step="0.1"
                  value={tolerance}
                  onChange={(e) => setTolerance(parseFloat(e.target.value))}
                  className="flex-1 accent-cyan-400"
                />
                <span className="w-16 text-center font-bold text-cyan-300 py-1 rounded bg-[#12192D] border border-[#233150]">
                  ±{tolerance}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Credentials */}
        <div className="p-6 rounded-2xl bg-[#0F1424] border border-[#1E2B46] space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#1A253D]">
            <Key className="w-4 h-4 text-emerald-400" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-white">
              Dataset & Model Registry Access
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-400 uppercase text-[10px] mb-1.5">
                Hugging Face Access Token
              </label>
              <input
                type="password"
                value={hfToken}
                onChange={(e) => setHfToken(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-[#12192D] border border-[#233150] text-slate-200 focus:outline-none focus:border-cyan-400"
              />
            </div>
            <div>
              <label className="block text-slate-400 uppercase text-[10px] mb-1.5">
                GitHub Personal Access Token (Code Cloning)
              </label>
              <input
                type="password"
                defaultValue="ghp_••••••••••••••••••••••••••••"
                className="w-full px-3 py-2.5 rounded-xl bg-[#12192D] border border-[#233150] text-slate-200 focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>
        </div>

        {/* Bottom Save Action */}
        <div className="flex justify-end">
          <button
            onClick={handleSaveSettings}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-sky-500 hover:from-cyan-300 hover:to-sky-400 text-black font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-glow-cyan transition-all hover:scale-[1.02]"
          >
            <Save className="w-4 h-4 stroke-[2.5]" />
            <span>Save Preferences</span>
          </button>
        </div>
      </div>
    </div>
  );
};
