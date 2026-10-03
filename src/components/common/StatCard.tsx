import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  subValue?: string;
  icon: LucideIcon;
  trend?: string;
  trendType?: 'positive' | 'neutral' | 'warning';
  accentColor?: 'cyan' | 'emerald' | 'amber' | 'indigo';
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  subValue,
  icon: Icon,
  trend,
  trendType = 'positive',
  accentColor = 'cyan',
}) => {
  const accentClasses = {
    cyan: 'border-cyan-500/20 hover:border-cyan-500/40 text-cyan-400 bg-cyan-950/20',
    emerald: 'border-emerald-500/20 hover:border-emerald-500/40 text-emerald-400 bg-emerald-950/20',
    amber: 'border-amber-500/20 hover:border-amber-500/40 text-amber-400 bg-amber-950/20',
    indigo: 'border-indigo-500/20 hover:border-indigo-500/40 text-indigo-400 bg-indigo-950/20',
  };

  const trendColors = {
    positive: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    neutral: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
    warning: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  };

  return (
    <div className="relative p-5 rounded-xl bg-[#111728] border border-[#212E4A] hover:border-[#32456E] transition-all duration-200 group">
      <div className="flex items-start justify-between">
        <div>
          <span className="text-xs font-mono font-medium uppercase tracking-wider text-slate-400">
            {label}
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white tracking-tight font-mono">
              {value}
            </span>
            {subValue && (
              <span className="text-xs text-slate-400 font-mono">
                {subValue}
              </span>
            )}
          </div>
        </div>
        <div className={`p-2.5 rounded-lg border ${accentClasses[accentColor]} transition-transform group-hover:scale-105`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      {trend && (
        <div className="mt-3 flex items-center gap-2">
          <span className={`text-[11px] font-mono px-2 py-0.5 rounded border ${trendColors[trendType]}`}>
            {trend}
          </span>
          <span className="text-[11px] text-slate-400">vs benchmark dataset</span>
        </div>
      )}
    </div>
  );
};
