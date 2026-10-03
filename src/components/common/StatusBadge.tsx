import React from 'react';
import { ReproductionStatus } from '../../types';
import { CheckCircle2, AlertTriangle, Clock, RefreshCw, XCircle } from 'lucide-react';

interface StatusBadgeProps {
  status: ReproductionStatus;
  size?: 'sm' | 'md' | 'lg';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs font-medium',
    lg: 'px-3 py-1.5 text-sm font-semibold',
  };

  switch (status) {
    case 'Reproduced':
      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 ${sizeClasses[size]}`}
        >
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          <span>Reproduced</span>
        </span>
      );
    case 'Partially Reproduced':
      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30 ${sizeClasses[size]}`}
        >
          <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
          <span>Partially Reproduced</span>
        </span>
      );
    case 'Analysis Complete':
      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 ${sizeClasses[size]}`}
        >
          <Clock className="w-3.5 h-3.5 text-cyan-400" />
          <span>Analysis Complete</span>
        </span>
      );
    case 'Running':
      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded-full bg-sky-500/15 text-sky-300 border border-sky-500/40 animate-pulse ${sizeClasses[size]}`}
        >
          <RefreshCw className="w-3.5 h-3.5 text-sky-400 animate-spin" />
          <span>Running</span>
        </span>
      );
    case 'Failed':
      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/30 ${sizeClasses[size]}`}
        >
          <XCircle className="w-3.5 h-3.5 text-rose-400" />
          <span>Failed</span>
        </span>
      );
    default:
      return null;
  }
};
