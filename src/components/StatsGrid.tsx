import React from 'react';
import { RepoStats } from '../types';
import { Star, GitFork, Eye, AlertCircle } from 'lucide-react';

interface StatsGridProps {
  stats: RepoStats;
}

function formatNumber(num: number): string {
  if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(1) + 'M';
  }
  if (num >= 1_000) {
    return (num / 1_000).toFixed(1) + 'k';
  }
  return num.toLocaleString();
}

export const StatsGrid: React.FC<StatsGridProps> = ({ stats }) => {
  const cards = [
    {
      title: 'Stars',
      value: formatNumber(stats.stars),
      rawNumber: stats.stars,
      icon: Star,
      glowColor: 'from-amber-500/20 to-amber-500/0',
      iconBg: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      borderColor: 'border-amber-500/20 hover:border-amber-500/40',
      badge: 'Stargazers',
    },
    {
      title: 'Forks',
      value: formatNumber(stats.forks),
      rawNumber: stats.forks,
      icon: GitFork,
      glowColor: 'from-purple-500/20 to-purple-500/0',
      iconBg: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
      borderColor: 'border-purple-500/20 hover:border-purple-500/40',
      badge: 'Network Forks',
    },
    {
      title: 'Watchers',
      value: formatNumber(stats.watchers),
      rawNumber: stats.watchers,
      icon: Eye,
      glowColor: 'from-cyan-500/20 to-cyan-500/0',
      iconBg: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
      borderColor: 'border-cyan-500/20 hover:border-cyan-500/40',
      badge: 'Subscribers',
    },
    {
      title: 'Open Issues',
      value: formatNumber(stats.openIssues),
      rawNumber: stats.openIssues,
      icon: AlertCircle,
      glowColor: 'from-rose-500/20 to-rose-500/0',
      iconBg: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
      borderColor: 'border-rose-500/20 hover:border-rose-500/40',
      badge: 'Open Backlog',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.title}
            className={`relative overflow-hidden rounded-2xl bg-slate-900/80 backdrop-blur-xl border ${card.borderColor} p-5 transition-all duration-300 hover:-translate-y-1 group shadow-xl`}
          >
            {/* Soft Radial Glow background */}
            <div className={`absolute -top-12 -right-12 w-32 h-32 rounded-full bg-gradient-to-br ${card.glowColor} blur-2xl opacity-50 group-hover:opacity-100 transition-opacity`} />

            <div className="relative z-10 flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{card.title}</span>
              <div className={`flex items-center justify-center w-9 h-9 rounded-xl border ${card.iconBg}`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>

            <div className="relative z-10">
              <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-1">
                {card.value}
              </div>
              <div className="text-[11px] font-medium text-slate-500">
                {card.badge} ({card.rawNumber.toLocaleString()})
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
