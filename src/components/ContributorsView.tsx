import React from 'react';
import { Contributor } from '../types';
import { Award, ExternalLink, GitCommit, Users } from 'lucide-react';

interface ContributorsViewProps {
  contributors: Contributor[];
}

export const ContributorsView: React.FC<ContributorsViewProps> = ({ contributors }) => {
  if (!contributors || contributors.length === 0) {
    return (
      <div className="p-12 text-center rounded-2xl bg-slate-900/60 border border-slate-800 text-slate-400">
        <Users className="w-8 h-8 mx-auto mb-2 text-slate-500" />
        <p className="text-sm">No contributor statistics available for this repository.</p>
      </div>
    );
  }

  const maxContribs = contributors[0]?.contributions || 1;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Users className="w-4 h-4 text-indigo-400" />
          <span>Top Contributors ({contributors.length})</span>
        </h3>
        <span className="text-xs text-slate-400">Sorted by commit contribution count</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {contributors.map((contrib, idx) => {
          const isTop3 = idx < 3;
          const percentage = Math.round((contrib.contributions / maxContribs) * 100);

          return (
            <div
              key={contrib.id || contrib.login}
              className="relative overflow-hidden rounded-2xl bg-slate-900/80 backdrop-blur-xl border border-slate-800/80 p-4 shadow-xl hover:border-indigo-500/40 transition-all duration-200 group"
            >
              {isTop3 && (
                <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-bold">
                  <Award className="w-3 h-3" />
                  <span>Top #{idx + 1}</span>
                </div>
              )}

              <div className="flex items-center gap-3 mb-3">
                <img
                  src={contrib.avatarUrl}
                  alt={contrib.login}
                  className="w-12 h-12 rounded-xl border border-slate-700 bg-slate-950 object-cover"
                />
                <div className="min-w-0 flex-1">
                  <a
                    href={contrib.htmlUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-bold text-white hover:text-indigo-400 flex items-center gap-1 truncate group-hover:underline"
                  >
                    <span>{contrib.login}</span>
                    <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                  <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1 mt-0.5">
                    <GitCommit className="w-3 h-3 text-indigo-400" />
                    <span>{contrib.contributions.toLocaleString()} commits</span>
                  </span>
                </div>
              </div>

              {/* Progress bar relative to top maintainer */}
              <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden border border-slate-800">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
                  style={{ width: `${percentage}%` }}
                />
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
};
