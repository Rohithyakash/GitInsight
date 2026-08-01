import React from 'react';
import { RepoInfo } from '../types';
import { ExternalLink, Download, Globe, Tag, Sparkles } from 'lucide-react';

interface RepoOverviewProps {
  info: RepoInfo;
  onOpenExport: () => void;
}

export const RepoOverview: React.FC<RepoOverviewProps> = ({ info, onOpenExport }) => {
  return (
    <div className="w-full rounded-2xl bg-slate-900/80 backdrop-blur-xl border border-slate-800/80 p-6 shadow-2xl shadow-indigo-950/20 mb-6">
      
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        
        {/* Main Repo Info */}
        <div className="space-y-3 max-w-3xl">
          
          <div className="flex items-center gap-3">
            {/* Owner Avatar or Badge */}
            <img
              src={`https://github.com/${info.owner}.png`}
              alt={info.owner}
              className="w-12 h-12 rounded-xl border border-slate-700/80 bg-slate-950"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-semibold text-slate-400">{info.owner} /</span>
                <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">{info.name}</h2>
                {info.visibility && (
                  <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                    {info.visibility}
                  </span>
                )}
                {info.fork && (
                  <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">
                    Fork
                  </span>
                )}
              </div>
              {info.homepage && (
                <a
                  href={info.homepage.startsWith('http') ? info.homepage : `https://${info.homepage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 hover:underline mt-0.5"
                >
                  <Globe className="w-3 h-3" />
                  <span>{info.homepage}</span>
                </a>
              )}
            </div>
          </div>

          {/* Description */}
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            {info.description || 'No description provided for this repository.'}
          </p>

          {/* Topic Tags */}
          {info.topics && info.topics.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <Tag className="w-3.5 h-3.5 text-slate-500 mr-1" />
              {info.topics.slice(0, 10).map((topic) => (
                <span
                  key={topic}
                  className="px-2.5 py-1 text-xs font-medium rounded-lg bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 hover:bg-indigo-500/20 transition-colors cursor-default"
                >
                  #{topic}
                </span>
              ))}
            </div>
          )}

        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 shrink-0 self-start md:self-auto">
          
          <button
            onClick={onOpenExport}
            className="flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 rounded-xl transition-all shadow-md"
          >
            <Download className="w-4 h-4 text-indigo-400" />
            <span>Export Report</span>
          </button>

          <a
            href={info.htmlUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-xl shadow-lg shadow-indigo-600/25 transition-all"
          >
            <span>GitHub</span>
            <ExternalLink className="w-4 h-4" />
          </a>

        </div>

      </div>

    </div>
  );
};
