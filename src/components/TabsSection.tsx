import React, { useState } from 'react';
import { LanguageBreakdown, IssueSummary, CommitActivity, RepoStats, Contributor } from '../types';
import { ChartsView } from './charts/ChartsView';
import { ContributorsView } from './ContributorsView';
import { ReadmeView } from './ReadmeView';
import { BarChart3, Users, FileText } from 'lucide-react';

interface TabsSectionProps {
  languages: LanguageBreakdown;
  issueSummary: IssueSummary;
  commits: CommitActivity[];
  stats: RepoStats;
  contributors: Contributor[];
  readmeContent: string | null;
}

export const TabsSection: React.FC<TabsSectionProps> = ({
  languages,
  issueSummary,
  commits,
  stats,
  contributors,
  readmeContent,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'charts' | 'contributors' | 'readme'>('charts');

  return (
    <div className="w-full mb-8">
      
      {/* Sub Tab Buttons */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-900/80 backdrop-blur-xl border border-slate-800/80 mb-6 max-w-fit">
        <button
          onClick={() => setActiveSubTab('charts')}
          className={`flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-all duration-200 ${
            activeSubTab === 'charts'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Visual Charts</span>
        </button>

        <button
          onClick={() => setActiveSubTab('contributors')}
          className={`flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-all duration-200 ${
            activeSubTab === 'contributors'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Top Contributors</span>
        </button>

        <button
          onClick={() => setActiveSubTab('readme')}
          className={`flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-all duration-200 ${
            activeSubTab === 'readme'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>README</span>
        </button>
      </div>

      {/* Active Tab Panel */}
      <div>
        {activeSubTab === 'charts' && (
          <ChartsView
            languages={languages}
            issueSummary={issueSummary}
            commits={commits}
            stats={stats}
          />
        )}

        {activeSubTab === 'contributors' && (
          <ContributorsView contributors={contributors} />
        )}

        {activeSubTab === 'readme' && (
          <ReadmeView readmeContent={readmeContent} />
        )}
      </div>

    </div>
  );
};
