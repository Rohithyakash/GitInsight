import React from 'react';
import { RepoInfo, IssueSummary } from '../types';
import { Scale, GitBranch, Calendar, Clock, HardDrive, GitPullRequest } from 'lucide-react';

interface AdditionalInfoProps {
  info: RepoInfo;
  issueSummary?: IssueSummary;
}

function formatDate(dateStr: string): string {
  if (!dateStr) return 'N/A';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatSize(sizeKb: number): string {
  if (sizeKb >= 1024 * 1024) {
    return (sizeKb / (1024 * 1024)).toFixed(1) + ' GB';
  }
  if (sizeKb >= 1024) {
    return (sizeKb / 1024).toFixed(1) + ' MB';
  }
  return sizeKb + ' KB';
}

export const AdditionalInfo: React.FC<AdditionalInfoProps> = ({ info, issueSummary }) => {
  const items = [
    {
      label: 'License',
      value: info.license || 'No License',
      icon: Scale,
      color: 'text-indigo-400',
    },
    {
      label: 'Default Branch',
      value: info.defaultBranch,
      icon: GitBranch,
      color: 'text-emerald-400',
    },
    {
      label: 'Created Date',
      value: formatDate(info.createdAt),
      icon: Calendar,
      color: 'text-blue-400',
    },
    {
      label: 'Last Pushed',
      value: formatDate(info.pushedAt),
      icon: Clock,
      color: 'text-purple-400',
    },
    {
      label: 'Codebase Size',
      value: formatSize(info.stats.sizeKb),
      icon: HardDrive,
      color: 'text-amber-400',
    },
    {
      label: 'Est. Open PRs',
      value: issueSummary ? issueSummary.openPRsCount.toLocaleString() : 'N/A',
      icon: GitPullRequest,
      color: 'text-pink-400',
    },
  ];

  return (
    <div className="w-full rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 p-4 sm:p-5 mb-8 shadow-xl">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-950/40 border border-slate-800/40">
              <div className={`p-2 rounded-lg bg-slate-900 ${item.color}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">{item.label}</div>
                <div className="text-xs font-bold text-slate-200 truncate">{item.value}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
